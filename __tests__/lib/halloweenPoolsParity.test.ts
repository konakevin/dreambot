import { HALLOWEEN_POOL_OF_SUB, HALLOWEEN_POOLS, holidayPoolOf } from '@engine/holidayPools';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tax = require('../../scripts/lib/halloweenPools.js');

describe('Halloween pool taxonomy — engine mirror parity (Kevin 2026-09-05)', () => {
  it('engine POOL_OF_SUB equals the tooling taxonomy', () => {
    expect(HALLOWEEN_POOL_OF_SUB).toEqual(tax.POOL_OF_SUB);
    expect(HALLOWEEN_POOLS).toEqual(Object.keys(tax.POOLS));
  });
  it('exactly 13 pools (haunted_house_comedy folded into goofy 2026-09-06); every sub maps to a pool that lists it', () => {
    expect(HALLOWEEN_POOLS).toHaveLength(13);
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
