/**
 * StarBot dune-architecture path — Dune-coded interior / structural exterior,
 * no characters. Desert-empire palaces, sietch cave-cities, brutalist halls,
 * water-cathedral reservoirs, ornithopter hangars. Pure architecture.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.DUNE_ARCHITECTURE, 'dune_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'dune_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'dune_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a DUNE-CODED ARCHITECTURE scene for StarBot — a cinematic desert-empire interior or structural exterior in the Frank-Herbert / Denis-Villeneuve aesthetic tradition. NO CHARACTERS, NO PEOPLE, NO FIGURES — pure architecture, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE ARCHITECTURE. NO humans, NO aliens, NO figures, NO silhouettes of people, NO guards, NO statues that read as creatures. Just the empty vast space — throne hall, sietch chamber, palace corridor, water cathedral, hangar bay, fortress exterior — with all its mood and dust and light. The architecture is the subject.

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
NEVER write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "Sardaukar", "Bene Gesserit", "ornithopter", "Caladan" in the output. The aesthetic is INSPIRED BY Dune but generic in language.

━━━ COMPOSITION ━━━
Cinematic architectural composition — biblical scale where the space calls for it (throne halls, water cathedrals), claustrophobic and intimate where appropriate (sietch corridors, archive chambers). DRAMATIC LIGHTING — single shafts of light cutting through dust-haze, oil-lamp glow against carved stone, sodium emergency strips along brutalist corridors, embers in floor pits. Heavy material specificity (sandstone / oil-black metal / bronze / polished obsidian / carved stone / weathered wood / woven cloth).

The architecture commands the frame. Foreground architectural detail (column edges / stone-carving / cloth folds / metal rivets), midground architectural form, background space receding into atmospheric haze.

DRAMATIC VISUALS: render the EXACT architecture above. Do NOT add characters. Do NOT shrink the scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
