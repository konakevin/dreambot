/**
 * FROZEN SNAPSHOT (2026-05-25) — bit-for-bit clone of monster-prowl at the
 * converged "classical Victorian recognizable-monster oil painting" state.
 * Its own archetype + template + canvas_victorian medium so monster-prowl can be
 * tweaked independently. Do not edit to track monster-prowl; this is the saved branch.
 *
 * GothBot monster-prowl path — declarative form.
 * 2026-05-25 R2 redesign: MONSTER-AS-HERO.
 *
 * A SOLO epic gothic MONSTER is the unmistakable hero of the frame (50-65%) —
 * vampire-lord / werewolf / gargoyle / succubus / demon / banshee / lich /
 * harpy / wraith / dragon — rendered in lavish, terrifying, fully-readable
 * detail, mid-action, dramatically lit, in a gothic setting. Castlevania-boss /
 * Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster aesthetic.
 *
 * The monster DOMINATES; the gothic stage is a dramatic backdrop, NOT a dwarfing
 * vista. R1/legacy used ASSASSIN_EPIC_BACKDROP ("dominating / swallowing the
 * frame") which shrank the creature into a tiny lost silhouette — that axis is
 * DROPPED here.
 *
 * NO hunter present (assassin paths). NO combat (combat path). NO second figure.
 * NO gore, NO mid-bite-on-victim. Implied menace only.
 *
 * Pools (200 entries each, bot-shared):
 *   - CREATURE_ARCHETYPE — the monster, full design (the hero)
 *   - CREATURE_WILD_ACTION — mid-action body-pose
 *   - ASSASSIN_STAGE — gothic setting (ground / biome / immediate surround)
 * Universal: LIGHTING + ATMOSPHERES.
 *
 * Pre-migration file at paths/legacy/monster-prowl.js.
 */

module.exports = {
  archetype: 'GOTHBOT_MONSTER_PROWL_VICTORIAN',
  pools: {
    creature: 'CREATURE_ARCHETYPE',
    action: 'CREATURE_WILD_ACTION',
    stage: 'ASSASSIN_STAGE',
  },
};
