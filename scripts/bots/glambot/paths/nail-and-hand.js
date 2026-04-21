const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const nail = picker.pickWithRecency(pools.NAIL_ART, 'nail_art');
  const pose = picker.pickWithRecency(pools.HAND_POSES, 'hand_pose');
  const skin = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an editorial hand/nail photographer writing NAIL AND HAND scenes for GlamBot. Extreme closeup on hands + nails + jewelry. Viral manicure art + ring-stacking. Tiny frame, big impact.

${blocks.EDITORIAL_FASHION_BLOCK}

${blocks.NO_COZY_NO_SOFT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE NAIL ART ━━━
${nail}

━━━ THE HAND POSE ━━━
${pose}

━━━ SKIN TONE OF HAND ━━━
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
Extreme closeup on hands + nails. Jewelry prominent. Tiny frame impact. Specific pose storytelling.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
