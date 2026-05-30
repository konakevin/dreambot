/**
 * MangaBot anime-village path — anime small-town / village / urban-Japan
 * neighborhood. Absorbs anime-landscape duties (mountain / countryside-edge
 * villages, valley vistas, riverside towns). Distinct from neo-tokyo
 * (cyberpunk-future) and ghibli-countryside (pastoral-only-no-village).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ANIME_VILLAGE, 'av_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing an ANIME-VILLAGE keyframe for MangaBot. Japanese small-town / village / neighborhood streetscape. Wooden architecture, vending machines, narrow lanes, clay-tile roofs, mountain-or-valley framing. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ THE ANIME-VILLAGE SCENE ━━━
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
Wooden buildings / clay-tile rooftops / vending machines / kanji signage / hanging laundry / overhead power-cables — village density. Mountain or valley vista in distance for scale. Optional small figures for narrative anchor.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
