/**
 * BloomBot flower-friends path — declarative axis-system form (2026-05-19).
 *
 * CLOSE-UP FLOWER + PLEASANT POLLINATOR pairing renders. The INSECT is
 * co-hero with the flower — a beautiful butterfly / bumblebee / dragonfly
 * / ladybug / firefly / moth interacting with a hero bloom in a soft
 * magical close-up scene with bouquet-cluster foreground + dreamy bokeh
 * background + occasional pollen-dust / fairy-light particles.
 *
 * Inspired by 6 user-hearted IG "cozy insect on flower" references —
 * pink-purple-cream-coral palette in the refs, but ALL flower colors
 * welcome here.
 *
 * Naturalistic-pretty register (NOT macro-into-the-bloom-wall — that's
 * closeup's territory; NOT epic-landscape — that's sunset-flowers /
 * landscape; NOT engulfment — that's flower-tunnels / garden-walk).
 *
 * Distinguishing: the magic-moment IS the insect-on-flower pairing.
 *
 * Axes (3 path-bespoke + universal lighting + conditional particles):
 *   - flower_focal_cluster (25): hero bloom + bouquet-cluster supporting
 *   - hero_pollinator (25): specific pleasant insect + position/interaction
 *   - magical_particles (25, 40%-gated): pollen-dust / bokeh-orbs /
 *     dewdrops / falling petals / iridescent shimmer
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_FRIENDS',
  pools: {
    flower_focal_cluster: 'BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER',
    hero_pollinator: 'BLOOMBOT_FLOWER_FRIENDS_HERO_POLLINATOR',
    magical_particles: 'BLOOMBOT_FLOWER_FRIENDS_MAGICAL_PARTICLES',
  },
};
