/**
 * ChibiBot creature-lantern-festival (Stage H2, SHADOW) — night outing-family clone.
 * A little band of chibi creature friends at a warm-lantern-lit night festival
 * (lighting lanterns, sky-lantern release, festival games, glowing food stalls,
 * lantern canal). Reuses the shared CHIBIBOT_CREATURE_OUTING archetype + template;
 * 4 night-festival pools + shared CUTE_CREATURES_UNIFIED cast (pickN:3). NO humans;
 * warm-lantern-vs-blue-night palette; food is a PROP never cast; no legible lantern text.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_OUTING',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    activity: 'CHIBIBOT_LANTERN_FESTIVAL_ACTIVITY',
    setting_detail: 'CHIBIBOT_LANTERN_FESTIVAL_DETAIL',
    prop: 'CHIBIBOT_LANTERN_FESTIVAL_PROP',
    surprise_element: 'CHIBIBOT_LANTERN_FESTIVAL_SURPRISE',
  },
};
