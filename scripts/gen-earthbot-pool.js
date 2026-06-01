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

🎯 BIOME COVERAGE TARGET (across 25 entries):
  • Glacier tongues + ice caves: 4 entries
  • Glacier lagoons + iceberg beaches (Jökulsárlón / Diamond Beach): 3 entries
  • Black-sand beaches (Reynisfjara / Vík / Hvítserkur): 4 entries
  • Basalt sea stacks + columns (Reynisdrangar / Stuðlagil / Svartifoss / Aldeyjarfoss): 3 entries
  • Waterfalls (Skógafoss / Seljalandsfoss / Gullfoss / Dettifoss / Háifoss / Goðafoss): 4 entries
  • Rhyolite mountains (Landmannalaugar / Kerlingarfjöll / Kirkjufell): 3 entries
  • Moss-on-lava + continental rift + geothermal (Eldhraun / Þingvellir / Strokkur / Námafjall): 4 entries

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
      'Hvítserkur basalt sea arch at midnight sun glow, the 15-metre-tall dragon-shaped sea stack rising from a glassy tidal plain, foreground tidal-flat with reflection of stack, soft cool-pink twilight on the rock face, distant Strandir coastline silhouette',
      'Aldeyjarfoss basalt-column waterfall, milky-blue glacial water falling 20 metres into a basalt-column-walled pool, foreground close hexagonal basalt rim wet with spray, column-curtain wall dominant midground, sky a clear arctic cobalt',
      'Kirkjufell mountain at blue-hour, the iconic conical Snæfellsnes peak rising 463 metres beside the small Kirkjufellsfoss waterfall, foreground wet basalt boulders with foaming stream, midground falls leading the eye to peak, distant fjord water and cobalt sky behind',
      'Reynisdrangar sea stacks at storm light, three basalt sea stacks rising from churning Atlantic surf with crashing wave-spray, foreground Reynisfjara black sand with surf-pattern arcs, breaking storm cloud overhead with rain curtain advancing, distant cliff coast in cool grey mist',
      'Goðafoss horseshoe waterfall at polar twilight, the 12-metre-tall arcing waterfall sweeping in a U-shape over a basalt rim, foreground close basalt ledge with mossy edge, milky-blue water curtain dominant, distant cliff-face and pink-violet polar dawn sky',
      'Námafjall geothermal field at midday, rust-orange and sulphur-yellow mineral-crust ground steaming with active fumaroles and bubbling mud pots, foreground close fumarole rim with concentric sulphur deposit, midground bubbling pot, distant Mýrdalsjökull glacier edge cool blue',
      'Háifoss high waterfall, the 122-metre vertical thread of glacial-silt-grey water dropping into a vast canyon, foreground close basalt-rim with moss carpet, neighboring smaller waterfall Granni at left, deep canyon walls in atmospheric blue depth',
      'Kerlingarfjöll geothermal valley at golden hour, rhyolite ridges in rust + ochre + violet striations with steaming hot-spring veins running through the slope, foreground close mineral-crust ground with sulphur deposits, midground steam plume drifting, distant rhyolite peaks in warm copper sidelight',
      'Snæfellsjökull peak at midnight sun, the 1446-metre glacier-capped volcano rising from coastal foothills, foreground basalt-pebble fan on coastal flat, midground moss-on-lava hummocks, glacier cap glowing soft cool-pink in midnight-sun grazing light',
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
  • Polar lenticular stack three-tiered over Snæfellsjökull

🚫 ABSOLUTE BANS:
  • ZERO photographer names
  • ZERO desert / tropical / temperate sky tropes
  • ZERO negation phrases

Each entry 14-22 words, single line. Output as a NUMBERED list.`,
    touchpoints: [
      'Lenticular cloud disc hovering motionless over Eyjafjallajökull volcano peak',
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
      'Triple-stack polar lenticular cloud disc tier over Snæfellsjökull peak',
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
  • Stack-of-three lenticular over Aconcagua peak
  • Layered stratocumulus broken by cobalt patches
  • Star-crowded moonless Altiplano sky with Milky Way
  • Pastel polar-twilight cloud Patagonia
  • Sunset orange-violet ribbon at horizon over Andes
`,
    touchpoints: [
      'Lenticular cloud cap hovering motionless over Fitz Roy peak',
      'Patagonian banner cloud streaming horizontally off Cuernos del Paine peak',
      'Sea-of-clouds inversion below Andean summit with peaks emerging into clear sky',
      'Cobalt high-altitude noon sky at 4500-metre elevation deep saturation',
      'Sunset banner cumulus glowing copper-amber over Salar de Uyuni horizon',
      'Volcanic-ash-tinted sky with copper-yellow undertone after recent eruption',
      'Atacama clear cobalt sky with high cirrus contrails distant',
      'Pre-storm yellow-green oppressive Patagonian sky pressing low',
      'Stratus deck low over Tierra del Fuego coast in cool grey blanket',
      'Cumulonimbus anvil rising thirty thousand feet over Iguazu plateau',
      'Stack-of-three lenticular discs tiered over Aconcagua peak',
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
  • Lenticular cloud stack hovering over Fitz Roy
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
      'Lenticular cloud stack hovering over Fitz Roy peak in three discs',
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
