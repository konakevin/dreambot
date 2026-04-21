const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a paleo-landscape painter writing PALEO LANDSCAPE scenes for DinoBot. Prehistoric-Earth landscape. Distant dinos as scale OK.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.NO_JURASSIC_PARK_NAMES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ PALEO LANDSCAPE — distant dinos welcome as scale ━━━
World is the subject. Distant silhouettes of sauropods / pterosaur flock / herd allowed for scale + primordial energy.

━━━ THE SETTING ━━━
${setting}

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
Wide prehistoric vista. Landscape is hero. Distant dinosaur-silhouettes optional for scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
