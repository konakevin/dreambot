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

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { HAIKU } from '../../_shared/models.ts';

export interface NightlyDispatcherArgs {
  supabase: SupabaseClient;
  supabaseUrl: string;
  workerToken: string;
  anthropicKey: string;
  userId: string;
  payload: Record<string, unknown>;
  /** dream_queue.id — forwarded so the render can stamp stage breadcrumbs. */
  queueJobId?: string;
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

// Clamp the nightly scene caption to the inbox preview without chopping
// mid-word. The inbox now renders up to ~2 lines (~90 chars), so a scene
// caption gets ~56 chars — enough for "A woman by a sunlit barn window" — and
// only ellipsises the rare overrun back to a word boundary.
const INBOX_CAPTION_MAX = 56;
function clampInboxBody(msg: string | null): string {
  const s = (msg || '').trim();
  if (s.length <= INBOX_CAPTION_MAX) return s;
  const cut = s.slice(0, INBOX_CAPTION_MAX);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = lastSpace > 24 ? cut.slice(0, lastSpace) : cut;
  return trimmed.replace(/[\s.,;:!?-]+$/, '') + '…';
}

export async function processNightlyJob(args: NightlyDispatcherArgs): Promise<string> {
  const { supabase, supabaseUrl, workerToken, anthropicKey, userId, queueJobId } = args;

  // 1. Render in its own isolate via the worker-token branch of nightly-dreams.
  // Forward the queue job id so the render stamps stage breadcrumbs onto the
  // dream_queue row (survives a hard isolate kill → diagnosable via forensics).
  const res = await fetch(`${supabaseUrl}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
    body: JSON.stringify({ user_id: userId, queue_job_id: queueJobId }),
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

  // 2. Scene caption (Haiku) — a short factual description of the dream's scene,
  //    used as the inbox subtext so nightly rows differ at a glance. Best-effort.
  const botMessage = await generateBotMessage(anthropicKey, promptUsed);

  // 3. Finalize the upload (bot_message + approval/visibility).
  const { error: rpcErr } = await supabase.rpc('finalize_nightly_upload', {
    p_upload_id: uploadId,
    p_bot_message: botMessage,
  });
  if (rpcErr) console.error(`[nightly] finalize_nightly_upload failed: ${rpcErr.message}`);

  // 4. Notify the dreamer. body is the scene caption (inbox subtext).
  await supabase
    .from('notifications')
    .insert({
      recipient_id: userId,
      actor_id: userId,
      type: 'dream_generated',
      upload_id: uploadId,
      // Clamp to the inbox preview length on a WORD boundary so a rare overrun
      // never shows a mid-word fragment. The push banner uses its own curated
      // copy — see send-push.
      body: clampInboxBody(botMessage),
    })
    .then(swallow, swallow);

  return uploadId;
}

async function generateBotMessage(
  anthropicKey: string,
  promptUsed: string
): Promise<string | null> {
  if (!anthropicKey) return null;
  try {
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
            content: `You are captioning a dream image for its owner's inbox — a short, factual description of the scene so they can tell their dreams apart at a glance.

Dream prompt: "${promptUsed.slice(0, 200)}"

Write ONE short caption describing the SCENE: its setting and main subject.

RULES:
- A concise descriptive phrase, about 4-8 words (≤56 characters). It shows as one inbox line.
- THIRD PERSON, describing the image. NEVER use "I", "me", "my", "you", or "your".
- Name a concrete place/setting and/or the main subject. Examples: "A misty pine forest at dawn", "A woman by a sunlit barn window", "Neon Tokyo rooftop in the rain".
- Just describe — no greeting, no reaction, no opinion, no personality.
- No emojis, no quotation marks, no trailing punctuation.

Output ONLY the caption, nothing else.`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    let text =
      json && json.content && json.content[0] && typeof json.content[0].text === 'string'
        ? json.content[0].text.trim()
        : '';
    // Strip wrapping quotes + trailing punctuation the model sometimes adds.
    text = text
      .replace(/^["'“”]+|["'“”]+$/g, '')
      .replace(/[.]+$/, '')
      .trim();
    // Accept a short phrase; the clamp at the insert site is the hard cap.
    if (text.length >= 3 && text.length <= 72) return text;
    return null;
  } catch {
    return null;
  }
}
