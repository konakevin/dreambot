/**
 * DragonBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/dragonbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic grade, deep shadows, epic highlights',
  cozy: 'warm amber hearth glow, firelit amber + deep brown, inviting tones',
  epic: 'dramatic god-rays, rich golden highlights, heroic deep shadows',
  nostalgic: 'warm copper-sepia, faded mythic pastels, weathered storybook',
  psychedelic: 'impossible magenta arcane colors, luminous acid-green, violet-glow',
  peaceful: 'soft diffuse daylight, gentle pastoral pastels, breath-worthy calm',
  whimsical: 'buoyant saturated pastels, warm Ghibli-creamy light',
  ethereal: 'pearl-white mist, opalescent fog, luminous pale tones',
  arcane: 'deep violet and emerald spirit-glow, mystic luminous candles, runic shimmer',
  ancient: 'molten amber sunbeams, bronze patina, weathered mythic stone',
  enchanted: 'soft magical glow, dreamy lavender-and-rose, Ghibli-shimmer',
  fierce: 'stark amber-and-obsidian, savage backlight, blood-red accents',
  coquette: 'rose-blush atmosphere, cream highlights (rare for fantasy, soft edge)',
  voltage: 'electric-blue magical arcs, neon spell-glow accents, contrast',
  nightshade: 'deep violet and silver moonlight, plum shadows, starlit',
  macabre: 'inked blood-red-and-black, dark-fantasy dread atmosphere',
  shimmer: 'shimmering gold particulate, iridescent highlights, enchanted glow',
  surreal: 'impossible color pairings, arcane hallucinatory shifts',
};

module.exports = {
  // Path-bespoke pools for female-adventurer (2026-05-14 — full rebuild
  // from female-warrior. 12-axis split system per new playbook. NSFW-clean
  // — no artist callouts, no cheesecake language. Sleek adventuring gear
  // across all D&D × LOTR fantasy classes + races).
  FEMALE_ADVENTURER_RACE: load('female_adventurer_race'),
  FEMALE_ADVENTURER_EYES: load('female_adventurer_eyes'),
  FEMALE_ADVENTURER_HAIR_COLOR: load('female_adventurer_hair_color'),
  FEMALE_ADVENTURER_CLASS: load('female_adventurer_class'),
  // ─── female-action-scenes path (2026-05-14 — clone of female-adventurer
  // massaged into pure-action energy: mages mid-spell with explosions,
  // ranger mid-loose, rogue sneaking through night market, paladin
  // mid-strike with divine light, sorceress at summon apex, druid
  // mid-shape-shift, warlock eldritch blast, etc.)
  FEMALE_ACTION_SCENES_RACE: load('female_action_scenes_race'),
  FEMALE_ACTION_SCENES_CLASS: load('female_action_scenes_class'),
  FEMALE_ACTION_SCENES_OUTFIT: load('female_action_scenes_outfit'),
  FEMALE_ACTION_SCENES_ACCESSORY: load('female_action_scenes_accessory'),
  FEMALE_ACTION_SCENES_HAIRSTYLE: load('female_action_scenes_hairstyle'),
  FEMALE_ACTION_SCENES_ACTION: load('female_action_scenes_action'),
  FEMALE_ACTION_SCENES_LANDSCAPE: load('female_action_scenes_landscape'),
  FEMALE_ACTION_SCENES_DRAMA: load('female_action_scenes_drama'),
  FEMALE_ACTION_SCENES_SURPRISE_ELEMENT: load('female_action_scenes_surprise_element'),
  // ─── male-adventurer path (2026-05-14 full bespoke rebuild from
  // legacy male-warrior). 12-axis split mirroring female-adventurer.
  // All pools NEW and male-bespoke (no sharing with female pools).
  MALE_ADVENTURER_RACE: load('male_adventurer_race'),
  MALE_ADVENTURER_CLASS: load('male_adventurer_class'),
  MALE_ADVENTURER_SKIN: load('male_adventurer_skin'),
  MALE_ADVENTURER_EYES: load('male_adventurer_eyes'),
  MALE_ADVENTURER_HAIR_COLOR: load('male_adventurer_hair_color'),
  MALE_ADVENTURER_HAIRSTYLE: load('male_adventurer_hairstyle'),
  MALE_ADVENTURER_OUTFIT: load('male_adventurer_outfit'),
  MALE_ADVENTURER_ACCESSORY: load('male_adventurer_accessory'),
  MALE_ADVENTURER_ACTION: load('male_adventurer_action'),
  MALE_ADVENTURER_LANDSCAPE: load('male_adventurer_landscape'),
  MALE_ADVENTURER_DRAMA: load('male_adventurer_drama'),
  MALE_ADVENTURER_SURPRISE_ELEMENT: load('male_adventurer_surprise_element'),
  // ─── male-action-scenes path (2026-05-14, clone of male-adventurer with
  // action rewritten for peak-action multi-effect)
  MALE_ACTION_SCENES_RACE: load('male_action_scenes_race'),
  MALE_ACTION_SCENES_CLASS: load('male_action_scenes_class'),
  MALE_ACTION_SCENES_SKIN: load('male_action_scenes_skin'),
  MALE_ACTION_SCENES_EYES: load('male_action_scenes_eyes'),
  MALE_ACTION_SCENES_HAIR_COLOR: load('male_action_scenes_hair_color'),
  MALE_ACTION_SCENES_HAIRSTYLE: load('male_action_scenes_hairstyle'),
  MALE_ACTION_SCENES_OUTFIT: load('male_action_scenes_outfit'),
  MALE_ACTION_SCENES_ACCESSORY: load('male_action_scenes_accessory'),
  MALE_ACTION_SCENES_ACTION: load('male_action_scenes_action'),
  MALE_ACTION_SCENES_LANDSCAPE: load('male_action_scenes_landscape'),
  MALE_ACTION_SCENES_DRAMA: load('male_action_scenes_drama'),
  MALE_ACTION_SCENES_SURPRISE_ELEMENT: load('male_action_scenes_surprise_element'),
  // ─── landscape path (2026-05-14, flagship migration from legacy
  // function-based form to bespoke 5-axis system).
  LANDSCAPE_BIOME: load('landscape_biome'),
  LANDSCAPE_ARCHITECTURE: load('landscape_architecture'),
  LANDSCAPE_PHENOMENON: load('landscape_phenomenon'),
  LANDSCAPE_SURPRISE_ELEMENT: load('landscape_surprise_element'),
  LANDSCAPE_SKY: load('landscape_sky'),
  // ─── dragon-lore path (2026-05-14, migration from legacy)
  DRAGON_LORE_SCENE: load('dragon_lore_scene'),
  DRAGON_LORE_ARCHITECTURE: load('dragon_lore_architecture'),
  DRAGON_LORE_PHENOMENON: load('dragon_lore_phenomenon'),
  DRAGON_LORE_SURPRISE_ELEMENT: load('dragon_lore_surprise_element'),
  DRAGON_LORE_SKY: load('dragon_lore_sky'),
  // ─── dark-realm path (2026-05-14, migration from legacy)
  DARK_REALM_SCENE: load('dark_realm_scene'),
  DARK_REALM_ARCHITECTURE: load('dark_realm_architecture'),
  DARK_REALM_PHENOMENON: load('dark_realm_phenomenon'),
  DARK_REALM_SURPRISE_ELEMENT: load('dark_realm_surprise_element'),
  DARK_REALM_SKY: load('dark_realm_sky'),
  FEMALE_ADVENTURER_OUTFIT: load('female_adventurer_outfit'),
  FEMALE_ADVENTURER_ACCESSORY: load('female_adventurer_accessory'),
  FEMALE_ADVENTURER_HAIRSTYLE: load('female_adventurer_hairstyle'),
  FEMALE_ADVENTURER_ACTION: load('female_adventurer_action'),
  FEMALE_ADVENTURER_LANDSCAPE: load('female_adventurer_landscape'),
  FEMALE_ADVENTURER_DRAMA: load('female_adventurer_drama'),
  FEMALE_ADVENTURER_SURPRISE_ELEMENT: load('female_adventurer_surprise_element'),
  // Path-bespoke pools for female-warrior (LEGACY — kept for any orphan
  // refs; female-warrior path was deleted 2026-05-14 in favor of
  // female-adventurer rebuild. Pools retained to keep artsy-girl side
  // unaffected if it references any).
  FEMALE_WARRIOR_ACTION: load('female_warrior_action'),
  FEMALE_WARRIOR_LANDSCAPE: load('female_warrior_landscape'),
  FEMALE_WARRIOR_DRAMA: load('female_warrior_drama'),
  FEMALE_WARRIOR_SURPRISE_ELEMENT: load('female_warrior_surprise_element'),
  // Path-bespoke pools for artsy-girl (2026-05-13 — frozen clone of
  // female_warrior_* at the moment it produced the Frazetta-cheesecake
  // painted-fantasy-cover renders Kevin loved). Independent seed files —
  // future female_warrior_* edits do NOT affect this path.
  ARTSY_GIRL_OUTFIT: load('artsy_girl_outfit'),
  ARTSY_GIRL_ACTION: load('artsy_girl_action'),
  ARTSY_GIRL_LANDSCAPE: load('artsy_girl_landscape'),
  ARTSY_GIRL_DRAMA: load('artsy_girl_drama'),
  ARTSY_GIRL_SURPRISE_ELEMENT: load('artsy_girl_surprise_element'),
  // Path-bespoke pools for dragon-scene (2026-05-14 — applying new biome+axes
  // system to DragonBot as a fresh-test on a new bot per Kevin).
  DRAGON_SCENE_DRAGON: load('dragon_scene_dragon'),
  DRAGON_SCENE_ACTION: load('dragon_scene_action'),
  DRAGON_SCENE_LANDSCAPE: load('dragon_scene_landscape'),
  DRAGON_SCENE_DRAMA: load('dragon_scene_drama'),
  DRAGON_SCENE_SURPRISE_ELEMENT: load('dragon_scene_surprise_element'),
  FANTASY_CHARACTERS: load('fantasy_characters'),
  FANTASY_LANDSCAPES: load('fantasy_landscapes'),
  // ─── fantasy-scene path (2026-05-14, migration from legacy)
  FANTASY_SCENE_ACTION: load('fantasy_scene_action'),
  FANTASY_SCENE_DRAMA: load('fantasy_scene_drama'),
  // ─── epic-moment path = epic castle scenes (2026-05-14, reframed)
  EPIC_CASTLE: load('epic_castle'),
  EPIC_CASTLE_EVENT: load('epic_castle_event'),
  // ─── castle path (2026-05-17) — 100% castle-as-hero majestic establishing-shots
  CASTLE_HERO: load('castle_hero'),
  CASTLE_BIOME: load('castle_biome'),
  CASTLE_SKY: load('castle_sky'),
  CASTLE_SCALE_PROVER: load('castle_scale_prover'),
  CASTLE_PHENOMENON: load('castle_phenomenon'), // 40% gated
  // ─── iconic-landscape path (2026-05-14, merger of wow + lotr landscapes)
  ICONIC_BIOME: load('iconic_biome'),
  ICONIC_LANDSCAPE_SKY: load('iconic_landscape_sky'),
  ICONIC_LANDSCAPE_PHENOMENON: load('iconic_landscape_phenomenon'),
  // ─── arcane-halls path (2026-05-15 pivot — character-mid-magic-moment)
  ARCANE_HALL: load('arcane_hall'),
  ARCANE_HALL_PHENOMENA: load('arcane_hall_phenomena'),
  ARCANE_CASTER: load('arcane_caster'),
  ARCANE_SPELL_MOMENT: load('arcane_spell_moment'),
  WOW_LANDSCAPES: load('wow_landscapes'),
  WOW_ARCHITECTURE: load('wow_architecture'),
  LOTR_LANDSCAPES: load('lotr_landscapes'),
  LOTR_ARCHITECTURE: load('lotr_architecture'),
  ELDENRING_LANDSCAPES: load('eldenring_landscapes'),
  ELDENRING_ARCHITECTURE: load('eldenring_architecture'),
  GOT_LANDSCAPES: load('got_landscapes'),
  GOT_ARCHITECTURE: load('got_architecture'),
  EPIC_MOMENTS: load('epic_moments'),
  DRAGON_TYPES: load('dragon_types'),
  ARCANE_PHENOMENA: load('arcane_phenomena'),
  COZY_ARCANE_SETTINGS: load('cozy_arcane_settings'),
  ARCHITECTURAL_ELEMENTS: load('architectural_elements'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  ENCHANTED_SCENES: load('enchanted_scenes'),
  DRAGON_RIDER_SCENES: load('dragon_rider_scenes'),
  DARK_REALM_SCENES: load('dark_realm_scenes'),
  DRAGON_LORE_SCENES: load('dragon_lore_scenes'),
  MALE_WARRIORS: load('male_warriors'),
  FEMALE_WARRIORS: load('female_warriors'),
  WARRIOR_ACTIONS: load('warrior_actions'),
  ARCANE_HALLS: load('arcane_halls'),
  FEMALE_OUTFITS: load('female_outfits'),
  MALE_OUTFITS: load('male_outfits'),
  SCENE_PALETTES: load('scene_palettes'),
  // Slot-pool DNA for female-warrior + male-warrior paths (mirrors GothBot)
  WARRIOR_SKIN: load('warrior_skin'),
  WARRIOR_EYES: load('warrior_eyes'),
  WARRIOR_HAIR_COLOR: load('warrior_hair_color'),
  FEMALE_WARRIOR_HAIRSTYLES: load('female_warrior_hairstyles'),
  MALE_WARRIOR_HAIRSTYLES: load('male_warrior_hairstyles'),
  FEMALE_WARRIOR_ACCESSORIES: load('female_warrior_accessories'),
  MALE_WARRIOR_ACCESSORIES: load('male_warrior_accessories'),
  // Fantasy race + adventuring action variety pools (drow / tiefling / dragonborn / etc.)
  // Battle pool deleted 2026-05-01 — these paths are PEACEFUL adventuring shots,
  // never combat / dying / wounded / violence.
  FANTASY_RACE: load('fantasy_race'),
  WARRIOR_ADVENTURE_ACTIONS: load('warrior_adventure_actions'),
  FANTASY_LINEAGE_ACTIONS: load('fantasy_lineage_actions'),
  VIBE_COLOR,

  // Sensory anchor pools — 4 contexts × 7 channels × 100 entries.
  // Wired into bot.sensoryAnchors.poolsByContextAndChannel in index.js.
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
