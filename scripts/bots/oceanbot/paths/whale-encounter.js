/**
 * OceanBot whale-encounter — axis-system declarative path.
 *
 * NatGeo / BBC-Blue-Planet whale-documentary register. Real cetacean
 * species rendered with anatomical accuracy — humpback breach, blue-
 * whale glide, orca pod hunting, sperm whale sounding, gray whale with
 * calf, beluga arctic dance, narwhal, fin whale, right whale, bowhead.
 *
 * Naturalistic, NOT mythic — the kraken-leviathan path handles
 * Moby-Dick-leviathan-whale myth. This path is real whales.
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR — the whale is the subject,
 * the ocean is the world.
 *
 * Same lean 4-axis shape (2 path + 2 universal) as the other paths.
 *
 * Wires the OCEANBOT_WHALE_ENCOUNTER archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_WHALE_ENCOUNTER',
  pools: {
    whale_encounter: 'WHALE_ENCOUNTER',
    camera_framing: 'WHALE_ENCOUNTER_CAMERA_FRAMING',
  },
};
