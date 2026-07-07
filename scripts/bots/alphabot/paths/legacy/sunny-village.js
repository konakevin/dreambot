/**
 * CuddleBot sunny-village path — cozy bright-sunny daytime VILLAGES are
 * the hero. Sun-drenched cottage row at golden hour, sunflower-garden
 * village square, white-stucco Mediterranean cliff hamlet, daisy-meadow
 * cottage cluster, lemon-grove village, lavender-field hamlet, summer
 * harbor-town, beach-cabin row. Creature peripheral or absent — the
 * sun-drenched architecture and atmosphere carry the scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SUNNY_VILLAGE_SCENES, 'sunny_village_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing SUNNY-VILLAGE scenes for CuddleBot — cozy BRIGHT-SUNNY DAYTIME VILLAGES + COTTAGES + SEASIDE-HAMLETS that the viewer wants to live in. Sun-drenched cottage row at golden hour, sunflower-garden village square, white-stucco Mediterranean cliff hamlet, daisy-meadow cottage cluster, lemon-grove village, lavender-field hamlet, summer harbor-town, beach-cabin row, hilltop chapel hamlet, vineyard village. The ARCHITECTURE and SUN-DRENCHED ATMOSPHERE are the hero — not the creature. Pixar / Sanrio / Studio Ghibli / Totoro-summer / Greek-island-cottage aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SUNNY-VILLAGE SCENE ━━━
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

━━━ SUNNY-VILLAGE DNA ━━━
The VILLAGE is the subject — not a backdrop. Render the sun-drenched architecture with obsessive cozy detail: white-stucco cottages with terracotta-tile roofs, climbing-roses on archways, sunflower-row fences, lavender-bordered paths, lemon-trees in tiled courtyards, blue-shutter windows thrown open, white-linen laundry on sun-drenched lines, painted-wood signs, market-baskets stacked, bicycle-against-fence, cobblestone or sun-warmed stone paths. The village feels LIVED IN at noon — washing on lines, sun-bleached doorways, baskets of fruit on stoops, bunting strung between rooflines, café-tables in dappled-sun. If the scene description includes a peripheral resident creature (mouse, hedgehog, kitten, bunny), feature them naturally as a tiny local going about sunny village life — sniffing wildflowers, walking down a sun-warmed lane, peeking from a window-box — small but charming. About 60% of scenes feature a small resident peripheral creature; 40% are pure village atmosphere with no creature visible. The viewer wants to MOVE INTO this village. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view of the village street / hilltop / cluster. Architecture fills 60-80% of the frame. Tilt-shift or shallow DOF on a single charming detail OK. STRONG WARM-GOLD sunlight is non-negotiable — bright daytime, sun-glittering surfaces, lens-flare optional, soft sky-blue overhead, dappled-sun on stone paths. Sunny palette: warm honey-gold + white-stucco + terracotta-orange + sky-blue + sunflower-yellow + lavender-violet + cream. Creature (if present) is small, peripheral, NOT center-frame. Maximum cozy-village saturation under bright sun.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
