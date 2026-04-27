/**
 * OceanBot tropical-paradise — crystal lagoons, turquoise shallows, palm-fringed atolls.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TROPICAL_PARADISE, 'tropical_paradise');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a tropical ocean photographer writing TROPICAL PARADISE scenes for OceanBot. Crystal clear lagoons, turquoise shallows over white sand, palm-fringed atolls, overwater views into impossibly clear water, Maldives/Bora Bora/Seychelles energy. The dream of tropical ocean perfection. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE TROPICAL SCENE ━━━
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
Wide or mid frame. Turquoise water is the star — crystal clear, impossibly blue-green. White sand below, blue sky above. Paradise perfection. NOT a specific named resort — universal tropical ocean beauty.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
