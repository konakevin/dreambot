/**
 * AncientBot river-civilization — fertile rivers and agriculture.
 * The relationship between water and civilization. Rivers as the source of everything.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const river = picker.pickWithRecency(pools.RIVER_SCENES, 'river_scene');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const activity = picker.pickWithRecency(pools.HUMAN_ACTIVITY, 'human_activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE ancient river civilization landscape for AncientBot. The RIVER is the central compositional element — it is the reason the civilization EXISTS. Settlements cluster along its banks, fields spread from its waters, boats carry its commerce. Water and human ambition intertwined. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.HUMAN_ACTIVITY_BLOCK}

━━━ CIVILIZATION ━━━
${civilization}
Root every detail in THIS civilization's relationship with water — their irrigation techniques, river craft, agricultural calendar, riverside architecture.

━━━ THE RIVER SCENE ━━━
${river}

━━━ ARCHITECTURAL DETAIL (riverside structures) ━━━
${archDetail}

━━━ RIVERSIDE ACTIVITY ━━━
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
WIDE landscape with the river as central element — flowing through the frame, reflecting sky and architecture. Settlements cluster along BOTH banks. Layered depth: foreground riverbank detail (reeds, boats, fishermen), midground irrigated fields and riverside buildings, background temples/monuments rising above the river plain, distant horizon. The river CONNECTS everything in the composition. Water should GLEAM with reflected light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
