/**
 * EarthBot sky path — SKY IS THE SUBJECT. Aurora, supercell, mammatus,
 * Milky-Way arc, sun-dog, noctilucent clouds. Ground is peripheral context.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.SKY_PHENOMENA, 'sky_phenomenon');
  const biome = picker.pickWithRecency(pools.BIOMES, 'biome');
  const timeOfDay = picker.pickWithRecency(pools.TIME_OF_DAY, 'time_of_day');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sky / atmospheric photographer writing SKY-IS-SUBJECT scenes for EarthBot. The SKY is the hero — ground is peripheral silhouette or context. Rare, exotic, dramatic atmospheric spectacles. Output wraps with style prefix + suffix.

${blocks.EARTH_ONLY_BLOCK}

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_WILDLIFE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SKY PHENOMENON (hero of the frame) ━━━
${phenomenon}

━━━ GROUND CONTEXT (peripheral only — biome silhouette) ━━━
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
Sky occupies 60-80% of frame. Ground is silhouette / dark strip at bottom — anchors scale but does NOT compete with sky. The sky phenomenon is stacked with multiple atmospheric elements where plausible (rays + clouds + secondary phenomenon). Saturation and scale maximized.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
