/**
 * ForestBot — axis pools. POC: single Sonnet-seeded pool of forest-fairy
 * scenes. Add more axes (lighting, atmosphere, palette variety) once the
 * look is approved.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

function loadIfExists(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

// Single vibe-color line for now — peaceful is the default mood for this
// bot. Three options for variety; each entry is a short atmospheric
// secondary-light cue that pairs with the gouache palette.
const VIBE_COLOR = {
  peaceful: 'soft golden afternoon glow filtering through canopy, dappled warm calm',
  enchanted: 'soft magical violet-twilight glow, faint pollen-light particles, dreamy lavender-blue',
  ethereal: 'pearl-white morning mist, luminous pale haze, opalescent painted softness',
  nostalgic: 'faded warm sepia-gold, painted-storybook softness, gentle umber',
  whimsical: 'buoyant pastel forest tones, Ghibli-warm cream highlights, playful softness',
};

module.exports = {
  FOREST_FAIRY_SCENES: load('forest_fairy_scenes'),
  FOREST_CREATURES: load('forest_creatures'),
  DRYAD_PORTRAITS: load('dryad_portraits'),
  TINY_FAE: load('tiny_fae'),
  FAIRY_COURT: load('fairy_court'),
  ENCHANTED_VISTA: load('enchanted_vista'),
  FAE_VILLAGES: load('fae_villages'),
  VILLAGE_LIGHTING: load('village_lighting'),
  VILLAGE_WILDLIFE: load('village_wildlife'),
  VILLAGE_FOREST_DETAIL: load('village_forest_detail'),
  // ─── flower-fairy path: FaeBot-native rebuild (2026-05-17 R4) ───
  FAEBOT_FLOWER_FAIRY_FAIRY_CREATURE: loadIfExists('faebot_flower_fairy_fairy_creature'),
  FAEBOT_FLOWER_FAIRY_FLORAL_ATTIRE: loadIfExists('faebot_flower_fairy_floral_attire'),
  FAEBOT_FLOWER_FAIRY_CANDID_ACTION: loadIfExists('faebot_flower_fairy_candid_action'),
  FAEBOT_FLOWER_FAIRY_MAGICAL_SIGNATURE: loadIfExists('faebot_flower_fairy_magical_signature'),
  // Legacy bloom-spirit-style pools (kept for reference / fallback)
  FAEBOT_FLOWER_FAIRY_RACE: loadIfExists('faebot_flower_fairy_race'),
  FAEBOT_FLOWER_FAIRY_SKIN_TONE: loadIfExists('faebot_flower_fairy_skin_tone'),
  FAEBOT_FLOWER_FAIRY_EYES: loadIfExists('faebot_flower_fairy_eyes'),
  FAEBOT_FLOWER_FAIRY_HAIR_COLOR: loadIfExists('faebot_flower_fairy_hair_color'),
  FAEBOT_FLOWER_FAIRY_HAIRSTYLE: loadIfExists('faebot_flower_fairy_hairstyle'),
  FAEBOT_FLOWER_FAIRY_HAIR_FLORAL: loadIfExists('faebot_flower_fairy_hair_floral'),
  FAEBOT_FLOWER_FAIRY_BLOOM_GOWN: loadIfExists('faebot_flower_fairy_bloom_gown'),
  FAEBOT_FLOWER_FAIRY_WINGS: loadIfExists('faebot_flower_fairy_wings'),
  FAEBOT_FLOWER_FAIRY_GARDEN_BACKDROP: loadIfExists('faebot_flower_fairy_garden_backdrop'),
  FAEBOT_FLOWER_FAIRY_ATMOSPHERIC_PHENOMENON: loadIfExists('faebot_flower_fairy_atmospheric_phenomenon'),
  VIBE_COLOR,
};
