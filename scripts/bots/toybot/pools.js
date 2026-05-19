/**
 * ToyBot — axis pools. All Sonnet-seeded.
 * Regenerate: node scripts/gen-seeds/toybot/gen-<name>.js
 *
 * Naming convention — pools are keyed by PATH name (post-2026-05 scene-oriented
 * rename). Each path has its own SCENES + LANDSCAPES pool, except where noted.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Distinct palette per vibe — deliberately NOT warm-and-cool variants.
// Every vibe should push Flux to a DIFFERENT corner of the color spectrum.
const VIBE_COLOR = {
  cinematic: 'high-contrast noir palette, hard black shadows, single white key light, no color cast',
  cozy: 'overall-warm monochrome scene, all cream-and-honey tones, NO cool fill, flat even glow',
  epic: 'hard white high-noon daylight, short sharp shadows, washed-clean saturation',
  nostalgic: 'faded-Polaroid color grade, yellowed-paper tint, green-shifted shadows, no blue',
  peaceful: 'overcast-soft flat daylight, pale-grey sky, zero shadow contrast, muted desaturation',
  whimsical: 'primary-color saturation pop (red / yellow / blue on white set), flat catalog lighting, NO chiaroscuro',
  ethereal: 'all-white high-key floating light, milk-fog atmosphere, everything dissolves into pale',
  arcane: 'monochrome deep-violet ONLY palette, NO warm tones anywhere, purple-on-purple, crystal-glow rim',
  ancient: 'sepia-monochrome faded-desert palette, bronze-and-dust, no blue channel, sun-bleached',
  enchanted: 'bioluminescent cyan-green glow on all surfaces, NO warm counter-light, aquarium-feel',
  coquette: 'pastel-pink monochrome — rose / bubblegum / cream ONLY, NO orange NO blue, soft-box flat',
  voltage: 'electric-magenta-and-cyan neon-only palette, pitch-black negative space, NO warm highlights',
  nightshade: 'deep-indigo nocturnal monochrome, silver moon-rim, ultraviolet accents, NO warm glow',
  shimmer: 'iridescent pearl-holographic palette, shifting rainbow-oil-slick sheen, hard white key',
  surreal: 'clashing impossible color pairings (e.g. lime-green sky + hot-pink ground + purple shadows), saturated-flat',
};

module.exports = {
  // ─── existing paths (unchanged) ─────────────────────────────────────
  CLAYMATION_SCENES: load('claymation_scenes'),
  CLAYMATION_LANDSCAPES: load('claymation_landscapes'),
  VINYL_DIORAMAS: load('vinyl_dioramas'),
  VINYL_LANDSCAPES: load('vinyl_landscapes'),
  SACKBOY_SCENES: load('sackboy_scenes'),
  SACKBOY_LANDSCAPES: load('sackboy_landscapes'),
  TOY_LANDSCAPES: load('toy_landscapes'),
  SHORTCAKE_SCENES: load('shortcake_scenes'),
  SHORTCAKE_LANDSCAPES: load('shortcake_landscapes'),
  BARBIE_SCENES: load('barbie_scenes'),
  BARBIE_LANDSCAPES: load('barbie_landscapes'),

  // ─── renamed (2026-05) — content preserved, scene-oriented names ────
  GI_JOE_MISSIONS_SCENES: load('gi_joe_missions_scenes'),
  GI_JOE_MISSIONS_LANDSCAPES: load('gi_joe_missions_landscapes'),
  GREEN_ARMY_WARZONE_SCENES: load('green_army_warzone_scenes'),
  GREEN_ARMY_WARZONE_LANDSCAPES: load('green_army_warzone_landscapes'),
  MINIATURE_DUNGEON_SCENES: load('miniature_dungeon_scenes'),
  MINIATURE_DUNGEON_LANDSCAPES: load('miniature_dungeon_landscapes'),
  COLLECTOR_SHELF_SCENES: load('collector_shelf_scenes'),
  COLLECTOR_SHELF_LANDSCAPES: load('collector_shelf_landscapes'),
  EPIC_HERO_BUCKET_SCENES: load('epic_hero_bucket_scenes'),
  EPIC_HERO_BUCKET_LANDSCAPES: load('epic_hero_bucket_landscapes'),

  // ─── rebrand (2026-05) — calico → broader dollhouse-life ────────────
  DOLLHOUSE_LIFE_SCENES: load('dollhouse_life_scenes'),
  DOLLHOUSE_LIFE_LANDSCAPES: load('dollhouse_life_landscapes'),

  // ─── new (2026-05) ──────────────────────────────────────────────────
  HOTWHEELS_SCENES: load('hotwheels_scenes'),
  HOTWHEELS_LANDSCAPES: load('hotwheels_landscapes'),
  MODEL_TRAIN_SCENES: load('model_train_scenes'),
  MODEL_TRAIN_LANDSCAPES: load('model_train_landscapes'),
  PLUSH_SCENES: load('plush_scenes'),
  PLUSH_LANDSCAPES: load('plush_landscapes'),
  MECH_TOY_SCENES: load('mech_toy_scenes'),
  MECH_TOY_LANDSCAPES: load('mech_toy_landscapes'),
  TOYBOX_CHAOS_SCENES: load('toybox_chaos_scenes'), // legacy — kept for backref, no longer wired
  TOYBOT_TOYBOX_STORYTELLING_SCENES: load('toybox_storytelling'),
  SPACE_SAGA_SCENES: load('space_saga_scenes'),
  SPACE_SAGA_LANDSCAPES: load('space_saga_landscapes'),
  SPACE_SAGA_FIGURES: load('space_saga_figures'),
  SPACE_SAGA_LIGHTING: load('space_saga_lighting'),

  // ─── slot-pool DNA — rolled per render to force per-render variety ─
  // (anti-bias: defeats Sonnet's training-default toward teddy-bear /
  // muscle-car / humanoid-mecha / steam-engine repetition)
  PLUSH_CREATURES: load('plush_creatures'),
  HOTWHEELS_CARS: load('hotwheels_cars'),
  MECH_ARCHETYPES: load('mech_archetypes'),
  TRAIN_CONSISTS: load('train_consists'),
  TRAIN_WEATHER: load('train_weather'),
  MECH_LIGHTING: load('mech_lighting'),
  PLUSH_LIGHTING: load('plush_lighting'),
  HOTWHEELS_LIGHTING: load('hotwheels_lighting'),
  DOLLHOUSE_LIGHTING: load('dollhouse_lighting'),

  // ─── shared ────────────────────────────────────────────────────────
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),
  CAMERA_ANGLES: load('camera_angles'),
  STAGING_AXIS: load('staging_axis'),
  CAMERA_FRAMING: load('camera_framing'),
  TOY_SCENARIOS: load('toy_scenarios'),
  ARMY_SCENARIOS: load('army_scenarios'),
  HOTWHEELS_SCENARIOS: load('hotwheels_scenarios'),
  VINYL_FUNKO_CAST: load('vinyl_funko_cast'),
  FINAL_BOSSES: load('final_bosses'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    figure: {
      smell: load('sensory_figure_smell'),
      sound: load('sensory_figure_sound'),
      touch: load('sensory_figure_touch'),
      temperature: load('sensory_figure_temperature'),
      weight: load('sensory_figure_weight'),
      air: load('sensory_figure_air'),
      lightcolor: load('sensory_figure_lightcolor'),
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
  // ─── model-train-world (R0 axis-system migration, 2026-05-17) ───
    // Top-level pool refs for the declarative composer. Reuses existing
    // seed JSONs; renamed with TOYBOT_ prefix for archetype slot resolution.
    TOYBOT_MODEL_TRAIN_SCENE: load('toybot_model_train_scene'),
    TOYBOT_TRAIN_CONSISTS: load('train_consists'),
    TOYBOT_TRAIN_WEATHER: load('train_weather'),
    // Drama-moment pool: fires in diorama mode. The "what's happening?"
    // beat. 50 seeds at v1.
    TOYBOT_TRAIN_DRAMA_MOMENT: load('train_drama_moments'),
    // Unusual-cargo pool: conditional-layer (~35% of renders). Surprise
    // cargo wow-factor. 50 seeds at v1.
    TOYBOT_TRAIN_UNUSUAL_CARGO: load('train_unusual_cargo'),
    // Real-world settings: toy train running through ACTUAL real
    // environments (kitchen table, sandbox, sleeping cat, forest moss).
    // Fires in world-mode ~65% of the time. The "scale-tension wow."
    TOYBOT_TRAIN_WORLD_REAL: load('train_world_real'),
    // Cinematic themed worlds: train as hero in genre-coded settings
    // (Western / fantasy / sci-fi / cyberpunk / Polar Express / etc.).
    // Fires in world-mode ~35% of the time. Movie-still vibe.
    TOYBOT_TRAIN_WORLD_THEMED: load('train_world_themed'),
    TOYBOT_CAMERA_ANGLES: load('camera_angles'),
    TOYBOT_TOY_SCENARIOS: load('toy_scenarios'),
    TOYBOT_STAGING_AXIS: load('staging_axis'),
};
