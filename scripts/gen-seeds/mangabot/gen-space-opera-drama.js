#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DRAMA entries for a MangaBot space-opera keyframe. SCENE-LED conditional layer (fired at 40%) — each entry names ONE LOADED MOMENT that elevates the frame from "ship cruising" to "ship in the middle of something". Operatic-anime register (Yamato wave-motion / Macross fighter-launch / Galactic-Heroes orbital-bombardment / Cowboy-Bebop pre-jump-charge).

Each entry: 12-22 words. ONE specific dramatic moment. Bigger than surprise-pool — this is the operatic beat.

DRAMA VARIETY (this 25-entry pool):
- Wave-motion-cannon charging blue (Yamato register — bow-port pulsing with massive pre-fire light)
- Fighter-launch vortex (catapult firing — single fighter ejecting in plasma-blur from launch-deck)
- Hangar-door opening with starlight pouring in (interior-glow contrasting with cosmic void)
- Hyperspace-jump pre-flash (hull haloed in opal as quantum-drive spools to threshold)
- Battle-debris cloud passing (wreckage-stream crossing the foreground from recent engagement)
- Orbital-bombardment glow on planet-below (impact-flashes lighting the curve of a planet)
- Wave-motion-cannon test-fire afterglow (residual blue cone-glow from a just-discharged bow)
- Mass-driver kinetic-discharge (white-hot flash from the spinal turret, recoil-cloud spreading)
- Fleet-formation engaging from background (mass of escorts firing massed-volley at distant target)
- Pre-jump quantum-bloom (hull-perimeter teal-haloed, FTL-drive at full pre-charge)
- Reactor-vent emergency-flare (hull-vent releasing massive plasma plume, ship venting overcharge)
- Mid-broadside salvo (cruiser firing massed-cannon volley to the off-frame target)
- Catapult-burst launch sequence (multiple fighters ejecting in rapid succession from launch-deck)
- Asteroid-collision near-miss (giant rock passing inches from hull, anti-grav field flaring)
- Boarding-shuttle docking under fire (small craft attaching with hostile-fire impacting nearby hull)
- Wave-motion-cannon FIRING (the actual beam discharge, vast blue-white shaft cutting space)
- Ship-rotating-to-fire-position (cruiser pivoting on yaw axis, attitude-thrusters in full burn)
- Plasma-burst from incoming-fire (hostile impact bloom on the hull, debris flying)
- Cruiser ramming through a debris-cloud (forward-shield-glow as the hull plows wreckage)
- Multiple-engine ignition burst (engines spooling up in sequence to full-burn)
- Quantum-jump exit-flash (ship arriving in a teal-blue burst from FTL-translation)
- Lance-of-light from quasar passing the ship (beam-of-relativistic-jet sweeping past hull)
- Escape-pod evacuation cascade (many pods ejecting in stream from a wounded cruiser)
- Bay-doors blowing open from internal-blast (hangar-bay venting catastrophically to vacuum)
- Wave-motion-cannon charge-collapse (pre-fire light spectacularly inverting back into the cannon-port)

DO write:
- Wave-motion-cannon charging blue at the bow, the cannon-port pulsing with massive pre-fire light
- Fighter-launch vortex, catapult firing — a single fighter ejecting in plasma-blur from the launch-deck
- Hangar-door opening with starlight pouring in, the interior-glow contrasting with the cosmic void beyond
- Hyperspace-jump pre-flash, the hull haloed in opal as the quantum-drive spools to threshold
- Battle-debris cloud passing through the foreground, wreckage-stream from a recent engagement crossing
- Orbital-bombardment glow on planet-below, impact-flashes lighting the curve of the planet under the ship
- Wave-motion-cannon FIRING, a vast blue-white shaft cutting space from the bow-port at full discharge

DO NOT write:
- Hero-character close-up — drama is on the SHIP / FLEET / STATION scale only
- Generic "action" or "battle" — name the specific anime-coded operatic beat
- Star-Wars vocabulary (Death-Star-fire / lightsaber-clash / X-wing-attack)
- Star-Trek vocabulary (phasers-fire / photon-torpedo-launch / warp-flash-jump)
- Quiet ticks (those are surprise-element pool)
- Multiple events per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
