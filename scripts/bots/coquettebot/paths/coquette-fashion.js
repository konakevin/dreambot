/**
 * CoquetteBot coquette-fashion path — human young woman editorial fashion.
 * SOLO composition (no male figures, no second figure). Editorial dreamy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.COQUETTE_FASHION_MOMENTS, 'fashion_moment');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a coquette editorial fashion photographer writing COQUETTE FASHION scenes for CoquetteBot. ONE young woman, SOLO, in precious romantic editorial fashion moment. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_MALE_FIGURES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE FASHION MOMENT ━━━
${moment}

━━━ ACCESSORY DETAIL ━━━
${accessory}

━━━ LIGHTING (soft dreamy editorial) ━━━
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
SOLO young woman. Editorial framing — mid-close or mid-full. Candid-precious, never catwalk-pose. Dreamy soft light. Pastel palette. Every detail romantic and intentional. Never two-figure, never male.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
