/**
 * BrickBot western path — declarative axis-system form (2026-05-27).
 *
 * Ninth BrickBot path migrated. WILD-WEST FRONTIER all-brick MOC — sheriffs,
 * outlaws, cowboys, prospectors, railroad crews; saloons, ghost towns, forts,
 * boom-towns; stagecoaches, locomotives; brick badlands + mesas.
 *
 * Bespoke design (per BRICKBOT_WESTERN archetype): a character + setting path.
 * Bespoke axes: scene_type (frontier stage) + minifig_action (verb-led beat) +
 * build_technique (clapboard false-fronts + SNOT sandstone-mesa strata — the
 * desert-terrain anti-photoreal lever, shared concern with landscape) +
 * subject_focus (saloon/fort/stagecoach/locomotive/mesa) + register (LEGO
 * Western heritage: Cowboys / Fort-Legoredo / Gold-City / railroad) +
 * scene_props (×2) + western_phenomenon (dust/gunsmoke/steam, 50%). RESPECTFUL
 * framing — no Native caricature. Bans photoreal-wood/sand/rock + motion-blur.
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/western.js.
 */

module.exports = {
  archetype: 'BRICKBOT_WESTERN',
  pools: {
    scene_type: 'BRICKBOT_WESTERN_SCENE_TYPE',
    minifig_action: 'BRICKBOT_WESTERN_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_WESTERN_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_WESTERN_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_WESTERN_SUBJECT_FOCUS',
    register: 'BRICKBOT_WESTERN_REGISTER',
    scene_props: 'BRICKBOT_WESTERN_SCENE_PROPS',
    lighting: 'BRICKBOT_WESTERN_LIGHTING',
    palette: 'BRICKBOT_WESTERN_PALETTE',
    western_phenomenon: 'BRICKBOT_WESTERN_PHENOMENON', // 50%-gated conditional
  },
};
