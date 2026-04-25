const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MASTERPIECE_BUILDS, 'masterpiece_build');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO sculptor writing MASTERPIECE BUILD showcases for BrickBot. Standalone LEGO creations — NOT dioramas or scenes, but individual builds that are art objects on their own. Think LEGO Masters competition pieces: a life-size guitar, a kinetic sculpture, a massive dragon head, a working clock, a fashion gown made of bricks, a photorealistic animal, a surreal impossible object. The BUILD TECHNIQUE is the star — SNOT, Technic integration, organic curves from angular bricks, color gradients across hundreds of pieces. Display pedestal or clean backdrop. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE MASTERPIECE ━━━
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
The build is the ONLY subject — clean background, gallery or competition display. Product photography or museum showcase framing. Focus on build technique, color use, and engineering. The viewer should be studying HOW it was built.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
