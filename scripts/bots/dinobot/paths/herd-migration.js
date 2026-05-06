/**
 * DinoBot herd-migration — colossal herds crossing prehistoric plains.
 * Massive scale, dust clouds, endless silhouettes. BBC nature doc energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const herd = picker.pickWithRecency(pools.HERD_SCENES, 'herd_scene');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a BBC wildlife cinematographer writing COLOSSAL HERD MIGRATION scenes for DinoBot. Massive numbers of dinosaurs moving together across a lush prehistoric world. The scale is the story — dozens to hundreds of animals, stretching to the horizon. Output wraps with style prefix + suffix.

${blocks.NO_HUMANS_BLOCK}

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}
${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HERD ━━━
${herd}

━━━ SETTING ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.VOLUMETRIC_LIGHT_BLOCK}

${blocks.WET_WORLD_BLOCK}
${blocks.EPIC_SCALE_BLOCK}

${blocks.VAST_TERRAIN_BLOCK}

${blocks.SURPRISING_WEATHER_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ CAMERA / FRAMING ━━━
${camera}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — HERO + HERD FRAMING (NON-NEGOTIABLE) ━━━
The DINOSAUR(S) ARE THE SUBJECT, with the herd as supporting context. Non-negotiable:

1. ONE TO THREE FOREGROUND HERO DINOSAURS — clearly described, anatomically detailed, filling 35-55% of the frame. The eye's FIRST landing place is on these individual hero dinosaurs.

2. A LARGE HERD (50-200 animals) extends BEHIND/AROUND them — supporting backdrop, scale-staggered from midground mass to vanishing-point silhouettes.

3. ANATOMICAL DISAMBIGUATION — the silhouettes in the herd must read as DINOSAURS, not mammals. Use silhouette cues: "long S-curve necks rising above the crowd like masts" / "duck-billed crested heads bobbing" / "horned frills catching light" / "plate-rows undulating across backs" / "spike-tails visible above the mass."

4. NEVER a wide pure-herd shot with no clear foreground hero — that renders as wildebeest. NEVER "thousands" — say "hundred-strong" or "vast herd" instead, in the realm of 50-200.

5. The hero dinosaur is photoreal wildlife photography quality (real animal, leathery hide, biological), the herd behind is recognizable dinosaur silhouettes through atmospheric haze.

If the rendered scene shows tiny-mammal-shaped silhouettes that could be wildebeest, the path has FAILED. The hero dinosaur(s) close-up must anchor the eye and the herd's silhouettes must scream DINOSAUR through neck/frill/crest/plate cues.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
