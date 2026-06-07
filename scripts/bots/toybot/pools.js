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
  cinematic:
    'high-contrast noir palette, hard black shadows, single white key light, no color cast',
  cozy: 'overall-warm monochrome scene, all cream-and-honey tones, NO cool fill, flat even glow',
  epic: 'hard white high-noon daylight, short sharp shadows, washed-clean saturation',
  nostalgic: 'faded-Polaroid color grade, yellowed-paper tint, green-shifted shadows, no blue',
  peaceful: 'overcast-soft flat daylight, pale-grey sky, zero shadow contrast, muted desaturation',
  whimsical:
    'primary-color saturation pop (red / yellow / blue on white set), flat catalog lighting, NO chiaroscuro',
  ethereal:
    'all-white high-key floating light, milk-fog atmosphere, everything dissolves into pale',
  arcane:
    'monochrome deep-violet ONLY palette, NO warm tones anywhere, purple-on-purple, crystal-glow rim',
  ancient: 'sepia-monochrome faded-desert palette, bronze-and-dust, no blue channel, sun-bleached',
  enchanted: 'bioluminescent cyan-green glow on all surfaces, NO warm counter-light, aquarium-feel',
  coquette:
    'pastel-pink monochrome — rose / bubblegum / cream ONLY, NO orange NO blue, soft-box flat',
  voltage:
    'electric-magenta-and-cyan neon-only palette, pitch-black negative space, NO warm highlights',
  nightshade:
    'deep-indigo nocturnal monochrome, silver moon-rim, ultraviolet accents, NO warm glow',
  shimmer: 'iridescent pearl-holographic palette, shifting rainbow-oil-slick sheen, hard white key',
  surreal:
    'clashing impossible color pairings (e.g. lime-green sky + hot-pink ground + purple shadows), saturated-flat',
};

module.exports = {
  // ─── existing paths (unchanged) ─────────────────────────────────────
  CLAYMATION_SCENES: load('claymation_scenes'),
  CLAYMATION_LANDSCAPES: load('claymation_landscapes'),
  VINYL_DIORAMAS: load('vinyl_dioramas'),
  VINYL_LANDSCAPES: load('vinyl_landscapes'),
  SACKBOY_SCENES: load('sackboy_scenes'),
  SACKBOY_LANDSCAPES: load('sackboy_landscapes'),
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
  // miniature-scene (2026-05-25) — "off-diorama" register: painted-miniature
  // material truth but composed as an IMMERSIVE in-world fantasy scene (figures
  // living in a real location that fills + recedes), NOT a figure mounted on a
  // base / tabletop diorama display. Pool deliberately omits base/flocking/
  // tabletop/terrain-kit vocabulary so Flux doesn't render a display object.
  MINIATURE_SCENE_LOCATIONS: load('miniature_scene_locations'),
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
  TOYBOT_TOYBOX_STORYTELLING_SCENES: load('toybox_storytelling'), // legacy 6-slot — superseded by bucket
  TOYBOT_TOYBOX_STORYTELLING_CAMERAS: load('toybox_storytelling_cameras'),

  // toybox-chaos bucket refactor (2026-05-24) — de-branded toy archetypes,
  // pickN-composited into one interacting chaos vignette. TOYBOX_TOY_BUCKET is
  // a SHARED asset (collector-shelf / epic-hero-bucket / dino surprise can reuse it).
  TOYBOX_TOY_BUCKET: load('toybox_toy_bucket'),
  TOYBOX_SURFACE: load('toybox_surface'),
  TOYBOX_SCENARIO: load('toybox_scenario'),
  TOYBOX_SURPRISE: load('toybox_surprise'),

  // toy-blockbuster (2026-05-25) — movie-poster epic scenes in one rolled toy
  // universe. Universe-agnostic scenarios (any toy line in any epic scene).
  BLOCKBUSTER_SCENARIO: load('blockbuster_scenario'),
  BLOCKBUSTER_CENTERPIECE: load('blockbuster_centerpiece'),
  BLOCKBUSTER_SETTING: load('blockbuster_setting'),
  BLOCKBUSTER_CAMERA: load('blockbuster_camera'),
  TOYBOT_PLUSH_STORYTELLING_SCENES: load('plush_storytelling'),
  TOYBOT_PLUSH_STORYTELLING_CAMERAS: load('plush_storytelling_cameras'),
  TOYBOT_BARBIE_STORYTELLING_SCENES: load('barbie_storytelling'),
  TOYBOT_BARBIE_STORYTELLING_CAMERAS: load('barbie_storytelling_cameras'),
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
  // 2026-06-06: re-merged into a single ARMY_SCENARIOS pool (425 entries) after
  // a brief detour into bespoke per-path pools that didn't move the needle.
  // Shared by green-army-warzone + gi-joe-missions paths.
  ARMY_SCENARIOS: load('army_scenarios'),
  HOTWHEELS_SCENARIOS: load('hotwheels_scenarios'),
  // 2026-06-06 bespoke story-beat pools (MVP-25 each) — verb-led + shared-event
  CLAYMATION_STORY_BEATS: load('claymation_story_beats'),
  SHORTCAKE_STORY_BEATS: load('shortcake_story_beats'),
  MINIATURE_DUNGEON_STORY_BEATS: load('miniature_dungeon_story_beats'),
  MECH_STORY_BEATS: load('mech_story_beats'),
  SPACE_SAGA_STORY_BEATS: load('space_saga_story_beats'),
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

  // dino-diorama (2026-05-24) — real toy dinosaurs in a claymation prehistoric
  // world. DINO_TOY_CAST is SHARED with the future dino-mischief sister path.
  DINO_DIORAMA_CAMERA: load('dino_diorama_camera'),
  DINO_TOY_CAST: load('dino_toy_cast'),
  DINO_DIORAMA_SCENARIO: load('dino_diorama_scenario'),
  DINO_DIORAMA_BIOME: load('dino_diorama_biome'),
  DINO_DIORAMA_FLORA: load('dino_diorama_flora'),
  DINO_DIORAMA_ANCHOR: load('dino_diorama_anchor'),
  DINO_DIORAMA_CRAFT: load('dino_diorama_craft'),
  DINO_DIORAMA_CRITTERS: load('dino_diorama_critters'),
  DINO_DIORAMA_SURPRISE: load('dino_diorama_surprise'),

  // giant-toys (2026-05-24, boss-battle redesign) — a GIANT boss/enemy toy
  // fighting a band of SMALLER toys (cast_toys = SHARED TOYBOX_TOY_BUCKET) in a
  // real-world arena. Epic-cinematic, goofy, toys-only (no humans).
  GIANT_TOY_SUBJECT: load('giant_toy_subject'), // the giant boss/enemy toy
  GIANT_TOY_ENGAGEMENT: load('giant_toy_engagement'), // boss-vs-cast combat action
  GIANT_TOY_SETTING: load('giant_toy_setting'), // real-world battle arena
  GIANT_TOY_LIGHT: load('giant_toy_light'),
  GIANT_TOY_ATMOSPHERE: load('giant_toy_atmosphere'),
  GIANT_TOY_CAMERA: load('giant_toy_camera'),
  GIANT_TOY_TWIST: load('giant_toy_twist'), // 40%-gated goofy combat gag
};
