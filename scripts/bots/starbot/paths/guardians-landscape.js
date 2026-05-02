/**
 * StarBot guardians-landscape path — Guardians-of-the-Galaxy-coded cosmic-weird
 * vista, no characters. Severed-Celestial-skull mining colonies, neon nightclub
 * planets, gold-aesthetic perfect societies, kaleidoscopic crystal worlds.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.GUARDIANS_LANDSCAPES, 'guardians_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'gg_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'gg_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a GUARDIANS-OF-THE-GALAXY-CODED COSMIC-WEIRD VISTA for StarBot — a vibrant colorful alien planet vista in the James-Gunn / Jack-Kirby-cosmic / 70s-album-cover-sci-fi / Heavy-Metal-magazine tradition. Less gritty than Star Wars, less hostile than Aliens — playful-cosmic-glamorous-weird. NO CHARACTERS, NO PEOPLE, NO ALIENS-AS-FIGURES, NO FOREGROUND SPACESHIPS — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO humans, NO aliens, NO Star-Lord, NO Rocket, NO Groot, NO foreground spaceships. Just the empty cosmic-weird world — severed-skull mining colony / neon nightclub planet / gold-aesthetic city / kaleidoscopic crystal world / mist-shrouded forest moon / vibrant colorful alien biome.

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
NEVER write "Knowhere", "Xandar", "Contraxia", "Sovereign", "Berhert", "Yondu", "Star-Lord", "Rocket", "Groot", "Ego", "Nova Corps" in the output.

━━━ COMPOSITION ━━━
Wide cinematic cosmic-weird landscape. SATURATED COLOR is the signature — neon, classical-perfect, or rainbow-clashing palettes. Less gritty than Star Wars, more PLAYFUL-EXTRAVAGANT-WEIRD. Foreground textural detail (neon reflection / crystal facet / vine bioluminescence / scrap-built shanty edge), midground architectural form, background atmospheric color-bleed.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add characters. Push color saturation hard.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
