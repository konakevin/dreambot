#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_foreground_artifact.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} FOREGROUND-ARTIFACT entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names ONE specific object in the IMMEDIATE FOREGROUND (camera-side of the hero ship) that brackets the composition and creates depth-layer parallax.

Each entry: 12-22 words. ONE specific foreground object. Anime-coded space debris / equipment / signal-buoy / discarded gear. Adds parallax depth.

FOREGROUND ARTIFACT VARIETY (this 25-entry pool):
- Broken antenna-spar drifting (snapped metal-rod with cable trailing)
- Floating cargo-container, twisted hatch-edge, paint scarred from cosmic dust
- Drifting fuel-tank with stencil-numbers, slow-rotation at frame-edge
- Orbital-debris chunk (jagged hull-fragment from a wrecked ship)
- Discarded EVA-helmet floating, visor catching cosmic light
- Signal-buoy blinking, lozenge-shape with strobe-light
- Abandoned escape-pod, hatch-open, scorch-marks across the bow
- Drifting mine, spider-spines extended, low-light at the trigger-mechanism
- Quantum-relay station foreground-edge (massive truss-frame at left or right of frame)
- Hull-plate fragment with bullet-hole pattern (combat-debris drifting)
- Discarded comm-laser-tower (snapped at the base, drifting end-over-end)
- Floating crate-pallet with cargo-straps trailing loose
- Asteroid-chunk with mining-rig still attached (worker-equipment frozen in place)
- Drifting hull-letter sequence (giant numerals from a wreck, scale-prover)
- Cracked reactor-core casing (radiation-stripes visible on outer shell)
- Lost service-drone (small robotic form drifting, sensor-array still rotating)
- Trailing tether-cable from an off-frame ship (severed clean, drifting slow)
- Discarded sensor-pod (bulb-shape with array-spikes extended)
- Smashed cockpit-canopy (transparent shards catching distant starlight)
- Ice-encrusted comet-fragment (white-blue chunk passing close)
- Pylon-arm of a destroyed-station (truss-segment with attachment-points exposed)
- Floating launch-clamp (heavy mechanical-jaw drifting, scale 5m across)
- Drifting habitation-module (small cylinder with windows-dark, lifeless)
- Cracked solar-panel array (silicon-sheet fragment with bent-frame edges)
- Lost weapon-magazine (cylindrical cartridge-pod, end-cap glowing dim)

DO write:
- A broken antenna-spar drifting at frame-edge, snapped metal-rod with cable trailing across the foreground
- A floating cargo-container with twisted hatch-edge, paint scarred from cosmic dust, slow-rotation at left
- A drifting fuel-tank with stencil-numbers, slow-rotation at frame-edge, catching engine-glow from hero ship
- An orbital-debris chunk in foreground, jagged hull-fragment from a wrecked ship dwarfing the camera
- A discarded EVA-helmet floating, visor catching cosmic light, parallax foreground anchor
- A signal-buoy blinking lozenge-shape with strobe-light, immediate foreground bracket at frame's right
- A quantum-relay station at foreground-edge, massive truss-frame cutting the left of the composition

DO NOT write:
- Anything BACKGROUND or far-distance (this is the FOREGROUND artifact pool)
- The hero ship itself
- Hero-character close-up
- Star-Wars debris (Death-Star-fragment / Imperial-wreckage / X-wing-debris)
- Realistic-NASA junk (Hubble / ISS-truss / SpaceX-Starlink)
- Generic "floating object" without specific identity + scale

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
