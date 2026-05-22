#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_tech_artifacts.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} TECH-ARTIFACT entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry describes the SIGNATURE FUNCTIONAL TECH PROP in the scene — the lived-in cyberpunk machinery that's not signage but ACTUAL OBJECTS doing things.

Each entry: 12-22 words. ONE specific tech artifact with sensory detail (LED glow, mechanical wear, cable tangle, hum).

TECH-ARTIFACT TYPES to vary:
- Vending-machine row (glowing fronts, animated product displays, condensation on cold-drink panes)
- Street drone / surveillance bot (hovering, gimbaled camera lens, faint hum)
- Pachinko / arcade machines (rows of glowing arcade cabinets, button-LED, payout sounds)
- Cyber-deck terminal (figure plugged in / sitting at, holographic screens floating)
- Hovering security drone (military-style, armored, weapon-pod underslung)
- Holographic vendor / kiosk (3D-projected shopkeeper avatar at a market stall)
- Mechanical noodle / food bot (automated ramen kiosk, robotic arms portioning)
- Charging station for cyber-limbs (figure plugged in via cable, LED status panel)
- Glowing fiber-optic conduit (cables sprawling along walls, pulsing data-light)
- Manhole vapor + cable-pit (open access panel, steam, exposed glowing wires)
- Cleaning drones (tiny disc-bots scurrying across wet pavement, swirl lights)
- Hovering ad-blimp (tiny in mid-distance, ad-screen on its underbelly)
- Tatami-bar door with cyber-lock (traditional sliding door but with biometric scan)
- Maglev rail / train carriage (sleek, glowing underside, banking through scene)

DO write:
- A row of seven glowing vending machines along the alley wall, animated kanji-product displays, faint condensation on the cold-drink fronts
- A gimbaled surveillance drone hovering at second-story height, single red recording-light blinking, soft mechanical hum
- An automated ramen-bot food kiosk with robotic arms portioning noodles, steam rising, hologram menu above
- A figure jacked into a cyber-deck terminal at street-level, holographic kanji screens floating above the device
- A row of pachinko machines spilling glow onto the wet sidewalk, salaryman silhouettes pressed against them

DO NOT write:
- Signage / billboards (separate axis — signage_density)
- Architectural anchors (separate axis — landmark_anchor)
- Vertical clutter overhead (separate axis — vertical_density)
- Modern tech that ISN'T cyberpunk-coded (a regular smartphone, a normal car)
- Single mention without sensory detail (every entry needs glow / sound / motion / material truth)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
