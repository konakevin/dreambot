/**
 * BrickBot forest path — declarative axis-system form (2026-05-27).
 *
 * Fourth BrickBot path migrated to the bespoke axis composer. PEACEFUL
 * MAGICAL WOODLAND LEGO MOC diorama photography — fairy villages, treehouse
 * hamlets, mushroom cottages, grotto pools, woodland campsites, hobbit-style
 * burrows, with fairy + woodland-creature minifigs.
 *
 * Migration rationale: the legacy compose() form (preserved at
 * paths/legacy/forest.js) rendered PHOTOREAL forests (real birch trunks +
 * leaf-litter — Kevin flagged 2026-05-27) because nature-prose vocabulary in
 * the SUBJECT_INTRO + scene pool + Sonnet elaboration overrode the brick
 * framing. The fix (per BRICKBOT_FOREST archetype + template):
 *   1. EXTRA-STRONG NATURE-HEAVY LEGO MANDATE — every organic element
 *      (trunk / foliage / mushroom / water / moss / rock / sky) is translated
 *      to a NAMED BRICK PART in the template.
 *   2. register axis locks a LEGO woodland heritage (Elvendale / Forestmen /
 *      Fabuland / Heartlake / Ideas-Treehouse) — pins palette + look to brick.
 *   3. build_technique axis shows HOW organic forms are brick-built.
 *   4. Every pool BANS botanical vocab (birch/aspen/bark/leaf-litter/foxfire)
 *      + organic-motion verbs (bending/swaying/in-motion).
 *
 * Axes (9 always-on + 1 conditional, per BRICKBOT_FOREST archetype):
 *   • scene_type         — cozy woodland narrative stage
 *   • minifig_action     — verb-led gentle story beat
 *   • build_technique    — forest-MOC distinguisher (organic→brick) — anti-photoreal lever
 *   • camera_framing     — forest-specific framing
 *   • subject_focus      — STRUCTURE / CREATURE-MOUNT / no-vehicle interior / no-vehicle landscape
 *   • register           — woodland heritage lock (~85% iconic LEGO) — anti-photoreal lever
 *   • scene_props (×2)   — brick-built diorama fill
 *   • lighting           — axis-clean light source/dir/color
 *   • palette            — axis-clean LEGO-coded color combos
 *   • woodland_phenomenon — 50%-gated environmental beat (brick-rendered)
 *
 * No deep-focus promptPrefixByPath — forest KEEPS tilt-shift (per playbook
 * Lesson 1, tilt-shift is Flux's "everything-is-LEGO" structural signal;
 * deep-focus is reserved for the wide-establishing pirates/space paths).
 *
 * Legacy function-form preserved at paths/legacy/forest.js.
 */

module.exports = {
  archetype: 'BRICKBOT_FOREST',
  pools: {
    scene_type: 'BRICKBOT_FOREST_SCENE_TYPE',
    minifig_action: 'BRICKBOT_FOREST_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_FOREST_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_FOREST_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_FOREST_SUBJECT_FOCUS',
    register: 'BRICKBOT_FOREST_REGISTER',
    scene_props: 'BRICKBOT_FOREST_SCENE_PROPS',
    lighting: 'BRICKBOT_FOREST_LIGHTING',
    palette: 'BRICKBOT_FOREST_PALETTE',
    woodland_phenomenon: 'BRICKBOT_FOREST_WOODLAND_PHENOMENON', // 50%-gated conditional
  },
};
