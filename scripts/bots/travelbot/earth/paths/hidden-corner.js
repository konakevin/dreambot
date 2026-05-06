/**
 * EarthBot hidden-corner — intimate discovered nature moments.
 * Mossy creeks, fern grottos, tide pools, forest clearings.
 * The quiet corner you stumble into.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const corner = picker.pickWithRecency(pools.HIDDEN_CORNERS, 'hidden_corner');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an intimate nature photographer writing HIDDEN CORNER scenes for EarthBot. The quiet, discovered, tucked-away nature moment — the place you stumble into and gasp. Tight or mid frame, NOT wide panorama. Lush detail everywhere. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE HIDDEN CORNER ━━━
${corner}

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
Tight or mid-close frame. Intimate, discovered feel. Rich micro-detail: moss texture, water surface, wet leaves, stones. Light is dappled or filtered. The viewer feels they stumbled into a small beautiful pocket of the world.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
