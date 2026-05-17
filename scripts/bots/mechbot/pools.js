/**
 * MechBot — axis pools. All Sonnet-seeded.
 * Migrated from StarBot 2026-05-05 (cyborg + robot paths split into their own bot).
 * Regenerate cyborg/robot pools: node scripts/gen-seeds/starbot/gen-<name>.js
 *   (gen scripts still live under starbot/ until copied over — the JSON they
 *   produce is identical regardless of which bot consumes it.)
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// ─────────────────────────────────────────────────────────────
// CYBORG SHARED POOLS
// ─────────────────────────────────────────────────────────────

const CYBORG_SKIN_TONES = load('cyborg_skin_tones');
const CYBORG_EYE_STYLES = load('cyborg_eye_styles');
const CYBORG_INTERNAL_EXPOSURE = load('cyborg_female_internal');
const CYBORG_MALE_INTERNAL_EXPOSURE = load('cyborg_male_internal');
const CYBORG_GLOW_COLORS = load('cyborg_glow_colors');

// ─────────────────────────────────────────────────────────────
// CYBORG-WOMAN POOLS
// ─────────────────────────────────────────────────────────────

const CYBORG_HAIR_STYLES = load('cyborg_female_hair');
const CYBORG_BODY_TYPES = load('cyborg_female_body_types');

// ─────────────────────────────────────────────────────────────
// CYBORG-MAN POOLS
// ─────────────────────────────────────────────────────────────

const CYBORG_MALE_BODY_TYPES = load('cyborg_male_body_types');
const CYBORG_MALE_HAIR_STYLES = load('cyborg_male_hair');
const CYBORG_MALE_SKIN_TONES = load('cyborg_male_skin_tones');
const CYBORG_MALE_FEATURES = load('cyborg_male_features');

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
  voltage: 'electric blue plasma, neon cyberpunk accents, stark contrast',
  nightshade: 'deep violet void with silver starfield, plum-shadow palette',
  macabre: 'inked blood-crimson cosmic-dread, dark-nebula palette',
  shimmer: 'shimmering starlight + iridescent cosmic-dust highlights',
  surreal: 'impossible cosmic color pairings, hallucinatory space shifts',
  minimal: 'spare monochromatic palette, single-color accent, clean negative space',
};

module.exports = {
  // Cyborg shared pools
  CYBORG_SKIN_TONES,
  CYBORG_EYE_STYLES,
  CYBORG_INTERNAL_EXPOSURE,
  CYBORG_GLOW_COLORS,
  CYBORG_FEATURES: load('cyborg_features'),
  CYBORG_CLOSEUP_FRAMINGS: load('cyborg_closeup_framings'),
  // Cyborg-woman pools
  CYBORG_HAIR_STYLES,
  CYBORG_BODY_TYPES,
  CYBORG_FEMALE_CHARACTERS: load('cyborg_female_characters'),
  CYBORG_ACTIONS: load('cyborg_actions'),
  // Cyborg-man pools
  CYBORG_MALE_HAIR_STYLES,
  CYBORG_MALE_BODY_TYPES,
  CYBORG_MALE_SKIN_TONES,
  CYBORG_MALE_FEATURES,
  CYBORG_MALE_INTERNAL_EXPOSURE,
  CYBORG_MALE_CHARACTERS: load('cyborg_male_characters'),
  CYBORG_MALE_ACTIONS: load('cyborg_male_actions'),
  // Robot pools (robot-moment path)
  ROBOT_TYPES: load('robot_types'),
  TRANQUIL_MOMENTS: load('tranquil_moments'),

  // Mecha-pilots path (migrated to declarative axis system 2026-05-16)
  MECHA_PILOT_SUBJECTS: load('mecha_pilot_subjects'),
  MECHA_PILOT_ACTIONS: load('mecha_pilot_actions'),
  MECHA_PILOT_SETTINGS: load('mecha_pilot_settings'),
  MECHA_PILOTS_COMPOSITION: load('mecha_pilots_composition'), // pilot+mech vertigo angles
  MECHA_PILOTS_LIGHTING: load('mecha_pilots_lighting'),
  MECHA_PILOTS_DRAMA: load('mecha_pilots_drama'), // 40% gated phenomenon
  // Titan-war-machines path (migrated to declarative axis system 2026-05-15)
  // Reuses legacy 200-entry subject/action/setting pools.
  // Adds 3 path-bespoke pools: lighting (ground-based combat), drama
  // (40%-gated combat phenomena), composition (vertigo angles).
  TITAN_WAR_SUBJECTS: load('titan_war_subjects'),
  TITAN_WAR_ACTIONS: load('titan_war_actions'),
  TITAN_WAR_SETTINGS: load('titan_war_settings'),
  TITAN_WAR_LIGHTING: load('titan_war_lighting'),
  TITAN_WAR_DRAMA: load('titan_war_drama'), // 40% gated combat phenomenon
  TITAN_WAR_COMPOSITION: load('titan_war_composition'), // vertigo angles
  // Power-armor-infantry path (migrated to declarative axis system 2026-05-16)
  // Subject + action pools regen'd with MEAN KILL-TEAM DNA recipe (legacy
  // was 11%+ procedural / Tom-Clancy SWAT realism — Kevin's diagnosis).
  // Reuses legacy 200-entry POWER_ARMOR_SETTINGS (already strong urban
  // rubble / war-torn / bunker DNA). Adds 3 path-bespoke pools.
  POWER_ARMOR_SUBJECTS: load('power_armor_subjects'),
  POWER_ARMOR_ACTIONS: load('power_armor_actions'),
  POWER_ARMOR_SETTINGS: load('power_armor_settings'),
  POWER_ARMOR_COMPOSITION: load('power_armor_composition'), // squad-combat vertigo angles
  POWER_ARMOR_LIGHTING: load('power_armor_lighting'), // battlefield combat
  POWER_ARMOR_ENGAGEMENT: load('power_armor_engagement'), // ALWAYS-ON multi-actor combat narrative
  POWER_ARMOR_ALLIED_TECH: load('power_armor_allied_tech'), // ALWAYS-ON friendly combat-bot/drone/walker
  POWER_ARMOR_DRAMA: load('power_armor_drama'), // 40% gated battlefield phenomenon
  // Industrial-machines path (kept on legacy 2026-05-16 — migration attempted +
  // reverted, legacy converts better; see memory project_industrial_machines_kept_legacy.md)
  INDUSTRIAL_SUBJECTS: load('industrial_subjects'),
  INDUSTRIAL_ACTIONS: load('industrial_actions'),
  INDUSTRIAL_SETTINGS: load('industrial_settings'),
  // Post-apoc-rust-tech path (migrated to declarative axis system 2026-05-16)
  // Reuses production-grade legacy subject/action pools (200/200) + 151
  // settings pool. Adds 3 path-bespoke pools for Mad Max chase composition,
  // wasteland lighting, 40%-gated wasteland phenomena.
  RUST_APOC_SUBJECTS: load('rust_apoc_subjects'),
  RUST_APOC_ACTIONS: load('rust_apoc_actions'),
  RUST_APOC_SETTINGS: load('rust_apoc_settings'),
  RUST_APOC_COMPOSITION: load('rust_apoc_composition'), // Mad Max chase angles
  RUST_APOC_LIGHTING: load('rust_apoc_lighting'), // Fury Road wasteland lighting
  RUST_APOC_DRAMA: load('rust_apoc_drama'), // 40% gated wasteland phenomenon
  // Humanoid-robots path (NEW 2026-05-17 — sister to robot-moment)
  HUMANOID_ROBOTS_SUBJECT: load('humanoid_robots_subject'),
  HUMANOID_ROBOTS_ACTION: load('humanoid_robots_action'),
  HUMANOID_ROBOTS_LANDSCAPE: load('humanoid_robots_landscape'),
  HUMANOID_ROBOTS_COMPOSITION: load('humanoid_robots_composition'),
  HUMANOID_ROBOTS_LIGHTING: load('humanoid_robots_lighting'),
  HUMANOID_ROBOTS_DRAMA: load('humanoid_robots_drama'), // 40% gated visual flourish
  // Cyborg-woman path (migrated to declarative axis system 2026-05-17)
  // Composition uses LEGACY pool (CYBORG_CLOSEUP_FRAMINGS) only. Camera-angles
  // 20% slot stripped 2026-05-17 — per Kevin's 8-image reference re-review,
  // the hearted references are 100% closeup / 3-quarter portrait, no full-body
  // in the set. The camera_angles slot was the source of recurring bikini /
  // full-body failure renders.
  CYBORG_WOMAN_COMPOSITION: load('cyborg_closeup_framings'),
  CYBORG_WOMAN_DRAMA: load('cyborg_woman_drama'), // 40% gated atmospheric flourish
  CYBORG_WOMAN_MATERIAL: load('cyborg_woman_material'), // 2026-05-17: dedicated material/finish axis for variety
  // Alien-biomechs path
  ALIEN_BIOMECH_SUBJECTS: load('alien_biomech_subjects'),
  ALIEN_BIOMECH_ACTIONS: load('alien_biomech_actions'),
  ALIEN_BIOMECH_SETTINGS: load('alien_biomech_settings'),
  // Mech-skyships path — flying sci-fi mech-vessels in epic skies
  // (migrated to declarative axis system 2026-05-15 — adds composition /
  // lighting / drama path-bespoke pools, reuses legacy subject/action/setting)
  MECH_SKYSHIPS_SUBJECTS: load('mech_skyships_subjects'),
  MECH_SKYSHIPS_ACTIONS: load('mech_skyships_actions'),
  MECH_SKYSHIPS_SETTINGS: load('mech_skyships_settings'),
  MECH_SKYSHIPS_LIGHTING: load('mech_skyships_lighting'),
  MECH_SKYSHIPS_COMPOSITION: load('mech_skyships_composition'), // sky vertigo angles
  MECH_SKYSHIPS_ENGAGEMENT: load('mech_skyships_engagement'), // ALWAYS-ON multi-actor combat scene
  MECH_SKYSHIPS_DRAMA: load('mech_skyships_drama'), // 40% gated sky-combat phenomenon

  // Settings — robot-moment uses CHARACTER_INTERIOR (50%) + PLANET_SETTING (50%)
  // for variety. Kept as merge pools matching StarBot's behavior so the path's
  // outputs are identical post-migration. The IP-flavored architecture pools
  // (dune/aliens/halo/etc.) provide texture variety without being recognizable
  // as IP at the prompt level.
  CHARACTER_INTERIOR: [
    ...load('dune_architecture'),
    ...load('aliens_architecture'),
    ...load('halo_architecture'),
    ...load('starwars_architecture'),
    ...load('guardians_architecture'),
    ...load('mass_effect_architecture'),
    ...load('startrek_architecture'),
    ...load('starcraft_architecture'),
  ],
  PLANET_SETTING: [
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

  // Shared infrastructure
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  CAMERA_ANGLES: load('camera_angles'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  // Sensory anchor pools — 4 contexts (cyborg-female / cyborg-male / robot / scene)
  // × 7 channels × 100 entries each. New paths (mecha-pilots, titan-war-machines,
  // power-armor-infantry, industrial-machines, post-apoc-rust-tech, alien-biomechs)
  // map to 'scene' for now — dedicated contexts can be added in a future pass.
  SENSORY_POOLS: {
    'cyborg-female': {
      smell: load('sensory_cyborg-female_smell'),
      sound: load('sensory_cyborg-female_sound'),
      touch: load('sensory_cyborg-female_touch'),
      temperature: load('sensory_cyborg-female_temperature'),
      weight: load('sensory_cyborg-female_weight'),
      air: load('sensory_cyborg-female_air'),
      lightcolor: load('sensory_cyborg-female_lightcolor'),
    },
    'cyborg-male': {
      smell: load('sensory_cyborg-male_smell'),
      sound: load('sensory_cyborg-male_sound'),
      touch: load('sensory_cyborg-male_touch'),
      temperature: load('sensory_cyborg-male_temperature'),
      weight: load('sensory_cyborg-male_weight'),
      air: load('sensory_cyborg-male_air'),
      lightcolor: load('sensory_cyborg-male_lightcolor'),
    },
    robot: {
      smell: load('sensory_robot_smell'),
      sound: load('sensory_robot_sound'),
      touch: load('sensory_robot_touch'),
      temperature: load('sensory_robot_temperature'),
      weight: load('sensory_robot_weight'),
      air: load('sensory_robot_air'),
      lightcolor: load('sensory_robot_lightcolor'),
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
