// Locks the nightly scene-TYPE RNG: the cut math (incl. the gendered lean and
// the solo=dual case) + the roll classification + the gender-routing union.
import { sceneTypeCuts, rollSceneType } from '@engine/sceneTypeRoll';
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
