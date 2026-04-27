/**
 * AncientBot monument — singular colossal structures + megalithic sites.
 * Pyramids, ziggurats, stone circles, colossi. The monument IS the frame.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const monument = picker.pickWithRecency(pools.MONUMENTS, 'monument');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE colossal ancient monument for AncientBot. A SINGLE monumental achievement dominates the entire frame — pyramid, ziggurat, stone circle, colossal statue, megalithic site. Everything else exists only to provide SCALE. The monument should feel IMPOSSIBLE — how did ancient humans build THIS? Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.MONUMENTAL_SCALE_BLOCK}

━━━ CIVILIZATION ━━━
${civilization}

━━━ THE MONUMENT ━━━
${monument}
This structure FILLS the frame. It is the ENTIRE subject. Render its surface obsessively — every stone course, every carved relief, every painted surface, every weathering mark.

━━━ ARCHITECTURAL DETAIL (hero detail on the monument itself) ━━━
${archDetail}

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
The monument DOMINATES — centered or slightly off-center, filling 60-80% of the frame. Tiny human figures at the base provide DEVASTATING scale reference. The surrounding landscape (desert, plain, hillside, river) frames the monument but never competes with it. Sky above is dramatic — never empty, never boring. For megalithic sites: LOW angle emphasizing stone mass against dramatic sky.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
