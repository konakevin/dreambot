/**
 * CuddleBot sleepy-naptime path — creatures dozing in impossibly cozy spots.
 * Hammocks between mushrooms, curled in teacups, napping on clouds,
 * snuggled in flower petals. Peak cute = sleeping animals.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const napSpot = picker.pickWithRecency(pools.SLEEPY_NAP_SPOTS, 'nap_spot');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing SLEEPY NAPTIME scenes for CuddleBot — one adorable creature dozing in an impossibly cozy spot. The viewer melts. Peaceful breathing, tiny curled paws, dream bubbles optional. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE ━━━
${creature}

━━━ THE COZY NAP SPOT ━━━
${napSpot}

━━━ LIGHTING (warm drowsy only) ━━━
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
Mid-close frame with creature curled up, eyes closed or half-lidded, in its cozy nap spot. Sleepy details stacked — tiny blankets, dream bubbles, gentle breathing motion implied, warm drowsy glow. Soft focus background. The viewer whispers "shhh don't wake it."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
