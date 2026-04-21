/**
 * BloomBot cozy path — cottagecore INTERIOR flower scenes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const interior = picker.pickWithRecency(pools.COZY_INTERIORS, 'cozy_interior');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a cottagecore interior photographer writing COZY INDOOR floral scenes for BloomBot. The warmest, coziest, most inviting floral interior you can imagine — flowers EVERYWHERE in a beautiful warm room. Cottagecore meets botanical paradise. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE INTERIOR SCENE ━━━
${interior}

━━━ THE DOMINANT FLOWER TYPE ━━━
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
- INTERIOR — always indoors (this is the key path differentiator)
- Warm, inviting, cottagecore energy
- Flowers IMPOSSIBLY ABUNDANT — not just a pretty vase, a ROOM DROWNING in flowers
- Space feels lived-in and loved — not sterile / not staged
- No people in frame

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
