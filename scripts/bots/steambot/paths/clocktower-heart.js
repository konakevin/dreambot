/**
 * SteamBot clocktower-heart (Stage M3, SHADOW) — inside a cathedral-scale clock (Hugo
 * register). Giant brass gears in slow motion, pendulum arcs, light through the
 * translucent clock face, catwalks and ladders for scale. Gears read MECHANICAL not
 * decorative; avoid "canyon". gear_choreography = money-shot; face_light = scene light.
 * 35%-gated hour_event. Routes to steambot_neutral + rolled LOOK (set in index.js).
 */

module.exports = {
  archetype: 'STEAMBOT_CLOCKTOWER_HEART',
  pools: {
    mechanism_hall: 'CLOCKTOWER_HEART_MECHANISM_HALL',
    gear_choreography: 'CLOCKTOWER_HEART_GEAR_CHOREOGRAPHY',
    face_light: 'CLOCKTOWER_HEART_FACE_LIGHT',
    scale_prover: 'CLOCKTOWER_HEART_SCALE_PROVER',
    hour_event: 'CLOCKTOWER_HEART_HOUR_EVENT',
  },
};
