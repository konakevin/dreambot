/**
 * ForestBot — axis pools. POC: single Sonnet-seeded pool of forest-fairy
 * scenes. Add more axes (lighting, atmosphere, palette variety) once the
 * look is approved.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

function loadIfExists(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

// Single vibe-color line for now — peaceful is the default mood for this
// bot. Three options for variety; each entry is a short atmospheric
// secondary-light cue that pairs with the gouache palette.
const VIBE_COLOR = {
  peaceful: 'soft golden afternoon glow filtering through canopy, dappled warm calm',
  enchanted:
    'soft magical violet-twilight glow, faint pollen-light particles, dreamy lavender-blue',
  ethereal: 'pearl-white morning mist, luminous pale haze, opalescent painted softness',
  nostalgic: 'faded warm sepia-gold, painted-storybook softness, gentle umber',
  whimsical: 'buoyant pastel forest tones, Ghibli-warm cream highlights, playful softness',
};

module.exports = {
  // ─── fae-natural-village path (2026-06-10, organic earthy dwellings in the wilds). MVP-25. ───
  FAEBOT_NATURAL_VILLAGE_FEATURE: load('faebot_natural_village_feature'),
  FAEBOT_NATURAL_VILLAGE_BUILT: load('faebot_natural_village_built'),
  FAEBOT_NATURAL_VILLAGE_CONNECTORS: load('faebot_natural_village_connectors'),
  FAEBOT_NATURAL_VILLAGE_INHABITANTS: load('faebot_natural_village_inhabitants'),
  FAEBOT_NATURAL_VILLAGE_LIGHTING: load('faebot_natural_village_lighting'),
  FAEBOT_NATURAL_VILLAGE_DRAMA: load('faebot_natural_village_drama'),

  // ─── fae-wilds-village path (2026-06-10, village built around a nature feature). MVP-25. ───
  FAEBOT_WILDS_VILLAGE_FEATURE: load('faebot_wilds_village_feature'),
  FAEBOT_WILDS_VILLAGE_BUILT: load('faebot_wilds_village_built'),
  FAEBOT_WILDS_VILLAGE_CONNECTORS: load('faebot_wilds_village_connectors'),
  FAEBOT_WILDS_VILLAGE_INHABITANTS: load('faebot_wilds_village_inhabitants'),
  FAEBOT_WILDS_VILLAGE_LIGHTING: load('faebot_wilds_village_lighting'),
  FAEBOT_WILDS_VILLAGE_DRAMA: load('faebot_wilds_village_drama'),

  // ─── fae-castle-village path (2026-06-10, hybrid of elven-city + fae-village). MVP-25. ───
  FAEBOT_CASTLE_VILLAGE_LAYOUT: load('faebot_castle_village_layout'),
  FAEBOT_CASTLE_VILLAGE_DETAIL: load('faebot_castle_village_detail'),
  FAEBOT_CASTLE_VILLAGE_SETTING: load('faebot_castle_village_setting'),
  FAEBOT_CASTLE_VILLAGE_INHABITANTS: load('faebot_castle_village_inhabitants'),
  FAEBOT_CASTLE_VILLAGE_LIGHTING: load('faebot_castle_village_lighting'),
  FAEBOT_CASTLE_VILLAGE_DRAMA: load('faebot_castle_village_drama'),

  // ─── elven-city path (2026-06-10, recreated from DragonBot, fae touch). MVP-25. ───
  FAEBOT_ELVEN_CITY_CITY: load('faebot_elven_city_city'),
  FAEBOT_ELVEN_CITY_DETAIL: load('faebot_elven_city_detail'),
  FAEBOT_ELVEN_CITY_SETTING: load('faebot_elven_city_setting'),
  FAEBOT_ELVEN_CITY_INHABITANTS: load('faebot_elven_city_inhabitants'),
  FAEBOT_ELVEN_CITY_LIGHTING: load('faebot_elven_city_lighting'),
  FAEBOT_ELVEN_CITY_DRAMA: load('faebot_elven_city_drama'),

  // ─── fae-court path (2026-06-10, transplanted from DragonBot). MVP-25. ───
  FAEBOT_FAE_COURT_SUBJECT: load('faebot_fae_court_subject'),
  FAEBOT_FAE_COURT_SETTING: load('faebot_fae_court_setting'),
  FAEBOT_FAE_COURT_DETAIL: load('faebot_fae_court_detail'),
  FAEBOT_FAE_COURT_SURPRISE: load('faebot_fae_court_surprise'),
  FAEBOT_FAE_COURT_LIGHTING: load('faebot_fae_court_lighting'),
  FAEBOT_FAE_COURT_DRAMA: load('faebot_fae_court_drama'),

  FOREST_FAIRY_SCENES: load('forest_fairy_scenes'),
  FOREST_CREATURES: load('forest_creatures'),
  DRYAD_PORTRAITS: load('dryad_portraits'),
  TINY_FAE: load('tiny_fae'),
  FAIRY_COURT: load('fairy_court'),
  ENCHANTED_VISTA: load('enchanted_vista'),
  FAE_VILLAGES: load('fae_villages'),
  VILLAGE_LIGHTING: load('village_lighting'),
  VILLAGE_WILDLIFE: load('village_wildlife'),
  // fae-cottage (2026-07-01) — cottagecore hero-dwelling path
  FAEBOT_FAE_COTTAGE_DWELLING: loadIfExists('faebot_fae_cottage_dwelling'),
  FAEBOT_FAE_COTTAGE_SETTING: loadIfExists('faebot_fae_cottage_setting'),
  FAEBOT_FAE_COTTAGE_OVERGROWTH: loadIfExists('faebot_fae_cottage_overgrowth'),
  FAEBOT_FAE_COTTAGE_GARDEN: loadIfExists('faebot_fae_cottage_garden'),
  FAEBOT_FAE_COTTAGE_LIGHTING: loadIfExists('faebot_fae_cottage_lighting'),
  FAEBOT_FAE_COTTAGE_ATMOSPHERE: loadIfExists('faebot_fae_cottage_atmosphere'),
  VILLAGE_FOREST_DETAIL: load('village_forest_detail'),
  // ─── flower-fairy path (R11 reset, 2026-05-17) ───
  FLOWER_FAIRY_CREATURES: loadIfExists('flower_fairy_creatures'),
  FLOWER_FAIRY_SCENES: loadIfExists('flower_fairy_scenes'),
  // ─── forest-fairy-scene axis-system pools (2026-05-20) ───
  FAEBOT_FOREST_FAIRY_SCENE_CREATURE: loadIfExists('faebot_forest_fairy_scene_creature'),
  FAEBOT_FOREST_FAIRY_SCENE_BIOME: loadIfExists('faebot_forest_fairy_scene_biome'),
  FAEBOT_FOREST_FAIRY_SCENE_LIGHTING: loadIfExists('faebot_forest_fairy_scene_lighting'),
  FAEBOT_FOREST_FAIRY_SCENE_WEATHER: loadIfExists('faebot_forest_fairy_scene_weather'),
  FAEBOT_FOREST_FAIRY_SCENE_FOREGROUND_ANCHOR: loadIfExists(
    'faebot_forest_fairy_scene_foreground_anchor'
  ),
  FAEBOT_FOREST_FAIRY_SCENE_BOTANICAL_ACCENT: loadIfExists(
    'faebot_forest_fairy_scene_botanical_accent'
  ),
  FAEBOT_FOREST_FAIRY_SCENE_CANDID_ACTION: loadIfExists('faebot_forest_fairy_scene_candid_action'),
  FAEBOT_FOREST_FAIRY_SCENE_MAGICAL_FLAVOR: loadIfExists(
    'faebot_forest_fairy_scene_magical_flavor'
  ),
  FAEBOT_FOREST_FAIRY_SCENE_SCALE_PROVER: loadIfExists('faebot_forest_fairy_scene_scale_prover'),
  FAEBOT_FOREST_FAIRY_SCENE_COMPANION: loadIfExists('faebot_forest_fairy_scene_companion'),
  // ─── flower-fairy axis-system pools (2026-05-20) ───
  FAEBOT_FLOWER_FAIRY_CREATURE: loadIfExists('faebot_flower_fairy_creature'),
  FAEBOT_FLOWER_FAIRY_BIOME: loadIfExists('faebot_flower_fairy_biome'),
  FAEBOT_FLOWER_FAIRY_LIGHTING: loadIfExists('faebot_flower_fairy_lighting'),
  FAEBOT_FLOWER_FAIRY_WEATHER: loadIfExists('faebot_flower_fairy_weather'),
  FAEBOT_FLOWER_FAIRY_FOREGROUND_ANCHOR: loadIfExists('faebot_flower_fairy_foreground_anchor'),
  FAEBOT_FLOWER_FAIRY_BOTANICAL_ACCENT: loadIfExists('faebot_flower_fairy_botanical_accent'),
  FAEBOT_FLOWER_FAIRY_CANDID_ACTION: loadIfExists('faebot_flower_fairy_candid_action'),
  FAEBOT_FLOWER_FAIRY_MAGICAL_FLAVOR: loadIfExists('faebot_flower_fairy_magical_flavor'),
  FAEBOT_FLOWER_FAIRY_SCALE_PROVER: loadIfExists('faebot_flower_fairy_scale_prover'),
  FAEBOT_FLOWER_FAIRY_COMPANION: loadIfExists('faebot_flower_fairy_companion'),
  // ─── tiny-fae axis-system pools (2026-05-21) ───
  // fairy-swarm — large fairy gatherings (2026-07-04).
  FAEBOT_FAIRY_SWARM_EVENT: loadIfExists('faebot_fairy_swarm_event'),
  FAEBOT_FAIRY_SWARM_TROUPE: loadIfExists('faebot_fairy_swarm_troupe'),
  FAEBOT_FAIRY_SWARM_SPOT: loadIfExists('faebot_fairy_swarm_spot'),
  FAEBOT_FAIRY_SWARM_CRITTER_GUESTS: loadIfExists('faebot_fairy_swarm_critter_guests'),
  FAEBOT_FAIRY_SWARM_FLORA: loadIfExists('faebot_fairy_swarm_flora'),
  FAEBOT_TINY_FAE_CREATURE: loadIfExists('faebot_tiny_fae_creature'),
  FAEBOT_TINY_FAE_SCALE_ANCHOR_COMPANION: loadIfExists('faebot_tiny_fae_scale_anchor_companion'),
  FAEBOT_TINY_FAE_MACRO_PERCH: loadIfExists('faebot_tiny_fae_macro_perch'),
  FAEBOT_TINY_FAE_FOREST_MICRO_BIOME: loadIfExists('faebot_tiny_fae_forest_micro_biome'),
  FAEBOT_TINY_FAE_LIGHTING: loadIfExists('faebot_tiny_fae_lighting'),
  FAEBOT_TINY_FAE_WEATHER: loadIfExists('faebot_tiny_fae_weather'),
  FAEBOT_TINY_FAE_ACTION: loadIfExists('faebot_tiny_fae_action'),
  FAEBOT_TINY_FAE_MAGICAL_FLAVOR: loadIfExists('faebot_tiny_fae_magical_flavor'),
  FAEBOT_TINY_FAE_FOREGROUND_ANCHOR: loadIfExists('faebot_tiny_fae_foreground_anchor'),
  FAEBOT_TINY_FAE_BOTANICAL_ACCENT: loadIfExists('faebot_tiny_fae_botanical_accent'),
  // ─── dryad-portrait axis-system pools (2026-05-21) ───
  FAEBOT_DRYAD_PORTRAIT_CREATURE: loadIfExists('faebot_dryad_portrait_creature'),
  FAEBOT_DRYAD_PORTRAIT_EXPRESSION_MOMENT: loadIfExists('faebot_dryad_portrait_expression_moment'),
  FAEBOT_DRYAD_PORTRAIT_GESTURE_POSE: loadIfExists('faebot_dryad_portrait_gesture_pose'),
  FAEBOT_DRYAD_PORTRAIT_COMPOSITION: loadIfExists('faebot_dryad_portrait_composition'),
  FAEBOT_DRYAD_PORTRAIT_ADORNMENT: loadIfExists('faebot_dryad_portrait_adornment'),
  FAEBOT_DRYAD_PORTRAIT_FOREST_BACKDROP: loadIfExists('faebot_dryad_portrait_forest_backdrop'),
  FAEBOT_DRYAD_PORTRAIT_LIGHTING: loadIfExists('faebot_dryad_portrait_lighting'),
  FAEBOT_DRYAD_PORTRAIT_WEATHER: loadIfExists('faebot_dryad_portrait_weather'),
  FAEBOT_DRYAD_PORTRAIT_MAGICAL_FLAVOR: loadIfExists('faebot_dryad_portrait_magical_flavor'),
  FAEBOT_DRYAD_PORTRAIT_FOREGROUND_ANCHOR: loadIfExists('faebot_dryad_portrait_foreground_anchor'),
  // ─── forest-elder axis-system pools (2026-06-11) — MALE woodland spirits, counterpart to dryad-portrait ───
  // All bespoke-male EXCEPT lighting, which reuses the genderless FAEBOT_DRYAD_PORTRAIT_LIGHTING set.
  FAEBOT_FOREST_ELDER_CREATURE: loadIfExists('faebot_forest_elder_creature'),
  FAEBOT_FOREST_ELDER_EXPRESSION: loadIfExists('faebot_forest_elder_expression'),
  FAEBOT_FOREST_ELDER_GESTURE: loadIfExists('faebot_forest_elder_gesture'), // legacy — replaced by STORY_BEAT (kept for revert)
  FAEBOT_FOREST_ELDER_STORY_BEAT: loadIfExists('faebot_forest_elder_story_beat'),
  FAEBOT_FOREST_ELDER_FRAMING: loadIfExists('faebot_forest_elder_framing'),
  FAEBOT_FOREST_ELDER_DOMAIN: loadIfExists('faebot_forest_elder_domain'),
  FAEBOT_FOREST_ELDER_ADORNMENT: loadIfExists('faebot_forest_elder_adornment'),
  FAEBOT_FOREST_ELDER_WEATHER: loadIfExists('faebot_forest_elder_weather'),
  FAEBOT_FOREST_ELDER_MAGICAL: loadIfExists('faebot_forest_elder_magical'),
  FAEBOT_FOREST_ELDER_FOREGROUND: loadIfExists('faebot_forest_elder_foreground'),

  // ─── druid paths (2026-06-11) — elven nature-warrior-mages (shared across the 4 druid paths) ───
  FAEBOT_FEMALE_DRUID: loadIfExists('faebot_female_druid'),
  FAEBOT_MALE_DRUID: loadIfExists('faebot_male_druid'),
  FAEBOT_DRUID_HAIR: loadIfExists('faebot_druid_hair'),
  FAEBOT_DRUID_OUTFIT: loadIfExists('faebot_druid_outfit'),
  FAEBOT_DRUID_POSE: loadIfExists('faebot_druid_pose'),
  FAEBOT_DRUID_COMPANION: loadIfExists('faebot_druid_companion'),
  FAEBOT_DRUID_ADVENTURE_SETTING: loadIfExists('faebot_druid_adventure_setting'),
  FAEBOT_DRUID_ADVENTURE_ACTION: loadIfExists('faebot_druid_adventure_action'),
  FAEBOT_DRUID_ADVENTURE_COMPOSITION: loadIfExists('faebot_druid_adventure_composition'),
  FAEBOT_DRUID_MAGIC: loadIfExists('faebot_druid_magic'),
  // ─── fae-village axis-system pools (2026-05-21 migration from legacy) ───
  FAEBOT_FAE_VILLAGE_DWELLING_TYPE: loadIfExists('faebot_fae_village_dwelling_type'),
  FAEBOT_FAE_VILLAGE_LAYOUT: loadIfExists('faebot_fae_village_layout'),
  FAEBOT_FAE_VILLAGE_LIVED_IN_SIGNS: loadIfExists('faebot_fae_village_lived_in_signs'),
  FAEBOT_FAE_VILLAGE_APPROACH_PATHWAY: loadIfExists('faebot_fae_village_approach_pathway'),
  FAEBOT_FAE_VILLAGE_DWELLING_GARDEN: loadIfExists('faebot_fae_village_dwelling_garden'),
  FAEBOT_FAE_VILLAGE_FOREST_SETTING: loadIfExists('faebot_fae_village_forest_setting'),
  FAEBOT_FAE_VILLAGE_LIGHTING: loadIfExists('faebot_fae_village_lighting'),
  FAEBOT_FAE_VILLAGE_ATMOSPHERIC_DEPTH: loadIfExists('faebot_fae_village_atmospheric_depth'),
  FAEBOT_FAE_VILLAGE_WILDLIFE_LIVED_IN: loadIfExists('faebot_fae_village_wildlife_lived_in'),
  FAEBOT_FAE_VILLAGE_FLORAL_CARPET: loadIfExists('faebot_fae_village_floral_carpet'),
  FAEBOT_FAE_VILLAGE_FOREGROUND_ANCHOR: loadIfExists('faebot_fae_village_foreground_anchor'),
  FAEBOT_FAE_VILLAGE_WATER_OR_FEATURE: loadIfExists('faebot_fae_village_water_or_feature'),
  // ─── enchanted-vista axis-system pools (2026-05-21 migration from legacy) ───
  FAEBOT_ENCHANTED_VISTA_BIOME: loadIfExists('faebot_enchanted_vista_biome'),
  FAEBOT_ENCHANTED_VISTA_HERO_FEATURE: loadIfExists('faebot_enchanted_vista_hero_feature'),
  FAEBOT_ENCHANTED_VISTA_FLOOR_CARPET: loadIfExists('faebot_enchanted_vista_floor_carpet'),
  FAEBOT_ENCHANTED_VISTA_WATER_ELEMENT: loadIfExists('faebot_enchanted_vista_water_element'),
  FAEBOT_ENCHANTED_VISTA_MAGICAL_AMBIENT: loadIfExists('faebot_enchanted_vista_magical_ambient'),
  FAEBOT_ENCHANTED_VISTA_COMPOSITION: loadIfExists('faebot_enchanted_vista_composition'),
  FAEBOT_ENCHANTED_VISTA_LIGHTING: loadIfExists('faebot_enchanted_vista_lighting'),
  FAEBOT_ENCHANTED_VISTA_ATMOSPHERIC_DEPTH: loadIfExists(
    'faebot_enchanted_vista_atmospheric_depth'
  ),
  FAEBOT_ENCHANTED_VISTA_WEATHER: loadIfExists('faebot_enchanted_vista_weather'),
  FAEBOT_ENCHANTED_VISTA_FOREGROUND_ANCHOR: loadIfExists(
    'faebot_enchanted_vista_foreground_anchor'
  ),
  FAEBOT_ENCHANTED_VISTA_WILDLIFE_DISTANT: loadIfExists('faebot_enchanted_vista_wildlife_distant'),
  // ─── queen-of-the-forest axis-system pools (2026-05-21, pivot from fairy-court) ───
  FAEBOT_QUEEN_OF_FOREST_FEATURES: loadIfExists('faebot_queen_of_forest_features'),
  FAEBOT_QUEEN_OF_FOREST_POSED_SETTING: loadIfExists('faebot_queen_of_forest_posed_setting'),
  FAEBOT_QUEEN_OF_FOREST_BIOME: loadIfExists('faebot_queen_of_forest_biome'),
  FAEBOT_QUEEN_OF_FOREST_REGALIA: loadIfExists('faebot_queen_of_forest_regalia'),
  FAEBOT_QUEEN_OF_FOREST_CRITTERS: loadIfExists('faebot_queen_of_forest_critters'),
  FAEBOT_QUEEN_OF_FOREST_LIGHTING: loadIfExists('faebot_queen_of_forest_lighting'),
  FAEBOT_QUEEN_OF_FOREST_WEATHER: loadIfExists('faebot_queen_of_forest_weather'),
  FAEBOT_QUEEN_OF_FOREST_MAGICAL_FLAVOR: loadIfExists('faebot_queen_of_forest_magical_flavor'),
  FAEBOT_QUEEN_OF_FOREST_AMBIENT_DETAIL: loadIfExists('faebot_queen_of_forest_ambient_detail'),
  FAEBOT_QUEEN_OF_FOREST_FOREGROUND_ANCHOR: loadIfExists(
    'faebot_queen_of_forest_foreground_anchor'
  ),
  FAEBOT_QUEEN_OF_FOREST_LESSER_FAE: loadIfExists('faebot_queen_of_forest_lesser_fae'),
  VIBE_COLOR,
};
