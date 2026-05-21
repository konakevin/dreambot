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

  // ============ CHECKERED-TABLETOP path pools ============
  TABLETOP_VESSEL_HERO: load('tabletop_vessel_hero'),
  TABLETOP_MINI_CREATURE_PILE: load('tabletop_mini_creature_pile'),
  TABLETOP_PATTERN: load('tabletop_pattern'),
  TABLETOP_SCATTERED_MINIS: load('tabletop_scattered_minis'),
  TABLETOP_DECOR_CLUSTERS: load('tabletop_decor_clusters'),
  TABLETOP_CAMERA: load('tabletop_camera'),
  TABLETOP_LIGHTING: load('tabletop_lighting'),

  VIBE_COLOR,
};
