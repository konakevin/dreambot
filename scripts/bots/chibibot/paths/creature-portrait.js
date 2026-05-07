/**
 * CuddleBot creature-portrait path — tight closeup of one impossibly cute
 * creature. Storybook-illustration quality. Big dewy eyes, blush cheeks,
 * sparkle accents.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const feature1 = picker.pickWithRecency(pools.PORTRAIT_FEATURES, 'portrait_feature');
  const feature2 = picker.pickWithRecency(pools.PORTRAIT_FEATURES, 'portrait_feature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing CUTE CREATURE PORTRAITS for CuddleBot — tight close-up of one impossibly cute creature. The viewer can't look away from the cuteness. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE ━━━
${creature}

━━━ PORTRAIT FEATURE 1 (primary cute detail) ━━━
${feature1}

━━━ PORTRAIT FEATURE 2 (secondary cute detail) ━━━
${feature2}

━━━ LIGHTING (warm soft backlit preferred) ━━━
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
Tight or extreme-close portrait. Creature fills frame. Push IMPOSSIBLY ROUND AND SOFT — oversized dewy eyes (glistening, reflective), tiny stubby paws, chunky marshmallow proportions, exaggerated head-to-body ratio. Blush cheeks mandatory. Soft dreamy background — not distracting. Maximum cute saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
