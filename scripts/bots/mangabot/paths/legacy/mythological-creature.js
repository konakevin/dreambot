/**
 * MangaBot mythological-creature path — Japanese mythological being as hero.
 * Kitsune, yokai, oni, tengu, ryujin, yuki-onna, nekomata, tanuki, kappa.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MYTHOLOGICAL_BEINGS, 'mc_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an anime concept-art painter writing a MYTHOLOGICAL-CREATURE keyframe for MangaBot. Authentic Japanese mythological being — kitsune, yokai, oni, tengu, ryujin, yuki-onna, nekomata. Mononoke / Spirited-Away / Inuyasha / xxxHolic aesthetic. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ THE MYTHOLOGICAL CREATURE SCENE ━━━
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
Authentic mythology drawn correctly: kitsune = fox-spirit with multiple tails, yokai = specific named type, oni = horned demon with iron club, tengu = mountain-spirit with long nose and wings. Spirit-aura / drifting tails / paper-lantern-glow / mystic mist atmospheric mandatory.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
