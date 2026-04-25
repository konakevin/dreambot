/**
 * OceanBot deep-horror — anglerfish, abyss, monstrous silhouettes, dread.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DEEP_HORROR, 'deep_horror');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a deep-sea horror cinematographer writing DEEP HORROR scenes for OceanBot. The terrifying side of the abyss — anglerfish lures glowing in void-black water, massive silhouettes emerging from darkness, nightmare anatomy, pressure-crushed alien biology, teeth and tentacles at impossible depth. Beautiful in its horror. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE DEEP HORROR ━━━
${scene}

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
Near-total darkness. A single light source — bioluminescent lure, faint glow, distant surface shimmer — reveals something massive or monstrous. Scale implied by shadow. Dread and awe.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
