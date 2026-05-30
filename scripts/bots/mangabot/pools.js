/**
 * MangaBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/mangabot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'anime cinematic palette, teal-and-orange depth, saturated contrast',
  dark: 'deep inked shadows, charcoal-and-blood palette, Akira-dark atmosphere',
  cozy: 'Ghibli warm golden ambient, soft amber domestic glow',
  epic: 'Demon-Slayer dramatic god-rays, heroic lighting, saturated palette',
  nostalgic: 'Shinkai late-summer amber, copper sunset, faded pastels',
  peaceful: 'Ghibli morning softness, gentle pastel diffuse, pastoral calm',
  whimsical: 'buoyant Ghibli-saturated pastels, dreamy warmth',
  ethereal: 'Ghibli-spirit-world opalescent mist, pearl-white luminance',
  arcane: 'deep violet and emerald spirit-light, mystical Mononoke aura',
  enchanted: 'soft magical glow, dreamy lavender-and-rose, Ghibli-shimmer',
  coquette: 'rose-pink blush atmosphere, soft pastel-shoujo palette',
  voltage: 'Akira neon-blue arcs, electric cyberpunk accents, Blade-Runner vibrance',
  nightshade: 'deep violet moonlight, plum shadows, anime-twilight silvers',
  macabre: 'inked blood-red-and-black, dark-fantasy anime dread',
  shimmer: 'anime sparkle effects, iridescent shoujo highlights, glitter accents',
  surreal: 'dreamy impossible color pairings, Mononoke-spirit-shift atmosphere',
};

module.exports = {
  ANIME_CHARACTERS: load('anime_characters'),
  JAPANESE_LANDSCAPES: load('japanese_landscapes'),
  MYTHOLOGICAL_BEINGS: load('mythological_beings'),
  COZY_ANIME_MOMENTS: load('cozy_anime_moments'),
  KAWAII_MOMENTS: load('kawaii_moments'),
  SLICE_OF_LIFE_MOMENTS: load('slice_of_life_moments'),
  NEO_TOKYO_SETTINGS: load('neo_tokyo_settings'),
  CULTURAL_ELEMENTS: load('cultural_elements'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  CHARACTER_DETAILS: load('character_details'),
  SHONEN_ACTIONS: load('shonen_actions'),
  SAMURAI_SCENES: load('samurai_scenes'),
  // ============ SAMURAI-ERA path-bespoke 10-axis pools (2026-05-22 migration) ============
  SAMURAI_SCENE_TYPE: load('samurai_scene_type'),
  SAMURAI_LANDSCAPE_SETTING: load('samurai_landscape_setting'),
  SAMURAI_ARCHITECTURAL_ANCHOR: load('samurai_architectural_anchor'),
  SAMURAI_CHARACTER_ROLE: load('samurai_character_role'),
  SAMURAI_ACTION_MOMENT: load('samurai_action_moment'),
  SAMURAI_ATMOSPHERIC_ELEMENT: load('samurai_atmospheric_element'),
  SAMURAI_LIGHT_DRAMA: load('samurai_light_drama'),
  SAMURAI_TIME_OF_DAY: load('samurai_time_of_day'),
  SAMURAI_EMOTIONAL_DNA: load('samurai_emotional_dna'),
  SAMURAI_CAMERA_FRAMING: load('samurai_camera_framing'),
  // Narrative-richness axes (R1 — added after Kevin flagged "clean but bland")
  SAMURAI_STORY_PROP: load('samurai_story_prop'),
  SAMURAI_BACKGROUND_DETAIL: load('samurai_background_detail'),
  // ============ NEO-TOKYO path-bespoke 15-axis pools (2026-05-22 migration) ============
  NEO_TOKYO_SCENE_TYPE: load('neo_tokyo_scene_type'),
  NEO_TOKYO_DISTRICT: load('neo_tokyo_district'),
  NEO_TOKYO_LANDMARK_ANCHOR: load('neo_tokyo_landmark_anchor'),
  NEO_TOKYO_SIGNAGE_DENSITY: load('neo_tokyo_signage_density'),
  NEO_TOKYO_TECH_ARTIFACTS: load('neo_tokyo_tech_artifacts'),
  NEO_TOKYO_VERTICAL_DENSITY: load('neo_tokyo_vertical_density'),
  NEO_TOKYO_CHARACTER_ROLE: load('neo_tokyo_character_role'),
  NEO_TOKYO_ACTION_MOMENT: load('neo_tokyo_action_moment'),
  NEO_TOKYO_WEATHER_AIR: load('neo_tokyo_weather_air'),
  NEO_TOKYO_LIGHT_SIGNATURE: load('neo_tokyo_light_signature'),
  NEO_TOKYO_TIME_OF_DAY: load('neo_tokyo_time_of_day'),
  NEO_TOKYO_EMOTIONAL_DNA: load('neo_tokyo_emotional_dna'),
  NEO_TOKYO_CAMERA_FRAMING: load('neo_tokyo_camera_framing'),
  NEO_TOKYO_STORY_PROP: load('neo_tokyo_story_prop'),
  NEO_TOKYO_BACKGROUND_DETAIL: load('neo_tokyo_background_detail'),
  // ============ GHIBLI-COUNTRYSIDE path-bespoke 14-axis pools (2026-05-22 migration) ============
  GHIBLI_SCENE_TYPE: load('ghibli_scene_type'),
  GHIBLI_LANDSCAPE_SETTING: load('ghibli_landscape_setting'),
  GHIBLI_ARCHITECTURAL_ANCHOR: load('ghibli_architectural_anchor'),
  GHIBLI_CHARACTER_ROLE: load('ghibli_character_role'),
  GHIBLI_ACTION_MOMENT: load('ghibli_action_moment'),
  GHIBLI_WILDFLOWER_GARDEN: load('ghibli_wildflower_garden'),
  GHIBLI_WEATHER_AIR: load('ghibli_weather_air'),
  GHIBLI_LIGHT_QUALITY: load('ghibli_light_quality'),
  GHIBLI_TIME_OF_DAY: load('ghibli_time_of_day'),
  GHIBLI_EMOTIONAL_DNA: load('ghibli_emotional_dna'),
  GHIBLI_CAMERA_FRAMING: load('ghibli_camera_framing'),
  GHIBLI_STORY_PROP: load('ghibli_story_prop'),
  GHIBLI_BACKGROUND_DETAIL: load('ghibli_background_detail'),
  GHIBLI_SPIRIT_ELEMENT: load('ghibli_spirit_element'),
  // ============ ISEKAI-FANTASY path-bespoke 14-axis pools (2026-05-22 migration) ============
  ISEKAI_SCENE_TYPE: load('isekai_scene_type'),
  ISEKAI_FANTASY_WORLD_SETTING: load('isekai_fantasy_world_setting'),
  ISEKAI_ARCHITECTURAL_ANCHOR: load('isekai_architectural_anchor'),
  ISEKAI_CHARACTER_ROLE: load('isekai_character_role'),
  ISEKAI_ACTION_MOMENT: load('isekai_action_moment'),
  ISEKAI_MAGIC_EFFECT: load('isekai_magic_effect'),
  ISEKAI_FANTASY_CREATURE: load('isekai_fantasy_creature'),
  ISEKAI_ATMOSPHERIC_AIR: load('isekai_atmospheric_air'),
  ISEKAI_LIGHT_QUALITY: load('isekai_light_quality'),
  ISEKAI_TIME_OF_DAY: load('isekai_time_of_day'),
  ISEKAI_EMOTIONAL_DNA: load('isekai_emotional_dna'),
  ISEKAI_CAMERA_FRAMING: load('isekai_camera_framing'),
  ISEKAI_STORY_PROP: load('isekai_story_prop'),
  ISEKAI_BACKGROUND_DETAIL: load('isekai_background_detail'),
  ISEKAI_SCENES: load('isekai_scenes'),
  FOOD_ANIME: load('food_anime'),
  ANIME_VILLAGE: load('anime_village'),
  // 12 new path scene pools (rebuild 2026-05-08).
  MECHA_HANGAR_SCENES: load('mecha_hangar_scenes'),
  FESTIVAL_NIGHT_SCENES: load('festival_night_scenes'),
  MAGICAL_GIRL_SCENES: load('magical_girl_scenes'),
  GHIBLI_COUNTRYSIDE_SCENES: load('ghibli_countryside_scenes'),
  OCCULT_TOKYO_SCENES: load('occult_tokyo_scenes'),
  POST_APOCALYPTIC_SCENES: load('post_apocalyptic_scenes'),
  BEACH_EPISODE_SCENES: load('beach_episode_scenes'),
  ROOFTOP_SUNSET_SCENES: load('rooftop_sunset_scenes'),
  CHERRY_BLOSSOM_SCENES: load('cherry_blossom_scenes'),
  SPACE_OPERA_SCENES: load('space_opera_scenes'),
  UNDERWATER_SCENES: load('underwater_scenes'),
  // Anime-character (male / female) path pools (added 2026-05-08).
  ANIME_SETTING: load('anime_setting'),
  ANIME_VISTA: load('anime_vista'),
  ANIME_ACTIVITY: load('anime_activity'),
  ANIME_SKIN: load('anime_skin'),
  ANIME_EYES: load('anime_eyes'),
  ANIME_HAIR_COLOR: load('anime_hair_color'),
  ANIME_ARCHETYPE_FEMALE: load('anime_archetype_female'),
  ANIME_ARCHETYPE_MALE: load('anime_archetype_male'),
  ANIME_OUTFITS_FEMALE: load('anime_outfits_female'),
  ANIME_OUTFITS_MALE: load('anime_outfits_male'),
  ANIME_HAIRSTYLES_FEMALE: load('anime_hairstyles_female'),
  ANIME_HAIRSTYLES_MALE: load('anime_hairstyles_male'),
  ANIME_ACCESSORIES_FEMALE: load('anime_accessories_female'),
  ANIME_ACCESSORIES_MALE: load('anime_accessories_male'),

  // anime-character-female axis-system path-bespoke pools (Phase 2.1, 2026-05-29).
  // Reuses ANIME_ARCHETYPE_FEMALE / ANIME_OUTFITS_FEMALE / ANIME_HAIRSTYLES_FEMALE
  // / ANIME_ACCESSORIES_FEMALE / ANIME_SKIN / ANIME_EYES / ANIME_HAIR_COLOR for
  // the character-DNA layer (appearance, no composition bias). New bespoke pools
  // below carry the anime-canon flavor + the forward-facing mandate.
  ANIME_CHARACTER_FEMALE_ETHNICITY: load('anime_character_female_ethnicity'),
  ANIME_CHARACTER_FEMALE_SETTING: load('anime_character_female_setting'),
  ANIME_CHARACTER_FEMALE_ACTION: load('anime_character_female_action'),
  ANIME_CHARACTER_FEMALE_CAMERA_FRAMING: load('anime_character_female_camera_framing'),
  ANIME_CHARACTER_FEMALE_SURPRISE_ELEMENT: load('anime_character_female_surprise_element'),
  ANIME_CHARACTER_FEMALE_DRAMA: load('anime_character_female_drama'),

  // anime-character-male path-bespoke pools (Phase 2.2, 2026-05-29).
  // FULL BESPOKE — no female pool reuse on path axes per
  // feedback_full_bespoke_per_path_no_shared_pools mandate. Reuses only
  // existing 200-entry character DNA pools (ANIME_ARCHETYPE_MALE /
  // ANIME_OUTFITS_MALE / ANIME_HAIRSTYLES_MALE / ANIME_ACCESSORIES_MALE +
  // shared ANIME_SKIN / ANIME_EYES / ANIME_HAIR_COLOR).
  ANIME_CHARACTER_MALE_ETHNICITY: load('anime_character_male_ethnicity'),
  ANIME_CHARACTER_MALE_SETTING: load('anime_character_male_setting'),
  ANIME_CHARACTER_MALE_ACTION: load('anime_character_male_action'),
  ANIME_CHARACTER_MALE_CAMERA_FRAMING: load('anime_character_male_camera_framing'),
  ANIME_CHARACTER_MALE_SURPRISE_ELEMENT: load('anime_character_male_surprise_element'),
  ANIME_CHARACTER_MALE_DRAMA: load('anime_character_male_drama'),

  // magical-girl path-bespoke pools (Phase 2.3, 2026-05-29). Full-bespoke.
  MAGICAL_GIRL_ETHNICITY: load('magical_girl_ethnicity'),
  MAGICAL_GIRL_ARCHETYPE: load('magical_girl_archetype'),
  MAGICAL_GIRL_OUTFIT: load('magical_girl_outfit'),
  MAGICAL_GIRL_ACCESSORY: load('magical_girl_accessory'),
  MAGICAL_GIRL_SETTING: load('magical_girl_setting'),
  MAGICAL_GIRL_ACTION: load('magical_girl_action'),
  MAGICAL_GIRL_CAMERA_FRAMING: load('magical_girl_camera_framing'),
  MAGICAL_GIRL_SURPRISE_ELEMENT: load('magical_girl_surprise_element'),
  MAGICAL_GIRL_DRAMA: load('magical_girl_drama'),

  // shonen-action path-bespoke pools (Phase 2.4, 2026-05-29). Full-bespoke.
  SHONEN_ACTION_ETHNICITY: load('shonen_action_ethnicity'),
  SHONEN_ACTION_HERO_CLASS: load('shonen_action_hero_class'),
  SHONEN_ACTION_OUTFIT: load('shonen_action_outfit'),
  SHONEN_ACTION_WEAPON: load('shonen_action_weapon'),
  SHONEN_ACTION_POWER_SIGNATURE: load('shonen_action_power_signature'),
  SHONEN_ACTION_BATTLEFIELD: load('shonen_action_battlefield'),
  SHONEN_ACTION_ACTION: load('shonen_action_action'),
  SHONEN_ACTION_CAMERA_FRAMING: load('shonen_action_camera_framing'),
  SHONEN_ACTION_SURPRISE_ELEMENT: load('shonen_action_surprise_element'),
  SHONEN_ACTION_DRAMA: load('shonen_action_drama'),

  // kawaii path-bespoke pools (Phase 2.5).
  KAWAII_ETHNICITY: load('kawaii_ethnicity'),
  KAWAII_ARCHETYPE: load('kawaii_archetype'),
  KAWAII_OUTFIT: load('kawaii_outfit'),
  KAWAII_ACCESSORY: load('kawaii_accessory'),
  KAWAII_SETTING: load('kawaii_setting'),
  KAWAII_ACTION: load('kawaii_action'),
  KAWAII_CAMERA_FRAMING: load('kawaii_camera_framing'),
  KAWAII_SURPRISE_ELEMENT: load('kawaii_surprise_element'),
  KAWAII_DRAMA: load('kawaii_drama'),

  // slice-of-life path-bespoke pools (Phase 2.6).
  SLICE_OF_LIFE_ETHNICITY: load('slice_of_life_ethnicity'),
  SLICE_OF_LIFE_ARCHETYPE: load('slice_of_life_archetype'),
  SLICE_OF_LIFE_OUTFIT: load('slice_of_life_outfit'),
  SLICE_OF_LIFE_ACCESSORY: load('slice_of_life_accessory'),
  SLICE_OF_LIFE_SETTING: load('slice_of_life_setting'),
  SLICE_OF_LIFE_ACTION: load('slice_of_life_action'),
  SLICE_OF_LIFE_CAMERA_FRAMING: load('slice_of_life_camera_framing'),
  SLICE_OF_LIFE_SURPRISE_ELEMENT: load('slice_of_life_surprise_element'),
  SLICE_OF_LIFE_DRAMA: load('slice_of_life_drama'),

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
