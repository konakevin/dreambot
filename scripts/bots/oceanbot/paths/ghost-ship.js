/**
 * OceanBot ghost-ship — derelict ships, tattered sails, fog, phantom silhouettes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.GHOST_SHIPS, 'ghost_ship');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a maritime painter writing GHOST SHIP scenes for OceanBot. Derelict CLASSICAL WOODEN sailing vessels drifting through fog — pre-1850 era ONLY. Galleons, schooners, frigates, brigs, sloops, junks, longships, dhows, caravels. Tattered sails hanging limp, barnacle-crusted wooden hulls, phantom silhouettes on the horizon, lanterns swinging on empty decks. Flying Dutchman energy. Eerie, beautiful, haunted. No crew visible — the ships are alone. Output wraps with style prefix + suffix.

━━━ ABSOLUTELY BANNED (NO MODERN SHIPS) ━━━
- NO submarines / U-boats / naval destroyers / battleships / cruisers / aircraft carriers
- NO steamships / paddlewheelers / smokestacks / funnels / propellers
- NO engines / diesel / gas-powered / combustion / motor boats / yachts
- NO cargo ships / container ships / oil tankers / fishing trawlers
- NO metal / iron / steel hulls / naval gun turrets
- NO post-1850 era vessels of any kind — ONLY pre-1850 wooden sailing ships

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.MARITIME_MYTH_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE GHOST SHIP ━━━
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
The ship is the subject but the ocean is the context. Fog, moonlight, or storm light. The vessel feels abandoned and ancient. Eerie beauty, not jump-scare horror.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
