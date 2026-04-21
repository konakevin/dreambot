const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.AFTER_DARK_OCEAN_SCENES, 'after_dark_scene');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'ocean_atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a low-light ocean photographer writing AFTER-DARK OCEAN scenes for OceanBot. Bioluminescent / moonlit / twilight / glowing-reef / luminous-atmosphere.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

━━━ THE AFTER-DARK SCENE ━━━
${scene}

━━━ LIGHTING (bioluminescent / moonlit preferred) ━━━
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
Low-light luminous ocean scene. Glowing/bioluminescent phenomena as hero.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
