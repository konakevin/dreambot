/**
 * OceanBot ghost-ship — axis-system declarative path.
 *
 * Derelict pre-1850 wooden sailing vessels drifting alone through fog —
 * Flying Dutchman energy. Tattered sails, barnacle-crusted hulls,
 * phantom silhouettes on the horizon, lanterns swinging on EMPTY decks.
 * Eerie, beautiful, haunted, NOT horror. NO CREW visible — the ships
 * are alone.
 *
 * Same lean 2-path-slot shape as pirates (hero + camera framing). The
 * ghost_ship hero entry encodes vessel + state + spectral atmosphere
 * in one rich phrase, so the supporting axes can do less. Universal
 * lighting + atmosphere from the shared pools.
 *
 * Wires the OCEANBOT_GHOST_SHIP archetype slots to per-axis pool names
 * that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_GHOST_SHIP',
  pools: {
    ghost_ship: 'GHOST_SHIPS',
    camera_framing: 'GHOST_SHIP_CAMERA_FRAMING',
  },
};
