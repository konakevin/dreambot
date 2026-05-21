/**
 * PixelBot jrpg-combat path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT JRPG COMBAT GAMEPLAY SCREENSHOTS — Final Fantasy IV/V/VI /
 * Chrono Trigger / Secret of Mana / Seiken Densetsu 3 / Star Ocean /
 * Tales of Phantasia / Lufia II / Y's series.
 *
 * Top-down OR 3/4-iso camera. 5 mandatory elements: tile floor +
 * hero party (2-4 sprites) + monster enemy + visible spell/weapon
 * effect + open-world setting.
 *
 * Lessons applied:
 *   - Multi-character party + boss with mid-attack action
 *   - Visible IMPACT-EFFECTS mid-air mandatory
 *   - Open-world setting (not arena-walled — different from boss-arena)
 *   - Possessive-apostrophes pre-stripped
 *
 * Axes (3 path-bespoke + 40%-gated spell effect):
 *   - open_world_setting (25): outdoor JRPG setting (forest / mountain
 *     / grassland / ruined-temple / lakeshore / dungeon-with-skylight)
 *   - monster_enemy (25): monster sprite mid-attack on the play area
 *   - party_engagement (25): 2-4 hero party in formation mid-action
 *   - spell_effect (25, 40%-gated): visible spell/weapon effect accent
 */

module.exports = {
  archetype: 'PIXELBOT_JRPG_COMBAT',
  pools: {
    open_world_setting: 'PIXELBOT_JRPG_COMBAT_OPEN_WORLD_SETTING',
    monster_enemy: 'PIXELBOT_JRPG_COMBAT_MONSTER_ENEMY',
    party_engagement: 'PIXELBOT_JRPG_COMBAT_PARTY_ENGAGEMENT',
    spell_effect: 'PIXELBOT_JRPG_COMBAT_SPELL_EFFECT',
  },
};
