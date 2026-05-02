#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HOT-WHEELS / MICRO-MACHINES toy-car scene descriptions for ToyBot's hotwheels-city path. Tiny 1:64-scale die-cast cars defying physics on insane orange-track loops, kitchen-sink oceans, bookshelf canyons, garage megaramps. Each scene should feel like a frozen frame from a Hot-Wheels TV commercial — speed, stunts, scale-illusion, real-world surfaces blown up to epic by camera angle.

Each entry: 18-28 words. ONE specific scene with toy car(s) mid-stunt or mid-action on a real-world surface or orange-track setup.

━━━ THE CARS ━━━
1:64-scale (~3-inch) die-cast metal-and-plastic toy cars with chrome accents, glossy paint, oversized hot-rod-style wheels, racing-stripes / flame-decals (NOT IP-named brands). Archetypes: muscle car, hot rod, monster truck, flame-painted dragster, low-rider, stunt-cycle, off-road buggy, rally car, sports coupe, semi-truck. Speed-blur on tires, headlight cones, dust-puff under wheels.

━━━ THE TRACKS / SURFACES ━━━
Signature ORANGE Hot-Wheels-style flexible-snap-track segments — curve / loop / launcher / jump-ramp / corkscrew / banked-turn / split-fork. Real-world surfaces blown up to epic scale by extreme low-angle camera: kitchen counter, bookshelf canyon, kitchen-sink ocean, bathtub waterfall, garage-floor megaramp, rooftop city, picnic-blanket racetrack, coffee-table arena, sandbox dune-jump, pool-side megastunt, garden-hose river, stair-step waterfall.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Loop-de-loop midair freeze — chrome muscle car upside-down at top of orange loop, flame-decal blur, light-streak on chrome
- Bookshelf-canyon jump — toy car mid-arc launching off a hardback-book ramp toward stack of paperbacks across the gap
- Kitchen-sink-ocean stunt — die-cast convertible skipping across a sink full of water like a hydroplane, droplets frozen
- Garage-floor megaramp — extreme launcher-piece firing a stunt car toward a ring of stacked tin-cans
- Bathtub-waterfall plunge — toy car mid-fall over the edge of a running bathtub faucet, bubbles in foreground
- Bookshelf-canyon chase — two cars side-by-side racing along a shelf-edge "highway" with picture-frames as roadside billboards
- Lava-loop hellscape — orange-loop track suspended over red-tinted lava-tray, toy car upside-down with under-glow
- Tunnel-burst — chrome semi-truck blasting out of a paper-towel-tube tunnel with light-streak
- Sharp-curve drift — flame-painted muscle car sideways through banked turn with rubber-burnout smoke trail
- Rooftop-city skyline — toy car launching off a stack-of-books skyscraper, sunset-skybox painted backdrop
- Crocodile-pit jump — toy car arcing over a row of plastic-toy alligators, dust-trail behind
- Highway-pile-up dominoes — chain of toy cars frozen mid-collision on a coffee-table highway, debris-spray
- Pool-side megastunt — toy car mid-launch from diving-board over the corner of a pool, water-splash anticipation
- Sandbox dune-jump — off-road buggy mid-flight over sand-dune ramp, sandstorm-cloud trailing
- Stair-step waterfall — toy car cascading down kitchen-counter-edge series of stair-jumps, water-splash on each step
- Garden-hose river-crossing — toy car mid-leap across a coiled garden-hose "creek", dewdrops glinting
- Books-as-buildings street race — three toy cars racing through "city" of stacked encyclopedias, late-afternoon shadows
- Christmas-tree mountain rally — toy car winding around the base of a Christmas tree, ornament-glow as track-side lights
- Couch-cushion canyon — toy car wedged in cushion-gap with launch-ramp leading up to back-of-couch peak
- Lego-brick-city raid — toy car cutting through a LEGO city diorama, knocking over minifigures (rare crossover scene)
- Track-launcher chain reaction — multi-stage launcher firing one car which triggers next, chain of orange tracks
- Bedroom-floor speedway — toy car drifting through a chalk-drawn racetrack on hardwood floor, marker-cone borders
- Carpet-jungle expedition — toy off-road buggy bouncing over shag-carpet "terrain" with tape-measure for scale
- Aquarium-bridge crossing — toy car balancing on plank above fish-tank, real fish in blurred BG (whimsical/surreal)
- Sink-faucet drag-race — toy cars launched by water-jet from running faucet down kitchen-counter "track"
- Window-sill cliff-edge — toy car frozen at edge of a 2nd-story windowsill with city beyond as scale-bait
- Picnic-blanket race day — toy cars drag-racing on red-checkered picnic blanket with apple-cores as obstacles
- Coffee-mug-fortress stunt — toy car ramping over a stack of coffee-mugs into open-mouthed mug
- Driveway sidewalk-chalk track — toy car drifting through chalk-drawn track on real concrete with leaves
- Orange-track corkscrew — toy car midway through helical track-section, light-streak on chrome panels
- Magic-marker city racetrack — sharpie-drawn streets on butcher-paper, toy car mid-skid, marker-smell visible
- Dishrag-fabric mountain pass — toy car winding through folds of crumpled dishrag "mountains" on countertop
- Toilet-paper-roll tunnel — toy car bursting out of empty TP-roll like a tunnel-mouth, streamer-trail behind
- Cereal-box ramp-jump — toy car launching off open-flap of cereal box toward kitchen-counter target
- Sock-drawer cliff-dive — toy car mid-fall from edge of sock-drawer onto pile of folded socks below
- Jenga-tower obstacle course — toy car threading between Jenga-blocks mid-collapse, blocks frozen mid-fall
- Aquarium-tank tunnel — toy car running along plastic ramp inside aquarium with fish as scenery
- Backyard-shed garage — toy cars parked under workbench-overhang with clip-on lights as headlights
- Sand-castle desert-rally — toy off-road buggy circling a sand-castle, mid-skid drifting through "Sahara"
- Lego-city street pursuit — chrome muscle car chasing LEGO police-cruiser through Lego-brick streets (crossover scene)
- Marble-run finish-line — toy car crossing finish gate at end of marble-run track, streamers and confetti

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference 1:64-SCALE / DIE-CAST / TOY-CAR / CHROME / FLAME-DECAL / OVERSIZED-WHEEL language
- Real-world surface OR orange-track piece as setting (kitchen / bookshelf / garage / bathtub / picnic / etc.)
- Mid-action verb (mid-loop / mid-jump / mid-launch / mid-skid / mid-drift / mid-tunnel-burst)
- Speed-blur, dust-puff, headlight-streak, chrome-reflection, or similar speed-cue
- Scale-illusion — real-world object treated as epic-scale terrain by extreme low-angle camera

━━━ BANNED ━━━
- NO real IP names (Hot Wheels brand-name OK as descriptor of style, but no specific Hot-Wheels model name)
- NO 1:18-scale collector die-cast (that's a different toy market)
- NO real cars / real driving / real road
- NO CGI / illustration / digital-render language
- NO human characters in the cars (toys are autonomous)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
