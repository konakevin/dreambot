/**
 * Loading-screen recovery decision (extracted from app/dream/loading.tsx).
 *
 * The render is durable (`EdgeRuntime.waitUntil`) — when a client's
 * `await generateDream()` rejects on a transport drop (briefly backgrounded,
 * network blip), the server keeps going and writes the result to
 * `dream_jobs`. This pure function decides what the loading screen should do
 * given the current dream_jobs row + whether the user opted into the
 * background-push flow ("Queue This").
 *
 * Decisions:
 *   - 'navigate' — render completed with all the data we need; set the
 *     result + router.replace('/dream/reveal').
 *   - 'poll'     — render is still in flight on the server (status='processing').
 *     Hide any failure card and keep the loading spinner up; the polling effect
 *     keeps checking.
 *   - 'fail'     — render failed or was NSFW-blocked; exit recovery and let
 *     the failure card show.
 *   - 'noop'     — nothing to do (no job row, missing fields on a 'done' row,
 *     user already queued).
 *
 * Unit-tested in __tests__/lib/dreamJobRecovery.test.ts so the decision tree
 * can't silently drift.
 */

export interface DreamJobSnapshot {
  status: string | null;
  upload_id: string | null;
  result_image_url: string | null;
  result_prompt: string | null;
  result_medium: string | null;
  result_vibe: string | null;
  error?: string | null;
}

export interface RecoveryResult {
  imageUrl: string;
  prompt: string;
  aiConcept: null;
  dreamMode: null;
  archetype: null;
  resolvedMedium: string | null;
  resolvedVibe: string | null;
  uploadId: string;
}

export type RecoveryDecision =
  | { action: 'navigate'; result: RecoveryResult }
  | { action: 'poll' }
  | { action: 'fail' }
  | { action: 'noop' };

export function decideDreamJobRecovery(args: {
  job: DreamJobSnapshot | null;
  queued: boolean;
}): RecoveryDecision {
  // User already opted into the background-push flow — leave them where they
  // are (back on the create tab / DLT screen). Don't yank them into reveal.
  if (args.queued) return { action: 'noop' };
  if (!args.job) return { action: 'noop' };

  const { status, upload_id, result_image_url, result_prompt, result_medium, result_vibe } =
    args.job;

  if (status === 'done') {
    // 'done' but missing essentials — likely the server is mid-finalize
    // (uploaded image, hasn't written upload_id yet). Treat as no-op; the next
    // poll catches it.
    if (!upload_id || !result_image_url) return { action: 'noop' };
    return {
      action: 'navigate',
      result: {
        imageUrl: result_image_url,
        prompt: result_prompt ?? '',
        aiConcept: null,
        dreamMode: null,
        archetype: null,
        resolvedMedium: result_medium,
        resolvedVibe: result_vibe,
        uploadId: upload_id,
      },
    };
  }

  if (status === 'failed' || status === 'nsfw') {
    return { action: 'fail' };
  }

  if (status === 'processing') {
    return { action: 'poll' };
  }

  return { action: 'noop' };
}
