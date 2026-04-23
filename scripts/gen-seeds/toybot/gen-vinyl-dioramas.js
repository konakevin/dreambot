#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/vinyl_dioramas.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} VINYL DIORAMA descriptions for ToyBot's vinyl path — Funko-Pop-style vinyl figure dioramas. Oversized-head vinyl figures in themed dioramas. Kidrobot / designer-toy energy.

Each entry: 15-30 words. One specific vinyl figure diorama.

━━━ CATEGORIES ━━━
- Samurai vinyl figure on bonsai platform
- Astronaut vinyl on moon diorama
- Knight vinyl at castle gate diorama
- Noir detective vinyl at rainy-street diorama
- Wizard vinyl at tower-library diorama
- Pirate vinyl on ship-deck diorama
- Ninja vinyl on rooftop
- Cowboy vinyl at saloon door
- Robot vinyl on factory floor
- Superhero vinyl on city-rooftop
- Alien-invader vinyl on spaceship deck
- Mermaid vinyl on coral reef
- Vampire vinyl in candlelit crypt
- Frankenstein vinyl in lightning-lab
- Witch vinyl at cauldron
- Gargoyle vinyl on cathedral peak
- Mad-scientist vinyl at bubbling-beaker bench
- Mermaid vinyl at treasure chest
- Cat-vinyl on cozy windowsill
- Fox-vinyl in autumn forest
- Unicorn-vinyl on rainbow-hill
- Kaiju-vinyl mid-city-destruction
- Biker-vinyl on chrome-motorcycle
- Surf-vinyl on wave
- Boxer-vinyl at ring
- Punk-rocker-vinyl on stage
- DJ-vinyl at turntable
- Chef-vinyl at steaming-kitchen
- Florist-vinyl with bouquets
- Fisherman-vinyl at ice-hole
- Skateboarder-vinyl mid-trick
- Snowboarder-vinyl mid-air
- Yogi-vinyl on mountaintop
- Scientist-vinyl at particle-collider
- Archaeologist-vinyl at dig-site
- Taxi-driver-vinyl at yellow-cab
- Bus-driver-vinyl at wheel
- Doctor-vinyl at operating-room
- Nurse-vinyl with tiny patient
- Judge-vinyl behind bench
- Pilot-vinyl in cockpit

━━━ RULES ━━━
- Oversized head, small body (Funko-Pop proportions)
- Glossy vinyl sheen
- Themed diorama setting
- One figure per entry (solo hero)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
