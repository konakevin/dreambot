#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/pirate_scenes.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CINEMATIC PIRATE scenes for OceanBot's pirates path. Pirates of the Caribbean energy — Black Pearl / Flying Dutchman / Tortuga / Port Royal — but blown out to be really visually cool. Each entry is one specific dramatic moment.

Each entry: 18-28 words. ONE specific cinematic scene.

━━━ SCENE TYPES (mix broadly across all entries) ━━━
1. **PIRATE SHIP AT SEA** — galleon / brig / sloop under full sail at sunset, golden-hour cinematic, bowsprit cutting through swell, Jolly Roger flying
2. **BOARDING ACTION** — two wooden ships locked side-to-side, ropes swinging across, smoke from cannon-flash, pirates mid-leap with cutlasses drawn
3. **HARBOR TOWN AT NIGHT** — Tortuga / Port Royal / Nassau-style island harbor, lanterns lit on cobbled streets, ships at anchor, taverns spilling warm light, drunken pirates silhouetted on docks
4. **HIDDEN COVE** — secret beach inlet with bonfires, captured galleon anchored offshore, treasure chests open on the sand, palm silhouettes, smoke rising
5. **CAPTAIN AT THE HELM** — pirate captain at the wheel during storm, lightning splitting sky, rain-soaked greatcoat, tricorn hat, cinematic backlight
6. **NAVAL BATTLE** — pirate frigate vs Royal Navy ship-of-the-line, cannon broadsides, splintering hulls, smoke columns, full-sail chase
7. **TREASURE BEACH** — crew unloading captured cargo onto tropical sand, longboats drawn up, treasure chests being carried up to bonfire camp
8. **TAVERN DOORWAY** — island tavern entrance spilling lantern light onto rain-slick cobblestones, silhouettes of carousing pirates within, pirate flag overhead
9. **MANGROVE ANCHORAGE** — pirate ship hidden in mangrove maze, careened on its side at low tide, crew scraping the hull, parrots in the trees
10. **ROOF-TOP CHASE** — pirate fleeing across colonial Spanish-tile rooftops, port harbor stretching below, ships in the bay
11. **CANNON DECK** — gunner crew loading 18-pounders below decks, lantern light, smoke-stained timbers, brass fittings glinting

━━━ ABSOLUTELY BANNED ━━━
- NO sea monsters / krakens / serpents / leviathans (kraken-leviathan path)
- NO mermaids (mermaid-legend path)
- NO sunken ruins or Atlantis (lost-cities path)
- NO ghost ships / haunted vessels (ghost-ship path)
- NO modern vessels / scuba / submarines / motor ships
- NO tropical wildlife as subject (sea-turtles, dolphins, etc) — pirates and their world are the subject

━━━ ERA & VISUAL ANCHORS ━━━
- 17th-18th century Golden Age of Piracy (1650-1730)
- Wooden hulls, sails, rigging, lanterns, brass fittings, harpoons, cannons, cutlasses, flintlocks
- Tricorn hats, greatcoats, headscarves, leather boots, sashes, eyepatches, parrots
- Caribbean / Atlantic / Mediterranean / Indian Ocean settings
- Real ports: Tortuga, Port Royal, Nassau, Madagascar, Maracaibo, Havana
- Real ship types: galleon, frigate, sloop, brig, schooner, longboat, junk

━━━ COMPOSITION & MOOD ━━━
- "Blown out" = epic / cinematic / wallpaper-worthy / Pirates-of-the-Caribbean-poster
- The SETTING does as much visual work as the pirates — golden-hour seas, storm-lit decks, lantern-lit harbors, tropical-sunset coves
- Pirates are visible subjects but never dominate at the cost of environment
- Specific dramatic moments, not "a pirate ship sails" — show CONFLICT, ATMOSPHERE, BEAUTY

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Pirate galleon at sunset, full sail catching tropical golden-hour wind, Jolly Roger flying from main, silhouette cutting across orange sea"
- "Tortuga harbor at midnight, lanterns lit on every wooden balcony, three pirate ships at anchor, drunken silhouettes on the dock spilling rum onto the cobbles"
- "Pirate captain at the helm during squall, lightning splitting sky behind, rain sluicing off his tricorn hat, white-knuckled grip on the wheel"
- "Boarding action mid-strike, two galleons locked, ropes crossing, cannon-smoke billowing, pirate leaping the gap with cutlass and pistol drawn"
- "Hidden cove at dusk, bonfire on the sand, four longboats drawn up, treasure chests open, the captured galleon anchored offshore"

━━━ RULES ━━━
- 18-28 words, ONE concrete cinematic scene per entry
- Mix scene types broadly across all entries
- Specific era / specific port / specific ship type — not generic
- Vivid lighting / atmosphere — golden-hour, storm, lantern-amber, moonlit, cannon-flash
- "Blown out" cinematic register

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
