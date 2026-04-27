/**
 * AncientBot lost-ruins — rediscovery and archaeological romance.
 * Civilizations as they appear NOW — half-buried, overgrown, gorgeous in decay.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const ruin = picker.pickWithRecency(pools.LOST_RUINS, 'lost_ruin');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE lost-ruins scene for AncientBot. An ancient civilization's remains as they appear NOW or at the moment of rediscovery — half-buried in sand, overgrown with vegetation, eroded by millennia. But rendered with AWE and BEAUTY, not sadness. The romance of archaeology — civilization peeking through deep time. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

━━━ THE TENSION ━━━
These ruins are BEAUTIFUL in their decay. Grandeur and erosion coexist. Carved reliefs still visible under lichen. Painted plaster fragments clinging to crumbling walls. Colossal statuary half-buried in drifted sand with only a face emerging. Tree roots threading through precisely cut stone joints. The viewer should feel the WEIGHT OF TIME — and the stubborn persistence of human ambition beneath it.

━━━ CIVILIZATION (original builders) ━━━
${civilization}

━━━ THE RUIN SCENE ━━━
${ruin}

━━━ SURVIVING DETAIL (still visible despite millennia) ━━━
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

━━━ NO PEOPLE ━━━
No human figures in lost-ruins scenes. These sites are EMPTY — the silence and absence of people is part of the atmosphere. Just stone, earth, vegetation, sky, and deep time.

━━━ COMPOSITION ━━━
Ruins PARTIALLY revealed — some structure visible, some still hidden under earth/sand/vegetation. Light should find the carved/decorated surfaces and make them GLOW against the surrounding decay. Foreground: detailed rubble, vegetation, exposed stonework. Midground: the main ruin structure, partially excavated or eroded. Background: landscape continuing beyond — desert, jungle, hillside, sky. The tension between what's REVEALED and what's still HIDDEN.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
