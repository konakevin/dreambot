/**
 * StarBot aliens-architecture path — Alien/Aliens-coded interior, no characters.
 * Biomechanical hive corridors, derelict alien spacecraft, abandoned colony
 * interiors, atmospheric processor industrial labyrinths, sterile corporate
 * labs, dropship interiors. Pure architecture.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.ALIENS_ARCHITECTURE, 'aliens_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'aliens_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'aliens_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing an ALIENS-CODED ARCHITECTURE scene for StarBot — a cinematic biomechanical-hive / derelict-spacecraft / abandoned-colony / atmospheric-processor interior in the H.R.-Giger / Ridley-Scott / James-Cameron / Ron-Cobb aesthetic tradition. NO CHARACTERS, NO PEOPLE, NO XENOMORPHS, NO FIGURES — pure architecture, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS / NO CREATURES — NON-NEGOTIABLE ━━━
This is PURE ARCHITECTURE. NO humans, NO xenomorphs, NO aliens, NO creatures, NO figures. Just the empty terrifying-and-majestic space — biomechanical hive corridor, derelict alien chamber, abandoned colony control room, processor labyrinth, sterile lab, dropship interior — with all its claustrophobic dread or industrial grit. The architecture is the subject.

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

${blocks.ALIENS_BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ NO FRANCHISE PROPER NOUNS ━━━
NEVER write "LV-426", "Nostromo", "Sulaco", "Hadley's Hope", "Weyland-Yutani", "xenomorph", "facehugger", "Engineer", "Prometheus", "MUTHUR" in the output. The aesthetic is INSPIRED BY the Alien franchise but generic in language.

━━━ COMPOSITION ━━━
Cinematic architectural composition — claustrophobic and dread-laden where the space calls for it (biomechanical corridors / vent tunnels / abandoned barracks), majestic and biblical where appropriate (Engineer-ship interiors / atmospheric processors). DRAMATIC LIGHTING — sodium emergency strips, blue-white sterile fluorescents, red strobe pulses, single emergency lights, steam-filtered work lights. Heavy material specificity (biomech resin / ribbed steel / prefab metal / cryo-glass / blast-shielded ceramic / wet-organic secretion).

The architecture commands the frame. Foreground architectural detail (resin drips / cable bundles / floor grating / overturned equipment), midground architectural form, background space receding into atmospheric haze and dread.

DRAMATIC VISUALS: render the EXACT architecture above. Do NOT add characters. Do NOT shrink the scale. Mood is TERRIFYING-AND-MAJESTIC.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
