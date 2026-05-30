/**
 * MangaBot kawaii path — chibi / big-eye / sparkle-shoujo cute energy.
 * Card-Captor / Sailor-Moon / KyoAni-K-On! cuteness + pastel-shoujo-cover aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.KAWAII_MOMENTS, 'kw_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing a KAWAII keyframe for MangaBot. Cute / pastel / chibi-energy / sparkle-shoujo aesthetic. Soft warm pastels + sparkle-particles + plushie-energy. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

━━━ THE KAWAII SCENE ━━━
${scene}

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
Sparkle-particles + drifting hearts + pastel bloom mandatory. Pink / lavender / mint / cream pastel palette dominant. Wholesome / sweet / never sexualized. If a chibi character appears, they are mid-bounce / mid-laugh / mid-skip with comedic pose, never head-on-modeling.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
