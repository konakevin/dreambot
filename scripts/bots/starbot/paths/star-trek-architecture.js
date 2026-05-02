const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.STARTREK_ARCHITECTURE, 'startrek_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'st_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'st_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a STAR-TREK-CODED ARCHITECTURE scene for StarBot — a cinematic interior in the Andrew-Probert / Rick-Sternbach / Herman-Zimmerman / classic-Star-Trek tradition. Each interior reads as a distinct color-coded species/empire aesthetic. NO CHARACTERS, NO PEOPLE, NO BORG-DRONES, NO STARFLEET-OFFICERS-AS-FIGURES — pure architecture. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO Vulcans, NO Klingons, NO Picard, NO Borg-drones, NO Federation officers. Just the empty iconic-coded interior.

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
NEVER write "Vulcan", "Klingon", "Romulan", "Cardassian", "Bajoran", "Federation", "Starfleet", "Borg", "Trill", "Risa", "Deep Space Nine", "Enterprise", "Picard", "Spock" in the output.

━━━ COMPOSITION ━━━
Cinematic architectural composition. STRONG color signature per species/world (warm-amber Federation LCARS / matte-black Borg green-tubing / volcanic-stone Klingon bronze / green-bronze Romulan / bone-rust Cardassian / red-stone Vulcan / orange-stone Bajoran). Painted-matte concept-art mood.

DRAMATIC VISUALS: render the EXACT architecture above.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
