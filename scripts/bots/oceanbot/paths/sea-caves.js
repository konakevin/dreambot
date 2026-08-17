/**
 * OceanBot sea-caves — the Blue-Grotto register (Stage J4). Cathedral sea-cave
 * light beams, hidden lagoons, glowing turquoise water-windows, ceiling shafts.
 * Serene counterpart to coastal-power. The "glowing water" is REAL daylight
 * physics (sunlight through a submerged entrance lights the pool electric blue),
 * never bioluminescence. Every entry anchored by a monumental formation or a
 * creature. Lean 3-slot: cave_scene (hero) + light_window (money-shot) +
 * camera_framing (audited).
 */

module.exports = {
  archetype: 'OCEANBOT_SEA_CAVES',
  pools: {
    cave_scene: 'SEA_CAVE_SCENES',
    light_window: 'SEA_CAVE_LIGHT_WINDOW',
    camera_framing: 'SEA_CAVE_CAMERA_FRAMING',
  },
};
