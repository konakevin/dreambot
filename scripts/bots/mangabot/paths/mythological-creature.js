/**
 * MangaBot mythological-creature path — Japanese mythological being as hero.
 * Kitsune, yokai, oni, tengu, ryujin, yuki-onna, nekomata, tanuki.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const being = picker.pickWithRecency(pools.MYTHOLOGICAL_BEINGS, 'mythological_being');
  const landscape = picker.pickWithRecency(pools.JAPANESE_LANDSCAPES, 'japanese_landscape');
  const cultural = picker.pickWithRecency(pools.CULTURAL_ELEMENTS, 'cultural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythological anime illustrator writing JAPANESE MYTHOLOGICAL BEING scenes for MangaBot. The being is hero — kitsune, yokai, oni, tengu, ryujin, yuki-onna. Rendered with reverent accuracy to Japanese mythology. Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MYTHOLOGICAL BEING (hero subject) ━━━
${being}

━━━ SETTING ━━━
${landscape}

━━━ CULTURAL ELEMENT ━━━
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
Mid-close frame with being as hero. Mythic grandeur — spirit-world or wilderness setting. Hand-drawn anime detail. Culturally-accurate rendering of the specific being type.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
