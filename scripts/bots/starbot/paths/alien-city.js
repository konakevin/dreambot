/**
 * StarBot alien-city path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer. Pre-refactor file preserved at paths/legacy/alien-city.js
 * for 30 days as a rollback reference.
 *
 * Architecture: OUTDOOR_CITY archetype — vast multi-tier alien city as
 * hero, anchor entity at TINY/SMALL scale (silhouette scale prover).
 * Path-bespoke setting (ALIEN_CITIES slim pool). No conditional drama
 * declared — city itself carries the visual drama via busy-metropolis
 * commotion language.
 *
 * See:
 *   - scripts/lib/archetypes.js          (OUTDOOR_CITY slot definitions)
 *   - scripts/lib/archetype-templates.js (OUTDOOR_CITY brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'OUTDOOR_CITY',
  pools: {
    setting: 'ALIEN_CITIES', // primary city pool
    // Bot anchor_entity slot overridden with city-specific witnesses
    // (street vendor / hovercar / lone pedestrian — not capital ships).
    anchor_entity: 'ALIEN_CITY_ANCHOR_ENTITY',
    // Path-bespoke deep-distance feature (orbital ring / megabuilding spire).
    deep_distance: 'ALIEN_CITY_DEEP_DISTANCE',
    // Wired 2026-05-13 — conditional drama layer (40% gate) was declared by
    // archetype but never fired because no path drama pool existed.
    drama: 'ALIEN_CITY_DRAMA',
  },
};
