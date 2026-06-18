/**
 * BloomBot jack-and-the-giant-flower path (2026-06-18, replaced flower-tunnels).
 *
 * A "Jack and the Beanstalk" NOD (no Jack, no human — BloomBot is humans-banned):
 * an awe-struck UPWARD worm's-eye view of a SINGLE COLOSSAL flower growing
 * impossibly tall, climbing up into the open sky, dwarfing a lush normal-scale
 * world at its base. The giant IS the flowerEngine roster HERO species rendered
 * at monumental scale (so it rotates across species + matches the rolled palette
 * automatically — the new flower×color matrix). Replaces the directionless 360°
 * flower-tunnel/kaleidoscope, which had no hero and color-collapsed to pink/blue.
 *
 * Axes (3 path-bespoke + universal lighting; palette + roster from flowerEngine):
 *   - giant_form (25): how the colossal hero flower towers up to the sky
 *   - base_surround (25): the lush ground world at its base (gives scale)
 *   - sky_ascent (25, 40%-gated): the open sky it climbs up into
 */

module.exports = {
  archetype: 'BLOOMBOT_GIANT_FLOWER',
  pools: {
    giant_form: 'BLOOMBOT_GIANT_FLOWER_GIANT_FORM',
    base_surround: 'BLOOMBOT_GIANT_FLOWER_BASE_SURROUND',
    sky_ascent: 'BLOOMBOT_GIANT_FLOWER_SKY_ASCENT',
  },
};
