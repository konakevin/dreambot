/**
 * BloomBot sunset-flowers path — declarative axis-system form (2026-05-19).
 *
 * SUN-BACKLIT-FLOWER renders where the SUN is the visible light source and
 * the foreground flowers are backlit / rim-lit by it — translucent petals
 * catching the golden-hour light, glowing against a SHOW-STOPPING dramatic
 * sunset sky over a wide gorgeous landscape behind. Real-world naturalistic
 * register (hibiscus / cosmos / cherry-blossom / dandelion / azalea against
 * mountains / hills / lakes / forests / coast).
 *
 * Inspired by 7 user-hearted IG renders: hero flower in foreground, massive
 * landscape behind, sun cresting/setting in frame, dramatic vivid sunset sky.
 *
 * Axes (4 path-bespoke + universal lighting + conditional phenomenon):
 *   - hero_flower (25): the foreground/midground flower-cluster being backlit
 *   - landscape_backdrop (25): the wide gorgeous landscape behind
 *   - sunset_sky (25): show-stopping dramatic sunset cloud-bands + colors
 *     (the second hero of the frame — filling upper 35-50%)
 *   - sun_position (25): where the visible sun sits in frame
 *   - atmospheric_phenomenon (25, 40%-gated): extra magic (drifting petals
 *     / mist / wildlife / lake-reflection / dewdrops)
 */

module.exports = {
  archetype: 'BLOOMBOT_SUNSET_FLOWERS',
  pools: {
    hero_flower: 'BLOOMBOT_SUNSET_FLOWERS_HERO_FLOWER',
    landscape_backdrop: 'BLOOMBOT_SUNSET_FLOWERS_LANDSCAPE_BACKDROP',
    sunset_sky: 'BLOOMBOT_SUNSET_FLOWERS_SUNSET_SKY',
    sun_position: 'BLOOMBOT_SUNSET_FLOWERS_SUN_POSITION',
    atmospheric_phenomenon: 'BLOOMBOT_SUNSET_FLOWERS_ATMOSPHERIC_PHENOMENON',
  },
};
