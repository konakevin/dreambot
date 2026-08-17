/**
 * SteamBot celestial-observatory (Stage M2, SHADOW) — Victorian astronomy. Colossal
 * brass telescope domes open to the night, orrery rooms with slow-spinning planet-
 * models, star-chart tables under gaslight, a comet through the dome slit. Interior
 * warmth vs cold night sky. REAL night sky (Victorian Earth, no fantasy planets).
 * sky_through_dome = money-shot; instrument fills 30-50%. brass_detail pickN:2,
 * 40%-gated astronomer. Routes to steambot_neutral + rolled LOOK (set in index.js).
 */

module.exports = {
  archetype: 'STEAMBOT_CELESTIAL_OBSERVATORY',
  pools: {
    observatory_space: 'CELESTIAL_OBSERVATORY_SPACE',
    great_instrument: 'CELESTIAL_OBSERVATORY_INSTRUMENT',
    sky_through_dome: 'CELESTIAL_OBSERVATORY_SKY_THROUGH_DOME',
    brass_detail: 'CELESTIAL_OBSERVATORY_BRASS_DETAIL',
    astronomer_presence: 'CELESTIAL_OBSERVATORY_ASTRONOMER',
  },
};
