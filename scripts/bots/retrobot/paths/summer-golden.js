/**
 * RetroBot summer-golden — bikes in grass, sprinklers, popsicles,
 * streetlights at dusk, fireflies, slip-n-slide, neighborhood summer.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SUMMER_GOLDEN, 'summer_golden');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a SUMMER GOLDEN scene for RetroBot — endless childhood summers, 1975-1995. The neighborhood, the backyard, the freedom of no school. Pure scene, no people visible. The viewer feels the warm grass under bare feet. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE SUMMER SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ LIGHTING ━━━
${lighting}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Outdoor suburban neighborhood or backyard. Golden-hour or magic-hour lighting — long shadows, warm amber everywhere. Objects imply kids were just here — bikes dropped in grass, a hose still running, popsicle sticks on the porch. Fireflies or streetlights beginning to glow. The feeling of "five more minutes before mom calls us in."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
