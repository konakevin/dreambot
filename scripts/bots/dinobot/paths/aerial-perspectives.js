/**
 * DinoBot aerial-perspectives path — flying creatures in their element +
 * aerial-camera views of the prehistoric world. The frame is HIGH UP.
 *
 * 70% pterosaurs / early-flying-dinosaurs in flight (the subject IS in the air).
 * 30% aerial-camera views of land/water dinosaurs from helicopter / drone /
 * bird's-eye altitude (the camera is HIGH UP looking down).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.AERIAL_SUBJECTS, 'aerial_subject');
  const action = picker.pickWithRecency(pools.AERIAL_ACTIONS, 'aerial_action');
  const setting = picker.pickWithRecency(pools.AERIAL_SETTINGS, 'aerial_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'aerial_atmosphere');

  return `You are a paleo-cinematographer writing AERIAL PERSPECTIVE scenes for DinoBot — flying creatures in their element OR ground dinosaurs seen from sky-altitude. The frame is HIGH UP. Output wraps with style prefix + suffix.

${blocks.NO_HUMANS_BLOCK}

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}
${blocks.DOCUMENTARY_CAMERA_BLOCK}

━━━ THE SUBJECT ━━━
${subject}

━━━ THE ACTION (flight motion or aerial-camera moment) ━━━
${action}

━━━ THE SKY / AERIAL SETTING ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

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

━━━ COMPOSITION RULES — AERIAL FRAMING ━━━
The frame is HIGH UP. Two valid modes:
- Mode A (most common): Flying creature in mid-air, sky/world stretching below. Wing membrane catches light, atmospheric depth recedes to vanishing point. The creature fills 35-55% of the frame.
- Mode B: Aerial-camera view of ground dinosaur(s) from helicopter / drone / bird's-eye altitude. The dinosaur(s) seen top-down or angled-down, terrain visible around them. Even from above, the dinosaur is the eye's first landing place.

NEVER ground-level framing. NEVER flat-horizon shots. The viewer is in the SKY.

━━━ WING / ANATOMY FIDELITY (NON-NEGOTIABLE) ━━━
If a pterosaur species is named, render its DEFINING anatomy correctly:
- Wing membrane stretched between elongated 4th finger and ankle (NOT bird-feathered wings)
- Beak/jaw shape per species (Pteranodon's pointed crest, Pterodactylus' small head, Quetzalcoatlus' giant proportions, Tupuxuara's semi-circular crest)
- Body proportions per species — NEVER default to a generic dragon-shape

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
