/**
 * StarBot halo-architecture path — Halo-coded architectural interior/exterior,
 * no characters. Forerunner crystalline-machine ruins, ring-installation
 * interiors, Covenant purple-gold ship-architecture, Reach-style military
 * bases, ancient-precursor monoliths.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.HALO_ARCHITECTURE, 'halo_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'halo_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'halo_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a HALO-CODED ARCHITECTURE scene for StarBot — a sacred-technological precursor temple, ring-installation interior, alien-empire purple-gold capital ship interior, or military-industrial frontier base in the Bungie / 343-Industries / Sparth / Pat-Rawlings tradition. NO CHARACTERS, NO PEOPLE, NO MASTER-CHIEF, NO ELITES, NO GRUNTS — pure architecture, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE ARCHITECTURE. NO Spartans, NO aliens, NO foreground vehicles, NO drop-ship Pelicans, NO Warthogs. Just the empty sacred-technological space — precursor temple chamber / ring-installation interior / alien-empire ship-corridor / military-industrial base / monolithic precursor monument circle.

━━━ THE SCENE (render this exact architecture) ━━━
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
NEVER write "Halo", "Forerunner", "Covenant", "Reach", "Master Chief", "Spartan", "Cortana", "Sangheili", "Elite", "UNSC", "Pelican", "Warthog" in the output.

━━━ COMPOSITION ━━━
Cinematic architectural composition — biblical scale where the space calls for it (precursor temples, ring-installation arcs, alien-empire capital chambers), claustrophobic-corridor where appropriate (ship interiors, bunker bases). DRAMATIC LIGHTING — light-pillars piercing geometric stone-and-metal halls, energy-shield doorways rippling blue, gold-and-purple alien interiors, fluorescent-bulkhead military mood. Material specificity (carved stone with glowing-glyph circuit-traces / purple-gold alien-metal alloy / prefab concrete-and-steel / energy-field shimmer).

The architecture commands the frame. Foreground architectural detail (column edge / glyph-circuit / light-pillar base / energy-shield rim), midground architectural form, background space receding into atmospheric haze.

DRAMATIC VISUALS: render the EXACT architecture above. Do NOT add characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
