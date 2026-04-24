/**
 * RetroBot bedroom-time-capsule — posters, lava lamps, boombox, mixtapes,
 * action figures, Lisa Frank, friendship bracelets, magazines, Walkman.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BEDROOM_TIME_CAPSULE, 'bedroom');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a BEDROOM TIME CAPSULE scene for RetroBot — a kid's bedroom frozen in time, 1975-1995. Every shelf, every wall, every surface tells the story of who lived here. Pure scene, no people visible. The viewer recognizes their own bedroom. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE BEDROOM SCENE ━━━
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
Interior bedroom, slightly messy, deeply personal. Warm lamp glow or afternoon sun through blinds. Posters on walls, objects on shelves, something playing on a small TV or stereo. The bed is unmade, a book or magazine left open. Every detail is era-authentic. The viewer wants to sit down and stay a while.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
