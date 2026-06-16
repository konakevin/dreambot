/**
 * RetroBot park-and-pier — the big summer thrill destination: amusement parks,
 * water parks, boardwalks, county fairs. Ferris wheels at dusk, log flumes,
 * midway stalls, water slides, the carousel. No people. Dusk / blue-hour /
 * golden light with the ride lights glowing.
 *
 * Light is BAKED into the composition; the shared (mostly-indoor) LIGHTING axis
 * is omitted so it can't inject a wrong interior light.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PARK_AND_PIER, 'park_and_pier');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');

  return `You are writing an AMUSEMENT-PARK / WATER-PARK / BOARDWALK / COUNTY-FAIR scene for RetroBot — the big summer thrill destination, 1975-1995. The best day of summer. Pure scene, no people visible. The viewer feels the warm night air, popcorn and funnel cake, the magic of the lights coming on. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE PARK / PIER SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Dusk or blue hour with the ride lights glowing — incandescent bulbs outlining the Ferris wheel, warm midway string-lights, hand-painted neon — OR a warm golden afternoon at the water park / boardwalk. Period rides and signage, no LED. Rides sit mid-cycle, the lot half-full, plush prizes hung over empty game stalls, a dripping log at the flume splashdown. The smell of popcorn and corn dogs, the hum of the carousel organ. The feeling of the best night of summer.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
