/**
 * ChibiBot — axis pools. 2026-05-06: self-contained after CuddleBot merge.
 * All seeds live in chibibot/seeds/. Regenerate any:
 *   node scripts/gen-seeds/chibibot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Cute-only VIBE_COLOR palette (no dark/fierce/macabre/nightshade/arcane etc.)
const VIBE_COLOR = {
  cozy: 'warm amber candle glow, soft golden highlights, honey tones',
  peaceful: 'soft pastel dawn, gentle pale blues and creams, tranquil',
  whimsical: 'playful buoyant pastels, warm creamy light, sparkle accents',
  enchanted: 'soft magical sparkles, dreamy lavender-and-rose, luminous',
  coquette: 'rose-pink blush atmosphere, cream highlights, soft golden-hour',
  shimmer: 'shimmering gold particles, iridescent pastel highlights, glitter',
  nostalgic: 'warm copper and peach, faded storybook pastels, cozy sepia',
  ethereal: 'pearl-white ambient, opalescent mist, prismatic pastel sparkles',
  cinematic: 'warm teal-and-peach cinematic grade, soft luminous highlights',
  surreal: 'dreamy soft pastel impossibilities, gentle hallucinatory sweetness',
};

module.exports = {
  // Creature pools (4)
  CUTE_CREATURES: load('cute_creatures'),
  AQUATIC_CREATURES: load('aquatic_creatures'),
  JUNGLE_CREATURES: load('jungle_creatures'),
  ARCTIC_CREATURES: load('arctic_creatures'),

  // Scene pools — heart of each path
  HEARTWARMING_ACTIVITIES: load('heartwarming_activities'),
  // cute-food path (2026-05-17, bex.ai-inspired kawaii pop-mart food)
  CUTE_FOOD_SCENES: (() => { try { return load('cute_food_scenes'); } catch { return []; } })(),
  COZY_MINIATURE_WORLDS: load('cozy_miniature_worlds'),
  PLUSHIE_SCENES: load('plushie_scenes'),
  PORTRAIT_FEATURES: load('portrait_features'),
  SLEEPY_NAP_SPOTS: load('sleepy_nap_spots'),
  RAINY_DAY_SCENES: load('rainy_day_scenes'),
  MINIATURE_FEAST_SCENES: load('miniature_feast_scenes'),
  BATH_TIME_SCENES: load('bath_time_scenes'),
  COTTAGECORE_SCENES: load('cottagecore_scenes'),
  OUTDOOR_ADVENTURES: load('outdoor_adventures'),
  AQUATIC_SCENES: load('aquatic_scenes'),
  JUNGLE_SCENES: load('jungle_scenes'),
  ARCTIC_SCENES: load('arctic_scenes'),
  NIGHT_MEADOW_SCENES: load('night_meadow_scenes'),
  AQUATIC_VILLAGE_SCENES: load('aquatic_village_scenes'),
  JUNGLE_VILLAGE_SCENES: load('jungle_village_scenes'),
  ARCTIC_VILLAGE_SCENES: load('arctic_village_scenes'),
  TWILIGHT_VILLAGE_SCENES: load('twilight_village_scenes'),
  SUNNY_PAIR_SCENES: load('sunny_pair_scenes'),
  SUNNY_VILLAGE_SCENES: load('sunny_village_scenes'),
  COZY_INTERIOR_SCENES: load('cozy_interior_scenes'),

  // ChibiBot-original indoor scene pools (3 paths CuddleBot didn't have)
  RAINY_INTERIOR_SCENES: load('rainy_interior_scenes'),
  FIREPLACE_CABIN_SCENES: load('fireplace_cabin_scenes'),
  BOOKISH_SANCTUARY_SCENES: load('bookish_sanctuary_scenes'),

  // Shared axes
  SCENE_WEATHER: load('scene_weather'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),

  // Unified tagged creature pool (2026-05-19) — replaces CUTE_CREATURES +
  // AQUATIC_CREATURES across migrated paths. Entries are objects
  // { tags: ['LAND'|'MARINE'|'ARCTIC'|'JUNGLE'|'BIRD'|'FANTASY'|'CHILD'|'ANY'], description: '...' }
  // Paths filter via { name: 'CUTE_CREATURES_UNIFIED', tags: [...] }. 'ANY'-tagged
  // entries (children + magical-realm) always match.
  CUTE_CREATURES_UNIFIED: load('cute_creatures_unified'),

  // Heartwarming-scene path-bespoke axes (2026-05-19 full-bespoke migration)
  HEARTWARMING_SETTINGS: load('heartwarming_settings'),
  HEARTWARMING_TIME_OF_DAY: load('heartwarming_time_of_day'),
  HEARTWARMING_SURPRISE_ELEMENTS: load('heartwarming_surprise_elements'),
  HEARTWARMING_PHENOMENA: load('heartwarming_phenomena'),

  // Bath-time path-bespoke axes (2026-05-19 full-bespoke migration)
  BATH_TIME_SETTINGS: load('bath_time_settings'),
  BATH_TIME_ACTIVITIES: load('bath_time_activities'),
  BATH_TIME_AMENITIES: load('bath_time_amenities'),
  BATH_TIME_SURPRISE_ELEMENTS: load('bath_time_surprise_elements'),
  BATH_TIME_PHENOMENA: load('bath_time_phenomena'),

  // Cuddly-aquatic path-bespoke axes (2026-05-19 full-bespoke migration)
  CUDDLY_AQUATIC_SETTINGS: load('cuddly_aquatic_settings'),
  CUDDLY_AQUATIC_INTERACTIONS: load('cuddly_aquatic_interactions'),
  CUDDLY_AQUATIC_SURPRISE_ELEMENTS: load('cuddly_aquatic_surprise_elements'),
  CUDDLY_AQUATIC_PHENOMENA: load('cuddly_aquatic_phenomena'),
  CUDDLY_AQUATIC_CREATURES_MARINE: load('cuddly_aquatic_creatures_marine'),

  // Night-meadow path-bespoke axes (2026-05-19 full-bespoke migration)
  NIGHT_MEADOW_SETTINGS: load('night_meadow_settings'),
  NIGHT_MEADOW_INTERACTIONS: load('night_meadow_interactions'),
  NIGHT_MEADOW_TIME_OF_NIGHT: load('night_meadow_time_of_night'),
  NIGHT_MEADOW_PROPS: load('night_meadow_props'),
  NIGHT_MEADOW_SURPRISE_ELEMENTS: load('night_meadow_surprise_elements'),
  NIGHT_MEADOW_PHENOMENA: load('night_meadow_phenomena'),

  // Cozy-landscape path-bespoke axes (2026-05-19 full-bespoke migration)
  // Setting-as-hero path, SOLO tiny resident, no pair.
  COZY_LANDSCAPE_WORLDS: load('cozy_landscape_worlds'),
  COZY_LANDSCAPE_WORLD_DETAILS: load('cozy_landscape_world_details'),
  COZY_LANDSCAPE_TIME_OF_DAY: load('cozy_landscape_time_of_day'),
  COZY_LANDSCAPE_RESIDENT_ACTIVITIES: load('cozy_landscape_resident_activities'),
  COZY_LANDSCAPE_SURPRISE_ELEMENTS: load('cozy_landscape_surprise_elements'),
  COZY_LANDSCAPE_PHENOMENA: load('cozy_landscape_phenomena'),

  // Rainy-interior path-bespoke axes (2026-05-19 full-bespoke migration)
  // SETTING-AS-HERO indoor path with mandatory rainy-window contrast.
  RAINY_INTERIOR_ROOMS: load('rainy_interior_rooms'),
  RAINY_INTERIOR_ROOM_DETAILS: load('rainy_interior_room_details'),
  RAINY_INTERIOR_TIME_OF_DAY: load('rainy_interior_time_of_day'),
  RAINY_INTERIOR_RESIDENT_ACTIVITIES: load('rainy_interior_resident_activities'),
  RAINY_INTERIOR_SURPRISE_ELEMENTS: load('rainy_interior_surprise_elements'),
  RAINY_INTERIOR_PHENOMENA: load('rainy_interior_phenomena'),

  // Rainy-day-cozy path-bespoke axes (2026-05-19 full-bespoke migration)
  // Group-of-friends SHELTERED-FROM-RAIN cozy moments (sister path to
  // rainy-interior which is creatures OUT IN the rain playing actively).
  RAINY_DAY_COZY_SHELTERS: load('rainy_day_cozy_shelters'),
  RAINY_DAY_COZY_HUDDLES: load('rainy_day_cozy_huddles'),
  RAINY_DAY_COZY_DETAILS: load('rainy_day_cozy_details'),
  RAINY_DAY_COZY_TIME_OF_DAY: load('rainy_day_cozy_time_of_day'),
  RAINY_DAY_COZY_SURPRISE: load('rainy_day_cozy_surprise'),
  RAINY_DAY_COZY_PHENOMENA: load('rainy_day_cozy_phenomena'),

  // Sleepy-naptime path-bespoke axes (2026-05-19 full-bespoke migration)
  // SOLO creature dozing in an impossibly cozy nap-spot. Mid-close framing.
  SLEEPY_NAPTIME_SPOTS: load('sleepy_naptime_spots'),
  SLEEPY_NAPTIME_POSES: load('sleepy_naptime_poses'),
  SLEEPY_NAPTIME_DETAILS: load('sleepy_naptime_details'),
  SLEEPY_NAPTIME_TIME_OF_DAY: load('sleepy_naptime_time_of_day'),
  SLEEPY_NAPTIME_SURPRISE: load('sleepy_naptime_surprise'),
  SLEEPY_NAPTIME_PHENOMENA: load('sleepy_naptime_phenomena'),

  VIBE_COLOR,

  // Sensory anchor pools — 2 contexts × 7 channels × 100 entries each
  SENSORY_POOLS: {
    creature: {
      smell: load('sensory_creature_smell'),
      sound: load('sensory_creature_sound'),
      touch: load('sensory_creature_touch'),
      temperature: load('sensory_creature_temperature'),
      weight: load('sensory_creature_weight'),
      air: load('sensory_creature_air'),
      lightcolor: load('sensory_creature_lightcolor'),
    },
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
