/**
 * PixelBot cozy-farming-life-sim path — declarative axis-system form (2026-05-20).
 *
 * 16-BIT COZY LIFE-SIM GAMEPLAY SCREENSHOTS — Stardew Valley + Harvest
 * Moon + Animal Crossing pixel-spin + My Time at Sandrock pixel +
 * Spiritfarer + Ooblets + Coffee Talk + Story of Seasons + Graveyard
 * Keeper pixel-tribute.
 *
 * Solo farmer protagonist + ambient villager / animal NPCs populating
 * the cozy world. NOT party-combat — life-sim ambient is genre-correct.
 *
 * Camera flexibility: 3/4-iso (most common) OR top-down (Stardew-style)
 * OR side-view (Spiritfarer-style) per setting.
 *
 * Axes (3 path-bespoke + 40%-gated cozy phenomenon):
 *   - farm_locale (25): crop-rows / orchard / pasture / coop /
 *     beachside-fish-shack / autumn-harvest-barn / winter-cabin /
 *     greenhouse / festival-square / etc.
 *   - farm_biome (25): season + time + atmosphere combos
 *   - farmer_villager_life (25): solo farmer mid-cozy-task OR ambient
 *     villager moment in scene
 *   - cozy_phenomenon (25, 40%-gated): petals / fireflies / butterflies
 *     / rainbow / smoke / leaves / snow / lanterns / etc.
 */

module.exports = {
  archetype: 'PIXELBOT_COZY_FARMING_LIFE_SIM',
  pools: {
    farm_locale: 'PIXELBOT_COZY_FARMING_FARM_LOCALE',
    farm_biome: 'PIXELBOT_COZY_FARMING_FARM_BIOME',
    farmer_villager_life: 'PIXELBOT_COZY_FARMING_FARMER_VILLAGER_LIFE',
    cozy_phenomenon: 'PIXELBOT_COZY_FARMING_COZY_PHENOMENON',
  },
};
