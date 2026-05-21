/**
 * EarthBot — flat top-level pools registry for axis-system paths.
 *
 * As each path migrates from legacy function-form to the declarative
 * composer, its bespoke pools register here. Legacy paths continue
 * loading from earth/pools.js or beach/pools.js until they migrate.
 *
 * When the last legacy path migrates, earth/ and beach/ disappear.
 *
 * Load via bot.poolByName(name) — wired in index.js.
 */
const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

module.exports = {
  // epic-vista (2026-05-20 axis-system migration — first migrated path)
  EPIC_VISTA_SUBJECT: load('epic_vista_subject'),
  EPIC_VISTA_LIGHTING: load('epic_vista_lighting'),
  EPIC_VISTA_ATMOSPHERE: load('epic_vista_atmosphere'),
  EPIC_VISTA_HERO_FEATURE: load('epic_vista_hero_feature'),
  EPIC_VISTA_SKY: load('epic_vista_sky'),
  EPIC_VISTA_PHENOMENON: load('epic_vista_phenomenon'),
  // R1 (2026-05-20) — adds 3-tier depth via near-frame compositional anchor.
  EPIC_VISTA_FOREGROUND_ANCHOR: load('epic_vista_foreground_anchor'),
  // national-parks (2026-05-20 axis-system migration). Subject pool ONLY is
  // bespoke (path-specific US National Park scenes). Other 5 axes reuse
  // epic-vista pools — axis-clean discipline means they serve any real-Earth
  // landscape path uniformly.
  NATIONAL_PARKS_SUBJECT: load('national_parks_subject'),
  // deep-forest (2026-05-20 axis-system migration). Bespoke subject pool
  // ONLY — reuses epic-vista's lighting/atmosphere/hero_feature/sky/phenomenon.
  DEEP_FOREST_SUBJECT: load('deep_forest_subject'),
  // lush-jungle (2026-05-20). Same clone pattern — bespoke subject only.
  LUSH_JUNGLE_SUBJECT: load('lush_jungle_subject'),
  // coastal-vista (2026-05-20) — FIRST BEACH-SIDE path migrated. Validates
  // canonical landscape template clones cross-namespace.
  COASTAL_VISTA_SUBJECT: load('coastal_vista_subject'),
  // tropical-paradise (2026-05-20) — PARADISE coast sibling to coastal-vista.
  // Palm-fringed lagoons / atolls / white-sand crescents.
  TROPICAL_PARADISE_SUBJECT: load('tropical_paradise_subject'),
  // epic-sunset (2026-05-20) — SUNSET-AS-SUBJECT. Sky is the show, geology
  // silhouette/anchor only.
  EPIC_SUNSET_SUBJECT: load('epic_sunset_subject'),
  // hawaii-flowers (2026-05-21) — Hawaiian/tropical coast + tropical flowers
  // as visible co-star. Multi-time-of-day variety (not all sunset).
  // R3 architecture: subject is BEACH-ONLY (ground-level POV), flowers are
  // a separate axis reusing the legacy 200-entry tropical_flower_arrangements
  // pool copied from beach/seeds/.
  HAWAII_FLOWERS_SUBJECT: load('hawaii_flowers_subject'),
  HAWAII_FLOWERS_ARRANGEMENTS: load('hawaii_flowers_arrangements'),
};
