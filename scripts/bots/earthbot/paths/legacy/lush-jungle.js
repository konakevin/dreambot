/**
 * TravelBot lush-jungle — Amazon / Borneo / Costa Rica / Bali / Daintree /
 * Hawaii deep jungle. Multi-tier waterfalls into emerald pools, dense canopy
 * with sun-shafts, vine curtains, orchid-laden branches, hidden temple ruins
 * absorbed by foliage, mist threading through layered green.
 * The "could you imagine being here right now" rainforest awe.
 */

const pools = require('../../earth/pools');
const blocks = require('../../earth/shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.LUSH_JUNGLE_SCENES, 'lush_jungle_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a tropical rainforest photographer writing LUSH JUNGLE scenes for TravelBot. Amazon / Borneo / Costa Rica / Bali / Daintree / Hawaii rainforest energy. Multi-tier waterfalls into emerald pools, dense canopy with sun-shafts piercing, vine curtains, orchid-laden branches, mist threading through layered green. The frame is HUMID — viewer can almost feel the wet heat. Mid-to-wide framing — NOT a tight macro, NOT a panoramic vista. The jungle hero is the SCENE, alive with stacked vegetation. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE JUNGLE SCENE ━━━
${scene}

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

━━━ COMPOSITION ━━━
Mid-to-wide jungle frame. Layered green depth — emergent canopy, mid-canopy, understory, ground all rendered. Water features (waterfall, river, pool, cenote, rapids) often present. Light is dappled, sun-shafted, humid. EVERY layer alive: dripping moss, orchids on branches, bromeliads in branch crooks, vines coiling trunks, fern undergrowth, moss on every surface. Saturated greens with vivid accent colors (bird, flower, frog, butterfly). The viewer wants to step INTO the wet warmth.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
