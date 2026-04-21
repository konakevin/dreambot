/**
 * EarthBot cozy-nature path — warm, inviting, "I want to BE here" Earth nature.
 * Sun-dappled clearings, willow rivers, pine trails. Softer than vista,
 * warmer than hidden-corner.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COZY_EARTH_SCENES, 'cozy_scene');
  const biome = picker.pickWithRecency(pools.BIOMES, 'biome');
  const timeOfDay = picker.pickWithRecency(pools.TIME_OF_DAY, 'time_of_day');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a warm-nature photographer writing COZY EARTH NATURE scenes for EarthBot. Soft, welcoming, "I want to BE here" earthly nature. The viewer should exhale and want to walk into the frame. Output wraps with style prefix + suffix.

${blocks.EARTH_ONLY_BLOCK}

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_WILDLIFE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY SCENE ━━━
${scene}

━━━ BIOME CONTEXT ━━━
${biome}

━━━ TIME OF DAY / LIGHT (warm preferred) ━━━
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
Mid-wide or mid frame. Warm, inviting, golden. Soft light dominant — never harsh. Lush + welcoming + approachable. The viewer should feel they could sit, lie down, stay.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
