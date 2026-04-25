const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CINEMATIC_SCENES, 'cinematic_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK CINEMATIC scenes for BrickBot. Iconic movie moments rebuilt in LEGO — action sequences with brick explosions, car chases on studded roads, heist scenes, spy thrillers, epic battles. NOT specific IP — original scenes that FEEL like blockbusters. Dramatic camera angles, motion blur on minifig arms, transparent pieces for muzzle flash and explosions. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE CINEMATIC SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Cinematic widescreen framing. Dutch angles, low camera, dramatic depth of field. Action frozen mid-frame. Smoke, sparks, debris — all made of LEGO pieces. Movie-poster energy in plastic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
