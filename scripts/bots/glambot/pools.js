/**
 * GlamBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/glambot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange editorial grade, deep shadows, glossy highlights',
  dark: 'oil-black dominant, crimson accent, harsh editorial strobe',
  epic: 'dramatic backlit editorial, rich saturated highlights, heroic scale',
  nostalgic: 'faded 70s-Vogue palette, muted gold + cream + sepia',
  psychedelic: 'impossible neon pairings, hallucinatory editorial saturation',
  peaceful: 'soft diffuse editorial daylight, minimalist pale palette',
  whimsical: 'buoyant saturated fashion pastels, warm cream editorial',
  ethereal: 'pearl-white backdrop, opalescent iridescence, luminous beauty',
  arcane: 'deep violet editorial set, mystical jewel-tones',
  enchanted: 'soft magical glow, dreamy rose-gold editorial',
  fierce: 'stark crimson-and-obsidian, savage editorial strobe',
  coquette: 'rose-blush editorial set, cream + pearl (soft bold)',
  voltage: 'electric-neon editorial arcs, cyberpunk fashion strobe',
  nightshade: 'deep violet moonlit editorial, silver shadows',
  macabre: 'inked crimson-and-black, editorial dread palette',
  shimmer: 'shimmering gold-dust editorial, iridescent beauty',
  surreal: 'impossible editorial color pairings, hallucinatory glam',
};

module.exports = {
  MAKEUP_LOOKS: load('makeup_looks'),
  FASHION_OUTFITS: load('fashion_outfits'),
  BEAUTY_FACES: load('beauty_faces'),
  AVANT_GARDE_CONCEPTS: load('avant_garde_concepts'),
  HAIR_TREATMENTS: load('hair_treatments'),
  NAIL_ART: load('nail_art'),
  SKIN_TONES: load('skin_tones'),
  BODY_TYPES: load('body_types'),
  FASHION_SCENES: load('fashion_scenes'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  LIGHTING: load('lighting'),
  HAND_POSES: load('hand_poses'),
  VIBE_COLOR,
};
