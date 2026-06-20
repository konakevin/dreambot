/**
 * RevealStep first-dream decision — pure + unit-testable.
 *
 * The onboarding pager is a FlatList that MOUNTS every step up front, so
 * RevealStep mounts on the welcome screen. Its kickoff/await therefore MUST be
 * gated on the step actually being active — otherwise the defensive kickoff fires
 * on mount with an empty profile and burns the one-per-account first dream on a
 * faceless scene-only render (the bug this guards against). Keeping the decision
 * here, used by RevealStep's effect, lets a test lock it (esp. the not-active →
 * do-nothing case) so the gate can't be removed unnoticed.
 */

import type { FirstDreamStatus } from '@/store/onboarding';

export type RevealAction =
  | 'noop' // not active / editing → do NOTHING (the load-bearing case)
  | 'route_feed' // already-claimed (returning user) → straight to the feed
  | 'show_error' // kickoff errored → show the retry UI
  | 'await_job' // a jobId exists (cutoff started it) → poll it
  | 'show_loader' // kickoff in flight, no jobId yet → loader; jobId effect awaits
  | 'kickoff'; // reached reveal with nothing started → start it here (foreground)

export function decideRevealAction(args: {
  isActive: boolean;
  isEditing: boolean;
  status: FirstDreamStatus;
  jobId: string | null | undefined;
}): RevealAction {
  const { isActive, isEditing, status, jobId } = args;
  // GATE: never act unless the user is actually on the reveal step (and not in
  // the /settings edit flow). This is the line that stops the welcome-screen
  // eager-mount from claiming a faceless first dream.
  if (isEditing || !isActive) return 'noop';
  if (status === 'already_claimed') return 'route_feed';
  if (status === 'error') return 'show_error';
  if (jobId) return 'await_job';
  if (status === 'starting' || status === 'enqueued') return 'show_loader';
  return 'kickoff';
}
