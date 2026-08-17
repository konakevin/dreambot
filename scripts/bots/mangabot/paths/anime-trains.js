/**
 * MangaBot anime-trains (Stage I2, SHADOW) — THE anime train motif. Countryside
 * single-car trains at golden hour, level-crossings, interiors with sunset windows,
 * seaside track curves. Real JR-style rolling stock, NO IP liveries, NO fantasy
 * trains (zero overlap with DreamBot dream-express). light_moment = money-shot;
 * passenger_glimpse 50%-gated. camera_framing MANDATORY. Look-enabled.
 */

module.exports = {
  archetype: 'MANGABOT_ANIME_TRAINS',
  pools: {
    train_scene: 'ANIME_TRAINS_TRAIN_SCENE',
    light_moment: 'ANIME_TRAINS_LIGHT_MOMENT',
    season_air: 'ANIME_TRAINS_SEASON_AIR',
    landscape_beyond: 'ANIME_TRAINS_LANDSCAPE_BEYOND',
    camera_framing: 'ANIME_TRAINS_CAMERA_FRAMING',
    emotional_dna: 'ANIME_TRAINS_EMOTIONAL_DNA',
    passenger_glimpse: 'ANIME_TRAINS_PASSENGER_GLIMPSE',
  },
};
