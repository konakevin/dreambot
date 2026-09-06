/** decideSceneFirst / sceneFirstRegister — every branch (SCENE_FIRST_ACTION_PLAN.md §10.2). */
import { decideSceneFirst, sceneFirstRegister } from '@engine/sceneFirstEligibility';
import type { SceneFirstInput } from '@engine/sceneFirstEligibility';

const base: SceneFirstInput = {
  kind: 'scenario',
  activePoseFired: false,
  bespokePool: false,
  forceAction: false,
  forceSceneAction: false,
  pctScenario: 100,
  pctLocation: 0,
  castCount: 1,
  allowLocationCouples: false,
  rng: () => 0.5,
};

describe('decideSceneFirst', () => {
  it('seeded row at 100% rolls', () =>
    expect(decideSceneFirst(base)).toEqual({ roll: true, reason: 'rolled' }));
  it('active row never rolls (the seed carries the verb), even when forced', () => {
    expect(decideSceneFirst({ ...base, kind: 'active' })).toEqual({
      roll: false,
      reason: 'active_scene',
    });
    expect(decideSceneFirst({ ...base, kind: 'active', forceSceneAction: true }).roll).toBe(false);
  });
  it('explicit force_action wins over everything except active', () => {
    expect(decideSceneFirst({ ...base, forceAction: true, forceSceneAction: true })).toEqual({
      roll: false,
      reason: 'force_action',
    });
  });
  it('a fired biome ACTIVE pose keeps precedence (curated, swap-safe)', () => {
    expect(
      decideSceneFirst({ ...base, kind: 'location', pctLocation: 100, activePoseFired: true })
    ).toEqual({ roll: false, reason: 'active_pose' });
  });
  it('a row naming a bespoke pose_pool keeps its pool', () => {
    expect(decideSceneFirst({ ...base, bespokePool: true })).toEqual({
      roll: false,
      reason: 'bespoke_pool',
    });
  });
  it('force_scene_action rolls when eligible regardless of pct', () => {
    expect(decideSceneFirst({ ...base, pctScenario: 0, forceSceneAction: true })).toEqual({
      roll: true,
      reason: 'forced',
    });
    expect(
      decideSceneFirst({ ...base, kind: 'location', pctLocation: 0, forceSceneAction: true })
    ).toEqual({ roll: true, reason: 'forced' });
  });
  it('location uses its OWN knob (seeded knob at 100 does not leak into location)', () => {
    expect(decideSceneFirst({ ...base, kind: 'location' })).toEqual({
      roll: false,
      reason: 'pct_zero',
    });
    expect(decideSceneFirst({ ...base, kind: 'location', pctLocation: 100 })).toEqual({
      roll: true,
      reason: 'rolled',
    });
    expect(
      decideSceneFirst({ ...base, kind: 'scenario', pctScenario: 0, pctLocation: 100 })
    ).toEqual({ roll: false, reason: 'pct_zero' });
  });
  it('location COUPLES are held on the existing path unless allowed (even when forced)', () => {
    expect(decideSceneFirst({ ...base, kind: 'location', pctLocation: 100, castCount: 2 })).toEqual(
      { roll: false, reason: 'location_couple_held' }
    );
    expect(
      decideSceneFirst({ ...base, kind: 'location', castCount: 2, forceSceneAction: true }).roll
    ).toBe(false);
    expect(
      decideSceneFirst({
        ...base,
        kind: 'location',
        pctLocation: 100,
        castCount: 2,
        allowLocationCouples: true,
      }).roll
    ).toBe(true);
    // solos on location and couples on seeded rows are unaffected by the hold
    expect(
      decideSceneFirst({ ...base, kind: 'location', pctLocation: 100, castCount: 1 }).roll
    ).toBe(true);
    expect(decideSceneFirst({ ...base, kind: 'scenario', castCount: 2 }).roll).toBe(true);
  });
  it('pct is a real probability (rng edges)', () => {
    expect(decideSceneFirst({ ...base, pctScenario: 25, rng: () => 0.24 }).roll).toBe(true);
    expect(decideSceneFirst({ ...base, pctScenario: 25, rng: () => 0.25 })).toEqual({
      roll: false,
      reason: 'pct_miss',
    });
    expect(decideSceneFirst({ ...base, pctScenario: 100, rng: () => 0.999 }).roll).toBe(true);
  });
});

describe('sceneFirstRegister', () => {
  it('holiday rows name the holiday and its main pool', () => {
    expect(
      sceneFirstRegister({
        kind: 'scenario',
        holidayCategory: 'halloween',
        holidayPool: 'witch_cottage',
        sceneKind: 'elegant',
      })
    ).toBe('holiday:halloween / witch_cottage');
    expect(
      sceneFirstRegister({
        kind: 'scenario',
        holidayCategory: 'halloween',
        holidayPool: null,
        sceneKind: null,
      })
    ).toBe('holiday:halloween');
  });
  it('goofy / elegant seeded rows', () => {
    expect(
      sceneFirstRegister({
        kind: 'scenario',
        holidayCategory: null,
        holidayPool: null,
        sceneKind: 'goofy',
      })
    ).toBe('goofy / playful fun');
    expect(
      sceneFirstRegister({
        kind: 'scenario',
        holidayCategory: null,
        holidayPool: null,
        sceneKind: 'elegant',
      })
    ).toBe('elegant / refined');
  });
  it('location = candid travel moment', () => {
    expect(
      sceneFirstRegister({
        kind: 'location',
        holidayCategory: null,
        holidayPool: null,
        sceneKind: null,
      })
    ).toMatch(/candid travel moment/);
  });
});
