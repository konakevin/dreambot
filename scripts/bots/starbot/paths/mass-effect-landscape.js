/**
 * StarBot mass-effect-landscape path — Mass-Effect-coded multi-world vista,
 * no characters. Rotating arm-stations, volcanic clan-warrior wastelands,
 * crystalline floating cities, biomechanical Reaper-coded capital ships,
 * geth-tech industrial moons.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.MASS_EFFECT_LANDSCAPES, 'mass_effect_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'me_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'me_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a MASS-EFFECT-CODED COSMIC VISTA for StarBot — a clean-future-meets-distinct-alien landscape in the BioWare / Sparth / Matt-Rhodes tradition. Each world reads as a SPECIFIC alien-empire architectural language. Controlled palettes, never gaudy. NO CHARACTERS, NO PEOPLE, NO ALIENS, NO FOREGROUND SHEPARDS — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO Shepard, NO Garrus, NO Tali, NO geth-as-figures, NO krogan-as-characters, NO foreground spaceships. Background silhouettes of Reaper-style biomechanical capital ships at distance OK. Just the empty alien world — rotating arm-station / volcanic clan-warrior wasteland / crystalline floating city / geth-tech industrial moon / asari-classical temple / curved-classical galactic-capital interior.

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
NEVER write "Citadel", "Tuchanka", "Thessia", "Reaper", "Sovereign", "Geth", "Quarian", "Krogan", "Asari", "Salarian", "Cerberus", "Normandy", "Mass Effect", "Shepard" in the output.

━━━ COMPOSITION ━━━
Wide cinematic alien-world. CLEAN-FUTURE-MEETS-DISTINCT-ALIEN aesthetic. Controlled color palette — controlled blues, controlled oranges, controlled purples, never gaudy. Each world has its specific architectural language readable at a glance. Foreground textural detail anchors the shot, midground architectural form, background atmospheric scale.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add foreground figures.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
