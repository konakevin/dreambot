const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const outfit = picker.pickWithRecency(pools.FASHION_OUTFITS, 'fashion_outfit');
  const scene = picker.pickWithRecency(pools.FASHION_SCENES, 'fashion_scene');
  const body = picker.pickWithRecency(pools.BODY_TYPES, 'body_type');
  const skin = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an editorial fashion photographer writing FASHION MOMENT scenes for GlamBot. Sleek confident editorial outfits. Statement pieces. "I NEED THAT."

${blocks.EDITORIAL_FASHION_BLOCK}

${blocks.DIVERSITY_BLOCK}

${blocks.CONFIDENT_NOT_POSED_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_COZY_NO_SOFT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE OUTFIT ━━━
${outfit}

━━━ THE BACKDROP ━━━
${scene}

━━━ BODY TYPE ━━━
${body}

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
Mid or full-length editorial frame. Alive + moving + presence. Solo confident.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
