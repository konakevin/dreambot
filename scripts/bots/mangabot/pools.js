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
  NOIR_SCENES: load('noir_scenes'),
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
  VIBE_COLOR,

  SENSORY_POOLS: {
    female: { smell: load('sensory_female_smell'), sound: load('sensory_female_sound'), touch: load('sensory_female_touch'), temperature: load('sensory_female_temperature'), weight: load('sensory_female_weight'), air: load('sensory_female_air'), lightcolor: load('sensory_female_lightcolor') },
    male: { smell: load('sensory_male_smell'), sound: load('sensory_male_sound'), touch: load('sensory_male_touch'), temperature: load('sensory_male_temperature'), weight: load('sensory_male_weight'), air: load('sensory_male_air'), lightcolor: load('sensory_male_lightcolor') },
    creature: { smell: load('sensory_creature_smell'), sound: load('sensory_creature_sound'), touch: load('sensory_creature_touch'), temperature: load('sensory_creature_temperature'), weight: load('sensory_creature_weight'), air: load('sensory_creature_air'), lightcolor: load('sensory_creature_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
