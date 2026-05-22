/**
 * YumBot coquette-food path — FLAGSHIP 15-axis OMG-cute coquette party.
 *
 * Hyper-feminine ultra-coquette kawaii food party scene. Palette LOCKED to
 * pinks + lavenders + whites + soft purples ONLY.
 *
 * Full 15-axis architecture (most axes of any yumbot path) — built to push
 * Sonnet+Flux at their playbook ceiling. Items splashed throughout: 5 foods
 * + 3 signature props + 2 scattered girly items + 1 companion = 11 cast
 * items per render (with dessert centerpiece + bow motif on top).
 *
 * Built 2026-05-21 as the flagship girls-love-it path.
 */

module.exports = {
  archetype: 'YUMBOT_COQUETTE_FOOD',
  pools: {
    scene_type: 'COQUETTE_SCENE_TYPE',
    backdrop: 'COQUETTE_BACKDROP',
    signature: 'COQUETTE_SIGNATURE',
    terrain: 'COQUETTE_TERRAIN',
    sky: 'COQUETTE_SKY',
    camera: 'COQUETTE_CAMERA',
    lighting: 'COQUETTE_LIGHTING',
    time_of_day: 'COQUETTE_TIME_OF_DAY',
    atmosphere: 'COQUETTE_ATMOSPHERE',
    dessert_motif: 'COQUETTE_DESSERT_MOTIF',
    palette_variant: 'COQUETTE_PALETTE_VARIANT',
    bow_motif: 'COQUETTE_BOW_MOTIF',
    scattered_items: 'COQUETTE_SCATTERED_ITEMS',
    companion: 'COQUETTE_COMPANION',
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['BAKERY'] },
  },
};
