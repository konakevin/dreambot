/**
 * RetroBot saturday-morning — cereal bowls, CRT cartoons, pajamas on
 * carpet, toy commercials, morning sunlight through curtains.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SATURDAY_MORNING, 'saturday_morning');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a SATURDAY MORNING scene for RetroBot — the ritual of waking up early to watch cartoons, 1975-1995. Pure scene, no people visible. The viewer instantly feels 8 years old again. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE SATURDAY MORNING SCENE ━━━
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
Living room or den level, as if seen from the floor or a low couch. CRT glow is the primary light source mixed with early morning sun through curtains. Objects imply a kid was just here — cereal bowl, blanket, scattered toys. Warm, safe, Sunday-paper-quiet.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
