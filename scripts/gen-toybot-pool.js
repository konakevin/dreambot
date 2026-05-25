#!/usr/bin/env node
/**
 * Generate a StarBot Rich Scene Seed pool using Sonnet.
 *
 * Each pool entry is a structured mini-storyboard (FG / MG / Far / Sky
 * + scale provers + material truth + emotional DNA) — see
 * STARBOT_SCENE_QUALITY_PLAYBOOK.md for the format and bar.
 *
 * Usage:
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50 --dry-run
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50
 *
 * The pool's aesthetic touchpoints + theme guidance are looked up from
 * the POOL_RECIPES table below. Output is written to
 * scripts/bots/toybot/seeds/<pool>.json.
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '50'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--dry-run]');
  process.exit(1);
}

// Per-pool recipe — what kind of scenes this pool authors + aesthetic
// touchpoints Sonnet should draw from. Same format the playbook uses.
const POOL_RECIPES = {
  // ─── model-train-world path (2026-05-17 R0 axis-system migration) ───
  // Per-path bespoke recipes for the 3 path-bespoke axes. Existing seed
  // JSONs are production-scale and well-curated; these recipes exist for
  // future regen + as canonical documentation of the path's pool design.

  toybot_model_train_scene: {
    format: 'simple',
    theme: `MODEL-TRAIN DIORAMA SCENES for ToyBot's model-train-world path. Each entry is ONE specific HO-scale (1:87) or N-scale (1:160) model-railroad scene. NO HUMAN FIGURES — terrain + train + scratch-built infrastructure ARE the cast. Each entry 30-60 words.

⚠️⚠️ SCENE-TYPE VARIETY — non-negotiable

Each entry is ONE specific model-train diorama scene. Total batch size is set by the gen script's count parameter (typically 30-50 per call). Across the batch, ROTATE across the 9 scene-type categories listed below — NEVER cluster on mountain/alpine which is just ONE of nine. The previous pool was mountain-heavy; this one MUST fix that.

Each entry leads with its scene-type category in the format "CATEGORY-NAME — scene description". Examples:
  - "MOUNTAIN PASS / ALPINE — HO-scale steam 4-8-2 emerging from tunnel..."
  - "URBAN TOWN / VILLAGE — N-scale switcher crossing brick main-street..."
  - "BRIDGE-SPAN / TRESTLE — HO-scale steam crossing wooden high-trestle..."

Mix the categories freely throughout the batch. Each category should appear MULTIPLE TIMES with different sub-types, eras, seasons, weather, and locomotive choices.

The 9 buckets (~11% each):

A. **MOUNTAIN PASS / ALPINE** — switchbacks, tunnels through peaks, alpine meadow vistas, snow-bound passes, glacier valleys, mountain ridges
B. **URBAN TOWN / VILLAGE** — busy main street with multiple buildings, market square crossing, cottage hamlet, brick downtown, false-front Western town, factory district
C. **BRIDGE-SPAN / TRESTLE** — high wooden trestle over canyon, steel-truss bridge over wide river, cantilever bridge as hero, viaduct over valley, swing-bridge over harbor
D. **HARBOR / COASTAL** — fishing port with docks and boats, lighthouse cliff, harbor town with quay, ferry-pier with cable-cars, beach-pier waterfront, naval base waterfront
E. **INDUSTRIAL / MILL** — steel mill with open-hearth furnaces, lumber camp with log-pond, coal tipple at mine entrance, refinery tank farm, brick warehouse district, grain-elevator yard, paper mill, brewery complex
F. **PRAIRIE / FARMLAND** — wheatfield level-crossing, sprawling grain elevator at lone depot, ranchland with barn cluster, cornfield rows beside track, prairie windmill at trackside, treeless plains with distant smoke
G. **FOREST / WILDERNESS** — deep pine forest with track threading through, redwood grove with massive trunks, riparian birch corridor, fire-lookout on distant ridge, swampy backwater forest, autumn maple-oak woods
H. **DESERT / CANYON** — red-rock canyon ridge with winding tracks BELOW visible in deep distance, mesa-top crossing, arroyo trestle, sandstone-arches scenery, salt-flat with distant heat-haze, sagebrush flats with cottonwoods
I. **RIVER + LAKE** — river bridge with reflective water, lakeshore depot with steamboat moored, bayou trestle on stilts above swamp, marsh crossing with cattails, lake-side cottage cluster with track curving past

⚠️ MANDATORY in every entry (regardless of bucket):
  • At least 2-3 SCRATCH-BUILT BUILDINGS visible (depot / freight-house / cottage / mill / store / tower / etc.)
  • Trackside infrastructure (signal-tower / water-tank / telegraph poles / switch-stand)
  • Vegetation appropriate to bucket
  • Multi-tier depth — foreground tactile + midground hero + far-distance atmospheric layer
  • Atmospheric effect — smoke / mist / fog / haze / dust / steam / etc.

🚫 STRICT BANS:
  • NO human figures (scale-people-figures filling frame = FAIL)
  • NO real train (must read as MODEL on a terrain board)
  • NO CGI / NO illustration
  • NO IP-named locations
  • NO bucket clustering (mountain-heavy = FAIL)
  • NO "lone train on track in empty landscape" — buildings + infrastructure ALWAYS visible`,
    touchpoints: [
      // A. MOUNTAIN PASS / ALPINE (3)
      'A-ALPINE-TUNNEL: HO-scale 4-8-2 Mountain steam locomotive emerging from a stone-faced mountain tunnel, snow-dusted pine forest on slope above, scratch-built signal-tower + flag-stop shelter at tunnel mouth, smoke-plume against blue-hour sky, distant peaks fading into atmospheric haze',
      'A-SWITCHBACK-CLIMB: N-scale 2-6-6-2 Mallet pushing up an alpine switchback grade with 3 visible track-levels stacked, plaster-cast cliff between levels, tiny section-house at the lower switch, brakeman shanty at the upper switch, faraway peaks above',
      'A-MOUNTAIN-MEADOW-CROSSING: HO-scale F7 diesel rounding a high alpine meadow with wildflower static-grass, scratch-built section-foremans house with picket fence, lichen-tree cluster, towering plaster peaks behind, atmospheric haze in middle-distance',

      // B. URBAN TOWN / VILLAGE (3)
      'B-MARKET-SQUARE-CROSSING: HO-scale 0-6-0T switcher crossing a busy cobble-paved town square between scratch-built brick depot + freight-house + general store + clock-tower + 3 cottages, lit windows everywhere, dusk catalog-soft warm grading',
      'B-FALSE-FRONT-WESTERN-TOWN: N-scale Consolidation 2-8-0 chuffing through a false-front Western town main street with saloon, livery, hotel, blacksmith, telegraph office, post-office — all hand-painted sign-boards, dust-haze in air',
      'B-FACTORY-DISTRICT-MAIN-LINE: HO-scale GP9 diesel pulling boxcars through a brick factory district with 4 stacked warehouses on left + machine-shop with smoke-stack + scratch-built worker-cottages on hillside above + interlocking-tower, sodium-lamp practical light',

      // C. BRIDGE-SPAN / TRESTLE (3)
      'C-HIGH-WOODEN-TRESTLE: HO-scale 4-8-4 Northern steam locomotive crossing a soaring 5-bent wooden trestle over a deep gorge, white-water river of resin far below, scratch-built signal-tower + section-shanty at far abutment, dramatic backlight gilding smoke-plume',
      'C-STEEL-TRUSS-RIVER-BRIDGE: N-scale ALCO PA crossing a 4-span Pratt-truss steel bridge over a wide river, two scratch-built shipping-warehouses + tiny grain-elevator on the riverbank below, autumn forest on both banks',
      'C-VIADUCT-OVER-VALLEY: HO-scale Pacific 4-6-2 crossing a multi-arch stone viaduct soaring across a misty valley, scratch-built cottage cluster + chapel spire visible in the valley below, atmospheric haze deep beneath the bridge',

      // D. HARBOR / COASTAL (3)
      'D-FISHING-PORT-WATERFRONT: HO-scale 0-6-0T switcher shuffling boxcars along a fishing-port waterfront with scratch-built wooden warehouses + fish-packing-shed + brick chandlery + lighthouse on distant breakwater, scale fishing boats moored alongside, sodium dock-lights',
      'D-LIGHTHOUSE-CLIFF-BRANCH: N-scale Budd RDC running a coastal branch-line that hugs the base of a sheer plaster cliff, soaring lighthouse with red-and-white stripes atop the cliff + scratch-built keepers-cottage + fog-horn-building, crashing resin-waves below',
      'D-HARBOR-TOWN-QUAY: HO-scale ALCO RS-3 industrial switcher shuffling cars along a stone-walled harbor quay with scratch-built shipping-warehouses + customs-house + harbor-master tower + tug-boats moored, gas-lamp practical light, coastal fog rolling in',

      // E. INDUSTRIAL / MILL (3)
      'E-STEEL-MILL-SHUNTING: HO-scale RS-3 switcher pulling slag cars past a blazing open-hearth furnace at a scratch-built integrated steel-mill, glowing molten-metal trough catching locomotive in dramatic up-light, brick warehouse cluster + smoke-stacks belching, night sky',
      'E-LUMBER-CAMP-YARD: HO-scale Shay-geared logging locomotive pushing skeleton log-cars under a scratch-built sawmill on stilts, log-pond of resin with floating logs, lumberjack-bunkhouses + cookhouse + foreman cottage clustered nearby, pine-forest terrain',
      'E-COAL-TIPPLE-MINE: N-scale 2-8-0 Consolidation pulling empty hoppers past a towering scratch-built coal-tipple at a mountain mine entrance, miners-cottage cluster + company store + church on hillside above, coal-dust haze, sodium lamps glowing',

      // F. PRAIRIE / FARMLAND (3)
      'F-WHEATFIELD-LEVEL-CROSSING: N-scale F7 ABBA diesel hauling 22 boxcars across an empty prairie level-crossing, golden-wheat static-grass to horizon, scratch-built farmhouse + barn + grain-elevator cluster in midground, telephone-pole line stretching to vanishing-point',
      'F-RANCHLAND-BARN-CLUSTER: HO-scale 4-6-0 Ten-Wheeler chuffing past a cattle-ranch with scratch-built ranch-house + barn + corral fence + bunkhouse + windmill, sage-brush static-grass plains, distant mesas, harsh noon shadows',
      'F-CORNFIELD-ROW-CROSSING: HO-scale GP38-2 diesel hauling grain-hoppers past a midwest farm scene with cornfield rows + scratch-built farmstead + silo cluster + tractor at the trackside dirt road, golden-hour catalog-soft light',

      // G. FOREST / WILDERNESS (3)
      'G-DEEP-PINE-FOREST: N-scale Forest-Service Speeder running a remote single-track through dense pine forest, scratch-built fire-lookout tower atop distant peak + ranger-station cabin + tool-shed near track, lichen-pine cluster, soft overcast palette',
      'G-REDWOOD-GROVE-CROSSING: HO-scale Shay-geared logging steam crossing through a massive redwood grove with towering scratch-built trees + lumberjack camp cottages + sawmill in distance, mossy ground cover, sun-shafts piercing canopy',
      'G-AUTUMN-MAPLE-WOODS: HO-scale 4-8-2 Mountain steam crossing a wooden bridge through brilliant autumn maple-and-oak woods, scratch-built rural depot + section-cottage + general-store cluster at the far bridge end, falling leaves in air',

      // H. DESERT / CANYON (3)
      'H-RED-ROCK-CANYON-RIDGE: HO-scale ATSF 4-8-4 Northern steam on a ridge-top track winding along a sheer red-rock canyon edge, WINDING TRACKS VISIBLE BELOW threading the canyon floor far below, scratch-built mining-camp cluster + water-tower on opposite mesa, dust-haze',
      'H-MESA-TOP-CROSSING: N-scale GP9 diesel crossing a flat desert mesa-top with scratch-built section-house + sand-tower + cattle-pen on track-side, towering plaster mesas in distance, sagebrush static-grass, harsh late-afternoon shadows',
      'H-ARROYO-TRESTLE: HO-scale 2-8-0 Consolidation crossing a low wooden trestle over a dry desert arroyo, scratch-built whistle-stop shelter + water-tank + telegraph-shanty on the far side, red-rock cliffs above, distant heat-haze on the salt-flat',

      // I. RIVER + LAKE (3)
      'I-LAKESHORE-DEPOT: HO-scale 4-6-2 Pacific steam pulling into a scratch-built brick lakeshore depot with bay-window agent-office, sailboat + steamboat moored at adjacent pier, lit-window depot warm against blue-hour twilight, lakeshore cottages on far shore',
      'I-BAYOU-TRESTLE: N-scale 4-6-0 Ten-Wheeler crossing a low wooden pile-trestle through a Louisiana cypress-bayou, Spanish-moss draping from lichen-cypress trees, tea-stained tannin-amber resin water, scratch-built fishing-shack + bait-store on stilts, mist hanging at water-level',
      'I-MARSH-CROSSING: HO-scale GP38 diesel crossing a low causeway through a coastal salt-marsh, cattails + reed static-grass, scratch-built hunting-blind + duck-decoy-makers shanty + crab-shack on stilts, atmospheric mist, sun-shafts breaking through',
    ],
    instructions: `Each entry is ONE MODEL-TRAIN-DIORAMA scene, 30-60 words. Format: "BUCKET-LETTER-NAME: scale + locomotive + action + scratch-built buildings + terrain details + atmospheric lighting". MUST distribute evenly across all 9 buckets (A-I). NEVER cluster on mountain-alpine. ALWAYS 2-3 scratch-built buildings visible. NO human figures. NEVER real train. Output as a NUMBERED list, one per line.`,
  },


  toybot_train_consists: {
    format: 'simple',
    theme: `EXACT TRAIN CONSIST descriptions for ToyBot's model-train-world path. Each entry is ONE specific era + locomotive type + car-list combination — defeats Sonnet's "generic steam locomotive" training-bias by forcing era + type variety. Each entry 15-30 words.

⚠️ MANDATORY in every entry:
  • Era (1880s / 1900s / 1920s / 1940s / 1960s / 1980s / modern)
  • Locomotive type (4-8-2 Mountain / 2-8-8-2 Mallet / GP9 diesel / SD40-2 / F7 / Budd RDC / Shay-geared / etc.)
  • Consist (4-12 cars: boxcars / passenger-cars / coal-hoppers / flatcars / tank-cars / cabooses)
  • Railroad name (SP / UP / B&O / PRR / NYC / ATSF / D&RGW / etc. — REAL named roads)

⚠️ DISTRIBUTION:
  • 40% steam-era (1880s-1950s): 4-8-2, 2-8-0, 0-6-0, 4-6-2, 2-8-8-2, Shay, 2-10-0
  • 30% early-diesel (1940s-1970s): F7, GP9, RS-3, ALCO PA, EMD E8, ALCO RS-1
  • 20% modern-diesel (1970s-present): SD40-2, GP38-2, AC4400CW, ES44AC
  • 10% specialty (passenger / industrial / narrow-gauge): Budd RDC, Burro crane, gas-electric doodlebug, 0-4-4T Forney

🚫 STRICT BANS:
  • NO IP-named trains (Hogwarts Express, Polar Express, Thomas the Tank Engine)
  • NO generic "steam locomotive" without specific wheel-arrangement
  • NO modern high-speed rail (Shinkansen, TGV, Eurostar)`,
    touchpoints: [
      '1945 era — Pennsylvania Railroad K4s 4-6-2 Pacific steam locomotive hauling 8 PRR-tuscan heavyweight passenger coaches and a 6-wheel observation car with brass railing, route: New York to Pittsburgh',
      '1965 era — Santa Fe ATSF F7 ABBA diesel-electric quad consist hauling 22 boxcars + 3 reefer cars + cushioned caboose, route: Chicago to Los Angeles trans-con freight',
      '1980 era — Union Pacific SD40-2 diesel pulling 14 covered grain-hoppers, 4 tank cars and a wide-vision bay-window caboose, route: Wyoming prairie grain-shipment',
      '1925 era — Baltimore & Ohio EM-1 2-8-8-2 articulated Mallet steam locomotive double-heading another EM-1 with 32 coal hoppers and a wooden bobber caboose, route: Maryland coal-country branch',
      '1950 era — Southern Pacific Daylight GS-4 4-8-4 Northern steam in red-and-orange Daylight livery hauling 12 streamlined SP Daylight passenger cars and a tavern-lounge observation car',
      '2010 era — BNSF Railway AC4400CW + ES44AC twin-unit diesel consist hauling 110-double-stack intermodal containers, route: Pacific-Northwest port-to-Midwest landbridge',
      '1900 era — Virginia & Truckee 2-6-0 Mogul steam locomotive (No. 11 Reno) pulling 4 wooden passenger coaches with arched-window monitor roofs and an open-platform combine car, route: Nevada silver-mining branch',
      '1972 era — Conrail GP38 diesel switcher pulling 5 grimy boxcars and a slug-unit at the rear of a short trip-freight, route: northeast industrial-belt local',
      '1898 era — Denver & Rio Grande Western K-27 2-8-2 Mikado narrow-gauge steam locomotive pulling 8 stock cars and a wooden drovers caboose, route: Colorado mountain ranch-country',
      '1939 era — New York Central J-3a 4-6-4 Hudson streamlined steam locomotive in 20th-Century-Limited grey livery hauling 9 streamlined passenger cars and a tavern-observation car',
      '1955 era — Western Pacific Feather-River-Canyon F3 ABA diesel consist hauling 18 mixed freight: boxcars, gondolas, flatcars with lumber, route: Sacramento to Salt Lake City',
      '1928 era — Norfolk & Western Y-3 2-8-8-2 articulated Mallet steam locomotive pulling 40 hopper cars of bituminous coal and a wooden bay-window caboose, route: West Virginia coal-fields to tidewater',
      '1980 era — Conrail TOFC trailer-on-flatcar intermodal: GP40-2 + GP38-2 + GP38 three-unit consist hauling 24 flatcars with semi-trailers, route: northeast piggyback corridor',
      '1948 era — Chesapeake & Ohio H-8 2-6-6-6 Allegheny articulated steam (largest locomotive ever built) pulling 75 coal hoppers and a wide-vision steel caboose, route: West Virginia coal main',
      '1962 era — Great Northern P-2 4-8-2 Mountain steam in glacier-park-green livery pulling 6 Empire-Builder dome passenger cars and a Great-Dome observation car, route: Seattle to Chicago transcon',
      '1985 era — Burlington Northern SD40-2 + SD45 dual-unit consist pulling 60-grain-hopper unit train, BN Cascade-green livery, route: Powder-River-Basin coal to Pacific Northwest export',
      '1915 era — Pere Marquette Berkshire 2-8-4 steam locomotive pulling 10 wooden boxcars and an outside-braced wooden caboose, route: Michigan automotive-parts freight',
      '1955 era — New York Central PA-1 ALCO diesel double-headed PA1+PA1 hauling 12-car NYC Pacemaker streamliner, route: New York to Chicago overnight',
      '1990 era — CSX SD60I diesel single-unit hauling 24 mixed-freight: boxcars, autoracks, intermodal-doublestacks, tank cars, gondolas, route: Florida-to-Ohio mainline',
      '1899 era — South Pacific Coast 4-4-0 American steam locomotive pulling 3 narrow-gauge wooden combination coaches and a wooden bobber caboose, route: California redwood-country branch',
      '1940 era — Reading Company T-1 4-8-4 Northern steam locomotive pulling 4 streamlined Reading-Crusader passenger coaches and an open-platform observation car, route: Philadelphia to Jersey City',
      '1975 era — Amtrak EMD F40PH diesel pulling 6 stainless-steel Amfleet single-level coaches and a baggage car, route: Northeast Corridor between Washington and Boston',
      '2005 era — Norfolk Southern Heritage SD70ACe in Pennsylvania-Railroad-tuscan heritage livery pulling 22 covered hoppers, route: Pittsburgh-to-Norfolk export grain',
      '1898 era — Sumpter Valley Railway 2-8-0 Consolidation narrow-gauge steam pulling 4 ore cars and a converted coach caboose, route: Oregon gold-mining branch',
      '1944 era — Union Pacific Big Boy 4-8-8-4 articulated steam (longest locomotive ever built) pulling 80 hopper cars of war-effort coal, route: Sherman Hill grade on UP Overland Route',
    ],
    instructions: `Each entry is ONE EXACT TRAIN CONSIST description, 15-30 words. Format: "<YEAR> era — <Railroad-Name> <wheel-arrangement> <type> hauling <car-list>, route: <origin to destination context>". Distribute across steam (40%) / early-diesel (30%) / modern-diesel (20%) / specialty (10%). Use REAL railroad names. Output as a NUMBERED list, one per line.`,
  },

  toybot_train_weather: {
    format: 'simple',
    theme: `WEATHER + SEASON + TIME-OF-DAY descriptions for ToyBot's model-train-world path. Each entry sets atmospheric conditions that elevate the diorama from "trains on track" to museum-grade hobbyist-photography. Each entry 15-30 words.

⚠️ MANDATORY in every entry:
  • Season (winter / spring / summer / autumn)
  • Time-of-day (dawn / morning / noon / late-afternoon / golden-hour / blue-hour / dusk / night)
  • Weather (clear / overcast / fog / rain / snow / blizzard / heat-haze / storm-front / etc.)
  • Atmospheric effect (steam / smoke / haze / mist / dust / pollen / falling-leaves / etc.)

⚠️ VARIETY DISTRIBUTION:
  Winter ~25% (snow / blizzard / frost / fog)
  Spring ~20% (rain / mist / blossom-fall / fresh-greenery)
  Summer ~25% (heat-haze / clear-noon / dust / dry-storm)
  Autumn ~30% (overcast / falling-leaves / fog-burnoff / harvest-haze)

🚫 STRICT BANS:
  • NO modern-weather-radar descriptions (just observable atmospheric effects)
  • NO sci-fi sky elements
  • NO IP-named locations`,
    touchpoints: [
      'WINTER BLUE-HOUR — fresh snowfall covering the terrain with deep drifts on car-tops, blue-hour cool grading, smoke-plume showing pale against deepening violet sky, lit-window depot warm against the cold',
      'AUTUMN GOLDEN-HOUR — late-afternoon sun raking low across the diorama, brilliant red-and-orange maple leaves drifting through the air, long shadows from telegraph poles, warm catalog-soft glow on locomotive smoke',
      'SPRING OVERCAST — fresh greenery on lichen-trees, recently-rained ballast catching pewter sky reflection, soft diffused light flattening shadows, low atmospheric mist hanging in the valleys',
      'SUMMER NOON HEAT-HAZE — harsh overhead sun, shimmering heat-haze rising from rails, dust-cloud trailing behind locomotive on dry ballast, bleached static-grass and dry lichen-trees',
      'WINTER BLIZZARD — heavy snow falling sideways across the diorama, locomotive snow-curtain plow flaring white powder, drifted snow building up against snow-fence, near-monochrome white grading with locomotive headlight piercing through',
      'AUTUMN OVERCAST FOG-BURNOFF — early-morning fog rolling out of the valleys, golden sunlight breaking through and shafts striking the trestle bridge, atmospheric haze in deep distance, soft warm grading',
      'SPRING RAIN — wet rails reflecting overcast sky, water-puddles on ballast, locomotive headlight reflecting in wet platform, soft pewter-and-green grading, mist rising from warm-rails',
      'SUMMER DRY-STORM APPROACH — towering anvil-clouds in deep distance, late-afternoon sun still on locomotive but storm-front darkening the far hills, dust kicking up on the prairie, dramatic split-lighting',
      'WINTER FOG — frozen mist clinging to the terrain, hoar-frost on every static-grass blade and lichen-tree, diffused grey-white light, atmospheric depth fading into pale haze within 6 feet of scale-distance',
      'AUTUMN DUSK — last red-orange band along horizon, deep purple sky above, lit-window depot warm-yellow against the cool, locomotive headlight piercing through faint mist, harvest-moon rising over far ridge',
      'SUMMER GOLDEN-HOUR — warm late-afternoon sun gilding the locomotive smoke-plume, long raking shadows from telegraph poles across the terrain, mid-summer green static-grass at peak saturation, soft warm catalog-soft light',
      'SPRING DAWN — pearlescent pale-pink dawn breaking over the eastern hills, ground-fog clinging to the meadows, dew on every blade of static-grass catching first light, soft cool grading',
      'WINTER MOONLIT NIGHT — full moon illuminating snow-covered terrain in cool silver, lit-window depot warm against the cold, locomotive headlight beam cutting through, smoke-plume rising as pale ghost in moonlight',
      'AUTUMN HEAVY OVERCAST — uniform pewter sky, recently-rained terrain with wet ballast and damp lichen-trees, autumn-foliage saturation enhanced under overcast, atmospheric haze in deep distance',
      'SUMMER POST-RAIN — golden late-afternoon sun returning after a passing storm, wet ballast reflecting blue-sky-with-clouds, double-rainbow arching over the far hills, steam rising from warm rails',
      'WINTER CLEAR-COLD NOON — brittle winter sunlight casting long blue shadows on snow-covered terrain, smoke-plume showing white against pale-blue sky, ice-crystals visible in the air catching light',
      'AUTUMN FOG-FILLED VALLEY — dense fog filling the valley with only ridge-tops emerging, locomotive smoke-plume mingling with the fog, soft cool grading, atmospheric mystery — train appearing and disappearing in haze',
      'SPRING BLOSSOM-FALL — cherry-blossom or apple-orchard petals falling like snow, soft mid-morning light, pale-pink-and-cream confetti against fresh green static-grass, warm catalog-soft grading',
      'SUMMER DUSK FIREFLY-HAUNT — last band of red horizon, deep-blue twilight, scattered fireflies as warm-yellow pinpoints across the meadow, lit-window depot warm, locomotive smoke catching last light',
      'WINTER STORM-CLEARING — heavy snow-clouds parting just enough for late-afternoon sun to strike the locomotive smoke-plume in dramatic shaft of light, snow-covered terrain in cool grey shadow, dramatic split-lighting',
      'AUTUMN MORNING DEW — clear cold autumn morning, every static-grass blade and lichen-tree covered in dew catching first sun, locomotive headlight off (daylight running), soft warm side-light',
      'SUMMER OVERCAST HAY-FIELD — uniform white-grey overcast, freshly-cut hay-field rolling away from the track, bales scattered in the meadow, dust haze from passing locomotive trailing behind, soft warm grading',
      'WINTER COASTAL BLIZZARD — Pacific Northwest coastal terrain with wet-snow falling, evergreen trees heavy with snow, ocean swells visible at base of cliff, locomotive smoke flattening sideways in the wind',
      'SPRING ALPINE MEADOW NOON — mid-day high-altitude clarity, brilliant wildflower meadow, towering snow-capped peaks in distance, locomotive smoke-plume showing white against deep-blue mountain sky',
      'AUTUMN HARVEST-MOON RISE — full harvest-moon rising large over far ridge, last red-orange dusk light still on the locomotive, golden-wheat stubble static-grass to horizon, dust-haze in air',
    ],
    instructions: `Each entry is ONE WEATHER + SEASON + TIME-OF-DAY description, 15-30 words. Format: "SEASON TIME-NAME — atmospheric description with lighting + weather + season-detail". Distribute across the 4 seasons per ratios above. Output as a NUMBERED list, one per line.`,
  },

  // ToyBot pool recipes — added per path migration. See playbook 'Step 6 —
  // Author archetype, template, recipes' for the recipe shape.
  //
  // Each recipe defines: theme (Sonnet directive), touchpoints (anchor
  // examples), format ('simple' = string-per-line output). Dedup + iterate
  // loop in main() handles deduplication and target-count fulfilment.

  // ─── barbie-scene path (2026-05-19 axis-system migration) ───
  // 6-slot storytelling DNA seed: real surface + unexpected story setup;
  // protagonist Barbie/Ken + dramatic absurd action; 3-5 supporting cast
  // mixing Barbies + Kens + sisters + Bratz; multilayered girly-lifestyle
  // set decoration (5-7 props); warm playroom light; whimsical overhead
  // element. Output is one long sentence with 5 semicolons.
  toybot_barbie_storytelling: {
    format: 'simple',
    theme: `BARBIE-PLAYTIME-MISCHIEF storytelling scenes for ToyBot's barbie-scene path. Each entry is ONE absurdly-specific kid-playtime scenario featuring Mattel-style 11.5-inch articulated fashion-dolls (Barbie / Ken / Skipper-style sisters / Bratz-style friends) — NOT a Barbie movie poster, NOT a fashion-photoshoot, NOT a static product display. A populated kid-playtime story-beat captured mid-action with multilayered curated GIRLY-LIFESTYLE set decoration.

⚠️ THE BAR — every entry must read as a single-frame comedy moment from a longer absurd Barbie story (heist / talent show / wedding crash / Olympic disaster / sister-summit / etc.). 4-6 dolls coexist in one densely populated playtime scene. The viewer should be able to look at the entry and READ THE STORY in one glance.

🚫 STRICT BANS:
  • NO real women, NO CGI, NO illustration — Mattel-style fashion-DOLLS only
  • NO Barbie-movie promotional posters, NO red-carpet shots, NO product displays
  • NO winter / snow / nightfall / dark / cold / storm / horror — bright warm playtime light only
  • NO single-doll close-ups, NO posed glamour lineups — the frame is PACKED with 4-6 dolls IN MOTION
  • NO spilled / chaotic / messy / debris (girly props, not chaos)
  • NO LEGO / brick-built / studded minifigs — separate bot
  • NO plush stuffed-animals or Sackboy burlap — separate paths

⚠️ STRICT FORMAT — every entry is ONE sentence with EXACTLY 5 SEMICOLONS separating 6 slots in this order:

  [SLOT 1: REAL surface + UNEXPECTED BARBIE STORY SETUP]; [SLOT 2: PROTAGONIST BARBIE/KEN + their specific absurd action]; [SLOT 3: 3-5 SUPPORTING DOLL CAST each with DISTINCT actions, mix Barbies + Kens + sisters + Bratz]; [SLOT 4: GIRLY-LIFESTYLE SET DECORATION — 5-7 curated Pinterest-Barbie props]; [SLOT 5: WARM KID-PLAYROOM LIGHT]; [SLOT 6: WHIMSICAL ATMOSPHERIC OVERHEAD ELEMENT suspended or drifting].

If fewer than 5 semicolons or any slot missing, the entry is INVALID.

✓ MANDATORY VENUE VARIETY — distribute entries across these buckets, approximately ~25% DreamHouse/domestic + ~75% varied venues. For a 25-entry batch: ~6 DreamHouse, ~3 outdoor/nature, ~3 sports, ~3 nightlife, ~3 retail/food, ~2 travel, ~2 public-life, ~3 other-venues:

  A. OUTDOOR / NATURE — real beach sand / park grass / pool deck / picnic park / hiking trail / campground / ski slope / lake dock / garden / treehouse / driveway
  B. SPORTS / FITNESS — real tennis court / soccer field / basketball court / gymnastics mat / ice rink / roller rink / skate park / boxing ring / yoga studio / CrossFit gym
  C. NIGHTLIFE / ENTERTAINMENT — real disco floor / karaoke bar / concert stage / movie theater / bowling alley / arcade carpet / dance club / comedy-club stage / drive-in lot
  D. RETAIL / FOOD — real shopping mall / food court / Sephora-style counter / ice cream parlor / diner booth / coffee shop / boutique-fitting-room / flea market / farmers-market
  E. TRAVEL — real airport gate / subway platform / hotel lobby / cruise-ship deck / road-trip pit-stop / beach boardwalk / ferris-wheel car
  F. PUBLIC LIFE — real city sidewalk / playground sandbox / splash pad / public library shelf / museum bench / fountain rim / DMV waiting area
  G. DREAMHOUSE / DOMESTIC (~25%) — real DreamHouse foyer / spiral-staircase landing / bedroom playroom / toy-kitchen counter / bathroom counter / bedroom dresser / closet floor / rooftop deck

✓ STORY THEMES — pull from these and vary widely:
  • Black-market lip-gloss empire running out of the DreamHouse basement
  • Ken intervention staged by his closest doll friends
  • Barbie courtroom drama over stolen stilettos / accessories
  • Bratz-vs-Barbie turf war negotiation
  • Wedding ceremony crashed by Hot Wheels or another doll
  • Reality-TV cooking competition meltdown / soufflé collapse
  • Olympic disaster — gymnastics / figure skating / relay / pole vault
  • Senate hearing / town hall / courtroom over the Pink Convertible Affair
  • Spa-day catastrophic bath-bomb / face-mask experiment gone wrong
  • Talent-show finale with Ken judges visibly divided
  • Sister-summit between Barbie + Skipper + Stacie + Chelsea over closet rights
  • Campaign rally for class president
  • Fashion-week runway trip / collapse
  • Pool-party slip / cannonball disaster
  • Wellness-influencer livestream catastrophe
  • Heist crew mid-vault-crack on the dollhouse jewelry safe
  • Peace-negotiation between rival doll factions
  • Ken poker night with one Ken visibly bluffing
  • Pet-shop emergency after the plush dog ate something
  • Cake-decorating-show meltdown
  • Roller-derby title bout / boxing match knockout
  • Karaoke open-mic night cringe moment
  • Drive-in date night flirt-caught
  • Art-gallery date pretentious-debate
  • Underground fight-club / dance-off
  • Influencer press trip imploding
  • Mall food-court fight over last pretzel
  • Bowling-league scandal over a waxed lane

✓ GIRLY-LIFESTYLE SET DECORATION (SLOT 4) — every entry's prop list mixes 4+ of these categories (5-7 props total):
  A. GIRLY ACCESSORIES — designer handbags / clutch purses / heart-shape sunglasses / oversized hats / chunky bracelets / silk scarves / pearl necklaces / stiletto heels
  B. MAKEUP + BEAUTY — lipstick tubes lined up / perfume bottles / compact mirrors / nail-polish bottles / blush palettes open / mascara wands
  C. DRINKS — pink cocktail glasses with tiny umbrellas / rosé in tiny wine-glasses / iced lattes with whipped cream / fruity smoothies / champagne flutes / espresso shots
  D. PETS — a tiny plush cat / Pomeranian doll-dog with a pink bow / chihuahua in a designer handbag / parakeet in a cage
  E. FLOWERS + PLANTS — pink peony bouquets / single-stem roses / succulent planters / tropical-leaf arrangements / cherry-blossom branches
  F. OUTFIT PIECES — folded silk scarves / hanging dresses / bikini tops / oversized straw hats / stiletto heels lined up / designer shopping-bag pile
  G. SPORTS / FITNESS GEAR — yoga mat / tennis racket / golf clubs / surfboard / pickleball paddle / ski-poles / ice-skates with pink laces
  H. AESTHETIC LIFESTYLE — pink candles / framed Polaroid photos / open coffee-table books / fairy-lights / vinyl record player / vintage Polaroid camera
  I. TINY TECH — phone face-up with heart-emoji wallpaper / laptop with pink stickers / AirPods case / camera on strap / pastel headphones
  J. SNACKS + TREATS — macarons in tiny box / cupcakes on tray / sushi roll on plate / cake slice / donut tower / iced cookies arranged

The vibe is CURATED PINTEREST-BARBIE TABLEAU — feels intentional, like a Barbie magazine spread. NOT spills / chaos / debris.

Channel: Barbie movie set photography + Pinterest aesthetic doll diorama photography + kid's-playroom-moment captured with iPhone-camera energy. Saturated bright warm palette.`,
    touchpoints: [
      'Real hardwood bedroom floor beside the open DreamHouse at golden hour — Barbie black-market lip-gloss empire running its busiest hour with three buyers in line; a Barbie in satin trench coat mid-handoff of a tiny lip-gloss vial wrapped in a paper bag with shifty painted eyes; two Bratz-style dolls in metallic jackets recording the deal on tiny phones, a Ken bodyguard in black suit watching the door, a Barbie auditor in pearls counting cash made of paper, and a Skipper-style younger doll on lookout at the window; a hot-pink Birkin-style handbag draped across one chair, two tiny rosé wine-glasses on the desk, a tiny phone face-up showing a heart-emoji wallpaper, an open lipstick palette with three glossy shades pulled out, a Pomeranian plushie with a pink rhinestone collar curled on a velvet pillow, a single pink peony in a bud-vase, a small Polaroid camera with a developing photo poking out; warm afternoon sunbeam through gauze pink curtains painting everything in soft rose; a paper airplane drifting overhead labeled CEASE AND DESIST in pink crayon.',
      'Real backyard pool deck around an inflatable kiddie pool at midday — Barbie pool-party gone catastrophically sideways after Ken cannonballed onto the snack tray; a Barbie in a sequined two-piece mid-furious-point at the floating wreckage with one molded hand on hip and pearl earring catching the sun; a Ken in swim trunks frozen mid-shocked-shrug from the deep end, two Bratz-style sunbathers leaping out of recliners with iced-coffees flying, a Skipper-style sister filming everything vertically, and a second Barbie lifeguard mid-leap toward the pool; a heart-shaped sunglasses pair folded on a striped towel, a tiny iced latte with whipped cream, a flamingo pool-float still spinning, a small bouquet of pink peonies in a pitcher, a stack of fashion magazines tipped on the deck, a Pomeranian in a pink bow paw-deep in spilled fruit punch, a tiny phone face-down on a chaise; warm afternoon sunbeam reflecting off pool water painting the deck in turquoise highlights; a beach ball suspended mid-bounce above the chaos.',
      'Real soccer-field grass at golden hour — Barbie co-ed championship game derailed mid-penalty-kick after Ken sprinted onto the pitch with a sign reading WILL YOU MARRY ME; a Barbie in athletic gear mid-stomp toward Ken with both molded fists clenched and ponytail swinging dramatically; a Ken striker mid-shocked-freeze holding the proposal sign, two Bratz-style teammates doubled-over laughing, a Skipper-style referee blowing a tiny whistle, and a second Barbie goalie still in net pointing furiously; a glittery athletic headband on the bench, a tennis-racket leaning against a Lululemon-style water bottle with pink lid, a tiny iced matcha with bendy straw, a pearl-stud earring sitting on the bench rail, an open compact mirror flipped to its mirror side, a single pink rose tucked into a clipboard, a small bouquet of cosmos in a thermos beside a folded sunglasses; warm orange-pink dusk light through stadium banners painting everything amber; a kite caught mid-flight overhead trailing a hand-lettered NO ribbon.',
      'Real diner booth red-vinyl surface at noon — Barbie televised breakup brunch going catastrophically off-script after Ken produced a counter-cliché ring instead of accepting hers; a Barbie in a brunch-set silk blouse mid-tearful-power-point with one polished hand splayed dramatically across her glossed lipstick and pearl earrings catching the diner lights; a Ken in a tucked button-down extending a tiny velvet ring-box with sheepish painted eyes, a Bratz-style waitress frozen mid-pour of a pink mimosa, a Skipper-style food-vlogger filming through a phone-tripod, and a second Barbie in oversized sunglasses dramatically sipping a coffee in the next booth pretending not to listen; a designer crocodile-print clutch tipped on its side, two pink-mimosa-glasses with tiny umbrella garnishes, an open lipstick tube beside a compact mirror, a tiny phone face-up showing a heart-emoji notification, a chihuahua in a designer tote peering over the booth-edge, a single pink rose in a milk-glass bottle, a stack of brunch-magazines fanned out; warm noon diner overhead-light bright and crisp catching glossy plastic surfaces; confetti drifting across the upper frame in a slow-motion shower from the staged engagement someone clearly planned the wrong way.',
      'Real DreamHouse spiral-staircase landing at midday — Barbie reality-TV reunion-special mid-confrontation as accusations fly about who unfollowed who; a Barbie in a structured power-blazer mid-furious-finger-point at a Bratz-style co-star one stair down with painted-glossy-lips set in righteous fury; a Bratz-style doll in sequined dress with both arms thrown defensively wide, two Ken cameramen frozen mid-zoom with adjustable lights bouncing pink, a Skipper-style PA holding cue cards labeled DRAMA SCENE 4 mid-mouth-drop, and a second Barbie therapist in glasses taking dramatic notes from the lower step; a marabou-trim feather-boa draped across the railing, two champagne flutes half-full on a tray, a designer red-bottom stiletto abandoned mid-step like a glass slipper, an open lipstick palette beside a compact mirror, a tiny phone face-up showing 47 missed calls, a single pink peony fallen from a banister-vase, a Pomeranian in a rhinestone collar peeking from behind a banister-pillar; warm afternoon sunbeam through the DreamHouse skylight painting everything in soft-pink, glitter-dust drifting through the air around the scene like a slow gossip-tabloid magic; a paper airplane suspended mid-flight overhead with TEAM BARBIE scrawled in marker.',
      'Real shopping-mall floor outside a Sephora-style counter at midday — Barbie squad meltdown after a Bratz fight broke out at the lipstick wall over the last bullet of a limited shade; a Barbie in a designer trench coat mid-jaw-drop with shopping-bag handles slipping off her wrist and a perfectly painted glossy expression of professional outrage; a Bratz-style doll mid-arm-wrestle with another Bratz over a single lipstick at the counter, two Ken security guards in matching black tees trying to step between them, a Skipper-style influencer livestreaming the whole thing through a button-phone, and a second Barbie store-clerk frozen behind the counter holding a clipboard; a row of designer pink shopping-bags spilling tiny tissue paper, two iced-lattes with whipped-cream tipping precariously on the counter, an open lipstick palette with eight shades pulled out at angles, a compact mirror flipped open beside a pile of glossy magazines, a tiny phone face-up with a heart-react notification visible, a tiny chihuahua in a designer tote peeking out from one shopping-bag, a stack of macarons in a pastel box mid-tipped; warm mall overhead-fluorescent light bright and crisp on the polished floor; a paper airplane drifting overhead with SALE in pink marker on both wings.',
      'Real comedy-club stage planks at midnight under warm spotlights — Barbie open-mic comedy night bombing publicly mid-punchline as the audience visibly turns; a Barbie in sequined blazer at the matchbox mic-stand mid-uncomfortable-stretched-pause with painted-glossy-lipstick eyes pleading for laughs; a Ken heckler in the front row mid-mouth-cup yelling something inaudible, two Bratz-style audience members groaning into their iced cocktails, a Skipper-style cocktail server frozen mid-tray-balance with three drinks, and a second Barbie producer offstage mid-face-palm with both hands; a designer leather clutch slumped on a stool, two pink-cocktail-glasses with tiny umbrellas on a stage-edge stool, a tiny disco-ball reflecting warm spots across painted-doll faces, an open lipstick tube beside a compact mirror on a backstage table, a tiny phone face-up showing zero notifications, a stack of cocktail-napkins half-flipped, a pearl-necklace looped around a chair-back; warm pink LED-spotlights painting the stage in flattering hot-pink against deep-shadow audience; a paper-cone party-hat suspended mid-air above the scene having clearly fallen off someone earlier.',
      'Real ice-rink surface at morning practice — Barbie figure-skating championship mid-fall as the lead doll wipes out spectacularly during a triple-axel attempt; a Barbie in a sparkle-leotard mid-wipeout with both molded arms thrown skyward and one skate-blade pointed dramatically wrong with painted-pristine-makeup somehow still perfect; a Ken coach mid-hands-on-head despair from the sideline, two Bratz-style judges holding up tiny scorecards reading 4.5 and 3.0, a Skipper-style commentator narrating into a button-mic in shocked tones, and a second Barbie rival skater visibly trying not to smile from the side; a designer fur-trim coat draped over the rink-side bench, two tiny thermos-cups of hot cocoa with marshmallow garnish, a heart-shape sunglasses pair folded on a folded magazine, a tiny phone face-up showing the routine playback, a pair of ice-skates with pink laces lined up at attention, an open compact mirror beside a small rose-bouquet, a pearl-bracelet looped around the bench-rail; warm morning sunbeam through the rink skylight painting the ice in soft golden highlights; a kite-shape banner suspended mid-flight overhead with the figure-skater silhouette logo.',
      'Real Sephora-style vanity counter at midday — Barbie wellness-influencer livestream catastrophe mid-segment as the smoothie cup catastrophically caught fire from the wellness-candle; a Barbie in athleisure-set with ring-light halo mid-forced-serene-smile directly at a matchbox camera while one molded hand holds a smoothie cup that is visibly on fire; a Ken cameraman mid-wide-eyed-still-rolling-zoom because the content is too good to stop, a Bratz-style assistant sprinting frame-left with a damp cloth in pure adrenaline, a Skipper-style editor watching the live feed with paws-over-face peeking through fingers, and a second Barbie brand-partner seated to the side with a sponsored product held forward still smiling because she has not yet processed; a real cotton-ball steam cloud propped on toothpicks above the burning smoothie, a real ring-light made from a jar-lid with foil propped on a button-leg tripod, real sticky-note script cards face-down where they fell, a hand-lettered TAKE ONE — GOLDEN HOUR VIBES clapboard on a folded notecard, a dried-flower bouquet tipped sideways, a tiny phone face-up showing live-viewer count climbing; warm morning sunbeam through gauze curtains painting everything in soft pastel apricot; petals drifting in a slow hovering shower across the upper frame from the wellness-arrangement nobody secured.',
      'Real karaoke-bar booth red-leather at midnight under hot-pink LED string lights — Barbie open-mic night mid-screaming-Whitney-Houston with friends visibly cringing politely; a Barbie in oversized blazer at the matchbox mic-stand mid-belt with both molded arms thrown skyward and ponytail electric with passion and zero pitch-control; a Ken bartender frozen mid-cocktail-pour spilling pink slush onto the bar, two Bratz-style audience friends covering their mouths through pained smiles, a Skipper-style sister filming everything with a sparkly button-phone, and a second Barbie performer waiting her turn mid-flask-sip with raised eyebrows; a designer clutch with a karaoke-mic-charm on the table, two pink-cocktail glasses with tiny paper umbrellas, a disco-ball keychain dangling from a tote handle, an oversized round-sunglasses pair on the table, a compact mirror face-up mid-touchup, a tiny phone with a karaoke-app score showing 47 out of 100, a pink rose in a bud-vase beside a cracked-screen lipstick palette, a chihuahua in a designer tote peeking out from a seat; warm hot-pink LED-string-light glow casting a flattering pink wash across the whole booth scene; a paper song-title slip floating overhead having been released dramatically.',
      'Real campground dirt around a real twig-fire pit at dusk — Barbie wilderness retreat mid-emergency as Ken visibly fails to start the fire and a Bratz-style camper tries to step in; a Ken in a flannel shirt mid-defeated-shrug holding two unlit sticks while his glossy hair somehow stays perfect through the wilderness humiliation; a Barbie in a stylish camp-jacket mid-knowing-side-eye sipping rosé from a thermos, two Bratz-style campers attempting to take the sticks from Ken with patient firmness, a Skipper-style sister roasting a single marshmallow on a button-skewer, and a second Barbie wilderness-influencer filming everything on a button-phone; a designer cooler tote with a pink-thermos sticking out, two heart-shape sunglasses folded on a folded camp-chair, a tiny phone face-up showing a fire-starting YouTube tutorial, a small bouquet of dried baby\'s-breath in a thermos-vase, a stack of fashion-magazines doubling as kindling, a tiny iced-rosé beside a folded silk scarf, a Pomeranian in a pink bandana watching from atop a sleeping-bag; warm campfire glow flickering off the pink-jacket and rosy painted-makeup; confetti drifting overhead from a celebratory wilderness-arrival earlier in the day.',
      'Real boxing-ring canvas at midnight under hot spotlights — Barbie + Bratz title bout mid-knockout-swing in front of a packed ringside crowd; a Barbie in athletic shorts and gloves mid-mountain-haymaker with one molded fist mid-arc and her painted-glossy-makeup somehow pristine through the throwdown; a Bratz-style challenger in a sequined hood mid-defensive-block with shoulders raised, a Ken ring-announcer mid-shocked-mouth-drop from the corner, two Skipper-style cornermen with towel and water-bottle frozen mid-reach, and a second Barbie referee mid-arm-raise about to call the knockout; a glittery pink boxing-glove pair lined up at the corner, two iced sports-drinks with pink lids on the corner stool, a designer water bottle with a sparkly cap, an open compact mirror flipped to mirror beside a hairbrush, a single pink-rose-bouquet from earlier ceremony, a tiny phone face-up showing the round-timer, a sponsorship banner with a designer logo half-tipped on the corner-post; warm hot spotlight from above painting the canvas in pink-tinged drama; a paper airplane drifting overhead labeled CHAMPION mid-flight.',
      'Real ski-slope plastic-snow on the toy gondola platform at golden hour — Barbie ski-trip disaster mid-yard-sale-fall as the lead Barbie\'s gear flies off in every direction; a Barbie in fur-lined snow jacket mid-cartoonish-tumble with both ski-poles spinning skyward and one pink ski-boot mid-flight; a Ken instructor mid-mouth-cup-shout from below, two Bratz-style friends already at the bottom doubled-over laughing into their thermoses, a Skipper-style younger doll filming the whole tumble vertically, and a second Barbie ski-lodge attendant rushing up with a clipboard; a tiny ski-pole leaning against the gondola bench, a fluffy pom-pom pink beanie hanging on the seat, a thermos of hot cocoa with a marshmallow garnish, two heart-shaped sunglasses on a folded ski-bib, a pink fur-lined snow-boot tipped slightly on its side, a tiny ski-pass on a lanyard, a small bouquet of dried baby\'s-breath in a thermos-vase; warm golden-hour light slanting across the plastic-snow painting everything in flattering peach-pink; a kite caught mid-flight overhead trailing a YETI MOUNTAIN banner.',
      'Real DreamHouse closet floor with hanging dresses overhead — Barbie wardrobe-emergency meltdown 20 minutes before a big event over a missing earring; a Barbie in a silk robe mid-tearful-knee-dive into a pile of fashion-magazines with both polished hands clutching a single earring desperately; a Ken in a tuxedo half-tied mid-confused-shrug from the doorway, two Bratz-style stylist friends sprinting opposite directions through dress-racks, a Skipper-style sister holding up two identical earrings she found, and a second Barbie best-friend mid-laugh-and-cry hybrid from a pink chaise; a row of designer shopping-bags lined against the wall, two heart-shape sunglasses folded on a pink poof-ottoman, an open compact mirror beside three lipstick tubes lined up, a hairbrush abandoned in the dress-rack, a tiny phone face-up showing a countdown timer to the event, a Pomeranian in a pink bow watching from atop a dress-bag, a tiny iced latte tipping on the vanity, a pearl-bracelet stack on the chaise; warm pink LED-vanity-light glow painting everything in flattering hot-pink; a hanger suspended mid-air overhead having visibly flown from someone\'s grip.',
      'Real arcade carpet beneath a claw machine at midday — Barbie arcade-night drama as Ken visibly cheats at the skee-ball lane next to her; a Barbie in a fitted athletic-jumpsuit mid-furious-skee-ball-throw with both molded arms in perfect form and her ponytail swinging mid-rage at Ken\'s antics; a Ken in a striped polo mid-sketchy-side-eye while clearly nudging a skee-ball with his polished plastic toe, two Bratz-style friends doubled-over laughing into their iced slushies, a Skipper-style arcade-attendant frozen mid-prize-handout with a stuffed-claw-machine bear, and a second Barbie scorekeeper writing on a tiny clipboard with raised eyebrows; a designer fanny-pack on a stool, two oversized round-sunglasses on a folded jacket, an open compact mirror flipped to mirror, a tiny phone face-up showing a high-score leaderboard, a chihuahua in a designer tote peeking from a chair, a row of tiny arcade-tickets fanned across the carpet, a pink-cocktail glass with a tiny umbrella on the side-rail; warm arcade-neon glow casting hot-pink and blue across the carpet and painted-doll faces; a kite caught mid-flight overhead labeled CHEATER in pink crayon.',
      'Real bowling-alley lane hardwood at noon — Barbie league-championship scandal mid-confrontation after Barbie accused Ken of secretly waxing her lane for sabotage; a Barbie in a color-blocked bowling jumpsuit mid-furious-point at a suspicious scuff mark with molded fist on hip and glossy lipstick absolutely pristine through the outrage; a Ken bowler frozen mid-innocent-shrug still holding the ball mid-approach, a Bratz-style doll in a rhinestone bowling shirt doubled over laughing, a Skipper-style scorekeeper waving a paper scorecard as evidence, and a second Ken hiding his face behind a rental bowling shoe; a tiny pink bowling bag with charm zipper, two miniature score-pencils crossed like swords on the console, a doll-scale iced lemonade with a bendy straw, pearl stud earrings sitting on the ball-return ledge, a compact mirror flipped open, a tiny friendship-bracelet stack on the bench edge, a single pink carnation tucked into the bag\'s pocket; warm fluorescent ceiling-light overhead bright and crisp making the lane shine; a paper score-sheet suspended mid-air above the lane having dramatically been flung.',
      'Real beach sand at golden hour beside a driftwood stage — Barbie bachelorette weekend mid-talent-show crisis after Malibu Barbie accidentally sang the wrong bride\'s name; a Barbie in a sequined two-piece mid-horrified-cover-of-mouth with painted eyes wide as saucers and one heel sinking dramatically into the sand; a Bratz-style doll in a fringed halter dropping her drink mid-laugh, a Ken emcee desperately flipping through cue-cards with a panicked expression, a Skipper-style sister filming vertically on a button-phone, and a second Barbie bride frozen mid-bouquet-toss in disbelief; a tiny straw beach-tote with fashion magazines spilling out tastefully, two heart-shaped sunglasses on a folded towel, a coconut drink with a tiny umbrella and lime wedge, pink peony blooms in a thermos-vase, a pearl-clutch on the sand, bikini straps draped over a driftwood prop, a Polaroid camera with a developing photo poking out; warm amber golden-hour light skimming across the sand painting every doll in tangerine glow; a veil caught mid-flight on the breeze spinning dramatically overhead.',
      'Real airport-gate tile floor at midday — Barbie and Ken couples-vacation disintegrating at Gate 7B after Ken lost both passports and the boarding passes simultaneously; a Barbie in a silk trench coat and oversized sunglasses mid-furious-whisper-argument leaning into Ken\'s plastic face with one molded hand gesturing at the gate sign; a Ken in a linen blazer holding an empty document wallet upside-down with a baffled expression, a Bratz-style friend in platform sneakers trying not to laugh openly, a Skipper-style sister with a backpack recording the whole scene through her button-phone, and a second Barbie rolling a tiny suitcase away from the chaos pretending she does not know either of them; a designer carry-on tote tipped on its side with a silk-scarf trailing, two heart-shape sunglasses pairs (one folded, one half-knocked-over), a tiny iced-latte with whipped cream half-empty on a chair-arm, an open compact mirror with a finger-print smudge, a tiny phone face-up showing a flight-delayed notification, a Pomeranian in a pink rhinestone-collar peeking from the tote, a stack of fashion-magazines on the chair beside a single white rose someone dropped; warm midday fluorescent overhead-light bright and crisp catching glossy plastic surfaces; a paper airplane drifting overhead with HOPE YOU PACKED PATIENCE scrawled across one wing.',
      'Real toy-kitchen counter beside a ceramic fruit bowl at midday — Barbie reality-TV cooking competition mid-meltdown as a signature pink soufflé visibly collapses on camera; a Barbie chef in a molded white apron mid-desperate-lunge toward the deflating soufflé with both polished hands outstretched and a comically panicked glossy-lipped expression; three Kens in paper chef-hats clutching clipboards labeled JUDGE with faces collectively saying disaster, a Bratz-style co-contestant in a sequin apron celebrating too early with arms raised, and a Skipper-style host narrating into a hairbrush microphone with raised eyebrows; real cotton-ball smoke clouds propped on toothpicks above the tilting cake, a real wooden spoon and tiny whisk on the counter, a hand-lettered TAKE 4 clapboard on a folded notecard, a tiny phone face-up with a heart-emoji wallpaper showing 13 missed calls, a pearl-bead necklace draped on a spice-jar prop, two open lipstick tubes beside the set like a judge is mid-touchup, a single pink peony fallen from the prop-vase; warm kitchen overhead fluorescent light casting everything bright and crisp; confetti drifting across the upper frame in a slow-motion shower from a burst prop streamer.',
    ],
    instructions: `Each entry is ONE storytelling scene, 80-110 words, semicolon-separated 6 slots. Format: "Real <surface> — <story setup>; <protagonist + action>; <3-5 supporting cast each with distinct actions>; <5-7 girly-lifestyle props>; <warm light>; <overhead element>." Mix venues per the variety mandate (~25% DreamHouse, ~75% varied venues across the A-G categories). Mix story themes widely from the list above. Mix doll cast across Barbies + Kens + Skipper-style sisters + Bratz-style friends per entry. Each prop list mixes 4+ categories from A-J. CURATED PINTEREST-BARBIE TABLEAU vibe — NOT spills / chaos / debris. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry. NO preamble, NO commentary, NO markdown fences.`,
  },

  // ═══════════════════════════════════════════════════════════
  // DINO-DIORAMA path (2026-05-24) — real plastic TOY DINOSAURS in a
  // handmade CLAYMATION prehistoric world. dino_toy_cast is SHARED with
  // the future dino-mischief sister path.
  // ═══════════════════════════════════════════════════════════

  dino_toy_cast: {
    format: 'simple',
    theme: `REAL TOY DINOSAUR cast descriptions — the heroes of both dino paths (SHARED pool). Each entry is a small CAST of 2-4 plastic/vinyl TOY dinosaurs of varied species, materials, colors and sizes. They MUST read unmistakably as TOYS — glossy injection-molded plastic or soft rubber/vinyl, visible mold-seams, hard-plastic sheen, slightly-scuffed factory paint, toy proportions. NEVER real living dinosaurs, NEVER clay/sculpted dinosaurs (these are store-bought plastic toys).

✓ SPECIES VARIETY across the pool — T-rex, triceratops, stegosaurus, brontosaurus/apatosaurus, velociraptor, spinosaurus, ankylosaurus, parasaurolophus, pteranodon, dilophosaurus, brachiosaurus, allosaurus, dimetrodon. Mix a clear HERO dino + 1-3 supporting dinos of different species per entry.
✓ MATERIAL/FINISH VARIETY — glossy hard plastic, matte rubber, translucent jelly-plastic, flocked-velvet, glow-in-the-dark plastic, metallic-painted, two-tone factory paint, single-color mono-molded (like army-men but dino).
✓ COLOR VARIETY — emerald green, teal blue, olive drab, blaze orange, mustard yellow, brick red, grey, purple, sand-tan, mottled two-tone.

🚫 NO real dinosaurs, NO clay dinosaurs, NO CGI, NO humans, NO scene/setting (cast ONLY — the world comes from other axes).`,
    touchpoints: [
      'a glossy emerald-green plastic T-rex toy with a wide-open red-painted mouth and tiny scuffed teeth as the hero, flanked by a stout teal-blue rubber stegosaurus toy with cream-painted plates and two small olive-green plastic raptor toys — all visible mold-seams and hard-plastic sheen',
      'a big mustard-yellow plastic brontosaurus toy with a long curving neck, a brick-red triceratops toy with chipped horn-paint, and a translucent-orange jelly-plastic pteranodon toy — store-bought dinosaur figures, glossy and toy-scale',
      'a mono-molded army-green plastic spinosaurus toy (single solid color, like a green-army-man dino) leading a trio of identical smaller green plastic raptors, plus one odd flocked-velvet purple triceratops that clearly came from a different toy set',
      'a glow-in-the-dark pale-green plastic stegosaurus, a metallic-bronze-painted ankylosaurus toy with a club tail, and a tiny grey rubber dimetrodon — mismatched dinosaur toys from different bins, varied finishes',
      'a two-tone green-and-tan plastic T-rex toy mid-roar as hero, a small blue parasaurolophus toy, a sand-colored matte-rubber velociraptor, and a chunky brick-red ankylosaurus — visible factory paint slop and mold-lines',
      'a sleek teal vinyl velociraptor toy with a glossy sheen, a stubby orange rubber triceratops, and a long purple brachiosaurus toy towering over them — clearly plastic toys with scuffed edges',
      'a hero olive-drab plastic allosaurus with a red-painted gash detail, a pair of tiny yellow plastic compsognathus toys, and a grey dilophosaurus toy with a translucent frill — hard injection-molded plastic, toy proportions',
      'a chunky cobalt-blue plastic ankylosaurus, a flocked-green stegosaurus, and a tall mustard brachiosaurus toy whose neck bends at a visible joint-seam — a mixed handful of dinosaur toys',
      'a fierce orange-and-black striped plastic T-rex toy, a small white rubber pteranodon, and a squat grey triceratops with worn nubs of paint on the horns — glossy toy plastic with mold-seams down each side',
      'a translucent-blue jelly-plastic spinosaurus toy that catches the light, a matte sand velociraptor, and a tiny green brontosaurus — soft-rubber and hard-plastic dinos mixed, all unmistakably toys',
    ],
    instructions: `Each entry 25-50 words. A CAST of 2-4 real plastic/vinyl/rubber TOY dinosaurs — name a clear hero dino + supporting dinos of varied species + colors + finishes. Always read as TOYS (mold-seams, plastic sheen, scuffed paint). NO setting, NO clay dinos, NO real dinos. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_scenario: {
    format: 'simple',
    theme: `PREHISTORIC SCENARIO + DINO ACTION descriptors for dino-diorama — the headline story beat. Each entry is ONE fun mid-action prehistoric situation the toy dinosaurs are CAUGHT IN. Combines what's happening + what the dinos are DOING. Mid-motion, story-readable, playful peril/adventure.

✓ VARIETY — distribute across: volcanic peril (fleeing an eruption, dodging lava-bombs, crossing a smoking lava-crack), tar-pit drama (a dino half-sunk while others form a rescue chain, peering at a stuck toy), watering-hole tension (rival dinos facing off across a clay pool, a sneaky raptor stalking), river crossing (wading a clay river, leaping stepping-stones), nest/hatchling beats (defending a clay nest of eggs, hatchlings emerging, a parent shielding babies), meteor moment (dinos craning up at a meteor streaking overhead), herd migration (a line of dinos trekking past the anchor), standoff/chase (a T-rex chasing raptors, a triceratops charging), discovery (dinos gathered around something odd).

🚫 NO modern weapons, NO gore, NO humans (unless a surprise axis adds one), NO static lineup. Keep it FUN and toy-playful, not grim.`,
    touchpoints: [
      'the hero T-rex toy frozen mid-roar at the edge of a smoking lava-crack while two raptor toys scramble back from spattering clay lava-bombs, tails mid-swing',
      'a pack of raptor toys stalking low through dense clay ferns toward an unaware brontosaurus toy grazing in a sunlit clearing, bodies tensed mid-creep',
      'two rival dinosaur toys facing off nose-to-nose on an open clay ridge, a third raptor toy creeping low through the clay ferns behind them, dust kicked up',
      'a parade of dinosaur toys mid-trek along a winding clay ridge, the hero brachiosaurus toy at the front craning its long neck, smaller dinos strung out behind into the distance',
      'a triceratops toy charging head-down at a startled allosaurus toy that rears back mid-stumble, kicked-up clay dust frozen mid-air between them',
      'a parent stegosaurus toy arched protectively over a clay nest of pale eggs while a sneaky raptor toy peeks over a clay boulder, one egg visibly cracking open',
      'the whole dino cast craning their heads skyward, mouths open, as a meteor streaks overhead trailing a clay-smoke tail toward the horizon',
      'a raptor toy scrambling up a steep clay rock-face after a fleeing smaller dino, loose clay scree tumbling down the slope behind them',
      'a T-rex toy mid-chase after a fleeing pack of tiny raptor toys weaving between clay cycad-trunks, everyone caught at full sprint',
      'the dino cast gathered in a curious half-circle peering down at something glinting in the clay mud, the hero dino nudging it with its snout',
    ],
    instructions: `Each entry 25-45 words. ONE fun mid-action prehistoric story beat: what's happening + what the toy dinos are DOING (mid-motion). Playful, story-readable. NO static lineups, NO gore, NO modern objects. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_biome: {
    format: 'simple',
    theme: `CLAY PREHISTORIC BIOME descriptors for dino-diorama — the sculpted environment + terrain the toy dinos inhabit. Each entry is ONE rich prehistoric WORLD-TYPE rendered entirely as HANDMADE SCULPTED CLAY (matte Plasticine, thumbprinted, tool-marked), with built-in terrain features (rock, elevation, vegetation — and standing water for only about HALF of them). This is the stage — make it VARIED and visually distinct from entry to entry.

⚠️ WATER BALANCE — AT MOST HALF the entries may feature standing water (lake / river / swamp / pool / surf / spring). The OTHER HALF must be DRY land with NO water feature at all (deep forest, flowering meadow, desert dunes, rock badlands, mossy grove, plateau, cave). We are fixing a "river in every scene" problem — do NOT default to water.

✓ HUGE VARIETY MANDATE — spread WIDE across world-types; do NOT default to volcanic. Include: lush emerald fern-jungle, broad mirror LAKE / lagoon ringed by clay shore, a rushing RIVER valley with clay rapids + waterfalls, glowing MUSHROOM forest, towering REDWOOD / sequoia grove, bioluminescent night SWAMP, crystal CAVERN with clay geodes, desert OASIS with clay palms + pool, rainbow geothermal hot-springs, frozen LAKE + clay icebergs, deep CANYON river-delta, misty cloud-forest plateau, flowering MEADOW + clay wildflowers, coastal CLIFFS + clay surf + tide-pools, mangrove wetland, layered badlands hoodoos, amber-pine forest, terraced clay-pool cascades, volcanic rock field (ONE option among many — keep it to ~1 in 8 entries, NOT the default).

🚫 The environment is ALWAYS clay (never real nature, never CGI). NO dinosaurs here (they come from cast), NO modern objects. Vary terrain, water, color and elevation widely.`,
    touchpoints: [
      'DRY: a lush emerald clay fern-jungle — dense hand-rolled clay tree-ferns and cycads, mossy clay boulders, thick dappled clay-leaf undergrowth carpeting the forest floor, no water',
      'DRY: a glowing clay mushroom forest — giant pink, teal and orange clay toadstools of every size, springy clay moss floor, soft bioluminescent clay glow, no water',
      'DRY: a towering clay redwood grove, massive ridged clay trunks receding into misty distance, a soft carpet of clay needles and clay ferns below, no water',
      'DRY: a flowering clay meadow rolling to the horizon — clay wildflowers in yellow, violet and coral, tufted clay grass and clay shrubs, soft clay hills behind, no water',
      'DRY: a golden clay desert of sculpted dune-ridges and wind-rippled clay sand, scattered dry clay rock-spires and bleached clay bones under a low clay sun, no water',
      'DRY: jagged volcanic clay badlands of black-and-rust-red sculpted clay rock, drifts of grey clay ash, cracked clay ground and angular clay boulders, no water',
      'DRY: a misty clay cloud-forest plateau, gnarled moss-draped clay trees, clay tree-ferns and clay orchids, layered clay ridges fading into haze, no water',
      'DRY: a clay boulder-field of mossy rounded clay rocks and lichen-clay patches, scrubby clay bushes between them, dry cracked clay earth, no water',
      'DRY: an amber-pine clay forest of tall conifer clay trees, a thick carpet of clay needles and clay pinecones, golden clay light filtering through, no water',
      'WATER: a broad mirror-flat clay lake ringed by a thumbprinted clay shore, tiny clay islands dotting the water, soft clay hills rolling back behind it',
      'WATER: a rushing clay river valley with sculpted white clay rapids and a small clay waterfall, smooth clay boulders splitting the current, ferny clay banks',
      'WATER: rugged clay coastal cliffs with clay sea-stacks and frothy white clay surf frozen mid-crash, scattered clay tide-pools along the rocks',
    ],
    instructions: `Each entry 20-42 words. ONE distinct prehistoric WORLD-TYPE rendered as HANDMADE SCULPTED CLAY (terrain + elevation + vegetation). ⚠️ AT LEAST 7 of every 10 entries are BONE-DRY land with NO water of any kind (forest / meadow / dunes / rock / plateau / boulder-field / pine-forest). ONLY ~2-3 in 10 may have water (lake / river / surf). We are fixing a "river in every scene" problem — heavily favor DRY land. Volcanic is only ~1 in 10. NO dinosaurs, NO modern objects, NO real nature. Drop the leading "DRY:"/"WATER:" tag from the actual output. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_anchor: {
    format: 'simple',
    theme: `MONUMENTAL CLAY ANCHOR descriptors for dino-diorama — the ONE impossibly-big hero element that dominates the background and dwarfs the toy dinos (playbook component #1). Each entry is a single show-stopping sculpted-clay landmark, rendered LARGE and dramatic.

✓ VARIETY — an erupting clay volcano (lava fountain + billowing grey clay mushroom-cloud against the sky, like the reference), a giant meteor streaking down trailing clay-smoke / a fresh glowing crater, a towering clay waterfall thundering into a misty clay gorge, a colossal sky-high clay cliff/mesa, a massive glacier wall of blue clay ice, a giant geyser erupting a column of clay water + steam, a colossal amber-resin clay tree oozing golden clay sap, a vast tar-lake with a sunken clay skeleton, a huge clay storm-wall with clay lightning, an enormous fallen clay log spanning the frame.

⚠️ VARIETY OVER VOLCANO — the erupting volcano is only ONE option; use it AT MOST ~1 in 6 entries. Lead hard with the OTHERS (waterfalls, crystal spires, colossal trees, geysers, glaciers, rock-arches, giant skeletons, storm-walls, meteors, terraced cascade-falls, sky-high mesas).

🚫 Render it BIG and background-dominating. ALWAYS clay. NO modern structures.`,
    touchpoints: [
      'a towering erupting clay volcano dominating the background — a bright orange-and-yellow clay lava fountain spewing upward into a huge billowing grey clay mushroom-cloud of smoke against the sky',
      'a giant meteor streaking down across the whole sky, a fireball head of glowing orange clay trailing a long smoking clay tail toward the horizon, lighting the scene from above',
      'a colossal clay waterfall thundering down a sheer clay cliff into a churning misty clay plunge-pool, white clay spray frozen mid-fall, rainbow haze implied',
      'a massive wall of blue-white clay glacier ice rising across the entire background, deep clay crevasses and icicle-spikes, a calving chunk frozen mid-tumble',
      'an enormous geyser erupting a tall column of glossy clay water and cotton-wool steam high into the sky, dwarfing the toy dinos clustered at its base',
      'a colossal ancient clay tree oozing rivers of golden amber-resin clay down its trunk, a tiny dino toy half-trapped in a glob of the glossy sap',
      'a vast black tar-lake stretching to the horizon with the half-sunken clay ribcage of a giant prehistoric skeleton arching out of the glossy surface',
      'a giant clay storm-wall of bruised purple-grey thunderheads filling the background, a jagged bolt of yellow clay lightning frozen striking the ridge',
      'an immense fallen clay log, mossy and cracked, spanning the entire frame like a bridge, the toy dinos crossing along its top dwarfed by its girth',
      'a sky-high red-clay mesa spire striped with layered strata towering over the diorama, its shadow falling long across the clay flats below',
    ],
    instructions: `Each entry 20-40 words. ONE monumental sculpted-CLAY hero landmark, rendered LARGE + background-dominating so the toy dinos read tiny against it. ALWAYS clay. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_craft: {
    format: 'simple',
    theme: `HANDMADE CLAYMATION CRAFT-DETAIL descriptors for dino-diorama — the little handcrafted touches that sell the stop-motion-diorama charm (material truth, playbook component #6). Each entry is a short cluster of tactile clay-craft details.

✓ VARIETY — visible thumbprints + sculpting-tool grooves in the clay, fingerprint-dimpled clay rocks, glossy-lacquered clay water with sculpted ripples, hand-rolled fluffy clay clouds, cotton-wool smoke/steam, pipe-cleaner-and-felt foliage, tiny seed-bead pebbles, toothpick-and-clay trees, visible armature wire peeking from a clay cliff, matte-vs-glossy clay contrast, slightly-squashed asymmetric hand-shaped forms, a stray real-world texture (corduroy hills, sponge moss).

🚫 Detail touches ONLY — NO dinosaurs, NO full scene, NO modern objects.`,
    touchpoints: [
      'visible thumbprints and sculpting-tool grooves pressed all across the matte clay terrain, fingerprint-dimpled clay boulders catching the light',
      'matte sculpted clay rocks with deep tool-gouges beside softly-rounded thumb-pressed clay mounds, dry and richly tactile',
      'hand-rolled fluffy clay clouds and puffs of real cotton-wool smoke drifting across the sky, slightly squashed and asymmetric',
      'pipe-cleaner-and-felt clay ferns, toothpick-trunked clay trees, tiny seed-bead clay pebbles scattered across the ground',
      'a hairline crack and a wisp of stray armature wire peeking from the base of a clay cliff, betraying the handmade puppet-set craft',
      'matte clay boulders dusted with fine clay-powder, fine hairline shrinkage-cracks crazing across a dried clay slope',
      'tiny tool-carved striations in the clay strata, a thumb-smoothed clay ridge, a scatter of fingerprints left in the soft clay ground',
      'cotton-ball steam tufts on hidden toothpicks, hand-pinched clay flames with a glossy highlight, sculpted clay ash flecks',
      'corduroy-textured clay hills and sponge-textured clay moss, a felt-strip clay meadow, charmingly imperfect hand-shaped forms',
      'soft asymmetric hand-squashed clay forms throughout, a slightly-melty clay rock, visible palm-smear marks across the diorama base',
    ],
    instructions: `Each entry 15-30 words. A short cluster of tactile HANDMADE CLAY craft details (thumbprints, tool-marks, dry clay texture, cotton-wool smoke, felt/pipe-cleaner foliage, cracks, moss). Detail ONLY — NO dinos, NO modern objects. ⚠️ NO water / puddle / river / pond / stream / winding-path (water comes from the biome only). Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_critters: {
    format: 'simple',
    theme: `SECONDARY CRITTER + SCALE-PROVER descriptors for dino-diorama — small background life and tiny details at multiple depths that fill the world and prove the scale of the anchor (playbook components #2/#3). Each entry is a small cluster of mid/far-distance life.

✓ VARIETY — tiny clay pterosaurs wheeling overhead, a baby toy dino peeking from behind a rock, clay dragonflies/bugs near the water, little clay fish in a clay stream, a clay nest of eggs in the distance, a far-off tiny herd silhouette near the anchor, clay frogs on a lily-pad, a clay snail on a fern, tadpoles in a clay puddle, a tiny scuttling clay lizard.

🚫 SMALL + mid/far distance ONLY (never bigger than the hero dinos). NO modern objects, NO humans.`,
    touchpoints: [
      'three tiny clay pterodactyls wheeling high overhead in a loose V, silhouetted against the sky near the anchor',
      'a baby green plastic dino toy peeking wide-eyed from behind a clay boulder in the midground, half-hidden',
      'a fat clay bumblebee and an iridescent clay beetle crawling over a broad clay fern frond in the foreground',
      'a little clay armadillo-creature and a long clay millipede trundling across the clay ground between the rocks',
      'a far-off tiny silhouetted herd of dino toys strung along the distant ridge beneath the towering anchor, proving its scale',
      'a clay nest of pale speckled eggs tucked in the mid-distance ferns, one egg with a tiny crack and a beak poking out',
      'a clay snail inching up a fern stalk and a tiny clay lizard sunning itself on a warm clay rock nearby',
      'a tiny scuttling clay lizard on a sun-warmed clay rock and a line of clay ants crossing the clay ground',
      'a pair of fuzzy cotton-wool clay clouds with a tiny clay pteranodon gliding between them in the far sky',
      'a scatter of tiny clay beetles in the foreground and a small furry clay mammal peeking from a burrow in the clay bank',
    ],
    instructions: `Each entry 15-30 words. A small cluster of SMALL mid/far-distance prehistoric life / scale-provers (clay pterosaurs, baby dinos, beetles, lizards, distant herd, burrowing critters). Always small, never bigger than the heroes. ⚠️ Keep critters LAND + AIR — NO fish / frogs / tadpoles / lily-pads / water-bugs (no water unless the biome has it). Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_surprise: {
    format: 'simple',
    theme: `SURPRISE-ELEMENT descriptors for dino-diorama — a fun UNEXPECTED twist that crashes the prehistoric clay world (fires ~55% of renders). Each entry is ONE delightful out-of-place toy or whimsical surprise that makes the viewer grin. It should be small-to-medium and NOT steal focus from the toy dinosaurs.

✓ VARIETY — a stray NON-DINO toy wandering in: a tiny plastic astronaut planting a flag on the volcano, a green plastic army-man scout radioing for backup, a Hot Wheels car stuck in the clay mud, a LEGO-brick boulder among the clay rocks, a wind-up tin robot trundling through the ferns, a rubber duck floating in the tar pit, a toy UFO hovering over the eruption, a plastic knight figure facing off with the T-rex, a tiny dollhouse teacup in the clay, a googly-eyed clay caveman peeking out, a plush dino tucked among the plastic ones, a toy submarine in the clay river.

🚫 Keep it FUN + small. NO gore, NO modern tech beyond toys, NO text.`,
    touchpoints: [
      'a tiny white plastic toy astronaut has planted a little flag on a clay outcrop and stands saluting as the dinos ignore him',
      'a single green plastic army-man scout crouches behind a clay fern, binoculars raised, radioing for backup',
      'a die-cast Hot Wheels car is nose-down and stuck in the glossy clay mud, tiny wheels still spinning, a raptor toy sniffing its bumper',
      'one out-of-place LEGO brick sits among the clay boulders as a perfectly rectangular red \'rock,\' utterly wrong and delightful',
      'a wind-up tin robot trundles obliviously through the clay ferns, key still turning on its back, as a triceratops watches',
      'a yellow rubber duck floats serenely in the black clay tar-pit while a brontosaurus toy eyes it warily',
      'a small silver toy UFO hovers on a near-invisible thread above the erupting clay volcano, beaming a tiny light down',
      'a plastic toy knight in silver armor stands sword-raised facing off against the towering T-rex toy, comically outmatched',
      'a tiny porcelain dollhouse teacup sits incongruously on a clay rock with a clay-pebble \'cookie\' beside it',
      'a soft plush dino is tucked in among the hard plastic ones, fuzzy and oversized, blending in like it belongs',
      'a googly-eyed little clay caveman peeks out from behind the monumental anchor, club in hand, eyes wobbling',
      'a green plastic toy submarine is beached on the clay riverbank, periscope up, as raptor toys investigate',
    ],
    instructions: `Each entry 15-30 words. ONE fun out-of-place toy / whimsical surprise crashing the prehistoric clay world (astronaut, army-man, Hot Wheels, LEGO, robot, rubber duck, UFO, knight, etc.). Small, grin-worthy, never steals focus. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_camera: {
    format: 'simple',
    theme: `VARIED WIDE-SCENE DEEP-FOCUS CAMERA / FRAMING for dino-diorama. The #1 GOAL is COMPOSITIONAL VARIETY — every render must feel like a DIFFERENT shot of a DIFFERENT corner of the world. THE FAILURE MODE WE ARE FIXING: every render looks identical — a wide vista with a winding river-or-lava CHANNEL splitting the middle, shot from the same angle. BREAK that hard.

✓ Each entry is ONE distinct framing. Spread WIDE across shot-types — rotate through:
  - TOP-DOWN bird's-eye flat-lay looking straight down on the whole world (no horizon)
  - HIGH hilltop 3/4 overlook across the sprawling world
  - LOW ground-level eye-line down among the dinos, the world rising behind
  - OFF-CENTER asymmetric composition (anchor shoved to one side, action in a corner)
  - looking UP at a towering anchor from below
  - sweeping PANORAMIC ridge-line across the world
  - over-a-foreground-rise reveal of the world beyond
  - diagonal / corner composition where the eye travels from one corner to the opposite

✓ ALWAYS DEEP FOCUS (large depth of field, whole scene crisp). Mostly wide/full-world (dinos small-to-medium), but vary the scale a little so not every shot is identical.

🚫 DO NOT run a river / lava / path / channel down the CENTER of the shot — that is the exact repetition we are killing. Most compositions have NO central waterway and NO central leading-line. Vary WHERE the eye enters and what fills the foreground. NO shallow DOF, NO macro, NO tilt-shift.`,
    touchpoints: [
      'top-down bird\'s-eye flat-lay looking straight down on the whole clay world, dinos scattered like a herd across the terrain, deep focus, no horizon line, no central channel',
      'high hilltop 3/4 overlook gazing across the sprawling diorama, the anchor off to one side, many small dinos dotted below, everything tack-sharp',
      'low ground-level eye-line right down among the toy dinos, their lush world rising up behind them into the distance, deep focus front-to-back',
      'off-center asymmetric wide shot — the monumental anchor pushed to the left third, the dino action clustered lower-right, open landscape filling the rest',
      'a steep low up-angle looking UP past a few foreground dinos at the towering anchor, sky filling the top third, deep focus',
      'a sweeping panoramic ridge-line vista, the world stretching side to side, dinos strung along ridges and hollows, crisp throughout, no central feature',
      'a corner-in diagonal composition, the landscape sweeping from near foreground bottom-left up to a far anchor top-right, dinos along the diagonal',
      'a high-angle reveal over a foreground rise looking down on the busy world beyond — many dinos, lush flora, the anchor set to one side, all in focus',
    ],
    instructions: `Each entry 14-30 words. ONE distinct WIDE-ish full-world framing, ALWAYS DEEP FOCUS. VARY the angle/composition HARD across top-down / hilltop / ground-level / off-center / up-angle / panoramic / diagonal. NEVER a river / lava / path running down the CENTER. NO macro / shallow DOF / tilt-shift. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  dino_diorama_flora: {
    format: 'simple',
    theme: `LUSH CLAY FLORA + SET-DECORATION descriptors for dino-diorama — the dense decorative plant-life and set-dressing that CRAMS the prehistoric clay world full of life ("crazy clay trees everywhere"). Each entry is a CLUSTER of 3-5 varied clay flora / props, layered at different scales for a lush, overgrown, richly-decorated diorama. ALWAYS handmade sculpted clay.

✓ VARIETY across the pool — towering clay palms, giant clay tree-ferns, gnarled twisted clay trees, clay cycads, drooping clay willows, towering clay redwood trunks, clay bamboo groves, hanging clay vines + moss, giant clay mushrooms + toadstools, clay flowering plants + blossoms, clay reeds + cattails + lily-pads, clay bushes + shrubs, fallen mossy clay logs, clay stumps, clay boulders + natural rock-arches, and BIZARRE alien-looking clay plants (bulbous polka-dot pods, curly spiral fronds, balloon-blossoms, glowing bioluminescent flowers).

✓ Each entry layers 3-5 DIFFERENT flora/decor types at different sizes so the world feels packed and varied.

🚫 ALWAYS clay (sculpted, matte, thumbprinted). NO real plants, NO dinosaurs, NO modern objects.`,
    touchpoints: [
      'towering clay palm trees and giant emerald tree-ferns crowding the banks, twisted clay vines slung between them, clusters of red-capped clay toadstools sprouting at their roots',
      'gnarled twisted clay trees with curling branches, drooping clay willow-fronds, hanging clay moss, a fallen mossy clay log bridging a gully',
      'a grove of tall clay cycads and spiky clay bushes, fat clay mushrooms in pink and orange, little clay flowering plants dotting the clay ground',
      'dense clay bamboo and spiky clay shrubs, broad-leaf clay plants, a vine-draped mossy clay boulder, tufts of clay grass between them',
      'enormous clay redwood-style trunks receding into the distance, ferny clay undergrowth, glowing bioluminescent clay flowers, scattered weathered clay stumps',
      'bizarre alien clay plants crammed between boulders — bulbous polka-dot pods, curly spiral fronds, balloon-shaped clay blossoms in candy colors',
      'a jungle wall of overlapping broad-leaf clay plants and clay fronds, hanging clay vines, clusters of clay berries, a rotting clay log sprouting tiny clay mushrooms',
      'spindly clay conifers and clay tree-ferns along a ridge, tufts of clay grass, clay wildflowers in yellow and violet, a natural clay rock-arch framing the view',
      'a tangle of gnarled clay roots and broad clay fronds, hanging clay moss, clusters of clay berries, a rotting clay log sprouting tiny clay mushrooms',
      'oversized clay flowers and toadstools taller than the toy dinos, curling clay ferns underfoot, a twisted clay tree heavy with hanging clay fruit, clay boulders everywhere',
      'a fern-choked clay gorge wall dripping with hanging clay vines and clay orchids, clay mushroom-shelves climbing a clay trunk, mossy clay steps',
      'clay horsetails and tall clay grasses clustered around mossy clay boulders, a gnarled clay root-tangle arching overhead, scattered clay wildflowers',
    ],
    instructions: `Each entry 18-35 words. ONE dense cluster of 3-5 varied CLAY flora / set-dressing types layered at different scales (trees, ferns, mushrooms, vines, flowers, logs, boulders, reeds, alien-plants). Always handmade clay. NO dinos, NO real plants, NO modern objects. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ═══════════════════════════════════════════════════════════
  // TOYBOX-CHAOS bucket refactor (2026-05-24). toy_bucket is a SHARED,
  // de-branded toy-archetype pool, pickN-composited into one interacting
  // chaos vignette. See TOYBOX_CHAOS_BUCKET_REFACTOR.md.
  // ═══════════════════════════════════════════════════════════

  toybox_toy_bucket: {
    format: 'simple',
    theme: `INDIVIDUAL DE-BRANDED TOY archetypes for the shared TOYBOX_TOY_BUCKET. Each entry is ONE single toy as a short noun phrase (8-16 words) — the template pickN-grabs several and composites them into a chaos scene, so each entry is just ONE toy, NOT a scene.

✓ HUGE VARIETY across toy families — action figures (barbarian-hero / armored warrior / skull villain / caped crusader / commando / cobra-soldier / patriot / speedster), troll dolls, toy ponies & unicorns, robots (tin wind-up / chrome android / space-explorer / robot-dog), plush (teddy / bunny / puppy / dragon / care-bear-style / amigurumi), green army-men, gnomes, fairies, knights, wizards, ninjas, pirates, astronauts, divers, fashion dolls, dinos (T-rex / raptor / sauropod / stego / triceratops), die-cast vehicles (race car / monster truck / fire engine / bus / dump truck), wind-up novelties (chattering teeth / hopping frog / jack-in-the-box), rubber ducks, anthro cartoon animals (turtle-warrior / hedgehog / mouse / dog).

⚠️ NAME THE MATERIAL/look where natural (plastic / vinyl / plush / die-cast / tin / flocked / wood) so the toy reads as a TOY.

🚫 ABSOLUTELY NO BRAND / IP NAMES (no He-Man, Smurf, My Little Pony, TMNT, Mickey, Sonic, Barbie, Transformers, LEGO-as-brand, Star Wars, Marvel, DC, Funko, etc.) — generic de-branded archetypes ONLY. NO scenes, NO multiple toys per entry, NO surfaces.`,
    touchpoints: [
      'neon-haired troll doll with a wild jewel-tone updo',
      'muscular barbarian-hero action figure with a plastic sword',
      'blocky retro tin wind-up robot, silver',
      'pastel toy pony with a brushable rainbow mane',
      'green plastic army-man with a bazooka',
      'worn velveteen teddy bear, one button eye',
      'die-cast fire engine with a tiny ladder',
      'horned triceratops toy',
      'caped midnight crusader figure',
      'rubber duck with a tiny sailor hat',
      'little blue gnome figurine in a white cap',
      'fashion doll in adventure-explorer khakis',
    ],
    instructions: `Each entry 8-16 words. ONE single de-branded toy as a noun phrase, with its material/look. NO brand names, NO scenes, NO surfaces, NO multiple toys. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  toybox_surface: {
    format: 'simple',
    theme: `REAL EVERYDAY SURFACE descriptors for toybox-chaos — where the toy chaos happens. Each entry is ONE real-world surface/setting (8-18 words), the kind of place a kid dumps a bin of toys.

✓ VARIETY — kitchen counter, hardwood floor, bedroom rug / carpet, sandbox, bathtub edge + soapy tiles, bookshelf, picnic blanket on grass, wooden desk, garage floor, garden path / patio, coffee table, windowsill, staircase steps, kitchen table, toy-chest lid, bathroom sink, back-porch deck, dashboard, office desk, dollhouse floor.

🚫 ONE surface per entry. NO toys, NO scenario, NO digital/abstract settings — real physical surfaces only.`,
    touchpoints: [
      'a warm hardwood living-room floor with a fringe of patterned area-rug at the edge',
      'a cluttered kitchen counter beside a toaster and a ceramic fruit bowl',
      'a plush bedroom shag-carpet with a dropped sock and a book corner',
      'a backyard sandbox with a plastic shovel half-buried in the sand',
      'the soapy white-tile edge of a bathtub with bubbles and a washcloth',
      'a wooden bookshelf ledge between leaning hardcover spines',
      'a checkered picnic blanket spread on summer grass with crumbs scattered',
      'a paper-strewn wooden desk beside a coffee mug and a stapler',
    ],
    instructions: `Each entry 8-18 words. ONE real everyday surface/setting. NO toys, NO scenario. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  toybox_scenario: {
    format: 'simple',
    theme: `CHAOTIC TOYBOX SCENARIO descriptors for toybox-chaos — the absurd EVENT the mismatched toys are caught mid-action in. Each entry is ONE short scenario (6-14 words) that implies INTERACTION + motion (the toys react to each other).

✓ VARIETY — daring rescue mission, all-out battle / melee, sneaky heist, downhill race, monster-attack / kaiju rampage, tea-party-gone-wrong, prison break, talent-show meltdown, wedding crashed, dance-off, treasure hunt, alien invasion, bank robbery, fire-drill panic, parade gone sideways, food fight, science-experiment explosion, courtroom drama, campfire ghost-story scare, tug-of-war, stampede, surprise birthday ambush, hot-air-balloon launch, pillow-fort siege.

🚫 ONE scenario per entry. Must imply toys REACTING to each other / mid-action — never a calm static moment. NO specific toys (the bucket supplies those), NO surfaces.`,
    touchpoints: [
      'a frantic rescue as one toy dangles and the others scramble to save it',
      'an all-out melee battle, factions charging from both sides mid-clash',
      'a sneaky midnight heist, toys tiptoeing off with a stolen prize',
      'a downhill race, racers neck-and-neck and one wiping out spectacularly',
      'a monster-attack panic, a big toy rampaging as the rest flee screaming',
      'a tea party gone wrong, the table flipping mid-argument',
      'a prison break, toys scaling a wall as an alarm-toy blares',
      'a talent-show meltdown, the act collapsing as judges react in horror',
    ],
    instructions: `Each entry 6-14 words. ONE chaotic scenario implying toys reacting / mid-action. NO specific toys, NO surfaces. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  toybox_surprise: {
    format: 'simple',
    theme: `SURPRISE-TOY descriptors for toybox-chaos — ONE extra unexpected toy / whimsy that crashes the scene as a background gag (fires ~40% of renders). Each entry is ONE small surprise element (8-18 words) that makes the viewer grin without stealing the focal beat.

✓ VARIETY — a rogue rubber duck bobbing through, a wind-up robot trundling in obliviously, a lone googly-eyed sock puppet, a toy UFO hovering on a thread, a jack-in-the-box mid-pop, a remote-control car careening through, a slinky mid-bounce down a step, a glow-stick-waving party figure, a windup hopping frog crossing the scene, a spinning top wobbling, a nesting-doll spilling its insides, a bendy stretch-figure tangled in the action.

🚫 ONE small surprise per entry. Brand-free. NO scenes, NO surfaces — just the one toy/whimsy.`,
    touchpoints: [
      'a rogue yellow rubber duck bobbing obliviously through the middle of the chaos',
      'a wind-up tin robot trundling in from the side, key still turning, ignoring everyone',
      'a toy UFO hovering on a near-invisible thread, beaming a tiny light down',
      'a jack-in-the-box mid-pop, clown head sprung up wide-eyed at the mayhem',
      'a remote-control car careening through the scene scattering the cast',
      'a metal slinky caught mid-bounce tumbling down a step into the fray',
      'a googly-eyed sock puppet flopped over a ledge watching the chaos',
      'a windup hopping frog mid-leap right across the focal action',
    ],
    instructions: `Each entry 8-18 words. ONE small unexpected surprise toy / whimsy (brand-free). NO scenes, NO surfaces. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  // Simple format opt-out — recipes can set `format: 'simple'` to skip the
  // Rich Scene Seed scaffolding and just pass through theme + instructions.
  if (recipe.format === 'simple') {
    return `${recipe.theme}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }

  return `Generate ${count} Rich Scene Seeds for the StarBot ${POOL} pool. StarBot is a sci-fi image-generation bot whose renders should feel like stills from an unmade epic film — multi-tier depth, scale provers, materially specific, narratively suggestive.

━━━ POOL THEME ━━━
${recipe.theme}

━━━ AESTHETIC TOUCHPOINTS (draw from these) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

━━━ POOL-SPECIFIC INSTRUCTIONS ━━━
${recipe.instructions}

━━━ THE RICH SCENE SEED FORMAT — every entry follows this EXACTLY ━━━
Each seed is 80-150 words. Use these exact slot headers (the labels themselves are part of the entry):

[NAME / TYPE] — [one-sentence headline anchor]
FOREGROUND: [specific tangible detail — railing, terrace, machinery, ruin, ridge]
MIDGROUND: [city/structure body, with scale provers named — tiny ships, lit windows, bridge traffic, smaller buildings clustered]
DEEP DISTANCE: [the hero anchor, dominant, partially veiled in atmospheric haze]
SKY: [atmospheric layer — smog, twin moons, storm, light pollution glow, ring-curve]
SCALE PROVERS: [3+ explicit small-things-prove-big-things — name them]
MATERIAL: [what surfaces are made of, how they wear, what light does to them]
EMOTIONAL DNA: [the feeling — awe, dread, wonder, melancholy, alien-indifference, sacred]

━━━ HARD RULES ━━━
- Multi-tier composition is NON-NEGOTIABLE — every seed has all 4 depth layers (FG, MG, Deep, Sky) explicitly filled
- Specific material language — ribbed obsidian over concrete (not "alien architecture"), copper-green oxide (not "weathered"), bioluminescent chitin (not "alien biology")
- 3+ named scale provers per seed — "ships as dots", "hundreds of lit windows", "figures-as-pinpricks on the bridge"
- Each seed has a DISTINCT visual DNA — no two seeds should feel interchangeable
- Architectural / biological / mechanical SPECIFICITY — name the style (brutalist / chitin-grown / cyclopean / Kirby-cosmic / etc.)
- 80-150 words per seed
- NO franchise proper nouns (no "Coruscant" / "Reaper" / "Halo" / etc. — INSPIRED BY, not literal)

━━━ FORBIDDEN — every seed must AVOID ━━━
- Generic descriptors without anchors ("vast city", "sprawling spires", "massive structure", "alien architecture") — these are placeholder noise
- The same tower-with-orange-windows-in-fog default; force variety in architectural style across seeds
- Single-hero-building isolation — every seed has supporting density
- Teal+orange default palette mention — let LIGHTING/VIBE handle palette, don't lock it in the seed

━━━ OUTPUT FORMAT — STRICT ━━━
Return EXACTLY ${count} entries as a NUMBERED LIST. Each entry on its OWN SINGLE LINE prefixed by "<number>. ". NO internal newlines within an entry — use commas / semicolons / dashes for internal structure. NO preamble, NO commentary, NO markdown fences, NO JSON.

Example output (the WHOLE response is just this format, nothing else):
1. MEGACITY OF STACKED ZIGGURATS — five-kilometer-tall ribbed obsidian ziggurats in a grid, each a layered city of thousands, connected at seven elevations by 200-meter skybridges, hanging-garden terraces, copper-green oxide bridge-trusses, ships threading the gaps as dots, indifferent megalopolis mood.
2. CANYON CITY OF SUSPENDED BRIDGES — vertical city carved into both faces of a 3-kilometer canyon, linked by 80+ suspension bridges at staggered heights, eroded stone balconies, prayer flags whipping in updraft, canyon walls weeping mineral stains.
3. (... and so on, ${count} numbered entries total)

CRITICAL: each entry MUST be ONE LINE only. If you need to convey FG/MG/Deep/Sky/Material/Emotional context, combine them into ONE comma-separated line. Multi-line entries WILL BE PARSED INCORRECTLY.`;
}

async function callSonnet(prompt) {
  // Node's undici defaults to a 5-minute headers timeout — Sonnet's larger
  // responses (16K output tokens with content) can exceed this. Use a
  // dispatcher with a longer timeout via AbortController fallback.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15min
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Numbered-list parser. Each entry starts with "<number>. ". Lines that
// don't start with a number are treated as continuations of the previous
// entry (in case Sonnet ignores the "one line per entry" rule and wraps).
function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) {
      // continuation line — append with a space
      current += ' ' + trimmed;
    }
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

// ─── DEDUP ────────────────────────────────────────────────────────────────
// Sonnet clusters within batches and across batches — same theme, slightly
// different wording. Catch it programmatically by hashing a signature of
// each entry (significant keywords from the body, stopwords removed,
// sorted alphabetically). Entries with identical signatures are duplicates.

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'with',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'her',
  'his',
  'into',
  'onto',
  'through',
  'across',
  'over',
  'under',
  'near',
  'around',
  'between',
  'one',
  'two',
  'three',
  'some',
  'any',
  'all',
  'no',
  'not',
  'than',
  'then',
  'also',
  'so',
  'very',
  'more',
  'most',
  'many',
  'much',
  'each',
  'every',
  'other',
  'another',
  'same',
  'such',
  'only',
  'own',
  'just',
  'still',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'kilometer',
  'kilometers',
  'meter',
  'meters',
  'foot',
  'feet',
  'mile',
  'miles',
  'wide',
  'tall',
  'long',
  'high',
  'low',
  'large',
  'small',
  'massive',
  'huge',
  'vast',
  'huge',
  'across',
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
  'meterdiameter',
  'kilometerdiameter',
  'metertall',
  'kilometertall',
]);

function signatureOf(entry) {
  // Strip the title prefix (everything before the first " — ")
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  // Strip any Rich-Scene-Seed bloat
  const fgIdx = body.indexOf(' FOREGROUND:');
  if (fgIdx > 0) body = body.slice(0, fgIdx);
  // Tokenize and extract significant content nouns/adjectives
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20); // first 20 significant words of the body
  // Sort alphabetically so word-order shuffling doesn't escape dedup
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

// Title-only signature for pools with "TITLE — description" or
// "lowercase phrase — description" shape. Two entries with the same
// title but different bodies should still be treated as duplicates —
// signatureOf strips titles, so we need a separate guard.
function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null; // no title — fall back to signature-only dedup
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); // body-signature → first entry that claimed it
  const seenTitles = new Map(); // title (lowercased) → first entry that claimed it
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenTitles.get(title).slice(0, 80),
        reason: 'title',
      });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      // Body was too short to signature — keep (and register title)
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenSigs.get(sig).slice(0, 80),
        reason: 'body',
      });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn(`  ⚠ Sonnet returned no usable entries`);
    return [];
  }
  // Strip Rich-Scene-Seed bloat so signatures aren't polluted
  const stripped = arr
    .map((e) => {
      if (typeof e !== 'string') return null;
      const i = e.indexOf(' FOREGROUND:');
      return i > 0 ? e.slice(0, i).trim() : e;
    })
    .filter(Boolean);
  console.log(`  • Sonnet returned ${stripped.length} entries in ${elapsed}s`);
  return stripped;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/toybot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }

  // Determine final target.
  // --target N → fill up to N via iterative gen+dedup loop
  // --count N → single batch of N (legacy behavior)
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;

  if (TARGET !== null) {
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  } else {
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  }

  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    // Smaller batches (15-25) — Sonnet writes faster + ~10K-token responses
    // stay well under fetch timeouts. Overgen by ~50% to absorb dedup losses.
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    // Within-batch dedup
    const within = dedupe(fresh);
    if (within.dropped.length > 0) {
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    }
    // Cross-batch dedup against current pool — body signature AND title
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) {
      console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    }
    // Trim to target if we overshot
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }

  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );

  console.log('\nSample (last 2 added):');
  pool.slice(-2).forEach((e, i) => console.log(`\n[${pool.length - 1 + i}] ${e.slice(0, 400)}...`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
