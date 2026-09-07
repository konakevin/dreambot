/** Holiday DAY-OF step 1 (HOLIDAY_DAY_OF_PLAN.md §3.1-3.2): the reserved `<holiday>_day_of` pool is
 *  invisible to the window draw and the only thing the day-of draw sees; the catalog flag rides through. */
import {
  dayOfPoolKey,
  isDayOfSub,
  filterDayOfRows,
  HALLOWEEN_POOLS,
  holidayPoolOf,
} from '@engine/holidayPools';
import { mapHolidayCatalogRow, resolveActiveHolidays } from '@engine/holidayWindow';

const rows = [
  { subTheme: 'cozy_porch' },
  { subTheme: 'masquerade_ball' },
  { subTheme: 'bonfire_night' },
  { subTheme: null },
  { subTheme: 'unknown_sub' },
];

describe('reserved day-of pool', () => {
  it('is keyed <holiday>_day_of and its 12 subs map to it', () => {
    expect(dayOfPoolKey('halloween')).toBe('halloween_day_of');
    expect(HALLOWEEN_POOLS).toContain('halloween_day_of');
    expect(holidayPoolOf('masquerade_ball')).toBe('halloween_day_of');
    expect(isDayOfSub('halloween', 'bonfire_night')).toBe(true);
    expect(isDayOfSub('halloween', 'cozy_porch')).toBe(false);
    expect(isDayOfSub('fall', 'bonfire_night')).toBe(false); // another holiday never borrows it
    expect(isDayOfSub('halloween', null)).toBe(false);
  });
  it("'exclude' (the window default) never sees day-of subs; 'only' sees nothing else", () => {
    expect(filterDayOfRows(rows, 'halloween', 'exclude').map((r) => r.subTheme)).toEqual([
      'cozy_porch',
      null,
      'unknown_sub',
    ]);
    expect(filterDayOfRows(rows, 'halloween', 'only').map((r) => r.subTheme)).toEqual([
      'masquerade_ball',
      'bonfire_night',
    ]);
  });
});

describe('catalog day_of_enabled', () => {
  const base = {
    key: 'halloween',
    display_name: 'Halloween',
    emoji: '🎃',
    peak_rule: 'fixed',
    peak_month: 10,
    peak_day: 31,
    window_days: 30,
    ramp_start_pct: 6,
    peak_pct: 10,
    peak_lead_days: 7,
    final_pct: 35,
    final_days: 3,
    sort_order: 1,
  };
  it('defaults true, maps false, and rides into the active-holiday result on the peak day', () => {
    expect(mapHolidayCatalogRow(base).dayOfEnabled).toBe(true);
    expect(mapHolidayCatalogRow({ ...base, day_of_enabled: false }).dayOfEnabled).toBe(false);
    const on = resolveActiveHolidays({ year: 2026, month: 10, day: 31 }, [
      mapHolidayCatalogRow(base),
    ]);
    expect(on).toHaveLength(1);
    expect(on[0].daysUntilPeak).toBe(0);
    expect(on[0].dayOfEnabled).toBe(true);
    const off = resolveActiveHolidays({ year: 2026, month: 10, day: 31 }, [
      mapHolidayCatalogRow({ ...base, day_of_enabled: false }),
    ]);
    expect(off[0].dayOfEnabled).toBe(false);
  });
});

import { dayOfCalendarDate, localHourInTz } from '@engine/holidayWindow';
import { selectDayOfRows } from '@engine/holidayPools';

describe('day-of date rule (HOLIDAY_DAY_OF_PLAN.md §4) — the date the render is FOR', () => {
  // The nightly fires at 08:00 UTC. Rows: [tz, local hour at that run, date on the Oct 31 08:00 UTC run]
  const run = (iso: string) => new Date(iso);
  const cases: Array<[string, number, string]> = [
    ['Europe/Berlin', 9, '2026-10-31'], // 09:00 CET (DST ended Oct 25) — same day
    ['America/New_York', 4, '2026-10-31'],
    ['America/Los_Angeles', 1, '2026-10-31'],
    ['America/Anchorage', 0, '2026-10-31'],
    ['Pacific/Honolulu', 22, '2026-10-31'], // 22:00 Oct 30 local → shifted to Oct 31 (wakes up to it)
    ['Asia/Tokyo', 17, '2026-10-31'],
    ['Asia/Kolkata', 13, '2026-10-31'],
    ['Australia/Sydney', 19, '2026-10-31'], // 19:00 AEDT — under the 20:00 cutoff, same day
  ];
  it.each(cases)('%s at the Oct 31 08:00 UTC run (local hour %i) → %s', (tz, hour, want) => {
    const now = run('2026-10-31T08:00:00Z');
    expect(localHourInTz(now, tz)).toBe(hour);
    const d = dayOfCalendarDate(now, tz, 20);
    expect(`${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`).toBe(
      want
    );
  });
  it('Hawaii fires exactly once: the Oct 31 UTC run is its day-of, the Nov 1 UTC run is past it', () => {
    const a = dayOfCalendarDate(run('2026-10-31T08:00:00Z'), 'Pacific/Honolulu', 20);
    const b = dayOfCalendarDate(run('2026-11-01T08:00:00Z'), 'Pacific/Honolulu', 20);
    const c = dayOfCalendarDate(run('2026-10-30T08:00:00Z'), 'Pacific/Honolulu', 20);
    expect([a.month, a.day]).toEqual([10, 31]);
    expect([b.month, b.day]).toEqual([11, 1]);
    expect([c.month, c.day]).toEqual([10, 30]);
  });
  it('cutoff 24 never shifts; a bad timezone falls back to UTC', () => {
    const d = dayOfCalendarDate(run('2026-10-31T08:00:00Z'), 'Pacific/Honolulu', 24);
    expect([d.month, d.day]).toEqual([10, 30]);
    const u = dayOfCalendarDate(run('2026-10-31T08:00:00Z'), 'Not/AZone', 20);
    expect([u.month, u.day]).toEqual([10, 31]);
  });
});

describe('selectDayOfRows — never a broken render', () => {
  it('day-of rows first, then the window rows, then none', () => {
    expect(selectDayOfRows([1], [2])).toEqual({ rows: [1], source: 'day_of' });
    expect(selectDayOfRows([], [2])).toEqual({ rows: [2], source: 'fallback_window' });
    expect(selectDayOfRows([], [])).toEqual({ rows: [], source: 'none' });
  });
});
