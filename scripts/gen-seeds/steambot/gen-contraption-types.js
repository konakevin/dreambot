#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/contraption_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK CONTRAPTION descriptions for SteamBot's contraption path — fantastical steampunk devices. WIDE RANGE — NOT clock-dominant. Vary widely.

Each entry: 15-30 words. One specific steampunk contraption with rich detail.

━━━ CATEGORIES (mix these widely — not clock-heavy!) ━━━

**Musical instruments:**
- Brass self-playing organ with gear-mechanism
- Clockwork gramophone with swirling brass horn
- Mechanical music-box with rotating figures
- Steam-powered piano with visible pistons

**Automatons:**
- Mechanical butler with brass face
- Clockwork bird in gilded cage
- Automaton dancer mid-waltz
- Brass spider-crawler
- Clockwork cat with blinking eyes
- Mechanical messenger-pigeon
- Automaton-chess-player at board

**Alchemical:**
- Bubbling retort with copper tubing
- Crystalline alchemy-still with steam
- Brass alchemy-table with glowing flasks
- Distillation-tower with multiple condensers

**Vehicles in miniature:**
- Tiny brass submarine model on mahogany
- Airship prototype on workbench
- Clockwork locomotive desktop-model
- Miniature hot-air-balloon with brass basket

**Living-hybrid:**
- Octopus-automaton with tentacle-arms
- Cat with brass prosthetic eye and gear-collar
- Mechanical-butterfly with gauze-wings
- Parrot with clockwork beak
- Horse with steam-powered leg

**Communication:**
- Telegraph with gramophone-horn attached
- Brass speaking-tube network
- Punch-card brass typewriter
- Mechanical-carrier-pigeon at station

**Weapons-tools:**
- Steam-rifle with brass bore
- Chronocompass with concentric dials
- Tesla-coil brass pistol
- Multi-barreled revolver with clockwork cylinder

**Domestic-impossible:**
- Self-pouring tea service on silver tray
- Mechanical cat-sitter automaton
- Gear-driven kitchen with self-stirring pots
- Brass laundry-machine with mechanical arms
- Clockwork-dining-table with revolving platters
- Mechanical rocking-chair with built-in book-reader

**Aeronautical:**
- Personal flying-pack with brass propellers
- Steam-umbrella parachute
- Airship-miniature with working rotor

━━━ RULES ━━━
- VARY WIDELY — absolutely NOT clock-dominant
- Include category from varied list
- Rich detail on gears / pipes / brass-elements
- Victorian-industrial aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
