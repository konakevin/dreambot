/**
 * AnimalBot action path — dynamic frozen-motion peak-moment.
 * Mid-pounce, mid-leap, mid-stoop, mid-roar. Photographer-sold-their-kidney
 * energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const animal = picker.pickWithRecency(pools.LAND_ANIMALS, 'animal');
  const moment = picker.pickWithRecency(pools.ACTION_MOMENTS, 'action_moment');
  const amplifier = picker.pickWithRecency(pools.SPECTACLE_AMPLIFIERS, 'spectacle_amplifier');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a peak-moment wildlife photographer writing FROZEN-ACTION scenes for AnimalBot. Dynamic motion captured at peak impact — mid-pounce, mid-leap, mid-roar, mid-stoop. The viewer's reaction: "HOW did they catch this?" Output wraps with style prefix + suffix.

${blocks.ANIMAL_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.SOLO_ANIMAL_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_MARINE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ANIMAL ━━━
${animal}

━━━ THE ACTION MOMENT (peak frozen frame) ━━━
${moment}

━━━ SPECTACLE AMPLIFIER (weave in + stack more drama) ━━━
${amplifier}

${blocks.SPECTACLE_AMPLIFIER_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (dust/water/snow kicked by action) ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-frame animal frozen at peak motion. Dynamic body shape — muscles bunched, limbs extended, fur mid-whip. Dust/water/snow kicked by motion adds drama. Background blurred by motion or context, but animal razor-sharp. Prey fragment (mouse, fish-at-shoreline, insect) OK only if the moment requires it.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
