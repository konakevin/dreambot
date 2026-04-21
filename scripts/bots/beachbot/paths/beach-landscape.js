const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BEACH_LANDSCAPE_SCENES, 'beach_landscape');
  const seaColor = picker.pickWithRecency(pools.SEA_COLORS, 'sea_color');
  const weather = picker.pickWithRecency(pools.COASTAL_WEATHER_MOMENTS, 'coastal_weather');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a coastal wide-lens photographer writing BEACH LANDSCAPE scenes for BeachBot. Wide POSTCARD of beach + context + weather.

${blocks.BEACH_PARADISE_BLOCK}

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.POSTCARD_WIDE_ANGLE_BLOCK}

━━━ THE BEACH LANDSCAPE ━━━
${scene}

━━━ SEA COLOR ━━━
${seaColor}

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
Wide postcard frame. Multiple elements (sky + beach + water + surroundings). Dramatic composition.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
