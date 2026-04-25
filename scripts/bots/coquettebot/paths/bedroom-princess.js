/**
 * CoquetteBot bedroom-princess — canopy beds, satin sheets, fairy lights,
 * heart mirrors, plush rugs, stuffed animals, pink velvet everything.
 * The ultimate girly bedroom fantasy. No people.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BEDROOM_SCENES, 'bedroom');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing a BEDROOM PRINCESS scene for CoquetteBot — the ultimate girly bedroom fantasy. Canopy beds with tulle drapes, satin pillows, fairy-light canopies, heart-shaped mirrors, pink velvet armchairs, stuffed animals on shelves, vanity tables with perfume. No people visible. The viewer wants to move in immediately. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO HUMANS ━━━
No figures. The bed is unmade just enough to feel lived-in. A book left open, slippers by the bed, a teacup on the nightstand. Implied presence, never shown.

━━━ THE BEDROOM SCENE ━━━
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
Mid-wide interior frame. The bed or vanity as focal anchor. Pink, cream, rose-gold, lavender palette. Fairy lights provide warm sparkle. Soft fabrics everywhere — velvet, satin, tulle, lace. Books, flowers, candles scattered with intention. Morning light through sheer curtains or warm lamp glow at night.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
