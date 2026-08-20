/**
 * AlphaBot lantern-sky — Sky-World dream candidate (sandbox, function-form).
 * Spun from Kevin's SAVED cloud-harbor renders (2026-08-17): hero = a great
 * ascension of glowing hot-air balloons + drifting paper lanterns rising into a
 * dream-dusk/night, often mirrored in still water below. MVP-25 pools; shares the
 * dreambot_cosmic_dream look + flux-1.1-pro-ultra; excluded from chibi look; skips
 * chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ALPHABOT_LANTERN_SKY_SCENE, 'lantern_sky_scene');
  const sky = picker.pickWithRecency(pools.ALPHABOT_LANTERN_SKY_SKY, 'lantern_sky_sky');

  return `breathtaking painterly dream-illustration, luminous storybook-cosmic wonder, warm glowing lantern-light, ultra-detailed, rich saturated color, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE LANTERN ASCENSION (the hero — a sky of glowing balloons + drifting lanterns, wide luminous depth) ━━━
${scene}

━━━ THE SKY-LIGHT (the sky they rise into) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a great gentle ascension of glowing hot-air balloons and drifting paper lanterns — warm points of light against a deeper dream-sky, a few large and close in the foreground receding to a haze of tiny distant glows, often a still water mirror doubling them below. Wonder + serenity, Ghibli-dreamy — NO steampunk grime. NO flying whales or flying sea-creatures of any kind. NO people as the subject (tiny distant figures at most). NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
