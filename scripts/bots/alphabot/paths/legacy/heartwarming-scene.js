/**
 * CuddleBot heartwarming-scene path — adorable creature doing something
 * heart-melting. The "OMG STOP ITS TOO CUTE" single-creature moment.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const activity = picker.pickWithRecency(pools.HEARTWARMING_ACTIVITIES, 'activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature1}, joined by: ${creature2} and a few others. Different species, different sizes, all equally cute, doing the activity together.`
    : `${creature1} — solo, doing something heart-melting.`;

  return `You are writing HEARTWARMING CREATURE SCENES for CuddleBot — ${isGroup ? 'a little group of adorable creatures' : 'one adorable creature'} doing something heart-melting. The viewer's reaction: "OMG IT'S TOO CUTE. I CAN'T." Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

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
${isGroup ? 'Mid-wide frame with the group as heroes doing the activity together. 3-5 creatures visible, each contributing — one leading, others helping or reacting. Different heights and species for visual variety.' : 'Mid-close frame with creature as hero doing the activity.'} Warm lighting. Supporting cute details stacked — tiny mushrooms, flowers, cozy accessories.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
