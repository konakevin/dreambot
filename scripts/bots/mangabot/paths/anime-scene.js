/**
 * MangaBot anime-scene path — classic anime scene with a character by role.
 * Modern/traditional/futuristic mix. Character is hero with anime-illustration.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.ANIME_CHARACTERS, 'anime_character');
  const landscape = picker.pickWithRecency(pools.JAPANESE_LANDSCAPES, 'japanese_landscape');
  const detail = picker.pickWithRecency(pools.CHARACTER_DETAILS, 'character_detail');
  const cultural = picker.pickWithRecency(pools.CULTURAL_ELEMENTS, 'cultural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime illustrator writing ANIME SCENE compositions for MangaBot. Character by role in a Japanese setting — modern, traditional, or mythic. Hand-drawn anime-illustration quality. Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CHARACTER (by role) ━━━
${character}

━━━ CHARACTER DETAIL (additional visual) ━━━
${detail}

━━━ THE SETTING ━━━
${landscape}

━━━ CULTURAL ELEMENT (scattered detail) ━━━
${cultural}

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
Mid or mid-close cinematic anime frame. Character as hero. Environmental context rich and cultural. Hand-drawn cel-shaded rendering.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
