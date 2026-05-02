/**
 * StarBot aliens-landscape path — Alien/Aliens-coded hostile-world vista,
 * no characters. Wind-blasted volcanic moons, derelict ship graveyards,
 * primordial bioluminescent terrain, atmospheric processor silhouettes,
 * abandoned colony exteriors, acid-rain storms. Pure landscape.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.ALIENS_LANDSCAPES, 'aliens_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'aliens_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'aliens_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing an ALIEN-WORLD VISTA for StarBot in the Alien / Aliens / Prometheus aesthetic tradition — H.R.-Giger / Ridley-Scott / James-Cameron / Ron-Cobb concept-art mood. Hostile-but-beautiful, industrial-meets-organic, terrifying alien planet landscape. NO CHARACTERS, NO PEOPLE, NO XENOMORPHS, NO FIGURES — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS / NO CREATURES — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO humans, NO aliens, NO xenomorphs, NO creatures, NO figures. Just the empty hostile world — its skies, its rocks, its mist, its scale. Distant atmospheric processors / crashed ships / abandoned colonies serve as eerie scale-markers but no living thing is in frame.

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
NEVER write "LV-426", "Nostromo", "Sulaco", "Hadley's Hope", "Weyland-Yutani", "xenomorph", "facehugger", "Ripley", "Engineer", "Prometheus" in the output. The aesthetic is INSPIRED BY the Alien franchise but generic in language.

━━━ COMPOSITION ━━━
Wide cinematic alien-world landscape, biblical scale. The sky is heavy and DOMINATING — perpetual storm clouds, acid rain, pale diffuse light. Light is COLD — pale blue-grey, sodium-amber from distant industrial lights, occasional lightning strobe. The land FEELS WRONG — too quiet, too still, too vast. Distant atmospheric-processor silhouettes / derelict-ship graveyards / abandoned colonies anchor scale at the horizon. Foreground textural detail (rocky outcrops / acid-pitted surfaces / mist / ash / volcanic glass) anchors the shot.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add characters. Do NOT shrink the scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
