/**
 * SteamBot sexy-steampunk-woman path — really-fucking-sexy steampunk woman.
 * Candid solo. Capable, dangerous-magnetic, steampunk-identity unmistakable.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(
    pools.STEAMPUNK_WOMEN_CANDID_MOMENTS,
    'steampunk_woman_moment'
  );
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk portrait painter writing SEXY STEAMPUNK WOMAN scenes for SteamBot. Really-fucking-sexy steampunk woman doing specific steampunk action. Solo. Candid voyeuristic framing. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.STEAMPUNK_WOMAN_CANDID_BLOCK}

━━━ THE CANDID MOMENT ━━━
${moment}

━━━ LIGHTING (brass-glow / gaslight / forge preferred) ━━━
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
Mid-close candid voyeuristic frame. She is DOING specific steampunk action. Solo — no men. Brass / copper / gaslight dramatic lighting.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
