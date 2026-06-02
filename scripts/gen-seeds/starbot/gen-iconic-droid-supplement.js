#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// SUPPLEMENT 2026-05-03 — APPENDS to existing robot_types.json.
// CLUSTER B (exposed-endoskeleton war-frames) was REMOVED 2026-05-03 —
// Kevin: skeletal/endoskeleton renders looked horror-skeletal not
// hero-mecha. Only Cluster A (iconic-functional droid silhouettes) ships.
//
// Cluster A: classic-cinema functional droid silhouettes — described
// GENERICALLY (no franchise names; aim for the LOOK of tarnished-brass
// protocol-style humanoids, short rolling utility droids with dome heads,
// tall multi-armed assassin droids, hovering probe-spheres with tentacle
// arms, etc.). Body type / armor density / chassis material varies BY
// AESTHETIC TARGET — protocol humanoids are stiff-jointed brass-plated,
// utility droids are weathered-shelled, assassin droids are heavy chrome,
// probe-spheres are smooth polymer. Each entry's body language comes from
// its specific aesthetic target — NO blanket "fully armored" enforcement.

generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 65, // existing 50 + 15 new
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} robot entries to ADD to an existing pool. Each entry is a DENSE phrase (40-60 words) describing a SPECIFIC mecha-grade FULLY-ARMORED autonomous machine.

These ${n} entries fill the CLASSIC CINEMATIC FUNCTIONAL DROID SILHOUETTE cluster. Body type and armor density vary by aesthetic target — some are heavily armored, some stiff-jointed protocol bipeds, some weathered-shell utility droids, some hovering probe-spheres. The ONE forbidden body type: skeletal / endoskeleton / "robot underneath the skin" exposed-bone frames — those look horror-skeletal not hero-mecha.

━━━ AESTHETIC TARGETS — describe GENERICALLY (no franchise names) ━━━

A1. **Tarnished-brass protocol humanoid** — humanoid bipedal droid with stiff articulated limbs, full-body weathered gold or brass plating with verdigris and battle scars, expression-mimicking face plates (forehead / mouth-piece / lit optical sensors that pulse like a hesitating gaze), delicate three-fingered manipulator hands, slightly hunched diplomatic posture. Worn from decades of service across hostile worlds. Carries data-sticks or message-cylinders.

A2. **Short cylindrical rolling utility droid** — knee-high or waist-high, cylindrical or domed body in weathered white with blue or red accent stripes, rotating dome-head with single optical lens swiveling, radial panel hatches concealing tool-arms (manipulator claws, welding tip, holographic projector), three-wheel or tracked base, scuffed paint revealing bare titanium beneath. Beeping data-glyphs scrolling across its chest panel.

A3. **Heavy military combat humanoid** — tall bipedal armored frame with weathered tan or sand-colored armor plating, single-piece elongated head with horizontal optical slit, heavy blaster rifle held across chest, slightly slumped at-rest posture as if waiting for activation command. Mass-production stamping marks on shoulder.

A4. **Tall multi-armed assassin droid** — 7-8 foot bipedal figure with cylindrical head and single horizontal sensor band glowing red, four mechanical arms each holding different weapon (rifle / blade / grenade-launcher / vibrosword), chrome-and-bronze plating across torso and limbs with kill-tally etched along forearms, leather harness draped across torso carrying ammunition. Grim hunter posture.

A5. **Probe-style hovering sphere with tentacle-arms** — spherical hovering droid one meter diameter, single large optical lens dominating face, six retractable mechanical tentacle-arms hanging beneath equipped with sensor probes and shock-prods, repulsor field shimmering, surveillance pulse cycling, dorsal antenna array transmitting back to distant ship.

A6. **Heavy bipedal war-mech** — 8-foot war-mech with chrome-and-pewter chassis, twin-mounted shoulder weapons, visor-faceplate with glowing horizontal optical band, massive arms ending in weapon-integrated manipulators. Walking through smoke or rubble.

A7. **Asymmetric hunter-droid** — bipedal hunter with one massive cannon-arm and one delicate sensor-arm, chrome plating over torso with battle scars and kill-tally engraving, visor-faceplate with red tracking sensor, predatory mid-stride posture.

━━━ THE FIVE MUST-HAVES (apply to every entry) ━━━

1. WEATHERED finish — chromed/brass/painted surfaces show wear: scratch marks, oil streaks, battle scars, hydraulic fluid stains, plasma-burn pits
2. MISSION-READABLE body — battle-hunter / sentinel / messenger / assassin / surveillance — see existing pool's mission categories
3. THREE-PLUS function-driven features — weapon load-outs / sensor arrays / communication arrays / specialized arms
4. GLOWING accent vents — plasma-cyan, void-purple, fel-violet, amber-gold, ozone-green
5. SCARS / engraving — kill-tally, battle damage, mass-production markings, expedition-guild symbols
6. NO skeletal / endoskeleton / exposed-bone bodies — that single body type is forbidden. All other body types (heavily armored, sleek-shelled, brass-plated, hovering, rolling, etc.) are welcome — let the aesthetic target define the body, don't enforce a single style

━━━ HARD RULES ━━━

- 40-60 words per entry, dense and paintable
- ZERO franchise names — describe VISUAL features only (no "Star Wars" / "Terminator" / "T-800" / "C-3PO" / "R2-D2" / "Battle Droid" / "Skynet")
- ZERO "X-shaped" or "X-bodied" where X is a literal animal
- ZERO mundane utility purposes (chef / cleaner / postal / etc.)
- EVERY entry must read as MISSION-DRIVEN — what is this thing FOR?
- Match the 14 anchor examples in the existing pool's gen script for density and DNA

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Vary across the seven aesthetic targets above.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
