/**
 * CuddleBot bath-time path — creatures in tiny clawfoot bathtubs surrounded
 * by bubbles, rubber ducks, candlelight. Foam on noses, towel turbans,
 * steamy windows.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const bathScene = picker.pickWithRecency(pools.BATH_TIME_SCENES, 'bath_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature1}, joined by: ${creature2} and a few others. Different species, different sizes, all squeezed into the bath together or doing spa activities side by side.`
    : `${creature1} — solo bath time bliss.`;

  return `You are writing BATH TIME scenes for CuddleBot — ${isGroup ? 'a group of adorable creatures' : 'an adorable creature'} enjoying a tiny cozy bath. Bubbles, rubber ducks, steamy warmth, foam on noses. Pure spa-day-for-tiny-creatures energy. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE BATH TIME SCENE ━━━
${bathScene}

━━━ LIGHTING (warm steamy candlelit) ━━━
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
${isGroup ? 'Mid-wide frame with the group in or around the bath together. 3-5 creatures visible — some in the tub, one wrapped in towel, one blowing bubbles. Different heights and species for visual variety. Squeezed-in-together energy.' : 'Mid-close frame with creature in or around bath.'} Bubbles and foam stacked thick. Warm steamy atmosphere. Tiny bath accessories — rubber duck, miniature shampoo bottles, fluffy towels, candles. Cozy bathroom artbook quality.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
