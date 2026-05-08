const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_FOOD_WORLD, 'tiny_food_world');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a master model-maker writing TINY-FOOD-WORLD scenes for TinyBot. Edible dioramas where food becomes architecture and landscape — sushi as island archipelago, cake as hilltop village, cookies as marketplace, fondant fairyland, breadcrumb forest, sugar-glass lake, croissant rooftops, macaron staircases, candy mountains. Studio Ghibli food-magic crossed with Great-British-Bake-Off + miniature wonder. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TINY-FOOD-WORLD SCENE ━━━
${scene}

${blocks.varietyAxesSection(sharedDNA)}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ TINY-FOOD-WORLD DNA ━━━
The food MUST READ AS REAL FOOD first, miniature world second. Texture is everything: glossy cake-frosting domes, crusty bread-loaf cliffs, sugar-glass tide pools, marshmallow snowdrifts, gummy-bear inhabitants peeking out, sprinkle paths, fondant rooftops, cookie cobblestones, raspberry-orchard trees, whipped-cream clouds. Cake-decorator obsession-level detail at miniature diorama scale. Tilt-shift shallow DOF makes the food feel like landscape from a distance, then resolves into edible architecture on close inspection. Warm bakery lighting + crisp food-photography clarity.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view looking down at the food-world like a model railway, OR macro-close on a food-village street where the food-architecture fills the frame. Tilt-shift shallow DOF. The food is the world. Tiny gummy / fondant / marzipan inhabitants OK as peripheral inhabitants — never identifiable humans. Palette dictated by LIGHTING + WEATHER + VIBE blocks above.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
