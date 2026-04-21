/**
 * DragonBot landscape path ⭐ FLAGSHIP — stunning fantasy-world vistas.
 * Castles, floating islands, ruins, elven forests, mythic cities. No chars.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const architecture = picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing EPIC FANTASY LANDSCAPE scenes for DragonBot. The FLAGSHIP path. Stunning fantasy-world vistas — castles, floating islands, ancient ruins, elven forests, mythic cities. No characters. Peter-Jackson-John-Howe-Alan-Lee energy. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS ━━━
Landscape is hero. Pure fantasy world. No hero figures, no soldiers, no warriors.

━━━ THE FANTASY LANDSCAPE ━━━
${landscape}

━━━ ARCHITECTURAL ELEMENT (anchors composition) ━━━
${architecture}

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
Wide or mid-wide epic establishing shot. Architecture anchors the frame. Magic present throughout. Cinematic book-cover composition. Concept-art painterly rendering.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
