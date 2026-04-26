const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COTTAGE_VILLAGE, 'cottage_village');
  const lighting = picker.pickWithRecency(pools.TILT_SHIFT_LIGHTING, 'tilt_shift_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a master model-maker writing MINIATURE COTTAGE VILLAGE scenes for TinyBot. Dollhouse-scale villages with thatched cottages, cobblestone lanes, glowing windows, stone bridges, market squares — all at tilt-shift miniature diorama scale. Exterior views only. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MINIATURE VILLAGE SCENE ━━━
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

━━━ MINIATURE VILLAGE DNA ━━━
This is a MODEL VILLAGE — every cottage fits in your palm. Render with master-modelmaker obsession: hand-laid stone walls the size of sugar cubes, thatched roofs of real dried grass, chimney smoke from a hidden incense stick, window glass from tiny resin drops glowing warm. The village feels LIVED IN at miniature scale — washing lines with thread-sized clothes, matchstick woodpiles, pinhead doorknobs, thimble flower pots. Tilt-shift shallow DOF makes the real feel dollhouse. The viewer wants to reach in and rearrange the tiny furniture.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view looking down at the village like a model railway layout. Tilt-shift shallow DOF. Obsessive architectural detail at miniature scale. Warm palette dominant. Exterior views only — rooftops, streets, gardens, paths.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
