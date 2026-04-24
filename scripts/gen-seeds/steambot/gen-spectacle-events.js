#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/spectacle_events.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK SPECTACLE EVENT descriptions for SteamBot's steampunk-spectacle path — grand events, ceremonies, performances, and crowd moments in steampunk worlds.

Each entry: 15-30 words. One specific event/ceremony/gathering.

━━━ EVENT CATEGORIES (mix evenly) ━━━
- Engine-launch ceremonies — massive new machine unveiled to cheering crowd, steam billowing as lever is pulled
- Airship maiden voyages — christening bottle smashed on brass hull, ropes cast off, crowd waving from dock
- Mechanical opera/theater — clockwork stage sets transforming mid-performance, automaton orchestra, gaslit theater
- Clockwork festivals/parades — brass floats rolling through streets, mechanical dragons, confetti cannons, firework gears
- Secret invention auctions — underground vaults, masked bidders, dangerous devices under glass, tension
- Revolution uprisings — barricades in cobblestone streets, factory workers with improvised steam weapons, smoke and fire
- Grand masked galas — aristocratic ballrooms with mechanical chandeliers, gear-patterned masks, waltzing automatons
- Military reviews — war-machine parades, ranks of brass soldiers, imperial balconies, steam-cannon salutes
- Factory openings — industrial ribbon-cutting, first furnace ignition, worker crowds, smoke stacks coming alive
- Racing events — steam-car races, airship derbies, clockwork horse races, betting crowds

━━━ DEDUP ━━━
Each entry must be a DIFFERENT event type in a DIFFERENT setting. No two parades, no two auctions, etc.

━━━ RULES ━━━
- CROWD ENERGY — these are moments with people, spectators, drama
- Specific frozen moment, not generic "a festival"
- Victorian-steampunk aesthetic throughout
- Drama and spectacle are the point

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
