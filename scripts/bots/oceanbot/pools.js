/**
 * OceanBot — pool registry. Each axis slot referenced by an archetype maps
 * to one entry here. Per-axis pools live in seeds/<bot>_<path>_<axis>.json
 * after the gen script for that axis runs.
 *
 * load() is resilient (try/catch ENOENT → []) so the module loads even
 * when seed files are mid-WIP across parallel agents.
 *
 * 13 paths × ~10 axes = ~130 path-bespoke pools, plus shared:
 *   ATMOSPHERES, LIGHTING, SCENE_PALETTES — universal slots
 *   SENSORY_POOLS — chaos / sensory anchors fallback
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[oceanbot/pools] seed ${name}.json missing — returning [] (likely WIP).`);
      return [];
    }
    throw err;
  }
}

const VIBE_COLOR = {
  cinematic: 'ocean cinematic palette, teal-and-orange depth, saturated cinema contrast',
  dark: 'inky abyssal blacks, deep navy shadow, storm-cloud chiaroscuro',
  peaceful: 'silvered dawn palette, soft pastel sea, dawn-mist tranquility',
  epic: 'dramatic god-ray palette, heroic sunset over swell, painterly saturation',
  nostalgic: 'faded-postcard ocean palette, copper sunset, sepia-tinted age-of-sail',
  ethereal: 'opalescent sea palette, pearl-white luminance, soft glow',
  ancient: 'weathered-bronze patina, verdigris-on-stone, age-of-empire faded color',
  enchanted: 'soft magical glow, dreamy aqua-and-rose shimmer',
  voltage: 'lightning-blue electric arcs, storm-cyan, cold cosmic accents',
  nightshade: 'deep violet moonlight, plum sea shadow, twilight silvers',
};

module.exports = {
  // ── Shared / universal axes ──
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),

  // ── deep-wonder path-bespoke pools ──
  DEEP_WONDER_DEPTH_ZONE: load('deep_wonder_depth_zone'),
  DEEP_WONDER_ABYSSAL_ANCHOR: load('deep_wonder_abyssal_anchor'),
  DEEP_WONDER_DEEP_MARINE_LIFE: load('deep_wonder_deep_marine_life'),
  DEEP_WONDER_BIOLUMINESCENT_SOURCE: load('deep_wonder_bioluminescent_source'),
  DEEP_WONDER_WATER_COLUMN_QUALITY: load('deep_wonder_water_column_quality'),
  DEEP_WONDER_CAUSTIC_OR_GLOW: load('deep_wonder_caustic_or_glow'),
  DEEP_WONDER_FOREGROUND_ELEMENT: load('deep_wonder_foreground_element'),
  DEEP_WONDER_SCALE_PROVERS: load('deep_wonder_scale_provers'),
  DEEP_WONDER_CAMERA_FRAMING: load('deep_wonder_camera_framing'),
  DEEP_WONDER_SURPRISE_ELEMENT: load('deep_wonder_surprise_element'),
  DEEP_WONDER_DRAMA: load('deep_wonder_drama'),

  // ── undersea-seascape path-bespoke pools ──
  UNDERSEA_SEASCAPE_BIOME_ANCHOR: load('undersea_seascape_biome_anchor'),
  UNDERSEA_SEASCAPE_MARINE_LIFE: load('undersea_seascape_marine_life'),
  UNDERSEA_SEASCAPE_SUBMERGED_STRUCTURE: load('undersea_seascape_submerged_structure'),
  UNDERSEA_SEASCAPE_FOREGROUND_ELEMENT: load('undersea_seascape_foreground_element'),
  UNDERSEA_SEASCAPE_CAUSTIC_LIGHT: load('undersea_seascape_caustic_light'),
  UNDERSEA_SEASCAPE_WATER_CLARITY: load('undersea_seascape_water_clarity'),
  UNDERSEA_SEASCAPE_WEATHER_IN_WATER: load('undersea_seascape_weather_in_water'),
  UNDERSEA_SEASCAPE_DEPTH_SETTING: load('undersea_seascape_depth_setting'),
  UNDERSEA_SEASCAPE_CAMERA_FRAMING: load('undersea_seascape_camera_framing'),
  UNDERSEA_SEASCAPE_SURPRISE_ELEMENT: load('undersea_seascape_surprise_element'),
  UNDERSEA_SEASCAPE_DRAMA: load('undersea_seascape_drama'),

  // ── shipwreck-kingdom path-bespoke pools ──
  SHIPWRECK_KINGDOM_WRECK_CLASS: load('shipwreck_kingdom_wreck_class'),
  SHIPWRECK_KINGDOM_RECLAMATION_STATE: load('shipwreck_kingdom_reclamation_state'),
  SHIPWRECK_KINGDOM_CORAL_GROWTH: load('shipwreck_kingdom_coral_growth'),
  SHIPWRECK_KINGDOM_MARINE_LIFE: load('shipwreck_kingdom_marine_life'),
  SHIPWRECK_KINGDOM_CAUSTIC_LIGHT: load('shipwreck_kingdom_caustic_light'),
  SHIPWRECK_KINGDOM_WATER_CLARITY: load('shipwreck_kingdom_water_clarity'),
  SHIPWRECK_KINGDOM_FOREGROUND_ELEMENT: load('shipwreck_kingdom_foreground_element'),
  SHIPWRECK_KINGDOM_SCALE_PROVERS: load('shipwreck_kingdom_scale_provers'),
  SHIPWRECK_KINGDOM_CAMERA_FRAMING: load('shipwreck_kingdom_camera_framing'),
  SHIPWRECK_KINGDOM_SURPRISE_ELEMENT: load('shipwreck_kingdom_surprise_element'),
  SHIPWRECK_KINGDOM_DRAMA: load('shipwreck_kingdom_drama'),

  // ── polar-seas path-bespoke pools ──
  POLAR_SEAS_ICE_ANCHOR: load('polar_seas_ice_anchor'),
  POLAR_SEAS_POLAR_BIOME: load('polar_seas_polar_biome'),
  POLAR_SEAS_POLAR_MARINE_LIFE: load('polar_seas_polar_marine_life'),
  POLAR_SEAS_SKY_PHENOMENON: load('polar_seas_sky_phenomenon'),
  POLAR_SEAS_WATER_STATE: load('polar_seas_water_state'),
  POLAR_SEAS_LIGHT_SIGNATURE: load('polar_seas_light_signature'),
  POLAR_SEAS_FOREGROUND_ELEMENT: load('polar_seas_foreground_element'),
  POLAR_SEAS_SCALE_PROVERS: load('polar_seas_scale_provers'),
  POLAR_SEAS_CAMERA_FRAMING: load('polar_seas_camera_framing'),
  POLAR_SEAS_SURPRISE_ELEMENT: load('polar_seas_surprise_element'),
  POLAR_SEAS_DRAMA: load('polar_seas_drama'),

  // ── calm-glass-sea path-bespoke pools ──
  CALM_GLASS_SEA_TIME_OF_DAY: load('calm_glass_sea_time_of_day'),
  CALM_GLASS_SEA_REFLECTION_ANCHOR: load('calm_glass_sea_reflection_anchor'),
  CALM_GLASS_SEA_SKY_SIGNATURE: load('calm_glass_sea_sky_signature'),
  CALM_GLASS_SEA_WATER_CLARITY: load('calm_glass_sea_water_clarity'),
  CALM_GLASS_SEA_ATMOSPHERIC_HAZE: load('calm_glass_sea_atmospheric_haze'),
  CALM_GLASS_SEA_FOREGROUND_ELEMENT: load('calm_glass_sea_foreground_element'),
  CALM_GLASS_SEA_DISTANT_SILHOUETTE: load('calm_glass_sea_distant_silhouette'),
  CALM_GLASS_SEA_LIGHT_SIGNATURE: load('calm_glass_sea_light_signature'),
  CALM_GLASS_SEA_CAMERA_FRAMING: load('calm_glass_sea_camera_framing'),
  CALM_GLASS_SEA_SURPRISE_ELEMENT: load('calm_glass_sea_surprise_element'),
  CALM_GLASS_SEA_DRAMA: load('calm_glass_sea_drama'),

  // ── whale-encounter path-bespoke pools ──
  WHALE_ENCOUNTER_WHALE_SPECIES: load('whale_encounter_whale_species'),
  WHALE_ENCOUNTER_WHALE_ACTION: load('whale_encounter_whale_action'),
  WHALE_ENCOUNTER_DEPTH_SETTING: load('whale_encounter_depth_setting'),
  WHALE_ENCOUNTER_LIGHT_SIGNATURE: load('whale_encounter_light_signature'),
  WHALE_ENCOUNTER_WATER_CLARITY: load('whale_encounter_water_clarity'),
  WHALE_ENCOUNTER_MARINE_SUPPORTING_LIFE: load('whale_encounter_marine_supporting_life'),
  WHALE_ENCOUNTER_FOREGROUND_ELEMENT: load('whale_encounter_foreground_element'),
  WHALE_ENCOUNTER_SCALE_PROVERS: load('whale_encounter_scale_provers'),
  WHALE_ENCOUNTER_CAMERA_FRAMING: load('whale_encounter_camera_framing'),
  WHALE_ENCOUNTER_SURPRISE_ELEMENT: load('whale_encounter_surprise_element'),
  WHALE_ENCOUNTER_DRAMA: load('whale_encounter_drama'),

  // ── bioluminescent-night path-bespoke pools ──
  BIOLUMINESCENT_NIGHT_BIOLUMINESCENT_ANCHOR: load('bioluminescent_night_bioluminescent_anchor'),
  BIOLUMINESCENT_NIGHT_LIGHT_PATTERN: load('bioluminescent_night_light_pattern'),
  BIOLUMINESCENT_NIGHT_DEPTH_SETTING: load('bioluminescent_night_depth_setting'),
  BIOLUMINESCENT_NIGHT_SUPPORTING_MARINE_LIFE: load('bioluminescent_night_supporting_marine_life'),
  BIOLUMINESCENT_NIGHT_WATER_STATE: load('bioluminescent_night_water_state'),
  BIOLUMINESCENT_NIGHT_FOREGROUND_ELEMENT: load('bioluminescent_night_foreground_element'),
  BIOLUMINESCENT_NIGHT_ATMOSPHERIC_HAZE: load('bioluminescent_night_atmospheric_haze'),
  BIOLUMINESCENT_NIGHT_COLOR_SIGNATURE: load('bioluminescent_night_color_signature'),
  BIOLUMINESCENT_NIGHT_CAMERA_FRAMING: load('bioluminescent_night_camera_framing'),
  BIOLUMINESCENT_NIGHT_SURPRISE_ELEMENT: load('bioluminescent_night_surprise_element'),
  BIOLUMINESCENT_NIGHT_DRAMA: load('bioluminescent_night_drama'),

  // ── storm-surface path-bespoke pools ──
  STORM_SURFACE_STORM_TYPE: load('storm_surface_storm_type'),
  STORM_SURFACE_SEA_STATE: load('storm_surface_sea_state'),
  STORM_SURFACE_SKY_SIGNATURE: load('storm_surface_sky_signature'),
  STORM_SURFACE_LIGHT_PHENOMENON: load('storm_surface_light_phenomenon'),
  STORM_SURFACE_VESSEL_OPTIONAL: load('storm_surface_vessel_optional'),
  STORM_SURFACE_FOREGROUND_ELEMENT: load('storm_surface_foreground_element'),
  STORM_SURFACE_SCALE_PROVERS: load('storm_surface_scale_provers'),
  STORM_SURFACE_WEATHER_AIR: load('storm_surface_weather_air'),
  STORM_SURFACE_CAMERA_FRAMING: load('storm_surface_camera_framing'),
  STORM_SURFACE_SURPRISE_ELEMENT: load('storm_surface_surprise_element'),
  STORM_SURFACE_DRAMA: load('storm_surface_drama'),

  // ── ghost-ship path-bespoke pools ──
  GHOST_SHIP_SHIP_CLASS: load('ghost_ship_ship_class'),
  GHOST_SHIP_DECAY_STATE: load('ghost_ship_decay_state'),
  GHOST_SHIP_FOG_LAYER: load('ghost_ship_fog_layer'),
  GHOST_SHIP_SEA_STATE: load('ghost_ship_sea_state'),
  GHOST_SHIP_LIGHT_SIGNATURE: load('ghost_ship_light_signature'),
  GHOST_SHIP_GHOSTLY_PHENOMENON: load('ghost_ship_ghostly_phenomenon'),
  GHOST_SHIP_FOREGROUND_ELEMENT: load('ghost_ship_foreground_element'),
  GHOST_SHIP_SCALE_PROVERS: load('ghost_ship_scale_provers'),
  GHOST_SHIP_CAMERA_FRAMING: load('ghost_ship_camera_framing'),
  GHOST_SHIP_SURPRISE_ELEMENT: load('ghost_ship_surprise_element'),
  GHOST_SHIP_DRAMA: load('ghost_ship_drama'),

  // ── kraken-leviathan path-bespoke pools ──
  KRAKEN_LEVIATHAN_LEVIATHAN_TYPE: load('kraken_leviathan_leviathan_type'),
  KRAKEN_LEVIATHAN_ACTION_MOMENT: load('kraken_leviathan_action_moment'),
  KRAKEN_LEVIATHAN_OCEAN_SETTING: load('kraken_leviathan_ocean_setting'),
  KRAKEN_LEVIATHAN_SCALE_PROVERS: load('kraken_leviathan_scale_provers'),
  KRAKEN_LEVIATHAN_THREAT_SIGNAL: load('kraken_leviathan_threat_signal'),
  KRAKEN_LEVIATHAN_ATMOSPHERIC_DRAMA: load('kraken_leviathan_atmospheric_drama'),
  KRAKEN_LEVIATHAN_WATER_STATE: load('kraken_leviathan_water_state'),
  KRAKEN_LEVIATHAN_LIGHT_SIGNATURE: load('kraken_leviathan_light_signature'),
  KRAKEN_LEVIATHAN_CAMERA_FRAMING: load('kraken_leviathan_camera_framing'),
  KRAKEN_LEVIATHAN_SURPRISE_ELEMENT: load('kraken_leviathan_surprise_element'),
  KRAKEN_LEVIATHAN_DRAMA: load('kraken_leviathan_drama'),

  // ── lost-cities path-bespoke pools ──
  LOST_CITIES_ARCHITECTURAL_ANCHOR: load('lost_cities_architectural_anchor'),
  LOST_CITIES_CIVILIZATION_MOTIF: load('lost_cities_civilization_motif'),
  LOST_CITIES_RECLAMATION_STATE: load('lost_cities_reclamation_state'),
  LOST_CITIES_MARINE_LIFE: load('lost_cities_marine_life'),
  LOST_CITIES_CAUSTIC_LIGHT: load('lost_cities_caustic_light'),
  LOST_CITIES_WATER_CLARITY: load('lost_cities_water_clarity'),
  LOST_CITIES_FOREGROUND_ELEMENT: load('lost_cities_foreground_element'),
  LOST_CITIES_SCALE_PROVERS: load('lost_cities_scale_provers'),
  LOST_CITIES_CAMERA_FRAMING: load('lost_cities_camera_framing'),
  LOST_CITIES_SURPRISE_ELEMENT: load('lost_cities_surprise_element'),
  LOST_CITIES_DRAMA: load('lost_cities_drama'),

  // ── pirates path-bespoke pools ──
  PIRATES_VESSEL_CLASS: load('pirates_vessel_class'),
  PIRATES_ACTION_MOMENT: load('pirates_action_moment'),
  PIRATES_WEATHER_STATE: load('pirates_weather_state'),
  PIRATES_SEA_STATE: load('pirates_sea_state'),
  PIRATES_ERA_DETAIL: load('pirates_era_detail'),
  PIRATES_SCALE_PROVERS: load('pirates_scale_provers'),
  PIRATES_LIGHT_SIGNATURE: load('pirates_light_signature'),
  PIRATES_FOREGROUND_ELEMENT: load('pirates_foreground_element'),
  PIRATES_CAMERA_FRAMING: load('pirates_camera_framing'),
  PIRATES_SURPRISE_ELEMENT: load('pirates_surprise_element'),
  PIRATES_DRAMA: load('pirates_drama'),

  // ── mermaid-myth path-bespoke pools ──
  MERMAID_MYTH_MERMAID_ARCHETYPE: load('mermaid_myth_mermaid_archetype'),
  MERMAID_MYTH_TAIL_DETAIL: load('mermaid_myth_tail_detail'),
  MERMAID_MYTH_OCEAN_SETTING: load('mermaid_myth_ocean_setting'),
  MERMAID_MYTH_PAINTERLY_TRADITION: load('mermaid_myth_painterly_tradition'),
  MERMAID_MYTH_LIGHTING_PATTERN: load('mermaid_myth_lighting_pattern'),
  MERMAID_MYTH_FOREGROUND_ELEMENT: load('mermaid_myth_foreground_element'),
  MERMAID_MYTH_SEA_PHENOMENON: load('mermaid_myth_sea_phenomenon'),
  MERMAID_MYTH_SCALE_PROVERS: load('mermaid_myth_scale_provers'),
  MERMAID_MYTH_CAMERA_FRAMING: load('mermaid_myth_camera_framing'),
  MERMAID_MYTH_SURPRISE_ELEMENT: load('mermaid_myth_surprise_element'),
  MERMAID_MYTH_DRAMA: load('mermaid_myth_drama'),

  VIBE_COLOR,

  // Sensory anchor pools (chaos + sensory engine inputs). One scene-context
  // pool set across all paths since OceanBot has no character cast.
  SENSORY_POOLS: {
    scene: {
      smell: load('sensory_scene_smell'),
      sound: load('sensory_scene_sound'),
      touch: load('sensory_scene_touch'),
      temperature: load('sensory_scene_temperature'),
      weight: load('sensory_scene_weight'),
      air: load('sensory_scene_air'),
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
