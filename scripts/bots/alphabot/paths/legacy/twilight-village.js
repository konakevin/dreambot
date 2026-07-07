/**
 * CuddleBot twilight-village path — cozy night/twilight VILLAGES + COTTAGES
 * are the hero. Warm-window cottages under starry sky, lantern-lit village
 * paths at dusk, fairy-light-strung night village, firefly-meadow cottage
 * cluster, moonlit lakeside hamlet, glow-mushroom-village. Creature is a
 * peripheral resident OR absent — architecture and atmosphere carry the
 * scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TWILIGHT_VILLAGE_SCENES, 'twilight_village_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing TWILIGHT-VILLAGE scenes for CuddleBot — cozy night/twilight VILLAGES + COTTAGES + LANTERN-LIT-HAMLETS that the viewer wants to live in. Warm-window cottages under starry sky, lantern-lit cobblestone village paths at dusk, fairy-light-strung night village square, firefly-meadow cottage cluster, moonlit lakeside hamlet, glow-mushroom-village, observatory-treehouse village. The ARCHITECTURE and ATMOSPHERE are the hero — not the creature. Pixar / Sanrio / Studio Ghibli / Beatrix-Potter / Owl-Who-Was-Afraid-of-the-Dark aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TWILIGHT-VILLAGE SCENE ━━━
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

━━━ TWILIGHT-VILLAGE DNA ━━━
The VILLAGE is the subject — not a backdrop. Render the twilight/night-village architecture with obsessive cozy detail: cottages with WARM-amber window-glow against deep-indigo + violet sky, paper-lantern garlands strung between rooflines, jam-jar firefly-lanterns on every porch, glow-worm streetlamps lining cobblestone paths, smoke-curling-from-chimneys catching star-glow, fairy-light strands woven across plazas, moon-reflection in puddles or village ponds, dewdrop-grass silhouettes, milky-way overhead. The village feels LIVED IN at twilight — quilted-blanket on a doorstep, lantern hung in a window, telescope poked from a tree-fort balcony, baked-pie cooling on a windowsill. If the scene description includes a peripheral resident creature (hedgehog, fox kit, owl, bunny, mouse, raccoon), feature them naturally as a tiny local going about twilight village life — lighting a lantern, peeking from a window, walking home with a glow-jar — small but charming. About 60% of scenes feature a small resident peripheral creature; 40% are pure village atmosphere with no creature visible. The viewer wants to MOVE INTO this village.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.BLOW_IT_UP_BLOCK}

${blocks.COZY_VILLAGE_CLUTTER_BLOCK}

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view of the twilight village — cottage row seen from across a moonlit field, lantern-lit path winding through, hamlet seen from a hillside under starry sky. Architecture fills 60-80% of the frame. Tilt-shift or shallow DOF OK. Twilight palette: deep indigo + violet sky + WARM-amber window-glow + lantern-pop + aqua-firefly-glow + milky-silver moon. Sky should READ twilight/night — never gray/dark. Creature (if present) is small, peripheral, NOT center-frame. Wonder + safety + warmth — twilight is COZY here, never scary or eerie. Maximum cozy-village saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
