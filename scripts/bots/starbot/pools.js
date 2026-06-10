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
// STARBOT_FORCE_LOCATION_POOL override deleted 2026-05-14 along with the
// 8 franchise paths it forced into.
const FORCE_MAP = null;

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
  // ─── derelict path (2026-06-09, NEW) — dead ship + explorer's beam. ───
  DERELICT_SETTING: load('derelict_setting'),
  DERELICT_DECAY: load('derelict_decay'),
  DERELICT_EXPLORER: load('derelict_explorer'),
  DERELICT_REVEAL: load('derelict_reveal'),
  DERELICT_ATMOSPHERE: load('derelict_atmosphere'),
  DERELICT_THREAT: load('derelict_threat'),

  // ─── leviathan / first-contact path (2026-06-09, NEW) — colossal alien. ───
  LEVIATHAN_FORM: load('leviathan_form'),
  LEVIATHAN_DETAIL: load('leviathan_detail'),
  LEVIATHAN_BEHAVIOR: load('leviathan_behavior'),
  LEVIATHAN_SETTING: load('leviathan_setting'),
  LEVIATHAN_SCALE_ANCHOR: load('leviathan_scale_anchor'),
  LEVIATHAN_CONTACT_EVENT: load('leviathan_contact_event'),

  // ─── crystalline-world path (2026-06-09, NEW) — crystal prisms + refraction. ───
  CRYSTALLINE_WORLD_COMPOSITION: load('crystalline_world_composition'),
  CRYSTALLINE_WORLD_FORMATION: load('crystalline_world_formation'),
  CRYSTALLINE_WORLD_MATERIAL: load('crystalline_world_material'),
  CRYSTALLINE_WORLD_REFRACTION: load('crystalline_world_refraction'),
  CRYSTALLINE_WORLD_GROUND: load('crystalline_world_ground'),
  CRYSTALLINE_WORLD_SKY: load('crystalline_world_sky'),
  CRYSTALLINE_WORLD_EVENT: load('crystalline_world_event'),

  // ─── impossible-sky path (2026-06-09, NEW) — ringed giant over a horizon. ───
  IMPOSSIBLE_SKY_RINGED_GIANT: load('impossible_sky_ringed_giant'),
  IMPOSSIBLE_SKY_COMPANIONS: load('impossible_sky_companions'),
  IMPOSSIBLE_SKY_FOREGROUND: load('impossible_sky_foreground'),
  IMPOSSIBLE_SKY_HORIZON: load('impossible_sky_horizon'),
  IMPOSSIBLE_SKY_ATMOSPHERE: load('impossible_sky_atmosphere'),
  IMPOSSIBLE_SKY_EVENT: load('impossible_sky_event'),
  IMPOSSIBLE_SKY_WITNESS: load('impossible_sky_witness'), // 40% gated tiny figure

  // ─── ring-habitat path (2026-06-09, NEW) — O'Neill cylinder interior. ───
  RING_HABITAT_ZONE: load('ring_habitat_zone'),
  RING_HABITAT_CURVE: load('ring_habitat_curve'),
  RING_HABITAT_AXIS_LIGHT: load('ring_habitat_axis_light'),
  RING_HABITAT_ENDCAP: load('ring_habitat_endcap'),
  RING_HABITAT_DETAIL: load('ring_habitat_detail'),
  RING_HABITAT_SCALE_PROVER: load('ring_habitat_scale_prover'),
  RING_HABITAT_EVENT: load('ring_habitat_event'),

  // ─── spacewalk path (2026-06-09, NEW) — zero-G EVA shot. MVP-25 pools. ───
  SPACEWALK_SUIT: load('spacewalk_suit'),
  SPACEWALK_EVA_ACTION: load('spacewalk_eva_action'),
  SPACEWALK_VISOR_REFLECTION: load('spacewalk_visor_reflection'),
  SPACEWALK_VOID_BACKDROP: load('spacewalk_void_backdrop'),
  SPACEWALK_NEARBY_STRUCTURE: load('spacewalk_nearby_structure'),
  SPACEWALK_SUIT_DETAIL: load('spacewalk_suit_detail'),
  SPACEWALK_COSMIC_EVENT: load('spacewalk_cosmic_event'),

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
  // ── cosmic-vista PREMIUM-TIER enrichment (2026-05-31) — 6 new bespoke pools
  // + COSMIC_VISTA_EVENT (split from shared COSMIC_EVENT). MVP-25 each.
  COSMIC_VISTA_PAINTED_TRADITION: load('cosmic_vista_painted_tradition'),
  COSMIC_VISTA_COMPOSITION: load('cosmic_vista_composition'),
  COSMIC_VISTA_NARRATIVE_WITNESS: load('cosmic_vista_narrative_witness'),
  COSMIC_VISTA_ATMOSPHERIC_LAYER: load('cosmic_vista_atmospheric_layer'),
  COSMIC_VISTA_COLOR_REGISTER: load('cosmic_vista_color_register'),
  COSMIC_VISTA_SIGNATURE_PHENOMENON: load('cosmic_vista_signature_phenomenon'),
  COSMIC_VISTA_EVENT: load('cosmic_vista_event'),
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
  // ── Space-opera PREMIUM-TIER enrichment (2026-05-31 reactivation) ──
  // 5 new path-bespoke axes pushing SPACE_OPERA from 5 → 10 bespoke pools.
  // Each axis seeded at MVP-25 until verified.
  SPACE_OPERA_CREW_SIGNAL: load('space_opera_crew_signal'),
  SPACE_OPERA_FACTION_ICONOGRAPHY: load('space_opera_faction_iconography'),
  SPACE_OPERA_PROPULSION_SIGNATURE: load('space_opera_propulsion_signature'),
  SPACE_OPERA_GENRE_REGISTER: load('space_opera_genre_register'),
  SPACE_OPERA_SIGNATURE_HULL_FEATURE: load('space_opera_signature_hull_feature'),
  SCI_FI_INTERIORS: load('sci_fi_interiors'),
  COZY_SCI_FI_INTERIORS: load('cozy_sci_fi_interiors'),
  ALIEN_CITIES: load('alien_cities'),
  REAL_SPACE_SUBJECTS: load('real_space_subjects'),
  // ── real-space PREMIUM-TIER enrichment (2026-05-31) — 6 new bespoke pools
  // + REAL_SPACE_EVENT (split from shared COSMIC_EVENT). MVP-25 each.
  REAL_SPACE_WAVELENGTH_SIGNATURE: load('real_space_wavelength_signature'),
  REAL_SPACE_STRUCTURAL_DETAIL: load('real_space_structural_detail'),
  REAL_SPACE_COLOR_PALETTE_BAND: load('real_space_color_palette_band'),
  REAL_SPACE_SCALE_ANCHOR: load('real_space_scale_anchor'),
  REAL_SPACE_COMPOSITION_FOCUS: load('real_space_composition_focus'),
  REAL_SPACE_NARRATIVE_PHASE: load('real_space_narrative_phase'),
  REAL_SPACE_EVENT: load('real_space_event'),
  COSMIC_ORACLE_CHARACTERS: load('cosmic_oracle_characters'),
  COSMIC_ORACLE_ACTIONS: load('cosmic_oracle_actions'),
  // Conditional ritual/mystic moment for cosmic-oracle path (40% gate)
  RITUAL_MOMENT: load('ritual_moment'),
  // Conditional cosmic event for cosmic-vista path (40% gate)
  COSMIC_EVENT: load('cosmic_event'),
  // Conditional cozy intimate moment for cozy-sci-fi-interior path (40% gate)
  COZY_MOMENT: load('cozy_moment'),
  COSMIC_ORACLE_LOCATIONS: load('cosmic_oracle_locations'),
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
  PLANET_SETTING: FORCE_MAP
    ? FORCE_MAP
    : [
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
      ],
  // SCALE-DEFINING BACKDROP — massive thing in the sky/horizon dwarfing the character
  EXPLORER_EPIC_BACKDROPS: load('explorer_epic_backdrops'),
  // Retired (kept for safety; explorer paths no longer consume):
  EXPLORER_ALIEN_LOCATIONS: load('explorer_alien_locations'),
  EXPLORER_SHIP_LOCATIONS: load('explorer_ship_locations'),
  EXPLORER_COZY_LOCATIONS: load('explorer_cozy_locations'),
  // Path-bespoke pools for space-femme (2026-05-23 — new path) — 8 axes
  // (7 always-on + 1 conditional cosmic phenomenon at 70% gate). Pushed-to-11
  // ornate female-figure poster art in the Frazetta / Whelan / Vallejo /
  // Bonestell painted-oil cover-art tradition. Anchored on Kevin's 15-heart
  // female-explorer calibration; designed bespoke from R0 (NOT cloned from FE).
  SPACE_FEMME_RENDER_STYLE: load('space_femme_render_style'),
  SPACE_FEMME_SUBJECT_DNA: load('space_femme_subject_dna'),
  SPACE_FEMME_OUTFIT: load('space_femme_outfit'),
  SPACE_FEMME_ACTION_POSTER: load('space_femme_action_poster'),
  SPACE_FEMME_BIOME: load('space_femme_biome'),
  SPACE_FEMME_BACKGROUND_DRAMA: load('space_femme_background_drama'),
  SPACE_FEMME_PROP: load('space_femme_prop'),
  SPACE_FEMME_CAMERA_POSTER: load('space_femme_camera_poster'),
  SPACE_FEMME_PHENOMENON: load('space_femme_phenomenon'),

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
    // spacewalk (2026-06-09) — hard vacuum + zero-G. ONLY lightcolor; the
    // weight / air / temperature / smell channels inject gravity, breathable
    // air, and warmth that fight the airless free-fall void. Reuses the scene
    // lightcolor pool (vacuum-safe — it's about light + color only).
    spacewalk: {
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
