/**
 * BloomBot flower-tunnels path — declarative axis-system form (2026-05-19).
 *
 * POV-THROUGH-FLOWER-TUNNEL renders where the flowers are BOTH the décor
 * AND the visual light source. Wisteria-cathedral cascades, forest tree-
 * canopy paths, lava-tube tunnels with glowing Hawaiian flowers, spiraling
 * flower-wormholes, flower-portals to other flower-dimensions.
 *
 * Inspired by the user's hearted bloom-tunnel render where marigolds at the
 * entrance and wisteria-strands along the dark walls visually function as
 * lanterns / chandeliers / fairy-lights through saturated color in dim
 * ambient — NOT separate sci-fi glow / bioluminescence.
 *
 * Axes (3 path-bespoke + universal lighting/atmosphere):
 *   - tunnel_setting (25): the bloom-tunnel composition + POV
 *   - flower_lanterns (25): which flower-clusters act as the light fixtures
 *   - atmospheric_phenomenon (25, 40%-gated): tunnel magic (petal-fall /
 *     mist / distant figure / mirror-pool / etc.)
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_TUNNELS',
  pools: {
    tunnel_setting: 'BLOOMBOT_FLOWER_TUNNELS_TUNNEL_SETTING',
    flower_lanterns: 'BLOOMBOT_FLOWER_TUNNELS_FLOWER_LANTERNS',
    atmospheric_phenomenon: 'BLOOMBOT_FLOWER_TUNNELS_ATMOSPHERIC_PHENOMENON',
  },
};
