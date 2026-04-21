const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const concept = picker.pickWithRecency(pools.AVANT_GARDE_CONCEPTS, 'avant_garde_concept');
  const scene = picker.pickWithRecency(pools.FASHION_SCENES, 'fashion_scene');
  const skin = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an avant-garde fashion concept-artist writing AVANT-GARDE scenes for GlamBot. Met-Gala-meets-AI impossible fashion. Fashion as spectacle. Still gorgeous, never ugly.

${blocks.EDITORIAL_FASHION_BLOCK}

${blocks.DIVERSITY_BLOCK}

${blocks.CONFIDENT_NOT_POSED_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_COZY_NO_SOFT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE AVANT-GARDE CONCEPT ━━━
${concept}

━━━ THE BACKDROP ━━━
${scene}

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
Full-length editorial frame. Spectacle-concept visible. Solo character. Gorgeous impossibility.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
