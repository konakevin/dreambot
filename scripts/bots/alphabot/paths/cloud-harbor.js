/**
 * AlphaBot cloud-harbor — DreamBot Stage C candidate (sandbox, function-form).
 * Scene-as-hero: a floating SKY-HARBOR of cloud-islands + gentle dream-airships in
 * soft Ghibli-dreamy light (Laputa register, NOT steampunk-industrial). MVP-25
 * pools; own cosmic-dream look + flux-1.1-pro-ultra; excluded from chibi look;
 * skips chaos + polish.
 */
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ALPHABOT_CLOUD_HARBOR_SCENE, 'cloud_harbor_scene');
  const sky = picker.pickWithRecency(pools.ALPHABOT_CLOUD_HARBOR_SKY, 'cloud_harbor_sky');

  return `breathtaking painterly dream-illustration, soft luminous Ghibli-dreamy wonder, warm gentle light, ultra-detailed, rich color, deep atmospheric depth, serene and magical, masterwork composition.

━━━ THE FLOATING SKY-HARBOR (the hero — cloud-islands + gentle dream-ships, wide establishing depth) ━━━
${scene}

━━━ THE SKY-LIGHT (the light on the cloud-sea) ━━━
${sky}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Compose a single luminous painterly dream-illustration of a floating sky-harbor — cloud-islands, gentle floating architecture, dream-airships / balloon-ships at soft sky-docks, billowing clouds and warm light, a cloud-sea receding into depth (foreground island → harbor → far cloud-banks). Wonder + serenity, Ghibli-dreamy — NO steampunk grime. NO flying whales or flying sea-creatures of any kind. NO readable text, NO brand/real names, NO words, NO watermarks. Output ONLY the 80-110 word Flux prompt, comma-separated, starting immediately with the scene — no preamble, no headers, no markers.`;
};
