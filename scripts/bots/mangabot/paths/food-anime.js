/**
 * MangaBot food-anime path — anime food close-ups. Steaming ramen / sushi-chef
 * preparing / parfait perfection. Food-Wars / Restaurant-to-Another-World aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.FOOD_ANIME, 'fa_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing a FOOD-ANIME keyframe for MangaBot. Loving close-up of anime food — steaming bowls, glistening sushi, perfect parfaits. Lush, mouth-watering, hyper-stylized food-illustration. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ THE FOOD SCENE ━━━
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
Tight close-up framing. Steam / glistening surface / drizzling sauce / sparkle-on-egg-yolk atmospheric mandatory. Background ramen-shop / izakaya / café details fill out (chopsticks / wooden counter / paper-lantern / kanji-menu / sake-bottle). Hyper-saturated food appeal.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
