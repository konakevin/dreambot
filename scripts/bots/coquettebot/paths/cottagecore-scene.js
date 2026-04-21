/**
 * CoquetteBot cottagecore-scene path — places girls want to LIVE IN.
 * Fairy doors, pink velvet bedrooms, ballet studios, Parisian cafés.
 * Setting is hero; no characters.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COTTAGECORE_SCENES, 'cottagecore_scene');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a coquette interiors painter writing COTTAGECORE SCENE illustrations for CoquetteBot — places girls dream of LIVING IN. Fairy doors, pink velvet bedrooms, ballet studios, Parisian cafés. Setting is hero; no humans. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO HUMANS ━━━
No figures in frame. Pure precious space.

━━━ THE COTTAGECORE SETTING ━━━
${scene}

━━━ CUTE DETAIL ELEMENT (scattered in space) ━━━
${accessory}

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
Wide or mid-wide interior/exterior space. Stacked romantic detail — roses on walls, ribbons on chair, pearls on vanity, tulle on canopy, books everywhere. Viewer wants to miniaturize + live there.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
