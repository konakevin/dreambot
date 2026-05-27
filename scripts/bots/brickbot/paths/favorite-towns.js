/**
 * BrickBot favorite-towns path — declarative axis-system form (2026-05-27).
 *
 * BIT-FOR-BIT CLONE of the macro-display path at its hearted deep-focus state,
 * forked into its own path so Kevin can iterate on it independently without
 * touching macro-display. Identical archetype + template + pools + deep-focus
 * prompt-prefix to start; will diverge as we build on it.
 *
 * Same axes as macro-display: diorama_theme + build_scope +
 * signature_centerpiece + camera_framing + life_density + baseplate_edge +
 * lighting + palette + surprise_easter_egg (50%-gated).
 *
 * Deep-focus promptPrefixByPath['favorite-towns'] mirrors macro-display's
 * hearted prefix (in index.js). Legacy: none (born as an axis path).
 */

module.exports = {
  archetype: 'BRICKBOT_FAVORITE_TOWNS',
  pools: {
    diorama_theme: 'BRICKBOT_FAVORITE_TOWNS_DIORAMA_THEME',
    build_scope: 'BRICKBOT_FAVORITE_TOWNS_BUILD_SCOPE',
    signature_centerpiece: 'BRICKBOT_FAVORITE_TOWNS_SIGNATURE_CENTERPIECE',
    camera_framing: 'BRICKBOT_FAVORITE_TOWNS_CAMERA_FRAMING',
    life_density: 'BRICKBOT_FAVORITE_TOWNS_LIFE_DENSITY',
    baseplate_edge: 'BRICKBOT_FAVORITE_TOWNS_BASEPLATE_EDGE',
    lighting: 'BRICKBOT_FAVORITE_TOWNS_LIGHTING',
    palette: 'BRICKBOT_FAVORITE_TOWNS_PALETTE',
    surprise_easter_egg: 'BRICKBOT_FAVORITE_TOWNS_SURPRISE_EASTER_EGG', // 50%-gated conditional
  },
};
