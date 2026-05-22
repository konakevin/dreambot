/**
 * BrickBot space path — declarative axis-system form (2026-05-22).
 *
 * Second BrickBot path migrated to the bespoke axis composer. LEGO Space
 * MOC diorama photography across the iconic LEGO Space lineage (Classic
 * Space 1978-87 / Blacktron / M-Tron / Space Police / Ice Planet /
 * Insectoids / Mars Mission / Galaxy Squad / LEGO Star Wars) + hard-SF
 * canon (Expanse / Mass Effect / 2001 ASO / Tintin retro / Star Citizen).
 *
 * Axes (9 always-on + 1 conditional, per BRICKBOT_SPACE archetype):
 *   • scene_type        — narrative stage only
 *   • minifig_action    — verb-led story beat
 *   • build_technique   — space-MOC distinguisher
 *   • camera_framing    — space-specific framing
 *   • vehicle_class     — silhouette bender (includes "no-vehicle interior")
 *   • register          — era+faction lock (~45% Classic-LEGO-Space + cousins / ~55% non-default)
 *   • scene_props (×2)  — diorama fill detail
 *   • lighting          — axis-clean light source/dir/color (cool/violet weighted)
 *   • palette           — axis-clean color combos (Classic-Space / Blacktron / M-Tron etc.)
 *   • cosmic_phenomenon — 50%-gated environmental drama (decoupled from scene_type)
 *
 * Bending advantage: register + cosmic_phenomenon decoupled from scene_type,
 * so unique permutations like "asteroid mining + Classic-LEGO-Space register
 * + cosmic-dust-cloud" and "EVA + Mass-Effect register + event-horizon-pull"
 * are rollable. Legacy 4-axis form couldn't reach these.
 *
 * Carries the deep-focus promptPrefixByPath from pirates (cinematic
 * widescreen establishing framing) — testing how it behaves on sci-fi
 * backdrops (different photoreal-drift tendency than pirate harbors).
 *
 * Legacy function-form preserved at paths/legacy/space.js.
 */

module.exports = {
  archetype: 'BRICKBOT_SPACE',
  pools: {
    scene_type: 'BRICKBOT_SPACE_SCENE_TYPE',
    minifig_action: 'BRICKBOT_SPACE_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_SPACE_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_SPACE_CAMERA_FRAMING',
    vehicle_class: 'BRICKBOT_SPACE_VEHICLE_CLASS',
    register: 'BRICKBOT_SPACE_REGISTER',
    scene_props: 'BRICKBOT_SPACE_SCENE_PROPS',
    lighting: 'BRICKBOT_SPACE_LIGHTING',
    palette: 'BRICKBOT_SPACE_PALETTE',
    cosmic_phenomenon: 'BRICKBOT_SPACE_COSMIC_PHENOMENON', // 50%-gated conditional
  },
};
