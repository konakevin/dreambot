/**
 * AncientBot ancient-harbor — maritime trade and ports.
 * Where civilizations meet. Ships, docks, goods, the bustle of Bronze Age commerce.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const harbor = picker.pickWithRecency(pools.HARBOR_SCENES, 'harbor_scene');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const activity = picker.pickWithRecency(pools.HUMAN_ACTIVITY, 'human_activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE ancient harbor/port scene for AncientBot. This is where CIVILIZATIONS MEET — goods, languages, ideas flowing between cultures at a bustling Bronze Age port. Ships at anchor, docks piled with cargo, the organized chaos of maritime trade. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.HUMAN_ACTIVITY_BLOCK}

━━━ CIVILIZATION ━━━
${civilization}
Root every detail in THIS civilization's maritime traditions — their ship designs, dock construction, trade goods, harbor engineering.

━━━ THE HARBOR SCENE ━━━
${harbor}

━━━ ARCHITECTURAL DETAIL (harbor infrastructure) ━━━
${archDetail}

━━━ DOCKSIDE ACTIVITY ━━━
${activity}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ COMPOSITION ━━━
Harbor opening toward WATER, ships at various distances (some docked, some at anchor, some arriving). Foreground: docks, warehouses, cargo piles, ropes, rigging, tiny busy figures loading/unloading. Midground: harbor basin with ships, stone breakwaters, moored vessels. Background: the town/city rising behind the harbor — temples, walls, rooftops stepping up the hillside. Water should be alive with reflections, small craft, light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
