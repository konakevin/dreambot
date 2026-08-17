/**
 * MangaBot winter-anime (Stage I3, SHADOW) — snow-country anime. First-snow streets,
 * snow festivals with ice lanterns, kotatsu-window glow from outside, shrine torii in
 * snowfall, breath-clouds under station lights. The warm-vs-cold contrast is the
 * signature. snow_state = money-shot; warm_glow supplies the warm source;
 * figure_moment 50%-gated. camera_framing MANDATORY. Look-enabled.
 */

module.exports = {
  archetype: 'MANGABOT_WINTER_ANIME',
  pools: {
    winter_scene: 'WINTER_ANIME_WINTER_SCENE',
    snow_state: 'WINTER_ANIME_SNOW_STATE',
    warm_glow: 'WINTER_ANIME_WARM_GLOW',
    weather_air: 'WINTER_ANIME_WEATHER_AIR',
    camera_framing: 'WINTER_ANIME_CAMERA_FRAMING',
    emotional_dna: 'WINTER_ANIME_EMOTIONAL_DNA',
    figure_moment: 'WINTER_ANIME_FIGURE_MOMENT',
  },
};
