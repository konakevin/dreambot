const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PIXEL_SCIFI_SETTINGS, 'pixel_scifi_setting');
  const element = picker.pickWithRecency(pools.PIXEL_SCIFI_ELEMENTS, 'pixel_scifi_element');
  const lighting = picker.pickWithRecency(pools.PIXEL_LIGHTING, 'pixel_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pixel-art sci-fi illustrator writing PIXEL SCI-FI scenes for PixelBot. Cyberpunk alleys / spaceships / alien planets / vaporwave.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ PIXEL ERA ━━━
${sharedDNA.pixelEra}

━━━ THE SCI-FI SETTING ━━━
${setting}

━━━ THE SCI-FI ELEMENT ━━━
${element}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION ━━━
Frame through the camera perspective above. Neon/space/cyberpunk atmosphere.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
