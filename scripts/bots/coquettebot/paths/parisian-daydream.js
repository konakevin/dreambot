/**
 * CoquetteBot parisian-daydream — Paris streets, flower shops, patisseries,
 * café tables, vintage bikes with baskets, soft rain + umbrellas. No people.
 * The most romantic city rendered as a pink pastel dream.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PARISIAN_SCENES, 'parisian');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing a PARISIAN DAYDREAM scene for CoquetteBot — Paris as a pink pastel fantasy. Café tables with croissants, patisserie windows stacked with macarons, flower carts on cobblestone, vintage bikes with wicker baskets, wrought-iron balconies draped in roses. No people visible. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO HUMANS ━━━
Pure scene. Objects imply romance — two espresso cups, an open book, a silk scarf left on a chair.

━━━ THE PARISIAN SCENE ━━━
${scene}

━━━ DETAIL ELEMENT ━━━
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
Street-level or storefront frame. Parisian architectural details — arched windows, iron railings, awnings, lanterns. Pink and cream dominate. Cobblestone texture. Flowers everywhere — window boxes, carts, bouquets. Morning light or golden-hour dusk. The viewer wants to book a flight immediately.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
