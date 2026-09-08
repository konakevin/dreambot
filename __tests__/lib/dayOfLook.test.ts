/** dayOfLook.ts — the day-of LOOK pick + the medium-ban parser (HOLIDAY_DAY_OF_PLAN.md §5d). */
import { pickDayOfLook, parseMediumBan } from '@engine/dayOfLook';
import { mapHolidayCatalogRow } from '@engine/holidayWindow';

describe('pickDayOfLook', () => {
  const keys = ['halloween_watercolor_ink', 'halloween_ornate_ink', 'halloween_classical_oil'];
  it('uniform over the catalog list; empty list → null (the render falls to the normal roll minus the ban)', () => {
    expect(pickDayOfLook(keys, null, () => 0)).toBe('halloween_watercolor_ink');
    expect(pickDayOfLook(keys, null, () => 0.999)).toBe('halloween_classical_oil');
    expect(pickDayOfLook([], null)).toBeNull();
  });
  it('a QA force wins even when the key is not in the list', () => {
    expect(pickDayOfLook(keys, 'halloween_storybook_gouache', () => 0)).toBe(
      'halloween_storybook_gouache'
    );
    expect(pickDayOfLook([], 'halloween_storybook_gouache')).toBe('halloween_storybook_gouache');
  });
});

describe('parseMediumBan', () => {
  it('comma list → trimmed set; null/empty → empty set', () => {
    expect([...parseMediumBan('photography, glamour ,,')]).toEqual(['photography', 'glamour']);
    expect(parseMediumBan(null).size).toBe(0);
    expect(parseMediumBan('').size).toBe(0);
  });
});

describe('holiday catalog row carries the look set + the ban (mig 478)', () => {
  const base = {
    key: 'halloween',
    display_name: 'Halloween',
    emoji: '🎃',
    peak_rule: 'fixed',
    peak_month: 10,
    peak_day: 31,
    window_days: 30,
    ramp_style: 'linear',
  };
  it('reads day_of_look_keys as a string[] and day_of_medium_ban as text, with safe defaults', () => {
    const r = mapHolidayCatalogRow({
      ...base,
      day_of_look_keys: ['halloween_ornate_ink', 7, null],
      day_of_medium_ban: 'photography',
    });
    expect(r.dayOfLookKeys).toEqual(['halloween_ornate_ink']);
    expect(r.dayOfMediumBan).toBe('photography');
    const d = mapHolidayCatalogRow(base);
    expect(d.dayOfLookKeys).toEqual([]);
    expect(d.dayOfMediumBan).toBeNull();
  });
});
