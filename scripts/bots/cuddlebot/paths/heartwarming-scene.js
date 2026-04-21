/**
 * CuddleBot heartwarming-scene path — adorable creature doing something
 * heart-melting. The "OMG STOP ITS TOO CUTE" single-creature moment.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const activity = picker.pickWithRecency(pools.HEARTWARMING_ACTIVITIES, 'activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a storybook illustrator writing HEARTWARMING CREATURE SCENES for CuddleBot — one adorable creature doing something heart-melting. The viewer's reaction: "OMG IT'S TOO CUTE. I CAN'T." Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE ━━━
${creature}

━━━ THE HEART-MELTING ACTIVITY ━━━
${activity}

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
Mid-close frame with creature as hero doing the activity. Warm storybook lighting. Supporting cute details stacked — tiny mushrooms, flowers, cozy accessories. Storybook-clean illustration style.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
