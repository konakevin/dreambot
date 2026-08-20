/**
 * AlphaBot starlight-carnival — Sky-World dream candidate (sandbox, function-form).
 * Spun from Kevin's steer (2026-08-17): "truly beautiful, awe-inspiring, fantastical
 * posts with whimsy... a scene you'd really want to visit." Hero = a luminous dream-fair
 * (star-ferris-wheel, carousel, striped midway tents, warm lights). NO flying whales.
 * MVP-25 pools; shares the dreambot_cosmic_dream look + flux-1.1-pro-ultra; excluded
 * from chibi look; skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(
    pools.ALPHABOT_STARLIGHT_CARNIVAL_SCENE,
    'starlight_carnival_scene'
  );
  const sky = picker.pickWithRecency(pools.ALPHABOT_STARLIGHT_CARNIVAL_SKY, 'starlight_carnival_sky');

  return `breathtaking painterly dream-illustration, luminous storybook-cosmic wonder, warm glowing carnival-light, ultra-detailed, rich saturated color, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE DREAM-FAIR (the hero — a luminous whimsical carnival you long to visit, real depth) ━━━
${scene}

━━━ THE SKY-LIGHT (the dusk/night it glows against) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a fantastical dream-carnival — a glowing ferris wheel, carousel, striped midway tents, warm strung lights — a place you genuinely long to wander into, glowing warm against a dream-dusk or dream-night, often a still water mirror doubling the lights below, real receding depth. Awe + cozy whimsy, Ghibli-dreamy, never creepy. NO flying whales or flying sea-creatures. NO people as the subject (tiny distant figures at most). NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
