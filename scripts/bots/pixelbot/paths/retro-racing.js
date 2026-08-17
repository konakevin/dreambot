/**
 * PixelBot retro-racing (Stage K2, SHADOW) — 16-bit arcade racing (OutRun register).
 * A pixel sports car on a coastal highway at sunset, palm parallax, dithered horizon
 * bands, mountain switchbacks, desert straights. horizon_bands = money-shot. Camera:
 * behind-the-car chase view + occasional side-profile. Car morphological, no real
 * models. 40%-gated roadside_detail. NO text/signage. 16-bit SUNSET arcade (not anime).
 */

module.exports = {
  archetype: 'PIXELBOT_RETRO_RACING',
  pools: {
    route_scene: 'PIXELBOT_RETRO_RACING_ROUTE_SCENE',
    horizon_bands: 'PIXELBOT_RETRO_RACING_HORIZON_BANDS',
    race_moment: 'PIXELBOT_RETRO_RACING_RACE_MOMENT',
    roadside_detail: 'PIXELBOT_RETRO_RACING_ROADSIDE_DETAIL',
  },
};
