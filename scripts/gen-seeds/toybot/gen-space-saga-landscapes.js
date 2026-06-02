#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/space_saga_landscapes.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} authentic STAR WARS vintage Kenner playset-diorama wide-vista descriptions for ToyBot's space-saga-figures path. Lean fully into Star Wars IP — name planets, name iconic locations, name vehicles. Wide environment shots — playset architecture is the protagonist, figures small or absent. 18-28 words per entry.

━━━ STAR WARS PLANETS / LOCATIONS (each gets multiple entries) ━━━
Tatooine — Mos Eisley spaceport, Jabba's palace exterior + interior throne-room + sail-barge-deck, Sarlacc pit, Lars homestead, Tusken Raider camp, Cantina interior, Sand Crawler interior, dune-sea horizon
Hoth — Echo Base hangar interior, ice-trench corridor, Wampa cave, snow-walker assault landscape, snowspeeder hangar
Endor — forest moon canopy, ewok village treetop network, shield bunker exterior, speeder-bike forest path
Dagobah — swamp with X-wing crashed, Yoda's hut interior, dark-side cave entrance
Bespin — Cloud City corridors / dining-room / carbonite chamber / processing-vane / Lando's throne-room
Death Star — trench corridor, Throne Room, detention block, reactor core, hangar bay, conference room
Naboo — Theed Palace plaza, royal hangar, plasma generator complex, swamp Gungan-village
Coruscant — Jedi Temple atrium, Senate chamber, opera-house, lower-level cantina
Mustafar — lava mining platform, lava river, Vader's castle silhouette
Geonosis — arena Petranaki, droid factory conveyor
Kamino — cloning facility cylinder-vats, rain-swept landing platform
Yavin 4 — Massassi temple briefing room, hangar bay with X-wings parked

━━━ STAR WARS SHIPS as scenery elements ━━━
- Millennium Falcon docked in hangar (mid-hangar, ramp lowered)
- Star Destroyer over planet (looming) / parked in space-dock
- Imperial Shuttle on landing pad (ramp lowered, fog)
- Sail Barge above Sarlacc pit (Skiff floating nearby)
- AT-AT walker silhouette against Hoth horizon
- Slave I docked in Cloud City landing-platform

━━━ LANDSCAPE CATEGORIES (rotate, vary) ━━━
- Wide Tatooine cantina interior, sandstone-arch entrance, Cantina Band on stage, jukebox alcove, multiple booth-tables, Wuher behind bar
- Wide Hoth Echo Base hangar with X-wings parked, snow-vapor visible, blast-door corridor receding, rebel-fighters in launch cradles
- Wide Endor ewok village treetop network, multi-tier wooden treehouses, rope-bridges between trunks, jungle-canopy backdrop
- Wide Death Star Throne Room, vaulted-ceiling, glowing-floor-panels, throne-dais at center, vanishing-point window
- Wide Death Star trench corridor, vertical metal walls receding, blast-doors, walkway-platforms, exhaust-port at end
- Wide Tatooine Mos Eisley spaceport, sandcrawler in distance, twin-suns horizon, dust-haze, Falcon docked
- Wide Dagobah swamp with X-wing crashed, gnarled-tree roots, fog-mist, swamp-water reflections, Yoda's hut visible
- Wide Bespin Cloud City corridor, blue-sky-windows, white-art-deco walls receding, carbonite-freezing chamber
- Wide Yavin 4 Massassi temple briefing room, U-shaped seating, holo-projector center, mission-briefing display
- Wide Hoth ice-trench corridor, blue-cyan ice-walls, fog-vapor, blast-doors lit at end, ground crew ambient
- Wide Tatooine Jabba's palace throne room, Jabba on dais, dancing-platform, Bib Fortuna, Salacious B. Crumb
- Wide Mustafar lava mining platform, conveyor-belts over lava-river, mine-towers, Vader's castle silhouette horizon
- Wide Geonosis arena Petranaki, tiered stone-seating with audience, monster-pillars, sand-floor
- Wide Kamino cloning facility, rain-swept landing platform, cylinder-vats with cloned-troopers
- Wide Coruscant Jedi Temple atrium, marble-pillars, holo-displays, Jedi Council chamber doorway
- Wide Naboo Theed Palace plaza, classical-stone columns, blue-domed-buildings, waterfall cascade
- Wide Endor shield bunker exterior, jungle-canopy, blast-door entrance, ewok-village above, Imperial-troops dispersed
- Wide AT-AT walker silhouette against Hoth tundra horizon, multi-leg armored vehicle, blue-snow whiteout
- Wide Sail Barge floating over Sarlacc pit, Skiff-vehicles nearby, dune-sea horizon, Tatooine twin-suns
- Wide Imperial Star Destroyer interior bridge, viewport showing space, command-pit officer-stations
- Wide Tantive IV corridor, white-art-deco walls, blast-door receding, fluorescent strip-lighting
- Wide Falcon hangar in Mos Eisley docking-bay 94, ramp lowered, Han at controls visible
- Wide Death Star reactor core chamber, vertical reactor-pillar at center, walkway-bridge spanning, glowing-energy
- Wide Cloud City carbonite-freezing chamber, hexagonal pit, steam-vents, Vader and Boba Fett observing
- Wide Endor speeder-bike chase forest path, redwood-canopy filtering light, dappled-floor, fog
- Wide Naboo plasma generator complex, glowing reactor-cores, blue-energy field, droideka-rolling-balls
- Wide Geonosis droid factory conveyor, robotic-arms assembling B1 droids, sparks-shower, factory-belts
- Wide Yavin 4 hangar with X-wings parked in launch-cradles, briefing-room above, rebel-pilots ambient
- Wide Hoth Wampa cave interior, ice-stalactites, Luke's hanging-from-ceiling silhouette
- Wide Lars homestead with Sandcrawler in distance, twin-suns sunset, salt-flat desert
- Wide Cloud City Lando's throne-room, art-deco arches, blue-sky-window, Lando's blue-cape on chair-back
- Wide Tatooine canyon Krayt-Dragon-skeleton in distance, sand-dunes receding, jawa-sandcrawler tracks

━━━ FORMAT ━━━
Each entry: 18-28 words, comma-separated phrases. Wide-vista, playset-as-protagonist, naming the iconic location:
- "Wide Tatooine cantina interior, sandstone-arch entrance, Cantina Band on stage, jukebox alcove, multiple booth-tables, Wuher behind bar"
- "Wide Death Star trench corridor, vertical metal walls receding, blast-doors, walkway-platforms, exhaust-port at end"
- "Wide Endor ewok village treetop network, multi-tier wooden treehouses, rope-bridges between trunks, jungle-canopy"

━━━ BANNED ━━━
- Disney-era sequel-trilogy locations (Crait / Ahch-To / Jakku — vintage Kenner only)
- Close-up character shots (this is the LANDSCAPE pool — env focus)
- CGI / illustration

━━━ DEDUP RULE ━━━
- No two entries share LOCATION + INTERIOR-DETAIL exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
