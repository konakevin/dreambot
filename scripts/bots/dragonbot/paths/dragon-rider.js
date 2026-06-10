/**
 * DragonBot dragon-rider path (2026-06-10, NEW declarative form). The iconic
 * fantasy image: a rider mounted on a colossal Western dragon in flight or
 * battle. Dragon + rider co-heroes. Default painted_fantasy_novel medium.
 * MVP-25 pools. (Replaces the old misnamed legacy no-rider flight function;
 * that flight concept now lives in the dragon-flight path.)
 */
module.exports = {
  archetype: 'DRAGON_RIDER',
  pools: {
    dragon: 'DRAGON_RIDER_DRAGON',
    rider: 'DRAGON_RIDER_RIDER',
    action: 'DRAGON_RIDER_ACTION',
    setting: 'DRAGON_RIDER_SETTING',
    mount_detail: 'DRAGON_RIDER_MOUNT_DETAIL',
    drama: 'DRAGON_RIDER_DRAMA', // 40% gated conditional
  },
};
