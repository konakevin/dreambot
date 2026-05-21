/**
 * PixelBot boss-arena path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT BOSS-BATTLE GAMEPLAY SCREENSHOTS — Chrono Trigger / FFVI /
 * Secret of Mana / Earthbound / Link to the Past / Diablo II / Hyper
 * Light Drifter / Hades / Octopath Traveler.
 *
 * Camera flexibility: top-down OR 3/4-iso OR side-view (chosen per
 * arena setting). 4 mandatory elements: arena floor + boss sprite +
 * player sprite + arena walls.
 *
 * Lessons applied from earlier paths:
 *   - Multi-character action — player + optional companion + boss + minions
 *   - Camera-lock flexibility specified explicitly per arena
 *   - Mandatory-elements clause in template
 *   - Possessive-apostrophes pre-stripped from touchpoints
 *
 * Axes (3 path-bespoke + 40%-gated phenomenon):
 *   - arena_setting (25): specific boss arena (lava-bridge / frozen
 *     cathedral / temple-of-doom / castle-throne / void-arena / etc.)
 *   - boss_creature (25): boss-sprite mid-action (dragon / lich / etc.)
 *   - player_engagement (25): player + optional companion mid-combat
 *   - arena_phenomenon (25, 40%-gated): particles/effects accent
 */

module.exports = {
  archetype: 'PIXELBOT_BOSS_ARENA',
  pools: {
    arena_setting: 'PIXELBOT_BOSS_ARENA_SETTING',
    boss_creature: 'PIXELBOT_BOSS_ARENA_BOSS_CREATURE',
    player_engagement: 'PIXELBOT_BOSS_ARENA_PLAYER_ENGAGEMENT',
    arena_phenomenon: 'PIXELBOT_BOSS_ARENA_PHENOMENON',
  },
};
