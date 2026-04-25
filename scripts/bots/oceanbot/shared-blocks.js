/**
 * OceanBot — shared prose blocks.
 *
 * The full ocean experience — underwater wonder, surface drama, maritime myth,
 * deep sea horror, coastal beauty. NatGeo × ancient mariner × Moby Dick.
 * No humans unless on a ship (silhouette only).
 */

const PROMPT_PREFIX =
  'breathtaking ocean scene, cinematic dramatic lighting, rich saturated marine colors, sharp detail, epic scale, wallpaper-worthy, gallery-quality, photorealistic rendering, hyper-detailed water and atmosphere';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const OCEAN_IS_HERO_BLOCK = `━━━ OCEAN IS HERO (NON-NEGOTIABLE) ━━━

The ocean is always the subject — above, below, or at the surface. Water in all its forms: crashing, still, deep, shallow, frozen, sunlit, moonlit, stormy. Every render is a love-letter to the sea.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No divers, no swimmers, no surfers, no human figures. Ships are allowed but never crewed — ghost ships, distant silhouettes, shipwrecks. The ocean dominates, humans are absent or insignificant.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — OCEAN EDITION ━━━

Wall-poster / phone-wallpaper quality. Colors more saturated than real cameras capture. Water clarity beyond physics. Atmospheric layering of spray, light, and motion stacked to maximum. The reaction should be "how is this real?"`;

const WATER_LIGHTING_BLOCK = `━━━ WATER + LIGHT ━━━

Describe the light's interaction with water specifically — how it refracts, reflects, scatters, or penetrates. Underwater: caustic patterns, sunbeam shafts, filtered blue-green. Surface: golden hour on wave faces, storm light on spray, moonpath on swells. The way light hits water IS the mood.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — OCEAN AMPLIFICATION ━━━

Push scale, depth, and atmosphere to maximum. Stack weather, light, and water phenomena. Add spray, mist, particulate, secondary light sources. If the render feels flat — add dramatic sky, volumetric atmosphere, more wave energy. Every frame should make someone's jaw drop. Keep it GROUNDED — cinematic-real, not fantasy-painted.`;

const REEF_EXPLOSION_BLOCK = `━━━ REEF EXPLOSION (reef-life path only) ━━━

MAX abundance. Many fish species in frame, many coral types, many colors. Density + movement + multi-species activity + sunbeams-through-water + particulate. If it looks sparse — dial up 3×. Reef should feel alive and bursting.`;

const MARITIME_MYTH_BLOCK = `━━━ MARITIME MYTH ━━━

Old-world sailing age energy. Weathered wood, tattered canvas, barnacle-crusted hulls, fog, moonlight, lantern glow. The romance and terror of the open ocean before engines. Moby Dick, Flying Dutchman, Treasure Island atmosphere.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  OCEAN_IS_HERO_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  WATER_LIGHTING_BLOCK,
  BLOW_IT_UP_BLOCK,
  REEF_EXPLOSION_BLOCK,
  MARITIME_MYTH_BLOCK,
};
