const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.STARWARS_ARCHITECTURE, 'starwars_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'sw_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'sw_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a STAR-WARS-CODED ARCHITECTURE scene for StarBot — a cinematic interior in the George-Lucas / Ralph-McQuarrie / Doug-Chiang painted-matte tradition. NO CHARACTERS, NO PEOPLE, NO DROIDS, NO LIGHTSABERS — pure architecture. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO Jedi, NO stormtroopers, NO droids, NO rebels, NO sith, NO foreground spaceships. Just the empty iconic-coded space.

━━━ THE SCENE ━━━
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

━━━ NO FRANCHISE PROPER NOUNS ━━━
NEVER write "Tatooine", "Coruscant", "Death Star", "Imperial", "Jedi", "Sith", "Senate", "Stormtrooper", "Mos Eisley", "Cantina" in the output.

━━━ COMPOSITION ━━━
Cinematic architectural composition, painted-matte concept-art mood. Foreground architectural detail anchors the shot, midground architectural form, background space receding into atmospheric haze.

DRAMATIC VISUALS: render the EXACT architecture above. Do NOT add characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
