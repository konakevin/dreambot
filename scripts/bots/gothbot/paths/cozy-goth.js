/**
 * GothBot cozy-goth path — declarative form (2026-05-15 migration).
 *
 * LAYERED WITCH'S-STUDY / CURIO-CABINET / OCCULT-APOTHECARY interiors —
 * warm-dark gothic spaces densely packed with macabre, occult, and
 * magical trinkets. Candlelit libraries / witch's apothecaries / scrying
 * chambers / alchemy laboratories / curio-cabinets / gothic studies.
 *
 * Different from other migrated paths — intimate INTERIOR, warm-dark,
 * peaceful, OBSESSIVELY LAYERED. NO characters.
 *
 * Visual lineage: Crimson Peak / Pan's Labyrinth / Practical Magic /
 * Hocus Pocus / Dracula's library / 19th-c gothic curio-cabinet
 * engravings.
 *
 * Path-bespoke pools (5 × 30 MVP):
 *   - interior_space: GOTHBOT_COZY_GOTH_INTERIOR_SPACE
 *   - magical_glow_item: GOTHBOT_COZY_GOTH_MAGICAL_GLOW_ITEM (pickN: 3)
 *   - occult_artifact: GOTHBOT_COZY_GOTH_OCCULT_ARTIFACT (pickN: 3)
 *   - figure_accent: GOTHBOT_COZY_GOTH_FIGURE_ACCENT (gypsy / vampire / mystic, deep midground scale-prover, 8-15% frame)
 *   - ambient_atmosphere: GOTHBOT_COZY_GOTH_AMBIENT_ATMOSPHERE
 *
 * Universal: LIGHTING + ATMOSPHERES.
 *
 * Pre-refactor file at paths/legacy/cozy-goth.js.
 */

module.exports = {
  archetype: 'GOTHBOT_COZY_GOTH',
  pools: {
    interior_space: 'GOTHBOT_COZY_GOTH_INTERIOR_SPACE',
    magical_glow_item: 'GOTHBOT_COZY_GOTH_MAGICAL_GLOW_ITEM',
    occult_artifact: 'GOTHBOT_COZY_GOTH_OCCULT_ARTIFACT',
    figure_accent: 'GOTHBOT_COZY_GOTH_FIGURE_ACCENT',
    ambient_atmosphere: 'GOTHBOT_COZY_GOTH_AMBIENT_ATMOSPHERE',
  },
};
