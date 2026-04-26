const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const room = picker.pickWithRecency(pools.PIXEL_COZY_ROOMS, 'pixel_cozy_room');
  const detail = picker.pickWithRecency(pools.PIXEL_COZY_DETAILS, 'pixel_cozy_detail');
  const lighting = picker.pickWithRecency(pools.PIXEL_LIGHTING, 'pixel_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pixel-art cozy-artist writing PIXEL COZY scenes for PixelBot. Bedrooms, tiny cottages, pixel cafes. Interiors that feel warm and lived-in.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ PIXEL ERA ━━━
${sharedDNA.pixelEra}

━━━ THE COZY ROOM ━━━
${room}

━━━ THE WARM DETAIL ━━━
${detail}

━━━ PIXEL LIGHTING (warm preferred) ━━━
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
Frame through the camera perspective above. Stardew-Valley-interior aesthetic. Warm detail.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
