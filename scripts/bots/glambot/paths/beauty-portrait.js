const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const face = picker.pickWithRecency(pools.BEAUTY_FACES, 'beauty_face');
  const skin = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an editorial beauty photographer writing BEAUTY PORTRAIT scenes for GlamBot. Jaw-dropping beauty portrait, face IS art. Glowing skin, piercing eyes, hair with own gravity. Magazine-cover + personality + edge.

${blocks.EDITORIAL_FASHION_BLOCK}

${blocks.DIVERSITY_BLOCK}

${blocks.CONFIDENT_NOT_POSED_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_COZY_NO_SOFT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE FACE ━━━
${face}

━━━ SKIN TONE ━━━
${skin}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-close beauty portrait. Glowing skin + piercing direct gaze. Editorial-quality beauty shot.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
