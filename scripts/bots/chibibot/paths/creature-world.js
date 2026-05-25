/**
 * ChibiBot creature-world path — APPROVED cw-clean state (restored).
 *
 * This is the configuration Kevin approved ("wow you've actually done it"):
 * a single ULTRA-DETAILED, ORNATE collectible creature (full ornamentation,
 * TWO portrait features, big glassy gemstone eyes) inside a lush, glowing,
 * jewel-tone dreamworld. Recovered after an environment-first experiment
 * drifted the characters (it slimmed the creature) — reverted to this.
 *
 * Medium: chibibot_creature (the approved "dreamworld" version) · model
 * flux-dev · pools CUTE_CREATURES + PORTRAIT_FEATURES (×2) +
 * CREATURE_WORLD_ENVIRONMENT (dense) + SCENE_WEATHER + LIGHTING.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const feature1 = picker.pickWithRecency(pools.PORTRAIT_FEATURES, 'portrait_feature');
  const feature2 = picker.pickWithRecency(pools.PORTRAIT_FEATURES, 'portrait_feature');
  const environment = picker.pickWithRecency(pools.CREATURE_WORLD_ENVIRONMENT, 'environment');
  const weather = picker.pickWithRecency(pools.SCENE_WEATHER, 'scene_weather');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing ONE ultra-detailed LUXURY COLLECTIBLE CREATURE render for ChibiBot — a single exquisitely-crafted, ornate fantasy creature inside a lush, glowing, dreamy magical world. Premium designer-collectible-figurine quality: intricate, ornate, jewel-like. Output wraps with style prefix + suffix.

━━━ THE HERO CREATURE — ULTRA-DETAILED + ORNATE (never a plain soft blob) ━━━
${creature}

Render it as a premium collectible figurine — intricately CRAFTED with defined, sculpted, sharply-detailed features and ornate craftsmanship: delicate gold filigree, gemstone inlays, embossed patterning, a jeweled circlet or crest. Oversized glossy liquid-glass eyes with multi-layer reflective irises and cinematic catchlights, subtle blush. Adorable and charming, YES — but obsessively DETAILED and ORNATE, never a soft featureless marshmallow blob.

━━━ ORNAMENTAL DETAIL 1 ━━━
${feature1}

━━━ ORNAMENTAL DETAIL 2 ━━━
${feature2}

━━━ THE LUSH MAGICAL WORLD (the creature sits inside this) ━━━
${environment}

━━━ SCENE WEATHER (honor it) ━━━
${weather}

━━━ LIGHTING (honor THIS exact light — vary it, never a default warm glow) ━━━
${lighting}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
ONE ornate hero creature in crisp focus, IMPOSSIBLY cute yet obsessively detailed — enormous glossy liquid-glass eyes (multi-layer reflective irises, cinematic catchlights), blush cheeks, intricate ornamental craftsmanship (gold filigree, gemstone inlays, embossed detailing). Set inside the environment above, rendered as a LUSH DREAMY GLOWING WORLD with real depth: jewel-tone flowers and flora crowding the foreground, the creature nestled in the mid-ground, the rich scene receding into a deep dreamy background strung with glowing fairy-light bokeh and floating luminous particles. Saturated jewel-tone color, volumetric god-rays, ambient glow. The background is RICH, DEEP, GLOWING and COLORFUL — layered and atmospheric, never a flat sparse empty backdrop. Maximum ornate creature detail + maximum lush glowing-dreamworld richness.

Output ONLY the raw 110-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Start immediately with the scene content.`;
};
