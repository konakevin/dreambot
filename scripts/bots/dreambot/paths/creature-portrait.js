/**
 * ChibiBot creature-portrait path — full-bespoke axis-system (2026-05-20).
 *
 * SOLO CREATURE-AS-HERO tight portrait MAXED with cute outfit + visible
 * accessory + 3 scattered set decorations. Creature fills 60-80% of frame.
 * Hyper-cute marshmallow proportions, oversized dewy eyes, blush cheeks.
 *
 * 12 axes. Default chibibot rotation (no medium lock — both render + pixar work).
 * Skip two-pass polish.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_PORTRAIT',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED' },
    pose: 'CREATURE_PORTRAIT_POSES',
    expression: 'CREATURE_PORTRAIT_EXPRESSIONS',
    portrait_feature: 'CREATURE_PORTRAIT_FEATURES',
    outfit: 'CREATURE_PORTRAIT_OUTFITS',
    accessory: 'CREATURE_PORTRAIT_ACCESSORIES',
    set_decoration: 'CREATURE_PORTRAIT_SET_DECORATIONS',
    background_mood: 'CREATURE_PORTRAIT_BACKGROUNDS',
    time_of_day: 'CREATURE_PORTRAIT_TIME_OF_DAY',
  },
};
