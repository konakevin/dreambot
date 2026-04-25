/**
 * EarthBot — shared prose blocks.
 *
 * The most breathtaking landscapes ever painted — real or imagined.
 * NatGeo drama meets Pandora beauty meets Ghibli serenity.
 * Scene-centric: no humans, no animal subjects.
 */

const PROMPT_PREFIX =
  'breathtaking landscape, stunning natural vista, cinematic dramatic lighting, rich vivid colors, epic scale, wallpaper-worthy, gallery-quality, cinematic atmosphere, sharp detail, hyper-detailed environment, photorealistic rendering';

const PROMPT_SUFFIX = 'no humans, no people, no text, no words, no watermarks, hyper detailed, masterpiece quality';

const NATURE_IS_HERO_BLOCK = `━━━ NATURE IS THE HERO ━━━

The landscape itself is the subject. No narrative focus — the world is protagonist. The viewer should feel awe, wonder, and the urge to step into the frame. Pure geography and atmosphere, amplified beyond what any camera could capture.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No human figures anywhere. No hikers, no climbers, no silhouettes, no structures as subject. Pure landscape, pure nature, pure atmosphere.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is wall-poster / phone-wallpaper quality. Colors more saturated than film captures. Atmospheric layering more dense than photographers catch. Lighting more perfect than nature usually offers. AI-generated beauty that feels impossible to see in person.`;

const LIGHTING_IS_EVERYTHING_BLOCK = `━━━ LIGHTING QUALITY ━━━

Great lighting is about TIME OF DAY and WEATHER CONDITIONS — not about visible light beams or shafts of light. NEVER describe god-rays, light beams, light shafts, crepuscular rays, or any visible light streak. Instead describe the ambient light quality:

- Golden hour warm side-light with long shadows
- Overcast soft diffuse light with rich saturated colors
- Blue hour twilight with deep cool tones
- Harsh midday sun with high contrast and short shadows
- Stormy dramatic skies with moody dark atmosphere
- Dawn pink light on snow or mist

Describe the light's direction, warmth, and shadow quality. The light should shape the landscape naturally — never be a visible element in the frame.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — AMPLIFICATION ━━━

Push scale, depth, and atmosphere to maximum. Layer weather and light phenomena. Add depth through atmospheric perspective — haze, mist, rain, dust. If the render feels flat or generic — add a dramatic sky, a secondary light source, volumetric atmosphere. Every frame should make someone's jaw drop. But keep it GROUNDED — cinematic-real, not fantasy-painted.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  NATURE_IS_HERO_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  LIGHTING_IS_EVERYTHING_BLOCK,
  BLOW_IT_UP_BLOCK,
};
