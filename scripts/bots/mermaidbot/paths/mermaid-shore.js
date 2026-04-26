/**
 * MermaidBot shore path — tidepools, half-in-water, liminal human-world proximity.
 * Mermaids at the boundary between ocean and land.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SHORE_SETTINGS, 'shore_setting');
  const moment = picker.pickWithRecency(pools.SHORE_MOMENTS, 'shore_moment');

  return `You are a coastal wildlife photographer who has spotted a MERMAID AT THE SHORE — the liminal space where ocean meets land. She is half-in half-out of water, in tidepools, on wet sand, among coastal rocks. She does NOT know she is being observed. She is curious about human artifacts washed ashore, caught between two realms. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ SHORE MERMAID ENERGY ━━━
Wet scales catching golden or silver light. Seaweed tangled in her hair. Sand on her tail. She is at the EDGE — half submerged, half exposed. Tidepools reflect her face. Waves lap at her fins. There are traces of the human world nearby (distant lighthouse, weathered dock pilings, glass bottles, rope) but NO humans present.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ THE MOMENT ━━━
${moment}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${sharedDNA.waterCondition}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize liminal atmosphere, wet textures, boundary between worlds.`;
};
