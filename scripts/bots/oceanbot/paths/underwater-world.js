const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const env = picker.pickWithRecency(pools.UNDERWATER_ENVIRONMENTS, 'underwater_environment');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'ocean_atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are an underwater-world cinematographer writing UNDERWATER WORLD scenes for OceanBot. Vast underwater ecosystems. Pure environment.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE UNDERWATER ENVIRONMENT ━━━
${env}

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
Wide vast underwater scale. Environment is hero. Dramatic depth + light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
