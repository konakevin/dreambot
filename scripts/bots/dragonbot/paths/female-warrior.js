/**
 * DragonBot female-warrior path — declarative form (2026-05-14).
 *
 * Second DragonBot path migrated to the new bespoke biome+axes system,
 * applying the dragon-scene canonical reference pattern to a character
 * path. Character is hero at 25-40% frame in candid peaceful moment.
 * Full character DNA stack (7 axes) + 4 path-bespoke pools.
 *
 * Path-bespoke pools (4 × 30 entries = Stage 1 MVP):
 *   - action: FEMALE_WARRIOR_ACTION (peaceful candid / adventuring moments)
 *   - landscape: FEMALE_WARRIOR_LANDSCAPE (fantasy biomes as her stage)
 *   - drama: FEMALE_WARRIOR_DRAMA (40% gated atmospheric event)
 *   - surprise_element: FEMALE_WARRIOR_SURPRISE_ELEMENT (tiny secondary subject)
 *
 * Reused character DNA pools (already production-sized from legacy):
 *   - race: FANTASY_RACE
 *   - skin: WARRIOR_SKIN
 *   - eyes: WARRIOR_EYES
 *   - hair_color: WARRIOR_HAIR_COLOR
 *   - hairstyle: FEMALE_WARRIOR_HAIRSTYLES
 *   - outfit: FEMALE_OUTFITS
 *   - accessory: FEMALE_WARRIOR_ACCESSORIES
 *   - warrior_archetype: FEMALE_WARRIORS
 *
 * Pre-refactor file preserved at paths/legacy/female-warrior.js.
 */

module.exports = {
  archetype: 'FEMALE_WARRIOR',
  pools: {
    // Path-bespoke pools
    action: 'FEMALE_WARRIOR_ACTION',
    landscape: 'FEMALE_WARRIOR_LANDSCAPE',
    drama: 'FEMALE_WARRIOR_DRAMA', // 40% gated conditional
    surprise_element: 'FEMALE_WARRIOR_SURPRISE_ELEMENT',
    warrior_archetype: 'FEMALE_WARRIORS',
    // Character DNA pools (reused from legacy — already production-sized)
    race: 'FANTASY_RACE',
    skin: 'WARRIOR_SKIN',
    eyes: 'WARRIOR_EYES',
    hair_color: 'WARRIOR_HAIR_COLOR',
    hairstyle: 'FEMALE_WARRIOR_HAIRSTYLES',
    outfit: 'FEMALE_OUTFITS',
    accessory: 'FEMALE_WARRIOR_ACCESSORIES',
  },
};
