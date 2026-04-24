/**
 * RetroBot mall-hangout — food courts, arcade corners, roller rinks,
 * Sam Goody, Spencer's, Orange Julius, neon, escalators, fountain areas,
 * convenience store candy aisles.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MALL_HANGOUT, 'mall_hangout');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a MALL HANGOUT scene for RetroBot — the 1980s-90s mall as social hub. Arcades, food courts, roller rinks, music stores, neon everywhere. Pure scene, no people visible. The viewer smells the Orange Julius and hears the arcade cabinets. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE MALL HANGOUT SCENE ━━━
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
Interior mall environment — neon signs reflected on polished floors, fluorescent mixed with storefront glow. Objects imply recent activity — trays left on food court tables, tokens scattered, a jacket draped over an arcade stool. The mall is alive but the frame catches a quiet moment between the crowds.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
