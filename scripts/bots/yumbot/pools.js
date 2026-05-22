/**
 * YumBot pools — 3 paths modeled on bex.ai references.
 *
 * floral-garden-cup:    vessel + overflowing_flora + tabletop_scatter + frame_branches + palette + background + lighting
 * rainbow-dreamscape:   food_inhabitants + dreamscape_setting + rainbow_element + sky_atmosphere + decor + camera + lighting
 * checkered-tabletop:   vessel_hero + mini_creature_pile + tablecloth + scattered_minis + decor_clusters + camera + lighting
 */

const fs = require('fs');
const path = require('path');

const load = (name) => {
  const p = path.resolve(__dirname, 'seeds', `${name}.json`);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return []; }
};

const VIBE_COLOR = {
  cozy: 'warm-amber + cream + soft-pink',
  peaceful: 'soft-blush + lavender + pearl-white',
  whimsical: 'rainbow-pastel + mint + bubblegum-pink',
  enchanted: 'shimmer-pearl + cherry-blossom-pink + lilac',
  coquette: 'baby-pink + cream + soft-pink-rose',
  shimmer: 'iridescent-pearl + rainbow-prism',
  nostalgic: 'cream-yellow + peach + warm-amber',
  ethereal: 'pearl-pink + lavender-mist + soft-cream',
  cinematic: 'pastel-pink + soft-blue + cream-saturated',
  surreal: 'magenta + lavender + rainbow-shimmer',
};

module.exports = {
  // ============ SHARED FOUNDATIONAL CATALOGS ============
  // Tagged kawaii food catalog — used by ALL paths via { name: 'FOOD_CATALOG', tags: [...] }
  FOOD_CATALOG: load('food_catalog'),
  // Tagged tiny companion creatures (peripheral cuties — never the hero)
  TINY_COMPANIONS: load('tiny_companions'),
  // Tagged small decor items (lanterns / flowers / ribbons / bunting / etc.)
  DECOR_ITEMS: load('decor_items'),
  // Tagged substantial landscape features (streams / ponds / trees / rocks / bridges)
  LANDSCAPE_FEATURES: load('landscape_features'),

  // ============ CANDY-FANTASY path pools (Wreck-It-Ralph Sugar Rush) ============
  CANDY_FANTASY_LANDSCAPE: load('candy_fantasy_landscape'),
  CANDY_FANTASY_SCENE_TYPE: load('candy_fantasy_scene_type'),
  CANDY_FANTASY_SIGNATURE: load('candy_fantasy_signature'),
  CANDY_FANTASY_TERRAIN: load('candy_fantasy_terrain'),
  CANDY_FANTASY_SKY: load('candy_fantasy_sky'),
  CANDY_FANTASY_LIGHTING: load('candy_fantasy_lighting'),
  CANDY_FANTASY_CAMERA: load('candy_fantasy_camera'),
  CANDY_FANTASY_TIME_OF_DAY: load('candy_fantasy_time_of_day'),
  CANDY_FANTASY_WEATHER: load('candy_fantasy_weather'),

  // ============ KAWAII-KOI-POND path pools (12-axis) ============
  KOI_SCENE_TYPE: load('koi_scene_type'),
  KOI_CREATURES: load('koi_creatures'),
  KOI_BACKDROP: load('koi_backdrop'),
  KOI_SIGNATURE: load('koi_signature'),
  KOI_TERRAIN: load('koi_terrain'),
  KOI_SKY: load('koi_sky'),
  KOI_CAMERA: load('koi_camera'),
  KOI_LIGHTING: load('koi_lighting'),
  KOI_TIME_OF_DAY: load('koi_time_of_day'),
  KOI_ATMOSPHERE: load('koi_atmosphere'),
  KOI_WATER_ELEMENT: load('koi_water_element'),
  KOI_COMPANION: load('koi_companion'),

  // ============ COQUETTE-FOOD path pools (15-axis flagship) ============
  COQUETTE_SCENE_TYPE: load('coquette_scene_type'),
  COQUETTE_BACKDROP: load('coquette_backdrop'),
  COQUETTE_SIGNATURE: load('coquette_signature'),
  COQUETTE_TERRAIN: load('coquette_terrain'),
  COQUETTE_SKY: load('coquette_sky'),
  COQUETTE_CAMERA: load('coquette_camera'),
  COQUETTE_LIGHTING: load('coquette_lighting'),
  COQUETTE_TIME_OF_DAY: load('coquette_time_of_day'),
  COQUETTE_ATMOSPHERE: load('coquette_atmosphere'),
  COQUETTE_DESSERT_MOTIF: load('coquette_dessert_motif'),
  COQUETTE_PALETTE_VARIANT: load('coquette_palette_variant'),
  COQUETTE_BOW_MOTIF: load('coquette_bow_motif'),
  COQUETTE_SCATTERED_ITEMS: load('coquette_scattered_items'),
  COQUETTE_COMPANION: load('coquette_companion'),

  // ============ COTTAGECORE-NATURE path pools (12-axis) ============
  COTTAGE_SCENE_TYPE: load('cottage_scene_type'),
  COTTAGE_BACKDROP: load('cottage_backdrop'),
  COTTAGE_SIGNATURE: load('cottage_signature'),
  COTTAGE_TERRAIN: load('cottage_terrain'),
  COTTAGE_SKY: load('cottage_sky'),
  COTTAGE_CAMERA: load('cottage_camera'),
  COTTAGE_LIGHTING: load('cottage_lighting'),
  COTTAGE_TIME_OF_DAY: load('cottage_time_of_day'),
  COTTAGE_ATMOSPHERE: load('cottage_atmosphere'),
  COTTAGE_NATURE_ELEMENT: load('cottage_nature_element'),
  COTTAGE_COMPANION: load('cottage_companion'),

  // ============ MINI-CHEF path pools (12-axis) ============
  CHEF_SCENE_TYPE: load('chef_scene_type'),
  CHEF_KITCHEN_BACKDROP: load('chef_kitchen_backdrop'),
  CHEF_SIGNATURE: load('chef_signature'),
  CHEF_TERRAIN: load('chef_terrain'),
  CHEF_SKY: load('chef_sky'),
  CHEF_CAMERA: load('chef_camera'),
  CHEF_LIGHTING: load('chef_lighting'),
  CHEF_TIME_OF_DAY: load('chef_time_of_day'),
  CHEF_ATMOSPHERE: load('chef_atmosphere'),
  CHEF_COMPANION: load('chef_companion'),
  CHEF_DISH_BEING_PREPARED: load('chef_dish_being_prepared'),

  // ============ JAPANESE-FESTIVAL path pools (11-axis) ============
  FESTIVAL_SCENE_TYPE: load('festival_scene_type'),
  FESTIVAL_MARKET_BACKDROP: load('festival_market_backdrop'),
  FESTIVAL_SIGNATURE: load('festival_signature'),
  FESTIVAL_TERRAIN: load('festival_terrain'),
  FESTIVAL_SKY: load('festival_sky'),
  FESTIVAL_CAMERA: load('festival_camera'),
  FESTIVAL_LIGHTING: load('festival_lighting'),
  FESTIVAL_TIME_OF_DAY: load('festival_time_of_day'),
  FESTIVAL_WEATHER: load('festival_weather'),
  FESTIVAL_COMPANION: load('festival_companion'),

  // ============ FLORAL-GARDEN-CUP path pools ============
  FLORAL_GARDEN_SCENE_TYPE: load('floral_garden_scene_type'),
  FLORAL_VESSEL: load('floral_vessel'),
  FLORAL_OVERFLOWING_FLORA: load('floral_overflowing_flora'),
  FLORAL_TABLETOP_SCATTER: load('floral_tabletop_scatter'),
  FLORAL_FRAME_BRANCHES: load('floral_frame_branches'),
  FLORAL_PALETTE: load('floral_palette'),
  FLORAL_BACKGROUND: load('floral_background'),
  FLORAL_LIGHTING: load('floral_lighting'),

  // ============ RAINBOW-DREAMSCAPE path pools ============
  DREAM_INHABITANTS: load('dream_inhabitants'),
  DREAM_SETTING: load('dream_setting'),
  DREAM_RAINBOW_ELEMENT: load('dream_rainbow_element'),
  DREAM_SKY_ATMOSPHERE: load('dream_sky_atmosphere'),
  DREAM_DECOR: load('dream_decor'),
  DREAM_ENVIRONMENT: load('dream_environment'),
  DREAM_CAMERA: load('dream_camera'),
  DREAM_LIGHTING: load('dream_lighting'),

  // ============ CHECKERED-TABLETOP path pools (12-axis) ============
  TABLETOP_VESSEL_HERO: load('tabletop_vessel_hero'),
  TABLETOP_MINI_CREATURE_PILE: load('tabletop_mini_creature_pile'),
  TABLETOP_PATTERN: load('tabletop_pattern'),
  TABLETOP_SCATTERED_MINIS: load('tabletop_scattered_minis'),
  TABLETOP_DECOR_CLUSTERS: load('tabletop_decor_clusters'),
  TABLETOP_CAMERA: load('tabletop_camera'),
  TABLETOP_LIGHTING: load('tabletop_lighting'),
  TABLETOP_BACKDROP: load('tabletop_backdrop'),
  TABLETOP_SIGNATURE: load('tabletop_signature'),
  TABLETOP_ATMOSPHERE: load('tabletop_atmosphere'),
  TABLETOP_TIME_OF_DAY: load('tabletop_time_of_day'),
  TABLETOP_COMPANION: load('tabletop_companion'),

  VIBE_COLOR,
};
