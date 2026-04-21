/**
 * EarthBot hidden-corner path — intimate discovery / tight-frame earthly nature.
 * Mossy creeks, fern grottos, tide pools, forest clearings. The "quiet corner
 * of Earth you stumble into" moment.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const corner = picker.pickWithRecency(pools.HIDDEN_EARTH_CORNERS, 'hidden_corner');
  const biome = picker.pickWithRecency(pools.BIOMES, 'biome');
  const timeOfDay = picker.pickWithRecency(pools.TIME_OF_DAY, 'time_of_day');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an intimate nature photographer writing HIDDEN EARTH CORNER scenes for EarthBot — the quiet, discovered, tucked-away earthly nature moment. Tight or mid frame, NOT wide panorama. Output wraps with style prefix + suffix.

${blocks.EARTH_ONLY_BLOCK}

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_WILDLIFE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HIDDEN CORNER ━━━
${corner}

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
Tight or mid-close frame. Intimate, hand-held, discovered feel. Rich micro-detail: moss texture, water surface, wet leaves, stones. Light is dappled or filtered, never wide-vista. The viewer feels crouched into a small beautiful Earth-pocket.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
