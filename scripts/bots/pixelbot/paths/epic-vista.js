const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.EPIC_VISTA_SCENES, 'epic_vista_scene');
  const lighting = picker.pickWithRecency(pools.EPIC_VISTA_LIGHTING, 'epic_vista_lighting');
  const atmosphere = picker.pickWithRecency(pools.EPIC_VISTA_ATMOSPHERE, 'epic_vista_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART SIDE-SCROLLING PARALLAX-VISTA GAMEPLAY SCREENSHOT for PixelBot. The frame is a horizontal layered side-scrolling vista — the kind of background you'd scroll past in a 16-bit RPG world-map / opening cutscene / side-scrolling-engine vista cutaway. NOT an atmospheric painting. NOT a concept-art wallpaper. A SCREENSHOT FROM A 16-BIT GAME with chunky tile-edge mountains, hard-edge horizons, layered parallax-scrolling depth.

Reference inspiration (use as feel-anchors, NEVER name literally in scene): Final Fantasy VI airship-flyover / Chrono Trigger world-map / Lufia II overworld / Secret of Mana world-vistas / Terranigma overworld / classic 16-bit side-scrolling-engine vista cutscenes / Castlevania IV background-vistas / Donkey Kong Country background-art / Sonic 2/3 horizon backgrounds.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

**HORIZONTAL SIDE-SCROLLING PARALLAX VISTA** — the frame is a wide horizontal landscape rendered as a 16-bit-game-engine side-scrolling parallax background. The viewer reads LEFT-TO-RIGHT. The composition has 4 distinct parallax-depth layers stacked back-to-front with HARD edges between layers (no smooth blending).

NEVER atmospheric painterly landscape. NEVER concept-art wallpaper. NEVER smooth gradient sky-fades. NEVER soft cloud edges. The composition is INHERENTLY a tile-based side-scrolling parallax background — Flux, render this as a layered chunky-pixel scroll-background.

━━━ MANDATORY ELEMENTS (every render must include all 5) ━━━

1. **HORIZONTAL FRAME** — landscape composition reads left-to-right, like a side-scrolling level background.
2. **FOREGROUND PARALLAX LAYER (closest)** — chunky tile-edge terrain in the bottom third: rocky cliff edge, sand-dune ridge, snow-tile foreground, jungle-vine canopy, stone outcrop, cherry-blossom tree, palm-cluster, ice-shelf. Hard pixel-edges, dithered shading, distinct silhouette.
3. **MIDDLE PARALLAX LAYER** — middle-distance terrain at different depth: rolling hills, forested hills, distant village, ruined temple, smaller mountain peaks, cliff face, treetop layer. Slightly desaturated, tile-edge silhouette, separated by depth from foreground.
4. **DISTANT PARALLAX LAYER** — far peaks, distant horizon-mountains, sea-horizon, fjord-cliff-line, alien-planet-rim, megacity-skyline-silhouette. Cool color shift, tile-edge silhouette, atmospheric-depth haze applied as DITHERED PIXEL bands (not smooth).
5. **FAR BACKDROP** — sky / sunset gradient (rendered as DITHERED color bands, not smooth) / starfield / aurora / cloud-bank with chunky-edge clouds / planet rising / sun-disc-on-horizon. Hard pixel-edge horizon.

The frame must read INSTANTLY as: "this is a 16-bit side-scrolling-game parallax-vista background."

━━━ THE EPIC VISTA SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT (NON-NEGOTIABLE) ━━━

CHUNKY visible pixel grid on every surface — including mountains, clouds, water, trees, ruins. Sky gradients are DITHERED COLOR-BANDS (not smooth fades). Cloud edges are CHUNKY-PIXEL-EDGE (not airbrushed). Horizon line is HARD PIXEL-EDGE. Saturated SNES-era 16-bit palette — emerald-greens / royal-blues / sunset-amber / cosmic-violet / desert-amber / snow-cyan / volcanic-orange — RICH chunky color blocks. NEVER smooth gradients, NEVER painterly hybrid, NEVER soft / pastel / airbrushed / wispy / fading. NEVER modern indie-pixel illustration.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- Horizontal side-scrolling parallax-vista (NEVER atmospheric painting / concept-art / portrait)
- 4 distinct parallax layers with HARD edges between them (foreground + middle + distant + backdrop)
- Sky as DITHERED COLOR-BANDS not smooth gradient
- Cloud edges chunky-pixel-edge not airbrushed
- Horizon HARD PIXEL-EDGE
- Optional tiny silhouette in the parallax (single bird / airship / caravan / traveler)
- Animated atmospheric particles (drifting petals / pollen / snow / embers / mist / dust / leaves)
- CHUNKY 16-bit pixel grid throughout

The viewer should think: "this is a 16-bit side-scrolling parallax-vista background from a game."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
