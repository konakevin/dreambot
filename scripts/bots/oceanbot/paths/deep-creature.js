const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DEEP_CREATURES, 'deep_creature');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'ocean_atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a deep-ocean creature illustrator writing DEEP CREATURE scenes for OceanBot. Real + mythic marine beasts. Gnarly + dramatic.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE DEEP CREATURE ━━━
${creature}

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
Mid frame creature-as-hero. Scale via surroundings. Sharp detail.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
