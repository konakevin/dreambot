import * as engine from '@engine/holidayWindow';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mirror = require('../../scripts/lib/holidayWindow.js');

// A representative slice of the real `holidays` catalog shape (migration
// 437 + 456) — a sharp-peak holiday (fixed date), a floating holiday
// (nth-weekday), a computus holiday (Easter), and an explicit-start SEASON
// (Fall, flat ramp) — covers every peakRule + rampStyle branch.
const HALLOWEEN = {
  key: 'halloween',
  displayName: 'Halloween',
  emoji: '🎃',
  rampStyle: 'ramp' as const,
  peakRule: 'fixed' as const,
  peakMonth: 10,
  peakDay: 31,
  peakNth: null,
  peakWeekday: null,
  windowDays: 30,
  startMonth: null,
  startDay: null,
  rampStartPct: 20,
  peakPct: 80,
  peakLeadDays: 7,
  finalPct: 100,
  finalDays: 3,
  sortOrder: 1,
};
const THANKSGIVING = {
  key: 'thanksgiving',
  displayName: 'Thanksgiving',
  emoji: '🦃',
  rampStyle: 'ramp' as const,
  peakRule: 'nth_weekday' as const,
  peakMonth: 11,
  peakDay: null,
  peakNth: 4,
  peakWeekday: 4, // Thursday
  windowDays: 14,
  startMonth: null,
  startDay: null,
  rampStartPct: 15,
  peakPct: 70,
  peakLeadDays: 5,
  finalPct: 90,
  finalDays: 2,
  sortOrder: 2,
};
const EASTER = {
  key: 'easter',
  displayName: 'Easter',
  emoji: '🐣',
  rampStyle: 'ramp' as const,
  peakRule: 'easter' as const,
  peakMonth: null,
  peakDay: null,
  peakNth: null,
  peakWeekday: null,
  windowDays: 10,
  startMonth: null,
  startDay: null,
  rampStartPct: 25,
  peakPct: 75,
  peakLeadDays: 4,
  finalPct: 95,
  finalDays: 1,
  sortOrder: 3,
};
const FALL = {
  key: 'fall',
  displayName: 'Fall',
  emoji: '🍂',
  rampStyle: 'flat' as const,
  peakRule: 'fixed' as const,
  peakMonth: 11,
  peakDay: 27, // Thanksgiving-ish fixed stand-in for this test
  peakNth: null,
  peakWeekday: null,
  windowDays: 30,
  startMonth: 9,
  startDay: 15,
  rampStartPct: 0,
  peakPct: 40,
  peakLeadDays: 0,
  finalPct: 40,
  finalDays: 0,
  sortOrder: 0,
};
const ROWS = [HALLOWEEN, THANKSGIVING, EASTER, FALL];

// A spread of dates across a full year, including each holiday's peak,
// window edges, and clear off-season gaps.
const TEST_DATES = [
  { year: 2026, month: 1, day: 1 },
  { year: 2026, month: 3, day: 1 },
  { year: 2026, month: 4, day: 5 }, // near Easter 2026 (Apr 5)
  { year: 2026, month: 6, day: 15 }, // deep off-season
  { year: 2026, month: 9, day: 1 }, // just before Fall opens
  { year: 2026, month: 9, day: 15 }, // Fall opens
  { year: 2026, month: 10, day: 1 },
  { year: 2026, month: 10, day: 24 }, // Halloween window, pre-peak
  { year: 2026, month: 10, day: 29 }, // Halloween final-days
  { year: 2026, month: 10, day: 31 }, // Halloween peak
  { year: 2026, month: 11, day: 1 },
  { year: 2026, month: 11, day: 26 }, // Thanksgiving 2026 = Nov 26
  { year: 2026, month: 12, day: 25 },
];

describe('holidayWindow.js — Node mirror parity vs the Deno original (2026-09-07)', () => {
  it('easterSunday matches for a decade of years', () => {
    for (let y = 2020; y <= 2030; y++) {
      expect(mirror.easterSunday(y)).toEqual(engine.easterSunday(y));
    }
  });

  it('resolvePeak matches for every rule across several years', () => {
    for (const row of ROWS) {
      for (const y of [2025, 2026, 2027]) {
        expect(mirror.resolvePeak(row, y)).toEqual(engine.resolvePeak(row, y));
      }
    }
  });

  it('windowBounds matches, including the explicit-start Fall season', () => {
    for (const row of ROWS) {
      for (const y of [2025, 2026, 2027]) {
        expect(mirror.windowBounds(row, y)).toEqual(engine.windowBounds(row, y));
      }
    }
  });

  it('rampPct matches across the ramp AND flat styles at varying daysUntil', () => {
    for (const row of ROWS) {
      for (const daysUntil of [0, 1, 2, 3, 5, 7, 10, 15, 29, 30]) {
        if (daysUntil > row.windowDays) continue;
        expect(mirror.rampPct(row, daysUntil)).toBe(engine.rampPct(row, daysUntil));
      }
    }
  });

  it('resolveActiveHolidays matches across a full year of dates, including overlaps', () => {
    for (const d of TEST_DATES) {
      expect(mirror.resolveActiveHolidays(d, ROWS)).toEqual(engine.resolveActiveHolidays(d, ROWS));
    }
  });

  it('combineHolidayPct + pickWeightedHoliday match for the same actives + roll', () => {
    for (const d of TEST_DATES) {
      const mActives = mirror.resolveActiveHolidays(d, ROWS);
      const eActives = engine.resolveActiveHolidays(d, ROWS);
      expect(mirror.combineHolidayPct(mActives)).toBe(engine.combineHolidayPct(eActives));
      if (mActives.length > 0) {
        for (const roll of [0, 0.25, 0.5, 0.75, 0.99]) {
          expect(mirror.pickWeightedHoliday(mActives, roll)).toEqual(
            engine.pickWeightedHoliday(eActives, roll)
          );
        }
      }
    }
  });

  it('mapHolidayCatalogRow matches on a representative snake_case DB row', () => {
    const dbRow = {
      key: 'halloween',
      display_name: 'Halloween',
      emoji: '🎃',
      ramp_style: 'ramp',
      peak_rule: 'fixed',
      peak_month: 10,
      peak_day: 31,
      peak_nth: null,
      peak_weekday: null,
      window_days: 30,
      start_month: null,
      start_day: null,
      ramp_start_pct: 20,
      peak_pct: 80,
      peak_lead_days: 7,
      final_pct: 100,
      final_days: 3,
      sort_order: 1,
    };
    expect(mirror.mapHolidayCatalogRow(dbRow)).toEqual(engine.mapHolidayCatalogRow(dbRow));
  });

  it('localDateInTz matches for a UTC instant across a few timezones', () => {
    const now = new Date('2026-10-31T05:30:00Z');
    for (const tz of ['UTC', 'America/Denver', 'Pacific/Kiritimati', 'Asia/Tokyo']) {
      expect(mirror.localDateInTz(now, tz)).toEqual(engine.localDateInTz(now, tz));
    }
  });
});
