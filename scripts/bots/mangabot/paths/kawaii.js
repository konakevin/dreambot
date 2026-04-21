/**
 * MangaBot kawaii path — explicit KAWAII CUTE anime. Chibi / big-eye /
 * magical-girl / sparkle-heavy / shoujo-cover energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.KAWAII_MOMENTS, 'kawaii_moment');
  const detail = picker.pickWithRecency(pools.CHARACTER_DETAILS, 'character_detail');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a shoujo-magical-girl illustrator writing KAWAII anime scenes for MangaBot. Explicitly CUTE — chibi, big-eye, magical-girl, sparkle-heavy, shoujo-cover energy. Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ KAWAII AESTHETIC (required) ━━━
Chibi proportions OR big-eye shoujo. Sparkle-effects dominant. Pastel palette. Hyper-cute energy.

━━━ THE KAWAII MOMENT ━━━
${moment}

━━━ CHARACTER DETAIL ━━━
${detail}

━━━ LIGHTING (sparkle/pastel preferred) ━━━
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
Mid or mid-close cute frame. Character(s) with KAWAII proportions — big eyes, pastel palette, sparkle-effects, magical atmosphere. Shoujo-cover-art quality.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
