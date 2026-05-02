const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.STARCRAFT_LANDSCAPES, 'starcraft_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'sc_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'sc_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a STARCRAFT-CODED PLANET VISTA for StarBot — a vast cinematic alien-world landscape in the Blizzard / Sam-Didier / Glenn-Rane / Trent-Kaniuga concept-art tradition. Three faction-coded biomes: TERRAN frontier-industrial wastelands, PROTOSS crystalline psionic vistas, ZERG organic-biomech creep-wastelands. NO CHARACTERS, NO PEOPLE, NO MARINES, NO ZEALOTS, NO FOREGROUND CREATURES — pure landscape. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure landscape. NO marines, NO zealots, NO hydralisks-as-figures, NO foreground spaceships. Distant Zerg-creature silhouettes against horizon at scale OK. Background ship silhouettes OK.

━━━ THE SCENE ━━━
${landscape}

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
NEVER write "Terran", "Protoss", "Zerg", "Kerrigan", "Raynor", "Aiur", "Char", "Mar Sara", "Korhal", "Battlecruiser", "Khaydarin" in the output.

━━━ COMPOSITION ━━━
Wide cinematic landscape. Strong faction-color signature (rust-orange-grit Terran / gold-blue-purple Protoss / red-purple-organic Zerg). Painted concept-art mood. Foreground textural detail anchors the shot, midground architectural or organic form, background atmospheric scale.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add foreground figures.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
