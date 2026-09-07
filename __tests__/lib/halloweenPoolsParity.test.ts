import {
  FALL_POOL_OF_SUB,
  FALL_POOLS,
  HALLOWEEN_POOL_OF_SUB,
  HALLOWEEN_POOLS,
  holidayPoolOf,
} from '@engine/holidayPools';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tax = require('../../scripts/lib/halloweenPools.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fallTax = require('../../scripts/lib/fallPools.js');

describe('Halloween pool taxonomy — engine mirror parity (Kevin 2026-09-05)', () => {
  it('engine POOL_OF_SUB equals the tooling taxonomy', () => {
    expect(HALLOWEEN_POOL_OF_SUB).toEqual(tax.POOL_OF_SUB);
    expect(HALLOWEEN_POOLS).toEqual(Object.keys(tax.POOLS));
  });
  it('exactly 14 pools (13 after the 2026-09-06 fold + enchanted_harvest_court 2026-09-07); every sub maps to a pool that lists it', () => {
    expect(HALLOWEEN_POOLS).toHaveLength(14);
    for (const [sub, pool] of Object.entries(tax.POOL_OF_SUB))
      expect(tax.POOLS[pool].subs).toContain(sub);
  });
  it('shares always round UP and land at or above 70 per table', () => {
    for (const main of Object.keys(tax.POOLS))
      expect(tax.shareFor(main) * tax.POOLS[main].subs.length).toBeGreaterThanOrEqual(70);
  });
  it('unknown sub_theme falls back to itself, null to __unsorted', () => {
    expect(holidayPoolOf('cozy_porch')).toBe('halloween_neighborhood');
    expect(holidayPoolOf('mystery')).toBe('mystery');
    expect(holidayPoolOf(null)).toBe('__unsorted');
  });
});

describe('Fall pool taxonomy — engine mirror parity (Kevin approved 2026-09-07)', () => {
  it('engine FALL_POOL_OF_SUB equals the tooling taxonomy', () => {
    expect(FALL_POOL_OF_SUB).toEqual(fallTax.POOL_OF_SUB);
    expect(FALL_POOLS).toEqual(Object.keys(fallTax.POOLS));
  });
  it('8 pools; every sub maps to a pool that lists it; no sub name collides with Halloween', () => {
    expect(FALL_POOLS).toHaveLength(8);
    for (const [sub, pool] of Object.entries(fallTax.POOL_OF_SUB))
      expect(fallTax.POOLS[pool].subs).toContain(sub);
    for (const sub of Object.keys(fallTax.SUBS)) expect(tax.SUBS[sub]).toBeUndefined();
  });
  it('demarcation: no Fall pool opts into pumpkins / jack-o-lanterns; Halloween keeps them', () => {
    for (const p of Object.values(fallTax.POOLS)) expect(p.lanterns).toBe(false);
    const lantern = /\b(?:pumpkins?|jack-?o-?-?lanterns?|gourds?)\b/i;
    for (const d of Object.values(fallTax.SUBS))
      expect(lantern.test(d.setting + ' ' + d.costume)).toBe(false);
    expect(Object.values(tax.POOLS).some((p) => p.lanterns)).toBe(true);
  });
  it('shares always round UP and land at or above 70 per table', () => {
    for (const main of Object.keys(fallTax.POOLS))
      expect(fallTax.shareFor(main) * fallTax.POOLS[main].subs.length).toBeGreaterThanOrEqual(70);
  });
  it('holidayPoolOf resolves Fall subs to their pool', () => {
    expect(holidayPoolOf('maple_grove_sunbeams')).toBe('golden_foliage');
    expect(holidayPoolOf('autumn_fae')).toBe('enchanted_harvest_court');
  });
});
