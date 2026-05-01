/**
 * OceanBot lost-cities — Atlantis ruins, drowned temples, coral-grown statues of forgotten gods.
 * "The ocean is swallowing civilization." Turquoise haze, god-rays, haunting beauty.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.LOST_CITY_SCENES, 'lost_city');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');
  const cameraAngle = picker.pickWithRecency(pools.OCEAN_CAMERA_ANGLES, 'camera_angle');

  return `You are an underwater archaeologist-painter writing LOST CITY scenes for OceanBot. Sunken civilizations — Atlantis-style ruins, drowned temples, coral-grown statues of forgotten gods, the ocean swallowing humanity's monuments. Haunting beauty, not horror. Output wraps with style prefix + suffix.

━━━ ONLY THESE SUBJECTS ━━━
- Atlantis-style ruins (marble columns, fallen pediments, sunken plazas)
- Drowned temples (Greco-Roman / Egyptian / Mesoamerican / Khmer / Hindu / Mesopotamian / Polynesian)
- Coral-grown statues of forgotten gods (Poseidon, Buddha, Apollo, Anubis, Quetzalcoatl, Vishnu)
- Drowned palaces with kelp tapestries, coral chandeliers
- Submerged ziggurats / pyramids / pagodas
- Sunken aqueducts, amphitheaters, forums, libraries

━━━ ABSOLUTELY BANNED ━━━
- NO modern ships, submarines, scuba gear, divers, humans
- NO sea monsters / krakens / serpents / leviathans (kraken-leviathan path)
- NO mermaids (mermaid-legend path)
- NO wooden sailing vessels (ghost-ship / shipwreck-kingdom paths)
- NO modern infrastructure — bridges, highways, oil rigs, skyscrapers

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE LOST CITY SCENE ━━━
${scene}

━━━ CAMERA ANGLE / FRAMING — LEAD WITH THIS, FIRST 8-15 WORDS ━━━
The Flux model heavily weights early tokens. Your scene description MUST OPEN with this camera-angle phrase, paraphrased into the first 8-15 words. Do NOT bury it mid-paragraph. The first words out of your mouth must establish this framing:
${cameraAngle}

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

━━━ COMPOSITION ━━━
Use the CAMERA ANGLE directive above as the framing. Turquoise haze in the water column. Shafts of god-rays from above. Coral-grown statues with anemones in eye sockets. Massive scale. Haunting beauty. Do NOT default to "ruined temple dead-center wide shot" — honor the camera angle (worm's-eye between toppled columns, looking-up-through-collapsed-roof, drone-overhead of the city plaza, through-broken-statue, etc.).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
