const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const world = picker.pickWithRecency(pools.CONTAINED_WORLDS, 'contained_world');
  const creature = picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature');
  const lighting = picker.pickWithRecency(pools.TILT_SHIFT_LIGHTING, 'tilt_shift_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a surreal-miniature artist writing CONTAINED WORLD scenes for TinyBot. Terrariums + object-containers + surreal-tiny juxtapositions. Cute + clever. Never sci-fi / dark / horror. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.CONTAINED_WORLD_SURREAL_BLOCK}

━━━ THE CONTAINED WORLD ━━━
${world}

━━━ OPTIONAL TINY CREATURE INHABITANT ━━━
${creature}

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
Mid-close container-focused frame. Shallow DOF on subject. Surreal scale-play visible. Cute + clever energy dominant.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
