/**
 * YumBot checkered-tabletop path — bex.ai reference look (12-axis refactor 2026-05-21).
 *
 * Kawaii-faced food/drink hero on a pastel-pink-blue (or pink-yellow / pink-
 * cream) GINGHAM / CHECKERED / PLAID tablecloth, with a cluster of smiling
 * mini-food-friends piled around (and often ON TOP of) the hero. 3/4 tabletop
 * or overhead-flatlay composition. Pop-Mart-collectible-grid / kawaii-sticker-
 * card feel.
 *
 * 12-axis architecture (was 7, added: backdrop, signature×2, atmosphere,
 * time_of_day, companion):
 *   vessel_hero (smiling kawaii face vessel)
 *   mini_creature_pile (cluster on top of vessel)
 *   tablecloth (gingham/checkered pattern variety)
 *   scattered_minis (5 mini-foods scattered around base)
 *   decor_clusters (2 decor clusters at edges)
 *   backdrop (soft-focus surrounding setting visible behind)
 *   signature (2 picks — kawaii tabletop props)
 *   atmosphere (drifting confetti / sparkle / petals)
 *   time_of_day
 *   companion (1 tiny accent creature)
 *   camera (3/4 tabletop or overhead-flatlay)
 *   lighting (warm window-light / pendant-glow / etc.)
 *
 * References: IMG_9493, IMG_9494, IMG_9496, IMG_9497.
 */

module.exports = {
  archetype: 'YUMBOT_CHECKERED_TABLETOP',
  pools: {
    vessel_hero: 'TABLETOP_VESSEL_HERO',
    mini_creature_pile: 'TABLETOP_MINI_CREATURE_PILE',
    tablecloth: 'TABLETOP_PATTERN',
    scattered_minis: 'TABLETOP_SCATTERED_MINIS',
    decor_clusters: 'TABLETOP_DECOR_CLUSTERS',
    backdrop: 'TABLETOP_BACKDROP',
    signature: 'TABLETOP_SIGNATURE',
    atmosphere: 'TABLETOP_ATMOSPHERE',
    time_of_day: 'TABLETOP_TIME_OF_DAY',
    companion: 'TABLETOP_COMPANION',
    camera: 'TABLETOP_CAMERA',
    lighting: 'TABLETOP_LIGHTING',
  },
};
