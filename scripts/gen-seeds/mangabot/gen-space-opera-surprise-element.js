#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SURPRISE-ELEMENT entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names ONE subtle cosmic-moment that gives the frame a story-tick (the loaded instant that takes a static-poster into a keyframe).

Each entry: 12-22 words. ONE specific subtle moment. NOT dramatic (different pool), NOT hero-action — just a quiet beat that pricks the frame alive.

SURPRISE-ELEMENT VARIETY (this 25-entry pool):
- Flash of distant engine-flare from a passing ship (off-screen ship glow in deep background)
- Passing meteor streak across the backdrop (single bright line crossing the void)
- Com-light blink on a hull-pylon (single warning-light pulsing alone)
- Vernier-puff visible (single maneuvering-thruster jet at hull-side)
- Cargo-container drift (one detached pallet tumbling slow at frame-edge)
- Antenna-collision sparks (brief spark-flash where two array-spars meet)
- Distant-fighter formation cutting through the background (small silhouettes in transit)
- Solar-sail unfurling tiny in background (small craft deploying reflective sail)
- EVA-tool drifting loose (a wrench or tool tumbling away from a work-site)
- Cooling-vent gas-puff (white-vapor venting at a hull-vent at scheduled-cycle)
- Comm-laser refracting through gas-cloud (beam visualized as it passes nebula)
- Tiny escape-pod ejecting from a distant station (small bright kick across the field)
- Sensor-array spinning into position (rotating mast adjusting orientation)
- Reactor-overspill arc-flash (brief electrical-arc lacing along a power-conduit)
- Drifting tool-bag glinting (small object catching starlight at mid-distance)
- Maintenance-drone passing close (small robotic form crossing the camera's field)
- Fuel-pellet drift from a depot (small reflective spheres tumbling in chain)
- Quantum-flicker pre-jump shimmer (brief opal-bloom at the hull-perimeter)
- Bay-door cycle (hangar-door beginning to open or close at the hull-mid)
- Antenna-mast adjustment (boom-arm extending or retracting slowly)
- Light-cycle blink (running-lights stepping through a sequence-pattern)
- Distant-ship signal-flare burst (small bright bloom at deep background)
- Tachyon-pulse echo (faint violet-shimmer crossing the starfield once)
- Tiny shuttle docking-burn (small craft firing retros at the airlock)
- Frost-crystal-cloud puff (cryogenic vent releasing white-particle cloud)

DO write:
- A flash of distant engine-flare from an off-screen passing ship, brief glow in the deep background
- A passing meteor streak across the backdrop, single bright line crossing the void behind the cruiser
- A com-light blink on a hull-pylon, single warning-light pulsing alone against the dark plate
- A vernier-puff visible at the hull-side, single maneuvering-thruster jet correcting attitude
- A cargo-container drift at frame-edge, one detached pallet tumbling slow across the foreground
- Antenna-collision sparks, brief spark-flash where two array-spars meet during station maneuver
- A distant-fighter formation cutting through the background, small silhouettes in transit at the far star

DO NOT write:
- Combat-explosion / heroic-action / catastrophic events (that's drama pool)
- Hero-character close-up framings
- Star-Wars or Star-Trek vocabulary
- Generic "movement" — name a SPECIFIC subtle cosmic moment
- Multiple events per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
