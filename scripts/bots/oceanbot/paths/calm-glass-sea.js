/**
 * OceanBot calm-glass-sea — mirror-flat ocean, pastel sunrise, infinite horizon, stillness.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CALM_SEAS, 'calm_sea');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a fine-art seascape photographer writing CALM GLASS SEA scenes for OceanBot. Mirror-flat ocean, perfect reflections, infinite horizon, pastel light. The ocean at its most still and meditative — total silence, total beauty. Cinematic contrast to the chaos paths. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE CALM SCENE ━━━
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
Wide horizon. Mirror-flat water reflecting sky. Minimal elements — the simplicity IS the beauty. Pastel, silver, or golden light. Breathtaking stillness.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
