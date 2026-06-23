/**
 * FaeBot male-druid path — INTIMATE register (2026-06-11).
 *
 * Male counterpart to female-druid: a male ELF nature-warrior-mage (same
 * lineages via subThemes). HARD GENDER-LOCK (he/his) + male NSFW guard
 * (chest always named-covered, FACE-only skin — anti-beefcake). Intimate
 * posed half-body/bust portrait.
 *
 * MVP wiring reuses the dryad moonlit backdrop + lighting; companion shared.
 */

module.exports = {
  archetype: 'FAEBOT_MALE_DRUID',
  pools: {
    character: 'FAEBOT_MALE_DRUID',
    hair: 'FAEBOT_DRUID_HAIR',
    outfit: 'FAEBOT_DRUID_OUTFIT',
    pose: 'FAEBOT_DRUID_POSE',
    backdrop: 'FAEBOT_DRYAD_PORTRAIT_FOREST_BACKDROP',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    companion: 'FAEBOT_DRUID_COMPANION',
  },
};
