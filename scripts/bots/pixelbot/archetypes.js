/**
 * pixelbot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  PIXELBOT_PIXEL_HORROR: {
    description:
      'PATH-BESPOKE — PixelBot pixel-horror path (2026-05-20 axis-system migration). 16-BIT GOTHIC-ACTION GAMEPLAY SCREENSHOTS — Castlevania / Ghosts n Goblins / Demon Crest / Splatterhouse / Rondo of Blood / Bloodstained pixel. CLASSIC gothic monster-slaying (NOT psychological horror). Camera flexibility per setting (side-view / 3/4-iso / top-down). Single-hero monster-slayer (genre-correct). 4 mandatory elements (gothic setting + classic enemy + hero knight-sprite + gothic-flavor props). 3 path-bespoke pools + 40%-gated props.',
    slots: { universal: [], bot: [], path: ['gothic_setting', 'classic_enemy', 'hero_action'] },
    pickN: {},
    conditionalLayer: { slot: 'gothic_props', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_JRPG_COMBAT: {
    description:
      'PATH-BESPOKE — PixelBot jrpg-combat path (2026-05-20 axis-system migration). 16-BIT JRPG COMBAT GAMEPLAY SCREENSHOTS — Final Fantasy IV/V/VI / Chrono Trigger / Secret of Mana / Star Ocean / Tales of Phantasia / Lufia II. Top-down OR 3/4-iso camera. 5 mandatory elements (tile floor + party of 2-4 + monster + visible spell-effect + open-world setting). 3 path-bespoke pools + 40%-gated spell_effect.',
    slots: {
      universal: [],
      bot: [],
      path: ['open_world_setting', 'monster_enemy', 'party_engagement'],
    },
    pickN: {},
    conditionalLayer: { slot: 'spell_effect', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_BOSS_ARENA: {
    description:
      'PATH-BESPOKE — PixelBot boss-arena path (2026-05-20 axis-system migration). 16-BIT BOSS-BATTLE GAMEPLAY SCREENSHOTS — Chrono Trigger / FFVI / Secret of Mana / LttP / Diablo II / Hyper Light Drifter / Hades / Octopath. Camera flexibility (top-down OR 3/4-iso OR side-view per arena). 4 mandatory elements: arena floor + boss sprite + player sprite + arena walls. 3 path-bespoke pools + 40%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: ['arena_setting', 'boss_creature', 'player_engagement'],
    },
    pickN: {},
    conditionalLayer: { slot: 'arena_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_SIDE_SCROLLER_WORLD: {
    description:
      'PATH-BESPOKE — PixelBot side-scroller-world path (2026-05-20 axis-system migration). 16-BIT SIDE-SCROLLING PLATFORMER GAMEPLAY SCREENSHOTS — Castlevania IV / Super Metroid / Donkey Kong Country / Mega Man X / Owlboy / Hollow Knight pixel / Dead Cells / Ori / Celeste. HORIZONTAL SIDE-VIEW camera, 5 mandatory elements (horizontal frame + foreground platform + player-sprite + middle parallax + far backdrop). 3 path-bespoke pools + 40%-gated atmospheric_phenomenon.',
    slots: { universal: [], bot: [], path: ['biome_setting', 'platform_geography', 'hero_action'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_DUNGEON_DEPTH: {
    description:
      'PATH-BESPOKE — PixelBot dungeon-depth path (2026-05-20 axis-system migration). 16-BIT TOP-DOWN DUNGEON-CRAWLER GAMEPLAY SCREENSHOTS — Diablo I/II / Hades / Hyper Light Drifter / Children of Morta / Moonlighter / Heroes of Hammerwatch. Top-down or 3/4-iso camera, hero adventurer pixel-sprite + monster encounter mid-action + Diablo-style loot/props + visible tile-floor. 3 path-bespoke pools + 40%-gated loot_detail.',
    slots: { universal: [], bot: [], path: ['dungeon_chamber', 'dungeon_biome', 'hero_encounter'] },
    pickN: {},
    conditionalLayer: { slot: 'loot_detail', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_COZY_RPG_TOWN: {
    description:
      'PATH-BESPOKE — PixelBot cozy-rpg-town path (2026-05-20 axis-system migration). COZY PIXEL-RPG TOWN HUBS — Stardew Valley + Octopath Traveler HD-2D + Sea of Stars + Eastward + Children of Morta town hubs. Half-timbered houses, warm tavern light, market stalls, NPCs going about their day, cobblestone paths winding between shops. The town is INHABITED. 4 path-bespoke pools (town_locale / town_biome / npc_life / atmospheric_phenomenon-40%-gated). Reference migration for PixelBot axis-system transition.',
    slots: { universal: [], bot: [], path: ['town_locale', 'town_biome', 'npc_life'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_COZY_FARMING_LIFE_SIM: {
    description:
      'PATH-BESPOKE — PixelBot cozy-farming-life-sim (2026-05-20 axis-system migration). 16-BIT COZY LIFE-SIM SCREENSHOTS — Stardew Valley + Harvest Moon + Animal Crossing pixel-spin + My Time at Sandrock + Spiritfarer + Ooblets + Coffee Talk + Story of Seasons + Graveyard Keeper pixel. Solo farmer protagonist + ambient villager / animal NPCs populating the cozy world. NOT party-combat; life-sim ambient is genre-correct. 4 path-bespoke pools (farm_locale / farm_biome / farmer_villager_life / cozy_phenomenon-40%-gated).',
    slots: { universal: [], bot: [], path: ['farm_locale', 'farm_biome', 'farmer_villager_life'] },
    pickN: {},
    conditionalLayer: { slot: 'cozy_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_PIXEL_SCI_FI_ACTION: {
    description:
      'PATH-BESPOKE — PixelBot pixel-sci-fi-action (2026-05-20 axis-system migration). 16-BIT SCI-FI ACTION GAMEPLAY SCREENSHOTS — Contra III + Mega Man X + Super Metroid + Blaster Master + Turrican II + Gradius + R-Type + Salamander + Gunstar Heroes + Axelay + Cybernator + Star Fox pixel. Solo run-and-gun marine / mech-pilot / starfighter-pilot is genre-correct. Camera flexibility (side-view / horizontal-shooter / top-down / 3-quarter-iso) per setting. 4 mandatory elements (sci-fi setting + sci-fi enemy + hero sprite + sci-fi flavor props). 3 path-bespoke pools + 40%-gated props.',
    slots: { universal: [], bot: [], path: ['sci_fi_setting', 'sci_fi_enemy', 'hero_action'] },
    pickN: {},
    conditionalLayer: { slot: 'sci_fi_props', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_CLASSIC_JRPG: {
    description:
      'PATH-BESPOKE — PixelBot classic-jrpg (2026-05-20 axis-system migration). 16-BIT CLASSIC JRPG GAMEPLAY SCREENSHOTS — Zelda LttP + Final Fantasy IV/V/VI + Chrono Trigger + Secret of Mana + Terranigma + Earthbound + Lufia II + Dragon Quest VI + Breath of Fire + Lunar: Silver Star Story + Tales of Phantasia. 3/4 top-down camera locked (genre signature). Hero party (single or 2-4 members) walking the tile-map + NPC life / enemy creature + classic JRPG props. 3 path-bespoke pools + 40%-gated props.',
    slots: { universal: [], bot: [], path: ['jrpg_locale', 'party_action', 'npc_or_enemy_life'] },
    pickN: {},
    conditionalLayer: { slot: 'jrpg_props', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PIXELBOT_EPIC_VISTA: {
    description:
      'PATH-BESPOKE — PixelBot epic-vista (2026-05-20 axis-system migration). 16-BIT SIDE-SCROLLING PARALLAX-VISTA GAMEPLAY SCREENSHOTS — FF6 airship-flyover + Chrono Trigger world-map + Lufia II overworld + Secret of Mana world-vistas + Terranigma overworld + Castlevania IV background-vistas + Donkey Kong Country backgrounds + Sonic 2/3 horizons. SCENE-AS-HERO (no character), 4 parallax depth layers with HARD pixel-edges. Horizontal side-scrolling camera (reads left-to-right). 3 path-bespoke pools + 40%-gated parallax_silhouette.',
    slots: {
      universal: [],
      bot: [],
      path: ['vista_subject', 'sky_or_backdrop', 'lighting_atmosphere'],
    },
    pickN: {},
    conditionalLayer: { slot: 'parallax_silhouette', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
