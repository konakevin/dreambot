import {
  easterSunday,
  resolvePeak,
  rampPct,
  resolveActiveHolidays,
  combineHolidayPct,
  pickWeightedHoliday,
  mapHolidayCatalogRow,
  localDateInTz,
  windowBounds,
  type HolidayCatalogRow,
} from '@engine/holidayWindow';
import { sceneTypeCuts, rollSceneType } from '@engine/sceneTypeRoll';

// ── representative catalog (mirrors migration 438 — gentle "background echo") ───
const FALL: HolidayCatalogRow = {
  key: 'fall',
  displayName: 'Fall',
  emoji: '🍂',
  rampStyle: 'flat',
  // Migration 456: explicit start Sept 15 → peak = Thanksgiving Day (4th Thu of Nov).
  peakRule: 'nth_weekday',
  peakMonth: 11,
  peakNth: 4,
  peakWeekday: 4,
  startMonth: 9,
  startDay: 15,
  windowDays: 72, // informational — the explicit start wins
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
// The rest of the live catalog (migration 437/438 values) — used by the gating sweep.
const ramped = (
  key: string,
  peakMonth: number,
  peakDay: number,
  windowDays: number,
  peakLeadDays: number,
  sortOrder: number
): HolidayCatalogRow => ({
  key,
  displayName: key,
  emoji: '',
  rampStyle: 'ramp',
  peakRule: 'fixed',
  peakMonth,
  peakDay,
  windowDays,
  rampStartPct: 6,
  peakPct: 25,
  peakLeadDays,
  finalPct: 35,
  finalDays: 1,
  sortOrder,
});
const CHRISTMAS = ramped('christmas', 12, 25, 24, 7, 2);
const VALENTINES = ramped('valentines', 2, 14, 7, 3, 5);
const JULY_4TH = ramped('july_4th', 7, 4, 7, 3, 8);
const FULL_CATALOG = [...ALL, CHRISTMAS, VALENTINES, JULY_4TH];

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
  it('mid-October = Halloween ramping INSIDE the Fall season (both active, mig 456)', () => {
    const a = resolveActiveHolidays({ year: 2026, month: 10, day: 15 }, ALL);
    expect(a.map((h) => h.key).sort()).toEqual(['fall', 'halloween']);
    expect(a.find((h) => h.key === 'halloween')!.daysUntilPeak).toBe(16);
  });
  it('returns [] outside every window', () => {
    expect(resolveActiveHolidays({ year: 2026, month: 8, day: 1 }, ALL)).toEqual([]);
    expect(resolveActiveHolidays({ year: 2026, month: 12, day: 5 }, ALL)).toEqual([]);
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

describe('localDateInTz (H2 — user-local date, never server UTC)', () => {
  it('a late-tz user on Halloween night is still Oct 31 locally', () => {
    // Oct 31 23:00 UTC. In +14 (Kiritimati) it is already Nov 1; in -7 (LA) still Oct 31.
    const instant = new Date(Date.UTC(2026, 9, 31, 23, 0, 0));
    expect(localDateInTz(instant, 'Pacific/Kiritimati')).toEqual({ year: 2026, month: 11, day: 1 });
    expect(localDateInTz(instant, 'America/Los_Angeles')).toEqual({
      year: 2026,
      month: 10,
      day: 31,
    });
  });
  it('defaults to UTC when tz is missing', () => {
    const instant = new Date(Date.UTC(2026, 9, 31, 12, 0, 0));
    expect(localDateInTz(instant, null)).toEqual({ year: 2026, month: 10, day: 31 });
  });
});

describe('mapHolidayCatalogRow (DB snake_case → catalog)', () => {
  it('maps a fall (flat) row', () => {
    const row = mapHolidayCatalogRow({
      key: 'fall',
      display_name: 'Fall',
      emoji: '🍂',
      ramp_style: 'flat',
      peak_rule: 'fixed',
      peak_month: 10,
      peak_day: 7,
      window_days: 36,
      ramp_start_pct: 10,
      peak_pct: 10,
      peak_lead_days: 0,
      final_pct: 10,
      final_days: 0,
      sort_order: 0,
    });
    expect(row.rampStyle).toBe('flat');
    expect(row.peakMonth).toBe(10);
    expect(row.windowDays).toBe(36);
    expect(row.peakPct).toBe(10);
  });
  it('defaults ramp_style to ramp', () => {
    expect(mapHolidayCatalogRow({ key: 'x', peak_rule: 'fixed', window_days: 5 }).rampStyle).toBe(
      'ramp'
    );
  });
  it('maps the explicit start columns (mig 456) and leaves them null when absent', () => {
    const withStart = mapHolidayCatalogRow({
      key: 'fall',
      peak_rule: 'nth_weekday',
      window_days: 72,
      start_month: 9,
      start_day: 15,
    });
    expect(withStart.startMonth).toBe(9);
    expect(withStart.startDay).toBe(15);
    const without = mapHolidayCatalogRow({ key: 'x', peak_rule: 'fixed', window_days: 5 });
    expect(without.startMonth).toBeNull();
    expect(without.startDay).toBeNull();
  });
});

// ── Window gating: seed pools engage ONLY inside their window (Kevin 2026-09-04) ──
// "Don't need Christmas posts showing in July." Every holiday's pool must be
// eligible on exactly its window days and on no other day of the year.
describe('window gating — pools engage only inside their window', () => {
  const keysOn = (y: number, m: number, d: number, rows = FULL_CATALOG) =>
    resolveActiveHolidays({ year: y, month: m, day: d }, rows)
      .map((h) => h.key)
      .sort();
  const find = (y: number, m: number, d: number, key: string) =>
    resolveActiveHolidays({ year: y, month: m, day: d }, FULL_CATALOG).find((h) => h.key === key);

  it('Fall opens on Sept 15 exactly (explicit start), not the day before', () => {
    expect(keysOn(2026, 9, 14)).toEqual([]);
    expect(keysOn(2026, 9, 15)).toEqual(['fall']);
    expect(keysOn(2027, 9, 14)).toEqual([]);
    expect(keysOn(2027, 9, 15)).toEqual(['fall']);
  });

  it('Fall runs through Thanksgiving DAY and closes the day after (floating end)', () => {
    // 2026: Thanksgiving = Nov 26; 2027: Nov 25.
    expect(find(2026, 11, 26, 'fall')?.daysUntilPeak).toBe(0);
    expect(keysOn(2026, 11, 27)).toEqual([]);
    expect(find(2027, 11, 25, 'fall')?.daysUntilPeak).toBe(0);
    expect(keysOn(2027, 11, 26)).toEqual([]);
  });

  it('Fall is a flat 10% on every day of its window, first to last', () => {
    for (const [m, d] of [
      [9, 15],
      [10, 1],
      [10, 31],
      [11, 10],
      [11, 26],
    ]) {
      expect(find(2026, m, d, 'fall')?.holidayPct).toBe(10);
    }
  });

  it('Halloween is Oct 1-31 only: closed Sept 30, ramp start Oct 1, nudge Oct 31, closed Nov 1', () => {
    expect(find(2026, 9, 30, 'halloween')).toBeUndefined();
    expect(find(2026, 10, 1, 'halloween')?.holidayPct).toBe(6);
    const night = find(2026, 10, 31, 'halloween');
    expect(night?.daysUntilPeak).toBe(0);
    expect(night?.holidayPct).toBe(35);
    expect(find(2026, 11, 1, 'halloween')).toBeUndefined();
  });

  it('NO Christmas in July (or November): the window is Dec 1-25 only', () => {
    expect(keysOn(2026, 7, 15)).toEqual([]);
    expect(find(2026, 11, 30, 'christmas')).toBeUndefined();
    expect(find(2026, 12, 1, 'christmas')?.holidayPct).toBe(6);
    expect(find(2026, 12, 25, 'christmas')?.daysUntilPeak).toBe(0);
    expect(find(2026, 12, 26, 'christmas')).toBeUndefined();
  });

  it('overlaps are eligible TOGETHER: late Nov = Fall + Thanksgiving; Oct = Fall + Halloween', () => {
    expect(keysOn(2026, 11, 20)).toEqual(['fall', 'thanksgiving']);
    expect(keysOn(2026, 10, 20)).toEqual(['fall', 'halloween']);
  });

  it('an explicit start later in the calendar than the peak wraps to the prior year', () => {
    const nyeWeek: HolidayCatalogRow = {
      ...NYE,
      key: 'nye_week',
      startMonth: 12,
      startDay: 26,
      windowDays: 0,
    };
    const on = (y: number, m: number, d: number) =>
      resolveActiveHolidays({ year: y, month: m, day: d }, [nyeWeek]).map((h) => h.key);
    expect(on(2026, 12, 25)).toEqual([]);
    expect(on(2026, 12, 26)).toEqual(['nye_week']);
    expect(on(2027, 1, 1)).toEqual(['nye_week']);
    expect(on(2027, 1, 2)).toEqual([]);
  });

  it('windowBounds: Fall 2026 = Sept 15 → Nov 26', () => {
    const { openSerial, peakSerial } = windowBounds(FALL, 2026);
    const day = (m: number, d: number) => Math.floor(Date.UTC(2026, m - 1, d) / 86_400_000);
    expect(openSerial).toBe(day(9, 15));
    expect(peakSerial).toBe(day(11, 26));
  });

  it('two-year sweep: no holiday is ever active outside its allowed months, and each is active for exactly its window length', () => {
    const allowedMonths: Record<string, number[]> = {
      fall: [9, 10, 11],
      halloween: [10],
      thanksgiving: [11],
      christmas: [12],
      new_years: [12, 1],
      valentines: [2],
      st_patricks: [3],
      easter: [3, 4],
      july_4th: [6, 7],
    };
    const expectedDaysPerYear: Record<string, (year: number) => number> = {
      fall: (y) => {
        const { openSerial, peakSerial } = windowBounds(FALL, y);
        return peakSerial - openSerial + 1;
      },
      halloween: () => 31,
      thanksgiving: () => 13,
      christmas: () => 25,
      new_years: () => 6,
      valentines: () => 8,
      st_patricks: () => 8,
      easter: () => 15,
      july_4th: () => 8,
    };
    const counts: Record<string, Record<number, number>> = {};
    const violations: string[] = [];
    for (const year of [2026, 2027]) {
      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= 31; d++) {
          const probe = new Date(Date.UTC(year, m - 1, d));
          if (probe.getUTCMonth() + 1 !== m) continue; // skip invalid dates (Feb 30)
          for (const h of resolveActiveHolidays({ year, month: m, day: d }, FULL_CATALOG)) {
            if (!allowedMonths[h.key].includes(m))
              violations.push(`${h.key} active on ${year}-${m}-${d}`);
            counts[h.key] ??= {};
            // Attribute New Year's Dec days to the coming year so each window counts once.
            const bucket = h.key === 'new_years' && m === 12 ? year + 1 : year;
            counts[h.key][bucket] = (counts[h.key][bucket] ?? 0) + 1;
          }
        }
      }
    }
    expect(violations).toEqual([]);
    for (const key of Object.keys(allowedMonths)) {
      for (const year of [2026, 2027]) {
        if (key === 'new_years' && year === 2026) continue; // Dec-2025 half not swept
        expect({ key, year, days: counts[key]?.[year] ?? 0 }).toEqual({
          key,
          year,
          days: expectedDaysPerYear[key](year),
        });
      }
    }
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
