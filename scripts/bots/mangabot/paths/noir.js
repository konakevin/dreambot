/**
 * MangaBot noir path — anime detective / rainy-night / jazz-bar moody
 * keyframes. Cowboy-Bebop / Black-Lagoon / Lupin-III / Monster aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.NOIR_SCENES, 'nr_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing an ANIME-NOIR keyframe for MangaBot. Rainy nights, jazz bars, smoky alleys, vintage suits, neon reflections. Moody, sophisticated, melancholic. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

━━━ THE NOIR SCENE ━━━
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
Rain (almost mandatory) + cigarette-smoke + neon-on-wet-pavement reflections. Single-warm-tungsten against blue-cool-night palette. Vintage signage / chrome diner / vinyl record sleeves / typewriter / leather booths as texture. NEVER violence in frame — moody pre/post moments, never mid-act.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
