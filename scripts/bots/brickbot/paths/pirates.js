/**
 * BrickBot pirates path — declarative axis-system form (2026-05-22).
 *
 * First BrickBot path migrated to the bespoke axis composer. LEGO MOC
 * pirate diorama photography — AFOL convention build tier, NOT official
 * set photos. Canon: Pirates of the Caribbean LEGO sets + Bricklink AFOL
 * pirate dioramas + Treasure Island + Master & Commander.
 *
 * Axes (9 always-on + 1 conditional, per BRICKBOT_PIRATES archetype):
 *   • scene_type        — narrative stage only
 *   • minifig_action    — verb-led story beat (STORY BEAT MANDATE)
 *   • build_technique   — AFOL MOC distinguisher
 *   • camera_framing    — pirate-specific framing (replaces shared camera axis)
 *   • ship_class        — silhouette/rigging bender
 *   • register          — era+faction bender (~60% Caribbean / 40% non-default)
 *   • scene_props (×2)  — diorama fill detail
 *   • lighting          — axis-clean light source/dir/color
 *   • palette           — axis-clean color combos
 *   • weather_drama     — 50%-gated environmental drama (decoupled from scene_type)
 *
 * Bending advantage over legacy 4-axis (scene+camera+lighting+palette):
 * scene_type / weather_drama / register are all independently rolled, so
 * unique permutations like "kraken-attack + glass-calm sea + golden-hour"
 * or "Norse longship + Viking-raid + thick-fog" become rollable. Legacy
 * scene pool conflated framing+setting+action+cast — split here for
 * combinatorial diversity.
 *
 * Legacy function-form preserved at paths/legacy/pirates.js.
 *
 * See:
 *   - scripts/bots/brickbot/archetypes.js          (BRICKBOT_PIRATES slots)
 *   - scripts/bots/brickbot/archetype-templates.js (brief template)
 *   - scripts/bots/brickbot/index.js               (dispatcher + poolByName)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md                (migration recipe)
 */

module.exports = {
  archetype: 'BRICKBOT_PIRATES',
  pools: {
    scene_type: 'BRICKBOT_PIRATES_SCENE_TYPE',
    minifig_action: 'BRICKBOT_PIRATES_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_PIRATES_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_PIRATES_CAMERA_FRAMING',
    ship_class: 'BRICKBOT_PIRATES_SHIP_CLASS',
    register: 'BRICKBOT_PIRATES_REGISTER',
    scene_props: 'BRICKBOT_PIRATES_SCENE_PROPS',
    lighting: 'BRICKBOT_PIRATES_LIGHTING',
    palette: 'BRICKBOT_PIRATES_PALETTE',
    weather_drama: 'BRICKBOT_PIRATES_WEATHER_DRAMA', // 50%-gated conditional
  },
};
