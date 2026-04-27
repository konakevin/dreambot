const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'dramatic directional light carving deep shadow, high-contrast chiaroscuro, cinematic depth',
  epic: 'blazing light through dust and incense, monumental scale, heroic drama',
  ancient: 'weathered bronze patina, deep umber shadow, warm lamplight on cool stone',
  ethereal: 'soft rose-and-pearl dawn glow, mist-diffused luminosity, pale sky reflections on water',
  dark: 'deep storm-light over stone, bruised violet-gray sky, cool blue shadow with single warm break',
  peaceful: 'soft pastoral light, river-reflection shimmer, warm and cool tones balanced',
  surreal: 'impossible color contrasts, lapis-blue shadow meeting carnelian-orange light, dreamlike atmosphere',
};

module.exports = {
  CIVILIZATIONS: load('civilizations'),
  GRAND_TEMPLES: load('grand_temples'),
  ANCIENT_CITIES: load('ancient_cities'),
  MONUMENTS: load('monuments'),
  RIVER_SCENES: load('river_scenes'),
  HARBOR_SCENES: load('harbor_scenes'),
  LOST_RUINS: load('lost_ruins'),
  ANCIENT_INTERIORS: load('ancient_interiors'),
  QUIET_SCENES: load('quiet_scenes'),
  WATER_SCENES: load('water_scenes'),
  FROST_SCENES: load('frost_scenes'),
  NIGHT_SCENES: load('night_scenes'),
  JUNGLE_SCENES: load('jungle_scenes'),
  ISLAND_SCENES: load('island_scenes'),
  HUMAN_ACTIVITY: load('human_activity'),
  ARCHITECTURAL_DETAILS: load('architectural_details'),
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
