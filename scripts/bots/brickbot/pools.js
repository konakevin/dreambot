const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, dramatic shadows on plastic',
  dark: 'moody low-key lighting, deep shadows, single spotlight on build',
  cozy: 'warm amber glow, firelit warmth on brick surfaces, inviting',
  epic: 'dramatic rim lighting, heroic scale, golden highlights on studs',
  nostalgic: 'faded warm vintage tone, retro LEGO catalog photography feel',
  peaceful: 'soft diffuse natural light, gentle pastel brick colors',
  ethereal: 'soft dreamy glow through transparent pieces, luminous',
  voltage: 'electric-blue accent lighting, neon glow on dark builds',
  nightshade: 'deep purple moonlit scene, silver highlights on brick edges',
  shimmer: 'golden light catching glossy plastic, iridescent reflections',
  surreal: 'impossible color combinations, dreamlike brick diorama',
  fierce: 'harsh dramatic lighting, high contrast, action-frozen energy',
};

module.exports = {
  CITY_SCENES: load('city_scenes'),
  CASTLE_SCENES: load('castle_scenes'),
  SPACE_SCENES: load('space_scenes'),
  PIRATE_SCENES: load('pirate_scenes'),
  COZY_SCENES: load('cozy_scenes'),
  MECH_SCENES: load('mech_scenes'),
  LANDSCAPE_SCENES: load('landscape_scenes'),
  DISASTER_SCENES: load('disaster_scenes'),
  MICRO_SCENES: load('micro_scenes'),
  CINEMATIC_SCENES: load('cinematic_scenes'),
  NOIR_SCENES: load('noir_scenes'),
  HORROR_SCENES: load('horror_scenes'),
  WILD_WEST_SCENES: load('wild_west_scenes'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
