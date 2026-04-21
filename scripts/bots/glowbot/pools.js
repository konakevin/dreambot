/**
 * GlowBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/glowbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// VIBE_COLOR keyed to allowed vibes
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, luminous highlights',
  cozy: 'warm amber ambient, soft golden glow, gentle shadows',
  epic: 'dramatic divine god rays, rich golden highlights, deep peaceful shadows',
  nostalgic: 'warm amber drifting light, copper glow, soft pastels',
  psychedelic: 'luminous color splits, impossible magentas, soft acid greens, glowing violet',
  peaceful: 'soft diffuse light, gentle pastels, breath-worthy calm',
  whimsical: 'playful soft pastels, warm creamy light, sparkle motes',
  ethereal: 'pearl-white ambient, opalescent mist, prismatic sparkles',
  arcane: 'deep violet and emerald glows, mystical luminous candlelight, runic shimmer',
  ancient: 'molten amber sunbeams, bronze patina surfaces, soft peaceful shadows',
  enchanted: 'soft magical glow, gentle sparkles, dreamy luminescence',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  voltage: 'electric blue arcs softened, neon accents in peaceful setting',
  nightshade: 'deep violet and silver moonlight, gentle plum-tones, peaceful moonlit',
  shimmer: 'shimmering gold particles, iridescent highlights, soft warm rim',
  surreal: 'dreamy impossible color pairings, soft hallucinatory shifts',
};

module.exports = {
  LANDSCAPE_SETTINGS: load('landscape_settings'),
  ETHEREAL_SCENES: load('ethereal_scenes'),
  DIVINE_MOMENTS: load('divine_moments'),
  DREAMSCAPE_CONTEXTS: load('dreamscape_contexts'),
  INTIMATE_GLOW_SUBJECTS: load('intimate_glow_subjects'),
  LIGHT_TREATMENTS: load('light_treatments'),
  EMOTIONAL_TONES: load('emotional_tones'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  ARCHITECTURAL_ELEMENTS: load('architectural_elements'),
  VIBE_COLOR,
};
