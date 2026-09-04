import {
  fnv1a,
  heroSeed,
  pickHeroRegister,
  heroSurface,
  pickHeroRow,
  fillHeroTemplate,
  mapHeroRow,
  type HolidayHeroRow,
} from '@engine/holidayHero';

const AXES = {
  palette: ['blood-moon crimson', 'emerald-and-gold', 'violet-twilight', 'amber lantern-glow'],
  flourish: ['a raven', 'a black cat', 'a candelabra', 'a jeweled goblet', 'drifting lanterns'],
  role: ['the guests of honor', 'the hosts', 'mysterious strangers'],
  time: ['at the stroke of midnight', 'under a huge full moon', 'in the last golden light'],
};
const row = (over: Partial<HolidayHeroRow> = {}): HolidayHeroRow => ({
  holiday: 'halloween',
  surface: 'couple',
  register: 'eerie',
  attire: 'opulent gothic formalwear in {palette}',
  scene: 'a grand candlelit ballroom {time}, {palette} light, {flourish}, the couple as {role}',
  mediumKey: 'painted_gothic_fantasy',
  axes: AXES,
  ...over,
});

describe('fnv1a + heroSeed', () => {
  it('is deterministic and spreads', () => {
    expect(fnv1a('abc')).toBe(fnv1a('abc'));
    expect(fnv1a('abc')).not.toBe(fnv1a('abd'));
    expect(heroSeed('u1', 'halloween', 2026)).toBe('u1:halloween:2026');
  });
});

describe('pickHeroRegister (Cute↔Terrifying slider)', () => {
  it('below the midpoint = cozy, at/above = eerie, missing = cozy', () => {
    expect(pickHeroRegister(0.3)).toBe('cozy');
    expect(pickHeroRegister(0.49)).toBe('cozy');
    expect(pickHeroRegister(0.5)).toBe('eerie');
    expect(pickHeroRegister(0.7)).toBe('eerie');
    expect(pickHeroRegister(undefined)).toBe('cozy');
    expect(pickHeroRegister('0.9')).toBe('cozy');
    expect(pickHeroRegister(NaN)).toBe('cozy');
  });
});

describe('heroSurface', () => {
  it('couple whenever a dual swap is on; otherwise gendered solo (male default)', () => {
    expect(heroSurface(true, 'female')).toBe('couple');
    expect(heroSurface(false, 'female')).toBe('female');
    expect(heroSurface(false, 'male')).toBe('male');
    expect(heroSurface(false, undefined)).toBe('male');
  });
});

describe('pickHeroRow', () => {
  const rows = [
    row({ surface: 'couple', register: 'eerie' }),
    row({ surface: 'couple', register: 'cozy' }),
    row({ surface: 'male', register: 'default' }),
    row({ surface: 'female', register: 'eerie' }),
  ];
  it('exact register first', () => {
    expect(pickHeroRow(rows, 'couple', 'cozy')?.register).toBe('cozy');
  });
  it("falls back to 'default' for the surface", () => {
    expect(pickHeroRow(rows, 'male', 'eerie')?.register).toBe('default');
  });
  it('then any register for the surface', () => {
    expect(pickHeroRow(rows, 'female', 'cozy')?.register).toBe('eerie');
  });
  it('null when the surface has no row at all (caller falls back to the pool)', () => {
    expect(pickHeroRow(rows.slice(0, 2), 'male', 'cozy')).toBeNull();
    expect(pickHeroRow([], 'couple', 'cozy')).toBeNull();
  });
});

describe('fillHeroTemplate', () => {
  it('fills every placeholder, leaves no braces, and is deterministic per seed', () => {
    const a = fillHeroTemplate(row(), 'u1:halloween:2026');
    const b = fillHeroTemplate(row(), 'u1:halloween:2026');
    expect(a).toEqual(b);
    expect(a.scene).not.toMatch(/[{}]/);
    expect(a.attire).not.toMatch(/[{}]/);
    expect(Object.keys(a.picks).sort()).toEqual(['flourish', 'palette', 'role', 'time']);
    // the same axis pick is used everywhere it appears
    expect(a.attire).toContain(a.picks.palette);
    expect(a.scene).toContain(a.picks.palette);
  });
  it('a different user, holiday, or year changes the picks', () => {
    const base = fillHeroTemplate(row(), 'u1:halloween:2026');
    const variants = [
      fillHeroTemplate(row(), 'u2:halloween:2026'),
      fillHeroTemplate(row(), 'u1:christmas:2026'),
      fillHeroTemplate(row(), 'u1:halloween:2027'),
    ];
    expect(variants.some((v) => v.scene !== base.scene)).toBe(true);
  });
  it('spreads users evenly across every axis value (no clone dreams)', () => {
    const counts: Record<string, Record<string, number>> = {};
    const N = 600;
    for (let i = 0; i < N; i++) {
      const { picks } = fillHeroTemplate(row(), `user-${i}:halloween:2026`);
      for (const [axis, v] of Object.entries(picks)) {
        counts[axis] ??= {};
        counts[axis][v] = (counts[axis][v] ?? 0) + 1;
      }
    }
    for (const [axis, values] of Object.entries(AXES)) {
      const expected = N / values.length;
      for (const v of values) {
        // every value used, and none hogs the distribution (within ±40% of uniform)
        expect(counts[axis][v]).toBeGreaterThan(expected * 0.6);
        expect(counts[axis][v]).toBeLessThan(expected * 1.4);
      }
    }
    // combos: 4×5×3×3 = 180; independent uniform picks over 600 users should reach
    // ~180·(1−e^(−600/180)) ≈ 174 distinct. Correlated axes (weak hash mixing) collapse
    // this to ~100 — lock the independence, not just "some" spread.
    const combos = new Set<string>();
    for (let i = 0; i < N; i++)
      combos.add(fillHeroTemplate(row(), `user-${i}:halloween:2026`).scene);
    expect(combos.size).toBeGreaterThan(160);
  });
  it('an unknown / empty placeholder is removed cleanly (no braces, no double commas)', () => {
    const r = row({
      scene: 'a ballroom {time}, {nope}, {flourish}, done',
      axes: { time: AXES.time, flourish: AXES.flourish, nope: [] },
    });
    const out = fillHeroTemplate(r, 'seed');
    expect(out.scene).not.toMatch(/[{}]/);
    expect(out.scene).not.toMatch(/,\s*,/);
    expect(out.picks.nope).toBeUndefined();
  });
  it('a recipe with no axes renders verbatim', () => {
    const r = row({ attire: 'plain', scene: 'plain scene', axes: {} });
    expect(fillHeroTemplate(r, 'x')).toEqual({ attire: 'plain', scene: 'plain scene', picks: {} });
  });
});

describe('mapHeroRow (DB → hero)', () => {
  it('maps snake_case + keeps only string arrays in axes', () => {
    const m = mapHeroRow({
      holiday: 'halloween',
      surface: 'female',
      register: 'cozy',
      attire: 'a',
      scene: 's',
      medium_key: 'photography',
      medium_ban: null,
      pose_pool: 'glamour',
      axes: { palette: ['x', 'y'], junk: 'not-an-array', mixed: ['ok', 3] },
    });
    expect(m.surface).toBe('female');
    expect(m.mediumKey).toBe('photography');
    expect(m.posePool).toBe('glamour');
    expect(m.axes).toEqual({ palette: ['x', 'y'], mixed: ['ok'] });
  });
  it('defaults register and tolerates a missing axes column', () => {
    const m = mapHeroRow({ holiday: 'h', surface: 'male', attire: 'a', scene: 's' });
    expect(m.register).toBe('default');
    expect(m.axes).toEqual({});
  });
});
