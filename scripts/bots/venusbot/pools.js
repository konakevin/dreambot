/**
 * VenusBot — axis pools.
 *
 * All 50-entry rolled axes live in seeds/*.json (Sonnet-generated with
 * intra-pool dedup via scripts/lib/seedGenHelper.js). Regenerate any pool:
 *
 *     node scripts/gen-seeds/venusbot/gen-<name>.js
 *
 * VIBE_COLOR is inline because it's a KEY → VALUE map, not a pool to roll.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

// VIBE_COLOR — secondary lighting palette keyed to the render's vibe.
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic color grade, molten gold highlights, electric teal shadows',
  cozy: 'warm amber ambient light, deep magenta shadows, soft backlit glow',
  ancient: 'molten amber sunbeams, bronze patina surfaces, electric teal shadows',
  ethereal: 'pearl-white ambient glow, opalescent mist, prismatic sparkles',
  epic: 'dramatic god rays, molten gold, deep magenta shadows',
  psychedelic: 'kaleidoscopic color splits, impossible magentas, acid greens, electric violet',
  nostalgic: 'warm amber light, golden particles drifting, soft copper glow',
  voltage: 'electric blue arcs, neon magenta, cyan lightning',
  shimmer: 'shimmering gold particles, iridescent highlights, soft warm rim light',
  arcane: 'deep violet and emerald glows, mystical candlelight, runic shimmer',
  dark: 'inky shadows, single hard rim light, crimson accent, brutal chiaroscuro',
  fierce: 'blazing crimson and molten gold, sharp harsh highlights, explosive contrast',
  nightshade: 'deep plum and obsidian, cold moonlight silver accents, poison-purple atmosphere',
  surreal: 'impossible color pairings, dream-logic lighting, hallucinatory shifts',
  macabre: 'candlelit darkness, blood-red pools, bone-ivory highlights, death-in-flowers mood',
  coquette: 'rose-pink and blush atmosphere, cream highlights, soft golden-hour glow, dreamy pastel',
};

module.exports = {
  // Sonnet-seeded axis pools (all 50 entries each, loaded from seeds/)
  SKIN_TONES: load('skin_tones'),
  HAIR_STYLES: load('hair_styles'),
  BODY_TYPES: load('body_types'),
  EYE_STYLES: load('eye_styles'),
  INTERNAL_EXPOSURE: load('internal_exposure'),
  GLOW_COLORS: load('glow_colors'),
  SCENE_PALETTES: load('scene_palettes'),
  POSES: load('poses'),
  ACTION_POSES: load('action_poses'),
  EXPRESSIONS: load('expressions'),
  CYBORG_FEATURES: load('cyborg_features'),
  ENERGY_EFFECTS: load('energy_effects'),
  ACCENT_DETAILS: load('accent_details'),
  ENVIRONMENTS: load('environments'),
  MOMENTS: load('moments'),
  SEDUCTION_MOMENTS: load('seduction_moments'),
  WILDCARDS: load('wildcards'),
  HUMAN_TOUCH_VARIANTS: load('human_touch_variants'),
  // Inline — vibe-keyed lookup, not a rolled pool
  VIBE_COLOR,
};
