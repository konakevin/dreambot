/**
 * PixelBot cozy-rpg-town path — declarative axis-system form (2026-05-20).
 *
 * COZY PIXEL-RPG TOWN HUBS — Stardew Valley + Octopath Traveler HD-2D +
 * Sea of Stars + Eastward + Children of Morta town hubs. Half-timbered
 * houses, warm tavern light, market stalls, NPCs going about their day,
 * cobblestone paths winding between shops. The town is INHABITED.
 *
 * Reference migration for PixelBot's axis-system transition (2026-05-20).
 * Clone this structure for the other 9 PixelBot paths.
 *
 * Axes (4 path-bespoke):
 *   - town_locale (25): the specific town space (tavern street / market
 *     square / cottage row / harbor / fountain plaza / castle gate /
 *     bridge / inn yard / temple steps / blacksmith corner)
 *   - town_biome (25): village character (half-timbered / coastal /
 *     mountain / desert oasis / forest village / snowy / canal town /
 *     dwarven mountainside / elven treetop / volcanic black-rock)
 *   - npc_life (25): inhabited detail (market vendor / child playing /
 *     cat sleeping / fountain / lantern-lighter / sign-painter)
 *   - atmospheric_phenomenon (25, 40%-gated): fireflies / petal-fall /
 *     lantern-glow / mist / rain on cobblestone
 */

module.exports = {
  archetype: 'PIXELBOT_COZY_RPG_TOWN',
  pools: {
    town_locale: 'PIXELBOT_COZY_RPG_TOWN_LOCALE',
    town_biome: 'PIXELBOT_COZY_RPG_TOWN_BIOME',
    npc_life: 'PIXELBOT_COZY_RPG_TOWN_NPC_LIFE',
    atmospheric_phenomenon: 'PIXELBOT_COZY_RPG_TOWN_ATMOSPHERIC_PHENOMENON',
  },
};
