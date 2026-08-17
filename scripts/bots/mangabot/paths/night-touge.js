/**
 * MangaBot night-touge (Stage I4, SHADOW) — Initial-D lineage. 90s-era Japanese
 * sports cars drifting mountain passes at night, neon wangan highways, vending-
 * machine glow pit stops, headlight trails through hairpins. First vehicle path.
 * hero_car = NON-IP morphological descriptions (never a real model/brand).
 * motion_signature = money-shot (speed READS); street_detail 40%-gated.
 * camera_framing MANDATORY. Look-enabled (anime cel). No crashes, no legible text.
 */

module.exports = {
  archetype: 'MANGABOT_NIGHT_TOUGE',
  pools: {
    touge_scene: 'NIGHT_TOUGE_TOUGE_SCENE',
    hero_car: 'NIGHT_TOUGE_HERO_CAR',
    motion_signature: 'NIGHT_TOUGE_MOTION_SIGNATURE',
    night_light: 'NIGHT_TOUGE_NIGHT_LIGHT',
    camera_framing: 'NIGHT_TOUGE_CAMERA_FRAMING',
    emotional_dna: 'NIGHT_TOUGE_EMOTIONAL_DNA',
    street_detail: 'NIGHT_TOUGE_STREET_DETAIL',
  },
};
