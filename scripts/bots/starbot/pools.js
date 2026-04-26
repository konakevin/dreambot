/**
 * StarBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/starbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// ─────────────────────────────────────────────────────────────
// CYBORG SHARED POOLS (Sonnet-seeded, 200 entries each)
// ─────────────────────────────────────────────────────────────

const CYBORG_SKIN_TONES = load('cyborg_skin_tones');
const CYBORG_EYE_STYLES = load('cyborg_eye_styles');

// ─────────────────────────────────────────────────────────────
// CYBORG-WOMAN POOLS
// ─────────────────────────────────────────────────────────────

const CYBORG_HAIR_STYLES = load('cyborg_female_hair');
const CYBORG_BODY_TYPES = load('cyborg_female_body_types');

// ─────────────────────────────────────────────────────────────
// CYBORG-MAN POOLS
// ─────────────────────────────────────────────────────────────

const CYBORG_MALE_BODY_TYPES = load('cyborg_male_body_types');
const CYBORG_MALE_HAIR_STYLES = load('cyborg_male_hair');

const CYBORG_INTERNAL_EXPOSURE = load('cyborg_female_internal');

const CYBORG_MALE_INTERNAL_EXPOSURE = load('cyborg_male_internal');

const CYBORG_GLOW_COLORS = load('cyborg_glow_colors');

const VIBE_COLOR = {
  cinematic: 'teal-and-orange sci-fi cinematic grade, deep shadows, luminous highlights',
  dark: 'oil-black dominant, single nebula-glow accent, stark void',
  epic: 'dramatic cosmic god-rays, rich indigo-and-gold, heroic scale palette',
  nostalgic: 'faded 70s-sci-fi palette, muted copper, warm-amber control panels',
  psychedelic: 'impossible magenta-violet nebula hues, hallucinatory cosmic shifts',
  peaceful: 'soft pastel nebula-pinks, gentle luminous calm, tranquil space',
  ethereal: 'pearl-white cosmic mist, opalescent space-gas, luminous pale tones',
  arcane: 'deep violet nebula, emerald spacedust, mystical cosmic hues',
  ancient: 'weathered bronze + deep-copper, sepia-sunset palette',
  enchanted: 'soft magical nebula glow, dreamy lavender-and-blue cosmic',
  fierce: 'stark crimson-and-obsidian, savage solar flare contrast',
  coquette: 'soft pastel nebula-pink + cream (rare for StarBot, soft edge)',
  voltage: 'electric blue plasma, neon cyberpunk accents, stark contrast',
  nightshade: 'deep violet void with silver starfield, plum-shadow palette',
  macabre: 'inked blood-crimson cosmic-dread, dark-nebula palette',
  shimmer: 'shimmering starlight + iridescent cosmic-dust highlights',
  surreal: 'impossible cosmic color pairings, hallucinatory space shifts',
};

module.exports = {
  // Cyborg shared pools
  CYBORG_SKIN_TONES,
  CYBORG_EYE_STYLES,
  CYBORG_INTERNAL_EXPOSURE,
  CYBORG_GLOW_COLORS,
  CYBORG_FEATURES: load('cyborg_features'),
  CYBORG_CLOSEUP_FRAMINGS: load('cyborg_closeup_framings'),
  // Cyborg-woman pools
  CYBORG_HAIR_STYLES,
  CYBORG_BODY_TYPES,
  CYBORG_FEMALE_CHARACTERS: load('cyborg_female_characters'),
  CYBORG_ACTIONS: load('cyborg_actions'),
  // Cyborg-man pools
  CYBORG_MALE_HAIR_STYLES,
  CYBORG_MALE_BODY_TYPES,
  CYBORG_MALE_INTERNAL_EXPOSURE,
  CYBORG_MALE_CHARACTERS: load('cyborg_male_characters'),
  CYBORG_MALE_ACTIONS: load('cyborg_male_actions'),
  // Scene pools
  COSMIC_PHENOMENA: load('cosmic_phenomena'),
  COSMIC_ANCHORS: load('cosmic_anchors'),
  MEGASTRUCTURES: load('megastructures'),
  ALIEN_LANDSCAPES: load('alien_landscapes'),
  SPACE_OPERA_SCENES: load('space_opera_scenes'),
  SCI_FI_INTERIORS: load('sci_fi_interiors'),
  COZY_SCI_FI_INTERIORS: load('cozy_sci_fi_interiors'),
  ALIEN_CITIES: load('alien_cities'),
  ROBOT_TYPES: load('robot_types'),
  TRANQUIL_MOMENTS: load('tranquil_moments'),
  REAL_SPACE_SUBJECTS: load('real_space_subjects'),
  COSMIC_ORACLE_CHARACTERS: load('cosmic_oracle_characters'),
  COSMIC_ORACLE_ACTIONS: load('cosmic_oracle_actions'),
  COSMIC_ORACLE_LOCATIONS: load('cosmic_oracle_locations'),
  FEMALE_EXPLORERS: load('female_explorers'),
  MALE_EXPLORERS: load('male_explorers'),
  SCI_FI_FEMALE_OUTFITS: load('sci_fi_female_outfits'),
  SCI_FI_MALE_OUTFITS: load('sci_fi_male_outfits'),
  SCI_FI_ACTIONS: load('sci_fi_actions'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  CAMERA_ANGLES: load('camera_angles'),
  CITY_CAMERA_ANGLES: load('city_camera_angles'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
