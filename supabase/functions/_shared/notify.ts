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
