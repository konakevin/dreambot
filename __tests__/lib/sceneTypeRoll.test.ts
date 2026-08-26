// Locks the nightly scene-TYPE RNG: the cut math (incl. the gendered lean and
// the solo=dual case) + the roll classification + the gender-routing union.
import { sceneTypeCuts, rollSceneType, adaptiveScenePcts } from '@engine/sceneTypeRoll';
import { singleScenarioCandidates } from '@engine/pools/singleScenarioLoader';

const SPLIT = { goofy: 15, elegant: 15, active: 40 }; // the live 40/30 config

describe('sceneTypeCuts', () => {
  it('dual (no lean): goofy .15 / elegant .30 / active .70 → plain .30', () => {
    const c = sceneTypeCuts(SPLIT);
    expect(c.goofyCut).toBeCloseTo(0.15);
    expect(c.elegantCut).toBeCloseTo(0.3);
    expect(c.activeCut).toBeCloseTo(0.7);
    expect(1 - c.activeCut).toBeCloseTo(0.3); // plain-location remainder
  });

  it('solo with boost 0 rolls IDENTICALLY to dual (Kevin 2026-08-13)', () => {
    expect(sceneTypeCuts(SPLIT, { genderedBoostPct: 0 })).toEqual(sceneTypeCuts(SPLIT));
  });

  it('gendered boost widens elegant+active by half each, shrinks plain', () => {
    const c = sceneTypeCuts(SPLIT, { genderedBoostPct: 15 });
    expect(c.goofyCut).toBeCloseTo(0.15); // goofy never moves
    expect(c.elegantCut).toBeCloseTo(0.375); // 0.30 + 0.075
    expect(c.activeCut).toBeCloseTo(0.85); // 0.70 + 0.15
    expect(1 - c.activeCut).toBeCloseTo(0.15); // plain 30 → 15
  });

  it('activeEnabled=false folds the active window into plain', () => {
    const c = sceneTypeCuts(SPLIT, { activeEnabled: false });
    expect(c.activeCut).toBeCloseTo(c.elegantCut);
    expect(1 - c.activeCut).toBeCloseTo(0.7);
  });
});

describe('adaptiveScenePcts (location weight scales with places picked)', () => {
  const BASE = { goofy: 15, elegant: 15, active: 20 }; // live config: 50% plain at full weight
  const plainOf = (pcts: { goofy: number; elegant: number; active: number }) =>
    1 - sceneTypeCuts(pcts).activeCut;

  it('0 places → scenarios fill 100%, plain 0% (only fully-formed scenario dreams)', () => {
    const p = adaptiveScenePcts(BASE, 0);
    expect(p.goofy + p.elegant + p.active).toBeCloseTo(100);
    expect(plainOf(p)).toBeCloseTo(0);
  });

  it('at/above the ramp (4 places) → base pcts unchanged, plain = base 50%', () => {
    expect(adaptiveScenePcts(BASE, 4)).toEqual(BASE);
    expect(adaptiveScenePcts(BASE, 25)).toEqual(BASE); // clamped, never exceeds base
    expect(plainOf(adaptiveScenePcts(BASE, 4))).toBeCloseTo(0.5);
  });

  it('halfway (2 of 4 ramp) → plain is half of base = 25%, scenario ratios preserved', () => {
    const p = adaptiveScenePcts(BASE, 2);
    expect(plainOf(p)).toBeCloseTo(0.25);
    expect(p.goofy).toBeCloseTo(p.elegant);
    expect(p.active).toBeGreaterThan(p.goofy);
  });

  it('1 place → low plain (12.5%) so a lone pick is not shown every single night', () => {
    expect(plainOf(adaptiveScenePcts(BASE, 1))).toBeCloseTo(0.125);
  });

  it('negative/garbage placeCount clamps to 0 (plain never negative, never > base)', () => {
    expect(plainOf(adaptiveScenePcts(BASE, -5))).toBeCloseTo(0);
  });

  it('no-op when there is no plain room (scenarios already sum to 100)', () => {
    const full = { goofy: 40, elegant: 30, active: 30 };
    expect(adaptiveScenePcts(full, 2)).toEqual(full);
  });
});

describe('rollSceneType', () => {
  const c = sceneTypeCuts(SPLIT); // .15 / .30 / .70

  it('classifies rolls into the right bucket', () => {
    expect(rollSceneType(c, 0.05)).toBe('goofy');
    expect(rollSceneType(c, 0.2)).toBe('elegant');
    expect(rollSceneType(c, 0.5)).toBe('active');
    expect(rollSceneType(c, 0.9)).toBe('plain');
  });

  it('boundaries are half-open [lower, upper)', () => {
    expect(rollSceneType(c, 0)).toBe('goofy');
    expect(rollSceneType(c, 0.15)).toBe('elegant');
    expect(rollSceneType(c, 0.3)).toBe('active');
    expect(rollSceneType(c, 0.7)).toBe('plain');
  });

  it('empirical distribution matches the cuts over 50k rolls', () => {
    const N = 50000;
    const cnt: Record<string, number> = { goofy: 0, elegant: 0, active: 0, plain: 0 };
    for (let i = 0; i < N; i++) cnt[rollSceneType(c, Math.random())]++;
    expect(cnt.goofy / N).toBeCloseTo(0.15, 1);
    expect(cnt.elegant / N).toBeCloseTo(0.15, 1);
    expect(cnt.active / N).toBeCloseTo(0.4, 1);
    expect(cnt.plain / N).toBeCloseTo(0.3, 1);
  });
});

describe('singleScenarioCandidates (gender routing = any ∪ own-gender)', () => {
  const s = (scene: string) => ({ scene, attire: '' });
  const loaded = {
    goofy: { any: [s('a')], male: [s('m')], female: [s('f')] },
    elegant: { any: [], male: [], female: [] },
    active: { any: [], male: [], female: [] },
  };

  it('female cast pulls any ∪ female, never male', () => {
    const scenes = singleScenarioCandidates(loaded, 'goofy', 'female').map((x) => x.scene);
    expect(scenes).toEqual(expect.arrayContaining(['a', 'f']));
    expect(scenes).not.toContain('m');
  });

  it('male cast pulls any ∪ male, never female', () => {
    const scenes = singleScenarioCandidates(loaded, 'goofy', 'male').map((x) => x.scene);
    expect(scenes).toEqual(expect.arrayContaining(['a', 'm']));
    expect(scenes).not.toContain('f');
  });

  it('unknown gender pulls only the any pool', () => {
    expect(singleScenarioCandidates(loaded, 'goofy', null).map((x) => x.scene)).toEqual(['a']);
  });
});
