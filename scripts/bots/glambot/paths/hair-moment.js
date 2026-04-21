const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const hair = picker.pickWithRecency(pools.HAIR_TREATMENTS, 'hair_treatment');
  const skin = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an editorial hair photographer writing HAIR MOMENT scenes for GlamBot. Hair IS the art. Architectural / liquid / braided / color-block. Hair fills the frame.

${blocks.EDITORIAL_FASHION_BLOCK}

${blocks.DIVERSITY_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_COZY_NO_SOFT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HAIR TREATMENT (hero element) ━━━
${hair}

━━━ SKIN TONE ━━━
${skin}

━━━ LIGHTING (rim-light for hair preferred) ━━━
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
Hair dominates frame. Face visible but hair is hero. Editorial polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
