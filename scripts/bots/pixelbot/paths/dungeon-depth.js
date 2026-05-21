/**
 * PixelBot dungeon-depth path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT TOP-DOWN DUNGEON-CRAWLER GAMEPLAY SCREENSHOTS — Diablo I/II /
 * Hades chamber-reveals / Hyper Light Drifter / Children of Morta /
 * Death's Gambit / Moonlighter / Eitr / Heroes of Hammerwatch.
 *
 * Top-down or 3/4-iso camera (NEVER side-view). Hero adventurer
 * pixel-sprite + monster encounter mid-action + Diablo-style loot/props
 * + visible tile-floor.
 *
 * Axes (3 path-bespoke + 40%-gated loot):
 *   - dungeon_chamber (25): specific chamber type (treasure / altar /
 *     corridor / crypt / library / boss-antechamber / etc.)
 *   - dungeon_biome (25): visual register (stone-tile / lava-cracked /
 *     icy-crystal / bone-tile / blood-pool / mossy / sewer / runic)
 *   - hero_encounter (25): hero adventurer class + monster encounter
 *     mid-action (knight vs skeleton / mage vs lich / etc.)
 *   - loot_detail (25, 40%-gated): Diablo-style loot/prop accent
 */

module.exports = {
  archetype: 'PIXELBOT_DUNGEON_DEPTH',
  pools: {
    dungeon_chamber: 'PIXELBOT_DUNGEON_DEPTH_CHAMBER',
    dungeon_biome: 'PIXELBOT_DUNGEON_DEPTH_BIOME',
    hero_encounter: 'PIXELBOT_DUNGEON_DEPTH_HERO_ENCOUNTER',
    loot_detail: 'PIXELBOT_DUNGEON_DEPTH_LOOT_DETAIL',
  },
};
