// Supabase Edge Function: nightly-dreams
// Triggered by pg_cron at 3am UTC daily.
// Generates one dream per eligible active user using the Sonnet template pipeline.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import {
  CURATED_MEDIUMS,
  CURATED_VIBES,
  randomMedium,
  randomVibe,
} from '../_shared/dreamEngine.ts';

const COST_PER_IMAGE_CENTS = 3;
const MAX_BUDGET_CENTS = 500; // $5 default
const BATCH_SIZE = 5;

const TEMPLATE_CATEGORIES = [
  'cosmic',
  'microscopic',
  'impossible_architecture',
  'giant_objects',
  'peaceful_absurdity',
  'beautiful_melancholy',
  'cosmic_horror',
  'joyful_chaos',
  'eerie_stillness',
  'broken_gravity',
  'wrong_materials',
  'time_distortion',
  'merged_worlds',
  'living_objects',
  'impossible_weather',
  'overgrown',
  'bioluminescence',
  'dreams_within_dreams',
  'memory_distortion',
  'abandoned_running',
  'transformation',
  'reflections',
  'machines',
  'music_sound',
  'underwater',
  'doors_portals',
  'collections',
  'decay_beauty',
  'childhood',
  'transparency',
  'cinematic',
];

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective, subject towering overhead',
  'tilt-shift miniature effect, shallow depth of field, toy-like scale',
  'silhouette against blazing backlight, rim lighting, dramatic contrast',
  'macro lens extreme close-up, impossibly detailed textures, creamy bokeh background',
  'aerial view looking straight down, geometric patterns, vast scale',
  'through rain-covered glass, soft distortion, reflections overlapping the scene',
  'dutch angle, dramatic tension, off-kilter framing',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'over-the-shoulder perspective, voyeuristic, intimate framing',
  'symmetrical dead-center composition, Wes Anderson framing, obsessive balance',
  'fisheye lens distortion, warped edges, immersive and disorienting',
  'long exposure motion blur, streaks of light, frozen and flowing simultaneously',
  'reflection shot, scene mirrored in water or glass, doubled reality',
  'extreme depth, foreground object sharp, background stretching to infinity',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface MoodAxes {
  peaceful_chaotic: number;
  cute_terrifying: number;
  minimal_maximal: number;
  realistic_surreal: number;
}

function pickWeightedCategory(moods: MoodAxes): string {
  const CATEGORY_WEIGHTS: Record<string, (m: MoodAxes) => number> = {
    cosmic: (m) => 1 + m.realistic_surreal * 0.5,
    microscopic: (m) => 1 + (1 - m.minimal_maximal) * 0.5,
    impossible_architecture: (m) => 1 + m.realistic_surreal * 0.5 + m.minimal_maximal * 0.3,
    giant_objects: (m) => 1 + m.minimal_maximal * 0.5,
    peaceful_absurdity: (m) => 1 + (1 - m.peaceful_chaotic) * 0.8 + (1 - m.cute_terrifying) * 0.3,
    beautiful_melancholy: (m) => 1 + (1 - m.peaceful_chaotic) * 0.5 + (1 - m.minimal_maximal) * 0.3,
    cosmic_horror: (m) => 1 + m.cute_terrifying * 0.8 + m.realistic_surreal * 0.3,
    joyful_chaos: (m) => 1 + m.peaceful_chaotic * 0.8 + (1 - m.cute_terrifying) * 0.3,
    eerie_stillness: (m) => 1 + (1 - m.peaceful_chaotic) * 0.5 + m.cute_terrifying * 0.5,
    broken_gravity: (m) => 1 + m.peaceful_chaotic * 0.3 + m.realistic_surreal * 0.5,
    wrong_materials: (m) => 1 + m.realistic_surreal * 0.8,
    time_distortion: (m) => 1 + m.realistic_surreal * 0.8,
    merged_worlds: (m) => 1 + m.realistic_surreal * 0.5 + m.minimal_maximal * 0.3,
    living_objects: (m) => 1 + (1 - m.cute_terrifying) * 0.3 + m.realistic_surreal * 0.3,
    impossible_weather: (m) => 1 + m.peaceful_chaotic * 0.3 + m.realistic_surreal * 0.3,
    overgrown: (m) => 1 + (1 - m.peaceful_chaotic) * 0.3,
    bioluminescence: (m) => 1 + (1 - m.cute_terrifying) * 0.5 + (1 - m.peaceful_chaotic) * 0.3,
    dreams_within_dreams: (m) => 1 + m.realistic_surreal * 0.8 + m.minimal_maximal * 0.3,
    memory_distortion: (m) => 1 + (1 - m.peaceful_chaotic) * 0.3 + m.realistic_surreal * 0.5,
    abandoned_running: (m) => 1 + m.cute_terrifying * 0.3 + (1 - m.peaceful_chaotic) * 0.3,
    transformation: (m) => 1 + m.realistic_surreal * 0.5 + m.peaceful_chaotic * 0.3,
    reflections: (m) => 1 + (1 - m.minimal_maximal) * 0.3 + m.realistic_surreal * 0.3,
    machines: (m) => 1 + m.minimal_maximal * 0.5 + m.peaceful_chaotic * 0.3,
    music_sound: (m) => 1 + m.peaceful_chaotic * 0.3,
    underwater: (m) => 1 + (1 - m.peaceful_chaotic) * 0.3,
    doors_portals: (m) => 1 + m.realistic_surreal * 0.5,
    collections: (m) => 1 + m.minimal_maximal * 0.8,
    decay_beauty: (m) => 1 + m.cute_terrifying * 0.5 + (1 - m.peaceful_chaotic) * 0.3,
    childhood: (m) => 1 + (1 - m.cute_terrifying) * 0.5,
    transparency: (m) => 1 + m.realistic_surreal * 0.5 + (1 - m.minimal_maximal) * 0.3,
    cinematic: (m) => 1 + m.minimal_maximal * 0.3,
  };

  const entries = Object.entries(CATEGORY_WEIGHTS);
  const weights = entries.map(([, fn]) => fn(moods));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < entries.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return entries[i][0];
  }
  return entries[0][0];
}

interface EligibleUser {
  user_id: string;
  recipe: VibeProfile | Record<string, unknown>;
  dream_wish: string | null;
  wish_recipient_ids: string[] | null;
  wish_modifiers: {
    mood: string | null;
    weather: string | null;
    energy: string | null;
    vibe: string | null;
  } | null;
}

function resolveMedium(profile: VibeProfile) {
  if (profile.art_styles?.length) {
    const key = pick(profile.art_styles);
    return CURATED_MEDIUMS.find((m) => m.key === key) ?? randomMedium();
  }
  return randomMedium();
}

function resolveVibe(profile: VibeProfile) {
  if (profile.aesthetics?.length) {
    const key = pick(profile.aesthetics);
    return CURATED_VIBES.find((v) => v.key === key) ?? randomVibe();
  }
  return randomVibe();
}

Deno.serve(async (req) => {
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN' }), { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const today = new Date().toISOString().slice(0, 10);

  // 1. Find eligible users: onboarded + AI enabled + active in last 36 hours
  const { data: eligible, error: eligibleErr } = await supabase
    .from('user_recipes')
    .select(
      'user_id, recipe, dream_wish, wish_modifiers, wish_recipient_ids, users!inner(last_active_at)'
    )
    .eq('onboarding_completed', true)
    .eq('ai_enabled', true)
    .gte('users.last_active_at', new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString());

  if (eligibleErr) {
    console.error('[Nightly] Failed to fetch eligible users:', eligibleErr);
    return new Response(JSON.stringify({ error: eligibleErr.message }), { status: 500 });
  }

  if (!eligible || eligible.length === 0) {
    console.log('[Nightly] No eligible users');
    return new Response(JSON.stringify({ message: 'No eligible users', generated: 0 }), {
      status: 200,
    });
  }

  // 2. Filter out users who already got a dream today
  const { data: alreadyDreamed } = await supabase
    .from('ai_generation_budget')
    .select('user_id')
    .eq('date', today);

  const doneSet = new Set((alreadyDreamed ?? []).map((r: { user_id: string }) => r.user_id));
  const users: EligibleUser[] = eligible
    .filter((u: Record<string, unknown>) => !doneSet.has(u.user_id as string))
    .map((u: Record<string, unknown>) => ({
      user_id: u.user_id as string,
      recipe: u.recipe as VibeProfile | Record<string, unknown>,
      dream_wish: (u.dream_wish as string | null) ?? null,
      wish_recipient_ids: (u.wish_recipient_ids as string[] | null) ?? null,
      wish_modifiers: (u.wish_modifiers as EligibleUser['wish_modifiers']) ?? null,
    }));

  console.log(
    `[Nightly] ${users.length} users to dream for (${eligible.length} eligible, ${doneSet.size} already done)`
  );

  // 3. Process in batches
  let generated = 0;
  let failed = 0;
  let totalCost = 0;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    if (totalCost >= MAX_BUDGET_CENTS) {
      console.log(`[Nightly] Budget exceeded (${totalCost}c >= ${MAX_BUDGET_CENTS}c), stopping`);
      break;
    }

    const batch = users.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((user) =>
        generateDreamForUser(user, supabase, REPLICATE_TOKEN, ANTHROPIC_KEY, today)
      )
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        generated++;
        totalCost += COST_PER_IMAGE_CENTS;
      } else {
        failed++;
        console.error(`[Nightly] Failed:`, result.reason?.message?.slice(0, 80));
      }
    }

    // Pause between batches
    if (i + BATCH_SIZE < users.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const summary = { generated, failed, costCents: totalCost };
  console.log(`[Nightly] Done:`, summary);
  return new Response(JSON.stringify(summary), { status: 200 });
});

async function generateDreamForUser(
  user: EligibleUser,
  supabase: ReturnType<typeof createClient>,
  replicateToken: string,
  anthropicKey: string | undefined,
  today: string
) {
  const { dream_wish: wish } = user;
  const profileData = user.recipe;
  const isV2 =
    typeof profileData === 'object' &&
    profileData !== null &&
    (profileData as Record<string, unknown>).version === 2;

  let prompt: string;

  if (isV2 && anthropicKey) {
    // ══════════════════════════════════════════════════════════════════
    // ══ SONNET TEMPLATE PIPELINE — same as generate-dream nightly path
    // ══════════════════════════════════════════════════════════════════
    const vibeProfile = profileData as unknown as VibeProfile;
    const medium = resolveMedium(vibeProfile);
    const vibe = resolveVibe(vibeProfile);

    // Step 1: Pick a mood-weighted scene template from the DB
    const seeds = vibeProfile.dream_seeds ?? { characters: [], places: [], things: [] };
    const moods = vibeProfile.moods ?? {
      peaceful_chaotic: 0.5,
      cute_terrifying: 0.3,
      minimal_maximal: 0.5,
      realistic_surreal: 0.5,
    };
    let dreamSubject: string;

    try {
      const category = pickWeightedCategory(moods);
      const { data: rows, error: tmplErr } = await supabase
        .from('dream_templates')
        .select('template')
        .eq('category', category)
        .eq('disabled', false)
        .limit(200);

      if (tmplErr || !rows?.length) throw new Error(tmplErr?.message ?? 'No templates');

      const template = pick(rows).template;
      const character = seeds.characters.length > 0 ? pick(seeds.characters) : 'a wandering figure';
      const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
      const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';

      dreamSubject = template
        .replace(/\$\{character\}/g, character)
        .replace(/\$\{place\}/g, place)
        .replace(/\$\{thing\}/g, thing);

      console.log(
        `[Nightly] ${user.user_id.slice(0, 8)} template | cat: ${category} | scene: ${dreamSubject.slice(0, 100)}`
      );
    } catch (dbErr) {
      // Fallback: simple surreal scene
      const fallbackSeeds = [
        ...seeds.characters.slice(0, 1),
        ...seeds.places.slice(0, 1),
        ...seeds.things.slice(0, 1),
      ].filter(Boolean);
      dreamSubject =
        fallbackSeeds.length > 0
          ? `A surreal dream featuring ${fallbackSeeds.join(' and ')} in an impossible landscape`
          : 'A surreal impossible dreamscape with unexpected elements and impossible geometry';
      console.warn(`[Nightly] ${user.user_id.slice(0, 8)} DB fallback:`, (dbErr as Error).message);
    }

    // Step 2: Maybe inject a dream cast member (~30% chance)
    const cast = (vibeProfile.dream_cast ?? []) as DreamCastMember[];
    const describedCast = cast.filter((m) => m.description);
    if (describedCast.length > 0 && Math.random() < 0.3) {
      const castPick = pick(describedCast);
      const roleLabel =
        castPick.role === 'self'
          ? 'the dreamer'
          : castPick.role === 'pet'
            ? 'their pet'
            : (castPick as Record<string, unknown>).relationship === 'significant_other'
              ? 'their romantic partner'
              : `their ${(castPick as Record<string, unknown>).relationship ?? 'companion'}`;
      dreamSubject += `. The main character is ${roleLabel}: ${castPick.description}`;
    }

    // Step 3: Inject wish if present
    if (wish) {
      dreamSubject += `. DREAM WISH (make this the heart): "${wish}"`;
    }

    // Step 4: Build Sonnet brief and generate prompt
    const shotDirection = pick(SHOT_DIRECTIONS);

    // Build personalization context from profile
    const aestheticFlavor = vibeProfile.aesthetics?.length
      ? `\nFLAVOR (the dreamer vibes with): ${vibeProfile.aesthetics.slice(0, 4).join(', ')}`
      : '';
    const avoidList = vibeProfile.avoid?.length
      ? `\nNEVER INCLUDE: ${vibeProfile.avoid.join(', ')}`
      : '';
    const allSeeds = [...seeds.characters, ...seeds.places, ...seeds.things];
    const extraSeeds =
      allSeeds.length > 0
        ? `\nDREAMER'S INGREDIENTS (weave 1-2 in naturally if they fit the scene): ${allSeeds
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .join(', ')}`
        : '';

    const nightlyBrief = `You are a cinematographer composing a single breathtaking frame. Convert this dream into a Flux AI prompt. 60-90 words, comma-separated phrases.

MEDIUM: ${medium.fluxFragment}

DREAM SCENE (this is sacred — do NOT water it down):
${dreamSubject}

CAMERA/COMPOSITION: ${shotDirection}

MOOD: ${vibe.directive}
${aestheticFlavor}${extraSeeds}${avoidList}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every surreal detail preserved
3. Apply the camera direction — this shapes HOW we see the scene
4. Name specific materials, textures, light sources (not adjectives — NOUNS)
5. End with: portrait 9:16, ${medium.key === 'cgi' ? 'octane render, volumetric lighting, ray tracing, 8K' : medium.key === 'anime' ? 'Studio Ghibli quality, cel animation, hand-painted backgrounds' : medium.key === '35mm_photography' ? 'Kodak Portra 400, film grain, shallow depth of field' : 'hyper detailed, masterwork composition, stunning lighting'}

No quotation marks. Output ONLY the prompt.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: nightlyBrief }],
        }),
      });
      if (!res.ok) throw new Error(`Sonnet ${res.status}`);
      const data = await res.json();
      const text = data.content?.[0]?.text?.trim() ?? '';
      if (text.length < 20) throw new Error('Sonnet response too short');
      prompt = text;
    } catch {
      // Fallback: concatenate directly
      prompt = `${medium.fluxFragment}, ${dreamSubject}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed, gorgeous lighting`;
    }

    console.log(`[Nightly] ${user.user_id.slice(0, 8)} prompt: ${prompt.slice(0, 120)}`);
  } else {
    // ── NON-V2 USERS: simple fallback prompt ──
    const fallbackMedium = randomMedium();
    const fallbackVibe = randomVibe();
    prompt = `${fallbackMedium.fluxFragment}, a surreal impossible dreamscape, ${fallbackVibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
    if (wish) {
      prompt = `${fallbackMedium.fluxFragment}, "${wish}", ${fallbackVibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
    }
  }

  // Generate image via Replicate Flux Dev
  const createRes = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${replicateToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' },
      }),
    }
  );

  if (createRes.status === 429) {
    const body = await createRes.json();
    await new Promise((r) => setTimeout(r, (body.retry_after ?? 6) * 1000));
    throw new Error('Rate limited — will retry in next batch');
  }
  if (!createRes.ok) throw new Error('Generation failed to start');

  const createData = await createRes.json();
  if (!createData.id) throw new Error('No prediction ID');

  // Poll for result
  let imageUrl: string | null = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${createData.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      imageUrl = pollData.output?.[0];
      break;
    }
    if (pollData.status === 'failed') {
      const errMsg = pollData.error ?? 'Generation failed';
      if (
        typeof errMsg === 'string' &&
        (errMsg.toLowerCase().includes('nsfw') || errMsg.toLowerCase().includes('safety'))
      ) {
        if (wish) {
          await supabase.from('notifications').insert({
            recipient_id: user.user_id,
            actor_id: user.user_id,
            type: 'dream_generated',
            body: `Your wish couldn't be dreamed — it was a bit too spicy. Try a different wish!`,
          });
          await supabase
            .from('user_recipes')
            .update({ dream_wish: null, wish_recipient_ids: null, wish_modifiers: null })
            .eq('user_id', user.user_id);
        }
      }
      throw new Error(errMsg);
    }
  }

  if (!imageUrl) throw new Error('Generation timed out');

  // Download from Replicate and upload to Supabase Storage
  const imgResp = await fetch(imageUrl);
  if (!imgResp.ok) throw new Error('Failed to download generated image');
  const imgBuf = await imgResp.arrayBuffer();
  const fileName = `${user.user_id}/${Date.now()}.jpg`;

  const { error: storageErr } = await supabase.storage
    .from('uploads')
    .upload(fileName, imgBuf, { contentType: 'image/jpeg' });
  if (storageErr) throw new Error(`Storage upload failed: ${storageErr.message}`);

  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  const permanentUrl = urlData.publicUrl;

  // Generate a bot message via Haiku
  let botMessage: string | null = null;
  if (anthropicKey) {
    try {
      const { data: recentDreams } = await supabase
        .from('uploads')
        .select('ai_prompt, from_wish')
        .eq('user_id', user.user_id)
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false })
        .limit(5);

      const recentContext = (recentDreams ?? [])
        .map((d: { ai_prompt: string | null }) => d.ai_prompt?.slice(0, 80))
        .filter(Boolean);
      const pastWishes = (recentDreams ?? [])
        .map((d: { from_wish: string | null }) => d.from_wish)
        .filter(Boolean);

      let memoryBlock = '';
      if (recentContext.length > 0) {
        memoryBlock += `\nOPTIONAL CONTEXT (reference ONLY if genuinely interesting, otherwise ignore):\n- Recent dreams: ${recentContext.join(' | ')}`;
      }
      if (pastWishes.length > 0) {
        memoryBlock += `\n- Past wishes: ${pastWishes.join(', ')}`;
      }
      if (wish) {
        memoryBlock += `\n- Tonight's wish: "${wish}"`;
      }

      const msgRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 60,
          messages: [
            {
              role: 'user',
              content: `You are a DreamBot — a tiny creative spirit living in someone's phone, making dreams nightly. Playful, warm, a little weird. You love your human.

Tonight's dream prompt: "${prompt.slice(0, 200)}"

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
        }),
      });

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const text = msgData.content?.[0]?.text?.trim() ?? '';
        if (text.length >= 5 && text.length <= 200) {
          botMessage = text;
        }
      }
    } catch {
      // Non-critical
    }
  }

  // Store the dream
  const { data: upload } = await supabase
    .from('uploads')
    .insert({
      user_id: user.user_id,
      categories: ['art'],
      image_url: permanentUrl,
      caption: null,
      ai_prompt: prompt,
      from_wish: wish,
      bot_message: botMessage,
      is_approved: true,
      is_active: false,
    })
    .select('id')
    .single();

  // Send notification to dreamer
  if (upload?.id) {
    const { error: notifErr } = await supabase.from('notifications').insert({
      recipient_id: user.user_id,
      actor_id: user.user_id,
      type: 'dream_generated',
      upload_id: upload.id,
      body: (wish ? 'wish:' : 'dream:') + (botMessage || ''),
    });
    if (notifErr)
      console.warn(`[Nightly] Notification failed for ${user.user_id}:`, notifErr.message);

    // Send notification to wish recipients (friends)
    if (user.wish_recipient_ids && user.wish_recipient_ids.length > 0) {
      const uniqueRecipients = [...new Set(user.wish_recipient_ids)].filter(
        (rid) => rid !== user.user_id
      );
      if (uniqueRecipients.length > 0) {
        const friendNotifs = uniqueRecipients.map((rid) => ({
          recipient_id: rid,
          actor_id: user.user_id,
          type: 'dream_generated',
          upload_id: upload.id,
          body: wish ? `Wished you a dream: "${wish.slice(0, 50)}"` : 'Wished you a dream',
        }));
        const { error: friendErr } = await supabase.from('notifications').insert(friendNotifs);
        if (friendErr)
          console.warn(
            `[Nightly] Friend notifications failed for ${user.user_id}:`,
            friendErr.message
          );
      }
    }
  }

  // Log generation
  const { error: logErr } = await supabase.from('ai_generation_log').insert({
    user_id: user.user_id,
    recipe_snapshot: user.recipe,
    enhanced_prompt: prompt,
    model_used: 'flux-dev',
    cost_cents: COST_PER_IMAGE_CENTS,
    status: 'completed',
  });
  if (logErr) console.warn(`[Nightly] Log insert failed for ${user.user_id}:`, logErr.message);

  // Update budget
  const { error: budgetErr } = await supabase.from('ai_generation_budget').upsert(
    {
      user_id: user.user_id,
      date: today,
      images_generated: 1,
      total_cost_cents: COST_PER_IMAGE_CENTS,
    },
    { onConflict: 'user_id,date' }
  );
  if (budgetErr)
    console.warn(`[Nightly] Budget update failed for ${user.user_id}:`, budgetErr.message);

  // Clear wish + recipient if used
  if (wish) {
    const { error: wishErr } = await supabase
      .from('user_recipes')
      .update({ dream_wish: null, wish_recipient_ids: null, wish_modifiers: null })
      .eq('user_id', user.user_id);
    if (wishErr) console.warn(`[Nightly] Wish clear failed for ${user.user_id}:`, wishErr.message);
  }

  console.log(`[Nightly] Dream generated for ${user.user_id} (wish: ${wish ? 'yes' : 'no'})`);
}
