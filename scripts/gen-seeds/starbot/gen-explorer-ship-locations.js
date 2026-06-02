#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_ship_locations.json',
  total: 25,
  batch: 10,
  metaPrompt: (
    n
  ) => `You are writing ${n} SPACESHIP / SPACE-STATION INTERIOR location entries for StarBot's female-explorer and male-explorer paths. Each entry is a DENSE phrase (20-35 words) describing a SPECIFIC ship-or-station interior where the explorer is CANDID.

These are PLACES, not actions. The character will be IN this place, doing something peaceful. The location is the BACKDROP that places the explorer aboard a deep-space starship or station.

CRITICAL: Sleek modern sci-fi interiors. Think Mass Effect Normandy / Star Trek Enterprise corridors / Blade Runner 2049 / Dune fleet / Star Wars Rebel-Imperial / Foundation series / Star Citizen / Apple-design-coded sci-fi / The Expanse Roci / Battlestar Galactica modern / Star Trek First Contact bridges. Functional, beautiful, cinematic.

━━━ LOCATION SPREAD (enforce variety across ${n}) ━━━

COCKPIT / BRIDGE (4-5):
- starship cockpit with curved holographic displays surrounding the pilot's seat, soft cyan readout-light, viewport showing slow-passing nebula
- main bridge of a frigate, multiple crew stations with glowing console screens, captain's chair empty in the center, viewport with a planet rising
- single-pilot fighter cockpit, sleek leather-and-chrome seat, instrumentation cluster glowing soft amber, hyperspace lines streaming past the canopy
- observation bridge of a deep-space cruiser, panoramic floor-to-ceiling viewport showing stars, soft chrome console rim, dim ambient lighting
- corvette cockpit at dusk-cycle lighting, twin pilot stations facing forward, holo-projection of nav-route hovering between them

CORRIDOR / TRANSIT (4-5):
- long sleek starship corridor with glowing floor-strips, crew quarters doors lining one side, viewport-windows showing stars passing on the other
- station transit-tube with curved glass ceiling, view of the rotating station-wheel above and the planet below, soft white interior lighting
- maintenance corridor with exposed pipes-and-conduits and warning-amber lighting, technical-grunge-coded
- promenade-walkway with shops and cafes lining both sides, holo-signs in alien scripts, mixed-species crowd of NPCs blurred in distance
- elevator bay with multiple lift-doors, neon-blue floor markers, observation pane at one end showing the docking bay outside

HANGAR / DOCKING (3-4):
- massive hangar bay with multiple parked starfighters, mech-arms suspended overhead, crew working at distant stations, blue-and-amber industrial lighting
- private docking bay with a single sleek personal yacht, ramp lowered, ground-crew loading cargo crates, ship's-glow-illuminating
- launch-bay with a single cleared runway, blast-shield doors open showing the planet below, ship being prepped on the launch-rails
- repair bay with a damaged shuttle on lift-mounts, sparks falling from welding work, technical lighting and tool-trolleys

ENGINE / TECHNICAL (2-3):
- engine room with a glowing fusion-core suspended in the center, conduits radiating outward, soft pulsing thrum of the reactor
- maintenance gantry catwalk above the main engine, plasma-vents below softly steaming, deck plating walked-grunge-textured
- reactor-control chamber with multiple coolant pipes converging, glass-walled containment showing the core pulsing soft blue

OBSERVATION / VIEWPORT (3-4):
- observation deck with floor-to-ceiling viewport, soft seating arranged facing the stars, low ambient blue lighting, gas giant rising slowly
- private cabin viewport with the view of a binary-star system, leather chair turned toward the window, datapad on the side-table
- observation lounge with curved glass dome ceiling, cushioned seating, cocktail bar at the back, distant starfield filling the upper view
- planetary-orbit viewing platform on a station, planet visible below taking up half the view, soft chrome railing, walking-couples in the distance

MESS / GALLEY / COMMON (2-3):
- crew mess hall with multiple long benches, food dispensers along one wall, holographic newsfeed projecting from the ceiling, low-tier ambient
- ship's galley with rotating kitchen-station, copper kettles steaming on induction plates, port-window showing a moon outside, warm overhead lighting
- crew lounge with low couches arranged around a holo-projector, holographic chess-game in mid-play, dim warm lighting

LAB / SCIENCE / WORKSHOP (2-3):
- science lab with multiple holo-screens displaying alien sample-data, microscope-station active, sealed specimen-cylinders glowing softly
- workbench-shop with engineering tools magnetically clipped to the wall, half-disassembled drone on the bench, single overhead worklight
- briefing room with central holo-table showing a star map, low chairs arranged around, soft amber overhead lighting

━━━ RULES ━━━
- Each entry is a SPECIFIC place — not a vague descriptor
- 20-35 words — paint the location vividly
- Sleek modern sci-fi — NOT puffy NASA, NOT tin-can-spaceship, NOT cyberpunk-grunge-only
- Mass Effect / Star Trek / Blade Runner 2049 / Dune fleet / Apple-design-sci-fi tone
- Sometimes shows STARS / NEBULAE / PLANETS through viewports — anchor the deep-space context
- Suitable for both male and female explorers (gender-neutral)
- Variety across all 7 categories above mandatory

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
