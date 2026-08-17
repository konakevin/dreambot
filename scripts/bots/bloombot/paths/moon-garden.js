/**
 * BloomBot moon-garden — the first NIGHT register (Stage A3). A moonlit garden
 * of pale white night-bloomers (moonflower, night jasmine, white wisteria),
 * fireflies, cool-silver palette. Light is MOON + starlight ONLY (the template
 * uses moonlight_effect + night_sky, never the daytime lighting pool). Bespoke
 * MOON_GARDEN_MANDATE; themeBias forces white/pale in rollSharedDNA. Blooms
 * "moonlit / silvered", never "glowing".
 */

module.exports = {
  archetype: 'BLOOMBOT_MOON_GARDEN',
  pools: {
    garden_setting: 'BLOOMBOT_MOON_GARDEN_SETTING',
    night_bloom: 'BLOOMBOT_MOON_GARDEN_NIGHT_BLOOM',
    moonlight_effect: 'BLOOMBOT_MOON_GARDEN_MOONLIGHT_EFFECT',
    night_sky: 'BLOOMBOT_MOON_GARDEN_NIGHT_SKY',
    night_life: 'BLOOMBOT_MOON_GARDEN_NIGHT_LIFE',
  },
};
