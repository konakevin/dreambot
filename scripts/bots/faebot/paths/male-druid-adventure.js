/**
 * FaeBot male-druid-adventure path — ADVENTURE/candid register (2026-06-11).
 *
 * The adventure sibling of male-druid: the male elf druid out in the wild
 * (forest path / creek / ledge vista). Full-scene candid action, full/3-4-body
 * figure in the environment. HARD GENDER-LOCK (he/his) + male NSFW guard
 * (chest covered, FACE-only skin).
 *
 * Shares the male_druid character pool + druid_magic + companion, and the
 * gender-neutral adventure axes (setting / action / composition) with
 * female-druid-adventure.
 */

module.exports = {
  archetype: 'FAEBOT_MALE_DRUID_ADVENTURE',
  pools: {
    character: 'FAEBOT_MALE_DRUID',
    adventure_setting: 'FAEBOT_DRUID_ADVENTURE_SETTING',
    adventure_action: 'FAEBOT_DRUID_ADVENTURE_ACTION',
    adventure_composition: 'FAEBOT_DRUID_ADVENTURE_COMPOSITION',
    druid_magic: 'FAEBOT_DRUID_MAGIC',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    companion: 'FAEBOT_DRUID_COMPANION',
  },
};
