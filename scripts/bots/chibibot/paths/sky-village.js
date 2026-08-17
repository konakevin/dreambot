/**
 * ChibiBot sky-village (Stage H3, SHADOW) — the 7th village: a whimsical cloud-
 * kingdom. SETTING-AS-HERO sky village (cottages on cloud-tufts, rainbow bridges,
 * balloon docks, star-lamp posts, floating islands), a SOLO chibi creature as a
 * small 8-15% scale-prover. Clouds-as-ground soft-solid-whimsical; NO tech.
 * Clones the village 10-axis shape (CHIBIBOT_SKY_VILLAGE archetype + template);
 * tag-filtered BIRD/FANTASY/ANY cast + village_detail pickN:3 + 60%-gated phenomenon.
 */

module.exports = {
  archetype: 'CHIBIBOT_SKY_VILLAGE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED', tags: ['BIRD', 'FANTASY', 'ANY'] },
    resident_activity: 'SKY_VILLAGE_ACTIVITIES',
    village: 'SKY_VILLAGE_SETTINGS',
    village_detail: 'SKY_VILLAGE_DETAILS',
    time_of_day: 'SKY_VILLAGE_TIME_OF_DAY',
    surprise_element: 'SKY_VILLAGE_SURPRISE',
    phenomenon: 'SKY_VILLAGE_PHENOMENA',
  },
};
