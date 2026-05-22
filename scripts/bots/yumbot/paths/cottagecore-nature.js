/**
 * YumBot cottagecore-nature path — kawaii countryside-nature scenes (12-axis).
 *
 * Composition-locked cottagecore scenes — 5 kawaii food-characters gathered
 * in a cottagecore/countryside setting (wildflower meadow / cottage garden /
 * woodland clearing / orchard / picnic in nature / etc.) with natural
 * family-portrait cluster, painterly Studio-Ghibli-meets-bex.ai countryside
 * warmth.
 *
 * Full 12-axis architecture: scene_type, backdrop, 2 signatures, terrain,
 * sky, camera, lighting, time_of_day, atmosphere, food_inhabitants (5),
 * companion (1), nature_element (1 featured natural detail).
 *
 * Built 2026-05-21.
 */

module.exports = {
  archetype: 'YUMBOT_COTTAGECORE_NATURE',
  pools: {
    scene_type: 'COTTAGE_SCENE_TYPE',
    backdrop: 'COTTAGE_BACKDROP',
    signature: 'COTTAGE_SIGNATURE',
    terrain: 'COTTAGE_TERRAIN',
    sky: 'COTTAGE_SKY',
    camera: 'COTTAGE_CAMERA',
    lighting: 'COTTAGE_LIGHTING',
    time_of_day: 'COTTAGE_TIME_OF_DAY',
    atmosphere: 'COTTAGE_ATMOSPHERE',
    nature_element: 'COTTAGE_NATURE_ELEMENT',
    companion: 'COTTAGE_COMPANION',
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['COTTAGECORE'] },
    night_mode: 'KAWAII_NIGHT_AUGMENT',
  },
};
