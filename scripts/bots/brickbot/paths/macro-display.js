/**
 * BrickBot macro-display path — declarative axis-system form (2026-05-27).
 *
 * Eleventh BrickBot path migrated. THE COMPLETE-DIORAMA path — a wide
 * pulled-back view of an ENTIRE brick build as a convention masterpiece,
 * baseplate edges visible, the whole scene a complete miniature world.
 *
 * Bespoke design (per BRICKBOT_MACRO_DISPLAY archetype): identity = wide
 * complete-build FRAMING + completeness, not a single theme. Bespoke axes:
 * diorama_theme (the whole world, any theme) + build_scope (scale/complexity
 * signature) + signature_centerpiece (the focal wow) + life_density +
 * baseplate_edge (the bespoke "tabletop build" signal) + surprise_easter_egg
 * (50%). Tilt-shift miniature aesthetic is a FRIEND here (reinforces "complete
 * model"). Bans photoreal/lifelike.
 *
 * No deep-focus promptPrefixByPath — tilt-shift is desired here.
 * Legacy function-form preserved at paths/legacy/macro-display.js.
 */

module.exports = {
  archetype: 'BRICKBOT_MACRO_DISPLAY',
  pools: {
    diorama_theme: 'BRICKBOT_MACRO_DISPLAY_DIORAMA_THEME',
    build_scope: 'BRICKBOT_MACRO_DISPLAY_BUILD_SCOPE',
    signature_centerpiece: 'BRICKBOT_MACRO_DISPLAY_SIGNATURE_CENTERPIECE',
    camera_framing: 'BRICKBOT_MACRO_DISPLAY_CAMERA_FRAMING',
    life_density: 'BRICKBOT_MACRO_DISPLAY_LIFE_DENSITY',
    baseplate_edge: 'BRICKBOT_MACRO_DISPLAY_BASEPLATE_EDGE',
    lighting: 'BRICKBOT_MACRO_DISPLAY_LIGHTING',
    palette: 'BRICKBOT_MACRO_DISPLAY_PALETTE',
    surprise_easter_egg: 'BRICKBOT_MACRO_DISPLAY_SURPRISE_EASTER_EGG', // 50%-gated conditional
  },
};
