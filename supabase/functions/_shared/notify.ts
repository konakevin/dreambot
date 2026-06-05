/**
 * Completion-notification gating (migration 191).
 *
 * Whether to send a "your dream is ready" push when a render finishes. We notify
 * ONLY when the user QUEUED the dream — i.e. they tapped "Queue This" on the
 * loading screen, which calls request_dream_notification() and flips
 * dream_jobs.notify_on_complete. A user who WAITED on the loading screen already
 * sees the reveal the moment it lands, so a push would be redundant noise.
 *
 * Requires a persisted result (uploadId) + a tracked job (jobId). Shared by
 * generate-dream and restyle-photo so the rule lives in exactly one place.
 */
export function shouldSendCompletionNotification(args: {
  uploadId: string | null | undefined;
  jobId: string | null | undefined;
  notifyOnComplete: boolean;
}): boolean {
  return !!args.uploadId && !!args.jobId && args.notifyOnComplete;
}

/**
 * Activity gate for OS push banners (migration 224).
 *
 * Skip the Expo POST when the recipient is currently active in the app — the
 * notification row is already inserted into the inbox and the in-app
 * indicators light up, so an OS banner on top is the redundant noise Kevin
 * called out ("getting push notifications while in DreamBot app").
 *
 * Defaults: 30s window, matching the client's debounced AppState 'active'
 * heartbeat (~once per 10s). Tighter would miss the "tabbed to Slack for
 * a few seconds" case; looser would suppress pushes after a longer real
 * absence.
 *
 * Returns true when the push should be SKIPPED.
 *
 * Edge cases:
 *   - lastActiveAt null/undefined/empty → don't skip (user has no heartbeat).
 *   - lastActiveAt malformed → don't skip (parse failed; safer to deliver).
 *   - lastActiveAt in the future (clock skew) → skip (treated as "very recent").
 */
export function shouldSkipForActivity(args: {
  lastActiveAt: string | null | undefined;
  now: number;
  thresholdMs?: number;
}): boolean {
  if (!args.lastActiveAt) return false;
  const lastActiveMs = new Date(args.lastActiveAt).getTime();
  if (Number.isNaN(lastActiveMs)) return false;
  const threshold = args.thresholdMs ?? 30_000;
  return args.now - lastActiveMs < threshold;
}
