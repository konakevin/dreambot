/**
 * DragonBot dragon-flight path (2026-06-10, NEW). A majestic Western dragon
 * soaring over an epic vista, aerial, full of motion. No rider/characters.
 * Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DRAGON_FLIGHT',
  pools: {
    dragon: 'DRAGON_FLIGHT_DRAGON',
    flight_pose: 'DRAGON_FLIGHT_POSE',
    vista_below: 'DRAGON_FLIGHT_VISTA',
    sky: 'DRAGON_FLIGHT_SKY',
    drama: 'DRAGON_FLIGHT_DRAMA', // 40% gated conditional
  },
};
