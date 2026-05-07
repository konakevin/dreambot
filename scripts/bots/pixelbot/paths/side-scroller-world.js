const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SIDE_SCROLLER_SCENES, 'side_scroller_scene');
  const lighting = picker.pickWithRecency(pools.SIDE_SCROLLER_LIGHTING, 'side_scroller_lighting');
  const atmosphere = picker.pickWithRecency(pools.SIDE_SCROLLER_ATMOSPHERE, 'side_scroller_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART SIDE-SCROLLING PLATFORMER GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as an in-game side-scroller moment — the player is mid-stride on a platform, parallax layers receding behind. NOT concept art. NOT a key-art poster. NOT a vista painting. A screenshot from a SNES-era 2D platformer.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

The camera is **HORIZONTAL SIDE-VIEW** — character-perspective sliced FLAT across the world. Look at the world from the SIDE, NOT from above, NOT from in front, NOT from behind. The frame is read LEFT-TO-RIGHT.

Reference: Castlevania / Hollow Knight pixel / Owlboy / Dead Cells / Ori / Celeste / Trine / Salt and Sanctuary platforming sections.

NEVER:
- Top-down view (no looking down at floor)
- 3/4 isometric (no angled-down floor)
- First-person view (no looking through hero's eyes)
- Frontal 4th-wall view (no looking AT a building's facade or a hall's interior from the door)
- Vertical-portrait composition (no looming-tower / vertical-chasm / staircase-down)
- Vista paintings (no atmospheric scenes without playable platforms)

━━━ MANDATORY ELEMENTS (every render must include all 5) ━━━

1. **HORIZONTAL FRAME** — the eye reads left-to-right. The composition is wider than it is tall in IDEA, even if rendered portrait. The "playable corridor" extends horizontally.
2. **FOREGROUND PLATFORMING SURFACE** — clear ground / ledge / platform / floor running across the bottom-third of the frame. The terrain the player CAN STAND ON. Stone tiles, grass platform, cliff ledge, factory walkway, treetop branch — but explicitly a horizontal platformable surface.
3. **PLAYER-SPRITE on the foreground platforming surface** — a single hero sprite (small) standing or mid-stride on the platform. Visible silhouette: cape / sword / cloak / hood / staff. Tiny scale relative to the world.
4. **MIDDLE PARALLAX LAYER** — terrain receding behind the foreground platform. Different depth, slightly desaturated, more silhouetted. Could be additional platforms at different heights, hills, structures, biome-trees.
5. **FAR BACKDROP** — sky / horizon / distant peaks / ocean / cosmic-void / cavern-wall. Furthest layer with atmospheric haze, defines the biome.

The frame must read INSTANTLY as: "this is a side-scrolling 2D platformer level."

━━━ THE SIDE-SCROLLER SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Lineage: Castlevania IV / Super Metroid / Donkey Kong Country / Mega Man X / Owlboy / Hollow Knight pixel-spinoff vibes / Dead Cells biomes / Trine pixel-tribute — but rendered as 16-bit chunky pixel-grid retro, NOT as modern HD-2D smooth-illustration.

Visible chunky pixel grid on every surface. Player + enemies are sprite-art forms. Platform tiles are clearly tiled. Dithered shading for volume. NEVER smooth gradients.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- HORIZONTAL side-view (NEVER top-down / iso / first-person / frontal / vertical-portrait)
- Foreground platforming surface clearly visible
- Tiny hero player-sprite on the platform
- Middle parallax layer (terrain / structures at different depth)
- Far backdrop (sky / horizon / cosmic-void)
- Chunky 16-bit pixel grid throughout
- Particles in motion (drifting petals / pollen / snow / embers / rain / mist)

The viewer should think: "this is a screenshot from a 16-bit side-scrolling platformer level."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
