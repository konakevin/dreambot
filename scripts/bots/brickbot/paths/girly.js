/**
 * BrickBot girly path — declarative axis-system form (2026-05-27).
 *
 * Twelfth BrickBot path migrated. PASTEL / ULTRA-CUTE / WHIMSICAL all-brick
 * MOC — candy castles, boutiques, unicorns, fairy-ballet, mermaids, sweets.
 * Mini-doll figures welcome.
 *
 * Bespoke design (per BRICKBOT_GIRLY archetype): scene_type + minifig_action +
 * build_technique (heart/flower/star printed-tiles + DOTS-mosaic + SNOT
 * cupcake-domes + trans-pink sparkle + scallop frills) + subject_focus
 * (castle/boutique/unicorn/mermaid) + register (LEGO Friends / DOTS / Elves /
 * fairytale heritage) + scene_props (×2) + girly_phenomenon (sparkle/rainbow/
 * petals, 50%). Bans photoreal + licensed Disney characters (generic fairytale
 * only).
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/girly.js.
 */

module.exports = {
  archetype: 'BRICKBOT_GIRLY',
  pools: {
    scene_type: 'BRICKBOT_GIRLY_SCENE_TYPE',
    minifig_action: 'BRICKBOT_GIRLY_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_GIRLY_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_GIRLY_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_GIRLY_SUBJECT_FOCUS',
    register: 'BRICKBOT_GIRLY_REGISTER',
    scene_props: 'BRICKBOT_GIRLY_SCENE_PROPS',
    lighting: 'BRICKBOT_GIRLY_LIGHTING',
    palette: 'BRICKBOT_GIRLY_PALETTE',
    girly_phenomenon: 'BRICKBOT_GIRLY_PHENOMENON', // 50%-gated conditional
  },
};
