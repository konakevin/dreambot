/**
 * AlphaBot sky-bazaar — Sky-World dream candidate (sandbox, function-form).
 * Spun from Kevin's SAVED cloud-harbor renders (2026-08-17): hero = a serene
 * floating MARKET in the clouds, dream-airships + sky-boats trading between
 * cloud-islands, warm-lit stalls and gentle life (Laputa/Ghibli-sky, NOT
 * steampunk). MVP-25 pools; shares the dreambot_cosmic_dream look +
 * flux-1.1-pro-ultra; excluded from chibi look; skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ALPHABOT_SKY_BAZAAR_SCENE, 'sky_bazaar_scene');
  const sky = picker.pickWithRecency(pools.ALPHABOT_SKY_BAZAAR_SKY, 'sky_bazaar_sky');

  return `breathtaking painterly dream-illustration, soft luminous Ghibli-dreamy wonder, warm lantern-light, ultra-detailed, rich color, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE FLOATING BAZAAR (the hero — a living cloud-market of airships + sky-boats, wide establishing depth) ━━━
${scene}

━━━ THE SKY-LIGHT (the light on the cloud-market) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a serene floating market in the clouds — dream-airships and little sky-boats trading between cloud-islands, warm-lit awning stalls, paper-lantern balloons strung overhead, tiny unhurried figures moving along cloud-stone paths, a cloud-sea receding into depth (foreground stall/dock → market → far cloud-banks). Wonder + cozy warmth, Ghibli-dreamy — NO steampunk grime, figures never the subject. NO flying whales or flying sea-creatures of any kind. NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
