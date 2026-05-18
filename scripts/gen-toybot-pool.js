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
