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

function loadIfExists(name) {
  const p = path.join(__dirname, 'seeds', `${name}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
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
  JRPG_COMBAT_SCENES: load('jrpg_combat_scenes'),
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
  JRPG_COMBAT_LIGHTING: load('jrpg_combat_lighting'),
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
  JRPG_COMBAT_ATMOSPHERE: load('jrpg_combat_atmosphere'),
  PIXEL_HORROR_ATMOSPHERE: load('pixel_horror_atmosphere'),
  COZY_FARMING_ATMOSPHERE: load('cozy_farming_atmosphere'),
  PIXEL_SCI_FI_ACTION_ATMOSPHERE: load('pixel_sci_fi_action_atmosphere'),
  CLASSIC_JRPG_ATMOSPHERE: load('classic_jrpg_atmosphere'),
  EPIC_VISTA_ATMOSPHERE: load('epic_vista_atmosphere'),

  // ─── cozy-rpg-town axis-system pools (2026-05-20 reference migration) ───
  PIXELBOT_COZY_RPG_TOWN_LOCALE: loadIfExists('pixelbot_cozy_rpg_town_locale'),
  PIXELBOT_COZY_RPG_TOWN_BIOME: loadIfExists('pixelbot_cozy_rpg_town_biome'),
  PIXELBOT_COZY_RPG_TOWN_NPC_LIFE: loadIfExists('pixelbot_cozy_rpg_town_npc_life'),
  PIXELBOT_COZY_RPG_TOWN_ATMOSPHERIC_PHENOMENON: loadIfExists('pixelbot_cozy_rpg_town_atmospheric_phenomenon'),
  // ─── dungeon-depth axis-system pools (2026-05-20) ───
  PIXELBOT_DUNGEON_DEPTH_CHAMBER: loadIfExists('pixelbot_dungeon_depth_chamber'),
  PIXELBOT_DUNGEON_DEPTH_BIOME: loadIfExists('pixelbot_dungeon_depth_biome'),
  PIXELBOT_DUNGEON_DEPTH_HERO_ENCOUNTER: loadIfExists('pixelbot_dungeon_depth_hero_encounter'),
  PIXELBOT_DUNGEON_DEPTH_LOOT_DETAIL: loadIfExists('pixelbot_dungeon_depth_loot_detail'),
  // ─── side-scroller-world axis-system pools (2026-05-20) ───
  PIXELBOT_SIDE_SCROLLER_BIOME_SETTING: loadIfExists('pixelbot_side_scroller_biome_setting'),
  PIXELBOT_SIDE_SCROLLER_PLATFORM_GEOGRAPHY: loadIfExists('pixelbot_side_scroller_platform_geography'),
  PIXELBOT_SIDE_SCROLLER_HERO_ACTION: loadIfExists('pixelbot_side_scroller_hero_action'),
  PIXELBOT_SIDE_SCROLLER_ATMOSPHERIC_PHENOMENON: loadIfExists('pixelbot_side_scroller_atmospheric_phenomenon'),
  // ─── boss-arena axis-system pools (2026-05-20) ───
  PIXELBOT_BOSS_ARENA_SETTING: loadIfExists('pixelbot_boss_arena_setting'),
  PIXELBOT_BOSS_ARENA_BOSS_CREATURE: loadIfExists('pixelbot_boss_arena_boss_creature'),
  PIXELBOT_BOSS_ARENA_PLAYER_ENGAGEMENT: loadIfExists('pixelbot_boss_arena_player_engagement'),
  PIXELBOT_BOSS_ARENA_PHENOMENON: loadIfExists('pixelbot_boss_arena_phenomenon'),
  // ─── jrpg-combat axis-system pools (2026-05-20) ───
  PIXELBOT_JRPG_COMBAT_OPEN_WORLD_SETTING: loadIfExists('pixelbot_jrpg_combat_open_world_setting'),
  PIXELBOT_JRPG_COMBAT_MONSTER_ENEMY: loadIfExists('pixelbot_jrpg_combat_monster_enemy'),
  PIXELBOT_JRPG_COMBAT_PARTY_ENGAGEMENT: loadIfExists('pixelbot_jrpg_combat_party_engagement'),
  PIXELBOT_JRPG_COMBAT_SPELL_EFFECT: loadIfExists('pixelbot_jrpg_combat_spell_effect'),
  // ─── pixel-horror axis-system pools (2026-05-20) ───
  PIXELBOT_PIXEL_HORROR_GOTHIC_SETTING: loadIfExists('pixelbot_pixel_horror_gothic_setting'),
  PIXELBOT_PIXEL_HORROR_CLASSIC_ENEMY: loadIfExists('pixelbot_pixel_horror_classic_enemy'),
  PIXELBOT_PIXEL_HORROR_HERO_ACTION: loadIfExists('pixelbot_pixel_horror_hero_action'),
  PIXELBOT_PIXEL_HORROR_GOTHIC_PROPS: loadIfExists('pixelbot_pixel_horror_gothic_props'),
  // ─── cozy-farming-life-sim axis-system pools (2026-05-20) ───
  PIXELBOT_COZY_FARMING_FARM_LOCALE: loadIfExists('pixelbot_cozy_farming_farm_locale'),
  PIXELBOT_COZY_FARMING_FARM_BIOME: loadIfExists('pixelbot_cozy_farming_farm_biome'),
  PIXELBOT_COZY_FARMING_FARMER_VILLAGER_LIFE: loadIfExists('pixelbot_cozy_farming_farmer_villager_life'),
  PIXELBOT_COZY_FARMING_COZY_PHENOMENON: loadIfExists('pixelbot_cozy_farming_cozy_phenomenon'),

  // Shared across all paths (camera/grade)
  PIXEL_PERSPECTIVES: load('pixel_perspectives'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,

  SENSORY_POOLS: {
    figure: { smell: load('sensory_figure_smell'), sound: load('sensory_figure_sound'), touch: load('sensory_figure_touch'), temperature: load('sensory_figure_temperature'), weight: load('sensory_figure_weight'), air: load('sensory_figure_air'), lightcolor: load('sensory_figure_lightcolor') },
    scene: { smell: load('sensory_scene_smell'), sound: load('sensory_scene_sound'), touch: load('sensory_scene_touch'), temperature: load('sensory_scene_temperature'), weight: load('sensory_scene_weight'), air: load('sensory_scene_air'), lightcolor: load('sensory_scene_lightcolor') },
  },
};
