/**
 * No outfit lock (NIGHTLY_OUTFIT_VARIETY_PLAN.md, 2026-09-30). Kevin: "we absolutely do not want outfit lock or freeze
 * due to certain settings or biomes" (two of five nightlies in the same navy brass-button jacket).
 *
 * Locks: the favoured-look rate is a parameter (config, default 30, was a fixed 85); recent looks are skipped but never
 * empty a pool; the stamp parser the nightly memory reads; nightly rolls Create's full plan when the switch is on, never
 * on a holiday row, and passes the anti-lock tuning to every look roll.
 */
import fs from 'fs';
import path from 'path';
import {
  rollFashion,
  lookFits,
  MEN_FASHION_LOOKS,
  planOutfits,
  recentLooksFromStamps,
  DEFAULT_FAVOURED_LOOK_PCT,
  DEFAULT_OUTFIT_ROLLS,
} from '@engine/outfitPlan';
import { DEFAULT_ENGINE_CONFIG } from '@engine/engineConfig';

// A deterministic rng so each count is exact, not flaky.
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PIER = { setting: 'beach' as const, text: 'Myrtle Beach boardwalk pier' };
/** Every men's look that fits the pier (from the catalog, so adding beach looks never breaks these counts). */
const PIER_MEN = MEN_FASHION_LOOKS.filter((l) => lookFits(l, PIER.setting, PIER.text)).map(
  (l) => l.key
);
const manLook = (tuning: Parameters<typeof rollFashion>[5], seed: number): string | null => {
  const r = rollFashion(['self'], { self: 'male' }, undefined, seeded(seed), PIER, tuning);
  return r[0] ? r[0].look.key : null;
};
const share = (tuning: Parameters<typeof rollFashion>[5], key: string, n = 400): number => {
  let hit = 0;
  for (let i = 0; i < n; i++) if (manLook(tuning, i + 1) === key) hit++;
  return hit / n;
};

describe('favoured-look rate', () => {
  it('defaults to 30 in config (the old fixed 85 locked a pier to nautical)', () => {
    expect(DEFAULT_FAVOURED_LOOK_PCT).toBe(30);
    expect(DEFAULT_ENGINE_CONFIG.outfitFavouredLookPct).toBe(30);
  });
  it('100 always takes the look the scene names; 0 leaves it one of the place looks', () => {
    expect(share({ favouredPct: 100 }, 'nautical')).toBe(1);
    const zero = share({ favouredPct: 0 }, 'nautical');
    expect(zero).toBeGreaterThan(0.1);
    expect(zero).toBeLessThan(0.4); // one of the pier's men's looks
  });
  it('30 takes it far less often than the legacy 85', () => {
    const at30 = share({ favouredPct: 30 }, 'nautical');
    const legacy = share({}, 'nautical');
    expect(at30).toBeLessThan(0.55);
    expect(legacy).toBeGreaterThan(0.8);
  });
});

describe('recent looks', () => {
  it('a recent look is skipped', () => {
    const recent = { self: PIER_MEN.filter((k) => k !== 'coastal') };
    for (let s = 1; s <= 50; s++)
      expect(manLook({ favouredPct: 100, recentLooks: recent }, s)).toBe('coastal');
  });
  it('never empties the pool: all recent → the full fitting pool again', () => {
    const recent = { self: PIER_MEN };
    for (let s = 1; s <= 50; s++) {
      expect(PIER_MEN).toContain(manLook({ recentLooks: recent }, s));
    }
  });
  it('a woman is never FORCED into a recent favoured look', () => {
    for (let s = 1; s <= 80; s++) {
      const r = rollFashion(['p'], { p: 'female' }, undefined, seeded(s), PIER, {
        favouredPct: 100,
        recentLooks: { p: ['nautical'] },
      });
      expect(r[0] && r[0].look.key).not.toBe('nautical');
    }
  });
  it('another role is not affected', () => {
    expect(manLook({ favouredPct: 100, recentLooks: { plus_one: ['nautical'] } }, 3)).toBe(
      'nautical'
    );
  });
});

describe('recentLooksFromStamps (the nightly memory)', () => {
  it('reads garment_roll stamps per role, newest first, deduped, only the first n renders', () => {
    const logs = [
      ['garment_roll:self:none:nautical', 'garment_roll:plus_one:skirt:nautical', 'look:x'],
      ['garment_roll:self:none:surf'],
      null,
      ['garment_roll:self:none:nautical'],
      ['garment_roll:self:none:rocker'],
    ];
    expect(recentLooksFromStamps(logs, 5)).toEqual({
      self: ['nautical', 'surf', 'rocker'],
      plus_one: ['nautical'],
    });
    expect(recentLooksFromStamps(logs, 2)).toEqual({
      self: ['nautical', 'surf'],
      plus_one: ['nautical'],
    });
    expect(recentLooksFromStamps(logs, 0)).toEqual({});
  });
});

describe('planOutfits carries the tuning and a colour for everyone', () => {
  it('a nightly-shaped plan: colour pair, cut, and the look under the tuning', () => {
    const plan = planOutfits(
      ['self', 'plus_one'],
      {
        ...DEFAULT_OUTFIT_ROLLS,
        garmentRoll: true,
        genders: { self: 'male', plus_one: 'female' },
        sceneFit: { looks: true, trim: true, brief: true },
        setting: 'beach',
        sceneText: PIER.text,
        favouredPct: 100,
        recentLooks: { self: ['nautical'] },
      },
      {},
      seeded(7)
    );
    const self = plan.people.find((p) => p.role === 'self')!;
    expect(self.lookKey).not.toBe('nautical');
    for (const p of plan.people) {
      expect(p.colour && p.colour.lead).toBeTruthy();
      expect(p.silhouette).toBeTruthy();
    }
  });
});

describe('nightly wiring (source guard)', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
    'utf8'
  );
  it('the plan is eligible only when rollable and never on a holiday row', () => {
    expect(src).toMatch(
      /outfitPlanEligible\s*=\s*outfitPlanOn && fashionRollable && !\(dualSpecialScene && holidayCategory\)/
    );
    expect(src).toMatch(/force_outfit_plan \?\? engineCfg0\.nightlyOutfitPlan/);
  });
  it('the slot input carries the plan, and the looks-only roll only runs without it', () => {
    expect(src).toMatch(
      /\.\.\.\(nightlyOutfitPlan \? \{ outfitPlan: nightlyOutfitPlan \} : \{\}\)/
    );
    expect(src).toMatch(/!nightlyOutfitPlan && garmentRollOn && fashionRollable/);
  });
  it('both rolls get the anti-lock tuning, read from the recent logs', () => {
    expect(src).toMatch(/\.\.\.lookTuning,/);
    expect(src).toMatch(/:\s*undefined,\s*lookTuning\s*\)/);
    expect(src).toMatch(/select\('rolled_axes, enhanced_prompt, fallback_reasons'\)/);
    expect(src).toMatch(/recentLooksFromStamps\(/);
  });
  it('the plan keeps the garment_roll stamp format the memory reads', () => {
    expect(src).toMatch(
      /`garment_roll:\$\{p\.role\}:\$\{fam \? fam\.key : 'none'\}:\$\{p\.lookKey\}`/
    );
  });
});
