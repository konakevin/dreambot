/**
 * DragonBot artsy-girl path.
 *
 * 2026-05-13 — Started as a snapshot clone of female-warrior at the
 * Frazetta-cheesecake-cover state Kevin loved. Phase 2 split the single
 * outfit axis into independent armor_style + weapon axes for
 * combinatorial variety (30 × 30 = 900 unique pairings vs. 30 fixed pairs).
 *
 * Bespoke pools:
 *   - armor_style: ARTSY_GIRL_ARMOR_STYLE (the outfit, no weapon)
 *   - weapon: ARTSY_GIRL_WEAPON (signature weapon, rolled independently)
 *   - action: ARTSY_GIRL_ACTION (peaceful candid moments)
 *   - landscape: ARTSY_GIRL_LANDSCAPE (fantasy biomes)
 *   - drama: ARTSY_GIRL_DRAMA (40% gated)
 *   - surprise_element: ARTSY_GIRL_SURPRISE_ELEMENT
 *
 * Reused character DNA pools (shared with female-warrior):
 *   - race: FANTASY_RACE
 *   - skin: WARRIOR_SKIN
 *   - eyes: WARRIOR_EYES
 *   - hair_color: WARRIOR_HAIR_COLOR
 *   - hairstyle: FEMALE_WARRIOR_HAIRSTYLES
 *   - accessory: FEMALE_WARRIOR_ACCESSORIES
 *   - warrior_archetype: FEMALE_WARRIORS
 */

module.exports = {
  archetype: 'ARTSY_GIRL',
  pools: {
    // Path-bespoke pools
    action: 'ARTSY_GIRL_ACTION',
    landscape: 'ARTSY_GIRL_LANDSCAPE',
    drama: 'ARTSY_GIRL_DRAMA',
    surprise_element: 'ARTSY_GIRL_SURPRISE_ELEMENT',
    warrior_archetype: 'FEMALE_WARRIORS',
    // Character DNA pools
    race: 'FANTASY_RACE',
    skin: 'WARRIOR_SKIN',
    eyes: 'WARRIOR_EYES',
    hair_color: 'WARRIOR_HAIR_COLOR',
    hairstyle: 'FEMALE_WARRIOR_HAIRSTYLES',
    armor_style: 'ARTSY_GIRL_ARMOR_STYLE',
    weapon: 'ARTSY_GIRL_WEAPON',
    accessory: 'FEMALE_WARRIOR_ACCESSORIES',
  },
};
