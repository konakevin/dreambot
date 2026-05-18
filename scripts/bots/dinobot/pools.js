const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange Jurassic cinematic grade, deep shadows',
  cozy: 'warm amber jungle glow, honey-filtered canopy',
  dark: 'oil-black dominant, single amber-sunset highlight',
  epic: 'dramatic god-rays through prehistoric forest, heroic scale',
  ancient: 'weathered primordial bronze, faded patina, deep-umber',
  ethereal: 'soft golden-hour glow, luminous pastel sky, dreamlike clarity',
  fierce: 'stark crimson + obsidian + savage amber',
  voltage: 'electric-blue lightning arcs, storm-prehistoric palette',
  nightshade: 'deep violet moonlit prehistoric, silver shadows',
  shimmer: 'shimmering gold-amber dust, iridescent scales',
  surreal: 'impossible prehistoric color pairings, dreamy primordial',
};

module.exports = {
  DINO_SPECIES: load('dino_species'),
  PREHISTORIC_SETTINGS: load('prehistoric_settings'),
  DINO_ACTIONS: load('dino_actions'),
  PREHISTORIC_ATMOSPHERES: load('prehistoric_atmospheres'),
  LIGHTING: load('lighting'),
  DINO_VISUAL_CUES: load('dino_visual_cues'),
  SCENE_PALETTES: load('scene_palettes'),
  HERD_SCENES: load('herd_scenes'),
  CLASH_SCENES: load('clash_scenes'),
  NESTING_SCENES: load('nesting_scenes'),
  SWAMP_SCENES: load('swamp_scenes'),
  OCEAN_SCENES: load('ocean_scenes'),
  VOLCANIC_SCENES: load('volcanic_scenes'),
  SILHOUETTE_SCENES: load('silhouette_scenes'),
  MICRO_DETAILS: load('micro_details'),
  EXTINCTION_SCENES: load('extinction_scenes'),
  COZY_DINO_ACTIONS: load('cozy_dino_actions'),
  PACK_DINO_ACTIONS: load('pack_dino_actions'),
  // Aerial-perspectives path
  AERIAL_SUBJECTS: load('aerial_subjects'),
  AERIAL_ACTIONS: load('aerial_actions'),
  AERIAL_SETTINGS: load('aerial_settings'),
  CAMERA_ANGLES: load('camera_angles'),
  // Paleo-landscape path-bespoke pools (added 2026-05-17 — axis-system migration)
  DINOBOT_PALEO_LANDSCAPE_BIOME: load('dinobot_paleo_landscape_biome'),
  DINOBOT_PALEO_LANDSCAPE_MEGAFLORA: load('dinobot_paleo_landscape_megaflora'),
  DINOBOT_PALEO_LANDSCAPE_PHENOMENON: load('dinobot_paleo_landscape_phenomenon'),
  DINOBOT_PALEO_LANDSCAPE_SURPRISE_ELEMENT: load('dinobot_paleo_landscape_surprise_element'),
  DINOBOT_PALEO_LANDSCAPE_SKY: load('dinobot_paleo_landscape_sky'),
  // Swamp-river path-bespoke pools (added 2026-05-17 — axis-system migration)
  DINOBOT_SWAMP_RIVER_WATER_SCENE: load('dinobot_swamp_river_water_scene'),
  DINOBOT_SWAMP_RIVER_DINO: load('dinobot_swamp_river_dino'),
  DINOBOT_SWAMP_RIVER_SURPRISE: load('dinobot_swamp_river_surprise'),
  DINOBOT_SWAMP_RIVER_PHENOMENON: load('dinobot_swamp_river_phenomenon'),
  // Ocean-reptiles path-bespoke pools (added 2026-05-17 — axis-system migration, strict marine)
  DINOBOT_OCEAN_REPTILES_OCEAN_SCENE: load('dinobot_ocean_reptiles_ocean_scene'),
  DINOBOT_OCEAN_REPTILES_CREATURE: load('dinobot_ocean_reptiles_creature'),
  DINOBOT_OCEAN_REPTILES_SURPRISE: load('dinobot_ocean_reptiles_surprise'),
  DINOBOT_OCEAN_REPTILES_PHENOMENON: load('dinobot_ocean_reptiles_phenomenon'),
  // Nesting-ground path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_NESTING_GROUND_SURPRISE_ELEMENT: load('dinobot_nesting_ground_surprise_element'),
  // Herd-migration path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_HERD_MIGRATION_SURPRISE_ELEMENT: load('dinobot_herd_migration_surprise_element'),
  // Territory-clash path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_TERRITORY_CLASH_SURPRISE_ELEMENT: load('dinobot_territory_clash_surprise_element'),
  // Cinematic-silhouette path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_CINEMATIC_SILHOUETTE_SURPRISE_ELEMENT: load('dinobot_cinematic_silhouette_surprise_element'),
  // Dino-cozy path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_DINO_COZY_SURPRISE_ELEMENT: load('dinobot_dino_cozy_surprise_element'),
  // Dino-pack path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_DINO_PACK_SURPRISE_ELEMENT: load('dinobot_dino_pack_surprise_element'),
  // Aerial-perspectives path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_AERIAL_PERSPECTIVES_SURPRISE_ELEMENT: load('dinobot_aerial_perspectives_surprise_element'),
  // Dino-portrait path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_DINO_PORTRAIT_SURPRISE_ELEMENT: load('dinobot_dino_portrait_surprise_element'),
  // Dino-action path-bespoke pool (added 2026-05-17 — axis-system migration)
  DINOBOT_DINO_ACTION_SURPRISE_ELEMENT: load('dinobot_dino_action_surprise_element'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    dinosaur: { smell: load('sensory_dinosaur_smell'), sound: load('sensory_dinosaur_sound'), touch: load('sensory_dinosaur_touch'), temperature: load('sensory_dinosaur_temperature'), weight: load('sensory_dinosaur_weight'), air: load('sensory_dinosaur_air'), lightcolor: load('sensory_dinosaur_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
