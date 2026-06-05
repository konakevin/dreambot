/**
 * OceanBot bioluminescent-night — axis-system declarative path.
 *
 * 10th and FINAL OceanBot path. Nighttime ocean surface lit by
 * dinoflagellate plankton bloom — milky seas, glowing surf at shore,
 * bioluminescent wake behind a swimming creature, jellyfish swarm at
 * twilight surface, tide-line glow. The ocean ITSELF is the light
 * source.
 *
 * Counterpoint to deep-wonder (creature-in-abyss). This path is the
 * SURFACE / SHORE — vast horizon-to-horizon plankton glow, breaking
 * wave-crest cyan trails, milky seas stretching to dark horizon.
 *
 * NO SHIPS, NO PEOPLE, NO KAYAKS, NO HEADLAMPS — the natural glow is
 * the only light source.
 *
 * Same lean 4-axis shape (2 path + 2 universal) as the other paths.
 *
 * Wires the OCEANBOT_BIOLUMINESCENT_NIGHT archetype slots to per-axis
 * pool names that resolve via bot.poolByName.
 */

module.exports = {
  archetype: 'OCEANBOT_BIOLUMINESCENT_NIGHT',
  pools: {
    biolum_scene: 'BIOLUM_SCENES',
    camera_framing: 'BIOLUM_CAMERA_FRAMING',
  },
};
