/**
 * BloomBot dreamscape path — surreal EARTHLY flower takeovers.
 * Flowers reclaim / consume / erupt from unexpected human-made objects.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const context = picker.pickWithRecency(pools.DREAMSCAPE_CONTEXTS, 'dreamscape_context');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a magical-realism photographer writing SURREAL EARTHLY flower-takeover scenes for BloomBot. Flowers reclaim / consume / erupt from unexpected human-made or natural objects. Magical-realism, Magritte-esque — beauty first, surrealism second. Earthly context (recognizable objects) but impossible floral takeover. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DREAMSCAPE CONTEXT ━━━
${context}

━━━ THE DOMINANT FLOWER ━━━
${flower}

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

━━━ RULES ━━━
- EARTHLY context — recognizable objects / scenes (piano, cathedral, clockwork, sunken ship, etc.)
- Flowers overtake / consume / erupt from the object
- NOT cosmic / alien (that's separate path)
- NOT dramatic wilderness (that's landscape path)
- Beauty FIRST, surrealism second — always gorgeous
- Magical-realism painterly vibe

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
