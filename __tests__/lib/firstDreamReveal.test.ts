/**
 * Locks RevealStep's first-dream decision (lib/firstDreamReveal.ts).
 *
 * THE load-bearing regression: the onboarding pager (FlatList) mounts every step
 * up front, so RevealStep mounts on the welcome screen. If its kickoff isn't
 * gated on the step being ACTIVE, the defensive kickoff fires on mount with an
 * empty profile and burns the one-per-account first dream on a faceless
 * scene-only render. `isActive=false → 'noop'` is the line that prevents that —
 * if anyone removes the gate, this test goes red.
 */

import { decideRevealAction } from '@/lib/firstDreamReveal';

const base = { isActive: true, isEditing: false, status: 'idle' as const, jobId: null };

describe('decideRevealAction', () => {
  it('NOT ACTIVE → noop, regardless of any other state (the eager-mount guard)', () => {
    expect(decideRevealAction({ ...base, isActive: false })).toBe('noop');
    // even with a job in flight / terminal states, an inactive step does nothing
    expect(decideRevealAction({ ...base, isActive: false, jobId: 'j1' })).toBe('noop');
    expect(decideRevealAction({ ...base, isActive: false, status: 'enqueued' })).toBe('noop');
    expect(decideRevealAction({ ...base, isActive: false, status: 'already_claimed' })).toBe(
      'noop'
    );
  });

  it('edit mode (settings) → noop even when active', () => {
    expect(decideRevealAction({ ...base, isEditing: true })).toBe('noop');
  });

  it('active + nothing started (idle, no job) → kickoff (foreground fallback)', () => {
    expect(decideRevealAction({ ...base, status: 'idle', jobId: null })).toBe('kickoff');
  });

  it('active + a jobId from the cutoff → await it', () => {
    expect(decideRevealAction({ ...base, jobId: 'job-123' })).toBe('await_job');
    // a job takes priority over a still-"starting" status
    expect(decideRevealAction({ ...base, status: 'starting', jobId: 'job-123' })).toBe('await_job');
  });

  it('active + kickoff in flight (starting/enqueued, no job yet) → loader', () => {
    expect(decideRevealAction({ ...base, status: 'starting' })).toBe('show_loader');
    expect(decideRevealAction({ ...base, status: 'enqueued' })).toBe('show_loader');
  });

  it('active + already_claimed → route to feed', () => {
    expect(decideRevealAction({ ...base, status: 'already_claimed' })).toBe('route_feed');
  });

  it('active + error → show error/retry', () => {
    expect(decideRevealAction({ ...base, status: 'error' })).toBe('show_error');
  });
});
