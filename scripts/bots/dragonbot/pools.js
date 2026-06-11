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
  // ─── male-explorer path (2026-05-23 — male counterpart of female-explorer:
  // cool gritty masculine armor + candid adventurous scenes; reuses male DNA
  // pools, bespoke cool-armor outfit + adventurous action, de-birded).
  MALE_EXPLORER_RACE: load('male_explorer_race'),
  MALE_EXPLORER_CLASS: load('male_explorer_class'),
  MALE_EXPLORER_SKIN: load('male_explorer_skin'),
  MALE_EXPLORER_EYES: load('male_explorer_eyes'),
  MALE_EXPLORER_HAIR_COLOR: load('male_explorer_hair_color'),
  MALE_EXPLORER_HAIRSTYLE: load('male_explorer_hairstyle'),
  MALE_EXPLORER_OUTFIT: load('male_explorer_outfit'),
  MALE_EXPLORER_ACCESSORY: load('male_explorer_accessory'),
  MALE_EXPLORER_ACTION: load('male_explorer_action'),
  MALE_EXPLORER_LANDSCAPE: load('male_explorer_landscape'),
  MALE_EXPLORER_DRAMA: load('male_explorer_drama'),
  MALE_EXPLORER_SURPRISE_ELEMENT: load('male_explorer_surprise_element'),
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
  // ─── female-explorer path (2026-05-23 — carbon copy of the cool-armor
  // female-adventurer state; independent pools so the two paths can diverge).
  FEMALE_EXPLORER_RACE: load('female_explorer_race'),
  FEMALE_EXPLORER_EYES: load('female_explorer_eyes'),
  FEMALE_EXPLORER_HAIR_COLOR: load('female_explorer_hair_color'),
  FEMALE_EXPLORER_CLASS: load('female_explorer_class'),
  FEMALE_EXPLORER_OUTFIT: load('female_explorer_outfit'),
  FEMALE_EXPLORER_ACCESSORY: load('female_explorer_accessory'),
  FEMALE_EXPLORER_HAIRSTYLE: load('female_explorer_hairstyle'),
  FEMALE_EXPLORER_ACTION: load('female_explorer_action'),
  FEMALE_EXPLORER_LANDSCAPE: load('female_explorer_landscape'),
  FEMALE_EXPLORER_DRAMA: load('female_explorer_drama'),
  FEMALE_EXPLORER_SURPRISE_ELEMENT: load('female_explorer_surprise_element'),
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
  // ─── arcane-library path (2026-06-10, NEW, Tier 3) — hall of knowledge. MVP-25. ───
  ARCLIB_LIBRARY: load('arclib_library'),
  ARCLIB_DETAIL: load('arclib_detail'),
  ARCLIB_FEATURE: load('arclib_feature'),
  ARCLIB_OCCUPANT: load('arclib_occupant'),
  ARCLIB_DRAMA: load('arclib_drama'),

  // ─── sky-castle path (2026-06-10, NEW, Tier 3) — floating kingdom. MVP-25. ───
  SKYCASTLE_STRUCTURE: load('skycastle_structure'),
  SKYCASTLE_DETAIL: load('skycastle_detail'),
  SKYCASTLE_SETTING: load('skycastle_setting'),
  SKYCASTLE_SCALE: load('skycastle_scale'),
  SKYCASTLE_DRAMA: load('skycastle_drama'),

  // ─── elven-city path (2026-06-10, NEW, Tier 3) — elven realm. MVP-25. ───
  ELVENCITY_CITY: load('elvencity_city'),
  ELVENCITY_DETAIL: load('elvencity_detail'),
  ELVENCITY_SETTING: load('elvencity_setting'),
  ELVENCITY_OCCUPANT: load('elvencity_occupant'),
  ELVENCITY_DRAMA: load('elvencity_drama'),

  // ─── dwarven-hold path (2026-06-10, NEW, Tier 3) — dwarf kingdom. MVP-25. ───
  DWARFHOLD_HALL: load('dwarfhold_hall'),
  DWARFHOLD_DETAIL: load('dwarfhold_detail'),
  DWARFHOLD_FORGE: load('dwarfhold_forge'),
  DWARFHOLD_OCCUPANT: load('dwarfhold_occupant'),
  DWARFHOLD_DRAMA: load('dwarfhold_drama'),

  // ─── wizard-tower path (2026-06-10, NEW, Tier 3) — mage tower. MVP-25. ───
  WIZTOWER_TOWER: load('wiztower_tower'),
  WIZTOWER_ARCANA: load('wiztower_arcana'),
  WIZTOWER_SETTING: load('wiztower_setting'),
  WIZTOWER_OCCUPANT: load('wiztower_occupant'),
  WIZTOWER_DRAMA: load('wiztower_drama'),

  // ─── necromancer path (2026-06-10, NEW, Tier 2) — dark undead. MVP-25. ───
  NECRO_SUBJECT: load('necro_subject'),
  NECRO_SETTING: load('necro_setting'),
  NECRO_MAGIC: load('necro_magic'),
  NECRO_DETAIL: load('necro_detail'),
  NECRO_DRAMA: load('necro_drama'),

  // ─── dungeon-delve path (2026-06-10, NEW, Tier 2) — torch-lit crawl. MVP-25. ───
  DUNGEON_CHAMBER: load('dungeon_chamber'),
  DUNGEON_PARTY: load('dungeon_party'),
  DUNGEON_DETAIL: load('dungeon_detail'),
  DUNGEON_THREAT: load('dungeon_threat'),
  DUNGEON_DRAMA: load('dungeon_drama'),

  // ─── mythic-bestiary path (2026-06-10, NEW, Tier 2) — monster portraits. MVP-25. ───
  BESTIARY_CREATURE: load('bestiary_creature'),
  BESTIARY_ACTION: load('bestiary_action'),
  BESTIARY_HABITAT: load('bestiary_habitat'),
  BESTIARY_ENCOUNTER: load('bestiary_encounter'),
  BESTIARY_DRAMA: load('bestiary_drama'),

  // ─── magic-unleashed path (2026-06-10, NEW, Tier 2) — colossal spell. MVP-25. ───
  MAGIC_SPELL_EVENT: load('magic_spell_event'),
  MAGIC_CASTER: load('magic_caster'),
  MAGIC_EFFECT: load('magic_effect'),
  MAGIC_SETTING: load('magic_setting'),
  MAGIC_DRAMA: load('magic_drama'),

  // ─── clash-of-armies path (2026-06-10, NEW, Tier 2) — massed battle. MVP-25. ───
  CLASH_ARMIES: load('clash_armies'),
  CLASH_ACTION: load('clash_action'),
  CLASH_BATTLEFIELD: load('clash_battlefield'),
  CLASH_SPECTACLE: load('clash_spectacle'),
  CLASH_DRAMA: load('clash_drama'),

  // ─── dragon-breeds path (2026-06-10, NEW) — bestiary portraits. MVP-25. ───
  DRAGON_BREEDS_BREED: load('dragon_breeds_breed'),
  DRAGON_BREEDS_HABITAT: load('dragon_breeds_habitat'),
  DRAGON_BREEDS_POSE: load('dragon_breeds_pose'),
  DRAGON_BREEDS_ELEMENT: load('dragon_breeds_element'),
  DRAGON_BREEDS_DRAMA: load('dragon_breeds_drama'),

  // ─── dragon-brood path (2026-06-10, NEW) — many dragons. MVP-25. ───
  DRAGON_BROOD_SUBJECT: load('dragon_brood_subject'),
  DRAGON_BROOD_SETTING: load('dragon_brood_setting'),
  DRAGON_BROOD_DOMINANT: load('dragon_brood_dominant'),
  DRAGON_BROOD_ACTIVITY: load('dragon_brood_activity'),
  DRAGON_BROOD_DRAMA: load('dragon_brood_drama'),

  // ─── dragon-flight path (2026-06-10, NEW) — dragon soaring. MVP-25. ───
  DRAGON_FLIGHT_DRAGON: load('dragon_flight_dragon'),
  DRAGON_FLIGHT_POSE: load('dragon_flight_pose'),
  DRAGON_FLIGHT_VISTA: load('dragon_flight_vista'),
  DRAGON_FLIGHT_SKY: load('dragon_flight_sky'),
  DRAGON_FLIGHT_DRAMA: load('dragon_flight_drama'),

  // ─── dragon-battle path (2026-06-10, NEW) — dragon mid-combat. MVP-25. ───
  DRAGON_BATTLE_DRAGON: load('dragon_battle_dragon'),
  DRAGON_BATTLE_ACTION: load('dragon_battle_action'),
  DRAGON_BATTLE_TARGET: load('dragon_battle_target'),
  DRAGON_BATTLE_SETTING: load('dragon_battle_setting'),
  DRAGON_BATTLE_DRAMA: load('dragon_battle_drama'),

  // ─── dragon-hoard path (2026-06-10, NEW) — dragon on treasure. MVP-25. ───
  DRAGON_HOARD_DRAGON: load('dragon_hoard_dragon'),
  DRAGON_HOARD_HOARD: load('dragon_hoard_hoard'),
  DRAGON_HOARD_LAIR: load('dragon_hoard_lair'),
  DRAGON_HOARD_POSE: load('dragon_hoard_pose'),
  DRAGON_HOARD_INTRUDER: load('dragon_hoard_intruder'),

  // ─── dragon-rider path (2026-06-10, NEW) — rider on a dragon. MVP-25. ───
  DRAGON_RIDER_DRAGON: load('dragon_rider_dragon'),
  DRAGON_RIDER_RIDER: load('dragon_rider_rider'),
  DRAGON_RIDER_ACTION: load('dragon_rider_action'),
  DRAGON_RIDER_SETTING: load('dragon_rider_setting'),
  DRAGON_RIDER_MOUNT_DETAIL: load('dragon_rider_mount_detail'),
  DRAGON_RIDER_DRAMA: load('dragon_rider_drama'),

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
  // ── cozy-arcane PREMIUM-TIER MIGRATION (2026-05-31) — 8 new bespoke pools
  // extracted from the legacy inline form + enrichment. MVP-25 each.
  COZY_ARCANE_INHABITANT_ARCHETYPE: load('cozy_arcane_inhabitant_archetype'),
  COZY_ARCANE_INHABITANT_AGE: load('cozy_arcane_inhabitant_age'),
  COZY_ARCANE_CANDID_MOMENT: load('cozy_arcane_candid_moment'),
  COZY_ARCANE_CLUTTER_FOCUS: load('cozy_arcane_clutter_focus'),
  COZY_ARCANE_HEARTH_WARMTH_SOURCE: load('cozy_arcane_hearth_warmth_source'),
  COZY_ARCANE_SIGNATURE_FAMILIAR: load('cozy_arcane_signature_familiar'),
  // COZY_ARCANE_AESTHETIC_TRADITION removed 2026-06-05 — illustrator-lineage
  // axis was render-style smuggled into a scene-content axis; see archetypes.js
  // COZY_ARCANE note. Seed JSON + .bak + gen recipe also deleted.
  COZY_ARCANE_MAGICAL_SIGNATURE: load('cozy_arcane_magical_signature'),
  // Cozy-arcane SPECIFIC race pool (2026-05-31) — replaces shared FANTASY_RACE
  // for this path. The shared pool has 28% orc/tusks/grey-skin entries which
  // (a) dominate visually due to Flux's training bias amplifying them and
  // (b) read off-genre for the cozy scholar/sanctum register. This pool
  // skews toward sanctum-appropriate races (human / elven / halfling /
  // gnome / firbolg / dwarven-loremaster / tiefling-scholar / etc.) with
  // only 1-2 orc-coded entries to preserve some variety.
  COZY_ARCANE_RACE: load('cozy_arcane_race'),
  // ── epic-moment PREMIUM-TIER enrichment (2026-05-31) — 6 new bespoke pools
  // pushing EPIC_MOMENT from 2 → 8 bespoke. MVP-25 each.
  EPIC_MOMENT_EPOCH_SIGNATURE: load('epic_moment_epoch_signature'),
  EPIC_MOMENT_PEAK_EVENT_CHOREOGRAPHY: load('epic_moment_peak_event_choreography'),
  EPIC_MOMENT_SKYLINE_DRAMA: load('epic_moment_skyline_drama'),
  EPIC_MOMENT_HERALDIC_IDENTITY: load('epic_moment_heraldic_identity'),
  EPIC_MOMENT_WITNESS_CHORUS: load('epic_moment_witness_chorus'),
  EPIC_MOMENT_ARCHITECTURAL_SIGNATURE: load('epic_moment_architectural_signature'),
  // ── iconic-landscape PREMIUM-TIER enrichment (2026-06-01) — 5 new bespoke
  // pools pushing ICONIC_LANDSCAPE from 3 → 8 bespoke. MVP-25 each.
  ICONIC_LANDSCAPE_MYTHIC_TRADITION: load('iconic_landscape_mythic_tradition'),
  ICONIC_LANDSCAPE_LEGENDARY_LANDMARK: load('iconic_landscape_legendary_landmark'),
  ICONIC_LANDSCAPE_MOOD_ATMOSPHERE: load('iconic_landscape_mood_atmosphere'),
  ICONIC_LANDSCAPE_HERALDIC_COLOR: load('iconic_landscape_heraldic_color'),
  ICONIC_LANDSCAPE_SIGNATURE_CREATURE: load('iconic_landscape_signature_creature'),
  // ── landscape PREMIUM-TIER enrichment (2026-06-01) — 5 new bespoke pools
  // pushing DRAGONBOT_LANDSCAPE from 5 → 10 bespoke. MVP-25 each.
  LANDSCAPE_AESTHETIC_REGISTER: load('landscape_aesthetic_register'),
  LANDSCAPE_LIGHT_QUALITY: load('landscape_light_quality'),
  LANDSCAPE_SIGNATURE_FLORA: load('landscape_signature_flora'),
  LANDSCAPE_SIGNATURE_FAUNA: load('landscape_signature_fauna'),
  LANDSCAPE_MAGICAL_ELEMENT: load('landscape_magical_element'),
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
