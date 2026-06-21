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
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
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
  // Universal nighttime override — gated via conditionalLayer (20%) on outdoor paths.
  // When fired, an entry OVERRIDES that path's time_of_day + lighting + atmosphere.
  // Kawaii bioluminescence + paper-lantern glow + moonlit pastels register.
  KAWAII_NIGHT_AUGMENT: load('kawaii_night_augment'),

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

  // ============ Bot-wide LOOK_REGISTER axis (2026-06-06) ============
  // 25 distinct cute / kawaii visual registers (watercolor / claymation /
  // risograph / pixel / felt / vinyl / picture-book / etc.). Picked per
  // render in rollSharedDNA; paths consume via sharedDNA.lookRegister.
  // Stays 100% kawaii — only the medium varies, never the cuteness.
  YUMBOT_LOOK_REGISTER: load('yumbot_look_register'),

  // ============ MEAL-TYPES path pools (2026-06-06 trial) ============
  // Bucket-aggregated path — 6 meal-occasion sub-themes share axis pools.
  // Scenes are tagged structured objects ({tags, description}); other axes
  // are flat strings. Re-gen via scripts/gen-seeds/yumbot/gen-meal-types-*.js
  YUMBOT_MEAL_TYPES_SCENES: load('yumbot_meal_types_scenes'),
  YUMBOT_MEAL_TYPES_CAMERAS: load('yumbot_meal_types_cameras'),
  YUMBOT_MEAL_TYPES_LIGHTING: load('yumbot_meal_types_lighting'),
  YUMBOT_MEAL_TYPES_PALETTES: load('yumbot_meal_types_palettes'),
  YUMBOT_MEAL_TYPES_TIME_OF_DAY: load('yumbot_meal_types_time_of_day'),
  YUMBOT_MEAL_TYPES_COMPANIONS: load('yumbot_meal_types_companions'),
  YUMBOT_MEAL_TYPES_DECOR: load('yumbot_meal_types_decor'),
  YUMBOT_MEAL_TYPES_ATMOSPHERIC_ACCENT: load('yumbot_meal_types_atmospheric_accent'),

  // ============ WHIMSICAL path pools (2026-06-07 trial) ============
  // Bucket I — 6 whimsical-concept sub-themes share axis pools. Same
  // architecture as meal-types. Re-gen via
  // scripts/gen-seeds/yumbot/gen-whimsical-*.js
  YUMBOT_WHIMSICAL_SCENES: load('yumbot_whimsical_scenes'),
  YUMBOT_WHIMSICAL_CAMERAS: load('yumbot_whimsical_cameras'),
  YUMBOT_WHIMSICAL_LIGHTING: load('yumbot_whimsical_lighting'),
  YUMBOT_WHIMSICAL_PALETTES: load('yumbot_whimsical_palettes'),
  YUMBOT_WHIMSICAL_TIME_OF_DAY: load('yumbot_whimsical_time_of_day'),
  YUMBOT_WHIMSICAL_COMPANIONS: load('yumbot_whimsical_companions'),
  YUMBOT_WHIMSICAL_DECOR: load('yumbot_whimsical_decor'),
  YUMBOT_WHIMSICAL_ATMOSPHERIC_ACCENT: load('yumbot_whimsical_atmospheric_accent'),

  // ============ CUISINE path pools (2026-06-07 trial) ============
  // Bucket C — 7 global-cuisine sub-themes share axis pools.
  // Re-gen via scripts/gen-seeds/yumbot/gen-cuisine-*.js
  YUMBOT_CUISINE_SCENES: load('yumbot_cuisine_scenes'),
  YUMBOT_CUISINE_CAMERAS: load('yumbot_cuisine_cameras'),
  YUMBOT_CUISINE_LIGHTING: load('yumbot_cuisine_lighting'),
  YUMBOT_CUISINE_PALETTES: load('yumbot_cuisine_palettes'),
  YUMBOT_CUISINE_TIME_OF_DAY: load('yumbot_cuisine_time_of_day'),
  YUMBOT_CUISINE_COMPANIONS: load('yumbot_cuisine_companions'),
  YUMBOT_CUISINE_DECOR: load('yumbot_cuisine_decor'),
  YUMBOT_CUISINE_ATMOSPHERIC_ACCENT: load('yumbot_cuisine_atmospheric_accent'),

  // ============ SCALE path pools (2026-06-07 trial) ============
  // Bucket D — 6 scale-twist sub-themes share axis pools.
  // Re-gen via scripts/gen-seeds/yumbot/gen-scale-*.js
  YUMBOT_SCALE_SCENES: load('yumbot_scale_scenes'),
  YUMBOT_SCALE_CAMERAS: load('yumbot_scale_cameras'),
  YUMBOT_SCALE_LIGHTING: load('yumbot_scale_lighting'),
  YUMBOT_SCALE_PALETTES: load('yumbot_scale_palettes'),
  YUMBOT_SCALE_TIME_OF_DAY: load('yumbot_scale_time_of_day'),
  YUMBOT_SCALE_COMPANIONS: load('yumbot_scale_companions'),
  YUMBOT_SCALE_DECOR: load('yumbot_scale_decor'),
  YUMBOT_SCALE_ATMOSPHERIC_ACCENT: load('yumbot_scale_atmospheric_accent'),

  // ============ PLACES path pools (2026-06-07 trial) ============
  // Bucket H — 6 unexpected-place sub-themes share axis pools.
  // Re-gen via scripts/gen-seeds/yumbot/gen-places-*.js
  YUMBOT_PLACES_SCENES: load('yumbot_places_scenes'),
  YUMBOT_PLACES_CAMERAS: load('yumbot_places_cameras'),
  YUMBOT_PLACES_LIGHTING: load('yumbot_places_lighting'),
  YUMBOT_PLACES_PALETTES: load('yumbot_places_palettes'),
  YUMBOT_PLACES_TIME_OF_DAY: load('yumbot_places_time_of_day'),
  YUMBOT_PLACES_COMPANIONS: load('yumbot_places_companions'),
  YUMBOT_PLACES_DECOR: load('yumbot_places_decor'),
  YUMBOT_PLACES_ATMOSPHERIC_ACCENT: load('yumbot_places_atmospheric_accent'),

  // ============ NARRATIVE path pools (2026-06-07 trial) ============
  // Bucket F — 6 narrative-action sub-themes share axis pools.
  // Re-gen via scripts/gen-seeds/yumbot/gen-narrative-*.js
  YUMBOT_NARRATIVE_SCENES: load('yumbot_narrative_scenes'),
  // food-adventures storytelling path (2026-06-21) — embodied food characters
  // out doing activities in real-world locations. Reuses the narrative axis
  // pools for camera/lighting/palette/time/companion/decor/atmospheric.
  YUMBOT_FOOD_ADVENTURES_SCENES: load('yumbot_food_adventures_scenes'),
  YUMBOT_NARRATIVE_CAMERAS: load('yumbot_narrative_cameras'),
  YUMBOT_NARRATIVE_LIGHTING: load('yumbot_narrative_lighting'),
  YUMBOT_NARRATIVE_PALETTES: load('yumbot_narrative_palettes'),
  YUMBOT_NARRATIVE_TIME_OF_DAY: load('yumbot_narrative_time_of_day'),
  YUMBOT_NARRATIVE_COMPANIONS: load('yumbot_narrative_companions'),
  YUMBOT_NARRATIVE_DECOR: load('yumbot_narrative_decor'),
  YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT: load('yumbot_narrative_atmospheric_accent'),

  // ============ FRUITS-VEGGIES path pools (2026-06-07 trial) ============
  // Bucket FV — 6 organic-environment sub-themes share axis pools. Each
  // scene features a kawaii fruit/veggie HOST + 1-2 kawaii dessert FRIENDS.
  // Re-gen via scripts/gen-seeds/yumbot/gen-fruits-veggies-*.js
  YUMBOT_FRUITS_VEGGIES_SCENES: load('yumbot_fruits_veggies_scenes'),
  YUMBOT_FRUITS_VEGGIES_CAMERAS: load('yumbot_fruits_veggies_cameras'),
  YUMBOT_FRUITS_VEGGIES_LIGHTING: load('yumbot_fruits_veggies_lighting'),
  YUMBOT_FRUITS_VEGGIES_PALETTES: load('yumbot_fruits_veggies_palettes'),
  YUMBOT_FRUITS_VEGGIES_TIME_OF_DAY: load('yumbot_fruits_veggies_time_of_day'),
  YUMBOT_FRUITS_VEGGIES_COMPANIONS: load('yumbot_fruits_veggies_companions'),
  YUMBOT_FRUITS_VEGGIES_DECOR: load('yumbot_fruits_veggies_decor'),
  YUMBOT_FRUITS_VEGGIES_ATMOSPHERIC_ACCENT: load('yumbot_fruits_veggies_atmospheric_accent'),

  // ============ FAST-FOOD path pools (2026-06-07 trial) ============
  YUMBOT_FAST_FOOD_SCENES: load('yumbot_fast_food_scenes'),
  YUMBOT_FAST_FOOD_CAMERAS: load('yumbot_fast_food_cameras'),
  YUMBOT_FAST_FOOD_LIGHTING: load('yumbot_fast_food_lighting'),
  YUMBOT_FAST_FOOD_PALETTES: load('yumbot_fast_food_palettes'),
  YUMBOT_FAST_FOOD_TIME_OF_DAY: load('yumbot_fast_food_time_of_day'),
  YUMBOT_FAST_FOOD_COMPANIONS: load('yumbot_fast_food_companions'),
  YUMBOT_FAST_FOOD_DECOR: load('yumbot_fast_food_decor'),
  YUMBOT_FAST_FOOD_ATMOSPHERIC_ACCENT: load('yumbot_fast_food_atmospheric_accent'),

  // ============ CARNIVAL-FOOD path pools (2026-06-07 trial) ============
  YUMBOT_CARNIVAL_FOOD_SCENES: load('yumbot_carnival_food_scenes'),
  YUMBOT_CARNIVAL_FOOD_CAMERAS: load('yumbot_carnival_food_cameras'),
  YUMBOT_CARNIVAL_FOOD_LIGHTING: load('yumbot_carnival_food_lighting'),
  YUMBOT_CARNIVAL_FOOD_PALETTES: load('yumbot_carnival_food_palettes'),
  YUMBOT_CARNIVAL_FOOD_TIME_OF_DAY: load('yumbot_carnival_food_time_of_day'),
  YUMBOT_CARNIVAL_FOOD_COMPANIONS: load('yumbot_carnival_food_companions'),
  YUMBOT_CARNIVAL_FOOD_DECOR: load('yumbot_carnival_food_decor'),
  YUMBOT_CARNIVAL_FOOD_ATMOSPHERIC_ACCENT: load('yumbot_carnival_food_atmospheric_accent'),

  VIBE_COLOR,
};
