const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.HALO_LANDSCAPES, 'halo_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'halo_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'halo_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a HALO-CODED LANDSCAPE for StarBot — a vast cinematic alien-world vista in the Bungie / 343-Industries / Sparth / Pat-Rawlings tradition. Ringworld arcs visible across the sky, ancient precursor megaliths, frontier military bases. NO CHARACTERS, NO PEOPLE, NO MASTER-CHIEF, NO ELITES — pure landscape. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure landscape. NO Spartans, NO aliens, NO drop-ships-as-foreground, NO Warthogs. Background ship silhouettes at distant scale OK.

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
NEVER write "Halo", "Forerunner", "Covenant", "Reach", "Master Chief", "Spartan", "Cortana", "Sangheili", "Elite", "UNSC", "Pelican", "Warthog" in the output.

━━━ COMPOSITION ━━━
Wide cinematic vista. RING-INSTALLATION ARC visible across the sky is the signature. Foreground textural detail, midground architectural or natural form, background atmospheric ring-curve. Mood ranges SACRED-ANCIENT (precursor) → MILITARY-INDUSTRIAL (Reach frontier) → BIBLICAL-RINGWORLD.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add foreground figures.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
