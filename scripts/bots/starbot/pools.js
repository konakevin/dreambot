/**
 * StarBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/starbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Test override — set STARBOT_FORCE_LOCATION_POOL to 'dune-landscape',
// 'dune-architecture', 'aliens-landscape', or 'aliens-architecture' to
// force PLANET_SETTING / CHARACTER_INTERIOR / COSMIC_ORACLE_LOCATIONS to a
// single pool's content. Used during QA testing to verify how each pool
// blends with each character path.
const FORCE = process.env.STARBOT_FORCE_LOCATION_POOL;
const FORCE_MAP = FORCE
  ? { 'dune-landscape': load('dune_landscapes'),
      'dune-architecture': load('dune_architecture'),
      'aliens-landscape': load('aliens_landscapes'),
      'aliens-architecture': load('aliens_architecture') }[FORCE]
  : null;
if (FORCE && !FORCE_MAP) console.warn('Unknown STARBOT_FORCE_LOCATION_POOL:', FORCE);
if (FORCE_MAP) console.log('🔧 Forcing all location pools to:', FORCE);

// Cyborg + robot pools moved to MechBot 2026-05-05 — see scripts/bots/mechbot/pools.js.

const VIBE_COLOR = {
  cinematic: 'teal-and-orange sci-fi cinematic grade, deep shadows, luminous highlights',
  dark: 'oil-black dominant, single nebula-glow accent, stark void',
  epic: 'dramatic cosmic god-rays, rich indigo-and-gold, heroic scale palette',
  nostalgic: 'faded 70s-sci-fi palette, muted copper, warm-amber control panels',
  psychedelic: 'impossible magenta-violet nebula hues, hallucinatory cosmic shifts',
  peaceful: 'soft pastel nebula-pinks, gentle luminous calm, tranquil space',
  ethereal: 'pearl-white cosmic mist, opalescent space-gas, luminous pale tones',
  arcane: 'deep violet nebula, emerald spacedust, mystical cosmic hues',
  ancient: 'weathered bronze + deep-copper, sepia-sunset palette',
  enchanted: 'soft magical nebula glow, dreamy lavender-and-blue cosmic',
  fierce: 'stark crimson-and-obsidian, savage solar flare contrast',
  coquette: 'soft pastel nebula-pink + cream (rare for StarBot, soft edge)',
  voltage: 'electric blue plasma, neon cyberpunk accents, stark contrast',
  nightshade: 'deep violet void with silver starfield, plum-shadow palette',
  macabre: 'inked blood-crimson cosmic-dread, dark-nebula palette',
  shimmer: 'shimmering starlight + iridescent cosmic-dust highlights',
  surreal: 'impossible cosmic color pairings, hallucinatory space shifts',
};

module.exports = {
  // Story-scene template axes (added 2026-05-11) — every path rolls one of
  // each so renders carry a story beat + explicit subject presence +
  // massive-scale anchor. Replaces the static "just describe the world"
  // pattern that produced flat compositions.
  STORY_BEATS: load('story_beats'),
  SUBJECT_PRESENCE: load('subject_presence'),
  MASSIVE_SCALE: load('massive_scale'),

  // Slot-pool composition axes (added 2026-05-11) — universal Tier 1
  // axes shared across all StarBot paths. See BOT_SCENE_QUALITY_PLAYBOOK.md
  // for the full architecture. Rolled per render by every path file.
  ANCHOR_SCALE: load('anchor_scale'),
  COMPOSITION_FRAME: load('composition_frame'),
  SCALE_PROVERS: load('scale_provers'),
  WEATHER_PARTICULATE: load('weather_particulate'),
  EMOTIONAL_DNA: load('emotional_dna'),
  // Tier 2 — bot-level (StarBot-specific entities + skies). Shared across
  // most StarBot paths; a path can override via its own axis if needed.
  STARBOT_ANCHOR_ENTITY: load('starbot_anchor_entity'),
  ALIEN_SKY_LAYER: load('alien_sky_layer'),
  // Tier 3 — path-specific primary pool. alien-landscape gets its own
  // alien_planet_biome.json; other paths get their own primary pools
  // when they're rolled out to the slot-composer pattern.
  ALIEN_PLANET_BIOME: load('alien_planet_biome'),
  // MEGASTRUCTURE_SETTING — colossal artificial structures at planet-or-greater
  // scale. Each entry a specific megastructure with multi-tier composition.
  MEGASTRUCTURE_SETTING: load('megastructure_setting'),
  // CHARACTER_ACTION — cinematic sci-fi-movie verbs for character paths.
  // Modeled on MechBot's power_armor_actions: specific, dynamic, multiple
  // elements happening. Used by female-explorer / male-explorer paths to
  // break Flux's default portrait drift.
  CHARACTER_ACTION: load('character_action'),
  // SURPRISE_ELEMENT — a secondary visual accent woven into the scene to
  // add interest: alien creature / robot / fellow explorer / ship / vehicle
  // / artifact / distant conflict / orbital station / wildlife / etc.
  // Used by both scene + character paths to populate the frame beyond just
  // "the main subject in a setting".
  SURPRISE_ELEMENT: load('surprise_element'),

  // Scene pools
  COSMIC_PHENOMENA: load('cosmic_phenomena'),
  COSMIC_ANCHORS: load('cosmic_anchors'),
  MEGASTRUCTURES: load('megastructures'),
  ALIEN_LANDSCAPES: load('alien_landscapes'),
  SPACE_OPERA_SCENES: load('space_opera_scenes'),
  // Space-opera Tier 3 axes — 2026-05-11 migration to slot-pool composition.
  // Replaces the SPACE_OPERA_SCENES single-pool pattern. Each axis is rolled
  // independently and Sonnet composes them per render (50 × 30 × 30 = 45K combos).
  SPACE_OPERA_SHIPS: load('space_opera_ships'),
  SPACE_OPERA_SETTING: load('space_opera_setting'),
  SHIP_ACTION: load('ship_action'),
  // Smaller craft (10-200m) populating space-opera scenes around the kilometer-
  // class behemoth — fighters, cargo trains, satellites, escorts, drones.
  BUSY_FLEET_ELEMENTS: load('busy_fleet_elements'),
  // Combat moments injected when the space-opera path rolls a BATTLE scene
  // (~60% of renders) — energy beams crossing frame, hull breaches venting,
  // capital broadsides, fighter dogfights, boarding-pod swarms.
  BATTLE_DYNAMICS: load('battle_dynamics'),
  // Space-opera path-level axes (replace universal axes for this path) —
  // spaceship-action-coded versions of story-beats / composition / lighting /
  // particulate / emotional-dna. Added 2026-05-12 for fighter-action rewrite.
  SPACE_OPERA_STORY_BEAT: load('space_opera_story_beat'),
  SPACE_OPERA_COMPOSITION: load('space_opera_composition'),
  SPACE_OPERA_LIGHTING: load('space_opera_lighting'),
  SPACE_OPERA_PARTICULATE: load('space_opera_particulate'),
  SPACE_OPERA_EMOTION: load('space_opera_emotion'),
  SCI_FI_INTERIORS: load('sci_fi_interiors'),
  COZY_SCI_FI_INTERIORS: load('cozy_sci_fi_interiors'),
  ALIEN_CITIES: load('alien_cities'),
  REAL_SPACE_SUBJECTS: load('real_space_subjects'),
  COSMIC_ORACLE_CHARACTERS: load('cosmic_oracle_characters'),
  COSMIC_ORACLE_ACTIONS: load('cosmic_oracle_actions'),
  // Conditional ritual/mystic moment for cosmic-oracle path (40% gate)
  RITUAL_MOMENT: load('ritual_moment'),
  // Conditional cosmic event for cosmic-vista path (40% gate)
  COSMIC_EVENT: load('cosmic_event'),
  // Conditional cozy intimate moment for cozy-sci-fi-interior path (40% gate)
  COZY_MOMENT: load('cozy_moment'),
  COSMIC_ORACLE_LOCATIONS: FORCE_MAP ? FORCE_MAP : [
    ...load('cosmic_oracle_locations'),
    ...load('dune_landscapes'),
    ...load('dune_architecture'),
    ...load('aliens_landscapes'),
    ...load('aliens_architecture'),
    ...load('starwars_landscapes'),
    ...load('starwars_architecture'),
    ...load('guardians_landscapes'),
    ...load('guardians_architecture'),
    ...load('mass_effect_landscapes'),
    ...load('mass_effect_architecture'),
    ...load('halo_landscapes'),
    ...load('halo_architecture'),
    ...load('startrek_landscapes'),
    ...load('startrek_architecture'),
    ...load('starcraft_landscapes'),
    ...load('starcraft_architecture'),
  ],
  FEMALE_EXPLORERS: load('female_explorers'),
  MALE_EXPLORERS: load('male_explorers'),
  SCI_FI_FEMALE_OUTFITS: load('sci_fi_female_outfits'),
  SCI_FI_MALE_OUTFITS: load('sci_fi_male_outfits'),
  SCI_FI_ACTIONS: load('sci_fi_actions'),
  // Slot-pool DNA for female-explorer + male-explorer paths (mirrors GothBot)
  EXPLORER_SKIN: load('explorer_skin'),
  EXPLORER_EYES: load('explorer_eyes'),
  EXPLORER_HAIR_COLOR: load('explorer_hair_color'),
  FEMALE_EXPLORER_HAIRSTYLES: load('female_explorer_hairstyles'),
  MALE_EXPLORER_HAIRSTYLES: load('male_explorer_hairstyles'),
  FEMALE_EXPLORER_ACCESSORIES: load('female_explorer_accessories'),
  MALE_EXPLORER_ACCESSORIES: load('male_explorer_accessories'),
  // Sci-fi race + adventuring action variety (mirrors DragonBot's race upgrade)
  // All HUMAN-SHAPED races only (Twi'lek, Vulcan, Mandalorian, Replicant, etc.)
  // No combat / battle / violence — peaceful adventuring scenes only.
  SCI_FI_RACE: load('sci_fi_race'),
  EXPLORER_ADVENTURE_ACTIONS: load('explorer_adventure_actions'),
  SCI_FI_LINEAGE_ACTIONS: load('sci_fi_lineage_actions'),
  // Explorer paths — alien-planet-only with scenery as costar (per Kevin
  // 2026-05-01: drop ship/cozy locations, drop fashion-officer outfits, lock
  // to wide cinematic shots where the alien world dominates the frame).
  EXPLORER_OUTFITS_FEMALE: load('explorer_outfits_female'),
  // Path-bespoke pools for halo-landscape (2026-05-13) — Bungie / 343 /
  // Sparth / Pat Rawlings tradition.
  HALO_ANCHOR_ENTITY: load('halo_anchor_entity'),
  HALO_MOMENT: load('halo_moment'),
  HALO_DEEP_DISTANCE: load('halo_deep_distance'),
  // Path-bespoke pools for guardians-architecture (2026-05-13) — James Gunn /
  // Jack Kirby cosmic / 70s album-cover sci-fi tradition.
  GUARDIANS_ATMOSPHERE_DETAIL: load('guardians_atmosphere_detail'),
  GUARDIANS_DEEP_DISTANCE: load('guardians_deep_distance'),
  GUARDIANS_INCIDENT: load('guardians_incident'),
  // Path-bespoke pools for dune-landscape (2026-05-13) — Frank Herbert /
  // Villeneuve aesthetic. Lone witness + candid moment + far-back signature.
  DUNE_ANCHOR_ENTITY: load('dune_anchor_entity'),
  DUNE_MOMENT: load('dune_moment'),
  DUNE_DEEP_DISTANCE: load('dune_deep_distance'),
  // Path-bespoke pools for aliens-architecture (2026-05-13) — H.R. Giger /
  // Ridley Scott / Cameron Aliens-coded interior atmospheric DNA.
  ALIENS_ATMOSPHERE_DETAIL: load('aliens_atmosphere_detail'),
  ALIENS_DEEP_DISTANCE: load('aliens_deep_distance'),
  ALIENS_INCIDENT: load('aliens_incident'),
  // Path-bespoke pool for cozy-sci-fi-interior (2026-05-13) — the ONE
  // dominant warmth source defining each cozy scene's heat-and-light center.
  COZY_WARMTH_SOURCE: load('cozy_warmth_source'),
  // Path-bespoke pools for alien-landscape (2026-05-13) — lone wilderness
  // witnesses, candid landscape moments, signature deep-distance features.
  LANDSCAPE_ANCHOR_ENTITY: load('landscape_anchor_entity'),
  LANDSCAPE_MOMENT: load('landscape_moment'),
  LANDSCAPE_DEEP_DISTANCE: load('landscape_deep_distance'),
  // Path-bespoke pools for alien-city (2026-05-13) — drama (40% gated),
  // city-specific anchor witnesses, signature deep-distance features.
  ALIEN_CITY_DRAMA: load('alien_city_drama'),
  ALIEN_CITY_ANCHOR_ENTITY: load('alien_city_anchor_entity'),
  ALIEN_CITY_DEEP_DISTANCE: load('alien_city_deep_distance'),
  // Path-bespoke pools for megastructure (2026-05-13) — drama (40% gated),
  // megastructure-scale anchor witnesses, signature far-back features.
  MEGASTRUCTURE_DRAMA: load('megastructure_drama'),
  MEGASTRUCTURE_ANCHOR_ENTITY: load('megastructure_anchor_entity'),
  MEGASTRUCTURE_DEEP_DISTANCE: load('megastructure_deep_distance'),
  // Sleek, form-fitting, attractive futuristic outfits — bespoke for the
  // female-explorer path (2026-05-12). Replaces EXPLORER_OUTFITS_FEMALE
  // for FE because that pool drifted to cloth/leather/dieselpunk. New pool
  // is pure form-fit base + futuristic accents (no boxy power armor, no
  // baggy cloth). 30 entries to start; expand to 200 after lock.
  SLEEK_FEMALE_EXPLORER_OUTFITS: load('sleek_female_explorer_outfits'),
  EXPLORER_OUTFITS_MALE: load('explorer_outfits_male'),
  // Rugged, badass, weathered field outfits for the male-explorer path
  // (2026-05-13). Sibling to SLEEK_FEMALE_EXPLORER_OUTFITS but tuned for
  // "rugged + tactical + weapon-bristled" vs FE's "sleek form-fit". Mandalorian
  // protagonist / Mass Effect Shepard / Joel / Geralt / Mal Reynolds / Cad Bane
  // / Halo ODST aesthetic. 30 entries to start.
  RUGGED_MALE_EXPLORER_OUTFITS: load('rugged_male_explorer_outfits'),
  // BIOME / TERRAIN — where the character stands (50 diverse alien biomes)
  // PLANET_SETTING is a flat merge of 11 biome-specific 25-entry pools.
  // Equal random roll across the merged 275-entry collection (1/11 odds per
  // biome, 1/25 within). Old `planet_setting.json` retired.
  PLANET_SETTING: FORCE_MAP ? FORCE_MAP : [
    ...load('planet_jungle'),
    ...load('planet_swamp'),
    ...load('planet_ocean'),
    ...load('planet_ice'),
    ...load('planet_desert'),
    ...load('planet_crystal'),
    ...load('planet_volcanic'),
    ...load('planet_sky'),
    ...load('planet_ruins'),
    ...load('planet_cave'),
    ...load('planet_extreme'),
    ...load('dune_landscapes'),
    ...load('aliens_landscapes'),
    ...load('starwars_landscapes'),
    ...load('guardians_landscapes'),
    ...load('mass_effect_landscapes'),
    ...load('startrek_landscapes'),
    ...load('halo_landscapes'),
    ...load('starcraft_landscapes'),
  ],
  // Indoor / architectural settings for character paths that go inside spaces
  // (cyborg-woman, robot-moment, cosmic-oracle). Dune palace + Aliens biomech
  // hive aesthetics merged.
  CHARACTER_INTERIOR: FORCE_MAP ? FORCE_MAP : [
    ...load('dune_architecture'),
    ...load('aliens_architecture'),
    ...load('halo_architecture'),
    ...load('starwars_architecture'),
    ...load('guardians_architecture'),
    ...load('mass_effect_architecture'),
    ...load('startrek_architecture'),
    ...load('starcraft_architecture'),
  ],
  // Dedicated full-frame scene pools for the scene-only paths
  DUNE_LANDSCAPES: load('dune_landscapes'),
  DUNE_ARCHITECTURE: load('dune_architecture'),
  ALIENS_LANDSCAPES: load('aliens_landscapes'),
  ALIENS_ARCHITECTURE: load('aliens_architecture'),
  STARWARS_LANDSCAPES: load('starwars_landscapes'),
  STARWARS_ARCHITECTURE: load('starwars_architecture'),
  GUARDIANS_LANDSCAPES: load('guardians_landscapes'),
  GUARDIANS_ARCHITECTURE: load('guardians_architecture'),
  MASS_EFFECT_LANDSCAPES: load('mass_effect_landscapes'),
  MASS_EFFECT_ARCHITECTURE: load('mass_effect_architecture'),
  HALO_LANDSCAPES: load('halo_landscapes'),
  HALO_ARCHITECTURE: load('halo_architecture'),
  STARTREK_LANDSCAPES: load('startrek_landscapes'),
  STARTREK_ARCHITECTURE: load('startrek_architecture'),
  STARCRAFT_LANDSCAPES: load('starcraft_landscapes'),
  STARCRAFT_ARCHITECTURE: load('starcraft_architecture'),
  // SCALE-DEFINING BACKDROP — massive thing in the sky/horizon dwarfing the character
  EXPLORER_EPIC_BACKDROPS: load('explorer_epic_backdrops'),
  // Retired (kept for safety; explorer paths no longer consume):
  EXPLORER_ALIEN_LOCATIONS: load('explorer_alien_locations'),
  EXPLORER_SHIP_LOCATIONS: load('explorer_ship_locations'),
  EXPLORER_COZY_LOCATIONS: load('explorer_cozy_locations'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  CAMERA_ANGLES: load('camera_angles'),
  CITY_CAMERA_ANGLES: load('city_camera_angles'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  // Sensory anchor pools — 6 contexts × 7 channels × 100 entries each.
  // Cyborg/robot sensory pools moved to MechBot 2026-05-05.
  SENSORY_POOLS: {
    'explorer-female': {
      smell: load('sensory_explorer-female_smell'),
      sound: load('sensory_explorer-female_sound'),
      touch: load('sensory_explorer-female_touch'),
      temperature: load('sensory_explorer-female_temperature'),
      weight: load('sensory_explorer-female_weight'),
      air: load('sensory_explorer-female_air'),
      lightcolor: load('sensory_explorer-female_lightcolor'),
    },
    'explorer-male': {
      smell: load('sensory_explorer-male_smell'),
      sound: load('sensory_explorer-male_sound'),
      touch: load('sensory_explorer-male_touch'),
      temperature: load('sensory_explorer-male_temperature'),
      weight: load('sensory_explorer-male_weight'),
      air: load('sensory_explorer-male_air'),
      lightcolor: load('sensory_explorer-male_lightcolor'),
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
