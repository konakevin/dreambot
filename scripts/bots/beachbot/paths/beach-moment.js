const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.BEACH_MOMENTS, 'beach_moment');
  const weather = picker.pickWithRecency(pools.COASTAL_WEATHER_MOMENTS, 'coastal_weather');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a narrative-photographer writing BEACH MOMENT scenes for BeachBot. Beach-objects tell the story. NO humans.

${blocks.BEACH_PARADISE_BLOCK}

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ THE BEACH MOMENT ━━━
${moment}

━━━ WEATHER / LIGHT ━━━
${weather}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-close object-centered frame. Narrative implied via beach-objects. No humans.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
