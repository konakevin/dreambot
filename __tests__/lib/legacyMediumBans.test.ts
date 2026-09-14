import { expandMediumBans, knownBanTokens } from '@engine/legacyMediumBans';

/**
 * The live nightly look catalog, shape-accurate as of 2026-09-13 (key + nightly_family only — that is all the
 * translation reads). Kept here so the test fails if a family is renamed out from under the ban map.
 */
const LOOKS = [
  // photographic — the photo-real register the imagined-biome guard exists to ban
  { key: 'nightly_cinematic_still', family: 'photographic' },
  { key: 'nightly_film_noir', family: 'photographic' },
  { key: 'nightly_hand_tinted_photo', family: 'photographic' },
  { key: 'nightly_technicolor', family: 'photographic' },
  { key: 'nightly_vintage_film', family: 'photographic' },
  { key: 'nightly_kodachrome', family: 'photographic' },
  // legacy family — the 1.2.0 mediums carried over under new keys
  { key: 'nightly_glamour', family: 'legacy' },
  { key: 'nightly_canvas', family: 'legacy' },
  { key: 'nightly_colored_pencil', family: 'legacy' },
  { key: 'nightly_watercolor_paper', family: 'legacy' },
  { key: 'nightly_adult_cartoon', family: 'legacy' },
  // painted / comic / watercolor families that must survive a photo ban
  { key: 'nightly_baroque_oil', family: 'painted_realism' },
  { key: 'nightly_classical_oil', family: 'painted_realism' },
  { key: 'nightly_soft_comic', family: 'comic_print' },
  { key: 'nightly_ink_illustration', family: 'comic_print' },
  { key: 'nightly_watercolor_ink', family: 'watercolor' },
  { key: 'nightly_movie_poster', family: 'covers_posters' },
  // the day-of holiday looks live outside every family
  { key: 'halloween_digital_painting', family: 'unfiled' },
];

const PHOTO_TOKENS = [
  'photography',
  'film_noir',
  'vintage_film',
  'double_exposure',
  'heirloom',
  'glamour',
];

describe('expandMediumBans', () => {
  it('translates the imagined-biome photo ban to every photographic look', () => {
    const banned = expandMediumBans(PHOTO_TOKENS, LOOKS);
    for (const l of LOOKS.filter((x) => x.family === 'photographic')) {
      expect(banned.has(l.key)).toBe(true);
    }
    // glamour is photo-real but files under `legacy`; the explicit key mapping must catch it
    expect(banned.has('nightly_glamour')).toBe(true);
  });

  it('leaves the painterly catalog rollable so the re-roll always has somewhere to land', () => {
    const banned = expandMediumBans(PHOTO_TOKENS, LOOKS);
    const survivors = LOOKS.filter((l) => !banned.has(l.key));
    expect(survivors.length).toBeGreaterThanOrEqual(10);
    expect(survivors.some((l) => l.family === 'painted_realism')).toBe(true);
    expect(survivors.some((l) => l.family === 'watercolor')).toBe(true);
    expect(survivors.some((l) => l.family === 'comic_print')).toBe(true);
  });

  it('maps the four byte-identical legacy successors', () => {
    expect([...expandMediumBans(['canvas'], LOOKS)]).toEqual(['nightly_canvas']);
    expect([...expandMediumBans(['pencil'], LOOKS)]).toEqual(['nightly_colored_pencil']);
    expect([...expandMediumBans(['watercolor'], LOOKS)]).toEqual(['nightly_watercolor_paper']);
    expect([...expandMediumBans(['glamour'], LOOKS)]).toEqual(['nightly_glamour']);
  });

  it('does NOT ban the new comic_print family off the legacy `comics` token', () => {
    const banned = expandMediumBans(['comics'], LOOKS);
    expect(banned.has('nightly_soft_comic')).toBe(false);
    expect(banned.has('nightly_ink_illustration')).toBe(false);
    // both 1.2.0 comic looks are already retired, so the token resolves to nothing in the live catalog
    expect(banned.size).toBe(0);
  });

  it('ignores unknown and empty tokens instead of throwing (a stale ban cannot break a dream)', () => {
    expect(expandMediumBans(['', '  ', 'no_such_medium'], LOOKS).size).toBe(0);
  });

  it('lets a ban be written directly in the new vocabulary', () => {
    expect([...expandMediumBans(['nightly_baroque_oil'], LOOKS)]).toEqual(['nightly_baroque_oil']);
  });

  it('never bans a day-of holiday look, which is pinned rather than rolled', () => {
    const banned = expandMediumBans([...PHOTO_TOKENS, 'comics', 'pencil'], LOOKS);
    expect(banned.has('halloween_digital_painting')).toBe(false);
  });

  it('exposes the tokens it knows, so the audit script can find rows it cannot translate', () => {
    const known = knownBanTokens();
    for (const t of [...PHOTO_TOKENS, 'pencil', 'comics', 'canvas', 'watercolor']) {
      expect(known).toContain(t);
    }
  });
});
