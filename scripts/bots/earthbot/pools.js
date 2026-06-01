/**
 * EarthBot — flat top-level pools registry for axis-system paths.
 *
 * As each path migrates from legacy function-form to the declarative
 * composer, its bespoke pools register here. Legacy paths continue
 * loading from earth/pools.js or beach/pools.js until they migrate.
 *
 * When the last legacy path migrates, earth/ and beach/ disappear.
 *
 * Load via bot.poolByName(name) — wired in index.js.
 */
const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

module.exports = {
  // epic-vista (2026-05-20 axis-system migration — first migrated path)
  EPIC_VISTA_SUBJECT: load('epic_vista_subject'),
  EPIC_VISTA_LIGHTING: load('epic_vista_lighting'),
  EPIC_VISTA_ATMOSPHERE: load('epic_vista_atmosphere'),
  EPIC_VISTA_HERO_FEATURE: load('epic_vista_hero_feature'),
  EPIC_VISTA_SKY: load('epic_vista_sky'),
  EPIC_VISTA_PHENOMENON: load('epic_vista_phenomenon'),
  // R1 (2026-05-20) — adds 3-tier depth via near-frame compositional anchor.
  EPIC_VISTA_FOREGROUND_ANCHOR: load('epic_vista_foreground_anchor'),
  // national-parks (2026-05-20 axis-system migration). Subject pool ONLY is
  // bespoke (path-specific US National Park scenes). Other 5 axes reuse
  // epic-vista pools — axis-clean discipline means they serve any real-Earth
  // landscape path uniformly.
  NATIONAL_PARKS_SUBJECT: load('national_parks_subject'),
  // deep-forest (2026-05-20 axis-system migration). Bespoke subject pool
  // ONLY — reuses epic-vista's lighting/atmosphere/hero_feature/sky/phenomenon.
  DEEP_FOREST_SUBJECT: load('deep_forest_subject'),
  // lush-jungle (2026-05-20). Same clone pattern — bespoke subject only.
  LUSH_JUNGLE_SUBJECT: load('lush_jungle_subject'),
  // coastal-vista (2026-05-20) — FIRST BEACH-SIDE path migrated. Validates
  // canonical landscape template clones cross-namespace.
  COASTAL_VISTA_SUBJECT: load('coastal_vista_subject'),
  // tropical-paradise (2026-05-20) — PARADISE coast sibling to coastal-vista.
  // Palm-fringed lagoons / atolls / white-sand crescents.
  TROPICAL_PARADISE_SUBJECT: load('tropical_paradise_subject'),
  // epic-sunset (2026-05-20) — SUNSET-AS-SUBJECT. Sky is the show, geology
  // silhouette/anchor only.
  EPIC_SUNSET_SUBJECT: load('epic_sunset_subject'),
  // hawaii-flowers (2026-05-21) — Hawaiian/tropical coast + tropical flowers
  // as visible co-star. Multi-time-of-day variety (not all sunset).
  // R3 architecture: subject is BEACH-ONLY (ground-level POV), flowers are
  // a separate axis reusing the legacy 200-entry tropical_flower_arrangements
  // pool copied from beach/seeds/.
  HAWAII_FLOWERS_SUBJECT: load('hawaii_flowers_subject'),
  HAWAII_FLOWERS_ARRANGEMENTS: load('hawaii_flowers_arrangements'),
  // reef-paradise (2026-05-21 R2 PIVOT) — name kept but content retargeted.
  // PIVOTED away from underwater-coral identity to pretty ISLAND-BAY /
  // half-and-half waterline view (Kevin hearted that aesthetic). 6 axes:
  // 5 always-on (bay_setting, shoreline_drama, water_quality, sky_drama,
  // composition) + 1 conditional 30%-gated foreground_element.
  // GENERIC MORPHOLOGICAL DESCRIPTIONS ONLY (no named places — LESSON 7).
  REEF_PARADISE_BAY_SETTING: load('reef_paradise_bay_setting'),
  REEF_PARADISE_SHORELINE_DRAMA: load('reef_paradise_shoreline_drama'),
  REEF_PARADISE_WATER_QUALITY: load('reef_paradise_water_quality'),
  REEF_PARADISE_SKY_DRAMA: load('reef_paradise_sky_drama'),
  REEF_PARADISE_COMPOSITION: load('reef_paradise_composition'),
  REEF_PARADISE_FOREGROUND_ELEMENT: load('reef_paradise_foreground_element'),
  // geological-wonder (2026-05-21) — 6-axis path covering BOTH intimate
  // cave interiors AND epic outdoor vistas. All pools bespoke. 5 always-on
  // (subject + lighting + atmosphere + mineral_color + focal_anchor) +
  // 1 conditional 30%-gated phenomenon.
  GEOLOGICAL_WONDER_SUBJECT: load('geological_wonder_subject'),
  GEOLOGICAL_WONDER_LIGHTING: load('geological_wonder_lighting'),
  GEOLOGICAL_WONDER_ATMOSPHERE: load('geological_wonder_atmosphere'),
  GEOLOGICAL_WONDER_MINERAL_COLOR: load('geological_wonder_mineral_color'),
  GEOLOGICAL_WONDER_FOCAL_ANCHOR: load('geological_wonder_focal_anchor'),
  GEOLOGICAL_WONDER_PHENOMENON: load('geological_wonder_phenomenon'),
  // sacred-light (2026-05-21) — 6-axis path. Bespoke: subject + lighting
  // (light-as-hero register). Reuses EPIC_VISTA pools for atmosphere /
  // hero_feature / sky_layer / phenomenon.
  SACRED_LIGHT_SUBJECT: load('sacred_light_subject'),
  SACRED_LIGHT_LIGHTING: load('sacred_light_lighting'),
  // beach-night (2026-05-21) — 6-axis path. Natural night light only
  // (moon / stars / Milky Way), no human-built lights, no bioluminescent.
  BEACH_NIGHT_SUBJECT: load('beach_night_subject'),
  BEACH_NIGHT_LIGHT_SOURCE: load('beach_night_light_source'),
  BEACH_NIGHT_SKY: load('beach_night_sky'),
  BEACH_NIGHT_WATER_STATE: load('beach_night_water_state'),
  BEACH_NIGHT_SHORELINE_ELEMENT: load('beach_night_shoreline_element'),
  BEACH_NIGHT_PHENOMENON: load('beach_night_phenomenon'),
  // waves (2026-05-22) — MERGE of legacy wave + big-wave. Clark-Little
  // intimate-barrel + monumental big-wave registers in single subject pool.
  WAVES_SUBJECT: load('waves_subject'),
  WAVES_COMPOSITION: load('waves_composition'),
  WAVES_COASTAL_CONTEXT: load('waves_coastal_context'),
  WAVES_WATER_COLOR: load('waves_water_color'),
  WAVES_SKY_LAYER: load('waves_sky_layer'),
  WAVES_LIGHT_CONDITION: load('waves_light_condition'),
  WAVES_PHENOMENON: load('waves_phenomenon'),
  // seasonal-shift (2026-05-22 R2 → R11 — rich multi-axis decomposition).
  // 9 axes — 6 bespoke season-tagged (subject + color_palette + depth_layers +
  // seasonal_motion + hero_feature + phenomenon) + 3 reused EPIC_VISTA pools
  // for season-agnostic physics (lighting + atmosphere + sky_layer).
  // Subject sets the season tag, downstream season-tagged axes filter via
  // matchTagsFromSlot=subject — prevents cross-season bleed (e.g. autumn
  // hawk on spring scene). Built 2026-05-22 R11 after spring-prompt rendered
  // autumn-colored trees due to season-agnostic hero+phenomenon bleed.
  SEASONAL_SHIFT_SUBJECT: load('seasonal_shift_subject'),
  SEASONAL_SHIFT_COLOR_PALETTE: load('seasonal_shift_color_palette'),
  SEASONAL_SHIFT_DEPTH_LAYERS: load('seasonal_shift_depth_layers'),
  SEASONAL_SHIFT_SEASONAL_MOTION: load('seasonal_shift_seasonal_motion'),
  SEASONAL_SHIFT_HERO_FEATURE: load('seasonal_shift_hero_feature'),
  SEASONAL_SHIFT_PHENOMENON: load('seasonal_shift_phenomenon'),
  // hidden-corner (2026-05-22). Off-the-beaten-path intimate nature pockets.
  // 7 axes + 1 conditional 25%-gated phenomenon. All bespoke — intimate
  // scale and supernatural-drift hard-ban require different content than
  // any other EarthBot path. NO biome tagging (v1 — could add later).
  HIDDEN_CORNER_SUBJECT: load('hidden_corner_subject'),
  HIDDEN_CORNER_FOREGROUND_ANCHOR: load('hidden_corner_foreground_anchor'),
  HIDDEN_CORNER_WATER_FEATURE: load('hidden_corner_water_feature'),
  HIDDEN_CORNER_MICRO_DETAIL: load('hidden_corner_micro_detail'),
  HIDDEN_CORNER_SCALE_PROVER: load('hidden_corner_scale_prover'),
  HIDDEN_CORNER_LIGHTING: load('hidden_corner_lighting'),
  HIDDEN_CORNER_ATMOSPHERE: load('hidden_corner_atmosphere'),
  HIDDEN_CORNER_PHENOMENON: load('hidden_corner_phenomenon'),
  // ═══════════════════════════════════════════════════════════════════════
  // 7 region-bespoke EarthBot paths (2026-05-23 scaffolding).
  // Pools loaded from empty stub JSONs ([]) until each path is built out
  // via gen-earthbot-pool.js. Paths NOT in EARTH_PATHS rotation until pools
  // populated + R0 validated.
  // ═══════════════════════════════════════════════════════════════════════
  DESERT_SOUTHWEST_SUBJECT: load('desert_southwest_subject'),
  DESERT_SOUTHWEST_FOREGROUND_ANCHOR: load('desert_southwest_foreground_anchor'),
  DESERT_SOUTHWEST_SURPRISE_ELEMENT: load('desert_southwest_surprise_element'),
  DESERT_SOUTHWEST_LIGHT_CONDITION: load('desert_southwest_light_condition'),
  DESERT_SOUTHWEST_ATMOSPHERE: load('desert_southwest_atmosphere'),
  DESERT_SOUTHWEST_SKY_LAYER: load('desert_southwest_sky_layer'),
  DESERT_SOUTHWEST_SCALE_PROVER: load('desert_southwest_scale_prover'),
  DESERT_SOUTHWEST_PHENOMENON: load('desert_southwest_phenomenon'),
  AFRICAN_LANDSCAPE_SUBJECT: load('african_landscape_subject'),
  AFRICAN_LANDSCAPE_FOREGROUND_ANCHOR: load('african_landscape_foreground_anchor'),
  AFRICAN_LANDSCAPE_LIGHT_CONDITION: load('african_landscape_light_condition'),
  AFRICAN_LANDSCAPE_ATMOSPHERE: load('african_landscape_atmosphere'),
  AFRICAN_LANDSCAPE_SKY_LAYER: load('african_landscape_sky_layer'),
  AFRICAN_LANDSCAPE_SCALE_PROVER: load('african_landscape_scale_prover'),
  AFRICAN_LANDSCAPE_PHENOMENON: load('african_landscape_phenomenon'),
  ASIA_LANDSCAPE_SUBJECT: load('asia_landscape_subject'),
  ASIA_LANDSCAPE_FOREGROUND_ANCHOR: load('asia_landscape_foreground_anchor'),
  ASIA_LANDSCAPE_LIGHT_CONDITION: load('asia_landscape_light_condition'),
  ASIA_LANDSCAPE_ATMOSPHERE: load('asia_landscape_atmosphere'),
  ASIA_LANDSCAPE_SKY_LAYER: load('asia_landscape_sky_layer'),
  ASIA_LANDSCAPE_SCALE_PROVER: load('asia_landscape_scale_prover'),
  ASIA_LANDSCAPE_PHENOMENON: load('asia_landscape_phenomenon'),
  ANDES_PATAGONIA_SUBJECT: load('andes_patagonia_subject'),
  ANDES_PATAGONIA_FOREGROUND_ANCHOR: load('andes_patagonia_foreground_anchor'),
  ANDES_PATAGONIA_LIGHT_CONDITION: load('andes_patagonia_light_condition'),
  ANDES_PATAGONIA_ATMOSPHERE: load('andes_patagonia_atmosphere'),
  ANDES_PATAGONIA_SKY_LAYER: load('andes_patagonia_sky_layer'),
  ANDES_PATAGONIA_SCALE_PROVER: load('andes_patagonia_scale_prover'),
  ANDES_PATAGONIA_PHENOMENON: load('andes_patagonia_phenomenon'),
  AUSTRALIAN_OUTBACK_SUBJECT: load('australian_outback_subject'),
  AUSTRALIAN_OUTBACK_FOREGROUND_ANCHOR: load('australian_outback_foreground_anchor'),
  AUSTRALIAN_OUTBACK_LIGHT_CONDITION: load('australian_outback_light_condition'),
  AUSTRALIAN_OUTBACK_ATMOSPHERE: load('australian_outback_atmosphere'),
  AUSTRALIAN_OUTBACK_SKY_LAYER: load('australian_outback_sky_layer'),
  AUSTRALIAN_OUTBACK_SCALE_PROVER: load('australian_outback_scale_prover'),
  AUSTRALIAN_OUTBACK_PHENOMENON: load('australian_outback_phenomenon'),
  ICELAND_RAW_SUBJECT: load('iceland_raw_subject'),
  ICELAND_RAW_FOREGROUND_ANCHOR: load('iceland_raw_foreground_anchor'),
  ICELAND_RAW_LIGHT_CONDITION: load('iceland_raw_light_condition'),
  ICELAND_RAW_ATMOSPHERE: load('iceland_raw_atmosphere'),
  ICELAND_RAW_SKY_LAYER: load('iceland_raw_sky_layer'),
  ICELAND_RAW_SCALE_PROVER: load('iceland_raw_scale_prover'),
  ICELAND_RAW_PHENOMENON: load('iceland_raw_phenomenon'),
  EUROPEAN_WILDERNESS_SUBJECT: load('european_wilderness_subject'),
  EUROPEAN_WILDERNESS_FOREGROUND_ANCHOR: load('european_wilderness_foreground_anchor'),
  EUROPEAN_WILDERNESS_LIGHT_CONDITION: load('european_wilderness_light_condition'),
  EUROPEAN_WILDERNESS_ATMOSPHERE: load('european_wilderness_atmosphere'),
  EUROPEAN_WILDERNESS_SKY_LAYER: load('european_wilderness_sky_layer'),
  EUROPEAN_WILDERNESS_SCALE_PROVER: load('european_wilderness_scale_prover'),
  EUROPEAN_WILDERNESS_PHENOMENON: load('european_wilderness_phenomenon'),
  // cozy-beach (2026-05-22 v2 PIVOT) — intimate cozy beach moments.
  // Pivoted from village/architecture identity to atmosphere-as-hero
  // intimate-beach with golden-hour mood + cozy foreground elements.
  COZY_BEACH_SUBJECT_SETTING: load('cozy_beach_subject_setting'),
  COZY_BEACH_FOREGROUND_ELEMENT: load('cozy_beach_foreground_element'),
  COZY_BEACH_WATER_STATE: load('cozy_beach_water_state'),
  COZY_BEACH_SKY_LAYER: load('cozy_beach_sky_layer'),
  COZY_BEACH_LIGHT_CONDITION: load('cozy_beach_light_condition'),
  COZY_BEACH_PHENOMENON: load('cozy_beach_phenomenon'),
};
