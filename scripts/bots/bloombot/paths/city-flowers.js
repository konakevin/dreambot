/**
 * BloomBot city-flowers — declarative axis-system form (2026-05-16 migration).
 *
 * URBAN ARCHITECTURE half-consumed by flowers. Wide street-photography
 * composition with pedestrian POV + leading-lines. Architecture is the
 * STRUCTURAL HERO, blooms are DISTRIBUTED MASS (conservatory pattern).
 *
 * Legacy compositional version preserved at paths/legacy/city-flowers.js.
 *
 * Axes (2 path-bespoke + 60%-gated phenomenon):
 *   - city_setting (150): the urban canvas (Mediterranean / Parisian /
 *     Tokyo / Lisbon / Marrakech / Venetian / etc.)
 *   - architectural_detail (100): the city's signature element (balcony /
 *     window / door / staircase / arch / fountain)
 *   - atmospheric_phenomenon (50, 60%-gated): city-life magic moment
 */

module.exports = {
  archetype: 'BLOOMBOT_CITY_FLOWERS',
  pools: {
    city_setting: 'BLOOMBOT_CITY_FLOWERS_CITY_SETTING',
    architectural_detail: 'BLOOMBOT_CITY_FLOWERS_ARCHITECTURAL_DETAIL',
    atmospheric_phenomenon: 'BLOOMBOT_CITY_FLOWERS_ATMOSPHERIC_PHENOMENON',
  },
};
