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
  H. **POTTING BENCH** — long wrought-iron potting-bench with terracotta pots / Victorian gardener\\'s table with copper watering-cans
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
