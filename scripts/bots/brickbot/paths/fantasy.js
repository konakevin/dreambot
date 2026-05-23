/**
 * BrickBot fantasy path — declarative axis-system form (2026-05-22).
 *
 * Third BrickBot path migrated. LEGO Castle MOC diorama photography
 * across iconic LEGO Castle lineage (Crusaders / Forestmen / Black
 * Knights / Royal Knights / Dragon Knights / Lion+Dragon Kingdoms /
 * Skeleton King / Castle 2013 / LEGO Elves) + LotR/Hobbit + LEGO D&D
 * + Bricklink AFOL Castle MOC community.
 *
 * 9 always-on slots + 1 conditional (magical_phenomenon 50% gate):
 *   • scene_type        — narrative stage
 *   • minifig_action    — verb-led story beat
 *   • build_technique   — AFOL MOC distinguisher
 *   • camera_framing    — fantasy-specific framing
 *   • subject_focus     — silhouette anchor (mount / structure / no-vehicle interior / no-vehicle landscape)
 *   • register          — era+faction lock (~80% iconic LEGO Castle / ~15% LotR+D&D / ~5% specialty)
 *   • scene_props (×2)  — diorama fill
 *   • lighting          — axis-clean light source/dir/color
 *   • palette           — axis-clean color combos
 *   • magical_phenomenon — 50%-gated environmental drama
 *
 * NEVER LEGO Star Wars / Harry Potter. Hard-SF realism out of scope.
 *
 * Legacy function-form preserved at paths/legacy/fantasy.js.
 */

module.exports = {
  archetype: 'BRICKBOT_FANTASY',
  pools: {
    scene_type: 'BRICKBOT_FANTASY_SCENE_TYPE',
    minifig_action: 'BRICKBOT_FANTASY_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_FANTASY_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_FANTASY_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_FANTASY_SUBJECT_FOCUS',
    register: 'BRICKBOT_FANTASY_REGISTER',
    scene_props: 'BRICKBOT_FANTASY_SCENE_PROPS',
    lighting: 'BRICKBOT_FANTASY_LIGHTING',
    palette: 'BRICKBOT_FANTASY_PALETTE',
    magical_phenomenon: 'BRICKBOT_FANTASY_MAGICAL_PHENOMENON', // 50%-gated
  },
};
