#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/model_train_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MODEL-TRAIN-WORLD wider-landscape descriptions for ToyBot's model-train-world path. The train is small or absent — focus is the OBSESSIVELY-DETAILED hand-built terrain itself. NO HUMAN FIGURES. Cozy, atmospheric, hobby-magazine cover-shot energy.

Each entry: 18-28 words. ONE specific wider terrain shot — landscape as protagonist, train optional/distant.

━━━ TERRAIN FOCUS (no humans) ━━━
Hand-built model-railroad landscape elements: scratch-built brick depot, water-tower, signal-tower, lift-bridge, trestle-bridge, tunnel-mouth, level-crossing, plaster-cast cliffs, ground-foam meadows, lichen forest, static-grass fields, resin-water rivers/lakes, scale-built rural buildings (barn, silo, farmhouse, church, mill, factory, lumberyard, lighthouse, harbor docks). Atmospheric haze, golden hour, blue hour, snowfall, fog, autumn light. Tiny lit windows, scale signage. Train as distant silhouette or absent entirely.

━━━ LANDSCAPE CATEGORIES (rotate, don't cluster) ━━━
- Sweeping autumn valley vista — model-railroad valley with foliage-covered hills, distant trestle-bridge, sun breaking through clouds
- Scratch-built fishing-village harbor — model-houses on stilts over resin-water, scale fishing-boats moored, no people on docks
- Snowy mountain pass with scratch-built tunnel-mouth — fresh snowfall on lichen-evergreens, no train visible
- Scale-built rural farmstead at dawn — barn, silo, farmhouse with tiny lit windows, ground-foam fields, golden first-light
- Plaster-rock canyon vista — model-railroad cliff-faces with toy track-edge visible, atmospheric haze in valley
- Scale-built industrial waterfront — factories with model-smokestacks, model-cranes, resin-water harbor, sodium-light glow
- Lichen-forest dense canopy — overhead view of model-foam-trees stretching to vanishing point, sunbeams through canopy
- Autumn-orchard hillside — rows of pink-and-yellow scale-trees on terraced hillside, distant model-farmhouse
- Foggy bridge silhouette — scratch-built lift-bridge in heavy fog, no train, mist filling lower half of frame
- Scale-built lighthouse on rocky coast — plaster-cast cliff with white-and-red lighthouse, lichen-grass, gulls (toy birds) overhead
- Model-railroad lumberyard panorama — scratch-built lumber stacks, toothpick-logs piled high, sawmill in distance
- Snowy roundhouse yard at twilight — fan-shaped engine-shed with multiple lit-window stalls, falling snow, no train moving
- Scale-built grain-elevator silhouette — tall wooden grain-elevator at golden hour, dust-haze, distant train as ant-sized dot
- Mountain-meadow alpine vista — wildflower static-grass spreading to plaster-mountain skyline, distant cog-rail visible
- Scale-built covered-bridge over river — wooden covered-bridge with yellow autumn-leaf cover, resin-water beneath, no train
- Riverside-mill diorama — scratch-built water-mill with model-water-wheel, resin-water rapids, foam-tree riverbank
- Marshalling-yard panorama at night — sprawling scale-rail-yard with scattered tiny lit-window depots, no train movement
- Plaster-cast desert mesa — red-rock mesa with scratch-built track threading base, sand static-grass, dramatic shadows
- Scale-built cathedral-town — old-Europe town diorama with cathedral-spire, cobblestone streets, train station visible
- Iceberg-coast scale diorama — frozen scale-coast with model-icebergs in resin-water, distant lighthouse beam
- Foggy harbor at dawn — scale fishing-village in heavy fog, golden sun rising, scale-boats indistinct shapes
- Scale-built cog-rail valley — alpine valley with cog-rail track climbing to distant peak, no train present
- Scale-built bridge over reservoir — multi-arch stone bridge spanning resin-water reservoir, scale dam in BG
- Mountain-pass tunnel-portal vista — twin tunnel-portals on opposite cliff-faces, scale viaduct between
- Logging-camp clearing — scratch-built lumber camp with stacked toothpick-logs, scale-built bunkhouse, no figures
- Wheat-field thunderstorm vista — endless static-grass wheat with model-thunderstorm clouds, distant grain-elevator
- Scale-built coal-mining town — Appalachian-style company-town diorama with mountain backdrop, smoke-haze
- Frozen-lake panorama — scale frozen-lake with ice-fishing-shanty (no people), pine-forest backdrop
- Scale-built airfield-adjacent train-yard — small biplane parked on grass strip beside rail-yard, period-correct
- Spring-blossom orchard panorama — pink-blossom rows in scale-built orchard, golden hour, distant church-steeple
- Underground-station empty platform — scratch-built urban subway interior, fluorescent lights, no train, no people
- Scale-built lumberyard at dusk — wooden lumberyard structures with last light hitting roof-edges, distant smokestack
- Coastal cliff-vista with scale-lighthouse — rocky shoreline with white lighthouse, lichen-grass, fog-bank approaching
- Scale-built ironworks — period-correct ironworks diorama with smokestacks billowing, smelters glowing
- Mountain-meadow blue-hour — alpine meadow at twilight with model-stars beginning, distant cabin lit windows
- Scale-built warehouse district — sprawling industrial diorama with brick warehouses, freight-yard, sodium-lights
- Trestle-bridge over fog-filled canyon — scratch-built wooden trestle, fog filling canyon below, partial train silhouette
- Autumn covered-bridge under heavy rain — covered-bridge with rain streaking down, resin-water rising, atmospheric
- Scale-built saw-mill operation — water-powered mill with foam-tree backdrop, log-pond in resin-water
- Snowy whistle-stop platform — unmanned scale-built whistle-stop platform, snow on roof, single bare bulb glowing
- Foggy harbor lighthouse — scale lighthouse with beam cutting through dense fog, scale-boats in foreground

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- TERRAIN/INFRASTRUCTURE is focal point, not a single train
- HAND-BUILT / SCRATCH-BUILT / GROUND-FOAM / LICHEN / PLASTER-ROCK / STATIC-GRASS / RESIN-WATER vocabulary
- HO-SCALE / N-SCALE / MODEL-RAILROAD descriptive language
- NO HUMAN FIGURES — explicitly stated
- Atmospheric depth — golden-hour, blue-hour, fog, snow, autumn-light, dawn, dusk, twilight

━━━ BANNED ━━━
- NO HUMAN FIGURES anywhere
- NO real trains / real railroads / real landscapes
- NO action-figure or human-toy
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
