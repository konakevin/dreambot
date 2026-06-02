#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_unusual_cargo.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} UNUSUAL-CARGO seeds for ToyBot's model-train-world path. Each seed describes ONE specific extraordinary thing the train is hauling — a wow-factor cargo that makes the viewer's eye snap to "wait, what?". This pool fires ~35% of renders for surprise without overload, so each entry must EARN attention. NO ordinary freight (no generic coal / lumber / containers — those live in the consist pool).

Each entry: 12-22 words. ONE specific oversized, magical, surreal, or narratively-loaded cargo item. Always implies scale tension — the cargo dwarfs the consist, glows oddly, shouldn't fit on standard rails, or hints at a bigger story.

━━━ CARGO CATEGORIES (rotate aggressively) ━━━

OVERSIZED OBJECTS (scale tension)
- Single gigantic glowing crystal that doesn't fit the flatcar, blue light spilling onto adjacent cars
- One enormous bell — clock-tower scale — chained across two flatcars in tandem, brass gleaming
- A single colossal turbine-blade strapped to a 12-axle heavy-duty depressed-center car
- One immense bronze statue (toppled) roped face-up across three flatcars, scale-perfect facial detail
- A single moon-rock-sized boulder of unknown crystalline structure, weight crushing the flatcar springs

MAGICAL / GLOWING
- Caged dragon strapped to gondola, chain-restraints, glowing eyes peering between iron bars, steam from nostrils
- Glass-walled aquarium-car holding a single luminous bioluminescent jellyfish creature, blue glow through windows
- Open-top tank-car brimming with liquid starlight, surface swirling, photons drifting upward into night sky
- Stack of glowing rune-engraved stone tablets bound with iron, faint magical aura, frost forming on adjacent cars
- Caged phoenix mid-feather-shake on flatcar, embers flying, scorched cargo deck around it

HOLIDAY / WHIMSY
- Giant gift-wrapped Christmas present roped to flatcar, oversized bow overhanging both sides, scale-perfect gift-tag
- Flatcar piled high with hundreds of wrapped presents, candy-cane stripes, glitter trail in air behind train
- Open flatcar of Halloween jack-o'-lanterns each as tall as a model-tree, all glowing orange in unison
- Giant chocolate-bunny statue strapped across two flatcars, foil-wrapped texture visible, ears overhanging
- Wedding-cake-tier cargo: three-tier pink-frosted cake car-tall and car-wide, candle-flames flickering

SCI-FI / ALIEN
- Captured UFO craft strapped down with massive industrial cables on heavy-duty flatcar, scorch-marks on hull
- Glass containment-car holding a slowly-rotating alien artifact, anti-gravity defying the wheels of the car
- Open flatcar with a single dormant kaiju egg, cracks fissuring, faint internal glow, frost steaming off shell
- Tanker-car of mercury-silver liquid metal, surface shifting in non-gravity patterns, hazmat warnings glowing
- Single cryogenic pod (sealed) chained to flatcar, frost crystals forming on the glass, vague figure inside

NATURE / WILDLIFE
- Open flatcar carrying a single full-grown redwood-tree (uprooted), branches overhanging, scale impossibly large
- Glass terrarium-car with a living miniature rainforest inside, parrot in flight visible through pane
- Aquarium-car with a single great white shark suspended, water sloshing, scale-perfect dorsal-fin visible
- Open-cage car with a sleeping polar bear mid-snore, breath-fog rising into cold air
- Flatcar of bee-hives stacked five-high, golden bee-cloud swirling around train as it moves

CARNIVAL / SPECTACLE
- Open flatcar full of waving model carnival-goers in striped tents, cotton-candy-machine smoking
- Ferris-wheel mid-disassembly strapped to flatcar, spokes still half-rotating, gondolas dangling
- Circus animals each in own scale-perfect cage-car: lion, elephant, giraffe poking through roof, tightrope car
- Trapeze-rigging pre-assembled across three flatcars, scale acrobats already swinging mid-transit
- Tarot-reader's caravan-car with crystal-ball window glowing purple, scale-figure fortune-teller waving

GOLD / TREASURE / HEIST
- Open boxcar full of stacked gold bullion, scale-perfect bar dimensions, faint gleam from open door
- Armored car with vault door ajar mid-transit, scale-figure guards spilling out, gold-coin trail behind
- Treasure-chest stack overflowing on flatcar — coins, jewels, crown all visible — pirate-flag flying
- Open flatcar holding a single colossal diamond on velvet display, refracting light into rainbow streaks
- Heavy-duty depressed-center car carrying a single safe — door inscribed with cryptic warnings — chains rattling

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ONE specific cargo item — never vague "treasure" or "magical thing", always describe the THING
- Scale tension or visual specificity — the cargo's oversize-ness or oddness is part of the wow
- Connection to a flat / open / specialized rail car (flatcar / gondola / heavy-duty / cage-car / tank-car)
- ONE clear visual hook that would survive Flux rendering

━━━ BANNED ━━━
- NO generic "freight" / "coal" / "lumber" / "passengers" / "intermodal containers" (those live in the consist pool)
- NO human-carrying passenger cars
- NO real-world brands or trademarks (no "Amazon boxes", "Apple crates", etc.)
- NO violence or gore

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is one unusual cargo description ready to inject into a model-train scene.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
