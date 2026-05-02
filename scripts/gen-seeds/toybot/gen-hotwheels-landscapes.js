#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HOT-WHEELS-CITY landscape descriptions for ToyBot's hotwheels-city path — wider environment shots with the toy-car world as the focus, the cars themselves smaller in frame or absent. Real-world surfaces and orange-track architecture blown up to epic city/canyon scale by extreme low-angle macro framing. Cinematic establishing shots.

Each entry: 18-28 words. ONE specific environment-as-protagonist toy-car-world scene. Cars optional or in distance.

━━━ THE LANDSCAPES (focus is environment, not car) ━━━
- Massive orange-track megaramp dominating frame, toy car as small silhouette mid-arc against sunset-skybox
- Bookshelf-canyon vista — wide low-angle of paperback-books as red-rock canyon walls, dust-trail of distant toy car
- Kitchen-counter sprawling cityscape — coffee-mugs as towers, cereal-boxes as buildings, single toy car threading distant streets
- Garage-floor megaramp panorama — the entire orange-track installation across the floor, scale of the whole circuit
- Bathtub-waterfall vista — wide shot of running tap as monumental waterfall, mist filling foreground
- Lava-loop infrastructure — the full architecture of an orange-loop track over red-glowing tray, atmospheric haze
- Bookshelf-skyscraper alley — encyclopedias-as-skyscrapers with daylight slanting between them, debris on the road
- Highway-of-tape — masking-tape lane-markings on wood-floor stretching to vanishing point, distant headlights
- Stair-step waterfall vista — kitchen-counter cascade with tiered toy-car ramps and water-mist, no cars in foreground
- Christmas-tree mountain — full tree as evergreen mountain with track winding around base, ornament-light constellation
- Couch-cushion canyon — wide shot through cushion-gap with launch-ramp leading up to peak, no cars
- Sandbox dune sea — endless rolling sand-dunes with distant track-segment cresting one ridge
- Bedroom-floor speedway grid — chalk-drawn city racing-grid covering hardwood, single car as distant blur
- Carpet-jungle canopy — view from "ground level" inside shag-carpet, towering-fiber forest, distant track-bridge
- Aquarium-bridge causeway — long plank-bridge over fish-tank "ocean", sun glinting through water, faraway car
- Picnic-blanket vista — wide aerial of red-checkered blanket as massive racetrack, finish-line in distance
- Coffee-mug-fortress city — array of coffee-mugs as fortified towers with track-bridges between, no foreground action
- Driveway sidewalk-chalk grand-prix — full chalk-track on concrete with autumn leaves as obstacles, late afternoon
- Magic-marker city — sharpie-drawn metropolis on butcher-paper covering kitchen table, perspective vanishing point
- Dishrag mountain range — folded-dishrag terrain stretching across countertop, atmospheric light from window
- Toilet-paper-roll arched aqueduct — chain of TP-roll tunnels arching over fabric "valley", distant car-light
- Cereal-box-megalopolis — open cereal-boxes as half-finished buildings with construction-site track-cranes
- Sock-drawer cliff-edge — wide pull-back showing entire drawer as plateau with cliff-drop, distant launch-ramp
- Jenga-tower forest — array of leaning Jenga-block towers with toy-car-track threading between
- Aquarium-tank cityscape — viewed from outside the tank, plastic-ramp track with fish swimming as backdrop
- Backyard-shed warehouse-district — collection of garden tools as industrial-warehouse skyline at dusk
- Sand-castle desert-fortress — sprawling sand-castle as Hot-Wheels-themed desert kingdom with surrounding track
- Marble-run mountain — multi-tiered marble-run track installation as towering peak, marbles cascading
- Christmas-light Vegas-strip — string of christmas-lights as nighttime neon strip, distant car-tail-lights
- Hardwood-floor speedway dawn — full racetrack sketched in chalk on hardwood, golden first-light slanting
- Bookend canyon-mouth — twin metal-bookends as cliff-walls with road threading between, deep shadow
- Garden-hose serpentine river — coiled hose laid out as winding river through grass, distant car crossing
- Toy-bin canyon-rim — wide pull-back showing entire toybox as topographical canyon, track-cliff at edge
- Christmas-tree-stand spaceport — base of a Christmas-tree-stand as launch-pad with track lifting toward sky
- Spool-of-thread roundabout — giant spool-of-thread as rotary intersection, track approaching from four directions
- Stack-of-books megastructure — Babel-tower of stacked encyclopedias with track ascending, vertigo angle
- Stair-step Grand-Canyon — staircase as multi-tier canyon with track at every level, atmospheric perspective
- Pencil-cup forest — array of pencil-cups as sci-fi geometric tree-trunks with track winding through
- Closet-organizer warehouse — shoe-rack and shelf-grid as industrial warehouse complex with car ramps
- Wallpaper-pattern megalopolis — geometric wallpaper-tile as endless city-grid with single car as scale-bait
- Window-sill marina — windowsill as harbor with model-cars as parked boats and orange-track pier

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ENVIRONMENT/INFRASTRUCTURE is the focal point, not a single car mid-stunt
- Real-world object treated as epic-scale terrain (object name + "as canyon/city/mountain/etc.")
- Extreme low-angle macro framing language (low-angle, ground-level, macro, scale-illusion)
- Optional toy car as distant silhouette / blur / scale-bait — never the primary subject
- Atmospheric depth (haze, mist, dust, golden-hour, neon-glow, twilight) per pool palette

━━━ BANNED ━━━
- NO real cars / real road / real driving
- NO real city / real architecture (always toy / household)
- NO CGI / illustration language
- NO foreground human figures

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
