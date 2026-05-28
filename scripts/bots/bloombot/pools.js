/**
 * BloomBot pools — small + load-bearing.
 *
 * Two hand-authored pools (palettes + lighting) plus one Sonnet-generated
 * sensory pool. Regional flora roster lives in species-roster.js as a JS
 * module rather than JSON because it's keyed lookup, not random pick.
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

module.exports = {
  PALETTES: load('palettes'),
  LIGHTING: load('lighting'),
  // ─── landscape path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_LANDSCAPE_LANDFORM: loadIfExists('bloombot_landscape_landform'),
  BLOOMBOT_LANDSCAPE_SCALE_PROVER: loadIfExists('bloombot_landscape_scale_prover'),
  BLOOMBOT_LANDSCAPE_SURPRISE_ELEMENT: loadIfExists('bloombot_landscape_surprise_element'),
  BLOOMBOT_LANDSCAPE_SKY: loadIfExists('bloombot_landscape_sky'),
  BLOOMBOT_LANDSCAPE_PHENOMENON: loadIfExists('bloombot_landscape_phenomenon'),
  // ─── closeup path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CLOSEUP_BLOOM_WALL_TYPE: loadIfExists('bloombot_closeup_bloom_wall_type'),
  BLOOMBOT_CLOSEUP_GROWING_CONTEXT: loadIfExists('bloombot_closeup_growing_context'),
  BLOOMBOT_CLOSEUP_MACRO_PHENOMENON: loadIfExists('bloombot_closeup_macro_phenomenon'),
  // ─── reclaim path: declarative axis-system pools (2026-05-17 migration) ───
  BLOOMBOT_RECLAIM_RUIN_TYPE: loadIfExists('bloombot_reclaim_ruin_type'),
  BLOOMBOT_RECLAIM_DECAY_ANCHOR: loadIfExists('bloombot_reclaim_decay_anchor'),
  BLOOMBOT_RECLAIM_ATMOSPHERIC_PHENOMENON: loadIfExists('bloombot_reclaim_atmospheric_phenomenon'),
  // ─── city-flowers path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CITY_FLOWERS_CITY_SETTING: loadIfExists('bloombot_city_flowers_city_setting'),
  BLOOMBOT_CITY_FLOWERS_ARCHITECTURAL_DETAIL: loadIfExists(
    'bloombot_city_flowers_architectural_detail'
  ),
  BLOOMBOT_CITY_FLOWERS_ATMOSPHERIC_PHENOMENON: loadIfExists(
    'bloombot_city_flowers_atmospheric_phenomenon'
  ),
  // ─── flower-tunnels path (2026-05-19) — POV through bloom-tunnels w/ flowers as light source ───
  BLOOMBOT_FLOWER_TUNNELS_TUNNEL_SETTING: loadIfExists('bloombot_flower_tunnels_tunnel_setting'),
  BLOOMBOT_FLOWER_TUNNELS_FLOWER_LANTERNS: loadIfExists('bloombot_flower_tunnels_flower_lanterns'),
  BLOOMBOT_FLOWER_TUNNELS_ATMOSPHERIC_PHENOMENON: loadIfExists(
    'bloombot_flower_tunnels_atmospheric_phenomenon'
  ),
  // ─── flower-friends path (2026-05-19) — close-up flower + pleasant pollinator pairing ───
  BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER: loadIfExists(
    'bloombot_flower_friends_flower_focal_cluster'
  ),
  BLOOMBOT_FLOWER_FRIENDS_HERO_POLLINATOR: loadIfExists('bloombot_flower_friends_hero_pollinator'),
  BLOOMBOT_FLOWER_FRIENDS_MAGICAL_PARTICLES: loadIfExists(
    'bloombot_flower_friends_magical_particles'
  ),
  // ─── flower-humming-birds path (2026-05-19) — vibrant hummingbird + flower scenes ───
  BLOOMBOT_FLOWER_HUMMING_BIRDS_FLOWER_FOCAL_CLUSTER: loadIfExists(
    'bloombot_flower_humming_birds_flower_focal_cluster'
  ),
  BLOOMBOT_FLOWER_HUMMING_BIRDS_HUMMINGBIRD_CAST: loadIfExists(
    'bloombot_flower_humming_birds_hummingbird_cast'
  ),
  BLOOMBOT_FLOWER_HUMMING_BIRDS_MAGICAL_PARTICLES: loadIfExists(
    'bloombot_flower_humming_birds_magical_particles'
  ),
  // ─── flower-fantasy path (2026-05-19) — surreal scale-inversion flower landscapes ───
  BLOOMBOT_FLOWER_FANTASY_SCALE_FORM: loadIfExists('bloombot_flower_fantasy_scale_form'),
  BLOOMBOT_FLOWER_FANTASY_FLOOR_CARPET: loadIfExists('bloombot_flower_fantasy_floor_carpet'),
  BLOOMBOT_FLOWER_FANTASY_ATMOSPHERIC_MAGIC: loadIfExists(
    'bloombot_flower_fantasy_atmospheric_magic'
  ),
  // ─── flower-grove path (2026-05-27) — FUN/CRAZY Lorax-Truffula fluffy flower-tree groves ───
  BLOOMBOT_FLOWER_GROVE_GROVE: loadIfExists('bloombot_flower_grove_grove'),
  BLOOMBOT_FLOWER_GROVE_GROUND: loadIfExists('bloombot_flower_grove_ground'),
  BLOOMBOT_FLOWER_GROVE_WHIMSY: loadIfExists('bloombot_flower_grove_whimsy'),
  // ─── flower-arrangement path (2026-05-27) — ornate florist arrangement hero in a lush garden ───
  BLOOMBOT_FLOWER_ARRANGEMENT_VESSEL: loadIfExists('bloombot_flower_arrangement_vessel'),
  BLOOMBOT_FLOWER_ARRANGEMENT_STYLE: loadIfExists('bloombot_flower_arrangement_style'),
  BLOOMBOT_FLOWER_ARRANGEMENT_SETTING: loadIfExists('bloombot_flower_arrangement_setting'),
  BLOOMBOT_FLOWER_ARRANGEMENT_WHIMSY: loadIfExists('bloombot_flower_arrangement_whimsy'),
  // ─── desert-bloom path (2026-05-19) — southwest desert + wildflower explosion ───
  BLOOMBOT_DESERT_BLOOM_DESERT_ANCHOR: loadIfExists('bloombot_desert_bloom_desert_anchor'),
  BLOOMBOT_DESERT_BLOOM_BLOOM_EXPLOSION: loadIfExists('bloombot_desert_bloom_bloom_explosion'),
  BLOOMBOT_DESERT_BLOOM_ATMOSPHERIC_MAGIC: loadIfExists('bloombot_desert_bloom_atmospheric_magic'),
  // desert-safe lighting subset (filters out rainstorm/snowstorm/ice/underwater/etc.)
  BLOOMBOT_DESERT_BLOOM_LIGHTING: loadIfExists('bloombot_desert_bloom_lighting'),
  // ─── sunset-flowers path (2026-05-19) — sun-backlit flowers against epic landscape + sunset sky ───
  BLOOMBOT_SUNSET_FLOWERS_HERO_FLOWER: loadIfExists('bloombot_sunset_flowers_hero_flower'),
  BLOOMBOT_SUNSET_FLOWERS_LANDSCAPE_BACKDROP: loadIfExists(
    'bloombot_sunset_flowers_landscape_backdrop'
  ),
  BLOOMBOT_SUNSET_FLOWERS_SUNSET_SKY: loadIfExists('bloombot_sunset_flowers_sunset_sky'),
  BLOOMBOT_SUNSET_FLOWERS_SUN_POSITION: loadIfExists('bloombot_sunset_flowers_sun_position'),
  BLOOMBOT_SUNSET_FLOWERS_ATMOSPHERIC_PHENOMENON: loadIfExists(
    'bloombot_sunset_flowers_atmospheric_phenomenon'
  ),
  // ─── conservatory path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_CONSERVATORY_CONSERVATORY_TYPE: loadIfExists('bloombot_conservatory_conservatory_type'),
  BLOOMBOT_CONSERVATORY_STRUCTURAL_ANCHOR: loadIfExists('bloombot_conservatory_structural_anchor'),
  BLOOMBOT_CONSERVATORY_ATMOSPHERIC_PHENOMENON: loadIfExists(
    'bloombot_conservatory_atmospheric_phenomenon'
  ),
  // ─── dreamscape path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_DREAMSCAPE_IMPOSSIBILITY_TYPE: loadIfExists('bloombot_dreamscape_impossibility_type'),
  BLOOMBOT_DREAMSCAPE_WORLD_ELEMENT: loadIfExists('bloombot_dreamscape_world_element'),
  BLOOMBOT_DREAMSCAPE_ATMOSPHERIC_HALO: loadIfExists('bloombot_dreamscape_atmospheric_halo'),
  // ─── garden-walk path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_GARDEN_WALK_ARCHWAY_TYPE: loadIfExists('bloombot_garden_walk_archway_type'),
  BLOOMBOT_GARDEN_WALK_PATH_MATERIAL: loadIfExists('bloombot_garden_walk_path_material'),
  BLOOMBOT_GARDEN_WALK_DESTINATION_GLIMPSE: loadIfExists(
    'bloombot_garden_walk_destination_glimpse'
  ),
  BLOOMBOT_GARDEN_WALK_ATMOSPHERIC_PHENOMENON: loadIfExists(
    'bloombot_garden_walk_atmospheric_phenomenon'
  ),
  // ─── cozy path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_COZY_INTERIOR_SETTING: loadIfExists('bloombot_cozy_interior_setting'),
  BLOOMBOT_COZY_FURNITURE_ANCHOR: loadIfExists('bloombot_cozy_furniture_anchor'),
  BLOOMBOT_COZY_ATMOSPHERIC_MOMENT: loadIfExists('bloombot_cozy_atmospheric_moment'),
  // ─── tropical-paradise path: declarative axis-system pools (2026-05-16 migration) ───
  BLOOMBOT_TROPICAL_PARADISE_TROPICAL_SETTING: loadIfExists(
    'bloombot_tropical_paradise_tropical_setting'
  ),
  BLOOMBOT_TROPICAL_PARADISE_VEGETATION_ANCHOR: loadIfExists(
    'bloombot_tropical_paradise_vegetation_anchor'
  ),
  BLOOMBOT_TROPICAL_PARADISE_SURPRISE_CREATURE: loadIfExists(
    'bloombot_tropical_paradise_surprise_creature'
  ),
  SENSORY_POOLS: {
    scene: {
      lightcolor: load('sensory_lightcolor'),
    },
  },
};
