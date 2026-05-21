/**
 * PixelBot side-scroller-world path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT SIDE-SCROLLING PLATFORMER GAMEPLAY SCREENSHOTS — Castlevania
 * IV / Super Metroid / Donkey Kong Country / Mega Man X / Owlboy /
 * Hollow Knight pixel / Dead Cells / Ori / Celeste / Trine.
 *
 * HORIZONTAL SIDE-VIEW camera, 5 mandatory elements: horizontal frame +
 * foreground platforming surface + player-sprite + middle parallax layer
 * + far backdrop.
 *
 * Lessons applied from dungeon-depth migration: multi-character action
 * (hero + 1-2 enemies) for engagement, mandatory-elements clause in
 * template, possessive-apostrophes pre-stripped, genre/lineage anchors
 * in theme.
 *
 * Axes (3 path-bespoke + 40%-gated phenomenon):
 *   - biome_setting (25): parallax-layered biome (lava-castle / ice
 *     cavern / floating-islands / forest-canopy / desert-temple /
 *     factory-conveyor / cosmic-void / sewers / mushroom-grove)
 *   - platform_geography (25): foreground platformable terrain detail
 *     (stone-tile / cliff-ledge / treetop-branch / factory-walkway /
 *     cracked-magma / ice-bridge / mushroom-cap / etc.)
 *   - hero_action (25): hero pixel-sprite + 1-2 enemies in mid-action
 *     on the platform (knight mid-jump / mage mid-cast / etc.)
 *   - atmospheric_phenomenon (25, 40%-gated): parallax-magic accent
 *     (drifting petals / embers / rain / pollen / mist / aurora / etc.)
 */

module.exports = {
  archetype: 'PIXELBOT_SIDE_SCROLLER_WORLD',
  pools: {
    biome_setting: 'PIXELBOT_SIDE_SCROLLER_BIOME_SETTING',
    platform_geography: 'PIXELBOT_SIDE_SCROLLER_PLATFORM_GEOGRAPHY',
    hero_action: 'PIXELBOT_SIDE_SCROLLER_HERO_ACTION',
    atmospheric_phenomenon: 'PIXELBOT_SIDE_SCROLLER_ATMOSPHERIC_PHENOMENON',
  },
};
