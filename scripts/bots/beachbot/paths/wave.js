const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.WAVE_MOMENTS, 'wave_moment');
  const seaColor = picker.pickWithRecency(pools.SEA_COLORS, 'sea_color');
  const weather = picker.pickWithRecency(pools.COASTAL_WEATHER_MOMENTS, 'coastal_weather');

  return `You are a signature-surf photographer writing CLARK-LITTLE WAVE scenes for BeachBot. Unusual perspectives + rich backdrops.

${blocks.BEACH_PARADISE_BLOCK}

${blocks.WALLPAPER_WORTHY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.CLARK_LITTLE_WAVE_BLOCK}

━━━ THE WAVE MOMENT ━━━
${moment}

━━━ SEA COLOR ━━━
${seaColor}

━━━ WEATHER / LIGHT ━━━
${weather}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Unusual surf-photographer perspective. Wave is hero. Rich backdrop.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
