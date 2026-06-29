/**
 * OutlawBot — axis pools. Sonnet-seeded pools loaded from ./seeds.
 * Regenerate: node scripts/gen-outlawbot-pool.js --pool <name> --count <N>
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Pools may not exist yet during regen — load defensively.
function loadOptional(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

// Optional per-vibe color accent (consumed by templates via sharedDNA.colorPalette).
// Western-warm palettes — golden-hour, sun-blasted, dusty, never gothic.
const VIBE_COLOR = {
  cinematic: 'teal-and-amber cinematic grade, warm golden key against cool blue shadow',
  epic: 'vast luminous golden-hour grandeur, deep blue distance, warm sunlit foreground',
  nostalgic: 'warm faded sepia-gold, soft dusty amber, gentle period warmth',
  majestic: 'rich golden light, deep cobalt sky, warm sandstone and crimson-rock tones',
  fierce: 'high-contrast sun-blasted color, hot orange dust against deep shadow',
  peaceful: 'soft dawn gold, pale blue sky, gentle prairie-green and cream',
  ancient: 'weathered bone-and-rust, sun-bleached ochre, dusty sage and stone-grey',
  dark: 'deep nocturnal blue, warm lantern-amber pools cutting the shadow',
};

module.exports = {
  // Looks system — bot-wide western-art render-style register rolled per render via
  // rollSharedDNA.lookRegister; injected at the top of look-enabled briefs so the
  // render style varies within the Old-West identity (MangaBot looks pattern).
  OUTLAWBOT_LOOK_REGISTER: loadOptional('outlawbot_look_register'),

  // ─── frontier-town path (scene-as-hero: the Old-West town / main street) ───
  OUTLAWBOT_FRONTIER_TOWN_TOWN: loadOptional('outlawbot_frontier_town_town'),
  OUTLAWBOT_FRONTIER_TOWN_STRUCTURES: loadOptional('outlawbot_frontier_town_structures'),
  OUTLAWBOT_FRONTIER_TOWN_STREET_LIFE: loadOptional('outlawbot_frontier_town_street_life'),
  OUTLAWBOT_FRONTIER_TOWN_SURROUND: loadOptional('outlawbot_frontier_town_surround'),
  OUTLAWBOT_FRONTIER_TOWN_ATMOSPHERE: loadOptional('outlawbot_frontier_town_atmosphere'),
  OUTLAWBOT_FRONTIER_TOWN_SKY: loadOptional('outlawbot_frontier_town_sky'),
  OUTLAWBOT_FRONTIER_TOWN_COMPOSITION: loadOptional('outlawbot_frontier_town_composition'),

  // ─── gunslinger paths (male + female) — shared ENV pools + gendered FIGURE pools
  OUTLAWBOT_GUNSLINGER_SETTING: loadOptional('outlawbot_gunslinger_setting'),
  OUTLAWBOT_GUNSLINGER_ATMOSPHERE: loadOptional('outlawbot_gunslinger_atmosphere'),
  OUTLAWBOT_GUNSLINGER_COMPOSITION: loadOptional('outlawbot_gunslinger_composition'),
  OUTLAWBOT_GUNSLINGER_MALE_ARCHETYPE: loadOptional('outlawbot_gunslinger_male_archetype'),
  OUTLAWBOT_GUNSLINGER_MALE_HAIR: loadOptional('outlawbot_gunslinger_male_hair'),
  OUTLAWBOT_GUNSLINGER_MALE_WARDROBE: loadOptional('outlawbot_gunslinger_male_wardrobe'),
  OUTLAWBOT_GUNSLINGER_MALE_WEAPON: loadOptional('outlawbot_gunslinger_male_weapon'),
  OUTLAWBOT_GUNSLINGER_MALE_ACTION: loadOptional('outlawbot_gunslinger_male_action'),
  OUTLAWBOT_GUNSLINGER_FEMALE_ARCHETYPE: loadOptional('outlawbot_gunslinger_female_archetype'),
  OUTLAWBOT_GUNSLINGER_FEMALE_HAIR: loadOptional('outlawbot_gunslinger_female_hair'),
  OUTLAWBOT_GUNSLINGER_FEMALE_LOOK: loadOptional('outlawbot_gunslinger_female_look'),
  OUTLAWBOT_GUNSLINGER_FEMALE_WARDROBE: loadOptional('outlawbot_gunslinger_female_wardrobe'),
  OUTLAWBOT_GUNSLINGER_FEMALE_WEAPON: loadOptional('outlawbot_gunslinger_female_weapon'),
  OUTLAWBOT_GUNSLINGER_FEMALE_ACTION: loadOptional('outlawbot_gunslinger_female_action'),

  VIBE_COLOR,

  poolByNameThrows: true,
};
