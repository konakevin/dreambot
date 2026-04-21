/**
 * MangaBot anime-landscape path — pure Japanese environment, no characters.
 * Shrines, rice paddies, bamboo, torii, tatami, Edo street.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.JAPANESE_LANDSCAPES, 'japanese_landscape');
  const cultural = picker.pickWithRecency(pools.CULTURAL_ELEMENTS, 'cultural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime landscape painter writing JAPANESE LANDSCAPE scenes for MangaBot. Pure environment, no characters. Shinkai-Ghibli background-painting quality. Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS ━━━
Pure Japanese environment. No humans, no creatures. Pure setting.

━━━ THE LANDSCAPE ━━━
${landscape}

━━━ CULTURAL ELEMENT (adds authenticity) ━━━
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
Wide or mid-wide Shinkai-Ghibli background-art composition. Environment-first storytelling. Hand-painted anime background quality. Culturally respectful detail.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
