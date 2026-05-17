/**
 * MechBot cyborg-woman path — declarative form (2026-05-17).
 *
 * Eighth MechBot path on the declarative composer. Migrated from legacy
 * function-form brief. The character DNA (characterBase / skin / bodyType /
 * eyes / hair / internal / glowColor) continues to come from
 * bot.rollSharedDNA() (which already populates these when path ===
 * 'cyborg-woman') — the template reads them via sharedDNA. Only 4 path
 * slots + 1 conditional drama need explicit pool wiring.
 *
 * Identity preserved from legacy:
 *   - Half-human half-machine being (Ex Machina / Alita energy)
 *   - Beautiful + terrifying — human face MANDATORY (always part-cyborg, never 100% organic)
 *   - 60% closeup detail-shots / 40% full-body action-shots (handled via mixed composition pool)
 *   - Multi-cyborg-reveal mandate (translucent panels / chrome joints / circuit-veins / power-core / temple-ports)
 *   - Solo composition
 *   - Banned: skulls / skeletons / full-body armor / high heels / floating objects
 *
 * Pools:
 *   - cyborg_feature: CYBORG_FEATURES (existing, dominant mechanical feature)
 *   - action: CYBORG_ACTIONS (existing)
 *   - landscape: CHARACTER_INTERIOR (existing setting pool)
 *   - composition: NEW CYBORG_WOMAN_COMPOSITION (mixed closeup + full-body framings)
 *   - drama: NEW CYBORG_WOMAN_DRAMA (40%-gated atmospheric flourishes)
 *
 * Pre-migration function-form brief preserved at paths/legacy/cyborg-woman.js.
 */

module.exports = {
  archetype: 'MECHBOT_CYBORG_WOMAN',
  pools: {
    cyborg_feature: 'CYBORG_FEATURES',
    cyborg_material: 'CYBORG_WOMAN_MATERIAL', // 2026-05-17: dedicated material/finish axis for variety (chrome / brass / pearl / xenomaterial / composite / etc.)
    action: 'CYBORG_ACTIONS',
    landscape: 'CHARACTER_INTERIOR',
    composition: 'CYBORG_WOMAN_COMPOSITION',
    drama: 'CYBORG_WOMAN_DRAMA', // 40% gated conditional
  },
};
