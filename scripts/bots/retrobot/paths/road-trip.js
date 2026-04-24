/**
 * RetroBot road-trip — station wagons, paper maps, motel pools, rest stops,
 * cassette decks, fast food bags on the seat, highway sunsets.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ROAD_TRIP, 'road_trip');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a ROAD TRIP scene for RetroBot — family car trips across America, 1975-1995. Station wagons, highway motels, roadside attractions. Pure scene, no people visible. The viewer feels the vinyl backseat under their legs. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE ROAD TRIP SCENE ━━━
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
Car interior, motel exterior, or roadside scene. Highway sunset through a windshield, or a motel pool at dusk with vacancy sign buzzing. Objects tell the story — paper maps unfolded, cassette tapes scattered, fast food wrappers, luggage on a rack. The open road feeling of being somewhere between home and adventure.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
