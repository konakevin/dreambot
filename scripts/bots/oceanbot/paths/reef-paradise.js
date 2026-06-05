/**
 * OceanBot reef-paradise — axis-system declarative path.
 *
 * Tropical shallow-water coral reef in maximum biodiversity. NatGeo /
 * BBC-Blue-Planet register. Sun-shafted clarity, razor-sharp coral
 * structure, every fish and invertebrate readable.
 *
 * Counterpoint to deep-wonder (abyssal dark) — this is bright, sun-lit,
 * abundant. Real Indo-Pacific / Caribbean / Coral-Triangle reef
 * ecosystems with reef-builders (hard coral / soft coral / sea fans /
 * anemones / sponges) layered with reef-dwellers (clownfish /
 * parrotfish / angelfish / butterflyfish / surgeonfish / wrasses /
 * fusilier schools / octopus / moray / reef sharks / sea turtles /
 * rays).
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR.
 *
 * Same lean 4-axis shape (2 path + 2 universal) as the other paths.
 *
 * Wires the OCEANBOT_REEF_PARADISE archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_REEF_PARADISE',
  pools: {
    reef_scene: 'REEF_SCENES',
    camera_framing: 'REEF_CAMERA_FRAMING',
  },
};
