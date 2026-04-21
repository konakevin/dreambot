/**
 * BloomBot closeup path — macro / mid-close frame where flowers are the
 * hero. Single bloom / cluster / bouquet / stem-in-field / vase.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const framing = picker.pickWithRecency(pools.CLOSEUP_FRAMINGS, 'closeup_framing');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a macro-botanical photographer writing CLOSEUP floral scenes for BloomBot. Tight frame — flowers fill 60%+ of the frame and are unmistakably the hero. Could be a single stunning bloom, a tight cluster, a bouquet in an interesting vase, or a stem with a few heads against a moody backdrop. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE FLOWER (hero species) ━━━
${flower}

━━━ FRAMING / COMPOSITION ━━━
${framing}

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

━━━ KEY RULES ━━━
- Flowers fill 60%+ of frame
- Supporting context (vase / surface / stem / immediate environment) is fine and welcome
- NEVER show full environment / wide landscape — this is a tight frame
- Every petal / dewdrop / vein rendered in razor-sharp detail
- Dramatic lighting (never flat daylight)

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
