/**
 * GothBot twilight-gothic path — NEW path (2026-06-10).
 *
 * A gothic SCENE at the MAGIC HOUR — dawn / dusk / golden-hour / blue-hour /
 * foggy-morning. Fills the "all-night" gap: the soft warm-cool transitional LIGHT
 * is the hero quality (the signature money-shot). Castle ridges, hill-top
 * cemeteries, foggy abbey ruins, moorland churches, cliff monasteries, misty
 * villages, lone bridges, standing stones. Melancholy-beautiful. Caspar-David-
 * Friedrich / Sleepy-Hollow / Crimson-Peak lineage. NOT deep night / NOT moonlit-
 * dark (those are dark-landscape / gothic-vista). NO CHARACTERS as subject.
 *
 * Path-bespoke pools (6 × 25 MVP), universal:[] (self-lights via twilight_light;
 * the bot LIGHTING/ATMOSPHERES are night/castle-coded):
 *   - scene: GOTHBOT_TWILIGHT_SCENE (the gothic subject, hero)
 *   - twilight_light: GOTHBOT_TWILIGHT_LIGHT (the magic-hour light — money-shot)
 *   - sky: GOTHBOT_TWILIGHT_SKY (the dawn/dusk sky)
 *   - atmosphere: GOTHBOT_TWILIGHT_ATMOSPHERE (fog/mist/haze that catches the light)
 *   - foreground: GOTHBOT_TWILIGHT_FOREGROUND (a near anchor for depth)
 *   - accent: GOTHBOT_TWILIGHT_ACCENT (50%-gated — wildlife / tiny distant figure)
 */

module.exports = {
  archetype: 'GOTHBOT_TWILIGHT_GOTHIC',
  pools: {
    scene: 'GOTHBOT_TWILIGHT_SCENE',
    twilight_light: 'GOTHBOT_TWILIGHT_LIGHT',
    sky: 'GOTHBOT_TWILIGHT_SKY',
    atmosphere: 'GOTHBOT_TWILIGHT_ATMOSPHERE',
    foreground: 'GOTHBOT_TWILIGHT_FOREGROUND',
    accent: 'GOTHBOT_TWILIGHT_ACCENT',
  },
};
