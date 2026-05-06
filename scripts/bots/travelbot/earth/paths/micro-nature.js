/**
 * EarthBot micro-nature — extreme close-ups of natural beauty.
 * Dewdrops on petals, frost crystals, lichen patterns, moss worlds.
 * Macro lens revealing the tiny spectacular.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const detail = picker.pickWithRecency(pools.MICRO_NATURE, 'micro_nature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a macro nature photographer writing MICRO NATURE scenes for EarthBot. Extreme close-ups of natural beauty — dewdrops refracting a sunrise on a petal, frost crystals forming on a spider web, lichen patterns on ancient rock, miniature moss forests, ice crystals, seed pods, mushroom gills. The macro lens reveals a world invisible to the naked eye. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE MICRO DETAIL ━━━
${detail}

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
Extreme close-up. Macro lens. Ultra-shallow depth of field. The tiny detail fills the frame — a world within a world. Light plays across surfaces in spectacular ways. The viewer discovers beauty at a scale they've never noticed.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
