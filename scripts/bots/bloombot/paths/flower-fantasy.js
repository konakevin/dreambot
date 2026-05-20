/**
 * BloomBot flower-fantasy path — declarative axis-system form (2026-05-19).
 *
 * SURREAL SCALE-INVERSION FLOWER SCENES — natural-world environments
 * (forests, valleys, riverbeds, hills, mountainsides, glades) where
 * the natural ELEMENTS are constructed from flowers OR scale is wildly
 * inverted: a giant flower-mushroom standing alone in a meadow, a
 * forest where every "tree" is an oversized overgrown flower, a river
 * of petals flowing through a glade, pine-trees-that-are-flowers, a
 * cherry-blossom tree where the trunk itself is hundreds of stacked
 * little flowers, a hillside of giant tulip-mountains.
 *
 * Inspired by Kevin-hearted bloombot post 2026-05-19 — giant pink
 * flower-mushroom standing in pink wildflower meadow with smaller
 * flower-mushrooms hazy in misty background.
 *
 * NO animals / NO humans / NO manmade objects — naturalistic landscape
 * forms only (tree / mushroom / river / hill / waterfall / valley /
 * etc.) reimagined through flowers + unexpected scale.
 *
 * Aesthetic register: surreal-magical-realism, Studio Ghibli + Salvador
 * Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape.
 *
 * Axes (3 path-bespoke + universal lighting + conditional atmosphere):
 *   - scale_form (25): the hero surreal flower-construction (oversized
 *     flower-tree / flower-mushroom / flower-river / etc.)
 *   - floor_carpet (25): supporting meadow of smaller flowers carpeting
 *     the ground around the hero form
 *   - atmospheric_magic (25, 40%-gated): mist / drifting petals /
 *     golden hour rays / dewdrops / fallen petals on water
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_FANTASY',
  pools: {
    scale_form: 'BLOOMBOT_FLOWER_FANTASY_SCALE_FORM',
    floor_carpet: 'BLOOMBOT_FLOWER_FANTASY_FLOOR_CARPET',
    atmospheric_magic: 'BLOOMBOT_FLOWER_FANTASY_ATMOSPHERIC_MAGIC',
  },
};
