/**
 * BrickBot theme-park path — declarative axis-system form (2026-05-27).
 *
 * Eighth BrickBot path migrated. AMUSEMENT-PARK + CARNIVAL all-brick MOC —
 * working brick rides as hero structures, crowds of tiny minifigs in motion,
 * trans-element neon, fireworks.
 *
 * Bespoke design (per BRICKBOT_THEME_PARK archetype): kinetic spectacle +
 * crowds. Bespoke axes: attraction (the hero ride), crowd_action (verb-led
 * fun beat), a fairground build_technique (Technic-working-ride + GBC-motion
 * + trans-element neon), register (LEGO Creator Fairground heritage),
 * scene_life (×2 stalls/carts/vendors), and a spectacle phenomenon
 * (fireworks/light-show). Per-element brick mandate keeps rides/lights/water
 * as named parts; bans photoreal + motion-blur (motion is a frozen brick
 * moment).
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/theme-park.js.
 */

module.exports = {
  archetype: 'BRICKBOT_THEME_PARK',
  pools: {
    attraction: 'BRICKBOT_THEME_PARK_ATTRACTION',
    crowd_action: 'BRICKBOT_THEME_PARK_CROWD_ACTION',
    build_technique: 'BRICKBOT_THEME_PARK_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_THEME_PARK_CAMERA_FRAMING',
    register: 'BRICKBOT_THEME_PARK_REGISTER',
    scene_life: 'BRICKBOT_THEME_PARK_SCENE_LIFE',
    lighting: 'BRICKBOT_THEME_PARK_LIGHTING',
    palette: 'BRICKBOT_THEME_PARK_PALETTE',
    spectacle: 'BRICKBOT_THEME_PARK_SPECTACLE', // 50%-gated conditional
  },
};
