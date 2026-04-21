/**
 * DragonBot epic-moment path — charged narrative beat.
 * Battle-charge, spell-cast, coronation, ritual, army-at-dawn, siege.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.EPIC_MOMENTS, 'epic_moment');
  const character = picker.pickWithRecency(pools.FANTASY_CHARACTERS, 'fantasy_character');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing EPIC NARRATIVE MOMENT scenes for DragonBot. Charged moment — battle-mid-charge, spell-cast climax, coronation, ritual, army at dawn, siege assault. Painterly Peter-Jackson-preproduction quality. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE EPIC MOMENT ━━━
${moment}

━━━ CHARACTER (if moment requires) ━━━
${character}

━━━ SETTING CONTEXT ━━━
${landscape}

━━━ LIGHTING (dramatic / epic) ━━━
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
Cinematic mid-to-wide frame capturing the peak moment. Dramatic composition. Characters visible but framed heroically. Scale and drama amplified. Concept-art painterly rendering.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
