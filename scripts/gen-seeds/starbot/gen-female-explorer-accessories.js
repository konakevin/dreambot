#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/female_explorer_accessories.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACCESSORY entries for StarBot's female-explorer path. Each entry is a SHORT phrase (8-16 words) describing ONE signature object she's wearing or carrying — the small detail that anchors her sci-fi explorer identity.

━━━ ACCESSORY SPREAD (enforce variety across ${n}) ━━━
- WEAPONS / TOOLS (4-5) — plasma-pistol holstered at her hip, energy-blade strapped to her thigh, multi-tool with extending probe-arms at her belt, pulse-rifle slung across her back, hand-crossbow with energy-bolts at her hip
- COMMUNICATION / NAVIGATION (4-5) — comm-headset wrapped around one ear with a glowing tip, holo-projector wristband at her wrist, multi-axis nav-compass on a chain around her neck, flight-recorder pinned to her chest, ear-implant transceiver glowing soft blue
- AUGMENTATION / IMPLANT (4-5) — chrome neural-port visible at the base of her skull, ocular-implant in one eye glowing soft amber, dermal-shield plates visible at her forearm, breath-regulator at her throat, glowing bio-monitor at her wrist
- CULTURAL / IDENTITY (4-5) — home-world coin pendant on a chrome chain, family-portrait holocube clipped to her belt, alien-language phrase tattooed at her collarbone, planetary-system signet ring, soul-bonded comm-link in her ear from her co-pilot
- EVA / EXPEDITION GEAR (4-5) — EVA helmet pushed up on her brow, atmospheric goggles with multiple filter-lenses, scientific sample-cylinders rack at her hip, expedition-jacket with multi-mission-patches, oxygen-rebreather at her throat
- MOUNT / SHIP (3-4) — pilot's gauntlet for her ship's neural-link, ship-key-card on a lanyard, cockpit-control transmitter at her wrist, dropship-deployment trigger on her belt

━━━ RULES ━━━
- Each entry is ONE signature object — not a pile of stuff
- Sci-fi materials only: chrome / synth-leather / plasma / glowing-circuit / bio-monitor / dermal-plate
- Anchors her identity — the accessory tells you WHO she is
- One entry MUST involve a cybernetic implant (signature StarBot detail)
- No modern items (no smartphones)
- Specific to FEMALE explorers

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
