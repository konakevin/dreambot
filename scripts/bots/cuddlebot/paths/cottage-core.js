/**
 * CuddleBot cottage-core path — cute cottage villages and town life.
 * Thatched-roof cottages, cobblestone lanes, glowing windows at night,
 * rainy village mornings, tiny creatures out and about in their village.
 * Architecture + village atmosphere is the star.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COTTAGECORE_SCENES, 'cottagecore_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing COTTAGE VILLAGE scenes for CuddleBot — cute little cottages, village streets, town squares, and tiny creatures out and about in their charming cottage world. The ARCHITECTURE and SETTING are the hero — thatched roofs, cobblestone paths, flower-box windows, glowing lanterns, stone bridges, market stalls. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COTTAGE VILLAGE SCENE ━━━
${scene}

━━━ VILLAGE RESIDENT (feature this creature in the scene) ━━━
${creature}

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

━━━ COTTAGE VILLAGE DNA ━━━
The COTTAGES and VILLAGE are the subject — not a background element. Render the architecture with obsessive detail: hand-laid stone walls, weathered wooden shutters, mossy thatched roofs, flower boxes overflowing with blooms, warm light glowing from within, chimney smoke curling upward, cobblestone paths worn smooth. The village feels LIVED IN — laundry on lines, boots by doors, bicycle against a fence, market crates stacked. The VILLAGE RESIDENT creature above is a tiny local going about their village life — walking home with groceries, sweeping a doorstep, splashing in puddles, carrying a tiny basket. Feature them naturally in the scene — small but charming. The viewer wants to LIVE HERE. Artbook-quality rendering.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
