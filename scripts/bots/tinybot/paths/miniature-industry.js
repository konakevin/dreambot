const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MINIATURE_INDUSTRY, 'miniature_industry');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a master model-maker writing MINIATURE INDUSTRY scenes for TinyBot. Dollhouse-scale workshops, factories, train yards, clockwork repair benches, construction sites. The "wow, someone BUILT that" diorama energy. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MINIATURE INDUSTRY SCENE ━━━
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

━━━ MINIATURE INDUSTRY DNA ━━━
The CRAFTSMANSHIP is the star. Every tool has a purpose. Every surface shows use — sawdust, oil stains, chalk marks, worn handles. The workspace feels ACTIVE — mid-project, not museum-clean. Include scale cues: thumbtack-sized rivets, matchstick lumber, thimble-sized crucibles. Lighting palette dictated by axes above. The viewer thinks "someone spent MONTHS building this model." Master-modelmaker pride in every millimeter.

━━━ COMPOSITION ━━━
Wide or mid-wide workshop frame. Tilt-shift shallow DOF. Tool density and material textures prominent. Practical workshop lighting whose color follows the LIGHTING + WEATHER axes above. Scale-play visible throughout.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
