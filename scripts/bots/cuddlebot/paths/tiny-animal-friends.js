/**
 * CuddleBot tiny-animal-friends path — small creature pair/group warmth.
 * Bunny hugging flower, dragons napping on cloud, mouse family dinner.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const friendship = picker.pickWithRecency(pools.TINY_FRIENDSHIPS, 'tiny_friendship');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a storybook illustrator writing TINY FRIENDSHIP scenes for CuddleBot — pair or small-group warmth moments between cute creatures. The viewer feels their heart squeeze with tenderness. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TINY FRIENDSHIP MOMENT ━━━
${friendship}

━━━ LIGHTING (warm soft only) ━━━
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
Mid or mid-close frame. 2-4 creatures max. Warmth beat is central — nuzzling, sharing, hugging, napping together. Storybook soft lighting. Emotional beat unmistakable.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
