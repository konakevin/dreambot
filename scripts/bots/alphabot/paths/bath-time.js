/**
 * ChibiBot bath-time path — lean 6-axis rebuild (2026-06-05).
 *
 * Replaces the 11-axis stack that was pushing the bath vessel out of frame
 * in favor of spectacle locations + phenomena + sensory amplifiers + stacked
 * mandates. Now: creature(s) + setting + lighting + 2 decorations. That's it.
 *
 * Axes:
 *   creature_1                                  always
 *   setting (BATH_TIME_SCENES)                  always — vessel + location
 *   lighting (BATH_TIME_LIGHTING)               always — time/source/cast in one line
 *   set_decorations (BATH_TIME_DECORATIONS x2)  always — cozy bath props
 *   creature_2 + creature_3                     conditional 60% (composer-level)
 *                                               template includes creature_3 only 25% of
 *                                               the times the pair fires → ~40/45/15
 *                                               solo/pair/trio split
 *
 * Sensory anchors disabled for this path (creature_1 already carries the
 * creature DNA; the anchors compounded into bubble-creature renders).
 * Chaos disabled (every perturbation pushes the bath vessel further out
 * of focus). twoPassPolish skip already in place.
 */

module.exports = {
  archetype: 'CHIBIBOT_BATH_TIME',
  pools: {
    creature_1: { name: 'CUTE_CREATURES_UNIFIED' },
    setting: 'BATH_TIME_SCENES',
    lighting: 'BATH_TIME_LIGHTING',
    set_decorations: 'BATH_TIME_DECORATIONS',
    signature_detail: 'BATH_TIME_SIGNATURE',
    // creature_2 + creature_3 resolved via archetype.conditionalLayer.pools
  },
};
