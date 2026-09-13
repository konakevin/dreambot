/** resolveCastAction — the precedence table, locked (refactor §11.3; behaviour-neutral vs the inline chain). */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import {
  resolveCastAction,
  DUAL_ACTIVE_ANCHOR,
  SOLO_ACTIVE_ANCHOR,
} from '@engine/castActionResolver';
import type { CastActionInputs } from '@engine/castActionResolver';
import { DUAL_STANCES, DUAL_STANCES_WIDE } from '@engine/dualStances';
import { DUAL_STANCES_LOOKS, DUAL_STANCES_LOOKS_FLUX } from '@engine/castActionResolver';
import { DUAL_STANCES_WIDE_FLUX_SAFE } from '@engine/dualStances';

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

/** Register-OWNED stances (2026-09-08): the day-of register's stance list replaces the generic roll. */
import { ACTION_REGISTERS } from '@engine/actionRegisters';
describe('resolveCastAction — register-owned stances', () => {
  const rolled = {
    ...base,
    sceneKind: 'elegant' as const,
    hasSpecialScene: true,
    hasSpecialWardrobe: true,
    sfaRoll: true,
    sfaKind: 'scenario' as const,
    holidayCategory: 'halloween',
    holidayPool: 'halloween_day_of',
    registerKey: 'halloween_day_of',
  };
  it('a register with stances supplies the couple stance (rng 0 → its first) and its text rides the brief', () => {
    const r = resolveCastAction({ ...rolled, rollRegisters: true });
    const own = ACTION_REGISTERS.halloween_day_of.stances![0];
    expect(r.dualStance?.key).toBe(own.key);
    expect(r.authorAction?.stance).toBe(own.text);
    expect(r.stamps).toEqual([
      `dual_stance:${own.key}`,
      'action_register:halloween_day_of',
      'scene_action_roll',
    ]);
  });
  it('registers off → the generic stance set, exactly as before', () => {
    const r = resolveCastAction({ ...rolled, rollRegisters: false });
    expect(r.dualStance?.key).toBe(DUAL_STANCES[0].key);
  });
  it('a register WITHOUT stances → the generic set', () => {
    const r = resolveCastAction({
      ...rolled,
      holidayPool: 'witch_cottage',
      registerKey: 'witch_cottage',
      rollRegisters: true,
    });
    expect(ACTION_REGISTERS.witch_cottage.stances).toBeUndefined();
    expect(r.dualStance?.key).toBe(DUAL_STANCES[0].key);
  });
});

describe('wideStances (looks path, 2026-09-12)', () => {
  it('rolls the WIDE stance set for couples and stamps it; the generic set is untouched otherwise', () => {
    const wide = resolveCastAction({
      ...base,
      castCount: 2,
      sfaRoll: true,
      rollRegisters: false,
      wideStances: true,
      rng: () => 0,
    });
    expect(wide.dualStance).not.toBeNull();
    // 1.2.0-parity: the looks path rolls the generic set + the wide set as ONE list
    expect(DUAL_STANCES_LOOKS.some((s) => s.key === wide.dualStance!.key)).toBe(true);
    expect(DUAL_STANCES_LOOKS.length).toBe(DUAL_STANCES.length + DUAL_STANCES_WIDE.length);
    expect(wide.stamps).toContain('wide_stances');
    const legacy = resolveCastAction({
      ...base,
      castCount: 2,
      sfaRoll: true,
      rollRegisters: false,
      rng: () => 0,
    });
    expect(DUAL_STANCES.some((s) => s.key === legacy.dualStance!.key)).toBe(true);
    expect(legacy.stamps).not.toContain('wide_stances');
  });
});

describe('elegant-row solos → portrait pool (parity loop round 7)', () => {
  const solo: CastActionInputs = {
    ...base,
    castCount: 1,
    sceneKind: 'elegant',
    hasSpecialScene: true,
    hasSpecialWardrobe: true,
    classicSoloPortrait: ['portrait A', 'portrait B'],
  };
  it('70% of elegant solos take a portrait pose and stamp it; the rest keep the pre-picked classic pose', () => {
    const r = resolveCastAction({ ...solo, rng: () => 0.1 });
    expect(['portrait A', 'portrait B']).toContain(r.action);
    expect(r.stamps).toContain('elegant_portrait_pool');
    const miss = resolveCastAction({ ...solo, rng: () => 0.9 });
    expect(miss.action).toBe('classic single');
    expect(miss.stamps).not.toContain('elegant_portrait_pool');
  });
  it('goofy rows, plain locations and the legacy path (no portrait pool) are untouched', () => {
    expect(resolveCastAction({ ...solo, sceneKind: 'goofy', rng: () => 0.1 }).action).toBe(
      'classic single'
    );
    expect(resolveCastAction({ ...solo, hasSpecialScene: false, rng: () => 0.1 }).action).toBe(
      'classic single'
    );
    expect(
      resolveCastAction({ ...solo, classicSoloPortrait: undefined, rng: () => 0.1 }).action
    ).toBe('classic single');
  });
});

describe('flux-safe wide stances (flux couple parity, 2026-09-13)', () => {
  it('the subset is the symmetric feet-on-the-ground five; fluxWideStances rolls generic + subset and stamps it', () => {
    expect(DUAL_STANCES_WIDE_FLUX_SAFE.map((s) => s.key).sort()).toEqual([
      'mid_laugh_open',
      'paused_path',
      'rail_pair',
      'seated_steps',
      'stand_open',
    ]);
    expect(DUAL_STANCES_LOOKS_FLUX.length).toBe(5); // the mid-shot symmetric list
    const keys = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const r = resolveCastAction({
        ...base,
        castCount: 2,
        sfaRoll: true,
        rollRegisters: false,
        wideStances: true,
        fluxWideStances: true,
        rng: () => (i % 100) / 100,
      });
      keys.add(r.dualStance!.key);
      expect(r.stamps).toContain('flux_wide_stances');
      expect(r.stamps).not.toContain('wide_stances');
    }
    expect(keys.has('step_up')).toBe(false);
    expect(keys.has('bench_ends')).toBe(false);
    expect(keys.has('column_lean')).toBe(false);
    expect(keys.has('rail_pair')).toBe(true);
    expect(keys.has('seated_steps')).toBe(false);
  });
});

describe('flux couple stances on active rows and pool renders (arm H)', () => {
  it('an active row takes a symmetric stance instead of the generic anchor; pool renders take one at the share', () => {
    const active = resolveCastAction({
      ...base,
      dualActiveScene: true,
      fluxStanceShare: 0.5,
      rng: () => 0.1,
    });
    expect(active.action).not.toBe(DUAL_ACTIVE_ANCHOR);
    expect(active.stamps.some((s) => s.startsWith('flux_stance:active:'))).toBe(true);
    const pool = resolveCastAction({ ...base, fluxStanceShare: 0.5, rng: () => 0.2 });
    expect(pool.stamps.some((s) => s.startsWith('flux_stance:pool:'))).toBe(true);
    expect(pool.action).not.toBe('classic dual');
    const miss = resolveCastAction({ ...base, fluxStanceShare: 0.5, rng: () => 0.9 });
    expect(miss.action).toBe('classic dual');
    const off = resolveCastAction({ ...base, dualActiveScene: true, rng: () => 0.1 });
    expect(off.action).toBe(DUAL_ACTIVE_ANCHOR);
  });
});
