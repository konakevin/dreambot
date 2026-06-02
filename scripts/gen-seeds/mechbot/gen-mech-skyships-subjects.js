#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mech_skyships_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} SKYSHIP descriptions for MechBot's mech-skyships path. Each describes a flying sci-fi mech-vessel — sleek, mean, advanced, predatory — in 14-22 words.

Each entry: ship class + signature silhouette + signature weapons/glow + scale anchor + aesthetic accent.

━━━ ABSOLUTE BAN — NO MODERN MILITARY TERMS ━━━
NEVER use these words (they pull literal Earth-military reference into the render):
- carrier, aircraft carrier, dreadnought, battleship, destroyer, frigate, cruiser, corvette
- submarine, gunship, bomber, fighter, jet, helicopter
- naval, navy, warship (use sci-fi terms instead)

━━━ ALLOWED VOCABULARY (sci-fi, predatory) ━━━
- skyship, sky-leviathan, sky-fortress, void-craft, atmocraft
- aerial-frame, hover-frame, lift-frame, strike-skiff
- interceptor, bladewing, spear-frame, razor-craft, arrow-frame
- drift-titan, floating-mech, sky-mech, hover-mass
- hunter-class, predator-class, capital-class, scout-class
- plasma-keel, vector-thruster, gravity-driver, antigrav-spine
- ribbed-hull, fluted-hull, fang-bowed, spike-prow, blade-fin

━━━ AESTHETIC — SLEEK & MEAN ━━━
The same DNA as MechBot's combat robots: built-to-kill, asymmetric, predatory profiles. NOT box-shaped Earth warships. NOT flat-deck carriers. NOT cylindrical hulls.
- Blade silhouettes (knife-thin, sharp prows, swept-back wings/fins)
- Insectoid / arachnid / serpentine flying forms (multi-segment, articulating)
- Fang prows, spike rams, arrow bows
- Visible glowing power conduits running across the hull
- Asymmetric design (irregular outlines, not bilateral-symmetric military-perfect)
- Ornate machinery details (fluted plating, exposed cooling fins, bristling weapon mounts)

━━━ SCALE VARIETY ━━━
- Tiny strike-skiffs (2-pilot blade-craft, 10m)
- Mid-class hunters (frigate-replacement role, 100m, mean)
- Capital sky-fortresses (kilometer-class drift-titans, mountain-sized)
- Mech-class skyships (humanoid-mech that flies)
- Insectoid-swarm mother-ships (sky-organism)
- Serpentine sky-leviathans (long, articulated, undulating in the air)

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "Bladewing strike-skiff with arrow-bow prow, twin plasma-keel thrusters, glowing teal conduits along its asymmetric hull, ten-meter scale"
- "Kilometer-class drift-titan with fluted spire-towers along its dorsal ridge, ribbed hull, predatory fang-prow, spike-mounted plasma cannons"
- "Serpentine sky-leviathan articulated in nine segments, chitinous belly-plating, exposed gravity-driver coils, eyes-of-glass running its length"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: ship class + body silhouette + signature accent (weapon/glow/material).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry 14-22 words.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
