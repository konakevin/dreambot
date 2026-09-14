/**
 * THE LIVE 2026 FALL + HALLOWEEN CALENDAR (audit, 2026-09-13).
 *
 * The two `holidays` rows below are copied verbatim from production. These assertions are the answer to "when do
 * Fall and Halloween actually switch on, and what are the odds" — so if anyone edits a window, a percentage or the
 * day-of switch, this test says exactly which promise changed. Nothing here needs a human to flip a switch: both
 * seasons are date-driven off `is_active = true`.
 */
import {
  resolveActiveHolidays,
  combineHolidayPct,
  mapHolidayCatalogRow,
  rampPct,
  type CalendarDate,
} from '@engine/holidayWindow';

// verbatim production rows (2026-09-13)
const HALLOWEEN = mapHolidayCatalogRow({
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
  final_days: 1,
  ramp_style: 'flat',
  start_month: null,
  start_day: null,
  sort_order: 1,
  day_of_enabled: true,
  day_of_look_keys: [
    'halloween_watercolor_ink',
    'halloween_ornate_ink',
    'halloween_digital_painting',
    'halloween_dark_fantasy_oil',
    'halloween_storybook_gouache',
    'halloween_classical_oil',
  ],
  day_of_medium_ban: 'photography',
  day_of_model_ban: ['bytedance/seedream-4'],
});
const FALL = mapHolidayCatalogRow({
  key: 'fall',
  display_name: 'Fall',
  emoji: '🍂',
  peak_rule: 'nth_weekday',
  peak_month: 11,
  peak_day: null,
  peak_nth: 4,
  peak_weekday: 4,
  window_days: 72,
  ramp_start_pct: 10,
  peak_pct: 10,
  peak_lead_days: 0,
  final_pct: 10,
  final_days: 0,
  ramp_style: 'flat',
  start_month: 9,
  start_day: 15,
  sort_order: 0,
  day_of_enabled: false,
  day_of_look_keys: [],
  day_of_medium_ban: 'photography',
  day_of_model_ban: ['bytedance/seedream-4'],
});
const CATALOG = [FALL, HALLOWEEN];
const d = (month: number, day: number): CalendarDate => ({ year: 2026, month, day });
const keysOn = (c: CalendarDate) =>
  resolveActiveHolidays(c, CATALOG)
    .map((h) => h.key)
    .sort();
const pctOn = (c: CalendarDate) => combineHolidayPct(resolveActiveHolidays(c, CATALOG));

describe('Fall 2026', () => {
  it('opens Sept 15 and is dark the day before', () => {
    expect(keysOn(d(9, 14))).toEqual([]);
    expect(keysOn(d(9, 15))).toEqual(['fall']);
  });

  it('peaks on Thanksgiving (Nov 26) and is dark the day after', () => {
    expect(resolveActiveHolidays(d(11, 26), CATALOG)[0].daysUntilPeak).toBe(0);
    expect(keysOn(d(11, 26))).toEqual(['fall']);
    expect(keysOn(d(11, 27))).toEqual([]);
  });

  it('runs flat at 10% for all 73 nights — no ramp, no surge', () => {
    for (const c of [d(9, 15), d(10, 15), d(11, 1), d(11, 26)]) {
      expect(resolveActiveHolidays(c, CATALOG).find((h) => h.key === 'fall')!.holidayPct).toBe(10);
    }
  });

  it('never takes over a night: day_of is OFF and it has no curated looks', () => {
    const fall = resolveActiveHolidays(d(11, 26), CATALOG)[0];
    expect(fall.dayOfEnabled).toBe(false);
    expect(fall.dayOfLookKeys).toEqual([]);
  });
});

describe('Halloween 2026', () => {
  it('opens Oct 1 and is dark on Sept 30', () => {
    expect(keysOn(d(9, 30))).toEqual(['fall']);
    expect(keysOn(d(10, 1))).toEqual(['fall', 'halloween']);
  });

  it('is dark again on Nov 1, leaving Fall running alone', () => {
    expect(keysOn(d(11, 1))).toEqual(['fall']);
  });

  it('takes over Oct 31 with six curated looks', () => {
    const hal = resolveActiveHolidays(d(10, 31), CATALOG).find((h) => h.key === 'halloween')!;
    expect(hal.daysUntilPeak).toBe(0);
    expect(hal.dayOfEnabled).toBe(true);
    expect(hal.dayOfLookKeys).toHaveLength(6);
    expect(hal.dayOfModelBan).toEqual(['bytedance/seedream-4']);
  });

  it('KNOWN GAP: the configured 35% final-day surge never runs, because the row is flat', () => {
    // rampPct returns peak_pct immediately for a flat season, before the final-day maths. The 31st still works —
    // through the day-of takeover, not the surge — so this is a dead knob rather than a broken night.
    expect(rampPct(HALLOWEEN, 0)).toBe(10);
    expect(rampPct(HALLOWEEN, 0)).not.toBe(35);
  });
});

describe('the two seasons overlap rather than compete', () => {
  it('October stacks them: each stays at 10%, the chance of A holiday doubles to 20%', () => {
    expect(keysOn(d(10, 15))).toEqual(['fall', 'halloween']);
    expect(pctOn(d(10, 15))).toBe(20);
  });

  it('September and November run one season at 10%', () => {
    expect(pctOn(d(9, 20))).toBe(10);
    expect(pctOn(d(11, 10))).toBe(10);
  });

  it('nothing at all outside the two windows', () => {
    for (const c of [d(1, 5), d(6, 1), d(9, 1), d(12, 20)]) expect(pctOn(c)).toBe(0);
  });
});
