/**
 * YumBot shared blocks — kawaii-food specialist bot.
 *
 * Modeled tightly on bex.ai's Pop-Mart / kawaii-fantasy aesthetic. Three
 * distinct path-looks observed in references:
 *   A) floral-garden-cup — vessel overflowing with magical flora
 *   B) rainbow-dreamscape — kawaii food-creatures sitting in a wider pastel
 *      meadow with rainbows pouring out / arching overhead
 *   C) checkered-tabletop — kawaii food on a pastel-gingham/plaid tablecloth
 *      with cluster of smiling mini food-friends piled around it
 */

// The medium carries the "food IS the character" IDENTITY (kawaii face
// baked into the food; only cast is food/drink). The prefix carries render
// QUALITY (Pop-Mart CGI + painterly polish). 2026-06-12 de-cruft: dropped
// the enumerated pastel-color list (blush/lavender/mint/peach/cream/baby-
// blue) — a palette axis + sharedDNA.scenePalette handle color per render.
const YUMBOT_FOOD_MEDIUM =
  'Kawaii smiling faces baked INTO the food/drink itself (each food IS the character with dimpled-cheek blush, closed-arc eyes, tiny printed mouth ON the surface). Glossy dewy subsurface-scattered pearlescent material treatment. The only cast in frame is food and drink — every face belongs to a food item.';

// Render-QUALITY prefix (NOT identity — the medium carries that). 2026-06-12
// de-cruft: this and YUMBOT_FOOD_MEDIUM both led with "3D CGI + painterly
// fusion, Pop-Mart designer-vinyl, glossy dewy pearlescent, pastel palette"
// (~150 chars of overlap on every render) — de-duplicated so the prefix owns
// the style register and the medium owns the food-is-character identity.
const PROMPT_PREFIX =
  '3D CGI render with painterly illustration polish, designer collectible Pop-Mart quality, glossy dewy pearlescent surfaces with subsurface scattering, frame-worthy magical wallpaper composition, pastel palette';

const PROMPT_SUFFIX =
  'designer-vinyl glossy-pearlescent finish, painterly illustration fusion, dreamy bokeh, soft pastel kawaii palette';

// 2026-06-12 de-cruft: the ~400-char NIGHTTIME LOCK paragraph was inlined
// verbatim inside 6 night-capable templates (floral-cup, floral-scene,
// rainbow-dreamscape, candy-fantasy, cottagecore, koi-pond). Extracted here
// once. Takes the rolled `night_mode` slot + an optional scene-specific line
// (e.g. "Whether indoor or outdoor, the AIR + BACKDROP are DARK."). The kawaii
// cast keeps soft faces; the WORLD around them goes dark.
const YUMBOT_NIGHTTIME_BLOCK = (night_mode, sceneLine) =>
  night_mode
    ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply to EVERYTHING below:
${sceneLine ? `- ${sceneLine}\n` : ''}- Sky / backdrop = DARK indigo / navy / midnight / inky — NOT twilight, NOT dusk, NOT bright pastel.
- Palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep-indigo backdrop — NOT bright kawaii pastels in the background. The kawaii cast can keep soft faces; the AIR + BACKDROP are dark.
- Lighting = moon + paper-lanterns + candle-glow + fairy-light strings + firefly drift + bioluminescent glow. NO daytime sun, NO bright pastel sunny light, NO 'soft volumetric pastel-light pouring down'.
- If any phrase below reads as bright/sunny/daytime, REPLACE it with the night equivalent. The render must read as full NIGHT, not bright-scene-with-a-moon.

`
    : '';

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js). The "3D CGI + painterly fusion" medium +
// prefix make these models pick one extreme (abstract painterly or flat CGI);
// this positive-only directive keeps a clean readable kawaii-food render. Light
// genre tag, no negation cascade.
const GPT_CLEAN =
  'Clean kawaii food-character illustration, crisp designer-collectible render with clearly readable smiling food characters and scenes, pastel pearlescent color palette, glossy Pop-Mart register';

// Neutral kawaii-food anchor (2026-06-06) — used by paths that roll a
// per-render visual register via sharedDNA.lookRegister (e.g. meal-types).
// Locks the "kawaii face baked into food" character identity but NOT the
// medium / surface treatment / palette — those come from the rolled
// look_register so each render gets a different visual treatment.
const YUMBOT_FOOD_NEUTRAL =
  'Kawaii smiling faces baked INTO the food/drink itself (each food IS the character with dimpled-cheek blush, closed-arc eyes, tiny printed mouth ON the surface). The only cast in frame is food and drink — every face belongs to a food item. Visual treatment + surface + palette set by the look-register tokens that lead the prompt.';

// 2026-06-12 de-cruft: the 4-line "LOOK REGISTER OVERRIDE … open your Flux
// prompt with this medium … translate every surface … open with these tokens"
// boilerplate was inlined verbatim at the top of all 19 templates. One terse
// helper now. Returns '' when no look rolled (the bot/template fallback covers
// it). Per the ChibiBot lesson: keep the override block SHORT.
const YUMBOT_LOOK_OVERRIDE = (sharedDNA) =>
  sharedDNA && sharedDNA.lookRegister
    ? `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${sharedDNA.lookRegister}

`
    : '';

module.exports = {
  YUMBOT_FOOD_MEDIUM,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  GPT_CLEAN,
  YUMBOT_FOOD_NEUTRAL,
  YUMBOT_NIGHTTIME_BLOCK,
  YUMBOT_LOOK_OVERRIDE,
};
