/**
 * GothBot dark-scene path — hauntingly beautiful dark fantasy with
 * character-by-role. Knight in crimson ballroom, cursed priest at altar,
 * hooded wanderer on foggy bridge.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_CHARACTERS, 'dark_character');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing DARK FANTASY SCENE compositions for GothBot. Hauntingly beautiful — character in gothic setting, Castlevania/Bloodborne/Crimson-Peak production-art quality. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CHARACTER ━━━
${character}

━━━ THE GOTHIC SETTING ━━━
${landscape}

━━━ LIGHTING (chiaroscuro preferred) ━━━
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
Mid frame, character integrated with scene. Solo hero-shot. Chiaroscuro key-lighting. Dramatic pose that still feels candid. Ornate gothic detail stacked.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
