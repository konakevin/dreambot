/**
 * EarthBot weather-moment path — Earth weather dialed up at ground level.
 * Aurora on ice-field, supercell over prairie, fog in redwoods, monsoon,
 * blood-moon. The "storm chaser got lucky" shot.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.EARTH_WEATHER_PHENOMENA, 'weather_phenomenon');
  const biome = picker.pickWithRecency(pools.BIOMES, 'biome');
  const timeOfDay = picker.pickWithRecency(pools.TIME_OF_DAY, 'time_of_day');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a storm-chaser / weather photographer writing EARTH WEATHER MOMENT scenes for EarthBot. Ground-level Earth weather cranked to dramatic — the "I can't believe I caught this" moment. Output wraps with style prefix + suffix.

${blocks.EARTH_ONLY_BLOCK}

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_WILDLIFE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE WEATHER PHENOMENON ━━━
${phenomenon}

━━━ BIOME CONTEXT ━━━
${biome}

━━━ TIME OF DAY / LIGHT ━━━
${timeOfDay}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Ground-level perspective with the weather event as primary subject. Stack additional atmospheric elements (light breaks, secondary weather, distant-curtains). Dynamic + cinematic + impossible-moment energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
