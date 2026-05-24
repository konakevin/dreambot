/**
 * DragonBot male-explorer path — created 2026-05-23.
 *
 * MALE COUNTERPART of female-explorer. Same treatment — cool fitted ornate
 * armor + candid traveling-adventurer scenes (climbing / bridges / paths /
 * drawn-blade stealth / creek-rest / campfire / map) — slanted MASCULINE +
 * GRITTY (weathered battle-worn armor, chest always covered, face-focused
 * skin, no shirtless/cheesecake).
 *
 * Reuses male-adventurer's masculine DNA pools (race / class / skin / eyes /
 * hair / hairstyle / accessory) + gender-neutral landscape / drama / surprise
 * (copied to male_explorer_*, de-birded). Bespoke cool-gritty-armor outfit +
 * adventurous action pools carry the look.
 *
 * 12 axes (8 character DNA incl. face-focused skin + 3 path + drama-40%-gate).
 */

module.exports = {
  archetype: 'DRAGON_MALE_EXPLORER',
  pools: {
    race: 'MALE_EXPLORER_RACE',
    class: 'MALE_EXPLORER_CLASS',
    skin: 'MALE_EXPLORER_SKIN',
    eyes: 'MALE_EXPLORER_EYES',
    hair_color: 'MALE_EXPLORER_HAIR_COLOR',
    hairstyle: 'MALE_EXPLORER_HAIRSTYLE',
    outfit: 'MALE_EXPLORER_OUTFIT',
    accessory: 'MALE_EXPLORER_ACCESSORY',
    action: 'MALE_EXPLORER_ACTION',
    landscape: 'MALE_EXPLORER_LANDSCAPE',
    drama: 'MALE_EXPLORER_DRAMA',
    surprise_element: 'MALE_EXPLORER_SURPRISE_ELEMENT',
  },
};
