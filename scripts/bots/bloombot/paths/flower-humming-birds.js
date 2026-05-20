/**
 * BloomBot flower-humming-birds path — declarative axis-system form (2026-05-19).
 *
 * VIBRANT hummingbird-and-flower scenes — multiple hummingbirds at
 * different positions throughout an enchanted garden of hummingbird-
 * attracting flowers (trumpet vine, fuchsia, salvia, hibiscus, bee
 * balm, columbine, butterfly bush, cardinal flower, lupine, foxglove,
 * petunia, etc.). NO soft-pastel restriction — vibrant saturated
 * jewel-tone register that hummingbird-flowers actually wear.
 *
 * Hummingbirds rendered with iridescent jewel-tone plumage (ruby-throat,
 * emerald-back, blue-violet crown, magnificent, anna's, broad-tailed,
 * sparkling, etc.), wings in motion-blur, pose dynamic (hovering,
 * sipping nectar, mid-flight).
 *
 * Sister path to flower-friends, but with hummingbirds replacing
 * insects + vibrant saturated palette instead of soft pastels.
 *
 * Axes (3 path-bespoke + universal lighting + conditional particles):
 *   - flower_focal_cluster (25): 3-5+ hummingbird-attracting blooms
 *     in vibrant saturated tones (NOT soft-pastel)
 *   - hummingbird_cast (25): 2-4+ hummingbirds at different positions
 *     with focal hero rendered prominently
 *   - magical_particles (25, 40%-gated): pollen-dust / bokeh-orbs /
 *     dew / petal-fall / iridescent shimmer
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_HUMMING_BIRDS',
  pools: {
    flower_focal_cluster: 'BLOOMBOT_FLOWER_HUMMING_BIRDS_FLOWER_FOCAL_CLUSTER',
    hummingbird_cast: 'BLOOMBOT_FLOWER_HUMMING_BIRDS_HUMMINGBIRD_CAST',
    magical_particles: 'BLOOMBOT_FLOWER_HUMMING_BIRDS_MAGICAL_PARTICLES',
  },
};
