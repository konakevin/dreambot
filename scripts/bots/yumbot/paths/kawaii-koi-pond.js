/**
 * YumBot kawaii-koi-pond path — Japanese garden pond with kawaii pond-creatures.
 *
 * Modeled on bex.ai reference (IMG_9558/9561/9564/9566 2026-05-21): tranquil
 * Japanese koi-pond with floating lotus-lanterns, smiling koi-fish, axolotls,
 * cloud-mochi-spirits, lily-pads, wisteria-canopy. Painterly Studio-Ghibli
 * meets bex.ai Pop-Mart kawaii register. Twilight / dusk-heavy.
 *
 * 12-axis architecture: scene_type, backdrop, 2 signatures, terrain (water),
 * sky (wisteria/pagoda overhead), camera, lighting, time_of_day, atmosphere,
 * creatures (5 pond-creatures), companion, water_element (lotus-lantern /
 * glowing-lily centerpiece).
 *
 * Cast: NOT food this time — kawaii pond-creatures (koi-fish, axolotls,
 * cloud-mochi, lily-frogs, water-spirits) with kawaii faces. yumbot's broader
 * kawaii-universe scope.
 *
 * Built 2026-05-21.
 */

module.exports = {
  archetype: 'YUMBOT_KAWAII_KOI_POND',
  pools: {
    scene_type: 'KOI_SCENE_TYPE',
    backdrop: 'KOI_BACKDROP',
    signature: 'KOI_SIGNATURE',
    terrain: 'KOI_TERRAIN',
    sky: 'KOI_SKY',
    camera: 'KOI_CAMERA',
    lighting: 'KOI_LIGHTING',
    time_of_day: 'KOI_TIME_OF_DAY',
    atmosphere: 'KOI_ATMOSPHERE',
    water_element: 'KOI_WATER_ELEMENT',
    companion: 'KOI_COMPANION',
    creatures: 'KOI_CREATURES',
    night_mode: 'KAWAII_NIGHT_AUGMENT',
  },
};
