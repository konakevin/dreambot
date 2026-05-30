/**
 * MangaBot slice-of-life path — quiet anime daily moments + cozy interiors.
 * Absorbs the cut cozy-anime path (40% of rolls bias toward cozy-interior
 * scenes via the COZY_ANIME_MOMENTS pool — kotatsu / café / blanket vibes).
 *
 * Shinkai 5cm-per-Second / Your-Lie-in-April / KyoAni daily-quiet aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // 60% slice-of-life-out-and-about / 40% cozy-interior bias (absorbs cozy-anime)
  const useCozy = Math.random() < 0.4;
  const scene = useCozy
    ? picker.pickWithRecency(pools.COZY_ANIME_MOMENTS, 'sl_cozy')
    : picker.pickWithRecency(pools.SLICE_OF_LIFE_MOMENTS, 'sl_moment');
  const cultural = picker.pickWithRecency(pools.CULTURAL_ELEMENTS, 'sl_cultural');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing a SLICE-OF-LIFE keyframe for MangaBot. Quiet daily anime moment — schools, trains, cafés, walking-home, cozy-interiors. Shinkai / KyoAni / Your-Lie-in-April aesthetic. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ THE SLICE-OF-LIFE SCENE ━━━
${scene}

━━━ CULTURAL DETAIL ━━━
${cultural}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━
Quiet, observational, melancholic-or-warm. Wind / drifting petals / dust-motes / steam / rain on window — atmospheric particles mandatory. Single figure or empty frame. Story-moment-coded — someone-just-left or about-to-arrive energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
