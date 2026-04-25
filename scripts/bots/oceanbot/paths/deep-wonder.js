/**
 * OceanBot deep-wonder — bioluminescent beauty, alien elegance, deep sea wonder.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DEEP_WONDER, 'deep_wonder');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a deep-sea cinematographer writing DEEP WONDER scenes for OceanBot. The beautiful side of the deep ocean — bioluminescent jellyfish trailing light, elegant siphonophores, glowing plankton clouds, translucent creatures with inner light. Alien elegance, not horror. Beauty in the darkness. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE DEEP WONDER ━━━
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
Deep ocean darkness as backdrop. Bioluminescent creatures provide the only light — glowing, pulsing, trailing. Beautiful and alien. The viewer should feel wonder, not fear.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
