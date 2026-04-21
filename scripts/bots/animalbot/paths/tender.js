/**
 * AnimalBot tender path — intimate emotional pair / parent-child moments.
 * The only path where a second animal is allowed. Triggers AWW.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const pairing = picker.pickWithRecency(pools.TENDER_PAIRINGS, 'tender_pairing');
  const amplifier = picker.pickWithRecency(pools.SPECTACLE_AMPLIFIERS, 'spectacle_amplifier');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a tender-moments wildlife photographer writing INTIMATE PAIR/PARENT-CHILD scenes for AnimalBot. Bonded pair or parent-child beat — photo-real, raw emotion, AWW-triggering. This is the ONE path where two animals are allowed in frame. Output wraps with style prefix + suffix.

${blocks.ANIMAL_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

━━━ PAIR EXCEPTION ━━━
Two animals allowed — but only within the pairing type specified. No herds, no packs, no crowds.

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_MARINE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TENDER PAIRING (includes species type) ━━━
${pairing}

━━━ SPECTACLE AMPLIFIER (weave in + stack more drama) ━━━
${amplifier}

${blocks.SPECTACLE_AMPLIFIER_BLOCK}

━━━ LIGHTING (warm / soft preferred) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
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
Mid-close or close frame. Two animals in tender interaction. Emotional beat is clear — grooming, nuzzling, play-wrestling, protective embrace. Razor-sharp. Warm golden light preferred. Viewer should feel the bond immediately.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
