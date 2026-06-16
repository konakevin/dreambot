/**
 * RetroBot camp-and-lake — the family camping trip and the fishing spot: the
 * tent and campfire, the station wagon at the campground, the canoe on the
 * shore, the fishing dock, the lakeside cabin. No people — the family is near,
 * the place tells the story. Natural light: dawn mist, dusk pines, firelight,
 * starlight.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CAMP_AND_LAKE, 'camp_and_lake');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');

  return `You are writing a CAMPING & LAKESIDE scene for RetroBot — the family camping trip and the fishing spot, 1975-1995. The tent, the campfire, the dock, the canoe, the lake at dawn. Pure scene, no people visible. The viewer smells woodsmoke and pine and feels the deep quiet of being away. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE CAMP / LAKE SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
The campsite, lake shore, or dock in natural light — dawn mist on glassy water, golden hour through the pines, dusk, firelight, or a field of stars. Period gear only: canvas tent, Coleman stove and lantern, wood-paneled wagon, aluminum canoe. Objects imply the family is near: a tent pitched, a campfire glowing, a rod left on the dock, a cooler open on the tailgate. Tall pines, still water, the smell of woodsmoke. The feeling of being far from everything.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
