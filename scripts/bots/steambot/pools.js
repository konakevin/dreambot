/**
 * SteamBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/steambot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-brass cinematic grade, deep shadows, amber gaslight',
  dark: 'oil-black dominant, copper-patina accents, single-forge-amber',
  epic: 'dramatic brass-god-rays, rich copper highlights, heroic steam drama',
  nostalgic: 'faded sepia-brass, burnt-umber, weathered Victorian palette',
  peaceful: 'warm-amber gaslight interior, soft copper glow, quiet brass',
  whimsical: 'buoyant saturated steampunk-pastels, atmospheric prestige-fantasy-inflected brass',
  ethereal: 'pearl-white steam-mist, opalescent brass, luminous copper',
  arcane: 'deep violet alchemy, emerald copper-oxide, mystical brass',
  ancient: 'weathered bronze-and-copper, patina-green, deep umber',
  enchanted: 'soft magical glow, dreamy copper-and-gold, shimmer-steampunk',
  coquette: 'rose-gold brass, cream + blush corset tones (soft steampunk)',
  voltage: 'electric-blue Tesla arcs, neon brass accents, storm-contrast',
  nightshade: 'deep violet moonlit-brass, silver airship, plum shadows',
  macabre: 'blood-crimson and oil-black brass, dread-steampunk palette',
  shimmer: 'shimmering brass-dust, iridescent copper, warm gleam',
  surreal: 'impossible steampunk-color pairings, prestige fantasy hallucinatory',
};

module.exports = {
  STEAMPUNK_CHARACTERS: load('steampunk_characters'),
  STEAMPUNK_LANDSCAPES: load('steampunk_landscapes'),
  STEAMPUNK_SCENE_SURPRISE_ELEMENT: load('steampunk_scene_surprise_element'),
  STEAMPUNK_SCENE_EVENT: load('steampunk_scene_event'),
  AIRSHIP_SCENES: load('airship_scenes'),
  AIRSHIP_SKY_LAYER: load('steampunk_airship_sky_layer'),
  AIRSHIP_SURPRISE_ELEMENT: load('steampunk_airship_surprise_element'),
  AIRSHIP_PHENOMENON: load('steampunk_airship_phenomenon'),
  STEAMPUNK_WOMEN_CANDID_MOMENTS: load('steampunk_women_candid_moments'),
  STEAMPUNK_WOMEN_OUTDOOR_MOMENTS: load('steampunk_women_outdoor_moments'),
  SPECTACLE_EVENTS: load('spectacle_events'),
  STEAMPUNK_SPECTACLE_CROWD: load('steampunk_spectacle_crowd'),
  STEAMPUNK_SPECTACLE_SURPRISE: load('steampunk_spectacle_surprise'),
  STEAMPUNK_SPECTACLE_ESCALATION: load('steampunk_spectacle_escalation'),
  TRANSPORT_SCENES: load('transport_scenes'),
  STEAMPUNK_TRANSPORT_TERRAIN_DRAMA: load('steampunk_transport_terrain_drama'),
  STEAMPUNK_TRANSPORT_SURPRISE: load('steampunk_transport_surprise'),
  STEAMPUNK_TRANSPORT_PHENOMENON: load('steampunk_transport_phenomenon'),
  COZY_STEAMPUNK_ROOM: load('cozy_steampunk_room'),
  COZY_STEAMPUNK_FLORA: load('cozy_steampunk_flora'),
  COZY_STEAMPUNK_WINDOW_VIEW: load('cozy_steampunk_window_view'),
  COZY_STEAMPUNK_INTRICATE_DETAIL: load('cozy_steampunk_intricate_detail'),
  COZY_STEAMPUNK_QUIET_MOMENT: load('cozy_steampunk_quiet_moment'),
  // Steampunk-labs path bespoke pools (added 2026-05-16) — mad-science lab interior
  STEAMPUNK_LABS_SPACE: load('steampunk_labs_space'),
  STEAMPUNK_LABS_CENTERPIECE: load('steampunk_labs_centerpiece'),
  STEAMPUNK_LABS_APPARATUS: load('steampunk_labs_apparatus'),
  STEAMPUNK_LABS_ELECTRICAL: load('steampunk_labs_electrical'),
  STEAMPUNK_LABS_SCIENTIST: load('steampunk_labs_scientist'),
  STEAMPUNK_ATMOSPHERES: load('steampunk_atmospheres'),
  STEAMPUNK_CURIOS: load('steampunk_curios'),
  STEAMPUNK_ANIMATE_CURIOS: load('steampunk_animate_curios'),
  STEAMPUNK_CURIO_HABITAT: load('steampunk_curio_habitat'),
  STEAMPUNK_CURIO_ORNATE_FLOURISH: load('steampunk_curio_ornate_flourish'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  STEAMBOT_LOOK_REGISTER: load('steambot_look_register'),
  STEAMBOT_HYBRID_WORLDS: load('steambot_hybrid_worlds'),
  // Slot-pool DNA for sexy-steampunk-woman path (mirrors GothBot pattern)
  STEAMPUNK_WOMEN_ARCHETYPES: load('steampunk_women_archetypes'),
  STEAMPUNK_WOMEN_SKIN: load('steampunk_women_skin'),
  STEAMPUNK_WOMEN_EYES: load('steampunk_women_eyes'),
  STEAMPUNK_WOMEN_MAKEUP: load('steampunk_women_makeup'),
  STEAMPUNK_WOMEN_HAIR_COLOR: load('steampunk_women_hair_color'),
  STEAMPUNK_WOMEN_HAIRSTYLES: load('steampunk_women_hairstyles'),
  STEAMPUNK_WOMEN_WARDROBE: load('steampunk_women_wardrobe'),
  STEAMPUNK_WOMEN_WARDROBE_AMPLIFIED: load('steampunk_women_wardrobe_amplified'),
  STEAMPUNK_WOMEN_ACCESSORIES: load('steampunk_women_accessories'),
  STEAMPUNK_WOMEN_ACTIONS: load('steampunk_women_actions'),
  STEAMPUNK_WOMEN_SETTINGS: load('steampunk_women_settings'),
  // Slot-pool DNA for steampunk-man path (mirrors female axis architecture,
  // adapted for handsome period-accurate Victorian-industrial men).
  // Replaces women's MAKEUP axis with male-specific FACIAL_HAIR.
  STEAMPUNK_MEN_ARCHETYPES: load('steampunk_men_archetypes'),
  STEAMPUNK_MEN_SKIN: load('steampunk_men_skin'),
  STEAMPUNK_MEN_EYES: load('steampunk_men_eyes'),
  STEAMPUNK_MEN_FACIAL_HAIR: load('steampunk_men_facial_hair'),
  STEAMPUNK_MEN_HAIR_COLOR: load('steampunk_men_hair_color'),
  STEAMPUNK_MEN_HAIRSTYLES: load('steampunk_men_hairstyles'),
  STEAMPUNK_MEN_WARDROBE: load('steampunk_men_wardrobe'),
  STEAMPUNK_MEN_ACCESSORIES: load('steampunk_men_accessories'),
  STEAMPUNK_MEN_CANDID_MOMENTS: load('steampunk_men_candid_moments'),
  STEAMPUNK_MEN_OUTDOOR_MOMENTS: load('steampunk_men_outdoor_moments'),
  STEAMPUNK_MEN_SETTINGS: load('steampunk_men_settings'),
  STEAMPUNK_MEN_WARDROBE_AMPLIFIED: load('steampunk_men_wardrobe_amplified'),

  // airship-female path — solo female air-officer mid-action on a steampunk
  // airship. Diversity is baked into the SKIN pool via pure visual descriptors
  // (no ethnicity labels — Flux collapses category words to stereotype
  // centroids). The old ethnicity-noun `heritage` axis was dropped (R2).
  AIRSHIP_ROLE: load('airship_role'),
  AIRSHIP_EYES: load('airship_eyes'),
  AIRSHIP_HAIR_COLOR: load('airship_hair_color'),
  AIRSHIP_ACCESSORY: load('airship_accessory'),
  AIRSHIP_BACKDROP: load('airship_backdrop'),
  AIRSHIP_DRAMA: load('airship_drama'),
  AIRSHIP_FEMALE_SKIN: load('airship_female_skin'),
  AIRSHIP_FEMALE_FACE: load('airship_female_face'),
  AIRSHIP_FEMALE_EYES: load('airship_female_eyes'),
  AIRSHIP_FEMALE_HAIR_COLOR: load('airship_female_hair_color'),
  AIRSHIP_FEMALE_HAIRSTYLE: load('airship_female_hairstyle'),
  AIRSHIP_FEMALE_OUTFIT: load('airship_female_outfit'),
  AIRSHIP_FEMALE_ACTION: load('airship_female_action'),

  // airship-male path — male sister; shares role/accessory/backdrop/drama
  // above, male-bespoke for the gendered axes (facial_hair is male-only).
  AIRSHIP_MALE_SKIN: load('airship_male_skin'),
  AIRSHIP_MALE_FACE: load('airship_male_face'),
  AIRSHIP_MALE_EYES: load('airship_male_eyes'),
  AIRSHIP_MALE_FACIAL_HAIR: load('airship_male_facial_hair'),
  AIRSHIP_MALE_HAIR_COLOR: load('airship_male_hair_color'),
  AIRSHIP_MALE_HAIRSTYLE: load('airship_male_hairstyle'),
  AIRSHIP_MALE_OUTFIT: load('airship_male_outfit'),
  AIRSHIP_MALE_ACTION: load('airship_male_action'),

  VIBE_COLOR,

  SENSORY_POOLS: {
    female: {
      smell: load('sensory_female_smell'),
      sound: load('sensory_female_sound'),
      touch: load('sensory_female_touch'),
      temperature: load('sensory_female_temperature'),
      weight: load('sensory_female_weight'),
      air: load('sensory_female_air'),
      lightcolor: load('sensory_female_lightcolor'),
    },
    male: {
      smell: load('sensory_male_smell'),
      sound: load('sensory_male_sound'),
      touch: load('sensory_male_touch'),
      temperature: load('sensory_male_temperature'),
      weight: load('sensory_male_weight'),
      air: load('sensory_male_air'),
      lightcolor: load('sensory_male_lightcolor'),
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
