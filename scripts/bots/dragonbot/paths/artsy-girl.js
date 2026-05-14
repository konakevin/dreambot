/**
 * DragonBot artsy-girl path — frozen snapshot (2026-05-13).
 *
 * EXACT CLONE of female-warrior at the moment it was producing
 * Frazetta-cheesecake painted-fantasy-cover renders that Kevin loved
 * (R3 batch: lkz161 / zi3xxo / 94utqp / pqgzmb / madto1). The clone
 * captures the FULL state — archetype, template, pools, and path-prefix
 * wrapper — so that ongoing female-warrior tuning never disturbs this
 * aesthetic.
 *
 * Bespoke pools (cloned, independent from female_warrior_*):
 *   - action: ARTSY_GIRL_ACTION
 *   - landscape: ARTSY_GIRL_LANDSCAPE
 *   - drama: ARTSY_GIRL_DRAMA (40% gated)
 *   - surprise_element: ARTSY_GIRL_SURPRISE_ELEMENT
 *   - outfit: ARTSY_GIRL_OUTFIT (path-bespoke)
 *
 * Reused character DNA pools (shared with female-warrior — these are
 * shared on purpose, they're the lineage DNA stack used across the bot):
 *   - race: FANTASY_RACE
 *   - skin: WARRIOR_SKIN
 *   - eyes: WARRIOR_EYES
 *   - hair_color: WARRIOR_HAIR_COLOR
 *   - hairstyle: FEMALE_WARRIOR_HAIRSTYLES
 *   - accessory: FEMALE_WARRIOR_ACCESSORIES
 *   - warrior_archetype: FEMALE_WARRIORS
 *
 * Archetype + template are CLONED (ARTSY_GIRL) so they're locked.
 * Path-prefix wrapper in dragonbot/index.js is cloned exactly.
 */

module.exports = {
  archetype: 'ARTSY_GIRL',
  pools: {
    // Path-bespoke pools (cloned, frozen)
    action: 'ARTSY_GIRL_ACTION',
    landscape: 'ARTSY_GIRL_LANDSCAPE',
    drama: 'ARTSY_GIRL_DRAMA',
    surprise_element: 'ARTSY_GIRL_SURPRISE_ELEMENT',
    warrior_archetype: 'FEMALE_WARRIORS',
    // Character DNA pools (shared with female-warrior)
    race: 'FANTASY_RACE',
    skin: 'WARRIOR_SKIN',
    eyes: 'WARRIOR_EYES',
    hair_color: 'WARRIOR_HAIR_COLOR',
    hairstyle: 'FEMALE_WARRIOR_HAIRSTYLES',
    outfit: 'ARTSY_GIRL_OUTFIT',
    accessory: 'FEMALE_WARRIOR_ACCESSORIES',
  },
};
