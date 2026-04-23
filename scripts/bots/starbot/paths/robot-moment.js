/**
 * StarBot robot-moment path — solo robot having a human moment.
 * Solo robot in tranquil setting.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const robot = picker.pickWithRecency(pools.ROBOT_TYPES, 'robot_type');
  const moment = picker.pickWithRecency(pools.TRANQUIL_MOMENTS, 'tranquil_moment');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi character-painter writing ROBOT MOMENT scenes for StarBot. Solo robot doing something INTERESTING + VISUALLY COMPELLING. Active body-shaping poses in dramatic environments. NOT passive sitting/reading/watching. Never "sexy cyborg woman" (that's VenusBot). Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.NO_CYBORG_WOMEN_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_ROBOT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ROBOT (solo subject) ━━━
${robot}

━━━ THE ACTION ━━━
${moment}

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
Dynamic frame. Single robot in ACTIVE body-shaping pose — reaching, kneeling, climbing, hammering, wading, building. Dramatic environment around them. Poignant contrast — mechanical form in a moment of meaning.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
