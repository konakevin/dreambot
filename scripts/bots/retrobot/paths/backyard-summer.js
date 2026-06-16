/**
 * RetroBot backyard-summer — the suburban backyard on a hot summer day:
 * the cookout, the kiddie pool, the sprinkler, slip-n-slide, lawn games,
 * hula hoops on the fence, fireflies at dusk. No people — the family just
 * went inside, the place tells the story. Golden-hour / warm-afternoon light.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BACKYARD_SUMMER, 'backyard_summer');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');

  return `You are writing a BACKYARD-SUMMER scene for RetroBot — the suburban backyard on a hot summer day, 1975-1995. The cookout, the pool, the sprinkler, the freedom of summer. Pure scene, no people visible. The viewer feels warm grass under bare feet and smells charcoal and cut grass. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE BACKYARD SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
The backyard, patio, or deck at golden hour or warm hazy afternoon — long shadows, warm amber, the chain-link fence and the neighbor's garage beyond. Objects imply the family was just here: the grill still trailing smoke, the sprinkler running, lawn chairs sitting empty, a popsicle melting on the step. Hula hoops on the fence, a bike dropped in the grass. Fireflies starting to glow at dusk. The feeling of an endless summer evening.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
