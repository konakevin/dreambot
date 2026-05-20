#!/usr/bin/env node
/**
 * Generate a BloomBot axis pool using Sonnet.
 *
 * Mirrors the gen-mechbot-pool.js / gen-gothbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are BloomBot-bespoke.
 *
 * Usage:
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_landform --target 30
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_scale_prover --target 30
 *
 * Output: scripts/bots/bloombot/seeds/<pool>.json
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
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// BloomBot-shared aesthetic vocabulary (used across all pool recipes)
// ─────────────────────────────────────────────────────────────
//
// BloomBot's identity: pure-scenery bot where FLOWERS are the hero. Every
// entry should imply flowers but NOT name specific species (species come
// from the per-render regional roster). Hyperreal CGI register — think
// "the turtle aesthetic" — saturated, jewel-toned, multi-tier depth,
// cinematic. NO PEOPLE in any entry, ever. Wildlife only as peripheral
// accent (hummingbird / bee / butterfly / small lizard).
//
// Cross-path bans (so each path stays in its lane):
//   - NO interiors/rooms/sunrooms (cozy's territory)
//   - NO archways/passages/tunnels (garden-walk's territory)
//   - NO surreal/gravity-defying/impossible (dreamscape's territory)
//   - NO glass-and-iron conservatory architecture (conservatory's territory)
//   - NO city streets/urban architecture (city-flowers' territory)
//   - NO ruins/abandoned structures (reclaim's territory)
//   - NO macro/closeup framing (closeup's territory)

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BloomBot bespoke (landscape path, 2026-05-16)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ─── landscape path: landform (the dominant terrain canvas) ───
  bloombot_landscape_landform: {
    format: 'simple',
    theme: `EPIC FLORAL LANDSCAPE LANDFORMS for the BloomBot landscape path. Each entry is ONE specific dramatic terrain on which a vast bloom-carpet is the hero. Each entry 30-60 words.

⚠️ MANDATORY — every entry must convey EPIC SCENERY where the LANDFORM is recognizable, dramatic, and deep — the bloom-blanket carpets it from foreground to horizon. The terrain is the CANVAS, blooms are the CARPET. Multi-tier depth implied (foreground tier + midground tier + receding horizon).

🚫 STRICT BANS — these belong to other paths:
  • NO interiors / rooms / sunrooms / breakfast nooks → cozy
  • NO archways / passages / pergolas / tunnels → garden-walk
  • NO surreal / floating / gravity-defying / Magritte / impossible → dreamscape
  • NO glass-and-iron conservatories / Victorian greenhouses → conservatory
  • NO city streets / urban / Mediterranean alleys / Parisian / Lisbon → city-flowers
  • NO ruins / abandoned structures / temples-overgrown / cathedrals → reclaim
  • NO macro / closeup / "into the bloom wall" framing → closeup
  • NO tropical jungle understory (banyan / banana / heliconia) → tropical-paradise

🚫 ALSO BANNED:
  • NO people / humans / figures / silhouettes / shadows of people
  • NO generic "wildflower meadow" or "field of flowers" — name the LANDFORM specifically (mountain valley / cliff coast / glacial cirque / lake basin / etc.)
  • NO "pink rolling hills" / "blush meadow" / "cottagecore" / "english garden"
  • NO "soft pastels" / "feminine" / "dreamy" as primary aesthetic descriptors

✓ MANDATORY VARIETY — distribute across these LANDFORM CATEGORIES (~3-4 per category in a 30-entry pool):
  A. **ALPINE / MOUNTAIN** — meadow valleys below jagged peaks, ridge-line traverses, hanging valleys above tree-line, glacial cirques, snow-rimmed bowls
  B. **COASTAL / SEA-CLIFF** — bloom-blanketed sea cliffs above crashing surf, beach dunes carpeted in coastal blooms, tide-pool flats, sea stacks rising from bloom-meadow
  C. **DESERT / CANYON** — bloom-saturated desert canyon floors, slot-canyons with hanging-wall blooms, mesa-tops in superbloom, badlands washes
  D. **HILL / DOWNLAND** — rolling chalk downs in spring superbloom, terraced hillsides, patchwork field-quilt receding to blue distance, lavender-purple downlands (not lavender-as-species, terrain mood)
  E. **VOLCANIC / GEOTHERMAL** — caldera-floor superblooms, lava-field cracks reclaimed by pioneers, steam-vent meadows, ash-soil bloom-fields ringed by black rock
  F. **WETLAND / RIVER / LAKE** — lake-shore bloom-belts, water-meadow flooded floodplains, oxbow-river bends with bloom-laden banks, alpine tarn reflecting blooms
  G. **GLACIAL / ARCTIC** — fellfield blooms on tundra slopes, retreating-glacier moraine in pioneer bloom, midnight-sun fields, edge-of-ice meadow
  H. **FOREST-EDGE / CLEARING** — large bloom-meadow ringed by ancient forest, glade openings in old-growth, deciduous-forest spring carpet, savanna-grassland mosaic
  I. **ISLAND / ARCHIPELAGO** — Mediterranean island terrace blooms, basalt-headland bloom-shoulders, Faroe-style cliff turf, atoll-edge bloom-belts (NOT tropical jungle understory)
  J. **STEPPE / HIGH-PLATEAU** — Tibetan high-plateau bloom-belt, Andean altiplano, Mongolian steppe spring, Patagonian estancia in flower

Lineage to channel: National Geographic landscape photography + Planet Earth establishing shots + Roger Deakins location work + Annie Leibovitz outdoor portraiture (just the BACKDROPS) + Ansel Adams scale. Saturated jewel-tone cinematic register.`,
    touchpoints: [
      'ALPINE MEADOW VALLEY BELOW JAGGED SNOW PEAKS — wide U-shaped glacial valley floor blanketed in spring bloom, jagged granite snow-peaks rising abruptly behind, foreground tier of carpet-blooms / midground tier of clustered bloom-massing / horizon receding to blue snow-line',
      'COASTAL CLIFF ABOVE CRASHING OCEAN — wave-battered headland edge with bloom-turf sweeping to a sheer drop, white surf detonating against black-rock base far below, salt-spray haze softening the deep distance, multi-tier bloom-carpet across the rounded cliff-top',
      'DESERT CANYON SUPERBLOOM — wide red-rock canyon floor in once-a-decade superbloom, vertical sandstone walls glowing burnt-orange in the upper frame, river meandering through the bloom-saturated floor, distant mesas blue with atmospheric haze',
      'ROLLING HILLS RECEDING TO BLUE DISTANCE — patchwork quilt of bloom-fields tumbling across rounded downs in tier after tier, hedgerows zigzagging between, distant blue ridges fading into atmospheric perspective, lone tree-clump silhouetted on a far ridge',
      'GLACIAL CIRQUE BOWL — semi-circular alpine amphitheatre rimmed by sheer rock walls, snow-meltwater stream wandering through the bloom-carpeted floor, cirque tarn reflecting the rock-walls, scree-slopes rising to the rim',
      'VOLCANIC CALDERA SUPERBLOOM — vast circular caldera floor carpeted in pioneer blooms after spring rain, black-rock crater rim ringing the horizon, steam-vents puffing in midground, ash-cone visible at one edge',
      'LAKE-SHORE BLOOM-BELT — long crescent of bloom-blanketed lake-shore curving into the deep distance, glassy mountain lake reflecting peaks and blooms equally, scattered conifer-clusters punctuating the bloom-carpet, mountain backdrop',
      'ROLLING CHALK DOWNS IN SPRING SUPERBLOOM — undulating chalk downland bloom-carpet, ancient hill-fort earthwork visible on a distant rise, dewpond catching sky, sheep-track threading the bloom, English atmospheric haze at the horizon',
      'BASALT HEADLAND BLOOM-SHOULDER — Faroe-style stepped basalt cliffs draped in turf-bloom, North Atlantic surf battering the rock-base, sea-stacks rising from a heaving steel sea, low cloud catching on the cliff-top',
      'TIBETAN HIGH-PLATEAU BLOOM-BELT — vast high-altitude bloom-plain stretching to horizon, snow-capped 7000m peaks rising in deep distance, prayer-flag string fluttering in midground for scale, yak-herd tiny on the bloom-meadow',
      'TUNDRA FELLFIELD IN MIDNIGHT-SUN BLOOM — low-Arctic tundra slope in midnight-sun summer bloom, cushion-plants and dwarf-bloom turf, distant glacier-tongue descending from white peaks, sun grazing the horizon, long warm shadows',
      'BADLANDS WASH SUPERBLOOM — striped-strata badland gulches with bloom-carpet between, dry stream-bed snaking through the foreground, eroded buttes rising in pink-and-amber midground, sky filling upper third with weather',
      'OXBOW RIVER BEND BLOOM-BANKS — meandering oxbow lake with reflective water curving through bloom-laden banks, tall reed-clusters along the water-line, distant hills, golden sandbar accenting the bend, atmospheric haze',
      'MOUNTAIN PASS HANGING VALLEY — high pass between two peaks with a hanging valley below, bloom-carpet covering the valley floor, scree-cones descending from the walls, glacier-toe visible in deep upper background',
      'ANCIENT FOREST CLEARING — large bloom-meadow ringed by old-growth fir-and-cedar, sunbeams filtering through forest edge, mossy boulders studding the clearing, stag tiny in the deep background for scale',
      'PATAGONIAN ESTANCIA WIDE PLAIN — vast Andean foreland plain in spring bloom, gauchos-and-horses tiny silhouettes in deep midground for scale, granite spires of distant Andes piercing storm-cloud, wind-bent grass',
      'MEDITERRANEAN TERRACED HILL-BLOOM — ancient stone-terraced hillside cascading in bloom from ridge to coast, distant azure sea filling the lower frame, cypress-clusters punctuating the terraces, low golden Mediterranean light',
      'TIDAL WATER-MEADOW FLOODPLAIN — broad flooded river floodplain with islands of bloom-tussocks rising from shallow water, distant cathedral-tower or hill in deep horizon, low water-mirror reflecting the bloom and sky equally',
      'ANDEAN ALTIPLANO BLOOM-PLAIN — vast high-altitude altiplano in seasonal bloom, distant snow-capped volcanoes rising from the plain, llama-herd tiny in midground for scale, salt-pan glinting on one horizon',
      'SAVANNA-GRASSLAND BLOOM-MOSAIC — broad grassland in seasonal bloom dotted with flat-crowned acacias, distant escarpment receding to blue haze, scattered termite-mounds catching late light, sky filling upper half',
    ],
    instructions: `Each entry is ONE specific dramatic LANDFORM CANVAS for a bloom-blanket scene, 30-60 words. Format: "LANDFORM NAME CAPS — primary terrain features + multi-tier bloom description + horizon/depth note". Vary across the 10 landform categories above. NEVER use generic "wildflower meadow" — name the LANDFORM specifically. NO people, NO interiors, NO archways, NO ruins, NO urban, NO macro framing. NO pink/cottagecore/feminine palette references. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: scale_prover (gives the landscape scale) ───
  bloombot_landscape_scale_prover: {
    format: 'simple',
    theme: `SCALE-PROVERS for the BloomBot landscape path. Each entry is ONE specific tiny element (or natural feature) that PROVES the epic scale of the landform. Each entry 20-40 words.

⚠️ MANDATORY — every entry must make the landscape feel BIGGER through scale-contrast. The element is small / distant / dwarfed by the landform. NEVER the primary subject — always peripheral.

🚫 STRICT BANS:
  • NO humans / people / figures / silhouettes / shadows of people
  • NO buildings / houses / cottages / castles as the scale-prover (architecture would compete with the landscape)
  • NO interiors / passages / urban / ruins
  • NO floating / surreal / impossible elements (dreamscape's territory)
  • NO "tiny figure" anywhere — even hooded silhouettes

✓ ALLOWED SCALE-PROVER CATEGORIES:
  A. **WILDLIFE — TINY** — single hummingbird / bee / butterfly / dragonfly in the foreground bloom
  B. **WILDLIFE — DISTANT HERD** — deer / elk / caribou / horse / sheep / yak / llama herd dotted across the midground for scale
  C. **WILDLIFE — RAPTOR / BIRD ABOVE** — eagle / hawk / kite / heron / crane / stork / albatross gliding in the upper sky
  D. **TREE / ANCIENT GROVE** — single ancient tree / lone copse / windswept oak / bristlecone pine standing alone on the bloom-carpet for scale-anchor
  E. **WATER FEATURE** — distant waterfall ribbon / glacial meltwater stream / mountain tarn catching the sky / sand-bar of a river bend
  F. **GEOLOGY — DISTANT** — distant sea-stack / mesa / butte / glacier-toe / arête ridge / rock pinnacle on the horizon
  G. **WEATHER FEATURE — DISTANT** — distant lightning fork / rain-curtain / waterspout / dust-devil / rainbow / mountain-wave cloud
  H. **PATH / TRACK** — bloom-track winding through the landform (a worn ribbon of crushed-bloom path, no humans on it)
  I. **STONE WITNESS** — single standing stone / glacial erratic / cairn / boulder-pile resting on the bloom-carpet
  J. **MIGRATION-MOMENT** — pollinator-cloud / butterfly migration column / bee-swarm / monarch wave / starling murmuration in midground

Each entry should be a small, specific, naturally-occurring element that creates an "oh — that's how big this is" moment. Channel: Planet Earth establishing shots, BBC natural-history slow zoom-outs, Roger Deakins location wides.`,
    touchpoints: [
      'TINY HUMMINGBIRD HOVERING — solitary jewel-iridescent hummingbird hovering at a foreground bloom-cluster, wings a transparent blur, scale-prover for the vast bloom-carpet behind it',
      'DEER HERD TINY IN MIDGROUND — small herd of mule-deer or red-deer dotted across the bloom-meadow at middle-distance, each barely larger than a brushstroke, scale-prover for the landform behind them',
      'EAGLE GLIDING UPPER SKY — golden eagle gliding on a thermal in the upper-third of the frame, wings outstretched, tiny against the snow-peaks behind, scale-prover for the alpine drama',
      'LONE ANCIENT WINDSWEPT OAK — single ancient gnarled oak standing alone on a bloom-knoll, hundreds of years old, anchor of scale for the rolling hill-country receding behind it',
      'DISTANT WATERFALL RIBBON — single thin waterfall ribbon descending a sheer cliff in deep background, a white thread on the dark rock-wall, scale-prover for the cliff and the bloom-carpet at its base',
      'GLACIAL MELTWATER STREAM WANDERING — silver thread of meltwater stream winding through the bloom-meadow from a high snow-saddle, catches the light, gives the eye a depth-line into the scene',
      'DISTANT SEA-STACK — solitary basalt sea-stack rising vertically from the offshore swell, white surf detonating at its base, scale-prover for the coastal cliff and the bloom-shoulder',
      'DISTANT LIGHTNING FORK — single dramatic lightning fork striking a distant ridge under a storm-cell, briefly silhouetting the bloom-meadow against the flash, atmospheric weather drama',
      'BLOOM-CARPET PATH WINDING — worn ribbon of crushed-bloom path threading the meadow into the deep distance, lead-line for the eye, scale-prover for the carpet through which it cuts',
      'SINGLE GLACIAL ERRATIC BOULDER — house-sized erratic boulder resting on the bloom-carpet alone, ice-age witness, scale-prover for the bloom-field surrounding it',
      'BUTTERFLY MIGRATION COLUMN — vertical column of migrating butterflies (monarch or painted-lady) rising from the meadow in a swirling helix, hundreds visible, scale-spectacle plus scale-prover',
      'GRAZING CARIBOU HERD — small dispersed caribou herd grazing across the tundra fellfield in deep midground, antlers catching the low sun, scale-prover for the Arctic bloom-belt',
      'DOUBLE RAINBOW ARCH — full double-rainbow arching across the deep midground from one cloud-bank to another, ground-end touching the distant bloom-ridge, scale-prover for the storm-drama',
      'LONE CAIRN ON BLOOM-RIDGE — single weathered stone cairn standing on a high bloom-ridge, anchor of human-scale-ABSENCE against the vastness, scale-prover for the ridge-line',
      'STARLING MURMURATION TWISTING — vast cloud-formation of starlings twisting in the upper sky over the bloom-plain, organic shape morphing, scale-prover for the open sky-volume above',
      'DRAGONFLY IN FOREGROUND — single iridescent dragonfly hovering at a foreground bloom-stem, wings transparent and frozen, body anchoring the macro-end of the scale spectrum',
      'DISTANT GLACIER-TOE — terminal moraine of a distant alpine glacier descending from snow-peaks, ice-cliff-edge tiny in the deep background, scale-prover for the entire valley',
      'HORSE HERD GALLOPING DISTANT — small wild-horse herd galloping across the steppe-bloom in midground, dust-trail behind them catching the light, scale-prover for the Mongolian plain',
      'TINY BEE ON FOREGROUND BLOOM — single bumblebee or honeybee landing on a specific named foreground bloom, fur-on-thorax visible, scale-prover for the bloom-carpet behind it',
      'WIND-RIPPLE THROUGH BLOOM-FIELD — visible wind-wave rippling across the surface of a vast bloom-field like wind on water, the eye reads the scale through the wave',
    ],
    instructions: `Each entry is ONE specific tiny / distant element that gives scale to the landform, 20-40 words. Format: "SCALE-PROVER NAME CAPS — primary element + secondary detail + how it conveys scale". Vary across the 10 categories above. The element is ALWAYS peripheral — never primary. NO humans, NO buildings, NO interiors. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: surprise_element (small unexpected secondary subject) ───
  bloombot_landscape_surprise_element: {
    format: 'simple',
    theme: `SURPRISE ELEMENTS for the BloomBot landscape path. Each entry is ONE small, unexpected secondary detail that rewards a second look at the bloom-landscape. Each entry 20-45 words.

⚠️ MANDATORY — every entry must be SECONDARY and SMALL — never compete with the bloom-carpet or the landform. Each is a "did you spot this?" moment that elevates the scene from "pretty landscape" to "memorable poster".

🚫 STRICT BANS:
  • NO humans / figures / silhouettes
  • NO buildings / castles / ruins / cottages / urban architecture
  • NO surreal / floating / impossible (dreamscape's job)
  • NO competing with the landform — must be small
  • NO duplication of scale-prover content (deer / waterfall / etc. — those go in scale_prover pool)

✓ SURPRISE-ELEMENT CATEGORIES:
  A. **POLLINATOR DETAIL** — single bee in mid-air pollen-cloud / butterfly opening wings on a specific bloom / hummingbird tongue extended / dragonfly back-lit
  B. **LIGHT MAGIC** — sun-flare through one specific bloom petal / dewdrop refracting a tiny rainbow / a single sun-ray catching one cluster
  C. **WATER DETAIL** — single dew-drop hanging from a bloom-stem / mist-droplet catching light / petal floating on a still pond / spider-web with water-beads
  D. **NEST / EGG** — tiny hidden bird-nest in foreground brush / cluster of speckled eggs visible / mouse-nest tucked under bloom-cluster
  E. **WIND-MOMENT** — single petal mid-fall / pollen-cloud dispersing in wind / spider-silk strand crossing the frame catching light
  F. **DIMENSIONAL HINT** — single mossy boulder / fallen branch / clump of crystal-bearing rock / a piece of antler / a worn deer-skull (memento mori, naturally occurring)
  G. **MICRO-WILDLIFE** — chameleon on a stem / gecko on a rock / vole peeking from foliage / chipmunk frozen on a stem / tree-frog on a leaf
  H. **PEACEFUL CREATURE-MOMENT** — fox sleeping in a sunny patch / hare frozen in alert / rabbit nibbling / songbird perched mid-song / hedgehog asleep
  I. **NATURAL DEBRIS** — single bleached antler / cluster of seed-pods bursting / sun-bleached driftwood / coral-of-color autumn leaf in the spring scene
  J. **OPTICAL MAGIC** — a perfectly heart-shaped dewdrop / a bloom whose color exactly matches the sunset / a bloom-cluster reflecting in the eye of a deer (subtle)

Channel: Spielberg's "small magic moment in the wide shot" framing + Studio Ghibli's "look closer" details + macro-photography sensibility scaled down into a wide landscape.`,
    touchpoints: [
      'SINGLE BUTTERFLY OPENING WINGS — solitary butterfly mid-emerge on a foreground bloom, wings half-open showing the iridescent inner surface, dust of pollen drifting from the cluster, magic-moment detail',
      'DEW-DROP RAINBOW REFRACTION — single tear-shaped dew-drop hanging from a bloom-petal in foreground, refracting a tiny full spectrum within itself, sunlight passing through, jewel-detail',
      'FOX SLEEPING IN SUNLIT PATCH — solitary red fox curled asleep in a small sun-warmed patch among the blooms in midground, ears relaxed, almost invisible until the eye finds it',
      'HIDDEN BIRD-NEST WITH EGGS — small cup-nest tucked low in the foreground brush, three speckled blue eggs visible inside, scale-perfect grass woven around it, subtle reward',
      'POLLEN-CLOUD DISPERSING IN WIND — visible cloud of golden pollen-dust drifting horizontally from a bloom-cluster, caught mid-air in the side-light, transient atmospheric magic',
      'BLEACHED ANTLER ON BLOOM-CARPET — single sun-bleached deer-antler resting on the bloom-meadow in midground, contour catching light, memento-mori beauty natural to the meadow',
      'SPIDER-WEB WITH WATER-BEADS — perfect orb-web stretched between two foreground bloom-stems, hundreds of water-beads on the silk catching the light like beaded pearls',
      'HARE FROZEN ALERT — solitary hare standing frozen-alert in midground bloom-cover, ears upright, body sideways, blending almost invisibly into the meadow until the eye spots it',
      'SINGLE PETAL MID-FALL — solitary detached petal caught mid-air in side-light, suspended in the moment before it touches the bloom-carpet below, motion-frozen',
      'SONGBIRD PERCHED MID-SONG — solitary songbird (warbler / lark / robin) perched on a tall bloom-stalk in midground, beak open mid-song, head tilted skyward',
      'CHIPMUNK FROZEN ON STEM — solitary chipmunk frozen mid-climb on a tall bloom-stalk in foreground, tail balanced behind, cheeks full, alert ears',
      'SUN-FLARE THROUGH ONE PETAL — sun-ray hitting one specific bloom-petal in foreground at a glancing angle, the petal glowing translucent like stained glass, halo on the back',
      'MOSSY FOREGROUND BOULDER — single moss-and-lichen-covered boulder in foreground, scale-anchor for the bloom-carpet, weathered surface catching low light, textural reward',
      'TINY TREE-FROG ON A LEAF — solitary jewel-green tree-frog on the underside of a large leaf in foreground, eyes catching the light, tiny but vivid color-pop',
      'BIRDS-NEST OF GRASS WITH DOWN — single nest of woven grass and downy feathers visible low in foreground bloom-cover, abandoned or freshly-built, intimate detail',
      'GECKO ON A SUN-WARMED STONE — solitary gecko basking on a sun-warmed stone in midground, body camouflaged but visible to the eye that finds it, scale-perfect detail',
      'DRAGONFLY BACK-LIT TRANSLUCENT — solitary dragonfly perched on a foreground stem, body back-lit by the low sun making the abdomen and wings glow translucent amber',
      'BURSTING SEED-POD CLUSTER — cluster of bloom seed-pods caught mid-burst in the foreground, fluffy seeds drifting horizontally in side-light, the future-of-the-meadow detail',
      'HEDGEHOG ASLEEP IN HOLLOW — solitary hedgehog curled asleep in a hollow at the base of a bloom-stalk in foreground, spines catching light, tiny but unmistakable',
      'PERFECT HEART-SHAPED DEWDROP — single dew-drop hanging from a leaf-tip in foreground, naturally shaped exactly like a heart, sun catching it, jewel-perfect detail',
    ],
    instructions: `Each entry is ONE small, unexpected secondary detail in a landscape, 20-45 words. Format: "SURPRISE-ELEMENT NAME CAPS — primary detail + secondary feature + position in frame". Vary across the 10 categories above. ALWAYS secondary and small — never competes with landform or bloom-carpet. NO humans, NO buildings, NO surreal. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: sky (atmospheric sky layer) ───
  bloombot_landscape_sky: {
    format: 'simple',
    theme: `SKY LAYERS for the BloomBot landscape path. Each entry is ONE specific dramatic sky / atmospheric upper-frame condition that crowns the bloom-landscape. Each entry 20-40 words.

⚠️ MANDATORY — every entry covers the UPPER THIRD of the frame and is CINEMATIC. The sky is the lid on the scene — it should never be a blank pale-blue default.

🚫 STRICT BANS:
  • NO flat featureless blue sky / no "clear sky" / no negative-space sky
  • NO surreal / floating / impossible sky (dreamscape's job)
  • NO city-light / urban-pollution sky (city-flowers' job)
  • NO interior ceilings / glass-domes (cozy / conservatory)

✓ MANDATORY SKY VARIETY — distribute across:
  A. **GOLDEN-HOUR DAWN** — first-light pink / amber / rose gradient with low warm rays
  B. **GOLDEN-HOUR DUSK** — sun-at-horizon orange / crimson / purple gradient with long warm rays
  C. **DRAMATIC STORM** — towering cumulus / anvil thunderhead / dark storm-shoulder / rain-curtain in deep distance
  D. **POST-STORM RAINBOW** — fresh clearing sky with a full or double rainbow arching across, last storm-cloud retreating
  E. **HIGH-NOON BLUE** — deep cerulean sky with sculpted cumulus, hard white sunlight, classic Ansel Adams blue
  F. **OVERCAST DRAMATIC** — silver overcast with break-of-light / hole-of-blue / volumetric god-rays piercing through
  G. **TWILIGHT GRADIENT** — post-sunset deep-blue-to-purple gradient with first stars / Venus / moon-rise
  H. **NIGHT WITH MOON** — moonlit landscape with full / crescent / blood / supermoon, soft silver wash on the bloom-carpet
  I. **AURORA** — green-and-violet aurora curtains rippling across an upper-latitude bloom-tundra
  J. **MIST / FOG / VOLUMETRIC** — low ground-fog hugging the bloom-carpet with clear sky above / mountain-mist hugging peaks / cloud-inversion above bloom-valley

Channel: Roger Deakins atmospheric work + Storm Thorgerson album-cover skies + Ansel Adams cloud studies + National Geographic golden-hour wides + Studio Ghibli sky-poetry.`,
    touchpoints: [
      'GOLDEN-HOUR DUSK AMBER GRADIENT — sky filling upper frame with horizon-to-zenith gradient from molten-amber at the bloom-line through coral-pink to deep-violet at zenith, sun a hand-width above the bloom-meadow casting long rake-light shadows',
      'TOWERING STORM-FRONT CUMULUS — vast sculpted cumulus-anvil rising into the upper sky over the bloom-plain, lit golden on the sun-facing side, dark grey on the shadow side, rain-curtain trailing from its base in deep distance',
      'DOUBLE-RAINBOW POST-STORM — fresh-cleared sky with a full double-rainbow arching across the upper third, primary bow vivid, secondary bow softer outside it, last storm-cloud retreating left, rain-glistened bloom-carpet below',
      'HIGH-NOON SCULPTED CUMULUS — deep cerulean sky filled with sculpted white cumulus-castles, hard mid-day sun creating crisp shadow-undersides on the clouds, classic-photo blue, every cumulus reading three-dimensional',
      'AURORA CURTAINS OVER TUNDRA-BLOOM — green-and-violet aurora curtains rippling across an upper-latitude night sky, magnetic-field bands stretching from horizon to horizon, soft glow on the snow-rimmed bloom-tundra below',
      'TWILIGHT BLUE WITH FIRST STARS — post-sunset upper-frame in deep-blue-to-purple gradient, Venus bright at the edge of the gradient, first stars just visible at zenith, bloom-meadow below in cooling shadow',
      'OVERCAST WITH GOD-RAY BREAK — silver overcast sheet covering most of the upper frame, single break of brilliant sun piercing through, volumetric god-rays beaming down onto a specific patch of bloom-meadow in midground',
      'BLOOD-MOON RISING — full crimson lunar disk rising above a distant ridge, twilit purple sky filling the upper frame, moonlight tinting the bloom-carpet rose-amber',
      'PURPLE THUNDERHEAD DOMINATING — vast deep-purple thunderhead occupying half the upper frame, lightning-flash internal pulse just visible, edge lit by sun escaping under, theatrical contrast',
      'AMBER DAWN MIST WITH PEAKS — golden-amber dawn sky filling the upper frame, first sun-rays just touching the highest snow-peaks, low mist coiling above the bloom-meadow at peak-elevation, alpenglow drama',
      'LENTICULAR CLOUD STACK — stack of UFO-shaped lenticular clouds glowing apricot at sunset, lined up above a distant mountain ridge, otherworldly atmospheric phenomenon',
      'MOON HALO COMPLETE RING — full lunar halo ring around the moon in a thin-cirrus night sky, soft silver light on the bloom-meadow below, atmospheric ice-crystal magic',
      'MAMMATUS-CLOUD DUSK CEILING — rare mammatus-cloud underside (bubbled grey-pink pendulous cloud-bottoms) filling the upper frame at dusk, eerie textural beauty, storm just-passed',
      'GROUND-FOG WITH SUNRISE TOPS — low ground-fog hugging the bloom-carpet to knee-height with clear amber-dawn sky above, distant ridges rising above the fog, bloom-tops poking through the mist',
      'PINK-CIRRUS HAIR — high pink-cirrus streaks combed across the dusk sky, no other clouds, gradient gold-to-magenta-to-violet from horizon to zenith, atmospheric perfection',
      'SUPERMOON OVER MOUNTAIN-PASS — oversized full moon rising in the saddle between two peaks, bloom-pass in the foreground softly lit, twilight blue around the moon',
      'ALPENGLOW ON HIGH PEAKS — last-light alpenglow making the highest snow-peaks blaze magenta-rose against a cooling deep-blue sky, valley below the bloom-meadow in twilight blue shadow',
      'COTTON-CANDY CIRROCUMULUS — high cirrocumulus mackerel-sky filling the upper frame at sunset, individual cells lit pink-and-gold, full horizon-spanning textural marvel',
      'CRIMSON-DUSK ON STORM-EDGE — sky split in half: storm-cell on left with rain-curtain and dark shoulder, clear crimson dusk on right, the boundary itself a sharp wall, dramatic',
      'MIDNIGHT-SUN ARCTIC HAZE — Arctic midnight-sun glow filling the upper frame in soft pink-and-amber, never setting below horizon, bloom-tundra in eternal golden hour',
    ],
    instructions: `Each entry is ONE specific cinematic sky / atmospheric upper-frame, 20-40 words. Format: "SKY MODE NAME CAPS — primary sky condition + color/light note + how it interacts with the bloom-landscape below". Vary across the 10 categories above. NEVER blank-blue or featureless. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: bloom_wall_type (what the macro bloom-mass is) ───
  bloombot_closeup_bloom_wall_type: {
    format: 'simple',
    theme: `MACRO BLOOM-WALL TYPES for the BloomBot closeup path. Each entry is ONE specific kind of living bloom-mass that fills the macro frame in its natural outdoor growth pattern. Each entry 25-50 words.

⚠️ MANDATORY — every entry must imply LIVING FLOWERS GROWING IN PLACE (vine / bush / climbing / cascading / blanketing). NEVER cut flowers, NEVER a bouquet, NEVER a vase, NEVER a studio backdrop. The macro view sees petals on the front blooms and the rest of the wall receding into shallow-DOF blur.

🚫 STRICT BANS:
  • NO cut flowers / bouquets / arrangements / vases / baskets / bowls / shelves
  • NO studio backdrops / dark backgrounds / wooden surfaces / "against a wall"
  • NO still-life / florist / market / table-top / gift-shop scenes
  • NO interiors (cozy's territory)
  • NO architecture / archways / pergolas / passages (garden-walk / conservatory)
  • NO urban / city / Mediterranean alley (city-flowers)
  • NO ruins / abandoned structures (reclaim)
  • NO landform-as-canvas (landscape's territory) — this is MACRO, not vista
  • NO surreal / floating / impossible (dreamscape)
  • NO tropical jungle understory (tropical-paradise)

✓ BLOOM-WALL CATEGORIES — distribute across these:
  A. **CLIMBING-VINE WALL** — climbing-vine wall thick with hanging racemes (clematis / wisteria / morning-glory style)
  B. **HEDGEROW CURTAIN** — densely-flowered hedgerow curtain (hawthorn / rhododendron / rose-hedgerow style)
  C. **MEADOW AT PETAL-LEVEL** — wildflower meadow viewed from petal-level with tall species filling vertical
  D. **CASCADING-CLIFF WALL** — bloom-mass cascading off a stone or cliff face (alpine cliff / coastal cliff garden)
  E. **CLIMBING-WALL OF AN OLD BUILDING** — bloom-clad wall of an old stone building (cottage wall / chapel wall / etc.)
  F. **TANGLED-BRAMBLE THICKET** — bramble-thicket interior with overlapping climbing-blooms and thorned stems
  G. **POND'S-EDGE WATER-FLOWER MASS** — water-flower mass at a pond's edge with reflective water visible at frame edge
  H. **FOREST UNDERSTORY BLOOM-CARPET** — at-floor view of a forest-floor bloom-carpet under canopy (bluebells / lily-of-valley / etc. style)
  I. **PERGOLA-DRIPPING UNDERSIDE** — view UP at the underside of a wisteria or jasmine-laden pergola, blooms dripping inward
  J. **MOSSY-BOULDER CREVICE BLOOMS** — alpine-style flowers cascading from mossy boulder crevices, dense at front blooming out
  K. **DUNE-EDGE COASTAL CLUMP** — coastal bloom-clump at the edge of a dune, sea-grass visible behind in blur
  L. **GARDEN-BORDER MASS** — perennial garden-border bloom-mass at petal-level, structure plants behind in blur

Channel: macro botanical illustration + Roger Deakins natural-light close-work + Studio Ghibli petal-level magic + National Geographic macro features.`,
    touchpoints: [
      'CLIMBING-VINE WALL THICK WITH HANGING RACEMES — vertical climbing-vine wall in full bloom, long pendant racemes hanging at viewer eye-level, individual front-most flowers in jewel-saturated focus, the rest of the vine-curtain receding into shallow-DOF blur',
      'HEDGEROW CURTAIN IN FULL FLOWER — dense flowering hedgerow viewed from petal-level, structure shrubs woven through with bloom-bursts, thorned stems and glossy leaves overlapping, hedgerow continuing on either side into the blur',
      'WILDFLOWER MEADOW AT PETAL-LEVEL — wildflower meadow viewed from camera-at-bloom-height, tall species filling the upper frame, mid-height blooms massed across the lower frame, the rest of the meadow receding into golden shallow-DOF blur',
      'CASCADING-CLIFF BLOOM-WALL — bloom-mass cascading down a stone-and-moss cliff face, fern-fronds and lichen-patches between the bloom-clusters, sky-glow at the top edge, cliff continuing down into the blur',
      'BLOOM-CLAD COTTAGE WALL — bloom-clad weathered stone or whitewashed cottage wall viewed from petal-level, climbing roses or jasmine in mass, the wall texture barely visible behind the bloom-curtain',
      'TANGLED-BRAMBLE THICKET INTERIOR — viewer INSIDE a thicket of climbing-bloom brambles, thorned stems woven across the frame, overlapping clusters of blooms catching shafts of light through the tangle',
      "POND'S-EDGE WATER-FLOWER MASS — water-flowers and reed-blooms at a pond's edge viewed from low petal-level, glossy water visible at the bottom frame edge, dragonflies-or-fish hinted in the blur behind",
      'FOREST-FLOOR BLOOM-CARPET — at-floor camera view of a forest-floor bloom-carpet, fern-fronds and moss between bloom-clusters, dappled sunbeams hitting the carpet, trees barely visible in soft upper blur',
      'PERGOLA-DRIPPING UNDERSIDE — view UP at the underside of a bloom-laden pergola, blooms dripping inward in pendant clusters at viewer level, structure barely visible behind the bloom-curtain, sky glimpsed at top edge',
      'MOSSY-BOULDER CREVICE BLOOMS — bloom-clusters cascading from mossy crevices in a granite boulder face, alpine micro-environment, ferns and lichens woven between, boulder continuing out of frame on all sides',
      'COASTAL DUNE-EDGE BLOOM-CLUMP — coastal bloom-clump at the edge of a sand-dune, salt-tolerant species in dense cluster at viewer level, sea-grass and beach-grass in blur behind, distant sea-glow at frame edge',
      'PERENNIAL GARDEN-BORDER MASS — perennial garden-border at petal-level, mass of structure-plants behind, taller spike-blooms in upper frame, low ground-cover at the base, garden continuing into blur',
      'WISTERIA-CURTAIN HANGING — vertical wisteria-curtain or jasmine-curtain of hanging blooms viewed from inside the curtain, fragrant racemes at viewer level, garden glow behind the curtain in shallow blur',
      'MEADOW-EDGE BLOOM-SPILL — wild meadow-edge where bloom-mass spills out into open ground, structure grasses behind, mixed species in clumpy distribution, meadow receding into golden blur',
      'CLIMBING-ROSE WALL ARCH — climbing-rose wall covering an old garden arch, rose-clusters at viewer eye-level, thorned stems woven through, the arch barely visible behind the rose-curtain, garden behind in blur',
    ],
    instructions: `Each entry is ONE specific KIND of macro bloom-wall in its NATURAL GROWING CONTEXT, 25-50 words. Format: "BLOOM-WALL TYPE CAPS — primary structure + macro front-plane detail + shallow-DOF blur context". ALWAYS living and growing-in-place. NEVER cut / bouquet / vase / studio. Vary across the 12 categories above. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: growing_context (where the bloom-wall lives) ───
  bloombot_closeup_growing_context: {
    format: 'simple',
    theme: `GROWING CONTEXTS for the BloomBot closeup path. Each entry is ONE specific natural-or-rustic environment in which a macro bloom-wall lives. Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a wider OUTDOOR / NATURAL ENVIRONMENT that the bloom-wall is rooted in. The viewer reads this through the shallow-DOF blur behind the front-most blooms. The context grounds the macro in a living place — never a void, never a studio.

🚫 STRICT BANS:
  • NO studio / backdrop / void / "isolated"
  • NO interiors / rooms (cozy's job)
  • NO urban architecture (city-flowers)
  • NO ruins / cathedrals (reclaim)
  • NO surreal / impossible (dreamscape)
  • NO landform-as-hero vista (landscape)

✓ GROWING-CONTEXT CATEGORIES:
  A. **COTTAGE GARDEN** — rustic cottage garden borders, weathered fence-posts, gravel paths
  B. **WILD MEADOW** — wild meadow with distant tree-line, golden grass receding
  C. **WOODLAND EDGE** — woodland edge with old-growth canopy receding behind
  D. **COASTAL HEADLAND** — coastal headland with sea-glow and distant horizon at frame edge
  E. **ALPINE SLOPE** — alpine mountain slope with distant snow-peak in soft blur
  F. **OLD STONE WALL** — old stone garden wall or chapel wall with weathered texture behind the bloom-curtain
  G. **POND OR STREAM EDGE** — reflective pond or stream edge with water visible at frame edge
  H. **WALLED-GARDEN INTERIOR** — old walled-garden interior with stone or brick walls in soft blur
  I. **HEDGEROW PATH** — country hedgerow with a path threading the bloom-curtain
  J. **GREENHOUSE-FREE GLASS-FRAME EDGE** — old wooden cold-frame or greenhouse edge (peripheral structure, NOT the focus — bloom-wall fills frame)
  K. **HILLSIDE TERRACE** — terraced hillside step with old retaining stone, distant valley in soft blur
  L. **WOODLAND CLEARING** — sunlit clearing within old-growth forest, trees in soft blur all around

Channel: BBC natural-history macro work + Studio Ghibli "in the garden" magic + cottagecore-but-not-twee.`,
    touchpoints: [
      'COTTAGE GARDEN BORDER — rustic cottage garden border behind the bloom-wall, weathered fence-posts and gravel path glimpsed in shallow blur, hint of an old apple-tree or potting-shed at the far edge of focus',
      'WILD MEADOW STRETCHING BEHIND — golden wild meadow stretching behind the bloom-wall into shallow-DOF blur, distant tree-line at the horizon edge of focus, midday or golden-hour glow softening the depth',
      'WOODLAND EDGE WITH OLD-GROWTH CANOPY — woodland edge behind the bloom-wall, old-growth trees with dappled sunbeams falling through canopy in shallow blur, forest-floor moss and ferns hinted between trunks',
      'COASTAL HEADLAND WITH SEA-GLOW — coastal headland behind the bloom-wall, distant sea-glow visible at frame edge through the shallow-DOF blur, hint of cliff-face and sea-grass between the bloom-clusters',
      'ALPINE SLOPE WITH DISTANT PEAK — alpine mountain slope behind the bloom-wall, distant snow-rimmed peak in soft blur, scree-cones and cushion-plants barely visible between the bloom-clusters',
      'OLD STONE WALL OF AN ABBEY — weathered stone wall of an old abbey or chapel barely visible behind the bloom-curtain, mossy stone and ivy-thread hinted between bloom-clusters, no other structure',
      'POND EDGE WITH REFLECTIVE WATER — pond edge behind the bloom-wall, glossy water at the bottom of the frame catching sky-light, dragonflies hinted in the soft blur, reed-clusters at the water-line',
      'WALLED-GARDEN INTERIOR — old walled-garden interior behind the bloom-wall, weathered brick or stone wall in soft blur, perhaps a wrought-iron gate or sundial barely visible between the bloom-clusters',
      'HEDGEROW PATH WINDING — country hedgerow path winding behind the bloom-wall, packed earth and grass-strip path threading the bloom-curtain into the deep distance, distant hedgerow continuing into blur',
      'OLD POTTING-SHED CORNER — weathered wooden potting-shed corner behind the bloom-wall, cracked terracotta pots and a watering can hinted in soft blur, garden tools faintly visible',
      'TERRACED HILLSIDE STEP — terraced hillside step behind the bloom-wall, old retaining stone of the next-up terrace barely visible in soft blur, distant valley glow at frame edge',
      'WOODLAND CLEARING SUN-DAPPLED — sun-dappled woodland clearing behind the bloom-wall, old-growth trees in soft blur all around, sunbeams piercing canopy onto the clearing-floor',
      'COTTAGE-CHIMNEY-CORNER — old cottage-corner stone visible behind the bloom-wall, climbing rose attached, lichen-patched chimney in soft blur, peaceful domestic edge implied',
      'CHURCHYARD-WALL — old churchyard wall behind the bloom-wall, weathered headstones in soft blur, mossy stone and ivy threading between the bloom-clusters, peaceful sanctuary mood',
      'DRY-STONE WALL FIELD-EDGE — dry-stone wall field-edge behind the bloom-wall, irregular weathered stones in soft blur, distant field receding behind the wall into golden blur',
    ],
    instructions: `Each entry is ONE specific OUTDOOR / NATURAL growing context that grounds the macro bloom-wall, 20-40 words. Format: "GROWING-CONTEXT NAME CAPS — primary environment + secondary natural detail + how it reads through the shallow-DOF blur". Vary across the 12 categories above. NEVER void / studio / interior. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: macro_phenomenon (60%-gated magic moment) ───
  bloombot_closeup_macro_phenomenon: {
    format: 'simple',
    theme: `60%-GATED MACRO PHENOMENA for the BloomBot closeup path. Each entry is ONE specific small magic-moment detail in the foreground that elevates the macro view. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon is SMALL, FOREGROUND, SPECIFIC. It's the second-look detail that makes the macro frame memorable. Sized for macro framing — single subject, jewel-detail.

🚫 STRICT BANS:
  • NO humans / hands / figures
  • NO architectural elements (bowls / vases / etc.)
  • NO surreal / impossible (dreamscape)
  • NO duplicate of growing_context content (no "distant horizon" — that's context)
  • NO wide-frame phenomena (rainbows / waterfalls / etc. — those belong in landscape path)

✓ MACRO-PHENOMENON CATEGORIES:
  A. **POLLINATOR** — hummingbird hovering / bee landing / butterfly mid-emerge / dragonfly perched / moth caught in light
  B. **WATER MAGIC** — single dew-drop hanging / dew-drop refracting rainbow / pollen-laden bead / mist-droplet on petal
  C. **LIGHT MAGIC** — sunbeam through one petal / halo on one cluster / back-lit translucent petal / golden-hour edge-glow on one bloom
  D. **MICRO-DETAIL** — pollen dust on petals / spider-web with beads / silk thread crossing frame / individual stamen / individual filament
  E. **PETAL-MOMENT** — single petal detached mid-fall / petal opening / bud half-bursting / wilted petal still attached for poignant contrast
  F. **TINY CREATURE** — ladybug on a stem / tiny tree-frog on a leaf / snail on a stem / chameleon clinging / gecko basking
  G. **WIND-MOMENT** — pollen-cloud dispersing from one bloom in side-light / petal-spiral mid-air / silk-strand catching light
  H. **POLLEN-COLOR** — visible pollen-mass on a stamen / pollen-dust on a bee's back / pollen-coated petal
  I. **NEST / EGG** — tiny hidden bird-nest at base of stem with speckled eggs / cocoon attached to a stem / abandoned chrysalis
  J. **OPTICAL** — dew-drop refracting full spectrum / one bloom mirror-perfect reflected in a dew-bead / heart-shaped dewdrop

Channel: macro-photography sensibility + David Attenborough close-up reverence + Studio Ghibli "look closer" detail magic.`,
    touchpoints: [
      'TINY HUMMINGBIRD HOVERING — solitary jewel-iridescent hummingbird hovering at one specific foreground bloom, wings a transparent blur, beak just touching the bloom, scale-perfect for the macro frame',
      'SINGLE DEW-DROP REFRACTING RAINBOW — solitary tear-shaped dew-drop hanging from one foreground petal, refracting a tiny full spectrum within itself, sunlight passing through, jewel-perfect detail',
      'SUNBEAM PIERCING ONE PETAL — single sun-ray hitting one specific foreground bloom-petal at a glancing angle, petal glowing translucent like stained glass, halo on the back, magic moment',
      'BUMBLEBEE LANDING ON CLUSTER — solitary fuzzy bumblebee landing on one foreground bloom-cluster, pollen-dust on its back, fur-on-thorax visible at macro scale, mid-motion',
      'BUTTERFLY OPENING WINGS — solitary butterfly mid-emerge on one foreground bloom, wings half-open showing the iridescent inner surface, dust of pollen drifting from the cluster, magic-moment',
      'DRAGONFLY BACK-LIT TRANSLUCENT — solitary dragonfly perched on one foreground stem, body back-lit by low sun making the abdomen and wings glow translucent amber, frozen mid-rest',
      'POLLEN-CLOUD DISPERSING IN WIND — visible cloud of golden pollen-dust drifting horizontally from one foreground bloom-cluster, caught mid-air in side-light, transient atmospheric magic',
      'SPIDER-WEB WITH WATER-BEADS — perfect orb-web stretched between two foreground bloom-stems, hundreds of water-beads on the silk catching the light like beaded pearls, jewel-detail',
      'SINGLE PETAL MID-FALL — solitary detached petal caught mid-air in side-light, suspended in the moment before it touches the bloom-mass below, motion-frozen, poetic',
      'LADYBUG ON A STEM — solitary scarlet-and-black ladybug on a foreground bloom-stem, individual spots crisp at macro scale, the bloom-mass behind in shallow blur',
      'TINY TREE-FROG ON LEAF — solitary jewel-green tree-frog on the underside of a leaf in the foreground bloom-cluster, eyes catching the light, tiny but vivid color-pop',
      'SNAIL ON A STEM — solitary snail mid-climb on a foreground bloom-stem, shell spiral crisp at macro scale, slime-trail catching light behind, scale-perfect detail',
      'INDIVIDUAL STAMEN AND POLLEN — single bloom in foreground with stamens prominently extended, pollen-mass visible on the anther-tips, filament shadows crossing the petals',
      'BUD HALF-BURSTING OPEN — solitary bloom-bud mid-burst in foreground, half-open showing the layered inner petals just unfurling, anticipation moment captured',
      'HEART-SHAPED DEWDROP — single dew-drop hanging from a foreground leaf-tip, naturally shaped exactly like a heart, sun catching it from behind, jewel-perfect detail',
      'POLLEN-MOTE CLOUD IN SUNBEAM — visible suspended pollen-motes drifting in a side-lit sunbeam crossing the foreground, hundreds of tiny golden points caught in the volumetric beam',
      'BEE BACK COVERED IN POLLEN — solitary honeybee on a foreground stamen, golden pollen-dust thick on its back and legs, individual pollen-grains visible at macro scale',
      'TINY HIDDEN NEST WITH EGGS — small cup-nest of woven grass tucked low in the foreground bloom-mass, three speckled eggs visible inside, intimate reward for the looking eye',
      'COCOON ATTACHED TO STEM — solitary moth-cocoon attached to a foreground bloom-stem, silk-fibers catching light, transformation-in-progress detail',
      'PETAL EDGE-LIT GOLDEN-HOUR — single foreground bloom with petal-edges lit by golden-hour rim-light, edge-amber glowing translucent against the soft-blur background',
    ],
    instructions: `Each entry is ONE specific SMALL FOREGROUND MAGIC-MOMENT detail for a macro frame, 20-40 words. Format: "PHENOMENON NAME CAPS — primary subject + macro detail + lighting/position note". Vary across the 10 categories above. ALWAYS small / foreground / specific. NO humans, NO architecture, NO wide-frame elements. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: interior_setting (the room canvas) ───
  bloombot_cozy_interior_setting: {
    format: 'simple',
    theme: `COZY INTERIOR SETTINGS for the BloomBot cozy path. Each entry is ONE specific WARM HUMBLE DOMESTIC interior space where flowers cascade / climb / drape / fill the architecture. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a WARM HUMBLE DOMESTIC space. Think: someone's beloved home that the garden has consumed. The interior architecture is visible and recognizable — but the flowers will dominate when rendered.

🚫 STRICT BANS:
  • NO palace / ballroom / grand interior / cathedral / chapel
  • NO commercial / hotel / corporate / shop / store
  • NO outdoor / garden / archway / pergola (garden-walk's territory)
  • NO conservatory / glass-and-iron greenhouse (conservatory's territory)
  • NO macro / closeup framing — this is INTERIOR scene with multi-tier depth
  • NO landscape / vista / beach / lagoon (other paths' territory)
  • NO ruins / abandoned crumbling structures (reclaim's territory)
  • NO surreal / floating / impossible (dreamscape)
  • NO humans / figures / hands / silhouettes

✓ INTERIOR-SETTING CATEGORIES — distribute across these:
  A. **SUNROOM / GLASSED CORNER** — sunroom with wicker chair / cushioned daybed, garden visible through panes
  B. **BREAKFAST NOOK** — breakfast nook with cushioned bench / checkered tablecloth / window light
  C. **WRITING DESK / STUDY** — writing desk under a window with typewriter / quill / open journal / candle
  D. **ARCHED-WINDOW READING SEAT** — window-seat bay with arched-window light and cushion-pile
  E. **ATTIC DORMER** — slope-ceiling attic dormer with skylight or dormer-window, brass-hook coat-rack, trunks
  F. **STAIRWELL LANDING** — carved-wood-banister stairwell landing with light spilling from above
  G. **KITCHEN CORNER** — vintage kitchen corner with copper pans / open shelves / herb-jars / sun-faded recipe-cards
  H. **FIRESIDE READING CHAIR** — armchair beside a stone or brick fireplace with mantelpiece detail
  I. **BEDROOM WINDOW SEAT** — bedroom window-seat or bedside with iron-frame bed / quilt cascading
  J. **CLAWFOOT-BATH ALCOVE** — clawfoot-bathtub alcove with brass faucet, window beyond, cascading bloom-vine
  K. **PARLOR CORNER** — Victorian parlor corner with horsehair settee / lace doily / brass lamp / wallpaper
  L. **GARRET / TURRET ROOM** — small turret or garret room with curved walls / one window / desk
  M. **POTTING ROOM / MUDROOM** — country potting-room or mudroom with terracotta pots / hung baskets / coat hooks
  N. **LIBRARY ALCOVE** — small library alcove with floor-to-ceiling bookshelves / brass reading lamp / leather chair
  O. **GREENHOUSE-DOOR THRESHOLD** — interior doorway leading INTO the garden / glasshouse, threshold scene

Lineage to channel: Wes Anderson interior frames + Studio Ghibli "Whisper of the Heart" / "Kiki's Delivery Service" bedrooms + Anne-Brontë cottage interiors + Pinterest "old soul home" boards + Pre-Raphaelite parlor stagings + Beatrix Potter cottage interiors + Vermeer light-through-window painterly grounding.`,
    touchpoints: [
      'SUNROOM WITH WICKER DAYBED — bright sunroom corner with white wicker daybed and ticking-stripe cushions, garden visible through tall multi-pane windows, terracotta floor-tiles, hanging-basket overhead, dust-motes in the slanting morning light',
      'BREAKFAST NOOK WITH CHECKERED CLOTH — breakfast nook with cushioned bench beneath a leaded-glass window, checkered tablecloth with china teapot and honey-jar, faded wallpaper visible behind, golden-hour light raking across the cloth',
      'WRITING DESK UNDER ARCHED WINDOW — wooden writing desk under a tall arched window with leaded-glass panes, vintage typewriter on the desk, brass candlestick, open leather-bound journal, scattered papers, late-afternoon light slanting in',
      'ARCHED-WINDOW READING SEAT — deep window-seat in a stone arch with cushion-pile and folded quilt, leaded-glass window, garden glow beyond, side-table with a stack of weathered books and reading lamp',
      'ATTIC DORMER WITH SKYLIGHT — slope-ceiling attic dormer room with a small dormer-window and skylight above, brass coat-hooks, leather steamer-trunk, wide-plank wood floor, light catching the dust',
      'CARVED-WOOD STAIRWELL LANDING — turn in a carved-wood-banister stairwell with a landing window, light spilling from above onto the worn runner, pewter-handled cabinet against the wall',
      'COUNTRY KITCHEN COPPER CORNER — vintage country-kitchen corner with hanging copper pans, open shelves of mismatched china, herb-jars, sun-faded recipe-cards on the wall, white-painted cupboards, brass tap above a porcelain sink',
      'FIRESIDE LEATHER ARMCHAIR — worn leather armchair beside a stone fireplace with brass andirons and a mantelpiece holding clay pots, sun-bleached photograph, side-table with a kerosene lamp',
      'IRON-FRAME BEDROOM WINDOW SEAT — bedroom with iron-frame bed and patchwork quilt cascading off the side, window-seat at the foot of the bed with a folded shawl, lace curtain stirring at the open window',
      'CLAWFOOT-BATH ALCOVE — vintage clawfoot bathtub on lion-claw feet in a tiled alcove, brass cross-handle faucet, hexagonal floor-tiles, tall window with leaded-glass behind, cake of soap in a porcelain dish',
      'VICTORIAN PARLOR CORNER — Victorian parlor corner with green velvet horsehair settee, lace antimacassar, brass-shaded reading lamp, William Morris wallpaper, ornate side-table with daguerreotype frame',
      'TURRET STUDY WITH CURVED WALL — small circular turret-room study with curved stone walls, one tall arched window, wooden writing desk, candle in pewter holder, leather-bound atlas open on the desk',
      'COUNTRY POTTING ROOM — country potting-room with rough-plank shelves of terracotta pots, hanging woven baskets, coat-hooks with garden-aprons, weathered watering-can, cracked clay tile floor',
      'LIBRARY ALCOVE WITH BRASS LAMP — small library alcove with floor-to-ceiling oak bookshelves on three walls, leather wingback chair, brass-shaded reading lamp, side-table with a porcelain tea-cup',
      'GREENHOUSE-DOOR THRESHOLD — interior threshold of a stone-floored room opening through wood-and-glass doors INTO a sunlit garden room beyond, terracotta pots flanking the doorway',
      'WINDOW-CORNER POTTING TABLE — small interior potting-corner with a rough wooden table beneath a window, terracotta pots stacked beside trowel and twine, water-pitcher, light streaming through the wavy glass',
      'STUDIO CORNER WITH EASEL — small painter studio corner with an easel by a north-facing window, jars of brushes, palette on a side-table, paint-stained wood floor, canvases stacked against the wall',
      'COTTAGE LOFT BED — cottage loft bedroom with a low-ceiling alcove bed under a sloped beam roof, a tiny window with garden view, hand-stitched quilt, oil-lamp on a wall-shelf',
      'TEA-ROOM ALCOVE — cozy tea-room alcove with a round table, bentwood chairs, pressed-tin ceiling, tall window with leaded glass, vase-and-pot collection on a sideboard',
      'WRITING-ROOM ARMCHAIR + DESK — writing-room scene with an armchair pulled up to a roll-top desk, brass-shaded lamp, fountain pen, stack of letters tied with ribbon, embroidered footstool',
    ],
    instructions: `Each entry is ONE specific COZY INTERIOR SETTING, 25-50 words. Format: "SETTING NAME CAPS — primary room features + furniture detail + window/light note". Vary across the 15 categories above. ALWAYS warm humble domestic — NEVER palace / ballroom / grand / commercial / outdoor. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: furniture_anchor (the structural piece) ───
  bloombot_cozy_furniture_anchor: {
    format: 'simple',
    theme: `COZY FURNITURE ANCHORS for the BloomBot cozy path. Each entry is ONE specific WARM DOMESTIC furniture piece or built-in element that anchors the bloom-cascade. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a TACTILE WARM-DOMESTIC piece — worn-wood / cast-iron / brass / wicker / linen / mossed-velvet / hand-stitched. Real-world humble materials that read "someone's lived-in beloved home". The piece is what the bloom-mass cascades around / through / over / off.

🚫 STRICT BANS:
  • NO ornate-palace furniture (gilded thrones / marble pedestals / chandelier-arms)
  • NO commercial / corporate / sleek-modern furniture
  • NO architectural elements that are the SETTING (those are interior_setting territory) — this is specific PIECES
  • NO humans / hands / figures / silhouettes
  • NO duplication of interior_setting content

✓ FURNITURE-ANCHOR CATEGORIES:
  A. **SEATING** — wicker chair / cushioned bench / leather armchair / window-seat with cushion-pile / horsehair settee / bentwood chair / rocking chair / clawfoot tub
  B. **TABLE / DESK** — writing desk / tea-table / kitchen table / potting bench / round bistro table / roll-top desk / sewing table
  C. **BED / SLEEPING** — iron-frame bed / four-poster / loft bed / window-bed / quilted bed / sleigh bed
  D. **STORAGE** — wooden shelf / open cupboard / pewter-handled cabinet / leather-trunk / book-shelf / china-cabinet / curio shelf
  E. **WALL ARCHITECTURE** — carved-wood banister / brass coat-hooks / mantelpiece with brass andirons / window-sill with cushion / floor-to-ceiling bookshelves
  F. **VESSEL / OBJECT** — terracotta pots / china teapot / brass watering-can / wicker basket / leather-bound book / oil-lamp / candle in pewter holder / kerosene lamp / typewriter / brass-shaded reading lamp
  G. **TEXTILE** — patchwork quilt / hand-stitched runner / faded ticking-stripe cushion / lace doily / linen curtains / William Morris wallpaper / embroidered footstool / shawl on a hook
  H. **VINTAGE INSTRUMENT** — Singer sewing-machine / Underwood typewriter / brass clock / phonograph horn / Victrola / kerosene lamp / piano upright / fountain pen on a desk

Channel: Pinterest "old soul home" boards + Beatrix Potter cottages + Anne Brontë parsonage + Vermeer interiors + Wes Anderson set-design + Studio Ghibli "Whisper of the Heart" bedrooms + Anthropologie home catalog (without the brand) + estate-sale finds.`,
    touchpoints: [
      'WORN LEATHER WINGBACK ARMCHAIR — sun-aged tobacco-brown leather wingback armchair with a folded woolen throw on the arm, brass studs along the seams, a stack of books on the floor beside it',
      'IRON-FRAME BED WITH PATCHWORK QUILT — black wrought-iron-frame bed with brass finials on the corners, patchwork quilt with hand-stitched seams cascading off the side, embroidered pillow at the head',
      'CARVED-WOOD BANISTER — turn in a hand-carved oak banister polished smooth by generations, brass acorn finial at the newel post, worn floral runner beneath',
      'BRASS-SHADED READING LAMP — brass-shaded reading lamp on a small side-table beside an armchair, the bulb casting a warm pool of amber light onto an open leather-bound book',
      'PATCHWORK QUILT CASCADING — patchwork quilt with hand-stitched seams cascading off the side of an unmade bed, layered with a folded shawl and a sleeping cat shape (if implied)',
      'WICKER ROCKING CHAIR — white wicker rocking chair beside a window, a folded crochet blanket on the seat, a basket of yarn beside it, slanting sunlight catching the weave-pattern',
      'OAK ROLL-TOP DESK — oak roll-top desk with a tarnished brass key in the lock, fountain pen and ink-bottle on the writing surface, tilted brass desk-lamp, stack of letters tied with red ribbon',
      'CLAWFOOT BATHTUB — vintage white clawfoot bathtub on cast-iron lion-claw feet, brass cross-handle faucet, cake of soap in a porcelain dish on the rim, folded linen towel hung on a brass rail',
      'COPPER POT-HANG RAIL — overhead iron pot-rail with hanging copper pans of graduated size, copper measuring-cups, brass ladles, soft glow on the bronze metal',
      'TERRACOTTA POT COLLECTION — collection of weathered terracotta pots of graduated size on a rough-plank shelf, with stamps of old nurseries visible, dust patina, garden-trowel propped beside',
      'OAK BOOKSHELF FLOOR-TO-CEILING — floor-to-ceiling oak bookshelf with leather-bound spines, brass library ladder leaning against it, framed botanical prints on a corner panel',
      'CHIPPED ENAMEL FARMHOUSE SINK — chipped enamel farmhouse sink with brass cross-handle taps, draining board with china cups upended, lace curtain at the window above',
      'WROUGHT-IRON DAYBED — wrought-iron daybed with a striped-ticking mattress and pile of mis-matched throw cushions in soft faded patterns, a folded linen sheet at the foot',
      'ROUND BISTRO TABLE — small round wrought-iron bistro table with a chipped marble top, two bentwood chairs pulled up, a china teapot and two cups, a folded napkin',
      'STONE FIREPLACE WITH ANDIRONS — stone-built fireplace with brass andirons, woven-rush mat on the hearth, a worn leather chair pulled close, a copper kettle on a hob',
      'CHURCH-PEW BENCH — old church-pew bench against a wall, polished smooth by years of sitting, a folded crochet blanket on it, a basket of pinecones beside',
      'VINTAGE UNDERWOOD TYPEWRITER — vintage Underwood typewriter on a wooden desk, half-typed page in the carriage, fountain pen beside it, brass desk-lamp tilted toward the page',
      'WALL OF FRAMED BOTANICALS — wall covered in framed antique botanical prints in mismatched brass and wooden frames, faded matting, a brass-armed reading lamp jutting from the wall below',
      'CAST-IRON STOVE — old cast-iron stove with brass handles, copper kettle on top, brass scuttle of coal beside it, wood-stacked alcove with a folded blanket on top',
      'POTTING-TABLE WITH TROWELS — rough-plank potting table with terracotta pots, garden trowels, twine on a hook, a wide-mouthed glass jar of seeds, soil-dust on the surface',
    ],
    instructions: `Each entry is ONE specific COZY FURNITURE ANCHOR PIECE, 20-40 words. Format: "FURNITURE NAME CAPS — primary piece + material + tactile detail + position-hint". Vary across the 8 categories above. NEVER ornate-palace / commercial. ALWAYS warm-domestic-lived-in tactile materials. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: atmospheric_moment (60%-gated warm magic) ───
  bloombot_cozy_atmospheric_moment: {
    format: 'simple',
    theme: `60%-GATED COZY ATMOSPHERIC MOMENTS for the BloomBot cozy path. Each entry is ONE specific small warm-domestic magic-moment detail in the foreground. Each entry 20-40 words.

⚠️ MANDATORY — every moment is SMALL, FOREGROUND, SPECIFIC. It's the second-look detail that makes the room feel ALIVE without humans being present. The room reads inhabited / loved / recently-departed.

🚫 STRICT BANS:
  • NO humans / hands / figures in the moment
  • NO architectural elements (those are interior_setting territory)
  • NO duplication of furniture_anchor content
  • NO outdoor / wide-frame phenomena
  • NO surreal / impossible

✓ COZY MOMENT CATEGORIES:
  A. **LIGHT MAGIC** — slanting sunbeam catching dust-motes / sunbeam pooling on a chair / golden-hour rake across a quilt / candle-flicker shadow / lamp-glow halo
  B. **SLEEPING ANIMAL** — curled cat on a sun-patch on a cushion / dog asleep on a rug / songbird perched at the window / canary in a brass cage
  C. **STEAM / VAPOR** — fragrant tea steam rising from a chipped china cup / coffee-pot steam / cake-cooling steam from a kitchen towel-bundled loaf / candle smoke
  D. **TEXTURE DETAIL** — folded-edge of a hand-stitched quilt / brass-tarnish patina / wax-pool on a candle-holder / dew on a windowsill / book-spine cracks
  E. **JUST-LEFT** — open book half-read on the chair / unfinished embroidery in a hoop / cup of tea half-drunk / a knitted scarf draped mid-row / a half-eaten cookie
  F. **WINDOW-LIFE** — songbird at the window / hummingbird at a hanging bloom / curtain breathing in the breeze / rain-streaks on the pane / snowflakes drifting past
  G. **PETAL DETAIL** — single petal fallen on the windowsill / petal drift on a polished tabletop / pollen-dust on a brass surface
  H. **OBJECT WARMTH** — single brass key on a desk / a single fountain pen with the cap off / a stack of letters tied with ribbon / a pressed flower in an open book
  I. **SOUND IMPLIED** — kettle on the verge of whistling / clock-pendulum hovering at full swing / phonograph needle resting on a record
  J. **SCENT IMPLIED** — vanilla candle freshly extinguished / cinnamon-spice from a baking dish / pine-bough on the mantel

Channel: Studio Ghibli "Whisper of the Heart" detail framing + Vermeer light-on-domestic-object + Wes Anderson props + Anne Brontë parsonage + Anthropologie still-life vignettes + cozy-cottage-cinema. The "someone just stepped out of frame" mood.`,
    touchpoints: [
      'SLANTING SUNBEAM WITH DUST MOTES — single golden-hour sunbeam slanting through a window onto a cushion, individual dust-motes suspended in the light, the only thing moving in the still room',
      'CURLED CAT ON SUN-PATCH — solitary tabby cat curled asleep in a sun-warmed patch on a faded cushion, tail tucked around its body, breathing implied, only one ear visible in the soft sun',
      'STEAM FROM A CHIPPED CHINA CUP — wisp of fragrant tea steam rising from a chipped china cup on a small side-table, the cup half-full, a single tea-leaf settling at the bottom',
      'OPEN BOOK ON A CHAIR — leather-bound book left open face-down on an armchair seat, page-marker ribbon hanging, reading glasses folded beside it on the cushion',
      'PATCHWORK QUILT FOLD DETAIL — close detail of a folded edge of a hand-stitched patchwork quilt, individual cross-stitches visible in faded thread, one corner pulled slightly back',
      'HUMMINGBIRD AT WINDOW BLOOM — solitary hummingbird hovering at a bloom-cluster spilling from the windowsill, wings a transparent blur, jewel-iridescent body catching the window-light',
      'UNFINISHED EMBROIDERY IN HOOP — solitary embroidery hoop with half-finished floral pattern, needle pinned at the edge mid-stitch, a small basket of colored threads beside it',
      'SONG-BIRD AT THE WINDOW — solitary songbird (sparrow / wren / robin) perched at the windowsill from the outside, head tilted, looking IN through the leaded glass',
      'CANDLE-WAX POOL ON BRASS HOLDER — solitary candle in a brass holder, the candle low and the wax pooled around the base in soft creamy ridges, flame implied or just extinguished',
      'PRESSED FLOWER IN AN OPEN BOOK — pressed flower visible between the pages of an open weathered book, single petal slightly raised, the ink of the page faded',
      'PETAL FALLEN ON WINDOWSILL — single fallen petal resting on a sun-warmed windowsill, dust-motes in the slanting light around it, the only fallen element in the otherwise tidy frame',
      'CURTAIN BREATHING IN BREEZE — sun-bleached linen curtain stirred slightly by a breeze through an open window, garden visible just beyond in soft-focus',
      'WAX-POOLED CANDLE ON A DESK — single low candle in a pewter holder on the corner of a desk, wax pooled in soft drips around the base, recently lit with a faint after-smoke',
      'RAIN-STREAKS ON WINDOW — leaded-glass window with rain-streaks tracing the panes, the warm interior reflected faintly in the wet glass, lamp-glow hazing across the streaks',
      'KETTLE NEAR WHISTLE — copper kettle on a cast-iron stove just at the moment before it whistles, a thin curl of steam beginning to escape the spout',
      'LETTERS TIED WITH RIBBON — neat stack of weathered letters tied with a faded red ribbon on a writing desk, top envelope addressed in faded ink, sealing-wax on the back',
      'POLLEN ON BRASS SURFACE — fine pollen-dust on the brass surface of a candleholder or lamp-base, evidence the blooms above have shed in the still air',
      'SLEEPING DOG ON RUG — solitary dog asleep on a worn rug beside a fireside chair, paws tucked, snout on the front paws, soft breathing implied',
      'CINNAMON-SPICE FROM A DISH — implied warm cinnamon-spice from a small baking-dish cooling on a kitchen counter, towel-wrapped, the kitchen window beyond with garden glow',
      'FOUNTAIN PEN UNCAPPED — fountain pen with the cap off on a writing desk, ink-bead at the nib, fresh inkwell beside it, a sheet of paper with the first line just written',
    ],
    instructions: `Each entry is ONE specific SMALL WARM-DOMESTIC magic-moment detail, 20-40 words. Format: "MOMENT NAME CAPS — primary subject + tactile detail + lighting/position note". Vary across the 10 categories above. ALWAYS small / foreground / specific. NO humans. NO architecture (interior territory). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: archway_type (architectural framing entity) ───
  bloombot_garden_walk_archway_type: {
    format: 'simple',
    theme: `GARDEN-WALK ARCHWAY TYPES for the BloomBot garden-walk path. Each entry is ONE specific architectural framing entity that forms a walkable passage HALF-CONSUMED by climbing blooms. The archway is the eye's destination, centered in a symmetric portrait composition. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a NATURAL or HANDMADE WEATHERED structure (stone / iron / wood / living vegetation). The arch's silhouette is CLEAR but the bloom-mass wraps and drapes over it. NEVER modern / commercial / sleek / corporate.

🚫 STRICT BANS:
  • NO modern / commercial / corporate architecture
  • NO interiors / rooms / sunrooms (cozy)
  • NO open landscapes without a framing entity (landscape)
  • NO conservatory glass-and-iron (conservatory)
  • NO urban architecture / city alley (city-flowers)
  • NO ruins as PRIMARY subject (reclaim) — but vine-curtained ruin doorway as archway is FINE
  • NO surreal / floating / impossible (dreamscape)
  • NO tropical jungle vine-curtain that fills the frame (tropical-paradise) — narrow arched passage only
  • NO people / hands / figures / silhouettes / hooded figures at the arch

✓ ARCHWAY CATEGORIES:
  A. **STONE ARCH** — gothic stone archway / Roman arch / weathered chapel doorway / abbey ruin arch / castle wall postern
  B. **WROUGHT-IRON ARBOR** — wrought-iron rose-arbor / Victorian iron arch / decorative iron rose-trellis arch
  C. **WOODEN-PERGOLA TUNNEL** — wisteria pergola tunnel / hop-pergola / vine-pergola with weathered posts / cedar-beam arch
  D. **LIVING VEGETATION ARCH** — gnarled branch arch / two trees grown together / hedgerow gap arched naturally
  E. **TEMPLE-RUIN DOORWAY** — Khmer / Mayan / Roman / Norse / Celtic vine-curtained temple ruin
  F. **HEDGEROW TUNNEL** — formal hedgerow tunnel / yew-tunnel / boxwood-arch
  G. **STEPPED DOORWAY** — cottage stone-stepped doorway / Mediterranean blue-painted door / Provence courtyard gate
  H. **CRUMBLED GATE** — old garden gate left ajar / iron-gate gone to rust / wooden-gate with peeling paint
  I. **OAK BRANCH ARCH** — two ancient oaks bowed over a path / cathedral of branches / forest-glade arch
  J. **MOSSY-STONE GATEWAY** — mossy-stone gateway / lichen-covered wall opening / dry-stone wall arch
  K. **FAIRY-TALE DOORWAY** — round hobbit-hole-style doorway / carved garden-fairy doorway / arched cottage door
  L. **STREAM-CROSSED BRIDGE-ARCH** — small stone bridge with arch over a stream, blooms cascading from above
  M. **VINE-CURTAIN TUNNEL** — ivy or jasmine vine-curtain forming a hanging-vegetal tunnel
  N. **FOREST-GLADE OPENING** — natural break between forest-canopy trees forming an arch overhead

Lineage to channel: Princess Mononoke ancient-forest gates + Studio Ghibli secret-garden archways + Pre-Raphaelite tunnel-of-roses paintings + Frances Hodgson Burnett "The Secret Garden" door + Tasha Tudor cottage-garden gates + Beatrix Potter mossy doorways.`,
    touchpoints: [
      'GOTHIC STONE ARCHWAY SMOTHERED IN ROSES — pointed gothic stone archway half-consumed by climbing roses and vine-curtains, weathered stone with moss-and-lichen patina visible between the bloom-clusters, deep recess in the stone framing the passage beyond',
      'WISTERIA-PERGOLA TUNNEL — wooden pergola tunnel with weathered cedar beams supporting a dense wisteria roof of hanging racemes, pendant blooms dangling at viewers brow-height, dappled light through the canopy',
      'WROUGHT-IRON ROSE-ARBOR — wrought-iron rose-arbor with curling Victorian scrollwork rusted to a warm patina, climbing roses spiraling up both sides, arched top dense with bloom-clusters',
      'GNARLED BRANCH ARCH — two ancient gnarled trees grown together overhead forming a natural arch, branches woven and bark-textured, lichen-and-moss on the trunks, blooms massed at the base of each trunk',
      'KHMER VINE-CURTAINED TEMPLE DOORWAY — ancient Khmer-style stone temple doorway half-collapsed and entirely vine-curtained, weathered carvings visible between the climbing blooms, jungle threshold beyond',
      'YEW-HEDGE TUNNEL OPENING — formal yew-hedge tunnel with arched opening, walls of dense dark-green yew on both sides, climbing-bloom mass at the entry-point, glowing light at the tunnel far-end',
      'COTTAGE-STONE STEPPED DOORWAY — weathered stone-stepped cottage doorway with painted blue door cracked open, climbing roses and clematis on either side of the frame',
      'OLD GARDEN-GATE GONE TO RUST — old iron garden-gate left ajar at a stone wall opening, hinges rusted to amber-and-orange, climbing-bloom mass spilling through the gap',
      'OAK CATHEDRAL OF BRANCHES — two ancient oak trees grown together with branches arched overhead forming a cathedral of branches, leaf-and-bloom canopy filtering light, mossy trunks framing the passage',
      'MOSSY-STONE WALL GATEWAY — opening in a moss-covered dry-stone wall, lichen-patterns on the stones, climbing-bloom mass at the entry, sun-glow beyond',
      'ROUND HOBBIT-DOORWAY GATE — round wooden door in a stone-framed earthen wall, climbing-flowers around the frame, the door slightly ajar revealing the path beyond',
      'STONE-BRIDGE ARCH WITH BLOOMS — small stone bridge with low arched span over a stream, climbing-blooms cascading from the bridge balustrade, water visible passing underneath',
      'IVY VINE-CURTAIN TUNNEL — vertical ivy vine-curtain forming a hanging-vegetal tunnel, blooms threaded through the ivy mass, dappled light through the curtain breaks',
      'FOREST-GLADE NATURAL OPENING — natural opening between forest-canopy trees forming an arched silhouette overhead, bloom-laden branches at the entry-point, sunlit glade beyond',
      'ABBEY-RUIN STONE ARCH — half-collapsed abbey ruin stone arch with broken capitals and ivy curtains, weathered carved-stone detail visible, hush of sacred-overgrown atmosphere',
      'MEDITERRANEAN BLUE-PAINTED DOOR — Mediterranean blue-painted wooden door in a whitewashed stone arch, bougainvillea climbing the frame, sun-bleached threshold with petals scattered at the base',
      'CHURCHYARD-WALL GATE — weathered churchyard-wall gate of black iron, lichen on the stone posts, climbing-roses and ivy threading the bars, sunlit graveyard glow beyond',
      'CELTIC-RUIN DOORWAY ARCH — Celtic standing-stone doorway arch with weathered carvings, ivy and bloom-vines softening the stones, the path leading to a sacred grove beyond',
      'PROVENCE COURTYARD GATE — weathered Provence courtyard gate of old wood and iron hinges, lavender-and-rose climbing both posts, sun-warmed terracotta path beyond',
      'BAMBOO-AND-VINE TUNNEL — bamboo-pole tunnel with arched canopy of woven-bamboo and climbing-vine, dappled light through the bamboo verticals, soft glow at the tunnel exit',
    ],
    instructions: `Each entry is ONE specific ARCHWAY ENTITY half-consumed by climbing blooms, 25-50 words. Format: "ARCHWAY NAME CAPS — primary structure + material + bloom-consumption note + framing implication". Vary across the 14 categories above. ALWAYS natural / handmade / weathered. NEVER modern / commercial / sleek. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: path_material (the path leading dead-center) ───
  bloombot_garden_walk_path_material: {
    format: 'simple',
    theme: `GARDEN-WALK PATH MATERIALS for the BloomBot garden-walk path. Each entry is ONE specific tactile path-surface visible from the bottom-center of the frame leading dead-center into the archway depths. Each entry 15-30 words.

⚠️ MANDATORY — every entry is a TACTILE NATURAL or HANDMADE path surface that the viewer could almost FEEL underfoot. The path is VISIBLE from the foreground, leading IN.

🚫 STRICT BANS:
  • NO modern paving / asphalt / concrete / commercial walkway
  • NO sidewalks / urban paths (city-flowers territory)
  • NO interior floors (cozy territory)
  • NO duplication of archway content — this is just the PATH SURFACE
  • NO humans / footprints implying recent passage (the path is undisturbed and inviting)

✓ PATH-MATERIAL CATEGORIES:
  A. **STONE FLAGSTONES** — flagstone path / cobblestone / cracked-flag with moss in the joints / weathered slate steps
  B. **PACKED EARTH** — packed-earth path / dirt path with grass-edges / sun-warmed clay
  C. **PETAL CARPET** — carpet of fallen petals / petal-strewn earth / petal-and-moss layered floor
  D. **MOSSY STEPS** — mossy stone steps / fern-edged stone treads / lichen-covered steps
  E. **STEPPING-STONES** — round stepping-stones across moss / stepping-stones over a shallow stream / flat-stones placed in grass
  F. **WOODEN BOARDS** — weathered wooden-board path / decking with grass between / cedar-plank walkway
  G. **GRAVEL** — pea-gravel path / crushed-shell path / weathered crushed-brick path
  H. **GRASS-PATH** — mowed grass path / mowed-grass corridor between bloom-beds / sun-warmed turf
  I. **CRUSHED-STONE** — crushed-stone path / pebble-and-sand walkway
  J. **WATER-CROSSING** — stepping-stones over a small stream / wooden plank over a brook
  K. **BRICK** — old red-brick path / herringbone-brick / weathered brick with moss-joints
  L. **SAND-AND-PETAL** — sandy-earth path with petal scatter / golden sand strewn with fallen blooms

Channel: Burnett "The Secret Garden" path + Studio Ghibli garden paths + Tasha Tudor cottage-garden walks + Beatrix Potter mossy steps.`,
    touchpoints: [
      'WEATHERED FLAGSTONE PATH — weathered grey flagstone path with moss-and-lichen-filled joints leading from foreground dead-center into the archway depths, fallen petals scattered across the stones',
      'MOSSY STONE STEPS ASCENDING — series of mossy stone steps rising slightly into the archway, fern-fronds spilling from the step-edges, individual stones visible at the foreground',
      'PETAL-CARPET EARTH PATH — packed-earth path almost entirely covered in a thick carpet of fallen petals in mixed soft colors, the path-form visible by the slight depression in the petal layer',
      'STEPPING-STONES OVER SHALLOW STREAM — round flat stepping-stones placed across a shallow stream that crosses the path, clear water flowing visibly between the stones, mossy edges',
      'PACKED-EARTH PATH WITH GRASS EDGES — packed-earth dirt path with grass and tiny wildflower edges where the path meets the bloom-beds, footworn smooth in the center',
      'WEATHERED WOODEN-BOARD WALKWAY — weathered wooden-board walkway with grass growing in the seams, the boards sun-faded silver-grey, leading into the arch',
      'PEA-GRAVEL CRUNCH PATH — pea-gravel path with the slight depression of frequent walking, individual stones visible at the foreground, slight petal scatter on the gravel',
      'GRASS PATH MOWED THROUGH MEADOW — mowed grass corridor cutting through a wild bloom-meadow on both sides, the grass softer than the surrounding tall flowering plants',
      'OLD RED-BRICK HERRINGBONE — old red-brick path in herringbone pattern, individual bricks weathered with moss-and-lichen at the joints, brick-edges slightly worn',
      'COBBLESTONE WITH MOSS-JOINTS — old cobblestone path with deep moss-filled joints, rounded individual stones polished smooth by years of walking',
      'CRACKED SLATE PATH — cracked slate path with darker slate steps rising into the arch, lichen on the slate, individual cracks visible in the foreground',
      'SAND-AND-PETAL PATH — golden sandy-earth path strewn with fallen blooms and pollen-dust, the path slightly depressed where walked, leading dead-center',
      'WHITE CRUSHED-SHELL PATH — white crushed-shell path leading from the foreground into the arch, shell-fragments individually visible, slight depression where walked',
      'MOSSY-STONE STEPS WITH FERN EDGES — moss-covered stone steps ascending into the arch with fern-fronds spilling from every step-edge, deep green and earth-toned',
      'CEDAR-PLANK WALKWAY — weathered cedar-plank walkway with grass between the planks, the wood sun-bleached silver-grey, leading into the archway',
    ],
    instructions: `Each entry is ONE specific TACTILE PATH SURFACE leading dead-center into the arch, 15-30 words. Format: "PATH MATERIAL NAME CAPS — primary surface texture + secondary detail + leading-into-arch implication". Vary across the 12 categories. NEVER modern paving / sidewalk / urban. NO humans / footprints. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: destination_glimpse (what lies beyond the arch) ───
  bloombot_garden_walk_destination_glimpse: {
    format: 'simple',
    theme: `GARDEN-WALK DESTINATION GLIMPSES for the BloomBot garden-walk path. Each entry is ONE specific glimpse of what lies BEYOND the archway opening — lit warmer than the foreground, glowing like a doorway to somewhere magical. Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a CONTINUING BLOOM-WORLD beyond the arch (never a blank backdrop). The destination is GLIMPSED through the arch — soft-focus / glowing / atmospheric / inviting. The warm light at the destination contrasts the cooler foreground.

🚫 STRICT BANS:
  • NO blank backdrop / void / studio
  • NO urban / city / corporate (city-flowers)
  • NO interiors (cozy territory)
  • NO ruins as PRIMARY (reclaim)
  • NO surreal / impossible (dreamscape)
  • NO humans / figures in the destination
  • NO duplication of archway content — this is what's BEYOND the arch

✓ DESTINATION-GLIMPSE CATEGORIES:
  A. **BLOOM-MEADOW** — sun-drenched bloom-meadow / wildflower field / cottage-garden border
  B. **FOREST CLEARING** — sunlit forest clearing / glade with shafts of light / bluebell carpet
  C. **POND / WATER** — small pond with lily-pads / reflective pool / stream-bend with bloom-banks
  D. **DISTANT COTTAGE** — distant stone cottage with smoking chimney / tudor cottage / fairy-tale dwelling glimpsed
  E. **SECRET-GARDEN INTERIOR** — secret-garden interior with central fountain / sundial / arbor
  F. **HEDGEROW MAZE** — hedgerow maze opening / formal-garden parterre / topiary chamber
  G. **CLIFF / OVERLOOK** — overlook to distant valley / cliff-top with sea / mountain-pass view
  H. **WALLED GARDEN** — walled-garden interior with old stone walls / espaliered fruit / cottage garden
  I. **SUNLIT TUNNEL CONTINUATION** — the path continues into another tunnel of blooms / another archway in deep distance
  J. **GLOWING BLOOM-AMPHITHEATRE** — natural amphitheatre of blooms / circular bloom-clearing
  K. **STREAM CORRIDOR** — stream corridor with blooms on both banks / shaded waterway
  L. **GROVE OF ANCIENT TREES** — grove of ancient trees with blooms at the trunks / cathedral of trees
  M. **HIDDEN POND** — circular pond with lily-pads and bloom-edged banks
  N. **MEADOW WITH DEER / WILDLIFE** — meadow beyond with deer / herd in soft-focus distance

Channel: Burnett "Secret Garden" reveal + Studio Ghibli secret-place reveals + Tasha Tudor secret-cottage glimpse + fairy-tale-illustrated path-destinations.`,
    touchpoints: [
      'SUN-DRENCHED BLOOM-MEADOW — sun-drenched wildflower meadow stretching beyond the arch, golden-hour light pouring across the blooms, atmospheric haze in deep distance softening into glow',
      'SUNLIT FOREST CLEARING — sunlit forest clearing visible beyond the arch with vertical sun-shafts through tall trees, ferns and bluebells carpeting the clearing floor, soft warm glow',
      'POND WITH LILY-PADS — small reflective pond with lily-pads visible beyond the arch, water mirroring the canopy above, bloom-edged banks softly visible at the pond rim',
      'DISTANT STONE COTTAGE — distant stone cottage with a smoking chimney visible beyond the arch, glowing windows lit warm, surrounded by garden-mass softly visible',
      'SECRET-GARDEN WITH SUNDIAL — secret-garden interior beyond the arch with a central stone sundial, low boxwood-edged beds of blooms, paths radiating from the center',
      'WALLED-GARDEN COTTAGE INTERIOR — walled-garden interior beyond the arch with old stone walls draped in espaliered fruit trees, perennial beds in full bloom',
      'PARTERRE GARDEN WITH FOUNTAIN — formal parterre garden beyond the arch with low hedges in geometric patterns, central stone fountain bubbling, sunlit and warm',
      'CLIFF OVERLOOK TO DISTANT SEA — cliff overlook beyond the arch revealing a distant sea-and-sky vista, bloom-edge at the cliff brim, warm horizon glow',
      'ANOTHER ARCH IN DEEP DISTANCE — the path continues into another archway visible in the deep distance, another tunnel of blooms beyond, soft-focus and glowing',
      'GLOWING BLOOM-AMPHITHEATRE — natural circular amphitheatre of blooms beyond the arch, light pooling at the center, bloom-walls rising on all sides',
      'STREAM CORRIDOR WITH BLOOM-BANKS — stream corridor beyond the arch with blooms massing on both banks, water visible flowing into deep distance, dappled canopy above',
      'CATHEDRAL OF ANCIENT TREES — grove of ancient trees beyond the arch with blooms at the trunks, vertical sun-shafts piercing the high canopy, cathedral-like and reverent',
      'CIRCULAR LILY-POND — circular lily-pond beyond the arch with concentric ripples, bloom-edged banks, distant trees reflecting on the still water',
      'MEADOW WITH DISTANT DEER — bloom-meadow beyond the arch with a small herd of deer grazing in soft-focus midground, golden light catching the antlers',
      'HEDGEROW MAZE OPENING — hedgerow maze opening beyond the arch with formal yew-hedge corridors visible, statuary at the maze-center, sun-glow above',
      'TIERED COTTAGE GARDEN — tiered cottage garden beyond the arch with stone-terraced beds rising into the deep distance, blooms cascading over every retaining wall',
      'ORCHARD WITH BLOOM-TREES — orchard beyond the arch with blooming fruit-trees in deep rows, fallen petals on the grass, sunlit warm depth',
      'FAIRY-TALE TURRET GLIMPSE — fairy-tale stone turret with conical slate roof visible beyond the arch, ivy-covered base, glowing window high up',
      'POOL WITH SWANS — quiet bloom-edged pool beyond the arch with a pair of swans gliding on the still water, warm golden light',
      'SECRET MEADOW WITH BUTTERFLIES — secret meadow beyond the arch with a cloud of butterflies in soft-focus midground, blooms catching the warm light',
    ],
    instructions: `Each entry is ONE specific DESTINATION GLIMPSE through the arch, 20-40 words. Format: "DESTINATION NAME CAPS — primary destination + warm-glow quality + soft-focus implying continuing world". Vary across the 14 categories. NEVER blank backdrop. NO people. NO duplicate archway. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_garden_walk_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED GARDEN-WALK ATMOSPHERIC PHENOMENA for the BloomBot garden-walk path. Each entry is ONE specific magic-moment element rendered within the archway passage. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the doorway-to-somewhere-magical mood. Render within the foreground bloom-mass, the arch opening, or the destination glow. Always implies LIFE / MAGIC / ATMOSPHERE.

🚫 STRICT BANS:
  • NO humans / figures / hooded silhouettes at the arch
  • NO architectural elements (those are archway territory)
  • NO duplicate destination_glimpse content
  • NO surreal physics
  • NO wide-frame phenomena (rainbows / aurora — those don't fit the portrait framing)

✓ PHENOMENON CATEGORIES:
  A. **LIGHT-SHAFT** — vertical sun-shaft falling through the arch onto the path / volumetric god-ray through the opening
  B. **FALLING PETALS** — petal-fall drifting from the arch / petals mid-air through the opening
  C. **FIREFLY CLOUD** — firefly-cloud at dusk in the archway / glow-cloud of tiny lights
  D. **MIST / VAPOR** — low ground-mist hugging the path / vapor coiling around the arch / pollen-haze in light
  E. **BUTTERFLY CLUSTER** — butterfly cluster in the arch opening / monarch wave passing through
  F. **HUMMINGBIRD** — solitary hummingbird hovering at a bloom on the arch
  G. **BIRD AT ARCH** — songbird perched on the arch top / robin/wren at the bloom-mass
  H. **DEWDROP / PEARLS** — dewdrops on every petal / pearl-beads on a spider-web at the arch
  I. **POLLEN-CLOUD** — golden pollen-dust dispersing in side-light through the arch
  J. **CANDLE-GLOW** — single candle in a niche by the arch / lantern hanging from the arch with soft warm glow
  K. **DOUBLE LIGHT-SHAFTS** — paired sun-shafts through the arch symmetric to the framing
  L. **MAGIC-DUST SPARKLES** — suspended dust-mote sparkles caught in side-light through the arch

Channel: Princess Mononoke kodama-spirits + Studio Ghibli light-shaft moments + Burnett "Secret Garden" robin / magic-bird reveal + Disney Sleeping-Beauty fairy-dust + Tasha Tudor candle-in-cottage warm moments.`,
    touchpoints: [
      'VERTICAL SUN-SHAFT THROUGH ARCH — single vertical sun-shaft falling through the archway opening onto the path stones at the center, vapor and dust-motes suspended in the volumetric beam',
      'FALLING PETALS THROUGH THE ARCH — drifting petal-fall caught mid-air through the archway opening, petals from the climbing-bloom canopy above slowly descending toward the path',
      'FIREFLY CLOUD AT DUSK — soft cloud of fireflies suspended in the archway opening at dusk, hundreds of green-pulse lights stereo-arranged through the depth',
      'LOW GROUND-MIST HUGGING PATH — low ground-mist coiling along the path through the archway, vaporous and luminous in the destination glow, foreground crisp and the mist softening backward',
      'BUTTERFLY CLUSTER IN ARCH — small cluster of butterflies suspended in the archway opening mid-passage, wings catching the back-light through the arch, jewel-iridescent',
      'HUMMINGBIRD AT ARCH BLOOM — solitary jewel-iridescent hummingbird hovering at a bloom on the archway frame, wings a transparent blur, beak just touching the flower',
      'SONGBIRD ON ARCH TOP — solitary songbird (robin / wren / nightingale) perched on the top of the archway, head tilted toward the viewer, the empty path inviting beyond',
      'DEWDROP CASCADE ON ARCHWAY — fine dewdrop beads on every petal of the climbing-bloom mass around the archway, the archway scintillating with reflected light',
      'POLLEN-CLOUD GOLDEN DUST — golden pollen-cloud dispersing in side-light through the archway, the entire passage hazy with suspended dust-motes catching gold',
      'CANDLE LANTERN HANGING AT ARCH — single candle-lit lantern hanging from the top of the archway, soft amber glow pooling on the foreground bloom-mass and the path-stones',
      'PAIRED SUN-SHAFTS THROUGH ARCH — two paired vertical sun-shafts falling symmetrically through the archway opening, creating a halo-of-light at the path-center',
      'DOUBLE-RAINBOW DEW-WEB — perfect spider-web spanning the archway frame, hundreds of dewdrops on the silk catching light like double-beaded pearls',
      'PETAL-SPIRAL MID-AIR — single petal caught mid-air in a slow upward spiral through the archway, frozen in side-light, magic-moment frame',
      'GLOWING POLLEN-MIST — golden pollen-mist suspended in the entire archway passage, dust-motes individually visible in the slanting destination light',
      'WHITE-MOTH MIGRATION — small cluster of white moths passing through the archway opening in soft fluttering motion, individual wings translucent in the back-light',
      'FROST-SHIMMER ON ARCH BLOOMS — early-morning frost shimmer on the climbing-bloom mass around the archway, sun catching individual ice-crystals in pinpoints of light',
      'DRAGONFLY HOVERING — solitary jewel-iridescent dragonfly hovering in the foreground bloom-mass beside the path, body back-lit translucent amber',
      'TWILIGHT GLOW BEYOND — soft twilight glow at the destination end of the passage, the path leading toward warm sunset light, foreground blooms in cool blue-shadow',
      'PINK-MOON RISING BEYOND — full pink-moon rising behind the destination, soft pink-amber halo around the moon-disk visible through the arch opening',
      'GLOW-DUST SPARKLES IN AIR — suspended dust-mote sparkles caught in side-light through the archway, the entire passage shimmering with tiny pinpoints of light',
    ],
    instructions: `Each entry is ONE specific magic-moment phenomenon rendered within the garden-walk passage, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position within the passage + lighting/depth note". Vary across the 12 categories. NO humans, NO duplicates of archway / destination content. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: impossibility_type (the physics break) ───
  bloombot_dreamscape_impossibility_type: {
    format: 'simple',
    theme: `SURREAL FLORAL DREAMSCAPE IMPOSSIBILITIES for the BloomBot dreamscape path. Each entry is ONE specific way that PHYSICS BREAKS in the floral composition — gravity / scale / reflection / containment / direction / continuity. The composition is impossible; the render technique is hyperreal/photoreal painting. Magritte / Dali / Beksinski / Storm Thorgerson lineage. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a COMPOSITIONAL impossibility, not a "weird flower" impossibility. The flowers are REAL earth species. The LAYOUT breaks physics — gravity inversion / scale-shift / spatial recursion / mirror-divergence / floating-mid-air / impossible-container / etc.

🚫 STRICT BANS:
  • NO alien flowers / fictional species / bioluminescent invented blooms
  • NO cartoon / sticker / glitch / Photoshop-glitch visual effects
  • NO humans / faces / figures floating in the scene
  • NO duplicate of world_element content — this is the PHYSICS BREAK, not the object being broken
  • NO surreal that lacks coherent impossibility (random absurdity is not the goal)

✓ IMPOSSIBILITY CATEGORIES — distribute across these:
  A. **GRAVITY-INVERTED** — flowers growing DOWN from the sky / a meadow on the underside of a cloud / rain falling UPWARD as blooms
  B. **FLOATING / SUSPENDED** — bloom-constellation suspended at multiple altitudes / floating sphere of blooms in mid-air / blooms hovering in zero-g
  C. **SCALE-SHIFT** — a single oversized bloom inside which a smaller bloom-world exists / Alice-in-Wonderland blooms ten times normal size / human-scale petals
  D. **MIRROR-DIVERGENCE** — a lake reflecting a different bloom-scene than the one above it / mirror showing a parallel bloom-world / shadow falling at impossible angle showing different blooms
  E. **MAGRITTE-WINDOW** — a Magritte-style window opening in the air onto another bloom-scene / a doorway leading INTO a bloom-storm / a picture-frame containing a real bloom-world
  F. **CONTAINER-WORLD** — a single oversized bloom inside which a smaller bloom-world exists / a bell-jar containing a meadow / a snowglobe of blooms
  G. **DIRECTIONAL-DEFY** — a river flowing UPWARD through the air carrying blooms / petals falling sideways in still air / wind blowing in two directions at once
  H. **HELICAL / SPIRAL** — a spiral helical bloom-staircase ascending into nothing / Penrose stairs of blooms / Möbius strip of cascading flowers
  I. **PORTAL-OPENING** — a hole in a stone wall opening onto a different bloom-meadow / a tunnel through nothing leading to a bloom-grotto / an aperture in the sky
  J. **DUPLICATION / REPETITION** — same bloom-cluster recursively reflected at multiple scales / kaleidoscope of one bloom / a row of identical impossible mirrors
  K. **MATERIAL-INVERSION** — stone that flows like water / clouds that hold blooms like soil / water that hangs in droplet-form / glass that ripples
  L. **TIME-INVERSION** — a bloom in three life-stages simultaneously (bud / open / wilted) on the same stem / dawn and dusk in the same sky

Channel: Magritte "Le Blanc-Seing" / "L\\'Empire des Lumières" + Dali "Persistence of Memory" + Beksinski post-apocalyptic dreamscapes + Storm Thorgerson Pink Floyd album covers + Surrealism + Roger Dean fantasy landscapes.`,
    touchpoints: [
      'GRAVITY-FLIPPED BLOOM-RAIN — flowers growing DOWNWARD from the sky in vertical bloom-cascades, roots gripping cloud-soil overhead, petals falling UPWARD toward the ground in slow-motion gravity-inversion',
      'FLOATING BLOOM-CONSTELLATION — blooms suspended in mid-air at multiple altitudes like a constellation, each bloom turning slowly in space with stems trailing weightlessly, ground far below visible through the gaps',
      'OVERSIZED CONTAINER BLOOM — a single oversized bloom (rose / peony / lotus) at the foreground center, opened to reveal a smaller bloom-world inside its petals — a complete meadow rendered at miniature scale within the cup',
      'MIRROR LAKE DIVERGENCE — a perfectly still lake reflecting a COMPLETELY DIFFERENT bloom-scene than the one above it, the reflection shows a winter-cherry-blossom canopy while the real above is a summer-meadow',
      'MAGRITTE-WINDOW ONTO BLOOM-STORM — a Magritte-style window-frame hovering in mid-air, the window opening onto a different bloom-scene — a swirling bloom-storm visible through the panes',
      'RIVER FLOWING UPWARD — a clear water-river flowing UPWARD through the air, carrying blooms WITH it as it ascends, the stream defying gravity in a continuous arc into the sky',
      'HELICAL BLOOM-STAIRCASE — spiral helical staircase made of stone slabs floating in the void, each step blanketed in flowers, the spiral ascending into nothing at the top',
      'PORTAL THROUGH STONE WALL — circular hole in a weathered stone wall opening onto a completely different bloom-meadow, the portal-edge crisply defined, two worlds visible at once',
      'KALEIDOSCOPE BLOOM-REPETITION — same bloom-cluster recursively reflected at multiple scales radiating outward from a central focal point, kaleidoscope geometry, impossible self-similarity',
      'STONE FLOWING LIKE WATER — a stone arch that flows visibly like water, ripples and droplets falling from its surface, blooms growing from the rippling stone',
      'TIME-INVERSION ON ONE STEM — a single bloom-stem showing three life-stages simultaneously: bud at the bottom, fully-open at the middle, wilted petals falling at the top — time collapsed into one form',
      'PENROSE BLOOM-STAIRS — Penrose-impossible-staircase made of bloom-covered stone, ascending and descending in the same direction simultaneously, optical-illusion geometry',
      'DOORWAY IN THE SKY — a single freestanding doorway hovering at the horizon, blooms cascading from its frame, the door opening onto an upside-down bloom-meadow visible through it',
      'PETALS FALLING SIDEWAYS — petals in mid-air falling SIDEWAYS in still air, defying gravity in a horizontal cascade, no wind visible but the petals moving in coherent direction',
      'BELL-JAR MEADOW — large glass bell-jar in the foreground containing a complete miniature bloom-meadow with its own sky / clouds / atmospheric perspective, real-scale outside the jar',
      'CLOUD MEADOW — a meadow on the UNDERSIDE of a cloud, blooms growing downward from the cloud-soil, viewer looking up at the impossible inverted garden',
      'PARALLEL-MIRROR BLOOM — a hand-mirror in the foreground showing a completely different bloom-world than what is reflected behind, two realities visible in the same frame',
      'SHADOW-AT-IMPOSSIBLE-ANGLE — blooms casting shadows at an impossible angle showing entirely different species in shadow than in solid form, shadow-blooms diverging from real ones',
      'FLOATING ISLAND OF BLOOMS — fragment of meadow-and-stone broken free from the ground floating in mid-air, roots dangling, blooms continuing to grow normally on the floating fragment',
      'PETALS FORMING WORDS — fallen petals on water arranged to spell a word or phrase visible from above, the message itself flower-formed, water-still around them',
    ],
    instructions: `Each entry is ONE specific COMPOSITIONAL IMPOSSIBILITY for a floral dreamscape, 25-50 words. Format: "IMPOSSIBILITY NAME CAPS — primary physics-break + how blooms are arranged in the impossibility + hyperreal-precision quality". Vary across the 12 categories. ALWAYS real earth species in impossible LAYOUT (never alien flowers). NO humans. NO cartoon glitch effects. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: world_element (the physical object the impossibility breaks) ───
  bloombot_dreamscape_world_element: {
    format: 'simple',
    theme: `WORLD ELEMENTS for the BloomBot dreamscape path. Each entry is ONE specific physical object / environment / structure that is rendered with HYPERREAL PRECISION and provides the canvas the impossibility breaks. Each entry 20-40 words.

⚠️ MANDATORY — every world-element is a REAL physical thing rendered with TRUE materials and textures. It will be subjected to the impossibility (gravity-flipped / scale-shifted / mirrored / etc.) but the element ITSELF is real.

🚫 STRICT BANS:
  • NO architectural elements that ARE the impossibility (those are impossibility_type territory)
  • NO humans / figures / hands
  • NO duplicate of impossibility content
  • NO surreal materials (no glowing-fictional / alien-material) — the impossibility is in the BEHAVIOR not the substance

✓ WORLD-ELEMENT CATEGORIES:
  A. **NATURAL LANDFORM** — a single mountain peak / cliff / valley / cave entrance / waterfall / standing stone / boulder
  B. **WATER FEATURE** — a still pond / a meandering stream / an ocean horizon / a lake / a fountain
  C. **ARCHITECTURAL FRAGMENT** — a single doorway / archway / staircase / window / pillar / wall section / bridge — usually IN ISOLATION
  D. **SKY / CLOUD** — a single cloud / a clear sky / a stormy sky-shoulder / a horizon-line / a moon / a sun-disk
  E. **OBJECT** — a single picture-frame / mirror / bell-jar / snowglobe / floating sphere / hovering book / suspended chair
  F. **ROOM FRAGMENT** — an empty room interior / a tilted floor / a corridor / a window-seat / a fireplace alcove
  G. **GROUND FRAGMENT** — a single piece of meadow / a fragment of beach / a stretch of sidewalk / a section of garden-bed
  H. **GEOMETRIC FORM** — a perfect cube / sphere / spiral staircase / impossible cube / Möbius strip
  I. **HORIZON-LINE** — distant mountain horizon / distant sea horizon / distant city silhouette / vanishing-point road

Channel: Magritte "L\\'Empire des Lumières" / "Le Château des Pyrénées" + Dali landscape backgrounds + Storm Thorgerson album-cover landscapes + Beksinski stone formations + Penrose impossible-geometry diagrams.`,
    touchpoints: [
      'MAGRITTE FLOATING STONE-BOULDER — a single massive stone boulder hovering in mid-air at midground, surface rendered with hyperreal texture — moss, lichen, weather-stains — defying gravity in clear sky',
      'STILL POND MIRROR-PERFECT — a perfectly still pond at the foreground, water surface like dark glass with mirror-perfect reflection, every ripple absent, edge clearly defined',
      'WEATHERED STONE ARCHWAY ISOLATED — a freestanding weathered stone archway in midground, no walls attached, the arch alone in an open space, hyperreal stone texture',
      'SINGLE CLOUD IN CLEAR SKY — a single perfectly-rendered cumulus cloud in an otherwise empty clear sky, cloud-form crisp, every shadow-and-highlight detailed',
      'PICTURE-FRAME HOVERING — a single ornate picture-frame hovering in mid-air at viewer level, no canvas inside, the frame edges crisp against the dreamscape',
      'BELL-JAR ON A TABLE — a large glass bell-jar on a stone table, perfectly clear glass with the maker-marks visible, table rendered with weathered-wood texture',
      'WEATHERED SPIRAL STAIRCASE — a freestanding weathered stone spiral staircase ascending into open air, each step rendered with crisp moss-and-stone detail, no walls or framework',
      'FLOATING DOORWAY FRAME — a single freestanding doorway-frame in mid-air, the door slightly ajar, no walls, the frame crisp and weathered',
      'CLIFF EDGE WITH HORIZON — a single cliff-edge at the foreground bottom, distant horizon visible far below, sky vast above, cliff-surface hyperreal-textured',
      'OPEN BOOK ON A PEDESTAL — a single open book floating in mid-air on an invisible pedestal, pages crisp and hyperreal, text visible',
      'STONE WELL WITH WATER — a freestanding stone well rim with dark water visible inside, no surrounding ground, well-wall hyperreal-textured stone',
      'SINGLE TREE IN AN EMPTY PLAIN — a single ancient tree standing alone in an empty plain, tree rendered with hyperreal bark-and-leaf detail, no other vegetation',
      'IRON BIRDCAGE HANGING — a single ornate iron birdcage hanging in mid-air with no chain visible, cage-bars hyperreal-detailed, no bird inside',
      'CHESS-BOARD ON A TABLE — a single chess-board with pieces mid-game on a stone table, board hyperreal-detailed, table weathered',
      'MOON OVER A HORIZON — a single full moon hovering above a distant flat horizon, moon crisp and detailed, sky-gradient hyperreal',
      'A SINGLE STONE STEP — a single stone step floating in mid-air, no surrounding stairs, the step hyperreal-textured with moss-and-lichen',
      'CARRIAGE WHEEL LEANING — a single weathered wooden carriage-wheel leaning against nothing in mid-air, individual spokes and iron-rim crisp',
      'STREAM IN MID-AIR — a section of clear running water flowing through mid-air with no banks, the water-form held together by impossible cohesion',
      'CATHEDRAL WINDOW HOVERING — a single stained-glass cathedral-window-frame hovering in mid-air, the glass impossibly intact, no walls',
      'WROUGHT-IRON GATE FLOATING — a single ornate wrought-iron gate hanging open in mid-air with no fence attached, gate rendered with rust-patina hyperreal detail',
    ],
    instructions: `Each entry is ONE specific PHYSICAL WORLD ELEMENT rendered with HYPERREAL PRECISION, 20-40 words. Format: "ELEMENT NAME CAPS — primary object + material/texture detail + hovering / freestanding / isolated quality". Vary across the 9 categories. ALWAYS real / physical / hyperreal-textured. NO humans. NO duplicate of impossibility. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: atmospheric_halo (60%-gated surreal lighting) ───
  bloombot_dreamscape_atmospheric_halo: {
    format: 'simple',
    theme: `60%-GATED ATMOSPHERIC HALOS for the BloomBot dreamscape path. Each entry is ONE specific surreal-lighting / atmospheric phenomenon that amplifies the dreamscape's impossibility. Each entry 20-40 words.

⚠️ MANDATORY — every halo is a SURREAL LIGHTING / ATMOSPHERIC element that fits the Magritte/Dali/Beksinski/Thorgerson register. NEVER realistic-weather (those belong in landscape). The halo IS the impossibility's atmospheric expression.

🚫 STRICT BANS:
  • NO realistic weather (rain / snow / wind / storm — too earthly)
  • NO humans / figures
  • NO duplicate of impossibility / world_element content
  • NO cartoon / glitch / sticker effects
  • NO architectural elements

✓ HALO CATEGORIES:
  A. **MAGRITTE-EVENING-SUN** — a single warm sun-disk in an otherwise empty sky / sun lighting the dreamscape in unreal gold / Magritte-style impossible-evening light
  B. **DUAL LIGHT-SOURCE** — two suns at impossible angles / two moons / sun and moon simultaneously / dawn and dusk in the same sky
  C. **HORIZONTAL LIGHT-FLOW** — light flowing horizontally instead of from above / sideways sunbeam / lateral god-rays
  D. **APERTURE IN THE AIR** — a glowing aperture / portal of light in mid-air with no source / a hole in the sky pouring warm light through
  E. **PETAL-STORM** — petals raining through the air in surreal density / blizzard of petals with no flowers visible / petal-cloud hovering still
  F. **BLOOM-CONSTELLATION** — blooms suspended like stars at night-sky scale / a constellation made of blooms / bloom-galaxy in deep space
  G. **DUST / POLLEN-CLOUD** — golden pollen-cloud suspended in surreal stillness / dust-motes frozen in mid-fall / pollen-galaxy in space
  H. **REFLECTION-RIPPLES** — water-ripples in mid-air with no water / reflective surface that ripples without disturbance / mirage of bloom-ripples
  I. **SHADOW-PARADOX** — shadows falling in impossible directions / multiple shadows from one object / shadow that grows blooms
  J. **AURORA-DREAMSCAPE** — aurora-like color-band drifting across the surreal sky / impossible color-curtain / fractal-aurora

Channel: Magritte sky-and-cloud paintings + Dali "Sleep" desaturated dreamscapes + Beksinski post-apocalyptic atmospheres + Storm Thorgerson "Wish You Were Here" surreal-light + Roger Dean Yes-album-cover atmospheres.`,
    touchpoints: [
      'MAGRITTE EVENING-SUN — a single warm Magritte-style evening-sun hovering low in an otherwise empty sky, lighting the entire dreamscape in unreal gold, no clouds, perfect rendering',
      'TWO SUNS AT IMPOSSIBLE ANGLES — two warm suns at opposite quadrants of the sky lighting the dreamscape from contradictory directions, double-shadow on every surface',
      'HORIZONTAL LIGHT-FLOW — golden light flowing horizontally across the dreamscape from one side, casting upward shadows that point at the sky, gravity-defying illumination',
      'APERTURE-IN-AIR LIGHT-POUR — a glowing hexagonal aperture in mid-air with no apparent source, warm light pouring through it onto the dreamscape, the rest of the sky in cool blue',
      'PETAL-STORM SUSPENDED — a blizzard of petals suspended in mid-air motionless, hundreds of petals frozen at every depth, no flowers visible to have shed them',
      'BLOOM-CONSTELLATION NIGHT-SKY — blooms suspended like stars at night-sky scale across a deep-violet sky, each bloom small but distinct, distance-perspective making them constellation-like',
      'POLLEN-CLOUD SUSPENDED STILL — vast cloud of golden pollen-motes suspended in surreal stillness across the dreamscape, each mote individually visible in deep light',
      'WATER-RIPPLES IN MID-AIR — concentric water-ripples expanding in mid-air with no water visible, the ripples perfect circles propagating through empty space',
      'IMPOSSIBLE DOUBLE-SHADOW — every element casting two shadows in opposite directions, one warm-amber-edged and one cool-blue-edged, both clearly defined',
      'AURORA COLOR-CURTAIN — aurora-like color-band drifting diagonally across the surreal sky in green and violet, impossible at this latitude, the dreamscape painted in the colored light',
      'BLOOM-GALAXY IN DEEP SPACE — bloom-petals arranged in a galactic-spiral pattern across the sky, individual blooms forming the spiral arms, vast cosmic scale',
      'PETALS RISING FROM EARTH — petals rising upward from the ground in slow-motion against gravity, hundreds visible at every depth, no source visible',
      'WARM-LIGHT WITHIN A SHADOW — a shadow zone that contains its OWN sun-glow, the shadow-area paradoxically lit warmer than the sun-area outside it',
      'SOFT MIST WITH NO SOURCE — soft pearl-mist hovering in still air with no source visible, the mist softening the impossibility into dream-haze',
      'TEMPORAL DOUBLE-EXPOSURE — the entire dreamscape rendered as if two moments are visible simultaneously, ghost-edge on every element, doubled position by slight shift',
      'MAGRITTE-CLOUD WITH HOLE — a Magritte-style cloud with a perfectly circular hole cut through it, the sky beyond visible through the cloud-hole, surreal architectural quality',
      'REFLECTION-WITHOUT-WATER — a perfect reflection of the upper dreamscape on a non-existent surface at the foreground bottom, no water actually visible',
      'IMPOSSIBLE COLOR-GRADIENT SKY — the sky shifts through impossible colors (turquoise to mauve to amber to rose) in a continuous gradient, dreamlike palette',
      'STILL-LIFE LIT FROM WITHIN — every bloom in the dreamscape glowing softly from within with internal light, soft halo around each, no external light source',
      'FRACTAL-AURORA — aurora-like color-curtain folding fractally into itself across the sky, impossible mathematical pattern, surreal beauty',
    ],
    instructions: `Each entry is ONE specific SURREAL ATMOSPHERIC HALO, 20-40 words. Format: "HALO NAME CAPS — primary surreal-lighting element + how it amplifies the impossibility + rendering detail". Vary across the 10 categories. ALWAYS surreal / dream / Magritte register. NEVER realistic weather. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: conservatory_type (the architectural shell) ───
  bloombot_conservatory_conservatory_type: {
    format: 'simple',
    theme: `VICTORIAN CONSERVATORY TYPES for the BloomBot conservatory path. Each entry is ONE specific Victorian / Edwardian glass-and-iron conservatory interior — overgrown by climbing blooms and cascading vines. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a Victorian / Edwardian glass-and-iron architecture (Kew Gardens / Royal Greenhouse of Laeken / Crystal Palace / Crystal Court / 19th-century botanical garden) lineage. NEVER modern glass building, NEVER plastic greenhouse, NEVER wood-and-glass garden room.

🚫 STRICT BANS:
  • NO modern / contemporary / sleek glass architecture
  • NO plastic / vinyl / commercial greenhouse
  • NO wood-and-glass garden room (cozy)
  • NO outdoor scene (this is INTERIOR)
  • NO archways/passages (garden-walk territory)
  • NO ruins (reclaim territory)
  • NO humans / figures

✓ CONSERVATORY TYPE CATEGORIES:
  A. **SMALL PRIVATE GREENHOUSE** — small estate-house Victorian conservatory attached to a country house, single-room with curved glass roof
  B. **PALM-HOUSE / KEW-SCALE** — large palm-house with multi-tier glass dome, soaring iron columns, central avenue, towering vegetation
  C. **VICTORIAN ORANGERY** — orangery-style structure with tall arched windows / iron-and-glass ceiling, slate-tile floor, formal arrangement
  D. **OCTAGONAL CONSERVATORY** — octagonal Victorian conservatory with eight-sided glass dome converging at peak, leaded-glass panels, central focal point
  E. **VICTORIAN BOTANIC HOTHOUSE** — botanical-garden hothouse with rising-glass roof, multiple-aisle nave structure, walkways between bloom-beds
  F. **CRYSTAL-PALACE-SCALE** — vast Crystal-Palace-scale conservatory with cathedral-volume interior, soaring iron framework, multiple floors of vegetation
  G. **CONSERVATORY ANNEX** — small annex-conservatory attached to a brick mansion, asymmetric shape, single tall window-wall of glass
  H. **TOWER GLASS-DOME** — tower-shaped glass-dome conservatory with circular base and conical peak, spiral iron-staircase, single central space
  I. **HALF-DOME WALL** — half-dome glass-and-iron wall against a brick or stone wall, like an attached observatory, curved glass dominating
  J. **TROPICAL PAVILION** — Victorian tropical-pavilion with humidity-misting / fountain-and-pool / palm-and-fern jungle below glass dome
  K. **ROUND ROTUNDA GLASS-HOUSE** — circular rotunda glass-house with central pool / sundial / statue, glass-dome above, peripheral iron walkway
  L. **BARRED-PROMENADE GLASS-CORRIDOR** — long Victorian glass-corridor connecting two buildings, iron-arched ceiling, full of cascading climbers

Lineage to channel: Kew Gardens Palm House + Royal Greenhouse of Laeken + Crystal Palace + Edwardian glasshouses + Victorian botanical pavilions + Schönbrunn Palm House.`,
    touchpoints: [
      'KEW-SCALE PALM HOUSE — vast palm-house with multi-tier glass dome rising overhead, soaring rust-patina iron columns, central avenue between bloom-beds, towering palm-trees and tree-ferns reaching toward the dome',
      'VICTORIAN ORANGERY — orangery with tall arched windows along one wall, iron-and-glass ceiling overhead, slate-tile floor in geometric pattern, formal arrangement with citrus-trees and bloom-beds',
      'OCTAGONAL GAZEBO CONSERVATORY — octagonal Victorian gazebo conservatory with eight-sided glass dome converging at a finial peak, leaded-glass panels framing the panes, central reflecting pool',
      'BOTANIC GARDEN HOTHOUSE — botanical-garden hothouse with steeply-rising glass roof, multi-aisle nave structure, wrought-iron walkways between bloom-beds, central avenue receding into deep distance',
      'CRYSTAL-PALACE-SCALE PAVILION — vast Crystal-Palace-scale conservatory with cathedral-volume interior, soaring rust-patina iron framework, multiple floors of vegetation visible through the glass walls',
      'COUNTRY-HOUSE ANNEX CONSERVATORY — small annex-conservatory attached to a brick country-house mansion, asymmetric shape with curved glass roof on one side, single-pane Victorian glazing',
      'GLASS-DOME TOWER — tower-shaped glass-dome conservatory with circular base, conical peak overhead, spiral wrought-iron staircase ascending to a mezzanine walkway',
      'HALF-DOME LEAN-TO — half-dome glass-and-iron wall attached to a brick country-mansion wall, like an attached observatory, curved glass dominating the upper register',
      'TROPICAL HUMID PAVILION — Victorian tropical-pavilion with visible humidity-haze, central fountain spraying mist, palm-and-fern jungle below the soaring glass dome, banana-leaves arching overhead',
      'ROTUNDA GLASS-HOUSE — circular rotunda glass-house with central reflecting pool, sundial statue, glass-dome above, peripheral wrought-iron walkway encircling the central space',
      'PROMENADE GLASS-CORRIDOR — long Victorian glass-corridor with iron-arched ceiling, climbing-bloom cascades from every iron-rib, depth receding into deep humid glow at the far end',
      'GLASS PEACH-HOUSE — Victorian wall-attached peach-house with sloped glass roof, espaliered fruit-trees on the back wall, central bloom-bed beneath, sun-warmed atmosphere',
      'LEAN-TO ESTATE CONSERVATORY — lean-to estate conservatory built against a south-facing brick wall, sloped glass roof, single-room with central potting-bench and bloom-cascades',
      'TWO-STORY VICTORIAN CONSERVATORY — two-story Victorian conservatory with iron mezzanine walkway encircling the second floor, glass dome above, central column rising through both floors',
      'BUTTERFLY HOUSE — Victorian butterfly-house with low glass-dome and tropical-humidity, cascading climbing-bloom mass, small central pool, butterflies suggested in the warm humid air',
      'CHAPEL-NAVE CONSERVATORY — chapel-nave-shape conservatory with high nave of glass-and-iron, side-aisle bloom-beds, central altar-like fountain at the apse end',
      'AMPHITHEATRE GLASS-HOUSE — Victorian amphitheatre glass-house with tiered bloom-beds radiating from a central pool, glass-dome converging overhead, iron walkways at each tier',
      'RUSTED-PATINA OLD GREENHOUSE — old long-neglected Victorian greenhouse with rust-patinaed iron framework, some glass panes cracked, bloom-mass having consumed most of the architecture, slightly wild atmosphere',
      'CHATEAU GLASS-WING — French-chateau-style glass-wing with elaborate wrought-iron scrollwork in the framework, opera-house-curved ceiling, formal central walkway',
      'GLASS DOME CATHEDRAL — cathedral-scale glass-dome single-room conservatory with iron ribs radiating from a central oculus, leaded-glass panels in geometric mandala pattern overhead',
    ],
    instructions: `Each entry is ONE specific VICTORIAN GLASS-AND-IRON CONSERVATORY INTERIOR, 25-50 words. Format: "CONSERVATORY NAME CAPS — primary architecture type + glass-and-iron detail + overgrown-vegetation note". Vary across the 12 categories. ALWAYS Victorian / Edwardian glass-and-iron. NEVER modern / plastic / wood-frame. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: structural_anchor (the central focal piece) ───
  bloombot_conservatory_structural_anchor: {
    format: 'simple',
    theme: `CONSERVATORY STRUCTURAL ANCHORS for the BloomBot conservatory path. Each entry is ONE specific central focal-piece element around which the bloom-mass arranges itself. Each entry 20-40 words.

⚠️ MANDATORY — every anchor is a TACTILE structural piece typical of Victorian conservatory interiors. The anchor reads as the heart of the conservatory.

🚫 STRICT BANS:
  • NO modern / contemporary furniture
  • NO architectural elements that ARE the conservatory shell (those are conservatory_type)
  • NO humans / figures
  • NO duplicate of conservatory_type content

✓ STRUCTURAL ANCHOR CATEGORIES:
  A. **WATER FEATURE** — circular reflecting pool with lily-pads / Victorian fountain with marble basin / wrought-iron-edged pond / central marble lily-pool
  B. **STAIRCASE / WALKWAY** — curving wrought-iron staircase to a mezzanine / spiral iron staircase / iron-railed mezzanine walkway
  C. **STONE BENCH / SEATING** — stone bench under the dome / wrought-iron Victorian garden-bench / marble loveseat / curved-stone seat at the pool edge
  D. **SUNDIAL / STATUE** — tall sundial in the center / weathered marble statue / botanical sculpture / armillary sphere
  E. **BIRD CAGE / VOLIERE** — ornate Victorian birdcage suspended from rafters / large wrought-iron voliere / golden birdcage hanging
  F. **PLANTER / URN** — colossal Victorian terracotta urn at the center / ornate planter with cascading bloom / stone-carved urn with overflow
  G. **CENTRAL TREE** — a single ancient palm / tree-fern / banana-tree as the central anchor, towering toward the dome
  H. **POTTING BENCH** — long wrought-iron potting-bench with terracotta pots / Victorian gardeners table with copper watering-cans
  I. **CHANDELIER / LANTERN** — Victorian crystal chandelier hanging from the dome / cast-iron lantern hanging at center / brass-and-glass pendant
  J. **WROUGHT-IRON ARCH** — central wrought-iron archway draped in climbing-bloom inside the conservatory, smaller-arch-within-the-larger-dome
  K. **TIERED FOUNTAIN** — Victorian tiered fountain with multiple basins, water cascading down through bloom-edged tiers
  L. **MARBLE COLUMN / OBELISK** — central marble column with Corinthian capital / ornate stone obelisk / sculpted column-and-vase

Channel: Kew Gardens interior props + Royal Greenhouse central fountains + Victorian botanical-garden ornament + estate-house conservatory interiors + Crystal-Palace centerpieces.`,
    touchpoints: [
      'CIRCULAR REFLECTING POOL WITH LILY-PADS — large circular reflecting pool at the conservatory center with white-and-pink water-lilies covering the surface, low stone rim, bloom-mass cascading from above into the still water',
      'CURVING WROUGHT-IRON STAIRCASE — elegant curving wrought-iron staircase with floral scrollwork railings spiraling up to a mezzanine walkway, climbing-bloom mass spiraling up along with the steps',
      'VICTORIAN FOUNTAIN WITH MARBLE BASIN — Victorian three-tier fountain at the center with marble basin and water cascading down through smaller-and-smaller upper bowls, bloom-edge around the basin',
      'STONE BENCH UNDER THE DOME — single weathered stone bench centered under the glass dome, climbing-rose vines curving over and around it, light-shaft pouring down onto the bench at golden-hour',
      'TALL BRASS SUNDIAL — tall brass-and-stone sundial in the center of the conservatory, gnomon casting precise shadow, bloom-mass surrounding the base in a perfect circle',
      'ORNATE VICTORIAN BIRDCAGE — ornate Victorian wrought-iron birdcage suspended from the dome rafters, cage-bars wrapped in climbing-bloom vines, empty or with a single bird-form glimpsed',
      'COLOSSAL TERRACOTTA URN — colossal weathered Victorian terracotta urn at center on a stone pedestal, bloom-mass overflowing the rim and cascading down the sides, urn-rim moss-and-lichen-patinated',
      'ANCIENT PALM AS CENTRAL TREE — single ancient palm-tree at the conservatory center, fronds reaching toward the glass dome, climbing-bloom vines twined up the trunk',
      'POTTING-BENCH WITH COPPER PANS — long wrought-iron potting-bench against one wall with copper watering-cans and weathered terracotta pots, gardening tools hung on the wall, bloom-mass spilling from the pots',
      'CRYSTAL CHANDELIER HANGING — Victorian crystal chandelier hanging from the glass dome center on a long chain, bloom-mass surrounding the chandelier in mid-air, sunlight scattering through the crystals',
      'WROUGHT-IRON ARCHWAY INSIDE — central wrought-iron archway draped in climbing-rose vines inside the conservatory, framing a path through the bloom-mass, smaller arch nested within the dome',
      'TIERED MARBLE FOUNTAIN — Victorian tiered marble fountain at the center with three graduated basins, water cascading musically, bloom-edged each tier',
      'CORINTHIAN MARBLE COLUMN — single Corinthian marble column at the conservatory center bearing a vase or stone fruit-basket, climbing-bloom vines spiraling up the column',
      'WROUGHT-IRON CONSERVATORY TABLE — round wrought-iron table at the center with three chairs around it, bloom-mass cascading from a central planter, set for a forgotten tea',
      'WEATHERED MARBLE STATUE — single weathered marble statue (classical female / cherub / muse) at the conservatory center on a stone pedestal, climbing-bloom vines partially obscuring the figure',
      'ARMILLARY SPHERE — large brass armillary sphere on a stone pedestal at the conservatory center, brass-rings catching the light, bloom-mass surrounding the base',
      'IRON-RAILED MEZZANINE WALKWAY — wrought-iron mezzanine walkway encircling the conservatory at second-floor height, railings draped in climbing-bloom cascades, lower floor visible below',
      'STONE WELL-EDGE PLANTER — central stone well-edge planter (oversized circular stone planter) overflowing with bloom-mass, cascading vines spilling onto the flagstone floor',
      'BRASS PEDESTAL VOLIERE — large brass voliere (decorative cage) on a stone pedestal at the conservatory center, bloom-vines threaded through the bars, occupied by suggestion only',
      'STONE OBELISK ENCLOSURE — central stone obelisk rising from a circular bloom-bed, weathered carvings on the obelisk face, climbing-vines spiraling up to a height the dome',
    ],
    instructions: `Each entry is ONE specific CENTRAL FOCAL-PIECE structural anchor inside a Victorian conservatory, 20-40 words. Format: "ANCHOR NAME CAPS — primary structure + material + bloom-interaction note". Vary across the 12 categories. NEVER modern / contemporary furniture. NO duplicate of conservatory shell. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_conservatory_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED CONSERVATORY ATMOSPHERIC PHENOMENA for the BloomBot conservatory path. Each entry is ONE specific magic-moment element rendered within the glass-and-iron conservatory interior. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the conservatory atmosphere (humid / glass-filtered light / Victorian botanical mood). Renders as a visible element within the space.

🚫 STRICT BANS:
  • NO humans / figures
  • NO architectural elements (those are conservatory_type / structural_anchor)
  • NO outdoor weather (this is interior)
  • NO duplicate of conservatory shell content

✓ PHENOMENON CATEGORIES:
  A. **GOD-RAY DRAMA** — volumetric god-rays through the glass dome at dramatic angle / multiple sun-shafts piercing the bloom-mass / single column of light onto the anchor
  B. **HUMIDITY-MIST** — visible humidity-mist coiling near the dome / fine vapor rising from the fountain / steam from a heating-pipe / condensation droplets on the glass
  C. **HUMMINGBIRD / POLLINATOR** — solitary hummingbird hovering at a bloom-cluster / butterfly cloud above the central fountain / bee-cluster at a flowering vine
  D. **EXOTIC BIRD** — peacock standing on the flagstone / single tropical bird (parrot / toucan) perched on the iron framework / songbird at the dome
  E. **POLLEN-CLOUD** — golden pollen-cloud dispersing in side-light through the glass / pollen-dust visible in the god-rays
  F. **PETAL-FALL** — petal-fall drifting from the upper bloom-cascades to the flagstone floor / petal-mass on the floor
  G. **WATER-RIPPLES** — concentric ripples expanding in the central pool / water-drop falling into the fountain / lily-pad-edge ripples
  H. **CRYSTAL-LIGHT SCATTER** — leaded-glass panes scattering sun in geometric patterns onto the flagstones / kaleidoscope-light on the walls / chandelier-prism rainbows
  I. **DAPPLED CANOPY LIGHT** — broken light through the leaf-canopy of climbing vines, dappled patterns on the flagstones below
  J. **OCULUS LIGHT-CIRCLE** — circle of light from the central glass-dome oculus pooled on the flagstone floor at the conservatory center
  K. **CONDENSATION RUN** — beads of condensation on the glass panes catching light / water-droplets running down the glass-and-iron joints
  L. **EVENING TWILIGHT GLASS-GLOW** — late-afternoon honey-amber light bathing the entire conservatory through the west-facing glass

Channel: Kew Gardens interior atmospheric moments + estate-conservatory golden-hour scenes + Vermeer-light-through-leaded-glass + Singer Sargent botanical-greenhouse paintings.`,
    touchpoints: [
      'VOLUMETRIC GOD-RAYS THROUGH DOME — multiple volumetric god-ray sun-shafts diagonally piercing the glass dome at dramatic angles, vapor-laden beams visible in the humid air, pooling onto specific bloom-patches below',
      'HUMIDITY-MIST NEAR THE DOME — visible humidity-mist coiling near the upper rafters of the glass dome, soft vapor obscuring the iron-framework slightly, creating atmospheric depth',
      'HUMMINGBIRD AT A BLOOM — solitary jewel-iridescent hummingbird hovering at a specific bloom-cluster in the conservatory, wings a transparent blur, beak just grazing the bloom',
      'PEACOCK ON THE FLAGSTONE — solitary peacock standing on the flagstone floor near the central fountain, tail-feathers spread in display, iridescent blue-and-green catching the glass-filtered light',
      'POLLEN-CLOUD IN GOD-RAYS — golden pollen-cloud dispersing in the god-ray sun-shafts, individual pollen-motes visible in the volumetric beams, the dust catching the warm light',
      'PETAL-FALL FROM UPPER CASCADES — drifting petal-fall from the upper climbing-bloom cascades toward the flagstone floor, petals suspended at every depth, falling in slow-motion through the still air',
      'WATER-DROP RIPPLES IN POOL — concentric ripples expanding from a single water-drop in the central reflecting pool, lily-pad edges briefly disturbed, the rest of the surface mirror-still',
      'LEADED-GLASS LIGHT-PATTERN — leaded-glass panes scattering sun in geometric stained-glass pattern onto the flagstones, the iron grid casting precise shadow-lines on the floor',
      'DAPPLED CANOPY-LIGHT PATTERN — broken sunlight through the climbing-vine leaf-canopy, dappled patterns of light-and-shadow on the flagstones below, painterly effect',
      'OCULUS LIGHT-CIRCLE — perfect circle of light from a central glass-dome oculus pooled directly on the flagstone floor at the conservatory center, the rest of the floor in cooler shadow',
      'CONDENSATION ON THE GLASS — beads of condensation on the glass panes catching the light, water-droplets running slowly down the glass-and-iron joints, humid atmosphere visible',
      'EVENING GLASS-GLOW HONEY — late-afternoon honey-amber light bathing the entire conservatory through west-facing glass panes, every surface catching warm gold, deep shadows in opposite corners',
      'BUTTERFLY CLOUD AT FOUNTAIN — small cluster of butterflies above the central fountain, wings catching the glass-filtered light, sipping at the water-edge',
      'CHANDELIER PRISM-RAINBOWS — Victorian crystal chandelier suspended from the dome scattering prism-rainbows across the bloom-mass below, multiple small rainbow-patches on the walls',
      'PARROT ON IRON ARCH — solitary tropical parrot perched on a wrought-iron arch overhead, bright color-pop against the green-and-iron mass, head tilted toward the viewer',
      'FOUNTAIN STEAM IN COLD MORNING — visible steam rising from the central fountain in early morning when the air outside the glass is cold, vapor caught in cross-light from the dome',
      'SWALLOW DARTING THROUGH SPACE — solitary swallow caught mid-flight across the conservatory interior, wings spread in motion, depth-of-field blurring the bloom-mass behind it',
      'POLLINATOR-BEE AT A SUNLIT BLOOM — solitary fuzzy bumblebee on a sunlit foreground bloom, pollen-dust on its back, sun-shaft catching the bee in golden light',
      'TWILIGHT MOON THROUGH GLASS — early-evening moon visible through the glass-dome panes, soft blue light entering from above, the conservatory mostly in golden lamp-glow',
      'LANTERN-GLOW WARM POOL — single Victorian lantern hanging from a wrought-iron hook glowing soft amber, pooling warm light on a bloom-cluster nearby, the rest of the conservatory in cool blue shadow',
    ],
    instructions: `Each entry is ONE specific CONSERVATORY ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in conservatory + light/depth note". Vary across the 12 categories. NO humans. NO architectural duplicates. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: city_setting (the urban canvas) ───
  bloombot_city_flowers_city_setting: {
    format: 'simple',
    theme: `FANTASY BLOOM-CITY SETTINGS for the BloomBot city-flowers path. Each entry is ONE specific IMPOSSIBLE FANTASY BLOOM-CITY — floating bloom-islands, kilometer-high flower-cathedrals, elven bloom-citadels, coral-bloom underwater-cities, mushroom-megacities, sky-temples-of-blossoms, faerie-realm flower-spires. Each entry 30-55 words.

⚠️ THE BAR: every entry is JAW-DROPPING + IMPOSSIBLE + MAGICAL. Studio-Ghibli-Castle-in-the-Sky / Lothlorien / Avatar-Pandora / Mononoke-Forest-Spirit-realm / Magic-the-Gathering-Bant-Selesnya / Brian-Froud-faerie-realm lineage. BLOOMS are the overwhelming hero (60-70% of frame), fantasy-architecture is the SCAFFOLD that flowers grow from / hang on / drape.

🚫 ABSOLUTELY BANNED — real-world tourist cities that violate BloomBot DNA:
  • NO Mediterranean / Italian / Cinque Terre / Amalfi / Tuscan / Greek-island settings
  • NO Parisian / Haussmann / Montmartre settings
  • NO Lisbon / Portuguese / Alfama settings
  • NO Marrakech / Moroccan / Andalusian / Chefchaouen settings
  • NO Venetian / Bruges / Amsterdam canal settings
  • NO Cuban / Havana / colonial settings
  • NO Tokyo / Kyoto / Japanese back-street settings
  • NO Cotswolds / British / Cornish settings
  • NO Scandinavian / Stockholm settings
  • NO Pueblo / Santa Fe / Southwest settings
  • NO North African / Fez / Tunis settings
  • NO Indian / Jaipur / Udaipur settings
  • NO Vietnamese / Hoi An settings
  • NO German / Czech / medieval European real-town settings
  • NO real-world architectural styles (Haussmann / azulejo / adobe / colonial / half-timber)
  • NO cobblestones / weathered plaster / sun-bleached stucco / postcard textures
  • NO modern / contemporary / corporate architecture
  • NO American urban
  • NO interiors / rooms (cozy)
  • NO landscapes / vistas / open countryside (landscape / tropical)
  • NO conservatory / glass-and-iron greenhouse (conservatory)
  • NO ruins / abandoned (reclaim)
  • NO humans / pedestrians / figures in the scene

✓ FLOWER-DOMINATED FANTASY CATEGORIES (the FLOWERS are the scene, architecture barely visible):
  A. **FLOWER-CANYON DEPTH** — narrow canyon-path winding through hundred-meter walls of cascading rose / wisteria / peony, fantasy spire-tips emerge faintly at the canyon-end
  B. **KILOMETER FLOWER-CASCADE CLIFF** — sheer cliff dominated by overlapping flower-cascades pouring hundreds of meters from above, hint of fantasy citadel half-buried at the top
  C. **BLOOM-MOUNTAIN VISTA** — mountain made entirely of flowers (mound of layered cherry / magnolia / peony / lilac), fantasy spires barely emerge from the bloom-mass
  D. **ENDLESS FLOWER-MEADOW** — vast painted meadow of waist-high wildflowers stretching to fantasy spires on the distant horizon, foreground packed with bloom-detail
  E. **CHERRY-BLOSSOM CANOPY OVERWHELM** — looking up at endless cherry-blossom canopy filling 85% of frame, fantasy spire-tips poking through at the top, soft daylight
  F. **VINE-CATHEDRAL CASCADE** — overlapping wisteria / laburnum cascades draping hundreds of meters from invisible fantasy structures above, viewer beneath the cascade-fall
  G. **FLOWER-FLOODED VALLEY** — valley flooded waist-deep in floating blossoms, fantasy spires barely emerging from the bloom-flood, painted-gold natural light
  H. **BLOSSOM-DROWNED FANTASY RUIN** — fantasy ruins SO claimed by flowers they read as flower-mountains, only a spire-tip or arch fragment visible through the bloom
  I. **PETAL-SNOW DEPTH** — fantasy spires barely visible through dense falling petal-snow filling the frame, no magic lights — just the petals doing the work
  J. **BLOOM-AVENUE TUNNEL** — viewer inside a tunnel of overlapping flowering-vines (wisteria / rose / honeysuckle), fantasy spire-tips visible at the far end
  K. **FLOWER-CLIFF HORIZON** — sheer flower-cliff dominates the frame, hint of fantasy architecture half-buried at the top, soft natural light
  L. **MALLORN-CANOPY OVERWHELM** — golden-mallorn fantasy citadel SO blanketed in flowers the trees are barely visible, dawn/dusk light
  M. **HANGING-GARDEN MEGACITY** — fantasy hanging-garden city where every tier is overgrown in bloom-cascades so dense the architecture is glimpsed only at edges
  N. **POPPY-FIELD VISTA** — endless rolling field of poppies / wildflowers in painterly equal-weight density, fantasy citadel silhouette on distant horizon
  O. **OVERGROWN FLOWER-COURTYARD** — fantasy courtyard SO consumed by flowers (climbing-roses, hanging wisteria, ground-cover blooms) the architecture is glimpses

Lineage to channel: Tolkien-illustrated-edition flower-densities / Pre-Raphaelite painted bloom-fields / Studio Ghibli cherry-blossom-canopy / Lothlorien (the FLOWERS, not the architecture) / Brian Froud-faerie-realm painted-flower-density / classical Garden-of-Earthly-Delights flower-mass / Monet water-lily-immersive panels.`,
    touchpoints: [
      'FLOWER-CANYON DEPTH — narrow path winding through a flower-canyon, walls hundreds of meters tall of overlapping cascading rose / peony / wisteria / cherry blooms, fantasy spire-tips barely emerging at the canyon-end',
      'KILOMETER FLOWER-CASCADE CLIFF — sheer cliff face dominated by overlapping flower-cascades pouring hundreds of meters down (rose / peony / wisteria / magnolia stacked deep), hint of fantasy citadel half-buried at the top',
      'BLOOM-MOUNTAIN VISTA — entire mountain composed of layered flowers (cherry / magnolia / peony / lilac packed mountain-thick), fantasy spire-tips barely emerging from the bloom-mass',
      'ENDLESS WILDFLOWER MEADOW HORIZON — vast painted meadow of waist-high wildflowers (poppies / cornflowers / lupines / daisies) stretching to a distant fantasy citadel silhouette on the horizon, foreground packed bloom-detail',
      'CHERRY-BLOSSOM CANOPY OVERWHELM — looking up at an endless cherry-blossom canopy filling 85% of the frame, individual fantasy spire-tips poking through at the top, falling petals',
      'VINE-CATHEDRAL WISTERIA CASCADE — viewer beneath hundreds of meters of cascading wisteria and laburnum chains hanging from invisible fantasy structures above, soft painted backlight through the bloom-curtain',
      'FLOWER-FLOODED VALLEY — fantasy valley flooded knee-deep in floating blossoms (pink / lavender / cream), fantasy spires barely emerging from the bloom-flood at the deep distance',
      'BLOSSOM-DROWNED FANTASY RUIN — fantasy ruins SO claimed by flowers (rose-mass / honeysuckle / wisteria) they read as flower-mountains, only a spire-tip and broken arch visible through the bloom',
      'PETAL-SNOW DEPTH — distant fantasy spires barely visible through dense falling petal-snow filling every quadrant of the frame, painted soft natural daylight, no magic',
      'BLOOM-AVENUE TUNNEL — viewer standing inside a tunnel of overlapping flowering-vines (climbing roses, wisteria, honeysuckle layered deep), fantasy spire-tips visible at the far end',
      'FLOWER-CLIFF HORIZON DOMINANT — sheer cliff-face entirely covered in cascading flowers dominates the frame, hint of fantasy stone architecture half-buried at the top',
      'MALLORN-CANOPY OVERWHELM — golden-mallorn fantasy citadel SO blanketed in cascading flowers (gold mallorn-blossoms / cherry / magnolia) the trees themselves are barely visible',
      'HANGING-GARDEN MEGACITY — fantasy hanging-garden tier-city where every level is so overgrown in bloom-cascades the architecture is glimpsed only at edges, layered jasmine / rose / wisteria depth',
      'POPPY-FIELD VISTA — endless rolling field of poppies (red / pink / coral / white) in painterly equal-weight density to the horizon, distant fantasy spire silhouettes barely visible',
      'OVERGROWN FLOWER-COURTYARD — fantasy courtyard SO consumed by flowers (climbing-roses, hanging wisteria, ground-cover bluebells, tall foxgloves) the architecture is mostly glimpses through bloom-curtains',
      'WISTERIA-DRAPED RUINED CITY — fantasy ruined city with hundreds of meters of cascading wisteria draping every visible surface, the architecture barely visible through the lavender-and-violet bloom-curtain',
      'GIANT-PEONY GROVE — grove of building-sized peonies (each bloom several stories tall) packed in a fantasy valley, fantasy spire silhouettes glimpsed between the colossal blossoms',
      'MAGNOLIA-FOREST CITADEL — fantasy citadel deep in a magnolia-forest at full bloom, ten thousand cream-and-pink magnolia blossoms filling the canopy, fantasy spires barely visible through the trees',
      'CASCADING ROSE-MOUNTAIN — fantasy mountainside SO covered in cascading climbing-roses (crimson / coral / cream / blush) the slope is invisible beneath the bloom-waterfall, fantasy spire poking through at the summit',
      'LAVENDER-FIELD CITADEL HORIZON — endless rolling lavender-field stretching to a fantasy citadel silhouette on the horizon, foreground packed with lavender-spikes and wildflowers',
    ],
    instructions: `Each entry is ONE specific FANTASY BLOOM-CITY SETTING, 30-55 words. Format: "FANTASY-CITY NAME CAPS — fantasy-architecture style + signature impossible-fantasy detail + overwhelming bloom-mass note + magical atmosphere". Vary across the 15 categories. NEVER real-world tourist cities. NEVER pedestrian / postcard. BLOOMS are the hero (60-70% of frame), fantasy-architecture is scaffold. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: architectural_detail (the city's signature element) ───
  bloombot_city_flowers_architectural_detail: {
    format: 'simple',
    theme: `FANTASY-BLOOM-CITY SIGNATURE DETAILS for the BloomBot city-flowers path. Each entry is ONE specific FANTASY architectural element typical of impossible bloom-cities — rendered with painterly precision and ORGANICALLY GROWN FROM / DRAPED IN bloom-mass. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a SPECIFIC FANTASY-IMPOSSIBLE architectural detail (NEVER real-world tourist architecture). The detail is the SCAFFOLD blooms grow from / hang on / drape over.

🚫 STRICT BANS:
  • NO real-world tourist architectural details (cobblestones / Juliet balconies / azulejo tiles / Moorish horseshoe arches / Parisian gas-lamps / shop-awnings / bistro tables / pueblo doors / Tuscan shutters / Japanese paper-lanterns / Vietnamese-quarter elements)
  • NO weathered-plaster / sun-bleached-stucco / weathered-cobblestone / aged-paint textures
  • NO modern / contemporary / corporate elements
  • NO duplicate of city_setting
  • NO humans / figures / hands
  • NO interior elements

✓ FANTASY-DETAIL CATEGORIES:
  A. **BLOOM-GROWN BRIDGE** — vine-bridge of woven flowering tendrils / petal-rope walkway / bloom-arch spanning sky-chasm / glowing root-bridge
  B. **VEGETAL TOWER-SPIRE** — fantasy spire grown from living mallorn-bark / orchid-tower hundreds of meters tall / mushroom-pillar with bloom-cap / crystalline-bloom-spire with prismatic facets
  C. **AERIAL TERRACE** — sky-floating bloom-terrace with cascading wisteria-curtains / crystal-railed observation-deck of an elven citadel
  D. **FANTASY GATEWAY** — towering arch of woven bloom-vines / shimmering bloom-portal in fantasy spire-base / glowing root-arch threshold
  E. **FAERIE-PILLAR** — fantasy pillar of woven crystal-bloom / pillar of intertwining glowing-vines / pillar of carved mallorn-wood with petal-leaves
  F. **WALL OF LIVING BLOOMS** — fantasy wall grown entirely from flowering vines / living petal-curtain wall / bioluminescent-bloom wall pulsing soft light
  G. **MAGIC FOUNTAIN** — fantasy bloom-fountain with petals floating in glowing water / waterfall pouring upward into bloom-clouds / crystal-pool with floating lily-pads
  H. **GLOWING BLOOM-LANTERN** — colossal fantasy bloom-lantern hanging from a vine-bridge / luminescent orchid-globe lamp / will-o-wisp-cluster fixture
  I. **CRYSTAL-BLOOM FLOOR** — fantasy floor of inlaid crystal-blossoms / mirror-lake-water-floor with lily-pads / mossy-stone path with luminescent moss-spots
  J. **AERIAL WALKWAY** — fantasy walkway suspended on woven vines / petal-paved skybridge / crystal-stair rising between fantasy spires
  K. **VEGETAL FAERIE-DETAIL** — fantasy carved-vine sigil / glowing rune-bark / faerie-stone with embedded blooms / bioluminescent moss-cluster
  L. **PETAL-STORM SHELTER** — fantasy bloom-eave with cascading petals / vine-grown canopy / hanging-garden balustrade

Channel: Studio-Ghibli Castle-in-the-Sky architectural details / Lothlorien fantasy-detail / Avatar-Pandora bioluminescent-detail / Cocoon-of-Avacyn-MtG art / Brian-Froud faerie-realm details.`,
    touchpoints: [
      'BLOOM-GROWN VINE-BRIDGE — fantasy walkway-bridge entirely woven from glowing flowering vines, suspended over a sky-chasm between two fantasy spires, blossoms hanging from every cross-strand',
      'KILOMETER-TALL ORCHID-SPIRE — fantasy spire grown FROM a single colossal orchid-form, hundreds of meters tall, petal-spirals forming each tier, bioluminescent core glowing from within',
      'AERIAL BLOOM-TERRACE — fantasy sky-floating bloom-terrace with crystal-railed observation deck, cascading wisteria-curtains pouring off every side into open sky, glowing pollen-motes drifting',
      'TOWERING VINE-ARCH GATEWAY — fantasy gateway arch made of woven flowering tendrils, twice the height of a city-tower, glowing pollen-motes in the air around it, magic-hour light radiating',
      'CRYSTALLINE FAERIE-PILLAR — fantasy pillar of multi-faceted crystal-bloom (each facet refracting prismatic light), blooms growing from every crystal joint, painted dawn-gold sky behind',
      'LIVING PETAL-CURTAIN WALL — fantasy wall composed entirely of living woven flowering vines forming a vertical petal-curtain, breeze rippling through it, glowing soft-bioluminescent veins',
      'MAGIC LILY-FOUNTAIN — fantasy fountain with water cascading UPWARD into a hovering bloom-cloud, floating lily-pad-platforms in the basin, mirror-pool reflecting the entire fantasy-city above',
      'COLOSSAL BLOOM-LANTERN — vast fantasy bloom-lantern (city-block sized) hanging from a vine-bridge, luminescent orchid-globe filling its center, will-o-wisps swarming around it',
      'CRYSTAL-BLOOM INLAID FLOOR — fantasy floor of inlaid crystal-blossoms (mosaic of prismatic-bloom-tiles), reflecting the bloom-cascades overhead, painted-gold magic-hour glow',
      'AERIAL CRYSTAL-STAIR — fantasy stair rising between two sky-spires, made of solid crystalline-bloom-stone, glowing vine-balustrades on both sides, cloud-layer hanging below',
      'GLOWING-RUNE BARK — fantasy mallorn-bark spire-wall with carved-rune sigils traced in living golden moss, bloom-cascades pouring down between the runes, magic-hour gold light',
      'PETAL-STORM EAVE — fantasy spire-eave with continuous cascade of falling petals (rose-and-violet), cresting wave of bloom-cascade pouring off the edge into a sky-chasm below',
      'VINE-GROWN RAMPART — fantasy rampart entirely composed of intertwining bloom-vines and woven petals, fortified curtain wall of LIVING vegetation, glowing bioluminescent-blooms at intervals',
      'FAERIE-STONE WITH EMBEDDED BLOOMS — fantasy carved-stone with embedded crystal-blooms in its surface, glowing soft-violet, will-o-wisps drifting around it, mossy fantasy-cobble around',
      'BIOLUMINESCENT MOSS-CLUSTER — fantasy moss-cluster on a vine-bridge railing, glowing electric-cyan from within, surrounding bloom-cascade catching its light, atmospheric mist softening',
      'SKY-FLOATING LILY-PAD PLATFORM — fantasy giant lily-pad-platform suspended in sky on glowing tendrils, fantasy-city spire-cluster rising from its center, mirror-water held in its concave',
      'WATERFALL-PETAL EAVE — fantasy spire-eave with cascading waterfall AND bloom-cascade pouring off it simultaneously, mist-and-petal rising from below, painted-gold light',
      'GLOWING-ROOT BRIDGE — fantasy bridge of glowing roots arching between two sky-spires, bioluminescent blue from within the root-fibers, fantasy floating-island moss below',
      'COLOSSAL CHERRY-BLOOM CANOPY — fantasy canopy-roof entirely of giant cherry-blossom trees grown laterally, ten thousand pink-and-white blossoms, sun-shafts piercing through',
      'FAERIE BLOOM-CHANDELIER — fantasy chandelier (city-block sized) of cascading bioluminescent orchids hanging from the underside of a sky-floating bloom-island, glowing soft-violet',
    ],
    instructions: `Each entry is ONE specific FANTASY-BLOOM-CITY architectural detail, 20-40 words. Format: "DETAIL NAME CAPS — fantasy architectural element + fantasy material / scale / glow + bloom-interaction". Vary across the 12 fantasy categories. NEVER real-world tourist architecture (NO cobblestones / azulejo / Juliet / Parisian / Moorish / pueblo / Tuscan / Japanese-paper-lantern). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: atmospheric_phenomenon (60%-gated city magic) ───
  bloombot_city_flowers_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED FANTASY ATMOSPHERIC MAGIC for the BloomBot city-flowers (fantasy bloom-city) path. Each entry is ONE specific magic-moment element rendered within the impossible fantasy-bloom-city scene. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the fantasy / magical / awe atmosphere of the bloom-city. Renders as a visible magical element within the fantasy frame.

🚫 STRICT BANS:
  • NO real-world urban objects (NO vintage bicycles / Vespa scooters / Parisian gas-lamps / bistro tables / market-stalls / laundry-lines / cobblestone-puddles / paper lanterns)
  • NO humans / pedestrians / figures
  • NO architectural elements (those are city_setting / architectural_detail)
  • NO real-world tourist textures (NO cobblestones / azulejo-tiles / weathered-plaster)

✓ FANTASY-PHENOMENON CATEGORIES:
  A. **MAGICAL LIGHT-SHAFTS** — god-rays piercing fantasy-cathedral-canopy / fantasy aurora-light pouring through bloom-arches / sunbeams refracting through crystal-blooms / bioluminescent-glow rising from petal-clusters
  B. **DRIFTING MAGIC** — glowing pollen-motes drifting in the air / swirling bioluminescent spores / floating magical particles / luminous fairy-dust
  C. **PETAL-STORM** — falling petal-snow drifting horizontally / cascading rose-petal cascade / petal-curtain rippling like rain / pollen-cloud caught in sun-shaft
  D. **FANTASY WEATHER** — fantasy aurora-curtain rippling overhead / impossible double-sun sky / starflower-night-sky / drifting cloud-layer hanging between spires
  E. **FAERIE CREATURES (scale-prover)** — distant tiny faerie-spirit flying / tiny pixie-flock swirling around a spire / butterfly-drift / luminescent moth-cluster
  F. **MAGIC-MIST** — drifting iridescent mist / volumetric god-rays through bloom-fog / mirror-pool with rising magical vapor / golden-hour mist parting around fantasy spires
  G. **GLOWING-PHENOMENA** — bioluminescent blooms pulsing soft-violet / glowing core-light radiating from a fantasy spire / luminescent root-glow from below / will-o-wisp swarm
  H. **REFLECTION-MAGIC** — mirror-lake reflecting the entire bloom-megacity / crystal-floor reflection doubling the bloom-cascades / fantasy water mirror with parallel sky
  I. **RAINBOW / PRISMATIC** — prismatic refraction through crystal-bloom facades / rainbow-light arcing between two fantasy spires / spectrum-shift across the scene
  J. **FALLING-LIGHT MAGIC** — drifting light-particles falling like snow / luminous-leaf-fall from mallorn-canopy / glowing seed-floats drifting upward
  K. **SCALE-PROVER FANTASY-WILDLIFE** — distant dragon arcing through fantasy sky / great phoenix wheeling between spires / tiny glowing fish drifting through coral-bloom-city
  L. **MAGICAL-CASCADE** — fantasy waterfall cascading through bloom-curtains / vine-cascade pouring down a sky-chasm / petal-cascade pouring upward defying gravity

Channel: Studio-Ghibli Castle-in-the-Sky atmospheric moments / Mononoke forest-spirit magic / Avatar-Pandora bioluminescent night / Cocoon-of-Avacyn MtG ambient magic / Lothlorien-Fellowship Lothlorien-atmosphere.`,
    touchpoints: [
      'GOLDEN GOD-RAYS THROUGH CATHEDRAL-CANOPY — dramatic golden god-rays piercing down through a fantasy bloom-cathedral-canopy, individual sun-shafts visible in the volumetric haze, bloom-cascades catching the warm glow',
      'DRIFTING BIOLUMINESCENT POLLEN — glowing soft-violet pollen-motes drifting through the air at fantasy-spire midheight, magical-mist around them, distant fantasy-spires softened by atmospheric depth',
      'HORIZONTAL PETAL-STORM — pink-and-white petal-snow drifting horizontally across the fantasy-bloom-city, sky-filling petal-fall blanketing every visible quadrant, soft golden-hour backlight',
      'AURORA-CURTAIN OVERHEAD — fantasy aurora-curtain rippling magenta-violet-green across the night sky above the bloom-megacity, fantasy-spires silhouetted against the curtain',
      'DISTANT PIXIE-FLOCK SWIRLING — tiny luminescent pixie-flock swarming around the tip of a kilometer-tall fantasy bloom-spire, individual pixies as glowing dots, magical mist softening',
      'IRIDESCENT MIST PARTING — fantasy iridescent mist (rainbow-shimmering) parting around a fantasy bloom-spire to reveal its full silhouette, golden-hour light pouring through the gap',
      'BIOLUMINESCENT BLOOM-CORE PULSE — fantasy bloom-spire core pulsing soft-violet bioluminescence from within, the glow radiating outward through translucent crystal-bloom facets',
      'MIRROR-LAKE BLOOM-CITY REFLECTION — still mirror-lake at the foot of the fantasy bloom-megacity perfectly reflecting the entire vertical composition, doubling the visual impact',
      'PRISMATIC RAINBOW ARC — prismatic rainbow arcing between two fantasy crystal-bloom spires, spectrum visible across the sky, light refracting through crystal-bloom facets',
      'LUMINOUS LEAF-FALL FROM MALLORN — drifting glowing golden leaf-fall cascading from the canopy of a Lothlorien-mallorn fantasy spire, individual luminous leaves visible in the air',
      'DISTANT DRAGON ARCING SKY — distant silhouetted dragon arcing through the fantasy-bloom-city sky, wings outstretched, sun-glinting along its spine, scale-prover for the bloom-megacity',
      'PETAL-CASCADE DEFYING GRAVITY — fantasy petal-cascade pouring UPWARD from a sky-island bloom-megacity into a hovering bloom-cloud overhead, breath-taking impossible motion',
      'WILL-O-WISP SWARM BETWEEN SPIRES — swarm of will-o-wisps drifting between two fantasy bloom-spires, individual wisps as soft-glowing orbs, faerie-realm Brian-Froud atmosphere',
      'GLOWING TINY FISH SCHOOL — fantasy luminescent tiny-fish school drifting between coral-bloom underwater-city spires, glowing soft-cyan in the deep-blue water',
      'SUN-SHAFT REFRACTING CRYSTAL — single golden sun-shaft cutting through the volumetric mist and refracting prismatic light through a fantasy crystal-bloom facade',
      'DUAL-MOON FANTASY SKY — twin moons low on the fantasy horizon (one silver, one crimson) silhouetting the bloom-megacity spires, painted-violet sky behind',
      'FANTASY WATERFALL-CASCADE — fantasy waterfall cascading down through bloom-curtains of a sky-spire, mist plume rising hundreds of meters, light refracting through the spray',
      'STARFLOWER NIGHT-SKY — fantasy night sky filled with luminous starflower-blossoms instead of stars, sky-filling soft-glow, fantasy-spires silhouetted dramatically',
      'PHOENIX WHEELING BETWEEN SPIRES — distant silhouetted fantasy phoenix wheeling between two fantasy bloom-spires, fire-feathers trailing soft light, scale-prover for the megacity',
      'FAIRY-DUST CASCADE — fantasy fairy-dust cascade drifting from a sky-floating bloom-island, luminous golden particles falling in a glittering vertical curtain, magic-hour glow',
    ],
    instructions: `Each entry is ONE specific FANTASY ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary magical element + position in fantasy-bloom-city scene + lighting / fantasy-sensory detail". Vary across the 12 fantasy categories. NO humans. NO real-world urban objects (NO bicycles / Vespa / gas-lamps / bistro tables / cobblestones). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── flower-tunnels path (2026-05-19 R2 rebuild) — DARK tunnel + GLOWING-FLOWER-CORE lanterns
  // The flower CENTERS literally glow like lantern-flames — flowers ARE the light source.
  bloombot_flower_tunnels_tunnel_setting: {
    format: 'simple',
    theme: `POV-INSIDE-A-FLOWER-WORMHOLE setting for the BloomBot flower-tunnels path. The viewer is ENGULFED by flowers — wrapped 360° in a wormhole made ENTIRELY of flowers + climbing-vines + green leaves. NO architecture. NO archways. NO cathedral. NO stone walls. NO cobblestone path. The wormhole structure IS bloom-mass. Each entry 35-65 words.

⚠️ THE BAR: every entry produces a render where (a) the viewer is INSIDE a flower-wormhole engulfed by flowers on every side, (b) the walls / ceiling / floor of the wormhole are ALL flowers + vines + green leaves (no architecture), (c) every visible flower IS A SWITCHED-ON FLOWER-LAMP (translucent backlit petals + warm-amber bulb-core), (d) the deep distance recedes into MORE FLOWERS, not into a bright light, (e) the FLOWERS dominate every quadrant — never a focal exit-glow.

⚠️ COLOR DISTRIBUTION MANDATE (CRITICAL):
The pool MUST have a balanced spread of dominant flower-color across categories. Distribute the 25 entries roughly:
  • ~4 BLUE-DOMINANT (cobalt agapanthus / blue hydrangea / wisteria / forget-me-not / blue Himalayan poppy / cornflower / delphinium)
  • ~4 VIOLET / PURPLE-DOMINANT (jacaranda / lavender / lilac / clematis / heliotrope / iris / morning glory / lupine / amethyst orchid)
  • ~4 WHITE / CREAM-DOMINANT (magnolia / cherry-blossom-white / lily / gardenia / camellia / moonflower / jasmine)
  • ~4 YELLOW / GOLD-DOMINANT (sunflower / daffodil / chrysanthemum / golden marigold / yellow rose / forsythia)
  • ~4 PINK / RED / CORAL-DOMINANT (rose / peony / hibiscus / azalea / camellia / tulip / dahlia)
  • ~3 MIXED-RAINBOW (full-spectrum wormhole with many colored species in roughly equal mass)
  • ~2 ORANGE-DOMINANT (marigold / nasturtium / poppy / orange dahlia / zinnia)

In every entry the GLOW inside each flower stays warm-amber (regardless of petal color).

🚫 ABSOLUTE BANS:
  • NO architecture — no archways / cathedral / vault / columns / stone walls / rock / brick / wood structure
  • NO cobblestone path / paved walkway (a soft moss / petal-strewn / blossom-carpet floor is OK)
  • NO bright destination-glow at the vanishing-point — recedes into MORE flowers, not into light
  • NO real-world tourist tunnels
  • NO sci-fi portal-flash / electric-cyan / will-o-wisps
  • NO empty bare surfaces — every quadrant packed with flowers + vines + green leaves
  • NO sun-shaft / god-rays / spotlights — flower-lamps are the light source

✓ WORMHOLE CATEGORIES (every entry is FLOWERS engulfing the viewer):

  CASCADING WISTERIA-VINE WORMHOLE (~2)
  CLIMBING-ROSE TUNNEL OF VINES (~2)
  CHERRY-BLOSSOM BRANCH-CANOPY WORMHOLE (~2)
  HANGING-VINE BLOOM-CASCADE WORMHOLE (~2)
  SPIRALING FLOWER-WORMHOLE VORTEX (~2)
  ENGULFING FLOWER-MEADOW WRAPAROUND (~2)
  DENSE FOREST-CANOPY OF FLOWERS (~2)
  HIBISCUS-TROPICAL JUNGLE-WRAPAROUND (~2)
  MIXED-SPECIES SPECTRUM ENGULFMENT (~2)
  MAGNOLIA-PETAL OVERWHELM (~2)
  CAMELLIA-CLOUD WORMHOLE (~2)
  GERBERA-DAISY ENGULFMENT (~2)

EVERY entry MUST:
- 35-65 words
- The viewer is ENGULFED — 360° wraparound flower-mass
- Walls / ceiling / floor are ALL flowers + vines + green leaves (NO architecture)
- 2-3 specific flower species WITH EXPLICIT COLORS
- Each flower IS A SWITCHED-ON FLOWER-LAMP (translucent + warm-amber bulb-core)
- The deep distance recedes into MORE FLOWERS (not into bright light)`,
    touchpoints: [
      'BLUE AGAPANTHUS WORMHOLE ENGULFMENT — viewer engulfed inside a wormhole of cobalt-blue agapanthus globes and pale-blue wisteria strands, every globe-flower lit from within by warm-amber bulb-core, climbing-vine green leaves filling every gap, the deep distance receding into MORE blue agapanthus blooms',
      'BLUE-HYDRANGEA CLOUD WORMHOLE — viewer wrapped 360° in dense cobalt-and-violet hydrangea-mopheads with climbing-vine leaves between, every floret-center glowing warm-amber from within, the wormhole receding deeper into more hydrangea-mass',
      'BLUE HIMALAYAN POPPY WRAPAROUND — viewer engulfed in vibrant cobalt-blue Himalayan poppy-cups packed wall-to-wall-to-ceiling-to-floor, every cup-interior glowing warm-orange from within, deep distance fading into more blue-poppy mass',
      'BLUE DELPHINIUM SPIRE FOREST — viewer engulfed in a wormhole of tall cobalt-and-royal-blue delphinium spires reaching from floor to ceiling on all sides, every cup-flower on the spires lit warm-amber from within, deep distance into more delphinium',
      'VIOLET JACARANDA CANOPY WORMHOLE — viewer engulfed in dense violet jacaranda branches wrapping 360°, every five-petal flower lit from within by warm-gold bulb-core, climbing-vine leaves between, deep distance receding into more violet bloom-mass',
      'PURPLE CLEMATIS-AND-MORNING-GLORY ENGULFMENT — viewer wrapped in dense purple clematis and deep-violet morning-glory trumpets, every flower-throat blazing warm-amber from within, green vines threading throughout, deep distance into more purple bloom-mass',
      'LAVENDER-AND-LILAC OVERWHELM — viewer engulfed in dense lavender-spires and lilac-clusters wrapping 360°, every floret backlit by warm-amber bulb-core, green-vine leaves between, deep distance receding into more lavender-violet mass',
      'PURPLE LUPINE SPIRE-FOREST — viewer engulfed in tall purple-lupine spires in violet and indigo on every side, every floret along the spires lit warm-amber from within, leaves between, deep distance into more lupine',
      'WHITE MAGNOLIA OVERWHELM — viewer engulfed in dense cream-white magnolia branches wrapping 360°, every translucent ivory petal backlit by warm-cream bulb-core, glossy green leaves throughout, deep distance receding into more magnolia mass',
      'CREAM MOONFLOWER WORMHOLE — viewer wrapped in dense cream moonflower and white cereus blossoms wall-to-ceiling-to-floor, every translucent ivory petal backlit by warm-amber bulb-core, green vines threading, deep distance into more moonflower-mass',
      'WHITE LILY-AND-GARDENIA ENGULFMENT — viewer engulfed in pure-white trumpet-lily blossoms and cream gardenias wrapping 360°, every trumpet-throat lit from within by warm-amber, dark-green leaves between, deep distance into more white-bloom mass',
      'WHITE CHERRY-BLOSSOM WORMHOLE — viewer engulfed in dense overlapping white cherry-blossom branches forming the wormhole 360°, every blossom translucent and backlit by warm-cream bulb-core, drifting petals filling the air, deep distance into more cherry-blossom mass',
      'YELLOW SUNFLOWER WRAPAROUND — viewer engulfed in giant yellow sunflowers turning inward on every side, every disc-center radiating warm-gold like a switched-on sun-disc-lamp, green leaves throughout, deep distance into more sunflower-heads',
      'GOLDEN DAFFODIL-AND-MARIGOLD WORMHOLE — viewer wrapped in golden daffodils and yellow marigolds, every trumpet-throat blazing warm-amber from within, green-vine leaves between, deep distance into more golden-bloom mass',
      'GOLDEN CHRYSANTHEMUM ORB-WORMHOLE — viewer engulfed in dense golden chrysanthemum spheres wrapping 360°, every petal-spiral backlit by warm-gold from within, green leaves between, deep distance into more chrysanthemum-mass',
      'YELLOW DAHLIA-AND-FORSYTHIA ENGULFMENT — viewer engulfed in yellow dahlias and cascading golden forsythia, every petal-spiral backlit by warm-gold bulb-cores, green leaves throughout, deep distance into more yellow-bloom mass',
      'PINK CHERRY-BLOSSOM WORMHOLE — viewer engulfed in dense overlapping pink cherry-blossom branches forming the wormhole, every blossom backlit by warm-amber bulb-core, green leaves throughout, deep distance into more pink cherry-blossom mass',
      'CORAL ROSE-AND-PEONY OVERWHELM — viewer wrapped in coral roses and blush peonies wrapping 360°, every rose-core glowing warm-pink-amber from within, dark-green vines between, deep distance into more coral-rose-mass',
      'RED HIBISCUS-AND-AZALEA TROPICAL — viewer engulfed in red hibiscus and crimson azaleas wrapping 360°, every hibiscus-center blazing warm-orange-amber from within like torch-flames, tropical green leaves throughout, deep distance into more red-bloom mass',
      'CRIMSON DAHLIA-AND-DAISY ENGULFMENT — viewer engulfed in crimson dahlias and red gerbera-daisies wrapping 360°, every dahlia-heart glowing warm-gold from within, green leaves between, deep distance into more crimson-bloom mass',
      'ORANGE MARIGOLD-AND-NASTURTIUM WRAPAROUND — viewer engulfed in bright orange marigolds and warm-orange nasturtiums on every side, every flower-center radiating warm-amber from within, green leaves throughout, deep distance into more orange-bloom mass',
      'ORANGE BIRD-OF-PARADISE TROPICAL JUNGLE — viewer engulfed in dense tropical jungle of vivid-orange bird-of-paradise and red-and-orange heliconia, every flower-core blazing warm-amber from within, green tropical leaves filling gaps, deep distance into more tropical-bloom mass',
      'MIXED RAINBOW WORMHOLE — viewer engulfed in a wormhole mixing blue agapanthus + violet jacaranda + white magnolia + yellow daffodil + pink rose + red hibiscus in roughly equal mass, every flower lit from within by warm-amber bulb-core, the wormhole a rainbow of glowing flower-lamps',
      'RAINBOW SPIRAL WORMHOLE — spiraling wormhole engulfing the viewer mixing wisteria-blue + jacaranda-violet + magnolia-cream + sunflower-gold + rose-pink + hibiscus-red, every bloom translucent and backlit by warm-amber bulb-cores, green-vine leaves throughout',
      'PURPLE-AND-WHITE FOREST OVERWHELM — viewer engulfed in dense deep-purple lupine spires and pure-white moonflower trumpets wrapping 360°, every individual flower lit from within by warm-amber bulb-core, green leaves filling gaps, deep distance into more purple-and-white mass',
    ],
    instructions: `Each entry is ONE specific POV-INSIDE-A-FLOWER-WORMHOLE setting, 35-65 words. Format: 'WORMHOLE NAME CAPS — viewer ENGULFED 360° in [2-3 specific flower species with explicit colors] + green vines/leaves throughout, every flower IS A SWITCHED-ON LAMP with translucent petals + warm-amber bulb-core, deep distance receding into MORE FLOWERS (not into bright light)'. NO architecture. NO archways. NO cathedral. NO stone walls. COLOR DISTRIBUTION MANDATORY — across 25 entries, distribute roughly 4 blue / 4 violet-purple / 4 white-cream / 4 yellow-gold / 4 pink-red-coral / 3 mixed-rainbow / 2 orange. The GLOW stays warm-amber regardless of petal color. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_tunnels_flower_lanterns: {
    format: 'simple',
    theme: `SWITCHED-ON FLOWER-LAMP elements for the BloomBot flower-tunnels path. Each entry describes ONE specific flower species (or cluster) that IS A LIT LAMP IN THE SHAPE OF THAT FLOWER — translucent petals backlit from a bright warm-amber bulb-core. Each entry 20-40 words.

⚠️ THE BAR: every entry names a flower species and EXPLICITLY describes it AS A SWITCHED-ON LAMP — translucent petals + warm-amber bulb-core making the bloom look unmistakably illuminated. The FLOWER IS the lamp, the FLOWER IS the bulb.

⚠️ COLOR DISTRIBUTION MANDATE (CRITICAL):
Distribute the 25 entries across the FULL SPECTRUM of flower colors:
  • ~4 BLUE flower-lamps (agapanthus / blue hydrangea / blue Himalayan poppy / cornflower / forget-me-not / morning glory blue)
  • ~4 VIOLET/PURPLE flower-lamps (jacaranda / lavender / lilac / lupine / iris / wisteria-violet / heliotrope / clematis)
  • ~4 WHITE/CREAM flower-lamps (magnolia / lily / gardenia / moonflower / dogwood / camellia / orchid / cherry-blossom white)
  • ~4 YELLOW/GOLD flower-lamps (sunflower / daffodil / chrysanthemum / yellow rose / golden marigold / forsythia / mimosa / yellow lily)
  • ~4 PINK/RED/CORAL flower-lamps (rose / peony / hibiscus / azalea / tulip / dahlia / camellia / hibiscus / fuchsia)
  • ~3 ORANGE flower-lamps (marigold / nasturtium / poppy / orange dahlia / bird-of-paradise / torch-ginger)
  • ~2 MULTI-COLOR / EXOTIC (orchid / pansy / lantana / mixed dahlia)

For EVERY color, the GLOW inside stays WARM-AMBER (a blue agapanthus has a warm-amber lit core, a white magnolia has a warm-cream lit core, a yellow daffodil has a warm-gold lit core). The petal color varies, the glow stays warm.

🚫 STRICT BANS:
  • NO sci-fi bioluminescent magical glow / will-o-wisps / electric-cyan
  • NO actual lamps / lanterns / candles — the FLOWER IS the lamp
  • NO 'flowers with subtle glow' — every flower MUST look unmistakably ON
  • NO opaque-petaled flowers — petals must be TRANSLUCENT and backlit

✓ FLOWER-LAMP CATEGORIES (variety mandatory):

  HANGING CHANDELIER FLOWERS — bell/pendant flowers with translucent walls + warm bulb-cores (foxglove, fuchsia, trumpet-vine, brugmansia, wisteria, honeysuckle, lily-of-the-valley)
  CANDLE-CLUSTER FLOWERS — upward-facing translucent flowers with warm bulb-cores (marigold, dahlia, zinnia, hibiscus, peony, lily, tulip, rose)
  DISC FLOWERS — large flat translucent flowers with bright bulb-centers (sunflower, gerbera-daisy, dahlia, coneflower, black-eyed-susan)
  CLUSTER ORBS — dense bloom-cluster orbs each glowing as a single lantern (hydrangea, lilac, allium, agapanthus, mophead, snowball)
  EXOTIC TROPICAL — exotic blooms reading as exotic lanterns (orchid, hibiscus, bird-of-paradise, torch-ginger, plumeria, ohia-lehua)`,
    touchpoints: [
      'BLUE AGAPANTHUS GLOBE-LANTERNS — clusters of cobalt-blue agapanthus globes lining the tunnel walls, every individual blue floret in the globe-cluster lit from within by a warm-amber bulb-core, the BLUE petals translucent and backlit, reading as glowing blue-and-amber orb-lanterns',
      'BLUE-HYDRANGEA GLOWING-ORBS — large cobalt-and-violet hydrangea-mopheads clustered along the tunnel walls, every tiny floret-center glowing warm-amber from within, the whole cluster a glowing globe-lantern',
      'BLUE HIMALAYAN POPPY LAMPS — bright cobalt-blue Himalayan poppy-cups lining the path, each cup-interior glowing warm-orange from within like a switched-on cup-shaped lamp, blue petals translucent',
      'BLUE DELPHINIUM SPIRE-TORCHES — tall delphinium spires in deep cobalt and royal blue, every individual cup-flower on the spires lit from within by a warm-amber bulb-core, reading as upright torches',
      'VIOLET JACARANDA LANTERN-CLUSTERS — cascading violet jacaranda blossoms in the canopy, every five-petal flower translucent and backlit by warm-gold bulb-cores, the violet petals glowing from within',
      'LAVENDER SPIRE-LAMPS — tall lavender-spires lining the path, every tiny floret on the spires lit from within by warm-amber, the whole spire reading as a lavender-and-amber torch',
      'PURPLE CLEMATIS PORTAL-LAMPS — large purple clematis blossoms mounted at intervals along tunnel-walls, every six-petal flower translucent and lit from within by warm-amber, the purple petals glowing',
      'LUPINE PURPLE-TORCH SPIRES — tall purple-lupine spires in violet and indigo, every individual floret along the spire lit from within by warm-amber bulb-core, upright torch-lanterns',
      'WHITE MAGNOLIA PEARL-LAMPS — large cream-white magnolia blossoms hanging from the canopy, every translucent ivory petal backlit by a warm-cream bulb-core, reading as a row of soft glowing pearl-lanterns',
      'WHITE TRUMPET-LILY HORN-LANTERNS — fragrant pure-white trumpet-lily flowers hanging from vines, every trumpet-throat lit from within by warm-amber, white petals translucent and glowing soft pearl-warm',
      'CREAM MOONFLOWER PAPER-LANTERNS — large white moonflower-trumpets hanging at intervals, every trumpet-throat glowing warm-cream from within like a Chinese paper-lantern, ivory petals backlit',
      'WHITE GARDENIA CLUSTER-LAMPS — clusters of cream gardenias along the tunnel walls, every translucent petal backlit by warm-cream bulb-core, soft pearl-warm glow radiating outward',
      'YELLOW SUNFLOWER DISC-LAMPS — massive yellow sunflower-heads turning toward the viewer, every disc-center radiating warm-gold like a switched-on sun-disc-lamp, ray-petals translucent gold',
      'GOLDEN DAFFODIL HORN-LAMPS — clusters of golden daffodils lining the tunnel path, every trumpet-throat blazing warm-amber from within like horn-lanterns, yellow petals translucent and glowing',
      'YELLOW MARIGOLD CANDLE-FLAMES — clusters of bright yellow-and-gold marigolds along the path, every petal-spiral backlit by warm-amber bulb-cores, reading as upright candle-flames',
      'GOLDEN CHRYSANTHEMUM ORB-LAMPS — dense golden chrysanthemum spheres clustered along walls, every petal-spiral backlit by warm-gold from within, glowing orb-lanterns',
      'PINK CHERRY-BLOSSOM LANTERN-STRANDS — cascading cherry-blossom branches with every pink blossom backlit by warm-amber bulb-core, translucent petals glowing soft pink-warm',
      'CORAL ROSE EMBER-LAMPS — coral and warm-pink climbing-rose clusters with every rose-core glowing warm-pink-amber like an ember-heart, layered petals backlit',
      'PINK PEONY ORB-LAMPS — large coral and blush peonies with every layered-petal-mass backlit by warm-coral-amber bulb-cores, glowing orb-lanterns',
      'RED HIBISCUS TORCH-FLAMES — large red hibiscus blossoms along the walls with warm-orange glowing centers like torch-flames at the heart of each, petals backlit',
      'CRIMSON DAHLIA HEART-LAMPS — large crimson dahlias along the path, every petal-spiral backlit by warm-gold from within, reading as glowing rose-and-amber heart-lamps',
      'ORANGE MARIGOLD CANDLE-CLUSTERS — clusters of orange marigolds with warm-amber bulb-cores radiating outward through petals, reading as orange candle-flames',
      'ORANGE NASTURTIUM CUP-LAMPS — bright-orange nasturtium-cups lining the path, every cup-interior glowing warm-amber from within, translucent orange petals glowing',
      'BIRD-OF-PARADISE FLAME-LANTERNS — exotic orange-and-blue bird-of-paradise flowers with warm-orange glowing cores reading as exotic flame-shaped lanterns',
      'TROPICAL ORCHID EXOTIC-LAMPS — pale orchid blossoms with translucent petals and warm-amber bulb-cores, reading as exotic ornamental flower-lamps',
    ],
    instructions: `Each entry is ONE specific SWITCHED-ON FLOWER-LAMP, 20-40 words. Format: 'FLOWER NAME LAMP-TYPE CAPS — specific flower species WITH EXPLICIT COLOR + translucent petals + warm-amber bulb-core inside making the flower look unmistakably ON'. COLOR DISTRIBUTION MANDATORY — across 25 entries, distribute roughly 4 blue / 4 violet-purple / 4 white-cream / 4 yellow-gold / 4 pink-red-coral / 3 orange / 2 multi-color. The GLOW stays warm-amber regardless of petal color. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_tunnels_atmospheric_phenomenon: {
    format: 'simple',
    theme: `40%-GATED TUNNEL ATMOSPHERIC PHENOMENA for the BloomBot flower-tunnels path. Each entry is ONE specific atmospheric magic-moment element rendered within the flower-tunnel scene. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the flower-as-light aesthetic. Does NOT compete with the flowers — supports them.

🚫 STRICT BANS:
  • NO sci-fi glow / bioluminescent / will-o-wisps / fairy-dust / electric-cyan
  • NO actual lamps / lanterns / candles / electric-lights (flowers are the lights)
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO ROBED FIGURES, NO PEDESTRIANS, NO TRAVELERS, NO EXPLORERS, NO HUMANOID ANYWHERE in the frame — foreground OR distant OR vanishing-point. The flower-wormhole is COMPLETELY empty of human presence 🚫🚫🚫
  • NO duplicate of tunnel architectural elements

✓ TUNNEL-PHENOMENON CATEGORIES:
  A. **PETAL-FALL** — drifting petal-snow filling the tunnel air / cherry-blossom-fall through the canopy / drifting wisteria-petals
  B. **WATER ELEMENTS** — stream winding through the tunnel floor / mirror-pool at the deep end / dripping water from ceiling vines
  C. **MIST / FOG DRIFT** — soft mist drifting through the tunnel deep-end / morning fog parting around the flower-walls / drifting smoke
  D. **NON-HUMAN SCALE-PROVER (WILDLIFE ONLY)** — lone deer crossing the path / single white stag at far end / solitary fox / lone owl perched / NEVER a human figure
  E. **WARM LIGHT-GLOW BEYOND** — warm exit-glow at the deep end of the tunnel / sunset glow visible through the far opening / fire-warmth from beyond
  F. **FALLEN-PETAL CARPET** — fallen petals carpeting the tunnel floor / petal-strewn cobblestones / blossom-thick path
  G. **REFLECTION** — wet floor reflecting the bloom-canopy / mirror-pool doubling the tunnel-walls / dewdrop-reflections on petals
  H. **CREATURE / WILDLIFE** — single butterfly drifting through / single moth at a flower-lantern / single hummingbird at a hanging flower
  I. **BREEZE-MOTION** — gentle wind moving the cascading flowers / wisteria-strands swaying / fallen petals being lifted
  J. **DEW / RAIN** — fresh rain on the flowers / dewdrops catching ambient light / wet petals glistening
  K. **NIGHT-STAR THROUGH GAP** — single bright star visible through a gap in the tunnel-canopy / moon-glow through the bloom-overhang
  L. **SMOKE / INCENSE** — soft drifting smoke from somewhere beyond / incense curl winding through`,
    touchpoints: [
      'CHERRY-BLOSSOM PETAL-FALL — soft pink-and-white cherry-blossom petals drifting through the entire tunnel air, individual petals catching the ambient flower-light, dense petal-fall filling every quadrant',
      'STREAM WINDING THROUGH FLOOR — narrow silver stream winding through the center of the tunnel floor, water reflecting the bloom-canopy overhead, gentle current carrying fallen petals',
      'MORNING MIST AT TUNNEL DEEP-END — soft white morning mist drifting through the deep-end of the tunnel, atmospheric depth softening the bloom-walls toward the vanishing-point',
      'LONE FOX AT VANISHING-POINT — single small fox standing at the tunnel deep-end, the fox-silhouette barely visible against the warm bloom-glow, providing scale without any human presence',
      'WARM SUNSET EXIT-GLOW — warm orange-and-gold sunset glow visible at the deep end of the tunnel, the warm light backlighting the bloom-walls at the vanishing-point',
      'FALLEN-PETAL CARPET — thick carpet of fallen pink-and-white petals covering the tunnel floor, individual petals visible at the viewer feet, blossom-thick path receding into the deep distance',
      'WET-PATH BLOOM-REFLECTION — wet stone path reflecting the bloom-canopy overhead, the reflection slightly blurred, doubling the visual impact of the flower-lanterns above',
      'SINGLE BUTTERFLY DRIFTING — single iridescent butterfly drifting through the tunnel air at midground height, wings catching the warm flower-uplight, the rest of the tunnel quiet',
      'WISTERIA SWAYING IN BREEZE — gentle breeze making the cascading wisteria-strands sway in unison, motion-blur on the swaying strands, falling petals lifted upward by the breeze',
      'FRESH RAIN ON PETALS — fresh rain droplets on every visible petal, individual blooms glistening with caught light, wet leaves reflecting the dim ambient',
      'MOON-GLOW THROUGH CANOPY-GAP — pale silver moon-glow visible through a gap in the bloom-canopy overhead, single shaft of moonlight cutting down to the tunnel floor',
      'INCENSE-SMOKE DRIFTING — soft warm-amber incense smoke curling through the tunnel air, drifting upward through the bloom-canopy, atmospheric depth softening',
      'HUMMINGBIRD AT HANGING FLOWER — single iridescent hummingbird hovering at a hanging foxglove or trumpet-lily flower-lantern, wings a motion-blur of jewel-color',
      'DEWDROPS ON SPIDERWEB — dewdrops catching dim ambient on a spiderweb stretched between two hanging-flower-lanterns, each droplet a tiny prism, atmospheric',
      'PETAL-CASCADE DRIFTING UPWARD — petal-snow drifting horizontally then upward in a gentle thermal, defying gravity for a moment, magic-implied without sci-fi-glow',
      'WARM CANDLE-AMBIENT BEYOND DOORWAY — warm candle-amber ambient glow visible through a doorway-archway beyond the tunnel deep-end, suggesting a flower-shrine just past the threshold',
      'DEER STANDING AT FAR END — single white stag standing still at the tunnel deep-end, silhouetted against the warm exit-glow, the deer giving scale',
      'TORCH-AMBIENT GROUND-GLOW — warm torch-ambient glow emanating from below the floor-level marigold-clusters, casting uplight onto the underside of hanging blooms above',
      'DRIFTING BLOSSOM-FALL — soft cherry-blossom-fall drifting horizontally through the tunnel, painted-petal-motion filling the air, soft natural daylight',
      'MIRROR-POOL AT TUNNEL DEEP-END — still mirror-pool of water at the tunnel deep-end, perfect reflection doubling the bloom-canopy, lotus floating in the foreground reflection',
    ],
    instructions: `Each entry is ONE specific FLOWER-TUNNEL ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in tunnel scene + light/sensory detail". Vary across the 12 categories. NO sci-fi glow. NO actual lamps. ABSOLUTE HARD BAN ON HUMANS — no people / no figures / no silhouettes / no pedestrians anywhere (wildlife scale-provers like deer / stag / fox / owl are fine). The phenomenon supports the flowers-as-lights aesthetic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── flower-friends path (2026-05-19) — close-up flower + pleasant pollinator pairing ───
  bloombot_flower_friends_flower_focal_cluster: {
    format: 'simple',
    theme: `WHIMSICAL ENCHANTED MULTI-FLOWER GARDEN VIGNETTE for the BloomBot flower-friends path. Each entry describes ONE specific PULLED-BACK garden scene with 3-5+ different hero flower species blooming together as co-hero — a whimsical floral abundance, NOT a single hero. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where (a) 3-5+ DIFFERENT flower species bloom together as co-hero (NEVER a single hero), (b) the scene is FULL of whimsical floral abundance, (c) the framing is PULLED-BACK garden vignette (NOT macro close-up), (d) dreamy bokeh background of more blooms / soft sky / pastel wash implied behind, (e) enchanted happy fairytale storybook mood, (f) SOFT WATERCOLOR PASTEL color register (NOT vivid saturated jewel-tone).

⚠️ MULTI-FLOWER MANDATE — every entry MUST describe AT LEAST 3 different specific flower species blooming together as co-hero. NEVER a single dominant hero. The whole composition is the abundance — mix varied shapes (large layered bloom + medium disc + delicate single + tall spire) and varied colors for the whimsical-garden look.

⚠️ SOFT PASTEL COLOR REGISTER — every flower color described in SOFT WATERCOLOR PASTEL tone:
  • PALE PINK / SOFT CORAL / DUSTY PEACH (NOT hot-pink / magenta / red)
  • SOFT LAVENDER / PALE VIOLET / PERIWINKLE (NOT deep-purple / electric-violet)
  • PALE BABY-BLUE / SKY-BLUE / SOFT CORNFLOWER (NOT cobalt / electric-blue)
  • SOFT BUTTERCUP-YELLOW / PALE GOLD / CREAM (NOT vivid sunflower-yellow)
  • PALE APRICOT / SOFT TANGERINE / DUSTY ORANGE (NOT vivid neon-orange)
  • PALE TURQUOISE / SEAFOAM / MINT
  • SOFT IVORY / OFFWHITE / CREAM
  • DUSTY ROSE / PALE MAUVE / BLUSH

⚠️ COLOR DISTRIBUTION MANDATE — distribute the 25 entries evenly across the FULL color spectrum (DO NOT bias toward pink/purple/red):
  • ~4 BLUE-DOMINANT entries (soft baby-blue / periwinkle / pale-cornflower / pale-turquoise as the dominant palette)
  • ~4 VIOLET-DOMINANT entries (soft lavender / pale-violet / pale-lilac as the dominant palette)
  • ~4 YELLOW-DOMINANT entries (soft buttercup / pale-gold / pale-cream as the dominant palette)
  • ~4 WHITE/CREAM-DOMINANT entries (ivory / offwhite / cream / soft-white as the dominant palette)
  • ~3 ORANGE-DOMINANT entries (pale apricot / soft tangerine / dusty orange as the dominant palette)
  • ~3 PINK-DOMINANT entries (pale-pink / dusty-rose / blush as the dominant palette)
  • ~3 MULTI-COLOR-RAINBOW entries (mixed soft-pastel across the spectrum)

⚠️ FLOWER SPECIES PALETTE — pick freely from:
  Dahlia / Peony / Zinnia / Cosmos / Hibiscus / Sunflower / Lily / Rose / Tulip / Daisy / Aster / Magnolia / Marigold / Anemone / Ranunculus / Chrysanthemum / Camellia / Poppy / Lotus / Iris / Larkspur / Lupine / Delphinium / Snapdragon / Foxglove / Sweet-pea / Bellflower / Cornflower / Geranium / Pansy / Forget-me-not / Bachelor-button / Hollyhock / Bluebell / Hydrangea / Periwinkle / Phlox / Aquilegia / Statice / Yarrow / Scabiosa / Wisteria

🚫 STRICT BANS:
  • 🚫 NO single-hero composition — 3+ species mandatory
  • 🚫 NO extreme macro INTO a single petal (that's closeup's territory)
  • 🚫 NO single-bloom-filling-frame composition
  • 🚫 NO vase / cut-flower / interior framing
  • 🚫 NO empty foreground — the cluster fills the foreground
  • 🚫 NO insect description (insect comes from hero_pollinator axis)
  • 🚫 NO humans / hands / body parts
  • 🚫 NO archways / tunnels / engulfment / urban / ruins
  • 🚫 NO sci-fi / surreal / floating

✓ NATURALISTIC PRETTY FLOWERS GROWING IN THE WILD — enchanted garden / meadow / forest-edge / wildflower-glade implied. The multi-flower cluster is the natural foreground; bokeh behind.

✓ MOOD — whimsical, enchanted, happy, fairytale-storybook, peaceful, magical-pretty. Studio Ghibli + Disney secret-garden + Beatrix Potter + IG dreamy-magical-hour.`,
    touchpoints: [
      // BLUE-DOMINANT (~4)
      'PALE-BLUE PERIWINKLE DREAMSCAPE — pale baby-blue periwinkles + soft cornflower-blue bachelor-buttons + pale-blue forget-me-nots + soft white daisies + delicate ivory cosmos blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'SOFT-BLUE HYDRANGEA GLADE — soft baby-blue hydrangea cluster + pale-blue delphinium spires + soft periwinkle phlox + ivory daisies + delicate pale-blue forget-me-nots blooming together as co-hero in pulled-back enchanted vignette, soft watercolor pastel register, dreamy bokeh behind',
      'PALE-TURQUOISE-AND-CREAM MEADOW — pale turquoise scabiosa + soft seafoam aquilegia + pale-blue cornflowers + cream sweet-peas + ivory daisies blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      'POWDER-BLUE WILDFLOWER GARDEN — powder-blue larkspur + pale-blue bellflowers + soft cornflowers + delicate pale-cream daisies + ivory yarrow blooming together as co-hero in pulled-back enchanted garden vignette, soft watercolor pastel register, dreamy bokeh behind',
      // VIOLET-DOMINANT (~4)
      'SOFT-LAVENDER ENCHANTED VIGNETTE — soft-lavender lupines + pale-violet phlox + pale-lilac asters + delicate cream cosmos + ivory daisies blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-VIOLET PHLOX GLADE — pale-violet phlox cluster + soft-lavender wisteria strands + pale-lilac larkspur + soft ivory roses + cream daisies blooming together as co-hero in pulled-back enchanted glade vignette, soft watercolor pastel register, dreamy bokeh behind',
      'LILAC-DREAM ENCHANTED GARDEN — soft pale-lilac aquilegia + pale-violet aster + soft-lavender sweet-pea + delicate cream peonies + ivory cosmos blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-PURPLE WISTERIA-AND-IRIS — soft pale-purple wisteria cascade + pale-lilac irises + soft-lavender bellflowers + delicate cream tulips + ivory daisies blooming together as co-hero in pulled-back enchanted vignette, soft pastel watercolor register, dreamy bokeh behind',
      // YELLOW-DOMINANT (~4)
      'SOFT-BUTTERCUP MEADOW GLADE — soft buttercup-yellow daisies + pale-gold ranunculus + soft cream sunflowers + delicate pale-yellow marigolds + ivory cosmos blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-GOLD CHAMOMILE DREAMSCAPE — pale-gold chamomile daisies + soft buttercup daffodils + cream-yellow ranunculus + delicate ivory roses + soft pale-cream cosmos blooming together as co-hero in pulled-back enchanted vignette, soft pastel watercolor register, dreamy bokeh behind',
      'SOFT-LEMON GARDEN VIGNETTE — soft lemon-yellow tulips + pale-gold daffodils + cream-yellow primroses + delicate pale-cream daisies + ivory peonies blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'BUTTERCUP-AND-CREAM ENCHANTED MEADOW — pale buttercup yarrow + soft-yellow snapdragons + cream-gold pansies + delicate ivory daisies + soft pale-pink cosmos blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      // WHITE/CREAM-DOMINANT (~4)
      'IVORY-AND-CREAM ROMANTIC GARDEN — ivory peonies + soft cream roses + pale-ivory magnolias + cream daisies + delicate pale-cream sweet-peas blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-WHITE COSMOS GLADE — pale-white cosmos + soft ivory daisies + cream-white anemones + delicate pale-white phlox + soft pale-blue forget-me-nots blooming together as co-hero in pulled-back enchanted glade vignette, soft pastel watercolor register, dreamy bokeh behind',
      'CREAM-AND-OFFWHITE ENCHANTED MEADOW — soft cream roses + ivory tulips + pale-cream daisies + delicate offwhite anemones + soft pale-yellow sweet-peas blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PURE-WHITE FAIRYTALE GARDEN — pale-white peonies + ivory lilies + soft-white roses + cream daisies + delicate pale-pink cosmos blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      // ORANGE-DOMINANT (~3)
      'PALE-APRICOT ENCHANTED MEADOW — pale apricot ranunculus + soft tangerine marigolds + dusty-orange dahlias + delicate cream daisies + ivory sweet-peas blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      'SOFT-PEACH GARDEN VIGNETTE — soft peach roses + pale-apricot tulips + dusty-orange zinnias + delicate cream cosmos + soft ivory daisies blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-TANGERINE WILDFLOWER GLADE — pale-tangerine marigolds + soft apricot poppies + dusty-orange snapdragons + delicate cream daisies + ivory yarrow blooming together as co-hero in pulled-back enchanted glade vignette, soft pastel watercolor register, dreamy bokeh behind',
      // PINK-DOMINANT (~3)
      'DUSTY-ROSE ENCHANTED GARDEN — dusty-rose peonies + pale-pink ranunculus + blush dahlias + delicate cream sweet-peas + ivory daisies blooming together as co-hero in pulled-back enchanted garden vignette, soft pastel watercolor register, dreamy bokeh behind',
      'BLUSH-PINK SPRING MEADOW — soft blush cherry-blossoms + pale-pink magnolias + dusty-rose camellias + delicate cream peonies + ivory daisies blooming together as co-hero in pulled-back enchanted spring meadow, soft pastel watercolor register, dreamy bokeh behind',
      'PALE-PINK COSMOS DREAMSCAPE — pale-pink cosmos + soft blush sweet-peas + dusty-rose anemones + delicate cream daisies + ivory phlox blooming together as co-hero in pulled-back enchanted dreamscape vignette, soft pastel watercolor register, dreamy bokeh behind',
      // MULTI-COLOR RAINBOW (~3)
      'SOFT-PASTEL RAINBOW MEADOW — pale baby-blue cornflowers + soft lavender asters + pale buttercup daisies + soft peach ranunculus + delicate blush cosmos + ivory tulips blooming together as co-hero in pulled-back enchanted meadow vignette, soft pastel watercolor register, dreamy bokeh behind',
      'WATERCOLOR PASTEL GARDEN — soft pale-pink peonies + pale-violet phlox + soft buttercup snapdragons + delicate pale-blue forget-me-nots + ivory daisies + soft-coral roses blooming together as co-hero in pulled-back enchanted vignette, soft pastel watercolor register, dreamy bokeh behind',
      'PASTEL-RAINBOW WILDFLOWER GLADE — pale-turquoise scabiosa + soft-lavender bellflowers + pale-yellow yarrow + soft-peach poppies + delicate pale-pink cosmos + ivory daisies blooming together as co-hero in pulled-back enchanted glade vignette, soft pastel watercolor register, dreamy bokeh behind',
    ],
    instructions: `Each entry is ONE specific WHIMSICAL MULTI-FLOWER ENCHANTED GARDEN VIGNETTE, 30-55 words. Format: "VIGNETTE NAME / PASTEL-PALETTE CAPS — 3-5+ co-hero flower species blooming together in a pulled-back enchanted garden vignette + soft pastel watercolor register + dreamy bokeh implied". MANDATORY — (a) AT LEAST 3 different flower species + co-hero composition (NEVER single hero), (b) PULLED-BACK garden vignette framing, (c) SOFT WATERCOLOR PASTEL color register (NEVER vivid saturated jewel-tone), (d) explicit pastel-color words (pale / soft / dusty / blush / ivory / cream / pale-baby / soft-lavender / etc.), (e) dreamy bokeh implied, (f) whimsical enchanted mood. NEVER bias toward pink/purple/red — distribute across the FULL color spectrum (BLUE / VIOLET / YELLOW / WHITE / ORANGE / PINK / RAINBOW). NO insect description. NO macro / extreme closeup. NO vase / interior. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_friends_hero_pollinator: {
    format: 'simple',
    theme: `POLLINATOR CAST — 3-6+ CUTE PLEASANT INSECTS for the BloomBot flower-friends path. Each entry describes a CAST OF 3-6+ different cute pleasant pollinators positioned at different spots throughout the enchanted-garden scene — bumblebees / butterflies / dragonflies / ladybugs / fireflies / moths flying / landed / hovering. The insects are CUTE-rendered (charming storybook-friendly, NOT realistic-creepy). Each entry 30-55 words.

⚠️ THE BAR: every entry describes a CAST of 3-6+ insects positioned throughout the scene — multiple species, multiple positions (some on flowers, some hovering, some flying / drifting in midground). Each insect rendered in a CUTE storybook-friendly way (fuzzy soft bodies, friendly proportions, slightly-stylized cute eyes, peaceful poses). NEVER single hero insect — multi-cast mandatory.

⚠️ FOCAL POLLINATOR MANDATE (CRITICAL — makes insects POP) — every entry MUST nominate ONE focal pollinator from the cast that's rendered PROMINENTLY:
  - Positioned FRONT-AND-CENTER (large, clearly visible, in sharp focus)
  - Notably BIGGER than the supporting cast members
  - With CONTRASTING color that pops against the soft-pastel flower background (vivid wings against pale petals, e.g., orange monarch against pale-blue meadow)
  - Crisp wing-pattern / fuzzy-body detail clearly visible
  - The viewer's eye goes to this focal insect FIRST

The other 2-4+ supporting cast members are smaller / further back / hovering in the bokeh — they fill the scene with life without competing.

⚠️ INSECT CAST COMPOSITION MANDATE — every entry MUST describe AT LEAST 3 different specific pleasant pollinators positioned at different spots in the scene. Mix species. Vary positions (landed on a flower / hovering at a petal / flying mid-air / drifting in the bokeh / perched on a leaf).

⚠️ FOCAL SPECIES ROTATION MANDATE (anti-bumblebee-dominance) — distribute the 25 entries so the FOCAL pollinator rotates across all species (NOT always bumblebee as anchor):
  - ~6 BUTTERFLY-FOCAL entries (monarch / swallowtail / blue morpho / painted lady / fritillary / pink-purple / cabbage-white / red admiral / common-tiger as the front-and-center hero)
  - ~5 BUMBLEBEE-FOCAL entries (fuzzy bumblebee / carpenter bee / honeybee as the front-and-center hero)
  - ~4 DRAGONFLY-FOCAL entries (blue / green / red darter / emerald / damselfly as the front-and-center hero)
  - ~3 MOTH-FOCAL entries (luna moth / hummingbird hawkmoth / rosy maple moth as the front-and-center hero)
  - ~3 LADYBUG-FOCAL entries (red ladybug / orange ladybug rendered larger and more prominent as the front-and-center hero — NOT just a tiny accent)
  - ~2 FIREFLY-FOCAL entries (glowing-abdomen firefly at dusk as the front-and-center hero)
  - ~2 LACEWING-FOCAL entries (delicate pale-green lacewing as the front-and-center hero)

⚠️ CUTE-RENDERING MANDATE — every insect described in a CHARMING STORYBOOK-CUTE register:
  • Fuzzy soft bodies (especially bumblebees) — emphasize fuzziness
  • Friendly stylized proportions — slightly bigger soft eyes, rounder bodies
  • Peaceful poses — drinking nectar peacefully, gently hovering, sleepy-cozy landed
  • Storybook-charming, NOT realistic-creepy / detailed-photoreal / menacing
  • Think Disney secret-garden cute, NOT nature-documentary realistic

⚠️ PLEASANT INSECT PALETTE — pick freely from:
  • BUMBLEBEES (fuzzy bumblebee / honeybee / carpenter-bee / yellow-and-black bumblebee / brown bumblebee)
  • BUTTERFLIES (monarch / swallowtail / blue morpho / painted lady / pink-purple iridescent / fritillary / common-tiger / red admiral / cabbage white)
  • MOTHS (luna moth / hummingbird hawkmoth / rosy maple moth — pretty moths only)
  • DRAGONFLIES (blue dragonfly / green dragonfly / red darter / emerald / damselfly)
  • LADYBUGS (red-with-black-spots / orange-with-black-spots)
  • FIREFLIES (glowing-abdomen firefly with soft warm light — dusk variant)
  • LACEWINGS (delicate pale-green lacewing)

🚫 STRICT BANS:
  • 🚫 NO single hero insect — multi-cast (3+) mandatory
  • 🚫 NO realistic-creepy / detailed-photoreal / menacing / scary / aggressive insect rendering — cute storybook-charming only
  • 🚫🚫🚫 NO UGLY / CREEPY species — NO spiders, NO wasps, NO hornets, NO flies, NO mosquitoes, NO centipedes, NO earwigs, NO cockroaches, NO beetles (other than ladybugs), NO ticks, NO any creepy-crawly 🚫🚫🚫
  • 🚫 NO sci-fi insects / fantasy bugs / glowing-magical insects (other than naturalistic fireflies)
  • 🚫 NO humans / hands / body parts

✓ MANDATORY — every entry describes the WHOLE CAST of insects in one scene, varied species + varied positions, all rendered in storybook-cute charming register.`,
    touchpoints: [
      'BUMBLEBEE-BUTTERFLY CAST — two fuzzy yellow-and-black bumblebees landed on different blooms, a monarch butterfly hovering above with wings spread, a small pink-purple butterfly fluttering at the edge of frame, all rendered cute storybook-charming',
      'BUTTERFLY-DRAGONFLY TRIO — a monarch butterfly landed on one flower drinking nectar, a blue dragonfly hovering above the foreground blooms, a pale-pink butterfly fluttering in the bokeh space, plus a small ladybug on a petal, all cute storybook-charming',
      'BUMBLEBEE QUARTET ENCHANTED — four fuzzy bumblebees positioned at different flowers (two landed drinking nectar, two hovering in flight), plus a delicate cabbage-white butterfly drifting through, all rendered cute storybook-charming with fuzzy soft bodies',
      'MONARCH-AND-DRAGONFLY DUET — a large monarch butterfly with wings half-spread landed on a flower, a vivid blue dragonfly perched on a petal nearby, a small fuzzy bumblebee on another bloom, plus a tiny ladybug on a leaf, all cute storybook-charming',
      'PINK-BUTTERFLY GARDEN CAST — three delicate pink-and-purple butterflies at different positions (one landed, two hovering), plus a fuzzy bumblebee on the foreground bloom and a small ladybug on a leaf, all rendered cute storybook-charming',
      'LUNA-MOTH ENCHANTED CAST — a large pale-green luna moth with wings spread perched on a flower, a fuzzy bumblebee landed on another bloom, a small yellow-and-black butterfly fluttering above, plus a tiny dragonfly hovering, all storybook-charming',
      'WHITE-AND-PINK BUTTERFLY CAST — three white cabbage-butterflies fluttering at different heights (one landed, two hovering), a fuzzy bumblebee on the foreground bloom, plus a delicate pink butterfly drifting through, all cute storybook-charming',
      'DRAGONFLY-AND-LADYBUG MIX — a vivid blue dragonfly hovering above the flowers, a green dragonfly perched on a petal, two ladybugs on different leaves, plus a small bumblebee landed on a bloom, all rendered cute storybook-charming',
      'BUTTERFLY SWARM CAST — five small colorful butterflies (pink, yellow, blue, orange, white) fluttering at different heights throughout the scene, plus one fuzzy bumblebee on the foreground bloom, all rendered cute storybook-charming',
      'BEE-AND-BUTTERFLY ABUNDANCE — three fuzzy bumblebees at different flowers, two pink-and-purple butterflies hovering above, plus one small ladybug on a leaf, all rendered cute storybook-charming with friendly proportions',
      'SWALLOWTAIL-AND-MOTH CAST — a yellow-and-black swallowtail butterfly with wings spread landed on a flower, a rosy maple moth on another bloom, two fuzzy bumblebees drifting between, plus a small dragonfly hovering, all storybook-charming',
      'EMERALD-DRAGONFLY GARDEN — two vivid emerald dragonflies hovering above the flowers, a fuzzy bumblebee landed on the foreground bloom, plus a small pink butterfly fluttering through and a ladybug on a petal, all rendered cute storybook-charming',
      'PAINTED-LADY GARDEN CAST — a large painted-lady butterfly with wings spread drinking nectar from a flower, two fuzzy bumblebees on different blooms, a small dragonfly hovering above, plus a tiny ladybug on a leaf, all cute storybook-charming',
      'FIREFLY-DUSK CAST — three fireflies with softly glowing abdomens hovering through the dusk garden, a fuzzy bumblebee on a foreground bloom, plus a delicate pale-pink butterfly drifting, all rendered cute storybook-charming',
      'HUMMINGBIRD-HAWKMOTH CAST — a fuzzy hummingbird-hawkmoth hovering at a flower with rapid wing-blur, two fuzzy bumblebees on different blooms, plus a small pink butterfly fluttering above and a ladybug on a leaf, all cute storybook-charming',
      'BUMBLEBEE-PAIR-AND-FRIENDS — a pair of fuzzy bumblebees landed side-by-side on the same hero bloom, a monarch butterfly hovering above with wings spread, a small blue dragonfly perched on a leaf, plus a tiny ladybug, all storybook-charming',
      'BLUE-MORPHO ENCHANTED CAST — a vivid blue morpho butterfly with iridescent wings spread hovering above the flowers, two fuzzy bumblebees on different blooms, plus a small white cabbage-butterfly fluttering and a tiny dragonfly, all storybook-charming',
      'CARPENTER-BEE GARDEN CAST — two large fuzzy carpenter bees landed on different blooms, a delicate pink butterfly hovering above, a small dragonfly perched on a leaf, plus a tiny ladybug on a petal, all rendered cute storybook-charming',
      'FRITILLARY-AND-BUMBLEBEE CAST — a fritillary butterfly with checkerboard wings landed on a flower, two fuzzy bumblebees on different blooms, a small pink-purple butterfly hovering above, plus a tiny ladybug, all cute storybook-charming',
      'LADYBUG-AND-BEE CAST — three ladybugs on different leaves and petals, two fuzzy bumblebees on different blooms, plus a small pale-pink butterfly fluttering above and a tiny dragonfly hovering, all rendered cute storybook-charming',
      'DAMSELFLY-AND-BUTTERFLY CAST — two slim cobalt damselflies perched on different petals, a monarch butterfly hovering above with wings spread, plus a fuzzy bumblebee on the foreground bloom and a small ladybug on a leaf, all storybook-charming',
      'ROSY-MAPLE-MOTH GARDEN — a small pink-and-yellow rosy maple moth landed on a flower, two fuzzy bumblebees on different blooms, a delicate pink butterfly hovering above, plus a tiny ladybug on a leaf, all cute storybook-charming',
      'WHITE-CABBAGE-BUTTERFLY CAST — four white cabbage-butterflies fluttering at different heights throughout the scene, plus one fuzzy bumblebee landed on the foreground bloom and a small ladybug, all rendered cute storybook-charming',
      'MULTI-COLOR BUTTERFLY ABUNDANCE — six small colorful butterflies (varied colors — pink, blue, yellow, orange, white, purple) fluttering at different heights throughout the scene, plus one fuzzy bumblebee on a foreground bloom, all storybook-charming',
      'LACEWING-AND-DRAGONFLY CAST — a delicate pale-green lacewing perched on a flower-petal, a vivid blue dragonfly hovering above, two fuzzy bumblebees on different blooms, plus a small pink butterfly fluttering through, all cute storybook-charming',
    ],
    instructions: `Each entry is ONE specific POLLINATOR CAST of 3-6+ cute pleasant insects, 30-55 words. Format: "CAST NAME CAPS — explicit description of 3-6+ different insect species + their positions throughout the scene + all rendered cute storybook-charming". MULTI-CAST MANDATORY — at least 3 different specific insects, varied species, varied positions (landed / hovering / flying / perched). CUTE STORYBOOK-CHARMING RENDERING — fuzzy soft bodies, friendly proportions, peaceful poses, NOT realistic-creepy. ABSOLUTE BAN on spiders / wasps / hornets / flies / mosquitoes / centipedes / earwigs / cockroaches / non-ladybug beetles / any creepy-crawly. NO humans / hands / body parts. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_friends_magical_particles: {
    format: 'simple',
    theme: `40%-GATED MAGICAL PARTICLES for the BloomBot flower-friends path. Each entry describes ONE specific atmospheric magic-pretty particle effect drifting in the scene — pollen-dust, fairy-light bokeh-orbs, sparkle dust, dewdrops on petals, falling petals, iridescent shimmer, mist haze. Each entry 20-40 words.

⚠️ MANDATORY — every particle effect AMPLIFIES the cozy magical-pretty aesthetic. Does NOT compete with the insect or flower. Subtle atmospheric magic.

🚫 STRICT BANS:
  • NO sci-fi glow / electric / neon / aurora
  • NO scary / dark / ominous particles
  • NO humans / hands / body parts
  • NO additional creatures / animals (focal pollinator handles that)
  • NO ugly / creepy particles (no bugs, no debris, no dirt)

✓ PARTICLE CATEGORIES:
  A. **POLLEN-DUST** — drifting pollen-motes catching ambient light, golden-yellow drift
  B. **FAIRY-LIGHT BOKEH-ORBS** — soft warm bokeh-orbs floating in the air (the magical kind from IG nature feeds)
  C. **SPARKLE DUST** — tiny iridescent sparkle particles drifting (subtle, not glitter-heavy)
  D. **DEWDROPS ON PETALS** — fresh dew droplets clinging to petals catching ambient light as prismatic flares
  E. **FALLING PETALS** — soft petals drifting horizontally through the scene (pink / white / cherry-blossom)
  F. **IRIDESCENT SHIMMER** — soft iridescent shimmer in the air (rainbow-pearlescent gentle wash)
  G. **MIST HAZE** — soft warm haze softening the bokeh background, atmospheric depth
  H. **BUBBLE DRIFT** — soft translucent bubbles drifting (rare, magical-pretty register)
  I. **FLOATING LEAVES** — small soft leaves drifting horizontally through the scene
  J. **WATER-SPRAY MIST** — soft fine water-mist droplets catching ambient light
  K. **SUN-RAY STREAMERS** — soft warm sun-ray streamers slanting through the scene, very gentle`,
    touchpoints: [
      'GOLDEN POLLEN-DUST DRIFT — soft golden-yellow pollen-motes drifting through the air around the hero flower and pollinator, catching the warm ambient light, atmospheric magical-pretty texture',
      'WARM BOKEH-ORBS FLOATING — soft warm-amber and pink fairy-light bokeh-orbs floating in the air behind the hero flower, soft out-of-focus magical-pretty atmospheric',
      'SPARKLE DUST SHIMMER — tiny iridescent pearl-pink sparkle particles drifting through the air around the scene, subtle magical shimmer catching the warm light',
      'DEWDROPS ON PETALS WITH FLARES — fresh dew droplets clinging to the hero flower petals catching the warm ambient light as tiny prismatic flares, naturalistic wet shimmer',
      'PINK CHERRY-BLOSSOM PETAL-FALL — soft pink cherry-blossom petals drifting horizontally through the scene around the hero flower and pollinator, gentle motion-blur',
      'IRIDESCENT RAINBOW SHIMMER — soft iridescent rainbow-pearlescent shimmer in the air around the scene, gentle wash of magic-pretty color',
      'WARM ATMOSPHERIC HAZE — soft warm-amber atmospheric haze softening the bokeh background, deep dreamy depth, magical-pretty ambient',
      'TRANSLUCENT BUBBLE DRIFT — soft translucent bubbles drifting through the scene catching the warm ambient light as rainbow prismatic flares, charming magical-pretty',
      'SOFT FALLING LEAVES — small soft green and golden leaves drifting horizontally through the scene around the hero flower and pollinator, gentle autumn touch',
      'WATER-SPRAY MIST SHIMMER — soft fine water-mist droplets catching the warm ambient light around the scene, gentle atmospheric magic-pretty shimmer',
      'SOFT SUN-RAY STREAMERS — soft warm golden sun-ray streamers slanting gently through the scene from the upper-frame edge, magical-pretty atmospheric',
      'WHITE-ROSE PETAL-FALL — soft white rose petals drifting horizontally through the scene, gentle motion-blur, romantic magical-pretty',
      'BUMBLEBEE-DUST POLLEN — golden pollen-dust drifting around the hero pollinator, catching warm ambient light, atmospheric pollinator-magic register',
      'LAVENDER-POLLEN SPARKLE — pale-lavender and pink sparkle pollen drifting around the hero flower, subtle magical-pretty shimmer',
      'DEW-LACED BOUQUET — fresh dew droplets clinging to every visible petal and leaf, catching the warm ambient light as tiny prismatic shimmer, naturalistic wet-glisten',
      'SOFT WARM-PINK BOKEH-ORBS — large soft warm-pink fairy-light bokeh-orbs floating in the deep bokeh background, magical-pretty atmospheric',
      'GENTLE GOLDEN-DUST CASCADE — gentle golden-dust cascade drifting downward through the scene around the hero flower, warm magical-pretty atmospheric',
      'PINK-AND-WHITE PETAL DRIFT — soft pink-and-white petals drifting through the air around the hero flower and pollinator, gentle motion, romantic magical-pretty',
      'PEARL-SHEEN MIST — soft pearl-iridescent mist drifting through the deep bokeh background, magical-pretty atmospheric depth',
      'GOLDEN-AMBER POLLEN — golden-amber pollen-dust drifting around the hero flower and pollinator, catching warm light, atmospheric pollinator-magic',
      'SOFT BLUE-AND-GOLD BOKEH — soft cobalt-blue and golden bokeh-orbs floating in the bokeh background, magical-pretty atmospheric',
      'FRESH MORNING DEW — fresh morning dewdrops clinging to every petal, leaf, and the pollinator wings, catching ambient light as prismatic shimmer, naturalistic wet-magic',
      'SOFT CORAL PETAL-FALL — soft coral petals drifting horizontally through the scene, gentle motion-blur, romantic magical-pretty',
      'IRIDESCENT WING-DUST — fine iridescent wing-dust drifting around the hero pollinator (especially butterfly wings), catching warm light as gentle shimmer',
      'GENTLE FAIRY-LIGHT WASH — gentle warm fairy-light bokeh-orb wash filling the deep bokeh background, magical-pretty atmospheric depth',
    ],
    instructions: `Each entry is ONE specific MAGICAL PARTICLE effect, 20-40 words. Format: "PARTICLE NAME CAPS — primary effect + position in scene + how it catches light / interacts with the ambient". Vary across the 11 categories. NO sci-fi / electric / neon. NO scary / dark. NO humans / hands. NO additional creatures. NO ugly particles. Subtle magical-pretty atmospheric only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── flower-humming-birds path (2026-05-19) — vibrant hummingbird + flower scenes ───
  bloombot_flower_humming_birds_flower_focal_cluster: {
    format: 'simple',
    theme: `VIBRANT MULTI-FLOWER HUMMINGBIRD-ATTRACTING GARDEN VIGNETTE for the BloomBot flower-humming-birds path. Each entry describes ONE specific PULLED-BACK garden scene with 3-5+ hummingbird-attracting flower species blooming together in VIBRANT SATURATED JEWEL-TONE colors — NOT soft-pastel. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where (a) 3-5+ DIFFERENT hummingbird-attracting flower species bloom together (NEVER a single hero), (b) VIBRANT SATURATED JEWEL-TONE colors (red, fuchsia, magenta, scarlet, hot-pink, orange, deep purple, sapphire blue, jewel-yellow — NOT pastel), (c) PULLED-BACK garden vignette framing (NOT macro), (d) dreamy bokeh background, (e) enchanted happy vibrant mood.

⚠️ HUMMINGBIRD-ATTRACTING SPECIES PALETTE — pick freely from:
  Trumpet vine (orange / red) / Fuchsia (hot-pink + purple) / Salvia (scarlet / blue / purple) / Hibiscus (red / orange / pink) / Bee balm (vivid magenta / red) / Columbine (red / yellow / purple) / Butterfly bush (purple / pink) / Cardinal flower (vivid red) / Lupine (purple / blue / pink) / Foxglove (purple / pink / cream) / Petunia (vivid pink / purple / red) / Lantana (orange-and-pink / yellow-and-red) / Agastache (purple / pink / orange) / Penstemon (red / pink / purple) / Honeysuckle (red / orange / yellow) / Morning glory (purple / blue / magenta) / Sage (red / blue / purple) / Lobelia (vivid red) / Crocosmia (vivid red-orange) / Tropical lily (orange / red / yellow) / Coral bells (red / pink) / Bottlebrush (vivid red) / Bird-of-paradise (orange + blue) / Canna lily (red / orange / yellow) / Zinnia (vivid colors) / Phlox (vivid pink / purple / red)

⚠️ MULTI-FLOWER MANDATE — every entry MUST describe AT LEAST 3 different specific hummingbird-attracting flowers blooming together as co-hero. NEVER single hero. Mix shapes (tubular / trumpet / bell / spire / disc) and vibrant colors.

⚠️ VIBRANT JEWEL-TONE COLOR REGISTER (CRITICAL — distinct from flower-friends' soft pastel):
  - Deep RED, SCARLET, CRIMSON, RUBY
  - Vivid FUCHSIA, MAGENTA, HOT-PINK
  - Bright ORANGE, TANGERINE, FLAME
  - Deep PURPLE, ROYAL VIOLET, AMETHYST
  - Sapphire BLUE, ELECTRIC INDIGO, JEWEL TEAL
  - Vivid YELLOW, JEWEL GOLD
  - Multi-color VIVID JEWEL-TONE MIX

⚠️ COLOR DISTRIBUTION MANDATE — across the 25 entries, distribute roughly:
  - ~5 RED-DOMINANT (scarlet trumpet vine + cardinal flower + red salvia + bee balm + bottlebrush)
  - ~4 FUCHSIA-MAGENTA-DOMINANT (fuchsia + hot-pink penstemon + magenta bee balm + vivid phlox)
  - ~4 ORANGE-DOMINANT (trumpet vine + crocosmia + tropical lily + agastache + honeysuckle)
  - ~3 PURPLE-DOMINANT (deep-purple butterfly bush + purple lupine + violet morning glory)
  - ~3 BLUE-DOMINANT (sapphire salvia + blue columbine + indigo lobelia)
  - ~3 YELLOW-DOMINANT (jewel-yellow honeysuckle + golden canna + vivid yellow columbine)
  - ~3 MULTI-COLOR JEWEL-RAINBOW (vivid mixed)

⚠️ COMPOSITION VARIETY MANDATE — across the 25 entries, distribute compositions roughly:
  - ~14 UPRIGHT GARDEN-VIGNETTE (flowers blooming together in a pulled-back ground-level garden — the default "garden cluster" composition)
  - ~6 CASCADING / HANGING VINE COMPOSITION — viny flowers cascading DOWN from above as the primary visual:
      • HANGING WISTERIA-AND-FUCHSIA CASCADE — long purple wisteria strands + hot-pink fuchsia bells cascading from above
      • TRUMPET-VINE ARCH — scarlet trumpet vines cascading down a natural arch, dangling tubular blooms
      • MORNING-GLORY VINE-WALL — purple-blue morning glories climbing a trellis / wall, vines spilling down
      • HONEYSUCKLE CASCADE — yellow-and-red honeysuckle vines cascading down, dangling tubular blooms
      • BOUGAINVILLEA CASCADE — fuchsia-and-magenta bougainvillea papery cascade from above
      • PASSIONFLOWER VINE — exotic purple-and-white passionflower vines climbing and dangling
  - ~3 TROPICAL-CANOPY (orchids / hibiscus / heliconia hanging in a tropical-jungle-canopy composition with hummingbirds darting through)
  - ~2 BIRD-FEEDER-GARDEN (suet-feeder-style hanging-flower-feeders that hummingbirds gather at — naturalistic, no actual man-made feeder structures)

For CASCADING / HANGING / TROPICAL-CANOPY entries, the FLOWERS HANG / DRIP / CASCADE from above as the dominant visual — hummingbirds dart THROUGH the cascade or hover at dangling tubular blooms.

🚫 STRICT BANS:
  • 🚫 NO single-hero composition — 3+ species mandatory
  • 🚫 NO soft-pastel colors (that is flower-friends' territory)
  • 🚫 NO extreme macro / single-petal framing
  • 🚫 NO vase / cut-flower / interior
  • 🚫 NO hummingbird description (separate axis)
  • 🚫 NO humans / hands / body parts
  • 🚫 NO archways / tunnels / engulfment / urban / ruins
  • 🚫 NO sci-fi / surreal / floating

✓ ENCHANTED GARDEN GROWING IN THE WILD — pollinator-garden / tropical-meadow / wildflower-bank / forest-edge implied. Multi-flower foreground; bokeh behind.

✓ MOOD — vibrant, enchanted, lively, magical — Audubon meets Studio Ghibli meets IG tropical-hummingbird-feeder.`,
    touchpoints: [
      'SCARLET TRUMPET-VINE-AND-BEE-BALM GARDEN — vivid scarlet trumpet vines + deep-red cardinal flowers + magenta bee balm + bright-red salvia + small orange honeysuckle blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh of more red blooms behind',
      'FUCHSIA-AND-MAGENTA HOT-PINK ABUNDANCE — hot-pink fuchsia + vivid magenta bee balm + fuchsia penstemon + bright-pink phlox + small purple butterfly bush blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'ORANGE TROPICAL TROPICAL-PARADISE — vivid orange trumpet vines + bright-orange crocosmia + orange tropical lilies + flame-orange agastache + small red honeysuckle blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy tropical-foliage bokeh behind',
      'DEEP-PURPLE BUTTERFLY-BUSH GARDEN — deep-purple butterfly bushes + violet salvia + amethyst lupine spires + royal-purple foxglove + small magenta penstemon blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'SAPPHIRE-BLUE SALVIA GLADE — sapphire-blue salvia + indigo lobelia + cobalt columbine + electric-blue morning glory + small purple lupine blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'JEWEL-YELLOW HONEYSUCKLE-AND-CANNA — vivid yellow honeysuckle + jewel-gold canna lilies + bright-yellow columbine + flame-orange crocosmia + small red bee balm blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'JEWEL-TONE RAINBOW GARDEN — vivid red trumpet vines + fuchsia bee balm + sapphire-blue salvia + jewel-yellow honeysuckle + deep-purple butterfly bush + bright-orange crocosmia blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'CRIMSON CARDINAL-FLOWER MEADOW — vivid crimson cardinal flowers + deep-red bee balm + scarlet salvia + ruby-red lobelia + small orange honeysuckle blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh of more red blooms behind',
      'HOT-PINK PENSTEMON-AND-PHLOX — hot-pink penstemon + vivid pink phlox + fuchsia salvia + magenta bee balm + small purple agastache blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'FLAME-ORANGE TROPICAL CASCADE — flame-orange trumpet vines + vivid orange crocosmia + tangerine bird-of-paradise + bright-red canna lilies + small yellow honeysuckle blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy tropical bokeh behind',
      'ROYAL-PURPLE FOXGLOVE GARDEN — royal-purple foxgloves + deep-violet butterfly bushes + amethyst lupine spires + magenta penstemon + small blue salvia blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'INDIGO LOBELIA-AND-SAGE — indigo lobelia + sapphire-blue sage + cobalt columbine + electric-blue salvia + small purple morning glory blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'GOLDEN CANNA-AND-COLUMBINE — jewel-gold canna lilies + bright-yellow columbine + vivid yellow honeysuckle + orange crocosmia + small red bee balm blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'TROPICAL-RED HIBISCUS MEADOW — vivid red hibiscus + scarlet salvia + crimson canna lilies + flame-orange trumpet vines + small fuchsia bougainvillea blooming together as co-hero in pulled-back vibrant tropical-hummingbird-garden vignette, dreamy tropical bokeh behind',
      'MAGENTA BEE-BALM ABUNDANCE — vivid magenta bee balm + hot-pink fuchsia + fuchsia salvia + bright-pink penstemon + small purple butterfly bush blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'ORANGE-AND-RED FIRESTORM GARDEN — flame-orange trumpet vines + scarlet salvia + vivid orange crocosmia + crimson cardinal flowers + small red honeysuckle blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'AMETHYST LUPINE-AND-SALVIA — amethyst lupine spires + violet salvia + royal-purple foxgloves + magenta bee balm + small blue columbine blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'JEWEL-BLUE COLUMBINE GARDEN — sapphire-blue columbine + indigo lobelia + electric-blue salvia + cobalt morning glory + small purple agastache blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'TROPICAL JEWEL ABUNDANCE — bird-of-paradise (orange-and-blue) + vivid red canna lilies + fuchsia hibiscus + flame-orange crocosmia + small jewel-yellow honeysuckle blooming together as co-hero in pulled-back vibrant tropical-hummingbird-garden vignette, dreamy bokeh behind',
      'CRIMSON-AND-FUCHSIA GLOW — crimson bottlebrush + fuchsia bee balm + scarlet trumpet vines + magenta penstemon + small purple butterfly bush blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'YELLOW-AND-ORANGE SUNBURST — jewel-yellow honeysuckle + flame-orange trumpet vines + bright-yellow canna + golden columbine + small red crocosmia blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'PURPLE-BLUE TWILIGHT JEWEL — deep-purple butterfly bush + sapphire salvia + indigo lobelia + amethyst foxgloves + small electric-blue morning glory blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'TROPICAL-MIXED JEWEL RAINBOW — vivid red hibiscus + fuchsia bougainvillea + sapphire salvia + jewel-yellow canna + flame-orange trumpet vines + small deep-purple butterfly bush blooming together as co-hero in pulled-back vibrant tropical-hummingbird-garden vignette, dreamy bokeh behind',
      'SCARLET-AND-MAGENTA POWER — vivid scarlet trumpet vines + magenta bee balm + crimson cardinal flowers + hot-pink penstemon + small flame-orange crocosmia blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'VIVID JEWEL-RAINBOW MEADOW — vivid red salvia + fuchsia bee balm + sapphire columbine + jewel-yellow honeysuckle + deep-purple lupine + bright-orange trumpet vines blooming together as co-hero in pulled-back vibrant hummingbird-garden vignette, dreamy bokeh behind',
      'WISTERIA-AND-FUCHSIA HANGING CASCADE — long purple wisteria strands and hot-pink fuchsia bells cascading down from above into the frame as the primary visual, hummingbirds darting through the hanging curtain of dangling tubular blooms, dreamy bokeh of more vines behind',
      'SCARLET TRUMPET-VINE ARCH — scarlet trumpet vines cascading down a natural archway with dangling tubular blooms hanging into the frame, hummingbirds hovering at the trumpet-mouths, dreamy bokeh of more vines and warm sunlight behind',
      'PURPLE MORNING-GLORY VINE-WALL — vivid purple-and-blue morning glory vines climbing and spilling down a natural trellis / wall, hummingbirds banking through the vine-curtain, dreamy bokeh of more vines behind',
      'YELLOW-AND-RED HONEYSUCKLE CASCADE — yellow-and-red honeysuckle vines cascading down from above with dangling tubular blooms, hummingbirds darting at the trumpet-mouths, dreamy bokeh of warm-green leaves behind',
      'FUCHSIA BOUGAINVILLEA CASCADE — vivid fuchsia-and-magenta bougainvillea papery bracts cascading down from above into the frame, hummingbirds hovering at the dense cluster, dreamy bokeh of pink-blooms behind',
      'EXOTIC PASSIONFLOWER VINE-CURTAIN — exotic purple-and-white passionflower vines climbing and dangling in a vine-curtain, intricate passionflower blooms hanging into the frame, hummingbirds darting through, dreamy bokeh of more vines behind',
      'TROPICAL ORCHID-CANOPY — exotic vivid orchid clusters hanging from a tropical-jungle-canopy of vines above, with bright hibiscus and heliconia spires, hummingbirds darting through the tropical canopy, dreamy bokeh of warm jungle-foliage behind',
      'CORAL HIBISCUS-CANOPY — vivid coral and red hibiscus blossoms hanging from cascading tropical branches with orange heliconia spires nearby, hummingbirds hovering at the hanging tubular flowers, dreamy bokeh of warm tropical-foliage behind',
    ],
    instructions: `Each entry is ONE specific VIBRANT MULTI-FLOWER HUMMINGBIRD-ATTRACTING GARDEN COMPOSITION (mix UPRIGHT garden-vignettes + CASCADING/HANGING vine compositions + TROPICAL-CANOPY compositions), 30-55 words. Format: "VIGNETTE NAME / JEWEL-PALETTE CAPS — 3-5+ co-hero hummingbird-attracting flower species in vibrant saturated jewel-tone colors blooming together in a pulled-back enchanted garden vignette + dreamy bokeh implied". MANDATORY — (a) AT LEAST 3 different hummingbird-magnet species, (b) pulled-back garden vignette framing, (c) VIBRANT SATURATED JEWEL-TONE color register (NEVER soft-pastel — that is flower-friends), (d) explicit vivid color words (scarlet / fuchsia / magenta / sapphire / flame-orange / amethyst / etc.), (e) dreamy bokeh implied, (f) vibrant enchanted mood. Distribute color-dominance evenly across the 25 (red, fuchsia, orange, purple, blue, yellow, rainbow). NO hummingbird description. NO macro. NO vase / interior. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_humming_birds_hummingbird_cast: {
    format: 'simple',
    theme: `HUMMINGBIRD CAST — 2-4+ IRIDESCENT JEWEL-TONE HUMMINGBIRDS for the BloomBot flower-humming-birds path. Each entry describes a CAST of 2-4+ hummingbirds positioned dynamically throughout the enchanted-garden scene — different species, different positions (hovering / sipping nectar / mid-flight / banking sideways). ONE is the FOCAL hummingbird rendered prominently front-and-center. Each entry 30-55 words.

⚠️ THE BAR: every entry describes a CAST of 2-4+ hummingbirds — varied species, varied poses, ONE FOCAL hummingbird sharply rendered with crisp iridescent jewel-tone plumage and distinctive markings positioned front-and-center, supporting cast at different positions in midground / bokeh.

⚠️ FOCAL HUMMINGBIRD MANDATE (CRITICAL — makes the hummingbird POP) — every entry MUST nominate ONE focal hummingbird rendered PROMINENTLY:
  - Positioned FRONT-AND-CENTER (large, clearly visible, in sharp focus)
  - Notably BIGGER than the supporting cast
  - With iridescent jewel-tone plumage clearly visible (ruby-throat / emerald-back / sapphire crown / fiery-orange / magenta / metallic-green / etc.)
  - Wings often in motion-blur showing rapid flight, beak at a tubular bloom drinking nectar OR hovering
  - Crisp feather + iridescence detail
  - The viewer's eye lands here FIRST

The other 1-3 supporting hummingbirds are smaller / further back / hovering at other blooms / banking through the bokeh.

⚠️ HUMMINGBIRD CAST COMPOSITION MANDATE — every entry MUST describe AT LEAST 2 different specific hummingbirds (focal + 1-3 supporting). Mix species and iridescent colors. Vary poses.

⚠️ HUMMINGBIRD SPECIES PALETTE — pick freely from (each has distinctive iridescent jewel-tone plumage):
  - Ruby-throated hummingbird (vivid ruby-red throat + emerald-green back)
  - Anna hummingbird (iridescent magenta-pink crown + emerald-back)
  - Broad-tailed hummingbird (iridescent ruby throat + green back)
  - Costa hummingbird (iridescent violet crown + emerald-back)
  - Allen hummingbird (iridescent copper-orange + emerald-back)
  - Calliope hummingbird (rose-streak throat + green back)
  - Magnificent hummingbird (iridescent emerald + violet crown)
  - Black-chinned hummingbird (iridescent purple chin + green-back)
  - Rufous hummingbird (vivid copper-orange overall)
  - Sparkling violetear (iridescent emerald + purple ear-patch)
  - Violet-crowned hummingbird (iridescent violet crown + white underside)
  - Long-tailed sylph (iridescent emerald + long sapphire tail-streamers)
  - Booted racket-tail (iridescent emerald + racket tail-feathers)
  - Crowned woodnymph (iridescent purple crown + emerald)
  - Bee hummingbird (tiny iridescent pink-and-blue)
  - Buff-bellied hummingbird (iridescent emerald + buff-orange belly)
  - Berylline hummingbird (iridescent emerald-green + rufous wings)
  - Rivoli hummingbird (iridescent magenta crown + emerald)

⚠️ DYNAMIC POSE PALETTE — every hummingbird is in a DYNAMIC pose (not perched-still):
  - HOVERING — wings in rapid motion-blur (the classic hummingbird signature)
  - SIPPING NECTAR — long thin beak inserted into a tubular bloom
  - MID-FLIGHT — banking sideways or transitioning between blooms
  - BEAK-TO-FLOWER — moments before drinking, beak almost at the bloom
  - TAIL-FEATHERS SPREAD — for balance while hovering
  - WING-FLUTTER — wings showing rapid blur even at rest

⚠️ FOCAL SPECIES ROTATION (anti-ruby-throat-dominance) — distribute the 25 entries so the FOCAL hummingbird rotates:
  - ~6 RUBY-THROAT / ANNAS / BROAD-TAILED-FOCAL (classic North American hummingbirds)
  - ~5 IRIDESCENT-VIOLET-FOCAL (Costa / Crowned woodnymph / Violet-crowned / Sparkling violetear)
  - ~5 RUFOUS / ALLENS / BERYLLINE-FOCAL (copper-orange / fiery-orange hummingbirds)
  - ~4 MAGNIFICENT / RIVOLIS / MAGENTA-FOCAL (large magenta-crowned hummingbirds)
  - ~3 SYLPH / RACKET-TAIL / EXOTIC-FOCAL (long-tailed exotic hummingbirds)
  - ~2 BEE-HUMMINGBIRD / BUFF-BELLIED / SMALL-EXOTIC-FOCAL

🚫 STRICT BANS:
  • 🚫 NO single hummingbird — multi-cast (2+) mandatory
  • 🚫 NO other birds (NO songbirds / NO doves / NO parrots / NO birds-of-paradise) — HUMMINGBIRDS specifically
  • 🚫 NO insects (that is flower-friends' territory)
  • 🚫 NO perched-still poses — DYNAMIC poses only (hovering / mid-flight / sipping)
  • 🚫 NO humans / hands / body parts
  • 🚫 NO sci-fi / fantasy / glowing-magical hummingbirds — naturalistic with iridescent plumage

✓ MANDATORY — every entry describes the WHOLE CAST of hummingbirds in one scene with ONE focal hero, all in dynamic poses, all with iridescent jewel-tone plumage explicit.`,
    touchpoints: [
      'RUBY-THROATED-FOCAL CAST — a vivid ruby-throated hummingbird front-and-center hovering at a scarlet trumpet vine with wings in rapid motion-blur and beak inserted drinking nectar, an Anna hummingbird mid-flight in the midground with iridescent magenta crown flashing, a small ruby-throat sipping at another bloom in the bokeh, plus a calliope hovering at the edge of frame',
      'IRIDESCENT-VIOLET COSTAS-FOCAL — a Costa hummingbird front-and-center with iridescent violet crown flaring outward as it hovers at a hot-pink fuchsia, a crowned woodnymph hovering at a deeper bloom in midground, plus a small violet-crowned hummingbird mid-flight in the bokeh, all wings in motion-blur',
      'RUFOUS COPPER-FIRE FOCAL — a vivid copper-orange rufous hummingbird front-and-center hovering with wings in rapid motion-blur at a flame-orange crocosmia, an Allen hummingbird sipping nectar at a trumpet vine in midground, a berylline hummingbird mid-flight in the bokeh, plus a small rufous hovering at the edge',
      'MAGNIFICENT MAGENTA-CROWN FOCAL — a magnificent hummingbird front-and-center with vivid iridescent magenta crown flaring as it hovers at a magenta bee balm with wings in motion-blur, a Rivoli hummingbird hovering at a salvia in midground, plus a small Anna mid-flight in the bokeh banking sideways',
      'LONG-TAILED SYLPH EXOTIC FOCAL — a stunning long-tailed sylph front-and-center with iridescent emerald body and long sapphire tail-streamers trailing as it hovers at a tubular flower, a crowned woodnymph mid-flight in midground, plus a sparkling violetear hovering at the edge of frame',
      'BEE-HUMMINGBIRD TINY-FOCAL CAST — a tiny bee hummingbird front-and-center hovering at a fuchsia bloom with wings in extremely-rapid motion-blur and beak inserted, two Anna hummingbirds at different positions in midground hovering at other blooms, plus a small rufous mid-flight in the bokeh',
      'BROAD-TAILED BUZZ FOCAL — a broad-tailed hummingbird front-and-center with vivid iridescent ruby throat hovering at a scarlet salvia with wings in rapid motion-blur and crisp tail-fan, a calliope hovering at midground, plus a small ruby-throat sipping at another bloom',
      'SPARKLING-VIOLETEAR EXOTIC FOCAL — a sparkling violetear hummingbird front-and-center with iridescent emerald body and brilliant violet ear-patch hovering at a hot-pink fuchsia, a black-chinned hummingbird mid-flight in midground with iridescent purple chin flashing, plus a small Anna at the edge',
      'COSTAS-AND-RUBY DUET FOCAL — a Costa hummingbird front-and-center with iridescent violet crown hovering at a deep-purple butterfly bush, a ruby-throated hummingbird mid-flight in midground banking sideways toward another bloom, plus a small calliope hovering at the edge of frame, all wings in motion-blur',
      'ALLENS COPPER-FLASH FOCAL — an Allen hummingbird front-and-center with vivid copper-orange body and iridescent emerald back hovering at a flame-orange honeysuckle, a rufous hummingbird sipping at another bloom in midground, plus a small berylline hovering at the edge',
      'CROWNED-WOODNYMPH EXOTIC FOCAL — a crowned woodnymph hummingbird front-and-center with iridescent purple crown and emerald body hovering at a tubular bloom with wings in rapid motion-blur, a magnificent hummingbird mid-flight in midground, plus a small bee hummingbird at the edge',
      'ANNAS MAGENTA-CROWN FOCAL — an Anna hummingbird front-and-center with brilliant iridescent magenta-pink crown flaring as it hovers at a magenta bee balm, a Costa hummingbird hovering at midground with violet crown, plus a small broad-tailed mid-flight in the bokeh',
      'BERYLLINE-AND-BUFF FOCAL — a berylline hummingbird front-and-center with iridescent emerald-green body and rufous wings hovering at a vivid jewel-yellow honeysuckle, a buff-bellied hummingbird sipping at another bloom in midground, plus a small Allen mid-flight in the bokeh',
      'CALLIOPE TINY-ROSE FOCAL — a calliope hummingbird front-and-center with distinctive rose-streak throat hovering at a magenta penstemon, an Anna hummingbird mid-flight banking sideways in midground, plus a small ruby-throated hovering at the edge, all wings in rapid motion-blur',
      'BLACK-CHINNED IRIDESCENT-PURPLE FOCAL — a black-chinned hummingbird front-and-center with iridescent purple chin flashing in the light hovering at a sapphire-blue salvia with wings in rapid motion-blur, a Costa hummingbird hovering at another bloom in midground with violet crown, plus a small Anna mid-flight',
      'VIOLET-CROWNED EXOTIC-FOCAL — a violet-crowned hummingbird front-and-center with iridescent violet crown and white underside hovering at a deep-purple butterfly bush, a Costa hummingbird mid-flight banking sideways in midground, plus a sparkling violetear at the edge of frame',
      'RIVOLIS-MAGENTA EXOTIC FOCAL — a Rivoli hummingbird front-and-center with brilliant iridescent magenta crown and emerald body hovering at a vivid red trumpet vine with wings in rapid motion-blur, a magnificent hummingbird hovering at another bloom in midground, plus a small Anna mid-flight',
      'BOOTED RACKET-TAIL EXOTIC FOCAL — a stunning booted racket-tail hummingbird front-and-center with distinctive emerald body and racket-shaped tail-feathers hovering at a tropical bloom, a crowned woodnymph hovering at midground, plus a small bee hummingbird mid-flight in the bokeh',
      'RUFOUS-AND-BERYLLINE COPPER FOCAL — a vivid rufous hummingbird front-and-center with brilliant copper-orange body hovering at a scarlet salvia with wings in rapid motion-blur, a berylline hummingbird sipping at a honeysuckle in midground, plus a small Allen mid-flight in the bokeh',
      'MAGNIFICENT-AND-RIVOLI MAGENTA-DUET — a magnificent hummingbird front-and-center with vivid magenta crown and emerald body hovering at a magenta bee balm, a Rivoli hummingbird mid-flight banking sideways with magenta crown flashing in midground, plus a small Anna hovering at the edge',
      'BUFF-BELLIED BUFF-FOCAL — a buff-bellied hummingbird front-and-center with iridescent emerald back and buff-orange belly hovering at a vivid yellow honeysuckle with wings in motion-blur, a berylline hummingbird at another bloom in midground, plus a small Allen mid-flight in the bokeh',
      'LONG-TAILED-SYLPH SAPPHIRE-TAIL FOCAL — a long-tailed sylph front-and-center with iridescent emerald body and brilliant sapphire-blue long tail-streamers hovering at a tubular bloom, a crowned woodnymph hovering at midground, plus a small black-chinned mid-flight in the bokeh',
      'ANNAS-AND-COSTAS CROWN-DUET — an Anna hummingbird front-and-center with brilliant magenta-pink crown hovering at a fuchsia bloom, a Costa hummingbird mid-flight in midground with violet crown flaring, plus a small ruby-throated hovering at another bloom in the bokeh',
      'CALLIOPE-AND-RUBY-THROAT GARDEN — a calliope hummingbird front-and-center with rose-streak throat hovering at a hot-pink penstemon, a ruby-throated hummingbird sipping nectar at a scarlet trumpet vine in midground, plus a small black-chinned mid-flight in the bokeh, all wings in motion-blur',
      'BERYLLINE-EMERALD-FOCAL EXOTIC — a berylline hummingbird front-and-center with brilliant iridescent emerald-green body and rufous wing-edges hovering at a vivid red bee balm, a buff-bellied hummingbird hovering at another bloom in midground, plus a small Allen mid-flight in the bokeh',
    ],
    instructions: `Each entry is ONE specific HUMMINGBIRD CAST of 2-4+ iridescent hummingbirds, 30-55 words. Format: "CAST NAME / FOCAL-SPECIES CAPS — explicit description of focal hummingbird front-and-center + 1-3 supporting hummingbirds at different positions, all in DYNAMIC poses (hovering / sipping / mid-flight), all with iridescent jewel-tone plumage detail explicit". FOCAL + MULTI-CAST MANDATORY. SPECIES ROTATION — distribute focal across ruby-throat / Anna / Costa / rufous / magnificent / sylph / Allen / berylline / etc. (NOT always ruby-throat). DYNAMIC POSES ONLY — no perched-still. IRIDESCENT JEWEL-TONE PLUMAGE explicit. HUMMINGBIRDS ONLY — NO insects, NO other birds. NO humans / hands. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_humming_birds_magical_particles: {
    format: 'simple',
    theme: `40%-GATED MAGICAL PARTICLES for the BloomBot flower-humming-birds path. Each entry describes ONE specific atmospheric magic-pretty particle effect drifting in the vibrant hummingbird-garden scene — pollen-dust, fairy-light bokeh-orbs, sparkle dust, dewdrops, falling petals, iridescent shimmer, sun-ray streamers. Each entry 20-40 words.

⚠️ MANDATORY — every particle effect AMPLIFIES the vibrant magical-pretty aesthetic. Does NOT compete with the hummingbirds or flowers. Subtle atmospheric magic that supports the jewel-tone vibrance.

🚫 STRICT BANS:
  • NO sci-fi glow / electric / neon / aurora
  • NO scary / dark / ominous particles
  • NO humans / hands / body parts
  • NO additional creatures / insects (separate from hummingbird cast)
  • NO ugly / creepy particles

✓ PARTICLE CATEGORIES:
  A. **POLLEN-DUST** — drifting pollen-motes catching ambient light, golden-yellow drift
  B. **FAIRY-LIGHT BOKEH-ORBS** — soft warm bokeh-orbs floating in the air
  C. **SPARKLE DUST** — tiny iridescent sparkle particles drifting
  D. **DEWDROPS ON PETALS** — fresh dew droplets clinging to petals catching ambient light as prismatic flares
  E. **FALLING PETALS** — soft petals drifting horizontally through the scene
  F. **IRIDESCENT SHIMMER** — soft iridescent shimmer in the air supporting the hummingbird iridescence
  G. **WARM ATMOSPHERIC HAZE** — soft warm haze softening the bokeh background
  H. **SUN-RAY STREAMERS** — soft warm sun-ray streamers slanting through the scene
  I. **NECTAR DROPLETS** — tiny nectar droplets glistening at flower-mouths
  J. **WING-IRIDESCENCE SHIMMER** — subtle iridescent dust around hummingbird wings
  K. **FLOATING LEAVES** — small soft leaves drifting horizontally through the scene`,
    touchpoints: [
      'GOLDEN POLLEN-DUST DRIFT — soft golden-yellow pollen-motes drifting through the air around the hummingbirds and flowers, catching the warm ambient light, atmospheric magical-pretty texture',
      'WARM BOKEH-ORBS FLOATING — soft warm-amber and pink fairy-light bokeh-orbs floating in the air behind the scene, soft out-of-focus magical-pretty atmospheric',
      'IRIDESCENT SPARKLE SHIMMER — tiny iridescent emerald-and-magenta sparkle particles drifting through the air around the scene, subtle magical shimmer catching warm light',
      'DEWDROPS ON PETALS WITH FLARES — fresh dew droplets clinging to the flower petals catching warm ambient light as tiny prismatic flares, naturalistic wet shimmer',
      'PINK PETAL-FALL — soft pink petals drifting horizontally through the scene around the hummingbirds and flowers, gentle motion-blur',
      'IRIDESCENT RAINBOW SHIMMER — soft iridescent rainbow-pearlescent shimmer in the air around the scene supporting the hummingbird iridescence',
      'WARM ATMOSPHERIC HAZE — soft warm-amber atmospheric haze softening the bokeh background, deep dreamy depth, magical-pretty ambient',
      'GOLDEN SUN-RAY STREAMERS — soft warm golden sun-ray streamers slanting gently through the scene from the upper-frame edge, magical-pretty atmospheric',
      'NECTAR DROPLETS GLISTENING — tiny nectar droplets glistening at the mouths of tubular blooms catching warm ambient light, naturalistic magical-pretty',
      'WING-IRIDESCENCE DUST — subtle iridescent emerald-and-violet dust drifting around the hummingbird wings as they hover, supporting the iridescent plumage shimmer',
      'SOFT GREEN LEAVES DRIFT — small soft green leaves drifting horizontally through the scene around the hummingbirds and flowers, gentle motion',
      'AMBER POLLEN-DUST CASCADE — gentle amber-gold pollen-dust cascade drifting downward through the scene around the flowers, warm magical-pretty atmospheric',
      'PRISMATIC DEW-FLARES — fresh dewdrops on every visible petal and leaf catching ambient light as prismatic rainbow flares, naturalistic wet shimmer',
      'WARM-PINK BOKEH-ORBS — soft warm-pink fairy-light bokeh-orbs floating in the deep bokeh background, magical-pretty atmospheric',
      'RED-AND-ORANGE PETAL DRIFT — soft red-and-orange petals drifting horizontally through the scene around the hummingbirds, gentle motion-blur',
      'PEARL-SHEEN MIST — soft pearl-iridescent mist drifting through the deep bokeh background, magical-pretty atmospheric depth',
      'GOLDEN-AMBER POLLEN — golden-amber pollen-dust drifting around the flowers, catching warm light, atmospheric pollinator-magic',
      'SOFT VIOLET-AND-GOLD BOKEH — soft violet and golden bokeh-orbs floating in the bokeh background, magical-pretty atmospheric',
      'FRESH MORNING DEW — fresh morning dewdrops clinging to every petal, leaf, and the hummingbird feathers, catching ambient light as prismatic shimmer',
      'GENTLE GOLDEN HAZE — gentle warm-golden haze wrapping the entire scene, soft pretty golden-hour bath supporting the vibrant flowers',
      'IRIDESCENT WING-TRAIL DUST — fine iridescent emerald wing-trail dust drifting in the air behind the hovering hummingbirds, subtle magic-pretty',
      'WARM PEACH PETAL-FALL — soft peach petals drifting through the air around the hummingbirds and flowers, gentle motion, romantic magical-pretty',
      'SAPPHIRE-AND-GOLD SHIMMER — soft sapphire-and-gold iridescent shimmer in the air around the scene, magical-pretty atmospheric',
      'GLISTENING NECTAR-DROPS — tiny nectar droplets glistening at tubular flower-mouths and beak-tips, catching warm light as prismatic flares, naturalistic magical',
      'WARM CINEMATIC HAZE — warm cinematic atmospheric haze softening every distant element, golden-hour glow infusing the deep distance',
    ],
    instructions: `Each entry is ONE specific MAGICAL PARTICLE effect for the hummingbird path, 20-40 words. Format: "PARTICLE NAME CAPS — primary effect + position in scene + how it catches light / interacts with the ambient". Vary across the 11 categories. NO sci-fi / electric / neon. NO scary / dark. NO humans / hands. NO additional creatures (no insects). Subtle magical-pretty atmospheric only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── flower-fantasy path (2026-05-19) — surreal scale-inversion flower landscapes ───
  bloombot_flower_fantasy_scale_form: {
    format: 'simple',
    theme: `SURREAL SCALE-INVERSION FLOWER-FORM for the BloomBot flower-fantasy path. Each entry describes ONE specific HERO surreal flower-construction or scale-inverted flower-element that dominates a landscape scene. NO animals, NO humans, NO manmade objects, NO waterfalls — natural landscape forms only (trees, mushrooms, hills, mountains, rivers-of-petals, valleys, glades). Each entry 35-65 words.

⚠️ THE BAR: every entry produces a render where (a) the hero is a SURREAL FLOWER-CONSTRUCTION or SCALE-INVERTED FLOWER (e.g., giant flower-mushroom, forest of flower-trees, river of petals replacing water), (b) the form is at LANDSCAPE SCALE (NOT macro close-up), (c) the natural landscape context is clear (forest / valley / meadow / glade / riverbed / hillside / mountainside), (d) the form is CONSTRUCTED FROM FLOWERS or scale is wildly inverted in a way the viewer notices instantly.

⚠️ FORM TYPE VARIETY MANDATE — distribute the 25 entries across these scale-inversion categories (RE-WEIGHTED toward Kevin-favored forests + trees-made-of-flowers):
  • ~7 FOREST OF OVERSIZED-FLOWER-TREES — multiple oversized overgrown flowers acting as forest trees forming a dense forest, NOT a single tree. CRITICAL — diverse tree SILHOUETTES across the forest (NOT just upright spires), pick from:
      • UPRIGHT FLOWER-SPIRES — lupines / hollyhocks / delphiniums / foxgloves / snapdragons / iris-spires grown to 30-60 ft tall, vertical spire-trees
      • SPRAWLING BRANCHY OAK-LIKE FLOWER-TREES — oak-shaped trees with splaying branches all made of flowers, gnarled organic silhouettes
      • WEEPING-CASCADE FLOWER-TREES — willow-shaped trees with cascading branches of flowers hanging down
      • SPINDLY GNARLED FLOWER-TREES — twisted bonsai-like trees with sparse flower-covered branches
      • BROAD-CANOPY FLOWER-TREES — sycamore / maple-shaped trees with spreading flower-covered branches
      • UMBRELLA-ACACIA FLOWER-TREES — flat-spreading umbrella canopies of flowers
      • TALL SLENDER FLOWER-COLUMNS — cypress / poplar-shaped narrow tall trees with flowers along their length
    Mix multiple silhouettes in the same forest for visual variety. Vary species + biome (alpine / temperate / tropical / forest-edge).
  • ~6 SINGLE TREE MADE OF FLOWERS — one big tree whose trunk and canopy are entirely constructed from hundreds/thousands of small flowers. CRITICAL — diverse tree SILHOUETTES (NOT just round-canopy "muffin-top" trees), pick from:
      • BRANCHY OAK / BANYAN — lots of splaying branches covered in flowers, organic gnarled silhouette
      • WEEPING WILLOW — cascading branches of flowers hanging down to the ground
      • SPINDLY GNARLED BONSAI — twisted, sparse branches with flowers blooming along each branch
      • TALL SLENDER BIRCH / ASPEN — narrow trunk + sparse high-canopy with flowers as leaves
      • UMBRELLA ACACIA — flat-spreading umbrella canopy of flowers
      • CYPRESS / POPLAR — tall narrow column tree with flowers covering its length
      • BAOBAB — thick trunk + sparse top-canopy branches with flowers
      • MAPLE / SYCAMORE — broad spreading branches with abundant flower-leaves
      • CHERRY-BLOSSOM — graceful spreading branches with cascading flower-clusters
      • DRAGON BLOOD / MULTI-BRANCH — gnarled multi-fork branch structure with flowers on every branch
    The trunk + branches + canopy are ALL made of flowers. AVOID always defaulting to "round ball canopy on trunk" — vary the tree silhouette wildly.
  • ~5 GIANT FLOWER-MUSHROOMS — single mushroom-shaped flower-construction (cap = dense bloom-mass, stem = stacked flowers cascading) standing alone in a meadow
  • ~3 PINE-TREES-OF-FLOWERS — conifer-shaped trees whose needles are entirely tiny flowers (lavender-pine / cosmos-pine / wisteria-pine)
  • ~2 RIVER OF PETALS — a winding river through a glade where the "water" is REPLACED by flowing petals — the river is ENTIRELY petals from edge to edge, NO water visible anywhere (no blue water / no liquid surface / no splash / no spray — only flowing petals)
  • ~1 HILLSIDE / MOUNTAIN OF FLOWERS — rolling hills or mountains where the entire mass is made of flowers or carpeted dense bloom-mass at impossibly steep slopes
  • ~1 EXTRA OVERSIZED-FLOWER form — a single massive flower (peony / dahlia / hibiscus / sunflower / iris) scaled to landscape-form size — 50-80 ft tall — standing alone in a meadow as the surreal hero (NOT a tree-of-flowers; it's literally one giant individual flower scaled to tree-size).

🚫 WATERFALL OF FLOWERS — REMOVED. Flux consistently renders waterfall entries as water-waterfalls (with white water spray) regardless of "petals replace water" mandate. DO NOT generate any waterfall entries in this pool.

⚠️ INDIVIDUAL-FLOWER VISIBILITY MANDATE (CRITICAL — avoids "colored-leaves" trap):
The trees / mushrooms / forms must look like they are COVERED IN HUNDREDS OF INDIVIDUAL VISIBLE FLOWERS, not like trees with monochrome colored leaves. Every entry MUST explicitly state:
  - "hundreds of individual visible [species] blooms cover every branch / every needle / every surface"
  - "each [species] flower is clearly visible and distinct — NOT a monochrome canopy of colored leaves"
  - "the tree silhouette is made of countless distinct individual flower-heads, with each bloom showing recognizable petals + center + form"

🚫 NEVER describe flowers as "colored leaves / colored foliage / colored canopy / red-leaved tree / pink-leaved tree" — that triggers Flux to render colored monochrome leaves, NOT visible flowers.
🚫 NEVER describe pine-trees-of-flowers as "needles colored pink" or "yellow-needled pine" — describe them as "EVERY needle is a tiny individual visible cosmos / lavender / wisteria flower, you can see the distinct flower-shape of each one."
🚫 NEVER let the canopy read as a solid wash of color — the canopy should be a DENSE MASS OF DISTINCT INDIVIDUAL BLOOMS where you can count many separate flowers.

✓ MANDATORY language patterns: "covered in countless individual cherry-blossoms — each blossom distinct and recognizable" / "every branch dense with hundreds of visible cosmos flowers" / "trunk built from densely stacked individual daisies — each daisy clearly visible" / "needles are entirely individual tiny lavender florets — each floret visibly recognizable as a lavender bloom."

⚠️ CONSTRUCTION DETAIL MANDATE — every entry MUST explicitly describe HOW the flower-construction looks. Examples:
  • "giant flower-mushroom 40 feet tall — cap made of densely packed coral peony blooms forming the rounded dome silhouette, stem made of cascading pale-pink roses spiraling down the column"
  • "forest where every tree is a giant lupine 50 feet tall — purple-and-white floret-spires towering up like pine trees, with thousands of individual lupine flowers stacked along each spire"
  • "single oak-shaped tree 60 feet tall — trunk made of densely stacked stems of small white daisies, canopy made of thousands of small white daisies forming the leafy oak silhouette"
  • "single weeping-willow-shaped tree — cascading branches made entirely of strands of pale-lavender wisteria blooms, trunk made of stacked violet phlox"
  • "single cherry-blossom-shaped tree — trunk made of hundreds of densely stacked pink cherry-blossoms, canopy made of thousands more cherry-blossoms forming the leafy mass"

⚠️ PETAL-RIVER — STRICT NO-WATER MANDATE:
For RIVER OF PETALS entries: the river is ENTIRELY petals from bank to bank, NO water visible anywhere. NEVER describe "water," "blue water," "liquid surface," "rippling water," "stream of water," "splashing water," "water surface" — ONLY describe flowing petals. The river-bed has flowing petals where water would be. The viewer must see "river" silhouette but "petals all the way through" — no water on the surface.

🚫 STRICT BANS:
  • 🚫 NO ANIMALS in any form — no flower-deer, flower-rabbit, flower-fox, flower-bear, NO wildlife of any kind (no real animals either)
  • 🚫 NO HUMANS / faces / figures / silhouettes / hands
  • 🚫 NO MANMADE OBJECTS — no flower-houses, flower-arches, flower-cathedrals, flower-clocks, flower-vases, flower-vehicles, NO buildings of any kind
  • 🚫 NO macro / extreme closeup — landscape scale needed
  • 🚫 NO single-bloom-without-supporting-meadow — the supporting floor-carpet is mandatory (described in separate axis)
  • 🚫 NO interior / urban / ruins
  • 🚫 NO sci-fi / cyberpunk / electric / neon

✓ NATURAL LANDSCAPE CONTEXT — the hero form lives in a recognizable natural landscape (forest / valley / meadow / glade / hillside / riverbed / mountainside). The landscape grounds the surreal-magical-realism.

✓ MOOD — surreal-magical-realism, dreamy, naturalistic-but-impossible. Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape.`,
    touchpoints: [
      'GIANT PINK FLOWER-MUSHROOM — 40-foot tall flower-mushroom standing alone in a pastel meadow, cap made of densely packed coral peony and pink rose blooms forming the rounded dome silhouette, stem made of cascading pale-pink roses spiraling down the column, surreal-magical-realism register',
      'WHITE PEONY MUSHROOM FOREST — three giant flower-mushrooms 30-50 feet tall scattered across a misty meadow, caps made of dense ivory peony blooms, stems made of cascading pale-cream roses, smaller flower-mushrooms hazy in the distance',
      'CORAL DAHLIA MUSHROOM — single oversized flower-mushroom 35 feet tall in a pastel valley glade, cap made of densely packed coral and peach dahlia blooms forming the rounded silhouette, stem made of stacked cream peonies, dreamy soft misty light',
      'GIANT FUCHSIA-BLOOM MUSHROOM — surreal 40-foot flower-mushroom in a pastel meadow, cap made of dense hot-pink fuchsia bells cascading downward to form the dome, stem made of stacked magenta roses, soft surreal-magical-realism light',
      'LAVENDER PHLOX MUSHROOM CLUSTER — five flower-mushrooms 20-35 feet tall clustered across a misty meadow, caps made of dense pale-lavender phlox blooms forming dome silhouettes, stems of stacked pale-lilac sweet-peas, dreamy haze',
      'LUPINE-TREE FOREST — surreal forest where every tree is a 50-foot tall oversized lupine, towering purple-and-white floret-spires standing like pine trees, thousands of individual lupine florets stacked along each spire, supporting meadow carpet below',
      'HOLLYHOCK-TREE FOREST — surreal forest of oversized hollyhocks grown to 45-foot trees, towering spires of pink-and-coral hollyhock blooms stacked up the trunks, smaller hollyhock-trees hazy in distance, dreamy meadow forest setting',
      'SUNFLOWER-TREE FOREST — towering 60-foot oversized sunflowers as forest trees, massive disc-heads facing the sun at tree-canopy level, golden-yellow ray-petals as canopy foliage, supporting meadow of smaller wildflowers below, surreal scale',
      'DELPHINIUM-TREE FOREST — forest of 50-foot oversized delphiniums as forest trees, towering blue-violet spires of stacked delphinium florets, smaller delphinium-trees fading into misty distance, dreamy pastel light',
      'FOXGLOVE-TREE FOREST — surreal forest of oversized foxgloves grown to 40-foot trees, towering pink-and-white bell-spires acting as forest trunks, dreamy meadow forest with supporting smaller wildflowers below',
      'GIANT CHERRY-BLOSSOM TREE OF FLOWERS — single oversized tree 60 feet tall whose entire trunk is made of hundreds of stacked tiny pink cherry-blossoms, and canopy spreading wide with thousands more cherry-blossoms forming the leafy mass, standing alone in a pastel meadow',
      'OAK TREE OF FLOWERS — single oversized oak-shaped tree where the trunk is made of stacked stems of small white daisies, and canopy is thousands of tiny daisies forming the leafy oak silhouette, surreal-magical-realism meadow setting',
      'WILLOW TREE OF FLOWERS — single weeping-willow-shaped tree whose cascading branches are entirely strands of pale-lavender wisteria blooms, trunk made of stacked violet phlox, smaller wisteria-willows in misty distance, soft pastel light',
      'RIVER OF PINK-AND-WHITE PETALS — winding river of flowing pink-and-white cherry-blossom petals replacing water through a pastel meadow glade, banks of supporting pale wildflowers on each side, surreal-magical-realism',
      'RIVER OF CORAL ROSE PETALS — winding ribbon of flowing coral-and-blush rose petals replacing water through a forest glade, banks of supporting small wildflowers on each side, dreamy soft pastel light, smaller petal-rivers visible in distance',
      'RIVER OF MULTI-COLOR PETALS — gentle stream of flowing multi-color pastel petals (pink, blue, yellow, white, lavender) through a meadow valley, replacing water, banks of supporting wildflowers, surreal-magical-realism register',
      'HILLSIDE OF DENSE BLOOM-MASS — rolling hills of dense pale-pink and lavender bloom-mass at impossibly steep slopes, every inch of the hillside covered in tightly-packed flowers forming the rolling topography, surreal scale inversion',
      'MOUNTAIN OF TULIP-BLOOMS — distant mountain whose entire mass is constructed from densely packed pastel tulip blooms in pink, yellow, white forming the peaks and slopes, supporting meadow of smaller wildflowers in foreground, surreal-magical-realism',
      'TULIP-MOUNTAIN RANGE — far-off mountain range made of densely packed pastel tulip blooms forming peaks in pink-yellow-white-purple, supporting foreground meadow of smaller wildflowers, dreamy misty haze, surreal scale-inversion',
      'GIANT SINGLE DAHLIA OVERSIZED — a single 60-foot tall coral dahlia standing alone in a meadow, every petal scaled up to landscape size, the entire flower magnified to tree-form scale, supporting carpet of smaller wildflowers below, surreal-magical-realism scale-inversion',
      'GIANT SINGLE PEONY OVERSIZED — a single massive pale-pink peony scaled to landscape size, 70 feet tall standing alone in a glade, every layered petal individually visible at landscape scale, supporting wildflower meadow carpeting the ground below',
      'GIANT SINGLE HIBISCUS OVERSIZED — a single 50-foot vivid hibiscus blossom scaled to landscape size standing alone in a tropical meadow, every petal visible at tree-form scale, stamens like tree-branches, supporting carpet of smaller tropical wildflowers below',
      'LAVENDER-PINE FOREST — surreal forest where every tree is shaped like a tall conifer but the needles are entirely tiny pale-lavender flowers, towering lavender-pines forming the forest canopy, supporting wildflower meadow below, dreamy haze',
      'COSMOS-PINE FOREST — surreal forest of conifer-shaped trees whose needles are entirely tiny pale-pink cosmos blooms, towering cosmos-pines forming the forest, smaller cosmos-pines fading into misty distance, surreal-magical-realism',
      'WISTERIA-PINE FOREST — surreal forest of cascading conifer-shaped trees made entirely of hanging pale-violet wisteria strands, towering wisteria-pines with vines hanging from every branch, soft pastel dreamy light, supporting meadow',
    ],
    instructions: `Each entry is ONE specific SURREAL SCALE-INVERSION FLOWER-FORM, 35-65 words. Format: "FORM NAME CAPS — explicit description of the surreal flower-construction or scale-inverted flower-element + specific flower species making it up + scale + landscape context implied + surreal-magical-realism register". MANDATORY — (a) scale-inversion or flower-construction explicit, (b) specific flower species making up the form, (c) scale at landscape level (NOT macro), (d) natural landscape context. NO animals, NO humans, NO manmade objects. NO macro / closeup. NO floor-carpet description (separate axis). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_fantasy_floor_carpet: {
    format: 'simple',
    theme: `SUPPORTING FLOOR-CARPET MEADOW for the BloomBot flower-fantasy path. Each entry describes ONE specific carpet of smaller wildflowers covering the ground around the hero surreal flower-form. This is the "flowers everywhere" supporting foundation. Each entry 25-45 words.

⚠️ THE BAR: every entry describes a dense MEADOW CARPET of smaller wildflowers covering the foreground/midground ground, mixed species, varied colors, providing the supporting bloom-foundation around the hero surreal flower-form (described in separate axis).

⚠️ FLOOR-CARPET CATEGORIES — distribute across:
  • Soft pastel mixed wildflower meadow (cosmos / daisies / forget-me-nots / phlox / yarrow)
  • Pink-and-cream tone carpet (pink camellias / cream peonies / pale-pink daisies)
  • Multi-color rainbow wildflower carpet
  • Single-species dense carpet (sea of pink poppies / sea of white daisies / sea of pale-blue forget-me-nots)
  • Lavender-and-violet mixed carpet
  • Yellow-and-cream meadow carpet
  • Orange-and-coral wildflower carpet
  • Moss-and-small-flower forest-floor carpet
  • Riverbank wildflower carpet
  • Mountainside wildflower carpet

🚫 STRICT BANS:
  • NO description of the hero scale-form (separate axis)
  • NO animals / humans / manmade objects
  • NO grass-only / leaf-only — must be FLOWERS dominant
  • NO sci-fi / dark / harsh

✓ The carpet supports and grounds the surreal hero form — softens the scene, provides bloom-saturation in the foreground.`,
    touchpoints: [
      'SOFT-PINK-AND-CREAM WILDFLOWER CARPET — dense carpet of pale-pink cosmos + cream daisies + pale-blue forget-me-nots + small white sweet-peas covering the meadow floor in the foreground, mixed species creating soft watercolor texture',
      'PASTEL RAINBOW MEADOW CARPET — dense mixed wildflower meadow carpet of pale-blue cornflowers + soft-lavender asters + pale buttercup daisies + soft-peach ranunculus + delicate pink cosmos + ivory tulips covering the ground in the foreground',
      'SEA OF PINK POPPY-PETALS — dense single-species carpet of pale-pink poppies covering every inch of the foreground meadow floor, soft watercolor pastel register',
      'SOFT-LAVENDER ASTER CARPET — dense carpet of soft-lavender asters + pale-violet phlox + small ivory daisies + delicate pale-lilac sweet-peas covering the ground in the foreground, dreamy pastel meadow',
      'WHITE-DAISY MEADOW CARPET — dense carpet of pure-white daisies + cream chamomile + pale-yellow primrose + soft white sweet-peas covering the foreground meadow floor, fresh ivory tone',
      'BABY-BLUE FORGET-ME-NOT CARPET — dense carpet of pale-blue forget-me-nots + soft baby-blue cornflowers + delicate pale-cream daisies covering the foreground ground, soft watercolor pastel',
      'BUTTERCUP-YELLOW MEADOW CARPET — dense carpet of soft buttercup-yellow daisies + pale-gold ranunculus + cream-yellow primroses + small ivory chamomile covering the ground in foreground',
      'CORAL-AND-PEACH WILDFLOWER CARPET — dense carpet of soft coral ranunculus + pale-peach roses + dusty-orange poppies + delicate cream daisies covering the foreground meadow floor, soft pastel tones',
      'MOSS-AND-PASTEL FOREST-FLOOR CARPET — dense forest-floor carpet of soft green moss + pale-pink trilliums + small white daisies + delicate violet forget-me-nots covering the foreground ground in a dreamy forest setting',
      'RIVERBANK WILDFLOWER CARPET — dense riverbank carpet of pale-pink phlox + soft-blue cornflowers + delicate ivory daisies + small lavender forget-me-nots covering the banks alongside the hero form',
      'MOUNTAINSIDE WILDFLOWER CARPET — dense alpine wildflower carpet of pale-pink alpine asters + soft-lavender heather + delicate cream-yellow buttercups + small white edelweiss covering the steep slope below the hero form',
      'PINK-AND-WHITE PEONY-AND-DAISY CARPET — dense carpet of soft pink peonies + ivory daisies + cream-pink camellias + delicate pale-cream sweet-peas covering the foreground meadow floor',
      'PASTEL-MIXED-COSMOS CARPET — dense carpet of pale-pink cosmos + pale-violet cosmos + white cosmos + soft-yellow daisies covering the meadow ground in the foreground, dreamy watercolor',
      'LAVENDER-AND-CREAM PHLOX CARPET — dense carpet of soft-lavender phlox + cream-yellow yarrow + ivory daisies + delicate pale-lilac sweet-peas covering the foreground ground',
      'MIXED-COLORED TULIP CARPET — dense carpet of mixed pastel tulips (soft-pink + cream + pale-yellow + pale-purple) covering the meadow floor in the foreground around the hero form',
      'SOFT-WHITE CHRYSANTHEMUM CARPET — dense carpet of soft-white chrysanthemums + cream chamomile + pale-yellow daisies + delicate ivory sweet-peas covering the ground in foreground',
      'PALE-PINK CHERRY-BLOSSOM PETAL-CARPET — dense carpet of fallen pale-pink cherry-blossom petals covering the meadow floor in the foreground, plus small white daisies and ivory peonies peeking through',
      'DREAMY MIXED PASTEL CARPET — dense carpet of soft pastel mixed wildflowers (pale blue, pale lavender, pale pink, cream, soft buttercup, pale peach) covering the foreground ground in a dreamy meadow setting',
      'CARPET OF PALE BLUEBELLS — dense carpet of pale-blue bluebells + delicate violet forget-me-nots + soft white daisies + small cream-yellow primroses covering the forest-floor ground',
      'CARPET OF PASTEL ANEMONES — dense carpet of pale-pink anemones + soft-cream anemones + delicate pale-violet anemones + small white daisies covering the foreground meadow ground',
      'CARPET OF PALE-PEACH-AND-WHITE ROSES — dense carpet of soft pale-peach roses + ivory roses + cream sweet-peas + delicate pale-pink daisies covering the foreground meadow floor',
      'GLADE-WILDFLOWER CARPET — dense carpet of soft-mixed glade wildflowers (pale-pink trilliums + cream-yellow buttercups + delicate ivory daisies + small white sweet-peas) in a dreamy forest-glade setting',
      'MEADOW OF MIXED PASTEL ZINNIAS — dense carpet of pastel zinnias (soft-pink + pale-cream + delicate pale-yellow + soft-coral) covering the foreground meadow ground',
      'CARPET OF SOFT-PINK CAMELLIAS — dense carpet of soft-pink camellias + cream-pink peonies + ivory daisies + delicate pale-pink sweet-peas covering the foreground meadow floor',
      'CARPET OF DREAMY MIXED WILDFLOWERS — dense carpet of dreamy mixed wildflowers (pale-blue cornflowers + soft-violet asters + cream daisies + pale-pink cosmos + delicate ivory sweet-peas) covering the foreground meadow ground',
    ],
    instructions: `Each entry is ONE specific FLOOR-CARPET MEADOW description, 25-45 words. Format: "CARPET NAME CAPS — dense carpet of [specific small wildflower species] + [supporting species] covering the foreground meadow ground". MANDATORY — flowers dominant (not grass / leaves), pastel watercolor tones, supporting the hero scale-form (not competing). NO description of hero form. NO animals / humans / manmade. NO sci-fi / dark. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_flower_fantasy_atmospheric_magic: {
    format: 'simple',
    theme: `40%-GATED ATMOSPHERIC MAGIC for the BloomBot flower-fantasy path. Each entry describes ONE specific atmospheric magic-pretty detail amplifying the surreal-magical-realism mood — mist drift / drifting petals / golden-hour rays / dewdrops / fallen petals on water / pollen-dust / dappled sunlight. Each entry 20-40 words.

⚠️ MANDATORY — every effect AMPLIFIES the dreamy surreal-magical-realism mood. Does NOT compete with the hero form.

🚫 STRICT BANS:
  • NO sci-fi / electric / neon / aurora
  • NO scary / dark / ominous
  • NO humans / hands / body parts
  • NO animals / wildlife
  • NO additional flower-forms (separate axis handles hero)

✓ ATMOSPHERIC CATEGORIES:
  A. **MIST DRIFT** — soft pastel mist drifting through the scene, especially in the deep distance
  B. **DRIFTING PETAL-FALL** — petals drifting horizontally through the air around the hero form
  C. **GOLDEN-HOUR RAYS** — soft warm sun-rays slanting through the canopy / forest gaps
  D. **DEWDROPS** — fresh dew clinging to every visible bloom catching ambient light
  E. **FALLEN PETALS ON WATER / PATH** — petals carpeting the ground or floating on a surface
  F. **POLLEN-DUST** — soft pollen-motes drifting through the warm ambient light
  G. **DAPPLED SUNLIGHT** — dappled warm light through a flower-tree canopy onto the ground
  H. **SOFT WARM HAZE** — warm atmospheric haze softening the bokeh background
  I. **PETAL CASCADE** — petals cascading down from the hero form like gentle snow
  J. **BACKLIT FLOWERS** — soft warm backlight catching the hero form from behind`,
    touchpoints: [
      'SOFT PASTEL MIST DRIFT — gentle pastel pink-and-cream mist drifting through the deep-distance background of the scene, smaller flower-forms barely visible through the haze, surreal-magical-realism atmospheric',
      'PINK PETAL-FALL DRIFT — soft pink cherry-blossom petals drifting horizontally through the entire scene around the hero form, gentle motion, dreamy magical-realism atmospheric',
      'GOLDEN-HOUR SUN-RAYS THROUGH CANOPY — soft warm golden sun-rays slanting through the upper-frame canopy of the hero flower-tree-form, dappled warm light on the foreground meadow carpet',
      'FRESH DEWDROPS ON BLOOMS — fresh dew droplets clinging to every visible bloom on the hero form and the carpet, catching warm ambient light as tiny prismatic flares, naturalistic wet shimmer',
      'FALLEN-PETAL FOREGROUND — fallen pale-pink petals carpeting the foreground meadow floor around the hero form, mixed with the wildflower carpet, drifting more petals through the air',
      'GOLDEN POLLEN-DUST — soft golden-yellow pollen-motes drifting through the warm ambient light around the hero form, atmospheric pollinator-magic supporting the surreal-magical-realism',
      'DAPPLED WARM CANOPY LIGHT — dappled warm golden light filtering through the upper canopy of the hero flower-tree-form onto the foreground meadow carpet, soft sunbeam pools',
      'WARM PASTEL ATMOSPHERIC HAZE — soft warm-amber pastel atmospheric haze softening the deep-distance background, smaller flower-forms fading dreamily into the haze',
      'PETAL CASCADE FROM HERO — soft pale-pink petals cascading down from the hero flower-form like gentle snow, drifting gracefully through the air around it',
      'SOFT BACKLIT HERO — soft warm sunset light catching the hero form from behind, creating a warm backlit silhouette with golden-hour ambient',
      'WHITE PETAL-FALL DRIFT — soft white cherry-blossom petals drifting horizontally through the scene around the hero form, gentle slow motion, dreamy soft pastel atmospheric',
      'IRIDESCENT MORNING-DEW — fresh morning dewdrops on every visible bloom catching soft pastel light as iridescent rainbow flares, naturalistic magical wet-shimmer',
      'SOFT MIST IN VALLEY-DEPTH — soft pastel pink-cream mist filling the deep-distance valley behind the hero form, smaller flower-forms barely visible through the haze',
      'GOLDEN-HOUR HAZE ENVELOPING — warm golden-amber haze enveloping the entire scene, soft warm pastel atmospheric bath, smaller flower-forms warmly hazy in distance',
      'COSMOS-PETAL DRIFT — soft pale-pink-and-white cosmos petals drifting through the entire air around the hero form, gentle slow motion, dreamy surreal',
      'CHERRY-BLOSSOM FOREGROUND CARPET — dense carpet of fallen pale-pink cherry-blossom petals covering the foreground meadow floor around the hero form, drifting more petals through the air',
      'DAYBREAK SOFT MIST — soft pearlescent morning mist filling the deep-distance background of the scene, smaller flower-forms fading into the haze, dreamy daybreak atmospheric',
      'DRIFTING POLLEN-AND-PETALS — both golden pollen-motes and soft white-and-pink petals drifting through the warm ambient light around the hero form, dense atmospheric magic-pretty',
      'BACKLIT WARM-AMBER HAZE — soft warm-amber backlight from the upper-frame edge catching the hero form outline, gentle pastel haze softening the bokeh distance',
      'WET-PATH-PETAL REFLECTION — soft wet meadow floor reflecting the bloom-canopy of the hero form above, fallen petals scattered, dreamy soft reflection',
      'PEARL-MORNING-HAZE — pearl-iridescent morning haze softening the deep-distance background, smaller flower-forms warmly silhouetted in the haze',
      'WARM-PINK BOKEH-WASH — soft warm-pink fairy-light bokeh-wash filling the deep-distance background, dreamy magical-realism atmospheric supporting depth',
      'DRIFTING WISTERIA-PETALS — soft pale-violet wisteria petals drifting through the air around the hero form, gentle slow motion, dreamy soft pastel atmospheric',
      'GOLDEN-HOUR SOFT-BATH — warm soft golden-hour ambient light enveloping the entire scene from above, warm pastel atmospheric bath softening every element',
      'PETAL-CARPET-AND-DRIFT — combined fallen-petal carpet covering the foreground floor + drifting petals through the air around the hero form, dense petal-magic-pretty atmospheric',
    ],
    instructions: `Each entry is ONE specific ATMOSPHERIC MAGIC effect, 20-40 words. Format: "EFFECT NAME CAPS — primary detail + position in scene + how it amplifies the surreal-magical-realism mood". Vary across the 10 categories. NO sci-fi / electric / neon. NO scary / dark. NO humans / hands. NO animals. NO additional flower-forms. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── sunset-flowers path (2026-05-19) — sun-backlit flowers against epic landscape + sunset sky ───
  bloombot_sunset_flowers_hero_flower: {
    format: 'simple',
    theme: `STRONGLY SUN-BACKLIT HERO FLOWER for the BloomBot sunset-flowers path. Each entry is ONE specific foreground/midground flower species (or cluster) with PETAL EDGES blazing in strong warm sun-rim-light from the visible sun behind — the whole bloom warm-bathed in pouring golden-hour backlight, naturalistic photography register (NOT internally-glowing bulbs). Each entry 25-50 words.

⚠️ THE BAR: every entry names a flower species + describes the flowers as STRONGLY BACKLIT by the visible sun — petal edges BLAZING with warm rim-light, the whole bloom warm-bathed in golden-amber light pouring from the sun behind. Think National Geographic / IG backlit-hibiscus / National-Park golden-hour magazine-cover — the sun is OBVIOUSLY behind the bloom and the warm light FLOODS THROUGH it.

⚠️ ONE THING TO AVOID — THE "BULB FLOWER" LOOK:
The petals are not internally-lit lamps glowing from inside their own structure. The flowers are STRONGLY backlit by the visible sun behind them. So AVOID this exact phrase: "every petal a tiny lamp / bulb / lantern lit-from-within with bulb-core." Everything else about strong sun-backlight is GOOD.

⚠️ USE THESE STRONG-BACKLIGHT PHRASES:
  • "petal edges blazing with warm sun-rim-light"
  • "the sun pouring its warm light through the bloom"
  • "every petal-edge brilliantly outlined in golden warm-amber rim-glow"
  • "the flower silhouette burning warm against the sun"
  • "strong photographic backlight bathing the bloom in golden warmth"
  • "the warm sun-light pouring through the petals making them glow"
  • "the bloom warm-bathed in pouring sun-light from behind"
  • "pronounced warm rim-light blazing along every petal-edge"
  • "the sun behind floods the petals with warm golden-amber backlight"
  • "every petal outlined in obvious warm rim-glow from the sun behind"

⚠️ FLOWER VARIETY MANDATE — distribute the 25 entries across diverse species:
  • Hibiscus (red / pink / white / yellow / coral) — large tropical bloom
  • Cosmos (blue / pink / white / cobalt) — single delicate petals
  • Cherry blossom (pink / white) — cascading branch cluster
  • Dandelion seed-head (white) — gossamer wispy seed-globe (this one CAN have full backlight glow — that's how dandelions actually photograph)
  • Azalea / Rhododendron (pink / coral / red / fuchsia) — cluster bush blooms
  • Peony (pink / coral / white / cream) — layered petals
  • Sunflower (yellow / gold) — disc + ray-petals
  • Poppy (red / orange / yellow / pink) — papery crepe-petals
  • Tulip (red / pink / white / yellow / purple) — cup-shaped
  • Daisy (white / yellow / pink) — simple round petal-rays
  • Lily (white / pink / orange / yellow) — trumpet bloom
  • Lavender (purple) — spire cluster
  • Bluebell (blue / violet) — bell-cluster
  • Forget-me-not (blue) — tiny cluster
  • Wildflower mixed-meadow cluster — varied wild species
  • Mountain wildflower cluster (alpine) — paintbrush / lupine / aster
  • Magnolia (white / pink) — large petals
  • Rose (pink / red / coral / yellow / white) — layered petals
  • Wisteria cascade (purple / white / pink) — hanging strands
  • Bougainvillea (pink / magenta / coral / orange / white) — papery cluster

🚫 STRICT BANS:
  • 🚫 NO "every petal a tiny lamp/bulb/lantern with lit-from-within bulb-core" — that's the bulb-petal trigger
  • 🚫 NO sci-fi bioluminescent / electric glow
  • 🚫 NO closeup-only macro framing — the flower is foreground/midground, NOT extreme macro
  • 🚫 NO species without explicit color
  • 🚫 NO interior / vase / cut-flower framing — flowers growing in the wild
  • 🚫 NO humans / hands / picking-the-flower

✓ FRAMING — every entry implies a HERO foreground/midground cluster set against a wide landscape behind. The flower is the focal point, the landscape is implied.

✓ STRONG STRONG SUN-BACKLIGHT IS THE WHOLE POINT — the sun is OBVIOUSLY behind the bloom and the warm light POURS THROUGH it. The petals are LIT UP by that backlight. Make it OBVIOUS in every entry.`,
    touchpoints: [
      'RED HIBISCUS STRONGLY BACKLIT — large red hibiscus blossom in foreground, the sun pouring its warm light through the bloom from behind, petal edges blazing with bright warm-amber rim-light, the whole flower warm-bathed in golden backlight, stamens silhouetted, pollen-dust catching the sunset rays',
      'BLUE COSMOS BLAZING BACKLIGHT — single cobalt-blue cosmos in midframe, the sun cresting the horizon behind blazing strong warm-amber rim-light along every petal-edge, the bloom warm-bathed in golden-hour backlight pouring through',
      'PINK CHERRY-BLOSSOM BACKLIT CASCADE — hanging cherry-blossom branch with pink blossoms in foreground, the sun behind blazing strong warm-amber rim-light along every petal-edge, golden-hour light pouring through the cluster, drifting petals catching warm edge-glow',
      'DANDELION SEED-HEAD FULLY BACKLIT — single dandelion seed-globe silhouetted against the low sun, every gossamer seed-strand brilliantly rim-lit warm-gold, the whole sphere a halo of caught warm light pouring from the sun behind',
      'CORAL AZALEA CLUSTER BACKLIT — coral and salmon azalea cluster bush in foreground, the sun behind blazing strong warm-amber rim-light along every petal-edge, golden-hour light pouring through the cluster, warm-amber edge-glow brilliantly outlining every blossom',
      'WHITE PEONY BACKLIT — large white peony with layered petals in foreground, the sun behind pouring warm light through the layered petals, every petal-edge blazing with warm-amber rim-light, the whole bloom warm-bathed in golden backlight',
      'WILDFLOWER MEADOW STRONGLY BACKLIT — mixed pink-orange-yellow wildflower meadow in foreground, the low sun behind blazing strong warm-amber rim-light along every petal-edge and grass-blade, the whole foreground warm-bathed in pouring golden-hour light',
      'YELLOW SUNFLOWER BACKLIT — towering sunflower-head in foreground, the setting sun directly behind pouring warm light through the yellow ray-petals, every petal-edge blazing warm-gold rim-light, disc-center silhouetted dark against the bright backlight',
      'PURPLE LUPINE SPIRE FIELD BACKLIT — purple lupine-spire wildflower field in foreground, the setting sun behind blazing strong warm-amber rim-light along every spire-floret edge, every leaf warm-bathed in pouring golden backlight',
      'PINK BOUGAINVILLEA BACKLIT CASCADE — magenta-pink bougainvillea papery-bract cluster cascading in foreground, the sun behind pouring warm light through the papery bracts, every bract-edge blazing brilliant warm-amber rim-light',
      'WHITE MAGNOLIA BACKLIT — large ivory magnolia blossom in foreground, the setting sun behind blazing strong warm-amber rim-light along every petal-edge, the whole bloom warm-bathed in pouring golden backlight',
      'ALPINE PAINTBRUSH BACKLIT MEADOW — red-and-orange Indian-paintbrush mountain-meadow in foreground, the low sun cresting the ridge behind blazing strong warm-amber rim-light along every paintbrush-bract, the whole meadow warm-bathed in pouring golden backlight',
      'PURPLE WISTERIA STRANDS BACKLIT — cascading violet wisteria-strands in foreground, the setting sun behind blazing strong warm-amber rim-light along every bell-floret edge, golden-hour light pouring through every cluster, warm-amber edge-glow throughout',
      'RED POPPY FIELD BACKLIT — red and orange poppy field in foreground, the setting sun behind pouring warm light through the crepe-thin papery petals, every petal-edge blazing brilliant warm-amber rim-light, the whole field warm-bathed and glowing',
      'WHITE DAISY CLUSTER BACKLIT — white daisies in foreground meadow, the sun behind blazing strong warm-amber rim-light along every petal-edge, yellow disc-centers silhouetted against the bright backlight, simple radiant happiness',
      'BLUEBELL FOREST FLOOR BACKLIT — violet bluebell-cluster forest floor in foreground, the sun bursting through trees behind blazing strong warm-amber rim-light along every bell-bloom edge, golden-hour light pouring through',
      'PINK TULIP FIELD BACKLIT — bright pink tulip-field in foreground, the setting sun behind blazing strong warm-amber rim-light along every cup-petal edge, the whole field warm-bathed in pouring golden backlight',
      'ORANGE TIGER-LILY CLUSTER BACKLIT — orange tiger-lily cluster in foreground, the setting sun behind blazing strong warm-amber rim-light along every petal-edge, freckled stamens silhouetted against pouring golden backlight',
      'PINK ROSE CLUSTER BACKLIT — climbing pink-rose cluster in foreground, the setting sun behind blazing strong warm-amber rim-light along every layered petal-edge, golden-hour light pouring through, dewdrops catching prismatic warm sun-flares',
      'YELLOW DAFFODIL FIELD BACKLIT — bright golden daffodil field in foreground, the setting sun behind pouring warm light through every trumpet-bloom, every petal-edge blazing brilliant warm-amber rim-light, every leaf-blade warm-bathed',
      'FUCHSIA HANGING-BELLS BACKLIT — fuchsia hanging bell-clusters in foreground, the setting sun behind blazing strong warm-amber rim-light along every purple-and-pink bell edge, golden-hour light pouring through every floret',
      'PURPLE LAVENDER FIELD BACKLIT — purple lavender-spire field in foreground, the setting sun behind blazing strong warm-amber rim-light along every spire edge, the whole field warm-bathed in pouring golden backlight',
      'WHITE FORGET-ME-NOT CARPET BACKLIT — pale-blue forget-me-not carpet in foreground, the low sun behind blazing warm-amber rim-light along every tiny floret edge, the whole carpet warm-bathed in pouring golden backlight',
      'CORAL CAMELLIA BLOSSOMS BACKLIT — coral camellia blossoms in foreground, the setting sun behind blazing strong warm-amber rim-light along every layered petal-edge, the whole bloom warm-bathed in pouring golden backlight',
      'MIXED-COLOR COSMOS MEADOW BACKLIT — mixed pink-white-cobalt cosmos meadow in foreground, the setting sun behind blazing strong warm-amber rim-light along every single-petal cosmos, the whole meadow warm-bathed in pouring golden backlight',
    ],
    instructions: `Each entry is ONE specific STRONGLY-BACKLIT FLOWER cluster, 25-50 words. Format: "FLOWER NAME COLOR + CLUSTER-TYPE BACKLIT CAPS — explicit description of (a) STRONG WARM SUN-RIM-LIGHT BLAZING along petal edges + (b) THE WHOLE BLOOM WARM-BATHED in pouring golden backlight from the sun behind". COLOR + STRONG-BACKLIGHT MANDATORY per entry. AVOID ONLY: "every petal a tiny lamp/bulb/lantern from within" (that triggers fake bulb-petals). STRONG sun-backlight where the sun is OBVIOUSLY behind = GOAL. NO closeup macro. NO sci-fi glow. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_sunset_flowers_landscape_backdrop: {
    format: 'simple',
    theme: `EPIC LANDSCAPE BACKDROP for the BloomBot sunset-flowers path. Each entry is ONE specific WIDE GORGEOUS NATURAL LANDSCAPE that recedes behind the hero flowers — mountains / hills / forest / lake / coast / valley / meadow / canyon. Multi-tier depth implied. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where the LANDSCAPE BEHIND is GRAND, DEEP, BEAUTIFUL — mountains receding to atmospheric haze, hills rolling to horizon, forest spanning the midground, lake stretching to far shore, coastal cliffs falling to surf, meadow rolling to ridge. Multi-tier depth: midground terrain + receding distance + horizon line. NEVER flat / featureless / closeup.

⚠️ LANDSCAPE VARIETY MANDATE — distribute the 25 entries across these categories (~2-3 per category):
  A. **ALPINE MOUNTAIN RIDGE** — jagged peaks against sunset sky, snow-capped distant peaks, alpine valley with surrounding peaks
  B. **ROLLING HILLS / DOWNLAND** — chalk downs receding to blue distance, patchwork-quilt farm hills, Tuscan-style hill rows
  C. **FOREST EDGE / CONIFER STAND** — pine-forest meadow edge, redwood grove at distance, oak-forest hillside
  D. **LAKE / RESERVOIR** — alpine lake reflecting the sunset, calm lake with mountain backdrop, mirror-still lake at twilight
  E. **COASTAL CLIFFS / SEASIDE** — sea-cliff promontory with surf below, coastal headland against the ocean, dune-meadow above beach
  F. **VALLEY / CANYON** — wide alpine valley with stream, canyon walls glowing in sunset, river-valley spreading below
  G. **MEADOW SPREADING TO RIDGE** — wildflower meadow with mountain ridge in distance, grass-meadow spreading to forest line
  H. **DESERT / BADLANDS** — desert mesa-and-canyon in sunset, badlands hoodoos glowing at golden hour, painted-desert spreading
  I. **MOORLAND / HEATHLAND** — heather moorland with low rolling distance, Scottish glen at sunset
  J. **VOLCANIC / GEOTHERMAL** — volcanic crater rim, caldera lake, lava-field meadow at sunset
  K. **TROPICAL ISLAND / ARCHIPELAGO** — distant island silhouette across calm sea at sunset
  L. **TUNDRA / ARCTIC** — northern tundra spreading to low ridge, midnight-sun meadow

🚫 STRICT BANS:
  • NO urban / city / village / streets / cobblestone
  • NO interior / room / cozy
  • NO ruins / abandoned structures
  • NO humans / pedestrians / figures
  • NO closeup macro — the landscape must SPAN BEHIND
  • NO flat featureless backdrop — multi-tier depth mandatory
  • NO archways / tunnels — the foreground is OPEN, the landscape SPANS

✓ MANDATORY — every entry implies depth tiers: foreground (where the hero flower will go) + midground (terrain features) + receding distance (atmospheric haze, distant horizon).

Lineage to channel: National Geographic golden-hour landscape photography + Ansel Adams scale + Roger Deakins location work + IG-magical-hour landscape feeds.`,
    touchpoints: [
      'ALPINE PEAK RIDGE AT SUNSET — jagged snow-capped alpine peak ridge spanning the midground-to-background, atmospheric haze in the deep valleys between ridges, forested foothills below at midground, the sunset glowing behind the highest peaks',
      'ROLLING TUSCAN HILLS — patchwork rolling Tuscan-style hills with cypress-rows receding to the deep distance, golden meadow midground, blue-haze horizon at sunset',
      'PINE-FOREST MEADOW EDGE — wide pine-forest line at midground edge, the forest spanning back into deep distance with atmospheric haze, grass-meadow opening at the foreground, mountains rising behind the forest line',
      'CALM ALPINE LAKE — mirror-still alpine lake at midground stretching toward distant mountain backdrop, lake reflecting the sunset sky perfectly, pine-trees framing the lake-shore, snow-capped peaks rising behind',
      'COASTAL CLIFF PROMONTORY — sea-cliff promontory falling to crashing surf below, the ocean spreading to a calm sunset horizon, distant headlands silhouetted in atmospheric haze',
      'WIDE ALPINE VALLEY WITH STREAM — wide green alpine valley with a silver stream winding through the midground, towering snow-capped mountains rising on both sides, the valley opening toward the deep distance',
      'WILDFLOWER MEADOW + MOUNTAIN RIDGE — wide wildflower meadow rolling toward a distant mountain ridge at sunset, midground forest line breaking the meadow-to-mountain transition, sky filling the upper frame',
      'DESERT MESA-AND-CANYON — wide desert spread with mesas and canyon walls receding to deep distance, badlands hoodoos catching the golden-hour light, the sky glowing at the horizon',
      'HEATHER MOORLAND GLEN — heather moorland spreading toward a distant Scottish glen, low rolling hills with patches of purple heather, atmospheric haze in the deep distance, sunset over the far ridge',
      'VOLCANIC CRATER RIM — wide volcanic crater rim with caldera lake visible below at midground, snow-capped volcanic peak rising in the deep distance, sunset glow filling the basin',
      'TROPICAL ISLAND ARCHIPELAGO — distant tropical island silhouettes scattered across a calm sunset sea, palm-fringed beach at midground, sunset glow on the water spanning to the islands',
      'NORTHERN TUNDRA — northern tundra spreading toward a low ridge at midground, midnight-sun glow filling the sky, distant mountains in deep haze',
      'REDWOOD GROVE EDGE — wide grass-meadow at foreground opening to towering redwood grove edge at midground, the grove spanning back into deep distance with atmospheric haze, sunset light filtering through trunks',
      'WIDE LAVENDER VALLEY — wide Provençal lavender valley with rows receding to the deep distance, low rolling hills with farmhouse silhouettes at midground, sunset sky filling the upper frame',
      'OCEAN CLIFF + DISTANT ISLAND — ocean cliff falling to surf below with a distant island silhouetted on the horizon, the calm sea stretching between, golden-hour sun on the water',
      'PRAIRIE GRASSLAND + RIDGE — wide prairie grassland spreading toward a distant low ridge, scattered cottonwood trees at midground, golden-hour light raking across the grasses',
      'MOUNTAIN LAKE WITH DOUBLE-PEAK — mountain lake at midground reflecting a double-peak mountain backdrop, conifer forest framing the lake-shore, sunset glowing between the peaks',
      'FJORD CLIFF WITH WATERFALL — towering fjord cliff at midground with a thin waterfall ribboning down, dark water below stretching to a distant fjord-mouth, atmospheric haze',
      'SAVANNA WITH ACACIA TREES — wide African savanna with scattered acacia tree silhouettes at midground, golden-hour light raking across the grass, distant mountains in deep haze',
      'CANYON RIM AT SUNSET — wide canyon rim at midground with the canyon falling into deep shadow, distant canyon walls glowing in golden-hour light, sky filling the upper frame',
      'CORNFIELD + STORM-CLOUD DISTANCE — wide cornfield spreading toward a distant horizon, dramatic storm-clouds catching the sunset in the deep distance, atmospheric depth',
      'FOREST CLEARING + MOUNTAIN — large forest clearing opening toward a distant mountain, the surrounding forest framing the view, sunset glowing between the trees',
      'COASTAL DUNE-MEADOW — wide coastal dune-meadow at midground spreading toward an ocean horizon, distant sea catching the sunset light, dune-grass swaying',
      'TERRACED HILLSIDE FARMLAND — terraced agricultural hillside receding into the deep distance, every terrace catching warm-gold sunset light, distant mountain ridge in the haze',
      'GLACIAL VALLEY MORAINE — glacial valley with moraine boulders at midground, retreating glacier visible in the deep distance, snow-capped peaks rising above, golden-hour light',
    ],
    instructions: `Each entry is ONE specific EPIC LANDSCAPE BACKDROP, 30-55 words. Format: "LANDSCAPE NAME CAPS — explicit description of multi-tier landscape with midground feature + receding distance + atmospheric depth, implied foreground for the hero flowers". MANDATORY — multi-tier depth. NO closeup / macro. NO urban / interior / ruins / archways / humans. The landscape SPANS BEHIND the hero flower. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_sunset_flowers_sunset_sky: {
    format: 'simple',
    theme: `PRETTY SOFT GOLDEN-HOUR / SUNSET SKY for the BloomBot sunset-flowers path. Each entry describes ONE specific SOFT and PRETTY golden-hour / sunset sky — warm naturalistic tones in the upper 30-45% of the frame. The sky SUPPORTS the flowers, NOT competes with them. Think pretty hiking golden-hour photograph / IG nature-feed soft-sunset / the 30-60 minutes before actual sundown when the light is just right. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a sky that feels SOFT, PRETTY, NATURALISTIC — like an actual golden-hour photograph. Warm gentle light, not burning fire. Pretty atmospheric clouds, not boiling drama. The sky is the WARM LIGHT SOURCE that bathes the flowers in glow, not a competition-grade scroll-stopper.

⚠️ VARIETY MANDATE — distribute the 25 entries across these SOFT GOLDEN-HOUR REGISTERS:
  • ~5 SOFT WARM AMBER — pale warm amber sky with gentle cumulus catching the warm light
  • ~5 SOFT PINK-AND-PEACH — pretty pink-and-peach pastel sky with gentle clouds
  • ~4 GOLDEN-CREAM — golden-cream warm sky with soft cirrus
  • ~3 PALE-LAVENDER-AND-PEACH — soft lavender-and-peach twilight transition
  • ~3 CORAL-WITH-WARM-CIRRUS — gentle coral cirrus streaks across pale warm sky
  • ~3 HAZY GOLDEN-HOUR — atmospheric warm-amber haze softening the sky
  • ~2 SOFT PALE PINK AFTERGLOW — pale pink afterglow with very gentle clouds

⚠️ EVERY entry MUST include:
  - SPECIFIC CLOUD-FORMATION (gentle cumulus / soft cirrus / scattered wisps / hazy stratus) — naturalistic, NOT painterly-boiling-drama
  - WARM-BUT-SOFT COLOR — specific soft words like "warm amber," "soft pink," "peach," "coral," "pale lavender," "golden cream," "warm haze"
  - THE FLOWERS-AS-HERO IMPLICATION — the sky is the warm light that makes the flowers glow, NOT a hero in its own right
  - SOMETIMES (~30%): hazy / atmospheric / soft warm bath wrapping the whole scene
  - SOMETIMES (~20%): gentle warm rays visible (subtle, not blazing god-rays)

🚫 STRICT BANS:
  • 🚫 NO fiery / burning / blood-red / apocalyptic / intense / cinematic-drama
  • 🚫 NO hot-pink / magenta / vivid-saturated — soft pastels only
  • 🚫 NO storm-clouds / boiling / dramatic / heavy / moody
  • 🚫 NO "scroll-stopper" / "competition-grade" / "show-stopper" sky
  • 🚫 NO bold-vivid-saturated-color — soft warm tones only
  • 🚫 NO plain blue / overcast / clear noon — naturalistic golden-hour required
  • 🚫 NO night / stars / moon — golden hour or soft pretty sunset only
  • 🚫 NO sci-fi / fantasy / aurora
  • 🚫 NO ground-level landscape detail — this entry is the SKY only

✓ THIS POOL DESCRIBES THE SKY. The sun-position is a SEPARATE axis. Focus exclusively on (a) cloud-formation type + (b) SOFT WARM golden-hour color.`,
    touchpoints: [
      'SOFT WARM-AMBER WITH GENTLE CUMULUS — upper sky a soft warm-amber gradient with gentle scattered cumulus catching the golden-hour light from below, naturalistic atmospheric pretty-photograph feel',
      'SOFT PINK-AND-PEACH PASTEL — upper sky in soft pink-and-peach pastel tones with gentle cirrus wisps, pretty golden-hour photograph feel, atmospheric warm soft light',
      'GOLDEN-CREAM WITH SOFT CIRRUS — upper sky golden-cream gradient with gentle cirrus streaks high up, warm soft naturalistic golden-hour glow',
      'PALE LAVENDER-AND-PEACH TWILIGHT — upper sky transitioning from soft peach near horizon up to pale lavender at the zenith, gentle stratocumulus catching the warm light, pretty soft twilight',
      'CORAL CIRRUS ON PALE WARM SKY — pale warm sky with gentle coral cirrus wisps streaking across the upper third, soft naturalistic golden-hour, pretty atmospheric',
      'WARM AMBER HAZE — upper sky wrapped in soft warm-amber atmospheric haze, gentle scattered cumulus barely visible through the haze, pretty soft golden-hour bath',
      'SOFT PINK AFTERGLOW — upper sky in pale pink afterglow with very gentle cirrus wisps, atmospheric soft pretty-photograph feel, warm gentle bath',
      'GOLDEN-HOUR AMBER WITH CIRRUS-WISPS — upper sky soft golden-amber with high gentle cirrus wisps catching warm light, naturalistic pretty-photograph register',
      'WARM PEACH WITH SCATTERED CUMULUS — upper sky warm-peach gradient with gentle scattered cumulus catching the soft warm light, naturalistic pretty golden-hour',
      'PALE GOLDEN WITH SOFT HAZE — pale golden sky softened by atmospheric haze, gentle cumulus barely defined through the warm haze, pretty soft photograph feel',
      'SOFT CORAL-AND-CREAM — upper sky soft coral-and-cream gradient with gentle cumulus catching the warm sunset light, naturalistic pretty atmospheric',
      'WARM-AMBER WITH GENTLE WARM RAYS — upper sky soft warm-amber with subtle warm rays radiating gently through the gentle cumulus, NOT blazing god-rays, soft pretty',
      'SOFT PINK-CREAM PASTEL — upper sky pale pink-cream pastel tones with very gentle cirrus, pretty soft golden-hour photograph register',
      'GOLDEN HAZE WITH SOFT WISPS — upper sky bathed in soft golden haze with very gentle cirrus wisps, pretty atmospheric soft warm bath',
      'PEACH-AMBER GRADIENT — upper sky peach-amber gradient softening toward zenith, gentle scattered cumulus catching warm soft light, naturalistic pretty',
      'WARM LAVENDER-PEACH TRANSITION — upper sky soft transition from warm peach near horizon to pale lavender at zenith, gentle scattered clouds, pretty soft twilight',
      'SOFT CREAM WITH GENTLE CIRRUS — upper sky soft cream-and-pale-gold gradient with gentle cirrus catching warm light, naturalistic pretty-photograph register',
      'PALE WARM AMBER — upper sky simply pale warm amber gradient with sparse gentle cirrus wisps, soft naturalistic pretty golden-hour atmospheric',
      'PINK-AND-PEACH WITH SCATTERED CUMULUS — upper sky soft pink-and-peach with scattered gentle cumulus catching warm light from below, pretty atmospheric soft',
      'GOLDEN-CREAM WITH WARM HAZE — upper sky golden-cream gradient softened by warm atmospheric haze, gentle scattered cumulus, pretty soft golden-hour photograph',
      'SOFT CORAL WISPS — upper sky soft pale warm with gentle coral cirrus wisps streaking across the upper third, pretty atmospheric naturalistic',
      'WARM PASTEL PINK — upper sky warm pastel pink gradient with very gentle cumulus, pretty soft afterglow feel, naturalistic atmospheric',
      'AMBER-PEACH GRADIENT — upper sky amber-peach gradient with gentle scattered cumulus catching the warm sunset light, naturalistic pretty soft golden-hour',
      'SOFT GOLDEN WITH ATMOSPHERIC HAZE — upper sky soft golden gradient wrapped in atmospheric warm haze, gentle clouds barely defined, pretty soft photograph register',
      'PALE PINK-CREAM AFTERGLOW — upper sky pale pink-cream afterglow gradient with very gentle cirrus wisps, soft pretty atmospheric after-sunset glow',
    ],
    instructions: `Each entry is ONE specific SOFT GOLDEN-HOUR SKY (gentle clouds + soft warm color), 25-50 words. Format: "SKY NAME + SOFT WARM-COLOR CAPS — explicit description of GENTLE CLOUDS (cumulus / cirrus / stratus / wisps / scattered) + SOFT WARM COLOR (warm amber / soft pink / peach / coral / pale lavender / golden cream / warm haze) + naturalistic pretty-photograph feel". MANDATORY — both cloud-formation AND soft warm color must be explicit. NEVER vivid-saturated / fiery / burning / dramatic. NO sun-disc description (that comes from sun_position). NO ground-level detail. NO plain blue / overcast. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_sunset_flowers_sun_position: {
    format: 'simple',
    theme: `SOFT VISIBLE SUN POSITION for the BloomBot sunset-flowers path. Each entry describes ONE specific position for a SOFT GLOWING sun-disc in the frame — visible and warm but NOT a sharp burning sphere with blazing god-rays. Think naturalistic golden-hour photograph where you can clearly see the sun but it's softened by atmospheric haze. Each entry 20-40 words.

⚠️ THE BAR: every entry produces a render where the SUN-DISC is clearly VISIBLE but SOFTENED — atmospheric haze, gentle warm glow, subtle lens-flare. NOT a tiny pinpoint dot, but ALSO not a blazing sharp blinding sphere. Naturalistic pretty-photograph register.

⚠️ VARIETY MANDATE — distribute the 25 entries across these POSITION CATEGORIES:
  • ~5 sun cresting a mountain ridge — soft disc just rising over the peak
  • ~4 sun setting behind a hill / horizon — soft disc on the horizon line
  • ~3 sun bursting through trees / forest gap — soft disc visible through forest gap
  • ~3 sun sitting low on a flat horizon — soft disc just above flat horizon
  • ~3 sun peeking over a ridge with gentle warm rays
  • ~3 sun reflected on a lake / sea with soft golden reflection-path
  • ~2 sun haloed by atmospheric haze with subtle warm halo
  • ~2 sun setting into a sea / ocean horizon — soft disc touching the water

⚠️ EVERY entry MUST include:
  - SOFT GLOWING SUN-DISC — visible but softened by atmospheric haze (NOT a sharp burning sphere)
  - SPECIFIC POSITION in the frame (cresting / behind / through / on horizon / etc.)
  - SOME of: SUBTLE warm rays radiating gently, soft warm halo, gentle lens-flare, warm glow-aura
  - SOMETIMES (~30%): reflected on water in the foreground/midground

🚫 STRICT BANS:
  • 🚫 NO blazing god-rays / dramatic god-rays / intense god-rays — gentle warm rays only
  • 🚫 NO "fiery" / "burning" / "intense" / "dramatic" / "prominent star-burst lens-flare" — soft and naturalistic only
  • 🚫 NO sharp burning sun sphere — softened by atmospheric haze
  • 🚫 NO tiny pinpoint dot either — visibly present but soft-glowing
  • NO sky color description (that comes from sunset_sky pool)
  • NO ground-level landscape description (that comes from landscape_backdrop)
  • NO multi-sun / sci-fi / alien
  • NO night / moon — this is SUNSET sun specifically

✓ THIS POOL DESCRIBES THE SUN. The sky-color is a SEPARATE axis. Focus on (a) sun-disc position + (b) SOFT WARM glow / subtle warm halo.`,
    touchpoints: [
      'SOFT SUN CRESTING JAGGED PEAK — soft glowing sun-disc just cresting a distant jagged mountain peak, softened by atmospheric haze, gentle warm halo radiating subtly across the surrounding sky',
      'SOFT SUN ON HORIZON — soft warm sun-disc sitting directly on a distant flat horizon line, glowing through atmospheric haze, gentle warm halo around the disc',
      'SOFT SUN THROUGH PINE-CANOPY — soft glowing sun-disc visible through a gap in a distant pine-forest line, gentle warm rays filtering through the trees, atmospheric softness',
      'SOFT SUN LOW ON MEADOW HORIZON — soft warm sun-disc sitting just above a flat meadow horizon, gently glowing through warm atmospheric haze, subtle warm halo',
      'SOFT SUN PEEKING OVER ALPINE RIDGE — soft glowing sun-disc just peeking over a distant alpine ridge, gentle warm rays radiating subtly across the surrounding sky, warm haze',
      'SOFT SUN REFLECTED ON ALPINE LAKE — soft sun-disc sitting low on the lake-horizon with a gentle warm reflection-path on the still water leading to the foreground, atmospheric',
      'SOFT SUN HALOED BY HAZE — soft glowing sun-disc softened by warm atmospheric haze with gentle warm halo radiating outward, naturalistic soft golden-hour',
      'SOFT SUN TOUCHING OCEAN HORIZON — soft warm sun-disc touching the distant ocean horizon, glowing through atmospheric haze, gentle golden reflection-path on the water',
      'SOFT SUN CRESTING SNOW-PEAK — soft glowing sun-disc just cresting a distant snow-capped peak, gentle warm rays radiating subtly, soft warm rim-light on the snow',
      'SOFT SUN THROUGH STORM-GAP — soft glowing sun-disc visible through a gap between gentle clouds, subtle warm rays filtering downward, atmospheric softness',
      'SOFT SUN ABOVE FOREST-LINE — soft glowing sun-disc sitting just above a distant forest-line at the midground, gentle warm halo, atmospheric haze, warm glow-aura',
      'SOFT SUN PEEKING OVER ROLLING HILL — soft glowing sun-disc just peeking over a distant rolling hill, gentle warm rays subtly fanning across the landscape, warm halo',
      'SOFT SUN ON DESERT HORIZON — soft warm sun-disc sitting on a flat desert horizon, glowing through atmospheric warm haze, gentle warm halo around the disc',
      'SOFT SUN CRESTING CANYON RIM — soft glowing sun-disc just cresting a distant canyon rim, gentle warm rays subtly fanning across the canyon walls, warm rim-light',
      'SOFT SUN BEHIND CIRRUS — soft glowing sun-disc behind feathery cirrus clouds with gentle warm halo, golden-amber glow-aura subtly surrounding',
      'SOFT SUN REFLECTED ON SEA — soft sun-disc setting toward the distant ocean horizon with a gentle warm reflection-path on the calm sea, atmospheric haze, soft warm halo',
      'SOFT SUN THROUGH AUTUMN-TREES — soft glowing sun-disc visible through a stand of distant autumn-color trees, gentle warm rays filtering through, soft warm halo',
      'SOFT SUN BEHIND DISTANT RIDGE — soft warm sun-disc setting behind a distant ridge silhouette, glowing softly through atmospheric haze, gentle warm halo',
      'SOFT SUN LOW ON PRAIRIE — soft warm sun-disc sitting just above a flat prairie horizon, glowing gently, soft warm rays raking subtly across the grasses, warm halo',
      'SOFT SUN CRESTING WATERFALL TOP — soft glowing sun-disc just cresting the top of a distant waterfall ridge, gentle warm rays subtly fanning across the cliffs, warm halo',
      'SOFT SUN BEHIND SINGLE-CLOUD — soft glowing sun-disc behind a single gentle cloud with subtle warm halo radiating outward, the cloud-edge gently backlit warm-amber',
      'SOFT SUN SETTING INTO LAKE — soft sun-disc sitting low on the lake-horizon, gentle warm reflection-path on the water, soft halo, warm afterglow',
      'SOFT SUN ABOVE ARCTIC RIDGE — soft midnight-sun sun-disc sitting just above the arctic ridge horizon, glowing gently through cool atmospheric haze, soft warm halo',
      'SOFT SUN THROUGH JUNGLE — soft glowing sun-disc visible through a jungle-canopy gap, gentle warm rays filtering down through the tropical foliage, atmospheric',
      'SOFT SUN ON SAVANNA HORIZON — soft warm sun-disc sitting low on the savanna horizon, glowing gently through warm atmospheric haze, soft warm halo, last gentle rays raking',
    ],
    instructions: `Each entry is ONE specific SOFT VISIBLE SUN POSITION, 20-40 words. Format: "SOFT SUN POSITION CAPS — explicit description of the soft sun-disc's position in frame + atmospheric haze softening + GENTLE warm halo or subtle warm rays". MANDATORY — sun-disc is SOFT and SOFTENED BY ATMOSPHERIC HAZE, NOT blazing god-rays. NO "dramatic" / "intense" / "fiery" / "prominent". NO sky-color description. NO ground-level detail. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  bloombot_sunset_flowers_atmospheric_phenomenon: {
    format: 'simple',
    theme: `40%-GATED SUNSET-FLOWERS ATMOSPHERIC PHENOMENA — extra magic moments supporting the sun-backlit-flower aesthetic. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the sunset-flower aesthetic. Does NOT compete with the hero flower or the sun.

🚫 STRICT BANS:
  • NO sci-fi glow / bioluminescent / will-o-wisps / fairy-dust / electric-cyan
  • NO actual lamps / lanterns / candles / electric-lights
  • 🚫🚫🚫 ABSOLUTE HARD BAN ON HUMANS — no people / figures / silhouettes / pedestrians ANYWHERE 🚫🚫🚫
  • NO night phenomena (this is sunset, not midnight)

✓ PHENOMENON CATEGORIES:
  A. **DRIFTING PETAL-FALL** — petals drifting through the golden-hour light
  B. **WILDLIFE (NON-HUMAN)** — bee / butterfly / hummingbird / dragonfly / deer / fox / songbird at the flower or in the scene
  C. **GOLDEN-HOUR DUST / POLLEN** — dust-motes / pollen catching sun-rays in air
  D. **LENS-FLARE / GOD-RAYS** — sun-flare bursting from the visible sun
  E. **MIST / FOG DRIFT** — soft mist drifting in valley / clinging to hills
  F. **WET ELEMENTS** — dew on petals / fresh rain droplets / mist on grass
  G. **DISTANT WILDLIFE** — flock of birds / single deer silhouette / cattle on hillside
  H. **REFLECTION** — flowers reflected in dewdrop / lake / wet rock
  I. **BREEZE-MOTION** — gentle wind moving the flowers / grass-blades swaying
  J. **DRIFTING SEEDS / SPORES** — dandelion-seed drift / pollen-cloud / cottonwood fluff
  K. **DISTANT WATER** — distant waterfall / stream / river catching sunset light
  L. **MIST IN VALLEY** — soft mist filling the valley below
  M. **CLOUD-SHADOW** — cloud-shadow moving across the landscape`,
    touchpoints: [
      'CHERRY-BLOSSOM PETAL-FALL — soft pink cherry-blossom petals drifting through the golden-hour light around the hero flowers, every petal rim-lit gold by the visible sun',
      'BUMBLEBEE AT HERO FLOWER — single bumblebee hovering at the hero flower cluster in foreground, sun-backlit body glowing golden, fuzzy outline catching warm rim-light',
      'POLLEN-DUST IN GOLDEN RAYS — pollen-dust and gentle dust-motes drifting through the golden-hour rays around the hero flowers, every particle catching warm sunset light',
      'PROMINENT LENS-FLARE — prominent lens-flare star-burst radiating from the visible sun-disc, hex-flare ghosts scattered across the frame, atmospheric warm haze',
      'SOFT VALLEY MIST — soft golden-hour mist drifting in the deep valley behind the hero flowers, mist catching warm sunset light, atmospheric depth',
      'DEW ON HERO PETALS — fresh dew droplets clinging to the hero flower petals, every droplet catching the setting sun as tiny prismatic flares, golden-hour wet shimmer',
      'FLOCK OF DISTANT BIRDS — flock of small distant birds silhouetted against the sunset sky in the upper frame, motion-blur on their wings, golden-hour silhouettes',
      'FLOWERS REFLECTED IN DEW — single large dewdrop on a leaf reflecting the hero flowers and the sun behind them upside-down, prismatic golden flare',
      'GENTLE BREEZE-MOTION — gentle breeze moving the hero flowers, motion-blur on the petals, grass-blades around the flowers leaning with the wind',
      'DANDELION-SEED DRIFT — drifting dandelion-seeds and gossamer fluff floating through the golden-hour light around the hero flowers, every seed rim-lit warm-gold',
      'DISTANT WATERFALL — distant waterfall ribbon falling between mountain ridges in the deep background, catching sunset light, atmospheric haze',
      'CLOUD-SHADOW SWEEPING — large cloud-shadow sweeping across the midground landscape, contrast between shadowed terrain and warm-lit hero flowers',
      'HUMMINGBIRD AT FLOWER — single iridescent hummingbird hovering at the hero flower, wings a motion-blur of jewel-color catching the sunset rim-light',
      'GOLDEN-HOUR HAZE — atmospheric golden-hour haze softening the deep landscape, every distant element wrapped in warm soft-focus glow',
      'BUTTERFLY DRIFTING — single Monarch butterfly drifting through the foreground near the hero flower, sun-backlit wings glowing translucent orange-amber',
      'GRASS-BLADES BACKLIT — every grass-blade around the hero flower backlit by the setting sun, glowing translucent green-gold, sea of caught light',
      'DRAGONFLY HOVERING — single iridescent dragonfly hovering near the hero flower, transparent wings catching sun-rim-light as prismatic flares',
      'COTTONWOOD FLUFF DRIFT — cottonwood-fluff drifting through the air around the hero flowers, every fluff-cluster catching warm sunset light',
      'DISTANT DEER ON RIDGE — single distant deer or stag silhouette on a midground ridge behind the hero flowers, golden-hour rim-light on the silhouette',
      'STORM-CLOUD ON HORIZON — dramatic storm-cloud building on the horizon catching last sunset light, contrast between bright sunset foreground and dark distant storm',
      'WIDE PETAL-FALL — wide soft petal-fall drifting horizontally through the entire scene, every petal catching warm sunset light',
      'BIRDS BURSTING FROM TREE — small flock of songbirds bursting from a midground tree silhouette, motion-blur against the sunset sky',
      'WARM ATMOSPHERIC HAZE — warm atmospheric haze softening every distant mountain ridge, golden-hour glow infusing the entire deep distance',
      'SOFT RAINBOW IN HAZE — soft pastel rainbow arcing across the deep distance after rain, hero flowers in golden-hour light in foreground',
      'CRICKET-MEADOW STILLNESS — implied evening cricket-stillness in the meadow, gentle breeze motion on the hero flowers, atmospheric quiet golden-hour',
    ],
    instructions: `Each entry is ONE specific SUNSET-FLOWERS atmospheric magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in scene + light/sensory detail". Vary across the 13 categories. NO sci-fi glow. NO actual lamps. NO night phenomena. ABSOLUTE HARD BAN ON HUMANS — no people / no figures / no silhouettes / no pedestrians anywhere (wildlife OK). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: ruin_type (abandoned structure being reclaimed) ───
  bloombot_reclaim_ruin_type: {
    format: 'simple',
    theme: `ABANDONED-STRUCTURE RECLAIM SETTINGS for the BloomBot reclaim path. Each entry is ONE specific historic / ancient ABANDONED HUMAN STRUCTURE in deep disrepair, being consumed by flowers. Mood is AWE + MELANCHOLY + TRIUMPHANT NATURE — NEVER horror. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a RECOGNIZABLE abandoned structure (the viewer instantly knows what it WAS) in deep disrepair. NEVER ominous / spooky / horror — the mood is reverent / awe-struck / nature-has-won-in-beauty.

🚫 STRICT BANS:
  • NO modern / corporate / sleek buildings
  • NO ominous / spooky / haunted / horror / dark-fantasy vocabulary
  • NO active / inhabited buildings (these are ABANDONED)
  • NO conservatory glass-and-iron (conservatory)
  • NO living cities (city-flowers)
  • NO interiors that aren't ruined (cozy)
  • NO landscapes without architecture (landscape)
  • NO archways/passages as the FRAMING (garden-walk) — but ruin-archways as the SCENE are FINE
  • NO surreal / impossible
  • NO humans / ghosts / hooded figures

✓ RUIN-TYPE CATEGORIES:
  A. **CLASSICAL TEMPLE / TEMPLE-RUIN** — Greek temple half-collapsed / Roman temple / Egyptian colonnade
  B. **CATHEDRAL / ABBEY** — half-sunken Gothic cathedral / abandoned abbey / roofless chapel
  C. **MAYAN / KHMER / ANGKOR** — Mayan pyramid cracked open / Angkor temple / Khmer jungle temple
  D. **CASTLE / FORTRESS** — moss-covered castle ruin / abandoned tower / collapsed keep
  E. **GREENHOUSE / CONSERVATORY (rusted)** — rusted abandoned greenhouse with broken panes / collapsed Victorian glasshouse
  F. **LIBRARY / SCHOOL** — forgotten library with collapsed walls / abandoned schoolhouse with overgrown desks
  G. **AMUSEMENT / CARNIVAL** — abandoned amusement-park carousel / overgrown ferris-wheel / abandoned theatre
  H. **MARITIME** — wrecked ocean liner on a beach / shipwreck on rocks / abandoned lighthouse on a cliff
  I. **INDUSTRIAL** — abandoned factory / overgrown train station / Soviet-era industrial complex / abandoned bridge
  J. **AQUEDUCT / INFRASTRUCTURE** — Roman aqueduct / abandoned viaduct / overgrown stone bridge
  K. **PALACE / MANSION** — abandoned palace / forgotten mansion / overgrown stately home
  L. **AMPHITHEATRE / COLISEUM** — overgrown Roman amphitheatre / abandoned Greek theatre
  M. **VILLAGE / TOWN** — abandoned medieval village / overgrown stone-village / forgotten hamlet
  N. **WATCHTOWER / OBSERVATORY** — abandoned watchtower / overgrown observatory / forgotten beacon
  O. **MILL / WINDMILL** — abandoned stone mill / overgrown windmill / forgotten gristmill

Lineage to channel: Studio Ghibli "Castle in the Sky" reveal + Ta Prohm jungle temple (Angkor) + Pripyat Chernobyl reclamation (without the disaster mood) + Greek archaeological-photography + Roman ruin paintings by Piranesi + cottagecore-meets-ruin Pinterest boards.`,
    touchpoints: [
      'GREEK MARBLE TEMPLE HALF-COLLAPSED — half-collapsed Greek marble temple with three columns still standing and the pediment broken, climbing-rose vines consuming the columns, fallen drum-segments scattered in a bloom-meadow',
      'ANGKOR-STYLE JUNGLE TEMPLE — Angkor-style stone temple with massive strangler-fig roots embracing the carved-stone walls, climbing-bloom vines softening the apsara-carvings, sunlight streaming through cracked tower-roof',
      'MAYAN PYRAMID CRACKED OPEN — Mayan stepped-pyramid with one wall collapsed showing the interior, climbing-bloom vines spilling from the crack, jungle-mass at the base, sun-shafts through the opening',
      'HALF-SUNKEN GOTHIC CATHEDRAL — Gothic cathedral with the roof collapsed and the eastern wall fallen, climbing-bloom vines wrapping the remaining columns and arches, sky visible through the open roof',
      'RUSTED ABANDONED GREENHOUSE — Victorian-era greenhouse with rusted iron framework, many glass panes shattered or missing, bloom-mass having consumed the interior and spilled out through the broken panes',
      'FORGOTTEN LIBRARY WITH COLLAPSED WALLS — forgotten library with two walls collapsed, books still on the shelves visible through bloom-cascades, fallen books on the floor, climbing-vines on the remaining shelves',
      'ABANDONED CAROUSEL — abandoned amusement-park carousel with the horses still on it but rust-streaked, the canopy fabric tattered, climbing-bloom vines wrapping every horse, bloom-mass at the base',
      'WRECKED OCEAN LINER ON BEACH — wrecked early-20th-century ocean liner half-sunk in beach-sand, hull rust-streaked and barnacle-encrusted, climbing-bloom vines on the upper decks, dune-grass at the base',
      'ABANDONED LIGHTHOUSE ON CLIFF — abandoned stone lighthouse on a cliff-edge, the upper structure cracked, climbing-bloom vines spiraling up the tower, sea-mist around the base, gulls overhead',
      'ROMAN AQUEDUCT IN BLOOM-MEADOW — section of Roman aqueduct stretching across a sunlit bloom-meadow, several arches collapsed, climbing-bloom vines on the standing arches, sun-shafts through the gaps',
      'MOSS-COVERED CASTLE RUIN — moss-covered medieval castle ruin with one tower still standing tall, walls partially collapsed, climbing-bloom vines on the stone, drawbridge gone',
      'ROOFLESS ABANDONED ABBEY — abandoned abbey with the roof completely gone but the nave-columns still standing, climbing-bloom vines on the columns, sky visible above, fallen stones on the floor',
      'OVERGROWN ROMAN AMPHITHEATRE — overgrown Roman amphitheatre with the seating-tiers cracked and bloom-mass filling the rows, the arena-floor a bloom-meadow, sky visible above the open structure',
      'ABANDONED STONE MILL — abandoned stone mill with the waterwheel half-rotted, climbing-bloom vines on the mill-stone walls, stream still flowing past the silent wheel, bloom-meadow surrounding',
      'FORGOTTEN PALACE INTERIOR — forgotten palace interior with collapsed ceiling, bloom-mass cascading from above, chandelier still hanging twisted, ornate floor-tiles visible through petal-carpet',
      'OVERGROWN WATCHTOWER — abandoned medieval stone watchtower with the upper crenellations crumbled, climbing-bloom vines spiraling up the tower-walls, sky visible through arrow-slits',
      'ABANDONED MEDIEVAL VILLAGE — abandoned medieval stone-village with several houses still standing in disrepair, cobblestone street overgrown, climbing-bloom vines on every house',
      'SHIPWRECK ON ROCKS — wooden-hulled shipwreck on rocks with sea-mist around the hull, climbing-vines on the deck visible above the waterline, sun-shafts through broken sails-rigging',
      'KHMER VINE-CURTAINED TEMPLE — Khmer-style stone temple with vine-curtains entirely covering the carvings, strangler-fig roots embracing the structure, jungle-mass closing in',
      'OVERGROWN VICTORIAN MANSION — abandoned Victorian mansion with the roof partially collapsed, climbing-bloom vines on the ornate facade, broken windows with bloom-cascades spilling out',
    ],
    instructions: `Each entry is ONE specific ABANDONED HUMAN STRUCTURE being reclaimed by flowers, 25-50 words. Format: "RUIN NAME CAPS — primary structure + decay signature + bloom-consumption note + awe-mood". Vary across the 15 categories. ALWAYS reverent / awe-struck mood, NEVER ominous / horror. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: decay_anchor (specific decay focal-point) ───
  bloombot_reclaim_decay_anchor: {
    format: 'simple',
    theme: `DECAY ANCHORS for the BloomBot reclaim path. Each entry is ONE specific decay focal-point detail within an abandoned structure — rendered with hyperreal time-worn precision. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a TACTILE DECAY DETAIL typical of long-abandoned structures. The detail is the bloom-mass's visual focal-point convergence.

🚫 STRICT BANS:
  • NO humans / figures / skeletons / corpses (this is NOT horror)
  • NO active human presence (no fresh trash / vandalism / modern objects)
  • NO duplicate of ruin_type content (this is specific DETAIL not whole structure)
  • NO ominous / spooky / horror elements (no gravestones, no skulls in the foreground)

✓ DECAY-ANCHOR CATEGORIES:
  A. **CRACKED COLUMN** — broken marble column / cracked stone pillar / collapsed Doric column with capital fallen beside
  B. **FALLEN STATUE** — weathered marble statue toppled on its side / broken angel sculpture / weathered carving partial
  C. **SHATTERED WINDOW** — empty stained-glass window-frame with no glass / shattered Gothic rose-window / broken arched window
  D. **CRACKED-OPEN DOME** — collapsed dome with sky visible / cracked vaulted ceiling / shattered cupola
  E. **GROWING-IN-MASONRY ROOTS** — visible roots cracking the masonry from inside / tree-root splitting a stone wall / fig-root strangling a column
  F. **WEATHERED INSCRIPTION** — barely-legible carved-stone inscription / weathered Latin text / faded carved-name
  G. **OVERTURNED FURNITURE** — overturned wooden chair / collapsed library shelf with books / fallen chandelier / rotted bench
  H. **RUSTED METAL** — rusted iron gate hanging on one hinge / rust-streaked metal railing / weathered iron grille
  I. **CRACKED FLAGSTONES** — cracked-flagstone floor with bloom-mass growing through the cracks / broken mosaic floor / weathered tile-pattern emerging
  J. **CRUMBLED ARCH** — half-collapsed arch with the keystone fallen / partial arch with broken voussoirs / Roman arch in decay
  K. **STAIRCASE OF DECAY** — broken stone staircase with risers crumbled / spiral-staircase missing treads / collapsed mezzanine stairs
  L. **HOLLOW OBJECT** — empty rusted bell / silent pipe-organ pipes / rusted machinery / weathered statue niche
  M. **WEATHERED RELIEF** — high-relief carving worn smooth by centuries / bas-relief with bloom-vines softening the figures / weathered frieze

Channel: Piranesi etchings of Roman ruins + Caspar David Friedrich romantic-ruin paintings + Studio Ghibli ruin-detail framing + cottagecore-meets-archaeology Pinterest details.`,
    touchpoints: [
      'BROKEN MARBLE COLUMN — single broken Doric marble column with the capital fallen beside it, weathered chunks scattered, climbing-rose vines wrapping the standing portion, bloom-meadow surrounding',
      'TOPPLED MARBLE STATUE — weathered marble statue (classical female / cherub / muse) toppled on its side in the foreground, half-buried in bloom-mass, face still serene and intact',
      'EMPTY ROSE-WINDOW FRAME — empty Gothic rose-window with no glass remaining, climbing-rose vines threading the stone tracery, sky visible through the opening, sun-shafts pouring through',
      'COLLAPSED DOME WITH SKY — cracked-open dome of the structure with sky visible through the gap, climbing-bloom vines spilling from the broken ribs of the dome',
      'TREE-ROOT SPLITTING STONE — visible massive tree-root splitting a stone wall from inside, the masonry cracked outward by the root pressure, climbing-bloom vines around the crack',
      'WEATHERED LATIN INSCRIPTION — weathered carved-stone Latin inscription on a stone block, the letters barely legible through moss and bloom-vines, the rest of the block half-buried',
      'OVERTURNED WOODEN CHAIR — overturned weathered wooden chair in the ruins interior, half-buried in petal-carpet, climbing-bloom vines threading the legs',
      'RUSTED IRON GATE — rusted wrought-iron gate hanging on one hinge at the ruins entrance, climbing-rose vines on the bars, the gate frozen mid-swing',
      'CRACKED-FLAGSTONE FLOOR — broken-flagstone floor of the ruin with bloom-mass growing through the cracks between stones, individual flagstones rendered with hyperreal weathering',
      'HALF-COLLAPSED ARCH — half-collapsed stone arch with the keystone fallen and visible on the ground, broken voussoirs in the bloom-mass, climbing-vines on the remaining portion',
      'BROKEN STAIRCASE — broken stone staircase with several risers crumbled or missing, climbing-bloom vines on every standing step, fallen stones at the base',
      'EMPTY RUSTED BELL — empty rusted bronze bell hanging silent in a broken belltower, climbing-vines threading the bell-mouth, sun-shafts through the broken belltower roof',
      'WEATHERED FRIEZE — high-relief carved frieze worn smooth by centuries, bloom-vines softening the figures, the carving still legible enough to recognize the subject',
      'COLLAPSED LIBRARY SHELF — collapsed wooden library shelf with books fallen in a pile, several books still on the floor with bloom-vines threading them, weathered leather bindings',
      'PARTIAL-MOSAIC FLOOR — partial mosaic floor emerging through the bloom-mass and dirt, intricate tile-pattern visible in patches, climbing-bloom vines softening the edges',
      'FALLEN BELL — single fallen bronze bell on the cobblestones beside the broken belltower, the bell cracked open from the fall, bloom-vines around it',
      'CHANDELIER TWISTED ON FLOOR — collapsed crystal chandelier twisted on the ruined floor of a palace interior, individual crystals still glinting, climbing-bloom vines threading the frame',
      'RUSTED MACHINERY HALF-BURIED — rusted abandoned industrial machinery half-buried in the bloom-overgrowth, individual gears and pipes visible through the green-and-bloom mass',
      'WEATHERED STATUE NICHE EMPTY — empty stone wall-niche where a statue once stood, now occupied by a thick bloom-cluster overflowing, the niche-frame weathered and cracked',
      'COLLAPSED WOODEN BEAM — fallen weathered wooden roof-beam lying diagonal across the ruins interior, climbing-bloom vines on the beam, mossy at the joints',
    ],
    instructions: `Each entry is ONE specific TACTILE DECAY DETAIL within a ruin, 20-40 words. Format: "DECAY ANCHOR NAME CAPS — primary decay element + material/weathering + bloom-interaction note". Vary across the 13 categories. ALWAYS reverent (never horror). NO humans / skeletons. NO active vandalism. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_reclaim_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED RECLAIM ATMOSPHERIC PHENOMENA for the BloomBot reclaim path. Each entry is ONE specific awe-amplifying magic-moment element rendered within the ruin scene. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the AWE + MELANCHOLY + TRIUMPHANT-NATURE mood. Never ominous / horror. The reclaiming life is the subject.

🚫 STRICT BANS:
  • NO humans / figures / ghosts
  • NO architectural elements (those are ruin_type / decay_anchor territory)
  • NO ominous / spooky / horror elements
  • NO duplicate of ruin content
  • NO surreal physics

✓ PHENOMENON CATEGORIES:
  A. **GOD-RAYS THROUGH BROKEN ROOF** — volumetric sun-shafts pouring through the collapsed dome / broken roof onto specific bloom-patches
  B. **MIST / VAPOR** — soft morning mist in the ruin interior / vapor rising from the bloom-mass / atmospheric haze
  C. **PEACEFUL WILDLIFE** — single deer grazing in the ruin / fox sleeping in a sun-patch / owl in a broken window / butterfly on a fallen statue
  D. **POLLINATOR** — hummingbird hovering at a column-bloom / bee-cluster at a fallen stone / butterfly migration through the broken arch
  E. **FIREFLY-CLOUD** — soft cloud of fireflies at dusk in the ruin interior / glow-cloud
  F. **GOLDEN-HOUR-DRAMA** — late-afternoon golden-hour light setting the ruin ablaze / sunset light through broken windows
  G. **TWILIGHT-MOON** — full moon rising visible through the broken roof / first stars through the open dome
  H. **PETAL-FALL** — petal-fall drifting from the upper bloom-cascades into the ruin interior
  I. **POLLEN-CLOUD** — golden pollen-cloud dispersing in the god-ray sun-shafts
  J. **REFLECTION** — water-pool reflection in the ruin interior reflecting the bloom-laden architecture
  K. **DEW-CASCADE** — fine dewdrops on every petal of the climbing-bloom cascades around the ruin, sun catching them
  L. **SEED-DOWN DRIFT** — seed-pod fluff (dandelion / cottonwood / milkweed) drifting through the ruin in slow-motion

Channel: Studio Ghibli "Castle in the Sky" ruin-reveal moments + Caspar David Friedrich romantic-ruin painting atmosphere + Tarkovsky "Stalker" wonder-not-dread + David Attenborough nature-reclamation footage.`,
    touchpoints: [
      'VERTICAL GOD-RAYS THROUGH COLLAPSED ROOF — multiple vertical sun-shafts pouring through the collapsed roof of the ruin onto specific bloom-patches below, vapor-laden beams visible in the still air',
      'MORNING MIST IN RUIN INTERIOR — soft morning mist coiling through the ruin interior in still air, vapor softening the depth, sun starting to break through the broken roof',
      'SINGLE DEER GRAZING IN RUIN — single solitary deer grazing in the ruins nave / interior, head down on the bloom-meadow floor, peaceful, the only living motion in the frame',
      'OWL IN BROKEN WINDOW — solitary owl perched in a broken arched window of the ruin, eyes facing the viewer, head tilted, blooms cascading around the window-frame',
      'FIREFLY CLOUD AT DUSK — soft cloud of fireflies suspended at dusk within the ruin interior, hundreds of green-pulse lights at every depth between the columns',
      'GOLDEN-HOUR FIRE-LIGHT — late-afternoon golden-hour light setting the ruins remaining walls ablaze with warm-amber glow, every weathered stone catching gold',
      'FULL MOON THROUGH BROKEN ROOF — full silver moon visible through the broken roof of the ruin, soft moonlight bathing the bloom-mass below, the rest in cool blue-shadow',
      'PETAL-FALL DRIFTING INSIDE — drifting petal-fall from the upper climbing-bloom cascades into the ruins interior, petals suspended at every depth in the still air',
      'POLLEN-CLOUD IN GOD-RAYS — golden pollen-cloud dispersing in the volumetric god-ray sun-shafts, individual pollen-motes visible in the warm light',
      'WATER-POOL REFLECTION INTERIOR — small water-pool in the ruins interior reflecting the bloom-laden architecture above, mirror-still surface broken by a single drop',
      'DEW-CASCADE EVERYWHERE — fine dewdrops on every petal of the climbing-bloom cascades wrapping the ruin, the entire structure scintillating with reflected morning light',
      'SEED-DOWN DRIFT — cottonwood / dandelion seed-down drifting through the ruin in slow-motion, hundreds of seed-fluff suspended in the air',
      'HUMMINGBIRD AT COLUMN-BLOOM — solitary jewel-iridescent hummingbird hovering at a bloom-cluster on a ruined column, wings a transparent blur',
      'BUTTERFLY ON FALLEN STATUE — solitary butterfly perched on the cheek of a fallen marble statue half-buried in bloom, wings catching the sun',
      'SOFT-VAPOR FROM POOL — soft vapor rising from a small reflecting pool in the ruin interior, the steam curling through the volumetric light',
      'FOX ASLEEP IN SUN-PATCH — solitary red fox curled asleep in a sun-warmed patch on the ruins floor, surrounded by bloom-mass, ears relaxed',
      'TWILIGHT FIRST-STAR — first star of evening visible through the open broken dome of the ruin, twilight sky filling the opening, blooms below in cool shadow',
      'BUTTERFLY CLOUD THROUGH ARCH — cloud of butterflies passing through a broken arch of the ruin in soft fluttering motion, wings catching the back-light',
      'POLLEN-MOTE GALAXY — vast suspended pollen-mote galaxy filling the entire ruin interior, dust-motes individually visible in slanting light, dreamlike density',
      'BIRD-FLOCK ROOSTING — small flock of small birds (sparrows / starlings) roosting on the upper ledge of a broken wall, evening light, the rest of the ruin quiet',
    ],
    instructions: `Each entry is ONE specific RECLAIM ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in ruin + lighting note". Vary across the 12 categories. ALWAYS reverent (never horror / spooky). NO humans / ghosts. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit DNA: hair_floral (lush flower-waterfall through hair) ───
  bloombot_bloom_spirit_hair_floral: {
    format: 'simple',
    theme: `COLOR-THEMED HAIR-FLORAL ARRANGEMENTS for the BloomBot bloom-spirit path. Each entry is ONE specific COLOR-THEMED MULTI-SPECIES floral arrangement OVERWHELMING her hair. Each entry 30-70 words.

⚠️ ABSOLUTE VOLUME MANDATE — every entry describes an EXTREME LUSH OVERWHELMING quantity (HUNDREDS to THOUSANDS) of MULTIPLE different flower species in a coordinated COLOR THEME — like a master Pre-Raphaelite painter spent days arranging an entire flower-shop's worth of blooms into one woman's hair. The hair-flower volume EXCEEDS the dress-flower volume. The hair is a CASCADING FLOWER-WATERFALL.

⚠️ MULTI-SPECIES MANDATE — every entry uses 3-6 DIFFERENT flower species woven together (NEVER a single-species entry like 'just dahlias'). Mix species for visual richness.

⚠️ COLOR-THEME MANDATE — every entry has a clear COLOR THEME pulling the flowers together:
  • SUNSET — red + orange + pink + coral + gold + amber
  • TWILIGHT PURPLES — lavender + violet + blue + periwinkle + indigo
  • BLUSH PINKS — soft pink + blush + cream + ivory + pale-rose
  • MONOCHROME WHITE — white + cream + ivory + pearl + soft-blush hints
  • RAINBOW EXPLOSION — full spectrum (red/orange/yellow/green/blue/purple) wildly mixed
  • PINK + WHITE COTTAGE — soft pinks + whites + creams
  • PURPLE + WHITE ROYAL — purples + whites + violet accents
  • CORAL + PEACH PARADISE — corals + peaches + warm sunset tones
  • DEEP BURGUNDY + WINE — burgundy + plum + maroon + dark crimson
  • GOLD + AMBER + COPPER — golds + ambers + coppers + warm bronze
  • OCEAN COOL — aqua + teal + ice-blue + seafoam + pearl-white
  • EMERALD FOREST — green-flowers + white + pale-yellow + soft lavender
  • MAGIC PASTEL CANDY — pastel pink + lilac + mint + butter-yellow + sky-blue
  • TROPICAL BOLD — hot pink + tropical-orange + magenta + bright-yellow
  • AUTUMN HARVEST — rust + russet + ochre + burnt-orange + ruby
  • DUSK FIRE — deep red + orange + crimson + gold

✓ EXAMPLE FORMAT:
"SUNSET FIRE HAIR — OVERWHELMING cascade of hundreds of red roses, coral peonies, orange ranunculus, yellow daisies, and golden marigolds woven from crown to tips, sunset-spectrum cascading through every wave, hair barely visible under the warm tidal-wave of color"

🚫 BANNED:
  • Single-species arrangements (boring)
  • The phrase "flower crown" / "halo" / "wreath" / "thick cap" / "floral hat" — all FORBIDDEN
  • "Minimal" / "delicate" / "subtle" / "few" — FORBIDDEN
  • Any language suggesting fewer than HUNDREDS of flowers

Channel: Pre-Raphaelite Persephone-buried-in-flowers + Pinterest "extreme lush floral bridal hair" + multi-color floral-explosion editorial + Frida Kahlo headpieces × 100x volume.`,
    touchpoints: [
      'SUNSET FIRE OVERWHELMING — cascade of hundreds of red roses + coral peonies + orange ranunculus + yellow daisies + golden marigolds woven from crown to tips, sunset spectrum cascading through every wave, hair buried under warm tidal-wave',
      'TWILIGHT PURPLE STORM — hundreds of lavender + violet wisteria + blue bluebells + periwinkle + indigo iris woven through every braid, deep twilight purple-blue tidal-wave cascading from crown to waist',
      'BLUSH PINK CASCADE — overwhelming arrangement of soft pink peonies + blush roses + cream ranunculus + ivory jasmine + pale rose-cabbage roses cascading through every section, hair drenched in blush florals',
      'MONOCHROME WHITE FLOOD — hundreds of white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore plastered through every wave, snow-white floral cascade',
      'RAINBOW EXPLOSION — wild rainbow of hundreds of red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones + violet sweet-pea woven through every inch, full-spectrum mass cascade',
      'PINK AND WHITE COTTAGE — soft pink garden roses + cream-white peonies + pale blush ranunculus + white jasmine + tiny pink gypsophila woven in extreme abundance from crown to tips',
      'PURPLE AND WHITE ROYAL — hundreds of royal purple irises + white roses + violet anemones + pearl gardenias + lavender sweet-pea cascading through every braid, dramatic purple-and-white tidal-wave',
      'CORAL PEACH PARADISE — overwhelming coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds woven through hair, warm tropical paradise cascade',
      'DEEP BURGUNDY WINE STORM — hundreds of burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla cascading from crown to tips, dramatic wine-spectrum tidal-wave',
      'GOLD AMBER COPPER FIRE — golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze-orange chrysanthemums woven in massive abundance through every wave',
      'OCEAN COOL CASCADE — aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam-green hellebore + pearl-white roses plastered through hair, cool ocean-spectrum tidal-wave',
      'EMERALD FOREST HAIR — green hellebore + white daisies + pale-yellow primrose + soft lavender sweet-pea + emerald-green succulents woven in extreme abundance, forest-spirit floral cascade',
      'PASTEL CANDY EXPLOSION — pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms in OVERWHELMING density through every braid, soft cotton-candy floral cascade',
      'TROPICAL BOLD STORM — hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger woven in tropical floral-storm density',
      'AUTUMN HARVEST CASCADE — rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos in massive autumn cascade through hair',
      'DUSK FIRE BLAZE — deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias woven in extreme dusk-fire spectrum cascade',
      'BLUE AND WHITE COASTAL — sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue cascading in coastal-spectrum overwhelming mass',
      'PINK AND GOLD ROMANCE — soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea woven in romantic overwhelming cascade',
      'VIOLET AND CREAM ETHEREAL — violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea overwhelming through every section',
      'CHERRY BLOSSOM EXPLOSION — pink + white cherry blossom petals in MASSIVE thousand-petal cascade through every wave, supplemented with rose-pink camellias + cream magnolias',
      'RED AND BURGUNDY DRAMA — deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus woven in dramatic wine-cascade',
      'YELLOW MEADOW SUN — yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine-yellow chrysanthemums in massive sun-spectrum cascade',
      'LILAC AND BABY-BLUE SPRING — lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots woven in soft-pastel spring cascade through hair',
      'TEAL AND ROSE-GOLD VINTAGE — teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies woven in vintage-romantic cascade',
      'BLACK ROSE AND WHITE GOTH — dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore in dramatic goth-romance cascade',
      'PEACH AND CREAM SOFT — peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias in extreme soft-peach cascade',
      'MAGENTA AND ORANGE BOLD — hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea in extreme bold cascade',
      'COOL MINT AND WHITE — mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus in cool mint cascade',
      'BUTTER YELLOW AND BLUSH — butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums woven in soft pastel cascade',
      'INDIGO AND VIOLET DEEP — indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias in dramatic deep-purple cascade',
      'ORANGE AND CORAL TROPICAL — bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset-spectrum bougainvillea in tropical cascade',
      'BLUSH AND DUSTY-PINK ROMANCE — soft blush garden roses + dusty-pink peonies + pale pink ranunculus + cream-blush cabbage roses + delicate baby-pink sweet-pea in romantic overwhelming cascade',
      'WHITE AND CHAMPAGNE BRIDAL — white roses + cream peonies + champagne-blush ranunculus + ivory dahlias + pearl-white gardenias woven in bridal cascade with rose-gold highlights',
      'EMERALD AND GOLD LUXE — emerald-green hellebore + golden marigolds + amber dahlias + cream-gold ranunculus + green-and-gold succulents in luxe cascade',
      'PEACH AND LAVENDER DREAM — peach garden roses + lavender sweet-pea + apricot ranunculus + soft pale-purple anemones + cream-peach peonies in dreamy pastel cascade',
      'CRIMSON AND BLACK DRAMATIC — crimson roses + dark-burgundy dahlias + black-purple anemones + deep red ranunculus + dark crimson peonies in dramatic crimson cascade',
      'POWDER BLUE AND PINK FAIRY — powder-blue forget-me-nots + soft pink peonies + pale-rose ranunculus + cream-white roses + baby-blue hydrangeas in soft fairy cascade',
      'AMBER AND COPPER METALLIC — amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses in metallic warm cascade',
      'NEON PINK AND PURPLE — bright neon-pink garden roses + electric-purple anemones + magenta dahlias + hot-pink peonies + saturated-violet sweet-pea in vibrant neon cascade',
      'CHARCOAL AND IVORY GOTHIC — charcoal-grey hellebore + ivory roses + black-violet anemones + cream-grey ranunculus + pale-ivory dahlias in gothic-romantic cascade',
      'TURQUOISE AND CORAL TROPICAL — turquoise hydrangeas + coral hibiscus + aqua-blue forget-me-nots + warm coral peonies + bright sea-glass green succulents in tropical cascade',
      'PALE PINK AND GREEN GARDEN — pale-pink garden roses + emerald-green hellebore + soft mint succulents + cream-pink peonies + leafy-green eucalyptus accents in fresh garden cascade',
      'RUBY AND GOLD ROYAL — ruby-red roses + gold-amber dahlias + crimson ranunculus + warm-gold marigolds + dark-red peonies in royal cascade',
      'MIDNIGHT BLUE AND SILVER — midnight-blue irises + silver-grey hellebore + dark-violet anemones + ice-blue forget-me-nots + pearl-silver ranunculus in mystical cascade',
      'CANDY APPLE RED AND CREAM — candy-apple red roses + cream-white peonies + crimson ranunculus + ivory gardenias + pearl-pink sweet-pea in classic romance cascade',
      'SUNRISE PEACH GOLD ROSE — sunrise-peach garden roses + golden-amber dahlias + rose-pink peonies + cream-white ranunculus + warm-peach plumeria in sunrise cascade',
      'NAVY AND BURGUNDY AUTUMN — navy-blue irises + burgundy dahlias + dark-violet anemones + deep-crimson ranunculus + maroon peonies in autumn-evening cascade',
      'BABY PINK AND CREAM SOFT — baby-pink roses + cream peonies + pale-blush ranunculus + ivory ranunculus + pearl-pink hellebore in soft cottage cascade',
      'BRONZE AND PLUM AUTUMN — bronze-orange chrysanthemums + plum dahlias + ruby-wine cosmos + amber ranunculus + dark-russet peonies in deep autumn cascade',
      'IRIDESCENT FAIRY PASTEL — iridescent pastel mix of mint + lavender + baby-blue + cream-yellow + pearl-pink in extreme fairy-cascade with hundreds of tiny glistening blooms',
    ],
    instructions: `Each entry is ONE COLOR-THEMED MULTI-SPECIES OVERWHELMING HAIR-FLORAL arrangement, 30-70 words. Format: "COLOR-THEME NAME CAPS — overwhelming cascade of [3-6 named flower species] in [color theme], cascading through every section of hair, hair buried under the floral mass". MULTI-SPECIES + COLOR-THEMED + OVERWHELMING density. Never single-species. The phrase "flower crown" is FORBIDDEN. Output as a NUMBERED list, one per line.`,
  },

  bloombot_bloom_spirit_skin_tone: {
    format: 'simple',
    theme: `SKIN TONE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific skin tone description that can pair with any race. 15-30 words.

⚠️ MANDATORY — full range from fair to ebony, anime-painterly register (cel-shaded painted skin treatment, glow accents allowed). NEVER realistic-photoreal-skin-pore description.

🚫 STRICT BANS:
  • NO photoreal-pore description
  • NO race-specific (race is a separate axis)
  • NO face-feature description (just SKIN tone)
  • NO body-shape description

✓ TONE RANGE — DISTRIBUTE EVENLY across the full spectrum:
  • Fair: porcelain / ivory / rose-pale / cream
  • Light: peach / wheat / warm-fair / cool-fair
  • Olive: olive-warm / olive-cool / golden-olive
  • Tan: warm-tan / golden-tan / sun-kissed
  • Brown: caramel / cocoa / warm-brown / golden-brown
  • Deep brown: rich-brown / espresso / mahogany / chestnut
  • Ebony: deep-ebony / luminous-ebony / midnight-velvet

Anime-painterly register: cel-shaded, soft glow accents, smooth painted treatment.`,
    touchpoints: [
      'PORCELAIN-FAIR — porcelain-fair skin with soft rose-undertones, anime-painterly cel-shading, gentle peach glow on cheekbones',
      'CREAM-IVORY — cream-ivory skin with warm peach undertones, anime-painterly soft painted treatment, subtle glow accents',
      'WARM-PEACH — warm-peach skin with golden undertones, anime cel-shaded register, soft glow on cheeks',
      'ROSE-PALE — rose-pale skin with cool undertones, anime-painterly delicate cel-shading, pink-glow cheek accents',
      'OLIVE-WARM — warm-olive skin with golden undertones, anime cel-shaded painted treatment, honey-glow accents',
      'GOLDEN-OLIVE — golden-olive skin with sun-warmed undertones, anime-painterly soft cel-shading, amber glow accents',
      'SUN-KISSED TAN — sun-kissed tan skin with warm bronze undertones, anime cel-shaded painted register, golden glow',
      'WARM-CARAMEL — warm-caramel skin with honey undertones, anime-painterly soft cel-shading, golden-amber glow accents',
      'COCOA-BROWN — cocoa-brown skin with rich undertones, anime cel-shaded painted register, copper glow accents',
      'GOLDEN-BROWN — golden-brown skin with warm sun undertones, anime-painterly cel-shaded register, soft amber glow',
      'RICH-BROWN — rich-brown skin with mahogany undertones, anime cel-shaded painted treatment, warm copper glow',
      'CHESTNUT-BROWN — chestnut-brown skin with warm autumn undertones, anime-painterly cel-shading, glowing warm highlights',
      'ESPRESSO-DARK — espresso-dark skin with depth, anime cel-shaded painted register, jewel-tone highlight accents',
      'MAHOGANY-DEEP — mahogany-deep skin with rich red undertones, anime-painterly cel-shading, copper-gold accents',
      'LUMINOUS-EBONY — luminous-ebony skin with deep midnight undertones, anime cel-shaded painted register, gold-and-pearl glow accents',
      'DEEP-EBONY — deep-ebony skin with velvety smoothness, anime-painterly cel-shading, pearl-and-gold highlight accents',
      'MIDNIGHT-VELVET — midnight-velvet ebony skin with iridescent undertones, anime cel-shaded register, jewel-tone glow accents',
      'WHEAT-WARM — wheat-warm skin with subtle peach undertones, anime cel-shaded painted register, soft amber glow',
      'FAIR-COOL — fair-cool skin with subtle blue undertones, anime-painterly cel-shading, pearl-glow cheek accents',
      'PEACH-GOLD — peach-gold skin with warm sun undertones, anime cel-shaded painted register, golden glow accents',
      'BRONZE-WARM — warm-bronze skin with golden undertones, anime-painterly cel-shading, amber-copper glow accents',
      'HONEY-GOLDEN — honey-golden skin with warm autumn undertones, anime cel-shaded painted register, soft golden glow',
      'AMBER-WARM — warm-amber skin with sun-kissed undertones, anime-painterly cel-shading, warm-bronze accents',
      'OLIVE-COOL — cool-olive skin with subtle green undertones, anime cel-shaded painted register, soft pearl accents',
      'TOAST-WARM — warm-toast skin with golden honey undertones, anime-painterly cel-shading, soft glow accents',
      'COFFEE-MEDIUM — coffee-medium skin with warm undertones, anime cel-shaded painted register, golden-copper glow',
      'CINNAMON-WARM — warm-cinnamon skin with rich autumn undertones, anime-painterly cel-shading, copper-amber accents',
      'WALNUT-DEEP — walnut-deep skin with rich brown undertones, anime cel-shaded painted register, warm copper glow',
      'TAUPE-WARM — warm-taupe skin with subtle olive undertones, anime-painterly cel-shading, soft golden accents',
      'COPPER-RICH — rich-copper skin with metallic undertones, anime cel-shaded painted register, gold-and-amber glow accents',
    ],
    instructions: `Each entry is ONE specific skin tone descriptor, 15-30 words. Format: "TONE NAME CAPS — primary tone + undertone + anime cel-shading note + glow accent". DISTRIBUTE EVENLY across the full spectrum from porcelain to ebony. NEVER race-specific. NEVER photoreal-pore. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── bloom-spirit DNA: eyes (30 entries, all colors + shapes) ───
  bloombot_bloom_spirit_eyes: {
    format: 'simple',
    theme: `EYE COLOR + SHAPE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific anime-stylized eye description. 15-30 words.

⚠️ MANDATORY — LARGE STYLIZED ANIME-PAINTERLY eyes (always). Variety across all natural colors + fantasy jewel-tone colors. NEVER photoreal eye description.

🚫 STRICT BANS:
  • NO photoreal eye-iris-detail description
  • NO race-specific (race is a separate axis)
  • NO duplicate of skin / hair content
  • NO realistic-shape descriptions like "small" or "narrow" — always LARGE stylized anime

✓ EYE COLOR CATEGORIES — DISTRIBUTE EVENLY:
  Natural: brown / amber / hazel / green / blue / grey / black
  Jewel-tone fantasy: violet / aqua / silver / pink / gold / mint / rose / lavender / sapphire
  Heterochromia: two-different-colors

Anime register: large + stylized + expressive + sparkly with star-shaped highlights / multiple light catchlights / jewel-glint.`,
    touchpoints: [
      'LARGE VIOLET-JEWEL — large stylized violet-jewel anime eyes with star-shaped highlights, sparkly fantasy register',
      'LARGE AMBER-GOLD — large stylized amber-gold anime eyes with multiple catchlights, warm honey depth',
      'LARGE EMERALD-GREEN — large stylized emerald-green anime eyes with jewel sparkle, expressive painterly',
      'LARGE SAPPHIRE-BLUE — large stylized sapphire-blue anime eyes with bright catchlights, jewel-tone depth',
      'LARGE CHOCOLATE-BROWN — large stylized chocolate-brown anime eyes with warm catchlights, soft expressive',
      'LARGE ICE-BLUE — large stylized ice-blue anime eyes with silver catchlights, cool jewel depth',
      'LARGE HAZEL-WARM — large stylized hazel anime eyes with green-amber gradient, warm catchlights',
      'LARGE AQUA-TURQUOISE — large stylized aqua-turquoise anime eyes with bright sparkle, jewel register',
      'LARGE DEEP-AMBER — large stylized deep-amber anime eyes with copper catchlights, intense gaze',
      'LARGE LAVENDER-VIOLET — large stylized lavender-violet anime eyes with pearl catchlights, soft jewel',
      'LARGE FOREST-GREEN — large stylized forest-green anime eyes with golden catchlights, deep wood',
      'LARGE GOLDEN-AMBER — large stylized golden-amber anime eyes with sun-glint catchlights, warm gold',
      'LARGE SILVER-GREY — large stylized silver-grey anime eyes with bright catchlights, moonlight depth',
      'LARGE ROSE-PINK FANTASY — large stylized rose-pink fantasy anime eyes with jewel sparkle (fantasy color)',
      'LARGE MINT-GREEN FANTASY — large stylized mint-green fantasy anime eyes with bright sparkle (fantasy)',
      'LARGE ELECTRIC-BLUE — large stylized electric-blue anime eyes with intense glow, jewel-bright',
      'LARGE COPPER-AMBER — large stylized copper-amber anime eyes with metallic glint, warm depth',
      'LARGE STORMY-GREY — large stylized stormy-grey anime eyes with silver catchlights, expressive',
      'LARGE ROYAL-PURPLE — large stylized royal-purple anime eyes with bright catchlights, jewel depth',
      'LARGE OCEAN-BLUE — large stylized ocean-blue anime eyes with multi-tone gradient, deep sparkle',
      'LARGE MOSS-GREEN — large stylized moss-green anime eyes with subtle gold flecks, warm depth',
      'LARGE TIGER-AMBER — large stylized tiger-amber anime eyes with copper catchlights, intense gaze',
      'LARGE BLACK-OBSIDIAN — large stylized obsidian-black anime eyes with bright catchlights, mysterious',
      'LARGE PEARL-WHITE FANTASY — large stylized pearl-white fantasy anime eyes with iridescent shimmer',
      'HETEROCHROMIA BLUE-GREEN — large stylized anime eyes with one blue and one green eye, jewel sparkle',
      'HETEROCHROMIA AMBER-VIOLET — large stylized anime eyes with one amber and one violet eye, fantasy',
      'LARGE TWILIGHT-PURPLE — large stylized twilight-purple anime eyes with star-shaped catchlights',
      'LARGE CORAL-PINK FANTASY — large stylized coral-pink fantasy anime eyes with bright sparkle',
      'LARGE SUNSET-AMBER — large stylized sunset-amber anime eyes with gradient color, warm catchlights',
      'LARGE CRYSTAL-CLEAR FANTASY — large stylized crystal-clear fantasy anime eyes with iridescent prism-glow',
    ],
    instructions: `Each entry is ONE specific eye descriptor, 15-30 words. Format: "EYE NAME CAPS — large stylized [color] anime eyes with [catchlight/highlight] note". ALWAYS large + stylized + anime. DISTRIBUTE across natural + jewel-tone + heterochromia. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit DNA: hair_color (30 entries, natural + fantasy) ───
  bloombot_bloom_spirit_hair_color: {
    format: 'simple',
    theme: `HAIR COLOR DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific hair color description. 10-25 words.

⚠️ MANDATORY — full range of natural hair colors PLUS pastel-fantasy colors. NEVER photoreal-detail description (just color + tone notes).

🚫 STRICT BANS:
  • NO photoreal individual-strand description
  • NO race-specific (race is separate axis)
  • NO hairstyle description (hairstyle is separate axis)
  • NO duplicate of other DNA axes

✓ COLOR CATEGORIES — DISTRIBUTE EVENLY:
  Natural: jet-black / dark-brown / chestnut / auburn / red-copper / honey-blonde / platinum-blonde / silver / wheat-blonde
  Fantasy: silver-white / lavender / pastel-pink / mint-green / rose-gold / sky-blue / honey-amber / sunset-orange / ocean-teal / pearl / iridescent

Anime-painterly register — soft painted color with subtle gradient.`,
    touchpoints: [
      'JET-BLACK SILK — jet-black anime-painterly hair with subtle blue-purple highlights',
      'DARK-CHOCOLATE — dark-chocolate anime hair with warm caramel highlights, soft painted',
      'RICH-CHESTNUT — rich-chestnut anime hair with auburn highlights, warm depth',
      'AUBURN-COPPER — auburn-copper anime hair with golden-red highlights, warm autumn',
      'RED-COPPER — vibrant red-copper anime hair with golden ember highlights, fiery painted',
      'HONEY-BLONDE — honey-blonde anime hair with golden warm highlights, soft painted',
      'PLATINUM-BLONDE — platinum-blonde anime hair with cool silver highlights, painterly',
      'STRAWBERRY-BLONDE — strawberry-blonde anime hair with pink-rose-gold tones, soft painted',
      'WHEAT-BLONDE — wheat-blonde anime hair with warm golden highlights, sun-kissed',
      'SILVER-GREY — silver-grey anime hair with cool moonlight highlights, ethereal painted',
      'WHITE-PEARL FANTASY — pearl-white fantasy anime hair with iridescent shimmer highlights',
      'LAVENDER-PURPLE FANTASY — lavender-purple fantasy anime hair with violet highlights, painted',
      'PASTEL-PINK FANTASY — pastel-pink fantasy anime hair with rose highlights, soft painted',
      'MINT-GREEN FANTASY — mint-green fantasy anime hair with seafoam highlights, painted',
      'ROSE-GOLD FANTASY — rose-gold fantasy anime hair with metallic warm highlights, painted',
      'SKY-BLUE FANTASY — sky-blue fantasy anime hair with crystal highlights, painted',
      'HONEY-AMBER FANTASY — honey-amber fantasy anime hair with golden glow, painted',
      'SUNSET-ORANGE FANTASY — sunset-orange fantasy anime hair with red-gold gradient, painted',
      'OCEAN-TEAL FANTASY — ocean-teal fantasy anime hair with aqua highlights, painted',
      'IRIDESCENT FANTASY — iridescent rainbow-shimmer fantasy anime hair, painterly',
      'COCOA-BROWN — cocoa-brown anime hair with warm caramel highlights, painted',
      'ESPRESSO-DARK — espresso-dark anime hair with cool blue undertones, painted',
      'MAHOGANY-RED — mahogany-red anime hair with deep auburn tones, warm painted',
      'COOL-ASH BROWN — cool-ash-brown anime hair with subtle grey-undertone highlights',
      'WARM-CARAMEL — warm-caramel anime hair with golden honey highlights, painted',
      'CHARCOAL-BLACK — charcoal-black anime hair with subtle grey highlights, painted',
      'TWILIGHT-VIOLET FANTASY — twilight-violet fantasy anime hair with star-shimmer highlights',
      'PERIWINKLE FANTASY — periwinkle fantasy anime hair with crystal-blue tones, painted',
      'BUTTER-YELLOW FANTASY — butter-yellow fantasy anime hair with cream-gold tones, painted',
      'CORAL-PEACH FANTASY — coral-peach fantasy anime hair with rose-amber tones, painted',
    ],
    instructions: `Each entry is ONE specific hair color descriptor, 10-25 words. Format: "COLOR NAME CAPS — [color] anime-painterly hair with [highlight/tone] note". DISTRIBUTE across natural + pastel-fantasy. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit DNA: hairstyle (50 entries, length + texture + styling) ───
  bloombot_bloom_spirit_hairstyle: {
    format: 'simple',
    theme: `HAIRSTYLE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific hair length + texture + styling description. 15-30 words.

⚠️ MANDATORY — describes hair STRUCTURE (length / texture / cut / styling) WITHOUT mentioning flowers (flowers are handled by template). The hair must read AS HAIR clearly visible.

🚫 STRICT BANS:
  • NO color description (hair_color is separate axis)
  • NO race-specific
  • NO flower / floral / bloom references (template handles that)
  • NO hat / crown / wreath / cap mentions

✓ HAIRSTYLE CATEGORIES — DISTRIBUTE across:
  Length: pixie / chin-bob / shoulder-length / mid-back / waist-length / floor-length
  Texture: straight / wavy / curly / coily / kinky / box-braided / cornrowed / loc'd
  Styling: loose / half-up / updo / braided crown / side-swept / french-braid / fishtail / dutch-braid / waterfall-braid / chignon / messy bun / sleek / voluminous / topknot

Anime-painterly register — hair painted with flowing dynamic motion, soft sheen, painterly highlights.`,
    touchpoints: [
      'LONG FLOWING WAVES — long mid-back flowing soft waves cascading freely, anime-painterly dynamic motion, soft sheen',
      'WAIST-LENGTH STRAIGHT — sleek waist-length straight hair with soft anime painted sheen, flowing down her back',
      'LONG CURLY MASS — long voluminous curly hair past shoulders, painted spiral curls in anime register',
      'BOX-BRAIDS SHOULDER — long box-braided hair past shoulders, each braid individually painted, anime register',
      'BOX-BRAIDS WAIST — long box-braided hair to the waist, each braid distinct, painted anime register',
      'CORNROWS CROWN — intricate cornrow braids forming a crown pattern, painted anime register',
      'LOCS LONG — long locs cascading past shoulders, individually painted twist-and-coil, anime register',
      'AFRO ROUND — beautiful round afro hairstyle, voluminous painted curls, anime register',
      'PIXIE CUT TEXTURED — chic pixie cut with textured side-sweep, painted anime register with soft sheen',
      'CHIN BOB SLEEK — sleek chin-length bob with smooth sheen, painted anime register, soft flowing edges',
      'SHOULDER BLUNT — shoulder-length blunt cut with subtle waves, painted anime register, smooth sheen',
      'ELEGANT UPDO — elegant chignon updo with soft tendrils framing the face, painted anime register',
      'BRAIDED CROWN UPDO — braided-crown updo with the braid wrapping the head, painted anime register',
      'HALF-UP HALF-DOWN — half-up half-down style with twisted upper crown and flowing lower waves, painted anime',
      'SIDE-SWEPT WAVES — side-swept long waves flowing over one shoulder, painted anime register, dynamic motion',
      'FRENCH-BRAID — single French braid down the center back, anime painted register, structured',
      'FISHTAIL-BRAID — long fishtail braid over one shoulder, intricately painted anime register',
      'DUTCH-BRAID DOUBLE — two Dutch braids running parallel down both sides, painted anime register',
      'WATERFALL-BRAID — waterfall-braid framing the face with loose ends cascading, painted anime register',
      'MESSY BUN — soft messy bun atop the head with tendrils framing the face, painted anime register',
      'TOPKNOT ELEGANT — elegant topknot with smooth pulled-back styling, painted anime register',
      'VOLUMINOUS CURLS — voluminous curls past shoulders with bouncy dynamic painted motion, anime',
      'TIGHT-COILS NATURAL — tight natural coils framing the face, voluminous painted anime register',
      'BANTU KNOTS — Bantu knots styled across the crown, painted anime register, structured',
      'SLEEK PONYTAIL LOW — sleek low ponytail flowing down the back, painted anime register, smooth',
      'HIGH PONYTAIL VOLUMINOUS — high ponytail with voluminous waves cascading, painted anime register',
      'CROWN BRAID INTRICATE — intricate crown braid wrapping around the head, painted anime register',
      'PRINCESS UPDO — princess-style updo with twists and curls, painted anime register, elegant',
      'LOOSE BEACH WAVES — loose beach waves flowing freely, painted anime register, soft windswept motion',
      'STRAIGHT SLEEK MID-BACK — straight sleek hair to mid-back with glossy painted sheen, anime register',
      'WAVY MID-BACK PARTED — wavy mid-back hair parted in the middle, painted anime register, soft motion',
      'CURLY SHOULDER-LENGTH — shoulder-length curly hair with bounce, painted anime register',
      'BRAIDED LOW BUN — low braided bun at the nape with elegant smooth styling, painted anime register',
      'TWISTED-BACK — back-twisted style with loose tendrils framing the face, painted anime register',
      'SLEEK MIDDLE-PART LONG — sleek middle-part long hair flowing down the back, painted anime register',
      'CURLY UPDO TENDRILS — curly updo with cascading tendrils, painted anime register, soft and dynamic',
      'BRAIDED HEADBAND — braided-headband style framing the hairline, rest flowing free, painted anime',
      'TWO BRAIDS PIGTAIL — two long pigtail braids one on each side, painted anime register, sweet',
      'CURLY HALF-UPDO — curly half-updo with the upper section twisted up, painted anime register',
      'WAVY HIGH-PONYTAIL — wavy high-ponytail with bouncy painted curls cascading, anime register',
      'SLEEK TOPKNOT — sleek high topknot with smooth pulled-back styling, painted anime register',
      'BRAIDED PIGTAILS LOW — two low braided pigtails framing the face, painted anime register',
      'LOOSE PARTED MID-BACK — loose middle-parted mid-back hair, painted anime register, soft and flowing',
      'TWIST-OUT NATURAL — natural twist-out style with defined coils, painted anime register, voluminous',
      'SIDE-PART LONG-WAVES — side-parted long-wavy hair flowing over one shoulder, painted anime register',
      'CURLY ASYMMETRICAL — curly asymmetrical cut with one side longer, painted anime register, edgy',
      'BRAIDED HALO — single thick braid wrapped around the crown like a halo (no flowers), painted anime',
      'LOOSE WAVY UNDONE — loose wavy hair undone and free-flowing, painted anime register, romantic',
      'STRAIGHT WITH WISPS — straight hair with face-framing wisps, painted anime register, soft',
      'CURLY UPSWEPT — curly hair swept up on one side with cascading other side, painted anime register',
    ],
    instructions: `Each entry is ONE specific HAIRSTYLE descriptor (length + texture + styling), 15-30 words. Format: "STYLE NAME CAPS — [length] [texture] hair with [styling note], painted anime register". NEVER color / flower / race specific. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit path: woman_archetype (diverse beautiful young women) ───
  // ─── bloom-spirit path: woman_archetype (diverse beautiful young women) ───
  bloombot_bloom_spirit_woman_archetype: {
    format: 'simple',
    theme: `WOMAN ARCHETYPES for the BloomBot bloom-spirit path. Each entry is ONE specific beautiful young woman described by ethnicity / skin tone / hair color + texture / eye color + features — for an anime-painterly fantasy portrait. Each entry 20-40 words.

⚠️ MANDATORY — DIVERSITY across all ethnicities, all skin tones, all hair colors (natural + pastel-fantasy), all eye colors (natural + jewel-tone fantasy), all hair textures. Every render is a beautiful YOUNG WOMAN — never men, never children, never elders.

🚫 STRICT BANS:
  • NO men / boys / male figures
  • NO children / babies / toddlers / teens
  • NO elders / old women
  • NO multiple figures (always single solo subject)
  • NO realistic-fashion-editorial register — this is fantasy painterly anime
  • NO horror / dark-fantasy / ominous features
  • NO specific real-people / celebrity references

✓ ETHNICITY / SKIN-TONE CATEGORIES — DISTRIBUTE EVENLY (~8% each):
  A. EAST ASIAN — Japanese / Korean / Chinese features, fair-to-tan skin
  B. SOUTHEAST ASIAN — Thai / Vietnamese / Filipino / Indonesian features
  C. SOUTH ASIAN — Indian / Pakistani / Bangladeshi features, olive-to-brown skin
  D. MIDDLE EASTERN — Persian / Arab / Lebanese / Egyptian features
  E. NORTH AFRICAN — Moroccan / Algerian / Egyptian features
  F. WEST AFRICAN — Nigerian / Ghanaian / Senegalese features, deep-brown to ebony skin
  G. EAST AFRICAN — Ethiopian / Eritrean / Somali features, tall + slender
  H. MEDITERRANEAN — Italian / Spanish / Greek / Maltese features
  I. NORTHERN EUROPEAN — Scandinavian / British / Irish / German features, fair skin
  J. LATIN AMERICAN — Mexican / Colombian / Brazilian / Argentine features
  K. PACIFIC ISLANDER — Polynesian / Hawaiian / Samoan / Maori features
  L. MIXED / FANTASY — mixed-heritage or fantasy-styled with silver / lavender / pastel-pink hair

✓ HAIR TEXTURE VARIETY — distribute across:
  • Straight long / wavy long / curly long / box-braids / cornrows / locs / afro / sleek-bob / pixie-with-detail / updo / braided crown

Anime-painterly fantasy register — describe each woman with stylized large jewel-tone eyes, glitter-and-sparkle face accents possible, painterly skin treatment, soft lush features.

Channel: anime fantasy portrait painters + Disney concept art diversity + Pinterest 'diverse beauty' boards + romantic-fantasy book covers.`,
    touchpoints: [
      'JAPANESE-FEATURED LONG-WAVY — fair-skinned Japanese-featured young woman with jet-black long-wavy hair flowing, large stylized violet-jewel eyes, soft glitter on cheekbones, delicate anime-fantasy features',
      'SOUTH ASIAN AMBER + CURLS — South Asian young woman with rich amber-tan skin, lustrous black long-curly hair, large stylized golden-amber eyes, gold-glitter on brow and collarbone',
      'WEST AFRICAN BOX-BRAIDS — West African young woman with luminous deep-ebony skin, long box-braids cascading, large stylized emerald-green eyes, gold-jewel glitter on cheekbones, regal painterly',
      'POLYNESIAN WAVY-BLACK — Polynesian young woman with golden-tan skin, long jet-black wavy hair with subtle warm-brown highlights, large stylized chocolate-amber eyes, pearl-glitter accents',
      'MEDITERRANEAN AUBURN-CURLY — Mediterranean young woman with olive-toast skin, long auburn curly hair, large stylized hazel-green eyes, soft rose-glitter cheek accents',
      'NORTHERN EUROPEAN PLATINUM — Northern European young woman with porcelain-fair skin, long platinum-blonde flowing hair, large stylized ice-blue eyes, silver-glitter face accents',
      'KOREAN SLEEK-BLACK — fair-skinned Korean-featured young woman with sleek straight black bob, large stylized doe-brown eyes, soft pink-glitter cheek accents',
      'PERSIAN DARK-WAVY — Persian young woman with warm olive-tan skin, long dark wavy hair, large stylized hazel-amber eyes with depth, gold-glitter on collarbone',
      'MOROCCAN CURLY-BROWN — North African young woman with golden-tan skin, long dark-brown curly hair, large stylized hazel-green eyes, henna-style accents on temples',
      'MEXICAN WAVY-CHOCOLATE — Latin American young woman with rich tan skin, long dark-brown wavy hair, large stylized chocolate-brown eyes, soft coral-glitter cheek accents',
      'ETHIOPIAN BRAIDED-CROWN — East African young woman with luminous brown skin, tall + slender, dark hair in braided crown, large stylized dark-amber eyes, gold-glitter accents',
      'FANTASY SILVER-WHITE — fantasy-styled young woman with porcelain skin, long silver-white flowing hair, large stylized violet-jewel eyes, silver-pearl glitter face accents',
      'PASTEL-PINK FANTASY — fantasy-styled young woman with fair skin, long pastel-pink curly hair, large stylized aqua-blue eyes, pearl-pink glitter accents',
      'SOUTH INDIAN DEEP-BROWN — South Indian young woman with deep-brown skin, long wavy black hair, large stylized amber-brown eyes, gold-tikka on forehead, henna accents',
      'BRAZILIAN BIG-CURLY — Brazilian young woman with golden-brown skin, long voluminous curly dark-brown hair, large stylized hazel-green eyes, sunkissed glow',
      'MAORI DARK-WAVY — Maori young woman with warm golden-brown skin, long dark wavy hair, large stylized dark-brown eyes, subtle traditional accents softly painted',
      'SCANDINAVIAN WHEAT-BRAID — Scandinavian young woman with fair-rose skin, long wheat-blonde braided hair, large stylized cornflower-blue eyes, silver-glitter accents',
      'EGYPTIAN ALMOND-DARK — Egyptian young woman with warm olive-amber skin, long dark hair with subtle waves, large stylized almond-shaped dark-amber eyes, gold-glitter on eyelids',
      'INDONESIAN GOLDEN-TAN — Indonesian young woman with warm golden-tan skin, long dark wavy hair, large stylized chocolate-brown eyes, soft pink-pearl glitter accents',
      'FANTASY LAVENDER-FLOWING — fantasy-styled young woman with porcelain skin, long flowing lavender-purple hair, large stylized violet-pink-jewel eyes, pearl-lavender glitter accents',
      'NIGERIAN CORNROWS — Nigerian young woman with luminous ebony skin, intricate cornrow braids forming a crown, large stylized amber eyes, gold-jewel glitter accents',
      'GREEK CHESTNUT-CURLY — Greek young woman with olive skin, long chestnut-curly hair, large stylized warm-hazel eyes, soft glitter on cheekbones',
      'CHINESE STRAIGHT-BLACK-UPDO — fair-skinned Chinese-featured young woman with sleek black hair in elegant updo, large stylized doe-brown eyes, jade-green glitter accents',
      'IRISH RED-CURLS — Irish young woman with pale-rose skin and freckles, long red-copper curls, large stylized emerald-green eyes, gold-glitter freckle-highlighting',
      'SOMALI TALL-SLENDER — Somali young woman with luminous medium-brown skin, tall + slender, long dark hair in loose-curl crown, large stylized golden-amber eyes',
      'JAMAICAN LOCS — Jamaican young woman with rich brown skin, long locs cascading, large stylized warm-amber eyes, soft pearl-glitter face accents',
      'FILIPINO WAVY-DARK — Filipino young woman with golden-tan skin, long dark-brown wavy hair, large stylized warm-brown eyes, soft pink-pearl glitter accents',
      'PUERTO-RICAN DARK-WAVY — Puerto-Rican young woman with golden-tan skin, long dark wavy hair, large stylized warm-amber eyes, sunset-glitter cheek accents',
      'ICELANDIC PLATINUM-STRAIGHT — Icelandic young woman with porcelain-fair skin, long platinum-blonde straight hair, large stylized pale-blue-grey eyes, silver-frost glitter accents',
      'INDIAN-WITH-HENNA — South Asian young woman with warm caramel skin, long dark wavy hair with floral accent, large stylized amber-brown eyes, henna-pattern on hands suggested',
    ],
    instructions: `Each entry is ONE specific beautiful young woman for the bloom-spirit portrait, 20-40 words. Format: "ETHNICITY/STYLE CAPS — primary ethnicity + skin tone + hair color/texture + eye color/feature + glitter accent". DISTRIBUTE EVENLY across the 12 ethnicity categories AND the 11 hair-texture types. Anime-painterly register. NEVER men / children / elders / multiple figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit path: bloom_gown (couture floral dress + matching hair-floral) ───
  bloombot_bloom_spirit_bloom_gown: {
    format: 'simple',
    theme: `COLOR-THEMED COUTURE FLORAL GOWNS for the BloomBot bloom-spirit path. Each entry is ONE COLOR-THEMED MULTI-SPECIES gown design where the entire dress is DRENCHED/PLASTERED/SUBMERGED in overwhelming bloom-mass. DESCRIBES ONLY THE DRESS. Each entry 30-70 words.

⚠️ EXTREME OVERWHELMING DENSITY — every gown is so DRENCHED in flowers the fabric silhouette is BARELY VISIBLE beneath the floral mass. From neckline to hem to train — thousands of overlapping blooms.

⚠️ MULTI-SPECIES MANDATE — every entry uses 3-6 DIFFERENT flower species mixed in a coordinated COLOR THEME (never a single-species gown).

⚠️ COLOR-THEME MANDATE — use these themes:
  • SUNSET (red/orange/pink/coral/gold) | TWILIGHT PURPLES | BLUSH PINKS | MONOCHROME WHITE
  • RAINBOW EXPLOSION | PINK + WHITE COTTAGE | PURPLE + WHITE ROYAL | CORAL + PEACH PARADISE
  • DEEP BURGUNDY + WINE | GOLD + AMBER + COPPER | OCEAN COOL | EMERALD FOREST
  • MAGIC PASTEL CANDY | TROPICAL BOLD | AUTUMN HARVEST | DUSK FIRE
  • BLUE + WHITE COASTAL | PINK + GOLD | VIOLET + CREAM | NAVY + BURGUNDY

✓ GOWN SILHOUETTE VARIETY (rotate across):
  Strapless ball / Off-shoulder / Halter-neck / Corset + layered skirt / A-line / Mermaid / Empire-waist / Backless / Caped overlay / Sleeved ball / High-neck choker / Princess full-skirt

🚫 STRICT BANS:
  • NO hair / hair-crown / matching hair references (hair is separate axis)
  • NO single-species gowns
  • NO modern / corporate / casual fashion
  • NO 'some flowers on a dress' — every inch DRENCHED`,
    touchpoints: [
      'SUNSET BALL GOWN — strapless couture bodice DRENCHED with overlapping red roses + coral peonies + orange ranunculus + yellow daisies + golden marigolds, full ball-skirt cascading sunset-spectrum florals to the floor in extreme density',
      'TWILIGHT PURPLE MERMAID — mermaid silhouette PLASTERED with lavender wisteria + violet anemones + blue bluebells + periwinkle iris + indigo sweet-pea, every inch of fabric buried beneath twilight floral cascade',
      'BLUSH PINK PRINCESS — princess full-skirt gown DRENCHED in soft pink peonies + blush roses + cream ranunculus + ivory jasmine + pale-blush cabbage roses, fabric barely visible under blush cascade',
      'MONOCHROME WHITE BRIDAL — strapless couture ball PLASTERED in white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore, snow-white floral overwhelming cascade',
      'RAINBOW EXPLOSION GOWN — A-line gown DRENCHED with rainbow of red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones, vibrant full-spectrum cascade',
      'PINK + WHITE COTTAGE BALL — off-shoulder ball PLASTERED with soft pink garden roses + white peonies + pale blush ranunculus + jasmine + tiny pink gypsophila in cottage-romantic overwhelming cascade',
      'PURPLE + WHITE ROYAL GOWN — backless gown DRENCHED in royal purple irises + white roses + violet anemones + pearl gardenias + lavender sweet-pea in dramatic purple-and-white cascade',
      'CORAL PEACH PARADISE MERMAID — mermaid silhouette PLASTERED with coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds in warm tropical cascade',
      'BURGUNDY WINE BALL — corset + layered skirt DRENCHED in burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla in dramatic wine-spectrum cascade',
      'GOLD AMBER COPPER COUTURE — halter-neck gown PLASTERED with golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze chrysanthemums in massive metallic cascade',
      'OCEAN COOL EMPIRE — empire-waist gown DRENCHED in aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam hellebore + pearl-white roses in cool ocean-spectrum cascade',
      'EMERALD FOREST GOWN — A-line gown PLASTERED with green hellebore + white daisies + pale yellow primrose + lavender sweet-pea + emerald succulents in forest-spirit cascade',
      'PASTEL CANDY EXPLOSION — princess full-skirt DRENCHED in pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms in cotton-candy overwhelming cascade',
      'TROPICAL BOLD STORM GOWN — mermaid silhouette PLASTERED with hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger',
      'AUTUMN HARVEST GOWN — off-shoulder ball DRENCHED in rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos in autumn cascade',
      'DUSK FIRE COUTURE — strapless ball DRENCHED in deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias in dusk-fire spectrum cascade',
      'BLUE + WHITE COASTAL — caped overlay gown PLASTERED with sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue in coastal cascade',
      'PINK + GOLD ROMANCE — corset gown DRENCHED in soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea in romantic cascade',
      'VIOLET + CREAM ETHEREAL — empire-waist gown PLASTERED with violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea',
      'CHERRY BLOSSOM PRINCESS — princess ball PLASTERED with pink + white cherry blossom petals + pink camellias + cream magnolias in cherry-blossom overwhelming cascade',
      'RED + BURGUNDY DRAMA GOWN — corset gown DRENCHED in deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus in dramatic cascade',
      'YELLOW MEADOW SUN GOWN — A-line gown PLASTERED with yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine chrysanthemums',
      'LILAC + BABY-BLUE SPRING — off-shoulder gown DRENCHED in lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots in soft-pastel spring cascade',
      'TEAL + ROSE-GOLD VINTAGE — caped overlay gown PLASTERED with teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies',
      'BLACK ROSE + WHITE GOTH — strapless corset DRENCHED in dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore',
      'PEACH + CREAM SOFT — empire-waist gown PLASTERED with peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias',
      'MAGENTA + ORANGE BOLD — mermaid silhouette DRENCHED with hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea',
      'COOL MINT + WHITE — A-line gown PLASTERED with mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus',
      'BUTTER YELLOW + BLUSH — princess ball DRENCHED in butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums',
      'INDIGO + VIOLET DEEP — corset gown PLASTERED with indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias in dramatic deep-purple cascade',
      'ORANGE + CORAL TROPICAL — halter-neck gown DRENCHED in bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset bougainvillea',
      'BLUSH + DUSTY-PINK ROMANCE — caped overlay gown PLASTERED with soft blush garden roses + dusty-pink peonies + pale pink ranunculus + cream-blush cabbage roses + baby-pink sweet-pea',
      'WHITE + CHAMPAGNE BRIDAL — strapless ball DRENCHED in white roses + cream peonies + champagne-blush ranunculus + ivory dahlias + pearl-white gardenias with rose-gold highlights',
      'EMERALD + GOLD LUXE — empire-waist gown PLASTERED with emerald-green hellebore + golden marigolds + amber dahlias + cream-gold ranunculus + green-and-gold succulents',
      'PEACH + LAVENDER DREAM — off-shoulder ball DRENCHED with peach garden roses + lavender sweet-pea + apricot ranunculus + soft pale-purple anemones + cream-peach peonies',
      'CRIMSON + BLACK DRAMATIC — backless corset PLASTERED with crimson roses + dark-burgundy dahlias + black-purple anemones + deep red ranunculus + dark crimson peonies',
      'POWDER BLUE + PINK FAIRY — princess ball DRENCHED in powder-blue forget-me-nots + soft pink peonies + pale-rose ranunculus + cream-white roses + baby-blue hydrangeas',
      'AMBER + COPPER METALLIC — high-neck choker gown PLASTERED with amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses',
      'NEON PINK + PURPLE — mermaid silhouette DRENCHED in bright neon-pink garden roses + electric-purple anemones + magenta dahlias + hot-pink peonies + saturated violet sweet-pea',
      'CHARCOAL + IVORY GOTHIC — empire-waist gown PLASTERED with charcoal-grey hellebore + ivory roses + black-violet anemones + cream-grey ranunculus + pale-ivory dahlias',
      'TURQUOISE + CORAL TROPICAL — caped overlay DRENCHED with turquoise hydrangeas + coral hibiscus + aqua-blue forget-me-nots + warm coral peonies + bright sea-glass succulents',
      'PALE PINK + GREEN GARDEN — A-line gown PLASTERED with pale-pink garden roses + emerald-green hellebore + soft mint succulents + cream-pink peonies + leafy eucalyptus',
      'RUBY + GOLD ROYAL — corset + layered skirt DRENCHED in ruby-red roses + gold-amber dahlias + crimson ranunculus + warm-gold marigolds + dark-red peonies',
      'MIDNIGHT BLUE + SILVER — strapless ball PLASTERED with midnight-blue irises + silver-grey hellebore + dark-violet anemones + ice-blue forget-me-nots + pearl-silver ranunculus',
      'CANDY APPLE RED + CREAM — princess full-skirt DRENCHED in candy-apple red roses + cream-white peonies + crimson ranunculus + ivory gardenias + pearl-pink sweet-pea',
      'SUNRISE PEACH GOLD ROSE — empire-waist gown PLASTERED with sunrise-peach garden roses + golden-amber dahlias + rose-pink peonies + cream-white ranunculus + warm-peach plumeria',
      'NAVY + BURGUNDY AUTUMN — backless gown DRENCHED in navy-blue irises + burgundy dahlias + dark-violet anemones + deep-crimson ranunculus + maroon peonies',
      'BABY PINK + CREAM SOFT — off-shoulder princess gown PLASTERED with baby-pink roses + cream peonies + pale-blush ranunculus + ivory ranunculus + pearl-pink hellebore',
      'BRONZE + PLUM AUTUMN — corset gown DRENCHED with bronze-orange chrysanthemums + plum dahlias + ruby-wine cosmos + amber ranunculus + dark-russet peonies',
      'IRIDESCENT FAIRY PASTEL — caped overlay gown PLASTERED with iridescent pastel mix of mint + lavender + baby-blue + cream-yellow + pearl-pink in extreme fairy-cascade',
    ],
    instructions: `Each entry is ONE COLOR-THEMED MULTI-SPECIES COUTURE FLORAL GOWN, 30-70 words. Format: "COLOR-THEME + SILHOUETTE NAME CAPS — gown silhouette DRENCHED/PLASTERED with [3-6 named flower species] in [color theme], fabric barely visible under floral cascade". MULTI-SPECIES + COLOR-THEMED + OVERWHELMING density. Never single-species. NEVER mention hair. Output as a NUMBERED list, one per line.`,
  },

  bloombot_bloom_spirit_garden_backdrop: {
    format: 'simple',
    theme: `BEAUTIFUL FLOWER-GARDEN BACKDROPS for the BloomBot bloom-spirit path. Each entry is ONE specific lush, magical, dreamy garden / courtyard / pergola setting that sits in SOFT-FOCUS BOKEH behind the portrait subject. Each entry 20-40 words.

⚠️ MANDATORY — every backdrop is BEAUTIFUL + LUSH + dreamy. Rendered in SOFT-FOCUS BOKEH (shallow depth-of-field) so it inspires the mood without competing with the woman for focus.

🚫 STRICT BANS:
  • NO modern / corporate / urban backdrops
  • NO horror / dark / morbid settings
  • NO empty / desolate / minimalist
  • NO ruins / abandoned structures (reclaim's territory)
  • NO interiors / rooms (cozy's territory)
  • NO additional humans / figures in the backdrop

✓ BACKDROP CATEGORIES:
  A. WISTERIA PERGOLA — hanging racemes overhead in soft bokeh
  B. ROSE GARDEN — formal rose-garden cascading rose-walls
  C. BLUEBELL FOREST — bluebell forest understory with shafts of light
  D. CHERRY-BLOSSOM GROVE — full bloom, petals falling
  E. LILAC GROVE — purple cone-clusters overhead
  F. TROPICAL LAGOON GARDEN — palms + tropical-bloom edges
  G. WALLED GARDEN — old walled-garden with climbing-bloom
  H. MEADOW WILDFLOWER — wildflower meadow stretching back in golden bokeh
  I. JAPANESE GARDEN — cherry blossom + koi pond
  J. MOROCCAN COURTYARD — central fountain + bloom-mass on walls
  K. MEDITERRANEAN VILLA — bougainvillea cascades + cypress
  L. HYDRANGEA GARDEN — massive blue-and-pink blooms
  M. MAGICAL FAIRY GLEN — soft-glowing bioluminescent-style blooms
  N. DAHLIA GARDEN — massive blooms of all colors
  O. JASMINE PERGOLA — white-cascade trailing

All backdrops in DREAMY SOFT-FOCUS — never sharp / detailed, always blur-bokeh that suggests rather than declares.

Channel: Pinterest 'fairy garden' boards + Studio Ghibli garden backdrops + bridal-photography garden venues + Pre-Raphaelite painted-garden backgrounds.`,
    touchpoints: [
      'WISTERIA-PERGOLA TUNNEL — wisteria-pergola tunnel with hanging purple racemes overhead in soft-bokeh blur, dappled light filtering through, romantic depth-of-field background',
      'BLUEBELL-FOREST UNDERSTORY — bluebell-forest floor in soft-bokeh blur, vertical sun-shafts piercing the canopy, deep-blue carpet receding into dreamy haze',
      'CHERRY-BLOSSOM GROVE — cherry-blossom tree grove in full pink-bloom, petals falling through the air in soft-bokeh, magical romantic backdrop',
      'LILAC GROVE — lilac-tree grove with massive purple cone-clusters hanging overhead in soft-bokeh, dreamy lavender backdrop',
      'TROPICAL LAGOON GARDEN — tropical lagoon edge with palm-fronds and tropical-bloom cascades in soft-bokeh haze, turquoise water glimpsed in deep blur',
      'WALLED-GARDEN STONE — old walled-garden interior with climbing-rose mass on weathered stone walls in soft-bokeh, sun-warmed atmosphere',
      'WILDFLOWER-MEADOW GOLDEN — wildflower meadow stretching into soft-golden bokeh behind, golden-hour light, dreamy depth-of-field',
      'JAPANESE-GARDEN CHERRY + KOI — Japanese garden with cherry-blossom and koi-pond in soft-bokeh, traditional stone-lantern glimpse, magical hush',
      'MOROCCAN COURTYARD FOUNTAIN — Moroccan courtyard with central tile-fountain and bougainvillea cascade on walls in soft-bokeh, warm amber atmosphere',
      'MEDITERRANEAN BOUGAINVILLEA VILLA — Mediterranean villa with cascading magenta-bougainvillea + cypress silhouette in soft-bokeh, sun-warmed golden light',
      'HYDRANGEA GARDEN MASS — formal hydrangea garden with massive blue-and-pink blooms in soft-bokeh blur, dreamy floral wall',
      'MAGICAL FAIRY GLEN — soft-glowing magical fairy glen with bioluminescent-style blooms in soft-bokeh, fireflies, ethereal lighting',
      'DAHLIA GARDEN MULTI-COLOR — dahlia garden with massive blooms of coral / amber / wine / cream in soft-bokeh, dreamy floral abundance',
      'JASMINE PERGOLA TUNNEL — jasmine-pergola with white-jasmine cascades trailing overhead in soft-bokeh, romantic moonlit atmosphere',
      'PEONY GARDEN ABUNDANCE — formal peony garden with massive cabbage-rose-style peonies in pink-and-white in soft-bokeh blur',
      'TUSCAN HILL-GARDEN — Tuscan hill-garden with terraced bloom-beds and distant cypress in soft-bokeh, warm Italian-light',
      'BRITISH COTTAGE-GARDEN — British cottage-garden with delphiniums + foxgloves + roses in soft-bokeh, romantic English-garden mood',
      'GREEK ISLAND TERRACE — Greek-island terrace with whitewashed walls + bougainvillea cascade + sea-glimpse in soft-bokeh',
      'BAMBOO-GROVE ZEN — bamboo-grove zen garden with dappled light through canes in soft-bokeh, serene atmosphere',
      'AURORA NIGHT-GARDEN — magical night-garden under aurora-like color-curtain in soft-bokeh, glowing bioluminescent blooms',
    ],
    instructions: `Each entry is ONE specific BEAUTIFUL GARDEN / COURTYARD BACKDROP in soft-focus bokeh, 20-40 words. Format: "BACKDROP NAME CAPS — primary garden setting + lush bloom features + soft-bokeh / dreamy depth-of-field note". Vary across the 15 categories. ALWAYS dreamy / lush / magical mood. NO modern / urban / horror. NO additional figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_bloom_spirit_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED BLOOM-SPIRIT ATMOSPHERIC PHENOMENA. Each entry is ONE specific magic-moment element rendered within the painted portrait. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the magical/dreamy mood. Sparkle / glitter / firefly / butterfly / petal-fall / pollen — never harsh or realistic-weather.

🚫 STRICT BANS:
  • NO humans / additional figures
  • NO horror / ominous elements
  • NO realistic-weather (rain / snow / wind) — too earthly
  • NO duplicate of woman / gown / backdrop content
  • NO cartoon / sticker / glitch effects

✓ PHENOMENON CATEGORIES:
  A. SPARKLE / GLITTER — floating around her / on her shoulders / magical-particle halo
  B. BUTTERFLY — perched on shoulder / mid-flight near face / cluster in backdrop
  C. HUMMINGBIRD — hovering at a bloom on her dress / flower in her hair
  D. FIREFLY — floating around her at twilight / glow-cloud around her hair
  E. PETAL-FALL — drifting around her / petal-rain from bloom-canopy
  F. POLLEN-GLOW — golden pollen-cloud in the side-light
  G. MAGICAL LIGHT-RIM — soft luminous halo glow / rim-light from behind
  H. SOFT FOCUS BOKEH-LIGHT — soft bokeh-light circles in backdrop / magic-light
  I. DEW-PETAL — fine dewdrops on the gown petals / morning-dew sparkle
  J. AURORA GLOW — soft aurora-like color-glow in upper backdrop
  K. MOONBEAM — soft moonbeam falling on her face / moonlight halo
  L. FIRE-GLOW LANTERN — soft warm lantern-glow / candle-glow on face

Channel: Disney 'Cinderella' magical-fairy-dust + Studio Ghibli 'Howl's Moving Castle' sparkle moments + Pinterest 'magical fantasy portrait' boards.`,
    touchpoints: [
      'SOFT GLITTER-CLOUD HALO — soft magical glitter-cloud floating around her in suspended sparkle-particles, individual gold-and-silver glints catching the cinematic light',
      'BUTTERFLY ON SHOULDER — solitary jewel-iridescent butterfly perched delicately on her bare shoulder, wings catching the soft light, magical-realism moment',
      'HUMMINGBIRD AT DRESS-BLOOM — solitary jewel-iridescent hummingbird hovering at a specific bloom on her gown, wings a transparent blur, intimate moment',
      'FIREFLY CLOUD AT TWILIGHT — soft cloud of fireflies floating around her at twilight, hundreds of green-pulse lights at every depth, magical glow',
      'PETAL-RAIN FROM ABOVE — gentle petal-rain drifting from a bloom-canopy above her, individual petals suspended in slow-motion through the soft light',
      'GOLDEN POLLEN-CLOUD — visible golden pollen-cloud dispersing in side-light around her, individual pollen-motes catching the warm light',
      'MAGICAL RIM-LIGHT HALO — soft luminous halo glow outlining her silhouette from behind, ethereal back-light creating a magical-aura',
      'BOKEH-LIGHT CIRCLES — soft dreamy bokeh-light circles floating in the deep backdrop, depth-of-field magic-light pattern, romantic atmosphere',
      'DEW-PETAL SPARKLE — fine morning-dewdrops on every petal of her bloom-gown catching the light in glittering points',
      'AURORA COLOR-GLOW — soft aurora-like color-glow in the upper backdrop above her, ethereal magic-light register, painted register',
      'MOONBEAM ON FACE — soft moonbeam falling on her face from above, the rest of the scene in cool twilight blue, moonlit-magic portrait',
      'WARM LANTERN-GLOW — soft warm Moroccan-lantern glow from a nearby lantern catching one side of her face in amber, the other side in cool shadow',
      'BUTTERFLY-CLUSTER BACKDROP — small cluster of butterflies in soft-bokeh the backdrop behind her, wings catching the light, magical realism',
      'SPARKLE-DUST IN HAIR — sparkle-dust scattered through her hair-flower-mass, individual glitter-points catching the light at every wave',
      'FROZEN PETAL MID-FALL — single petal frozen mid-fall in front of her face in the foreground, motion-frozen by the painter, romantic moment',
      'ETHEREAL MIST DRIFT — soft ethereal mist drifting around her ankles / lower bodice in slow-motion, the upper portrait in clear focus',
      'GOLDEN-HOUR FIRE-RAY — single warm golden-hour fire-ray slanting from the upper-left across her face, jewel-tone glow on her cheek',
      'MAGICAL-DUST GALAXY — vast suspended magical-dust galaxy around her with thousands of tiny sparkle-points at every depth, dreamlike density',
      'WHITE-MOTH NIGHT MOMENT — solitary white-moth perched on a bloom in her hair at night, wings translucent in the moonlight, intimate detail',
      'CRYSTAL-PRISM LIGHT — small crystal-prism light fragments scattered across her face from an off-frame source, rainbow-glints',
    ],
    instructions: `Each entry is ONE specific MAGIC-MOMENT atmospheric phenomenon for the bloom-spirit portrait, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in scene + lighting note". Vary across the 12 categories. ALWAYS magical / dreamy / soft register. NO humans / horror / harsh weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: tropical_setting (the biome canvas) ───
  bloombot_tropical_paradise_tropical_setting: {
    format: 'simple',
    theme: `TROPICAL PARADISE SETTINGS for the BloomBot tropical-paradise path. Each entry is ONE specific tropical paradise biome where massive showy flowers thrive — beach, lagoon, coastal cove, waterfall pool, atoll, jungle, cloud-forest, or any other paradise context where tropical blooms are the hero. Each entry 30-60 words.

⚠️ MANDATORY — every entry must be IDENTIFIABLY TROPICAL PARADISE — palms / sea / lagoon / waterfall / jungle / coastal-sand / coconut-grove / bloom-laden vegetation. NOT exclusively rainforest. Wide cinematic shot showing deep recession (humid jungle haze OR salt-haze over open water OR mist around waterfalls). Massive showy tropical flowers are the heroes; the setting is the canvas they grow against.

🚫 STRICT BANS — these belong to other BloomBot paths or are wrong for tropical-paradise:
  • NO temperate / alpine / desert / arctic / tundra / mediterranean cottage / english garden
  • NO urban / city streets / Mediterranean alleys (city-flowers)
  • NO ruins / abandoned structures as PRIMARY subject (reclaim) — Mayan/Khmer ruin HINTS are FINE
  • NO interiors / rooms (cozy)
  • NO conservatory architecture / glass-and-iron (conservatory)
  • NO archways/pergolas as the FRAMING (garden-walk) — natural lagoon arches / banyan tunnels are FINE
  • NO surreal / floating / gravity-defying (dreamscape)
  • NO macro / closeup framing (closeup) — this is WIDE cinematic
  • NO landform-as-canvas WITHOUT tropical vegetation (landscape territory)
  • NO humans / figures / silhouettes / shadows of people / boats with sailors / hands

✓ MANDATORY VARIETY — distribute roughly across these PARADISE CATEGORIES (REBALANCE — don't over-index on rainforest understory):
  • **BEACH + COAST (~30% of entries)** — palm-fringed white-sand beach with bloom-edge / coconut grove sloping to sea / tropical sea-cliff with hibiscus + plumeria-tree / atoll-edge with frangipani / coastal-cove with bloom-shrubs at the tide line / volcanic-black-sand beach with tropical blooms / sand-dune transition to jungle / palm-shaded beach-cove / tropical-strand with sea-grape and beach morning-glory / tide-pool edge with bloom-cluster behind / coral-island white-sand spit
  • **LAGOON + WATER PARADISE (~25%)** — turquoise lagoon with bloom-laden inner shore / volcanic crater-lagoon / over-water bloom-bungalow scene (NO bungalow, just the water-and-bloom setting) / atoll lagoon with mangrove-and-bloom edge / hidden lagoon ringed by bloom-cliffs / coral lagoon with bloom-island in the middle / tidal-pool with tropical blooms massed at edge
  • **WATERFALL + POOL (~20%)** — tropical waterfall plunging into bloom-ringed pool / cascading multi-tier waterfall with bloom on every shelf / hidden grotto-waterfall with bloom-cliffs / cenote with bloom-edges and waterfall feeding it / cloud-forest waterfall / volcanic hot-spring with tropical blooms / freshwater jungle pool with hanging vines and lily-pads
  • **RAINFOREST + JUNGLE (~15%)** — rainforest understory with canopy shafts / banyan-clearing / heliconia thicket / banana-grove / cloud-forest ridge / jungle-stream-bend
  • **MIXED / MANGROVE / OTHER (~10%)** — mangrove tidal swamp / bromeliad-laden old-growth tree / philodendron-covered cliff / jungle-ruin bloom-reclaim / sunlit clearing / waterlily-lagoon / palms-and-passion-vine grove

⚠️ DO NOT OVER-INDEX on rainforest understory / banyan / banana-grove — those are ONE FIFTH of the variety. Beach + coast + lagoon + waterfall scenes are the MAJORITY.

Lineage to channel: Hawaiian / Tahitian / Maldivian / Bali / Caribbean / Polynesian / Costa Rican paradise photography + Planet Earth tropical-coast scenes + Avatar Pandora establishing shots + Studio Ghibli ocean-and-jungle magic + National Geographic tropical-paradise features + James Cameron's Avatar Way of Water + Endless Summer surf-cinematography (without the surfers).`,
    touchpoints: [
      'RAINFOREST UNDERSTORY WITH CANOPY SHAFTS — dense rainforest floor under towering buttress-root tree canopy, vertical sun-shafts piercing the green gloom and pooling on specific bloom-patches below, ferns and moss carpeting the floor, atmospheric haze in the deep distance',
      'JUNGLE POOL WITH HANGING VINES — freshwater jungle pool surrounded by hanging vines and giant philodendron leaves, water-lilies covering the surface, bloom-laden vegetation crowding the edges, reflection of canopy above',
      'VOLCANIC-ISLAND CLIFF ABOVE LAGOON — basalt sea-cliff descending to turquoise lagoon below, bloom-laden cliff-edge with frangipani and bird-of-paradise, palms tilting from the rim, distant volcanic peak in deep haze',
      'BANYAN-ROOT CLEARING — old banyan clearing with massive aerial-root columns descending from the canopy to the floor, strangler-fig curtains, dappled understory light through high canopy openings, bloom-mass between the root pillars',
      'MANGROVE TIDAL SWAMP — mangrove forest in tidal salt water with stilt-roots descending into the shallows, floating blooms drifting on the brackish water, low tropical haze, mud-flats glistening at edge',
      'CLOUD-FOREST WATERFALL WITH MOSSY BOULDERS — high-elevation cloud-forest waterfall cascading over moss-covered boulders, mist-saturated air, hanging orchids on the cliff-walls, foreground ferns soaked in spray',
      'BANANA-GROVE PATH — banana-grove with massive broad-green banana-leaves arching overhead into a leaf-tunnel, bloom-clusters between the smooth banana-trunks, dappled canopy-light filtering through the broad foliage',
      'HELICONIA THICKET AT VIEWER LEVEL — dense heliconia and torch-ginger thicket at viewer eye-level, jungle wall receding into deep humid blur, fern-fronds and broad leaves overlapping foreground, sun catching the petal-edges',
      'STREAM-EDGE TROPICAL — clear jungle stream flowing over mossy rocks with tropical blooms massing on both banks, dappled canopy-light above, ferns and palms framing the water-corridor, atmospheric haze in deep distance',
      'CENOTE TROPICAL SPRING — natural cenote / tropical hot-spring with steam rising from turquoise water, tropical bloom-edges, hanging vines descending from the rim, light shafts piercing the steam',
      'EPIPHYTE-LADEN OLD-GROWTH TREE — single massive old-growth tropical tree trunk in foreground, covered with epiphytes / bromeliads / hanging orchids / mosses / lichens, jungle receding behind into humid haze',
      'JUNGLE-RUIN BLOOM-RECLAIM — moss-covered Mayan / Khmer / Angkor-style stone block partially visible at the jungle floor in midground, blooms and vines reclaiming the carved surface, dense tropical canopy above',
      'OPEN-CANOPY SUNBEAM CATHEDRAL — large break in the rainforest canopy where vertical sun-shafts bloom down onto a bloom-rich forest-floor opening, vapor-laden beams visible in the humid air, ferns and orchids in the gold',
      'PHILODENDRON-COVERED CLIFF — vertical cliff-wall draped in massive philodendron + monstera + climbing-vine mass, hanging orchids and bromeliads on the rock, jungle floor below in soft humid blur',
      'CLOUD-FOREST RIDGE — cloud-forest ridge in early morning with low mist drifting through the canopy, orchid-laden epiphytes on every branch, blooms catching first light at the ridge-top, valley below disappearing into mist',
      'WATERLILY-LAGOON — wide tropical lagoon completely covered in giant water-lilies and lotus, tropical bloom-edge on the banks, palms tilted at the water-line, distant rainforest receding into haze',
      'SUNLIT JUNGLE CLEARING — bright sunlit clearing in the rainforest with grass + flowering shrubs at ground level, towering rainforest wall surrounding the clearing on all sides, butterflies in the warm air, broad-leaf canopy framing above',
      'PALMS-AND-PASSION-VINE — palm grove with passion-flower vines spiraling up the trunks, broad ferns at the base, dappled canopy light, distant rainforest wall in deep humid blur',
      'BROMELIAD-CHANDELIER OLD GROWTH — old-growth rainforest tree with bromeliads forming chandelier-clusters at branch joints, hanging orchids cascading, epiphyte-mass at every fork, jungle floor below in shadow',
      'TROPICAL-RIVER BEND — tropical river bend with sand-bank in midground, dense rainforest descending to the water on both banks, blooms massing at the water-edge, low river-mist hugging the surface',
    ],
    instructions: `Each entry is ONE specific TROPICAL PARADISE SETTING, 30-60 words. Format: "SETTING NAME CAPS — primary paradise biome features + identifiable tropical vegetation OR coastal/water features + atmospheric depth-recession (humid haze OR salt-haze OR mist)". REBALANCE — ~30% beach/coast, ~25% lagoon/water, ~20% waterfall/pool, ~15% jungle/rainforest, ~10% mangrove/mixed. ALWAYS identifiably tropical (palms / hibiscus / plumeria / frangipani / banana / sea-grass / coconut-grove / mangrove / etc.). NEVER temperate / alpine / desert / arctic. NO people, NO boats with sailors, NO huts with hands. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: vegetation_anchor (the paradise scaffolding) ───
  bloombot_tropical_paradise_vegetation_anchor: {
    format: 'simple',
    theme: `TROPICAL PARADISE VEGETATION ANCHORS for the BloomBot tropical-paradise path. Each entry is ONE specific tropical-vegetation scaffolding element that gives the paradise scene its identifiable tropical structure — coastal palms, beach flora, jungle vegetation, lagoon plants, anything that reads "tropical paradise". Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a TROPICAL VEGETATION TYPE that scaffolds the bloom hero. Not the blooms themselves — the surrounding green that says "tropical paradise". Cover BOTH coastal/beach contexts AND jungle contexts.

🚫 STRICT BANS:
  • NO temperate trees (oak / pine / birch / maple) — except where mentioned as a contrast
  • NO buildings / architecture / sails / boats (not the paradise's job)
  • NO people / hands / figures
  • NO duplication of tropical_setting content — this is about specific PLANT FORMS not the whole biome

✓ VEGETATION-ANCHOR CATEGORIES — REBALANCE for coast + jungle:
  • **COASTAL PALMS (~25%)** — coconut palm / royal palm / fishtail palm / fan palm / date palm / sea-palm / areca palm / palm-grove fringing a beach
  • **COASTAL / BEACH FLORA (~20%)** — frangipani tree / plumeria / hibiscus shrub / sea-grape / beach morning-glory / sea-grass / pandanus screw-pine / oleander / bougainvillea cascade over coastal wall
  • **JUNGLE PALMS + BANANA + GINGER (~15%)** — banana plant / heliconia clump / bird-of-paradise plant / ginger plant / canna / strelitzia
  • **JUNGLE VEGETATION (~15%)** — banyan tree / strangler-fig / aerial-root curtain / buttress-root tree / climbing philodendron / monstera / split-leaf foliage
  • **EPIPHYTE / ORCHID / BROMELIAD (~10%)** — moss-covered branches / epiphyte-laden tree / bromeliad-clusters / hanging orchid mass
  • **FERN + CYCAD + BAMBOO (~10%)** — tree-fern grove / staghorn fern / bromeliad-pineapple / pandanus / bamboo thicket
  • **MANGROVE + AQUATIC (~5%)** — mangrove stilt-roots / mangrove pneumatophores / lotus-and-waterlily mats / coastal sea-grass beds

Channel: Hawaiian / Tahitian / Bali / Caribbean / Polynesian tropical-paradise plantings + Planet Earth tropical-paradise close-ups + James Cameron's Avatar Way of Water + Endless Summer beach-fringe vegetation + Studio Ghibli paradise plants.`,
    touchpoints: [
      'COCONUT PALMS TILTING — cluster of coconut palms tilting outward at varying angles, fronds catching dappled sun, trunks ringed with old leaf-bases, distant jungle in soft humid blur',
      'BANANA-GROVE WITH BROAD LEAVES — banana-plant grove with massive broad-green leaves arching overhead and to the sides, smooth pale trunks visible behind, dappled canopy-light filtering through the broad foliage',
      'BANYAN AERIAL ROOTS — massive banyan tree with aerial roots descending in vertical columns to the jungle floor, strangler-fig curtains, dappled understory light, blooms between the root pillars',
      'MONSTERA-CLAD TRUNK — old-growth trunk in foreground completely clad in climbing monstera-and-philodendron with split-leaf foliage and aerial roots, the trunk barely visible behind the vine-curtain',
      'TREE-FERN GROVE — Jurassic-feel grove of old tree-ferns with massive umbrella-fronds arching overhead and surrounding the camera, cool dappled understory light, mossy boulders at the base',
      'HANGING LIANA CURTAIN — vertical curtain of hanging lianas and vines descending from canopy to the jungle floor, swaying slightly in humid air, blooms threaded through the curtain, atmosphere in the deep behind',
      'EPIPHYTE-LADEN OLD BRANCH — single massive horizontal branch in foreground covered with bromeliads / hanging orchids / mosses / staghorn ferns at every fork, jungle below in soft shadow',
      'BROMELIAD-CHANDELIERS — bromeliad-cluster chandeliers at every branch joint of an old-growth rainforest tree, water pools visible in some bromeliad rosettes, hanging orchids cascading from the same fork',
      'BAMBOO GROVE — dense bamboo grove with tall green canes filling the frame, gentle bamboo-rustle in tropical breeze implied, dappled canopy light filtering through the cane-tops',
      'MANGROVE STILT-ROOTS — mangrove stilt-roots descending into shallow tidal water, mud-flats glistening between the roots, mangrove canopy above in soft humid haze',
      'GIANT KAPOK TREE — towering jungle kapok / ceiba / silk-cotton tree with massive buttress-roots, the trunk continuing upward beyond the upper frame, smaller jungle vegetation at the buttress-base',
      'CYCAD-AND-BROMELIAD GARDEN — primordial cycad-and-bromeliad garden floor, leathery cycad fronds and rosette-bromeliads massing at ground level, larger jungle vegetation looming above in shallow blur',
      'PANDANUS SCREW-PINE — pandanus / screw-pine cluster with spiral leaves and stilted prop-roots, distinctively tropical silhouette, jungle wall behind in soft humid blur',
      'STAGHORN FERN COLONY — staghorn-fern colony attached to a vertical tree-trunk, antler-shaped fronds extending outward, smaller epiphytes at the base of the colony',
      'COCONUT-PALM CANOPY — view UP at a coconut-palm canopy with green-and-yellow fronds radiating outward like a wheel, coconuts clustered at the crown, sky glimpsed between the fronds',
    ],
    instructions: `Each entry is ONE specific TROPICAL VEGETATION TYPE that scaffolds the jungle scene, 20-40 words. Format: "VEGETATION NAME CAPS — primary plant form + secondary detail + how it sits in the jungle frame". Vary across the 12 categories above. ALWAYS tropical. NEVER temperate / alpine / arctic / desert. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: surprise_creature (60%-gated wildlife) ───
  bloombot_tropical_paradise_surprise_creature: {
    format: 'simple',
    theme: `60%-GATED TROPICAL WILDLIFE SURPRISES for the BloomBot tropical-paradise path. Each entry is ONE specific small tropical creature that adds life to the jungle scene as a peripheral subject. Each entry 20-40 words.

⚠️ MANDATORY — every creature is SMALL relative to the scene, peripheral, second-look reward — NEVER primary subject. Must be IDENTIFIABLY TROPICAL.

🚫 STRICT BANS:
  • NO humans / figures
  • NO temperate wildlife (deer / squirrel / fox / hawk — wrong biome)
  • NO predator-of-people / big cats stalking the frame (too dramatic)
  • NO duplication of vegetation_anchor content — this is creature, not plant

✓ TROPICAL-CREATURE CATEGORIES:
  A. **TROPICAL BIRD** — toucan / parrot / macaw / hummingbird / hornbill / quetzal / lorikeet / bird-of-paradise (bird) / kingfisher / hoatzin
  B. **POISON-DART FROG / TREE-FROG** — neon-blue poison-dart frog / red-eyed tree-frog / glass-frog / golden-frog
  C. **REPTILE** — iguana / chameleon / gecko / anole / basilisk-lizard
  D. **INVERTEBRATE — INSECT** — blue morpho butterfly / atlas moth / orchid mantis / leaf insect / stick insect / glass-wing butterfly
  E. **INVERTEBRATE — ARACHNID** — peacock spider / colorful jumping spider / pink-toed tarantula (peripheral only)
  F. **SMALL MAMMAL** — tree-frog small monkey peeking / sloth on a branch / coati / agouti / kinkajou
  G. **POLLINATOR — TROPICAL BEE** — orchid bee / stingless bee / sweat bee
  H. **AQUATIC** — koi at pond's edge / tropical fish glimpsed under water-lilies / freshwater turtle / small caiman at water's edge
  I. **HUMMINGBIRD-AT-BLOOM** — solitary tropical hummingbird hovering at a heliconia / hibiscus / passion-flower
  J. **PARROT-ON-BRANCH** — solitary parrot / lorikeet / cockatoo perched at a branch with bloom-clusters nearby

Channel: Planet Earth tropical close-ups + David Attenborough macro reverence + nature-photography hero shots.`,
    touchpoints: [
      'HUMMINGBIRD HOVERING AT HELICONIA — solitary jewel-throated tropical hummingbird hovering mid-air at a foreground heliconia bloom, wings a transparent blur, beak just grazing the bract, body iridescent emerald and ruby',
      'BLUE MORPHO BUTTERFLY MID-FLIGHT — solitary blue morpho butterfly caught mid-flight in midground, wings electric-cobalt with translucent edges, body in motion-blur, jungle backdrop in soft humid haze',
      'POISON-DART FROG ON LEAF — solitary neon-blue poison-dart frog on the underside of a broad foreground leaf, body crisp at macro scale, fluorescent skin catching dappled light',
      'TOUCAN PERCHED ON BRANCH — solitary keel-billed toucan perched on a midground branch, oversized rainbow beak crisp, body in soft shallow-DOF, jungle canopy behind in humid blur',
      'RED-EYED TREE-FROG — solitary red-eyed tree-frog clinging to a foreground stem, green body with red eyes and orange feet, sticky toe-pads visible, leaf-edge catching light',
      'ORCHID MANTIS ON BLOOM — solitary orchid mantis mimicking an orchid bloom in foreground, pale-pink body with petal-shaped legs, eyes barely visible, perfect camouflage',
      'PARROT CLUSTER ON BRANCH — small cluster of bright-colored parrots / lorikeets on a midground branch with bloom-clusters nearby, vivid color-pop against the jungle green',
      'IGUANA SUNNING ON BRANCH — solitary green iguana sunning on a horizontal branch in midground, body crisp with reptile-detail, dewlap relaxed, distant jungle in humid blur',
      'TROPICAL SLOTH ON BRANCH — solitary three-toed sloth slowly moving on a horizontal branch in midground, fur algae-tinged green, single eye visible, slow motion implied',
      'GLASS-FROG ON LEAF — solitary glass-frog on the underside of a foreground leaf, transparent skin showing internal organs faintly, eyes catching light',
      'KINGFISHER AT WATER-EDGE — solitary tropical kingfisher perched at a water-edge in midground, body iridescent blue-and-orange, water glistening below, ready to dive',
      'CHAMELEON ON BRANCH — solitary tropical chameleon clinging to a small foreground branch, body color-shifted to match the bloom-mass, swiveled eye catching light',
      'KOI BELOW WATER-LILIES — golden koi visible just below the water surface among foreground water-lily pads, scales catching dappled light, water-distortion adding mystery',
      'GECKO ON SUN-WARMED ROCK — solitary brightly-patterned gecko basking on a sun-warmed rock in midground, camouflaged but visible to the eye that finds it',
      'PEACOCK SPIDER ON LEAF — solitary tiny peacock spider on a foreground leaf, body iridescent-jewel-toned, scale-perfect macro detail, jungle backdrop in soft blur',
      'BUTTERFLY MIGRATION CLUSTER — small cluster of tropical butterflies gathered on a foreground bloom-cluster sipping nectar, varied species, iridescent wings catching light',
      'HOATZIN PERCHED — solitary hoatzin (prehistoric-looking tropical bird) perched on a midground branch, mohawk crest visible, distant rainforest in humid blur',
      'POISON-FROG ON BROMELIAD — solitary tropical poison frog cupped in a bromeliad-rosette in midground, water pool visible in the bromeliad center, jewel-detail',
      'PARROT TAKING FLIGHT — solitary parrot caught mid-takeoff from a midground branch, wings spread, motion-blur on the wingtips, bloom-cluster left behind on the branch',
      'TREE-FROG IN BLOOM-CUP — solitary tropical tree-frog tucked into a foreground bloom-cup, eyes peeking out over the petal-edge, body camouflaged against the cup interior',
    ],
    instructions: `Each entry is ONE specific SMALL TROPICAL CREATURE as a peripheral / second-look reward, 20-40 words. Format: "CREATURE NAME CAPS — primary creature + macro detail + position in frame". Vary across the 10 categories above. ALWAYS small / peripheral / never primary. ALWAYS tropical. NO humans, NO temperate wildlife. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: phenomenon (80%-gated conditional drama) ───
  bloombot_landscape_phenomenon: {
    format: 'simple',
    theme: `80%-GATED ATMOSPHERIC PHENOMENA for the BloomBot landscape path. Each entry is ONE specific dramatic moment that CRANKS the scene from beautiful to unforgettable. Each entry 25-50 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the bloom-landscape's drama. The phenomenon is the "wow moment" — the thing that would stop a viewer mid-scroll. It dominates a quadrant of the frame but doesn't replace the bloom-carpet.

🚫 STRICT BANS:
  • NO humans / vehicles / planes / drones / spaceships
  • NO surreal physics / floating / gravity-defying (dreamscape's job)
  • NO architecture / buildings / ruins
  • NO duplication of sky-layer content (rainbow / aurora / storm — those are sky, not phenomenon)
  • NO "rain falling" alone (too quiet) — must be a SPECIFIC visible drama

✓ MANDATORY VARIETY — distribute across:
  A. **VOLUMETRIC LIGHT MAGIC** — fire-ray god-rays piercing storm-clouds onto a specific bloom-patch, sunbeams through forest-edge mist, light-pillars in cold air
  B. **DRAMATIC WEATHER MOMENT** — distant lightning fork striking a ridge / mountain-wave cloud over a peak / waterspout offshore / dust-devil dancing across the meadow / hail-curtain in midground
  C. **POLLINATOR SPECTACLE** — butterfly migration cloud / bee-swarm column / monarch wave / starling murmuration twisting / firefly cloud at dusk
  D. **WILDLIFE-EVENT** — bird-flock taking off from the bloom-carpet en masse / wild-horse stampede / deer-herd in motion / whale breach offshore (coastal landform) / wolf-pack crossing
  E. **GEOLOGIC MOMENT** — distant volcanic eruption with ash-column / geyser eruption in the meadow / rockfall down a cliff / glacier-calving / steam-vents in active eruption
  F. **HYDROLOGIC SPECTACLE** — flash-flood ribbon wall of water descending a canyon / waterfall-roar visible in spray / river-bend mirror-perfect / wave-set detonating in synchrony on a coast / spring meltwater explosion
  G. **CELESTIAL EVENT** — meteor / shooting-star streak / comet visible in dusk sky / solar-eclipse halo (corona) / planetary-conjunction line
  H. **THERMAL / OPTICAL** — heat-shimmer visible across the meadow / fata-morgana mirage on the horizon / dust-storm wall in deep distance / fire-rainbow / circumzenithal arc
  I. **FROST / ICE MOMENT** — first frost crystals on bloom-petals / hoar-frost on every stem / ice-storm coating bloom-stalks / frozen-fog rime on the meadow
  J. **WIND-EVENT** — visible wind-wave rolling across the bloom-field / dust-devil column dancing / cottonwood-fluff blizzard in mid-air / pollen-cloud explosion

Channel: Planet Earth slow-motion drama + Storm-chaser cinematography + BBC natural-event captures + Roger Deakins atmospheric setpieces.`,
    touchpoints: [
      'FIRE-RAY GOD-RAYS PIERCING STORM-EDGE — volumetric warm-amber god-rays piercing through a storm-cloud break onto a specific patch of bloom-meadow in midground, the patch glowing hot-gold while the rest is in storm-shadow',
      'BIRD-FLOCK MASS TAKE-OFF — vast flock of birds (starlings / grackles / waxwings) lifting off the bloom-carpet en masse, hundreds of wings beating, a shadow-cloud rising into the sky',
      'WILD-HORSE STAMPEDE CROSSING — small wild-horse herd at full gallop crossing the midground bloom-meadow from left to right, dust-and-petal trail behind them catching the light, mane-and-tail in motion',
      'DISTANT VOLCANIC ERUPTION — distant volcano in deep background mid-eruption, ash-column rising vertically into the upper sky, lava-glow on the cone, bloom-meadow in foreground under amber ash-light',
      'BUTTERFLY MIGRATION CLOUD — vast cloud of migrating monarchs passing through the meadow in dense flickering profusion, the air thick with wings, individual butterflies visible at every depth',
      'FLASH-FLOOD CANYON RIBBON — vertical ribbon of fast water descending a canyon side-wall in deep midground from a distant cloudburst, white spray-bloom at the impact zone, dramatic hydrologic moment',
      'SHOOTING-STAR DUSK STREAK — single bright meteor-streak crossing the dusk sky in a quick diagonal, leaving a glowing trail across upper frame, bloom-meadow in twilight blue below',
      'HEAT-SHIMMER ACROSS MEADOW — visible heat-shimmer wave distorting the air above the bloom-carpet in midground, distant ridges wobbling, summer-noon thermal magic',
      'FIRST-FROST CRYSTALS ON PETALS — first hoar-frost crystals on the bloom-petals catching the first morning sun in glittering points, the meadow transformed from soft to sharp, optical magic',
      'VISIBLE WIND-WAVE ACROSS FIELD — visible wind-gust rolling across the bloom-field like wind on water, hundreds of stems bending in a single moving wave, the eye reads scale through the wave',
      'WHALE-BREACH OFFSHORE — humpback whale breach visible offshore from a coastal bloom-cliff, full-body launch from the swell, splash-explosion in deep midground, scale-moment for the cliff',
      'METEOR-SHOWER MULTIPLE STREAKS — multiple shooting-stars streaking simultaneously across the night sky over the bloom-meadow, persistent trails marking each path, dark-sky magic',
      'POLLEN-CLOUD EXPLOSION — visible dense cloud of golden pollen-dust erupting from a bloom-cluster mid-frame in a gust of wind, the air thick with floating pollen catching the side-light',
      'FROZEN-FOG RIME ON MEADOW — meadow coated in white frozen-fog rime crystals on every blade and stem, the entire bloom-carpet glittering white, sun catching it in a million sparkle-points',
      'GEYSER ERUPTION IN MEADOW — natural geyser eruption from the bloom-meadow itself in midground, vertical steam-and-water column rising 30 metres, hot springs in the surrounding ground',
      'WATERFALL ROAR WITH SPRAY-CROWN — major waterfall in deep midground in full-flow, spray-cloud crowning above it catching a rainbow in the sun-mist, bloom-meadow in foreground misted by the spray',
      'CIRCUMZENITHAL ARC — rare upside-down rainbow (circumzenithal arc) high in the upper sky above the bloom-meadow, vivid spectrum arc, atmospheric ice-crystal magic',
      'WOLF-PACK CROSSING MEADOW — small wolf-pack crossing the bloom-meadow in line in midground, alpha leading, ears-forward, scale-prover plus dramatic predator-moment',
      'DISTANT WATERSPOUT — single waterspout twisting from a coastal storm-cloud down to the offshore swell in deep midground, mariner-spectacle, the bloom-cliff in foreground under stormlight',
      'FIREFLY CLOUD AT DUSK — vast cloud of fireflies suspended over the bloom-meadow at dusk, hundreds of green-pulse lights in stereo through the depth of the meadow, twilight magic',
    ],
    instructions: `Each entry is ONE specific dramatic atmospheric / wildlife / geologic / hydrologic / celestial PHENOMENON, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visible drama + secondary detail + position in frame". Vary across the 10 categories above. Each phenomenon is the "stop-the-scroll wow moment" but doesn't replace the bloom-carpet. NO humans, NO vehicles, NO architecture, NO surreal physics. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: SONNET, max_tokens: 16000, messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally { clearTimeout(timeoutId); }
}

function parseArray(text) {
  const body = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) { if (current) entries.push(current); current = m[2].trim(); }
    else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set(['the','a','an','and','or','but','with','of','in','on','at','to','for','from','by','as','is','are','was','were','be','been','being','have','has','had','this','that','these','those','it','its','they','them','their','her','his','into','onto','through','across','over','under','near','around','between','one','two','three','some','any','all','no','not','than','then','also','so','very','more','most','many','much','each','every','other','another','same','such','only','own','just','still','here','there','where','when','what','who','wide','tall','long','high','low','large','small','massive','huge','vast','above','below','beside','behind','toward','within','throughout']);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 4 && !STOPWORDS.has(w)).slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); const seenTitles = new Map();
  const kept = []; const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) { dropped.push({ entry: e.slice(0, 80), reason: 'title' }); continue; }
    const sig = signatureOf(e);
    if (sig.length < 10) { if (title) seenTitles.set(title, e); kept.push(e); continue; }
    if (seenSigs.has(sig)) { dropped.push({ entry: e.slice(0, 80), reason: 'body' }); continue; }
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
  try { arr = parseArray(text); }
  catch (e) { console.error('Parse failed:', e.message); console.error('First 400 chars:', text.slice(0, 400)); return []; }
  if (!Array.isArray(arr) || arr.length === 0) { console.warn('  ⚠ Sonnet returned no usable entries'); return []; }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/bloombot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) { try { preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {} }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null) console.log(`Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`);
  else console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting]; let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(`\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`);
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping iteration'); break; }
    const within = dedupe(fresh);
    if (within.dropped.length > 0) console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing to disk.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up existing pool → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
