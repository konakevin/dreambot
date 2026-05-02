const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.STARCRAFT_ARCHITECTURE, 'starcraft_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'sc_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'sc_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a STARCRAFT-CODED ARCHITECTURE scene for StarBot — a cinematic interior in the Blizzard / Sam-Didier / Glenn-Rane / Trent-Kaniuga concept-art tradition. Three faction-coded interiors: TERRAN frontier-industrial bunkers, PROTOSS crystalline psionic temples, ZERG organic-biomech hive-tunnels. NO CHARACTERS, NO PEOPLE, NO MARINES, NO ZEALOTS, NO FOREGROUND CREATURES — pure architecture. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO marines, NO zealots, NO hydralisks-as-figures, NO foreground vehicles. Just the empty interior space.

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
NEVER write "Terran", "Protoss", "Zerg", "Kerrigan", "Raynor", "Aiur", "Char", "Mar Sara", "Korhal", "Battlecruiser", "Khaydarin", "Carrier" in the output.

━━━ COMPOSITION ━━━
Cinematic architectural composition. STRONG faction signature (rust-and-grit Terran / gold-and-blue Protoss / sinew-and-blood-red Zerg). Painted concept-art mood. Foreground architectural detail, midground form, background space receding into atmospheric haze.

DRAMATIC VISUALS: render the EXACT architecture above.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
