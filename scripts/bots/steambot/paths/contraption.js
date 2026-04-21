/**
 * SteamBot contraption path — fantastical steampunk machines in closeup.
 * WIDE RANGE — NOT clock-dominant.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const contraption = picker.pickWithRecency(pools.CONTRAPTION_TYPES, 'contraption_type');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk product-painter writing CONTRAPTION closeup scenes for SteamBot. Fantastical steampunk device in closeup. WIDE RANGE — not clock-dominant. Obsessive mechanical detail. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.CONTRAPTION_VARIETY_BLOCK}

━━━ THE CONTRAPTION ━━━
${contraption}

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
Closeup or mid-closeup. Contraption fills most of frame. Every gear / pipe / rivet / valve rendered with painterly detail. Shallow depth-of-field behind.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
