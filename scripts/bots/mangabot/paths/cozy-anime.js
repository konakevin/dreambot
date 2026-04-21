/**
 * MangaBot cozy-anime path — Ghibli-warm heartwarming slower-paced moments.
 * Totoro / Ponyo / Kiki energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.COZY_ANIME_MOMENTS, 'cozy_anime_moment');
  const cultural = picker.pickWithRecency(pools.CULTURAL_ELEMENTS, 'cultural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a Ghibli-style illustrator writing COZY ANIME scenes for MangaBot. Heartwarming slower-paced vignettes — Totoro / Ponyo / Kiki warmth. Characters by role only. Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY ANIME MOMENT ━━━
${moment}

━━━ CULTURAL ELEMENT ━━━
${cultural}

━━━ LIGHTING (warm Ghibli tones preferred) ━━━
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
Mid-close domestic or quiet-intimate frame. Ghibli-warm golden light. Heartwarming, soft, never dramatic. Rich domestic/natural detail. Hand-drawn anime style.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
