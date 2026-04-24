#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK LANDSCAPE descriptions for SteamBot's steampunk-landscape path — vast steampunk cityscapes / environments at massive scale. No characters. BioShock-Infinite / Mortal-Engines energy.

Each entry: 15-30 words. One specific steampunk vista.

━━━ CATEGORIES ━━━
- Brass-spire cities (Victorian cityscape with brass-topped towers)
- Airship-dock skies (sky harbors with multiple airships)
- Clockwork-bridge mega-structures (giant gear-bridges across chasms)
- Victorian-industrial sprawl (smoke-stacks, factories, iron-rail)
- Floating-city on brass-columns above clouds
- Moving-city Mortal-Engines-style (mobile city on massive treads)
- Clockwork-canal Venice (Victorian Venice with mechanical gondolas)
- Brass-mountain (mountain transformed into mechanical fortress)
- Gear-tower cities (cities made entirely of interlocking gears)
- Underground steampunk city (cavern-city with brass-gleam and steam)
- Aerial-railways (trains running on suspended brass tracks)
- Lighthouse-on-mechanical-island
- Floating observatory platforms
- Steampunk-Paris (Eiffel-tower with gears exposed)
- Steampunk-London (Big-Ben with clock mechanisms visible)
- Coastal steam-port with giant cranes and airships
- Victorian-factory interior with molten-brass
- Railway-station vast with brass-clock and steam
- Steampunk-palace with gearwork throne-room
- Airship-shipyard with skeletal frames being built
- Smokestack-forest (forest of industrial chimneys)
- Mechanical-forest (forest where trees are gears/pipes)
- Clockwork-canyon (gorge filled with gearwork)
- Brass-spired desert temple
- Steampunk-Arctic observatory
- Victorian-industrial-Hong-Kong (East-meets-steampunk)
- Airship-wrecked ruins
- Brass-waterfall (gears and pipes with steam-cascade)
- Steampunk-castle on floating island
- Mechanical-labyrinth city
- Clockwork-zeppelin-graveyard
- Brass-underworld of pipes beneath city
- Gaslit Victorian slum-alleys
- Towering steam-cathedral
- Clockwork-garden (mechanical-plants greenhouse)

━━━ RULES ━━━
- Vast scale steampunk environments
- No characters (landscape is hero)
- Brass / copper / gears / steam / Victorian-industrial dominant
- BioShock-Infinite / Mortal-Engines quality

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
