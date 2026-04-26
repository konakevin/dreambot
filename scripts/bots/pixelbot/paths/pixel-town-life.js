const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PIXEL_TOWN_SETTINGS, 'pixel_town_setting');
  const activity = picker.pickWithRecency(pools.PIXEL_TOWN_ACTIVITY, 'pixel_town_activity');
  const lighting = picker.pickWithRecency(pools.PIXEL_LIGHTING, 'pixel_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pixel-art worldbuilder writing BUSTLING TOWN LIFE scenes for PixelBot. Busy RPG hub-towns — marketplaces, ports, taverns, train stations, bazaars. More urban and lively than cozy cottages. The kind of town where adventurers gather, merchants hawk wares, and there's always something happening.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ PIXEL ERA ━━━
${sharedDNA.pixelEra}

━━━ THE TOWN SETTING ━━━
${setting}

━━━ THE ACTIVITY ━━━
${activity}

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
Frame the town through the camera perspective above. Multiple pixel figures and activity details visible. The town feels ALIVE — commerce, craft, travel, social. Dense but readable pixel composition.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
