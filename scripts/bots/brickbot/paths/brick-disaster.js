const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DISASTER_SCENES, 'disaster_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK DISASTER scenes for BrickBot. Catastrophic moments frozen in plastic — volcanoes erupting with transparent orange and red bricks, tidal waves of blue pieces crashing into cities, meteors made of grey boulders smashing through buildings, tornadoes scattering bricks, earthquakes cracking baseplates apart. Destruction has never been so fun. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE DISASTER ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ CAMERA STYLE ━━━
${sharedDNA.cameraStyle}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-collapse action shot. Bricks flying, structures crumbling, transparent pieces for fire/water/smoke effects. Minifigs fleeing in terror. The moment of maximum chaos, frozen in plastic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
