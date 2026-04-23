const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const diorama = useLandscape
    ? picker.pickWithRecency(pools.VINYL_LANDSCAPES, 'vinyl_landscape')
    : picker.pickWithRecency(pools.VINYL_DIORAMAS, 'vinyl_diorama');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a designer-toy photographer writing VINYL DIORAMA scenes for ToyBot. Funko-Pop oversized-head figures in themed dioramas. Kidrobot / designer-toy. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ VINYL MEDIUM LOCK ━━━
Oversized-head small-body vinyl figure. Glossy sheen on surface. Matte-painted panel lines. Smooth sculpted form.

━━━ THE VINYL DIORAMA ━━━
${diorama}

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
Mid-close themed diorama. Vinyl figure heroic-posed. Cinematic lighting on glossy surface.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
