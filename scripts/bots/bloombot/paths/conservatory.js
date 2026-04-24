/**
 * BloomBot conservatory path — grand glass-and-iron botanical structures
 * overflowing with flowers. Victorian greenhouses, palm houses, orangeries,
 * abandoned glasshouses reclaimed by nature. Light through glass is the signature.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.FLOWER_ARRANGEMENTS, 'flower_arrangement');
  const space = picker.pickWithRecency(pools.CONSERVATORY_SPACES, 'conservatory_space');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a botanical-architecture photographer writing CONSERVATORY scenes for BloomBot. Grand glass-and-iron structures BURSTING with flowers — Victorian greenhouses, palm houses, orangeries, abandoned glasshouses reclaimed by nature. Light streaming through glass panels is the visual signature. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CONSERVATORY SPACE ━━━
${space}

━━━ THE FLOWERS IN THIS SCENE ━━━
${arrangement}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ CONSERVATORY SIGNATURE — NON-NEGOTIABLE ━━━
- GLASS ARCHITECTURE visible — iron ribs, glass panes, arched ceilings, stone floors
- LIGHT THROUGH GLASS — golden shafts, dappled patterns, prismatic rainbows, fog diffusion
- Humidity visible — condensation on glass, mist, steam, dewy surfaces
- Flowers ERUPTING through the architecture — not contained, OVERFLOWING
- The glass structure and the botanical explosion are CO-STARS
- Stone paths, moss on ironwork, vines climbing frames

━━━ BLOW IT UP — MAXIMUM BOTANICAL DENSITY ━━━
This is NOT a tidy greenhouse. This is NATURE WINNING. Crank every element to 11:
- Hanging baskets OVERFLOWING with trailing flowers streaming down 10+ feet
- Flower vines climbing and consuming every iron rib, every beam, every railing
- Planters so overgrown the pots are invisible under cascading blooms
- Flowers pushing through cracks in stone, erupting from walls, carpeting the floor
- Petals drifting in the air, collecting in puddles, piling on windowsills
- More flowers than the structure can contain — spilling out of doors, pressing against glass

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
