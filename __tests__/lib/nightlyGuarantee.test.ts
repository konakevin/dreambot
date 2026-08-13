/**
 * Locks the nightly-dream GUARANTEE invariants (NIGHTLY_DREAM_GUARANTEE_PLAN.md):
 *  - L3: a nightly failure NEVER dead-letters early (it re-rolls & retries), while
 *    Create still dead-letters a terminal/NSFW error immediately.
 *  - L4: after enough failed nightly attempts, degrade to a guaranteed-SFW scene.
 * A regression here = a paying customer silently missing a nightly dream, so these
 * fail loud in CI.
 */

import {
  computeNightlyIsDead,
  shouldForceSafeScene,
  SAFE_SCENE_AFTER_ATTEMPTS,
  dreamFailedNotification,
} from '@engine/dreamQueueLifecycle';

describe('computeNightlyIsDead (L3)', () => {
  it('nightly NEVER dead-letters on a terminal/NSFW error before the cap', () => {
    expect(computeNightlyIsDead('nightly', 1, true)).toBe(false);
    expect(computeNightlyIsDead('nightly', 7, true)).toBe(false);
  });
  it('nightly dead-letters only once it hits the raised cap (8)', () => {
    expect(computeNightlyIsDead('nightly', 7, false)).toBe(false);
    expect(computeNightlyIsDead('nightly', 8, false)).toBe(true);
  });
  it('Create honors terminal — NSFW = immediate dead-letter', () => {
    expect(computeNightlyIsDead('create', 1, true)).toBe(true);
  });
  it('Create dead-letters at its own (lower) cap of 5', () => {
    expect(computeNightlyIsDead('create', 4, false)).toBe(false);
    expect(computeNightlyIsDead('create', 5, false)).toBe(true);
  });
  it('unknown/null source is treated as non-nightly (honors terminal)', () => {
    expect(computeNightlyIsDead(null, 1, true)).toBe(true);
    expect(computeNightlyIsDead(undefined, 5, false)).toBe(true);
  });
});

describe('shouldForceSafeScene (L4)', () => {
  it('lets the early attempts try a real character dream', () => {
    expect(shouldForceSafeScene(0)).toBe(false);
    expect(shouldForceSafeScene(SAFE_SCENE_AFTER_ATTEMPTS - 1)).toBe(false);
  });
  it('forces the safe scene once attempts reach the threshold', () => {
    expect(shouldForceSafeScene(SAFE_SCENE_AFTER_ATTEMPTS)).toBe(true);
    expect(shouldForceSafeScene(8)).toBe(true);
  });
  it('treats null/undefined attempt_count as 0 (no force)', () => {
    expect(shouldForceSafeScene(null)).toBe(false);
    expect(shouldForceSafeScene(undefined)).toBe(false);
  });
});

describe('dreamFailedNotification (L6 — never-silent)', () => {
  it('a NIGHTLY miss uses the nightly_failed subtype + goodwill copy', () => {
    const n = dreamFailedNotification('job-1', 'user-1', true, 'nightly');
    expect(n.type).toBe('dream_failed');
    expect(n.subtype).toBe('nightly_failed');
    expect(n.body.toLowerCase()).toContain('sparkle'); // goodwill mentioned
    expect(n.body.toLowerCase()).not.toContain('tweak'); // NOT the Create "tweak the prompt" copy
    expect(n).toMatchObject({ recipient_id: 'user-1', reference_id: 'job-1' });
  });
  it('a Create NSFW rejection stays subtype rejected', () => {
    expect(dreamFailedNotification('j', 'u', true, 'create').subtype).toBe('rejected');
    expect(dreamFailedNotification('j', 'u', true).subtype).toBe('rejected'); // no source arg = Create
  });
  it('a Create render/infra failure stays subtype failed', () => {
    expect(dreamFailedNotification('j', 'u', false, 'create').subtype).toBe('failed');
  });
});
