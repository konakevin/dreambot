const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const world = picker.pickWithRecency(pools.CONTAINED_WORLDS, 'contained_world');
  // Bespoke verb-led dweller, 2026-09-22. This path always rolled a creature, so unlike its three
  // siblings it was never EMPTY -- but TINY_CREATURES holds static poses ("perched on a rose
  // petal"), so the frame had an inhabitant and still had nothing happening. The header below also
  // said OPTIONAL, which was never true of the roll.
  const creature = picker.pickWithRecency(pools.TINY_TERRARIUM_DWELLERS, 'tiny_terrarium_dweller');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a surreal-miniature artist writing CONTAINED WORLD scenes for TinyBot. Terrariums + object-containers + surreal-tiny juxtapositions. Cute + clever. Never sci-fi / dark / horror. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.CONTAINED_WORLD_SURREAL_BLOCK}

━━━ THE CONTAINED WORLD ━━━
${world}

━━━ WHO LIVES IN THIS LITTLE WORLD -- MANDATORY, AND THEY ARE MID-ACTION ━━━
${creature}

This container is somebody's whole world and they are using it right now. Write the dweller into the frame doing exactly what they're doing, touching the actual part of the container named -- the glass, the cork, the moss slope, the pebble shore. They stay small and readable: the CONTAINED WORLD is still the hero, and their scale against it is what sells how big that little world feels.

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

━━━ COMPOSITION ━━━
Mid-close container-focused frame. Shallow DOF on subject. Surreal scale-play visible. Cute + clever energy dominant.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
