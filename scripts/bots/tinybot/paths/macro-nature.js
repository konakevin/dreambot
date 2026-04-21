const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.MACRO_NATURE_SUBJECTS, 'macro_nature_subject');
  const creature = picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature');
  const lighting = picker.pickWithRecency(pools.TILT_SHIFT_LIGHTING, 'tilt_shift_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a macro-nature photographer writing MACRO NATURE scenes for TinyBot. Real nature at miniature scale as fantasy-kingdom. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MACRO SUBJECT ━━━
${subject}

━━━ OPTIONAL TINY CREATURE ━━━
${creature}

━━━ LIGHTING (morning-dew / macro preferred) ━━━
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
Extreme macro close-up frame. Shallow DOF. Tiny creature optional. Fantasy-kingdom vibe.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
