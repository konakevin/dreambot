/**
 * BloomBot — axis pools. All Sonnet-seeded 50-entry pools.
 *
 * Regenerate:  node scripts/gen-seeds/bloombot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// VIBE_COLOR — secondary lighting palette keyed to vibe (inline, not rolled).
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, honey-gold highlights',
  cozy: 'warm amber ambient, soft golden-hour glow, deep magenta shadows',
  ancient: 'molten amber sunbeams, bronze patina, electric teal shadows',
  ethereal: 'pearl-white ambient, opalescent mist, prismatic sparkles',
  epic: 'dramatic god rays, molten gold, deep magenta shadows',
  psychedelic: 'kaleidoscopic color splits, impossible magentas, acid greens',
  nostalgic: 'warm amber light, golden particles drifting, soft copper glow',
  voltage: 'electric blue arcs, neon magenta accents',
  shimmer: 'shimmering gold particles, iridescent highlights, soft warm rim',
  arcane: 'deep violet and emerald glows, mystical candlelight',
  enchanted: 'soft magical glow, gentle sparkles, dreamy luminescence',
  peaceful: 'soft diffuse light, gentle pastels, serene calm',
  whimsical: 'playful pastels, warm creamy light, sparkle motes',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  nightshade: 'deep plum and obsidian, cold moonlight silver accents',
  surreal: 'impossible color pairings, dream-logic lighting, hallucinatory',
};

module.exports = {
  // Shared axes
  FLOWER_TYPES: load('flower_types'),
  SCENE_PALETTES: load('scene_palettes'),
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  // Path-specific
  LANDSCAPE_SETTINGS: load('landscape_settings'),
  CLOSEUP_FRAMINGS: load('closeup_framings'),
  COZY_INTERIORS: load('cozy_interiors'),
  GARDEN_WALKS: load('garden_walks'),
  COSMIC_SCENES: load('cosmic_scenes'),
  DREAMSCAPE_CONTEXTS: load('dreamscape_contexts'),
  // Inline
  VIBE_COLOR,
};
