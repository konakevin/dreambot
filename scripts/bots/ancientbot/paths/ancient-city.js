/**
 * AncientBot ancient-city — bustling urban life at its peak.
 * Markets, workshops, residential quarters, the organized chaos of early cities.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const civilization = picker.pickWithRecency(pools.CIVILIZATIONS, 'civilization');
  const city = picker.pickWithRecency(pools.ANCIENT_CITIES, 'ancient_city');
  const archDetail = picker.pickWithRecency(pools.ARCHITECTURAL_DETAILS, 'arch_detail');
  const activity = picker.pickWithRecency(pools.HUMAN_ACTIVITY, 'human_activity');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE bustling ancient city scene for AncientBot. This is a THRIVING URBAN CENTER at its peak — thousands of people living, trading, building, worshipping in one of humanity's first great cities. The city should feel ALIVE and DENSE. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.HUMAN_ACTIVITY_BLOCK}

━━━ CIVILIZATION ━━━
${civilization}
Root every detail in THIS civilization's urban traditions — their building materials, street layouts, domestic architecture, commercial practices.

━━━ THE CITY SCENE ━━━
${city}

━━━ ARCHITECTURAL DETAIL (woven throughout) ━━━
${archDetail}

━━━ STREET-LEVEL ACTIVITY ━━━
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
ELEVATED viewpoint — as if looking from a rooftop or city wall down into the urban fabric. Dense layers of flat-roofed buildings, narrow lanes, market squares, temple towers rising above the roofline. DEPTH through stacked architectural layers: foreground rooftops with detail, midground streets with tiny bustling figures, background monuments and city walls against sky. Every surface should have texture — painted plaster, drying laundry, rooftop gardens, stacked pottery.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
