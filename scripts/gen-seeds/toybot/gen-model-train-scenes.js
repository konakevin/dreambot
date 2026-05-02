#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/model_train_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HO-SCALE MODEL-TRAIN-DIORAMA scene descriptions for ToyBot's model-train-world path. Tiny scratch-built railroad worlds — die-cast steam locomotives, hand-built terrain, lit windows in tiny depots. NO HUMAN FIGURES IN FRAME. The train is the protagonist or the ambient detail in obsessively-detailed terrain. Cozy + dioramic + nostalgic.

Each entry: 18-28 words. ONE specific train-active moment in a hand-built model-railroad terrain.

━━━ THE TRAINS ━━━
HO-scale (1:87) or N-scale (1:160) tiny die-cast steam locomotives or diesel engines. Pulled cars: boxcars / passenger cars / coal-tenders / cabooses / flat-cars / livestock-cars. Twin nickel-silver rails on plastic ties. Smoke from stack, lit headlight, optional sound-effect (steam-whistle / horn / bell-ring suggested via motion lines). Era variety: 1880s steam, 1920s passenger express, 1950s diesel, modern freight. NEVER real trains.

━━━ THE WORLD (NO HUMANS) ━━━
Hand-built terrain — ground foam, lichen trees, plaster-cast rock-faces, static-grass meadows, scratch-built brick depots, water towers, signal-towers, level-crossings, lift-bridges, tunnel-mouths, trestle-bridges. Tiny lit-window depot interiors visible. Scale-built signage (station names, mile-markers). Train is the focal motion in an otherwise still landscape.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Steam-engine cresting snowy mountain pass — plume of white smoke trailing, alpine cabin with lit window in foreground
- Diesel freight rolling through autumn village — yellow-and-orange foliage, old wooden depot, smoke-stack of distant factory
- Coal-tender pulling out of depot at dusk — golden window-glow inside scratch-built brick station, no people on platform
- Trestle-bridge crossing over tiny river — train silhouetted against blue-hour sky, scale-perfect plate-girder details
- Tunnel-mouth burst — locomotive emerging from plaster-rock tunnel, smoke billowing back into tunnel
- Level-crossing flag-stop — train slowing past striped barrier-arms, tiny model-truck waiting (no driver), gravel-road foreground
- Snowy roundhouse yard — multiple parked locomotives in scale-built fan-shaped engine-shed, yellow lit-windows, falling snow flakes
- Harbor-town arrival — train pulling into seaside-village station with model-fishing-boats in resin-water harbor
- Prairie crossing under thunderstorm — train silhouetted against painted-cloud-backdrop with distant lightning, wide grass plains
- Factory-yard switching — diesel switcher pushing freight cars in scratch-built industrial yard with smokestacks
- Alpine tunnel viaduct — train crossing arched stone-viaduct over plaster-rock canyon, evergreen-foam forest below
- Logging-camp branch-line — small loco pulling flat-cars stacked with toothpick-logs through scratch-built forest
- Grain-elevator stop — train cars being loaded under tall scratch-built wooden grain-elevator, dust haze
- Marshalling-yard at night — sprawling rail-yard with scattered yellow-lit windows in tiny depot, multiple parked engines
- Snowy mountain switchback — train zigzagging up plaster-mountain on multi-tiered track, smoke trail visible
- Steam-engine emerging from fog — plume of white smoke and headlight cone cutting through fog-machine haze
- Riverside scenic-route — train running along scratch-built river with resin-water and reflective sheen
- Crossing iron lift-bridge — bridge in raised position with train waiting, harbor below with scale boats
- Wheat-field harvest run — locomotive rolling through static-grass wheat-field, tiny scale-built combines in distance (no operators)
- Mountain-tunnel double-portal — train mid-emergence from one tunnel, second portal visible across canyon
- Canyon-edge cliff route — train hugging rock-face on narrow shelf-track, tiny river far below in resin-water
- Snowy depot late evening — locomotive parked at platform with lit-window depot, scale-built lampposts glowing
- Fall-foliage covered-bridge — train mid-passage through scale wooden covered-bridge with yellow leaves on roof
- Industrial-yard nighttime — locomotive coupled with freight in scratch-built factory yard under harsh sodium lights
- Lighthouse-coast scenic — train on coastal route with scale-built lighthouse on distant cliff, rolling ocean fog
- Branch-line halt at dawn — small locomotive at unmanned scale-built halt-platform, golden first-light, dewy lichen-grass
- Mountain-meadow flag-stop — train slowing at flag-stop on alpine meadow, wildflower static-grass, distant peaks
- Arched-stone-bridge crossing — train mid-bridge with arched-stone-piers, river reflection beneath
- Refueling-stop water-tower — locomotive at scratch-built wooden water-tower with hose lowered (no hand on hose)
- Switchyard fan of tracks — multi-track scratch-built fan-yard with several locomotives parked at various angles
- Snowy roundhouse turntable — locomotive being turned on circular plate, scale-built fan-shed in BG
- Foggy harbor-bridge — train silhouetted on harbor lift-bridge with foghorn-mist filling lower frame
- Through alpine cog-rail — cog-railway loco climbing impossibly steep grade, snow-capped peak above
- Frozen-lake crossing — scale frozen-lake diorama with train traversing causeway, ice-blue resin-water
- Spring-blossom orchard — train rolling through scale-fruit-orchard with pink-blossom trees, golden hour
- Underground-station — scale-built urban subway-station with locomotive at platform, no human figures, fluorescent lighting
- Lumberyard siding — locomotive parked beside scale-built lumberyard with stacked-toothpick-pile, sawdust haze
- Trestle-over-canyon at sunrise — wooden trestle-bridge with first-light hitting locomotive's headlight side
- Scale-Mining-tipple — train cars loaded under scratch-built mining-tipple structure with coal-dust cloud
- Branch-line in autumn meadow — single small loco on overgrown branch-line through wildflower meadow, late season
- Snowy whistle-stop — locomotive paused at unmanned scale-built whistle-stop with snow-covered roof, fresh tracks

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- HO-SCALE / N-SCALE / MODEL-RAILROAD / DIE-CAST language
- HAND-BUILT / SCRATCH-BUILT / GROUND-FOAM / LICHEN / PLASTER-ROCK / STATIC-GRASS terrain language
- Train (specific era/type) as focal point or moving detail
- NO HUMAN FIGURES — explicitly state or imply unmanned
- Lit-window detail, smoke-from-stack, atmospheric haze, or scale-detail flag

━━━ BANNED ━━━
- NO HUMAN FIGURES anywhere in scene
- NO real trains / real railroads
- NO action-figure or human-toy
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
