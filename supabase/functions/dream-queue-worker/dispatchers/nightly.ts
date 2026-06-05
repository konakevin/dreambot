/**
 * Nightly dispatcher — processes one queued nightly job.
 *
 * Unlike first_dream (which renders inline in the worker isolate), nightly
 * INVOKES the nightly-dreams render Edge Function server-to-server (worker
 * token), so each render runs in its OWN isolate. That lets the worker fan a
 * whole batch out in parallel without doing the heavy CPU itself — the scaling
 * lever for "lots of users = lots of nightly dreams".
 *
 * After the render returns an upload, this finalizes it (ported from the old
 * inline cron in scripts/nightly-dreams.js): bot message → finalize_nightly_upload
 * → dreamer notification → wish-recipient notifications.
 *
 * Returns the upload_id; does NOT update dream_queue.status (the worker does,
 * based on whether this throws). Throws 'nsfw:...' for a safety rejection so the
 * worker dead-letters immediately instead of retrying a doomed render 5×.
 *
 * dream_wish is snapshotted into the job payload AND cleared from user_recipes
 * at ENQUEUE time, so retries never re-spend or double-clear it.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { HAIKU } from '../../_shared/models.ts';

interface NightlyPayload {
  dream_wish?: string | null;
  wish_recipient_ids?: string[] | null;
}

export interface NightlyDispatcherArgs {
  supabase: SupabaseClient;
  supabaseUrl: string;
  workerToken: string;
  anthropicKey: string;
  userId: string;
  payload: Record<string, unknown>;
}

// Notifications here are best-effort — they must never fail the job (already
// done or dead-lettered). But log failures to the Edge logs rather than
// silently dropping them. Handles both a resolved `{ error }` and a thrown err.
const swallow = (resOrErr: unknown) => {
  const err = (resOrErr as { error?: { message?: string } | null } | null)?.error;
  if (err) console.warn('[nightly] notification insert failed:', err.message);
  else if (resOrErr instanceof Error) {
    console.warn('[nightly] notification insert threw:', resOrErr.message);
  }
};

export async function processNightlyJob(args: NightlyDispatcherArgs): Promise<string> {
  const { supabase, supabaseUrl, workerToken, anthropicKey, userId } = args;
  const payload = args.payload as unknown as NightlyPayload;
  const wish = payload.dream_wish || null;
  const wishRecipientIds = Array.isArray(payload.wish_recipient_ids)
    ? payload.wish_recipient_ids
    : [];

  // 1. Render in its own isolate via the worker-token branch of nightly-dreams.
  const res = await fetch(`${supabaseUrl}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
    body: JSON.stringify({ user_id: userId, dream_wish: wish || undefined }),
  });
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const errMsg =
      (data.error as string) || (data.code as string) || `nightly_render_http_${res.status}`;
    if (/nsfw|safety/i.test(errMsg)) {
      // Terminal — a safety rejection won't pass on retry. Tell the wisher.
      if (wish) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: userId,
            actor_id: userId,
            type: 'dream_generated',
            // Subject-only inbox row — short for single-line layout (mig 223).
            body: 'Wish too spicy — try a different one.',
          })
          .then(swallow, swallow);
      }
      throw new Error(`nsfw:${errMsg}`);
    }
    throw new Error(errMsg);
  }

  const uploadId = data.upload_id as string | undefined;
  const promptUsed = (data.prompt_used as string) || '';
  if (!uploadId) throw new Error('nightly_render_no_upload_id');

  // 2. Whimsical bot message (Haiku). Best-effort — never fail the job over it.
  const botMessage = await generateBotMessage(supabase, anthropicKey, userId, promptUsed, wish);

  // 3. Finalize the upload (bot_message + from_wish + approval/visibility).
  const { error: rpcErr } = await supabase.rpc('finalize_nightly_upload', {
    p_upload_id: uploadId,
    p_bot_message: botMessage,
    p_from_wish: wish,
  });
  if (rpcErr) console.error(`[nightly] finalize_nightly_upload failed: ${rpcErr.message}`);

  // 4. Notify the dreamer. `subtype` lets the inbox distinguish wish vs
  // plain-dream variants (migration 206 — replaces the legacy body-prefix
  // discriminator). body is the clean bot message text.
  await supabase
    .from('notifications')
    .insert({
      recipient_id: userId,
      actor_id: userId,
      type: 'dream_generated',
      subtype: wish ? 'wish' : null,
      upload_id: uploadId,
      // Bot message is the inbox subtext when shown. Hard-cap at 28
      // chars belt-and-suspenders to fit single-line render (mig 223).
      // The Haiku prompt in generateBotMessage() asks for ≤28 already.
      body: (botMessage || '').slice(0, 28),
    })
    .then(swallow, swallow);

  // 5. Notify wish recipients.
  if (wish && wishRecipientIds.length > 0) {
    const recipients = [...new Set(wishRecipientIds)].filter((rid) => rid && rid !== userId);
    if (recipients.length > 0) {
      await supabase
        .from('notifications')
        .insert(
          recipients.map((rid) => ({
            recipient_id: rid,
            actor_id: userId,
            type: 'dream_generated',
            upload_id: uploadId,
            // Inbox subtext — keep tight for single-line layout (mig 223).
            body: wish.slice(0, 28),
          }))
        )
        .then(swallow, swallow);
    }
  }

  return uploadId;
}

async function generateBotMessage(
  supabase: SupabaseClient,
  anthropicKey: string,
  userId: string,
  promptUsed: string,
  wish: string | null
): Promise<string | null> {
  if (!anthropicKey) return null;
  try {
    const { data: recentDreams } = await supabase
      .from('uploads')
      .select('ai_prompt, from_wish')
      .eq('user_id', userId)
      .eq('is_ai_generated', true)
      .order('created_at', { ascending: false })
      .limit(5);
    const recentContext = (recentDreams ?? [])
      .map((d: { ai_prompt?: string }) => (d.ai_prompt ? d.ai_prompt.slice(0, 80) : null))
      .filter(Boolean);
    const pastWishes = (recentDreams ?? [])
      .map((d: { from_wish?: string }) => d.from_wish)
      .filter(Boolean);

    let memoryBlock = '';
    if (recentContext.length > 0)
      memoryBlock += `\nOPTIONAL CONTEXT (reference ONLY if genuinely interesting, otherwise ignore):\n- Recent dreams: ${recentContext.join(' | ')}`;
    if (pastWishes.length > 0) memoryBlock += `\n- Past wishes: ${pastWishes.join(', ')}`;
    if (wish) memoryBlock += `\n- Tonight's wish: "${wish}"`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: HAIKU,
        max_tokens: 60,
        messages: [
          {
            role: 'user',
            content: `You are a Dream Bot — a tiny creative spirit living in someone's phone, making dreams nightly. Playful, warm, a little weird. You love your human.

Tonight's dream prompt: "${promptUsed.slice(0, 200)}"

Write ONE very short reaction to making this dream. Maximum 28 characters total (about 3-5 words). It will display as a single-line inbox preview.

CRITICAL RULES:
- ≤28 characters total (HARD LIMIT — server truncates beyond this anyway).
- NEVER start with "Okay so" or "Not gonna lie" or "Honestly"
- NEVER use the phrases "hit different", "chef's kiss", "you're welcome", "no regrets", "trust the process"
- Reference ONE specific thing from the prompt — a creature, place, color, or vibe — but as a single tight phrase, not a full sentence.
- React to the creative choice, don't describe the image
- No emojis. Max one exclamation mark.
${memoryBlock}

Output ONLY the message, nothing else.`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text =
      json && json.content && json.content[0] && typeof json.content[0].text === 'string'
        ? json.content[0].text.trim()
        : '';
    // Accept 3-40 chars (the prompt asks for ≤28, but Haiku occasionally
    // overruns by a few; we slice to 28 at the insert call site as the
    // hard cap, so accepting up to 40 here just gives Sonnet some
    // breathing room without forcing a retry on borderline outputs).
    if (text.length >= 3 && text.length <= 40) return text;
    return null;
  } catch {
    return null;
  }
}
