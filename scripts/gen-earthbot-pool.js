#!/usr/bin/env node
/**
 * Generate an EarthBot axis pool using Sonnet.
 *
 * Mirrors gen-bloombot-pool.js / gen-mechbot-pool.js: signature-based dedup,
 * --target iterative gen+dedup loop, append-mode preservation.
 *
 * Usage:
 *   node scripts/gen-earthbot-pool.js --pool desert_southwest_subject --target 50
 *
 * Output: scripts/bots/earthbot/seeds/<pool>.json
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
  } catch { return {}; }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) { console.error('ANTHROPIC_API_KEY missing'); process.exit(1); }

const args = process.argv.slice(2);
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');
if (!POOL) { console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]'); process.exit(1); }

// ─────────────────────────────────────────────────────────────
// EarthBot shared identity guards (referenced across all recipes)
// ─────────────────────────────────────────────────────────────
// All paths: raw-Earth landscape, NO PEOPLE, NO architecture, NO civilization.
// Hyperreal cinematic register, teal-and-orange grade, atmospheric depth.
// Wildlife only as scale-prover (postage-stamp scale).
//
// Cross-path bans:
//   - NO bioluminescent / phosphorescent / aurora (except iceland-raw where
//     aurora is real-Earth phenomenon — grounded photographic only)
//   - NO nacreous / sun-dogs / fire-rainbow / iridescent fantasy-coding
//   - NO "fire" as a noun (renders literal flames per seasonal-shift lesson)
//   - NO "opal-iridescent / shifting / glowing mineral" fantasy vocab

const POOL_RECIPES = {
  // ═══════════════════════════════════════════════════════════
  // DESERT-SOUTHWEST path (2026-05-23) — American SW iconic raw geology
  // ═══════════════════════════════════════════════════════════

  desert_southwest_subject: {
    format: 'simple',
    theme: `AMERICAN SOUTHWEST ICONIC LANDFORMS for EarthBot's desert-southwest path. Each entry is ONE specific real iconic SW landform composition — Utah / Arizona / New Mexico raw geology. Each entry 30-55 words.

⚠️ MANDATORY — wide-vista panoramic OR stand-at-the-rim mid-wide framing. The iconic landform is the hero. Multi-tier depth implied (foreground anchor + midground hero geology + distant horizon). Warm-terracotta on cobalt cinematic register.

🚫 STRICT BANS:
  • NO humans / hikers / climbers / silhouettes / vehicles / road / fence / building
  • NO petroglyphs / cliff dwellings / pueblo ruins (cultural heritage — respect)
  • NO sci-fi / fantasy / portal / aurora / bioluminescent / nacreous / sun-dogs / fire-rainbow / iridescent
  • NO molten / lava / active volcanic (SW geology is cold sandstone / basalt)
  • NO "fire" as a noun (renders literal flames); "blazing color" adjective only
  • NO opal-iridescent / shifting / glowing mineral fantasy vocab
  • NO generic "desert landscape" — name the specific iconic landform

✓ MANDATORY VARIETY — distribute across these REAL ICONIC SUBJECT CATEGORIES. In a 50-entry pool, aim for 3-4 entries per category. CACTUS / SONORAN / JOSHUA-TREE CATEGORIES ARE LOAD-BEARING — must be well-represented, NOT skipped:
  A. **SANDSTONE TOWERS / MITTENS** — Monument Valley East/West Mitten + Merrick Butte, Mexican Hat, the Three Sisters, Castle Rock
  B. **SLOT CANYONS** — Antelope Canyon (Upper + Lower) sandstone slot beams, Buckskin Gulch, Wire Pass, Spooky / Peek-a-Boo
  C. **HOODOO AMPHITHEATERS** — Bryce Canyon hoodoo amphitheater, Cedar Breaks, Goblin Valley, Toadstool hoodoos
  D. **NARROW CANYONS** — Zion Narrows river-cut walls, Subway, Buckskin Gulch, Black Canyon of the Gunnison
  E. **NATURAL ARCHES (cap at ~3 entries — pool was 22% arches before)** — Delicate Arch, Mesa Arch, Landscape Arch, Double Arch, Rainbow Bridge, Corona Arch
  F. **MESAS / BUTTES** — Shiprock volcanic plug, Cathedral Rock Sedona, Bell Rock, Spider Rock Canyon de Chelly, Vermillion Cliffs
  G. **PAINTED DESERT / BADLANDS** — Painted Desert striations, Petrified Forest, Bisti / De-Na-Zin badlands, Coal Mine Canyon
  H. **CANYONLANDS / GRAND CANYON RIM** — Grand Canyon South Rim, Toroweap Overlook, Island in the Sky, Needles, Maze
  I. **RED ROCK FORMATIONS** — Sedona Cathedral / Bell / Courthouse Butte, Red Rock Crossing, Capitol Reef Waterpocket Fold
  J. **WAVE / CROSS-BEDDED SANDSTONE** — The Wave (North Coyote Buttes), Second Wave, White Pocket, Toadstool, Yant Flats
  K. **DUNES** — Coral Pink Sand Dunes, Great Sand Dunes, White Sands gypsum dunes
  L. **VOLCANIC** — Shiprock pinnacle, Sunset Crater, El Malpais lava flows (COLD/extinct only)
  M. **SONORAN CACTUS FORESTS** ⭐ MUST HAVE — Saguaro National Park (Tucson, Arizona) with giant saguaro forests, Organ Pipe Cactus National Monument, Sonoran Desert with mixed saguaro + ocotillo + cholla, Superstition Mountains saguaro slopes
  N. **JOSHUA TREE / MOJAVE FORESTS** ⭐ MUST HAVE — Joshua Tree National Park forests (California Mojave), Yucca brevifolia forests at twilight, Joshua tree forest at sunset with desert floor, Mojave Joshua tree silhouettes against cobalt
  O. **CACTUS GROVES** ⭐ MUST HAVE — prickly-pear thickets, barrel cactus clusters on hillside, ocotillo forests in bloom (red-tipped whips), cholla cactus groves backlit with golden halo, agave fields with bloom stalks rising
  P. **MOJAVE DESERT** — desert pavement with creosote, lava-tube cave entrance, Death Valley (Mesquite Flat Dunes, Zabriskie Point badlands, Artist's Palette)
  Q. **SALT FLATS** ⭐ MUST HAVE — Bonneville Salt Flats Utah hexagonal-polygon-patterned crust stretching to mountain-ringed horizon, Badwater Basin Death Valley salt-polygon floor with Panamint Range, Black Rock Desert salt flats, salar-style salt-pan reflection at sunset, salt-crust ground patterns close foreground

Lineage to channel: Marc Adamus + Peter Lik + Galen Rowell SW landscape photography, National Geographic SW features, Ansel Adams scale. Saturated jewel-tone cinematic register with teal-and-orange grade.`,
    touchpoints: [
      'MONUMENT VALLEY MITTENS AT SUNRISE — East and West Mitten Buttes and Merrick Butte rising from the red-sand floor in shadow-and-amber dawn light, foreground tier of red-sand ripples + sage clumps, midground tier of the three iconic sandstone monoliths, deep horizon receding to cobalt sky',
      'ANTELOPE CANYON SLOT BEAMS — narrow sandstone slot canyon with a single shaft of midday sun piercing through the upper opening, the wave-eroded sandstone walls catching warm amber light, foreground tier of fine sand at the canyon floor, midground tier of swirling cross-bedded walls, narrow strip of cobalt sky above',
      'BRYCE HOODOO AMPHITHEATER AT SUNRISE — vast hoodoo amphitheater of Bryce Canyon with thousands of red-and-amber spires catching first light, foreground rim with bristlecone pine + sage, midground packed with hoodoo forest, distant Aquarius Plateau receding to blue horizon',
      'ZION NARROWS RIVER WALLS — towering wave-eroded sandstone walls flanking the Virgin River corridor, water reflecting the warm canyon walls, hanging fern garden midway up the rock face, fallen cottonwood log at the foreground river bank, shaft of light from above striking the wall mid-frame',
      'DELICATE ARCH AT GOLDEN HOUR — iconic Utah arch standing alone on its slickrock pedestal in raking golden-hour sidelight, La Sal Mountains receding in cool teal haze in deep background, foreground slickrock pothole with weathered juniper bonsai at the rim',
      'MESA ARCH SUNRISE — massive sandstone arch at the cliff edge with the rising sun casting golden underglow onto the underside, Canyonlands Island in the Sky receding through the arch frame in tier after tier of cliffs, foreground slickrock with cross-bedded patterns',
      'SHIPROCK PLUG AT BLUE HOUR — towering volcanic plug rising 1500 feet from the Navajo Nation plain in cool blue-violet pre-sunrise ambient, distant Chuska Mountains in deeper blue, foreground sage flats with juniper silhouettes',
      'SEDONA CATHEDRAL ROCK AT SUNSET — iconic Sedona red-rock formation glowing amber-crimson in low-angle sunset light, foreground slickrock with prickly pear cactus + agave clusters, Verde Valley receding to cobalt depth behind',
      'CANYON DE CHELLY SPIDER ROCK — 800-foot sandstone spire rising from the canyon floor, Spider Rock catching warm late-day sidelight, multi-tier canyon walls in striations of amber and crimson, distant rim plateau in cool teal haze',
      'PAINTED DESERT STRIATIONS — vast Painted Desert badlands with horizontal striations of mauve / amber / rust / mint-green clay layers, foreground hill with petrified-wood fragments scattered, distant ridges receding to cool teal horizon',
      'THE WAVE NORTH COYOTE BUTTES — flowing cross-bedded sandstone with concentric amber-and-crimson banding sweeping across the frame, foreground sandstone bowl with cross-bedded ripples catching low-angle light, distant Coyote Buttes ridge in soft blue haze',
      'GRAND CANYON SOUTH RIM AT SUNRISE — vast multi-tier Grand Canyon stretching to the horizon in cliff after cliff of amber and crimson sandstone, foreground rim with juniper + sage, distant North Rim faintly silhouetted in cool teal atmospheric haze',
      'WHITE SANDS GYPSUM DUNES — vast pure-white gypsum dunes rolling to the horizon under cobalt sky, foreground dune ripples in soft pearl-cream, San Andres Mountains silhouetted in deep teal distance, single yucca cluster on a near dune crest',
      'COYOTE BUTTES TOADSTOOL HOODOOS — cluster of mushroom-shaped sandstone hoodoos with amber caps on cream-colored stems, foreground slickrock with cross-bedded ripples, distant Vermillion Cliffs in warm haze',
      'CAPITOL REEF WATERPOCKET FOLD — vast monocline of folded sandstone layers in horizontal bands of amber + crimson + cream, foreground slickrock with potholes catching reflected sky, distant ridges receding to cool teal',
      'TOROWEAP OVERLOOK GRAND CANYON — 3000-foot sheer cliff drop from Toroweap rim down to the Colorado River, foreground volcanic basalt outcropping with sparse vegetation, distant North Rim and inner canyon receding to atmospheric haze',
      'COAL MINE CANYON BADLANDS — multi-color striated badlands ridges in horizontal bands of cream + mauve + crimson + amber, foreground eroded clay terraces with weathered scoria, distant mesa silhouette in warm haze',
      'CORAL PINK SAND DUNES — soft pink-orange sand dunes rolling across the frame with wind-ripple patterns on the surface, foreground dune ridge with single juniper, distant red-rock cliffs in warm afternoon light',
      'ARCHES PARK BALANCED ROCK — massive sandstone boulder balanced on a slender pedestal, foreground sage-and-juniper desert floor, La Sal Mountains receding in cool blue haze behind',
      'BISTI BADLANDS HOODOOS — surreal cluster of mushroom-cap hoodoos and cracked clay terraces in mauve and amber, foreground petrified wood fragments scattered on cracked clay, distant horizon receding to dust-pink',
      'SAGUARO NATIONAL PARK FOREST — vast Sonoran Desert saguaro forest with hundreds of giant saguaro cacti rising 30-50 feet high across the rolling foothills, foreground ocotillo cluster with red-tipped whips, Tucson Mountains receding in cool teal-purple haze, cobalt Sonoran sky',
      'ORGAN PIPE CACTUS MONUMENT — multi-armed organ pipe cacti rising in dense cluster on the Sonoran desert floor at golden hour, foreground prickly pear and cholla, Ajo Mountains silhouetted in deep teal distance, warm amber sidelight',
      'JOSHUA TREE FOREST AT TWILIGHT — vast Mojave forest of Yucca brevifolia (Joshua trees) with their gnarled arms silhouetted against a cobalt-violet twilight sky, foreground granite boulder cluster, distant mountains in deep blue',
      'JOSHUA TREE AT SUNSET — single iconic Joshua tree silhouette against a sunset banner-cloud sky in copper-amber, foreground desert floor with creosote bushes, distant rock formations in cool teal',
      'SONORAN MIXED CACTUS GROVE — dense Sonoran cactus diversity in the foreground: barrel cactus + cholla + prickly pear + ocotillo + saguaro all clustered together at golden-hour sidelight, distant Sonoran mountains',
      'CHOLLA CACTUS GARDEN BACKLIT — backlit cholla cactus cluster in the foreground with golden spine-halo catching low sunlight, prickly pear behind, distant Sonoran range in warm haze',
      'SUPERSTITION MOUNTAINS SAGUARO SLOPE — Superstition Mountain wilderness with saguaro forest carpeting the foothills, foreground saguaro silhouettes, dramatic Superstition rim catching warm sunset rim-light',
      'DEATH VALLEY ZABRISKIE POINT — eroded badland ridges of Zabriskie Point in cream + amber + chocolate striations at sunrise, foreground gypsum-banded clay, distant Panamint Range in cool teal haze',
      'BADWATER SALT FLATS — vast salt-crusted Badwater Basin in geometric hexagonal patterns stretching to the horizon, foreground salt-polygon detail, distant Panamint Mountains in cool blue',
      'OCOTILLO FOREST IN BLOOM — dense forest of ocotillo plants with crimson flower-tipped whips swaying in the foreground, mixed cholla and prickly pear understory, distant Sonoran ridges in golden hour',
      'PRICKLY PEAR THICKET — vast prickly-pear thicket carpeting the foreground with magenta fruit pads catching low sun, scattered barrel cactus, distant red-rock mesa in warm afternoon light',
      'BONNEVILLE SALT FLATS — vast white salt-crust flat with perfect hexagonal polygon patterns stretching mirror-flat to the distant Silver Island Range silhouetted in cool teal haze, foreground close-detail of salt-polygon crust',
      'BADWATER BASIN SALT FLOOR — vast salt-crusted Death Valley basin in geometric hexagonal patterns stretching to the horizon, foreground salt-polygon close detail, Panamint Mountains in cool blue distance',
      'SALT-PAN SUNSET REFLECTION — thin water layer over salt flats reflecting a copper-amber sunset sky in mirror perfection, distant range silhouetted at the horizon, foreground salt-polygon edge',
      'BLACK ROCK DESERT SALT FLATS — vast cracked salt-pan playa stretching to distant mountain ranges, foreground close detail of dried polygon cracks, dust-haze in deep distance',
    ],
    instructions: `Each entry is ONE specific iconic American SW landform composition, 30-55 words. Format: "LANDFORM NAME CAPS — primary landform features + multi-tier depth description + light/horizon note". Vary across the 12 landform categories. NO humans, NO petroglyphs / pueblo ruins, NO sci-fi / fantasy / aurora / bioluminescent / fire-rainbow. NO molten / lava (SW geology is cold sandstone). NO opal-iridescent / shifting / glowing mineral vocab. NO "fire" as a noun. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  desert_southwest_surprise_element: {
    format: 'simple',
    theme: `SCENE-RICHENING SURPRISE ELEMENTS for EarthBot's desert-southwest path. Each entry is ONE specific extra visual element that injects spice / richness / drama into an otherwise simple desert composition. Each entry 14-25 words.

⚠️ MANDATORY — the surprise element must add visual richness without crowding the hero subject. Cactus in bloom, dramatic banner cloud, weathered tree silhouette, balanced rock formation, blooming wildflower cluster, raven on rim, etc.

🚫 STRICT BANS:
  • NO humans / vehicles / architecture / petroglyphs
  • NO sci-fi / fantasy / aurora / nacreous / bioluminescent / fire-rainbow
  • NO molten / lava / active volcanic
  • NO "fire" as a noun

✓ ELEMENT CATEGORIES:
  • SAGUARO BLOOM CROWN — white crown of blossoms atop a giant saguaro
  • OCOTILLO IN BLOOM — red-tipped flame-bloom ocotillo whips
  • PRICKLY PEAR BLOOM — yellow/magenta blossoms on prickly pear pads
  • CACTUS BLOOM ACCENT — barrel cactus crown of pink/yellow blooms
  • DRAMATIC BANNER CLOUD — single horizontal lenticular or banner cloud catching sunset
  • SECONDARY ROCK FORMATION — distant additional sandstone tower / arch / hoodoo
  • WEATHERED COTTONWOOD SNAG — silvered dead tree silhouette
  • WILDFLOWER SUPERBLOOM PATCH — dense magenta / yellow / orange wildflower carpet
  • CHOLLA GOLDEN HALO — backlit cholla catching golden spine-halo
  • RAVEN ON RIM — single raven silhouette perched on the high rim
  • JUNIPER BONSAI — gnarled ancient juniper rising from slickrock
  • OCOTILLO SILHOUETTE — single ocotillo whips silhouetted against sky
  • DESERT VARNISH STREAKS — long mineral varnish streaks down a sandstone wall
  • CRYPTOBIOTIC SOIL PATTERN — dark microbial crust patterning the foreground
  • DISTANT SAGUARO CLUSTER — small distant saguaro group on a far ridge
  • BLOOMING JOSHUA TREE — Joshua tree with cream flower-bundle clusters
  • SUNSET BANNER OF CRIMSON — sky-spanning crimson sunset band
  • DUST PILLAR / DEVIL — small distant dust pillar / dust devil
  • SOLITARY OWL ON CACTUS — owl perched on a saguaro arm at twilight
  • COLORFUL LICHEN PATCH — bright orange / chartreuse lichen on rock`,
    touchpoints: [
      'CROWN OF WHITE SAGUARO BLOOMS atop a giant saguaro arm, ringed with bees, glowing in golden hour rim-light',
      'OCOTILLO IN PEAK BLOOM with red-tipped whips waving against the cobalt sky',
      'PRICKLY PEAR PAD BLOOMS in vivid magenta and yellow erupting from the foreground cactus pads',
      'BARREL CACTUS CROWN OF PINK BLOSSOMS topping a round barrel cactus in the foreground',
      'DRAMATIC SUNSET BANNER CLOUD streaking horizontal across the sky in copper-and-crimson',
      'SECONDARY SANDSTONE SPIRE rising in the deep middle distance behind the hero formation, dwarfed but adding compositional depth',
      'WEATHERED COTTONWOOD SNAG — silvered dead cottonwood silhouette standing alone, branches angular against the sky',
      'WILDFLOWER SUPERBLOOM PATCH — vivid magenta + yellow + orange wildflower carpet erupting at the midground',
      'CHOLLA GOLDEN HALO — backlit cholla cactus glowing with translucent golden spine-halo at sunset',
      'RAVEN ON RIM — single black raven silhouette perched on the high canyon rim',
      'JUNIPER BONSAI — gnarled ancient juniper rising twisted from a slickrock crevice in the foreground',
      'BLOOMING JOSHUA TREE — Joshua tree with cream-colored flower-bundle clusters atop each arm',
      'OCOTILLO SILHOUETTE — single ocotillo with whip-arms silhouetted against the sunset sky',
      'DESERT VARNISH STREAKS — long iron-black mineral varnish streaks descending a sandstone cliff face',
      'CRYPTOBIOTIC SOIL PATTERN — dark microbial crust patterning the red-sand foreground in delicate filigree',
      'DISTANT SAGUARO CLUSTER — small distant cluster of giant saguaros silhouetted on a far ridge',
      'SUNSET COPPER BANNER OF CRIMSON — sky-spanning crimson sunset band glowing above the silhouetted landform',
      'DUST PILLAR — single tall dust pillar rising on the distant desert floor catching warm sidelight',
      'SOLITARY OWL ON CACTUS — single great horned owl silhouette perched on a tall saguaro arm at twilight',
      'COLORFUL LICHEN PATCH — bright orange-and-chartreuse lichen patches on sandstone in foreground',
      'BALANCED ROCK SECONDARY — distant balanced-rock formation rising in the middle distance behind the hero',
      'AGAVE BLOOM STALK — single century-plant agave with tall flowering stalk rising above the foreground rosette',
      'PRONGHORN HERD CLUSTER — small distant herd of pronghorn antelope clustered on the desert floor',
      'WIND-DRIFTED SAND RIPPLE PATTERN — soft wind-rippled sand patterns sweeping across the foreground in geometric waves',
      'YUCCA WITH BRIGHT FLOWER STALK — single tall yucca with cream flower-stalk rising against the sky',
    ],
    instructions: `Each entry is ONE specific scene-richening surprise element for SW desert, 14-25 words. NO humans, NO architecture. Real SW flora / wildlife / atmospheric elements only. Output as NUMBERED list.`,
  },

  desert_southwest_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's desert-southwest path. Each entry is ONE specific close-edge detail anchoring the lower frame of an SW landscape composition. Each entry 14-25 words.

⚠️ Real SW desert flora / rock / cross-bedded patterns. NO humans, NO trash, NO architecture, NO petroglyphs.`,
    touchpoints: [
      'JUNIPER BONSAI ON SLICKROCK — weathered ancient juniper twisted by wind, rooted in a slickrock crevice at the near foreground rim',
      'PRICKLY PEAR CACTUS CLUSTER — flat-paddled prickly pear in cluster with magenta fruit pads at the foreground edge',
      'AGAVE WITH FLOWER STALK — century-plant agave with tall flowering stalk rising from the rosette at the foreground',
      'SLICKROCK POTHOLE WITH RAIN-CATCHMENT — eroded sandstone pothole holding a small pool of rainwater reflecting the sky at the foreground rim',
      'CROSS-BEDDED SANDSTONE PATTERN — close foreground of swirling cross-bedded sandstone with concentric ripple-pattern carved by ancient winds',
      'SAGE BRUSH CLUMPS — silver-grey sagebrush in scattered low clumps at the foreground desert floor',
      'CHOLLA CACTUS CLUSTER — fuzzy backlit cholla cactus with golden spine-halo catching low sun at foreground',
      'WEATHERED COTTONWOOD LOG — silvered weathered cottonwood log half-buried in red sand at the foreground',
      'PRICKLY PEAR + AGAVE PAIRING — flat-pad prickly pear cluster paired with century-plant agave at the foreground edge',
      'CRYPTOBIOTIC SOIL CRUST — dark microbial soil crust patterning the red-sand foreground in delicate filigree',
      'JUNIPER + PINYON PAIR — paired weathered juniper and pinyon pine at the foreground rim catching warm rim-light',
      'TUMBLEWEED SKELETON — dried tumbleweed wedged against a slickrock outcrop at the foreground',
      'COLLECTION OF PETRIFIED WOOD FRAGMENTS — scatter of rainbow-banded petrified wood fragments on cracked clay at the foreground',
      'MULESHOE PATTERNED RED SAND RIPPLES — wind-rippled red sand patterns at the close foreground catching low-angle sidelight',
      'BARREL CACTUS FOREGROUND — round barrel cactus with golden spines at the foreground, dwarfed by the landform behind',
      'YUCCA WITH FLOWER STALK — narrow-leaved yucca with tall flowering stalk rising from rosette at the foreground edge',
      'WEATHERED SANDSTONE BOULDER FIELD — scattered weathered amber sandstone boulders at the foreground catching warm light',
      'INDIAN PAINTBRUSH WILDFLOWER CLUSTER — bright scarlet Indian paintbrush wildflowers in cluster at the foreground edge',
      'OCOTILLO BRANCHES IN BLOOM — tall whip-like ocotillo branches with crimson flowers at tips, foreground edge',
      'PINYON PINE WITH RESIN-BEAD BARK — gnarled weathered pinyon pine with resin-bead bark at the foreground rim',
    ],
    instructions: `Each entry is ONE specific close-foreground SW desert detail, 14-25 words. Real SW flora / sandstone patterns / weathered wood. NO architecture, NO petroglyphs, NO humans. Output as a NUMBERED list.`,
  },

  desert_southwest_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's desert-southwest path. Each entry is ONE specific SW desert light condition. Each entry 14-25 words.

⚠️ Real SW desert lighting. NO fantasy lighting (no sun-dog, no fire-rainbow, no aurora). Use "shafts plural fanning" if multiple shafts (avoid laser-beam Flux trigger).`,
    touchpoints: [
      'GOLDEN-HOUR RAKING SIDELIGHT — warm amber low-angle sidelight raking horizontally across the sandstone, every facet catching warm rim-light',
      'BLUE-HOUR PRE-SUNRISE — soft cool violet-blue ambient light pre-sunrise wrapping the sandstone in muted blue tones with the first warm hint of sunrise on the high cliffs',
      'HARD MIDDAY OVERHEAD — direct overhead midday sun creating hard punched shadows beneath every overhang, sandstone glowing amber',
      'MONSOON STORM-BREAK SHAFTS — multiple sunshafts plural fanning down through breaking monsoon cloud onto the landscape in dramatic patches',
      'DAWN ALPENGLOW ON HIGH RIDGES — first-light alpenglow flush of warm copper-amber on the high sandstone ridges while the canyon below remains cool-shadow',
      'SUNSET BACKLIT SILHOUETTE — sun positioned behind the landform low on the horizon backlighting the rock in copper-rim silhouette',
      'POST-RAIN OVERCAST DIFFUSE — soft overcast diffuse light after a passing monsoon, every sandstone surface glistening wet, rich saturated color',
      'LATE-AFTERNOON WARM SIDELIGHT — warm copper-amber late-afternoon sidelight catching every cross-bedding ridge in golden rim',
      'PARTLY-CLOUDY DAPPLED SHADOW — patchy cloud-shadows dappling the landscape with shifting bright-and-shadow patches as clouds move overhead',
      'SUNSET BANNER GOLDEN GLOW — full sunset banner cloud light bathing the entire landform in warm copper-rose glow',
      'CRISP WINTER MIDDAY — clear cold winter midday light producing tack-sharp visibility, sandstone glowing in saturated amber against cobalt sky',
      'DAWN MIST-DIFFUSED WARM — soft warm dawn light filtering through low canyon mist, sandstone walls warming gradually as mist clears',
      'CLEAR-SKY MIDDAY HIGH-CONTRAST — direct overhead clear-sky sun with hard chiaroscuro contrast between lit and shadowed canyon walls',
      'STORM-BREAK GODRAYS — dramatic godrays piercing storm cloud gap and falling onto the landform in warm warm spotlight',
      'EARLY-MORNING WARM RIM — soft warm early-morning rim-light on the high sandstone catching the first sunlight while the foreground stays cool-shadow',
      'OVERHEAD-CANOPY DAPPLE IN CANYON — light dappled through a sandstone arch above falling in patches onto the canyon floor below',
      'STAR-LIT NIGHT WITH MOON — cool moonlit landscape with stars visible above, sandstone glowing pale-cream in the moon-blue ambient',
      'POST-RAIN BREAK CLEAR — warm light breaking through clearing post-storm clouds, every wet sandstone surface glistening',
      'AFTERNOON-MAGIC GOLDEN — pure afternoon-magic-hour golden light wrapping the entire scene in warm amber',
      'COOL OVERCAST DIFFUSE PEARL — soft pearl-grey overcast diffuse light bringing out rich saturation in the red-rock without harsh contrast',
    ],
    instructions: `Each entry is ONE specific natural SW desert light condition, 14-25 words. NO fantasy lighting. NO single-beam (use "shafts plural" if multiple to avoid laser-beam Flux trigger). NO "fire" as noun. Output as NUMBERED list.`,
  },

  desert_southwest_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE / AIR for EarthBot's desert-southwest path. Each entry is ONE mood + air-quality combination. Each entry 14-25 words.

⚠️ Real SW desert air quality. NO sci-fi / fantasy atmosphere.`,
    touchpoints: [
      'CLEAR DRY DESERT — crisp dry desert air with razor-sharp visibility, sandstone color saturated edge-to-edge, no softening haze',
      'DUST-HAZE WARM — soft dust-haze drifting through the middle distance in warm amber tones from afternoon thermals',
      'MONSOON-CLEARED FRESH — clean clear air after a monsoon storm, every surface still damp, rich saturation throughout',
      'PRE-SUNRISE STILLNESS — calm pre-sunrise stillness with cool ambient air, no wind, sandstone wrapped in patient blue ambient',
      'POST-RAIN PETRICHOR — fresh petrichor scent implied, post-rain freshness, wet sandstone glistening throughout',
      'COOL WINTER CRISPNESS — crisp cool winter air with high visibility, sandstone catching warm low sun against cool ambient',
      'DESERT WARMTH HEATWAVES — visible heatwave shimmer above the warm sandstone at midday, atmospheric distortion in the deep distance',
      'GOLDEN-HOUR WARM CALM — warm magic-hour calm atmosphere with low-angle warm light wrapping everything in copper',
      'EARLY-DAWN COOL CLEAR — cool clear pre-sunrise atmosphere with crisp visibility, sandstone just beginning to catch warm light',
      'SMOKE-HAZE FROM DISTANT FIRE — soft amber-smoke haze in the deep distance from a distant wildfire, sandstone in muted warm tones',
      'WINTER SNOW DUSTING — fresh dusting of snow on the upper sandstone slopes contrasting with the warm red rock below',
      'AFTERNOON THERMAL HAZE — warm afternoon thermals creating soft atmospheric distortion in the deep distance',
      'NIGHT COOL CLEAR — cool clear desert night air with stars visible, sandstone glowing pale-cream in moonlight',
      'STORM-APPROACHING TENSION — heavy charged atmosphere with approaching monsoon storm in the deep distance, sandstone in dramatic dark-and-light contrast',
      'EVENING-WARM GENTLE — warm evening atmosphere with the day cooling gently, sandstone holding amber light in saturated tones',
      'COOL OVERCAST CALM — cool overcast calm without wind, rich saturation across the landscape in pearl-grey diffuse light',
      'POST-DUST-STORM CLEAR — air just clearing after a passing dust storm, soft amber haze still drifting through the lower frame',
      'BRIGHT BREEZY MORNING — fresh breezy morning atmosphere with the day warming, sandstone catching first light',
      'GOLDEN-MAGIC EVENING — pure magic-hour evening atmosphere with the entire scene wrapped in warm copper-amber',
      'AUTUMN-COOL CRISP — crisp cool autumn atmosphere with low-angle warm light and the day shortening',
    ],
    instructions: `Each entry is ONE specific SW desert mood + air-quality, 14-25 words. NO fantasy / sci-fi atmosphere. Output as NUMBERED list.`,
  },

  desert_southwest_sky_layer: {
    format: 'simple',
    theme: `SKY LAYERS for EarthBot's desert-southwest path. Each entry is ONE specific sky condition for an SW landscape composition. Each entry 14-25 words.

⚠️ Real Earth sky. NO aurora, NO nacreous, NO sun-dogs, NO fire-rainbow, NO sci-fi. Mostly clear cobalt with occasional monsoon drama.`,
    touchpoints: [
      'CLEAR COBALT SKY — pure deep-cobalt cloudless desert sky filling the upper third of the frame in saturated blue',
      'MONSOON CUMULUS BUILDUP — towering white-and-grey cumulus thunderheads building in the deep distance against cobalt blue',
      'SUNSET BANNER CLOUD — long horizontal banner cloud at the horizon glowing amber-and-crimson at sunset',
      'PARTLY-CLOUDY DAPPLE — scattered cumulus clouds with shifting shadows across the sandstone landscape',
      'LENTICULAR OVER BUTTES — smooth lenticular cloud hovering over a distant butte in deep cobalt sky',
      'DARK-SKY MILKY WAY — black night sky with the Milky Way arching above the canyon, stars in dense scatter',
      'STORM-CELL DRAMATIC — dramatic dark storm cell building in deep distance with rain curtain trailing below, golden light still on foreground',
      'CIRRUS WISPS HIGH — high thin cirrus wisps streaking the cobalt sky in horizontal feather patterns',
      'SUNSET COPPER GLOW — sky in full sunset copper-amber-rose glow above the silhouetted landform',
      'POST-MONSOON CLEARING — clearing monsoon sky with breaking cumulus and patches of cobalt re-emerging above the landform',
      'OVERCAST PEARL-GREY — soft overcast pearl-grey sky producing diffuse light across the landscape',
      'GOLDEN-HOUR WARM SKY — entire sky in warm magic-hour amber wrapping the sandstone in copper',
      'BLUE-HOUR VIOLET — cool violet-blue pre-sunrise sky above the landform with the first warm hint at horizon',
      'CLEAR WINTER-SUN COBALT — saturated cobalt winter sky above a snow-dusted sandstone landscape',
      'MAMMATUS-FREE STORM CEILING — flat low storm-cloud ceiling above the canyon (real storm, not fantasy mammatus)',
      'CIRROSTRATUS VEIL — thin milky cirrostratus veil softening the sky above, sandstone warming through',
      'EVENING ROSE-GOLD — gentle evening rose-gold sky wrapping the upper frame in warm soft light',
      'DAWN COPPER-AMBER STRIP — narrow strip of copper-amber dawn at the horizon below a cool blue upper sky',
      'CUMULUS WITH BLUE GAPS — scattered cumulus with deep cobalt gaps between, distant butte rising into the sky',
      'CLEAR BLACK NIGHT — deep black night sky with crisp clear stars above the moonlit landform',
    ],
    instructions: `Each entry is ONE specific sky condition for SW desert, 14-25 words. NO aurora, nacreous, sun-dogs, fire-rainbow, fantasy. Real Earth only. Output as NUMBERED list.`,
  },

  desert_southwest_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's desert-southwest path. Each entry is ONE tiny element (postage-stamp scale) that proves the vast scale of the SW landform. Each entry 14-22 words.

⚠️ Real SW wildlife / single tree / tiny natural feature. NEVER hero-size. NEVER humans / vehicles. Postage-stamp / comma-speck scale.`,
    touchpoints: [
      'RAVEN SILHOUETTE ON RIM — single black raven silhouette perched on the distant canyon rim, tiny against the vast wall',
      'SINGLE JUNIPER BONSAI ON SLICKROCK — lone ancient juniper bonsai on a distant slickrock dome, dwarfed by the formation',
      'DISTANT PRONGHORN HERD — small herd of pronghorn antelope crossing the distant desert floor as tiny specks',
      'JACKRABBIT TINY SPECK — single jackrabbit speck on the distant desert floor for human-scale reference',
      'ROADRUNNER ON FAR ROCK — tiny roadrunner silhouette on a distant boulder for scale',
      'KANGAROO RAT TRAIL IN DUST — fine kangaroo-rat trail tracks across the deep-distance dust for scale',
      'BIGHORN SHEEP DISTANT SILHOUETTE — single bighorn sheep silhouette on a distant ridge, tiny against the formation',
      'EAGLE GLIDING ABOVE — single golden eagle silhouette gliding high above the canyon in the upper sky',
      'TINY DISTANT JUNIPER GROVE — small distant juniper grove dotting the desert floor as tiny shapes',
      'LONE OCOTILLO SPECK — single distant ocotillo cluster on the desert floor for scale reference',
      'TINY BARREL CACTUS CLUSTER — distant cluster of round barrel cacti on the desert floor as small dots',
      'SINGLE COTTONWOOD FAR SPECK — single distant cottonwood tree marking a far wash as a small green speck',
      'TURKEY VULTURE CIRCLING — turkey vulture silhouette circling high above the canyon in slow spiral',
      'DESERT TORTOISE TINY SHAPE — distant desert tortoise as a tiny shape on the sand for scale',
      'SCATTERED MULE DEER HERD — small distant mule deer herd grazing on a far ridge for scale',
      'PRAIRIE FALCON ABOVE — single prairie falcon silhouette hovering above the canyon for scale',
      'LONE YUCCA STALK FAR — single distant yucca flower stalk rising on a far hill for scale',
      'DISTANT WILD-HORSE BAND — small distant wild-horse band on the desert floor as tiny silhouettes',
      'GREATER ROADRUNNER FAR DASH — single roadrunner mid-dash on the distant sand for scale',
      'BIGHORN GOAT ON CLIFF — single bighorn goat clinging to a distant cliff face as a tiny silhouette',
    ],
    instructions: `Each entry is ONE tiny SW desert scale-prover, 14-22 words. Postage-stamp scale ONLY. Real species. NEVER humans / vehicles. Output as NUMBERED list.`,
  },

  desert_southwest_phenomenon: {
    format: 'simple',
    theme: `RARE EARTH PHENOMENA for EarthBot's desert-southwest path (conditional 25%-gated). Each entry is ONE real-Earth optical / atmospheric event. Each entry 14-22 words.

⚠️ HARD BAN — fantasy / supernatural / sci-fi triggers. Real Earth ONLY.

🚫 BANNED:
  • aurora / nacreous / sun-dogs / fire-rainbow / iridescent
  • bioluminescent / phosphorescent / glowing creatures
  • molten / lava (SW is cold sandstone)
  • portal / mystical / fantasy
  • "fire" as a noun (renders literal flames)

✓ ALLOWED — real SW desert phenomena:
  • Monsoon lightning fork on distant mesa
  • Virga rain curtain trailing from cloud
  • Dust devil spinning across the desert floor
  • Sandstorm wall approaching in deep distance
  • Alpenglow on high sandstone ridge
  • Sun pillar rising vertically at horizon
  • Fog inversion filling the canyon
  • Snow flurry over Bryce hoodoos
  • Lenticular cloud over Shiprock
  • Stratus inversion in Grand Canyon
  • Sun halo (subtle, photographic — NOT flaming portal)
  • Atmospheric thermal-current shimmer
  • Late-afternoon dust catching golden light
  • Single shaft of light through canyon slot`,
    touchpoints: [
      'MONSOON LIGHTNING FORK — single bright lightning fork striking down toward a distant mesa from a building thunderhead',
      'VIRGA RAIN CURTAIN — soft virga rain curtain trailing from a distant cloud, evaporating before reaching the ground',
      'DUST DEVIL SPINNING — single tight dust devil spinning across the desert floor in the middle distance, kicking up red dust',
      'SANDSTORM WALL APPROACHING — distant sandstorm wall advancing across the desert floor in the deep distance, sky darkening',
      'ALPENGLOW ON HIGH RIDGE — warm copper-amber alpenglow flush spreading across the high sandstone ridges at first or last light',
      'SUN PILLAR AT HORIZON — vertical sun pillar rising above the setting sun at the deep horizon in copper glow',
      'FOG INVERSION IN CANYON — soft fog inversion filling the canyon below the rim, leaving only the high sandstone tops emerging',
      'SNOW FLURRY OVER HOODOOS — gentle snow flurry drifting through the Bryce hoodoo amphitheater in soft white veil',
      'LENTICULAR OVER SHIPROCK — smooth lenticular disk cloud hovering motionless above a distant volcanic plug',
      'STRATUS INVERSION GRAND CANYON — temperature inversion filling the Grand Canyon below the rim with a sea of cloud',
      'SUBTLE SUN HALO — pale translucent 22-degree sun halo arc faintly visible in thin cirrostratus above the landform',
      'THERMAL SHIMMER DEEP DISTANCE — visible thermal-current shimmer distorting the deep-distance ridges in heat waves',
      'GOLDEN DUST CATCHING LIGHT — late-afternoon dust catching warm horizontal sidelight in the middle distance',
      'LIGHT-SHAFT THROUGH SLOT CANYON — single dramatic light shaft piercing through a slot canyon opening from above',
      'SUNSET CREPUSCULAR RAYS — visible crepuscular rays fanning out from a setting sun behind a distant butte',
      'POST-RAIN SUN-BREAK — golden sun-break light bursting through clearing post-monsoon clouds onto the wet sandstone',
      'DAWN MIST RISING FROM CANYON — soft pale mist rising from the cool canyon depths at dawn as the sun begins to warm',
      'DISTANT RAIN-CURTAIN GOLDEN — distant rain-curtain catching warm golden afternoon sidelight in the deep distance',
      'WIND-DRIFT SAND CASCADE — fine sand cascading off a slickrock dome rim in a soft wind-blown plume',
      'BRIGHT SUN FLARE THROUGH ARCH — sun flare bursting through a sandstone arch opening in radial light pattern',
    ],
    instructions: `Each entry is ONE specific real-Earth SW phenomenon, 14-22 words. HARD BAN on aurora / nacreous / sun-dogs / fire-rainbow / bioluminescent / sci-fi / molten. ONE phenomenon per entry. Output as NUMBERED list.`,
  },
};

if (!POOL_RECIPES[POOL]) {
  console.error(`Unknown pool "${POOL}". Available pools:`);
  Object.keys(POOL_RECIPES).forEach((k) => console.error(`  - ${k}`));
  process.exit(1);
}
const recipe = POOL_RECIPES[POOL];

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
  const entries = []; let current = null;
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
  if (cleaned.length === 0) throw new Error('No numbered entries found');
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
  const outPath = path.resolve(`scripts/bots/earthbot/seeds/${POOL}.json`);
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
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping'); break; }
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
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
