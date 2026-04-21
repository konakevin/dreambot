/**
 * GothBot castlevania-scene path — Castlevania-game-art / Bloodborne / Berserk.
 * Vampire hunters, cursed cathedrals, gargoyles, wrought iron, crimson
 * stained glass, moonlit courtyards.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const context = picker.pickWithRecency(pools.CASTLEVANIA_CONTEXTS, 'castlevania_context');
  const character = picker.pickWithRecency(pools.DARK_CHARACTERS, 'dark_character');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a Castlevania-concept-artist writing CASTLEVANIA-STYLE scenes for GothBot. Castlevania-game-art / Bloodborne / Berserk aesthetic. Vampire hunters, cursed cathedrals, gargoyles. Character and setting integrated. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CASTLEVANIA CONTEXT ━━━
${context}

━━━ THE CHARACTER ━━━
${character}

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
Mid-wide Castlevania-poster frame. Wrought iron / stained glass / chiaroscuro integrated. Character heroic but integrated into scene. Production-art polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
