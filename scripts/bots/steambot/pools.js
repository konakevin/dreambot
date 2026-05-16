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
  fierce: 'stark forge-orange and obsidian, savage smoke contrast',
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
  STEAMPUNK_ATMOSPHERES: load('steampunk_atmospheres'),
  STEAMPUNK_CURIOS: load('steampunk_curios'),
  STEAMPUNK_ANIMATE_CURIOS: load('steampunk_animate_curios'),
  STEAMPUNK_CURIO_HABITAT: load('steampunk_curio_habitat'),
  STEAMPUNK_CURIO_ORNATE_FLOURISH: load('steampunk_curio_ornate_flourish'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
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
  VIBE_COLOR,

  SENSORY_POOLS: {
    female: { smell: load('sensory_female_smell'), sound: load('sensory_female_sound'), touch: load('sensory_female_touch'), temperature: load('sensory_female_temperature'), weight: load('sensory_female_weight'), air: load('sensory_female_air'), lightcolor: load('sensory_female_lightcolor') },
    male: { smell: load('sensory_male_smell'), sound: load('sensory_male_sound'), touch: load('sensory_male_touch'), temperature: load('sensory_male_temperature'), weight: load('sensory_male_weight'), air: load('sensory_male_air'), lightcolor: load('sensory_male_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
