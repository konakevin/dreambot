/**
 * BrickBot winter path — declarative axis-system form (2026-05-27).
 *
 * Sixth BrickBot path migrated to the bespoke axis composer. SNOW + ICE
 * LEGO MOC diorama photography — cozy alpine villages, ski resorts, frozen
 * lakes, ice castles, igloo camps, polar research, frozen waterfalls,
 * blizzard rescues, hot-cocoa cabin interiors, husky-sled runs.
 *
 * Bespoke design (per BRICKBOT_WINTER archetype): snow + ice are among
 * Flux's strongest photoreal priors, so winter gets a dedicated
 * snow_ice_build_technique axis (the anti-photoreal-snow lever) + the
 * template's per-element brick mandate translating every snowdrift /
 * icicle / frozen-lake / blizzard into NAMED BRICK PARTS. Every pool bans
 * photoreal-snow/ice vocab + non-rigid motion verbs (drifting/swirling).
 *
 * Axes (9 always-on + 1 conditional):
 *   • scene_type           — winter narrative stage
 *   • minifig_action       — verb-led winter story beat
 *   • snow_ice_build_technique — bespoke snow/ice/frozen-water brick construction
 *   • camera_framing       — winter-specific framing
 *   • subject_focus        — STRUCTURE / CREATURE-MOUNT / no-vehicle interior / no-vehicle landscape
 *   • register             — winter heritage lock (~85% iconic LEGO: Winter-Village / City-Arctic / Friends-winter / Creator-cabin / classic-alpine)
 *   • scene_props (×2)     — brick-built diorama fill
 *   • lighting             — window-glow / alpine-sunset / aurora / hearth / bluebird-day
 *   • palette              — axis-clean LEGO-coded winter palettes
 *   • winter_phenomenon    — 50%-gated environmental beat (brick-rendered)
 *
 * No deep-focus promptPrefixByPath — winter keeps tilt-shift (Flux's
 * "everything-is-LEGO" structural signal per playbook Lesson 1).
 *
 * Legacy function-form preserved at paths/legacy/winter.js.
 */

module.exports = {
  archetype: 'BRICKBOT_WINTER',
  pools: {
    scene_type: 'BRICKBOT_WINTER_SCENE_TYPE',
    minifig_action: 'BRICKBOT_WINTER_MINIFIG_ACTION',
    snow_ice_build_technique: 'BRICKBOT_WINTER_SNOW_ICE_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_WINTER_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_WINTER_SUBJECT_FOCUS',
    register: 'BRICKBOT_WINTER_REGISTER',
    scene_props: 'BRICKBOT_WINTER_SCENE_PROPS',
    lighting: 'BRICKBOT_WINTER_LIGHTING',
    palette: 'BRICKBOT_WINTER_PALETTE',
    winter_phenomenon: 'BRICKBOT_WINTER_PHENOMENON', // 50%-gated conditional
  },
};
