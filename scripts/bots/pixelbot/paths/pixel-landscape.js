const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PIXEL_PRETTY_SETTINGS, 'pixel_pretty_setting');
  const element = picker.pickWithRecency(pools.PIXEL_PRETTY_ELEMENTS, 'pixel_pretty_element');
  const lighting = picker.pickWithRecency(pools.PIXEL_LIGHTING, 'pixel_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pixel-art gallery-artist writing PRETTY PIXEL SCENE renders for PixelBot. Pure beauty — no characters, no action, no genre. Just gorgeous pixel scenery. Flagship quality.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.PIXEL_PRETTY_BLOCK}

━━━ PIXEL ERA ━━━
${sharedDNA.pixelEra}

━━━ THE SETTING ━━━
${setting}

━━━ THE VISUAL ELEMENT ━━━
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
Frame through the camera perspective above. Pure beauty + atmosphere. Gallery quality.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
