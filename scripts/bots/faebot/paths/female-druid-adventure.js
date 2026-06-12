/**
 * FaeBot female-druid-adventure path — ADVENTURE/candid register (2026-06-11).
 *
 * The adventure sibling of female-druid: the elf druid OUT IN THE WORLD —
 * exploring the forest, at a creek/lake edge, surveying from a ledge over the
 * canopy. Full-scene candid action (front-loaded), full/3-4-body figure in the
 * environment — NOT a tight portrait.
 *
 * Shares the female_druid character pool + druid_magic + companion with the
 * intimate female-druid path; uses the gender-neutral adventure axes
 * (setting / action / composition) shared with male-druid-adventure.
 */

module.exports = {
  archetype: 'FAEBOT_FEMALE_DRUID_ADVENTURE',
  pools: {
    character: 'FAEBOT_FEMALE_DRUID',
    adventure_setting: 'FAEBOT_DRUID_ADVENTURE_SETTING',
    adventure_action: 'FAEBOT_DRUID_ADVENTURE_ACTION',
    adventure_composition: 'FAEBOT_DRUID_ADVENTURE_COMPOSITION',
    druid_magic: 'FAEBOT_DRUID_MAGIC',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    companion: 'FAEBOT_DRUID_COMPANION',
  },
};
