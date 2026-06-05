/**
 * OceanBot kraken-leviathan — axis-system declarative path.
 *
 * Sea monsters attacking pre-1850 wooden ships. Pliny / Norse-saga /
 * Moby-Dick register. Maritime myth made vivid.
 *
 * ONLY 4 creatures appear here (locked via KRAKEN_CREATURE_BLOCK in
 * shared-blocks.js):
 *   - KRAKEN (multi-tentacled cephalopodic horror, single giant eye)
 *   - GIANT SQUID (Architeuthis, eight arms + two whip-tentacles)
 *   - GIANT OCTOPUS (eight arms, mottled red-brown, longboat-mantle)
 *   - LEVIATHAN-WHALE (Moby Dick / sperm whale / Bible-leviathan)
 *
 * EMBODIMENT RULE — the creature's body must be visible in every
 * render (mantle / head / eye / bulk / shoulder / fluke). Never a
 * disembodied tentacle floating without the body alongside (legacy
 * failure mode, commit f7f319cf).
 *
 * Same lean 4-axis shape as pirates / ghost-ship (2 path + 2 universal).
 * Hero pool encodes creature + ship + attack moment in one rich phrase.
 *
 * Wires the OCEANBOT_KRAKEN_LEVIATHAN archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_KRAKEN_LEVIATHAN',
  pools: {
    kraken_scene: 'KRAKEN_SCENES',
    camera_framing: 'KRAKEN_CAMERA_FRAMING',
  },
};
