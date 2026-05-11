const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.GUARDIANS_ARCHITECTURE, 'guardians_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'gg_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'gg_arch_atmosphere');

  return `You are a sci-fi concept-art painter writing a GUARDIANS-OF-THE-GALAXY-CODED ARCHITECTURE scene for StarBot — a cinematic cosmic-weird interior in the James-Gunn / Jack-Kirby-cosmic / 70s-album-cover-sci-fi tradition. NO CHARACTERS, NO PEOPLE, NO ALIENS-AS-FIGURES — pure architecture. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}
${blocks.COSMIC_CANVAS_BLOCK}
${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO humans, NO aliens, NO Star-Lord, NO Rocket, NO Groot, NO foreground spaceships. Just the empty cosmic-weird space.

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
NEVER write "Knowhere", "Xandar", "Contraxia", "Sovereign", "Yondu", "Star-Lord", "Rocket", "Groot", "Ego", "Nova Corps" in the output.

━━━ NO SKULLS — HARD BAN ━━━
NEVER render skulls of any kind: no giant celestial skull (Knowhere code), no skull-shaped architecture, no skull-bone fragments, no cracked-cranium spaces. Cosmic-weird architecture should lean into temple-arcades, spire-cities, color-saturated cathedrals, kaleidoscopic geometry — NOT macabre bone forms.

━━━ COMPOSITION ━━━
SATURATED COLOR is the signature — neon, classical-perfect, or rainbow-clashing palettes. Less gritty than Star Wars, more PLAYFUL-EXTRAVAGANT-WEIRD. Foreground architectural detail, midground form, background atmospheric color-bleed.

DRAMATIC VISUALS: render the EXACT scene above. Push color saturation hard.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
