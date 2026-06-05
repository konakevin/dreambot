/**
 * OceanBot tropical-fish-closeup — axis-system declarative path.
 *
 * Single bright colorful tropical fish in the reef as the HERO —
 * distinct from reef-paradise (which is biodiversity-explosion).
 * One-fish-in-frame portrait register: mandarinfish / clownfish /
 * royal angelfish / lionfish / parrotfish / yellow tang / Moorish
 * idol / triggerfish / pufferfish / boxfish / frogfish / seahorse /
 * pipefish / butterflyfish / wrasse / etc., across sizes from tiny
 * goby to large grouper. NatGeo macro-fish-photography register.
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR, NO multi-species frame.
 *
 * Same lean 4-axis shape (2 path + 2 universal).
 *
 * Wires the OCEANBOT_TROPICAL_FISH_CLOSEUP archetype slots to per-axis
 * pool names that resolve via bot.poolByName.
 */

module.exports = {
  archetype: 'OCEANBOT_TROPICAL_FISH_CLOSEUP',
  pools: {
    fish_scene: 'TROPICAL_FISH_SCENES',
    camera_framing: 'TROPICAL_FISH_CAMERA_FRAMING',
  },
};
