/**
 * AncientBot grand-temple — monumental religious architecture + ceremonies.
 * Colossal temples, ziggurats, sanctuaries. The architecture IS worship.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const temple = picker.pickWithRecency(pools.GRAND_TEMPLES, 'grand_temple');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const activity = picker.pickWithRecency(pools.HUMAN_ACTIVITY, 'human_activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE monumental ancient temple scene for AncientBot. This is a SACRED SPACE — a place built to house gods, awe mortals, and survive millennia. The architecture should make the viewer feel SMALL and REVERENT. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.MONUMENTAL_SCALE_BLOCK}

${blocks.HUMAN_ACTIVITY_BLOCK}

━━━ CIVILIZATION ━━━
${civilization}
Root every architectural detail in THIS specific civilization's building traditions. Use THEIR materials, THEIR decorative motifs, THEIR construction techniques.

━━━ THE TEMPLE SCENE ━━━
${temple}

━━━ ARCHITECTURAL DETAIL (render prominently) ━━━
${archDetail}

━━━ BACKGROUND ACTIVITY ━━━
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
LOW camera angle looking UP at monumental architecture. The temple TOWERS over the viewer. Human figures are TINY at the base — priests, worshippers, offering-bearers — providing devastating scale reference. Depth through layered architectural elements: foreground columns, midground halls, background towers/pylons against sky.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
