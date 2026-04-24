/**
 * BloomBot city-flowers path — urban settings with flowers on full display.
 * Flower shops, window boxes, planters, hanging baskets, balconies, stoops.
 * City is the backdrop — flowers are the MAIN CHARACTER.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.FLOWER_ARRANGEMENTS, 'flower_arrangement');
  const space = picker.pickWithRecency(pools.CITY_FLOWER_SPACES, 'city_flower_space');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a floral street photographer writing CITY FLOWER scenes for BloomBot. Urban settings where flowers DOMINATE the frame — flower shops, window boxes, planters, hanging baskets, balconies, stoops, carts. The city is a backdrop, flowers are the MAIN CHARACTER. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CITY SETTING ━━━
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

━━━ CITY FLOWERS SIGNATURE — NON-NEGOTIABLE ━━━
- URBAN ARCHITECTURE visible — cobblestone, brick, iron, stone facades, lampposts, awnings
- Flowers OVERWHELM the urban setting — not decorative accents, MAIN EVENT
- City provides TEXTURE and CONTRAST — hard stone/iron vs soft petals
- The flowers should look like they've TAKEN OVER — far more than any real city display
- No people, no vendors, no pedestrians — empty streets, the flowers own the scene

━━━ BLOW IT UP — MAXIMUM FLOWER DENSITY ━━━
This is NOT a normal city flower display. This is FANTASY-LEVEL urban floral explosion:
- Window boxes overflowing with blooms cascading 10+ feet down building facades
- Flower buckets so packed the sidewalk is barely visible beneath petals
- Hanging baskets dripping massive curtains of flowers from every lamppost
- Planters erupting with blooms that spill across entire walkways
- Petals drifting in the air, collecting in gutters, piling on windowsills
- More flowers than any city has ever seen — the urban jungle reclaimed by botanical beauty

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
