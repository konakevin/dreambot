/**
 * OceanBot polar-seas — axis-system declarative path.
 *
 * Arctic / Antarctic ocean. NatGeo / BBC-Frozen-Planet register.
 * Towering icebergs with impossible blue interiors, pack ice and frozen
 * seas, polar wildlife at the ice edge (narwhal / beluga / orca /
 * humpback / penguin colonies / polar bear / seals / walrus haul-outs),
 * aurora reflecting on still polar water. Eerie blue silence of the far
 * north or far south.
 *
 * 4th of 5 scenic OceanBot paths. Same lean 4-axis shape as the others.
 *
 * NO SHIPS (covered by shipwreck-kingdom / ghost-ship). NO PEOPLE
 * (no expedition crews / scientists / explorers — just the polar
 * wilderness and its inhabitants).
 *
 * Wires the OCEANBOT_POLAR_SEAS archetype slots to per-axis pool names
 * that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_POLAR_SEAS',
  pools: {
    polar_scene: 'POLAR_SCENES',
    camera_framing: 'POLAR_CAMERA_FRAMING',
  },
};
