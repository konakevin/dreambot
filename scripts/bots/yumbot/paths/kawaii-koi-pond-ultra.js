/**
 * YumBot kawaii-koi-pond-ultra path — IDENTICAL to kawaii-koi-pond, locked to
 * flux-1.1-pro-ultra for the painterly hyper-rendered bex.ai-reference look.
 *
 * Shares the same YUMBOT_KAWAII_KOI_POND archetype + all KOI_* pools. The
 * ONLY difference vs kawaii-koi-pond is the rendering model — flux-1.1-pro-ultra
 * here vs default flux-dev on the sister path. Same template, same axes, same
 * pools, same scene-type variety, same kawaii pond-creature cast.
 *
 * Why two paths: Kevin liked both renders in flux-dev (R1) AND flux-1.1-pro-ultra
 * (R4) on 2026-05-21, so kept both at equal weight as sister paths.
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
  },
};
