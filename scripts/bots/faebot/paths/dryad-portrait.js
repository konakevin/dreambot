/**
 * FaeBot dryad-portrait path — declarative axis-system form (2026-05-21).
 *
 * THE SOUL OF THE PATH:
 *   TIGHT close-up portrait (face 35-60% of frame) of an adult-scale
 *   tree-bound dryad / hamadryad / naiad / meliae / moss-maiden /
 *   Leshy. Intimate STILLNESS register — face turned 3/4 or profile,
 *   eyes lowered, NEVER eye-contact, NEVER posing.
 *
 * DISTINCT from sibling paths:
 *   - forest-fairy-scene: medium-shot/full-figure, action-oriented
 *   - flower-fairy: smaller-than-human, flowers as home
 *   - tiny-fae: palm-sized + dwarfing companion mandatory
 *   - dryad-portrait: TIGHT bust portrait, intimate stillness, NO companion
 *
 * 10 AXES (9 always-on + 1 gated foreground_anchor):
 *   - creature: species + skin + hair + garment + antlers/wings +
 *     magical signature (features only, NO posture)
 *   - expression_moment: face + eyes state
 *   - gesture_pose: hand/shoulder pose
 *   - portrait_composition: framing spec
 *   - adornment: woven into hair / face
 *   - forest_backdrop: soft-focus forest behind
 *   - lighting: close-portrait lighting
 *   - weather: air condition near her
 *   - magical_flavor: magic at her face/shoulders
 *   - foreground_anchor (40%-gated): closest depth element
 *
 * Color-tag system: SKIP — earth-tone-dominant creature palette has
 * no clash risk. Two-pass polish: ON (portrait is subject-dominant,
 * polish-safe — unlike scale-mandate paths).
 */

module.exports = {
  archetype: 'FAEBOT_DRYAD_PORTRAIT',
  pools: {
    creature: 'FAEBOT_DRYAD_PORTRAIT_CREATURE',
    expression_moment: 'FAEBOT_DRYAD_PORTRAIT_EXPRESSION_MOMENT',
    gesture_pose: 'FAEBOT_DRYAD_PORTRAIT_GESTURE_POSE',
    portrait_composition: 'FAEBOT_DRYAD_PORTRAIT_COMPOSITION',
    adornment: 'FAEBOT_DRYAD_PORTRAIT_ADORNMENT',
    forest_backdrop: 'FAEBOT_DRYAD_PORTRAIT_FOREST_BACKDROP',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    weather: 'FAEBOT_DRYAD_PORTRAIT_WEATHER',
    magical_flavor: 'FAEBOT_DRYAD_PORTRAIT_MAGICAL_FLAVOR',
    foreground_anchor: 'FAEBOT_DRYAD_PORTRAIT_FOREGROUND_ANCHOR',
  },
};
