/**
 * AncientBot ancient-interior — grand interior spaces.
 * Hypostyle halls, tomb chambers, palace throne rooms, ziggurat shrines.
 * Cathedral-scale interiors adapted from DragonBot's arcane-halls pattern.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ANCIENT_INTERIORS, 'ancient_interior');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE grand ancient interior scene for AncientBot — vast, monumental, awe-inspiring architecture from the INSIDE. Cathedral-scale spaces where the ceiling vanishes into shadow, columns march into distance, and every painted surface tells a story carved in stone 4000 years ago. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.MONUMENTAL_SCALE_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ NO PEOPLE ━━━
Pure environment. No figures, no characters. The space tells the story — the emptiness makes the scale feel VAST.

━━━ THE INTERIOR SPACE ━━━
${setting}

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

━━━ COMPOSITION ━━━
These interiors are GRAND and VAST — not small rooms. Think cathedral-scale hypostyle halls, massive tomb complexes, palace throne rooms with columns receding into deep shadow. DEPTH is everything: foreground architectural detail (a carved column base, a painted wall section), midground columns and corridors stretching away, background vanishing into warm shadow or punctuated by a distant light source. Light enters from ONE dominant direction — clerestory, doorway, oil lamps, torch sconces — carving dramatic chiaroscuro across painted surfaces. Every surface should be RICH with period-accurate texture: painted plaster in vivid mineral pigments, carved stone reliefs, glazed brick, gold leaf catching light, lapis lazuli inlay.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
