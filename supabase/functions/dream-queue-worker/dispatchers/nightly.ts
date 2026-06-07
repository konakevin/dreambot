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
 * → dreamer notification.
 *
 * Returns the upload_id; does NOT update dream_queue.status (the worker does,
 * based on whether this throws). Throws 'nsfw:...' for a safety rejection so the
 * worker dead-letters immediately instead of retrying a doomed render 5×.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { HAIKU } from '../../_shared/models.ts';

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

  // 1. Render in its own isolate via the worker-token branch of nightly-dreams.
  const res = await fetch(`${supabaseUrl}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
    body: JSON.stringify({ user_id: userId }),
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
      // Terminal — a safety rejection won't pass on retry. Dead-letter it.
      throw new Error(`nsfw:${errMsg}`);
    }
    throw new Error(errMsg);
  }

  const uploadId = data.upload_id as string | undefined;
  const promptUsed = (data.prompt_used as string) || '';
  if (!uploadId) throw new Error('nightly_render_no_upload_id');

  // 2. Whimsical bot message (Haiku). Best-effort — never fail the job over it.
  const botMessage = await generateBotMessage(supabase, anthropicKey, userId, promptUsed);

  // 3. Finalize the upload (bot_message + approval/visibility).
  const { error: rpcErr } = await supabase.rpc('finalize_nightly_upload', {
    p_upload_id: uploadId,
    p_bot_message: botMessage,
  });
  if (rpcErr) console.error(`[nightly] finalize_nightly_upload failed: ${rpcErr.message}`);

  // 4. Notify the dreamer. body is the clean bot message text (inbox subtext).
  await supabase
    .from('notifications')
    .insert({
      recipient_id: userId,
      actor_id: userId,
      type: 'dream_generated',
      upload_id: uploadId,
      // Hard-cap at 28 chars to fit the single-line inbox layout (mig 223).
      // The Haiku prompt in generateBotMessage() asks for ≤28 already.
      body: (botMessage || '').slice(0, 28),
    })
    .then(swallow, swallow);

  return uploadId;
}

async function generateBotMessage(
  supabase: SupabaseClient,
  anthropicKey: string,
  userId: string,
  promptUsed: string
): Promise<string | null> {
  if (!anthropicKey) return null;
  try {
    const { data: recentDreams } = await supabase
      .from('uploads')
      .select('ai_prompt')
      .eq('user_id', userId)
      .eq('is_ai_generated', true)
      .order('created_at', { ascending: false })
      .limit(5);
    const recentContext = (recentDreams ?? [])
      .map((d: { ai_prompt?: string }) => (d.ai_prompt ? d.ai_prompt.slice(0, 80) : null))
      .filter(Boolean);

    let memoryBlock = '';
    if (recentContext.length > 0)
      memoryBlock += `\nOPTIONAL CONTEXT (reference ONLY if genuinely interesting, otherwise ignore):\n- Recent dreams: ${recentContext.join(' | ')}`;

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
