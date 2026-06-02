#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_cars.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} INDIVIDUAL Hot-Wheels-style 1:64-scale die-cast toy car archetypes for ToyBot's hotwheels-city path. Each entry = ONE specific car with paint + body-type + signature visual detail. 8-18 words per entry.

━━━ HARD ANTI-BIAS RULES ━━━
- MAX 12% muscle-cars across pool (don't dominate).
- MAX 12% hot-rods.
- MAX 8% monster-trucks.
- HEAVY variety across body types: muscle car, hot rod, monster truck, drag funny-car, dragster, low-rider, off-road buggy, sports coupe, semi-truck, pickup, ice-cream van, fire engine, police cruiser, ambulance, school bus, taxi cab, formula racer, rally car, stunt-cycle, classic chopper motorcycle, panel-van, dune-buggy, jeep, hearse, RV camper, tow-truck, garbage-truck, bulldozer, snowplow, helicopter, hovercraft, jet-car, vintage-roadster, art-deco-coupe, woody-wagon, kombi-bus, surf-wagon, BMW-style sedan, F-1-style racer, NASCAR-style stock-car, mid-engine supercar, electric prototype, post-apocalypse rat-rod.
- Vary paint themes: chrome, candy-apple, neon-flame, neon-green, pearl-white, midnight-purple, racing-stripes, tribal-flame-decals, rust-patina, glitter-finish, copper-metallic, gunmetal, two-tone, lava-pattern, lightning-bolt, holographic, reflective-mirror, matte-black, military-camo, hot-pink, candy-corn, candy-blue, gold-chrome.
- Vary signature details: oversized rear-wheels, scoop-air-intake, exhaust-pipes, roll-cage, parachute, bull-bar, dual-spotlights, side-exhaust, lift-kit, mud-flaps, decals, racing-numbers, hood-scoop, side-pipes, rear-spoiler, low-profile-tires, white-wall-tires, neon-rims, chrome-grille, animal-mascot-hood-ornament.

━━━ FORMAT ━━━
Each entry is ONE die-cast car, 8-18 words, comma-separated phrases. Always reference 1:64-scale or die-cast or chrome:
- "1:64 candy-apple muscle car with chrome side-pipes, oversized rear-wheels, racing-stripe decals"
- "die-cast monster truck with neon-green tires, lifted suspension, splatter-paint, oversized roll-cage"
- "chrome ice-cream van with pink-pastel stripes, rooftop-bell, oversized rear-window"
- "1:64 rally car with mud-flaps, racing-number-13, dirt-spattered windshield, chrome bull-bar"

━━━ BANNED ━━━
- IP-named brands or specific Hot-Wheels models (use archetype only)
- 1:18-scale collector die-cast (always TOY 1:64)
- Real cars, real driving photography
- Identical entries (vary heavily)

━━━ DEDUP RULE ━━━
- No two entries share BODY-TYPE + PAINT-THEME (e.g., only one "candy-apple muscle car").
- Vary across the 200 entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
