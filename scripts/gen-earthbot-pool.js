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
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');
if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

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
      'LENTICULAR OVER BUTTES — smooth lens-shaped cloud cap with soft feathered edges draped above a distant butte in deep cobalt sky',
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
      'LENTICULAR OVER SHIPROCK — smooth lenticular cloud cap, visibly made of layered moist cloud, soft-edged, draped above a distant volcanic plug',
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

  // ═══════════════════════════════════════════════════════════
  // ICELAND-RAW path (2026-06-01 fresh build).
  // PURE Icelandic raw nature — glaciers, black sand, basalt, waterfalls,
  // ice caves, rhyolite mountains, geothermal vents. Iceland's Flux prior
  // is STRONG (lots of training data of Iceland photography) so most pitfalls
  // are mild compared to African. Still apply the universal guards:
  //   • NO photographer names anywhere (Belegurschi / Dros / Kordan leak
  //     verbatim into the polished Flux prompt and bias toward their
  //     specific famous Iceland shots)
  //   • NO negation language ("no humans" / "no buildings") in pool entries
  //     — bans go in the template SYSTEM, not the literal output prompt
  //   • Subject entries LEAD with the Iceland toponym in first 5-8 words
  //     so CLIP locks the geographic prior from token 0
  //   • Aurora is allowed (real Icelandic phenomenon) but rendered as a
  //     subtle photographic ribbon, NEVER as fantasy-cosmic neon
  // ═══════════════════════════════════════════════════════════

  iceland_raw_subject: {
    format: 'simple',
    theme: `PURE ICELAND RAW NATURE SCENES for EarthBot's iceland-raw path. Each entry is ONE unambiguous Icelandic landscape composition spanning the full breadth of Iceland's signature geology — glacier tongues, glacier lagoons + iceberg beaches, black-sand beaches, basalt sea stacks + column canyons, ice caves, waterfalls, moss-on-lava fields, rhyolite color-banded mountains, continental rift fields, geothermal vents + geysers. Each entry 30-55 words.

⚠️ MANDATORY — every entry must LEAD with an Icelandic toponym in the first 5-8 words. Required openings include: "Reynisfjara black-sand beach...", "Vatnajökull glacier tongue...", "Jökulsárlón glacier lagoon...", "Diamond Beach iceberg shards...", "Skógafoss waterfall...", "Seljalandsfoss waterfall...", "Gullfoss two-tier waterfall...", "Dettifoss thunder waterfall...", "Háifoss high waterfall...", "Goðafoss waterfall...", "Stuðlagil basalt canyon...", "Svartifoss basalt cliff...", "Reynisdrangar sea stacks...", "Sólheimajökull glacier tongue...", "Breiðamerkurjökull glacier face...", "Vatnajökull ice cave interior...", "Landmannalaugar rhyolite ridge...", "Þingvellir continental rift fissure...", "Eldhraun moss-on-lava field...", "Strokkur geyser cone...", "Kerlingarfjöll geothermal valley...", "Námafjall sulfur field...", "Hvítserkur basalt sea arch...", "Aldeyjarfoss basalt-column waterfall...", "Kirkjufell mountain..." — toponym FIRST, then the rest of the composition.

🎯 BIOME COVERAGE TARGET (across 25 entries) — Iceland's INTERIOR geology LEADS; the coast is a MINOR accent only (this path was over-weighted on beaches/sea-stacks — pull it inland):
  • Glacier tongues + ice caves: 5 entries
  • Waterfalls (Skógafoss / Seljalandsfoss / Gullfoss / Dettifoss / Háifoss / Goðafoss): 5 entries
  • Inland basalt canyons + column-waterfalls (Stuðlagil / Svartifoss / Aldeyjarfoss / Studlafoss): 2 entries
  • Rhyolite + HIGHLAND-INTERIOR mountains (Landmannalaugar / Kerlingarfjöll / Fjallabak / Þórsmörk): 4 entries
  • Moss-on-lava + continental rift + geothermal + calderas (Eldhraun / Þingvellir / Strokkur / Námafjall / Askja-Víti crater lake): 5 entries
  • Glacier lagoon + iceberg beach (Jökulsárlón / Diamond Beach — genuinely iconic, KEEP but capped): 2 entries
  • Black-sand coast (Reynisfjara — the ONE iconic black beach only): 2 entries

⚠️ Iceland is MOSTLY INTERIOR. Do NOT over-weight beaches / sea-stacks / coast — that's only ~4 of 25 here. The hero is glaciers, waterfalls, geothermal, rhyolite highlands, rift fields, ice caves.

🚫 ABSOLUTE BANS (every entry MUST clear these):
  • ZERO photographer names (Iurie Belegurschi / Albert Dros / Daniel Kordan / Erez Marom / Max Rive — these leak verbatim into the polished output and bias renders)
  • ZERO sci-fi / fantasy / portal / impossible-reflection / multi-moon
  • ZERO sheep, ZERO cropland, ZERO buildings, ZERO lighthouses, ZERO cabins, ZERO villages, ZERO roads, ZERO Vík village (the photographic landmark is the church but it's a building — describe Vík beach without the village)
  • ZERO negation phrases — describe positive content only ("uninhabited black-sand beach" not "no humans on beach")
  • ZERO American/European mountain analogues (no "alpine peaks like the Dolomites", no "like Yosemite") — describe Iceland on its own terms

✅ EVERY ENTRY MUST INCLUDE:
  • Icelandic toponym in first 5-8 words
  • Specific geological hero (glacier face / basalt formation / waterfall / black sand / etc.)
  • Multi-tier depth language (foreground + midground hero + atmospheric distance OR ice-cave interior depth)
  • Icelandic-coded materials (basalt / glacier ice / black volcanic sand / Icelandic moss / rhyolite color banding / sulfur crust / pumice)
  • A specific Icelandic lighting moment (low-sun-winter-rake / blue-hour-twilight / midnight-sun glow / polar-overcast flat / ice-cave-blue-glow / storm-break shaft)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Reynisfjara black-sand beach at storm-light, basalt sea-stack column tier (Reynisdrangar) rising from churning Atlantic surf, foreground black-pumice arc on dark sand, breaking wave with foam-streak racing across mid-frame, distant Vík headland silhouette in cool sea mist',
      'Vatnajökull glacier tongue at low-winter-sun, the tonguefront calving into a meltwater pool, foreground striated blue compressed ice with embedded volcanic ash bands, midground crevasse field receding, cobalt-blue tongue surface stretching to distant volcanic ridge',
      'Jökulsárlón glacier lagoon at blue-hour, hundreds of pale-cyan icebergs floating on mirror-flat dark water, foreground iceberg shard close to camera, midground iceberg dispersion to lagoon centre, distant Breiðamerkurjökull glacier face glowing soft cool pink in twilight',
      'Diamond Beach iceberg shards at sunrise, glass-clear ice fragments scattered across black volcanic sand catching first warm light, breaking Atlantic surf curling at mid-frame, foreground single large iceberg with internal blue veins, distant horizon in soft polar-rose glow',
      'Skógafoss waterfall in golden-hour rake light, the 60-metre vertical thunder of water plunging into a mist-filled basin, foreground volcanic-pebble fan with wet basalt cobbles, double rainbow arcing through the spray, cliff-face wall striped in basalt columns',
      'Seljalandsfoss waterfall from behind the curtain, the falling water sheeting in front of the camera with golden-hour sun pierced through, foreground wet basalt ledge with single fern cluster, mossy cliff wall arching overhead, distant Eyjafjallajökull horizon glow visible through the water sheet',
      'Gullfoss two-tier waterfall at polar overcast, milky glacial-flour water cascading over two consecutive falls into a vast canyon, foreground basalt ledge wet and dark, canyon walls receding in cool-grey atmospheric depth, mare-tail cirrus high above',
      'Dettifoss thunder waterfall at storm-break, the 100-metre-wide falls churning grey-brown glacial silt over the cliff edge, sun-shaft tearing through dark cloud overhead, foreground volcanic basalt-rim with spray-soaked black rock, canyon walls dark in distant haze',
      'Stuðlagil basalt canyon in midnight sun, hexagonal black basalt columns lining the canyon walls in vertical stacks, milky-blue glacial river running through the canyon floor, foreground close detail of column-tops, distant canyon bend curving away into atmospheric soft-pink polar twilight',
      'Svartifoss basalt cliff waterfall, the slim waterfall thread tumbling down a curtain of hexagonal black basalt columns, foreground mossy ground with single arctic-thyme cluster, midground falls and column-face dominant, distant cliff edge against soft cobalt sky',
      'Vatnajökull ice cave interior, deep-blue compressed-glacier-ice walls arching overhead with ribbed flowing texture, single beam of cool blue daylight entering through a crevasse skylight, foreground ice-floor with embedded volcanic ash band, distant cave-throat receding into deeper blue',
      'Landmannalaugar rhyolite ridge at golden hour, color-banded ridges in rust + ochre + amber + sulphur-yellow rising in striated layers, foreground close detail of obsidian-flecked volcanic pumice, midground hot-spring steam plume drifting low, distant lenticular cloud over the peak',
      'Þingvellir continental rift fissure, the deep crack between North-American and Eurasian plates running through moss-covered volcanic ground, foreground close basalt-rim with Icelandic moss carpet, midground rift-valley floor receding, distant Hengill volcano in cool blue haze',
      'Eldhraun moss-on-lava field at low-winter-sun, undulating volcanic-rock hummocks blanketed in thick Racomitrium lanuginosum moss in muted green-gold, foreground close moss carpet with embedded lava clinker, midground hummock waves stretching to distant Mýrdalsjökull glacier edge',
      'Strokkur geyser fountain at blue-hour, the 20-metre boiling-water column rising vertically against cool twilight sky, foreground hot-spring rim crusted in sulphur and silica, steam plume drifting upward, distant Geysir field rust-red mineral-stained ground',
      'Sólheimajökull glacier tongue at polar-overcast, the cracked grey-ash-streaked glacier face descending toward a black-sand outwash plain, foreground close blue-glacier-ice slab with ash bands, midground crevasse field, distant glacier tongue receding to cloud-shrouded ice cap',
      'Þórsmörk highland valley at golden hour, the green glacial valley cradled between three glacier tongues (Eyjafjallajökull / Mýrdalsjökull / Tindfjallajökull), braided glacial rivers threading the valley floor, foreground close birch-scrub and moss at near edge, distant ice caps glowing warm, deep canyon walls in blue haze',
      'Aldeyjarfoss basalt-column waterfall, milky-blue glacial water falling 20 metres into a basalt-column-walled pool, foreground close hexagonal basalt rim wet with spray, column-curtain wall dominant midground, sky a clear arctic cobalt',
      'Kirkjufell mountain at blue-hour, the iconic conical Snæfellsnes peak rising 463 metres beside the small Kirkjufellsfoss waterfall, foreground wet basalt boulders with foaming stream, midground falls leading the eye to peak, distant fjord water and cobalt sky behind',
      'Askja Víti crater lake in the central highlands, the milky opaque-blue geothermal lake filling a circular caldera of rust-and-charcoal volcanic rock, foreground close warm-mineral crater rim at near edge, midground steaming lake surface, distant Dyngjufjöll caldera walls under flat polar light',
      'Goðafoss horseshoe waterfall at polar twilight, the 12-metre-tall arcing waterfall sweeping in a U-shape over a basalt rim, foreground close basalt ledge with mossy edge, milky-blue water curtain dominant, distant cliff-face and pink-violet polar dawn sky',
      'Námafjall geothermal field at midday, rust-orange and sulphur-yellow mineral-crust ground steaming with active fumaroles and bubbling mud pots, foreground close fumarole rim with concentric sulphur deposit, midground bubbling pot, distant Mýrdalsjökull glacier edge cool blue',
      'Háifoss high waterfall, the 122-metre vertical thread of glacial-silt-grey water dropping into a vast canyon, foreground close basalt-rim with moss carpet, neighboring smaller waterfall Granni at left, deep canyon walls in atmospheric blue depth',
      'Kerlingarfjöll geothermal valley at golden hour, rhyolite ridges in rust + ochre + violet striations with steaming hot-spring veins running through the slope, foreground close mineral-crust ground with sulphur deposits, midground steam plume drifting, distant rhyolite peaks in warm copper sidelight',
      'Fjallabak Nature Reserve highland interior at golden hour, rust-ochre-and-green rhyolite hills rolling under a vast empty central-highland plateau, a braided glacial river winding through the foreground volcanic gravel, midground steaming geothermal vent, distant Hekla volcano silhouette in warm haze',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland subject entries. NO preamble, NO commentary. Each entry 30-55 words on a single line. Format follows the touchpoint pattern: "Toponym + feature + close-foreground detail + midground hero + distant atmospheric depth + lighting note".`,
  },

  iceland_raw_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's iceland-raw path. Each entry is ONE specific close-edge Icelandic detail anchoring the lower 15-20% of the frame — texture-rich, tactile, near-camera, biome-appropriate. Each entry 14-25 words.

✅ ICELAND-SPECIFIC CLOSE-EDGE DETAILS:
  • Hexagonal basalt column tops at near edge (Stuðlagil / Reynisfjara / Svartifoss)
  • Single iceberg shard polished glass-clear on black volcanic sand at frame corner
  • Cluster of glacier-river cobbles wet and dark-grey at near edge
  • Frost-edged Icelandic moss carpet (Racomitrium lanuginosum) at lower frame
  • Sulfur-crust rim of geothermal pool at near edge
  • Volcanic-sand ripple pattern wind-sculpted at near edge
  • Black pumice fragments in arc pattern at lower frame
  • Icelandic lichen patches on basalt at near edge
  • Cracked dry lava-flow surface at lower frame edge
  • Cluster of arctic-thyme alpine flowers at near edge
  • Ice-cave wall ribbed pattern at frame-edge interior
  • Glacial-melt-stream silver thread crossing lower frame
  • Single tussock of sea-grass on Reynisfjara dune
  • Beach-pebble fan of polished basalt at lower frame
  • Frozen waterfall ice formation at near edge

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO American / European foreground analogues (no "wildflower meadow" alpine analog)
  • ZERO negation phrases
  • ZERO non-Icelandic vegetation (no pine cones, no oak leaves, no temperate-forest debris)

Each entry 14-25 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Hexagonal black basalt column tops at near edge wet with sea spray, sharp polygon edges catching cool sidelight',
      'Single glass-clear iceberg shard on black volcanic sand at frame corner, internal blue veins visible',
      'Cluster of glacier-river cobbles wet and dark-grey at near edge, sorted by glacial sorting',
      'Frost-edged Icelandic moss carpet (Racomitrium lanuginosum) at lower frame in muted green-gold pillows',
      'Sulphur-yellow crust rim of a geothermal pool at near edge, concentric mineral deposits',
      'Volcanic-sand ripple pattern wind-sculpted at near edge in fine parallel ridges',
      'Black pumice fragments in arc pattern at lower frame, porous texture readable at close range',
      'Cluster of arctic-thyme pink alpine flowers at near edge on moss-covered lava rock',
      'Ice-cave wall ribbed flow pattern at frame-edge interior, blue-translucent ice with embedded ash',
      'Glacial-melt-stream silver thread crossing lower frame between basalt cobbles',
      'Single tussock of sea-grass on a Reynisfjara dune crest at near edge bent by Atlantic wind',
      'Beach-pebble fan of polished basalt at lower frame in arcing tidal pattern',
      'Frozen waterfall ice formation at near edge in cascading icicle layers',
      'Cracked dry pahoehoe lava-flow surface at lower frame edge with mineral-stained crust',
      'Cluster of mountain avens white-petalled alpine flowers at near edge on rocky moraine',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  iceland_raw_light_condition: {
    format: 'simple',
    theme: `ICELANDIC LIGHT CONDITIONS for EarthBot's iceland-raw path. Each entry is ONE specific Icelandic lighting register — Iceland's high latitude gives it dramatically different light than mid-latitude landscapes. Each entry 14-22 words.

✅ ICELANDIC LIGHTING REGISTERS:
  • Low winter sun raking horizontally across landscape (sun never gets high in winter)
  • Blue-hour polar twilight extended over 2+ hours (long dawn / dusk transitions)
  • Midnight sun glow June-July (sun skims horizon but never sets)
  • Polar-overcast diffuse flat shadowless light (overcast volcanic ash sky)
  • Storm-break shaft tearing through dark cloud deck
  • Ice-cave-blue glow filtered through compressed-glacier-ice ceiling
  • Golden-hour copper-rose rake on basalt + black sand
  • Pre-storm yellow-green oppressive light
  • White-out snow-squall diffuse illumination
  • Crepuscular ray ladder through breaking cloud
  • Backlit translucent waterfall mist + sun-disc
  • Geothermal-vent steam backlit copper at sunset
  • Aurora-night cool moonlit landscape underneath
  • Sodium-orange pre-eruption volcanic glow (very rare)
  • Inversion-fog top-lit by clear sky above

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO mid-latitude-only lighting (no "warm summer afternoon" — Iceland summers are cool)
  • ZERO negation phrases
  • Aurora described as photographic-subtle, NEVER fantasy-cosmic neon

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Low winter sun raking horizontally at 10-degree angle across the landscape in copper-amber rake light',
      'Blue-hour polar twilight stretching 2 hours with cobalt zenith fading to copper-amber low horizon',
      'Midnight sun glow grazing the horizon at 1am with warm-cool color split across the frame',
      'Polar-overcast diffuse flat shadowless light rendering every detail in even cool-grey',
      'Storm-break shaft tearing through a dark nimbostratus deck illuminating one patch of glacier',
      'Ice-cave-blue glow filtered through 30 metres of compressed glacier ice ceiling',
      'Golden-hour copper-rose rake side-lighting basalt and black sand at 30-degree sun angle',
      'Pre-storm yellow-green oppressive light with falling barometric pressure visible in cloud color',
      'White-out snow-squall diffuse illumination with falling streaks dimensionalizing the air',
      'Crepuscular ray ladder through breaking cloud with three distinct beams hitting the ground',
      'Backlit translucent waterfall mist with sun-disc just visible behind the falling water curtain',
      'Geothermal-vent steam backlit copper-amber at sunset rising in vertical plume',
      'Aurora-night cool moonlit landscape underneath subtle green aurora ribbon',
      'Sodium-orange pre-eruption volcanic glow lighting the horizon underside of a cloud deck',
      'Inversion-fog top-lit by clear sky above with peaks emerging from cloud-sea below',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  iceland_raw_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's iceland-raw path. Each entry is ONE specific Icelandic atmospheric texture — what fills the air between camera and far distance. Each entry 14-22 words.

✅ ICELANDIC ATMOSPHERIC REGISTERS:
  • Geothermal steam plume drifting low over rust-stained ground
  • Glacier-cold mist hanging in still air at glacier tongue base
  • Sea spray drifting inland from Atlantic breakers
  • Snow squall sweeping across the frame in horizontal streaks
  • Volcanic-vapor curtain rising from active fissure
  • Inversion fog low in valley with peaks above breaking through
  • Waterfall-mist veil filling lower frame in pearl-grey
  • Ice-cave still cold air with suspended frost particles glittering
  • Mist drift along glacial-river flats in cool blue-grey
  • Sulfur-tinted yellow haze over geothermal field
  • Polar wind-blown snow streamers off ridge crest
  • Cold sea fog rolling onto black-sand beach
  • Pumice-dust haze suspended after eruption
  • Glacial-flour suspended in milky river casting cool haze
  • Cloud shadow patches sliding across moss-on-lava field

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO desert-coded dust haze (Iceland is wet)
  • ZERO tropical humidity descriptors
  • ZERO negation phrases

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Geothermal steam plume drifting low over rust-stained ground in horizontal ribbons',
      'Glacier-cold mist hanging in still air at glacier tongue base catching cool light',
      'Atlantic sea spray drifting inland from breaking Reynisfjara surf in pearl-grey veil',
      'Snow squall sweeping across the frame in horizontal streaks of falling crystals',
      'Volcanic-vapor curtain rising from active fissure in copper-tinted plume',
      'Inversion fog low in valley with peaks above breaking through into clear blue',
      'Waterfall-mist veil filling lower frame in pearl-grey shroud',
      'Ice-cave still cold air with suspended frost particles glittering in shafted light',
      'Mist drift along glacial-river flats in cool blue-grey horizontal bands',
      'Sulphur-tinted yellow haze hovering over geothermal field at midday',
      'Polar wind-blown snow streamers off ridge crest in white horizontal plumes',
      'Cold sea fog rolling onto black-sand beach from offshore in dense pearl veil',
      'Pumice-dust haze suspended after eruption in tan-grey suspended layer',
      'Glacial-flour suspended in milky river casting cool blue-grey haze over outwash plain',
      'Cloud shadow patches sliding across moss-on-lava field in moving dark-light pattern',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  iceland_raw_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's iceland-raw path. Each entry is ONE specific Icelandic sky cover — what fills the upper third of the frame. Each entry 14-22 words.

✅ ICELANDIC SKY REGISTERS:
  • Lenticular cloud over Eyjafjallajökull or Hekla volcano peak
  • Breaking storm cloud deck with sun-shafts emerging
  • Polar twilight gradient (cobalt zenith fading to copper-amber low horizon)
  • Summer-night cloud (June-July): pastel blue-pink-grey illuminated by midnight sun
  • Midnight-sun low-burn glow on horizon-grazing cloud bank
  • Clear cobalt-blue arctic noon sky with high mare's-tail cirrus
  • Heavy nimbostratus rain-bearing dark grey deck
  • Aurora-curtain subtle green ribbon mid-sky
  • Volcanic-ash-tinted sky with copper-yellow undertone
  • Massive cumulonimbus anvil over distant glacier
  • Layered stratocumulus broken by cobalt patches
  • Snow-squall sky white-grey diffuse with falling streaks visible
  • Star-crowded moonless night sky with Milky Way arch
  • Inversion-cloud sea below peak with clear sky above
  • Polar lenticular wave-clouds layered in soft feathered bands over Snæfellsjökull

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO desert / tropical / temperate sky tropes
  • ZERO negation phrases

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Lenticular cloud cap with softly feathered edges draped over Eyjafjallajökull volcano peak',
      'Breaking storm cloud deck with sun-shafts emerging through three distinct openings',
      'Polar twilight gradient with cobalt zenith fading down to copper-amber at low horizon',
      'Summer-night cloud in pastel blue-pink-grey illuminated by midnight sun from below',
      'Midnight-sun low-burn glow on horizon-grazing cumulus cloud bank stretching across',
      'Clear cobalt-blue arctic noon sky with high mare-tail cirrus streaks',
      'Heavy nimbostratus rain-bearing dark grey deck pressing low overhead',
      'Aurora-curtain subtle green ribbon arching mid-sky at moderate intensity',
      'Volcanic-ash-tinted sky with copper-yellow undertone after recent eruption',
      'Massive cumulonimbus anvil rising above the distant glacier',
      'Layered stratocumulus broken by cobalt patches in alternating bands',
      'Snow-squall sky white-grey diffuse with falling streaks visible across the frame',
      'Star-crowded moonless night sky with the Milky Way arch overhead',
      'Inversion-cloud sea below the peak with clear cobalt sky above',
      'Stacked lenticular wave-clouds in smooth layered soft-edged bands capping Snæfellsjökull peak',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland sky layer entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  iceland_raw_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's iceland-raw path. Each entry is ONE tiny postage-stamp-scale element in the deep distance, ant-sized, that proves the landscape's VAST scale. Iceland-coded wildlife or geometry ONLY. Each entry 14-22 words.

✅ ICELANDIC SCALE-PROVER REGISTERS:
  • Lone Icelandic horse silhouette ant-small on rhyolite ridge
  • Small herd of Icelandic horses pencil-tall on moss-on-lava field
  • Single arctic fox shape barely readable crossing black sand
  • Tiny puffin colony on distant sea-stack ledge
  • Lone northern fulmar gliding over Reynisfjara surf
  • Distant skua silhouette over snowfield
  • Matchstick-tiny iceberg in Jökulsárlón lagoon distance
  • Glacial-melt-river thread silver-thin at far valley floor
  • Tiny sea-stack silhouette far offshore in mist
  • Distant geyser steam plume reading as a pencil-tall column
  • Tiny waterfall thread half-readable on distant cliff
  • Far-shore black-pebble line marking water's edge
  • Skein of barnacle geese flying low along far horizon
  • Lone Icelandic raven on basalt column rim ant-sized
  • Small group of harbor seals on distant dark-rock shoreline

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO non-Icelandic wildlife (no zebra, no elephant, no caribou, no moose, no bear)
  • ZERO human figures or vehicles
  • ZERO negation phrases
  • Always TINY and DISTANT, NEVER hero-scale

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Lone Icelandic horse silhouette ant-small on a distant rhyolite ridge in deep distance',
      'Small herd of Icelandic horses pencil-tall on a moss-on-lava field at deep distance',
      'Single arctic fox shape barely readable crossing distant black sand',
      'Tiny puffin colony on a distant sea-stack ledge as small dark dots',
      'Lone northern fulmar gliding over Reynisfjara surf at deep distance',
      'Distant skua silhouette over snowfield as a pencil-tall dark shape',
      'Matchstick-tiny iceberg in Jökulsárlón lagoon at deep distance',
      'Glacial-melt-river thread silver-thin at the far valley floor',
      'Tiny sea-stack silhouette far offshore in mist as a vertical dark shape',
      'Distant geyser steam plume reading as a pencil-tall white column',
      'Tiny waterfall thread half-readable on a distant cliff in deep haze',
      'Far-shore black-pebble line marking the waters edge in deep distance',
      'Skein of barnacle geese flying low along the far horizon',
      'Lone Icelandic raven on a distant basalt column rim ant-sized',
      'Small group of harbor seals on a distant dark-rock shoreline as small dark shapes',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland scale-prover entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  iceland_raw_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's iceland-raw path. Each entry is ONE specific real-Earth Icelandic phenomenon — the dramatic-but-real optical/weather event that elevates the frame. Each entry 14-22 words.

✅ ICELANDIC PHENOMENA:
  • Subtle green aurora ribbon arcing across mid-sky over snowfield
  • Soft emerald aurora low above horizon at blue-hour
  • Eruption fountain incandescent-red at fissure rim with steam plume
  • Massive glacier calving event mid-fall with seracs cascading
  • Glacial-flood (jökulhlaup) surge across outwash plain
  • Snow squall sweeping through breaking cloud diagonals
  • Rainbow arc through waterfall mist at golden hour
  • Sun-pillar vertical light column at horizon
  • Inversion-fog sea breaking around ridge crest
  • Geothermal steam plume backlit copper at sunset
  • Distant volcanic ash plume rising on horizon (non-eruptive cone)
  • Mock sun (parhelion) faint on ice-crystal sky
  • Diamond dust ice fog glittering in low sun
  • Crepuscular ray ladder breaking through storm
  • Distant lightning forking over highland interior

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO non-Iceland phenomena (no monsoon, no sandstorm, no haboob)
  • ZERO sci-fi / fantasy descriptors
  • ZERO negation phrases
  • Aurora descriptions stay GROUNDED-PHOTOGRAPHIC (subtle ribbon, soft arc, low-intensity curtain) — NEVER fantasy-cosmic (no "blazing neon", no "mythical fire-sky")

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Subtle green aurora ribbon arcing across mid-sky over snowfield at moderate intensity',
      'Soft emerald aurora low above the horizon at blue-hour with cool ground below',
      'Eruption fountain incandescent-red at fissure rim with steam plume rising',
      'Massive glacier calving event mid-fall with seracs cascading into lagoon water',
      'Glacial-flood (jökulhlaup) surge sweeping across outwash plain in muddy churn',
      'Snow squall sweeping through breaking cloud in diagonal streaks',
      'Rainbow arc piercing waterfall mist at golden hour in full primary band',
      'Sun-pillar vertical light column rising from horizon at sunset',
      'Inversion-fog sea breaking around a ridge crest with peaks above',
      'Geothermal steam plume backlit copper at sunset rising in vertical column',
      'Distant volcanic ash plume rising on horizon from a non-eruptive volcanic cone',
      'Mock sun (parhelion) faint on ice-crystal sky beside the actual sun',
      'Diamond dust ice fog glittering in low sun in suspended sparkle',
      'Crepuscular ray ladder breaking through storm in three distinct beams',
      'Distant lightning forking over the highland interior from a mature thunderstorm',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Iceland phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  // ═══════════════════════════════════════════════════════════
  // ANDES-PATAGONIA path (2026-06-01 fresh build).
  // South American raw nature — Patagonia granite spires + glaciers,
  // Andes volcanoes + peaks, Altiplano salt + lagunas, Amazon canopy.
  // Same guardrails as iceland-raw (lessons from feedback_regional_path_buildout_lessons):
  //   • NO photographer names anywhere
  //   • NO negation language in pool entries
  //   • Subject entries LEAD with the toponym in first 5-8 words
  //   • NO Machu Picchu / Inca ruins (cultural heritage — never render)
  // ═══════════════════════════════════════════════════════════

  andes_patagonia_subject: {
    format: 'simple',
    theme: `PURE ANDES / PATAGONIA / SOUTH AMERICAN RAW NATURE SCENES for EarthBot's andes-patagonia path. Each entry is ONE unambiguous South American landscape composition spanning the full breadth of South America's signature geology — Patagonia (Torres del Paine, Fitz Roy, Cerro Torre, Perito Moreno glacier, Lago Argentino, Lago Pehoé, Tierra del Fuego, Patagonian steppe), Andes (Cotopaxi volcano, Chimborazo, Huayna Potosí, Aconcagua, Cordillera Blanca, Salkantay), Altiplano (Salar de Uyuni mirror flats, Atacama, Laguna Colorada with flamingos, Laguna Verde, Valle de la Luna, Tatio geysers), Amazon basin (canopy from above, blackwater channels), Iguazu Falls, Marble Caves of Lago General Carrera. Each entry 30-55 words.

⚠️ MANDATORY — every entry must LEAD with a South American toponym in the first 5-8 words. Required openings include: "Torres del Paine granite spires...", "Fitz Roy peak...", "Cerro Torre summit...", "Perito Moreno glacier face...", "Lago Argentino glacial lake...", "Patagonian steppe rolling...", "Cotopaxi volcano cone...", "Chimborazo summit...", "Aconcagua peak...", "Salar de Uyuni mirror flat...", "Atacama Valle de la Luna...", "Laguna Colorada red waters...", "Laguna Verde mineral lake...", "Iguazu Falls cataract...", "Amazon canopy emergent layer...", "Marble Caves of Lago General Carrera...", "Tatio geyser field...", "Tierra del Fuego coastal..." — toponym FIRST, then the rest of the composition.

🎯 BIOME COVERAGE TARGET (across 25 entries):
  • Patagonia granite spires (Torres del Paine / Fitz Roy / Cerro Torre): 5 entries
  • Patagonian glaciers + glacial lakes (Perito Moreno / Lago Argentino / Lago Pehoé): 3 entries
  • Patagonian steppe + Tierra del Fuego coastal: 2 entries
  • Andes volcanoes (Cotopaxi / Chimborazo / Tungurahua / Villarrica): 3 entries
  • Andes high peaks (Aconcagua / Huayna Potosí / Cordillera Blanca): 2 entries
  • Altiplano salt flats (Salar de Uyuni mirror): 3 entries
  • Altiplano lagunas (Laguna Colorada / Verde with flamingos): 2 entries
  • Atacama (Valle de la Luna / Tatio geyser field): 2 entries
  • Amazon canopy + blackwater: 2 entries
  • Iguazu Falls + Marble Caves: 1 entry

🚫 ABSOLUTE BANS (every entry MUST clear these):
  • ZERO photographer names (Marc Adamus / Max Rive / Daniel Kordan / Pie Aerts / Iurie Belegurschi — these leak verbatim into the polished output)
  • ZERO Machu Picchu, ZERO Sacsayhuamán, ZERO Inca ruins, ZERO ANY cultural heritage stonework (respect — never render)
  • ZERO humans, gauchos, villages, huts, fences, roads, vehicles, refugios
  • ZERO sci-fi / fantasy / portal / impossible-reflection
  • ZERO negation phrases — describe positive content only
  • ZERO North American / European mountain analogues (no "Alps-like", no "Yosemite-style") — describe South American on its own terms

✅ EVERY ENTRY MUST INCLUDE:
  • South American toponym in first 5-8 words
  • Specific geological hero (granite spires / glacier face / volcano cone / salt mirror flat / etc.)
  • Multi-tier depth language (foreground + midground hero + atmospheric distance OR canopy depth)
  • South-America-coded materials (granite / glacier ice / salt-pan crust / volcanic basalt / altiplano scrub / Amazon emergent trees / Patagonian beech forest)
  • A specific lighting moment (alpenglow rose-amber on granite / blue-hour twilight / midday cobalt altiplano / golden-hour rake / sea-of-clouds dawn)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Torres del Paine granite spires at alpenglow, the three iconic Cuernos catching first-light rose-amber wash against deep cobalt zenith, foreground glacial-river cobbles wet at near edge, midground Lago Pehoé turquoise water below, distant Patagonian steppe horizon',
      'Fitz Roy peak at sunrise, the jagged granite skyline turning vivid red-orange against cold cobalt sky, foreground Patagonian lenga forest in dawn shadow, midground Río de las Vueltas valley with morning mist, glacier shoulder cool blue',
      'Cerro Torre summit at blue-hour, the impossibly slender granite needle pierced through a lenticular cloud cap, foreground glacial moraine boulders dark at near edge, Patagonian ice cap below in pre-dawn cobalt, distant Cordillera in soft pink',
      'Perito Moreno glacier face at midday, the 70-metre vertical ice wall calving into Lago Argentino with blue-white ice tier, foreground close turquoise glacial water at near edge, ice tongue stretching to distant Andes, cobalt sky',
      'Lago Argentino glacial lake at golden hour, the milky-turquoise water filling the foreground with floating iceberg shards, midground distant glacier tongue descending from Cordillera, granite spires beyond in cool teal haze',
      'Salar de Uyuni mirror flat at dawn, thin water layer reflecting the cobalt-to-amber gradient sky in perfect symmetry, foreground close salt-polygon hexagonal crust through the water, distant Tunupa volcano silhouette doubled in reflection',
      'Cotopaxi volcano cone at sunrise, the symmetrical glacier-capped 5897-metre stratovolcano catching first-light alpenglow, foreground Altiplano grassland with páramo cushion plants, mid-distance herd of vicuña pencil-tall, cobalt sky',
      'Atacama Valle de la Luna at sunset, the eroded salt-and-gypsum ridges turning copper-amber against deep cobalt sky, foreground close cracked salt-crust surface at near edge, mid-distance ridge-line shadow patterns, distant Andean range silhouette',
      'Laguna Colorada red waters at midday, the borax-and-algae crimson-red lake stretching to a distant Altiplano horizon, foreground close white borax crust at the lake edge, midground thousand-plus flamingo flock as small dark dots, cobalt sky',
      'Iguazu Falls cataract at golden hour, the horseshoe of 275 individual cascades plunging into the Devils Throat gorge, foreground rainforest emerald canopy at near edge, mist plume rising to backlit golden rainbow, distant cataract wall stretching corner to corner',
      'Marble Caves of Lago General Carrera, swirling marble walls patterned in cobalt-blue and white striations reflecting turquoise lake water, foreground close polished marble at near cave edge, mid-distance cave interior receding, distant lake horizon visible through arch',
      'Amazon canopy emergent layer aerial view, the dense emerald rainforest canopy stretching to a flat horizon with kapok and ceiba emergent trees rising above, foreground close ceiba crown catching golden-hour sidelight, mist drift in mid-canopy, distant river bend visible',
      'Aconcagua peak at alpenglow, the 6961-metre highest peak in the Americas catching first-light rose against high-altitude cobalt sky, foreground close moraine boulder field, midground glacier fan descending, distant Andean range in cool blue atmospheric haze',
      'Tatio geyser field at dawn, the 4320-metre altitude geothermal basin with eighty steaming geyser cones backlit copper against cold cobalt sky, foreground close mineral-crusted geyser rim, midground steam plume curtain, distant Andean peaks silhouetted',
      'Patagonian steppe rolling to the horizon, the windswept grassland dotted with tussock grass clumps under a stretched-out lenticular cloud bank overhead, foreground close calafate bush at near edge, distant herd of guanaco pencil-tall, soft afternoon light',
      'Chimborazo volcano summit at golden hour, the 6263-metre glacier-capped volcano catching warm amber rake-light on its western slope, foreground close Altiplano páramo with frailejón rosettes, midground vicuña pair pencil-tall, distant Andes',
      'Laguna Verde mineral lake at midday, the arsenic-tinted emerald-green water of the 4300-metre altitude lake stretching toward Licancabur volcano cone, foreground close mineral-crusted shore, distant volcano silhouette, cobalt high-altitude sky',
      'Tierra del Fuego coastal at storm light, the rugged glacier-carved fjord coast with breaking Atlantic surf against dark granite cliff, foreground close kelp-strewn rocky shore, sub-Antarctic beech forest on cliff above, distant Cordillera Darwin glacier silhouette',
      'Cordillera Blanca sunrise, the snow-capped Peruvian Andes peak chain catching first-light alpenglow above a sea of clouds inversion, foreground close moraine ridge at near edge, mid-distance ice spires Alpamayo Artesonraju, distant horizon glow',
      'Huayna Potosí summit at blue-hour, the 6088-metre Bolivian peak rising above the Altiplano with cool dawn light, foreground close ice-glazed boulder at near edge, midground glacier descent, distant La Paz valley in pre-dawn cobalt shadow',
      'Lago Pehoé turquoise water reflecting Cuernos del Paine, the iconic horn-shaped peaks doubled in perfect reflection at golden hour, foreground close Patagonian shore grass at near edge, swan pair on water, distant peak range tier',
      'Tunupa volcano salt-flat reflection, the dormant volcano cone rising from a thin-water-layer Salar de Uyuni mirror, foreground close salt-polygon crust through reflective surface, mid-distance volcano cone silhouetted, sunset banner cumulus',
      'Mount Roraima tepui mesa, the Venezuelan flat-topped sandstone tabletop rising from emerald rainforest below, foreground close mossy tepui-summit rock at near edge, mist drift around mesa wall, distant waterfall thread descending',
      'Bariloche granite ridge in autumn, the Cerro Catedral peak with surrounding Patagonian lenga forest turning red-orange below, foreground close fallen lenga branch at near edge, mid-distance Nahuel Huapi lake water, distant Andean spine cool blue',
      'Villarrica volcano steam plume, the active 2860-metre Chilean stratovolcano with constant steam plume rising above its glacier cap at sunset, foreground close Araucaria pine forest at near edge, midground Lago Villarrica, distant Cordillera ridge',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Andes/Patagonia subject entries. NO preamble. Each entry 30-55 words on a single line. Format follows the touchpoint pattern: "Toponym + feature + close-foreground + midground hero + distant atmospheric depth + lighting note".`,
  },

  andes_patagonia_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's andes-patagonia path. Each entry is ONE specific close-edge South American detail anchoring the lower 15-20% of the frame — texture-rich, tactile, near-camera, biome-appropriate. Each entry 14-25 words.

✅ SOUTH-AMERICA-SPECIFIC CLOSE-EDGE DETAILS:
  • Glacial-river cobbles wet polished grey-blue at near edge (Patagonia)
  • Calafate bush with deep-purple berries at near edge (Patagonian steppe)
  • Lenga forest fallen branch with red-orange autumn leaves at near edge
  • Frailejón rosette cluster (Espeletia) at near edge (Andean páramo)
  • Yareta cushion plant bright-green at near edge (Altiplano)
  • Salt-polygon hexagonal crust pattern at near edge (Salar de Uyuni)
  • Borax-and-salt crystal crust at lake edge (Laguna Colorada / Verde)
  • Cracked salt-and-gypsum surface at near edge (Atacama)
  • Mineral-crusted geyser rim at near edge (Tatio)
  • Moraine boulder with glacier polish striations at near edge
  • Patagonian tussock grass clump at near edge
  • Wet kelp tangle on dark granite shore at near edge (Tierra del Fuego)
  • Araucaria pine cone cluster at near edge (Chile)
  • Mossy tepui-summit rock at near edge (Roraima)
  • Black-water Amazon lily pad cluster at near edge
  • Volcanic basalt slab with cooled flow texture at near edge
`,
    touchpoints: [
      'Glacial-river cobbles wet polished grey-blue arranged at the near edge sorted by glacial sorting',
      'Calafate bush with deep-purple berries and small dark leaves at near edge windswept',
      'Lenga forest fallen branch with red-orange autumn leaves scattered at near edge',
      'Frailejón rosette cluster (Espeletia) silver-leaved at near edge in Andean páramo morning frost',
      'Yareta cushion plant bright-green mound at near edge on Altiplano rocky ground',
      'Salt-polygon hexagonal crust pattern at near edge stretching to mirror water',
      'Borax-and-salt crystal crust white-and-pink at lake edge with flamingo feathers caught',
      'Cracked salt-and-gypsum surface at near edge in concentric polygon pattern',
      'Mineral-crusted geyser rim at near edge concentric sulphur deposits',
      'Moraine boulder with glacier polish striations at near edge cold wet',
      'Patagonian tussock grass clump windswept at near edge with seed-heads silhouetted',
      'Wet kelp tangle on dark granite shore at near edge Tierra del Fuego',
      'Araucaria pine cone cluster spiny dark at near edge on volcanic soil',
      'Mossy tepui-summit rock at near edge bromeliad rosette nestled in crack',
      'Black-water Amazon Victoria-amazonica lily pad cluster at near edge in deep dark water',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  andes_patagonia_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's andes-patagonia path. South American light has distinct registers — Andean alpenglow, Altiplano high-altitude clarity, Patagonian storm-break light, Amazon dappled humid light. Each entry 14-22 words.

✅ SOUTH AMERICAN LIGHTING REGISTERS:
  • Alpenglow rose-amber on Andean granite at first light
  • High-altitude midday cobalt clarity (4000m+ thin atmosphere)
  • Patagonian storm-break shaft tearing through dark cloud over Cuernos
  • Sea-of-clouds dawn inversion with peaks emerging
  • Golden-hour rake on granite spire face
  • Blue-hour polar twilight over glacier face
  • Atacama atmospheric clarity midday (driest air on Earth)
  • Salar de Uyuni dawn cobalt-to-amber gradient reflection
  • Amazon canopy dappled emerald-gold light
  • Tundra mist rolling over Patagonian steppe
  • Volcanic-vent backlit copper at sunset
  • Sub-Antarctic late-summer rake low-sun
  • Lenticular-cloud underside-lit pink at dusk
  • Iguazu Falls backlit golden-hour rainbow through mist
  • Cordillera Blanca dawn alpenglow on snow with cool valley shadow
`,
    touchpoints: [
      'Alpenglow rose-amber on Andean granite spire at first-light forty-degree solar angle',
      'High-altitude midday cobalt clarity at 4500-metre with razor-sharp shadow definition',
      'Patagonian storm-break shaft tearing through dark cloud illuminating one peak face',
      'Sea-of-clouds dawn inversion with mountain peaks emerging into clear sky above',
      'Golden-hour copper-rose rake on granite spire face at thirty-degree solar angle',
      'Blue-hour polar twilight stretching over a glacier face in cool cobalt-mauve',
      'Atacama atmospheric clarity midday with shadows razor-sharp at five-thousand-metre elevation',
      'Salar de Uyuni dawn cobalt-to-amber gradient reflected perfectly in thin-water mirror',
      'Amazon canopy dappled emerald-gold light filtering through three layers of foliage',
      'Tundra mist rolling over Patagonian steppe in cool blue-grey horizontal bands',
      'Volcanic-vent steam plume backlit copper-orange at sunset against deep cobalt sky',
      'Sub-Antarctic late-summer rake low-sun grazing the landscape at horizontal angle',
      'Lenticular-cloud underside-lit pink and orange at dusk above Patagonian peak',
      'Iguazu Falls backlit golden-hour rainbow piercing waterfall mist in full primary band',
      'Cordillera Blanca dawn alpenglow on snow with cool valley shadow below',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  andes_patagonia_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's andes-patagonia path. Each entry is ONE specific South American atmospheric texture filling the air between camera and far distance. Each entry 14-22 words.

✅ SOUTH AMERICAN ATMOSPHERIC REGISTERS:
  • Volcanic steam plume at high altitude in horizontal drift
  • Glacier-cold mist hanging at glacier base
  • Tatio geothermal-vent steam curtain rising vertically
  • Patagonian wind-blown spindrift off ridge crest
  • Salar de Uyuni dust-haze on dry-flat days
  • Atacama atmospheric clarity (extreme — almost no aerial perspective)
  • Amazon humid mist drift in canopy
  • Iguazu Falls mist veil filling lower frame
  • Inversion fog low in valley with peaks above
  • Mountain-tundra cold-haze pearl-grey
  • Storm cell advancing across Patagonian steppe
  • High-altitude blue-shift haze from thin atmosphere
  • Glacial-flour suspended in milky river creating cool haze
  • Volcanic ash haze suspended after eruption
  • Cloud shadow patches sliding across Altiplano plain
`,
    touchpoints: [
      'Volcanic steam plume at high altitude drifting in horizontal ribbon over cone',
      'Glacier-cold mist hanging in still air at glacier tongue base catching cool light',
      'Tatio geothermal-vent steam curtain rising vertically in cold dawn air',
      'Patagonian wind-blown spindrift streaming off granite ridge crest in white plumes',
      'Salar de Uyuni dust-haze suspended low over salt-flat on dry-flat windless day',
      'Atacama atmospheric clarity extreme with razor-sharp shadows and no aerial haze',
      'Amazon humid mist drift in mid-canopy filtering through emergent tree gaps',
      'Iguazu Falls mist veil filling lower frame in pearl-grey rainbow-shot shroud',
      'Inversion fog low in Patagonian valley with peaks above breaking through to clear sky',
      'Mountain-tundra cold-haze pearl-grey suspended over moraine field',
      'Storm cell rain curtain advancing across Patagonian steppe from west',
      'High-altitude blue-shift haze from thin atmosphere intensifying cobalt sky',
      'Glacial-flour suspended in milky river creating cool blue-grey haze over outwash plain',
      'Volcanic ash haze suspended after eruption tinting sky tan-grey',
      'Cloud shadow patches sliding across Altiplano plain in moving dark-light pattern',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  andes_patagonia_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's andes-patagonia path. Each entry is ONE specific South American sky cover filling the upper third of the frame. Each entry 14-22 words.

✅ SOUTH AMERICAN SKY REGISTERS:
  • Lenticular cloud cap over Fitz Roy or Cerro Torre
  • Patagonian banner cloud streaming off Cuernos peak
  • Sea-of-clouds inversion below Andean summit
  • Cobalt high-altitude noon sky (4000m+)
  • Sunset banner cumulus over Salar de Uyuni
  • Volcanic-ash-tinted sky with copper undertone
  • Atacama clear cobalt with high cirrus contrails
  • Pre-storm yellow-green oppressive Patagonian sky
  • Stratus deck low over Tierra del Fuego coast
  • Cumulonimbus anvil over Iguazu plateau
  • Layered lenticular wave-cloud bands over Aconcagua peak
  • Layered stratocumulus broken by cobalt patches
  • Star-crowded moonless Altiplano sky with Milky Way
  • Pastel polar-twilight cloud Patagonia
  • Sunset orange-violet ribbon at horizon over Andes
`,
    touchpoints: [
      'Lenticular cloud cap with softly feathered rim draped over Fitz Roy peak',
      'Patagonian banner cloud streaming horizontally off Cuernos del Paine peak',
      'Sea-of-clouds inversion below Andean summit with peaks emerging into clear sky',
      'Cobalt high-altitude noon sky at 4500-metre elevation deep saturation',
      'Sunset banner cumulus glowing copper-amber over Salar de Uyuni horizon',
      'Volcanic-ash-tinted sky with copper-yellow undertone after recent eruption',
      'Atacama clear cobalt sky with high cirrus contrails distant',
      'Pre-storm yellow-green oppressive Patagonian sky pressing low',
      'Stratus deck low over Tierra del Fuego coast in cool grey blanket',
      'Cumulonimbus anvil rising thirty thousand feet over Iguazu plateau',
      'Stacked lenticular wave-clouds layered in soft bands above Aconcagua peak',
      'Layered stratocumulus broken by cobalt patches in alternating bands',
      'Star-crowded moonless Altiplano sky with the Milky Way arch overhead',
      'Pastel polar-twilight cloud Patagonia in cool blue-pink-grey gradient',
      'Sunset orange-violet ribbon at horizon over Cordillera Blanca',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American sky entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  andes_patagonia_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's andes-patagonia path. Each entry is ONE tiny postage-stamp-scale element in the deep distance proving the landscape's VAST scale. South American wildlife or geometry ONLY. Each entry 14-22 words.

✅ SOUTH AMERICAN SCALE-PROVER REGISTERS:
  • Lone guanaco silhouette ant-small on Patagonian steppe
  • Small herd of guanaco pencil-tall on distant grassland
  • Vicuña pair silhouette barely readable on Altiplano
  • Andean condor wingspan distant against sky in glide
  • Single Andean fox shape on moraine ridge
  • Flamingo flock as small dark dots on Laguna Colorada
  • Llama herd pencil-tall on distant Altiplano slope
  • Lone Andean huemul deer on Patagonian forest edge
  • Tiny iceberg in Lago Argentino at deep distance
  • Glacial-melt-river thread silver-thin at far valley floor
  • Distant volcano cone silhouette as a single triangle
  • Tiny waterfall thread half-readable on distant cliff
  • Far-shore black-pebble line marking water's edge
  • Lone king penguin colony on distant Tierra del Fuego beach
  • Distant tapir silhouette at Amazon canopy edge
`,
    touchpoints: [
      'Lone guanaco silhouette ant-small in deep distance crossing Patagonian steppe',
      'Small herd of guanaco pencil-tall on distant grassland windswept',
      'Vicuña pair silhouette barely readable on Altiplano in deep distance',
      'Andean condor wingspan distant against sky in slow glide',
      'Single Andean fox shape on moraine ridge in deep distance',
      'Flamingo flock as a thousand small dark dots on Laguna Colorada surface',
      'Llama herd pencil-tall on distant Altiplano slope in deep distance',
      'Lone Andean huemul deer at distant Patagonian forest edge',
      'Tiny iceberg in Lago Argentino at deep distance dwarfed by glacier face',
      'Glacial-melt-river thread silver-thin at the far valley floor',
      'Distant volcano cone silhouette as a single triangle at deep horizon',
      'Tiny waterfall thread half-readable on a distant cliff in deep haze',
      'Far-shore black-pebble line marking the waters edge in deep distance',
      'Lone king penguin colony on distant Tierra del Fuego beach as small dark dots',
      'Distant tapir silhouette at Amazon canopy edge ant-small',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American scale-prover entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  andes_patagonia_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's andes-patagonia path. Each entry is ONE specific real-Earth South American phenomenon — the dramatic-but-real optical/weather event that elevates the frame. Each entry 14-22 words.

✅ SOUTH AMERICAN PHENOMENA:
  • Glacier calving event mid-fall on Perito Moreno
  • Lenticular wave-cloud bands capping Fitz Roy
  • Sea-of-clouds breaking around Cordillera Blanca peak
  • Salt-flat mirror perfect at dawn during wet season
  • Volcanic eruption fountain (Cotopaxi / Villarrica) glowing
  • Sunset alpenglow on Aconcagua snowfield
  • Iguazu Falls double-rainbow through mist at golden hour
  • Flamingo flock takeoff en-masse at Laguna Colorada
  • Snow squall over Torres del Paine
  • Tatio geyser eruption plume backlit at dawn
  • Patagonian wind-bend deformation of cloud
  • Aurora-free clear-sky Milky Way over Atacama (driest)
  • Sun-pillar vertical light column over Altiplano sunset
  • Crepuscular ray ladder through Andean cumulus
  • Glacial-flood (GLOF) surge across Patagonian outwash plain
`,
    touchpoints: [
      'Glacier calving event mid-fall on Perito Moreno seracs cascading into lake',
      'Lenticular wave-clouds capping Fitz Roy peak in soft layered bands',
      'Sea-of-clouds breaking around Cordillera Blanca peak at dawn',
      'Salt-flat mirror perfect at dawn during wet season with thin-water layer',
      'Volcanic eruption fountain incandescent-red glowing at Villarrica crater rim',
      'Sunset alpenglow rose-amber on Aconcagua snowfield at first-light',
      'Iguazu Falls double-rainbow piercing waterfall mist at golden hour in full bands',
      'Flamingo flock takeoff en-masse from Laguna Colorada in pink cloud',
      'Snow squall sweeping over Torres del Paine peaks in diagonal streaks',
      'Tatio geyser eruption plume backlit copper at dawn against cobalt sky',
      'Patagonian wind-bend deformation curving cloud streamer off ridge',
      'Aurora-free clear-sky Milky Way arching over Atacama driest-on-Earth atmosphere',
      'Sun-pillar vertical light column rising from horizon over Altiplano sunset',
      'Crepuscular ray ladder breaking through Andean cumulus in three distinct beams',
      'Glacial-flood (GLOF) surge sweeping across Patagonian outwash plain in muddy churn',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} South American phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  // ═══════════════════════════════════════════════════════════
  // AFRICAN-LANDSCAPE path (2026-06-01 v2 resurrection after v1 scrap).
  // Full breadth of African biomes — savanna, Congo rainforest, Okavango
  // Delta, Sahara / Namib dunes, Madagascar baobab + spiny forest, Cape
  // fynbos, riverine flats. Universal guards from
  // [[feedback_regional_path_buildout_lessons]]:
  //   • NO photographer names (Frans Lanting / Nick Brandt / Beverly
  //     Joubert / Salgado / Art Wolfe — Art Wolfe especially leaked
  //     mountain content into v1)
  //   • NO negation language ("no mountains" / "no humans") in pools
  //   • Subject entries LEAD with African toponym in first 5-8 words
  //   • Subject pool has per-biome quotas so 25 entries actually span
  //     the 8 biomes (v1 had no quota → 5/5 savanna)
  //   • Scale-prover pool entries name the appropriate biome inline so
  //     they only get matched to the right subjects (v1 R5 injected
  //     elephant on grassland scale-prover into a Sahara prompt)
  //   • NO mountain triggers anywhere (Kilimanjaro / Meru / Lengai /
  //     alpine / alpenglow / escarpment / snow-capped — Africa is
  //     non-mountain biomes for this path)
  // ═══════════════════════════════════════════════════════════

  african_landscape_subject: {
    format: 'simple',
    theme: `PURE AFRICAN RAW HABITAT SCENES for EarthBot's african-landscape path. THIS IS EARTHBOT — THE LAND IS THE HERO, NOT THE WILDLIFE. Each entry is ONE iconic African HABITAT composition where the place itself dominates the frame. Wildlife appears (this is Africa) but ALWAYS at scale-prover scale — tiny, incidental, NEVER the subject. Each entry 30-55 words.

🎯 THE HABITAT IS THE HERO — composition guidance per entry:
  • The HABITAT fills 50-65% of the frame (the canopy ceiling, the watering hole basin, the kopje boulder face, the delta channel, the dune sea, the salt pan, the baobab grove)
  • CAMERA-ANGLE VARIETY mandatory across the pool — entries must rotate through: low-angle hero from ground level / DRONE POV aerial down-angle / canopy POV looking DOWN at jungle below / waterline reflection POV / kopje vantage looking out / silhouette against burning sky / wide cinematic deep-vista
  • Wildlife if present is matchstick-tiny incidental detail at deep distance — never hero-scale, never dominating composition, never named as the subject of the entry

⚠️ MANDATORY — every entry must LEAD with an African toponym in the first 5-8 words.

🌍 ICONIC HABITAT COMPOSITIONS to draw from (mix across the 25 entries):
  A. **WATERING HOLE VISTAS** — pretty Etosha / Mara / Tarangire watering hole at sunset with broad savanna stretching behind, golden grass reflected in still water, distant acacia line silhouettes, banner cumulus above — the WATER + BACKDROP is the hero. Animals if any are pencil-tall on far shore.
  B. **CONGO CANOPY-DOWN POV** — drone-level aerial looking DOWN at the Congo Basin or Mahale rainforest canopy, emerald layers stretching to flat horizon, kapok and ceiba emergents rising above the canopy ceiling, distant blackwater river bend visible cutting through, mist drift in mid-canopy.
  C. **FOREST UNDERSTORY DEEP** — Mahale / Kibale / Bwindi forest interior ground-level POV with dappled gold shafts through layered canopy, massive buttress roots, fern-and-moss ground, deep emerald shadow, cathedral-quiet light. No primates in shot — JUST the habitat.
  D. **KOPJE / BOULDER VANTAGE** — Serengeti granite kopje pile rising from short-grass plain at sunset, lichen-encrusted boulders catching warm sidelight, the savanna stretching to horizon below, distant herd thread pencil-tall. The KOPJE is the hero.
  E. **ICONIC TREE HERO** — lone massive ancient baobab on Tarangire / Serengeti plain at blood-red sunset, low-angle hero stance looking up at twisted bottle-trunk silhouetted against burning sky / OR Avenue of the Baobabs Madagascar colonnade at dusk / OR sausage-tree silhouette / OR umbrella acacia perfect canopy against horizon
  F. **DELTA CHANNEL / LILY LAGOON** — Okavango Delta papyrus channel at sunset with flat water reflecting amber-and-rose sky, papyrus walls glowing gold, lily-pad cluster floating, distant palm islands at horizon / OR delta water-edge with hippo pod pencil-tall at deep distance
  G. **DUNE SEA EPIC** — Sahara erg / Namib Sossusvlei dune sea stretching to flat blazing horizon, wind-sculpted crests casting deep slip-face shadows in raking sidelight, sky deepening cobalt-to-burnt-orange. The DUNE FORM is the hero.
  H. **SALT PAN VISTA** — Etosha / Makgadikgadi / Deadvlei salt pan vast empty expanse with razor-flat horizon, heat-shimmer dissolving far edge, lone baobab island OR petrified camel-thorn trees as the focal detail. The PAN is the hero.
  I. **RIVERINE PLAIN** — Zambezi / Nile / Mara River bend cutting a broad S-curve through golden plain, water glinting silver reflecting open sky, papyrus-fringed banks, heron silhouettes motionless along glassy shallows.
  J. **FYNBOS COASTAL** — Cape fynbos protea-bloom slope rolling to flat Atlantic horizon, dense low scrub in coral and pink, breaking storm above ocean.
  K. **MADAGASCAR SPINY FOREST** — alien Didierea + Alluaudia columns rising from red laterite, hard blue sky overhead, surreal forest of spines stretching to flat horizon.
  L. **RAINFOREST CLEARING (BAI)** — Congo Basin natural forest clearing where the canopy parts to reveal a still pool, mineral-stained water reflecting sky-light shaft, dense emerald wall ringing the clearing.

🎯 BIOME COVERAGE TARGET (across 25 entries):
  • Savanna grasslands (Serengeti / Maasai Mara / Tarangire / Tsavo) inc. WATERING HOLES + KOPJES + ICONIC TREES: 7 entries
  • Salt pans (Etosha / Makgadikgadi / Deadvlei): 3 entries
  • Okavango Delta + Zambezi river plain + DELTA CHANNELS: 4 entries
  • Congo Basin rainforest CANOPY-DOWN POV + Mahale / Bwindi UNDERSTORY + BAI CLEARING: 4 entries
  • Sahara erg dune seas (Erg Chebbi / Tadrart Acacus): 2 entries
  • Namib (Deadvlei / Sossusvlei / coastal red dunes): 2 entries
  • Madagascar (Avenue of the Baobabs / spiny forest): 2 entries
  • Cape fynbos coastal: 1 entry

🚫 ABSOLUTE BANS (every entry MUST clear these):
  • ZERO photographer names (Frans Lanting / Nick Brandt / Beverly Joubert / Sebastião Salgado / Art Wolfe / Anup Shah — these leak verbatim into the polished output)
  • ZERO mountain triggers — NO Kilimanjaro, NO Mt. Meru, NO Ol Doinyo Lengai, NO Ngorongoro CRATER RIM (rim reads as mountain to Flux), NO alpenglow, NO snow-capped peaks, NO alpine ridges, NO escarpments, NO cliff-faces, NO Rift Valley walls. Africa for this path is FLAT or CANOPY only.
  • ZERO humans, herders, villages, kraal huts, fences, roads, vehicles, safari trucks
  • ZERO sci-fi / fantasy / portal / impossible-reflection
  • ZERO negation phrases — describe positive content only
  • ZERO non-African analogues (no "Yellowstone-like", no "Patagonian-style")
  • ZERO wildlife as the hero — wildlife is allowed but ONLY at scale-prover scale (matchstick-tiny, deep distance, incidental detail). NEVER "lone elephant on grass plain" as the hero. NEVER "zebra herd crossing" as the hero. The HABITAT is the hero, the wildlife is decoration. If wildlife is in shot, name it AFTER the habitat hero, as a tiny pencil-tall element in deep distance.

✅ EVERY ENTRY MUST INCLUDE:
  • African toponym in first 5-8 words
  • Specific HABITAT hero (watering hole vista / forest understory / canopy-down POV / kopje vantage / baobab grove / delta channel / dune sea / salt pan)
  • Specific CAMERA ANGLE (low-angle / drone aerial / canopy POV / waterline reflection / silhouette / wide cinematic)
  • Multi-tier depth language
  • Africa-coded materials (red laterite / acacia / baobab / papyrus / dry golden grass / orange sand / kopje granite / fynbos protea / Madagascar Didierea / Congo emergent kapok)
  • A specific DRAMATIC lighting moment (blood-red sunset silhouette / electric storm / Milky Way over delta / monsoon rainbow / haboob dust-wall / dappled canopy gold-shaft / mammatus cloud underside)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Tarangire watering hole at sunset, the broad still water dominating the foreground reflecting a blood-orange sky in perfect mirror, golden grass and a distant acacia line silhouetted on the far bank, banner cumulus catching warm sidelight, the savanna backdrop stretching unbroken to flat amber horizon — the WATERING HOLE is the hero',
      'Etosha waterhole vista at dusk, the broad mineral-rimmed pool filling the lower frame in cool blue-grey, flat thornveld stretching behind to a razor-flat horizon glowing copper-rose, distant elephant herd pencil-tall on the far bank as small dark dots — the WATERHOLE BASIN is the hero, not the elephants',
      'Maasai Mara watering hole at golden hour, mirror-still water reflecting acacia silhouettes and burning sky in symmetrical doubling, golden grass rolling unbroken behind to distant horizon, foreground close water-edge reeds catching warm sidelight, banner cumulus glowing copper above',
      'Congo Basin rainforest canopy DRONE-LEVEL aerial POV looking DOWN at the emerald canopy below, the layered green roof of the jungle stretching to flat horizon with kapok and ceiba emergent trees rising above the ceiling, mist drift in mid-canopy, distant blackwater river bend cutting silver through the green, golden-hour sidelight raking emergent crowns',
      'Mahale forest canopy view looking DOWN through the upper canopy layer, dense emerald foliage layered in tiers below, a single kapok emergent crown catching warm raking light, mist drift through gaps revealing flat-emerald canopy stretching to horizon, no ground visible — this is the canopy world',
      'Mahale forest interior ground-level POV with dappled gold shafts piercing the layered canopy above, ancient buttress-rooted hardwood trunks rising cathedral-tall, deep emerald understory in humid shadow, foreground close fern and moss cluster wet at near edge, warm gold light pooling on root buttress',
      'Bwindi forest understory at dawn, dense layered emerald foliage with low mist drifting between massive buttress roots, dappled cool blue light filtering through canopy, foreground close ground-orchid cluster on rotting log, deep cathedral shadow receding into emerald gloom — the FOREST INTERIOR is the hero',
      'Congo Basin natural forest clearing (bai) at midday, the canopy parts to reveal a still mineral-stained pool dappled by light shafts from above, dense emerald wall ringing the clearing, foreground close shore mud at near edge, distant forest elephant pencil-tall at far edge as a small dark shape',
      'Serengeti granite kopje rising boulder-piled from the short-grass plain at sunset, lichen-encrusted weathered boulders catching warm copper sidelight, the savanna stretching below to flat amber horizon, foreground close kopje boulder face at near edge, distant herd thread pencil-tall on plain below',
      'Maasai Mara granite kopje at first light, the ancient boulder pile silhouetted against pale rose dawn sky, surrounding short-grass plain rolling to flat horizon, foreground close lichen-and-rock detail at near edge, mist drift low over plain — the KOPJE is the hero',
      'Tarangire dusk plain with a lone massive ancient baobab silhouetted hero-scale against a burning blood-red horizon, low-angle shot from grass level looking up at the twisted bottle-trunk and bare branch-crown, golden grass stretching flat beneath, blazing rose-amber sky behind the silhouette',
      'Avenue of the Baobabs Madagascar at dusk, the colonnade of Adansonia grandidieri trunks rising straight and massive on both sides of the flat red-laterite track, low-angle hero stance looking up the colonnade, small flat-topped crowns catching last gold light against blazing rose-amber sky',
      'Serengeti lone acacia umbrella tree silhouetted perfectly against a blazing copper sunset, the iconic flat canopy spread wide hero-scale at the horizon, golden grass plain stretching flat in every direction beneath, banner cumulus catching warm color above — the ICONIC ACACIA is the hero',
      'Okavango Delta papyrus channel at sunset, the flat water filling lower frame reflecting amber-rose sky in perfect mirror, golden papyrus walls glowing on both banks, distant palm islands as low dark silhouettes on flat horizon, foreground close lily-pad floating wet at near edge',
      'Okavango Delta lily-pad lagoon at golden hour drone POV looking down, the wide flat water surface entirely carpeted in green lily pads and white blooms, water-channels carving through, palm islands as dark dots, blazing amber-and-rose sky catching warm sidelight on water surface',
      'Sahara Erg Chebbi dune sea at sunset, wave-after-wave of red-orange dunes stretching to flat blazing horizon, wind-sculpted crests casting deep violet slip-face shadows in raking horizontal sidelight, foreground close wind-rippled sand pattern at near edge, enormous sky deepening cobalt to burnt-orange',
      'Namib Sossusvlei orange dune face at sunrise, the massive red-orange dune crest with razor-sharp slip-face shadow line bisecting the frame, low-angle stance looking up at the dune wall from clay-pan floor, foreground close iron-rich orange sand ripple at near edge, pale-rose sky brightening above',
      'Namib Deadvlei white clay pan vista, cracked pale floor stretching flat in every direction with petrified camel-thorn trees standing black and skeletal hero-scale against the blazing orange dune wall behind, foreground close cracked clay polygon at near edge, deep cobalt overhead sky',
      'Etosha salt pan vast empty vista, the glaring white expanse stretching to razor-flat horizon under hard midday cobalt sky, heat-shimmer mirage dissolving the far edge, foreground close salt-polygon hexagonal crust pattern at near edge, lone baobab island pencil-tall in middle distance',
      'Makgadikgadi salt pan at moonless night, the white pan glowing pearl-grey under a star-crowded Milky Way arch overhead, the horizon razor-flat and faintly silvered, one isolated baobab silhouetted dark against the star field — the PAN + SKY is the hero',
      'Zambezi river bend wide cinematic vista above the falls, the broad silver-flat water surface S-curving through golden floodplain to a distant horizon, papyrus-fringed banks catching warm sidelight, foreground close river-cobble shore at near edge, heron silhouettes motionless along glassy shallow margins',
      'Cape fynbos coastal slope at golden hour, dense protea-bloom carpet in coral and pink stretching to a flat Atlantic horizon, foreground close king-protea bloom cluster catching warm sidelight, breaking storm cumulus over ocean catching molten copper light',
      'Madagascar Didierea and Alluaudia spiny forest at midday, surreal alien columns of spiny succulents rising from red laterite soil in dense branching clusters, low-angle hero stance looking up at the spine-columns against hard blue Madagascar sky, foreground close laterite-red soil at near edge',
      'Nile floodplain papyrus marsh at dawn, dense towering papyrus stands lining a broad flat-banked channel, still water reflecting pale rose sky in perfect mirror, foreground close papyrus stem cluster at near edge, flat open horizon stretching beyond the fringe, morning mist lying low over the calm water',
      'Tsavo East red-elephant plain at golden hour, dry golden grass stretching to a flat dusty-red horizon, scattered acacia silhouettes catching warm sidelight, foreground close red-laterite soil with dust-covered acacia thorn at near edge, banner cumulus glowing copper above the flat plain',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African subject entries. NO preamble. Each entry 30-55 words on a single line. Format follows the touchpoint pattern: "Toponym + biome + close-foreground + midground hero + distant flat-or-canopy depth + lighting note".`,
  },

  african_landscape_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's african-landscape path. Each entry is ONE specific close-edge African detail anchoring the lower 15-20% of the frame. Each entry 14-25 words.

✅ AFRICA-SPECIFIC CLOSE-EDGE DETAILS:
  • Dry red-oat grass tussock at near edge (savanna)
  • Termite mound dark and faintly glistening at near edge (savanna)
  • Silver-leaf thorn bush cluster at near edge (savanna)
  • Cracked salt-crust hexagonal pattern at near edge (Etosha / Makgadikgadi)
  • Lily-pad cluster wet at near edge (Okavango Delta)
  • River cobbles wet polished at near edge (Zambezi / Nile)
  • Grass tussock on the river bank at near edge
  • Wind-rippled sand parallel-ridge pattern at near edge (Sahara)
  • Iron-streaked desert-varnish boulder at near edge (Sahara)
  • Cracked clay polygon pattern at near edge (Namib Deadvlei)
  • Iron-rich orange sand ripple pattern at near edge (Namib)
  • Laterite-red soil at near edge (Madagascar)
  • King-protea bloom cluster at near edge (Cape fynbos)
  • Ceiba crown emergent foliage at near edge (Congo Basin canopy)
  • Fern cluster on root-tangled forest floor (Mahale)
  • Papyrus stem cluster at near edge (Nile / Okavango)
  • Volcanic black-pebble shore at near edge (Lake Turkana)
  • Red-dust covered acacia thorn at near edge (Tsavo)
`,
    touchpoints: [
      'Dry red-oat grass tussock at near edge with seed-heads windswept and silhouetted',
      'Weathered red-clay termite mound with rain-carved flutes catching sidelight at near edge',
      'Silver-leaf thorn bush cluster at near edge catching lateral evening warmth on dusty paired thorns',
      'Cracked salt-crust hexagonal polygon pattern at near edge stretching to white pan',
      'Floating lily-pad cluster wet at near edge with white blooms partially open',
      'Glacier-polished river cobbles wet at near edge sorted in arc pattern by current',
      'Grass tussock on the river bank at near edge bent by floodplain current',
      'Wind-rippled Sahara sand parallel-ridge pattern at near edge in fine wave forms',
      'Iron-streaked desert-varnish boulder with rust-red flanks at near edge',
      'Cracked clay polygon pattern at near edge bone-dry warm-cream Deadvlei surface',
      'Iron-rich orange sand ripple pattern at near edge with wind-sculpted slip-face crest',
      'Laterite-red Madagascar soil at near edge with single Alluaudia spine cluster',
      'King-protea bloom cluster with papaya-bright flower heads at near edge in Cape fynbos slope',
      'Ceiba crown emergent foliage at near edge above Congo canopy with dappled light',
      'Cluster of ferns on root-tangled Mahale forest floor at near edge in humid shadow',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  african_landscape_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's african-landscape path. Each entry is ONE specific African lighting register. Each entry 14-22 words.

✅ AFRICAN LIGHTING REGISTERS:
  • Dust-haze sunset (savanna / Sahara)
  • Golden-hour rake on grass plain
  • Sundown amber on baobab trunk
  • Blue-hour twilight over delta
  • Hard cobalt overhead midday (salt pan / desert)
  • Dappled emerald canopy break (rainforest)
  • Sundown amber on Avenue of the Baobabs
  • Storm-break shaft tearing through dark cloud
  • Pre-storm yellow-green oppressive light
  • Backlit translucent papyrus at sunset
  • Sundown rake on dune crest with deep slip-face shadow
  • Star-crowded moonless savanna night with Milky Way
  • Diffuse overcast pearl-grey light (Makgadikgadi)
  • Heat-shimmer dissolution at midday horizon
  • Crepuscular ray ladder through breaking cloud
`,
    touchpoints: [
      'Dust-haze sunset turning the descending sun deep ochre, savanna plain saturated in copper-orange',
      'Golden-hour rake on grass plain in horizontal warm sidelight at thirty-degree solar angle',
      'Sundown amber on baobab trunk lighting bottle-shaped silhouette against blazing horizon',
      'Blue-hour polar twilight over delta in cool cobalt fading to amber at low horizon',
      'Hard cobalt overhead midday on salt pan with razor-sharp shadows',
      'Dappled emerald canopy break with warm gold shafts pooling on moss below',
      'Sundown amber on Avenue of the Baobabs colonnade glowing copper against rose sky',
      'Storm-break shaft tearing through dark nimbostratus illuminating one patch of plain',
      'Pre-storm yellow-green oppressive light with falling barometric pressure',
      'Backlit translucent papyrus at sunset glowing gold against pale rose sky',
      'Sundown rake on dune crest casting deep violet slip-face shadow',
      'Star-crowded moonless savanna night with Milky Way arching overhead',
      'Diffuse overcast pearl-grey light rendering Makgadikgadi pan shadowless',
      'Heat-shimmer dissolution at midday horizon making distant tree-line waver liquid',
      'Crepuscular ray ladder breaking through breaking cloud over plain in three beams',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  african_landscape_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's african-landscape path. Each entry is ONE specific African atmospheric texture filling the air between camera and far distance. Each entry 14-22 words.

✅ AFRICAN ATMOSPHERIC REGISTERS:
  • Dry-season dust haze (savanna)
  • Smoke-haze drift from distant grass-burn
  • Humid emerald mist drift in Congo canopy
  • Sea-fog rolling onto Namib coast
  • Heat-shimmer mirage band at midday horizon
  • Sahara haboob dust-wall advancing
  • Delta morning mist low over glassy channel
  • Steaming termite-mound damp earth (post-rain)
  • Coastal salt-spray on Cape fynbos
  • Pollen-edged sidelight on golden grass
  • Madagascar red-dust suspended in warm bands
  • Storm cell rain curtain advancing across plain
  • Cloud shadow patches sliding across savanna
  • Acacia-pollen-edged warm air
  • Humid leaf-and-mud air in rainforest
`,
    touchpoints: [
      'Dry-season dust haze suspended low over savanna in fine warm horizontal bands',
      'Smoke-haze drift from distant grass-burn tinted warm against violet evening sky',
      'Humid emerald mist drift in Congo canopy filtering through emergent tree gaps',
      'Cold sea-fog rolling onto Namib coast from offshore in dense pearl veil',
      'Heat-shimmer mirage band at midday horizon dissolving far tree-line into liquid',
      'Sahara haboob dust-wall darkening far horizon with sharp vertical front advancing',
      'Delta morning mist low over glassy channel in cool blue-grey horizontal bands',
      'Steaming termite-mound damp earth post-rain rising in fine warm exhalation',
      'Coastal salt-spray on Cape fynbos drifting inland from Atlantic breakers',
      'Pollen-edged warm sidelight on golden grass with fine particulate suspension',
      'Madagascar red-dust suspended in warm horizontal bands at mid-height',
      'Storm cell rain curtain advancing across plain from west in diagonal sweep',
      'Cloud shadow patches sliding across savanna in moving dark-light pattern',
      'Acacia-pollen-edged warm air drifting across plain in fine yellow haze',
      'Humid leaf-and-mud air in rainforest understory thick with smell of damp wood',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  african_landscape_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's african-landscape path. Each entry is ONE specific African sky cover. Each entry 14-22 words.

✅ AFRICAN SKY REGISTERS:
  • Banner cumulus catching warm savanna sidelight
  • Anvil cumulonimbus thunderhead rising over plain
  • Cobalt midday Sahara sky with high cirrus
  • Mare-tail cirrus tinted amber at sunset
  • Heavy storm-cloud deck low over Tarangire
  • Pale-rose sunset banner over Serengeti
  • Star-crowded moonless African night sky with Milky Way
  • Pre-storm yellow-green oppressive sky
  • Layered stratocumulus over Cape fynbos broken by cobalt
  • Hard blue Madagascar midday sky over spiny forest
  • Sunset orange-and-rose ribbon at flat horizon
  • Diffuse overcast pearl-grey over Makgadikgadi pan
  • Towering thunderhead over Mahale lake
  • Pale lavender pre-dawn over delta
  • Sundown rose-and-copper over dune crest
`,
    touchpoints: [
      'Banner cumulus catching warm savanna sidelight in pale rose with grey flat bases',
      'Anvil cumulonimbus thunderhead rising thirty-thousand-feet over Serengeti plain',
      'Cobalt midday Sahara sky with high cirrus contrails in pale streak',
      'Mare-tail cirrus tinted amber at sunset over flat savanna horizon',
      'Heavy storm-cloud deck low over Tarangire in dark pressing nimbostratus',
      'Pale-rose sunset banner cumulus over Serengeti glowing copper-amber',
      'Star-crowded moonless African night sky with the Milky Way arch overhead',
      'Pre-storm yellow-green oppressive sky pressing low over savanna',
      'Layered stratocumulus over Cape fynbos broken by cobalt patches',
      'Hard blue Madagascar midday sky over spiny forest in deep saturation',
      'Sunset orange-and-rose ribbon at flat horizon glowing across the plain',
      'Diffuse overcast pearl-grey shadowless sky over Makgadikgadi salt pan',
      'Towering thunderhead rising over Mahale lake in afternoon convection',
      'Pale lavender pre-dawn over Okavango Delta water in cool gradient',
      'Sundown rose-and-copper over Sahara dune crest in saturated horizon glow',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African sky entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  african_landscape_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's african-landscape path. Each entry is ONE tiny postage-stamp-scale element in the deep distance proving the landscape's VAST scale. CRITICAL: each entry must SELF-DECLARE its biome match so it only gets picked for the right subject — e.g. "Lone elephant on Serengeti savanna" so the brief composer doesn't pair it with a Sahara subject. Each entry 14-22 words.

✅ AFRICAN SCALE-PROVER REGISTERS (biome-tagged):
  • Lone elephant silhouette on Serengeti plain (savanna)
  • Zebra herd thread pencil-tall on Maasai Mara grassland (savanna)
  • Wildebeest column threading across Mara plain (savanna)
  • Giraffe pair silhouette on Tarangire dusk plain (savanna)
  • Lion silhouette on distant termite mound (savanna)
  • Hippo pod surfacing in Chobe river (Okavango / Zambezi)
  • Flamingo flock as pink cloud on Lake Turkana (alkaline lake)
  • Lechwe herd at delta water edge (Okavango)
  • Sitatunga silhouette in Okavango papyrus (Okavango)
  • Chimpanzee in canopy at Mahale forest interior (rainforest)
  • Gorilla family at scrub margin Congo Basin (rainforest)
  • Lemur on baobab branch Madagascar Avenue (Madagascar)
  • Oryx silhouette on Namib dune crest (Namib)
  • Addax pencil-tall on Sahara dune face (Sahara)
  • Fennec fox shape on Sahara dune (Sahara)
  • Cape gannet flock over fynbos coast (Cape fynbos)
`,
    touchpoints: [
      'Lone elephant silhouette ant-small on Serengeti savanna plain in deep distance',
      'Zebra herd thread pencil-tall crossing Maasai Mara grassland in deep distance',
      'Wildebeest column threading across Mara plain at deep distance as dark river',
      'Giraffe pair silhouette pencil-tall on Tarangire dusk plain in deep distance',
      'Lion shape ant-small on distant Serengeti termite mound at deep distance',
      'Hippo pod surfacing pencil-tall in Chobe river at deep distance',
      'Flamingo flock as pink cloud on Lake Turkana shore in middle distance',
      'Lechwe herd pencil-tall at Okavango delta water edge in deep distance',
      'Sitatunga silhouette barely readable in Okavango papyrus at deep distance',
      'Chimpanzee silhouette ant-small in Mahale forest canopy mid-distance',
      'Gorilla family pencil-tall at scrub margin Congo Basin in deep distance',
      'Lemur silhouette on Madagascar baobab branch in deep distance ant-small',
      'Oryx silhouette pencil-tall on Namib dune crest at deep distance',
      'Addax pencil-tall on Sahara dune face in deep distance',
      'Cape gannet flock pencil-tall over fynbos coast in middle distance',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African scale-prover entries. NO preamble. Each entry 14-22 words on a single line. EVERY entry must self-tag the biome (savanna / delta / rainforest / Sahara / Namib / Madagascar / fynbos / lake) inline so the brief composer matches it only to the right subject.`,
  },

  african_landscape_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's african-landscape path. Each entry is ONE specific real-Earth African phenomenon. Each entry 14-22 words.

✅ AFRICAN PHENOMENA:
  • Sahara haboob dust-wall advancing across plain
  • Virga curtain evaporating mid-fall before reaching ground
  • Distant thunderstorm anvil over plain with rain curtain
  • Mirage shimmer dissolving far horizon at midday
  • Grass-burn smoke column rising warm against violet sky
  • Wildebeest river-crossing at Mara River
  • Flamingo flock takeoff en-masse from soda lake
  • Dust-devil column rising vertically across savanna
  • Double-rainbow arc through delta rain curtain
  • Sundown banner cloud over Sossusvlei dunes
  • Lightning fork over distant Congo highland
  • Smoke-tinted yellow-green sky from wildfire haze
  • Sand-storm advancing across Sahara erg
  • Termite alate swarm rising at first rain
  • Distant elephant-stirred dust column in deep distance
`,
    touchpoints: [
      'Sahara haboob dust-wall advancing across plain with sharp vertical front darkening horizon',
      'Virga curtain evaporating mid-fall before reaching ground over savanna',
      'Distant thunderstorm anvil over plain with grey-blue rain curtain descending',
      'Mirage shimmer dissolving far horizon at midday into mirage band',
      'Grass-burn smoke column rising warm against violet evening sky in vertical plume',
      'Wildebeest river-crossing at Mara River with thousands streaming through churning current',
      'Flamingo flock takeoff en-masse from soda lake in pink cloud',
      'Dust-devil column rising vertically across savanna in spiraling brown plume',
      'Double-rainbow arc through delta rain curtain at golden hour',
      'Sundown banner cloud over Sossusvlei dunes in copper-amber glowing layer',
      'Distant lightning forking over Congo highland from a mature thunderstorm',
      'Smoke-tinted yellow-green oppressive sky from distant wildfire haze',
      'Sand-storm advancing across Sahara erg with horizontal sand streamers',
      'Termite alate swarm rising at first rain in fine cloud over plain',
      'Distant elephant-stirred dust column rising vertically in deep distance',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} African phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  // ═══════════════════════════════════════════════════════════
  // ASIA-LANDSCAPE path (2026-06-01 activation).
  // Habitat-hero recipe applied from african v2 (the LAND is the hero,
  // wildlife incidental). Universal guards:
  //   • NO photographer names anywhere
  //   • NO negation language in pool entries
  //   • Subject entries LEAD with Asian toponym in first 5-8 words
  //   • NO torii / pagoda / temple / stupa / village / rice-terrace
  //     (cultural — respect)
  //   • Asia HAS mountains (Huangshan / Cordillera / Himalaya) — those
  //     are GOAL not anti-pattern. But Asian-specific (mist-shrouded
  //     granite / karst pillar), NEVER generic European Alps.
  // ═══════════════════════════════════════════════════════════

  asia_landscape_subject: {
    format: 'simple',
    theme: `PURE PAN-ASIAN RAW HABITAT SCENES for EarthBot's asia-landscape path. THE LAND IS THE HERO. Each entry is ONE iconic Asian HABITAT composition where the place itself dominates the frame. Wildlife if present is matchstick-tiny incidental scale-prover, NEVER hero. Each entry 30-55 words.

🎯 THE HABITAT IS THE HERO:
  • The HABITAT fills 50-65% of the frame (the granite peak / karst pillar / sakura grove / bamboo forest / cedar trunk / lake / dune sea / volcano basin)
  • CAMERA-ANGLE VARIETY mandatory: low-angle hero stance / DRONE POV aerial / canopy POV / waterline reflection / sea-of-clouds vantage / silhouette / wide cinematic vista
  • No humans, no temples, no torii, no pagodas, no stupas, no rice terraces, no villages, no civilization

⚠️ MANDATORY — every entry must LEAD with an Asian toponym in the first 5-8 words.

🌏 ICONIC ASIAN HABITAT COMPOSITIONS (mix across the 25 entries):
  A. **MT. FUJI SILHOUETTE** — iconic conical Fuji from Hakone / Kawaguchiko / 5-lakes region, mirror-reflected in foreground lake at dawn, cherry blossoms or autumn maples framing
  B. **HUANGSHAN SEA-OF-CLOUDS** — Yellow Mountain granite peaks emerging like islands from a rolling white cloud sea at sunrise, twisted pine clinging to cliff, peak silhouettes layered in deep tier
  C. **GUILIN / YANGSHUO KARST RIVER** — limestone pillars rising from misty Li River valley, fishermen-free water, mist drifting between pillars at dawn
  D. **ZHANGJIAJIE / WULINGYUAN PILLAR FOREST** — Avatar-style sandstone pillar forest with mist between, drone POV down through pillar tops, lush vegetation crowning each pillar
  E. **HALONG BAY AERIAL** — limestone karst islands rising from jade-green sea, drone POV looking down at the archipelago, mist drift between islands
  F. **YAKUSHIMA ANCIENT CEDAR** — moss-covered ancient cedar trunks rising cathedral-tall in dense emerald rainforest, dappled light through dense canopy, ground-level hero POV
  G. **SAKURA GROVE / CHERRY BLOSSOM** — dense cherry-blossom tunnel along Kyoto / Yoshino / Hirosaki, pink-and-pearl explosion against pale sky at peak bloom, low-angle hero stance
  H. **HOKKAIDO BIRCH-CONIFER SNOW** — solitary frosted birch grove on Hokkaido snow plain, low-angle hero against pale winter sky, mist hanging low
  I. **BAMBOO FOREST INTERIOR** — Arashiyama / Sagano bamboo grove, looking up at vertical green stalks reaching cathedral-tall, dappled emerald light filtering through
  J. **JIUZHAIGOU TURQUOISE LAKE** — vivid jade-and-turquoise water with crystal clarity reflecting autumn-colored forest, travertine cascades flowing between pools
  K. **TIBETAN PLATEAU VISTA** — high-altitude grassland stretching to distant snow peaks under deep cobalt sky, glacial lake mirror reflection, yak-skull-zero geometry
  L. **GOBI DUNE SEA / FLAMING CLIFFS** — Mongolian Gobi tangerine dunes stretching to flat horizon, OR sunset-lit red-cliff badlands of Bayanzag
  M. **MOUNT BROMO VOLCANO** — Indonesian Bromo / Semeru caldera with sulfur plume at dawn, sea-of-sand ash floor stretching below, neighboring volcano cones silhouetted
  N. **TAROKO MARBLE GORGE** — Taiwan marble canyon walls with patterned blue-and-white striations, river running below, narrow slot opening
  O. **MARBLE CAVES / CRYSTAL POOLS** — pattern reflections + cool grey-and-white marble walls

🚫 ABSOLUTE BANS (every entry MUST clear these):
  • ZERO photographer names (Michael Kenna / Hengki Koentjoro / Marc Adamus / Max Rive — these leak verbatim)
  • ZERO temples, torii, pagodas, stupas, statues, prayer flags, stone lanterns, monks (cultural — respect)
  • ZERO villages, rice terraces, agriculture, roads, vehicles, refugios, lighthouses, structures
  • ZERO European Alpine analogues ("Alps-like" / "Dolomites-style") — describe Asia on its own terms
  • ZERO sci-fi / fantasy / portal / impossible-reflection
  • ZERO negation phrases — describe positive content only
  • ZERO wildlife-as-hero — wildlife at scale-prover scale only (matchstick-tiny, deep distance)

✅ EVERY ENTRY MUST INCLUDE:
  • Asian toponym in first 5-8 words
  • Specific HABITAT hero (peak / karst pillar / cedar grove / sakura tunnel / bamboo forest / lake / dune / volcano)
  • Specific CAMERA ANGLE (low-angle / drone aerial / canopy POV / waterline reflection / sea-of-clouds vantage / silhouette / wide vista)
  • Multi-tier depth language
  • Asia-coded materials (granite / karst limestone / marble / volcanic ash / sulfur / bamboo / cedar / birch / sakura / moss / glacier ice)
  • A specific DRAMATIC lighting moment (sea-of-clouds dawn / blood-red sunset / blue-hour twilight / Milky Way over Gobi / sulfur backlight at Ijen / monsoon rainbow)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Mt. Fuji silhouette at dawn from Kawaguchiko lake POV, the iconic conical peak mirror-reflected in still water, pale rose sky deepening to cobalt zenith, foreground close cherry blossom branch at near edge in soft pink, mist drift low over the lake surface — the FUJI SILHOUETTE is the hero',
      'Huangshan granite peaks emerging from a rolling sea-of-clouds at sunrise, twisted Huangshan pine clinging to a cliff in low-angle hero stance, peaks layered in deep tier into the distance, foreground close granite-cliff edge with pine roots at near edge, blazing rose-amber sky above the cloud sea',
      'Guilin karst river valley at dawn, limestone pillars rising from misty Li River in a dramatic deep-tier procession, jade water reflecting the pillar silhouettes, mist drifting low between formations, foreground close river-edge reed cluster at near edge, pale rose sky brightening above',
      'Zhangjiajie sandstone pillar forest aerial drone POV looking DOWN through the pillar tops, vegetation crowning each pillar in emerald clusters, mist filling the valley between pillars in white drift, distant pillar field stretching to flat horizon, golden-hour sidelight raking the tops',
      'Halong Bay limestone karst archipelago drone POV looking down at the jade-green sea, hundreds of limestone island silhouettes dotting the bay in deep tier, mist drift between islands in pearl-grey, foreground close limestone cliff edge at near edge, blazing copper sunset on the water',
      'Yakushima ancient cedar forest interior low-angle hero POV looking up at moss-covered cedar trunks rising cathedral-tall, dappled emerald-gold light shafts through dense canopy, foreground close moss-and-fern cluster wet at near edge, deep humid shadow receding into emerald gloom',
      'Yoshino sakura grove at peak bloom, dense pink-and-pearl cherry-blossom tunnel filling the frame, low-angle hero stance looking up through blossom canopy at pale-pink sky, foreground close fallen petals scattered at near edge on mossy ground, blossom cloud dominating composition',
      'Hokkaido birch grove at winter dawn, slender frosted white birch trunks standing in a wide pale-grey snow plain in cathedral spacing, low-angle hero stance, foreground close snow-and-fallen-leaf detail at near edge, low mist hanging between trunks in cool blue twilight',
      'Arashiyama bamboo forest interior at golden hour, vertical green bamboo stalks reaching cathedral-tall in dense cluster, low-angle hero stance looking up through emerald canopy, dappled gold-and-emerald light shafts piercing through, foreground close bamboo-floor leaf litter at near edge',
      'Jiuzhaigou turquoise lake at autumn, the vivid jade water with crystal-clear shallows reflecting autumn-colored forest above, travertine cascade flowing in foreground between pool tiers, fallen autumn leaves visible underwater, cool morning mist drift in middle distance',
      'Tibetan plateau wide cinematic vista, the high-altitude golden grassland stretching to distant snow peaks under deep cobalt sky, glacial lake mirror reflection in middle distance, foreground close yak-skull-zero rock cairn at near edge, mare-tail cirrus high above',
      'Mongolian Gobi tangerine dune sea at sunset, vast erg stretching to flat horizon with wind-sculpted crests casting deep slip-face shadow in raking sidelight, foreground close iron-orange sand-ripple detail at near edge, blazing horizon-rim and deepening cobalt sky',
      'Mount Bromo Indonesian volcanic basin at dawn, the Tengger caldera with sulfur-plume rising from Bromo cone and neighboring Semeru silhouetted in distance, sea-of-sand ash floor stretching across foreground, mist drift in caldera below, blazing rose horizon',
      'Taroko marble gorge in Taiwan, towering marble canyon walls with patterned blue-and-white striations, deep-emerald river running below in the slot, mid-distance gorge bend curving away into atmospheric haze, foreground close water-polished marble at near edge',
      'Seoraksan granite peaks in Korea at sunrise, jagged granite ridge silhouetted against blazing copper sunrise sky, sea-of-clouds inversion below the ridge, foreground close granite boulder at near edge, autumn-colored forest sloping below the peaks',
      'Wulingyuan sandstone pillar forest at dawn, hundreds of vertical sandstone pillars rising from forest floor in misty drift, vegetation crowning each pillar, low-angle hero stance from valley floor, foreground close fern cluster at near edge, blazing rose dawn sky above',
      'Yangshuo Li River bend wide cinematic vista, karst pillars rising from misty river in deep-tier procession, jade water with cormorant-zero silhouette geometry, fishermen-free morning mist on water, foreground close bamboo cluster at near edge, blazing rose dawn',
      'Hokkaido lavender field at golden hour — wait this is agricultural, replace: Akan caldera mist over volcanic lake at dawn, lake mirror reflecting layered forested hillsides in soft cool color, mist drift between hillsides, foreground close mossy lava-rock at near edge',
      'Gobi flaming cliffs (Bayanzag) at sunset, red-cliff badlands with eroded sandstone formations catching ember-amber sidelight, deep cobalt sky above, foreground close cracked red soil at near edge, distant cliff-line silhouetted in copper, vast flat steppe beyond',
      'Hokkaido boreal forest with morning mist, dense fir-and-birch canopy in cathedral spacing under cool pale sky, mist drift filling lower frame in pearl-grey, foreground close fern-and-moss cluster wet at near edge, dappled cool light filtering through canopy',
      'Mt. Fuji from Chureito viewpoint with mid-distance autumn maples framing the cone, foreground close maple branch in deep red at near edge, the iconic Fuji silhouette in middle distance, pale rose sky brightening behind',
      'Ijen Indonesian volcano sulfur lake at dawn, the turquoise sulfur water reflecting blue-flame eerie light at night-into-dawn transition, foreground close sulfur-crust crater rim at near edge, steam plume rising vertically, deep cobalt overhead sky brightening',
      'Phang Nga Bay karst islands in Thailand drone POV, limestone islands rising from jade water in deep-tier procession, mist drift between islands, foreground close limestone cliff edge at near edge, golden-hour sidelight on water',
      'Hokkaido Lake Mashu blue-hour deep-tier vista, the deep cobalt caldera lake with steep forested hillsides ringing it, mirror-still water reflecting cool dawn sky, foreground close lakeshore boulder cluster at near edge, mist filling mid-distance',
      'Wulingyuan zhangjiajie aerial drone POV looking DOWN at pillar tops emerging from cloud sea at sunrise, vegetation crowning the pillars in emerald islands, mist swallowing the pillar bases, foreground close pillar-top vegetation at near edge, blazing rose sky above',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian subject entries. NO preamble. Each entry 30-55 words on a single line. Format follows the touchpoint pattern: "Toponym + habitat hero + camera-angle/composition + close-foreground + midground hero + distant atmospheric depth + lighting note".`,
  },

  asia_landscape_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's asia-landscape path. Each entry is ONE specific close-edge Asian detail anchoring the lower 15-20% of the frame. Each entry 14-25 words.

✅ ASIA-SPECIFIC CLOSE-EDGE DETAILS:
  • Cherry-blossom branch in soft pink at near edge (Sakura)
  • Fallen sakura petals scattered on mossy ground (Sakura)
  • Maple branch in deep autumn red at near edge (Japan / Korea autumn)
  • Bamboo-floor leaf litter at near edge (Bamboo)
  • Moss-and-fern cluster wet at near edge (Yakushima)
  • Granite-cliff edge with pine roots at near edge (Huangshan)
  • Limestone-cliff edge wet with sea spray at near edge (Halong)
  • River-edge reed cluster at near edge (Guilin / Li River)
  • Frosted snow-and-fallen-leaf detail at near edge (Hokkaido)
  • Tibetan blue-poppy or edelweiss cluster at near edge
  • Mossy lava-rock at near edge (Akan / volcanic)
  • Sulfur-crust crater rim at near edge (Ijen / Bromo)
  • Iron-orange sand-ripple pattern at near edge (Gobi)
  • Travertine pool-edge crystal-clear at near edge (Jiuzhaigou)
  • Water-polished marble at near edge (Taroko)
  • Cracked red soil at near edge (Flaming Cliffs)
  • Cypress / cryptomeria branch in deep emerald at near edge
`,
    touchpoints: [
      'Cherry-blossom branch in soft pink with petals fluttering at near edge in dappled light',
      'Fallen sakura petals scattered on mossy stone ground at near edge in soft pink',
      'Maple branch in deep autumn red and orange at near edge against pale sky',
      'Bamboo-floor leaf litter with single dropped bamboo stalk at near edge',
      'Moss-and-fern cluster wet at near edge with dewy droplets in dappled gold light',
      'Granite-cliff edge with twisted pine roots gripping bare rock at near edge',
      'Limestone-cliff edge wet with sea spray and salt crystal patina at near edge',
      'River-edge reed cluster bent by current at near edge in cool morning mist',
      'Frosted snow-and-fallen-leaf detail at near edge with crystalline frost',
      'Tibetan blue-poppy cluster at near edge in cool alpine grass',
      'Mossy black lava-rock at near edge with delicate fern cluster in crevice',
      'Sulfur-crust crater rim with concentric yellow deposits at near edge',
      'Iron-orange sand-ripple parallel-ridge pattern at near edge in raking light',
      'Travertine pool-edge with crystal-clear shallow water at near edge in jade',
      'Water-polished blue-and-white marble at near edge in flowing pattern',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  asia_landscape_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's asia-landscape path. Each entry is ONE specific Asian lighting register. Each entry 14-22 words.

✅ ASIAN LIGHTING REGISTERS:
  • Sea-of-clouds dawn breaking around Huangshan peaks
  • Sakura sunset blood-red on pink blossom canopy
  • Blue-hour twilight over Halong Bay limestone islands
  • Dappled emerald canopy break in bamboo forest
  • Hokkaido cool blue winter dawn with frosted breath
  • Jiuzhaigou autumn golden-hour rake on jade water
  • Sulfur backlight at Ijen volcano dawn
  • Tibetan high-altitude cobalt midday clarity
  • Mt. Fuji alpenglow rose at first light
  • Gobi sunset banner cumulus copper-amber
  • Yakushima cedar-forest dappled gold-emerald
  • Misty Li River dawn diffuse pearl light
  • Mongolia Milky Way moonless dark steppe night
  • Karst pillar silhouette at blazing sunset
  • Pre-monsoon green-yellow oppressive light
`,
    touchpoints: [
      'Sea-of-clouds dawn breaking around Huangshan peaks in tier-after-tier silhouette',
      'Sakura sunset blood-red rake on pink blossom canopy in horizontal warm sidelight',
      'Blue-hour polar twilight over Halong Bay limestone islands in cool cobalt-mauve',
      'Dappled emerald canopy break in bamboo forest with gold light shafts piercing through',
      'Hokkaido cool blue winter dawn with frost-edged pale sky and low-sun rake',
      'Jiuzhaigou autumn golden-hour rake on jade water with crystal reflections',
      'Sulfur-flame backlight at Ijen volcano crater in eerie blue-and-yellow glow',
      'Tibetan high-altitude cobalt midday clarity with razor-sharp shadows at 4500-metre',
      'Mt. Fuji alpenglow rose-amber on snow-cap at first light',
      'Gobi sunset banner cumulus glowing copper-amber over flat dune horizon',
      'Yakushima cedar-forest dappled gold-and-emerald shaft pooling on mossy ground',
      'Misty Li River dawn diffuse pearl light with karst pillars softly silhouetted',
      'Mongolia moonless dark steppe night with Milky Way arch overhead in deep saturation',
      'Karst pillar silhouette at blazing crimson sunset against cobalt zenith',
      'Pre-monsoon green-yellow oppressive light pressing low over rice-terrace-free valleys',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  asia_landscape_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's asia-landscape path. Each entry is ONE specific Asian atmospheric texture. Each entry 14-22 words.

✅ ASIAN ATMOSPHERIC REGISTERS:
  • Sea-of-clouds inversion at Huangshan
  • Karst mist drift between limestone pillars
  • Bamboo-forest cool emerald shadow air
  • Yakushima humid moss-laden air with mist drift
  • Hokkaido frosted breath-cold winter air
  • Sakura petal-drift fluttering through scene
  • Tibetan thin-cold high-altitude air
  • Volcanic-sulfur plume rising at Bromo / Ijen
  • Gobi dust-haze suspended low over erg
  • Monsoon rain-curtain advancing across karst
  • Travertine mineral-rich water mist at Jiuzhaigou
  • Maple-autumn cool damp air with falling leaves
  • Misty Li River pearl-grey morning fog
  • Halong Bay sea-spray drift between islands
  • Indonesian volcanic ash-haze low across caldera
`,
    touchpoints: [
      'Sea-of-clouds inversion rolling around Huangshan peaks in white drift',
      'Karst mist drift between limestone pillars in cool pearl-grey horizontal bands',
      'Bamboo-forest cool emerald shadow air with dappled gold particles suspended',
      'Yakushima humid moss-laden air with mist drift between cathedral cedar trunks',
      'Hokkaido frosted breath-cold winter air with suspended ice crystals glittering',
      'Sakura petal-drift fluttering through scene in soft pink rain at peak bloom',
      'Tibetan thin-cold high-altitude air with razor-sharp visibility',
      'Volcanic-sulfur plume rising at Bromo crater in tan-yellow column',
      'Gobi dust-haze suspended low over erg in fine warm horizontal bands',
      'Monsoon rain-curtain advancing across karst valley from west',
      'Travertine mineral-rich water mist at Jiuzhaigou cascades in cool drift',
      'Maple-autumn cool damp air with falling leaves drifting through scene',
      'Misty Li River pearl-grey morning fog low over jade water',
      'Halong Bay sea-spray drift between limestone islands in cool pearl mist',
      'Indonesian volcanic ash-haze suspended low across caldera in tan-grey layer',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  asia_landscape_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's asia-landscape path. Each entry is ONE specific Asian sky cover. Each entry 14-22 words.

✅ ASIAN SKY REGISTERS:
  • Sea-of-clouds horizon at Huangshan / Korea
  • Sakura-pink pastel sky at peak bloom
  • Hokkaido cool grey winter overcast
  • Jiuzhaigou autumn cobalt with high cirrus
  • Mongolian Gobi sunset banner cumulus
  • Tibetan plateau deep cobalt high-altitude
  • Pre-monsoon yellow-green oppressive sky
  • Sakura sunset gradient cobalt-to-rose
  • Halong Bay blue-hour gradient cool
  • Volcanic-ash-tinted sky with copper undertone
  • Star-crowded moonless Mongolian night sky
  • Lenticular cloud over Mt. Fuji peak
  • Layered stratocumulus over karst
  • Mist-inversion sea below ridge
  • Misty rose dawn over Li River
`,
    touchpoints: [
      'Sea-of-clouds horizon at Huangshan with peaks emerging like islands from white sea',
      'Sakura-pink pastel sky at peak bloom over Yoshino grove in soft pearl-pink',
      'Hokkaido cool grey winter overcast pressing low over snow plain',
      'Jiuzhaigou autumn cobalt sky with high cirrus over jade lake',
      'Mongolian Gobi sunset banner cumulus glowing copper-amber over erg horizon',
      'Tibetan plateau deep cobalt high-altitude sky with razor-sharp definition',
      'Pre-monsoon yellow-green oppressive sky pressing low over karst valley',
      'Sakura sunset gradient cobalt-to-rose-pink over blossom canopy',
      'Halong Bay blue-hour gradient cool cobalt-to-amber low over jade water',
      'Volcanic-ash-tinted sky with copper-yellow undertone after recent Bromo eruption',
      'Star-crowded moonless Mongolian night sky with Milky Way arch overhead',
      'Lenticular cloud cap with softly feathered edges draped over Mt. Fuji peak',
      'Layered stratocumulus broken by cobalt patches over karst pillars',
      'Mist-inversion sea below Huangshan ridge with clear cobalt above',
      'Misty rose dawn over Li River with pillars softly silhouetted against pale gold',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian sky entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  asia_landscape_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's asia-landscape path. Each entry is ONE tiny postage-stamp-scale element in the deep distance, OR a no-wildlife scale-prover (single distant geometry). Each entry 14-22 words.

✅ ASIAN SCALE-PROVER REGISTERS:
  • Lone Japanese macaque on distant ridge (Honshu / Hokkaido)
  • Red-crowned crane pair on Hokkaido marsh
  • Tibetan blue-sheep on rocky distant slope
  • Yak silhouette on distant Tibetan plateau
  • Takin on distant Bhutanese ridge
  • Hokkaido fox shape barely readable on snow
  • Lone Demoiselle crane gliding over Gobi
  • Distant single petrel over Halong Bay
  • Single cedar emergent crown at distance
  • Single granite spire at deep distance
  • Tiny pagoda-free temple-roof-zero geometry
  • Glacial-melt-stream thread silver-thin at far distance
  • Tiny karst pillar at far distance
  • Lone cypress silhouette at distant ridge
  • Far-shore black-pebble line at water's edge
`,
    touchpoints: [
      'Lone Japanese snow monkey silhouette on distant Hokkaido ridge ant-small',
      'Red-crowned crane pair pencil-tall on distant Kushiro marsh in deep distance',
      'Tibetan blue-sheep silhouette on distant rocky plateau slope barely readable',
      'Yak silhouette ant-small on Tibetan plateau in deep distance',
      'Takin barely readable on distant Bhutanese ridge in deep distance',
      'Hokkaido red fox shape ant-small crossing snow plain in deep distance',
      'Lone Demoiselle crane gliding over Gobi steppe at deep distance',
      'Single petrel silhouette over Halong Bay in deep distance',
      'Single cedar emergent crown silhouetted at distant ridge in deep haze',
      'Single granite spire silhouette at deep distance in cool atmospheric blue',
      'Glacial-melt-stream silver-thin thread at the far valley floor',
      'Tiny karst pillar silhouette at deep distance in jade mist',
      'Lone cypress silhouette at distant Yakushima ridge in cool blue haze',
      'Far-shore black-pebble line marking water edge at deep distance',
      'Lone takin silhouette on Bhutanese ridge as pencil-tall dark shape',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian scale-prover entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  asia_landscape_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's asia-landscape path. Each entry is ONE specific real-Earth Asian phenomenon. Each entry 14-22 words.

✅ ASIAN PHENOMENA:
  • Sea-of-clouds inversion at Huangshan dawn
  • Sakura petal storm at Hirosaki peak bloom
  • Monsoon lightning over Halong karst
  • Sulfur-flame eruption fountain at Ijen at night
  • Bromo crater plume backlit at sunset
  • Snow squall over Hokkaido birch grove
  • Mist-inversion at Yakushima cedar forest
  • Jiuzhaigou autumn-color peak with travertine
  • Tibetan glacial calving on Karakoram
  • Gobi sandstorm advancing across erg
  • Hokkaido drift ice on Sea of Okhotsk
  • Karst rainbow piercing limestone-pillar mist
  • Mt. Fuji alpenglow on snow cap
  • Mongolia Milky Way over star-crowded dark steppe
  • Mongolia geliuda dust-devil over Gobi
`,
    touchpoints: [
      'Sea-of-clouds inversion breaking around Huangshan peaks at sunrise with peaks emerging as islands',
      'Sakura petal storm at Hirosaki peak bloom in pink-and-pearl drifting cloud',
      'Monsoon lightning forking over Halong karst in dramatic blue-white flash',
      'Sulfur-flame eruption at Ijen volcano blue-fire glowing in night crater',
      'Bromo crater plume backlit copper-amber at sunset rising vertically',
      'Snow squall sweeping over Hokkaido birch grove in diagonal white streaks',
      'Mist-inversion sea breaking around Yakushima cedar trunks at dawn',
      'Jiuzhaigou autumn-color peak with travertine cascade flowing through emerald-red pools',
      'Tibetan glacial calving event mid-fall with seracs cascading into lake',
      'Gobi sandstorm advancing across erg in horizontal sand streamers',
      'Hokkaido drift ice forming on Sea of Okhotsk in pale jagged sheets',
      'Karst rainbow piercing limestone-pillar mist at golden hour',
      'Mt. Fuji alpenglow rose-amber on snow-cap at first light',
      'Mongolia Milky Way arch over star-crowded dark steppe',
      'Mongolia dust-devil rising vertically over Gobi in spiraling brown plume',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Asian phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  // ═══════════════════════════════════════════════════════════
  // AUSTRALIAN-OUTBACK path (2026-06-01 activation).
  // Habitat-hero recipe applied from african v2 / asia. Universal guards:
  //   • NO photographer names (Peter Lik / Ken Duncan / Matthew Saville)
  //   • NO negation language in pools
  //   • Subject entries LEAD with Australian toponym in first 5-8 words
  //   • NO aboriginal rock art / petroglyphs / cave paintings (cultural —
  //     respect)
  //   • Distinct from desert-southwest (American SW) — Australian outback
  //     has its OWN iconic geology (Uluru / Bungle Bungle / Pinnacles /
  //     Karijini / Devils Marbles / Wilpena Pound)
  //   • NO American SW vegetation (saguaro / Joshua tree / juniper /
  //     sage) — Australia has eucalyptus / ghost gum / spinifex / banksia
  // ═══════════════════════════════════════════════════════════

  australian_outback_subject: {
    format: 'simple',
    theme: `PURE AUSTRALIAN OUTBACK RAW HABITAT SCENES for EarthBot's australian-outback path. THE LAND IS THE HERO. Each entry is ONE iconic Australian HABITAT composition where the place itself dominates the frame. Wildlife if present is matchstick-tiny incidental scale-prover. Each entry 30-55 words.

🎯 THE HABITAT IS THE HERO:
  • The HABITAT fills 50-65% of the frame
  • CAMERA-ANGLE VARIETY mandatory: low-angle hero / DRONE POV aerial / canopy POV / waterline reflection / silhouette / wide cinematic vista
  • Wildlife if present is matchstick-tiny in deep distance

⚠️ MANDATORY — every entry must LEAD with an Australian toponym in the first 5-8 words.

🇦🇺 ICONIC AUSTRALIAN OUTBACK HABITAT COMPOSITIONS (mix across 25 entries):
  A. **ULURU MONOLITH** — the iconic sandstone monolith silhouetted at sunset against burning sky / OR at dawn alpenglow / OR Milky Way night above / OR from a distance across spinifex plain
  B. **KATA TJUTA DOMES** — Olgas group of red-sandstone domes rising from spinifex plain at sunset, deep cobalt sky above
  C. **BUNGLE BUNGLE BEEHIVE** — Purnululu striped orange-and-grey sandstone beehive domes, drone POV aerial OR low-angle hero looking up at striped dome face
  D. **PINNACLES DESERT** — Nambung limestone spires emerging from yellow sand at sunset, the otherworldly spire forest
  E. **KARIJINI GORGE** — deep red-iron-banded gorge walls with emerald waterhole at base, light shafts from above
  F. **LAKE EYRE SALT FLAT** — Kati Thanda vast pink-and-white salt expanse stretching to flat horizon
  G. **WILPENA POUND** — Flinders Ranges natural amphitheater drone POV looking down at the bowl
  H. **DEVILS MARBLES** — Karlu Karlu massive granite boulders perched precariously in cluster
  I. **MACDONNELL RANGES** — Glen Helen gorge / Ormiston Pound with eucalyptus-lined waterhole
  J. **DAINTREE RAINFOREST** — emerald canopy from above / forest interior with mossy ancient trees + giant strangler figs
  K. **TWELVE APOSTLES** — Great Ocean Road limestone sea stacks at sunset above churning Southern Ocean
  L. **WHITEHAVEN BEACH** — Whitsundays drone POV looking down at pure white silica sand swirls + jade water
  M. **REMARKABLE ROCKS** — Kangaroo Island weathered granite forms at golden hour
  N. **CRADLE COUNTRY TASMANIA** — Tasmanian temperate rainforest with mossy myrtle-beech trees + glacial tarn reflection (NO mountain naming — describe as forested hills + tarn)
  O. **DAINTREE COASTAL** — where rainforest meets reef coast
  P. **GHOST GUM HERO** — solitary brilliantly-white-trunked ghost gum on red-dust plain at sunset

🚫 ABSOLUTE BANS:
  • ZERO photographer names (Peter Lik / Ken Duncan / Matthew Saville)
  • ZERO aboriginal rock art / cave paintings / petroglyphs (cultural — respect)
  • ZERO humans, vehicles, buildings, viewing platforms, boardwalks, signage
  • ZERO American Southwest analogues — NO Monument Valley / Sedona / Antelope Canyon / Bryce / saguaro / Joshua tree / juniper / sage. Australia has its OWN icons (Uluru / Bungle Bungle / Karijini) and its OWN vegetation (eucalyptus / ghost gum / spinifex / banksia)
  • ZERO sci-fi / fantasy / portal
  • ZERO negation phrases
  • ZERO wildlife-as-hero

✅ EVERY ENTRY MUST INCLUDE:
  • Australian toponym in first 5-8 words
  • Specific HABITAT hero
  • Specific CAMERA ANGLE
  • Multi-tier depth language
  • Australia-coded materials (deep rust-red iron-oxide / round-weathered sandstone / striped beehive sandstone / limestone spires / red-river-gum / ghost gum / spinifex grass / pink salt / silica sand / mossy myrtle-beech)
  • A specific DRAMATIC lighting moment (molten-red Uluru sunset / blood-red dusk on Bungle / Milky Way over outback / cobalt midday on salt / blue-hour Twelve Apostles / mist-shrouded Daintree dawn)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Uluru monolith silhouetted hero-scale against a molten blood-red sunset sky, the round-weathered sandstone glowing crimson, low-angle stance from red-dust plain looking up at the massive form, foreground close spinifex grass tussock at near edge, blazing horizon-rim and deepening cobalt zenith',
      'Uluru at dawn alpenglow rose-amber on the eastern face with red-dust plain stretching in foreground, lone solitary ghost gum tree silhouetted at mid-distance, pale rose sky brightening above, deep cobalt zenith',
      'Kata Tjuta Olgas group of red-sandstone domes rising from spinifex plain at sunset, multiple round-weathered formations clustered in deep tier, deep cobalt sky above, foreground close spinifex grass cluster at near edge, blazing horizon',
      'Bungle Bungle Purnululu beehive domes drone POV aerial looking down at the striped orange-and-grey sandstone domes in dense cluster, deep gorges carving between them, foreground close dome-top vegetation at near edge, golden-hour sidelight raking the stripes',
      'Bungle Bungle Purnululu beehive dome low-angle hero stance looking up at one massive striped formation, alternating orange and grey sandstone bands, foreground close cracked red soil at near edge, deep cobalt sky above the dome rim',
      'Pinnacles desert Nambung limestone spires at sunset, the otherworldly forest of pale-tan spires emerging from yellow sand stretching to flat horizon, foreground close sand-and-spire-base detail at near edge, blazing copper sky above',
      'Karijini iron gorge interior, deep red-iron-banded vertical walls plunging to emerald jade-green waterhole at base, light shafts piercing from narrow slot above, foreground close water-edge cobbles wet at near edge, cool atmospheric shadow in gorge depth',
      'Lake Eyre Kati Thanda salt flat aerial drone POV, vast pink-and-white salt expanse with mineral-rich red water veining patterns across flat horizon, foreground close salt-polygon crust at near edge, deep cobalt sky overhead',
      'Wilpena Pound Flinders Ranges natural amphitheater drone POV looking down at the bowl, sunset rake-light on rim ridges, foreground close ridge edge with eucalyptus at near edge, distant pound floor stretching to far side',
      'Devils Marbles Karlu Karlu massive round granite boulders perched precariously in cluster on red-spinifex plain, low-angle hero stance, foreground close granite boulder face at near edge, blazing copper sunset against deep cobalt sky',
      'Glen Helen gorge MacDonnell ranges, deep red sandstone canyon walls plunging to emerald eucalyptus-lined waterhole at base, foreground close water-edge red-river-gum root at near edge, light shafts piercing from above',
      'Daintree rainforest canopy aerial drone POV looking DOWN at the emerald canopy of one of the oldest forests on Earth, layered ancient tree crowns stretching to flat horizon, mist drift in mid-canopy, distant blackwater creek visible',
      'Daintree rainforest interior ground-level POV with dappled emerald-gold shafts piercing layered canopy, massive ancient strangler fig trunks rising cathedral-tall, foreground close ferns and mossy buttress root at near edge, deep humid shadow',
      'Twelve Apostles Great Ocean Road sea stacks at sunset, the limestone pillars rising from churning Southern Ocean against blazing copper sky, foreground close grass-clifftop edge at near edge, breaking waves below, deep cobalt sky above stacks',
      'Twelve Apostles blue-hour twilight, the limestone sea stacks silhouetted against cobalt-and-amber gradient sky, mirror-still inshore pool reflecting silhouettes, foreground close grass-clifftop with coastal flowers at near edge',
      'Whitehaven Beach Whitsundays drone POV looking down at pure white silica sand swirls in elaborate fractal patterns with jade tidal water flowing through, foreground close silica sand at near edge, blazing midday cobalt sky',
      'Remarkable Rocks Kangaroo Island at golden hour, weathered orange-stained granite forms perched at cliff edge above Southern Ocean, low-angle hero stance, foreground close granite surface texture at near edge, blazing horizon over ocean',
      'Cradle Country Tasmania temperate rainforest with mossy myrtle-beech trees and glacial tarn reflection at dawn, the tarn mirror-still reflecting forested rolling hills above, foreground close mossy boulder at near edge, cool blue-grey morning mist drift',
      'Cradle Country glacial tarn aerial drone POV, the still water reflecting layered cool forested hills in perfect mirror, dawn mist drift between hillsides, foreground close lakeshore boulder at near edge, pale rose sky brightening above',
      'Solitary ghost gum on red-dust plain at sunset, the brilliantly white-trunked tree silhouetted hero-scale against blazing copper sky, low-angle stance from ground level, foreground close red-spinifex tuft at near edge, deep cobalt zenith above',
      'Cape Range Karijini gorge at midday, deep red-iron vertical walls plunging to swimming-pool jade water with shaft of sunlight piercing into the slot, foreground close water-edge banded rock at near edge, deep blue zenith above',
      'Uluru night sky Milky Way arch over the monolith silhouette, star-crowded indigo above the iconic red-sandstone form, foreground close red-dust ground with spinifex at near edge, deep cool atmospheric blue around the monolith',
      'Bungle Bungle striped sandstone gorge interior low-angle POV looking up at converging walls, alternating orange and grey horizontal bands receding overhead, foreground close cracked red soil at near edge, narrow strip of cobalt sky visible at top',
      'Coober Pedy moon-plain badlands wide cinematic vista, eroded red-cream ridges stretching to flat horizon under deep cobalt sky, foreground close cracked red soil at near edge, distant ridges in cool atmospheric haze',
      'Karijini Joffre Falls deep red-iron gorge with circular emerald waterhole at base, narrow waterfall plunging from above, low-angle hero stance from waterhole edge looking up the gorge walls',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian subject entries. NO preamble. Each entry 30-55 words on a single line. Format follows touchpoint pattern: "Toponym + habitat hero + camera angle + close-foreground + depth + lighting".`,
  },

  australian_outback_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's australian-outback path. Each entry is ONE specific close-edge Australian detail anchoring the lower 15-20% of the frame. Each entry 14-25 words.

✅ AUSTRALIA-SPECIFIC CLOSE-EDGE DETAILS:
  • Spinifex grass tussock at near edge (Red Centre)
  • Red-dust soil with iron-oxide patina at near edge
  • Eucalyptus/ghost-gum bark-strip at near edge
  • Banksia or grevillea bloom cluster at near edge
  • Red-river-gum root emerging from dry creek-bed at near edge
  • Cracked red soil polygon pattern at near edge
  • Sandstone-and-iron-ore surface texture at near edge (Karijini)
  • Salt-polygon hexagonal crust at near edge (Lake Eyre)
  • White silica sand swirl pattern at near edge (Whitehaven)
  • Mossy myrtle-beech root at near edge (Cradle Country / Daintree)
  • Coastal limestone-edge with sea spray at near edge (Twelve Apostles)
  • Tropical fern + strangler-fig root at near edge (Daintree)
  • Striped sandstone wall close detail at near edge (Bungle Bungle)
  • Granite-surface texture with weathered patina at near edge (Devils Marbles)
  • Coastal grass tussock at near edge (Kangaroo Island)
`,
    touchpoints: [
      'Spinifex grass tussock at near edge in pale gold catching warm sidelight',
      'Red-dust soil with iron-oxide patina at near edge in deep rust-orange',
      'Eucalyptus ghost-gum bark-strip at near edge with peeling white-and-grey texture',
      'Banksia cone cluster at near edge with seed-pods open in textured pattern',
      'Red-river-gum root emerging from dry creek-bed sand at near edge',
      'Cracked red soil polygon pattern at near edge in concentric desiccation cracks',
      'Sandstone-and-iron-ore surface texture at near edge in deep banded color',
      'Salt-polygon hexagonal crust at near edge stretching to white pan',
      'White silica sand swirl pattern at near edge in pristine pearl-white',
      'Mossy myrtle-beech root at near edge wet with rainforest dew',
      'Coastal limestone edge with sea spray and salt crystals at near edge',
      'Tropical fern with strangler-fig root at near edge in deep emerald shadow',
      'Striped sandstone wall close detail at near edge in alternating orange-and-grey bands',
      'Granite-surface texture with weathered patina at near edge in soft grey-and-orange',
      'Coastal grass tussock at near edge bent by southern ocean wind',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  australian_outback_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's australian-outback path. Each entry is ONE specific Australian lighting register. Each entry 14-22 words.

✅ AUSTRALIAN LIGHTING REGISTERS:
  • Molten blood-red Uluru sunset
  • Alpenglow rose-amber on Uluru eastern face at dawn
  • Cobalt midday with razor shadows on Red Centre
  • Milky Way night over outback dark-sky
  • Karijini gorge light shaft piercing from above
  • Lake Eyre cobalt midday clarity on pink salt
  • Daintree dappled emerald canopy gold shaft
  • Bungle Bungle golden-hour rake across striped stone
  • Twelve Apostles blue-hour cobalt twilight
  • Whitehaven blazing midday cobalt over jade water
  • Pre-monsoon green-yellow oppressive Top End light
  • Cradle Country pre-dawn cool blue mist light
  • Pinnacles golden-hour copper rake across spires
  • Devils Marbles golden-hour warm rim-light on boulders
  • Outback dust-haze sunset turning red-dust crimson
`,
    touchpoints: [
      'Molten blood-red sunset rake on Uluru eastern face glowing crimson against deep cobalt zenith',
      'Alpenglow rose-amber on Uluru eastern face at first light at horizontal angle',
      'Cobalt midday with razor-sharp shadows on Red Centre at thin-atmosphere clarity',
      'Star-crowded Milky Way night over outback dark-sky with arch overhead',
      'Karijini gorge narrow light shaft piercing from above into deep red-iron walls',
      'Lake Eyre cobalt midday clarity on pink-and-white salt at razor-sharp horizon',
      'Daintree dappled emerald-gold canopy shaft piercing through three layers',
      'Bungle Bungle golden-hour rake horizontal across striped orange-and-grey bands',
      'Twelve Apostles blue-hour cobalt twilight over Southern Ocean stacks',
      'Whitehaven blazing midday cobalt sky over jade tidal water with sand swirls',
      'Pre-monsoon green-yellow oppressive Top End light pressing low over canopy',
      'Cradle Country pre-dawn cool blue mist light over rainforest tarn',
      'Pinnacles golden-hour copper rake across limestone spires casting long shadows',
      'Devils Marbles golden-hour warm rim-light on round granite boulders',
      'Outback dust-haze sunset turning red-dust plain crimson under copper sky',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  australian_outback_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's australian-outback path. Each entry is ONE specific Australian atmospheric texture. Each entry 14-22 words.

✅ AUSTRALIAN ATMOSPHERIC REGISTERS:
  • Red-dust haze suspended low over plain at sunset
  • Heat-shimmer mirage at midday horizon (Red Centre)
  • Daintree humid mist drift in canopy
  • Outback heat-of-day cobalt clarity
  • Salt-flat dust drift in horizontal warm bands
  • Twelve Apostles sea-spray drift from Southern Ocean
  • Karijini cool deep-shadow gorge air
  • Cradle Country cool morning mist between rainforest hills
  • Pinnacles dawn cool sand-haze
  • Pre-storm yellow-green oppressive Top End air
  • Sulfur-tinted volcanic haze (rare)
  • Outback storm cell rain curtain advancing
  • Cool dawn haze over Whitehaven jade tide
  • Bungle Bungle gorge cool deep-shadow air
  • Dust storm wall advancing across outback
`,
    touchpoints: [
      'Red-dust haze suspended low over Red Centre plain in fine warm bands at sunset',
      'Heat-shimmer mirage dissolving far horizon at midday in liquid distortion',
      'Daintree humid mist drift in mid-canopy filtering through three layers',
      'Outback heat-of-day cobalt clarity with razor-sharp shadow definition',
      'Salt-flat dust drift in horizontal warm bands at low altitude over Lake Eyre',
      'Twelve Apostles sea-spray drift inland from Southern Ocean breakers',
      'Karijini cool deep-shadow gorge air with damp cool feel from waterhole below',
      'Cradle Country cool morning mist drift between forested rolling hills',
      'Pinnacles dawn cool sand-haze drifting low across the limestone spire field',
      'Pre-storm yellow-green oppressive Top End air with falling barometric pressure',
      'Outback dust storm wall advancing across plain with sharp vertical front',
      'Cool dawn haze low over Whitehaven jade tidal flat in pearl-grey',
      'Bungle Bungle gorge cool deep-shadow air with sulfur-tinted glow',
      'Cool wind-blown spinifex-seed drift across red-dust plain',
      'Coastal sea-fog rolling onto Twelve Apostles cliff line in dense veil',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  australian_outback_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's australian-outback path. Each entry is ONE specific Australian sky cover. Each entry 14-22 words.

✅ AUSTRALIAN SKY REGISTERS:
  • Cobalt midday outback sky with high cirrus
  • Blazing copper sunset banner cumulus over Red Centre
  • Star-crowded moonless Milky Way over Uluru
  • Pre-storm yellow-green oppressive sky
  • Daintree monsoon nimbostratus deck low overhead
  • Twelve Apostles blue-hour cobalt-to-amber gradient
  • Whitehaven cobalt clear midday
  • Lake Eyre razor-sharp cobalt horizon
  • Outback dust-tinted copper-yellow sky
  • Sunset banner cumulus over Bungle Bungle
  • Cool grey overcast Cradle Country
  • Pre-dawn cool blue-pink Tasmania
  • Layered stratocumulus broken by cobalt patches
  • Cradle Country mist-inversion under clear sky
  • Sunset gradient cobalt-to-rose over Pinnacles
`,
    touchpoints: [
      'Cobalt midday outback sky with high cirrus contrails',
      'Blazing copper sunset banner cumulus over Red Centre flat horizon',
      'Star-crowded moonless Milky Way arch over Uluru with deep saturation',
      'Pre-storm yellow-green oppressive sky pressing low over plain',
      'Daintree monsoon nimbostratus deck low overhead in dark grey',
      'Twelve Apostles blue-hour cobalt-to-amber gradient over Southern Ocean',
      'Whitehaven cobalt clear midday sky over jade tidal water',
      'Lake Eyre razor-sharp cobalt horizon with thin atmospheric perspective',
      'Outback dust-tinted copper-yellow sky after recent dust storm',
      'Sunset banner cumulus glowing copper-amber over Bungle Bungle striped domes',
      'Cool grey overcast Cradle Country pressing low over forested hills',
      'Pre-dawn cool blue-pink Tasmania sky over glacial tarn',
      'Layered stratocumulus broken by cobalt patches over outback',
      'Cradle Country mist-inversion sea below clear cobalt sky above',
      'Sunset gradient cobalt-to-rose over Pinnacles limestone spire field',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian sky entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  australian_outback_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's australian-outback path. Each entry is ONE tiny postage-stamp-scale element in the deep distance — Australian-native wildlife or geometry, never hero-scale. Each entry 14-22 words.

✅ AUSTRALIAN SCALE-PROVER REGISTERS:
  • Lone red-roo silhouette on Red Centre plain
  • Emu pair pencil-tall on outback
  • Dingo silhouette on red-dust plain
  • Wedge-tailed eagle gliding over outback
  • Solitary ghost gum silhouette at distance
  • Tiny mob of kangaroos pencil-tall on plain
  • Distant single banksia tree silhouette
  • Black swan pair on distant Cradle Country tarn
  • Tasmanian devil silhouette barely readable
  • Tiny saltwater croc shape on Top End creek bank
  • Far-shore black-pebble line at edge
  • Single coastal-cliff sea-bird silhouette
  • Solitary spinifex pigeon on red plain
  • Distant single white-trunked ghost gum at horizon
  • Tiny river-gum silhouette on dry creek-bed
`,
    touchpoints: [
      'Lone red kangaroo silhouette ant-small on Red Centre plain in deep distance',
      'Emu pair pencil-tall on outback spinifex plain in deep distance',
      'Dingo silhouette ant-small on red-dust plain in deep distance',
      'Wedge-tailed eagle gliding silhouette over outback in deep sky',
      'Solitary ghost gum silhouette pencil-tall at distance on red-dust plain',
      'Tiny mob of kangaroos pencil-tall on spinifex plain in deep distance',
      'Distant single banksia tree silhouette at deep distance against pale sky',
      'Black swan pair on distant Cradle Country tarn in deep distance',
      'Tasmanian devil silhouette barely readable at deep distance in rainforest',
      'Tiny saltwater crocodile shape on Top End creek bank in deep distance',
      'Far-shore black-pebble line marking water edge at deep distance',
      'Single coastal sea-bird silhouette over Twelve Apostles in deep sky',
      'Solitary spinifex pigeon on red plain at deep distance ant-small',
      'Distant single white-trunked ghost gum at horizon as pencil-tall silhouette',
      'Tiny river-gum silhouette on dry creek-bed in deep distance',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian scale-prover entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  australian_outback_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's australian-outback path. Each entry is ONE specific real-Earth Australian phenomenon. Each entry 14-22 words.

✅ AUSTRALIAN PHENOMENA:
  • Dust storm wall over Lake Eyre
  • Monsoon lightning over Daintree at night
  • Twelve Apostles sea-stack collapse moment
  • Lake Eyre flood event filling salt with water
  • Milky Way over Uluru moonless dark sky
  • Outback fog inversion at Wilpena Pound
  • Karijini gorge waterfall after monsoon rain
  • Daintree mist-inversion at dawn
  • Top End monsoon thunderhead anvil over Kakadu
  • Sun-pillar vertical light column at outback horizon
  • Crepuscular ray ladder over outback plain
  • Whitehaven swirl-pattern reveal at low tide
  • Pre-eruption volcanic glow (rare — only at Heard Island)
  • Distant lightning forking over Top End
  • Rare Aurora Australis ribbon over Tasmania (very rare)
`,
    touchpoints: [
      'Dust storm wall advancing across Lake Eyre salt flat with sharp vertical front',
      'Monsoon lightning forking over Daintree rainforest at night in dramatic flash',
      'Twelve Apostles sea-stack collapse moment with debris cascading into Southern Ocean',
      'Lake Eyre flood event filling salt expanse with rare water and reflection',
      'Milky Way arch over Uluru moonless dark sky in deep saturation',
      'Outback fog inversion at Wilpena Pound with rim ridges emerging from cloud sea',
      'Karijini gorge waterfall full-flow after monsoon rain plunging into emerald pool',
      'Daintree mist-inversion at dawn with canopy emerging from cloud sea',
      'Top End monsoon thunderhead anvil rising over Kakadu in afternoon convection',
      'Sun-pillar vertical light column at outback horizon at sunset',
      'Crepuscular ray ladder breaking through cloud over outback plain in three beams',
      'Whitehaven swirl-pattern reveal at low tide with intricate sand patterns visible',
      'Distant lightning forking over Top End from a mature thunderstorm',
      'Subtle Aurora Australis green ribbon over Tasmania southern sky at moderate intensity',
      'Outback dust-devil rising vertically over red plain in spiraling brown plume',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} Australian phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  // ═══════════════════════════════════════════════════════════
  // EUROPEAN-WILDERNESS path (2026-06-01 activation).
  // Habitat-hero recipe. Universal guards:
  //   • NO photographer names (Max Rive / Marc Adamus / Daniel Kordan /
  //     Albert Dros — these leak verbatim)
  //   • NO negation language in pools
  //   • Subject entries LEAD with European toponym in first 5-8 words
  //   • NO castles / ruins / villages / standing stones (cultural heritage —
  //     respect). NO sheep with fence / drystone wall (agricultural-cultural)
  //   • NO Iceland content (that's iceland-raw path's domain)
  //   • Europe HAS mountains — they're the GOAL — but render as EUROPEAN
  //     specific (Dolomites limestone-pink alpenglow, Matterhorn pyramidal,
  //     Lofoten arctic fjord), NEVER American Rockies / Patagonian drift
  // ═══════════════════════════════════════════════════════════

  european_wilderness_subject: {
    format: 'simple',
    theme: `PURE EUROPEAN WILDERNESS RAW HABITAT SCENES for EarthBot's european-wilderness path. THE LAND IS THE HERO. Each entry is ONE iconic European HABITAT composition. Wildlife if present is matchstick-tiny incidental scale-prover. Each entry 30-55 words.

🎯 THE HABITAT IS THE HERO:
  • The HABITAT fills 50-65% of the frame
  • CAMERA-ANGLE VARIETY mandatory: low-angle hero / DRONE POV aerial / mirror-reflection / silhouette / wide cinematic vista
  • Wildlife if present is matchstick-tiny in deep distance

⚠️ MANDATORY — every entry must LEAD with a European toponym in the first 5-8 words.

🇪🇺 ICONIC EUROPEAN INLAND-WILDERNESS COMPOSITIONS (mix across 25 entries) — ALL INLAND: alpine peaks, cirque tarns, inland freshwater lakes, river-gorges, terraced waterfalls, conifer/beech forest, sandstone towers, highland moor. NO coast, NO fjord, NO sea:
  A. **DOLOMITES TRE CIME** — the three iconic limestone peaks at alpenglow, low-angle stance from Tre Cime trail at sunset / OR Lago di Braies turquoise lake mirror-reflecting Dolomite peaks / OR Seceda ridge razor edge at sunrise
  B. **MATTERHORN RIFFELSEE** — iconic pyramidal Matterhorn mirror-reflected in Riffelsee / Stellisee at dawn, perfect alpenglow on east face
  C. **SCOTTISH HIGHLANDS GLEN COE** — dramatic glen with heather-covered slopes + Three Sisters peaks, mist drift through valley at dawn
  D. **QUIRAING TROTTERNISH** — Isle of Skye inland landslip of swooping grassy ridges + pinnacle towers, sea-of-clouds inversion in the glen below (frame the LANDFORM, not the sea)
  E. **PLITVICE / KRKA TERRACES** — Croatian terraced travertine waterfall cascades pouring between turquoise forest pools, beech canopy framing, mist
  F. **SNOWDONIA LLYN IDWAL** — cirque tarn reflecting slate-grey peaks above, mossy emerald rocks
  G. **VERDON GORGE** — sheer limestone river-canyon walls plunging to the turquoise Verdon river far below, low-angle from the rim
  H. **BLACK FOREST MUMMELSEE** — misty German conifer forest, dark fir ranks marching up the slope, a still glacial tarn, fog drifting between trunks
  I. **TATRAS MORSKIE OKO** — High Tatras glacial lake cradled by sheer granite peaks, larch + spruce shore, alpenglow
  J. **SAXON / BOHEMIAN SWITZERLAND** — Elbe-sandstone pillar towers (Bastei) rising from a sea-of-fog forest at dawn, mist between the spires
  K. **PLATEAU / JOTUNHEIMEN** — Norwegian INLAND high-mountain plateau, the Besseggen ridge between two alpine lakes (Gjende emerald + Bessvatn blue), tundra foreground (NOT a fjord)
  L. **PICOS DE EUROPA** — Spanish limestone massif, jagged grey peaks above green karst gorges and beech forest, cloud spilling over a col
  M. **LAKE BLED ISLAND** — Slovenian island reflected in turquoise lake, Julian Alps behind
  N. **KÖNIGSSEE / EIBSEE** — Bavarian Alps inland lake, sheer limestone slopes rising from emerald freshwater, larch shore
  O. **HEATHER MOOR SUNSET** — Scottish moor blanket of purple heather catching raking sidelight, rolling to distant inland hills
  P. **JULIAN ALPS / TRIGLAV VALLEY** — Slovenian alpine valley, emerald meadow + spruce forest beneath the Triglav massif, a clear mountain stream threading through

🚫 ABSOLUTE BANS:
  • ZERO COAST/SEA — this is INLAND wilderness. NO ocean, sea, fjord, sea-cliff, sea-arch, sea-stack, beach, Atlantic/coastal horizon, surf, or tidal water. Any water is ALPINE/INLAND freshwater (tarn / glacial lake / river / waterfall), never the sea. (Coast is the coastal-vista path's domain.)
  • ZERO photographer names (Max Rive / Marc Adamus / Daniel Kordan / Albert Dros)
  • ZERO castles, ruins, monasteries, villages, viewing platforms (cultural — respect)
  • ZERO standing stones / Stonehenge / Avebury / megalithic features (cultural)
  • ZERO sheep / cows / agricultural pastures / drystone walls / fences (agricultural)
  • ZERO lighthouses, cabins, huts (including Tre Cime rifugio)
  • ZERO roads / funiculars / cable cars
  • ZERO Iceland content (that's iceland-raw path's domain — no Reynisfjara / Vatnajökull / Jökulsárlón)
  • ZERO American Rockies / Patagonian analogues — describe Europe on its own terms
  • ZERO sci-fi / fantasy / portal
  • ZERO negation phrases
  • ZERO wildlife-as-hero

✅ EVERY ENTRY MUST INCLUDE:
  • European toponym in first 5-8 words
  • Specific HABITAT hero (peak / cliff / cirque tarn / fjord / sea arch / heather moor / limestone pavement)
  • Specific CAMERA ANGLE
  • Multi-tier depth language
  • Europe-coded INLAND materials (limestone / Dolomite-pink stone / heather / Scottish moor / Welsh slate / Elbe sandstone / Tatras granite / travertine + turquoise pools / alpine larch + spruce + beech / Julian-Alps emerald meadow)
  • A specific DRAMATIC lighting moment (Dolomites pink alpenglow / Tatras granite alpenglow / Glen Coe storm-break / Black Forest fog-shaft dawn / Riffelsee mirror dawn / heather moor raking sidelight / Saxon-sandstone sea-of-fog sunrise)

Each entry 30-55 words, comma-separated descriptive phrasing. Output as a NUMBERED list.`,
    touchpoints: [
      'Tre Cime di Lavaredo Dolomites at sunset, the three iconic limestone peaks glowing pink alpenglow against deep cobalt sky, low-angle stance from Tre Cime trail looking up, foreground close alpine wildflower cluster at near edge, breaking cumulus catching warm color',
      'Lago di Braies Dolomites turquoise lake mirror-reflecting the pale-limestone peaks above at dawn, foreground close mossy boulder at lake edge, larch trees framing the shoreline, blue-hour cobalt twilight gradient brightening to pink at horizon',
      'Seceda ridge razor edge at sunrise in the Dolomites, the dramatic limestone ridge sweeping into deep tier of peaks against blazing rose-amber sky, foreground close alpine grass at near edge, low-angle hero stance from below ridge',
      'Matterhorn pyramidal silhouette mirror-reflected in Riffelsee at dawn, perfect alpenglow rose-amber on east face doubled in glassy still water, foreground close lakeshore pebbles at near edge, deep cobalt sky brightening',
      'Stellisee mirror lake reflecting Matterhorn pyramidal silhouette at sunset, foreground close alpine-flower cluster on grass at near edge, deep cobalt zenith and blazing copper horizon over the peak',
      'Glen Coe Scottish Highlands dramatic glen at dawn, the Three Sisters peaks rising from heather-covered slopes with mist drift through valley, foreground close moss-and-heather at near edge, blue-hour cobalt sky brightening, low cloud base catching warm color',
      'Old Man of Storr pinnacles on Trotternish ridge Isle of Skye, the iconic basalt pinnacles silhouetted against blazing copper sunset over Atlantic, low-angle hero stance, foreground close moss-and-heather at near edge, Cuillin range beyond in cool blue haze',
      'Quiraing Trotternish landslip dramatic rock formations at sunrise, swooping ridges and pinnacle towers with mist drift between, foreground close grass-and-rock at near edge, sea-of-clouds inversion in distance below ridge',
      'Quiraing Trotternish inland landslip Isle of Skye, swooping grassy ridges and pinnacle towers with a sea-of-clouds inversion filling the glen below, low-angle hero stance, foreground close moss-and-rock at near edge, blazing copper sunrise, Cuillin range beyond in cool blue haze',
      'Snowdonia Llyn Idwal cirque tarn reflecting slate-grey peaks above at dawn, mossy emerald rocks ring the tarn shoreline, foreground close moss-and-water-edge boulder at near edge, mist drift between peaks, blue-hour cobalt gradient',
      'Plitvice Lakes Croatia terraced travertine waterfalls pouring between turquoise forest pools, beech canopy framing the cascades, drone POV looking down the stepped pools, foreground close mossy travertine lip at near edge, soft mist and dappled forest light',
      'Verdon Gorge France sheer limestone canyon walls plunging to the turquoise Verdon river far below, low-angle stance from the rim, foreground close limestone-and-scrub edge at near edge, golden-hour sidelight raking the canyon wall, deep cobalt sky',
      'Tatras Morskie Oko glacial lake cradled by sheer granite peaks, larch and spruce ringing the emerald shore, foreground close granite-and-moss boulder at near edge, alpenglow on the summits, mist drift across the still water at dawn',
      'Saxon Switzerland Bastei sandstone pillar towers rising from a sea-of-fog beech forest at sunrise, the iconic eroded spires emerging from drifting mist, low-angle hero stance, foreground close sandstone-and-pine edge at near edge, warm rose light on the towers',
      'Jotunheimen Besseggen ridge Norway between two inland alpine lakes, emerald Gjende below one side and deep-blue Bessvatn the other, tundra-and-rock foreground at near edge, low-angle ridge stance, cool arctic-clear light, no sea anywhere',
      'Picos de Europa Spain jagged grey limestone massif above a green karst gorge and beech forest, cloud spilling over a high col, low-angle hero stance from the valley, foreground close limestone-and-fern at near edge, golden-hour sidelight on the peaks',
      'Lake Bled Slovenian island reflected in turquoise inland lake at sunrise, the iconic small island with the Julian Alps rising beyond, foreground close lakeshore boulder at near edge, mist drift on lake surface, pale rose sky brightening',
      'Königssee Bavarian Alps inland lake with sheer limestone slopes rising from emerald freshwater, drone POV down the narrow mountain lake, foreground close lake-edge larch tree at near edge, sea-of-clouds inversion above peaks in distance, blue-hour cobalt twilight',
      'Eibsee Bavarian Alps mirror-still lake reflecting Zugspitze-area peaks at dawn, foreground close pebble shore at near edge, larch trees framing the water, pale rose sky brightening',
      'Scottish moor blanket of purple heather at sunset in raking horizontal sidelight, vast carpet of heather rolling to distant inland hills, foreground close heather flower cluster at near edge, blazing copper sky, low-angle hero stance from moor level',
      'Black Forest Germany misty conifer hillside at dawn, dark fir ranks marching up the slope with fog-shafts threading between trunks, a still glacial tarn (Mummelsee) below, foreground close fern-and-fir-needle at near edge, pearl-grey mist brightening to gold',
      'Cinque Torri Dolomites five-tower limestone formation cluster at sunset, low-angle hero stance from below the towers, foreground close alpine-grass-and-rock at near edge, pink alpenglow on towers, deep cobalt sky',
      'Triglav National Park Slovenia alpine valley, emerald meadow and spruce forest beneath the Triglav massif, a clear mountain stream threading through the foreground, low-angle stance, mist drift in the valley, golden-hour light on the peak',
      'High Tatras Slovakia granite spires above a larch-forest basin at sunrise, the jagged ridge catching first alpenglow, foreground close larch-and-boulder at near edge, sea-of-clouds pooling in the valley below, deep cobalt zenith',
      'Bavarian Alpsee mirror lake reflecting distant inland peaks at dawn, foreground close mossy lakeshore at near edge, pale rose sky brightening, mist drift on water surface in pearl-grey',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European subject entries. NO preamble. Each entry 30-55 words on a single line. Format follows touchpoint pattern: "Toponym + habitat hero + camera angle + close-foreground + depth + lighting".`,
  },

  european_wilderness_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHORS for EarthBot's european-wilderness path. Each entry is ONE specific close-edge European detail. Each entry 14-25 words.

✅ EUROPE-SPECIFIC CLOSE-EDGE DETAILS:
  • Heather flower cluster at near edge (Scotland)
  • Moss-and-heather tussock at near edge
  • Slate-grey rock with lichen at near edge (Wales)
  • Limestone karst slab edge with grass-tuft (Burren / Ireland)
  • Pebble shore with mossy boulder at near edge (Alps lakes)
  • Alpine wildflower (gentian / edelweiss) cluster at near edge
  • Larch tree branch in autumn gold at near edge (Dolomites)
  • Emerald-turf cliff edge (Faroe)
  • Basalt rock with sea spray at near edge (Faroe / Lofoten)
  • Grass-clifftop edge with thrift flowers at near edge (Moher)
  • Boggy peat-edge with cotton-grass at near edge (Connemara)
  • Mossy lake-edge boulder at near edge (Snowdonia / Bled)
  • Granite-and-lichen rock at near edge (Cuillin / Glen Coe)
  • Snow-and-grass tussock at near edge (Lofoten winter)
  • Fjord-shore cobble at near edge (Lofoten / Geiranger)
`,
    touchpoints: [
      'Heather flower cluster at near edge in deep purple bloom catching warm sidelight',
      'Moss-and-heather tussock at near edge wet with morning dew',
      'Slate-grey rock with lichen crust at near edge cool damp from Welsh mist',
      'Limestone karst slab edge with grass-tuft at near edge in soft grey pattern',
      'Pebble shore with mossy boulder at near edge wet from alpine lake water',
      'Alpine gentian cluster at near edge in vivid blue against grey rock',
      'Larch tree branch in autumn gold at near edge against pale Dolomite sky',
      'Emerald-turf cliff edge at near edge with single thrift flower',
      'Basalt rock with sea spray and salt crust at near edge on Faroe shore',
      'Grass-clifftop edge with thrift flowers at near edge on Cliffs of Moher',
      'Boggy peat-edge with cotton-grass at near edge in soft pale fluff',
      'Mossy lake-edge boulder at near edge reflecting alpine peaks above',
      'Granite-and-lichen rock at near edge cool damp from Highland mist',
      'Snow-and-grass tussock at near edge in cool dawn light',
      'Fjord-shore cobble at near edge wet from Norwegian arctic spray',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European foreground anchor entries. NO preamble. Each entry 14-25 words on a single line.`,
  },

  european_wilderness_light_condition: {
    format: 'simple',
    theme: `LIGHT CONDITIONS for EarthBot's european-wilderness path. Each entry is ONE specific European lighting register. Each entry 14-22 words.

✅ EUROPEAN LIGHTING REGISTERS:
  • Dolomites pink alpenglow on limestone at sunrise
  • Matterhorn rose-amber dawn alpenglow east face
  • Glen Coe storm-break shaft through dark cloud
  • Cliffs of Moher Atlantic sunset blazing copper
  • Riffelsee dawn cool blue-hour mirror calm
  • Heather moor raking sidelight golden hour
  • Lofoten arctic-pink twilight cool palette
  • Faroe golden-hour rake on emerald turf
  • Welsh Snowdonia overcast cool soft pearl light
  • Scottish Highlands rim-light sunset
  • Mist-inversion dawn over Dolomites
  • Lake Bled sunrise warm-pink reflection
  • Königssee blue-hour cool cobalt mirror
  • Faroe Múlafossur backlit copper sunset
  • Lofoten Milky-Way dark-sky arctic night
`,
    touchpoints: [
      'Dolomites pink alpenglow on pale limestone peaks at sunrise in warm rose-amber',
      'Matterhorn rose-amber dawn alpenglow on east face at horizontal angle',
      'Glen Coe storm-break shaft tearing through dark cloud illuminating one ridge',
      'Cliffs of Moher Atlantic sunset blazing copper rake on limestone cliff face',
      'Riffelsee dawn cool blue-hour mirror calm reflecting Matterhorn silhouette',
      'Scottish heather moor raking sidelight golden hour bringing out purple bloom',
      'Lofoten arctic-pink twilight cool palette stretching across snow-and-fjord',
      'Faroe golden-hour rake on emerald turf cliff with Atlantic spray suspended',
      'Welsh Snowdonia overcast cool soft pearl light on slate-grey cirque',
      'Scottish Highlands rim-light sunset on Three Sisters peaks Glen Coe',
      'Mist-inversion dawn breaking around Dolomite peaks in white drift',
      'Lake Bled sunrise warm-pink reflection on still turquoise water',
      'Königssee blue-hour cool cobalt mirror surface reflecting Bavarian cliffs',
      'Faroe Múlafossur backlit copper sunset with waterfall mist catching warmth',
      'Lofoten Milky-Way dark-sky arctic night over arctic fjord',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European light-condition entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  european_wilderness_atmosphere: {
    format: 'simple',
    theme: `ATMOSPHERE entries for EarthBot's european-wilderness path. Each entry is ONE specific European atmospheric texture. Each entry 14-22 words.

✅ EUROPEAN ATMOSPHERIC REGISTERS:
  • Sea-of-clouds inversion in Dolomites valley
  • Scottish Highland mist drift through glen
  • Atlantic sea-fog rolling onto Irish cliff
  • Faroe Atlantic spray drift onto emerald turf
  • Bavarian alpine cool mountain mist
  • Lofoten arctic cold-clear air
  • Welsh slate-grey overcast cool damp air
  • Cirque tarn cool morning mist drift (Snowdonia)
  • Lake-mirror still cold air at dawn (Bled / Königssee)
  • Heather moor cool damp morning fog
  • Storm cell rain curtain advancing across glen
  • Snow squall over Cairngorms
  • Dolomites high-altitude clear thin air
  • Mountain-tundra cold-haze pearl-grey
  • Cool dawn haze low over fjord water
`,
    touchpoints: [
      'Sea-of-clouds inversion rolling in Dolomites valley below alpine peaks',
      'Scottish Highland mist drift through glen in cool pearl-grey horizontal bands',
      'Atlantic sea-fog rolling onto Irish cliff face in dense veil',
      'Faroe Atlantic spray drift onto emerald turf in cool pearl mist',
      'Bavarian alpine cool mountain mist hanging between forested slopes',
      'Lofoten arctic cold-clear air with razor-sharp visibility',
      'Welsh slate-grey overcast cool damp air pressing low over Snowdonia',
      'Cirque tarn cool morning mist drift over Snowdonia Llyn Idwal water',
      'Lake-mirror still cold air at dawn over Königssee in glass-perfect stillness',
      'Heather moor cool damp morning fog low over Scottish purple bloom',
      'Storm cell rain curtain advancing across glen from west',
      'Snow squall sweeping over Cairngorms in diagonal white streaks',
      'Dolomites high-altitude clear thin air with razor-sharp shadow definition',
      'Mountain-tundra cold-haze pearl-grey suspended over alpine ridge',
      'Cool dawn haze low over Lofoten fjord water in arctic blue',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European atmosphere entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  european_wilderness_sky_layer: {
    format: 'simple',
    theme: `SKY LAYER entries for EarthBot's european-wilderness path. Each entry is ONE specific European sky cover. Each entry 14-22 words.

✅ EUROPEAN SKY REGISTERS:
  • Lenticular cloud over Matterhorn peak
  • Banner cloud streaming off Dolomite peak
  • Sea-of-clouds inversion below alpine ridge
  • Heavy nimbostratus over Scottish Highlands
  • Pale-rose Dolomite sunrise sky
  • Cool grey Welsh overcast pressing low
  • Cobalt arctic noon sky Lofoten
  • Atlantic sunset gradient over Cliffs of Moher
  • Pre-storm yellow-green oppressive sky
  • Star-crowded Lofoten night Milky-Way arch
  • Pre-dawn cool blue-pink Faroe
  • Layered stratocumulus broken by cobalt
  • Cumulonimbus anvil rising over Dolomite
  • Lake Bled warm-pink sunrise mirror
  • Sunset orange-violet ribbon over fjord
`,
    touchpoints: [
      'Lenticular cloud cap with softly feathered edges draped over Matterhorn peak',
      'Banner cloud streaming horizontally off Dolomite Tre Cime peak',
      'Sea-of-clouds inversion below alpine ridge with peaks emerging into clear sky',
      'Heavy nimbostratus rain-bearing dark grey deck over Scottish Highlands',
      'Pale-rose Dolomite sunrise sky with peaks silhouetted',
      'Cool grey Welsh overcast pressing low over Snowdonia',
      'Cobalt arctic noon sky Lofoten in deep saturation',
      'Atlantic sunset gradient cobalt-to-amber over Cliffs of Moher',
      'Pre-storm yellow-green oppressive sky pressing low over Glen Coe',
      'Star-crowded Lofoten moonless night sky with Milky Way arch overhead',
      'Pre-dawn cool blue-pink Faroe sky over Drangarnir arch',
      'Layered stratocumulus broken by cobalt patches over Lake District',
      'Cumulonimbus anvil rising over Dolomite in afternoon convection',
      'Lake Bled warm-pink sunrise sky reflected in mirror lake',
      'Sunset orange-violet ribbon at horizon over Lofoten fjord',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European sky entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  european_wilderness_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVERS for EarthBot's european-wilderness path. Each entry is ONE tiny postage-stamp-scale element at deep distance — European-native wildlife or geometry. Each entry 14-22 words.

✅ EUROPEAN SCALE-PROVER REGISTERS:
  • Lone red deer stag on Scottish moor (Highlands)
  • Chamois pair on Dolomite ridge
  • Ibex silhouette on Alpine cliff
  • Mountain hare on snow plain
  • Scottish wildcat shape on heather moor
  • Atlantic puffin flock on Faroe cliff
  • Sea eagle gliding over fjord
  • Gannet flock over Cliffs of Moher
  • Distant single larch on alpine slope
  • Solitary cairn-shape on moor
  • Distant single pine on Dolomite
  • Lone reindeer on Lofoten
  • Glacial-melt stream silver thread
  • Tiny single sea-bird over Trolltunga
  • Distant sailboat (no — that's human; skip)
`,
    touchpoints: [
      'Lone red deer stag silhouette on distant Scottish moor in deep distance',
      'Chamois pair pencil-tall on distant Dolomite ridge',
      'Ibex silhouette on distant Alpine cliff in cool atmospheric blue',
      'Mountain hare shape ant-small on snow plain in deep distance',
      'Scottish wildcat silhouette on heather moor barely readable at deep distance',
      'Atlantic puffin flock on distant Faroe cliff ledge as small dark dots',
      'Sea eagle gliding silhouette over Norwegian fjord in deep sky',
      'Gannet flock over Cliffs of Moher in middle distance',
      'Distant single larch silhouette on alpine slope in deep distance',
      'Solitary cairn-shape on distant Scottish moor at deep distance',
      'Distant single pine silhouette on Dolomite ridge in cool atmospheric blue',
      'Lone reindeer pencil-tall on Lofoten tundra in deep distance',
      'Glacial-melt stream silver-thin thread at far valley floor',
      'Tiny single sea-bird gliding over Trolltunga in deep distance',
      'Lone red squirrel shape barely readable in distant European forest edge',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European scale-prover entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  european_wilderness_phenomenon: {
    format: 'simple',
    theme: `RARE PHENOMENA for EarthBot's european-wilderness path. Each entry is ONE specific real-Earth European phenomenon. Each entry 14-22 words.

✅ EUROPEAN PHENOMENA:
  • Dolomite alpenglow pink moment at sunrise
  • Mist-inversion sea around Dolomite peaks
  • Glen Coe rain-curtain storm break
  • Atlantic storm-break over Cliffs of Moher
  • Heather moor blue-hour mist drift
  • Lofoten Northern Lights green ribbon aurora
  • Faroe Atlantic spray geyser at sea arch
  • Snow squall over Cairngorms
  • Lenticular cloud stack over Matterhorn
  • Crepuscular ray ladder through Bavarian Alps
  • Sunset alpenglow on Trolltunga
  • Rainbow arc over Snowdonia after rain
  • Distant lightning forking over Dolomites
  • Sea-fog inversion at Connemara coast
  • Faroe waterfall mist-rainbow at sunset
`,
    touchpoints: [
      'Dolomite alpenglow pink moment at sunrise on limestone peaks in warm rose',
      'Mist-inversion sea breaking around Dolomite peaks with peaks emerging as islands',
      'Glen Coe rain-curtain storm break with sun-shaft illuminating one valley',
      'Atlantic storm-break over Cliffs of Moher with sun-shafts piercing dark cloud',
      'Heather moor blue-hour mist drift low over Scottish purple bloom',
      'Lofoten Northern Lights green aurora ribbon arching across arctic sky',
      'Faroe Atlantic spray geyser blasting up at sea arch with sunset light',
      'Snow squall sweeping over Cairngorms in diagonal white streaks',
      'Lenticular wave-clouds capping Matterhorn peak in soft layered bands',
      'Crepuscular ray ladder breaking through cloud over Bavarian Alps',
      'Sunset alpenglow rose-amber on Trolltunga rock tongue and fjord below',
      'Rainbow arc piercing post-rain mist over Snowdonia at golden hour',
      'Distant lightning forking over Dolomites from a mature thunderstorm',
      'Sea-fog inversion at Connemara coast with hills emerging from cloud',
      'Faroe Múlafossur waterfall mist-rainbow at sunset in full primary band',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} European phenomenon entries. NO preamble. Each entry 14-22 words on a single line.`,
  },

  reef_paradise_sky_drama: {
    format: 'simple',
    theme: `SKY + WEATHER + TIME-OF-DAY entries for EarthBot's reef-paradise path. Each entry is ONE specific tropical sky/weather/light condition for a Pacific-island bay scene. Each entry 14-25 words.

🚨 CRITICAL — WEATHER + TIME-OF-DAY DIVERSITY IS THE WHOLE POINT OF THIS POOL.
This pool was previously locked to 86% high-noon sunny / golden-hour fair-weather cumulus, producing identical "bright tropical postcard" renders every time. The whole reason this pool exists is to ROTATE atmosphere across the full Pacific-tropics range so the path doesn't lock into one mood.

🎯 MANDATORY distribution across {COUNT} entries — every category MUST appear:
  • ~15% high-noon sunny / fair-weather (the "current" mode — keep some, don't ALL be this)
  • ~15% golden-hour / pre-sunset warm amber
  • ~10% dawn / sunrise / first light (cool pink-amber, mist over water)
  • ~10% post-sunset twilight / blue-hour / gloaming (deep teal/violet sky over dark water)
  • ~10% overcast tropical sky / soft diffuse grey / flat moody light
  • ~12% approaching tropical storm / thunderhead / monsoon front / cumulonimbus tower
  • ~10% active tropical rain / squall / heavy downpour / monsoon shower
  • ~5% post-rain crystal-clear afterglow / rainbow / steaming jungle
  • ~5% night / moonlit / starry tropical sky (no city light pollution)
  • ~5% fog / sea-mist / morning marine layer drifting low over the bay
  • ~3% unusual phenomena (mammatus cloud, sun pillar, double rainbow, water-spout in distance, st. elmo's fire on mast, green-flash sunset)

❌ DO NOT write 200 variations of "fair-weather cumulus + sunburst + golden tint + brilliant azure." Every entry should be readable as a DIFFERENT weather mood from the previous one.

❌ FORBIDDEN VOCAB (these collapse pool diversity):
  • "fair-weather cumulus" (too generic — name the specific cloud type or weather)
  • "sunburst" overused (use sparingly, ≤15% of entries)
  • "golden tint" / "warm amber tint" (use only on actual golden-hour entries)
  • "tack-sharp" / "blazing" (lighting-quality tells, not weather descriptions)
  • Repetitive sentence structures — vary syntax across entries

✓ ALLOWED VOCAB:
  • Specific cloud names — cirrus, stratus, cumulonimbus, mammatus, lenticular, fog bank, marine layer
  • Specific weather events — squall, monsoon shower, tropical downpour, sea-mist, fog inversion
  • Specific time-of-day phrasing — predawn, dawn, post-sunrise, late morning, midday, mid-afternoon, late afternoon, sunset, post-sunset, blue-hour, gloaming, nightfall, late night
  • Specific light qualities at each time — pink dawn, copper sunrise, white midday, amber golden-hour, violet twilight, indigo blue-hour, silver moonlight, monsoon-grey, storm-blue
  • Specific sky moods — brooding, ominous, charged, restless, calm, glassy-still, hazy, dramatic, peaceful

✅ DIVERSITY-OF-MOOD examples (one of each):
  • "Approaching monsoon front, towering cumulonimbus stacking over the open Pacific, sky greying from cobalt to brooding slate, breeze freshening the bay"
  • "Predawn cool pink-and-amber wash across the sky, soft marine layer drifting low over the bay surface, distant headland silhouetted in cool indigo"
  • "Active tropical rain shower drumming the bay surface, sky uniform soft grey, mist rising off the water as rain hits warm tropical air"
  • "Post-rain crystal-clear afterglow, towering dissipating cumulonimbus catching late warm light, primary rainbow arcing across the deep teal sky"
  • "Late-night tropical sky with brilliant Milky Way visible above the island, no light pollution, moonless dark sea reflecting starlight"
  • "Sea-mist inversion sitting low over the bay at dawn, island peaks emerging above the cloud sea, soft pink light hitting the cloud tops"
  • "Heavy overcast tropical day, sky uniform stratus grey, water dulled to teal-slate, mood quiet and brooding"
  • "Mid-afternoon scattered cumulus with deep cobalt gaps, sky boring and calm but the water perfect crystal turquoise"
  • "Green-flash sunset moment, sun's upper rim flashing emerald just before disappearing into the open Pacific horizon"
  • "Dramatic mammatus cloud belly hanging low over the bay after a passing storm, ominous and beautifully strange"
`,
    touchpoints: [
      'Approaching monsoon front, towering cumulonimbus stacking over the open Pacific, sky greying from cobalt to brooding slate',
      'Predawn cool pink-and-amber wash across the sky, soft marine layer drifting low over the bay surface',
      'Active tropical rain shower drumming the bay surface, sky uniform soft grey, mist rising off the water',
      'Post-rain crystal-clear afterglow, dissipating cumulonimbus catching warm light, primary rainbow arcing the sky',
      'Late-night tropical sky with brilliant Milky Way visible above the island, no light pollution, moonless dark sea',
      'Sea-mist inversion sitting low over the bay at dawn, island peaks emerging above the cloud sea',
      'Heavy overcast tropical day, sky uniform stratus grey, water dulled to teal-slate, mood quiet and brooding',
      'Green-flash sunset moment, sun upper rim flashing emerald just before disappearing into the open Pacific',
      'Dramatic mammatus cloud belly hanging low over the bay after a passing storm, ominous and strange',
      'Blue-hour gloaming with deep teal-violet sky over dark water, last orange band at the horizon',
      'Fog-bank wall rolling in off the open Pacific, half the bay obscured in soft white veil',
      'Lenticular cloud stack suspended over the central volcanic peak, cool late-afternoon blue sky',
      'Brilliant late-morning sun cutting through scattered cumulus, water glittering with hard sun-sparkle',
      'Pre-storm calm, glassy-still bay surface, sky charged green-grey, breeze dropping to nothing',
      'Squall line passing in the distance with visible rain curtain trailing under dark cloud belly',
      'Soft golden-hour low light raking across volcanic ridges, warm amber air, gentle scattered cumulus',
      'Moonlit tropical night with bright full moon over the bay, silver path on dark water',
      'Dawn fog burning off the bay as first sun reaches the headland tops, soft pink and gold',
      'Mid-morning trade-wind cumulus drifting steadily across deep cobalt sky, normal Pacific weather',
      'Overcast bruised-purple sky just before a storm breaks, charged air, restless water surface',
      'Tropical downpour drumming the bay, sky uniform leaden grey, jungle steaming on the hills',
      'Post-sunset orange-pink band fading to indigo above, deep teal twilight water below',
      'High cirrus ice-crystal sky with halo-ring around the sun, calm tropical afternoon',
      'Sun pillar rising vertically at dawn horizon above the open Pacific, cool pre-sunrise sky',
      'Heavy marine-layer morning, low grey ceiling pressing down on the bay, soft diffuse flat light',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} reef-paradise sky/weather/time entries. NO preamble. Each entry 14-25 words on a single line. CRITICAL: every category from the mandatory distribution above MUST be represented — do not collapse to one mood. Vary syntax + cloud-type + time-of-day + weather + light-quality across every entry.`,
  },

  reef_paradise_bay_setting: {
    format: 'simple',
    theme: `BAY SETTING + WATER STATE entries for EarthBot's reef-paradise path. Each entry is ONE specific tropical bay composition with a specific WATER + WEATHER MOOD. Each entry 25-40 words.

🚨 CRITICAL — this pool previously baked "brilliant turquoise crystal clarity" into every entry, locking the path to "perfect calm sunny day" regardless of what the sky pool said. Diversify by WATER STATE across the {COUNT} entries.

🎯 MANDATORY distribution of WATER STATES:
  • ~25% calm + crystal turquoise + classic sunny clarity (the "current" mode — keep some)
  • ~15% glassy mirror-still at dawn or dusk (different light, calm water)
  • ~15% wind-rippled choppy surface (breeze, scattered light)
  • ~15% pre-storm restless / gunmetal calm (charged but still)
  • ~10% active rain-pocked surface (drumming raindrops, mist rising)
  • ~10% post-storm churning / steel-grey heaving water
  • ~5% bioluminescent night water (faint blue glow from plankton)
  • ~5% fog-veiled obscured bay (soft white veil over teal)

🎯 Bay geometries to rotate across entries (vary the SHAPE of bay/cove + the LAND that frames it):
  • Volcanic caldera bay (basalt walls)
  • Horseshoe cove
  • Wide crescent lagoon
  • Narrow fjord-like inlet between ridges
  • Open island bay between headlands
  • Atoll lagoon
  • Sand-bar enclosed lagoon
  • Mangrove-fringed estuary cove
  • Coral-reef enclosed lagoon
  • Wave-cut coastal terrace bay

`,
    touchpoints: [
      'Volcanic caldera bay under pre-storm sky, water restless and gunmetal-grey, basalt walls dark and brooding under heavy cloud cover above',
      'Horseshoe cove at dawn, mirror-still glassy water reflecting pink sky, soft mist hovering just above the surface, headlands soft silhouettes',
      'Wide crescent lagoon under active rain shower, surface pocked with drumming raindrops, sky uniform soft grey, mist rising off warm water',
      'Post-storm bay clearing under fresh-washed sky, water still slightly churned but settling, rainbow arcing across the distant horizon',
      'Atoll lagoon under moonless night sky, water glowing faintly blue with bioluminescent plankton, stars brilliant overhead, dark headlands',
      'Volcanic caldera bay shrouded in dawn marine-layer fog, half the bay obscured in soft white veil, basalt walls emerging spectral above',
      'Atoll lagoon under heavy overcast sky, water teal-slate dulled by flat diffuse light, breeze rippling the surface, mood quiet and moody',
      'Narrow fjord-like inlet with squall passing, rain curtain visible across the open mouth, water restless and dark, walls black against grey sky',
      'Volcanic caldera bay at post-sunset twilight, water deep indigo reflecting the violet sky, last orange band glowing at the open horizon',
      'Wide open island bay between distant headlands, brilliant turquoise crystal clarity in the foreground fading to deep sapphire, sun overhead with scattered cumulus',
      'Crescent lagoon on a windy clear day, surface broken into thousands of glittering wavelets, deep cobalt water under scattered cumulus',
      'Volcanic basalt bay under heavy tropical downpour, water roiled and dark, rain hammering the basalt walls, sky uniform leaden grey',
      'Atoll lagoon at first light, perfect mirror reflecting the predawn pink sky, sand bar curving in the middle distance under cool morning air',
      'Mangrove-fringed estuary cove under soft overcast sky, glassy water reflecting the muted grey above, mangroves dark green at the water edge',
      'Volcanic caldera bay enclosed by towering basalt walls, brilliant turquoise crystal water filling the foreground, deep cobalt at center under midday sun',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} reef-paradise bay-setting entries. NO preamble. Each entry 25-40 words on a single line. CRITICAL: every WATER STATE category above MUST be represented — do not collapse to one mood.`,
  },

  reef_paradise_water_quality: {
    format: 'simple',
    theme: `WATER QUALITY entries for EarthBot's reef-paradise path. Each entry is ONE specific WATER SURFACE + COLOR + LIGHT description for a tropical Pacific bay. Each entry 14-25 words.

🚨 CRITICAL — this pool previously baked "brilliant turquoise crystal clarity + mirror-glass" into every entry, locking the path. Diversify by WATER STATE.

🎯 MANDATORY distribution across {COUNT} entries:
  • ~25% calm crystal turquoise (the "current" mode — keep some)
  • ~15% glassy dawn/dusk mirror (different light, calm)
  • ~15% wind-rippled scattered light
  • ~15% pre-storm gunmetal calm
  • ~10% rain-pocked drumming surface
  • ~10% post-storm churning steel-grey
  • ~5% bioluminescent night glow
  • ~5% fog-veiled surface

Vary the LIGHT quality interacting with water: midday sun-sparkle, golden-hour amber glow, dawn pink sheen, dusk indigo reflection, moonlight silver path, overcast diffuse, storm-grey, rain-drum, fog-soft.
`,
    touchpoints: [
      'Glassy mirror-still water at dawn reflecting predawn pink sky, surface unbroken, soft mist hovering just above',
      'Wind-rippled surface scattered with hundreds of glittering wavelets catching mid-afternoon sun',
      'Pre-storm gunmetal calm, water motionless and ominous under charged green-grey sky',
      'Active rain pocking the surface with drumming droplets, mist rising off warm tropical water',
      'Post-storm churning steel-grey water with whitecaps, restless and dark under clearing sky',
      'Bioluminescent night water glowing faint blue under starlight, plankton sparking with surface motion',
      'Fog-veiled water surface soft and obscured, teal water visible in patches through drifting white mist',
      'Brilliant turquoise crystal clarity revealing sand bottom, midday sun penetrating clear to the seabed',
      'Golden-hour water glowing rich amber-warm, sun raking horizontally across the surface',
      'Dusk water reflecting violet sky, deep indigo surface with last orange band at horizon',
      'Overcast diffuse water dulled to teal-slate, flat diffuse light without sparkle or shadow',
      'Calm crystal water at late afternoon, surface glittering with low warm sun-sparkle',
      'Glassy at first light, perfect reflection of pink dawn sky and silhouetted headland',
      'Choppy windy surface broken into thousands of small whitecaps, cobalt and white',
      'Rain-shower water with concentric ripple-rings from each drop hitting the surface',
      'Moonlit night water with silver path leading from the moon to the dark shoreline',
      'Sea-mist morning surface soft and pearly, water visible in patches through low fog',
      'Tropical storm churn with breaking whitecaps, water dark and aggressive under heavy sky',
      'Post-rain crystal-clear water with rainbow caught in droplets above the surface',
      'Late-afternoon clear water with scattered cumulus reflected in the calm surface',
      'Glassy violet twilight surface reflecting deep teal sky, fading orange band at horizon',
      'Trade-wind rippled clean cobalt water under brilliant noon sun, hard sparkle',
      'Sunday-morning calm crystal turquoise with sand-bottom visible clear, lazy soft light',
      'Heavy-rain hammered water with concentric ring patterns everywhere, soft mist over warm tropical sea',
      'Pre-dawn glassy water with brilliant Milky Way reflected in the dark surface',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} reef water-quality entries. NO preamble. Each entry 14-25 words on a single line. CRITICAL: every water-state category MUST be represented — do not collapse to "crystal turquoise."`,
  },

  // ─── FOREST INTERIOR shared pools (2026-06-18) — for deep-forest + lush-jungle
  //     under the EARTHBOT_FOREST_INTERIOR archetype. Fixes the wide-vista postcard
  //     drift: light/atmosphere/detail are all INTERIOR-scale (filtered canopy light,
  //     mist between trunks, understory richness), never wide-overlook. ───
  forest_interior_lighting: {
    format: 'simple',
    theme: `INTERIOR FOREST LIGHT — the real light moment INSIDE a forest, filtered by the canopy. 16-30 words. The camera is among the trees; light arrives FILTERED, never as open-sky overlook light.

🎯 EVERY entry is canopy-filtered interior light with a clear physical source (sun through the canopy):
  • DAPPLED FLOOR LIGHT — broken coins of sun scattered across the forest floor and trunks
  • HARD GOD-SHAFTS — distinct sun-shafts lancing through a canopy gap into the haze
  • BACKLIT CANOPY — low sun behind the leaves, foliage glowing translucent green-gold
  • SOFT OVERCAST GREEN — diffuse flat light, the whole interior a soft even green glow
  • FIRST-LIGHT RAKE — warm low dawn light raking horizontally between the trunks
  • BLUE-HOUR UNDERSTORY — cool pre-dawn / dusk blue settling in the understory, mist holding the last light

🚫 BANS: NO open-sky / overlook / panorama / golden-hour-on-distant-peaks light. NO "alpenglow on the summit." NO artificial glow with no source. NO sunset-over-the-horizon (you're under a canopy). Light is always canopy-filtered and interior.`,
    touchpoints: [
      'Hard god-shafts lancing through a gap in the high canopy into drifting haze, distinct beams striking the mossy floor in bright pools',
      'Dappled morning light scattered in broken coins across fern fronds and wet trunk bark, soft contrast, the floor mottled gold-and-green',
      'Low backlight behind the canopy, the leaves glowing translucent emerald-gold, trunks rimmed in warm light, deep shade between',
      'Soft diffuse overcast-green glow filling the whole interior evenly, no harsh shadows, the wet understory richly saturated',
      'First warm dawn light raking horizontally between the trunk columns, long soft shadows reaching across the leaf litter',
      'Cool blue-hour light settling in the understory, mist holding the last pale glow, trunks fading to deep shade in the distance',
    ],
    instructions: `Each entry is ONE interior canopy-filtered lighting moment, 16-30 words. ALWAYS interior + filtered, NEVER open-sky overlook light. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  forest_interior_atmosphere: {
    format: 'simple',
    theme: `INTERIOR FOREST ATMOSPHERE — what's in the AIR between the trunks. 14-26 words. Sets the air quality of the interior (it dictates whether god-shafts/beams emerge naturally).

🎯 DISTRIBUTION (~25): ground-mist pooling between the trunks / drifting fog veiling the deep trees / post-rain steam rising off the warm floor / crisp clear air with sharp leaf detail (NO beams) / heavy humid haze softening the deep distance / spore-and-pollen drift catching the light / fine drizzle-veil between the trees / dawn dew-haze hanging low / smoke-blue depth haze layering the receding trunks.`,
    touchpoints: [
      'Ground-mist pooling low between the trunks, the deep forest dissolving into soft grey-green haze',
      'Drifting fog veiling the deeper trees, near trunks sharp and far ones ghosted to silhouette',
      'Post-rain steam rising off the warm leaf litter, the air thick and luminous where light hits it',
      'Crisp clear air, every leaf and bark-ridge razor-sharp, no haze, light clean and dry (no beams)',
      'Heavy humid haze softening the deep distance into layered green-grey planes of receding trunks',
      'Fine spore-and-pollen drift hanging in the still air, catching any shaft of light as floating motes',
    ],
    instructions: `Each entry is ONE interior air-quality state, 14-26 words. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  forest_interior_understory: {
    format: 'simple',
    theme: `UNDERSTORY / CANOPY DETAIL — the LUSH packed richness that fills a forest interior. 16-30 words. The dense living detail layered through the scene (foreground to midground), NOT an isolated prop, NOT a distant scale-marker.

🎯 DISTRIBUTION (~25): mossy buttress roots + fallen nurse-logs sprouting saplings / a creek sliding over moss-furred boulders / fern banks and unfurling fronds carpeting the floor / hanging vines + epiphytes draping the mid-trunks / sword-fern + huckleberry understory thickets / a fallen giant trunk bridging the frame, moss-blanketed / bracket fungi shelving up a wet trunk / leaf-litter and seedlings on the dim floor / a shaft-lit clearing of waist-high ferns / lichen-bearded branches in the canopy gloom / a slow shallow stream braiding through the roots.

🚫 BANS: NO human-built anything (no steps/bridge/wall — see template). NO bioluminescence/glow. NO distant peaks or sky.`,
    touchpoints: [
      'Massive moss-furred buttress roots in the foreground, a fallen nurse-log sprouting a row of young saplings along its spine',
      'A shallow creek sliding over moss-rounded boulders, ferns leaning over the water, wet stones catching the filtered light',
      'Dense banks of sword-fern and unfurling fiddleheads carpeting the floor between the trunk columns',
      'Hanging vines and epiphytes draping the mid-trunks, broad dripping leaves layered into the green gloom',
      'A vast fallen giant trunk bridging the mid-frame, blanketed in deep moss and sprouting fungus shelves',
      'Lichen-bearded branches hanging in the canopy gloom above, soft beards swaying in the still humid air',
    ],
    instructions: `Each entry is ONE lush interior understory/canopy detail, 16-30 words. Woven-through richness, never an isolated prop. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  forest_interior_phenomenon: {
    format: 'simple',
    theme: `QUIET INTERIOR PHENOMENON (30%-gated) — one understated real-forest event that deepens the mood. 12-22 words. Subtle, never a spectacle, never sci-fi.

🎯 DISTRIBUTION (~20): a single dramatic god-shaft breaking through as a cloud passes / a light rain-veil drifting through the trunks / mist suddenly pouring through a saddle in the trees / a flush of falling autumn leaves spiralling down / dew-drip cascading from the canopy after rain / a low sun-flare igniting one patch of the understory / steam lifting off the floor as sun hits wet ground.

🚫 BANS: NO aurora / bioluminescence / glow / lightning-in-the-forest / rainbow-spectacle. Quiet and real only.`,
    touchpoints: [
      'a single dramatic sun-shaft breaking through the canopy as a cloud passes, igniting one column of haze',
      'a soft rain-veil drifting through the trunks, the far trees dissolving behind it',
      'a flush of autumn leaves spiralling down through a shaft of light',
      'dew-drip cascading in fine threads from the canopy after rain, sparkling where light catches it',
      'low steam lifting off the warm wet forest floor as the first sun reaches it',
    ],
    instructions: `Each entry is ONE quiet real interior phenomenon, 12-22 words. Subtle, never a spectacle. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ═══ NEW PATHS 2026-06-18 (Kevin) — great-waterfalls + wetlands-wild reuse
  //     EARTHBOT_EPIC_VISTA (bespoke subject pool only). ═══

  great_waterfalls_subject: {
    format: 'simple',
    theme: `PURE GREAT-WATERFALL scenes for EarthBot's great-waterfalls path. THE WATERFALL IS THE HERO — the world's iconic falls at full power, real Earth. Each entry 30-55 words. A clean true-to-life nature photograph, the thundering water + its scale the whole show.

🎯 THE FALL IS THE HERO:
  • The waterfall fills 55-70% of the frame; its scale + the motion of falling water is the wow
  • CAMERA VARIETY: low-angle from the plunge-pool looking up / aerial over the brink / side-profile showing the full drop / from behind the curtain / wide showing the whole horseshoe
  • MOTION: the water is falling RIGHT NOW — mist billowing, spray rainbow, churning plunge-pool

💦 ICONIC REAL FALLS (mix across 25):
  A. IGUAZÚ — the vast Devil's-Throat horseshoe of dozens of falls in jungle, mist columns rising
  B. VICTORIA FALLS — the mile-wide curtain plunging into the Zambezi gorge, "smoke that thunders"
  C. ANGEL FALLS — the world's tallest, a thread plunging off a Venezuelan tepui into cloud
  D. PLITVICE — terraced travertine cascades between turquoise forest pools
  E. SKÓGAFOSS / SELJALANDSFOSS — Icelandic cliff falls (basalt, green moss, rainbow in spray)
  F. KAIETEUR — single massive drop in pristine Guyanese rainforest
  G. DETIAN / BAN GIOC — terraced falls on the China–Vietnam karst border
  H. GULLFOSS / DETTIFOSS — powerful glacial-river falls in a canyon
  I. HAVASU / multnomah — turquoise travertine / mossy tiered cliff fall
  J. JUNGLE CASCADE — an unnamed lush multi-tier cascade pouring over mossy rock into a clear pool
  K. FROZEN / partially-iced winter waterfall

🚫 BANS: ZERO humans, ZERO viewing platforms/railings/bridges/walkways/boats, ZERO buildings, ZERO sci-fi/fantasy/glowing, ZERO photographer names, ZERO negation phrases.

✅ EVERY ENTRY: the named/identifiable fall + its character (height/width/tiers) + camera angle + the water's MOTION (mist/spray/rainbow/churn) + setting (jungle/canyon/basalt-cliff) + a real lighting moment.`,
    touchpoints: [
      "Iguazú Falls Devil's Throat, dozens of cataracts plunging in a vast horseshoe into rising mist, aerial over the brink showing the scale, jungle crowding the rim, a faint rainbow in the spray, soft overcast light",
      'Victoria Falls mile-wide curtain thundering into the narrow Zambezi gorge, towering spray-cloud rising hundreds of feet, side-profile showing the full width, rainforest rim glowing green, golden-hour rainbow arcing through the mist',
      'Skógafoss Iceland, the sixty-metre curtain plunging off a moss-streaked basalt cliff into a churning pool, low-angle from the spray-soaked black-pebble fan, double rainbow in the mist, bright overcast light',
      'Plitvice terraced travertine cascades pouring between turquoise forest pools, beech canopy framing the tiers, drone-down on the stepped falls, foreground mossy travertine lip, dappled soft light',
      'Angel Falls thread plunging off the sheer Auyán-tepui into drifting cloud, the tallest fall on Earth, wide showing the full kilometre drop, rainforest base, low cloud catching first light',
      'Kaieteur Falls single massive plunge into a misty gorge in pristine Guyanese rainforest, low-angle from the gorge showing the immense single drop, dense jungle rim, warm late light through mist',
      'Detian terraced falls on the karst border, three wide tiers spilling between green limestone hills into a calm river, wide vista, mist rising off the lower tier, soft golden-hour light',
      'A lush unnamed multi-tier jungle cascade pouring over mossy black rock into a clear emerald pool, ferns and vines crowding the cascade, low-angle from the pool, dappled forest light, fine spray',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} great-waterfall entries. Each 30-55 words, single line. Format: "named fall + character + camera angle + water-motion + setting + lighting". NO preamble.`,
  },

  wetlands_wild_subject: {
    format: 'simple',
    theme: `PURE WILD-WETLAND scenes for EarthBot's wetlands-wild path — INLAND freshwater wetlands, deltas, swamps, lily lagoons, mangrove channels. THE WETLAND IS THE HERO. Each entry 30-55 words. A clean true-to-life nature photograph. Lush, watery, alive — NOT a dry vista, NOT an ocean coast.

🎯 THE WETLAND IS THE HERO:
  • Water + aquatic vegetation fill the frame — channels, reflections, reeds, lily-pads, flooded forest, papyrus
  • CAMERA VARIETY: drone-down on the braided channels / low eye-level skimming the water surface / into a mangrove/cypress tunnel / wide flooded-forest vista with mirror reflection
  • Wildlife if present is a TINY distant scale-prover (a far heron, a distant elephant in the delta), never the hero

🌿 ICONIC REAL WETLANDS (mix across 25):
  A. OKAVANGO DELTA — aerial of glittering braided channels threading green papyrus islands
  B. PANTANAL — flooded grassland-and-forest mosaic at golden hour, mirror reflections
  C. EVERGLADES — sawgrass "river of grass" with hammock tree-islands, big sky
  D. CYPRESS SWAMP / BAYOU — tupelo + bald-cypress with knees + Spanish moss, glass-black water reflection
  E. MANGROVE TUNNEL — arching mangrove roots over a still tidal-free channel of clear water
  F. LOTUS / WATER-LILY LAGOON — a lagoon carpeted in pink lotus or white lilies at dawn
  G. AMAZON FLOODED VÁRZEA forest — trees standing in mirror-still blackwater, reflections doubling the canopy
  H. CAMARGUE / reedbed marsh — vast reedbeds and shallow lagoons under a wide sky
  I. KERALA / SUNDARBANS backwater channels lined with palms and green
  J. PEAT BOG / fen pools with reflective dark water and cotton-grass

🚫 BANS: ZERO humans, ZERO boats/canoes/docks/piers/stilt-huts/buildings, ZERO ocean/sea/surf/beach (this is INLAND freshwater), ZERO sci-fi/fantasy/glowing/bioluminescence, ZERO photographer names, ZERO negation phrases.

✅ EVERY ENTRY: the named/identifiable wetland + its water + its vegetation + camera angle + reflection/mirror detail + a real lighting moment (golden hour / dawn mist / soft overcast).`,
    touchpoints: [
      'Okavango Delta from the air, glittering braided channels threading between emerald papyrus islands and palm-dotted floodplain, drone-down showing the labyrinth of water, golden-hour light glinting off the channels, a tiny distant elephant for scale',
      'Pantanal flooded forest-and-grassland mosaic at golden hour, mirror-still water doubling the scattered trees and warm sky, low eye-level skimming the surface, foreground reeds, soft amber light',
      'Bald-cypress swamp with Spanish moss draping the tupelo, glass-black water perfectly reflecting the trunks and cypress knees, into the flooded forest at dawn, pale mist between the trees, soft cool light',
      'Mangrove tunnel of arching prop-roots over a clear still channel, green light filtering through the canopy, low eye-level into the tunnel, roots mirrored in the water, dappled soft light',
      'Lotus lagoon carpeted in pink blooms and broad green pads at dawn, a soft mist hanging over the still water, low eye-level across the lily-carpet, distant reed line, pale rose first light',
      'Amazon flooded várzea forest in the wet season, tall trees standing in mirror-still blackwater that doubles the canopy and sky, wide reflection vista, warm late light, faint mist',
      'Everglades sawgrass river of grass stretching to the horizon with scattered hardwood hammock tree-islands, big cumulus sky reflected in the shallow water, wide vista, golden-hour light',
      'Camargue reedbed marsh, vast golden reeds and shallow mirror lagoons under a wide pastel sky, low eye-level across the water, a tiny distant flock of flamingos, soft dawn light',
    ],
    instructions: `Output ONLY a numbered list of {COUNT} wild-wetland entries. Each 30-55 words, single line. Format: "named wetland + water + vegetation + camera angle + reflection detail + lighting". INLAND freshwater only — NO sea/coast. NO preamble.`,
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
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

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
    } else if (current) current += ' ' + trimmed;
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
  if (cleaned.length === 0) throw new Error('No numbered entries found');
  return cleaned;
}

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
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
]);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
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
    console.warn('  ⚠ Sonnet returned no usable entries');
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/earthbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null)
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  else
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
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
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
