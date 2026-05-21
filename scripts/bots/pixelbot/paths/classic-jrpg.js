/**
 * PixelBot classic-jrpg path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT CLASSIC JRPG GAMEPLAY SCREENSHOTS — Zelda: A Link to the Past
 * + Final Fantasy IV/V/VI + Chrono Trigger + Secret of Mana + Seiken
 * Densetsu 3 + Terranigma + Earthbound + Illusion of Gaia + Lufia II +
 * Dragon Quest VI + Breath of Fire + Lunar: Silver Star Story +
 * Tales of Phantasia + Live A Live.
 *
 * 3/4 top-down camera locked (genre signature). Hero party (single or
 * 2-4 party members) walking the tile-map. NPC life or enemy creature
 * patrolling. Classic JRPG props (treasure chest / signpost / altar /
 * fountain / etc.).
 *
 * Axes (3 path-bespoke + 40%-gated props):
 *   - jrpg_locale (25): overworld grass / dense forest / mountain pass
 *     / town hub / castle throne / dungeon crypt / sacred grove / etc.
 *   - party_action (25): single hero or 2-4 party members walking /
 *     examining / mid-cutscene / mid-action on the tile-grid
 *   - npc_or_enemy_life (25): NPC villager mid-routine OR enemy creature
 *     (slime / bat / skeleton / orc / goblin / harpy) patrolling
 *   - jrpg_props (25, 40%-gated): treasure chest / signpost / pot /
 *     statue / fountain / altar / glowing-rune-floor / etc.
 */

module.exports = {
  archetype: 'PIXELBOT_CLASSIC_JRPG',
  pools: {
    jrpg_locale: 'PIXELBOT_CLASSIC_JRPG_LOCALE',
    party_action: 'PIXELBOT_CLASSIC_JRPG_PARTY_ACTION',
    npc_or_enemy_life: 'PIXELBOT_CLASSIC_JRPG_NPC_OR_ENEMY_LIFE',
    jrpg_props: 'PIXELBOT_CLASSIC_JRPG_PROPS',
  },
};
