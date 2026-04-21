const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.REEF_SCENES, 'reef_scene');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'ocean_atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are an underwater photographer writing MAXED REEF LIFE scenes for OceanBot. Abundance dialed to 11. Many fish + many coral + many colors.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.REEF_EXPLOSION_BLOCK}

━━━ THE REEF SCENE ━━━
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
Wide or mid-wide reef-abundance frame. Multi-species chaos. Sunbeam + particulate + depth.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
