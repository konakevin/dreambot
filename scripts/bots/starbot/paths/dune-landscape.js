/**
 * StarBot dune-landscape path — pure Dune-coded desert vista, no characters.
 *
 * Vast Arrakis-aesthetic deserts, twin-sun horizons, sandworm-trail terrain,
 * sandstone cathedral formations, sietch-cliff silhouettes. No characters.
 * Pure scene/aura/vibe.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.DUNE_LANDSCAPES, 'dune_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'dune_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'dune_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a DUNE-CODED DESERT VISTA for StarBot — a vast cinematic alien-desert landscape in the Frank-Herbert / Denis-Villeneuve aesthetic tradition. NO CHARACTERS, NO PEOPLE, NO FIGURES — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO humans, NO aliens, NO figures, NO silhouettes of people, NO ornithopters with pilots — just the empty vast desert. The world is the subject. If anything moves in the frame it's wind-driven sand, shifting dust, light raking across dunes — never a living being.

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
NEVER write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "ornithopter", "spice", "Bene Gesserit", "Shai-Hulud" in the output. The aesthetic is INSPIRED BY Dune but generic in language — describe the landscape with original phrasing.

━━━ COMPOSITION ━━━
Wide cinematic landscape, biblical scale. The sky DOMINATES — fills 50-70% of the frame in sweeping atmospheric grandeur. Twin suns, dust-haze, spice-blue dawn glow, polar ice, wormtrail terrain — whatever the scene calls for at MASSIVE scale. Horizon stretches into atmospheric perspective. Foreground textural detail (dune ripples / sandstone cracks / wind patterns) anchors the shot. Camera high or wide — emphasizing the scale of the empty world.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add characters. Do NOT shrink the scale. The desert is the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
