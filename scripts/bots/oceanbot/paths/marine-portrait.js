const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.MARINE_PORTRAIT_SUBJECTS, 'marine_portrait');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'ocean_atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are an expert aquatic photographer writing MARINE PORTRAIT scenes for OceanBot. ONE real marine creature as sole hero. Candid. Razor-sharp detail.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE MARINE SUBJECT ━━━
${subject}

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
Mid-close or close marine portrait. Single subject hero. Razor-sharp detail on skin / scale / eye.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
