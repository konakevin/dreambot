/**
 * EarthBot geological-wonder — Earth's geological spectacles.
 * Crystal caves, basalt columns, slot canyons, geysers, lava tubes.
 * The raw architecture of the planet.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.GEOLOGICAL_SCENES, 'geological_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a geological photographer writing GEOLOGICAL WONDER scenes for EarthBot. The raw architecture of the planet — crystal caves with amethyst walls, basalt column formations, slot canyons with light beams, erupting geysers, lava tubes, travertine terraces, glacier ice caves. The geology itself is spectacular and alien. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE GEOLOGICAL WONDER ━━━
${scene}

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
The geological formation dominates the frame. Light interacts with the rock/crystal/water in spectacular ways. The scale can be intimate (cave interior) or epic (canyon vista). Earth's raw architecture as art.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
