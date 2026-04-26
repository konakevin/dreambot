const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PIXEL_COTTAGE_SETTINGS, 'pixel_cottage_setting');
  const detail = picker.pickWithRecency(pools.PIXEL_COTTAGE_DETAILS, 'pixel_cottage_detail');
  const lighting = picker.pickWithRecency(pools.PIXEL_LIGHTING, 'pixel_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pixel-art village-builder writing COTTAGE VILLAGE scenes for PixelBot. Retro RPG village energy — Stardew Valley, JRPG towns, Link to the Past hamlets. Cozy cottages, cobblestone lanes, glowing windows, chimney smoke. The architecture and village atmosphere are the hero.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ PIXEL ERA ━━━
${sharedDNA.pixelEra}

━━━ THE VILLAGE SETTING ━━━
${setting}

━━━ LIVED-IN DETAIL ━━━
${detail}

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
Frame the village through the camera perspective above. The buildings and paths are the subject. Charming, warm, detailed architecture. Every pixel says "someone lives here." The viewer wants to walk into this village and never leave.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
