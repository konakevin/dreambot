/**
 * RetroBot sleepover-night — pizza boxes, horror movies on VHS, prank calls,
 * N64/SNES controllers, blanket forts, late-night giggling energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SLEEPOVER_NIGHT, 'sleepover');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a SLEEPOVER NIGHT scene for RetroBot — the ultimate childhood social event, 1980-1995. Basement or living room floor, late at night, everything is exciting because you're still awake. Pure scene, no people visible. The viewer hears the VHS rewinding. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE SLEEPOVER SCENE ━━━
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
Basement or living room floor level — sleeping bags, pillows, blankets everywhere. TV glow is the primary light source, maybe a lava lamp or nightlight. Pizza boxes, soda cans, game controllers, VHS tapes scattered. The mess of a perfect night. It's 2am and nobody wants to sleep.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
