#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_drama_moments.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} HO-SCALE MODEL-TRAIN DRAMA-MOMENT seeds for ToyBot's model-train-world path. Each seed describes ONE active, dramatic beat happening in a model-railroad diorama — the "what's about to happen?" hook that makes every frame feel like a movie still instead of an "average picture of a trainset."

Each entry: 18-28 words. ONE narrative beat with kinetic energy, frozen-frame action, or implied story tension. Always set on/around a model train in a hand-built diorama. NO HUMAN FIGURES OUTSIDE THE DIORAMA — tiny model-scale figures OK if integral to the beat.

━━━ DRAMA CATEGORIES (rotate aggressively, don't cluster) ━━━

DERAILMENTS / HAZARDS
- Lead steam-engine mid-derailment, tipped 45° off rails, accordion-fold of cars behind, dust plume rising
- Snowplow locomotive at full charge blasting through 10-foot drift, white snow-spray geyser, headlamp piercing whiteout
- Bridge mid-collapse, train airborne for one frozen second over canyon, trestle-timbers cracking outward
- Locomotive locked-brakes skid, sparks showering from wheels, smoke pouring from stack at emergency-stop
- Rockslide blocking tunnel mouth, locomotive headlamp catching falling boulders, dust cloud erupting

HEISTS / CHASES
- Bandit holdup mid-action: HO-scale outlaw figures crouched on roof of moving boxcar, gold-bullion case spilling
- Two locomotives racing on parallel mainlines, smoke columns competing, throttles wide open
- Tiny figure leaping from caboose into model-river below, splash mid-formation, pursuing locomotive in BG
- Stagecoach robbery in progress beside slowed train, scale-figure outlaws on horseback, dust kicked up
- Train mid-rescue: locomotive uncoupling from burning boxcar, sparks and orange-glow on engineer's window

WILDLIFE / ANIMAL ENCOUNTERS
- Model deer-herd frozen mid-track-crossing, locomotive headlamp painting them in halogen-glow, engineer braking
- Bear standing on rails ahead of approaching freight, headlamp catching glowing eyes, dust haze rising
- Bison stampede along parallel grass, mirroring train's speed, dust kicked into golden hour light
- Eagle perched on telegraph wire as train passes underneath, scale-perfect feather detail, motion blur of cars
- Cow on tracks at flag-stop, locomotive at full stop, engineer half-leaning out of cab in scale-figure detail

WEATHER / NATURAL DRAMA
- Tornado funnel descending behind train, debris swirl, locomotive throttle wide open in escape attempt
- Lightning-bolt striking telegraph pole as train passes underneath, sparks cascading, momentary daylight
- Avalanche thundering down slope behind speeding locomotive, snow-cloud chasing the last boxcar
- Flash-flood overtaking trestle bridge mid-crossing, water rising past rail-level, train pushing through spray
- Forest-fire wall behind train, orange-glow ash falling on smokestack, engineer's silhouette ducking

CARGO MISHAPS
- Open boxcar door swinging wide mid-curve, contents spilling onto trackside — crates, gold-bars, lumber
- Flatcar load mid-shift: lumber stack tilting precariously, ropes snapping one by one
- Livestock car door burst open, model cattle scattering across embankment, panicked stampede
- Tanker-car leak: dripping silver liquid forming pool beneath rolling wheels, hazmat-smoke
- Coal-car mid-spill: tipped 30° dumping coal pile onto tracks, sparks where shovel-blade scrapes rail

OPERATIONS UNDER PRESSURE
- Engineer (tiny scale-figure) leaning out of cab, hand on emergency-brake, face contorted at oncoming peril
- Conductor with scale-lantern frantically waving from caboose at engineer ahead, signal-fire smoke
- Switchman (HO-scale figure) caught mid-pivot at lever, two trains converging at junction
- Maintenance crew (4 scale-figures) jumping off track as locomotive looms over, tool-cart abandoned
- Stationmaster sprinting along platform, scale-arms waving, telegraph-flag fluttering, train barreling in

UNCANNY / SURREAL
- Train mid-passage through ghostly fog wall, headlamp beam vanishing into white, only stack-smoke visible behind
- Locomotive emerging at impossible angle from cliffside tunnel, defying gravity, scale-perfect rivets visible
- Mid-frame jump-cut: locomotive at two positions on track simultaneously, motion blur connecting them
- Train mid-curve so tight it shouldn't be possible, cars accordion-bent but holding, terrain-distortion implied
- Locomotive disappearing into impossibly small tunnel-mouth scaled to a coffee-mug, perspective trick

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ONE clear active beat — something is HAPPENING / about to happen / frozen mid-action
- HO-scale / N-scale / model-railroad language in the description
- Visible scale tells (scratch-built, scale-figure, plaster-rock, etc.) where natural
- Kinetic verb: derailing, blasting, racing, leaping, plummeting, escaping, charging, scattering
- NO static "train rolls through pretty terrain" — must imply motion + tension

━━━ BANNED ━━━
- NO "train static on track"
- NO scenic-but-boring "train passes through autumn village" (that's the SCENE pool's job)
- NO real trains / real railroads / news-event language
- NO gore / mutilation (this is family-friendly toy photography)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is the dramatic beat description ready to inject into a model-train scene template.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
