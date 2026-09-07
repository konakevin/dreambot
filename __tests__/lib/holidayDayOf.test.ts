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
