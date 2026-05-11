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

  return `You are a sci-fi concept-art painter writing a DUNE-CODED DESERT VISTA for StarBot — a vast cinematic alien-desert landscape in the Frank-Herbert / Denis-Villeneuve aesthetic tradition. The scene MUST include EITHER a lone robed desert figure rendered small in the vastness OR a sci-fi flying craft (insectoid blades, hover, gunship) crossing the dunes — pick one for scale and witness. The landscape is the hero; the figure or craft proves the scale. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ ONE FIGURE OR ONE CRAFT — NON-NEGOTIABLE ━━━
The scene MUST include EXACTLY ONE of the following, rendered SMALL for scale: (a) a lone robed desert figure walking the dunes, perched on a ridge, or silhouetted against the sky; OR (b) a sci-fi flying craft — insectoid-bladed flyer, hovering desert gunship, ribbed hover-skiff — crossing the dunes mid-frame. Choose one. Render at a scale where the figure or craft is a SMALL element in the vast frame. The empty desert remains 90% of the composition.

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
NEVER write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "ornithopter", "spice", "Bene Gesserit", "Shai-Hulud" in the output. The aesthetic is INSPIRED BY Dune but generic in language — describe the landscape, figure, or craft with original phrasing (e.g., "insectoid-bladed flyer" not "ornithopter").

━━━ COMPOSITION ━━━
Wide cinematic landscape, biblical scale. The sky DOMINATES — fills 50-70% of the frame in sweeping atmospheric grandeur. Twin suns, dust-haze, spice-blue dawn glow, polar ice, wormtrail terrain — whatever the scene calls for at MASSIVE scale. Horizon stretches into atmospheric perspective. Foreground textural detail (dune ripples / sandstone cracks / wind patterns) anchors the shot. Camera high or wide — emphasizing the scale of the empty world.

DRAMATIC VISUALS: render the EXACT scene above with ONE small figure OR ONE small craft for scale. Do NOT shrink the scale of the landscape. The desert remains the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
