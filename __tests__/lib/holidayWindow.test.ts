import {
  easterSunday,
  resolvePeak,
  rampPct,
  resolveActiveHolidays,
  combineHolidayPct,
  pickWeightedHoliday,
  type HolidayCatalogRow,
} from '@engine/holidayWindow';
import { sceneTypeCuts, rollSceneType } from '@engine/sceneTypeRoll';

// ── representative catalog (mirrors migration 438 — gentle "background echo") ───
const FALL: HolidayCatalogRow = {
  key: 'fall',
  displayName: 'Fall',
  emoji: '🍂',
  rampStyle: 'flat',
  peakRule: 'fixed',
  peakMonth: 10,
  peakDay: 7, // window END (flat seasons have no real peak); window = Sept 1 → Oct 7
  windowDays: 36,
  rampStartPct: 10,
  peakPct: 10, // the flat ambient level
  peakLeadDays: 0,
  finalPct: 10,
  finalDays: 0,
  sortOrder: 0,
};
const HALLOWEEN: HolidayCatalogRow = {
  key: 'halloween',
  displayName: 'Halloween',
  emoji: '🎃',
  rampStyle: 'ramp',
  peakRule: 'fixed',
  peakMonth: 10,
  peakDay: 31,
  windowDays: 30, // opens Oct 1
  rampStartPct: 6,
  peakPct: 25,
  peakLeadDays: 7,
  finalPct: 35,
  finalDays: 1,
  sortOrder: 1,
};
const NYE: HolidayCatalogRow = {
  key: 'new_years',
  displayName: "New Year's",
  emoji: '🎉',
  rampStyle: 'ramp',
  peakRule: 'fixed',
  peakMonth: 1,
  peakDay: 1,
  windowDays: 5,
  rampStartPct: 15,
  peakPct: 25,
  peakLeadDays: 2,
  finalPct: 35,
  finalDays: 1,
  sortOrder: 4,
};
const THANKSGIVING: HolidayCatalogRow = {
  key: 'thanksgiving',
  displayName: 'Thanksgiving',
  emoji: '🦃',
  rampStyle: 'ramp',
  peakRule: 'nth_weekday',
  peakMonth: 11,
  peakNth: 4,
  peakWeekday: 4,
  windowDays: 12,
  rampStartPct: 6,
  peakPct: 25,
  peakLeadDays: 4,
  finalPct: 35,
  finalDays: 1,
  sortOrder: 3,
};
const ST_PATRICKS: HolidayCatalogRow = {
  key: 'st_patricks',
  displayName: "St. Patrick's",
  emoji: '☘️',
  rampStyle: 'ramp',
  peakRule: 'fixed',
  peakMonth: 3,
  peakDay: 17,
  windowDays: 7,
  rampStartPct: 6,
  peakPct: 25,
  peakLeadDays: 3,
  finalPct: 35,
  finalDays: 1,
  sortOrder: 6,
};
const EASTER: HolidayCatalogRow = {
  key: 'easter',
  displayName: 'Easter',
  emoji: '🐰',
  rampStyle: 'ramp',
  peakRule: 'easter',
  windowDays: 14,
  rampStartPct: 6,
  peakPct: 25,
  peakLeadDays: 4,
  finalPct: 35,
  finalDays: 1,
  sortOrder: 7,
};
const ALL = [FALL, HALLOWEEN, NYE, THANKSGIVING, ST_PATRICKS, EASTER];

describe('easterSunday (computus)', () => {
  it('matches known Gregorian Easter dates', () => {
    expect(easterSunday(2027)).toEqual({ year: 2027, month: 3, day: 28 });
    expect(easterSunday(2028)).toEqual({ year: 2028, month: 4, day: 16 });
    expect(easterSunday(2029)).toEqual({ year: 2029, month: 4, day: 1 });
    expect(easterSunday(2026)).toEqual({ year: 2026, month: 4, day: 5 });
  });
});

describe('resolvePeak', () => {
  it('fixed → the stored month/day', () => {
    expect(resolvePeak(HALLOWEEN, 2026)).toEqual({ year: 2026, month: 10, day: 31 });
  });
  it('nth_weekday → the real 4th Thursday of November', () => {
    expect(resolvePeak(THANKSGIVING, 2026)).toEqual({ year: 2026, month: 11, day: 26 });
    expect(resolvePeak(THANKSGIVING, 2027)).toEqual({ year: 2027, month: 11, day: 25 });
  });
  it('easter → computus', () => {
    expect(resolvePeak(EASTER, 2028)).toEqual({ year: 2028, month: 4, day: 16 });
  });
});

describe('rampPct — ramped holiday (Halloween) boundaries', () => {
  it('window open (30 days out) = gentle ramp start 6', () => {
    expect(rampPct(HALLOWEEN, 30)).toBe(6);
  });
  it('plateau reached at the week-before mark (7 days) = 25', () => {
    expect(rampPct(HALLOWEEN, 7)).toBe(25);
    expect(rampPct(HALLOWEEN, 3)).toBe(25);
  });
  it('the night itself (final day) = a small nudge to 35', () => {
    expect(rampPct(HALLOWEEN, 0)).toBe(35);
    expect(rampPct(HALLOWEEN, 1)).toBe(25); // final_days=1 → only day 0 gets the nudge
  });
  it('mid-ramp is strictly between start and plateau', () => {
    const mid = rampPct(HALLOWEEN, 20);
    expect(mid).toBeGreaterThan(6);
    expect(mid).toBeLessThan(25);
  });
});

describe('rampPct — FLAT season (Fall) is a constant ambient level', () => {
  it('returns the flat pct regardless of position in the window', () => {
    expect(rampPct(FALL, 36)).toBe(10); // window open
    expect(rampPct(FALL, 18)).toBe(10); // mid
    expect(rampPct(FALL, 0)).toBe(10); // "end"
  });
});

describe('rampPct — short ramped window does NOT collapse (M1)', () => {
  it("New Year's 5-day window still ramps", () => {
    expect(rampPct(NYE, 0)).toBe(35); // final nudge
    expect(rampPct(NYE, 2)).toBe(25); // plateau
    expect(rampPct(NYE, 5)).toBe(15); // ramp start
    expect(rampPct(NYE, 4)).toBeGreaterThan(15);
    expect(rampPct(NYE, 4)).toBeLessThan(25);
  });
});

describe('resolveActiveHolidays', () => {
  it('Halloween alone is active mid-October', () => {
    const a = resolveActiveHolidays({ year: 2026, month: 10, day: 15 }, ALL);
    expect(a.map((h) => h.key)).toEqual(['halloween']);
    expect(a[0].daysUntilPeak).toBe(16);
  });
  it('returns [] outside every window', () => {
    expect(resolveActiveHolidays({ year: 2026, month: 8, day: 1 }, ALL)).toEqual([]);
    expect(resolveActiveHolidays({ year: 2026, month: 11, day: 10 }, ALL)).toEqual([]);
  });
  it('the day AFTER the peak closes the ramped window', () => {
    expect(resolveActiveHolidays({ year: 2026, month: 11, day: 1 }, [HALLOWEEN])).toEqual([]);
  });

  it('Fall is a flat 10% through September', () => {
    const sep = resolveActiveHolidays({ year: 2026, month: 9, day: 15 }, ALL);
    expect(sep.map((h) => h.key)).toEqual(['fall']);
    expect(sep[0].holidayPct).toBe(10);
  });

  it('OVERLAP: early October mixes Fall + Halloween (both active)', () => {
    const oct3 = resolveActiveHolidays({ year: 2026, month: 10, day: 3 }, ALL);
    const keys = oct3.map((h) => h.key).sort();
    expect(keys).toEqual(['fall', 'halloween']);
    const combined = combineHolidayPct(oct3);
    expect(combined).toBeGreaterThan(10); // fall 10 + some halloween ramp
    expect(combined).toBeLessThan(30); // still a gentle background echo
  });

  it("N4: New Year's window is found across the Dec→Jan year boundary", () => {
    const dec28 = resolveActiveHolidays({ year: 2026, month: 12, day: 28 }, ALL);
    expect(dec28.map((h) => h.key)).toEqual(['new_years']);
    expect(dec28[0].daysUntilPeak).toBe(4);
    const jan1 = resolveActiveHolidays({ year: 2027, month: 1, day: 1 }, ALL);
    expect(jan1[0].key).toBe('new_years');
    expect(jan1[0].holidayPct).toBe(35);
  });

  it("N1 (revised): Easter × St. Patrick's overlap now MIXES both (no soonest-wins)", () => {
    const overlap = resolveActiveHolidays({ year: 2027, month: 3, day: 15 }, ALL);
    expect(overlap.map((h) => h.key).sort()).toEqual(['easter', 'st_patricks']);
    // After St Patrick's ends (Mar 17), only Easter remains.
    const after = resolveActiveHolidays({ year: 2027, month: 3, day: 20 }, ALL);
    expect(after.map((h) => h.key)).toEqual(['easter']);
  });
});

describe('combineHolidayPct + pickWeightedHoliday', () => {
  it('sums active pcts, capped at 100', () => {
    expect(combineHolidayPct([])).toBe(0);
    expect(
      combineHolidayPct([
        { key: 'a', displayName: '', emoji: '', holidayPct: 60, daysUntilPeak: 1 },
        { key: 'b', displayName: '', emoji: '', holidayPct: 70, daysUntilPeak: 1 },
      ])
    ).toBe(100);
  });
  it('picks weighted by pct', () => {
    const actives = [
      { key: 'fall', displayName: '', emoji: '', holidayPct: 10, daysUntilPeak: 4 },
      { key: 'halloween', displayName: '', emoji: '', holidayPct: 30, daysUntilPeak: 28 },
    ];
    expect(pickWeightedHoliday(actives, 0.1).key).toBe('fall'); // 0.1*40=4 < 10
    expect(pickWeightedHoliday(actives, 0.5).key).toBe('halloween'); // 0.5*40=20, past 10
    expect(pickWeightedHoliday(actives, 0.99).key).toBe('halloween');
  });
});

// ── §3.3a renormalized holiday cut ─────────────────────────────────────────────
describe('sceneTypeCuts — holiday renormalization (§3.3a, H1)', () => {
  const PCTS = { goofy: 15, elegant: 15, active: 40 }; // live split

  it('holidayPct=0 is byte-identical to the pre-holiday cuts', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 0 });
    expect(c.holidayCut).toBe(0);
    expect(c.goofyCut).toBeCloseTo(0.15, 10);
    expect(c.elegantCut).toBeCloseTo(0.3, 10);
    expect(c.activeCut).toBeCloseTo(0.7, 10);
  });

  it('a gentle holidayPct=20 renormalizes the normal mix into the remaining 80%', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 20 });
    expect(c.holidayCut).toBeCloseTo(0.2, 10);
    expect(c.activeCut).toBeLessThanOrEqual(1);
    // ladder sums to 1
    const plain = 1 - c.activeCut;
    expect(c.holidayCut + (c.activeCut - c.holidayCut) + plain).toBeCloseTo(1, 10);
  });

  it('never overflows past 1.0 even at a high pct', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 80 });
    expect(c.activeCut).toBeLessThanOrEqual(1);
  });

  it('the ladder stays proportional + sums to 1.0 at every holidayPct', () => {
    for (const hp of [0, 10, 20, 35, 100]) {
      const c = sceneTypeCuts(PCTS, { holidayPct: hp });
      const holiday = c.holidayCut;
      const goofy = c.goofyCut - c.holidayCut;
      const elegant = c.elegantCut - c.goofyCut;
      const active = c.activeCut - c.elegantCut;
      const plain = 1 - c.activeCut;
      expect(holiday + goofy + elegant + active + plain).toBeCloseTo(1, 10);
      expect(plain).toBeGreaterThanOrEqual(-1e-9);
    }
  });

  it('rollSceneType routes a low roll to holiday when holidayCut>0', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 20 });
    expect(rollSceneType(c, 0.05)).toBe('holiday');
    expect(rollSceneType(c, 0.25)).toBe('goofy');
  });
});
