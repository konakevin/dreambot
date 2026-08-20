/**
 * AlphaBot — axis pools. Inherited wholesale from DreamBot in the 2026-07-07
 * non-robot split (DreamBot itself xeroxed them from ChibiBot): every
 * non-robot path's pools live here now, byte-identical, so the moved paths
 * render exactly as they did on DreamBot. All seeds live in alphabot/seeds/.
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
  // DreamBot Stage C candidates (sandbox, function-form) — scene + sky per path.
  ALPHABOT_POCKET_PLANETS_SCENE: load('alphabot_pocket_planets_scene'),
  ALPHABOT_POCKET_PLANETS_SKY: load('alphabot_pocket_planets_sky'),
  ALPHABOT_CLOUD_HARBOR_SCENE: load('alphabot_cloud_harbor_scene'),
  ALPHABOT_CLOUD_HARBOR_SKY: load('alphabot_cloud_harbor_sky'),
  ALPHABOT_DREAMSCAPE_NOCTURNE_SCENE: load('alphabot_dreamscape_nocturne_scene'),
  ALPHABOT_DREAMSCAPE_NOCTURNE_SKY: load('alphabot_dreamscape_nocturne_sky'),

  // Sky-World dream candidates (2026-08-17) — spun from Kevin's saved cloud-harbor /
  // dream-orchard renders: whimsical fantastical dream-places you'd want to visit
  // (NO flying whales). Scene + sky per path.
  ALPHABOT_LANTERN_SKY_SCENE: load('alphabot_lantern_sky_scene'),
  ALPHABOT_LANTERN_SKY_SKY: load('alphabot_lantern_sky_sky'),
  ALPHABOT_SKY_BAZAAR_SCENE: load('alphabot_sky_bazaar_scene'),
  ALPHABOT_SKY_BAZAAR_SKY: load('alphabot_sky_bazaar_sky'),
  ALPHABOT_DREAM_ORCHARD_SCENE: load('alphabot_dream_orchard_scene'),
  ALPHABOT_DREAM_ORCHARD_SKY: load('alphabot_dream_orchard_sky'),
  ALPHABOT_STARLIGHT_CARNIVAL_SCENE: load('alphabot_starlight_carnival_scene'),
  ALPHABOT_STARLIGHT_CARNIVAL_SKY: load('alphabot_starlight_carnival_sky'),

  // Bot-wide "look register" (2026-06-07) — 12 cute film/storybook rendering
  // styles rolled per render via rollSharedDNA on look-enabled paths, so the
  // same path renders in a different animation look each time (Pixar / Disney
  // CG / Ghibli / storybook / Pop-Mart / etc.). Mirrors YumBot's look_register.
  CHIBIBOT_LOOK_REGISTER: load('chibibot_look_register'),
  // DREAMSCAPE (2026-06-27) — scene-as-hero candy-fantasy world vistas. NO
  // bubble-bot, NO central character — the WORLD is the hero. 9 axes; `world`
  // carries the wide spread. AXIS-CLEAN: palette=color, atmosphere=light,
  // sky=overhead, world=biome. structure/event/creature are gated conditionals.
  DREAMSCAPE_WORLD: load('dreamscape_world'),
  DREAMSCAPE_FLORA: load('dreamscape_flora'),
  DREAMSCAPE_STRUCTURE: load('dreamscape_structure'),
  DREAMSCAPE_FOREGROUND: load('dreamscape_foreground'),
  DREAMSCAPE_PALETTE: load('dreamscape_palette'),
  DREAMSCAPE_ATMOSPHERE: load('dreamscape_atmosphere'),
  DREAMSCAPE_SKY: load('dreamscape_sky'),
  DREAMSCAPE_EVENT: load('dreamscape_event'),
  DREAMSCAPE_CREATURE: load('dreamscape_creature'),
  // BUTTERFLY-REALM (2026-06-27, R1 redesign) — striking butterflies in a clean,
  // dreamy, WHIMSICAL dreamscape. De-flowered + composition-over-density + a
  // whimsy axis (R0 was spammy/flowery/not-dreamy). AXIS-CLEAN: setting=biome,
  // palette=butterfly color, composition=arrangement, whimsy=dream element,
  // atmosphere=light+mist, feature=one clean anchor.
  BUTTERFLY_REALM_SETTING: load('butterfly_realm_setting'),
  BUTTERFLY_REALM_FEATURE: load('butterfly_realm_feature'),
  BUTTERFLY_REALM_COMPOSITION: load('butterfly_realm_composition'),
  BUTTERFLY_REALM_PALETTE: load('butterfly_realm_palette'),
  BUTTERFLY_REALM_WHIMSY: load('butterfly_realm_whimsy'),
  BUTTERFLY_REALM_ATMOSPHERE: load('butterfly_realm_atmosphere'),
  // DREAM-SPIRES (2026-06-27) — whimsical fairytale TOWER-CITY, scene-as-hero,
  // EXTERIOR VISTAS ONLY. AXIS-CLEAN: spire_world=formation+style, palette=color,
  // vantage=exterior camera, charm=signature charm layer, light=light+sky,
  // whimsy=gated dream element.
  DREAM_SPIRES_WORLD: load('dream_spires_world'),
  DREAM_SPIRES_PALETTE: load('dream_spires_palette'),
  DREAM_SPIRES_VANTAGE: load('dream_spires_vantage'),
  DREAM_SPIRES_CHARM: load('dream_spires_charm'),
  DREAM_SPIRES_LIGHT: load('dream_spires_light'),
  DREAM_SPIRES_WHIMSY: load('dream_spires_whimsy'),
  // FAR-EDEN (2026-06-28) — scene-as-hero HAPPY fantasy ALIEN WORLDS ("brochure
  // shots of alien worlds"). NO character; an original inviting paradise is the
  // hero. Modeled on the dreamscape shape. AXIS-CLEAN: world=biome, cosmic_sky=
  // overhead celestial wonder (signature), flora=plant-life, palette=color,
  // atmosphere=light+air; terrain_glow/life_accent/wonder_structure/dream_event
  // are gated conditionals. Shared by both sibling paths (far-eden hyperreal +
  // far-eden-soft painterly) for the MVP A/B.
  EDEN_WORLD: load('eden_world'),
  EDEN_COSMIC_SKY: load('eden_cosmic_sky'),
  EDEN_FLORA: load('eden_flora'),
  EDEN_PALETTE: load('eden_palette'),
  EDEN_ATMOSPHERE: load('eden_atmosphere'),
  EDEN_TERRAIN_GLOW: load('eden_terrain_glow'),
  EDEN_LIFE_ACCENT: load('eden_life_accent'),
  EDEN_WONDER_STRUCTURE: load('eden_wonder_structure'),
  EDEN_DREAM_EVENT: load('eden_dream_event'),

  // PULP (2026-06-29) — two retro pulp sci-fi COMEDY paths (pulp-femme +
  // pulp-hero). Character decomposed into independent trait axes; shared scene +
  // gender-split character pools so no androgynous wording bleeds across.
  PULP_BEING: load('pulp_being'),
  PULP_HAIR_COLOR: load('pulp_hair_color'),
  PULP_FEMME_HAIRSTYLE: load('pulp_femme_hairstyle'),
  PULP_FEMME_OUTFIT: load('pulp_femme_outfit'),
  PULP_FEMME_POSE: load('pulp_femme_pose'),
  PULP_HERO_HAIRSTYLE: load('pulp_hero_hairstyle'),
  PULP_HERO_OUTFIT: load('pulp_hero_outfit'),
  PULP_HERO_POSE: load('pulp_hero_pose'),
  PULP_WORLD: load('pulp_world'),
  PULP_SKY: load('pulp_sky'),
  PULP_LIGHTING: load('pulp_lighting'),
  PULP_SHOT: load('pulp_shot'),
  PULP_PROP: load('pulp_prop'),
  PULP_GAG: load('pulp_gag'),

  // HIDDEN-CONSERVATORY (2026-06-28) — scene-as-hero stained-glass GREENHOUSE
  // INTERIOR (ref benmyhre "Stained Glass Greenhouses"). NO character; an
  // overgrown garden inside a grand stained-glass cathedral/conservatory with
  // rainbow prismatic light is the hero. AXIS-CLEAN: conservatory=architecture,
  // glass_palette=glass color, flora=plant-life, light_effect=prismatic refraction
  // (signature), vantage=interior camera, atmosphere=light+mood+air;
  // water/detail/life are gated conditionals.
  CONSERVATORY_ARCH: load('conservatory_arch'),
  CONSERVATORY_GLASS: load('conservatory_glass'),
  CONSERVATORY_FLORA: load('conservatory_flora'),
  CONSERVATORY_LIGHT: load('conservatory_light'),
  CONSERVATORY_VANTAGE: load('conservatory_vantage'),
  CONSERVATORY_ATMOSPHERE: load('conservatory_atmosphere'),
  CONSERVATORY_WATER: load('conservatory_water'),
  CONSERVATORY_DETAIL: load('conservatory_detail'),
  CONSERVATORY_LIFE: load('conservatory_life'),

  // Beauty-gap paths (2026-06-28)
  BOTANICAL_HERO: load('botanical_hero'),
  BOTANICAL_SETTING: load('botanical_setting'),
  BOTANICAL_LIGHT_SEASON: load('botanical_light_season'),
  BOTANICAL_FRAMING: load('botanical_framing'),
  BOTANICAL_ELEMENT: load('botanical_element'),

  // Creature pools (4)
  CUTE_CREATURES: load('cute_creatures'),
  AQUATIC_CREATURES: load('aquatic_creatures'),
  JUNGLE_CREATURES: load('jungle_creatures'),
  ARCTIC_CREATURES: load('arctic_creatures'),

  // Scene pools — heart of each path
  HEARTWARMING_ACTIVITIES: load('heartwarming_activities'),
  COZY_MINIATURE_WORLDS: load('cozy_miniature_worlds'),
  PLUSHIE_SCENES: load('plushie_scenes'),
  PORTRAIT_FEATURES: load('portrait_features'),
  SLEEPY_NAP_SPOTS: load('sleepy_nap_spots'),
  RAINY_DAY_SCENES: load('rainy_day_scenes'),
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
  // { tags: ['LAND'|'MARINE'|'ARCTIC'|'JUNGLE'|'BIRD'|'FANTASY'|'ANY'], description: '...' }
  // CREATURES ONLY — no humans/children (purged 2026-05-27). Paths filter via
  // { name: 'CUTE_CREATURES_UNIFIED', tags: [...] }. 'ANY'-tagged
  // entries (magical-realm critters) always match.
  CUTE_CREATURES_UNIFIED: load('cute_creatures_unified'),

  // Heartwarming-scene path-bespoke axes (2026-05-19 full-bespoke migration)
  HEARTWARMING_SETTINGS: load('heartwarming_settings'),
  HEARTWARMING_TIME_OF_DAY: load('heartwarming_time_of_day'),
  HEARTWARMING_SURPRISE_ELEMENTS: load('heartwarming_surprise_elements'),
  HEARTWARMING_PHENOMENA: load('heartwarming_phenomena'),

  // Bath-time path-bespoke axes (2026-06-05 lean 6-axis rebuild — BATH_TIME_SCENES
  // is the new vessel+location pool above. The old BATH_TIME_SETTINGS, ACTIVITIES,
  // AMENITIES, SURPRISE_ELEMENTS, PHENOMENA are left loaded for back-compat /
  // other-bot reference but no longer wired into bath-time.)
  BATH_TIME_SETTINGS: load('bath_time_settings'),
  BATH_TIME_ACTIVITIES: load('bath_time_activities'),
  BATH_TIME_AMENITIES: load('bath_time_amenities'),
  BATH_TIME_SURPRISE_ELEMENTS: load('bath_time_surprise_elements'),
  BATH_TIME_PHENOMENA: load('bath_time_phenomena'),
  // 2026-06-05 lean-rebuild new pools — wired to the bath-time path
  BATH_TIME_LIGHTING: load('bath_time_lighting'),
  BATH_TIME_DECORATIONS: load('bath_time_decorations'),
  BATH_TIME_SIGNATURE: load('bath_time_signature'),

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
  JUNGLE_VILLAGE_SETTINGS: load('jungle_village_settings'),
  JUNGLE_VILLAGE_ACTIVITIES: load('jungle_village_activities'),
  JUNGLE_VILLAGE_DETAILS: load('jungle_village_details'),
  JUNGLE_VILLAGE_TIME_OF_DAY: load('jungle_village_time_of_day'),
  JUNGLE_VILLAGE_SURPRISE: load('jungle_village_surprise'),
  JUNGLE_VILLAGE_PHENOMENA: load('jungle_village_phenomena'),

  // Cozy-interior path-bespoke axes (2026-05-19 full-bespoke migration)
  COZY_INTERIOR_ROOMS: load('cozy_interior_rooms'),
  COZY_INTERIOR_ACTIVITIES: load('cozy_interior_activities'),
  COZY_INTERIOR_DETAILS: load('cozy_interior_details'),
  COZY_INTERIOR_TIME_OF_DAY: load('cozy_interior_time_of_day'),
  COZY_INTERIOR_SURPRISE: load('cozy_interior_surprise'),
  COZY_INTERIOR_PHENOMENA: load('cozy_interior_phenomena'),

  // Outdoor-adventure path-bespoke axes (2026-05-20 full-bespoke migration)
  OUTDOOR_ADVENTURE_ACTIVITIES: load('outdoor_adventure_activities'),
  OUTDOOR_ADVENTURE_WILDERNESS: load('outdoor_adventure_wilderness'),
  OUTDOOR_ADVENTURE_DETAILS: load('outdoor_adventure_details'),
  OUTDOOR_ADVENTURE_PROPS: load('outdoor_adventure_props'),
  OUTDOOR_ADVENTURE_TIME_OF_DAY: load('outdoor_adventure_time_of_day'),
  OUTDOOR_ADVENTURE_SURPRISE: load('outdoor_adventure_surprise'),

  // Creature-portrait path-bespoke axes (2026-05-20 full-bespoke migration)
  CREATURE_PORTRAIT_POSES: load('creature_portrait_poses'),
  CREATURE_PORTRAIT_EXPRESSIONS: load('creature_portrait_expressions'),
  CREATURE_PORTRAIT_FEATURES: load('creature_portrait_features'),
  CREATURE_PORTRAIT_ACCESSORIES: load('creature_portrait_accessories'),
  CREATURE_PORTRAIT_BACKGROUNDS: load('creature_portrait_backgrounds'),
  CREATURE_PORTRAIT_TIME_OF_DAY: load('creature_portrait_time_of_day'),
  CREATURE_PORTRAIT_OUTFITS: load('creature_portrait_outfits'),
  CREATURE_PORTRAIT_SET_DECORATIONS: load('creature_portrait_set_decorations'),

  // Creature-world path: dense, varied, structured magical environments
  // (reverse-engineered from Kevin's hearted 2026-05-07 references). The other
  // creature-world axes use shared pools (CUTE_CREATURES + PORTRAIT_FEATURES +
  // SCENE_WEATHER + LIGHTING).
  CREATURE_WORLD_ENVIRONMENT: load('creature_world_environment'),

  // Aquatic-village path-bespoke axes (2026-05-19 full-bespoke migration)
  AQUATIC_VILLAGE_ACTIVITIES: load('aquatic_village_activities'),
  AQUATIC_VILLAGE_SETTINGS: load('aquatic_village_settings'),
  AQUATIC_VILLAGE_DETAILS: load('aquatic_village_details'),
  AQUATIC_VILLAGE_TIME_OF_DAY: load('aquatic_village_time_of_day'),
  AQUATIC_VILLAGE_SURPRISE: load('aquatic_village_surprise'),
  AQUATIC_VILLAGE_PHENOMENA: load('aquatic_village_phenomena'),

  // Cottagecore-village path-bespoke axes (2026-05-19 full-bespoke migration)
  COTTAGECORE_VILLAGE_ACTIVITIES: load('cottagecore_village_activities'),
  COTTAGECORE_VILLAGE_SETTINGS: load('cottagecore_village_settings'),
  COTTAGECORE_VILLAGE_DETAILS: load('cottagecore_village_details'),
  COTTAGECORE_VILLAGE_TIME_OF_DAY: load('cottagecore_village_time_of_day'),
  COTTAGECORE_VILLAGE_SURPRISE: load('cottagecore_village_surprise'),
  COTTAGECORE_VILLAGE_PHENOMENA: load('cottagecore_village_phenomena'),

  // Sunny-village path-bespoke axes (2026-05-19 full-bespoke migration)
  SUNNY_VILLAGE_ACTIVITIES: load('sunny_village_activities'),
  SUNNY_VILLAGE_SETTINGS: load('sunny_village_settings'),
  SUNNY_VILLAGE_DETAILS: load('sunny_village_details'),
  SUNNY_VILLAGE_TIME_OF_DAY: load('sunny_village_time_of_day'),
  SUNNY_VILLAGE_SURPRISE: load('sunny_village_surprise'),
  SUNNY_VILLAGE_PHENOMENA: load('sunny_village_phenomena'),

  // Twilight-village path-bespoke axes (2026-05-19 full-bespoke migration)
  TWILIGHT_VILLAGE_ACTIVITIES: load('twilight_village_activities'),
  TWILIGHT_VILLAGE_SETTINGS: load('twilight_village_settings'),
  TWILIGHT_VILLAGE_DETAILS: load('twilight_village_details'),
  TWILIGHT_VILLAGE_TIME_OF_DAY: load('twilight_village_time_of_day'),
  TWILIGHT_VILLAGE_SURPRISE: load('twilight_village_surprise'),
  TWILIGHT_VILLAGE_PHENOMENA: load('twilight_village_phenomena'),

  // Arctic-village path-bespoke axes (2026-05-19 full-bespoke migration)
  ARCTIC_VILLAGE_ACTIVITIES: load('arctic_village_activities'),
  ARCTIC_VILLAGE_SETTINGS: load('arctic_village_settings'),
  ARCTIC_VILLAGE_DETAILS: load('arctic_village_details'),
  ARCTIC_VILLAGE_TIME_OF_DAY: load('arctic_village_time_of_day'),
  ARCTIC_VILLAGE_SURPRISE: load('arctic_village_surprise'),
  ARCTIC_VILLAGE_PHENOMENA: load('arctic_village_phenomena'),

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
