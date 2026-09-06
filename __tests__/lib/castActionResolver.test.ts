/** resolveCastAction — the precedence table, locked (refactor §11.3; behaviour-neutral vs the inline chain). */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import {
  resolveCastAction,
  DUAL_ACTIVE_ANCHOR,
  SOLO_ACTIVE_ANCHOR,
} from '@engine/castActionResolver';
import type { CastActionInputs } from '@engine/castActionResolver';
import { DUAL_STANCES } from '@engine/dualStances';

const pools = {
  companion: ['companion A'],
  partner: ['partner A', 'partner B'],
  playful: ['playful A', 'playful B'],
  dynamic: ['dynamic A'],
};
const base: CastActionInputs = {
  castCount: 2,
  forceAction: null,
  dualActiveScene: false,
  soloActiveScene: false,
  bespokePoolName: null,
  bespokePoses: [],
  sceneKind: null,
  hasSpecialScene: false,
  hasSpecialWardrobe: false,
  plusOneRelationship: 'wife',
  activePose: null,
  activeSinglePose: null,
  locationAction: null,
  dualAction: 'classic dual',
  singleAction: 'classic single',
  classicDualPools: pools,
  classicSoloCandid: ['candid A', 'candid B'],
  sfaRoll: false,
  sfaKind: 'location',
  holidayCategory: null,
  holidayPool: null,
  registerKey: null,
  rollRegisters: false,
  rng: () => 0,
};

describe('resolveCastAction — precedence (couples)', () => {
  it('force_action wins over everything', () => {
    expect(
      resolveCastAction({
        ...base,
        forceAction: 'forced',
        dualActiveScene: true,
        bespokePoses: ['b'],
      }).action
    ).toBe('forced');
  });
  it('active row → the fixed mid-action anchor, no stamps', () => {
    const r = resolveCastAction({ ...base, dualActiveScene: true, bespokePoses: ['b'] });
    expect(r.action).toBe(DUAL_ACTIVE_ANCHOR);
    expect(r.stamps).toEqual([]);
  });
  it('bespoke pose_pool beats the kind pools and stamps the pool name', () => {
    const r = resolveCastAction({
      ...base,
      bespokePoolName: 'glamour',
      bespokePoses: ['glam A', 'glam B'],
      sceneKind: 'goofy',
    });
    expect(r.action).toBe('glam A');
    expect(r.stamps).toEqual(['bespoke_pose:glamour']);
  });
  it('goofy → playful pool; elegant (special wardrobe) → partner pool; special scene without wardrobe → playful', () => {
    expect(pools.playful).toContain(
      resolveCastAction({
        ...base,
        sceneKind: 'goofy',
        hasSpecialScene: true,
        hasSpecialWardrobe: true,
      }).action
    );
    expect(pools.partner).toContain(
      resolveCastAction({
        ...base,
        sceneKind: 'elegant',
        hasSpecialScene: true,
        hasSpecialWardrobe: true,
      }).action
    );
    expect(pools.playful).toContain(resolveCastAction({ ...base, hasSpecialScene: true }).action);
  });
  it('location: biome ACTIVE pose ?? Option B beat ?? classic pick', () => {
    expect(
      resolveCastAction({ ...base, activePose: 'jetski', locationAction: 'beat' }).action
    ).toBe('jetski');
    expect(resolveCastAction({ ...base, locationAction: 'beat' }).action).toBe('beat');
    expect(resolveCastAction(base).action).toBe('classic dual');
  });
});

describe('resolveCastAction — precedence (solo)', () => {
  const solo: CastActionInputs = { ...base, castCount: 1 };
  it('active row → solo anchor', () =>
    expect(resolveCastAction({ ...solo, soloActiveScene: true }).action).toBe(SOLO_ACTIVE_ANCHOR));
  it('bespoke pool → stamped _solo', () => {
    const r = resolveCastAction({ ...solo, bespokePoolName: 'glamour', bespokePoses: ['g'] });
    expect(r).toMatchObject({ action: 'g', stamps: ['bespoke_pose_solo:glamour'] });
  });
  it('location: active single pose ?? Option B ?? classic ?? null', () => {
    expect(
      resolveCastAction({ ...solo, activeSinglePose: 'surf', locationAction: 'beat' }).action
    ).toBe('surf');
    expect(resolveCastAction({ ...solo, locationAction: 'beat' }).action).toBe('beat');
    expect(resolveCastAction(solo).action).toBe('classic single');
    expect(resolveCastAction({ ...solo, singleAction: null }).action).toBeNull();
  });
});

describe('resolveCastAction — scene-first block', () => {
  it('no roll → no authorAction, no stance, pool action untouched', () => {
    const r = resolveCastAction({
      ...base,
      sceneKind: 'elegant',
      hasSpecialScene: true,
      hasSpecialWardrobe: true,
    });
    expect(r.authorAction).toBeNull();
    expect(r.dualStance).toBeNull();
  });
  it('rolled couple on a holiday row: register names the holiday pool, a stance is rolled, registers attach, stamps in order', () => {
    const r = resolveCastAction({
      ...base,
      sceneKind: 'elegant',
      hasSpecialScene: true,
      hasSpecialWardrobe: true,
      sfaRoll: true,
      sfaKind: 'scenario',
      holidayCategory: 'halloween',
      holidayPool: 'witch_cottage',
      registerKey: 'witch_cottage',
      rollRegisters: true,
    });
    expect(r.authorAction?.register).toBe('holiday:halloween / witch_cottage');
    expect(r.dualStance?.key).toBe(DUAL_STANCES[0].key); // rng 0 → first stance
    expect(r.authorAction?.stance).toBe(DUAL_STANCES[0].text);
    expect(r.authorAction?.registerActions?.length).toBe(6);
    expect(r.authorAction?.exemplars.every((e) => pools.partner.includes(e))).toBe(true);
    expect(r.stamps).toEqual([
      `dual_stance:${DUAL_STANCES[0].key}`,
      'action_register:witch_cottage',
      'scene_action_roll',
    ]);
    // the pool pose is still computed as the fallback
    expect(pools.partner).toContain(r.action);
  });
  it('rolled solo on location: location stamp first, no stance, biome register; unknown key stamps none', () => {
    const r = resolveCastAction({
      ...base,
      castCount: 1,
      sfaRoll: true,
      sfaKind: 'location',
      registerKey: 'tropical_coastal',
      rollRegisters: true,
    });
    expect(r.stamps).toEqual([
      'scene_action_location',
      'action_register:tropical_coastal',
      'scene_action_roll',
    ]);
    expect(r.dualStance).toBeNull();
    expect(r.authorAction?.register).toMatch(/candid travel/);
    expect(r.authorAction?.exemplars.every((e) => ['candid A', 'candid B'].includes(e))).toBe(true);
    const none = resolveCastAction({
      ...base,
      castCount: 1,
      sfaRoll: true,
      sfaKind: 'location',
      registerKey: 'no_such',
      rollRegisters: true,
    });
    expect(none.stamps).toContain('action_register:none:no_such');
    expect(none.authorAction?.registerActions).toBeNull();
  });
  it('registers off → no register stamp, registerActions null', () => {
    const r = resolveCastAction({
      ...base,
      castCount: 1,
      sfaRoll: true,
      sfaKind: 'scenario',
      sceneKind: 'goofy',
      registerKey: 'goofy',
      rollRegisters: false,
    });
    expect(r.stamps).toEqual(['scene_action_roll']);
    expect(r.authorAction?.registerActions).toBeNull();
    expect(r.authorAction?.register).toBe('goofy / playful fun');
  });
});
