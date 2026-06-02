#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_engine_or_signal.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ENGINE-OR-SIGNAL entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names ONE specific propulsion-glow / signal-emission / charge-effect originating from the hero ship. This is the energy SIGNATURE that proves the ship is alive.

Each entry: 12-22 words. ONE specific anime-coded propulsion or signal effect. Bright + readable against the cosmic backdrop.

ENGINE/SIGNAL VARIETY (this 25-entry pool):
- Main engine-bell glowing orange-red (sustained burn, chromatic core)
- Wave-motion-cannon charging blue (Yamato register — bow-port pulsing pre-fire)
- Vernier-thrusters firing in array (Macross-style alignment-burn pattern)
- Signal-flare burst (white-hot point at hull-side, expansion-cone)
- Radar-pulse outward (visible expanding ring from antenna-mast)
- Com-laser visible (narrow beam from communication-tower to off-frame target)
- Plasma-contrail trailing (orange-blue exhaust streamer behind the cruiser)
- Quantum-jump pre-flash (hull-perimeter glowing teal, FTL-charge accumulating)
- Reaction-control-thruster puff (small white-vapor jet at maneuver-point)
- Bridge-bay lights ramping up sequence (window-row pulsing white-blue in cascade)
- Cosmo-fleet maneuver-burn (massed thrusters firing in formation pattern)
- Anti-grav-coil glow (orange-magenta band cycling around the hull's mid-section)
- Hyperdrive-spool wind-up (bow-mounted ring glowing through color-spectrum)
- Tachyon-pulse emission (violet-white spike from sensor-mast)
- Mass-driver kick-flash (kinetic-cannon discharge at the spinal turret)
- Catapult-launch burner (deck-end booster firing as a fighter ejects)
- Sub-light cruise-glow (steady cyan band around the engine-cluster)
- Lateral RCS-jet visible (correction-burn from hull-side fixed-point)
- Cooling-vent plasma-vent (orange flare from a hull-vent at heat-dump)
- Signal-pylon strobe-pulse (red-white alternating beacon from antenna-tip)
- Power-conduit overspill (electrical-arc lacing along a hull-vent during charge)
- Comm-array data-stream visualized (laser-line array between station and ship)
- Pre-jump tachyon-bloom (hull haloed in opal as quantum-drive spools)
- Wave-motion-cannon test-fire afterglow (residual blue cone-glow from bow)
- Maneuvering-thruster sequence (multiple small jets firing in choreographed sequence)

DO write:
- Main engine-bell glowing orange-red in a sustained burn, chromatic core throwing heat-glow on the hull
- Wave-motion-cannon charging blue at the bow, energy-pulse swelling in the cannon-port pre-fire
- Vernier-thrusters firing in array, Macross-style alignment-burn pattern lighting the dorsal-spine
- Quantum-jump pre-flash haloing the hull-perimeter teal, FTL-charge accumulating around the bow
- Bridge-bay lights ramping up in cascade, window-row pulsing white-blue along the command deck
- Plasma-contrail trailing orange-blue exhaust behind the cruiser, streamer arcing into the void
- Mass-driver kick-flash at the spinal turret, kinetic-cannon discharge with white-hot recoil bloom

DO NOT write:
- Hero-character close-up
- Generic "lights" or "glow" without specific origin-point + color
- Star-Wars vocabulary (lightsaber / proton-torpedo / blaster-bolt)
- Star-Trek vocabulary (warp-flash / phaser-beam / photon-torpedo)
- Background-only effects (the source must be ON THE HERO SHIP)
- Multiple effects per entry — name ONE clear engine/signal source

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
