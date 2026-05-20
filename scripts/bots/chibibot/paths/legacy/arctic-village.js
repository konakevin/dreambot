/**
 * CuddleBot arctic-village path — cozy snow/ice VILLAGES + COTTAGES are the
 * hero. Snow-cottage town with candy-cane fences, igloo cluster with
 * lantern-paths, snowy-pine-cottage cluster, log-cabin-village under aurora,
 * gingerbread-snow-fortress, polar-station cottage. Creature is a peripheral
 * resident OR absent — architecture and atmosphere carry the scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ARCTIC_VILLAGE_SCENES, 'arctic_village_scene');
  const creature = picker.pickWithRecency(pools.ARCTIC_CREATURES, 'arctic_creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing ARCTIC-VILLAGE scenes for CuddleBot — cozy snow/ice/aurora VILLAGES + COTTAGES + LOG-CABIN-CLUSTERS that the viewer wants to live in. Snow-cottage town with candy-cane fences, igloo cluster with lantern-paths, snowy-pine-cottage cluster, log-cabin village under aurora, gingerbread-snow-fortress, polar-station cottages, snowy-mountain hamlet. The ARCHITECTURE and ATMOSPHERE are the hero — not the creature. Pixar / Sanrio / Studio Ghibli / Frozen / Polar-Express / baby-Christmas-special aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ARCTIC-VILLAGE SCENE ━━━
${scene}

━━━ OPTIONAL VILLAGE RESIDENT (only feature if scene calls for it — peripheral, NOT centered) ━━━
${creature}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

${blocks.COZY_VILLAGE_CLUTTER_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ARCTIC-VILLAGE DNA ━━━
The VILLAGE is the subject — not a backdrop. Render the snowy-arctic architecture with obsessive cozy detail: snow-roofed log-cabin cottages with WARM-amber window-glow, candy-cane fence-posts, twinkle-string-lights between rooflines, smoke-curling-from-stone-chimneys, fresh paw-prints in the snow, pine-bough wreaths on doors, jingle-bell garlands, lantern-poles with golden glow at every cottage, snowdrift-piled doorsteps. The village feels LIVED IN — knit-blanket on a porch swing, snow-shovel leaning by a door, sled parked at a cabin, wood-stack covered in fresh snow. If the scene description includes a peripheral resident creature (polar bear cub, fox kit, penguin chick, reindeer calf), feature them naturally as a tiny local going about village life — leaving paw-prints, peeking from a snow-burrow, carrying a tiny knit-bag — small but charming. About 60% of scenes feature a small resident peripheral creature; 40% are pure village atmosphere with no creature visible. The viewer wants to MOVE INTO this village. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view of the snowy village — cottage row seen from across the snow, igloo cluster seen from a snow-ridge, log-cabin village seen from a pine-grove. Architecture fills 60-80% of the frame. Tilt-shift or shallow DOF OK. Soft cool snow-light + WARM-amber window-glow contrast (warm interior beats cold exterior) + optional aurora-violet/teal in the sky. Creature (if present) is small, peripheral, NOT center-frame. Always WARM-cozy despite the cold biome — never grim, never bleak. Maximum cozy-village saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
