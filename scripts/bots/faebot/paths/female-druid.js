/**
 * FaeBot female-druid path — INTIMATE register (2026-06-11, MVP).
 *
 * THE SOUL OF THE PATH:
 *   The forest's DEFENDER — a female ELF nature-warrior-mage (night-elf /
 *   wood-elf / high-elf / blood-elf / dusk-elf / LOTR-silvan lineages).
 *   Capable, agile, magical, stylish. Distinct from the gentle faes and the
 *   ancient bark forest-elders. Intimate posed half-body/bust portrait —
 *   the counterpart to dryad-portrait, but a warrior-mage, not a tree-spirit.
 *
 * Lean-COVERED, tasteful (no cheesecake). Companion (spirit-animal) 40%-gated.
 *
 * MVP wiring: reuses the dryad moonlit forest_backdrop + lighting pools so the
 * CHARACTER look + register can be validated first. Bespoke druid scene axes
 * (pose / expression / composition / setting) come after sign-off, plus the
 * sibling female-druid-adventure path and the male pair.
 *
 * Character pool is generated via the weighted subThemes mechanism (elven
 * lineages) so race variety holds at scale.
 */

module.exports = {
  archetype: 'FAEBOT_FEMALE_DRUID',
  pools: {
    character: 'FAEBOT_FEMALE_DRUID',
    hair: 'FAEBOT_DRUID_HAIR',
    outfit: 'FAEBOT_DRUID_OUTFIT',
    pose: 'FAEBOT_DRUID_POSE',
    backdrop: 'FAEBOT_DRYAD_PORTRAIT_FOREST_BACKDROP',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    companion: 'FAEBOT_DRUID_COMPANION',
  },
};
