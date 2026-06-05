/**
 * OceanBot deep-wonder — axis-system declarative path.
 *
 * Bioluminescent beauty, alien elegance, deep-sea wonder. The BEAUTIFUL
 * side of the deep ocean — jellyfish trailing light, elegant
 * siphonophores, glowing plankton clouds, translucent creatures with
 * inner light, anglerfish lures, lantern-fish constellations. Beauty
 * in the darkness, NOT horror.
 *
 * First of 5 scenic-OceanBot paths. Same lean 4-axis shape (2 path +
 * 2 universal) as the naval-lore set — the deep_wonder hero entry
 * encodes specific bioluminescent creature + glow + abyssal context.
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR — just the creature and the dark.
 *
 * Wires the OCEANBOT_DEEP_WONDER archetype slots to per-axis pool names
 * that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_DEEP_WONDER',
  pools: {
    deep_wonder: 'DEEP_WONDER',
    camera_framing: 'DEEP_WONDER_CAMERA_FRAMING',
  },
};
