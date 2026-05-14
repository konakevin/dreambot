/**
 * DragonBot female-action-scenes path — full clone of female-adventurer
 * (2026-05-14), then massaged into PURE ACTION energy: mages mid-spell
 * with explosions, ranger mid-loose with arrow streaking, rogue sneaking
 * through busy night market, paladin mid-strike with divine light,
 * sorceress at the apex of a summon, druid mid-shape-shift, warlock
 * eldritch blast — alive, motion-blurred, effect-rich.
 *
 * Architecture is bit-for-bit female-adventurer with:
 *  - Own FEMALE_ACTION_SCENES archetype + template
 *  - Own 9 path-bespoke pool clones (so action / drama / landscape can
 *    diverge from female-adventurer over time without disturbing it)
 *  - Same gender-locked, NSFW-clean, sleek-gear constraints
 *  - Same empty promptPrefixByPath (the wrapper-strip diversity unlock)
 *
 * The KEY difference: female_action_scenes_action pool is rewritten for
 * pure-action mid-moment cinematic beats with magical effects, motion,
 * dynamic combat-adjacent energy. The other pools stay close to
 * female-adventurer's content but can drift later as iteration warrants.
 */

module.exports = {
  archetype: 'FEMALE_ACTION_SCENES',
  pools: {
    // Path-bespoke (cloned from female-adventurer; action will be rewritten)
    class: 'FEMALE_ACTION_SCENES_CLASS',
    outfit: 'FEMALE_ACTION_SCENES_OUTFIT',
    accessory: 'FEMALE_ACTION_SCENES_ACCESSORY',
    hairstyle: 'FEMALE_ACTION_SCENES_HAIRSTYLE',
    action: 'FEMALE_ACTION_SCENES_ACTION',
    landscape: 'FEMALE_ACTION_SCENES_LANDSCAPE',
    drama: 'FEMALE_ACTION_SCENES_DRAMA',
    surprise_element: 'FEMALE_ACTION_SCENES_SURPRISE_ELEMENT',
    race: 'FEMALE_ACTION_SCENES_RACE',
    // Reused bot-level DNA
    skin: 'WARRIOR_SKIN',
    eyes: 'WARRIOR_EYES',
    hair_color: 'WARRIOR_HAIR_COLOR',
  },
};
