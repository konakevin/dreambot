/**
 * OceanBot wild-sealife-camera — axis-system declarative path.
 *
 * Wild sea-life CAUGHT-on-camera moments — apex predators (great white
 * / mako / tiger / hammerhead / bull / oceanic whitetip sharks),
 * pelagic giants (bluefin / yellowfin tuna, blue / black marlin,
 * sailfish, swordfish, mahi-mahi), sea-mammals (sea lions, fur seals,
 * harbor seals, walrus, beluga, narwhal, orca, dolphin pods), large
 * game fish (barracuda, wahoo, goliath grouper, tarpon), and notable
 * invertebrates (manta ray, giant Pacific octopus, giant squid, sea
 * snake). NatGeo / BBC Blue Planet documentary register.
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR.
 *
 * Same lean 4-axis shape (2 path + 2 universal).
 *
 * Wires the OCEANBOT_WILD_SEALIFE archetype slots to per-axis pool
 * names that resolve via bot.poolByName.
 */

module.exports = {
  archetype: 'OCEANBOT_WILD_SEALIFE',
  pools: {
    wild_sealife_scene: 'WILD_SEALIFE_SCENES',
    camera_framing: 'WILD_SEALIFE_CAMERA_FRAMING',
  },
};
