/**
 * DragonBot male-adventurer path — full bespoke male rebuild (2026-05-14).
 *
 * Mirror of female-adventurer architecture, completely bespoke male pools
 * (no sharing with female pools per Kevin's directive). Replaces legacy
 * male-warrior path (function-based slot-pool form).
 *
 * Content target: a single fantasy MAN of any D&D × LOTR race, any class
 * (rogue / ranger / sorcerer / warlock / mage / paladin / warrior / monk /
 * druid / bard / cleric / barbarian / artificer / etc.), out in the wild
 * doing his adventurer thing in SLEEK functional gear — not bulky/massive
 * armor, NSFW-clean (no shirtless / cheesecake). Beards allowed for races
 * where canon-appropriate (dwarves / humans / half-orcs / etc.).
 *
 * 12 path-bespoke pools at MVP 25:
 *   - race / class / skin / eyes / hair_color / hairstyle / outfit /
 *     accessory / action / landscape / drama (40% gated) / surprise_element
 */

module.exports = {
  archetype: 'MALE_ADVENTURER',
  pools: {
    race: 'MALE_ADVENTURER_RACE',
    class: 'MALE_ADVENTURER_CLASS',
    skin: 'MALE_ADVENTURER_SKIN',
    eyes: 'MALE_ADVENTURER_EYES',
    hair_color: 'MALE_ADVENTURER_HAIR_COLOR',
    hairstyle: 'MALE_ADVENTURER_HAIRSTYLE',
    outfit: 'MALE_ADVENTURER_OUTFIT',
    accessory: 'MALE_ADVENTURER_ACCESSORY',
    action: 'MALE_ADVENTURER_ACTION',
    landscape: 'MALE_ADVENTURER_LANDSCAPE',
    drama: 'MALE_ADVENTURER_DRAMA',
    surprise_element: 'MALE_ADVENTURER_SURPRISE_ELEMENT',
  },
};
