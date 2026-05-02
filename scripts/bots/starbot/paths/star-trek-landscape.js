/**
 * StarBot star-trek-landscape path — Star-Trek-coded multi-world vista,
 * no characters. Red-desert temple worlds, tropical paradise pleasure-planets,
 * Borg cube-station interiors, volcanic warrior-empire homeworlds,
 * classical-future Federation colonies.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.STARTREK_LANDSCAPES, 'startrek_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'st_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'st_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a STAR-TREK-CODED PLANET VISTA for StarBot — a vast cinematic alien-world landscape in the Andrew-Probert / Rick-Sternbach / classic-Star-Trek painted-matte tradition. Each world reads as a distinct color-coded species/empire aesthetic. NO CHARACTERS, NO PEOPLE, NO STARSHIPS-AS-FOREGROUND, NO BORG-DRONES — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO Vulcans, NO Klingons, NO Picard, NO Borg-drones-as-figures, NO Federation officers, NO foreground starships. Background ship silhouettes at distant scale OK. Just the empty iconic-coded world — red-desert temple-world / tropical paradise / orange-stone monastery / matte-black cube-station / volcanic warrior-empire / classical-future Federation colony / green-bronze Romulan-style empire / bone-rust Cardassian-style station / pastoral farming planet.

━━━ THE SCENE (render this exact landscape) ━━━
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
NEVER write "Vulcan", "Klingon", "Romulan", "Cardassian", "Bajoran", "Federation", "Starfleet", "Borg", "Trill", "Risa", "Deep Space Nine", "Enterprise", "Picard", "Spock" in the output.

━━━ COMPOSITION ━━━
Wide cinematic landscape OR claustrophobic mechanical interior depending on scene. STRONG color signature per species/world (red-desert / green-bronze / bone-rust / white-chrome / matte-black-green). Painted-matte concept-art mood. Foreground textural detail anchors the shot, midground architectural or natural form, background atmospheric distance.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
