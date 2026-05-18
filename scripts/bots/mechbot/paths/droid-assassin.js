/**
 * MechBot droid-assassin path — declarative form (2026-05-17).
 *
 * Sister path to cyborg-woman with a HARD slant toward KILLER CYBORG / ASSASSIN /
 * ROGUE / MYSTERIOUS / CAPABLE / VIOLENT energy. Same DNA pipeline (rollSharedDNA
 * populates skin/eyes/hair/body/internal/glowColor) but the template register pulls
 * her toward predatory/lethal/shadowed rather than contemplative beauty.
 *
 * Reuses existing pools — assassin slant is template-driven. Can add bespoke pools
 * (assassin_actions / assassin_settings / weapon-housings) in later iterations.
 *
 * Pools (same as cyborg-woman):
 *   - cyborg_feature: CYBORG_FEATURES
 *   - cyborg_material: CYBORG_WOMAN_MATERIAL
 *   - action: CYBORG_ACTIONS
 *   - landscape: CHARACTER_INTERIOR
 *   - composition: CYBORG_WOMAN_COMPOSITION
 *   - drama: CYBORG_WOMAN_DRAMA (40% gated)
 */

module.exports = {
  archetype: 'MECHBOT_DROID_ASSASSIN',
  pools: {
    cyborg_feature: 'CYBORG_FEATURES',
    cyborg_material: 'CYBORG_WOMAN_MATERIAL',
    action: 'KILLER_DROID_ACTIONS',
    landscape: 'NINJA_BOT_SCENES',
    composition: 'KILLER_DROID_COMPOSITION',
    drama: 'CYBORG_WOMAN_DRAMA',
  },
};
