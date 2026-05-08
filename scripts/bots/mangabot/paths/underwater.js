/**
 * MangaBot underwater path — sunken cities, coral temples, bioluminescent
 * deep-sea wonder. Children-of-the-Sea / Ponyo / Nagi-no-Asukara aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.UNDERWATER_SCENES, 'uw_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing an UNDERWATER keyframe for MangaBot. Anime aquatic wonder — sunken cities, coral temples, bioluminescent depths, light-shafts piercing blue water. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

━━━ THE UNDERWATER SCENE ━━━
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
Cool cyan-and-pastel palette dominant. Drifting bubbles + caustic-light-rippling + light-shafts piercing surface mandatory. Quiet stillness, surreal beauty, sense of depth-on-depth. If a character appears, they are mid-drift / mid-swim, body floating with the current.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
