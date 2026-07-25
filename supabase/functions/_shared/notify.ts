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
 * Sibling-acknowledged gate for OS push banners.
 *
 * If the user has already SEEN any sibling notification (one with the same
 * group_key) — either per-row seen_at OR by opening the inbox after the
 * sibling existed — don't fire another OS banner. The notification row is
 * still inserted so the inbox shows the new event; only the push is
 * suppressed.
 *
 * Kevin's call: "I had already clicked in and seen the notification for it,
 * once that happens, no more push notification needs to happen."
 *
 * Inputs:
 *   - oldestSiblingCreatedAt: the earliest sibling's created_at (NULL if no
 *     sibling exists — fresh group, fire the push).
 *   - anySiblingSeen: true if any sibling has a non-null seen_at (legacy
 *     per-row mark-seen path; still set by some flows).
 *   - lastInboxViewedAt: users.last_inbox_view_at (NULL if user has never
 *     opened the inbox — never suppress).
 *
 * Returns true when the push should be SKIPPED.
 *
 * Note: the CURRENT notification's own seen_at is irrelevant — it was JUST
 * inserted and the trigger fires before the user can have seen it. The gate
 * only looks at OTHER siblings.
 */
export function hasSeenSibling(args: {
  oldestSiblingCreatedAt: string | null | undefined;
  anySiblingSeen: boolean;
  lastInboxViewedAt: string | null | undefined;
}): boolean {
  // Per-row seen: a sibling was explicitly marked seen (push-tap path or
  // legacy mark_group_seen). Definite acknowledgement.
  if (args.anySiblingSeen) return true;

  // View-time: opening the inbox marks every visible group as "viewed". If
  // the user opened their inbox AFTER an earlier sibling existed, they've
  // implicitly acknowledged the group.
  if (!args.oldestSiblingCreatedAt || !args.lastInboxViewedAt) return false;
  const siblingMs = new Date(args.oldestSiblingCreatedAt).getTime();
  const viewedMs = new Date(args.lastInboxViewedAt).getTime();
  if (Number.isNaN(siblingMs) || Number.isNaN(viewedMs)) return false;
  return viewedMs >= siblingMs;
}

/**
 * View gate for OS push banners — the universal "I already saw this" rule.
 *
 * Pushes now fire on a 30s-2min DEBOUNCE (migration 204), not synchronously on
 * insert — so by the time the banner would go out, the user may have already
 * opened their inbox and seen THIS notification. hasSeenSibling deliberately
 * ignores the current row's own view-state (it was written for the old
 * synchronous trigger, where the row "couldn't have been seen yet"), and it only
 * fires when a SIBLING exists — so a singleton notification (a dream-ready, a
 * comment, a friend request, a first like) is never suppressed by it.
 *
 * This closes that hole: if the user opened their inbox AT OR AFTER this
 * notification was created, they've seen it — skip the banner. Applies to every
 * notification. For an aggregated group `createdAt` is the LATEST row's time, so
 * a genuinely-newer event arriving after the last view still pushes.
 *
 * Both timestamps are server-stamped now() (users.last_inbox_view_at vs
 * notifications.created_at), so they're directly comparable.
 *
 * Returns true when the push should be SKIPPED.
 */
export function hasViewedSinceCreated(args: {
  createdAt: string | null | undefined;
  lastInboxViewedAt: string | null | undefined;
}): boolean {
  if (!args.createdAt || !args.lastInboxViewedAt) return false;
  const createdMs = new Date(args.createdAt).getTime();
  const viewedMs = new Date(args.lastInboxViewedAt).getTime();
  if (Number.isNaN(createdMs) || Number.isNaN(viewedMs)) return false;
  return viewedMs >= createdMs;
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

/**
 * Types that must ALWAYS fire their OS push — exempt from the in-app "noise
 * suppression" gates (activity / viewed-since-created / seen-sibling).
 *
 * Those three gates exist to mute SOCIAL spam (likes, comments, follows) while
 * the user is actively in the app, since the in-app indicators already cover it.
 * But the NIGHTLY dream is a once-a-day PAID deliverable that lands while the
 * user is away/asleep — it is the whole point of the subscription, so it must
 * push every time, regardless of app activity or inbox-view timing. A
 * silently-suppressed nightly push is invisible (the gates return 200 with NO
 * failure logged) and unacceptable for a paid feature — this is exactly how
 * multiple users missed their nightly push while monitoring showed zero errors
 * (root-caused 2026-07-25).
 *
 * Scope:
 *   - Nightly dream READY: dream_generated with subtype <> 'manual'. A NULL
 *     subtype counts as nightly (legacy rows pre-migration-398).
 *   - Nightly dream FAILED: dream_failed / nightly_failed (the goodwill-sparkle
 *     notice — same paid signal, equally must-not-miss).
 *
 * MANUAL (Create-flow, queued-and-left) dreams are NOT exempt — the render dock
 * signals those in-app, so the gates correctly suppress a redundant banner.
 * Everything else (likes/comments/follows/etc.) keeps the gates too.
 */
export function isAlwaysPushType(args: {
  type: string | null | undefined;
  subtype: string | null | undefined;
}): boolean {
  const { type, subtype } = args;
  if (type === 'dream_generated' && subtype !== 'manual') return true;
  if (type === 'dream_failed' && subtype === 'nightly_failed') return true;
  return false;
}
