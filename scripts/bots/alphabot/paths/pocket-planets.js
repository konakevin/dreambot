/**
 * AlphaBot pocket-planets — DreamBot Stage C candidate (sandbox, function-form).
 * Scene-as-hero: a tiny self-contained jewel-PLANET floating in space, its whole
 * little world curving onto the small sphere, seen close + centered so the far
 * side falls away, wrapped in a soft glow. MVP-25 pools; own cosmic-dream look +
 * flux-1.1-pro-ultra; excluded from chibi look-rotation; skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ALPHABOT_POCKET_PLANETS_SCENE, 'pocket_planets_scene');
  const sky = picker.pickWithRecency(pools.ALPHABOT_POCKET_PLANETS_SKY, 'pocket_planets_sky');

  return `breathtaking painterly dream-illustration, luminous storybook-cosmic wonder, dreamy soft light, ultra-detailed, rich saturated color, deep atmospheric depth, magical and serene, masterwork composition.

━━━ THE TINY PLANET-WORLD (the hero — one small sphere, whole and centered, its far side curving away) ━━━
${scene}

━━━ THE COSMIC BACKDROP (the space around it) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of ONE tiny jewel-planet floating in space — the whole miniature world wraps onto the small sphere, its curvature and far edge visible, a soft glow around it, the cosmic backdrop framing it. Charm + awe, storybook-cosmic. NO people as the subject (tiny distant figures at most). NO text, NO words, NO watermarks, NO real-world or brand names. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
