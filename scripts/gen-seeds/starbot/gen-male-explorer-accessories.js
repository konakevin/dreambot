#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/male_explorer_accessories.json',
  total: 100,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACCESSORY entries for StarBot's male-explorer path. Each entry is a SHORT phrase (8-16 words) describing ONE signature object he's wearing or carrying — the small detail that anchors his sci-fi explorer identity.

━━━ ACCESSORY SPREAD (enforce variety across ${n}) ━━━
- WEAPONS / TOOLS (5-6) — plasma-pistol holstered at his hip, heavy energy-rifle slung across his back, mono-edge combat knife at his belt, multi-tool with extending probe-arms, pulse-blade at his thigh, gravity-mace clipped to his back
- COMMUNICATION / NAVIGATION (4-5) — comm-headset wrapped around one ear, holo-projector wristband, multi-axis nav-compass at his belt, flight-recorder on his chest, transceiver-implant glowing soft blue at his temple
- AUGMENTATION / IMPLANT (4-5) — chrome neural-port at the base of his skull, ocular-implant glowing soft amber where his eye used to be, dermal-shield plates visible at his jaw, breath-regulator at his throat, full chrome arm-replacement
- CULTURAL / IDENTITY (4-5) — home-world signet ring, family-name tattoo at his collarbone, expedition-medal pinned to his chest, alien-language phrase tattooed at his neck, planetary-coin pendant
- EVA / EXPEDITION GEAR (4-5) — EVA helmet tucked under his arm, atmospheric goggles with multiple filter-lenses, scientific sample-cylinders, expedition-jacket with multi-mission-patches, oxygen-rebreather at his throat
- MOUNT / SHIP (3-4) — pilot's gauntlet for ship neural-link, ship-key-card on a lanyard, cockpit-control transmitter at his wrist, dropship-deployment trigger

━━━ RULES ━━━
- Each entry is ONE signature object — not a pile of stuff
- Sci-fi materials only: chrome / synth-leather / plasma / glowing-circuit / bio-monitor / dermal-plate
- Anchors his identity — the accessory tells you WHO he is
- One entry MUST involve a cybernetic implant (signature StarBot detail)
- No modern items
- Specific to MALE explorers

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
