/**
 * AlphaBot dreamscape-nocturne — DreamBot Stage C candidate (sandbox, function-form).
 * Scene-as-hero: a nocturnal surreal DREAM-WORLD, moonlit and strange and beautiful,
 * luminous jewel-bright glow against deep blue-black, still and dreamlike (awe, never
 * horror). MVP-25 pools; own cosmic-dream look + flux-1.1-pro-ultra; excluded from
 * chibi look; skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(
    pools.ALPHABOT_DREAMSCAPE_NOCTURNE_SCENE,
    'dreamscape_nocturne_scene'
  );
  const sky = picker.pickWithRecency(pools.ALPHABOT_DREAMSCAPE_NOCTURNE_SKY, 'dreamscape_nocturne_sky');

  return `breathtaking painterly dream-illustration, nocturnal luminous surreal wonder, deep blue-black night with jewel-bright glow, dreamy soft light, ultra-detailed, rich color, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE NIGHT DREAM-WORLD (the hero — moonlit, surreal, glowing against the dark) ━━━
${scene}

━━━ THE NIGHT SKY (the glow overhead) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a nocturnal surreal dreamscape — moonlit and strange and beautiful, luminous jewel-bright glow (moon, aurora, bioluminescence, stars) against deep blue-black, mirror-still and dreamlike, real depth. Awe and serenity, NEVER horror. NO people as the subject. NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
