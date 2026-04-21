/**
 * CoquetteBot sweet-treats path — food still-life OR whimsical cute-animal
 * bakery scenes. ZERO humans. Pastel sweets, rose-petal jams, Parisian
 * pastries, macarons, tea-time spreads.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const sweet = picker.pickWithRecency(pools.WHIMSICAL_SWEETS, 'whimsical_sweet');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a coquette still-life painter writing SWEET TREAT scenes for CoquetteBot. Food is hero. ZERO humans. Whimsical cute-animal characters (mouse baker, bunny chef, hedgehog with apron) OK as supporting elements — or pure still-life. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.NO_HUMANS_IN_SWEETS_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SWEET TREAT SCENE ━━━
${sweet}

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
Mid-close tabletop or bakery-counter frame. Food precisely arranged. Rose-petals, pearl-dragées, edible flowers scattered. Delicate china. Pastel saturation. NO humans, no hands, no chef-figures (except animal-characters in aprons).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
