#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/space_opera_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SPACE OPERA SCENE descriptions for StarBot's space-opera path — epic fleet/battle/ship moments. Kinetic + massive. Star-Wars-style spectacle. No named IP ships.

Each entry: 15-30 words. One specific space-opera setup.

━━━ CATEGORIES ━━━
- Massive capital ship emerging from nebula
- Armada silhouetted against twin suns
- Dogfight in asteroid field with debris
- Boarding action mid-space (ships docked)
- Ship mid-jump (hyperspace tunnel distortion)
- Stranded freighter on asteroid
- Siege of orbital station
- Atmospheric entry mid-flight (friction glow)
- Dreadnought flank-on shot (incomprehensible scale)
- Starfighter wave launch (carriers opening doors)
- Kinetic-bombardment from orbit
- Rescue mission crossing wreckage field
- Generation-ship reaching destination (first contact moment)
- Pirate-ambush ion-storm dive
- First-contact-ship opening hangar
- Exploratory probe arriving at planet
- Seven-ship formation through nebula
- Fleet-admiral flagship in command of battle
- Space-port arrival with multiple ships
- Orbital dry-dock massive vessel under construction
- Space-whale-sized organic ship drifting
- Salvage operation on ancient wreck
- Convoy emerging from wormhole
- Battle-damaged ship limping toward starport
- Carrier-launched bomber wave
- Ion-cannon fire tracer-lines
- Escape-pod escape from exploding ship
- Kinetic-lance asteroid-redirect weapon firing
- Giant mining-vessel processing asteroid
- Wreckage-graveyard battlefield aftermath

━━━ RULES ━━━
- Epic + kinetic + massive
- No named IP ships (no Enterprise, no Millennium Falcon, etc.)
- Production-art quality composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
