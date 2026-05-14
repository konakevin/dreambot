/**
 * DragonBot female-adventurer path — full rebuild 2026-05-14.
 *
 * Replaces female-warrior (deleted). 12-axis split system per the new
 * playbook. NSFW-clean rebuild — no artist callouts (Frazetta/Brom/Vallejo
 * were cheesecake-DNA + NSFW triggers), no "minimal coverage" / "bare
 * midriff" outfit language.
 *
 * Content target: a single fantasy WOMAN of any D&D × LOTR race, any class
 * (rogue / ranger / sorceress / warlock / mage / paladin / warrior / monk /
 * druid / bard / cleric / barbarian / artificer / etc.), out in the wild
 * doing her adventurer thing in SLEEK functional gear — not bulky/massive
 * armor, never cheesecake.
 *
 * Path-bespoke pools (8 × 25 MVP entries):
 *   - class: FEMALE_ADVENTURER_CLASS
 *   - outfit: FEMALE_ADVENTURER_OUTFIT (NSFW-clean, sleek + functional)
 *   - accessory: FEMALE_ADVENTURER_ACCESSORY
 *   - hairstyle: FEMALE_ADVENTURER_HAIRSTYLE (practical adventuring)
 *   - action: FEMALE_ADVENTURER_ACTION (story-rich, non-combat)
 *   - landscape: FEMALE_ADVENTURER_LANDSCAPE (wild fantasy biomes)
 *   - drama: FEMALE_ADVENTURER_DRAMA (40% gated atmospheric event)
 *   - surprise_element: FEMALE_ADVENTURER_SURPRISE_ELEMENT
 *
 * Reused bot-level character DNA pools (already production-sized, clean):
 *   - race: FANTASY_RACE
 *   - skin: WARRIOR_SKIN
 *   - eyes: WARRIOR_EYES
 *   - hair_color: WARRIOR_HAIR_COLOR
 */

module.exports = {
  archetype: 'FEMALE_ADVENTURER',
  pools: {
    // Path-bespoke
    class: 'FEMALE_ADVENTURER_CLASS',
    outfit: 'FEMALE_ADVENTURER_OUTFIT',
    accessory: 'FEMALE_ADVENTURER_ACCESSORY',
    hairstyle: 'FEMALE_ADVENTURER_HAIRSTYLE',
    action: 'FEMALE_ADVENTURER_ACTION',
    landscape: 'FEMALE_ADVENTURER_LANDSCAPE',
    drama: 'FEMALE_ADVENTURER_DRAMA',
    surprise_element: 'FEMALE_ADVENTURER_SURPRISE_ELEMENT',
    // Reused bot-level DNA
    race: 'FANTASY_RACE',
    skin: 'WARRIOR_SKIN',
    eyes: 'WARRIOR_EYES',
    hair_color: 'WARRIOR_HAIR_COLOR',
  },
};
