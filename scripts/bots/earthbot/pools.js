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
};
