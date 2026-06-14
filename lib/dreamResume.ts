/**
 * Cold-start dream resume — pure decision logic.
 *
 * The dream store (store/dream.ts) is in-memory only, so a brief background is
 * recovered by app/dream/loading.tsx's AppState/foreground polling — but an app
 * KILL (iOS reclaims memory after a long background) wipes activeJobId and the
 * loading screen along with it. To recover a render the user started and then
 * got killed away from, we persist a tiny {jobId, ts} marker (see
 * dreamResumeStore.ts) and, on the next cold start, ask: does the server's
 * dream_jobs row say this render finished while we were gone?
 *
 * This is the pure brain (no AsyncStorage / supabase / router imports) so it can
 * be unit- AND stress-tested headlessly. The orchestration that reads storage,
 * queries dream_jobs, and navigates lives in dreamResumeStore.ts.
 *
 * Reuses decideDreamJobRecovery so the cold-start path and the warm
 * foreground-recovery path agree on what "done / processing / failed" means.
 */

import {
  decideDreamJobRecovery,
  type DreamJobSnapshot,
  type RecoveryResult,
} from '@/lib/dreamJobRecovery';

/** Only auto-resume a dream the user started within this window. Beyond it the
 *  render is long done and living in their gallery/inbox — auto-popping a reveal
 *  would be surprising. 30 min comfortably covers "I made a dream and got
 *  interrupted" without resurrecting hours-old generations. */
export const RESUME_MAX_AGE_MS = 30 * 60_000;

export interface PersistedDreamJob {
  jobId: string;
  ts: number;
}

export type DreamResumeDecision =
  /** Render finished while we were gone — hydrate result + push to reveal. */
  | { action: 'reveal'; result: RecoveryResult }
  /** Render still in flight (rare on cold start) OR done-but-finalizing —
   *  push to the loading screen in resume mode so it polls (never re-generates). */
  | { action: 'resumeLoading'; jobId: string }
  /** Forget the marker: stale, no server row, cross-user, or already failed
   *  (the server wrote a dream_failed inbox notification — don't strand the
   *  user on a cold-start failure card). */
  | { action: 'clear' }
  /** Nothing persisted, or not authed yet (session may still be hydrating —
   *  leave the marker for the next attempt, don't clear). */
  | { action: 'ignore' };

/**
 * Decide what a cold start should do with a persisted in-flight dream marker.
 *
 * Decision order is deliberately defensive — every "is this safe to reveal?"
 * gate (auth, staleness, row exists, same user, status===done with full data)
 * must pass before we ever navigate the user into a reveal.
 */
export function decideDreamResume(args: {
  persisted: PersistedDreamJob | null;
  job: (DreamJobSnapshot & { user_id?: string | null }) | null;
  nowMs: number;
  maxAgeMs: number;
  currentUserId: string | null;
}): DreamResumeDecision {
  const { persisted, job, nowMs, maxAgeMs, currentUserId } = args;

  if (!persisted) return { action: 'ignore' };
  // Not authed yet — session may still be hydrating. Don't clear; re-check when
  // the user lands.
  if (!currentUserId) return { action: 'ignore' };
  // Stale marker — render is long done and lives in the gallery/inbox.
  if (nowMs - persisted.ts > maxAgeMs) return { action: 'clear' };
  // No server row: either the Edge Function never started (no charge happened)
  // or RLS filtered it out because it belongs to a different user. Forget it.
  if (!job) return { action: 'clear' };
  // Cross-user safety — belt-and-suspenders on top of dream_jobs RLS.
  if (job.user_id != null && job.user_id !== currentUserId) return { action: 'clear' };

  const rec = decideDreamJobRecovery({ job, queued: false, noJobGraceExceeded: true });
  switch (rec.action) {
    case 'navigate':
      return { action: 'reveal', result: rec.result };
    case 'fail':
      // Already failed/NSFW + the server inserted a dream_failed notification.
      // Don't pop a failure card on a cold launch — clear and let the inbox tell
      // the story (and the refund, if any, already happened server-side).
      return { action: 'clear' };
    case 'poll':
      return { action: 'resumeLoading', jobId: persisted.jobId };
    case 'noop':
    default:
      // job exists but is 'done'-but-finalizing (upload_id not written yet) or an
      // unknown status — poll on the loading screen rather than guess.
      return { action: 'resumeLoading', jobId: persisted.jobId };
  }
}
