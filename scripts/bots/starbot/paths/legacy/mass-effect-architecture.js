const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.MASS_EFFECT_ARCHITECTURE, 'mass_effect_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'me_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'me_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a MASS-EFFECT-CODED ARCHITECTURE scene for StarBot — a cinematic clean-future-meets-distinct-alien interior in the BioWare / Sparth / Matt-Rhodes tradition. Each species/world has its own architectural language. Controlled palettes, never gaudy. NO CHARACTERS, NO PEOPLE, NO ALIENS — pure architecture. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO Shepard, NO Garrus, NO Tali, NO geth-as-figures, NO krogan, NO foreground spaceships. Just the empty interior.

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
NEVER write "Citadel", "Normandy", "Tuchanka", "Thessia", "Reaper", "Sovereign", "Geth", "Quarian", "Krogan", "Asari", "Salarian", "Cerberus", "Mass Effect" in the output.

━━━ COMPOSITION ━━━
CLEAN-FUTURE-MEETS-DISTINCT-ALIEN. Controlled color palette — controlled blues, oranges, purples, never gaudy. Each interior has its specific architectural language readable at a glance.

DRAMATIC VISUALS: render the EXACT architecture above.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
