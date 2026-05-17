/**
 * GothBot monster-prowl path — declarative form (2026-05-16 bespoke migration).
 *
 * Solo gothic-fantasy CREATURE out in the wild doing creature-business —
 * vampire / werewolf / gargoyle / succubus / demon / banshee / lich / harpy /
 * wraith / etc. Wide cinematic full-body shot. Creature 25-40% of the frame;
 * gothic stage + epic backdrop fill 60-75%. Castlevania-boss / Bloodborne-beast /
 * Devil-May-Cry-demon / Van-Helsing-monster aesthetic.
 *
 * NO hunter present (assassin paths). NO combat (combat path). NO second figure.
 * NO gore, NO mid-bite-on-victim. Implied menace only.
 *
 * Reuses existing production-scale pools (200 entries each, all bot-shared):
 *   - CREATURE_ARCHETYPE — the monster, full design
 *   - CREATURE_WILD_ACTION — mid-action body-pose
 *   - ASSASSIN_STAGE — gothic stage (ground / biome / immediate surround)
 *   - ASSASSIN_EPIC_BACKDROP — scale-defining backdrop (sky / horizon)
 *
 * Universal: LIGHTING + ATMOSPHERES.
 *
 * Pre-migration file at paths/legacy/monster-prowl.js.
 */

module.exports = {
  archetype: 'GOTHBOT_MONSTER_PROWL',
  pools: {
    creature: 'CREATURE_ARCHETYPE',
    action: 'CREATURE_WILD_ACTION',
    stage: 'ASSASSIN_STAGE',
    backdrop: 'ASSASSIN_EPIC_BACKDROP',
  },
};
