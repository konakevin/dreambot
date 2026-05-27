/**
 * BrickBot mech path — declarative axis-system form (2026-05-27).
 *
 * Tenth BrickBot path migrated. GIANT-ROBOT / MECH all-brick MOC — the mech
 * is the hero. Bespoke design (per BRICKBOT_MECH archetype): mech_class
 * (hero) + mech_action (dynamic ball-jointed pose, NOT a T-pose) +
 * build_technique (Technic endoskeleton + ball-joints + CCBS shell + SNOT
 * plating + trans-cyan power-core — the anti-photoreal-CGI lever) + setting +
 * register (LEGO mech heritage: Bionicle / Hero-Factory / Exo-Force / Ninjago
 * / Technic) + scene_props (×2) + mech_phenomenon (muzzle-flash/shield/boost,
 * 50%). Bans photoreal-CGI/metal + T-pose + motion-blur.
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/mech.js.
 */

module.exports = {
  archetype: 'BRICKBOT_MECH',
  pools: {
    mech_class: 'BRICKBOT_MECH_MECH_CLASS',
    mech_action: 'BRICKBOT_MECH_MECH_ACTION',
    build_technique: 'BRICKBOT_MECH_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_MECH_CAMERA_FRAMING',
    setting: 'BRICKBOT_MECH_SETTING',
    register: 'BRICKBOT_MECH_REGISTER',
    scene_props: 'BRICKBOT_MECH_SCENE_PROPS',
    lighting: 'BRICKBOT_MECH_LIGHTING',
    palette: 'BRICKBOT_MECH_PALETTE',
    mech_phenomenon: 'BRICKBOT_MECH_PHENOMENON', // 50%-gated conditional
  },
};
