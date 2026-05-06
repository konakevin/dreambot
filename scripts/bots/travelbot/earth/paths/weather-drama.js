/**
 * EarthBot weather-drama — extreme weather as spectacle.
 * Supercells, aurora, lightning storms, monsoons, fog banks.
 * The "storm chaser got lucky" shot.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const weather = picker.pickWithRecency(pools.WEATHER_PHENOMENA, 'weather_phenomenon');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a storm-chaser photographer writing WEATHER DRAMA scenes for EarthBot. Ground-level weather spectacles cranked to maximum — the "I can't believe I caught this" moment. Aurora, supercells, lightning, fog rolling through valleys, double rainbows after storms. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE WEATHER PHENOMENON ━━━
${weather}

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
Ground-level perspective with the weather event as primary subject. Stack additional atmospheric elements. Dynamic, cinematic, impossible-moment energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
