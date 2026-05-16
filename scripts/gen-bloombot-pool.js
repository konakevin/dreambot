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
