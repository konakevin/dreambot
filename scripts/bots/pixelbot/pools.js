/**
 * PixelBot — axis pools. 8 gaming-genre paths, each with its own
 * SCENE + LIGHTING + ATMOSPHERE pool. PERSPECTIVE / PALETTE / VIBE-COLOR
 * stay shared across paths (they're camera/grade decisions).
 *
 * Regenerate per-path pools: node scripts/gen-seeds/pixelbot/gen-<name>-<axis>.js
 * Regenerate shared pools:   node scripts/gen-seeds/pixelbot/gen-pixel-perspectives.js (etc.)
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

const VIBE_COLOR = {
  cinematic: 'teal-and-orange pixel grade, dramatic pixel shadows',
  dark: 'oil-black pixel palette, crimson-pixel accents',
  epic: 'dramatic pixel god-rays, rich pixel highlights',
  nostalgic: 'faded SNES-era palette, sepia-pixel',
  psychedelic: 'impossible pixel-color shifts, hallucinatory dithering',
  whimsical: 'buoyant pixel-pastel palette, warm pixel-cream',
  ethereal: 'pearl-white pixel mist, opalescent pixel haze',
  arcane: 'deep violet pixel magic glow, emerald pixel runes',
  enchanted: 'soft magical pixel glow, dreamy pixel sparkle',
  fierce: 'stark pixel crimson-and-obsidian, savage pixel strobe',
  coquette: 'rose-pixel pastel palette, pixel blush',
  voltage: 'electric-pixel blue arcs, neon pixel glow',
  nightshade: 'deep violet pixel moonlit, silver pixel shadows',
  macabre: 'inked pixel blood-and-black, dread pixel palette',
  shimmer: 'shimmering pixel gold particles, iridescent pixel glint',
  surreal: 'impossible pixel color pairings, hallucinatory pixel shifts',
};

module.exports = {
  // Per-path scene pools
  COZY_RPG_TOWN_SCENES: load('cozy_rpg_town_scenes'),
  DUNGEON_DEPTH_SCENES: load('dungeon_depth_scenes'),
  SIDE_SCROLLER_SCENES: load('side_scroller_scenes'),
  BOSS_ARENA_SCENES: load('boss_arena_scenes'),
  JRPG_DREAMSCAPE_SCENES: load('jrpg_dreamscape_scenes'),
  PIXEL_HORROR_SCENES: load('pixel_horror_scenes'),
  COZY_FARMING_SCENES: load('cozy_farming_scenes'),
  PIXEL_SCI_FI_ACTION_SCENES: load('pixel_sci_fi_action_scenes'),
  CLASSIC_JRPG_SCENES: load('classic_jrpg_scenes'),
  EPIC_VISTA_SCENES: load('epic_vista_scenes'),

  // Per-path lighting pools
  COZY_RPG_TOWN_LIGHTING: load('cozy_rpg_town_lighting'),
  DUNGEON_DEPTH_LIGHTING: load('dungeon_depth_lighting'),
  SIDE_SCROLLER_LIGHTING: load('side_scroller_lighting'),
  BOSS_ARENA_LIGHTING: load('boss_arena_lighting'),
  JRPG_DREAMSCAPE_LIGHTING: load('jrpg_dreamscape_lighting'),
  PIXEL_HORROR_LIGHTING: load('pixel_horror_lighting'),
  COZY_FARMING_LIGHTING: load('cozy_farming_lighting'),
  PIXEL_SCI_FI_ACTION_LIGHTING: load('pixel_sci_fi_action_lighting'),
  CLASSIC_JRPG_LIGHTING: load('classic_jrpg_lighting'),
  EPIC_VISTA_LIGHTING: load('epic_vista_lighting'),

  // Per-path atmosphere pools
  COZY_RPG_TOWN_ATMOSPHERE: load('cozy_rpg_town_atmosphere'),
  DUNGEON_DEPTH_ATMOSPHERE: load('dungeon_depth_atmosphere'),
  SIDE_SCROLLER_ATMOSPHERE: load('side_scroller_atmosphere'),
  BOSS_ARENA_ATMOSPHERE: load('boss_arena_atmosphere'),
  JRPG_DREAMSCAPE_ATMOSPHERE: load('jrpg_dreamscape_atmosphere'),
  PIXEL_HORROR_ATMOSPHERE: load('pixel_horror_atmosphere'),
  COZY_FARMING_ATMOSPHERE: load('cozy_farming_atmosphere'),
  PIXEL_SCI_FI_ACTION_ATMOSPHERE: load('pixel_sci_fi_action_atmosphere'),
  CLASSIC_JRPG_ATMOSPHERE: load('classic_jrpg_atmosphere'),
  EPIC_VISTA_ATMOSPHERE: load('epic_vista_atmosphere'),

  // Shared across all paths (camera/grade)
  PIXEL_PERSPECTIVES: load('pixel_perspectives'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    figure: { smell: load('sensory_figure_smell'), sound: load('sensory_figure_sound'), touch: load('sensory_figure_touch'), temperature: load('sensory_figure_temperature'), weight: load('sensory_figure_weight'), air: load('sensory_figure_air'), lightcolor: load('sensory_figure_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
