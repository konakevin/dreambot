/**
 * DragonBot dragon-breeds path (2026-06-10, NEW). A bestiary hero-portrait of
 * ONE magnificent dragon of a distinct breed — the breed's features are the
 * star. All Western anatomy, varied by element/biome. Default
 * painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'DRAGON_BREEDS',
  pools: {
    breed: 'DRAGON_BREEDS_BREED',
    habitat: 'DRAGON_BREEDS_HABITAT',
    breed_pose: 'DRAGON_BREEDS_POSE',
    element_effect: 'DRAGON_BREEDS_ELEMENT',
    drama: 'DRAGON_BREEDS_DRAMA', // 40% gated conditional
  },
};
