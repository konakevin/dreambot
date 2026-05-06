/**
 * TravelBot deep-forest — old-growth temperate forest, redwood cathedrals,
 * mossy hike-discoveries. Pacific Northwest + Sequoia + Hoh + Bavarian +
 * Japanese cedar groves. Cathedral canopies, godrays through cedar fog,
 * fallen-log bridges, abandoned cabins among ferns, glowing fungi.
 * The "I'm in a real-life Lord of the Rings forest" feeling.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DEEP_FOREST_SCENES, 'deep_forest_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an old-growth-forest photographer writing DEEP FOREST scenes for TravelBot. Cathedral canopies, redwood/sequoia/cedar/old-growth scale, dense lush detail, godrays piercing the foliage, the kind of forest a hiker dreams of stumbling into. Mid-to-wide framing — NOT a tight macro, NOT a panoramic vista. Tree trunks are columns, the canopy is a roof, the floor is a carpet of moss and ferns. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE FOREST SCENE ━━━
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
Mid-to-wide forest frame — tree trunks tower as columns, canopy forms a vaulted roof overhead, floor carpeted in moss and ferns. Either deep into the forest looking through trunks, or looking up the column of a giant tree, or following a trail/creek/log into the depths. Light is dappled, filtered, godray-pierced. EVERY layer alive: bark texture, hanging moss, fern fronds, fallen leaves, glowing fungi, mist drifting between trunks. The viewer wants to walk INTO this frame.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
