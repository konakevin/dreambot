#!/usr/bin/env node

/**
 * nightly-dreams.js — Generate one dream per eligible user.
 *
 * Thin orchestrator that calls the generate-dream Edge Function for each user.
 * The Edge Function handles all prompt construction (assembleScene, location anchoring,
 * object handling, medium/vibe resolution, Sonnet brief, Replicate calls, persistence).
 * This script handles: auth, batch orchestration, bot messages, wish handling.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx ANTHROPIC_API_KEY=xxx node scripts/nightly-dreams.js
 *
 * Options:
 *   --max-budget <cents>   Stop after spending this much (default: 500 = $5)
 *   --batch-size <n>       Process n users in parallel (default: 5)
 *   --dry-run              Print eligible users but don't generate
 */

const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

// ── Config ──────────────────────────────────────────────────────────────────

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
function getKey(name) {
  return process.env[name] || envFile[name];
}

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const ANTHROPIC_KEY = getKey('ANTHROPIC_API_KEY');
const COST_PER_IMAGE_CENTS = 3;

const args = process.argv.slice(2);
const MAX_BUDGET_CENTS = parseInt(
  args.find((_, i, a) => a[i - 1] === '--max-budget') ?? '500',
  10
);
const BATCH_SIZE = parseInt(args.find((_, i, a) => a[i - 1] === '--batch-size') ?? '5', 10);
const DRY_RUN = args.includes('--dry-run');

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null;

// ── Auth ─────────────────────────────────────────────────────────────────────

async function getJwtForUser(email) {
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (linkErr) throw new Error(`Auth link failed for ${email}: ${linkErr.message}`);
  const { data: otpData, error: otpErr } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (otpErr || !otpData.session) throw new Error(`OTP verify failed for ${email}: ${otpErr?.message}`);
  return otpData.session.access_token;
}

// ── Edge Function Call ───────────────────────────────────────────────────────

async function callNightlyEdgeFunction(jwt, vibeProfile, dreamWish) {
  const body = {
    mode: 'flux-dev',
    vibe_profile: vibeProfile,
  };
  if (dreamWish) body.dream_wish = dreamWish;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const isNsfw =
      data.error && (data.error.includes('NSFW') || data.error.includes('safety'));
    return { error: data.error || `HTTP ${res.status}`, isNsfw };
  }
  return {
    upload_id: data.upload_id,
    image_url: data.image_url,
    prompt_used: data.prompt_used,
    resolved_medium: data.resolved_medium,
    resolved_vibe: data.resolved_vibe,
  };
}

// ── Bot Message ──────────────────────────────────────────────────────────────

async function generateBotMessage(userId, promptUsed, wish) {
  if (!anthropic) return null;
  try {
    const { data: recentDreams } = await sb
      .from('uploads')
      .select('ai_prompt, from_wish')
      .eq('user_id', userId)
      .eq('is_ai_generated', true)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentContext = (recentDreams ?? [])
      .map((d) => d.ai_prompt?.slice(0, 80))
      .filter(Boolean);
    const pastWishes = (recentDreams ?? []).map((d) => d.from_wish).filter(Boolean);

    let memoryBlock = '';
    if (recentContext.length > 0)
      memoryBlock += `\nOPTIONAL CONTEXT (reference ONLY if genuinely interesting, otherwise ignore):\n- Recent dreams: ${recentContext.join(' | ')}`;
    if (pastWishes.length > 0) memoryBlock += `\n- Past wishes: ${pastWishes.join(', ')}`;
    if (wish) memoryBlock += `\n- Tonight's wish: "${wish}"`;

    const msgRes = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 60,
      messages: [
        {
          role: 'user',
          content: `You are a Dream Bot — a tiny creative spirit living in someone's phone, making dreams nightly. Playful, warm, a little weird. You love your human.

Tonight's dream prompt: "${promptUsed.slice(0, 200)}"

Write ONE short reaction to making this dream. 8-15 words max.

CRITICAL RULES:
- NEVER start with "Okay so" or "Not gonna lie" or "Honestly"
- NEVER use the phrases "hit different", "chef's kiss", "you're welcome", "no regrets", "trust the process"
- Every message must have a DIFFERENT opening word/structure
- Reference ONE specific thing from the prompt — a creature, place, color, or vibe
- React to the creative choice, don't describe the image
- No emojis. Max one exclamation mark.
${memoryBlock}

Output ONLY the message, nothing else.`,
        },
      ],
    });

    const text = msgRes.content?.[0]?.text?.trim() ?? '';
    if (text.length >= 5 && text.length <= 200) return text;
    return null;
  } catch {
    return null;
  }
}

// ── Per-User Dream Generation ────────────────────────────────────────────────

async function processDream(user) {
  const userId = user.user_id;
  const email = user.users.email;
  const recipe = user.recipe;
  const wish = user.dream_wish;

  // 1. Auth
  const jwt = await getJwtForUser(email);

  // 2. Call Edge Function
  const result = await callNightlyEdgeFunction(jwt, recipe, wish);

  // 3. NSFW + wish → notify and clear
  if (result.error) {
    if (result.isNsfw && wish) {
      try {
        await sb.from('notifications').insert({
          recipient_id: userId,
          actor_id: userId,
          type: 'dream_generated',
          body: `Your wish couldn't be dreamed — it was a bit too spicy. Try a different wish!`,
        });
        await sb
          .from('user_recipes')
          .update({ dream_wish: null, wish_modifiers: null, wish_recipient_ids: null })
          .eq('user_id', userId);
      } catch {}
    }
    throw new Error(result.error);
  }

  // 4. Bot message
  const botMessage = await generateBotMessage(userId, result.prompt_used, wish);

  // 5. Update upload with bot message + approval + wish
  if (result.upload_id) {
    const { error: rpcErr } = await sb.rpc('finalize_nightly_upload', {
      p_upload_id: result.upload_id,
      p_bot_message: botMessage,
      p_from_wish: wish || null,
    });
    if (rpcErr) console.error(`  ⚠️  finalize_nightly_upload failed: ${rpcErr.message}`);
  } else {
    console.error(`  ⚠️  No upload_id returned from Edge Function`);
  }

  // 6. Send nightly dream notification with bot message
  if (result.upload_id) {
    const notifBody = (wish ? 'wish:' : 'dream:') + (botMessage || '');
    try {
      await sb.from('notifications').insert({
        recipient_id: userId,
        actor_id: userId,
        type: 'dream_generated',
        upload_id: result.upload_id,
        body: notifBody,
      });
    } catch {}
  }

  // 7. Wish recipient notifications
  if (wish && Array.isArray(user.wish_recipient_ids) && user.wish_recipient_ids.length > 0) {
    const recipients = [...new Set(user.wish_recipient_ids)].filter((rid) => rid !== userId);
    if (recipients.length > 0) {
      try {
        await sb.from('notifications').insert(
          recipients.map((rid) => ({
            recipient_id: rid,
            actor_id: userId,
            type: 'dream_generated',
            upload_id: result.upload_id,
            body: wish ? `Wished you a dream: "${wish.slice(0, 50)}"` : 'Wished you a dream',
          }))
        );
      } catch {}
    }
  }

  // 8. Clear wish
  if (wish) {
    await sb
      .from('user_recipes')
      .update({ dream_wish: null, wish_recipient_ids: null, wish_modifiers: null })
      .eq('user_id', userId);
  }

  return { medium: result.resolved_medium, vibe: result.resolved_vibe, wish: !!wish };
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log(`\n🌙 Nightly Dream Generation`);
  console.log(`   Budget: ${MAX_BUDGET_CENTS}¢ | Batch: ${BATCH_SIZE} | Dry run: ${DRY_RUN}\n`);

  const today = new Date().toISOString().slice(0, 10);

  // Fetch eligible users with email
  const { data: users, error } = await sb
    .from('user_recipes')
    .select('user_id, recipe, dream_wish, wish_modifiers, wish_recipient_ids, users!inner(email)')
    .eq('onboarding_completed', true)
    .eq('ai_enabled', true);

  if (error) {
    console.error('DB error:', error.message);
    process.exit(1);
  }
  console.log(`Found ${users.length} eligible users`);

  // Filter already-dreamed
  const { data: todayBudgets } = await sb
    .from('ai_generation_budget')
    .select('user_id')
    .eq('date', today);
  const alreadyDreamed = new Set((todayBudgets ?? []).map((b) => b.user_id));
  const eligible = users.filter((u) => !alreadyDreamed.has(u.user_id));
  console.log(`${eligible.length} haven't dreamed today\n`);

  if (DRY_RUN) {
    eligible.forEach((u) =>
      console.log(`  ${u.user_id.slice(0, 8)}... ${u.users.email} ${u.dream_wish ? '(wish)' : ''}`)
    );
    console.log('\n(dry run — no dreams generated)');
    return;
  }

  let totalCost = 0;
  let generated = 0;
  let failed = 0;

  for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
    if (totalCost >= MAX_BUDGET_CENTS) {
      console.log(`\n⚠️  Budget limit reached (${totalCost}¢ / ${MAX_BUDGET_CENTS}¢). Stopping.`);
      break;
    }

    const batch = eligible.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map((user) => processDream(user)));

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const userId = batch[j].user_id.slice(0, 8);
      if (r.status === 'fulfilled') {
        generated++;
        totalCost += COST_PER_IMAGE_CENTS;
        const info = r.value;
        console.log(
          `  ${userId}... ✅ ${info.medium ?? ''}/${info.vibe ?? ''}${info.wish ? ' (wish)' : ''}`
        );
      } else {
        failed++;
        console.log(`  ${userId}... ❌ ${r.reason?.message?.slice(0, 100) ?? 'Unknown error'}`);
      }
    }

    // Pause between batches
    if (i + BATCH_SIZE < eligible.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✨ Done! Generated: ${generated} | Failed: ${failed} | Cost: ${totalCost}¢`);
})();
