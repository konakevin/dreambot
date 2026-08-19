import {
  easterSunday,
  resolvePeak,
  rampPct,
  resolveActiveHoliday,
  type HolidayCatalogRow,
} from '@engine/holidayWindow';
import { sceneTypeCuts, rollSceneType } from '@engine/sceneTypeRoll';

// ── representative catalog (mirrors HOLIDAY_DREAMS_PLAN.md §9) ──────────────────
const HALLOWEEN: HolidayCatalogRow = {
  key: 'halloween',
  displayName: 'Halloween',
  emoji: '🎃',
  peakRule: 'fixed',
  peakMonth: 10,
  peakDay: 31,
  windowDays: 46,
  rampStartPct: 30,
  peakPct: 80,
  peakLeadDays: 7,
  finalPct: 100,
  finalDays: 3,
  sortOrder: 1,
};
const NYE: HolidayCatalogRow = {
  key: 'new_years',
  displayName: "New Year's",
  emoji: '🎉',
  peakRule: 'fixed',
  peakMonth: 1,
  peakDay: 1,
  windowDays: 5,
  rampStartPct: 60,
  peakPct: 80,
  peakLeadDays: 2,
  finalPct: 100,
  finalDays: 1,
  sortOrder: 3,
};
const THANKSGIVING: HolidayCatalogRow = {
  key: 'thanksgiving',
  displayName: 'Thanksgiving',
  emoji: '🦃',
  peakRule: 'nth_weekday',
  peakMonth: 11,
  peakNth: 4,
  peakWeekday: 4,
  windowDays: 12,
  rampStartPct: 50,
  peakPct: 80,
  peakLeadDays: 4,
  finalPct: 100,
  finalDays: 2,
  sortOrder: 4,
};
const ST_PATRICKS: HolidayCatalogRow = {
  key: 'st_patricks',
  displayName: "St. Patrick's",
  emoji: '☘️',
  peakRule: 'fixed',
  peakMonth: 3,
  peakDay: 17,
  windowDays: 7,
  rampStartPct: 50,
  peakPct: 80,
  peakLeadDays: 3,
  finalPct: 100,
  finalDays: 1,
  sortOrder: 5,
};
const EASTER: HolidayCatalogRow = {
  key: 'easter',
  displayName: 'Easter',
  emoji: '🐰',
  peakRule: 'easter',
  windowDays: 14,
  rampStartPct: 40,
  peakPct: 80,
  peakLeadDays: 4,
  finalPct: 100,
  finalDays: 2,
  sortOrder: 6,
};
const ALL = [HALLOWEEN, NYE, THANKSGIVING, ST_PATRICKS, EASTER];

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

describe('rampPct — Halloween boundaries', () => {
  it('window open (46 days out) = ramp start 30', () => {
    expect(rampPct(HALLOWEEN, 46)).toBe(30);
  });
  it('plateau reached at the week-before mark (7 days) = 80', () => {
    expect(rampPct(HALLOWEEN, 7)).toBe(80);
    expect(rampPct(HALLOWEEN, 3)).toBe(80); // Oct 28 still plateau
  });
  it('final 3 days (2/1/0 days out) = 100', () => {
    expect(rampPct(HALLOWEEN, 2)).toBe(100);
    expect(rampPct(HALLOWEEN, 1)).toBe(100);
    expect(rampPct(HALLOWEEN, 0)).toBe(100);
  });
  it('mid-ramp is strictly between start and plateau, monotonic', () => {
    const mid = rampPct(HALLOWEEN, 20);
    expect(mid).toBeGreaterThan(30);
    expect(mid).toBeLessThan(80);
    expect(rampPct(HALLOWEEN, 10)).toBeGreaterThan(rampPct(HALLOWEEN, 30));
  });
});

describe('rampPct — short window does NOT collapse (M1)', () => {
  it("New Year's 5-day window still ramps", () => {
    expect(rampPct(NYE, 0)).toBe(100); // Jan 1
    expect(rampPct(NYE, 2)).toBe(80); // plateau (peakLead 2)
    expect(rampPct(NYE, 5)).toBe(60); // window open = ramp start
    expect(rampPct(NYE, 4)).toBeGreaterThan(60);
    expect(rampPct(NYE, 4)).toBeLessThan(80);
  });
});

describe('resolveActiveHoliday', () => {
  it('Halloween is active mid-window', () => {
    const a = resolveActiveHoliday({ year: 2026, month: 10, day: 15 }, ALL);
    expect(a?.key).toBe('halloween');
    expect(a?.daysUntilPeak).toBe(16);
    expect(a?.holidayPct).toBeGreaterThan(30);
    expect(a?.holidayPct).toBeLessThan(80);
  });
  it('is 100% on the holiday itself', () => {
    expect(resolveActiveHoliday({ year: 2026, month: 10, day: 31 }, ALL)?.holidayPct).toBe(100);
  });
  it('returns null outside every window', () => {
    expect(resolveActiveHoliday({ year: 2026, month: 11, day: 5 }, ALL)).toBeNull();
    expect(resolveActiveHoliday({ year: 2026, month: 8, day: 1 }, ALL)).toBeNull();
  });
  it('the day AFTER the peak closes the window', () => {
    expect(resolveActiveHoliday({ year: 2026, month: 11, day: 1 }, [HALLOWEEN])).toBeNull();
  });

  it("N4: New Year's window is found across the Dec→Jan year boundary", () => {
    const dec28 = resolveActiveHoliday({ year: 2026, month: 12, day: 28 }, ALL);
    expect(dec28?.key).toBe('new_years');
    expect(dec28?.daysUntilPeak).toBe(4); // Jan 1 2027 - Dec 28 2026
    const jan1 = resolveActiveHoliday({ year: 2027, month: 1, day: 1 }, ALL);
    expect(jan1?.key).toBe('new_years');
    expect(jan1?.holidayPct).toBe(100);
  });

  it("N1: Easter opening inside St. Patrick's → sooner peak (St. Patrick's) wins", () => {
    // 2027: St Patrick's Mar 10-17, Easter (Mar 28) window opens Mar 14 → overlap Mar 14-17.
    const overlap = resolveActiveHoliday({ year: 2027, month: 3, day: 15 }, ALL);
    expect(overlap?.key).toBe('st_patricks');
    // After St Patrick's ends, Easter takes over.
    const after = resolveActiveHoliday({ year: 2027, month: 3, day: 20 }, ALL);
    expect(after?.key).toBe('easter');
  });

  it('Thanksgiving resolves to the real 4th Thursday, active in its window', () => {
    const tg = resolveActiveHoliday({ year: 2026, month: 11, day: 26 }, ALL);
    expect(tg?.key).toBe('thanksgiving');
    expect(tg?.holidayPct).toBe(100); // peak day
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
    expect(c.activeCut).toBeCloseTo(0.7, 10); // plain = 0.30
  });

  it('holidayPct=30 renormalizes the normal mix into the remaining 70%', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 30 });
    expect(c.holidayCut).toBeCloseTo(0.3, 10);
    expect(c.goofyCut).toBeCloseTo(0.405, 10);
    expect(c.elegantCut).toBeCloseTo(0.51, 10);
    expect(c.activeCut).toBeCloseTo(0.79, 10); // plain = 0.21
    expect(c.activeCut).toBeLessThanOrEqual(1);
  });

  it('holidayPct=80 does NOT overflow past 1.0 (the old footgun)', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 80 });
    expect(c.activeCut).toBeCloseTo(0.94, 10); // NOT 1.5
    expect(c.activeCut).toBeLessThanOrEqual(1);
    expect(c.holidayCut).toBeCloseTo(0.8, 10);
  });

  it('holidayPct=100 → everything is holiday', () => {
    const c = sceneTypeCuts(PCTS, { holidayPct: 100 });
    expect(c.holidayCut).toBe(1);
    expect(rollSceneType(c, 0.0)).toBe('holiday');
    expect(rollSceneType(c, 0.999)).toBe('holiday');
  });

  it('the ladder stays proportional + sums to 1.0 at every holidayPct', () => {
    for (const hp of [0, 30, 80, 100]) {
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
    const c = sceneTypeCuts(PCTS, { holidayPct: 30 });
    expect(rollSceneType(c, 0.1)).toBe('holiday');
    expect(rollSceneType(c, 0.35)).toBe('goofy'); // just past holidayCut 0.30
  });
});
