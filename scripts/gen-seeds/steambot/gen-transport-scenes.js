#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/transport_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAM TRANSPORT scene descriptions for SteamBot's steam-transport path — non-airship steampunk vehicles in dramatic terrain and moments.

Each entry: 15-30 words. One specific vehicle + terrain/moment.

━━━ VEHICLE TYPES (mix evenly) ━━━
- Steam trains — massive locomotives crossing impossible bridges, threading mountain passes, blasting through tunnels, racing across tundra
- Steam submarines — brass submersibles surfacing in underground lakes, exploring deep trenches, docking at underwater ports
- Walking machines — mechanical caravans on spider-legs crossing deserts, walking cities traversing plains, striding cargo-haulers
- Clockwork stagecoaches — ornate steam-powered coaches racing through countryside, city streets, mountain roads
- Giant elevators — massive gear-driven lift platforms between city districts, mine shafts, cliff faces
- Steam ships — ironclad warships, paddle-wheel river boats, icebreakers crashing through floes
- Mechanical beasts of burden — brass elephants hauling cargo, clockwork horses pulling artillery, steam-powered oxen

━━━ TERRAIN/MOMENTS (vary across entries) ━━━
Canyon crossings, mountain switchbacks, underground caverns, frozen tundra, jungle rivers, desert dunes, volcanic regions, stormy seas, fog-bound harbors, night journeys with headlamps cutting darkness

━━━ DEDUP ━━━
Each entry must be a DIFFERENT vehicle type + terrain combo. No two trains on bridges, no two submarines surfacing.

━━━ RULES ━━━
- Vehicle is FOCAL — dramatic angle, sense of scale and power
- Terrain creates the drama — impossible geography, weather, danger
- Victorian-steampunk aesthetic — brass, copper, rivets, steam
- NOT airships (covered by airship-skies path)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
