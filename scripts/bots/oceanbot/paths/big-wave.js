/**
 * OceanBot big-wave — 60ft walls of water, Nazaré/Mavericks power, spray and awe.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BIG_WAVES, 'big_wave');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a big-wave photographer writing BIG WAVE scenes for OceanBot. Monster waves at their most powerful and beautiful — 40-60 foot walls of water, spray blowing off the lip, the inside of barrels lit by sunlight, mountains of whitewater, raw oceanic power. No surfers, no people — just the wave itself as subject. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE BIG WAVE ━━━
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
The wave fills the frame — massive, powerful, beautiful. Water-level or slightly below to emphasize scale. Light through the wave face, spray in the wind, raw power frozen in time.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
