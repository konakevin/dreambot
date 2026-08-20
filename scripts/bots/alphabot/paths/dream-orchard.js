/**
 * AlphaBot dream-orchard — Sky-World dream candidate (sandbox, function-form).
 * Spun from Kevin's SAVED dreamscape-nocturne render (2026-08-17): the glowing
 * dream-orchard (paper-moons, lantern-fruit, Milky Way) promoted to its own HERO
 * path — a luminous night-garden where fruit/blossoms/moons glow from within.
 * MVP-25 pools; shares the dreambot_cosmic_dream look + flux-1.1-pro-ultra;
 * excluded from chibi look; skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ALPHABOT_DREAM_ORCHARD_SCENE, 'dream_orchard_scene');
  const sky = picker.pickWithRecency(pools.ALPHABOT_DREAM_ORCHARD_SKY, 'dream_orchard_sky');

  return `breathtaking painterly dream-illustration, luminous jewel-toned nocturnal surrealism, dreamy catchlight glow throughout, ultra-detailed rich impasto texture, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE GLOWING ORCHARD (the hero — a night-garden lit from within, real depth) ━━━
${scene}

━━━ THE NIGHT SKY (the glow overhead) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a night-garden or orchard where the fruit, blossoms, and hanging paper-moons GLOW from within like lanterns — deep violet-cream sky deepening to blue-black velvet, silver grass, mirror-still dew, soft vignette, the glow coming from the garden itself. Serene awe, tender and dreamlike, NEVER horror. NO people as the subject. NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
