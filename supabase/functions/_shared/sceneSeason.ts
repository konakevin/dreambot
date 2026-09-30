/**
 * Scene season signal (scene-only nightly L5).
 *
 * Gives a no-cast pure-scene nightly a sense of NOW — the dreamer's place in
 * its current season (spring blossoms, high-summer green, autumn gold, winter
 * snow) instead of the same timeless postcard every night. A persistent state
 * modifier (foliage / ground / seasonal color), NOT a rolled spectacle — so
 * unlike the awe beat it's always-on for a seasonal biome.
 *
 * Two gates keep it honest:
 *  - CLIMATE: only biomes whose scenes actually change with the calendar get a
 *    signal. Tropical / desert / underwater / volcanic / fantasy / interior are
 *    season-agnostic and get nothing (no autumn leaves on a Hawaiian beach).
 *  - SNOW: only cold biomes get a snowy winter; milder seasonal biomes get a
 *    bare / frosted winter with no snow mandate (no snow on the Amalfi coast).
 *
 * Holidays are handled separately (a pure-scene holiday takes its own brief
 * branch upstream), so this only ever colors an ordinary postcard.
 *
 * LIMITATION: season is mapped for the NORTHERN hemisphere — location_cards
 * carries no latitude/hemisphere, and the overwhelming majority of iconic dream
 * spots are northern. Southern-hemisphere temperate places (Patagonia, NZ) will
 * occasionally read a season off by six months; the climate gate still prevents
 * anything absurd. TODO: add a hemisphere signal if we ever store location lat.
 *
 * SEASON LOCK (mig 610, Kevin 2026-09-30): a card defined by one season (Cherry Blossoms, Lavender Fields, Tuscan
 * Villa) sets `location_cards.season_lock`, and the signal always reads that season instead of the calendar's.
 * Without it the autumn signal put maples and russet leaves into the cherry blossoms and a lavender field.
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** A mid-season month for each lock value, fed to sceneSeasonSignal in place of the calendar month. */
const LOCK_MONTH: Readonly<Record<Season, number>> = {
  spring: 4,
  summer: 7,
  autumn: 10,
  winter: 1,
};

/** The month to use for a card's season: its lock's month, else the calendar month. An unknown lock is ignored. */
export function seasonMonthFor(lock: string | null | undefined, calendarMonth: number): number {
  return lock && isSeason(lock) ? LOCK_MONTH[lock] : calendarMonth;
}

function isSeason(x: string): x is Season {
  return Object.prototype.hasOwnProperty.call(LOCK_MONTH, x);
}

/** Biomes whose scenes visibly change with the calendar. */
const SEASONAL_BIOMES = new Set([
  'temperate_forest',
  'alpine_mountain',
  'fjord_coastal',
  'temperate_coastal',
  'zen_garden',
  'urban_city',
  'gothic_historic',
  'grassland_savanna',
  'mediterranean_coastal',
  'romantic_countryside',
]);

/** Of the seasonal biomes, the cold ones that actually get SNOW in deep winter. */
const SNOW_BIOMES = new Set(['temperate_forest', 'alpine_mountain', 'fjord_coastal']);

/** Northern-hemisphere month (1-12) → season. */
export function seasonForMonth(month: number): Season {
  if (month === 12 || month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'autumn';
}

/**
 * The season phrase for a biome + month, or null when the biome is
 * season-agnostic. zen_garden gets its iconic blossom/maple flavor.
 */
export function sceneSeasonSignal(
  biomeKey: string | null | undefined,
  month: number
): string | null {
  if (!biomeKey || !SEASONAL_BIOMES.has(biomeKey)) return null;
  const season = seasonForMonth(month);
  const isZen = biomeKey === 'zen_garden';
  switch (season) {
    case 'spring':
      return isZen
        ? 'spring — cherry and plum blossoms in full bloom, fresh green growth, soft renewing light'
        : 'spring — fresh green buds, blossoms and wildflowers, soft renewing light';
    case 'summer':
      return 'high summer — lush deep-green foliage, warm vivid light, long full days';
    case 'autumn':
      return isZen
        ? 'autumn — maples turned crimson and gold, drifting fallen leaves, warm low light, crisp air'
        : 'autumn — foliage turned gold, amber, and russet, warm low light, crisp clear air';
    case 'winter':
      return SNOW_BIOMES.has(biomeKey)
        ? 'deep winter — snow blanketing the scene, bare frosted branches, crisp cold light, a still hush'
        : 'winter — bare branches, frost, muted cool light, a quiet stillness';
  }
}
