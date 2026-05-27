#!/usr/bin/env node
/**
 * Generate a BrickBot axis pool using Sonnet.
 *
 * Bespoke pirate recipes for the 2026-05-22 axis-system migration of the
 * pirates path. Anchored on Pirates of the Caribbean LEGO sets, Bricklink
 * AFOL pirate dioramas, vintage LEGO Pirates (Black Seas Barracuda etc.),
 * and Treasure Island / Master & Commander narrative beats. Per the
 * `feedback_each_path_bespoke_not_cloned.md` rule: every recipe here is
 * pirate-bespoke, not cloned from any other bot's gen script.
 *
 * Infrastructure (signatureOf / dedupe / target-loop) mirrors
 * gen-mechbot-pool.js + gen-dragonbot-pool.js.
 *
 * Usage:
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_scene_type --target 50
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_ship_class --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
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
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BrickBot pirates path (2026-05-22)
// Bespoke per-path; NOT cloned from other bots' recipes.
// Canon: POTC LEGO sets + Bricklink AFOL pirate dioramas + vintage LEGO
// Pirates (Black Seas Barracuda / Skull's Eye Schooner / Brickbeard's
// Bounty) + Treasure Island + Master & Commander.
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // LANDSCAPE PATH (2026-05-27 — seventh BrickBot axis migration)
  // SCENERY-LED epic natural vistas. The terrain IS the hero; minifigs are
  // tiny scale-provers. Bespoke axes: biome_vista (hero) + terrain_build_
  // technique (anti-photoreal star) + scale_prover (×2). NO register, NO
  // minifig-action. Every entry names LEGO PARTS, BANS photoreal-terrain/
  // rock/water/snow + fluid-motion verbs. Bespoke.
  // ════════════════════════════════════════════════════════

  brickbot_landscape_biome_vista: {
    format: 'simple',
    theme: `LEGO ALL-BRICK NATURAL-VISTA BIOMES — the HERO SUBJECT for BrickBot's landscape path. Each entry is ONE monumental natural vista rendered entirely in brick, 30-55 words. The landscape IS the subject (minifigs are tiny scale-provers, handled by a separate axis — do NOT feature them here).

⚠️ CRITICAL — describe the BIOME / TERRAIN / VISTA only. NO camera framing. NO scale-prover figures (separate axis). NO specific weather (separate axis). NO lighting. NO phenomenon. Just: what monumental brick landform fills the frame.

⚠️ EVERYTHING IS LEGO BRICK. Rock = slope-bricks. Water = trans-blue plates. Snow = white plates. NEVER real-nature vocabulary. BANNED: photoreal, real rock/stone/water/snow, rugged/rocky/craggy texture, rushing, cascading, misty.

VARIETY MANDATE — distribute across: alpine-peak-range / glacier-carved-valley / redwood-old-growth-grove / desert-slot-canyon / sea-cliff-coast / alpine-wildflower-meadow / plateau-mesa-badlands / braided-river-delta / savanna / fjord / volcanic-caldera / sequoia-grove / frozen-waterfall-cliff / canyon-river-bend / rolling-tundra / karst-spires / butte-field / coastal-dunes.

Each entry: name the biome in first 6-10 words; describe the monumental brick LANDFORM + its multi-tier depth (foreground → mid → deep-distance ridge); name key brick parts; NEVER a figure, weather, or phenomenon.`,
    touchpoints: [
      'ALPINE PEAK RANGE — a towering range of light-bley + dark-bley slope-brick peaks with white-plate snow-caps, serrated ridge-lines receding tier after tier into the deep distance, a brick scree-field of round-plates spilling down the foreground flank',
      'GLACIER-CARVED VALLEY — a deep U-valley of grey slope-brick walls with a trans-light-blue + white glacier-tongue of layered plates winding down its floor, hanging side-valleys, a moraine of dark-bley round-bricks at the snout',
      'REDWOOD OLD-GROWTH GROVE — colossal brown round-brick + cylinder trunk-columns rising out of frame, a green plant-element canopy far overhead, a fern-element understory on a dark-tan plate floor, shafts of space between the giant trunks',
      'DESERT SLOT-CANYON — narrow towering walls of stacked tan + orange + red plates showing every sedimentary band as a distinct plate-course, a sliver of brick-sky far above, a sandy tan-plate floor winding between the sculpted slope-brick walls',
      'SEA-CLIFF COAST — sheer dark-grey + light-bley slope-brick cliffs plunging to trans-blue + trans-light-blue plate surf with white round-plate foam, sea-stack BURP-rock pillars offshore, a green-plate clifftop meadow along the rim',
      'ALPINE WILDFLOWER MEADOW — a sweeping green + sand-green plate meadow studded with plant-element + round-plate wildflowers, rising to a backdrop of white-capped slope-brick peaks, a brick-pine belt at the meadow edge',
      'PLATEAU MESA BADLANDS — flat-topped mesas + buttes of stacked red + tan + cream plates with stepped slope-brick flanks, a maze of brick washes between them, a foreground of round-plate scree and brush-element',
      'BRAIDED RIVER DELTA — a wide tan-plate floodplain threaded by braided channels of trans-blue + trans-light-blue plates splitting around brick gravel-bars, framed by distant slope-brick foothills, an aerial-scale brick landform',
      'FJORD — a deep trans-blue plate inlet flanked by sheer grey slope-brick walls plunging straight to the waterline, white-plate snow on the high rims, brick-pine clinging to the lower slopes, receding into deep-distance mist-plates',
      'VOLCANIC CALDERA — a vast brick crater of dark-bley + black slope-bricks with a trans-orange + trans-red lava-element vent at the floor, hardened lava-flow plates fanning out, a rim of red-brown scree round-plates',
      'SEQUOIA GROVE AT THE BASE — a cluster of immense rust-brown round-brick trunks with deeply textured cheese-slope bark rising past the frame-top, a green plant-element canopy glimpsed far above, dappled brick-floor below',
      'CANYON RIVER-BEND — a great horseshoe bend of a trans-blue plate river carving around a towering stacked-plate rock-pinnacle, layered canyon walls in tan + orange receding, a high-overlook foreground of slope-brick rim-rock',
    ],
    instructions: `Each entry is ONE brick natural-vista biome, 30-55 words. Format: "BIOME NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no camera framing, no scale-prover figures, no weather/phenomenon, no lighting, no real-nature vocabulary (photoreal/real-rock-water-snow/rugged/craggy/rushing/cascading/misty). Every element a NAMED LEGO BRICK PART. The monumental brick landform only.`,
  },

  brickbot_landscape_terrain_build_technique: {
    format: 'simple',
    theme: `LEGO LANDSCAPE MOC BUILD TECHNIQUE — the AFOL-distinguishing brick-construction notes for BrickBot's landscape path, focused on making ROCK, WATER, SNOW, CLOUDS, and TERRAIN read as unmistakable BRICK. Each entry 25-45 words. THIS AXIS IS THE PRIMARY ANTI-PHOTOREAL-LANDSCAPE LEVER (epic-vista is Flux's strongest photoreal pull).

VARIETY MANDATE — distribute across:
  • SNOT rock-strata (sideways-stacked slope-bricks forming sedimentary layers / tilted strata)
  • BURP/LURP cliff-faces (big rock-pieces blended with slope-bricks + cheese-slope texture)
  • Stacked-plate canyon striations (graduated tan/orange/red plate-courses, each a visible band)
  • Trans-blue water (layered trans-blue + trans-light-blue plates for rivers/lakes, white round-plate foam)
  • Stepped trans-plate waterfall (trans-blue plates stepping down a slope-brick cliff, white round-plate spray)
  • White-plate snow-cap (white slopes + plates + white-stud caps on peaks + ledges)
  • Round-plate cloud-bank (white 1×1 round-plates + cotton-elements massed at a level for cloud-sea)
  • Green-canopy carpet (plant-elements + green slope-bricks as forest seen from above/distance)
  • Tan-slope dune ripple (tan slope-bricks + offset jumper-tiles for sand ripple)
  • Scree / talus (scattered round-plates + cheese-slopes spilling down a flank)

Each entry: name the technique TYPE in first 5-8 words; specify WHICH landform; name SPECIFIC BRICK PARTS; imply scale + visual impact. NO real-construction (no sculpt/paint/foam). BANNED: photoreal, real-rock/water/snow.`,
    touchpoints: [
      'SNOT rock-strata cliff — a cliff face built with sideways-stud bracket-plates turning slope-bricks to read as horizontal sedimentary strata, tan + orange + cream courses offset half-stud, the geology unmistakably brick-layered',
      'BURP-rock blended peak — a mountain flank built from large BURP/LURP rock-pieces blended into stacked grey + light-bley slope-bricks, surface broken with 1×1 cheese-slopes for crag-texture, a snow-plate cap on top',
      'Stacked-plate canyon striations — canyon walls built as graduated plate-courses in red, rust, tan, and cream, each sedimentary band a distinct horizontal plate-layer, the strata reading as deliberate brick courses',
      'Trans-blue layered river — a river built from trans-blue + trans-light-blue plates layered at offset levels for current, white 1×1 round-plates dotting riffles, the trans-plates clearly reading as plastic water through a canyon floor',
      'Stepped trans-plate waterfall — a waterfall built from trans-blue + trans-light-blue plates cascading down stepped slope-brick ledges, white 1×1 round-plate spray clustered at each lip, pooling into a trans-light-blue plate basin',
      'White-plate snow-cap — a peak crowned with white slope-bricks + white plates + white-stud rounded caps following the summit geometry, the snow-line a crisp brick transition to grey slope-brick rock below',
      'Round-plate cloud-sea — a level bank of white 1×1 round-plates + cotton-elements massed at mid-mountain height so the peaks emerge above a built sea of cloud, the cloud unmistakably brick + cotton',
      'Green-canopy carpet — a distant forest built as a textured carpet of green + olive-green plant-elements and green slope-bricks blanketing the hills, individual brick-tree-tops near the foreground, never a photoreal treeline',
      'Tan-slope dune field — desert dunes built from tan + dark-tan slope-bricks with crisp wind-edges, ripple-texture added via offset 1×2 jumper-tiles across the windward face, a sharp brick dune-crest line',
      'Scree-and-talus flank — a slope flank built from scattered light-bley + dark-bley 1×1 round-plates + cheese-slopes spilling down from a rock-face, the loose-rock read achieved entirely with small brick elements',
      'Tilted fault-block strata — a mountain built from slope-brick strata tilted at a dramatic angle as if uplifted, the diagonal plate-courses conveying geologic force, snow-plate caught in the upper folds',
      'Reflection-lake build — a still mountain lake built from a smooth sheet of trans-blue + trans-light-blue tiles (tiled = mirror-still) at the valley floor, the brick peaks mirrored above the waterline',
    ],
    instructions: `Each entry is ONE landscape MOC build technique, 25-45 words. Format: "TECHNIQUE NAME — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-construction (sculpt/paint/foam), no real-rock/water/snow/photoreal vocabulary. LEGO bricks only — name SPECIFIC parts (slope-brick / BURP rock-piece / trans-blue plate / white round-plate / cheese-slope).`,
  },

  brickbot_landscape_scale_prover: {
    format: 'simple',
    theme: `SCALE-PROVERS FOR EPIC BRICK VISTAS — the TINY elements that prove the monumental scale of a brick landscape. Each entry is ONE small element, 12-25 words, ALWAYS dwarfed by the terrain, placed at a stated depth. These make the vista read as enormous.

⚠️ EVERY entry is TINY against the landscape — a few studs tall, NEVER the focus, NEVER close-up, NEVER centered-large. Minifigs are standard LEGO (C-hands, printed face). Brick creatures/builds are micro.

VARIETY: lone hiker minifig on a ridge / two roped climbers on a cliff face / a photographer minifig at an overlook / a single tent at the valley floor / a tiny canoe on the river / a micro brick-eagle riding a thermal / a micro deer-herd / a lone log-cabin / a switchback trail with a few figures / a parked micro-camper / a fire-lookout tower / a suspension-footbridge with a tiny figure / a flock of micro brick-birds / a mountain-goat micro-build on a ledge.

Each: name the element + its TINY scale + a DEPTH placement (foreground ridge / mid-ground bench / deep-distance valley floor). Brick parts named where useful.`,
    touchpoints: [
      'A lone hiker minifig silhouetted on a foreground ridge-edge, backpack-element on, just a few studs tall against the vista beyond, the classic scale-anchor',
      'Two roped climber minifigs mid-cliff on the mid-ground rock-face, tiny against the towering slope-brick wall, a thread-rope element linking them',
      'A photographer minifig at a foreground overlook with a tripod-build, dwarfed by the canyon dropping away beyond, gazing into the deep distance',
      'A single white tent-build at the distant valley floor, a speck of brightness proving how far down and away the valley stretches below the peaks',
      'A tiny brick canoe with a single paddler minifig on the trans-blue river far below, a dot of color on the water threading the canyon',
      'A micro brick-eagle on a clear rod riding a thermal mid-frame between the cliff walls, wings spread, tiny against the rock scale',
      'A micro deer-herd of three or four small slope-brick builds grazing a distant meadow bench, barely-there specks proving the meadow vast',
      'A lone log-cabin micro-build with a cotton-element smoke-wisp tucked at the forest edge in the mid-distance, dwarfed by the peaks above',
      'A switchback trail of three tiny hiker minifigs strung up a foreground slope, each smaller as the trail climbs, the path conveying the height to come',
      'A fire-lookout tower micro-build perched on a distant summit knob, a pinprick of structure against the sky, proving the summit remote and high',
      'A suspension-footbridge build spanning a deep gorge with one tiny figure mid-crossing, the bridge a thread across an enormous brick chasm',
      'A flock of micro brick-birds on clear rods wheeling in the deep distance over the valley, scattered dots conveying the open air and scale',
    ],
    instructions: `Each entry is ONE tiny scale-prover, 12-25 words. Format: prose naming the element + its tiny scale + a depth placement. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: never large/centered/close-up/focus — ALWAYS dwarfed by the terrain. Minifigs standard LEGO; creatures micro brick-builds. No real-nature/photoreal vocabulary.`,
  },

  brickbot_landscape_flora_detail: {
    format: 'simple',
    theme: `BRICK FLORA DETAIL FOR VISTAS — the brick vegetation dressing a natural-landscape diorama. Each entry 12-25 words, naming the brick construction. Appropriate to varied biomes.

VARIETY: brick-pine forest belt / plant-element wildflower carpet / redwood trunk-columns / desert cactus + brush builds / autumn-aspen grove / savanna acacia builds / tundra moss-plate + lichen / fern-element understory / palm cluster / alpine larch + scrub / mangrove-root build / saguaro field / heather-moor plates / bamboo-stalk build.

Each names SPECIFIC brick parts. NEVER photoreal plants.`,
    touchpoints: [
      'A brick-pine forest belt — rows of brown round-brick trunks with dark-green plant-element + slope-brick boughs marching up a slope, snow-plate caught on the upper tiers',
      'A wildflower carpet — green + sand-green plates studded densely with plant-element stems topped by bright round-plate petal-clusters in mixed colors, a packed brick meadow',
      'Redwood trunk-columns — immense rust-brown round-brick + cylinder columns with cheese-slope bark-texture rising out of frame, spaced wide on a fern-element floor',
      'Desert cactus + brush — green brick-built saguaro arms and barrel-cactus domes with brown brush-element clumps scattered across a tan-plate desert floor',
      'An autumn-aspen grove — slender white-and-grey round-brick trunks topped with golden + orange leaf-element + round-plate canopies, a carpet of fallen autumn round-plates below',
      'Savanna acacia builds — flat-topped brick acacia trees (brown trunk, wide green plant-element crown on a bar-armature) dotted across a tan-and-gold savanna plate-plain',
      'Tundra moss-and-lichen — low green + olive + sand-green plates with tiny round-plate lichen-spots and scrub-element tufts hugging a rocky brick ground, hardy and sparse-but-detailed',
      'A fern-element understory — dense green fern + plant-element fronds carpeting a shaded brick forest floor between trunk-columns, dappled brick-light across them',
      'A palm cluster — brown round-brick trunks topped with arching green plant-element fronds, set on a tan-plate shore above trans-blue plate water',
      'Alpine larch + scrub — gnarled short brick-conifers and low scrub-element clumps clinging to a high rocky slope near the snow-line, wind-bent slope-brick forms',
      'A bamboo-stalk grove — tall slender green round-brick + bar stalks in a dense vertical grove with plant-element leaf-tufts, a misty brick-floor below',
      'A heather-moor — rolling green + purple plate ground textured with countless tiny round-plate heather-blooms, a sweep of muted brick color over the hills',
    ],
    instructions: `Each entry is ONE brick flora detail, 12-25 words. Format: prose naming the flora + its brick parts. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no photoreal plants; LEGO bricks only (plant-element / round-brick trunk / leaf-element / slope-brick boughs). No real-nature vocabulary.`,
  },

  brickbot_landscape_camera_framing: {
    format: 'simple',
    theme: `LANDSCAPE-VISTA CAMERA FRAMING — LEGO MOC photography angles for the landscape path. Each entry 15-30 words, favoring wide/deep/vertical-scale compositions (the landscape is the hero).

⚠️ Bespoke — leverage vista scenery (ridge-line / valley-floor / slot-canyon / lake-reflection / summit / aerial / redwood-base / cliff-edge) — NEVER a centered minifig portrait.

VARIETY MANDATE — distribute across: sweeping high-aerial, valley-floor-looking-up-at-peaks, ridge-line-panorama, through-a-slot-canyon, reflection-in-a-still-lake, summit-overlook-vista, aerial-river-bend, worm's-eye-up-a-redwood, cliff-edge-vertigo-down, low-foreground-rock-to-deep-peaks.

Each: specify camera POSITION + the scale-drama it creates; reference brick vista scenery.`,
    touchpoints: [
      'SWEEPING HIGH-AERIAL — camera high and back surveying the whole brick range receding tier after tier to a far hazed horizon, the scale of the land laid out in full',
      'VALLEY-FLOOR-LOOKING-UP — camera low on the valley floor tilting up at the towering slope-brick peaks, foreground brick-meadow leading the eye up to the snow-capped summits',
      'RIDGE-LINE PANORAMA — camera on a foreground ridge looking along the serrated brick crest as it marches into the distance, layered ranges fading behind, a tiny figure on the near ridge for scale',
      'THROUGH-A-SLOT-CANYON — camera deep in a slot canyon framed by towering stacked-plate walls inches away, a sliver of brick-sky far above, the eye drawn down the sculpted brick passage',
      'REFLECTION-IN-A-STILL-LAKE — camera low at a trans-blue tile lake-edge so the brick peaks mirror perfectly across the still water, near-symmetrical composition, foreground shore-rocks',
      'SUMMIT-OVERLOOK VISTA — camera at a high summit looking out and down over everything below, a foreground rim of slope-brick rock, the world dropping away into deep brick distance',
      'AERIAL-RIVER-BEND — camera high over a great horseshoe river-bend, the trans-blue plate river wrapping a stacked-plate rock-pinnacle, canyon walls receding, a god-like overview',
      "WORM'S-EYE-UP-A-REDWOOD — camera at the forest floor craning straight up the immense brown round-brick trunk-columns to a distant green canopy, severe vertical scale",
      'CLIFF-EDGE-VERTIGO-DOWN — camera at a cliff lip looking straight down the sheer slope-brick face to a trans-blue river or surf far below, dizzying depth, a foreground rim for grounding',
      'LOW-FOREGROUND-ROCK-TO-DEEP-PEAKS — camera low behind a detailed foreground boulder-field of round-plates leading back across a valley to deep-distance snow-capped slope-brick peaks, full depth-stack',
    ],
    instructions: `Each entry is ONE landscape camera framing, 15-30 words. Format: "FRAMING NAME — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no centered-minifig framing — landscape is the hero; every entry references brick vista scenery + scale-drama. No real-nature vocabulary.`,
  },

  brickbot_landscape_atmosphere: {
    format: 'simple',
    theme: `BRICK ATMOSPHERE FOR VISTAS — the weather/atmospheric layer of a brick landscape, BUILT from brick + cotton elements. Each entry 15-30 words.

VARIETY: crisp-clear deep-distance / low cloud-sea below the peaks / morning valley-mist / gathering storm-cloud bank / golden atmospheric-haze / light snow-flurry / rolling ground-fog (static cotton) / high thin cirrus-streaks / clearing-after-storm / heat-haze (built, subtle).

Each names how the atmosphere is built (white round-plates / cotton-elements / trans-clear) + its mood. NEVER photoreal-air/mist. NO motion verbs (render static).`,
    touchpoints: [
      'Crisp-clear deep-distance — no cloud, a clean brick sky-baseplate, the far ranges rendered in lighter-grey slope-bricks to suggest atmospheric depth, every brick edge sharp, a high-altitude clarity',
      'Low cloud-sea below the peaks — a level bank of white 1×1 round-plates + cotton-elements massed at mid-mountain height, the snow-capped summits emerging above the built cloud-sea like islands',
      'Morning valley-mist — soft cotton-elements + white round-plates pooled along the valley floor between the slope-brick walls, the upper peaks clear above the built mist-layer',
      'Gathering storm-cloud bank — a dark mass of dark-bley + grey 1×1 round-plates + cotton-elements built up on one side of the sky, a brick-shadow falling across the range below, ominous',
      'Golden atmospheric-haze — a thin scatter of trans-clear + trans-yellow tiles across the deep distance softening the far ridges into warm layered silhouettes, the classic depth-haze in brick',
      'Light snow-flurry — sparse white 1×1 round-plates on clear bar-rods scattered across the frame plus a few cotton-elements, a gentle built snowfall over the peaks',
      'Rolling ground-fog — a low static layer of cotton-elements + white round-plates clinging to the forest floor + lake surface, trunk-columns rising out of the built fog',
      'High cirrus-streaks — thin streaks of white plates + 1×1 round-plates built high across the sky-baseplate, fair-weather wisps lending the vista an airy ceiling',
      'Clearing-after-storm — a torn cloud-bank of grey + white round-plates parting to let a shaft of clear brick-sky through over one part of the range, the drama lifting',
      'Heat-haze shimmer — a subtle scatter of trans-clear tiles low over a desert plate-plain catching the light, a built suggestion of rising heat without any photoreal blur',
    ],
    instructions: `Each entry is ONE brick atmosphere, 15-30 words. Format: prose naming the atmosphere + how it's built + mood. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no photoreal-air/mist/cloud; built from white round-plates / cotton-elements / trans-clear only. No motion verbs (rolling/billowing) — render as a static built layer.`,
  },

  brickbot_landscape_lighting: {
    format: 'simple',
    theme: `LANDSCAPE-VISTA LIGHTING — light direction + quality for a brick landscape MOC photo. Each entry 15-30 words. Lights a TABLETOP BRICK DIORAMA — studio-macro shadows on plastic terrain, evoking the gallery-vista mood.

VARIETY: low raking side-light (long terrain shadows) / backlit rim-light on ridges / high-noon top-light / god-rays through a cloud-gap / warm low-sun gild on peaks / cool shadowed-valley with lit summits / alpenglow rose on the snow-caps / overcast soft-even / dawn first-light catching the highest peak / dramatic single-shaft spotlight.

Each names SOURCE + DIRECTION + how it rakes the brick terrain. NEVER real-sun/photoreal-atmosphere claims.`,
    touchpoints: [
      'Low raking side-light from one edge, skimming hard across the slope-brick terrain so every ridge and strata-course throws a long plastic shadow, maximal three-dimensional relief on the bricks',
      'Backlit rim-light from behind the range, the ridge-lines glowing bright against a darker sky-baseplate while the near faces fall into cool shadow, dramatic silhouette depth',
      'High-noon top-light, a strong overhead key making the snow-plate caps and trans-blue water pop in saturated contrast, short crisp shadows, the clear-day vista',
      'God-rays through a cloud-gap — a built shaft of warm light (trans-yellow tiles + a lit zone) breaking through the round-plate cloud-bank to spotlight one part of the valley, the rest cooler',
      'Warm low-sun gild, late-day amber light raking the peaks and gilding the upper slope-brick faces while the valley floor sinks into cool blue shadow, golden-hour grandeur',
      'Cool shadowed-valley with lit summits — the deep valley in cool blue-grey shadow while only the highest snow-plate summits catch warm light, strong tonal separation',
      'Alpenglow rose on the snow-caps — a soft pink-warm light on the white-plate summits against a deepening blue-hour sky, the quiet majestic moment',
      'Overcast soft-even light, a gentle shadowless wash revealing every brick detail of the terrain evenly under a pale sky, the moody contemplative vista',
      'Dawn first-light catching the highest peak — a single warm-lit summit against an otherwise blue pre-dawn range, the day arriving at the top first',
      'Dramatic single-shaft spotlight — one zone of the vista lit by a hard warm beam (as if sun through a notch) while the surrounding terrain stays moody and cool, theatrical depth',
    ],
    instructions: `Each entry is ONE landscape lighting setup, 15-30 words. Format: prose naming source + direction + how it rakes the bricks. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-sun/photoreal-atmosphere language — it lights a plastic brick diorama. No real-nature vocabulary.`,
  },

  brickbot_landscape_palette: {
    format: 'simple',
    theme: `LANDSCAPE PALETTE — time-of-day + biome color combinations for a brick landscape vista, in LEGO brick colors. Each entry 12-25 words, naming 3-5 specific brick colors + the mood/biome.

VARIETY: golden-hour amber+tan / blue-hour twilight+slate / high-noon saturated-green+azure / dawn-pink+lavender mist / sunset magenta+ember / overcast cool-grey+sage / desert rust+ochre+cream / alpine white+grey+pine / autumn gold+rust+olive / volcanic black+ember-orange / tropical jade+turquoise+sand / tundra sage+tan+slate.

Each names ACTUAL LEGO brick colors (dark-tan, sand-green, dark-bley, trans-blue, etc.).`,
    touchpoints: [
      'Golden-hour palette — warm amber + tan + soft-gold + long-shadow-blue, the late-day glow gilding brick peaks',
      'Blue-hour palette — deep twilight-blue + slate-grey + a touch of warm window-amber, the quiet dusk over the range',
      'High-noon palette — saturated green + azure-sky + bright snow-white + grey rock, the crisp clear-day vista',
      'Dawn-mist palette — soft pink + lavender + pale-grey + cool-white, the tender first-light over a misted valley',
      'Sunset palette — magenta + ember-orange + violet + dark silhouette-grey, the dramatic dusk sky behind the peaks',
      'Overcast palette — cool grey + sage-green + muted-tan + soft-white, the moody contemplative landscape',
      'Desert palette — rust-red + ochre + cream + tan + a strip of azure sky, the sun-baked canyon-country',
      'Alpine palette — snow-white + light-bley + dark-bley + pine-green, the high cold mountain look',
      'Autumn palette — gold + rust + olive-green + warm-brown, the seasonal forested hills ablaze in brick color',
      'Volcanic palette — black + dark-bley + ember-orange + ash-grey, the stark fiery caldera',
      'Tropical-coast palette — jade-green + turquoise + ivory-sand + slope-grey cliff, the lush warm shoreline',
      'Tundra palette — sage + tan + slate-blue + muted-white, the vast cold open expanse',
    ],
    instructions: `Each entry is ONE landscape palette, 12-25 words. Format: "NAME palette — colors + mood/biome". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: name ACTUAL LEGO brick colors; no photoreal-color language. No real-nature vocabulary.`,
  },

  brickbot_landscape_natural_phenomenon: {
    format: 'simple',
    theme: `NATURAL PHENOMENON — a 50%-gated dramatic natural EVENT for a brick landscape, ALWAYS rendered IN BRICK. Each entry 20-40 words. AMPLIFIES the vista as a secondary focal point; the terrain stays the hero.

VARIETY: waterfall-mist cloud / trans-arc rainbow / lightning-strike trans-bolt / built avalanche-cloud down a face / river-rapids white-foam / geyser-plume / aurora over the range / volcanic trans-orange lava-glow + ash / migrating brick-bird flock / rockslide / shaft of god-rays / breaking storm-wave on a sea-cliff / wildfire-glow ridge (distant) / shooting-star streak.

Each names BRICK PARTS + visual impact. NEVER lighting-color-cast (separate axis). NEVER real-nature/photoreal. NO fluid-motion verbs (render as static built moment).`,
    touchpoints: [
      'WATERFALL-MIST CLOUD — a billow of white 1×1 round-plates + cotton-elements built at the foot of a stepped trans-blue waterfall where it strikes the basin, a built spray-cloud rising against the cliff',
      'TRANS-ARC RAINBOW — a built arc of stacked trans-red/orange/yellow/green/blue/purple plates curving over the valley after rain, a deliberate brick rainbow spanning the vista',
      'LIGHTNING-STRIKE — a jagged trans-clear + trans-blue bolt-element built striking from a dark round-plate storm-cloud to a far ridge, a single dramatic frozen brick flash',
      'AVALANCHE-CLOUD — a built tumbling cloud of white slopes + round-plates + cotton-elements cascading down a snow-face below the cornice, tiny figures fleeing, the dramatic-but-distant beat',
      'RIVER-RAPIDS FOAM — a stretch of the trans-blue river built with dense white 1×1 round-plate + cheese-slope foam over submerged brick boulders, a frozen whitewater moment',
      'GEYSER-PLUME — a built column of trans-clear + white 1×1 round-plates erupting from a brick vent on a geothermal flat, cotton-element steam at the top, mineral-tan terrace plates around it',
      'AURORA OVER THE RANGE — vertical built drapes of trans-green + trans-cyan + trans-purple plates hanging from the sky-baseplate over a dark snow-capped range, a shimmering brick light-curtain',
      'VOLCANIC LAVA-GLOW — trans-orange + trans-red lava-elements glowing in a caldera vent and snaking down in hardened flow-plates, a cotton-element + dark-round-plate ash-plume rising above',
      'MIGRATING BRICK-FLOCK — a long skein of micro brick-birds on clear rods strung across the deep sky over the vista, a V-formation conveying open scale and season',
      'GOD-RAY SHAFTS — built shafts of trans-clear + trans-yellow tiles breaking through a round-plate cloud-gap down onto one lit part of the valley floor, the rest in cool shadow',
    ],
    instructions: `Each entry is ONE natural phenomenon, 20-40 words. Format: "PHENOMENON NAME — brick-parts + visual impact". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: never lighting-color-cast (separate axis); never real-nature/photoreal language; ALWAYS built from named brick parts; never fluid-motion verbs (render as a static built moment).`,
  },

  // ════════════════════════════════════════════════════════
  // AQUATIC PATH (2026-05-27 — fifth BrickBot axis migration)
  // BEACH (surface) + UNDERWATER (submerged) duality. Bespoke axes:
  // water_build_technique (anti-photoreal-water lever) + marine_life
  // (creature-fill). Every entry names LEGO PARTS, BANS photoreal-water/
  // sand/coral + fluid-motion verbs (rippling/flowing/crashing/lapping).
  // Bespoke — NOT cloned from forest/fantasy/space.
  // ════════════════════════════════════════════════════════

  brickbot_aquatic_scene_type: {
    format: 'simple',
    theme: `LEGO MOC AQUATIC DIORAMA SCENE STAGES — narrative-stage descriptions for BrickBot's aquatic axis system. Each entry is ONE stage, clearly SURFACE (beach/coast/boardwalk/tide-pool/surf) or SUBMERGED (reef/kelp/trench/shipwreck/grotto). Each entry 30-55 words.

⚠️ CRITICAL — STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing. NO minifig action verbs. NO water-build-technique vocab. NO phenomena. NO lighting. NO marine-creature lists. Just: where are we (and is it SURFACE or SUBMERGED), what kind of moment.

⚠️ EVERYTHING IS LEGO BRICK. Water = trans-blue plates. Coral = brick. Sand = tan plates. NEVER real-ocean vocabulary. BANNED: photoreal, real water/sand/coral/ocean, rippling, flowing, crashing, lapping, crystal-clear.

VARIETY MANDATE (~50% SUBMERGED / ~50% SURFACE), distribute across:
  SUBMERGED — coral-reef plaza / kelp-forest canyon / shipwreck reef / deep-sea trench / mermaid grotto / sunken temple / undersea research dome / blue-hole descent / anemone garden / sea-cave
  SURFACE — tropical beach bonfire / surf shack & break / lighthouse cliff / boardwalk & pier / tide-pool shelf / sandcastle contest / dolphin cove / marina dock / snorkel lagoon / coastal market

Each entry: LEAD with [SURFACE] or [SUBMERGED] tag; name the category in first 6-10 words; establish the brick-built STAGE; suggest the TENSION/charm; NEVER name a minifig action or a phenomenon.`,
    touchpoints: [
      '[SUBMERGED] CORAL-REEF PLAZA — a vibrant brick-built reef shelf rising across the baseplate, branching modified-plant + horn-element coral in pink/orange/purple forming arches and canyons, a trans-blue water-column tinting the whole frame, the teeming-reef stage',
      '[SUBMERGED] KELP-FOREST CANYON — towering green plant-stem kelp columns rising on bar armatures from a tan seafloor, a narrow swim-canyon between them, drifting trans-clear bubble-strings, dim trans-blue deep-water tint, the cathedral-kelp stage',
      '[SUBMERGED] SHIPWRECK REEF — a brick-built sunken vessel canted on the seafloor, hull-plating broken open to reveal cargo, coral reclaiming the rails, a trans-blue water-column overhead, the treasure-hunt-tension stage',
      '[SUBMERGED] DEEP-SEA TRENCH — a steep brick rift descending into trans-dark-blue depths, bioluminescent trans-cyan accents on the walls, a research-light cone probing down, the eerie-abyss stage',
      '[SUBMERGED] SUNKEN TEMPLE — an ancient brick-built colonnade half-buried in tan seafloor plates, gold-element treasure glinting between toppled pillars, a trans-blue water-column above, the lost-civilization stage',
      '[SURFACE] TROPICAL BEACH BONFIRE — a tan-plate cove at dusk with a brick-built driftwood fire (trans-orange flame elements), log-bench builds, palm-tree builds, trans-blue plate shallows lapping the shore-edge held as a static plate-line, the cozy-gathering stage',
      '[SURFACE] SURF SHACK & BREAK — a brick-built beach shack with a surfboard-tile rack and smoothie-bar window, a SNOT-curled trans-light-blue wave-curl with white-stud foam offshore, tan-plate sand, the laid-back-surf stage',
      '[SURFACE] LIGHTHOUSE CLIFF — a tall brick-built spiral lighthouse on a grey slope-brick headland, trans-light-blue wave-curls breaking on the rocks below held as built foam, gull-builds wheeling above, the windswept-coast stage',
      '[SURFACE] TIDE-POOL SHELF — a low rocky shelf of grey slope-bricks pocked with small trans-blue plate pools, brick starfish + anemone + hermit-crab in the pools, tan-plate sand beyond, the discovery-crouch stage',
      '[SURFACE] BOARDWALK & PIER — a brick-plank pier on stilt-builds reaching over trans-blue shallows, vendor-kiosk builds + railing along the deck, a moored brick-rowboat below, the seaside-promenade stage',
      '[SUBMERGED] MERMAID GROTTO — a hidden brick sea-cave with a trans-blue pool, pearl + shell + treasure builds on ledges, glowing trans-cyan accents, a brick-built mermaid tail-flick frozen mid-frame, the secret-haven stage',
      '[SURFACE] DOLPHIN COVE — a sheltered turquoise-plate cove with a brick-built dolphin arcing above the surface held on a clear rod, a low pier and beachgoer minifigs, palm builds framing, the joyful-encounter stage',
    ],
    instructions: `Each entry is ONE aquatic stage, 30-55 words, LED BY a [SURFACE] or [SUBMERGED] tag. Format: "[TAG] STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. ~50/50 surface/submerged. STRICT BANS: no camera framing, no minifig action verbs, no phenomenon names, no lighting, no real-ocean vocabulary (photoreal/real-water/rippling/flowing/crashing/lapping/crystal-clear). Every element a NAMED LEGO BRICK PART. Stage + charm only.`,
  },

  brickbot_aquatic_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for BrickBot's aquatic path. Each entry is a freeze-frame of diver/snorkeler/surfer/beachgoer/Aquanaut/mermaid minifigs IN MID-ACTION, NOT posing. Each entry 25-45 words.

⚠️ STORY BEAT MANDATE — every entry STARTS WITH AN ACTIVE VERB with CAUSE + EFFECT in-frame. Aquatic verbs: mid-dive-descent, mid-snorkel-point, mid-surf-carve, mid-net-haul, mid-bonfire-light, mid-treasure-pry, mid-creature-release, mid-sandcastle-pat, mid-tide-pool-crouch, mid-airlock-flood, mid-photo-snap, mid-kelp-part.

⚠️ HARD BANS: NEVER "minifigs standing/posing", NEVER "watching/looking at/gazing", NEVER passive states. Minifigs are LEGO (C-hands, printed face; scuba-helmet/flippers/wetsuit-print/Aquanaut-airtank/mermaid-tail-build). Creatures brick-built, never photoreal. BANNED: photoreal, real-water, rippling/flowing/crashing.

✓ Body-position variety: mid-dive/descent (~20%), mid-reach/pry/release (~20%), multi-figure interaction (buddy-team, rescue, hand-off) (~25%), mid-surf/swim/kick (~15%), mid-crouch/build on the sand (~10%), mid-pilot/airlock in a sub (~10%).

Each entry: start with an active verb; name 1-3 minifigs/creatures with a brief identifier; the SHARED OBJECT/EVENT (treasure-chest / dive-tether / net / surfboard / sandcastle / released-turtle / airlock-wheel); imply before/after; PLASTIC SCALE.`,
    touchpoints: [
      'Mid-dive-descent of a yellow-black Aquanaut minifig kicking down a trans-blue water-column toward a brick reef, airtank-element on the back, bubble-string trailing from the helmet, a buddy diver above mid-point toward the same target',
      'Mid-treasure-pry as two divers lever open a brick treasure-chest wedged in shipwreck timbers, gold round-plates spilling out, one minifig braced with a crowbar-element, the other C-hands cupped to catch the coins mid-fall',
      'Mid-creature-release of a brick-built sea-turtle by a Friends-beach minifig kneeling at the trans-blue shallows, both C-hands under the turtle as it glides off the plate-edge, a second minifig mid-clap behind',
      'Mid-surf-carve of a wetsuit minifig crouched low on a surfboard-tile riding a SNOT-curled trans-light-blue wave-curl, spray of white round-plates kicking up, a spectator on the beach mid-cheer with arms up',
      'Mid-bonfire-light as a beachgoer minifig touches a torch-element to a brick driftwood pile, trans-orange flame elements catching, two friends on log-benches mid-lean-in, a marshmallow on a stick-element over the flames',
      'Mid-net-haul of a research minifig pulling a brick-built collection-net up from the reef, a captured pufferfish-build inside, a second scientist at a sample-rack mid-reach to receive it, clipboard-tile on the deck',
      'Mid-airlock-flood inside a brick submarine moon-pool bay, a Deep-Sea diver minifig mid-step down into the trans-blue plate pool, a crewmate at the wheel-element sealing the inner hatch, gauge-tiles on the wall',
      'Mid-snorkel-point of a Heartlake minifig at the surface pointing C-hand down toward a brick clownfish-school, mask-and-snorkel printed, a buddy beside them mid-turn to follow the point, palm builds on the shore behind',
      'Mid-sandcastle-pat of two minifigs shaping a brick-built sandcastle on the tan-plate beach, one packing a bucket-mold, the other placing a tiny flag-element on the topmost turret, a beach-ball nearby',
      "Mid-photo-snap of a diver minifig aiming a brick underwater-camera at a brick manta-ray gliding overhead on a clear rod, the manta's wing filling the upper frame, a buddy diver finning into the shot below",
      'Mid-kelp-part as a diver pushes aside green plant-stem kelp to reveal a hidden brick grotto-mouth beyond, C-hand gripping a stalk, a second diver behind mid-swim into the gap, bubble-strings rising',
      'Mid-tide-pool-crouch of a child-scaled minifig (or short-leg minifig) hunched over a trans-blue tide-pool lifting a brick starfish, a bucket-build beside them, a gull-build landing on the rocks nearby mid-flare',
    ],
    instructions: `Each entry is ONE aquatic minifig action beat, 25-45 words. Format: prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: NO standing/posing/watching/looking/gazing, NO passive. No real-water vocabulary (photoreal/rippling/flowing/crashing). Creatures brick-built. Story beat + verb + cause/effect always.`,
  },

  brickbot_aquatic_water_build_technique: {
    format: 'simple',
    theme: `LEGO AQUATIC MOC BUILD TECHNIQUE — the AFOL-distinguishing brick-construction notes for BrickBot's aquatic path, focused on the path's signature challenge: making WATER, WAVES, CORAL, KELP, SAND, and BUBBLES read as unmistakable BRICK. Each entry is ONE specific technique, 25-45 words. THIS AXIS IS THE PRIMARY ANTI-PHOTOREAL-WATER LEVER.

VARIETY MANDATE — distribute across:
  • Trans-blue water-column construction (layered trans-blue + trans-light-blue + trans-clear plates tinting a submerged scene)
  • SNOT wave-curl (sideways-built trans-light-blue slope-curl with white 1×1 round-plate foam crest)
  • Bubble-strings (trans-clear + white 1×1 round-plates threaded on clear bar-rods, rising)
  • Brick coral (modified-plant elements + horn/tooth pieces + 1×4 fence + bright slopes in pink/orange/purple)
  • Kelp / seagrass (stacked green + olive plant-stem elements on hidden bar armatures)
  • Sand / seafloor (tan + dark-tan plates + slopes, ripple-texture from offset jumper-tiles)
  • Caustic-light shimmer (scattered trans-clear + trans-light-blue tiles catching studio light)
  • Brick marine-creature construction (slope-brick bodies, plate fins, printed-eye tiles, modified-element tails)
  • Submarine / dome SNOT curvature (trans-clear viewport domes, hull-plate cladding)
  • Shipwreck weathering (offset broken hull-plating, coral-overgrowth via modified-plant clips)

Each entry: name the technique TYPE in first 5-8 words; specify WHICH aquatic element; name the SPECIFIC BRICK PARTS; imply visual impact. NO real-construction language (no resin/paint/glue/real-water). BANNED: photoreal, real-water/sand/coral.`,
    touchpoints: [
      'Layered trans-blue water-column — a submerged scene tinted by a back-wall and overhead canopy of layered trans-blue + trans-light-blue + trans-clear plates at staggered depths, so every brick element reads as seen THROUGH water, the unmistakable all-brick undersea signal',
      'SNOT wave-curl with foam crest — a breaking wave built sideways with SNOT bracket-plates curling a trans-light-blue slope-stack into a tube, the lip crested with white 1×1 round-plates and white cheese-slopes for foam, frozen mid-break',
      'Clear-rod bubble-strings — rising bubble-trails built from trans-clear + white 1×1 round-plates threaded on thin clear bar-rods at varied heights, anchored to a diver-helmet or the seafloor, the telltale brick-bubble detail',
      'Modified-plant coral garden — a reef built from green/pink/orange modified-plant elements, horn + tooth pieces, 1×4 fence-elements, and bright cheese-slope polyps clustered into branching arches, maximal color + texture density',
      'Plant-stem kelp columns — towering kelp built from stacked green + olive plant-stem and seaweed-elements on hidden Technic-bar armatures, rising in vertical columns with a slight taper, framing a swim-canyon',
      'Tan ripple-texture seafloor — a seafloor built from tan + dark-tan plates with ripple-texture created by offset 1×2 jumper-plates and scattered 1×1 round-plates as pebbles + shell-debris, dune-slopes rising at the edges',
      'Trans-clear caustic shimmer — dappled underwater light suggested by scattered trans-clear + trans-light-blue tiles laid flat across the seafloor + reef tops to catch the studio key-light as bright glints, a built caustic effect',
      'Brick reef-fish school — a fish school built from dozens of small slope + wedge pieces in matched bright colors mounted on clear rods at a uniform drift-angle, printed-eye tiles on the leaders, reading instantly as a brick shoal',
      'Trans-clear submarine viewport dome — a research-sub built with a SNOT-curved hull and a large trans-clear 4×4 dome viewport revealing a brick interior + pilot minifig, hull cladding in white + azure tile with lime trim',
      'Coral-overgrown shipwreck — a sunken hull built with deliberately offset + broken hull-plating, modified-plant coral clipped along the rails and through hull-breaches, barnacle-texture from inverted 1×1 round-plates, the reclaimed-by-the-sea read',
      'Trans-blue stepped shallows — a beach waterline built as stepped trans-blue + trans-light-blue plates descending from the tan sand, white round-plate foam along the static plate-edge, reading as clear tropical shallows without any photoreal water',
      'Brick sea-turtle construction — a sea-turtle built from a domed green slope-brick shell with hexagonal tile-pattern, plate flippers angled mid-stroke, a printed-eye head on a short neck-build, mounted on a clear rod mid-glide',
    ],
    instructions: `Each entry is ONE aquatic MOC build technique, 25-45 words. Format: "TECHNIQUE NAME — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-construction (resin/paint/glue), no real-water/sand/coral/photoreal vocabulary. LEGO bricks only — name SPECIFIC parts (trans-blue plate / SNOT slope-curl / clear bar-rod / modified-plant element / plant-stem).`,
  },

  brickbot_aquatic_camera_framing: {
    format: 'simple',
    theme: `AQUATIC-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the aquatic path. Each entry is ONE camera position + framing rule specific to beach/underwater diorama subject matter. Each entry 15-30 words.

⚠️ Bespoke — leverage aquatic scenery (waterline / reef-wall / kelp / seafloor / surf / lighthouse-cliff / tide-pool / submarine-porthole) rather than generic terms.

VARIETY MANDATE — distribute across: waterline-split (half above/half below), underwater-looking-up at the bright surface, reef-wall tracking, through-the-kelp framing, beach-low-tide wide, lighthouse-cliff aerial, tide-pool macro, submarine-porthole round, dive-descent vertical down-shot, surf-break side-on, boardwalk-pier receding, over-shoulder at a bonfire.

Each entry: specify camera POSITION (height/location/orientation); the framing's PURPOSE (what it dramatizes); reference aquatic brick scenery.`,
    touchpoints: [
      'WATERLINE-SPLIT — camera half-submerged at the trans-blue waterline so the top frame shows the bright beach/sky and the bottom frame shows the submerged reef + divers, the bisecting plate-edge as the horizon',
      'UNDERWATER-LOOKING-UP — camera low on the brick seafloor angled up toward the bright trans-blue surface, divers + marine-life silhouetted against the light above, bubble-strings rising past the lens',
      'REEF-WALL-TRACKING — camera running parallel to a brick reef-wall, coral filling the near frame in sharp detail and receding along the wall into the trans-blue distance, a diver finning along it',
      'THROUGH-THE-KELP — camera framed by foreground green plant-stem kelp columns, the scene revealed in the swim-gap between them, layered depth from near kelp to deep water',
      'BEACH-LOW-TIDE WIDE — camera low and wide across the tan-plate beach at the waterline, an ensemble of beachgoer minifigs at varied positions, palm builds + surf-shack framing the sides',
      'LIGHTHOUSE-CLIFF AERIAL — camera high and back looking down at the brick lighthouse on its headland, trans-light-blue wave-curls breaking on the rocks below, the coastline receding into haze',
      'TIDE-POOL MACRO — camera inches above a trans-blue tide-pool, brick starfish + anemone + hermit-crab tack-sharp in the foreground, a crouching minifig softening behind, the tiny-world intimate angle',
      'SUBMARINE-PORTHOLE — camera framed by a round trans-clear sub viewport, the reef + marine life seen through the porthole glass, brick interior instrument-detail at the frame edge',
      'DIVE-DESCENT VERTICAL — camera looking straight down a trans-blue water-column at a descending diver far below, bubble-strings + a reef-shelf at the bottom of the shaft, severe vertical perspective',
      'SURF-BREAK SIDE-ON — camera at the beach shooting a SNOT-curled wave-curl in side-profile, a surfer minifig in the tube read in clean silhouette, white round-plate foam spraying',
      'OVER-SHOULDER AT THE BONFIRE — camera just behind a seated beachgoer looking past their shoulder at the brick driftwood fire and friends around it, trans-orange flame as the focal glow, dusk beyond',
      'BOARDWALK-PIER RECEDING — camera low at the start of a brick-plank pier looking down its length as it recedes over the trans-blue shallows, vendor-kiosks + railing + figures lining the deck',
    ],
    instructions: `Each entry is ONE aquatic-specific camera framing, 15-30 words. Format: "FRAMING NAME — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no generic camera terms without aquatic anchoring — every entry references brick aquatic scenery (waterline/reef/kelp/seafloor/surf/lighthouse/tide-pool/sub). No real-water vocabulary.`,
  },

  brickbot_aquatic_subject_focus: {
    format: 'simple',
    theme: `AQUATIC SUBJECT-FOCUS / SILHOUETTE ANCHOR — the dominant subject class for an aquatic diorama. Each entry is ONE of four kinds: brick STRUCTURE, CREATURE-MOUNT, NO-VEHICLE INTERIOR, or NO-VEHICLE LANDSCAPE. Each entry 20-40 words. LEAD with the TYPE label in parens.

DISTRIBUTION: ~40% STRUCTURE / ~20% CREATURE-MOUNT / ~15% NO-VEHICLE INTERIOR / ~25% NO-VEHICLE LANDSCAPE.

Every entry names brick parts + bans photoreal/real-water vocabulary. Creatures are brick-built, never photoreal.`,
    touchpoints: [
      'STRUCTURE — a tall brick-built spiral lighthouse on a grey slope-brick headland, trans-yellow lamp-room glowing at the top, a keeper\'s-cottage build at the base, fills 50%+ of frame as the dominant subject',
      'STRUCTURE — a brick research submarine with a SNOT-curved white-and-azure hull, a large trans-clear dome viewport showing a pilot minifig, lime-trim thruster-builds, the dominant foreground silhouette',
      'STRUCTURE — an ancient Atlantis-style brick gate of gold-trimmed pillars and a trans-blue energy-portal, half-buried in tan seafloor, treasure-glint between the columns, the dominant submerged build',
      'STRUCTURE — a brick surf-shack on stilt-builds at the beach edge, surfboard-tile rack, smoothie-bar window, palm builds beside it, the dominant cheerful coastal subject',
      'STRUCTURE — a brick-plank pier reaching over trans-blue shallows on stilt-builds, vendor-kiosks + railing + a moored brick-rowboat, the dominant promenade subject',
      'CREATURE-MOUNT — a brick-built sea-turtle with a hexagon-tiled domed shell and plate flippers mid-stroke, an Aquanaut minifig riding in a clip-saddle on the shell, the dominant gliding subject on a clear rod',
      'CREATURE-MOUNT — a brick-built manta-ray with broad plate-wings angled mid-glide and a printed-eye head, a diver minifig holding the leading edge, the dominant winged silhouette overhead',
      'CREATURE-MOUNT — a brick-built dolphin arcing on a clear rod with a Heartlake minifig riding its back, white-belly + grey-slope body, mid-leap above the trans-blue surface, the joyful dominant subject',
      'CREATURE-MOUNT — a brick-built giant seahorse standing vertical with a curled tail-build and crest-plates, a mermaid minifig holding its mane, a whimsical slow-mount as the dominant subject',
      'NO-VEHICLE INTERIOR — the brick interior of a research submarine cabin, instrument-tile consoles, a periscope-build, trans-clear viewport showing the reef, a pilot minifig at the controls; interior is the stage, the minifig the subject',
      'NO-VEHICLE INTERIOR — a brick lighthouse lamp-room interior, the great trans-clear lens-build at center, gear-element mechanism, a round window on the dark sea, the keeper minifig winding the works',
      'NO-VEHICLE LANDSCAPE — an open brick coral-reef shelf teeming with modified-plant coral arches and swim-canyons, a trans-blue water-column above, multi-tier depth from foreground polyps to deep reef-wall; lush submerged setting',
      'NO-VEHICLE LANDSCAPE — a tan-plate beach cove at the waterline, trans-blue stepped shallows, palm builds + dune-slopes, a SNOT wave-curl offshore, multi-tier from foreground sand to deep-distance headland; the sunny setting',
    ],
    instructions: `Each entry is ONE aquatic subject-focus, 20-40 words, LED BY its TYPE label — (STRUCTURE) / (CREATURE-MOUNT) / (NO-VEHICLE INTERIOR) / (NO-VEHICLE LANDSCAPE). Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. Distribution ~40/20/15/25. Every entry names brick parts; creatures brick-built. BANNED: photoreal/real-water/sand/coral + fluid-motion verbs.`,
  },

  brickbot_aquatic_register: {
    format: 'simple',
    theme: `AQUATIC HERITAGE REGISTER — the aesthetic + faction lock for an aquatic diorama, named by its LEGO marine-heritage VISUAL SIGNATURE. Each entry is ONE register locking palette + minifig gear + build motif. Each entry 20-40 words. A strong LEGO-theme signature pins the whole frame to "brick."

WEIGHTING — ~85% iconic LEGO marine heritage / ~15% retro:
  • ATLANTIS — gold + teal + treasure-amber, deep-sea treasure-quest divers with trident + key accessories, ancient sunken-gate + monster-guardian builds (~18%)
  • AQUAZONE AQUANAUTS — yellow + black + trans-neon-green, classic 90s yellow-black scuba divers with airtank-elements, retro modular sub + sea-lab builds (~18%)
  • AQUASHARKS / HYDRONAUTS — grey + orange (Aquasharks villains) or teal + black (Hydronauts), faction-rivalry sub builds (~12%)
  • DEEP-SEA EXPLORERS — white + azure + lime, modern City research divers + ROVs + dome-labs, scientific gear (~15%)
  • FRIENDS-HEARTLAKE BEACH — pastel turquoise + coral + sand, friendly beachgoer mini-dolls, dolphin-rescue + beach-house + juice-bar builds (~13%)
  • CREATOR NATURAL-BEACH — natural turquoise + ivory-sand + jade-palm, realistic lighthouse + beach-house + lagoon builds (~9%)
  • JULES-VERNE NAUTILUS (retro) — brass + bottle-green + porthole-rivets, Victorian-submarine + organ-room + dive-suit builds, strictly in brick (~8%)
  • COUSTEAU CALYPSO (retro) — vintage red-cap + steel-blue + canary research-vessel, classic aqualung divers + film-camera builds (~7%)

Each entry: name the register signature in first 5-8 words; PALETTE; MINIFIG/gear look; BUILD MOTIF. NEVER name a specific movie/set-number. Always reads as LEGO.`,
    touchpoints: [
      'ATLANTIS TREASURE-QUEST SIGNATURE — gold + teal + treasure-amber palette, deep-sea diver minifigs with trident + treasure-key accessories and gold-trim helmets, ancient sunken-gate + temple + monster-guardian builds with gold-element relics',
      'AQUAZONE AQUANAUTS SIGNATURE — yellow + black + trans-neon-green palette, classic 90s yellow-black scuba minifigs with airtank-elements + clear helmets, retro modular submarine + undersea sea-lab builds with neon-green crystal-element power',
      'AQUASHARKS RIVALRY SIGNATURE — grey + shark-orange palette, marauder-diver minifigs with shark-fin-motif subs, predatory sub silhouettes prowling a contested reef, the Aquazone-villain faction look',
      'DEEP-SEA EXPLORERS SIGNATURE — white + azure + lime palette, modern City research-diver minifigs with sleek scuba gear, white-azure research subs + ROV drones + dome-labs + sonar-tile consoles, scientific register',
      'FRIENDS-HEARTLAKE BEACH SIGNATURE — pastel turquoise + coral + sand palette, friendly beachgoer mini-doll characters in swimwear-prints, dolphin-rescue-center + beach-house + juice-bar + paddleboard builds, sunny-wholesome',
      'CREATOR NATURAL-BEACH SIGNATURE — natural turquoise + ivory-sand + jade-palm palette, casual beachgoer minifigs, realistically-architected lighthouse + beach-house + lagoon-dock builds, grounded and serene',
      'JULES-VERNE NAUTILUS SIGNATURE — brass + bottle-green + porthole-rivet palette, Victorian dive-suit minifigs with brass-helmet builds, an ornate riveted submarine + pipe-organ salon + brass-instrument builds, strictly in brick',
      'COUSTEAU CALYPSO SIGNATURE — vintage red-cap + steel-blue + canary palette, retro aqualung diver minifigs with red watch-caps, a classic research-vessel + film-camera + sample-rack builds, 1960s expedition register',
      'ATLANTIS GUARDIAN-RUIN SIGNATURE — gold + deep-teal + obsidian palette, treasure-diver minifigs facing a brick-built sea-monster guardian (squid / shark-statue), columned sunken-vault builds with gold-key locks',
      'AQUAZONE HYDRONAUTS SIGNATURE — teal + black + trans-clear palette, teal-suited explorer minifigs, sleek crystal-collecting subs + underwater-base builds, the late-90s Aquazone exploration faction',
      'DEEP-SEA SALVAGE SIGNATURE — white + azure + warning-orange palette, salvage-diver minifigs with cutting-torch + winch gear, a wreck-recovery sub + crane-barge + cargo-cage builds, working-expedition register',
      'FRIENDS DOLPHIN-RESCUE SIGNATURE — bright turquoise + coral + white palette, mini-doll marine-vet characters, a sea-rescue-center + pool + stretcher + medical-kit builds caring for a brick dolphin, heartwarming register',
    ],
    instructions: `Each entry is ONE aquatic heritage register, 20-40 words. Format: "REGISTER NAME SIGNATURE — palette + minifig look + build motif". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. Weight ~85% iconic LEGO marine heritage / ~15% retro. STRICT BANS: never a specific movie/set-number; never real-water/photoreal vocabulary; everything reads as LEGO brick.`,
  },

  brickbot_aquatic_marine_life: {
    format: 'simple',
    theme: `BRICK-BUILT MARINE LIFE — the sea creatures that populate an aquatic diorama, EVERY one built from LEGO bricks. Each entry is ONE creature, 15-30 words, naming HOW it is brick-built. This bespoke creature-fill axis adds life, scale, and story to the reef/beach.

VARIETY: sea-turtle / manta-ray / clownfish-school / reef-shark / octopus / seahorse-pair / moon-jellyfish drift / dolphin-pod / starfish-cluster / moray-eel / hermit-crab / pufferfish / gull-flock (surface) / orca / sea-otter / stingray / anglerfish (deep) / crab / lobster / sea-anemone with clownfish.

Each names the SPECIFIC brick construction + a pose/position. NEVER photoreal. BANNED: photoreal, real-fish, rippling/flowing.`,
    touchpoints: [
      'A brick sea-turtle — domed green slope-brick shell with hexagon tile-pattern, plate flippers angled mid-stroke, printed-eye head on a short neck, gliding on a clear rod across the upper frame',
      'A brick manta-ray — broad flat plate-wings in dark-grey + white underside angled mid-glide, a tile-tail trailing, printed-eye cephalic head, suspended on a clear rod overhead casting a built shadow',
      'A brick clownfish-school — a dozen small orange-and-white slope+wedge fish on clear rods at a matched drift-angle weaving around a modified-plant anemone, printed-eye tiles on the leaders',
      'A brick reef-shark — a sleek grey slope-brick body with a plate dorsal fin and tile tail, printed-gill detail, cruising mid-frame on a clear rod with a slight downward menace-tilt',
      'A brick octopus — a domed purple head-build with eight curved tentacle-bar-elements splayed across a coral ledge, printed-eye tiles, one tentacle reaching toward a shell',
      'A brick seahorse-pair — two upright seahorses with curled tail-builds and crest-plates in yellow + coral, tails linked around a single green plant-stem, mid-bob',
      'A brick moon-jellyfish drift — three translucent trans-clear + trans-light-blue dome bells with trailing bar-rod tentacles, suspended at staggered heights drifting up the trans-blue column',
      'A brick dolphin-pod — three grey-slope dolphins with white bellies arcing on clear rods at the trans-blue surface, mid-leap in a staggered line, the lead one highest',
      'A brick pufferfish — a round studded sphere-build in tan + cream bristling with tooth/cone-element spines, tiny plate fins, printed-eye tiles, hovering puffed mid-frame',
      'A brick moray-eel — a green segmented body of stacked round-bricks emerging from a coral-hole, jaw-element open, printed-eye, the rest of the body hidden in the reef',
      'A brick gull-flock (surface) — four white-and-grey gull-builds with angled plate-wings on clear rods wheeling above the surf, one mid-dive toward the waterline',
      'A brick hermit-crab — a small crab-build tucked into a SNOT-spiral shell of curved slopes, claw-elements raised, scuttling across the tan-plate seafloor',
    ],
    instructions: `Each entry is ONE brick-built marine creature, 15-30 words. Format: prose naming the creature + its brick construction + pose/position. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: never photoreal/real-fish; LEGO bricks only; name the construction (slope-brick body / plate fins / printed-eye tiles / clear rod). Surface creatures (gulls) clearly above water; sea creatures suspended on rods underwater.`,
  },

  brickbot_aquatic_scene_props: {
    format: 'simple',
    theme: `AQUATIC DIORAMA STORYTELLING PROPS — small brick-built details that fill an aquatic diorama's negative space. Each entry is ONE prop, 12-25 words, implying a backstory. NEVER decorative-only.

VARIETY: brick treasure-chest spilling gold round-plates / message-in-a-bottle / rusted anchor / scuba-tank + regulator / surfboard rack / sandcastle with flag / beach-umbrella + towel-tile / coral-frond cluster / shipwreck-rib / mooring buoy / tide-pool starfish / ship's-wheel from a wreck / pearl-in-an-open-clam / dive-flag on a float / picnic cooler / beach bucket-and-spade / lobster-trap / sea-chart on a table.

Each names SPECIFIC brick parts. BANNED: photoreal/real-water + fluid-motion verbs.`,
    touchpoints: [
      'A brick treasure-chest wedged in the seafloor — brown brick body sprung open, gold 1×1 round-plates spilling across the tan plates, implying a fresh discovery',
      'A message-in-a-bottle — a trans-clear bottle-element with a rolled printed-tile note inside, half-buried in the tan-plate sand at the waterline',
      'A rusted anchor — a brick-built anchor in reddish-brown with a chain of clip-links, fouled in coral on the reef floor, from a long-lost ship',
      'A scuba-tank + regulator — a pair of trans-and-grey tank-elements with a hose-build and gauge-tile, propped against a rock ready for the next dive',
      'A sandcastle with a flag — a brick-built bucket-mold castle on the tan beach with a tiny flag-element on the top turret, a spade leaning beside it',
      'A coral-frond cluster — a bright pink + orange modified-plant coral cluster on a rock-ledge, a clownfish-build sheltering among the fronds',
      'A mooring buoy — a red-and-white round buoy-build bobbing at a static trans-blue plate-edge, a chain dropping into the shallows below',
      "A ship's-wheel from a wreck — a brown brick-built wheel half-buried in seafloor sand, spokes broken, a small crab-build perched on the rim",
      'A pearl in an open clam — a brick clam-shell of two curved-slope halves sprung open on the reef, a single white pearl-element glinting inside',
      'A beach-umbrella + towel — a bright striped umbrella-build canted in the tan sand with a printed towel-tile and a juice-cup beside it',
      'A lobster-trap — a brick-built slatted trap-cage on the seafloor with a brick lobster inside reaching a claw-element through the bars',
      'A dive-flag on a float — a red-and-white dive-flag tile on a brick float bobbing at the static trans-blue surface, a tether dropping to a diver below',
    ],
    instructions: `Each entry is ONE aquatic brick-built prop, 12-25 words. Format: prose naming the prop + its brick parts + implied backstory. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-water/photoreal; LEGO bricks only; each prop implies a story, never decorative-only.`,
  },

  brickbot_aquatic_lighting: {
    format: 'simple',
    theme: `AQUATIC LIGHTING — light source + direction + color for an aquatic LEGO MOC photo. Each entry 15-30 words. Lights a TABLETOP BRICK DIORAMA — realistic studio-macro shadows on plastic, evoking the aquatic mood.

VARIETY: underwater caustic-blue dapple from above / bright surface-shimmer shafts piercing down through the column / golden beach-sunset rake / bonfire-amber pool / sweeping lighthouse-beam / bioluminescent trans-cyan deep-glow / bright tropical-noon / cool deep-trench blue with a single research-lamp cone / dawn-pink low-tide / overcast-soft coastal.

Each names SOURCE + DIRECTION + COLOR + how it falls on the plastic bricks. NEVER real-sun-through-real-water language.`,
    touchpoints: [
      'Caustic-blue dapple from directly above, broken pools of cool light scattered across the brick reef and seafloor with trans-clear tiles catching bright glints, deep blue shadow between — the classic submerged key',
      'Bright surface-shimmer shafts piercing straight down through the trans-blue water-column, hard light-pillars striking the reef with cool shadow behind, divers silhouetted where the shafts hit',
      'Golden beach-sunset raking low across the tan-plate sand, long warm light gilding the palm builds and surf-shack, long plastic shadows stretching toward camera, warm amber key',
      'Bonfire-amber pooling out from a brick driftwood fire, hot trans-orange glow on the seated minifigs and the sand, deep cool dusk-blue beyond the lit ring',
      'A sweeping lighthouse-beam cutting from the trans-yellow lamp-room out across a dark sea, a hard cone of warm light through cool night-blue ambient, raking the wave-curls below',
      'Bioluminescent trans-cyan deep-glow rising from clustered glow-elements in a dark trench, under-lighting the brick walls and a diver in cool aquamarine, near-black ambient around it',
      'Bright tropical-noon, a strong high key making the turquoise shallows and coral pop in saturated color, crisp short plastic shadows, the cheerful postcard-beach light',
      'Cool deep-trench blue ambient with a single warm research-lamp cone from a sub probing one direction, most of the frame in deep cold shadow, the lamp-cone the only warm light',
      'Dawn-pink low-tide light, soft rosy ambient across wet tan-plate flats and tide-pools catching the sky-color, gentle and quiet, long soft shadows',
      'Overcast-soft coastal light, a gentle even wash showing every brick detail of the harbor + pier without harsh shadow, the calm grey-day maritime mood',
    ],
    instructions: `Each entry is ONE aquatic lighting setup, 15-30 words. Format: prose naming source + direction + color + fall on the bricks. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-sun-through-real-water/photoreal-caustic language — it lights a plastic brick diorama. No real-ocean vocabulary.`,
  },

  brickbot_aquatic_palette: {
    format: 'simple',
    theme: `AQUATIC PALETTE — color combinations for an aquatic LEGO MOC diorama, locked to LEGO marine-heritage signatures. Each entry 12-25 words, naming 3-5 specific LEGO-brick colors + the heritage it evokes.

VARIETY (align to registers): Atlantis gold+teal+treasure-amber / Aquazone yellow+black+trans-neon-green / Aquasharks grey+orange / Deep-Sea white+azure+lime / tropical-beach turquoise+coral+ivory-sand / sunset gold+magenta+violet / kelp-canyon deep-teal+green+amber / Nautilus brass+bottle-green / Cousteau red+steel-blue+canary / deep-trench midnight-blue+trans-cyan.

Each names ACTUAL LEGO brick colors (dark-azure, sand-green, trans-light-blue, etc.).`,
    touchpoints: [
      'Atlantis treasure palette — gold + teal + treasure-amber + deep-blue, rich and adventurous, gold-element relics glinting against teal stone',
      'Aquazone Aquanauts palette — bright yellow + black + trans-neon-green, bold retro-90s contrast, neon-green crystal-power accents',
      'Aquasharks palette — steel-grey + shark-orange + black, aggressive and predatory, the Aquazone-villain color story',
      'Deep-Sea Explorers palette — clean white + dark-azure + lime, modern and scientific, the City research-fleet look',
      'Tropical-beach palette — turquoise + coral-pink + ivory-sand + jade-palm, sunny and saturated, the postcard-paradise story',
      'Sunset-cove palette — gold + magenta + violet + warm-sand, dusk over the water, the golden-hour beach mood',
      'Kelp-canyon palette — deep-teal + forest-green + amber-shaft, dim and cathedral-like, the towering-kelp depth',
      'Nautilus palette — brass + bottle-green + dark-steel, Victorian-submarine richness, riveted and ornate',
      'Cousteau-expedition palette — vintage-red + steel-blue + canary-yellow, 1960s research-vessel charm',
      'Deep-trench palette — midnight-blue + trans-cyan + obsidian, near-black with bioluminescent glints, the abyssal mood',
    ],
    instructions: `Each entry is ONE aquatic palette, 12-25 words. Format: "NAME palette — colors + mood". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: name ACTUAL LEGO brick colors; no photoreal-color language; tie each to a marine heritage. No real-ocean vocabulary.`,
  },

  brickbot_aquatic_phenomenon: {
    format: 'simple',
    theme: `AQUATIC PHENOMENON — a 50%-gated environmental beat for an aquatic diorama, ALWAYS rendered IN BRICK. Each entry 20-40 words. AMPLIFIES the scene as a secondary focal point, never eclipses it.

VARIETY: rising bubble-stream column / sun-shaft caustic light-pillars / breaking trans-blue wave-curl with white foam / bioluminescent-bloom trans-cyan cloud / passing whale-shadow overhead / swirling clownfish bait-ball / king-tide flooding the tide-pools / message-bottle bobbing in on the surf / a school of brick-fish parting around the diver / sea-fog rolling over the cove (cotton elements).

Each names the BRICK PARTS that build it + visual impact. NEVER lighting-color-cast (separate axis). NEVER real-water/photoreal language. NO fluid-motion verbs (render as static built moment).`,
    touchpoints: [
      'RISING BUBBLE-STREAM COLUMN — a tall column of trans-clear + white 1×1 round-plates threaded on clear bar-rods rising from a seafloor vent or a diver-helmet, a built shimmering pillar threading the frame',
      'SUN-SHAFT CAUSTIC PILLARS — several angled pillars of trans-clear + trans-light-blue plates striking down through the water-column from the surface, built light-shafts catching the reef in bright bars',
      'BREAKING WAVE-CURL — a single large SNOT-curled trans-light-blue wave frozen mid-break offshore, white 1×1 round-plate + cheese-slope foam crest spilling down the face, a built frozen moment',
      'BIOLUMINESCENT BLOOM — a drifting cloud of trans-cyan + trans-clear 1×1 round-plates clustered through a dark trench, a built glowing-plankton swarm lighting the diver from below',
      'PASSING WHALE-SHADOW — an enormous built whale silhouette (dark-grey plates) gliding across the upper frame on hidden supports, dwarfing the divers, casting a built shadow over the reef',
      'CLOWNFISH BAIT-BALL — a dense spherical swirl of dozens of small orange-and-white fish-builds on clear rods forming a rotating ball, parting around a central diver, the mesmerizing built shoal',
      'KING-TIDE FLOODING THE TIDE-POOLS — extra stepped trans-blue plates layered over the rocky shelf showing the tide risen high, small creatures crowded into the new pools, the built high-water moment',
      'SEA-FOG OVER THE COVE — low white cotton-elements + 1×1 white round-plate haze rolling across the tan-plate beach and the static trans-blue shallows, softening the lighthouse base, the moody built fog',
      'WHALE-SHARK PASS — a huge built whale-shark (spotted dark-blue plate body) cruising slowly across the deep frame on hidden supports, remora-builds clinging to its underside, the gentle-giant beat',
      'STINGRAY GLIDE-SQUADRON — a loose formation of three or four built stingrays sweeping across the sandy flat on clear rods at a matched glide-angle, kicking up tiny tan round-plate sand-puffs',
    ],
    instructions: `Each entry is ONE aquatic phenomenon, 20-40 words. Format: "PHENOMENON NAME — brick-parts + visual impact". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: never lighting-color-cast (separate axis); never real-water/photoreal language; ALWAYS built from named brick parts; never fluid-motion verbs (render as a static built moment).`,
  },

  // ════════════════════════════════════════════════════════
  // WINTER PATH (2026-05-27 — sixth BrickBot axis migration)
  // SNOW + ICE. Bespoke snow_ice_build_technique axis (anti-photoreal-
  // snow lever). Every entry names LEGO PARTS, BANS photoreal-snow/ice +
  // non-rigid motion verbs (drifting/swirling/billowing). Bespoke.
  // ════════════════════════════════════════════════════════

  brickbot_winter_scene_type: {
    format: 'simple',
    theme: `LEGO MOC WINTER DIORAMA SCENE STAGES — narrative-stage descriptions for BrickBot's winter axis system. Each entry is ONE snow/ice stage, 30-55 words. Mood ranges cozy-festive (Winter Village) to crisp-adventurous (Arctic expedition).

⚠️ CRITICAL — STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing. NO minifig action verbs. NO snow/ice-build-technique vocab. NO phenomena. NO lighting. Just: where are we, what wintry moment.

⚠️ EVERYTHING IS LEGO BRICK. Snow = white slope-bricks/plates. Ice = trans-light-blue. Frozen lake = smooth tiles. NEVER real-snow vocabulary. BANNED: photoreal, real snow/ice, soft powder, glistening, sparkling, drifting, swirling.

VARIETY MANDATE — distribute across: alpine-ski-village / frozen-lake / ice-castle / igloo-camp / polar-research-station / frozen-waterfall / blizzard-rescue / winter-village-square / ski-slope / ice-fishing-hut / hot-cocoa-cabin-interior / husky-sled-run / frozen-harbor / ice-rink / snowman-meadow / mountain-gondola / holiday-market / toy-workshop.

Each entry: name the winter category in first 6-10 words; establish the brick-built STAGE (white-plate snow-cover everywhere); suggest the cozy/adventurous TENSION; NEVER a minifig action or phenomenon.`,
    touchpoints: [
      'ALPINE SKI-VILLAGE — a brick-built mountain village of timber chalets with white slope-brick snow-laden roofs, a gondola-tower, a frozen-tile pond with ice-fishing huts, white-plate drifts banking every wall, the cozy-resort stage',
      'ICE-CASTLE FORTRESS — a soaring SNOT-curved trans-light-blue + trans-clear ice castle with crisp brick-edge turrets, a frozen-tile moat, white-plate snow on the battlements, the crystalline-palace stage',
      'POLAR RESEARCH STATION — orange-and-white modular brick research buildings on a white-plate ice shelf, a snowcat build, satellite-dish builds, supply-crate stacks, the crisp-expedition stage',
      'IGLOO ENCAMPMENT — a cluster of white brick-dome igloos on a white-plate snowfield, a husky-team on a tether-build, brick-kayaks and fishing-gear, the frontier-camp stage',
      'FROZEN-WATERFALL CLIFF — a grey slope-brick cliff face hung with cascading trans-light-blue + trans-clear icicle-elements frozen mid-fall, snow-load pine builds at the base, the dramatic-ice stage',
      'WINTER-VILLAGE SQUARE — a festive brick town square of red-and-green timber shops with white-plate snow-roofs, a brick holiday-tree strung with trans-element lights, a market-stall ring, the warm-holiday stage',
      'HOT-COCOA CABIN INTERIOR — the warm brick interior of a log cabin, a brick hearth with trans-orange flame, mug-builds on a table, snow-frosted brick window looking out on white peaks, the snug-fireside stage',
      'HUSKY-SLED RUN — a white-plate snow-trail winding through snow-load pine builds, a brick dog-sled with a husky-team mid-route, drift-banks on either side, the wilderness-journey stage',
      'ICE-FISHING HUT — a small brick hut on a smooth trans-light-blue frozen lake, an auger-build and a fishing-hole, a lantern-build, white-plate snow scattered on the ice, the patient-quiet stage',
      'MOUNTAIN GONDOLA — a brick gondola-cabin on a Technic-cable strung between snow-capped slope-brick peaks, a station-build below with white-plate drifts, the high-alpine stage',
      'BLIZZARD-RESCUE — a wind-swept white-plate slope with a half-built emergency brick-shelter, a search-team with lantern-builds, an overturned brick-snowmobile, supply-sled, the urgent-survival stage',
      'FROZEN-HARBOR — a brick harbor locked in smooth trans-light-blue ice, a brick icebreaker wedged at the quay, snow-load roofs on the dock-warehouses, the still-cold-port stage',
    ],
    instructions: `Each entry is ONE winter stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no camera framing, no minifig action verbs, no phenomenon names, no lighting, no real-snow vocabulary (photoreal/real-snow-ice/soft-powder/glistening/sparkling/drifting/swirling). Every element a NAMED LEGO BRICK PART. Stage + charm only.`,
  },

  brickbot_winter_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for BrickBot's winter path. Each entry is a freeze-frame of skier/villager/Arctic-explorer/sledder minifigs IN MID-ACTION, NOT posing. Each entry 25-45 words.

⚠️ STORY BEAT MANDATE — every entry STARTS WITH AN ACTIVE VERB with CAUSE + EFFECT in-frame. Winter verbs: mid-ski-carve, mid-snowball-throw, mid-cocoa-pour, mid-sled-mush, mid-ice-fish-haul, mid-snowman-roll, mid-rescue-dig, mid-skate-glide, mid-icicle-knock, mid-fire-stoke, mid-gondola-board, mid-gift-stack.

⚠️ HARD BANS: NEVER "minifigs standing/posing", NEVER "watching/looking/gazing", NEVER passive states. Minifigs are LEGO (C-hands, printed face; knit-cap+scarf / parka-hood / goggles+poles / fur Arctic-hood). Creatures brick-built. BANNED: photoreal, real-snow, drifting/swirling/billowing.

✓ Body-position variety: mid-ski/skate/glide (~20%), mid-throw/roll/pat (~15%), mid-haul/dig/stoke (~15%), multi-figure interaction (rescue-team, cocoa-share, snowman-build) (~25%), mid-board/mush/ride (~15%), mid-craft/decorate (~10%).

Each entry: start with an active verb; name 1-3 minifigs/creatures with a brief identifier; the SHARED OBJECT/EVENT (sled / snowball / cocoa-pot / ice-hole / snowman / rescue-rope / gift); imply before/after; PLASTIC SCALE.`,
    touchpoints: [
      'Mid-ski-carve of a goggled skier minifig crouched low on brick-built skis spraying white 1×1 round-plate snow off the slope-edge, ski-poles angled back, a second skier mid-turn behind on the white-plate piste',
      'Mid-snowball-throw between two bundled minifigs across a white-plate village square, one mid-hurl with arm cocked and a brick-snowball mid-air, the other mid-duck behind a white-slope drift-fort',
      'Mid-cocoa-pour as a cabin minifig tilts a brick kettle over two mug-builds on a snow-frosted windowsill, steam suggested by a white 1×1 round-plate wisp, a friend on a bench mid-reach for a mug',
      'Mid-sled-mush of a parka minifig braced on a brick dog-sled behind a husky-team mid-stride down a white-plate trail, one C-hand gripping the handle-bar, snow-spray plates kicking from the runners',
      'Mid-ice-fish-haul of an Arctic minifig yanking a brick fish up through a hole in the smooth trans-light-blue lake, line taut, a thermos-build and auger beside them, a buddy mid-lean-in to see the catch',
      'Mid-snowman-roll of two minifigs pushing a giant white-brick snowball across the meadow toward a half-built snowman, a carrot-element nose and coal-tile eyes laid ready on a sled nearby',
      'Mid-rescue-dig of a search-team minifig shoveling a brick-shovel into a white-plate drift over a half-buried shelter, a second rescuer mid-shine of a lantern-build, a supply-sled behind on the windswept slope',
      'Mid-skate-glide of a Friends mini-doll skater carving across the smooth trans-light-blue rink on brick skates, arms out mid-balance, a friend mid-wobble nearby reaching for the brick rail',
      'Mid-fire-stoke as a villager minifig pokes a brick-poker into a hearth of trans-orange flame elements inside a cozy cabin, sparks suggested by trans-yellow round-plates, a kettle-build hung above',
      'Mid-gift-stack of two Winter-Village minifigs piling wrapped brick-gifts under a brick holiday-tree strung with trans-element lights, one mid-reach to set the top box, a holiday-train build circling the base',
      'Mid-gondola-board of a skier minifig stepping into a brick gondola-cabin at a snowy station, ski-pair over one shoulder, an operator minifig mid-lever-pull on the Technic-cable mechanism',
      'Mid-icicle-knock of an Arctic minifig tapping a long trans-clear icicle-element off a cabin eave with a pole, the icicle mid-fall, a companion below mid-step-back from the drop',
    ],
    instructions: `Each entry is ONE winter minifig action beat, 25-45 words. Format: prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: NO standing/posing/watching/looking/gazing, NO passive. No real-snow vocabulary (photoreal/drifting/swirling). Creatures brick-built. Story beat + verb + cause/effect always.`,
  },

  brickbot_winter_snow_ice_build_technique: {
    format: 'simple',
    theme: `LEGO WINTER MOC BUILD TECHNIQUE — the AFOL-distinguishing brick-construction notes for BrickBot's winter path, focused on making SNOW, ICE, FROZEN WATER, ICICLES, and BLIZZARD read as unmistakable BRICK. Each entry 25-45 words. THIS AXIS IS THE PRIMARY ANTI-PHOTOREAL-SNOW LEVER.

VARIETY MANDATE — distribute across:
  • Snow-cover technique (white slope-bricks + plates + white-stud rounded mounds capping every roof/branch/ledge)
  • Snow-drift technique (white slope-brick banks rising against walls, wind-sculpted with curved slopes)
  • Ice-structure SNOT (trans-light-blue + trans-clear curved-slope ice-castle walls + turrets with crisp brick-edges)
  • Frozen-lake technique (smooth trans-light-blue + white TILE sheet — tiled = smooth ice, with hairline trans-blue crack lines)
  • Icicle technique (trans-clear + trans-light-blue bar/cone elements hung in graduated rows from eaves)
  • Snow-load pine technique (brown round-brick trunk + dark-green plant-element boughs + white-plate snow-load on each tier)
  • Blizzard / falling-snow (white 1×1 round-plates on clear bar-rods + cotton-elements for a built flurry)
  • Frozen-waterfall (layered trans-light-blue + trans-clear plates + bar-elements cascading down a grey slope-brick cliff, frozen mid-fall)
  • Cozy window-glow (trans-orange + trans-yellow behind brick window-frame mullions against the cold blue exterior)
  • Igloo dome SNOT (white curved-slope + brick-block dome with a stepped entry-tunnel)

Each entry: name the technique TYPE in first 5-8 words; specify WHICH winter element; name the SPECIFIC BRICK PARTS; imply visual impact. NO real-construction (no foam/paint/cotton-as-real-snow-claim). BANNED: photoreal, real-snow/ice.`,
    touchpoints: [
      'White-slope snow-cover — every roof, ledge, and branch capped with white slope-bricks + white plates + white-stud rounded caps, the snow built as deliberate brick geometry that follows the structure beneath, never a soft photoreal blanket',
      'Wind-sculpted snow-drift — drift-banks built from white slope-bricks rising against a cabin wall in a curved wind-carved profile, the curve formed by stacked inverted + standard slopes, a crisp brick snow-sculpture',
      'SNOT trans-blue ice-castle wall — an ice-fortress wall built with sideways-stud bracket-plates turning trans-light-blue + trans-clear curved-slope bricks into a glassy translucent rampart, crisp brick-edge crenellations on top',
      'Smooth-tile frozen-lake — a frozen lake surfaced entirely with smooth trans-light-blue + white tiles (no studs = polished ice), a few hairline trans-clear crack-lines inlaid, skate-scuff suggested by lighter tile insets',
      'Graduated icicle row — a row of icicles hung from an eave built from trans-clear + trans-light-blue bar-elements + cone-elements in graduated lengths, clipped to a bar mounted under the roof-edge',
      'Snow-load pine — a pine tree built from a brown round-brick trunk with dark-green plant-element + slope-brick boughs in tiers, each tier weighted with white-plate + white-slope snow-load bending the branch-line',
      'Clear-rod blizzard flurry — falling snow built from scattered white 1×1 round-plates threaded on thin clear bar-rods at varied heights + angles, with cotton-elements massed at the frame-edges for a built whiteout veil',
      'Frozen-waterfall cascade — a waterfall frozen mid-fall built from layered trans-light-blue + trans-clear plates and bar-elements stepping down a grey slope-brick cliff, white round-plate frozen-spray at each ledge',
      'Cozy window-glow — warm interior light built from trans-orange + trans-yellow plates set behind brick window-frame mullions, glowing against the cool white-and-blue snow exterior, the heart of a Winter-Village build',
      'White-dome igloo SNOT — an igloo built from white curved-slope + masonry-profile brick blocks spiralling into a dome, a stepped entry-tunnel of arch-pieces, faint trans-light-blue tile insets suggesting packed ice-blocks',
      'Packed-snow rounded mound — a smooth snow-mound built from stacked white inverted-dome + dish elements blended with slopes, used for snowman bases and drift-pillows, fully rounded brick geometry',
      'Snow-cat tread + icebreaker hull — Arctic vehicles built with Technic-tread links (snowcat) or a SNOT-reinforced prow of stacked slopes (icebreaker) in orange + white + black, weathered with grey-tile scuff detail',
    ],
    instructions: `Each entry is ONE winter MOC build technique, 25-45 words. Format: "TECHNIQUE NAME — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-construction (foam/paint/real-cotton-snow), no real-snow/ice/photoreal vocabulary. LEGO bricks only — name SPECIFIC parts (white slope-brick / trans-light-blue tile / trans-clear bar-element / inverted-dome).`,
  },

  brickbot_winter_camera_framing: {
    format: 'simple',
    theme: `WINTER-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the winter path. Each entry 15-30 words, specific to snow/ice diorama subject matter.

⚠️ Bespoke — leverage winter scenery (ski-slope / frozen-lake / village-square / cabin-window / icicle-cave / sled-trail / summit / gondola) rather than generic terms.

VARIETY MANDATE — distribute across: ski-slope downhill, frozen-lake low-across-the-ice, village-square overhead, cabin-window warm-interior-out-to-cold, icicle-cave through, sled-trail tracking, summit aerial, gondola POV, ice-rink low-glide, hearth-side over-shoulder, blizzard-whiteout into-the-wind.

Each entry: specify camera POSITION (height/location/orientation); the framing's PURPOSE; reference winter brick scenery.`,
    touchpoints: [
      'SKI-SLOPE DOWNHILL — camera high on the piste looking down the white-plate slope, a skier minifig carving in the mid-frame spraying snow-plates, the village + frozen lake far below at the slope-foot',
      'FROZEN-LAKE LOW-ACROSS-THE-ICE — camera at ice-level shooting across the smooth trans-light-blue lake, ice-fishing huts in profile receding, the reflection suggested in the glossy tile, a low crisp angle',
      'VILLAGE-SQUARE OVERHEAD — camera high above the brick winter village looking down at the square, snow-roofed shops + the holiday-tree + market-stalls forming the composition, minifig crowd from above',
      'CABIN-WINDOW WARM-OUT-TO-COLD — camera inside a cozy cabin framing the trans-orange hearth-glow foreground and a snow-frosted brick window beyond, the cold white-blue exterior visible through the panes',
      'ICICLE-CAVE THROUGH — camera behind a fringe of foreground trans-clear icicle-elements hanging from a cave-mouth, the snowy scene revealed in the gap, layered depth from icicles to deep peaks',
      'SLED-TRAIL TRACKING — camera low alongside a husky-sled mid-run on the white-plate trail, the team + sled in dynamic profile, snow-load pine builds streaming past, the journey angle',
      'SUMMIT AERIAL — camera high and back over a snow-capped slope-brick peak looking down at the gondola-station + ski-runs below, the alpine expanse receding into white haze',
      'GONDOLA POV — camera inside a brick gondola-cabin looking out the window-frame at the snowy valley passing below, the Technic-cable rising to the next tower, cabin-interior detail at the edge',
      'ICE-RINK LOW-GLIDE — camera at rink-level skimming the smooth trans-light-blue ice, a skater carving toward camera, the warm-lit chalet + string-lights framing the background',
      'HEARTH-SIDE OVER-SHOULDER — camera just behind a seated cabin minifig looking past their shoulder at the brick hearth-fire and friends gathered with cocoa-mugs, the trans-orange glow the focal warmth',
      'BLIZZARD-WHITEOUT INTO-THE-WIND — camera low facing into a built cotton-element + white-round-plate flurry, a rescue-team minifig leaning into the wind in silhouette, depth swallowed by the white veil',
      'WINTER-VILLAGE STREET-LEVEL — camera down at minifig height on a snow-plate street between festive brick shops, string-lights overhead, a villager mid-stride past a lit bakery window, immersive depth',
    ],
    instructions: `Each entry is ONE winter-specific camera framing, 15-30 words. Format: "FRAMING NAME — body". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no generic camera terms without winter anchoring — every entry references brick winter scenery. No real-snow vocabulary.`,
  },

  brickbot_winter_subject_focus: {
    format: 'simple',
    theme: `WINTER SUBJECT-FOCUS / SILHOUETTE ANCHOR — the dominant subject class for a winter diorama. Each entry is ONE of four kinds: brick STRUCTURE, CREATURE-MOUNT, NO-VEHICLE INTERIOR, or NO-VEHICLE LANDSCAPE. Each entry 20-40 words. LEAD with the TYPE label in parens.

DISTRIBUTION: ~45% STRUCTURE / ~15% CREATURE-MOUNT / ~15% NO-VEHICLE INTERIOR / ~25% NO-VEHICLE LANDSCAPE.

Every entry names brick parts + bans photoreal/real-snow vocabulary. Creatures brick-built, never photoreal.`,
    touchpoints: [
      'STRUCTURE — a brick timber ski-chalet with a white slope-brick snow-roof, glowing trans-orange windows, a wraparound deck with ski-racks, white-plate drifts banking the walls; fills 50%+ of frame',
      'STRUCTURE — a SNOT-curved trans-light-blue + trans-clear ice castle with crisp brick-edge turrets and a frozen-tile moat, white-plate snow on the battlements, the dominant crystalline subject',
      'STRUCTURE — a white brick-dome igloo with a stepped arch-piece entry-tunnel, faint trans-blue ice-block tile insets, a lantern-build at the door, the dominant frontier-shelter subject',
      'STRUCTURE — an orange-and-white modular polar research station on a white-plate ice shelf, dish-builds + a snowcat, the dominant crisp-tech subject',
      'STRUCTURE — a festive Winter-Village shop (toy-store / bakery) in red-and-green timber with a white snow-roof, glowing windows, a string-light eave, the dominant cozy-holiday subject',
      'STRUCTURE — a brick mountain-gondola tower with a cabin on a Technic-cable, snow-capped slope-brick peak behind, a station-build below, the dominant alpine-engineering subject',
      'CREATURE-MOUNT — a brick husky-sled team of three white-and-grey brick dogs on a tether-build pulling a brick sled with a parka minifig driver, the dominant dynamic subject mid-run',
      'CREATURE-MOUNT — a brick-built reindeer with antler-elements and a harness, a Winter-Village minifig riding or leading it, the dominant festive subject on a snow-plate trail',
      'CREATURE-MOUNT — a chunky brick-built polar bear with white-slope body and printed-eye head, an Arctic minifig beside or atop it, the dominant frontier subject',
      'NO-VEHICLE INTERIOR — a hot-cocoa cabin interior, a brick hearth with trans-orange flame, mug-builds + a kettle, a woven-tile rug, a snow-frosted window; interior is the stage, minifig the subject',
      'NO-VEHICLE INTERIOR — a ski-lodge fireside great-room, a stone brick fireplace, ski-racks, a fur-tile sofa, a chalkboard trail-map, minifigs warming up; cozy après-ski setting',
      'NO-VEHICLE LANDSCAPE — an open powder-slope of white slope-bricks and plates studded with snow-load pine builds, deep-distance snow-capped slope-brick peaks; multi-tier lush winter setting',
      'NO-VEHICLE LANDSCAPE — a frozen lake of smooth trans-light-blue tile ringed by snow-pine builds, a small ice-fishing hut, white peaks beyond; multi-tier serene winter setting',
    ],
    instructions: `Each entry is ONE winter subject-focus, 20-40 words, LED BY its TYPE label — (STRUCTURE) / (CREATURE-MOUNT) / (NO-VEHICLE INTERIOR) / (NO-VEHICLE LANDSCAPE). Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. Distribution ~45/15/15/25. Every entry names brick parts; creatures brick-built. BANNED: photoreal/real-snow/ice + non-rigid motion verbs.`,
  },

  brickbot_winter_register: {
    format: 'simple',
    theme: `WINTER HERITAGE REGISTER — the aesthetic + faction lock for a winter diorama, named by its LEGO-heritage VISUAL SIGNATURE. Each entry 20-40 words, locking palette + minifig gear + build motif.

WEIGHTING — ~85% iconic LEGO winter heritage / ~15% retro:
  • WINTER-VILLAGE (Ideas holiday) — cozy red + green + white + gold, knit-cap-and-scarf villager minifigs, festive timber shops + holiday-train + string-lights + tree (~22%)
  • CITY-ARCTIC-EXPLORERS — orange + white + black + tech-grey, parka-and-goggle explorer minifigs, icebreakers + snowcats + ice-saws + research-stations (~20%)
  • FRIENDS-WINTER-RESORT — pastel-blue + pink + white, mini-doll skier characters, cute ski-chalet + ice-rink + hot-cocoa-stand + gondola (~16%)
  • CREATOR-NATURAL-CABIN — natural log-brown + pine-green + snow-white, casual minifigs, realistic timber cabin + woodpile + frozen-pond (~14%)
  • CLASSIC-ALPINE — muted blue + white + chalet-brown, traditional skier + mountaineer minifigs, simple chalet + ski-lift + snowy-peak builds (~13%)
  • CURRIER-AND-IVES-CODED (retro) — soft cranberry + cream + evergreen, Victorian bundled-skater + sleigh minifigs, covered-bridge + frozen-millpond + horse-sleigh builds, strictly in brick (~8%)
  • VINTAGE-ALPINE-POSTER-CODED (retro) — bold travel-poster red + cream + sky-blue, retro-ski-fashion minifigs, funicular + grand-lodge + 1950s-ski-resort builds, strictly in brick (~7%)

Each entry: name the register signature in first 5-8 words; PALETTE; MINIFIG/gear look; BUILD MOTIF. NEVER name a specific movie/set-number. Always reads as LEGO.`,
    touchpoints: [
      'WINTER-VILLAGE HOLIDAY SIGNATURE — cozy red + green + white + gold palette, knit-cap-and-scarf villager minifigs, festive timber shops with snow-roofs + a holiday-train circling + brick tree strung with trans-element lights + market-stalls',
      'CITY-ARCTIC-EXPLORERS SIGNATURE — orange + white + black + tech-grey palette, parka-and-goggle explorer minifigs with ice-core gear, icebreaker + snowcat + ice-saw + modular research-station builds, crisp-expedition register',
      'FRIENDS-WINTER-RESORT SIGNATURE — pastel-blue + pink + white palette, mini-doll skier characters in cute snow-fashion, ski-chalet + ice-rink + hot-cocoa-stand + gondola builds with heart + snowflake tile-prints',
      'CREATOR-NATURAL-CABIN SIGNATURE — natural log-brown + pine-green + snow-white palette, casual bundled minifigs, a realistically-architected timber cabin + woodpile + frozen-pond + snow-laden pines, grounded and serene',
      'CLASSIC-ALPINE SIGNATURE — muted blue + white + chalet-brown palette, traditional skier + mountaineer minifigs, a simple A-frame chalet + ski-lift + snowy-peak builds, the timeless mountain look',
      'CURRIER-AND-IVES SIGNATURE — soft cranberry + cream + evergreen palette, Victorian bundled-skater + horse-sleigh minifigs, covered-bridge + frozen-millpond + snow-village builds, nostalgic 1800s charm strictly in brick',
      'VINTAGE-ALPINE-POSTER SIGNATURE — bold red + cream + sky-blue palette, retro-ski-fashion minifigs in 1950s gear, a funicular + grand-lodge + sun-deck builds, the golden-age-of-skiing travel-poster look in brick',
      'WINTER-VILLAGE TOY-WORKSHOP SIGNATURE — red + green + warm-wood palette, elf-helper + toymaker minifigs, a bustling workshop interior with toy-builds on shelves, a conveyor, a wrapping-station, festive-industrious register',
      'CITY-ARCTIC ICEBREAKER SIGNATURE — orange + white + warning-yellow palette, crew minifigs in survival-suits, a large brick icebreaker prow crushing trans-light-blue tile ice, deck-crane + helipad, working-vessel register',
      'FRIENDS ICE-RINK SIGNATURE — bright turquoise + pink + white palette, mini-doll figure-skaters, a decorated brick ice-rink with string-lights + a warming-hut + a snack-cart, cheerful-social register',
      'WINTER-VILLAGE FIRE-STATION SIGNATURE — red + white + gold palette, festive firefighter minifigs, a snow-roofed brick fire-station with a vintage engine-build + a decorated tree, the cozy-civic holiday register',
      'CLASSIC-ALPINE MOUNTAINEER SIGNATURE — muted slate + white + rope-tan palette, climber minifigs with ice-axe + rope gear, a brick summit-ridge + base-camp tent + crevasse, the serious-ascent register',
    ],
    instructions: `Each entry is ONE winter heritage register, 20-40 words. Format: "REGISTER NAME SIGNATURE — palette + minifig look + build motif". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. Weight ~85% iconic LEGO winter heritage / ~15% retro. STRICT BANS: never a specific movie/set-number; never real-snow/photoreal vocabulary; everything reads as LEGO brick.`,
  },

  brickbot_winter_scene_props: {
    format: 'simple',
    theme: `WINTER DIORAMA STORYTELLING PROPS — small brick-built details that fill a winter diorama's negative space. Each entry 12-25 words, implying a backstory. NEVER decorative-only.

VARIETY: brick snowman with carrot-nose / wooden sled / cocoa-mug-and-kettle / ski-pair leaned on a wall / hanging lantern / pine-wreath / icicle-cluster / firewood-stack / ice-skate-pair / wrapped-gift-pile / snowball-stack ammo / brazier / string-lights / steaming-thermos / fur-blanket-on-a-bench / shovel-in-a-drift / birdfeeder-with-snow / lit-jack-o-pumpkin (no) — keep winter / brick mailbox snow-capped / carrot-and-coal on a sled.

Each names SPECIFIC brick parts. BANNED: photoreal/real-snow + motion verbs.`,
    touchpoints: [
      'A brick snowman — stacked white inverted-dome bodies, a carrot-element nose, coal-tile eyes, a printed-scarf tile and a twig-element arm, mid-meadow',
      'A wooden sled — a brown brick-built sled with curved runner-slopes, a coiled rope-element handle, parked against a white-plate drift',
      'A cocoa kettle-and-mugs — a brick kettle with two mug-builds on a slope-brick tray, a white round-plate steam-wisp, left on a snowy windowsill',
      'A leaning ski-pair — two brick-built skis and poles propped against a chalet wall, snow-plate caught in the bindings, awaiting the next run',
      'A pine-wreath — a dark-green plant-element ring with red 1×1 round-plate berries and a printed-bow tile, hung on a glowing-window cabin door',
      'A graduated icicle-cluster — trans-clear + trans-light-blue bar-elements clipped under an eave in descending lengths, catching the cold light',
      'A firewood-stack — a neat brick-built cord of brown round-bricks and log-elements under a snow-plate cap, beside the cabin hearth-chimney',
      'A wrapped-gift-pile — a stack of brick boxes in festive tile-prints with bow-elements, tucked under a string-lit brick holiday-tree',
      'A snowball-stack — a pyramid of white 1×1 round-bricks built as ready ammunition beside a white-slope drift-fort wall',
      'A glowing brazier — a brick fire-basket on legs with trans-orange flame elements, warming a market-square corner, a mitten-tile left on its rim',
      'A string of festival lights — trans-yellow + trans-red 1×1 round-elements clipped along a bar-and-string line strung between snow-roofed brick shops',
      'A snow-capped brick mailbox — a small red brick mailbox on a post with a white-plate snow-cap and a tiny flag-element raised, a letter-tile peeking out',
    ],
    instructions: `Each entry is ONE winter brick-built prop, 12-25 words. Format: prose naming the prop + its brick parts + implied backstory. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-snow/photoreal; LEGO bricks only; each prop implies a story, never decorative-only.`,
  },

  brickbot_winter_lighting: {
    format: 'simple',
    theme: `WINTER LIGHTING — light source + direction + color for a winter LEGO MOC photo. Each entry 15-30 words. Lights a TABLETOP BRICK DIORAMA — realistic studio-macro shadows on plastic, evoking the winter mood.

VARIETY: warm window-glow on cool-blue snow / golden alpine-sunset / overcast flat-snow light / aurora trans-cyan-green sky / hearth-fire amber interior / blue-hour twilight-snow / bright bluebird-day / lantern-festival warm-pool / moonlit-silver-on-snow / string-light multicolor on the village square.

Each names SOURCE + DIRECTION + COLOR + fall on the plastic bricks. NEVER real-snow-glisten/sparkle language.`,
    touchpoints: [
      'Warm window-glow spilling trans-orange light out onto cool-blue white-plate snow, hot pools at each lit cabin window against the deep blue twilight drifts, the classic cozy Winter-Village key',
      'Golden alpine-sunset raking low across the white-plate slopes, warm amber gilding the snow-caps and chalet-roofs, long cool-blue plastic shadows stretching down the piste',
      'Overcast flat-snow light, a soft shadowless even wash that shows every brick detail of the village + drifts under a calm pale-grey sky, the quiet-snowfall-day mood',
      'Aurora trans-cyan-green light from a built sky-arc washing the snowfield in shifting cool green-violet, warm lantern-builds punching small warm holes in the cold, the polar-night wonder',
      'Hearth-fire amber from a brick fireplace flickering warm across a cabin interior, the trans-orange flame casting cozy light on mug-builds and a fur-tile rug, deep cabin shadow beyond',
      'Blue-hour twilight-snow, deep cobalt ambient over the white-plate village with the first warm window-lights just glowing, a single cool star-plate above, the magic-dusk mood',
      'Bright bluebird-day, a strong high sun making the white snow + trans-blue ice pop in crisp saturated contrast, short sharp plastic shadows, the perfect-ski-morning light',
      'Lantern-festival warm pools from clip-rod lanterns lining a snow-plate street, each a hot circle on the white ground, deep cozy shadow between, the holiday-night glow',
      'Moonlit-silver wash from high and behind, cool blue-white light silvering the snow-caps + ice-castle turrets, long cool shadows, a serene frozen-night key',
      'String-light multicolor on the village square, trans-red + trans-green + trans-yellow points reflected in the white-plate snow + smooth ice, festive and warm against the dusk',
    ],
    instructions: `Each entry is ONE winter lighting setup, 15-30 words. Format: prose naming source + direction + color + fall on the bricks. Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: no real-snow-glisten/sparkle/photoreal language — it lights a plastic brick diorama. No real-snow vocabulary.`,
  },

  brickbot_winter_palette: {
    format: 'simple',
    theme: `WINTER PALETTE — color combinations for a winter LEGO MOC diorama, locked to LEGO-heritage signatures. Each entry 12-25 words, naming 3-5 specific LEGO-brick colors + the heritage it evokes.

VARIETY (align to registers): Winter-Village red+green+white+gold / Arctic orange+white+black+grey / ice-castle trans-blue+white+silver / Friends pastel-blue+pink+white / cabin red+pine+amber / classic-alpine blue+white+chalet-brown / aurora teal+violet+green+midnight / Currier-Ives cranberry+cream+evergreen / vintage-poster bold-red+cream+sky-blue / moonlit silver+blue+white.

Each names ACTUAL LEGO brick colors (sand-blue, dark-green, trans-light-blue, etc.).`,
    touchpoints: [
      'Winter-Village holiday palette — festive red + dark-green + white + gold, cozy and nostalgic, warm gold window-glow against snow-white roofs',
      'Arctic-explorer palette — safety-orange + white + black + tech-grey, crisp and modern, high-visibility gear on a white ice-shelf',
      'Ice-castle palette — trans-light-blue + white + silver, glassy and crystalline, the translucent frozen-palace story',
      'Friends-winter palette — pastel sand-blue + bright-pink + white, cute and cheerful, the friendly resort look',
      'Cozy-cabin palette — cabin-red + pine-green + hearth-amber + snow-white, warm and snug, firelit against the cold',
      'Classic-alpine palette — muted sand-blue + white + chalet-brown, timeless and clean, the traditional ski-mountain look',
      'Aurora-night palette — trans-teal + trans-violet + trans-green over midnight-blue, luminous and cold, the polar-sky wonder',
      'Currier-Ives palette — soft cranberry + cream + evergreen, nostalgic 1800s warmth in a snowy village',
      'Vintage-poster palette — bold travel-red + cream + sky-blue, graphic and punchy, the golden-age-ski-resort look',
      'Moonlit-frost palette — silver + sand-blue + white, cool and serene, a still moonlit snowfield',
    ],
    instructions: `Each entry is ONE winter palette, 12-25 words. Format: "NAME palette — colors + mood". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: name ACTUAL LEGO brick colors; no photoreal-color language; tie each to a winter heritage. No real-snow vocabulary.`,
  },

  brickbot_winter_phenomenon: {
    format: 'simple',
    theme: `WINTER PHENOMENON — a 50%-gated environmental beat for a winter diorama, ALWAYS rendered IN BRICK. Each entry 20-40 words. AMPLIFIES the scene as a secondary focal point, never eclipses it.

VARIETY: white-round-plate snow-flurry on rods / aurora trans-cyan-green-violet built arc / blizzard-whiteout cotton+white-plate veil / cotton-element frozen-mist / trans-clear icicle-glint cascade / fresh-snowfall dusting on every surface / trans-blue cracking-ice line across the lake / northern-lights curtain / a brick avalanche-cloud down a slope / chimney-smoke cotton-column rising from every roof.

Each names the BRICK PARTS + visual impact. NEVER lighting-color-cast (separate axis). NEVER real-snow/photoreal. NO non-rigid-motion verbs (render as static built moment).`,
    touchpoints: [
      'SNOW-FLURRY — scattered white 1×1 round-plates threaded on thin clear bar-rods at varied heights + angles across the frame, plus cotton-elements massed at the edges, a built falling-snow moment frozen mid-air',
      'AURORA ARC — a built sky-arc of layered trans-cyan + trans-green + trans-purple plates curving over the snowfield behind the village, a deliberate brick northern-lights backdrop element',
      'BLIZZARD WHITEOUT — a wall of cotton-elements + white 1×1 round-plates massed across the deep frame veiling the distance, the foreground builds emerging from the built whiteout, the survival-tension beat',
      'FROZEN-MIST POOL — low white cotton-elements + 1×1 white round-plate haze pooling over the smooth trans-blue frozen lake and between the snow-pine trunks, the still-cold-dawn beat',
      'ICICLE-GLINT CASCADE — a dense fringe of trans-clear + trans-light-blue icicle bar-elements lining an eave or cliff catching the key-light as bright glints, a built sparkle-row',
      'FRESH-SNOWFALL DUSTING — a fresh layer of white 1×1 round-plates + white plates newly capping every roof, branch, rail, and lamp-post across the build, the just-snowed beat',
      'CRACKING-ICE LINE — a built hairline of trans-clear + trans-blue cracked tiles spidering across the smooth frozen-lake sheet beneath a figure, the thin-ice-tension beat',
      'NORTHERN-LIGHTS CURTAIN — vertical built drapes of trans-green + trans-cyan plates hanging from the sky-baseplate over a dark snowfield, a shimmering brick light-curtain',
      'CHIMNEY-SMOKE COLUMNS — cotton-element + white 1×1 round-plate smoke-columns rising in built plumes from every snow-roofed chimney in the village, the cozy-hearths-lit beat',
      'AVALANCHE-CLOUD — a built tumbling cloud of white slopes + round-plates + cotton-elements cascading down a slope-brick mountainside behind tiny figures, the dramatic-but-distant beat',
    ],
    instructions: `Each entry is ONE winter phenomenon, 20-40 words. Format: "PHENOMENON NAME — brick-parts + visual impact". Output as a NUMBERED list (1. ... 2. ...), one per line, NO internal newlines. STRICT BANS: never lighting-color-cast (separate axis); never real-snow/photoreal language; ALWAYS built from named brick parts; never non-rigid-motion verbs (render as a static built moment).`,
  },

  // ════════════════════════════════════════════════════════
  // FOREST PATH (2026-05-27 — fourth BrickBot axis migration)
  // PEACEFUL MAGICAL WOODLAND. Root-cause fix for photoreal-forest
  // drift: EVERY entry names LEGO PARTS, BANS botanical vocab
  // (birch/aspen/bark/leaf-litter/canopy/foxfire) + organic-motion
  // verbs (bending/swaying/in-motion). Register locks woodland LEGO
  // heritage. Bespoke — NOT cloned from fantasy/space recipes.
  // ════════════════════════════════════════════════════════

  brickbot_forest_scene_type: {
    format: 'simple',
    theme: `LEGO MOC PEACEFUL-WOODLAND DIORAMA SCENE STAGES — narrative-stage descriptions for BrickBot's forest axis system. Each entry is ONE cozy magical-woodland stage (the WHAT — what category of gentle forest moment is this diorama?). Each entry 30-55 words. Mood: COZY, WHIMSICAL, FAIRY-TALE — NOT grim battle (that's the fantasy path).

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (separate axis). NO build technique vocab. NO weather phenomena. NO lighting descriptors. Just: where are we, what cozy woodland moment.

⚠️ EVERYTHING IS LEGO BRICK. Trees = brick-built trunks. Foliage = plant-elements + plates. Mushrooms = dish/dome caps. NEVER real-forest vocabulary. BANNED WORDS: birch, aspen, bark, leaf litter, foxfire, rotting, canopy (say "brick tree-tops"), photoreal. NEVER organic-motion verbs.

VARIETY MANDATE — distribute across these categories (~6% each):
  • FAIRY VILLAGE — mushroom-cottage hamlet / fairy-tower cluster / blossom-court
  • TREEHOUSE VILLAGE — brick-trunk treehouse platforms linked by rope-bridges
  • MUSHROOM HOLLOW — giant toadstool-cap dwellings around a clearing
  • GROTTO POOL — trans-blue pool grotto with brick-arch + waterfall
  • WOODLAND CAMPSITE — brick campfire + fabric tents in a glade
  • HOBBIT-STYLE BURROW — round-door hillside burrow homes
  • STREAM-BRIDGE — brick-arch bridge over a trans-blue stream
  • WILDFLOWER GLADE — open clearing bordered with brick-bloom flowers
  • FIREFLY CLEARING — dusk clearing dotted with trans-yellow firefly elements
  • MOSS-RUINS — brick-built mossy ruined arch reclaimed by brick-foliage
  • FOREST MARKET — woodland-creature market stalls on a brick path
  • TREE-HOLLOW HOME — cozy interior inside a brick-built tree-trunk
  • WATERFALL GROTTO — multi-tier trans-blue waterfall into a brick basin
  • ACORN / BERRY HARVEST — gathering scene with brick basket + cart
  • LANTERN FESTIVAL — clip-rod hanging-lantern strings over a clearing

Each entry must: name the woodland category in first 6-10 words; establish the brick-built STAGE; suggest the COZY tension/charm of the moment; NEVER name a minifig action verb or a phenomenon.`,
    touchpoints: [
      'FAIRY MUSHROOM-COTTAGE HAMLET — a cluster of brick-built giant-toadstool cottages (red SNOT-dome caps with white round-tile spots on cream round-brick stems) ringing a small brick-paved clearing, tiny door-and-window builds in each stem, a central brick well, woven-basket details at the thresholds, the snug fairy-village stage',
      'TREEHOUSE VILLAGE PLATFORMS — several brick-trunk treehouses at staggered heights linked by brick + clip-rod rope-bridges, ladder builds spiralling the round-brick trunks, plate-and-plant-element tree-tops sheltering the platforms, lantern accessories at the rails, the airy canopy-hamlet stage',
      'TRANS-BLUE GROTTO POOL — a sheltered grotto with a brick-arch entrance and a trans-blue + trans-light-blue layered-plate pool fed by a small stepped waterfall, BURP rock-piece walls dotted with green moss-plate clusters, lily-pad plates floating on the surface, the hidden-fairy-pool stage',
      'WOODLAND CAMPSITE GLADE — a cozy clearing with two fabric tents pitched beside a brick-built campfire (trans-orange flame elements on light-bley hearth-stones), a log-bench build of brown round-bricks, satchels and lantern accessories scattered, brick tree-tops enclosing the glade, the forager-camp stage',
      'HOBBIT-STYLE BURROW HILLSIDE — a grassy green-plate hillside with three round-door burrow homes set into the slope, brick-built round door-frames with tiny window builds, a winding dark-tan plate path, brick-bloom flower borders, chimney builds with cotton-element smoke, the snug-burrow stage',
      'BRICK-ARCH STREAM-BRIDGE — a humpbacked brick-arch bridge of light-bley slope-bricks spanning a trans-blue layered-plate stream, mossy green-plate stones beneath, a brick-built water-wheel mill downstream, brick reeds at the banks, the woodland-crossing stage',
      'FIREFLY DUSK CLEARING — an open glade at dusk dotted with trans-yellow round-plate firefly elements on clear rods hovering at varied heights, brick-bloom wildflowers across the green-plate floor, a ring of brick tree-trunks enclosing the space, the magical-clearing stage',
      'GIANT TOADSTOOL HOLLOW — a clearing dominated by several oversized brick-built toadstools (inverted-dish caps) with door-and-window builds in the stems, a brick spiral-stair around the largest, hanging clip-rod lanterns, brick-fern clusters at the bases, the mushroom-dwelling stage',
      'MOSS-RECLAIMED RUINS — a small brick-built ruined stone arch and tumbled slope-brick walls reclaimed by green moss-plates and brick-foliage, a trans-blue trickle through the stones, brick-bloom flowers in the cracks, the gentle-overgrown-ruin stage',
      'WOODLAND CREATURE MARKET — a row of brick-built market stalls along a dark-tan plate path with woven-basket goods and brick-fruit displays, banner-tile awnings, brick lanterns on posts, brick tree-tops overhead, the cozy-forest-bazaar stage',
      'COZY TREE-HOLLOW INTERIOR — the warm interior carved inside a giant brick-built tree-trunk, round brick walls with shelf builds, a tiny brick hearth with trans-orange flame, a round window looking out on brick tree-tops, woven rugs (printed tiles), the snug-home stage',
      'MULTI-TIER WATERFALL GROTTO — a tall brick rockface of stacked slope-bricks with a stepped trans-blue + trans-light-blue waterfall cascading into a brick basin pool, green moss-plate ledges, brick-fern fronds, a brick-arch footbridge across the basin, the cascade-grotto stage',
    ],
    instructions: `Each entry is ONE peaceful-woodland narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never camera framing ("WIDE/MEDIUM/CLOSE/aerial"), never minifig action verbs, never phenomenon names, never lighting descriptors. Also BANNED: birch, aspen, bark, leaf litter, foxfire, rotting, photoreal, real-tree/leaf/moss/water vocabulary, organic-motion verbs (bending/swaying/in-motion/fluttering). Every element is a NAMED LEGO BRICK PART. Stage + cozy charm only.`,
  },

  brickbot_forest_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led COZY story moments for BrickBot's forest path. Each entry is a freeze-frame of fairy/forager/woodland minifigs (and brick-built creatures) IN MID-ACTION, NOT posing. Each entry 25-45 words. Mood: gentle, whimsical, wholesome — never combat.

⚠️ STORY BEAT MANDATE — every entry STARTS WITH AN ACTIVE VERB and describes a moment with CAUSE + EFFECT in the same frame. Cozy woodland verbs: mid-lantern-light, mid-mushroom-harvest, mid-stream-crossing, mid-berry-pick, mid-creature-feeding, mid-treehouse-climb, mid-flower-plant, mid-bridge-repair, mid-acorn-toss, mid-basket-carry, mid-tea-pour, mid-net-cast.

⚠️ HARD BANS: NEVER "minifigs standing around", NEVER "posing", NEVER "watching/looking at/gazing at", NEVER passive states, NEVER combat/violence (this is the cozy path). Minifigs + creatures are LEGO (C-shaped hands, printed faces; creatures brick-built or LEGO animal-figures — NEVER photoreal). BANNED WORDS: birch, aspen, bark, leaf litter, foxfire, real foliage, photoreal; NO organic-motion verbs for plants.

✓ Body-position variety: mid-reach/mid-pick (~20%), mid-carry/haul (~15%), mid-climb/balance (~15%), multi-figure cozy interaction (sharing, hand-off, helping a creature) (~25%), fairy mid-flit on a clear-rod (~10%), tending/crafting (~15%).

Each entry must: start with an active verb; name 1-3 specific minifigs/creatures (fairy / forager / woodland-ranger / brick-built deer / owl / fox / hedgehog) with a brief identifier; describe the SHARED OBJECT/EVENT (lantern / mushroom / berry-basket / stream-stones / acorn / treehouse-ladder); imply moment-before/after; PLASTIC SCALE (C-hands, printed face).`,
    touchpoints: [
      'Mid-lantern-light of a clip-rod hanging lantern by a flower-crown fairy minifig perched on a brick branch, C-hand cupping the trans-yellow lantern-element as it glows to life, a second fairy below mid-reach to pass up the next unlit lantern',
      'Mid-mushroom-harvest as a green-hood forager minifig kneels to twist a brick-built toadstool cap free, dropping it into a woven-basket build at their feet, a brick-built hedgehog beside them mid-nose-nudge at a fallen cap',
      'Mid-stream-crossing of a forager minifig stepping between trans-blue + green moss-plate stepping-stones, C-hand out for balance with a basket on the other arm, a brick-built frog on a lily-pad plate mid-hop at the bank',
      'Mid-berry-pick of two fairy minifigs at a brick-bloom berry-bush, the taller one mid-reach to a high cluster of 1×1 round-plate berries while the shorter steadies a tipping woven-basket already half-full below',
      'Mid-creature-feeding as a flower-crown fairy holds out a brick-acorn to a chunky brick-built deer dipping its head to take it, a second smaller deer-figure behind mid-step toward the offered hand',
      'Mid-treehouse-climb of a forager minifig halfway up a brick ladder rung on a round-brick trunk, satchel slung across the torso, a fairy minifig on the platform above mid-reach-down to help them up the last rung',
      'Mid-flower-plant as a Heartlake-coded minifig presses a brick-bloom flower into a green-plate garden bed, trowel accessory in one C-hand, a brick-built rabbit beside them mid-dig in the soft dark-tan plates',
      'Mid-bridge-repair of a forager minifig kneeling on a brick-arch stream-bridge fitting a replacement slope-brick into the rail, a small tool laid on the deck, a second figure on the far bank mid-hand-off of the next brick across the gap',
      'Mid-acorn-toss between two woodland minifigs in a glade, one mid-throw of a brick-acorn and the other C-hands raised mid-catch, a brick-built squirrel on a low branch mid-scamper after a dropped one',
      'Mid-tea-pour inside a cozy tree-hollow interior, a fairy minifig tilting a brick teapot over two tiny cup-builds on a brick table, a second figure on a woven-tile rug mid-lean-in, a brick hearth with trans-orange flame behind',
      'Mid-net-cast at a trans-blue grotto pool, a forager minifig swinging a brick-built dip-net toward the water surface, a brick-built fish-element mid-arc above the trans-blue plates, a friend on the bank mid-point at where it leapt',
      'Mid-basket-carry of two foragers hauling a laden woven-basket of brick-mushrooms between them along a dark-tan plate path, one mid-stride ahead, brick-bloom flowers lining the verge, a brick-built fox trotting alongside',
    ],
    instructions: `Each entry is ONE cozy woodland minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "standing/posing/watching/looking/gazing", NO passive states, NO combat. NO real-forest vocabulary (birch/aspen/bark/leaf-litter/photoreal). Creatures are brick-built or LEGO animal-figures. Story beat + verb + cause/effect always.`,
  },

  brickbot_forest_build_technique: {
    format: 'simple',
    theme: `LEGO WOODLAND MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction notes for BrickBot's forest path. Each entry is ONE specific MOC technique that makes a magical-woodland diorama read as "Bricklink AFOL convention build" instead of "official set" OR (the failure to avoid) "real-forest photo." Each entry 25-45 words. THIS AXIS IS THE PRIMARY ANTI-PHOTOREAL LEVER — every entry shows HOW an organic forest form is built from NAMED bricks.

VARIETY MANDATE — distribute across:
  • Brick-built tree trunks (stacked brown 2×2 round-bricks + cylinder-bricks, bark-texture from 1×1 cheese-slopes, SNOT root-flare)
  • Plate-stacked + plant-element foliage canopy (layered green/olive/autumn-orange plant-elements + leaf-elements + 1×1 round-plates)
  • SNOT mushroom caps (inverted radar-dish + dome elements on round-brick stems, round-tile spots)
  • Trans-blue layered-plate water (stream/pool/waterfall with white-stud foam, stepped tiers)
  • BURP/LURP rock-piece + slope-brick rock outcrops + moss from green plates/round-plates
  • Brick-bloom flowers (flower-stem elements + round-plate petals + 1×3 plant stems)
  • Clip-and-bar hanging-lantern rigs + rope-bridge (string + brick planks)
  • Technic-pin branch articulation + treehouse cantilevers
  • Trans-cyan/trans-yellow fairy-glow + firefly micro-builds (round-plates on clear rods)
  • Microscale part-repurposing (minifig accessories as woodland micro-details: croissant as log, frog as creature, leaf-element as fairy-wing)

Each entry must: name the technique TYPE in first 5-8 words; specify WHICH woodland element it applies to (trunk/canopy/mushroom/water/rock/flower/bridge); name the SPECIFIC BRICK PARTS used; imply the visual impact. NEVER real-construction language (no 3D-print/paint/glue/real-wood). BANNED: birch/aspen/bark(real)/leaf-litter/photoreal.`,
    touchpoints: [
      'Stacked round-brick tree-trunk with bark-texture — a forest tree-trunk built from a column of brown 2×2 round-bricks and cylinder-bricks, surface broken up with 1×1 brown cheese-slopes for bark-texture, a SNOT root-flare of angled slope-bricks splaying at the base into the green-plate ground',
      'Plant-element + plate-stack canopy — a brick tree-top built as dense layered clusters of green and olive-green plant-elements interlaced with leaf-element pieces and 1×1 round-plates on bar-and-clip armatures, autumn-orange leaf-elements salted through for seasonal variety, fully opaque-brick (no gaps to photoreal sky)',
      'SNOT inverted-dish mushroom cap — a giant toadstool built with a red 4×4 inverted radar-dish cap studded with white 1×1 round-tiles for spots, mounted on a cream round-brick stem with a 2×2 round-plate gill-collar underneath, the iconic fairy-toadstool silhouette',
      'Trans-blue layered-plate stream — a woodland stream built from trans-blue + trans-light-blue plates layered at slightly offset levels for current, white 1×1 round-plates dotting the surface as foam over stepping-stones, the trans-plates clearly reading as plastic water',
      'BURP-rock + moss-plate outcrop — a grotto wall built from large BURP/LURP rock-pieces blended with grey slope-bricks, surfaced with scattered green 1×1 round-plates and olive plates as brick-moss, brick-fern plant-elements sprouting from the crevices',
      'Brick-bloom wildflower field — a meadow built from flower-stem elements topped with bright round-plate petal-clusters in mixed colors, set in a green-plate base with taller 1×3 plant-stem accents, dense enough to read as a packed brick flower-bed',
      'Clip-and-bar hanging-lantern rig — a string of festival lanterns built from trans-orange/trans-yellow round-elements clipped onto a bar-and-string line strung between brick tree-trunks via clip-plates, each lantern a deliberate tiny brick build',
      'Technic-pin treehouse cantilever — a treehouse platform cantilevered off a round-brick trunk using Technic-pin + beam joints hidden inside the trunk, brick-plank decking with a slope-brick railing, a clip-rod rope-ladder dropping to the forest floor',
      'Trans-cyan fairy-glow micro-detail — clusters of trans-cyan and trans-clear 1×1 round-plates and short bar-rods set into a tree-hollow doorway and along a path to suggest fairy-glow, each a placed brick element catching the light, never a painted glow',
      'Microscale creature repurposing — a brick-built woodland fox formed from brown slopes + a 2×2 jumper snout + tail-element, or an owl from a 2×2 dome body with wing-plate sides and printed-eye tiles, AFOL part-repurposing that reads instantly as the creature in brick',
      'Stepped trans-blue waterfall — a multi-tier waterfall built from trans-blue plates cascading down stepped slope-brick ledges, white round-plate spray at each lip, pooling into a trans-light-blue basin, the whole cascade unmistakably translucent plastic',
      'Brick-fern + toadstool groundcover — forest-floor groundcover built from green plant-element ferns, small 1×1 brick-toadstools, and a scatter of brown + autumn-orange leaf-elements over green and dark-tan plates, dense detail with zero photoreal litter',
    ],
    instructions: `Each entry is ONE woodland MOC build technique, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: no real-construction language (3D-print/paint/glue/real-wood), no real-forest vocabulary (birch/aspen/bark-as-real/leaf-litter/photoreal/moss-as-real). LEGO bricks only — name SPECIFIC part types (2×2 round-brick / inverted radar-dish / trans-blue plate / plant-element / cheese-slope).`,
  },

  brickbot_forest_camera_framing: {
    format: 'simple',
    theme: `WOODLAND-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the forest path. Each entry is ONE camera position + framing rule specific to magical-woodland diorama subject matter. Each entry 15-30 words.

⚠️ Bespoke — leverage woodland scenery (canopy / forest-floor / tree-trunks / treehouse-platform / grotto-pool / burrow-doorway / stream-bridge / fairy-clearing) rather than generic photography terms.

VARIETY MANDATE — distribute across: canopy-down overhead, forest-floor macro, through-the-trunks framing, treehouse-aerial, grotto-pool reflection, burrow-doorway low-angle, fairy-eye-level intimate, stream-bridge side-on, firefly-clearing wide-establishing, worm's-eye up a giant-mushroom, over-shoulder at a campfire.

Each entry must: specify camera POSITION (height/location/orientation); specify the framing's PURPOSE (what cozy element it dramatizes); reference woodland-specific brick scenery.`,
    touchpoints: [
      'CANOPY-DOWN OVERHEAD — camera high above the clearing looking straight down through gaps in the brick tree-tops at the village below, mushroom-cap roofs and winding brick paths forming the composition, minifigs read from above',
      'FOREST-FLOOR MACRO — camera at ground level inches from the green-plate floor, brick-ferns and a toadstool filling the foreground tack-sharp, a minifig and the village softening into the mid-distance, the tiny-world intimate angle',
      'THROUGH-THE-TRUNKS — camera behind two foreground brick tree-trunks that frame the shot like a proscenium, the village or grotto revealed in the gap between them, layered depth from foreground trunk to deep brick tree-line',
      'TREEHOUSE-PLATFORM AERIAL — camera at platform height looking across and slightly down at the treehouse hamlet, rope-bridges spanning the gaps, minifigs on the decks, the canopy-village laid out in receding tiers',
      'GROTTO-POOL REFLECTION — camera low at the water-edge so the brick-arch grotto and waterfall reflect in the trans-blue plate surface, lily-pad plates in the foreground, the symmetry-and-stillness angle',
      "BURROW-DOORWAY LOW-ANGLE — camera at ground level looking up slightly at a round burrow door set in the green-plate hillside, the door-frame and chimney rising above, a minifig in the doorway foreshortened from below",
      'FAIRY-EYE-LEVEL INTIMATE — camera down at minifig height beside a flower-crown fairy at a brick-bloom, the petals towering at scale, a shallow cozy framing that makes the viewer feel minifig-sized',
      'STREAM-BRIDGE SIDE-ON — camera at the bank shooting the brick-arch bridge in side-profile across the trans-blue stream, its reflection below, a minifig mid-crossing read in clean silhouette',
      'FIREFLY-CLEARING WIDE — camera pulled back for a wide establishing view of the whole dusk clearing, trans-yellow firefly elements dotting the depth at varied heights, an ensemble of minifigs + creatures across the brick-bloom floor',
      "WORM'S-EYE UP A GIANT-MUSHROOM — camera at the base of an oversized brick toadstool looking steeply up the cream round-brick stem to the red dish-cap overhead, a doorway build in the stem, severe upward scale",
      'OVER-SHOULDER AT THE CAMPFIRE — camera just behind a seated forager minifig looking past their shoulder at the brick campfire and the friends gathered around it, the trans-orange flame as the focal glow',
      'CANOPY-SHAFT THROUGH-GAP — camera angled up through a gap in the brick tree-tops where a light-shaft falls, the village in the lower frame catching the beam, the magical-light-fall angle',
    ],
    instructions: `Each entry is ONE woodland-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: no generic camera terms without woodland anchoring — every entry references brick woodland scenery (canopy/forest-floor/trunks/treehouse/grotto/burrow/stream/clearing). No real-forest vocabulary.`,
  },

  brickbot_forest_subject_focus: {
    format: 'simple',
    theme: `WOODLAND SUBJECT-FOCUS / SILHOUETTE ANCHOR — the dominant subject class for a forest diorama. Each entry is ONE of four kinds: a brick-built STRUCTURE, a woodland-CREATURE-MOUNT, a NO-VEHICLE INTERIOR, or a NO-VEHICLE LANDSCAPE. Each entry 20-40 words. This anchors what fills the frame.

DISTRIBUTION: ~45% STRUCTURE / ~20% CREATURE-MOUNT / ~15% NO-VEHICLE INTERIOR / ~20% NO-VEHICLE LANDSCAPE. Lead each entry with its TYPE label in parentheses.

Every entry names brick parts + bans real-forest vocabulary. Creatures are brick-built / LEGO animal-figures, NEVER photoreal.`,
    touchpoints: [
      'STRUCTURE — a brick-built giant toadstool cottage, red inverted-dish cap with white round-tile spots on a cream round-brick stem, door-and-window builds carved in, a clip-rod lantern at the threshold; fills 50%+ of frame as the dominant subject',
      'STRUCTURE — a multi-platform treehouse on a stacked round-brick trunk, brick-plank decks, slope-brick railings, a clip-rod rope-ladder and rope-bridge, plant-element tree-top sheltering it; the dominant brick build',
      'STRUCTURE — a humpbacked brick-arch stream-bridge of light-bley slope-bricks over trans-blue plate water, mossy green-plate stones beneath, brick lantern-posts at each end; the central architectural subject',
      'STRUCTURE — a hobbit-style round-door burrow set into a green-plate hillside, brick door-frame and window builds, chimney with cotton-element smoke, brick-bloom flower border; the dominant cozy build',
      'STRUCTURE — a brick-arch grotto entrance with a trans-blue + trans-light-blue plate pool and a stepped waterfall, BURP-rock walls with brick-moss, lily-pad plates floating; the grotto fills the frame',
      'CREATURE-MOUNT — a chunky brick-built stag with a slope-brick body, antler builds from horn-elements, and a flower-crown fairy minifig riding on its back, the brick-deer as the dominant foreground silhouette',
      'CREATURE-MOUNT — a brick-built giant owl with a 2×2-dome body, wing-plate sides and printed-eye tiles, a tiny forager minifig perched between its wings, the owl dominating the frame mid-roost',
      'CREATURE-MOUNT — a saddled brick-built fox (brown slopes + jumper snout + tail-element) with a fairy minifig in a brick saddle, the fox as the bright foreground subject on a brick path',
      'CREATURE-MOUNT — a giant brick-built snail with a SNOT-spiral shell of curved slopes and a stalk-eye head, a tiny minifig riding the shell, a whimsical slow-mount as the dominant subject',
      'NO-VEHICLE INTERIOR — the cozy interior of a brick tree-hollow home, round brick walls, shelf builds with tiny jar-elements, a brick hearth with trans-orange flame, a woven-tile rug; the interior is the stage and a minifig the subject',
      'NO-VEHICLE INTERIOR — a fairy workshop inside a mushroom-cottage, brick workbench with tool-accessories and trans-cyan glow-jars, hanging dried-herb plant-elements, a round window on brick tree-tops; cozy crafting setting',
      'NO-VEHICLE LANDSCAPE — a wildflower glade bordered by brick tree-trunks, a dense brick-bloom flower meadow over green plates, a trans-blue trickle through it, deep-distance brick tree-line; lush multi-tier woodland setting',
      'NO-VEHICLE LANDSCAPE — a mossy hollow at the foot of a giant brick tree, green moss-plate ground, brick-ferns and small brick-toadstools, exposed SNOT root-flares arching overhead; intimate forest-floor setting',
    ],
    instructions: `Each entry is ONE forest subject-focus, 20-40 words, LED BY ITS TYPE LABEL in parens — (STRUCTURE) / (CREATURE-MOUNT) / (NO-VEHICLE INTERIOR) / (NO-VEHICLE LANDSCAPE). Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. Distribution ~45/20/15/20. Every entry names brick parts; creatures are brick-built/LEGO-animal-figures. BANNED: birch/aspen/bark/leaf-litter/foxfire/photoreal + organic-motion verbs.`,
  },

  brickbot_forest_register: {
    format: 'simple',
    theme: `WOODLAND HERITAGE REGISTER — the aesthetic + faction lock for a forest diorama, named by its LEGO-heritage VISUAL SIGNATURE. Each entry is ONE register that locks palette + minifig costume + build motif. Each entry 20-40 words. This is the SECOND primary anti-photoreal lever (after build_technique): a strong LEGO-theme signature pins the whole frame to "brick."

WEIGHTING — ~85% iconic LEGO woodland heritage / ~15% AFOL cottagecore + retro-whimsy:
  • ELVENDALE (LEGO Elves) — teal + lavender + gold + rose, fairy/elf minifigs with translucent-wing + flower-crown pieces, ornate treetop-city builds (~18%)
  • FORESTMEN (classic Castle forest faction) — forest-green + brown + tan, green-hood woodland-ranger minifigs, rustic timber + rope-bridge + hideout builds (~18%)
  • FABULAND — bright primary colors, chunky rounded anthropomorphic-animal characters, playful storybook-village builds (~14%)
  • FRIENDS-HEARTLAKE forest — pastel + sand + bright accents, cozy-cabin + flower-garden + treehouse builds (~13%)
  • IDEAS-TREEHOUSE / BONSAI — natural-wood-brown + leaf-green, realistic-treehouse architecture, changeable seasonal leaf-elements (~12%)
  • CLASSIC-CASTLE FOREST GLADE — muted green + grey + brown, simple knight/peasant woodland builds (~10%)
  • AFOL COTTAGECORE-WOODLAND MOC — warm earthy + sage + cream, snug foraging-cottage + mushroom-village MOC styling (~8%)
  • RETRO-WHIMSY (Brambly-Hedge-coded / Wind-in-the-Willows-coded) — soft autumnal, anthropomorphic woodland-folk in waistcoats, rendered STRICTLY in brick (~7%)

Each entry must: name the register signature in first 5-8 words; specify its PALETTE; specify its MINIFIG/character look; specify a BUILD MOTIF. NEVER name a specific movie/book/show/set-number. Always reads as LEGO.`,
    touchpoints: [
      'ELVENDALE FAIRY-COURT SIGNATURE — teal + lavender + gold + rose palette, fairy/elf minifigs with translucent-wing elements + flower-crown hair-pieces + flowing printed gowns, ornate treetop-city builds with curved gold-trim arches and crystal-element accents',
      'FORESTMEN WOODLAND-RANGER SIGNATURE — forest-green + brown + tan palette, green-hood ranger minifigs with quivers + feathered caps + leaf-emblem tunics, rustic timber-and-rope hideout builds with camouflaged tree-fort platforms',
      'FABULAND STORYBOOK-VILLAGE SIGNATURE — bright primary palette (red/yellow/blue), chunky rounded anthropomorphic-animal characters (bear/rabbit/cat figures in little outfits), playful oversized-door cottage builds with simple cheerful shapes',
      'FRIENDS-HEARTLAKE FOREST-CABIN SIGNATURE — pastel lavender + mint + sand with bright-pink/orange accents, friendly minifig-doll characters in casual outdoor outfits, cozy log-cabin + flower-garden + treehouse builds with heart + flower tile-prints',
      'IDEAS-TREEHOUSE NATURAL SIGNATURE — natural wood-brown + leaf-green palette, casual modern minifigs, a realistically-architected multi-level treehouse around a stacked-round-brick trunk with changeable green + autumn-orange leaf-element foliage',
      'CLASSIC-CASTLE FOREST-GLADE SIGNATURE — muted forest-green + grey + brown palette, simple classic knight + peasant + woodcutter minifigs, modest timber-cottage + well + cart builds in a brick woodland clearing',
      'AFOL COTTAGECORE-WOODLAND SIGNATURE — warm earthy ochre + sage-green + cream palette, gentle forager + herbalist minifigs with satchels + baskets, snug mushroom-cottage + drying-herb + foraging-cart MOC styling',
      'BRAMBLY-HEDGE-CODED WOODLAND-FOLK SIGNATURE — soft autumnal russet + cream + moss palette, anthropomorphic mouse/hedgehog/vole characters in tiny waistcoats + aprons (brick-built), snug root-burrow + acorn-store + harvest-cart builds, strictly in brick',
      'ELVENDALE NATURE-GUARDIAN SIGNATURE — emerald + gold + amber palette, elf-guardian minifigs with leaf-armor prints + staff accessories, sacred-grove builds with glowing trans-green crystal-tree centerpieces',
      'FORESTMEN HIDEOUT-CAMP SIGNATURE — green + brown + grey palette, green-hood outlaw-ranger minifigs around a brick campfire, hidden tree-stump-door + rope-bridge + lookout-platform woodland-hideout builds',
      'FRIENDS-HEARTLAKE BLOSSOM-GARDEN SIGNATURE — bright pastel pink + mint + yellow palette, cheerful minifig-doll gardeners, a flower-stall + blossom-arch + pastel-treehouse build packed with brick-bloom flowers',
      'WIND-IN-THE-WILLOWS-CODED RIVERBANK SIGNATURE — soft sage + tan + cornflower palette, anthropomorphic toad/badger/mole/water-rat characters in tweed (brick-built), riverbank-burrow + brick-rowboat + willow-shaded builds, strictly in brick',
    ],
    instructions: `Each entry is ONE woodland heritage register, 20-40 words. Format: "REGISTER NAME SIGNATURE — palette + minifig look + build motif". Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. Weight ~85% iconic LEGO woodland heritage / ~15% AFOL+retro-whimsy. STRICT BANS: never name a specific movie/book/show/set-number; never real-forest vocabulary (birch/aspen/bark/photoreal); everything reads as LEGO brick.`,
  },

  brickbot_forest_scene_props: {
    format: 'simple',
    theme: `WOODLAND DIORAMA STORYTELLING PROPS — small brick-built details that fill a forest diorama's negative space. Each entry is ONE prop, 12-25 words. Each implies a cozy backstory. NEVER decorative-only.

VARIETY: brick-built toadstool / clip-rod hanging lantern / trans-yellow round-plate firefly cluster / brick acorn / mushroom basket / lily-pad plate / brick-built bird on a branch / trans-piece butterfly / 1×1 round-plate berry cluster / tiny treasure-chest / fairy-wing accessory / woven basket / brick teapot + cups / brick birdhouse / signpost / brick mushroom-stool / dropped brick-fruit / brick well / clothesline with printed-tile laundry / brick beehive.

Each names SPECIFIC brick parts. BANNED: real-forest vocab + organic-motion verbs.`,
    touchpoints: [
      'A cluster of three brick-built toadstools — red inverted-dish caps with white round-tile spots on short cream stems, tucked at the base of a brick tree-trunk',
      'A clip-rod hanging lantern — a trans-orange round-element in a brick cage clipped to a brick branch, implying the path is lit for evening',
      'A trans-yellow round-plate firefly cluster on clear bar-rods — hovering at varied heights near a doorway, the magic of the dusk clearing',
      'A tipped woven-basket of brick-mushrooms — round-tile caps spilling onto the green-plate floor, mid-forage abandoned',
      'A lily-pad plate with a brick-built frog — a flat green round-plate on the trans-blue pool, a small brick frog perched mid-rest',
      'A brick-built songbird on a branch — a tiny 1×1-and-slope bird in bright plastic, head-tilted, perched over the cottage door',
      'A trans-clear butterfly element on a flower-stem — wings catching the light above a brick-bloom, a delicate placed detail',
      'A brick well with a clip-rod bucket — light-bley slope-brick rim, a tiny rope-and-bucket build, at the village center',
      'A tiny brick treasure-chest half-open — brown brick body with a gold round-plate coin spilling, hidden among brick-ferns',
      'A brick teapot and two cup-builds on a slope-brick tray — left on a tree-stump table, implying a shared woodland tea',
      'A brick birdhouse on a post — a gabled tiny build with a round-plate entry hole, nailed to a brick trunk',
      'A carved brick signpost — a brown post with printed-tile direction-arrows pointing to the village and the grotto',
    ],
    instructions: `Each entry is ONE woodland brick-built prop, 12-25 words. Format: free-form prose naming the prop + its brick parts + implied backstory. Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: no real-forest vocabulary; LEGO bricks only; each prop must imply a cozy story, never decorative-only.`,
  },

  brickbot_forest_lighting: {
    format: 'simple',
    theme: `WOODLAND LIGHTING — light source + direction + color for a magical-forest LEGO MOC photo. Each entry is ONE lighting setup, 15-30 words. This lights a TABLETOP BRICK DIORAMA (not a real forest) — realistic studio-macro shadows on plastic.

VARIETY: dappled green-gold shafts through brick tree-tops / warm trans-cyan fairy-glow / amber lantern-light / trans-yellow firefly-pulse / cool moonlit-blue / dawn-mist pink / low golden-hour rake / overcast-soft even / hearth-warm interior glow / trans-cyan grotto underglow.

Each names the SOURCE + DIRECTION + COLOR + how it falls on the plastic brick surfaces. NEVER real-sun-through-real-leaves language; it's diorama studio lighting evoking the mood.`,
    touchpoints: [
      'Dappled green-gold light raking down through gaps in the brick tree-tops, casting hard-edged warm pools onto the green-plate floor with cool plastic shadow between, the classic enchanted-glade glow on the bricks',
      'Soft trans-cyan fairy-glow rising from clustered glow-elements near the hollows, under-lighting the brick toadstool caps and minifig faces in cool aquamarine, warm key-light from the side balancing it',
      'Warm amber lantern-light pooling outward from clip-rod lanterns, each lantern a hot point casting a soft circle on the brick path, deep cozy shadow beyond the lit ring',
      'Trans-yellow firefly-pulse scattered through a dusk clearing, dozens of tiny warm points at varied depths, a deep blue-violet ambient base behind them on the brick scenery',
      'Cool moonlit-blue wash over the whole diorama from high and behind, silvering the brick tree-top edges and the trans-blue stream, warm lantern accents punching small warm holes in the cool',
      'Low golden-hour rake from one side, long warm light skimming across the green-plate meadow and gilding the brick-bloom petals, long plastic shadows stretching toward camera',
      'Dawn-mist pink ambient with a soft low sun, gentle rosy light on the cream mushroom stems and a faint cotton-element ground-mist catching the glow, tender and quiet',
      'Hearth-warm interior glow from a brick fireplace, trans-orange flame casting flickering warm light across the round brick walls and the woven-tile rug, cozy and enclosed',
      'Trans-cyan grotto underglow from beneath the trans-blue pool surface, rippling cool light up the BURP-rock walls and the waterfall, a magical subterranean key',
      'Overcast-soft even light, a gentle shadowless wash that shows off every brick detail of the village evenly, the calm-cloudy-day cottagecore mood',
    ],
    instructions: `Each entry is ONE woodland lighting setup, 15-30 words. Format: free-form prose naming source + direction + color + fall on the bricks. Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: no real-sun-through-real-leaves or photoreal-atmosphere language — it lights a plastic brick diorama. No botanical vocabulary.`,
  },

  brickbot_forest_palette: {
    format: 'simple',
    theme: `WOODLAND PALETTE — color combinations for a magical-forest LEGO MOC diorama, locked to LEGO-heritage signatures. Each entry is ONE palette, 12-25 words. Names 3-5 specific LEGO-brick colors + the heritage it evokes.

VARIETY (align to registers): Elvendale teal+lavender+gold+rose / Forestmen forest-green+brown+tan / Fabuland bright-primary red+yellow+blue / Heartlake pastel-lavender+mint+pink+sand / Ideas-Treehouse natural-wood-brown+leaf-green / mushroom red+cream+spore-white / autumn orange+russet+olive+tan / fairy trans-cyan+white+pastel / sage-cottagecore sage+ochre+cream / grotto trans-blue+grey+moss-green.

Each names ACTUAL LEGO brick colors (dark-bley, olive-green, sand-green, dark-tan, trans-cyan, etc.).`,
    touchpoints: [
      'Elvendale fairy palette — teal + lavender + warm gold + blush-rose, jewel-bright and ethereal, gold-trim accents catching the light against soft pastel builds',
      'Forestmen ranger palette — forest-green + earth-brown + sand-tan, muted and rustic, the woodland-camouflage heritage of the green-hood outlaws',
      'Fabuland storybook palette — bright primary red + sunny yellow + cheerful blue with white, bold and playful, the rounded-animal-village cheer',
      'Heartlake forest palette — pastel lavender + mint-green + soft pink + sand, gentle and friendly with a few bright-coral accents, cozy-cabin warmth',
      'Ideas-Treehouse natural palette — natural wood-brown + leaf-green + a touch of dark-tan, grounded and realistic, the changeable-foliage treehouse look',
      'Mushroom-cottage palette — toadstool-red + cream + spore-white with brown stems, the iconic fairy-toadstool color story across the hamlet',
      'Autumn-woodland palette — burnt-orange + russet + olive-green + dark-tan, the seasonal turn rendered in autumn leaf-elements over earthy builds',
      'Fairy-glow palette — trans-cyan + white + soft pastel-pink, luminous and dreamy, the translucent-element magic of the dusk hollows',
      'Sage-cottagecore palette — sage-green + warm ochre + cream + soft-brown, earthy and snug, the foraging-cottage MOC mood',
      'Grotto palette — trans-blue + slate-grey + moss-green + a glint of trans-cyan, cool and hidden, the waterfall-pool color story',
    ],
    instructions: `Each entry is ONE woodland palette, 12-25 words. Format: "NAME palette — colors + mood". Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: name ACTUAL LEGO brick colors; no photoreal-color language; tie each to a woodland heritage. No botanical real-world vocabulary.`,
  },

  brickbot_forest_woodland_phenomenon: {
    format: 'simple',
    theme: `WOODLAND PHENOMENON — a 50%-gated environmental beat for a forest diorama, ALWAYS rendered IN BRICK. Each entry is ONE phenomenon, 20-40 words. It AMPLIFIES the cozy scene as a secondary focal point, never eclipses it.

VARIETY: firefly-swarm (trans-yellow round-plates on clear rods) / pollen-glow (trans-clear specks adrift) / drifting brick leaf-fall (autumn leaf-elements scattered mid-air on clear rods) / cotton-element ground-mist / trans-arc rainbow over the glade / mushroom-spore trans-white glow / fairy-dust trans-clear sparkle-trail / will-o-wisp trans-cyan orbs / butterfly-cloud (trans-piece wings) / first-snow (white round-plate dusting on brick tree-tops).

Each names the BRICK PARTS that build it + the visual impact. NEVER lighting-color-cast (separate axis). NEVER real-weather/photoreal language.`,
    touchpoints: [
      'FIREFLY SWARM — dozens of trans-yellow + trans-clear 1×1 round-plates mounted on thin clear bar-rods hovering at staggered heights across the clearing, a constellation of tiny warm points threaded through the brick scenery',
      'DRIFTING LEAF-FALL — autumn-orange + russet leaf-elements suspended on near-invisible clear rods mid-air as if drifting down, scattered across the frame at varied heights and angles, the seasonal-turn beat (static brick, never "falling/blowing")',
      'COTTON-ELEMENT GROUND-MIST — low white cotton-batting + 1×1 white round-plate haze pooling between the brick tree-trunks and over the trans-blue stream, softening the village bases, the dawn-quiet beat',
      'TRANS-ARC RAINBOW — a built arc of stacked trans-red/orange/yellow/green/blue/purple plates curving over the glade behind the village, a deliberate brick rainbow as a joyful backdrop element',
      'MUSHROOM-SPORE GLOW — clusters of trans-white + trans-clear 1×1 round-plates dotting the air around the giant toadstools as glowing spores, plus a faint trans-white haze at the caps, the enchanted-fungus beat',
      'WILL-O-WISP ORBS — three or four trans-cyan round-dome elements floating on clear rods along the path into the deep trees, each a small built orb leading the eye into the woodland, the mysterious-guide beat',
      'FAIRY-DUST SPARKLE-TRAIL — a trail of scattered trans-clear + trans-pink 1×1 round-plates and tiny gem-elements arcing behind a flitting fairy, a built sparkle-wake frozen mid-air on clear rods',
      'BUTTERFLY CLOUD — a loose cluster of trans-piece butterfly-elements on flower-stems and clear rods rising from the brick-bloom meadow, wings in trans-orange + trans-purple catching the light',
      'FIRST-SNOW DUSTING — a light scatter of white 1×1 round-plates and white plates capping the brick tree-tops, mushroom caps, and rooflines, a gentle built first-snow over the autumn village',
      'POLLEN-GLOW DRIFT — a fine scatter of trans-clear + trans-yellow 1×1 round-plates adrift between sunbeam-gaps in the brick tree-tops, a built golden-pollen haze threading the glade',
    ],
    instructions: `Each entry is ONE woodland phenomenon, 20-40 words. Format: "PHENOMENON NAME CAPS — brick-parts + visual impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One per line, NO internal newlines. STRICT BANS: never lighting-color-cast (separate axis); never real-weather/photoreal language; ALWAYS built from named brick parts; never organic-motion verbs (render as static brick suspended on clear rods).`,
  },



  // ════════════════════════════════════════════════════════
  // FANTASY PATH (2026-05-22 — third BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  brickbot_fantasy_scene_type: {
    format: 'simple',
    theme: `LEGO MOC FANTASY DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot fantasy axis system. Each entry is ONE narrative stage (the WHAT — what category of medieval-fantasy moment is this diorama?). Each entry 30-55 words.

⚠️ STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs. NO build technique vocab. NO magical phenomena. Stage + tension only.

VARIETY MANDATE — distribute across these categories (~5-8% each):
  • CASTLE SIEGE — defenders on battlements / trebuchet bombardment / battering ram at gate / scaling-ladder assault / wall-breach moment
  • DRAGON ATTACK — dragon-besieging-castle / dragon-fire raining down on village / village evacuation / refugee column fleeing
  • DRAGON LAIR — sleeping dragon on hoard of gold (Smaug-coded) / dragon hatchling in nest / lair-entrance confrontation / dragon-rider mounting
  • MOUNTED COMBAT — jousting tournament lists / cavalry charge across battlefield / mounted-knight melee / wargs-vs-horses skirmish
  • TOURNAMENT / FESTIVAL — joust pavilion + crowd / archery contest / sword-tournament / royal feast / harvest festival in medieval village
  • CORONATION / ROYAL CEREMONY — throne-room coronation / royal wedding in cathedral / knighting ceremony at altar / sword-in-stone moment / royal-procession through woods
  • WIZARD TOWER — alchemist laboratory / wizard's library / mage-tower observatory / scrying-chamber / arcane-experiment-in-progress
  • MAGE DUEL — two mages mid-spell-collision / wizards' council in war-room / necromancer summoning / cleric-vs-undead exorcism
  • ELVEN TREETOP — elven city in canopy / Rivendell-coded sanctuary / Mirkwood feast / forest-shrine encounter
  • DWARVEN MINE — Khazad-dûm / Erebor underground hall / dwarf-forge / mining-cart procession / dragon-flooded ruins
  • RANGER / ADVENTURER PARTY — D&D 4-figure party at campsite / forest-glade druid encounter / hidden-shrine discovery / bandit ambush on path
  • TAVERN INTERIOR — bard performing / drunken-brawl / quest-hire meeting / hooded-stranger in corner / wedding-night-cheer
  • DUNGEON / CRYPT — torture-chamber / treasure-vault discovery / cursed-tomb opening / prisoner-rescue / lich-throne approach
  • SKELETON UPRISING — graveyard skeletons emerging / necromancer raising dead / skeleton army marching / lich tower siege
  • COASTAL / BRIDGE DEFENSE — coastal watchtower beacon / hold-the-bridge against horde / cliff-castle attack / lighthouse warning
  • WITCH HUT / SWAMP — witch's hut on chicken-legs in poisoned marsh / coven gathered around bonfire / cauldron-brewing
  • MOUNTAIN PASS AMBUSH — orc/goblin ambush on travelers / troll-bridge confrontation / cave-troll emerging / mountain-pass skirmish
  • THRONE ROOM — kingly audience / hooded-emissary delivers ill news / coronation / banquet-feast / war-council
  • TOWN MARKET — medieval market-square / harvest festival / royal proclamation in plaza / pickpocket-vs-guard chase
  • NORTHERN-REALM / VOLCANIC — Skyrim-coded frozen realm with northern-warriors / Mordor-coded volcanic-wastes / Helm's Deep walled fortress / Minas Tirith white-city
  • STONE-CIRCLE / SUMMONING — Stonehenge-coded ritual circle / faerie-circle gathering / fey-court / underworld-portal opening
  • RUINS / SUNKEN — sunken temple in jungle / ancient-elven ruins / lost-city of dwarves / overgrown abbey
  • REFUGEE COLUMN — village evacuating dragon-attack / peasants fleeing battle / wagon-train mid-flight / camping-with-dragon-on-horizon
  • LIBRARY / SCRIPTORIUM — monastery library / scribe at parchment / wizard archivist / hidden-codex discovery

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (architecture / biome / interior)
• Suggest TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action ("knight swinging sword" — that's minifig_action axis)
• NEVER name a magical phenomenon ("fire raining down" if isolated — that's magical_phenomenon axis)`,
    touchpoints: [
      'CASTLE SIEGE WALL-BREACH — multi-tier brick-built stone castle wall taking direct trebuchet impact, splintered crenellations and dust-plates erupting outward, defenders in heraldic-tabard surcoats scrambling along the battlement rim, attackers swarming the breach from below, the moment-of-collapse',
      'DRAGON BESIEGING CASTLE — colossal brick-built dragon mid-attack on a tall castle keep, knights firing crossbows from battlements as dragon-claw grips a tower turret and wing-section dominates the upper-frame, banners torn, the dragon-vs-castle iconic moment',
      "SLEEPING DRAGON ON GOLD HOARD — vast underground lair with massive brick-built dragon coiled on a mountain of 1×1 gold round-plates and trans-purple/trans-red jewel pieces, scattered crown + chalice + weapon props across the hoard, lone hooded thief approaching the edge, Smaug-coded scene",
      "JOUSTING TOURNAMENT LISTS — wooden tournament-lists with painted heraldic banners, two armored knights on caparisoned warhorses bearing lances at full gallop down opposite sides, central tilt-rail of brick-built timber, royal pavilion with crowd in colored tunics, the moment-before-impact",
      "ELVEN TREETOP CITY — multi-level brick-built city built across three interconnected giant trees, leaf-element canopy in olive-green and dark-green, rope-bridges with rail-pieces connecting platforms, lantern-lit pavilions, elven minifigs in long-hair variants on multiple levels, Rivendell-coded sanctuary feel",
      "DWARVEN FORGE HALL — vast underground hall built from dark-bley pillars with mithril-blue accent veins, massive brick-built forge at center with trans-orange flame elements and stacked weapon-racks, dwarven minifigs in plate-armor with bearded heads working anvils, dragon-flooded-Erebor-coded heritage",
      "WIZARD'S TOWER LIBRARY — interior of a wizard's tower with brick-built bookshelves walls floor-to-ceiling, scattered scrolls + alchemical-glassware + crystal-orbs on tables, wizard minifig at a central lectern with grimoire open, trans-purple magical-residue elements drifting around the room",
      "THRONE ROOM CORONATION — vaulted throne-hall with stained-glass-pattern tile windows, central throne on raised dais with crown-bearer at the base, court attendants in heraldic livery flanking the central aisle, archbishop minifig with mitre lifting the crown, the moment-of-coronation",
      'D&D ADVENTURER PARTY CAMPSITE — forest-glade clearing with brick-built campfire (trans-orange flame cluster), four-minifig adventuring party in distinct archetypes (plate-armor fighter / hooded rogue / robed wizard with staff / cleric with mace), surrounding ancient oak trees in canopy, the night-before-the-quest beat',
      "CRYPT TREASURE VAULT — underground crypt with stone-block walls + sarcophagus-tiles around the perimeter, central altar bearing a glowing trans-purple artifact, hooded thief minifig approaching the altar from foreground, skeleton-warriors emerging from sarcophagi at frame-edges, the trap-springs moment",
      "TAVERN BARD PERFORMANCE — interior medieval tavern with timber-beam ceiling and brick-built fireplace, central bard minifig with lute on tabletop performing for crowd, drinking patrons at scattered tables with chalice + tankard props, hooded stranger in shadowy corner watching, lively festival-night feel",
      "FROZEN NORTHERN REALM HOLD — snow-covered stone hold of a Skyrim-coded northern-realm, mead-hall structure with wolf-banner heraldry, Viking-coded warrior minifigs in fur-cloaks gathered outside, brick-built standing stones at hold-perimeter, the moment-of-jarl-return-from-raid",
      'MORDOR VOLCANIC WASTES — black + dark-red volcanic landscape with brick-built basalt formations and trans-orange lava-rivers, Barad-dûr-coded tower silhouette in the deep distance with trans-red eye-of-Sauron summit, uruk-hai minifig column marching toward camera in receding perspective, LotR-Mordor-coded heritage scene',
      "HELM'S DEEP WALL DEFENSE — fortified curtain-wall of stone-fortress (Helm's Deep-coded) with parapeted battlement, defending Rohirrim minifigs along the wall with bows + spears, brick-built siege-ladders pushing up at multiple points, dramatic-fortress-defense moment, LotR heritage",
      'ROYAL WEDDING IN CATHEDRAL — vaulted gothic-cathedral interior with stained-glass-window tile-panels casting cool-blue + trans-red light onto the central aisle, royal couple at altar with archbishop officiating, court attendants flanking the aisle in heraldic livery, the vow-exchange moment',
      "MOUNTAIN PASS GOBLIN AMBUSH — narrow rocky pass between two steep cliff-walls in light-bley slope-bricks, traveler-minifigs (D&D party-coded) caught mid-stride as goblin-minifig ambushers emerge from boulder-cover with curved-blades, the moment-of-discovery",
      "WITCH'S HUT ON CHICKEN-LEGS — Baba-Yaga-coded witch's hut perched on giant brick-built chicken-legs in a poisoned-purple marsh baseplate, skull-fence perimeter around the hut, witch minifig with broom at the doorway, bubbling trans-green cauldron outside, cursed-marshland feel",
      "STONE CIRCLE RITUAL — Stonehenge-coded ring of vertical light-bley stone-monoliths on a moonlit moor baseplate, druid-coded minifigs in dark-green robes gathered around a central altar-stone, trans-magenta magical-light emerging from the altar, ritual-summoning moment",
      "FOREST GLADE DRUID ENCOUNTER — sun-dappled glade between giant oaks with brick-built moss-covered shrine-stone at center, druid-minifig in dark-green robes with antler-headdress at the shrine, deer-minifig and forest-creatures approaching peacefully, sacred-nature moment",
      "RANGERS' WATCHTOWER — wooden Forestmen-coded watchtower built into the canopy of a giant oak with leaf-element foliage, Forestmen-green-hood ranger minifigs at the platform with bows drawn, the lookout-spotting-orcs-on-horizon moment",
      "REFUGEE COLUMN FLEEING DRAGON — narrow road through hillside with wagons + peasants + livestock mid-flight, lookout-pointing-back at a brick-built dragon silhouette appearing over the deep-distance mountain ridge with smoke-column from a burning village behind, the moment-of-realization",
      "DUNGEON PRISONER RESCUE — torch-lit stone-dungeon corridor with iron-bar cell at frame-edge, prisoner-minifig inside reaching out as rogue-minifig at the cell-door works the lock with thieves-tools, guard-minifig slumped unconscious at the corridor end, the rescue-moment",
      'NECROMANCER SUMMONING — interior of a black-stone necromancer-tower with central pentagram-floor in trans-purple tiles, necromancer-minifig with skull-staff at the pentagram, skeletons rising from the floor pattern, dark-arts ritual moment',
      "FAERIE COURT — LEGO Elves-coded enchanted glade with brick-built mushroom-pavilions in bright-pinks + trans-purple + trans-green, faerie-minifigs (Elves-line-coded) gathered around a crystal-throne, the welcoming-quest-givers moment in pastels",
      'COASTAL CLIFF WATCHTOWER — coastal-cliff fortress on edge of high cliff-face, crashing trans-blue wave-elements against rocks below, beacon-fire trans-orange flame at watchtower peak, garrison minifigs in heraldic-livery on the walls, the warning-signal moment',
      "HORSEMEN COURIER PURSUIT — riders on caparisoned warhorses mid-gallop across an open field, courier-minifig in front with scroll-tube clutched in C-hand, two pursuing knight-minifigs behind in heavy plate-armor with lances couched, the chase-mid-pursuit moment",
      "BANDIT AMBUSH ON CARRIAGE — wooded roadside with brick-built royal-carriage caught mid-stop, bandit-minifigs leaping from the foliage with raised weapons, driver-minifig mid-reach for crossbow, the highway-robbery moment",
      "GOLEM AWAKENING — brick-built stone-golem on an altar-platform in an ancient ruin, alchemist-minifig at the activation-runes side-panel, faint trans-cyan magical-light emerging from the golem's chest-cavity, the awakening-moment",
      "MEDIEVAL MARKET SQUARE — bustling town-square with brick-built stalls + vendors in heraldic livery, royal-proclamation tile being read aloud at a central pillar, pickpocket-minifig mid-grab on a noble's coin-purse, guard-minifig mid-turn toward the disturbance, daily-life-with-crime moment",
      "ROYAL HUNT IN FOREST — forest-floor with royal-hunting-party on caparisoned warhorses, lead horseman with bugle-horn raised, hunting-hounds mid-bound after a deer-minifig fleeing into the deep-distance trees, the hunt-mid-chase moment",
    ],
    instructions: `Each entry is ONE fantasy narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language; never include minifig action verbs ("knight swinging sword" — that's the minifig_action axis); never include isolated magical phenomena ("fire raining down by itself" — that belongs to magical_phenomenon axis); never include lighting descriptors. Stage + tension only. NEVER LEGO Star Wars references. NEVER LEGO Harry Potter references (out of scope for BrickBot fantasy).`,
  },

  brickbot_fantasy_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot fantasy path. Each entry is a freeze-frame of minifigs IN MID-ACTION. Each entry 25-45 words.

⚠️ STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Fantasy-specific verbs: mid-charge, mid-cast, mid-archery-loose, mid-lance-impact, mid-shield-bash, mid-spell-blast, mid-coronation-bow, mid-banquet-toast, mid-skeleton-rise, mid-rescue-of-prisoner, mid-dragon-strike, mid-leap-from-saddle, mid-fall-from-battlement, mid-dive-into-treasure-pile, mid-ritual-incantation, mid-bow-from-elven-platform, mid-hammer-strike-at-forge.

⚠️ HARD BANS:
  • NEVER "knights standing around"
  • NEVER "wizard posing in tower"
  • NEVER "characters watching / gazing at"
  • NEVER passive states

Body-position variety:
  • Mid-charge / mid-lance / mid-melee (~20%)
  • Mid-cast / mid-spell-blast (~15%)
  • Mid-archery / mid-crossbow-fire (~10%)
  • Mid-mount-leap / mid-fall-from-horse (~10%)
  • Multi-figure interaction (rescue, duel, party-gathering, brawl) (~20%)
  • Mid-discovery / mid-treasure-grab (~10%)
  • Mid-ceremony (coronation / wedding / knighting / vow) (~10%)
  • Mid-skeleton-rise / mid-undead-emergence (~5%)

Each entry:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs (knight, wizard, ranger, dragon-rider, princess, bard, dwarf, elf, orc, skeleton, etc.) with brief identifier (heraldic surcoat / robed / hooded / armored)
• Describe SHARED OBJECT or EVENT (lance / spell-vortex / treasure-chest / dragon-claw / spell-bolt / portcullis-falling / etc.)
• Imply moment-before and moment-after
• PLASTIC SCALE — minifig anatomy (C-shaped hands / two-stud arms / printed visor)`,
    touchpoints: [
      "Mid-lance-impact between two armored knights on caparisoned warhorses at tournament lists, leading knight's lance shattering trans-clear bar-element splinters spraying outward, opponent rocking back in saddle, the freeze-moment of impact",
      "Mid-cast of a fireball spell by a robed wizard minifig with C-grip on twisted-staff, trans-orange + trans-red flame elements erupting from staff-tip, foreground orc-minifig mid-recoil with raised shield, the moment-of-impact",
      "Mid-archery-loose of an arrow by a Forestmen-green-hood ranger minifig with bow drawn from cover behind a tree-trunk, target orc-minifig on path ahead mid-step, arrow trans-clear bar-element trailing mid-flight",
      "Mid-charge of armored cavalry across a battlefield, lead knight on caparisoned warhorse with banner-bearer beside, lances couched forward, second-rank riders behind with raised swords, the moment-of-impact-on-enemy-line",
      "Mid-leap from rampart of an armored knight onto an attacker's siege-ladder, sword raised overhead in C-grip, attackers below mid-recoil, the dramatic-counter-attack moment",
      "Mid-skeleton-rise from a moonlit graveyard, lead skeleton-minifig with bone-torso and skull-head emerging from broken-tombstone, second skeleton behind clawing up from earth, gravedigger-minifig at frame-edge mid-flee-in-terror",
      "Mid-coronation-bow as the kingly minifig kneels at the altar dais with crown-bearer mid-lift of golden crown overhead, archbishop-minifig in mitre with C-hands held out in blessing, court attendants flanking in heraldic-livery mid-bow",
      "Mid-rescue of a chained prisoner-minifig by a rogue-minifig in hooded cloak working the cell-lock with thieves-tool, prisoner reaching out through bars in C-grip, unconscious guard-minifig slumped at corridor end",
      "Mid-spell-blast collision between two mages mid-duel, robes flying as one mage's trans-purple spell-bolt meets the other's trans-cyan counter-spell with sparks of trans-yellow at the collision-point, both mages mid-recoil",
      "Mid-dragon-strike as colossal brick-built dragon's claw grips a tower turret crumbling brick-fragments mid-fall, defending knight minifig at the window mid-lance-thrust into the dragon's wrist, the iconic knight-vs-dragon moment",
      "Mid-hammer-strike at the dwarven forge by a bearded dwarf-minifig in plate-armor, hammer mid-arc descending toward glowing trans-orange weapon on the anvil, sparks (trans-yellow 1×1 round-plates) bursting at impact",
      "Mid-dive-into-treasure-pile by hooded thief-minifig with arms outstretched onto a hoard of 1×1 gold round-plates and trans-purple jewel-pieces, sleeping dragon's eye opening in the deep-distance behind the pile, the moment-before-discovery",
      "Mid-bow-from-elven-platform as an elven-archer minifig with long-hair-piece releases an arrow from a high treetop platform, target orc-minifig on the forest-floor below mid-fall, second elf at frame-edge mid-nock of another arrow",
      "Mid-banquet-toast in a royal hall, kingly minifig at the head of long-table mid-raise of chalice C-grip, court attendants at the table mid-cheer, bard-minifig with lute mid-strum in the background, festive-feast moment",
      "Mid-ritual-incantation at a Stonehenge-coded stone-circle, druid-minifigs in dark-green-robes with antler-headdress C-grips raised overhead, central altar-stone mid-glow trans-magenta, fey-mist elements drifting from the stones",
      "Mid-charge of orc-horde across a battlefield with brandished weapons, lead orc-minifig with curved-blade overhead mid-roar, surrounding orcs in fur-and-leather attire mid-stride, distant brick-built siege-tower in receding perspective behind",
      "Mid-shield-bash by a paladin-minifig in gold-trim-armor against a hellhound-creature, shield mid-impact against the beast's snout, sword in other C-hand mid-thrust forward, the divine-combat moment",
      "Mid-portcullis-fall as the iron-gate descends from the brick-built castle gatehouse cutting off two attacker-minifigs from the inner courtyard, gate-keeper-minifig at the chain-mechanism mid-pull, the moment-of-cutoff",
      "Mid-leap-from-saddle by a knight-minifig dismounting at full gallop, warhorse continuing past as the knight lands mid-stride sword raised, target enemy-knight in armored opponent mid-react-to-incoming-attack",
      "Mid-coin-throw by a bard-minifig finishing a tavern performance, tossed 1×1 gold round-plates arcing through the air toward an outstretched hat at the foot of the tabletop-stage, drunken patrons mid-applaud around tables",
      "Mid-portal-step by a wizard-minifig stepping through a trans-cyan + trans-violet magical-portal disc, one C-hand still on this side gripping a staff, the other C-hand emerging on the other side reaching forward, half-vanished mid-traversal",
      "Mid-staff-block as a hooded druid-minifig parries an attacking orc's blade with a quarterstaff held cross-grip, second druid behind mid-charge of a healing-spell trans-green hands-glow overhead, defending-the-shrine moment",
      "Mid-throw of a torch by a fleeing peasant-minifig into a haystack-pile to set warning-fire as dragon-shadow looms over the village in deep-distance, trans-orange flames bursting from the strike-point, the village-warning moment",
      "Mid-falling-from-battlement of an arrow-struck attacker-minifig from the top of a brick-built castle wall, body mid-arc downward, trans-clear bar-arrow still protruding from chest-print, defender at the battlement mid-nock of next arrow",
      "Mid-hostage-rescue as a paladin-minifig sweeps a captured-princess-minifig into one C-hand mid-stride away from a collapsing dungeon corridor, pursuing skeleton-minifigs mid-fall behind from the collapse, the dramatic-rescue moment",
      "Mid-troll-uppercut by a giant brick-built cave-troll's massive C-hand sending a knight-minifig mid-air arcing back, knight's shield mid-spin away from grip, distressed companion knight on the ground mid-shout warning",
      "Mid-dragon-mount-takeoff as a dragon-rider minifig in saddled brick-built dragon at the cliff-edge, dragon's wings mid-down-beat trans-orange wing-tip embers, ground falling away in deep-distance, the moment-of-launch",
      "Mid-sword-pull-from-stone by a young squire-minifig with both C-hands on the hilt of a sword embedded in a moss-covered altar-stone, surrounding court mid-gasp as the blade mid-emerge, the King-Arthur-coded moment",
      'Mid-mage-summoning of a winged-creature in the central pentagram of a wizard\'s tower, mage-minifig C-hands held wide in incantation gesture, trans-purple magical-bird emerging from the pentagram center, the calling-the-familiar moment',
      "Mid-toss of a trans-purple magical-orb between two D&D-party-minifigs mid-combat, fighter-minifig in front mid-receive of the orb with both C-hands raised, wizard-minifig behind mid-launch with sleeves-trailing, party-coordination beat",
    ],
    instructions: `Each entry is ONE fantasy minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "knights standing", NO "wizard posing", NO "watching / looking at", NO passive states. Story beat + verb + cause/effect always. NEVER Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_build_technique: {
    format: 'simple',
    theme: `LEGO FANTASY MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot fantasy path. Each entry is ONE specific MOC technique that makes a fantasy diorama read as "Bricklink AFOL champion build" instead of "official LEGO Castle set photo." Each entry 25-45 words.

VARIETY MANDATE — distribute across:
  • SNOT castle-wall curvature (cylindrical-tower curves / arched-gate spans / vaulted-ceiling SNOT)
  • Brick-built dragon construction (articulated wings via Technic / scaled-hull with cheese-slope detailing / poseable neck via ball-joints)
  • Tree-canopy + foliage techniques (Bricklink Forestmen tree / leaf-element saturation / brick-built bark texture)
  • Trans-piece magical effects (trans-purple spell-vortex stacked plates / trans-cyan magic-portal disc / trans-orange dragon-fire cluster)
  • Technic articulation (drawbridge mechanism / portcullis chain / siege-engine arm / dragon-wing fold)
  • Illegal techniques (brick-bending for organic curves / clutch-power-on-tile / 1×2 mod for irregular stone)
  • Microscale tricks (minifig-accessory repurposed as macro-detail: lightsaber-hilt as banner-pole, croissant as decorative-flourish, dragon-wing piece as cathedral-corbel)
  • Printed-tile signature pieces (heraldic banner-tiles / printed map-tile / stained-glass window-tile)
  • Studded-vs-tile texture contrast (studded wood-floor / tiled smooth-stone)
  • Cathedral / arch construction (Gothic vault-bricks / flying-buttress brackets / stained-glass window-tiles)
  • Brick-built creatures (cave-troll / giant-spider / griffin / unicorn / direwolf / goblin-army)
  • Forest-floor texture (moss-element coverage / fallen-log brick-pieces / mushroom-element clusters)
  • Stone-circle / ruin texture (worn-monolith stack-and-shift / collapsed-pillar at angle)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH FANTASY BUILD ELEMENT it applies to (castle wall / dragon body / tree canopy / spell-effect / etc.)
• Specify SPECIFIC BRICK PARTS used (named: 1×2 cheese slope / Technic axle-pin / trans-orange flame element / leaf-element-piece)
• Imply the visual IMPACT`,
    touchpoints: [
      'SNOT-curved castle tower wall — cylindrical castle-tower built with sideways-stud bracket-plates turning 2×4 curved-slope bricks in concentric horizontal rings, mortar-line tile-offset every third ring for masonry-realism, the AFOL Bricklink-MOC cylindrical-tower signature',
      "Brick-built articulated dragon wings — dragon wings constructed from Technic axle-pin spine + clip-and-bar membrane supports, large trans-clear or trans-blue 1×4 wing-panel pieces fanned outward, ball-joint at shoulder allowing pose-variation, AFOL-dragon canon",
      "Bricklink Forestmen tree canopy — giant-oak tree-canopy built from clip-and-bar branches with dense leaf-element-piece coverage in olive-green + dark-green + autumn-orange leaf-clusters, exposed trunk built from brown round-bricks with brick-edge cracks for bark-texture",
      "Trans-purple spell-vortex stack — magical-spell-vortex built from trans-purple + trans-magenta + trans-clear 1×2 + 1×4 plate-strips stacked at progressive angles in spiral pattern, with 1×1 round-plate trans-violet spark-elements drifting at the edges, the AFOL spell-fx signature",
      "Trans-orange dragon-fire cluster — dragon-fire breath built from clustered trans-orange + trans-red + trans-yellow 1×1 flame-elements at dragon-muzzle with progressively-spaced cluster cone trailing outward into the air, trans-clear smoke-shimmer at outer edge",
      "Technic-articulated drawbridge — castle gatehouse drawbridge mounted on Technic axle-pin pivot at the inner-wall hinge, brick-built chain mechanism extending up to a winch-housing built into the gatehouse, allowing real-articulation up-and-down motion",
      'Illegal brick-bending stone — organic-curving stone-wall section built using illegal brick-bending technique (1×2 plates pressure-stacked into a gentle arc) for natural worn-stone irregularity, AFOL-purist illegal MOC pride',
      "Microscale lightsaber banner-pole — repurposed minifig lightsaber-blade pieces (technically Star Wars accessory, used as generic LEGO part here) inserted as flagpoles holding printed heraldic-banner tiles overhead castle ramparts",
      "Studded floor + tiled stone contrast — castle great-hall floor built with exposed-stud studded wooden-plank palette (brown 2×2 plates) for the central hearth-zone and tiled smooth-grey 2×2 tiles for the marble-flagstone walking-zones, visual contrast separating ceremonial vs daily-use",
      "Gothic vault-rib construction — cathedral or grand-hall vaulted ceiling built using SNOT bracket-plates turning curved-slope bricks downward to form intersecting vault-ribs, stained-glass-pattern tile-windows mounted in the upper-clerestory level",
      "Brick-built cave-troll body — colossal cave-troll figure built from large dark-bley + dark-tan slope-bricks for a hunched-bipedal form, Technic ball-joints at shoulders + elbows for poseable arms, single 2×2 round-eye element in trans-yellow on the head",
      "Brick-built giant-spider — giant arachnid built from a central dark-bley dome-body with eight Technic-articulated legs in 1×1 hinge-plates with claw-tip dark-brown 1×1 cones, trans-red 1×1 round-plate eyes clustered at the head",
      "Heraldic banner-tile signature — printed heraldic-banner tile (Crusaders red+white / Forestmen green+brown / Black Knights black / Dragon Knights red-with-dragon / Royal Knights gold+blue) mounted on antenna-pole flagstaff above the castle ramparts, faction-identity anchor",
      "Stained-glass window-tile cathedral — Gothic cathedral interior with floor-to-ceiling stained-glass window built from 1×2 + 1×4 trans-clear + trans-red + trans-yellow + trans-violet + trans-cyan plate-strips arranged in geometric rosette pattern, cool-tinted light streaming inward",
      "Mushroom-element forest-floor cluster — woodland-floor scene built with scattered red-and-white mushroom-element pieces, brown 1×1 round-plates as fallen-leaves, scattered olive-green moss-coverage and 1×1 cone-bricks as pebbles, AFOL forest-detail signature",
      "Brick-built portcullis chain mechanism — castle-gate portcullis built from vertical Technic-rod bars in dark-bley with horizontal supports, two-link chain pieces running from the top of the gate up through the gatehouse to a winch-mechanism, AFOL functional-gate signature",
      "Bricklink-AFOL siege-engine — trebuchet built from Technic-beam frame with a counterweight-arm balanced on a Technic-axle pivot, leather-cup at the end built from clip-and-bar with hide-element pouch, AFOL siege-engine canon",
      'SNOT-curved arched gateway — castle gatehouse arch built with SNOT bracket-plates turning curved-slope bricks at the apex, sandstone-coded tan slope-brick mosaic in the arch-stones, masonry-realism technique',
      "Brick-built unicorn — bone-white pearl-finish unicorn figure built from large white slope-bricks for the body, trans-pearl-white horn element on the head, articulated Technic-joints in the legs, LEGO Elves-coded mount",
      "Stone-circle worn-monolith stack — Stonehenge-style monolith built from stack-and-shifted light-bley + dark-bley slope-bricks for worn-weathered texture, irregular shape achieved by 1×2 jumper-plate offsets, AFOL ruins-canon",
    ],
    instructions: `Each entry is ONE MOC fantasy-build technique, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "3D-print / paint / glue"); LEGO bricks only. Name SPECIFIC part types.`,
  },

  brickbot_fantasy_camera_framing: {
    format: 'simple',
    theme: `FANTASY-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the fantasy path. Each entry is ONE camera position + framing rule specific to medieval-fantasy diorama subject matter. Each entry 15-30 words.

VARIETY MANDATE — distribute across:
  • Battlement-down (looking down from castle wall at attackers below)
  • Throne-room-establishing (down the central aisle toward the throne)
  • Dragon-POV (looking from dragon's eye toward defending knights)
  • Forest-glade-through-trees (camera among tree-trunks looking into clearing)
  • Cliff-castle-aerial (high-angle overlooking castle complex)
  • Under-archway-discovery (camera at gateway looking inward at scene)
  • Portcullis-low (camera ground-level looking up at gate / drawbridge)
  • Chapel-altar-down-aisle (cathedral aisle toward altar with stained-glass behind)
  • Dragon-lair-vertigo (camera looking down into vast cavern from height)
  • Jousting-lists-broadside (camera between two charging knights at impact-point)
  • Forest-canopy-down (camera looking down from treetop city to forest floor)
  • Mountain-pass-narrows (camera in narrow pass looking outward at framed party)
  • Crypt-passage-receding (camera in crypt corridor looking down receding passage)
  • Tavern-corner-establishing (camera in tavern corner looking across the room)
  • Stone-circle-aerial (overhead aerial at the ring of stones from above)
  • Witch-hut-low-skewed (camera tilted to match chicken-legs-leaning hut)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element this angle DRAMATIZES
• Reference fantasy-specific scenery elements (battlement / throne / dragon / archway / forest-canopy / etc.)`,
    touchpoints: [
      'BATTLEMENT-DOWN OVERLOOK — camera at the top of a castle wall looking straight down at attackers swarming the base, attackers in receding perspective, defenders mid-action at the parapet rim foreground, the wall-dominates-attackers viewpoint',
      "THRONE-ROOM ESTABLISHING DOWN-AISLE — camera at the far end of the throne-hall looking down the central aisle toward the throne at the deep-distance, court attendants flanking in heraldic-livery, throne-bearer mid-action at the dais",
      "DRAGON'S-EYE POV — camera positioned at the dragon's head-level looking outward at defending knights, knight-minifigs small in mid-distance with raised weapons, the predator-perspective viewpoint",
      "FOREST-GLADE THROUGH-TREES — camera positioned among foreground tree-trunks looking into a sun-dappled forest-glade where a druid encounter or party-camp is centered, trunk-frames the action on left and right",
      "CLIFF-CASTLE AERIAL ESTABLISHING — high-angle aerial looking down at a castle complex perched on cliff-edge, the castle-walls and courtyard visible from above, ocean or valley dropping away in deep-distance",
      "UNDER-ARCHWAY DISCOVERY — camera positioned at a gateway-arch looking inward at a courtyard or great-hall scene, the arch frames the interior like a vignette, depth into the courtyard receding",
      "PORTCULLIS-LOW UP-GATE — camera at ground-level just outside the castle gate looking up at the iron portcullis and gatehouse arch overhead, the gate dominating the upper-frame, looming-castle viewpoint",
      "CHAPEL-ALTAR DOWN-AISLE — cathedral interior with camera at the back of the nave looking down the long aisle toward the altar, stained-glass-window panels casting cool-tinted light, ceremony in foreground silhouettes",
      "DRAGON-LAIR VERTIGO DOWN-INTO-CAVERN — camera at a high cavern-ledge looking down into a vast underground lair below, sleeping dragon and treasure-hoard visible at the cavern-floor center, vertigo-inducing scale",
      "JOUSTING-LISTS BROADSIDE — camera in the open space between two charging knights at the moment-before-impact, both knights visible in profile silhouette left and right with lances couched, tournament-tilt-rail in deep-distance",
      "FOREST-CANOPY DOWN-TO-FLOOR — camera at a high treetop platform looking straight down through the canopy to the forest-floor below, scattered figures and shrine-stone visible far below through the leaf-element gaps",
      "MOUNTAIN-PASS NARROWS — camera in a narrow rocky pass between two steep cliff-walls looking outward, the pass framing a small party of travelers in the mid-distance approaching, claustrophobic-pass viewpoint",
      "CRYPT-PASSAGE RECEDING — camera at the entrance of a torch-lit crypt corridor looking down its receding length, sarcophagi flanking the corridor at intervals, action at the far end in deep-distance",
      "TAVERN-CORNER ESTABLISHING — camera positioned in one corner of a tavern looking diagonally across the room, foreground table with patrons, central bard-performance space, far-corner shadowy hooded-stranger",
      "STONE-CIRCLE AERIAL OVERHEAD — high overhead aerial looking straight down at a ring of standing stones on a moonlit moor, druid-circle inside the ring, the ring-pattern visible from above, ritual-overhead viewpoint",
      "WITCH-HUT LOW-SKEWED DUTCH-TILT — camera tilted to match the chicken-legs lean of a Baba-Yaga witch-hut, the canted-hut silhouette dominates the upper-frame, swamp-foreground at low-camera, off-kilter unsettled feel",
      "GREAT-HALL FEAST-LONG-TABLE — camera at one end of a long banquet-table looking down its length, kingly-minifig at the far-end head-of-table, court attendants flanking the table in heraldic-livery, the feast-extending viewpoint",
      "DUNGEON-CELL FROM-INSIDE — camera positioned inside a cell looking out through iron-bars at the corridor, rescuing rogue-minifig at the cell-door with prisoner-minifig in foreground silhouette",
      "WIZARD-TOWER-STAIRWELL SPIRAL-UP — camera at the bottom of a spiraling-stairwell looking up the inside of a wizard's tower, stairs spiraling up through multiple levels, the height-of-the-tower viewpoint",
      "MOUNTED-CAVALRY-CHARGE LOW-FRONTAL — camera ground-level in the path of a charging cavalry unit, lead horseman with lance couched bearing down on camera, second-rank riders behind in receding perspective, the impact-imminent viewpoint",
      "DWARVEN-FORGE-HALL CENTRAL-FIRE-PIT — camera at the great forge-fire center of a dwarven hall looking outward at the surrounding columns and anvil-stations, dwarven-minifigs at multiple anvils, the heart-of-the-hall viewpoint",
      "BRIDGE-DEFENSE LOW-ANGLE — camera at one end of a narrow bridge looking down its length toward defenders holding the far-end against a horde of attackers approaching, the choke-point viewpoint",
      "REFUGEE-COLUMN OVERHEAD-FROM-RIDGE — camera on a high ridge looking down at a refugee-column on the road below, wagons + livestock + peasants visible in receding perspective, the dragon-shadow looming on the horizon viewpoint",
      "ELVEN-TREETOP-PLATFORM EDGE — camera at the edge of an elven treetop platform looking outward over the forest canopy, elven-archer minifig in foreground looking out into deep-distance forest below, the sentinel viewpoint",
      "NECROMANCER-PENTAGRAM OVERHEAD-DOWN — camera directly overhead a trans-purple pentagram-floor with skeletons rising from the pattern, necromancer-minifig at the pentagram center, the ritual-overhead viewpoint",
    ],
    instructions: `Each entry is ONE fantasy-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms without fantasy-specific anchoring — every entry must reference fantasy scenery (battlement / throne / dragon / archway / canopy / portcullis / etc.).`,
  },

  brickbot_fantasy_subject_focus: {
    format: 'simple',
    theme: `FANTASY SUBJECT-FOCUS — silhouette anchor for the fantasy path. Each entry is ONE specific subject category: MOUNT (with rider) OR STRUCTURE (castle/tower/lair) OR NO-VEHICLE INTERIOR (throne-room/tavern/dungeon) OR NO-VEHICLE LANDSCAPE (forest/mountain/wasteland). Each entry 12-30 words.

⚠️ STORY-TENSION MANDATE — every entry MUST embed action-tension in the bracketed phrase or body (mid-charge / mid-discovery / mid-confrontation / mid-arrival / mid-coronation etc.). No bare scene-establishing.

VARIETY MANDATE — distribute as:
  • ~30% MOUNTS — warhorse + rider / dragon-rider on dragon / griffin-rider / unicorn / pegasus / wolf-rider (Forestmen) / direwolf-mount / war-elephant / mammoth / hippogriff
  • ~25% STRUCTURES — castle keep / wizard-tower / dragon-lair / cathedral / dwarven-hold / elven-treetop-city / coastal-fortress / Helm's-Deep-coded fortress / Minas-Tirith-coded white-city / Mordor-coded Barad-dûr tower / witch's hut
  • ~25% NO-VEHICLE INTERIORS — throne-room / tavern / wizard-library / dungeon / cathedral nave / dwarven-forge-hall / treasury / crypt / chapel / royal-court
  • ~20% NO-VEHICLE LANDSCAPES — forest-glade / mountain-pass / cursed-marsh / snowy-northern-realm / volcanic-wastes / Stonehenge-circle / coastal-cliff / desert-mesa

Each entry must:
• Begin with either "mount (...)" / "structure (...)" / "no-vehicle interior (...)" / "no-vehicle landscape (...)"
• Embed action-tension descriptor in the bracketed phrase
• Specify what fills the foreground / midground / deep-distance`,
    touchpoints: [
      'mount (warhorse mid-cavalry-charge) — caparisoned brick-built warhorse with armored knight-minifig in saddle, lance couched mid-charge across battlefield, banner-bearer warhorse pacing alongside, distant siege-fortress in deep-distance',
      'mount (dragon-rider mid-takeoff) — dragon-rider minifig in saddle on a colossal brick-built articulated-wing dragon at the cliff-edge, dragon-wings mid-down-beat trans-orange wing-embers, ground falling away in deep-distance',
      'mount (griffin-rider mid-dive) — griffin (fused eagle-front + lion-back brick-built) with elven-archer minifig in saddle mid-dive over a deep-valley, target far below in mid-distance, the bird-of-prey-mid-attack moment',
      'mount (wolf-rider mid-ambush) — Forestmen wolf-rider (green-hood ranger minifig on direwolf-mount) mid-leap from forest-undergrowth onto a road-traveler, second wolf-rider mid-charge behind, the ambush-springs moment',
      'mount (unicorn mid-wood-encounter) — LEGO Elves-coded bone-white unicorn with elven-rider minifig in pastel-robes pausing at a forest-shrine, faerie-creatures clustered at the unicorn-hooves, the welcome-the-questgivers moment',
      'mount (war-elephant mid-siege-arrival) — armored war-elephant (Indian-elephant-coded with howdah-tower on back) mid-stride toward enemy lines, elephant-driver minifig at the neck, archer-minifigs in the howdah-tower mid-fire, the siege-machine arrival',
      'mount (mammoth mid-northern-realm-charge) — fur-clad mammoth (Skyrim/LotR-coded) with northern-warrior-minifig in saddle mid-charge across snowy expanse, trampling snow-particle white-round-plates, the Frostmaul-coded arrival',
      'mount (skeleton-warhorse mid-undead-ride) — skeleton-warhorse (white-bone construction) with skeleton-knight-minifig in tattered cloak mid-gallop across a moonlit moor, second skeleton-rider behind, the unholy-procession moment',
      'mount (hippogriff mid-rescue) — hippogriff (eagle-front + horse-back brick-built) with ranger-minifig in saddle mid-swoop to grab a falling traveler-minifig from a cliff-edge mid-air, dramatic rescue moment',
      "structure (castle keep mid-siege) — multi-tier brick-built stone castle keep dominating 60% of frame, defenders in heraldic-tabard at battlements, trebuchet-bombardment trans-orange impact erupting from one section, mid-engagement",
      "structure (wizard-tower mid-thunderstorm) — tall narrow brick-built wizard's tower dominating frame, conical roof + crow-step gables + crystal-orb finial, lightning trans-white striking the tower-top, lone wizard at the highest window casting back, dramatic-night",
      "structure (dragon-lair mid-discovery) — vast underground cavern lair with massive brick-built dragon coiled on a hoard of gold-piles dominating frame, lone hooded-thief minifig approaching from foreground, the moment-before-the-dragon-wakes",
      "structure (cathedral mid-coronation) — vaulted Gothic cathedral exterior with stained-glass windows dominating frame, sun-shafts streaming through, royal-procession arriving at the great doors, banner-bearers and trumpeters mid-arrival, the coronation-day moment",
      "structure (dwarven-hold mid-feast) — colossal brick-built dwarven-hold facade carved into a mountain-face dominating frame, great-doors thrown open with trans-orange forge-glow spilling outward, dwarven-minifigs at the gates mid-welcome, Erebor-coded heritage",
      "structure (elven-treetop-city mid-festival) — interconnected elven treetop city across three giant oaks dominating frame, leaf-canopy + rope-bridges + lantern-lit pavilions, elven-minifigs gathered on platforms mid-festival, Rivendell-coded sanctuary mid-celebration",
      "structure (coastal-fortress mid-beacon-light) — coastal cliff-fortress dominating frame with crashing trans-blue wave-elements against rocks below, trans-orange beacon-fire at watchtower peak mid-burn, warning-signal mid-relay",
      "structure (witch's hut mid-cauldron-brew) — Baba-Yaga witch's hut on giant brick-built chicken-legs dominating frame in a poisoned-purple marsh, skull-fence perimeter, witch-minifig at doorway mid-stir of bubbling trans-green cauldron",
      "structure (Mordor-Barad-dûr mid-rise) — colossal black volcanic-stone tower dominating frame with trans-red eye-of-Sauron at the summit, dark mountain ridge framing left and right, the LotR-Mordor mid-tower-active moment",
      'no-vehicle interior (throne-room mid-coronation) — vaulted throne-hall interior with central throne on raised dais, court attendants flanking the aisle in heraldic-livery, archbishop-minifig in mitre mid-lifting of golden crown, the coronation-moment',
      'no-vehicle interior (tavern mid-bardic-performance) — medieval tavern interior with timber-beam ceiling + brick-fireplace, central bard-minifig with lute on tabletop performing for crowd, drunken patrons at scattered tables, lively-night-mid-song moment',
      'no-vehicle interior (dungeon mid-rescue) — torch-lit stone-dungeon corridor with iron-bar cells flanking the path, prisoner-minifig inside one cell reaching out, rogue-minifig at the cell-door working the lock, unconscious guard slumped at corridor end, mid-escape',
      'no-vehicle interior (wizard-library mid-discovery) — wizard tower library with floor-to-ceiling brick-built bookshelves, wizard-minifig at a central lectern with grimoire open, trans-purple magical-residue elements drifting, the moment-of-arcane-revelation',
      'no-vehicle interior (dwarven-forge-hall mid-hammer-strike) — massive underground dwarven forge-hall with central anvil-stations + trans-orange flame elements, lead dwarf-minifig mid-hammer-strike on glowing weapon, sparks bursting outward, working-forge mid-strike',
      'no-vehicle interior (royal-treasury mid-thievery) — torch-lit treasury vault filled with stacks of 1×1 gold round-plates + trans-purple/trans-red jewel-pieces, hooded thief-minifig mid-treasure-grab, alarm-trigger trans-yellow lights mid-flash, the heist-mid-discovery',
      "no-vehicle interior (crypt mid-skeleton-rise) — stone crypt with sarcophagus-tiles around the perimeter, central altar with glowing trans-purple artifact, skeleton-warriors mid-rise from sarcophagi, hooded thief-minifig at the altar mid-recoil, the trap-springs moment",
      'no-vehicle landscape (forest-glade mid-druid-encounter) — sun-dappled forest-glade between giant oaks with moss-covered shrine-stone at center, druid-minifig in dark-green-robes at the shrine, deer-minifig approaching, sacred-nature moment',
      'no-vehicle landscape (mountain-pass mid-goblin-ambush) — narrow rocky pass between steep cliff-walls in light-bley slope-bricks, traveler-minifigs caught mid-stride as goblin-minifig ambushers emerge from boulder-cover, mid-discovery moment',
      'no-vehicle landscape (cursed-marsh mid-witch-cackle) — poisoned-purple marsh baseplate with bone-fence-posts dotting the foreground, witch-minifig with broom mid-cackle at the foreground, trans-green will-o-the-wisp elements drifting, swamp-bog moment',
      'no-vehicle landscape (snowy-northern-realm mid-Viking-return) — snow-covered hills with brick-built standing stones on the ridge, Viking-coded warrior-minifigs in fur-cloaks mid-stride along the road toward a distant mead-hall, the jarl-returning-from-raid moment',
      'no-vehicle landscape (volcanic-wastes mid-uruk-march) — Mordor-coded volcanic landscape with black + dark-red basalt formations and trans-orange lava-rivers, uruk-hai-minifig column marching toward camera in receding perspective, distant Barad-dûr tower silhouette, LotR-Mordor heritage',
      'no-vehicle landscape (Stonehenge-circle mid-ritual) — ring of vertical light-bley stone-monoliths on a moonlit moor baseplate, druid-coded minifigs in dark-green-robes gathered around a central altar-stone, trans-magenta magical-light at the altar-center, ritual-mid-incantation',
    ],
    instructions: `Each entry is ONE fantasy subject-focus anchor, 12-30 words. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~30% mounts / ~25% structures / ~25% no-vehicle interiors / ~20% no-vehicle landscapes. STRICT BANS: never mix subject-types within an entry; never include camera-framing language; always embed action-tension. NEVER LEGO Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_register: {
    format: 'simple',
    theme: `FANTASY REGISTER — high-fantasy archetype lock for each render. Each entry is ONE high-fantasy faction/aesthetic described by VISUAL SIGNATURE (colors / emblems / attire / weapons), NOT by movie/book/video-game/LEGO-set name. Each entry 20-40 words.

⚠️ HIGH-FANTASY STORYTELLING ARCHETYPES — described by VISUAL SIGNATURE, NEVER by movie/book/video-game/LEGO-set name. Distribute across iconic high-fantasy factions/aesthetics:

  • ~12% RED-CROSS WHITE-TABARD knights — chivalric crusader-style order with white surcoats over chain mail, red-cross emblem on chest and shields, gold-trim helmets, lance + sword cavalry
  • ~12% GREEN-HOOD FOREST OUTLAWS — Robin-Hood-coded archers with green hooded cloaks, brown leather tunics, longbow + quiver, oak-leaf or bow-and-arrow heraldry, fugitive-rebel feel
  • ~10% BLACK-ARMOR KNIGHTS WITH FALCON SHIELDS — antagonist knights in black plate-armor, dark-grey tabards, black + grey + dim-iron palette, falcon or skull-and-crossbones heraldry, mercenary-coded
  • ~10% GOLD-TRIM PURPLE-VELVET ROYAL KNIGHTS — high-chivalric king's knights in royal-purple velvet surcoats with gold-braid trim, gold-eagle or crown heraldry, ceremonial bearings, palace-guard feel
  • ~10% RED-AND-GOLD DRAGON-AFFILIATED KNIGHTS — knights of a dragon-house in red surcoats with gold dragon-emblem heraldry, dragon-themed shield prints, dragon-crest helmet ornaments, fire-aspect order
  • ~8% BLUE-AND-GOLD LION-EMBLEM KNIGHTS — royal-blue tabard knights with gold lion-rampant heraldry, gold-trim plate-armor, justice-order feel
  • ~8% DARK-RED + BLACK DRAGON-ARMY — antagonist knights in dark-red + black with dragon-banner heraldry, bronze trim, raiding-faction feel
  • ~6% SKELETON UNDEAD ARMY — skeleton-torso minifig variants in tattered cloaks, red-and-black palette, undead-warhorses, grim/macabre necromantic faction
  • ~6% LONG-HAIR ELVEN ARCHERS of a forest realm — long-hair-piece elven minifigs in silver-and-leaf-cream attire, longbow + curved-blade, treetop city or forest sanctuary, ethereal feel
  • ~6% BRIGHT-PASTEL FAERIE-COURT elves — sky-blue + sea-blue + peach-pink + fire-red + earth-green long-hair minifigs in pastel robes, faerie-creatures + unicorns + dragon-friends, whimsical feel
  • ~5% BEARDED DWARVEN SMITHS of a mountain hold — bearded-head minifigs in plate-armor with bronze-and-steel + mithril-blue palette, hammer + battleaxe weapons, forge-hall + mountain-hold heritage
  • ~5% ADVENTURER PARTY — four-figure ensemble of fighter (plate-armor + sword) + rogue (hooded-cloak + daggers) + wizard (robed + twisted staff) + cleric (mace + holy-symbol), questing-coded
  • ~5% ROBED WIZARDS' CIRCLE — robed-figure minifigs with pointed-hats + twisted-staffs + crystal-orbs, wizard-tower or arcane-academy, purple + black + gold-trim
  • ~5% FROZEN-NORTH WARRIOR clan — fur-cloaked Viking-coded warriors in northern realm, horned-or-antlered helmets, axe + round-shield, snowy mead-hall heritage
  • ~3% CURSED-MARSH WITCH coven — dark-cloaked witch-minifigs with broomsticks + cauldrons + cursed-amulets, poisoned-marsh feel, sickly-green + bone-white + dark-purple palette
  • ~3% CUSTOM AFOL FANTASY MOC — original Bricklink-AFOL-community custom fantasy register with creative-liberty heraldry/colors

STRICT BAN — NEVER include any of these in entries: specific movie/book/TV/video-game titles or character names (LotR / Hobbit / Tolkien / Smaug / Mordor / Helm's Deep / Rivendell / Witcher / Skyrim / Elder Scrolls / Game of Thrones / Harry Potter / Hogwarts / Warhammer / Frazetta / Vallejo / Brom / Star Wars / Dungeons & Dragons / specific D&D names like Forgotten Realms / Faerûn / Eberron); specific LEGO faction NAMES (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Lion Kingdom / Dragon Kingdom / Skeleton King / LEGO Elves); specific LEGO set numbers. Describe by VISUAL SIGNATURE only.

Each entry must:
• Name the register in first 4-8 words
• Specify CHARACTER ATTIRE (faction colors / heraldic symbol / armor-type / hairstyle)
• Specify BUILD MOTIFS (signature elements / faction-banner / weapons-type)
• Specify any cross-axis restrictions (when register fires, subject_focus / palette auto-aligns)`,
    touchpoints: [
      "RED-CROSS WHITE-TABARD CHIVALRIC ORDER — knights in white surcoats over chain-mail with bold red-cross emblem on chest and round shields, gold-trim helmets with nasal-guard, lance + cross-hilt sword, lion-or-eagle pommel accents, the heroic crusading order",
      "GREEN-HOOD FOREST OUTLAWS — Robin-Hood-coded archers in deep-green hooded cloaks and dim-olive tunics with brown-leather belts and quivers, longbow + arrow accessories, oak-leaf or bow-and-arrow heraldry, fugitive-rebel-of-the-greenwood feel",
      "BLACK-ARMOR FALCON-SHIELD KNIGHTS — antagonist knights in obsidian-black plate-armor and dark-grey tabards, falcon emblem on shields, helmet visors down, mace and longsword weapons, mercenary-coded grim-house",
      "GOLD-TRIM PURPLE-VELVET ROYAL CHIVALRY — high-ceremonial king's-knights in royal-purple velvet surcoats over gold-trim plate-armor, gold-eagle or crown heraldry shields, palace-guard ceremonial spears, the royal-throne-defenders",
      "RED-AND-GOLD DRAGON HOUSE KNIGHTS — order of knights affiliated with a fire-aspect dragon-house, red surcoats with gold dragon-emblem heraldry, dragon-crest helmet ornaments, dragon-themed shield prints, fire-aspect order feel",
      "BLUE-AND-GOLD LION-EMBLEM CHIVALRY — royal-blue tabard knights with gold lion-rampant heraldry, gold-trim plate-armor + matching ceremonial banner-poles, lion-pommel sword and lion-mantle cape, justice-order feel",
      "DARK-RED BLACK DRAGON-BANNER RAIDERS — antagonist knights in dark-red + obsidian-black tabards with dragon-banner heraldry, bronze-trim plate, mounted-on-warhorses, raiding-faction feel",
      "SKELETON UNDEAD WARRIOR ARMY — skeleton-torso minifig variants in tattered black-and-red capes, bone-white-and-grey palette, hollow-eye-socket helmets, two-handed swords + rusted shields, skeleton-warhorse mounts, necromantic faction",
      "SILVER-AND-LEAF FOREST ELVEN ARCHERS — long-hair-piece elven minifigs in silver-and-leaf-cream attire with curved-blade and longbow accessories, intricate-leaf-pattern tile heraldry, ethereal forest-realm feel, treetop-city or sanctuary-grove",
      "BRIGHT-PASTEL FAERIE-COURT ELVES — sky-blue + sea-blue + peach-pink + fire-red long-hair minifigs in pastel robes with curved-saber + crystal-staff accessories, faerie-creatures + unicorns + dragon-friends companions, whimsical feel",
      "BEARDED DWARVEN MOUNTAIN-HOLD SMITHS — bearded-head dwarf minifigs in plate-armor with bronze-and-steel + mithril-blue palette, hammer + battleaxe + crossbow weapons, anvil + forge accessories, mountain-hold heritage",
      "FIGHTER-ROGUE-WIZARD-CLERIC ADVENTURER PARTY — four-figure ensemble: plate-armored fighter with longsword + kite-shield / hooded rogue with daggers + lockpicks / robed wizard with twisted staff + spell-effect / cleric with mace + holy-symbol, questing-quartet",
      "ROBED WIZARD'S COUNCIL — robed wizards in purple + midnight-blue + gold-trim ceremonial robes with twisted-staffs + crystal-orbs + spellbooks, pointed-hat or cowled-hood variants, council-of-mages convened",
      "FROZEN-NORTH BARBARIAN CLAN — fur-cloaked Viking-coded warriors in northern realm, horned-or-antlered helmets, two-handed-axe + round-shield-with-runic-emblem, ice-blue + grey-wool + iron-trim palette, mead-hall warriors",
      "CURSED-MARSH WITCH COVEN — dark-cloaked witch minifigs with broomsticks + cauldrons + skull-staffs + cursed-amulets, sickly-green + bone-white + dark-purple palette, poisoned-marsh-with-hut-on-chicken-legs feel",
      "ORC RAIDER HORDE — green-skin orc minifig variants in fur-and-leather tattered attire, jagged curved-blade weapons + bone-shields, scarred-face print, raider-band feel, cursed-banner of skull-on-stake",
      "GOBLIN AMBUSH BAND — small green-skin goblin minifigs in patchwork armor, curved-daggers and crude crossbows, sneaky-ambusher feel, cave-or-pass-dweller register",
      "SILVER-PEARL ELVEN HIGH KING'S COURT — ceremonial silver-pearl + cool-blue + intricate-pattern attire for high-elven minifig court, curved-saber royal-elven blade, ornamental high-king regalia",
      "WHITE-STONE CITY SILVER KNIGHTS — knights of a white-stone realm in silver-armor and white-stone tabards with sun-and-star or white-tree silver heraldry, ceremonial-defender feel",
      "CURSED-TOWER NECROMANCER — solo necromancer-minifig in dark robes with skull-staff and bone-jewelry, dark-purple + abyss-black palette, summoning-pentagram surrounding, dark-arts-coded",
      "PALADIN HOLY ORDER — gold-trim plate-armored paladin minifigs with sun-emblem heraldry and shining-sword + warhammer, divine-light + holy-symbol motif, righteous-crusader feel",
      "SWAMP-FOLK FROG-PEOPLE — green-skin frog-or-lizard-people minifig variants in algae-and-moss attire with bone-spears and shell-shields, marsh-dweller feel, mysterious-marsh-realm register",
      "DARK-WOODS BANDITS — dim-cloaked highway-bandits in dark-grey + black + faded-red attire with short-swords and crossbows, wolf-pack heraldry, lurking-roadside feel",
      "DESERT-SULTAN NOBILITY — desert-realm minifigs in flowing robes and turbans with curved scimitars + jeweled-trim, sand-tone + gold + jewel-blue palette, oasis-and-mosque architectural register",
      "CUSTOM AFOL FANTASY HERALDRY — Bricklink AFOL community original custom-faction heraldry with creative-liberty colors and emblems, not from any specific known register, AFOL competition-build feel",
    ],
    instructions: `Each entry is ONE high-fantasy register lock described by VISUAL SIGNATURE, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER include movie/book/TV/video-game titles or character names (Tolkien / LotR / Hobbit / Smaug / Mordor / Helm's Deep / Rivendell / Witcher / Skyrim / Elder Scrolls / Game of Thrones / Harry Potter / Hogwarts / Warhammer / Frazetta / Vallejo / Brom / Game of Thrones / specific D&D campaign names like Forgotten Realms); NEVER specific LEGO faction NAMES (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Lion Kingdom / Dragon Kingdom / Skeleton King / LEGO Elves); NEVER LEGO set numbers; NEVER LEGO Star Wars. Describe by VISUAL SIGNATURE only (color + emblem + attire + weapon-type + heraldry).`,
  },

  brickbot_fantasy_scene_props: {
    format: 'simple',
    theme: `FANTASY DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a fantasy scene. Each entry is ONE specific prop with a story implied. Each entry 12-30 words.

⚠️ Picked TWO PER RENDER (pickN:2), so each entry must be SMALL.

VARIETY MANDATE — distribute across:
  • HERALDIC (banner / heraldic-shield / falcon-perch / battle-standard / herald-trumpet)
  • TREASURE (chest of gold / jeweled-goblet / crown-on-stand / artifact-on-pedestal / map-tile)
  • WEAPONS-LITTER (dropped sword / arrow-quiver / spear-rack / shield-stack / crossbow-on-rack)
  • MAGIC (wizard-staff / spell-book / crystal-orb / potion-bottle / pentagram-tile / scroll-rolled)
  • CHURCH / RELIGIOUS (altar-cross / chalice / candle-stand / prayer-book / icon-tile)
  • DRAGON / CREATURE (dragon-egg / skull-on-pike / dragon-scale-pile / claw-trophy)
  • PEASANT / LIFE (loaf-of-bread / cabbage / barrel-of-ale / hay-bale / sack-of-grain / wheel-and-axle)
  • TAVERN / FEAST (tankard / chalice / roasted-bird / bread-basket / lute / dice-on-table)
  • LIVING COMPANIONS (raven on shoulder / cat by hearth / dog asleep / falcon on perch / monkey)
  • PERSONAL (dagger-in-belt / signet-ring / locket / mission-scroll / family-crest)
  • SKELETON / UNDEAD (bone-pile / skull / chained-skeleton / cursed-amulet)
  • WIZARD-LIBRARY (open-grimoire / quill + ink / candle / star-chart / hourglass)
  • SIEGE EQUIPMENT (cannonball-stack / catapult-stone / siege-ladder / battering-ram)

Each entry must:
• Name the prop type in first 3-6 words
• Specify SPECIFIC LEGO BRICK PARTS or accessories where applicable
• Imply STORYTELLING CONTEXT`,
    touchpoints: [
      "Heraldic banner-tile on staff — printed flag-element (Crusader red-cross / Lion-Kingdom gold-lion / Dragon-Kingdom red-dragon / Black-Falcons falcon) mounted on antenna-staff piece overhead castle ramparts, faction-identity anchor",
      "Treasure chest open with gold spill — 2×3 brown chest-element open on stone-floor with 1×1 gold round-plates spilling onto the floor and trans-purple + trans-red jewel-elements scattered, the recent-plunder-evidence",
      "Wizard staff leaning on wall — minifig wizard-staff accessory with twisted-grip leaning against a brick-built bookshelf, blue crystal-orb tile-element at the staff-tip, the wizard's-quarters detail",
      "Dragon egg on pedestal — 1×1 trans-orange round-stud dragon-egg balanced on a brass round-plate cradle pedestal, faint trans-red glow-emission implied, the lair-newborn evidence",
      "Spell-book open on lectern — printed grimoire-tile open on a brick-built wood-lectern with minifig-quill accessory beside, 1×1 trans-purple jewel-element marking a critical page, the arcane-research detail",
      "Crystal-orb on stand — 1×1 trans-clear round-stud crystal-orb on a gold-trim cradle pedestal, faint trans-cyan magical-light emerging from the orb, the wizard's-scrying-tool detail",
      "Crown on velvet stand — minifig gold crown-piece on a brick-built dark-red velvet-tile cushion, the royal-regalia ceremonial detail",
      "Dropped sword in foreground — minifig sword-piece lying on the deck-tile flat, blade pointed away from a fallen knight-minifig at frame-edge, suggesting a recent combat",
      "Loaded crossbow on barrel — minifig crossbow-piece propped on a brown barrel-element, cocked and ready, set down between shots in a duel-pause",
      "Tankard of ale on table — 1×1 trans-amber round-stud filled tankard-element on a brick-built tavern-tabletop, ale-foam-tile detail at the top, the abandoned-mid-drink moment",
      "Loaf of bread + cabbage on table — brown 1×2 loaf-tile and green 1×1 round-cabbage-element on a tavern-table, the peasant-meal detail",
      "Roasted bird on platter — brown 1×2 brick-bird-element on a 2×3 gold-trim platter-tile, the festive-feast centerpiece detail",
      "Lute leaning on tavern-stool — minifig lute-accessory leaning against a brick-built tavern-stool, the bard's-pause-between-songs detail",
      "Dice + coin pile on table — 1×1 round-plates (1 white as dice, 3 gold as coins) on a tavern-tabletop, the game-of-chance detail",
      "Raven on the throne-back — minifig black-raven-piece perched on the carved-stone back of a throne with one black-claw gripping, the dark-omen detail",
      "Falcon on the gauntlet-perch — minifig brown-falcon-piece perched on a brick-built brass-trim falconry-perch, the noble-hunter's prized-bird detail",
      "Cat by the hearth — minifig orange-tabby cat-accessory curled on a brick-built fireplace-hearth-stone, the cozy-tavern-life detail",
      "Loyal-dog at master's feet — minifig brown-dog-piece asleep at the foot of a minifig's throne or hearth, the loyalty-of-the-pack detail",
      "Open grimoire on table — printed spell-book tile open on a brick-built study-table with a 1×1 jewel-element bookmark, trans-purple residue at the page-margin, the active-research detail",
      "Quill + inkpot on parchment — minifig quill-accessory standing in a 1×1 black-round-tile inkpot beside a printed-parchment-tile, the scriptorium-scribe detail",
      "Candle on holder — minifig brass candle-stand piece with 1×1 trans-yellow round-tile flame at the top, the moody-interior detail",
      "Skull on pike — minifig white-skull piece mounted on a black antenna-pole staked into the ground, the grim-warning trophy",
      "Cursed-amulet on chain — 1×1 trans-purple round-stud amulet hanging from a minifig-chain piece, the dark-artifact detail",
      "Bone pile in corner — scattered minifig-bone pieces (femurs / skull / ribs) clustered in a dungeon-corner, the macabre detail",
      "Chained skeleton at wall — skeleton-minifig with chain-link pieces locking wrists to a dungeon-wall, the long-imprisoned warning",
      "Cannonball stack at siege — pile of brown 1×1 round-plate cannonballs stacked pyramid-form beside a siege-weapon, the artillery-supply detail",
      "Siege-ladder propped — wooden brick-built siege-ladder propped against a castle-wall, the assault-equipment detail",
      "Hourglass on study-table — brick-built hourglass with sand-detail in clear-yellow 1×1 round-plates running through, the time-pressure detail",
      "Star-chart on wall — printed celestial-map tile mounted on a brick-built wood-frame, the astrologer's-tool detail",
      "Brick-built parrot on pirate's shoulder — minifig parrot in red-blue-yellow on a minifig shoulder-stud (used in fantasy contexts too — bard's-companion or wizard's-familiar)",
    ],
    instructions: `Each entry is ONE fantasy diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials without naming brick parts; NO centerpiece-sized props; small storytelling-detail props only.`,
  },

  brickbot_fantasy_lighting: {
    format: 'simple',
    theme: `LEGO MOC FANTASY LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the fantasy path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE. Lighting owns ONE lane: light source + direction + color.

⚠️ HARD BANS:
  • NO magical phenomena (spell-vortex / portal / blizzard-conjured — those belong to magical_phenomenon axis)
  • NO scene elements (castle / throne / forest / dungeon — those belong to scene_type / camera_framing axes)
  • NO minifig action

VARIETY MANDATE — distribute across:
  • TORCH / FIRE (single torch warm-amber from below / torch-procession warm-orange / fireplace warm-uplight / forge-trans-orange uplit)
  • CANDLE (single-candle warm-amber pool / candelabra warm-cluster / chapel-altar warm-row)
  • SUNLIGHT (sun-through-arrowslit shaft / cathedral-stained-glass jewel-tones / forest-canopy-dapple cool-green / sunset-orange-warm-side)
  • MOONLIGHT (full-moon cool-silver-blue / crescent-moon side / moonlit-fog soft-diffuse / blood-moon cursed-red)
  • LIGHTNING (instant-flash white-violet / storm-distant pulsing / mage-bolt trans-yellow strobe)
  • DRAGON-FIRE (trans-orange + trans-red glowing scene / dragon-breath warm-side / lair-glow ember-warm)
  • OVERCAST / DIFFUSE (cool-grey overcast / misty-dawn diffuse / cathedral-dim cool / fog-bounce blue-grey)
  • CHIAROSCURO (Caravaggio single-source dramatic / single-source-dark-surround / spotlight-pool)
  • UNHOLY / CURSED GLOW (sickly green-glow / phosphorescent-purple uplight / aurora-violet cool)
  • NIGHT WITH SINGLE SOURCE (lone-candle in pure-black / single-torch in dungeon / brazier-flicker)`,
    touchpoints: [
      'SINGLE-TORCH WARM-AMBER UPLIT — single torch held overhead as the only light source, warm-amber orange-glow falling off rapidly to darkness within 2-brick-lengths, deep-amber color quality at the source fading to pitch-black at edges',
      "CATHEDRAL STAINED-GLASS JEWEL-TONES — sunlight streaming through stained-glass windows casting jewel-tone color patches (trans-red + trans-blue + trans-yellow + trans-violet) on the interior floor and surrounding figures, cool ambient between the colored shafts",
      "FULL-MOON COOL SILVER-BLUE — directly overhead full moon casting cool silver-blue color quality on all upward surfaces, deep-blue undersides, vertical shadows underfoot, the moonlit-realm register",
      "CANDLELIT CHAPEL ROW WARM-AMBER — row of candelabra along chapel altar casting warm-amber pools of light up onto the wall above each, cool deep-shadow between the pools, the sacred-ceremony register",
      "DRAGON-FIRE GLOWING WARM-SIDE — trans-orange + trans-red dragon-breath glow casting hot warm-amber color quality on the side of the scene facing the dragon, deep purple-shadow on the off-side, the dragon-attack register",
      "STORM-LIGHTNING WHITE-VIOLET FLASH — instant lightning flash freezing the entire scene in white-violet color quality, hard-edged shadows from the directional flash, the dramatic-storm register",
      "FORGE GLOWING TRANS-ORANGE UPLIT — dwarven-forge fire as light source from below, hot trans-orange color quality on the upper-surfaces of the forge-chamber, deep-cool shadow on the far side of the chamber",
      "FOREST-CANOPY DAPPLE COOL-GREEN — sun filtering through dense leaf-element canopy casting dappled cool-green color quality on the forest-floor, sun-shaft beams visible through gaps, the woodland register",
      "BLOOD-MOON CURSED-RED — full moon directly overhead in trans-red color quality, sickly-red color cast on all upward surfaces, deep-burgundy shadows, the supernatural-event register",
      "TAVERN FIREPLACE WARM-AMBER UPLIT — central tavern fireplace as the only light source, warm-amber orange-glow flickering on the gathered tables and patrons closest to the hearth, cool-deep-shadow in the far corners",
      "AURORA-VIOLET COOL OVERHEAD — magical aurora-belt overhead casting trans-violet + trans-cyan cool color quality on all upward surfaces, the otherworldly-realm register",
      "TWILIGHT-PURPLE DUSK BLUE-COOL — post-blue-hour deep-twilight, rich purple-and-indigo overhead, no direct light source, very low ambient, the world-ending-day register",
      "SUNSET ORANGE-WARM SIDELIT — late-afternoon sun low on horizon raking horizontally, warm amber color quality on lit surfaces, long deep-violet shadows opposite, the iconic golden-hour register",
      "MOONLIT FOG SOFT-DIFFUSE — diffused moonlight through fog casting pale-blue soft-diffuse color quality, no hard shadows, lanterns blooming as soft halos, the mysterious-night register",
      "CARAVAGGIO DEEP-SHADOW SINGLE-SOURCE — chiaroscuro interior from one off-frame source (could be window / lantern), warm color quality on the lit edge of subject, deep-black void on 80% of frame, dramatic high-contrast",
      "BRAZIER-FLICKER WARM-OLIVE-UPLIT — large brazier as light source from below, warm-olive-orange flickering color quality on undersides of objects above, cool-darkness above the brazier, the dungeon-cell register",
      "ICE-CRYSTAL CAVE TRANS-CYAN UPLIT — bioluminescent fungi + ice-crystal accents lighting an underground cave from below, cool trans-cyan + trans-green color quality, eerie ethereal feel",
      "UNHOLY-GLOW SICKLY-GREEN UPLIT — necromantic ritual circle or summoning altar emitting sickly trans-green glow from below, sickly-green color quality on underside-of-objects above, cool-darkness above, the dark-arts register",
      "ARROWSLIT-SHAFT BRIGHT-YELLOW VERTICAL — single sun-shaft piercing through an arrowslit window casting a bright-yellow vertical light-beam down into a dim castle-chamber, surrounding darkness on the unlit areas, the lone-light-shaft register",
      "TORCH-PROCESSION WARM-ORANGE — line of torches carried in procession casting warm-orange flickering color quality down a corridor or path, the ceremonial-arrival register",
      "DAWN-PINK COOL-COOL-HORIZON — pre-sunrise pink-and-cool-blue gradient lighting, soft-diffuse color quality, barely-defined shadows, the gentle-awakening register",
      "FIRELIGHT FLICKERING WARM-SIDELIT — fire-pit or bonfire from one side casting warm flickering orange-yellow on the lit side, deep purple-black on the off-side, dramatic warm-cool split lighting, the campsite register",
      "WIZARD-ORB COOL-CYAN-UPLIT — wizard's crystal-orb on a stand as the only light source, cool trans-cyan glow uplighting the wizard's face from below, dramatic chiaroscuro, the arcane-study register",
      "MAGE-BOLT TRANS-YELLOW STROBE — instant magical spell-bolt as the dominant light source, trans-yellow color quality bleaching the strike-side, hard-edged shadows on the off-side, the spell-impact register",
      "WITCH-CAULDRON TRANS-GREEN UPLIT — bubbling green-glow cauldron as the only light source, trans-green uplit color quality on the witch's face from below, cool darkness above, the swamp-hut register",
      "OVERCAST GREY-COOL DIFFUSE — heavily overcast sky bouncing flat cool-grey light, no directional shadows, even illumination across the frame, the bleak-day register",
      "ICE-PLANET-BLUE COOL-OVERHEAD — frozen-realm twilight with cool-blue overhead sky, soft-diffuse color quality on snow surfaces, the polar register",
      "NEEDLE-OF-LIGHT THROUGH-CEILING SUN-SHAFT — vertical shaft of warm sunlight piercing downward through a hole or opening overhead, sharp-edged light-shaft, surrounding darkness on the unlit areas, the revelation register",
      "STAR-FIELD MOONLESS COOL-NEAR-BLACK — no moon, only faint silver-blue starlight, very dim cool-blue color quality, barely-readable shadow definition, near-pitch-black darkness with only highlights catching, the wild-realm register",
      "MULTIPLE-CANDELABRA ROOM-WARM — several candelabra positioned around a chamber casting warm-amber pools that overlap into a complete warm-warmth illumination, the cozy-hall register",
    ],
    instructions: `Each entry is ONE fantasy-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO magical phenomena (spell-vortex / portal — that's magical_phenomenon); NO scene elements (castle / throne / forest — that's scene_type / camera_framing); NO minifig action. SOURCE + DIRECTION + COLOR only.`,
  },

  brickbot_fantasy_palette: {
    format: 'simple',
    theme: `LEGO MOC FANTASY PALETTE — axis-clean color-combination entries for the fantasy path. Each entry is ONE specific multi-color palette for a fantasy diorama. Each entry 12-25 words.

✓ VARIETY MANDATE — distribute across fantasy-coded palettes:
  • CRUSADERS WHITE+RED (white-tabard + red-cross + gold + steel-grey)
  • FORESTMEN GREEN+BROWN (forest-green hood + leather-brown + bone-white + bow-string-tan)
  • BLACK KNIGHTS DARK (black-armor + grey-tabard + falcon-grey + dragon-red trim)
  • ROYAL KNIGHTS PURPLE+GOLD (royal-purple velvet + gold-braid + cream-ivory + crimson)
  • DRAGON KNIGHTS RED+BLACK (dragon-red + dragon-black + gold + bronze)
  • LION KINGDOM BLUE+GOLD (royal-blue + gold + cream-white + lion-emblem)
  • DRAGON KINGDOM DARK-RED (dark-red + black + dragon-banner + bronze)
  • SKELETON-KING RED+BLACK+BONE (skeleton-red + black + bone-white + dim-grey)
  • CASTLE 2013 CHROME+CROWN (chrome-silver + king's-blue + crown-gold + ivory)
  • LEGO ELVES PASTEL (sky-blue + sea-blue + peach-pink + fire-red + earth-green + faerie-cream)
  • LOTR ROHAN (Rohan-green + leather-tan + horse-banner-cream + bronze-trim)
  • LOTR GONDOR/MINAS TIRITH (white-stone + silver + white-tree-emblem + cool-grey)
  • LOTR MORDOR (black + dark-red + ember-orange + ash-grey + tarred-black)
  • LOTR RIVENDELL (silver-pearl + leaf-cream + cool-blue + intricate-design-trim)
  • LOTR SHIRE (earth-green + tan + cream-white + sunset-orange + warm-brown)
  • HOBBIT EREBOR DWARVEN (bronze + steel + dark-bley + mithril-blue + gold-trim)
  • D&D ADVENTURER PARTY (mixed-leather + steel + spell-purple + holy-yellow)
  • SUNSET TWILIGHT FANTASY (saffron + crimson + deep-purple + ember-orange + amber-glow)
  • CURSED DARK FANTASY (sickly-green + abyss-black + bone-white + verdigris + necromancer-purple)
  • TAVERN FIRESIDE WARM (warm-amber + tobacco-brown + cream + aged-oak + brass)
  • CATHEDRAL STAINED-GLASS JEWEL-TONES (cool-stone + trans-red + trans-blue + trans-yellow + trans-violet)
  • SNOWY-REALM ICE-WHITE (snow-white + ice-cyan + dim-blue + bone-grey + dim-silver)
  • VOLCANIC-WASTES EMBER (ember-orange + ash-grey + soot-black + dying-coal-red + brimstone)

Each entry must:
• Name 3-5 specific colors with anchor-nouns
• Use specific color-modifier vocabulary (weathered / tarnished / bleached / saturated / cool / warm / molten)
• End with a brief register tag
• NEVER drift into lighting language — describe colors as MATERIAL colors`,
    touchpoints: [
      "White-tabard + red-cross + gold-trim + steel-grey-armor, Crusaders",
      "Forest-green-hood + leather-brown + bone-white + bow-string-tan + dim-olive, Forestmen",
      "Black-armor + grey-tabard + falcon-emblem + bone-white + dim-iron, Black-Falcons",
      "Black-armor + grey + dragon-red-trim + dim-steel + bone, Black-Knights",
      "Royal-purple-velvet + gold-braid + cream-ivory + crimson-sash + ebony, Royal-Knights",
      "Dragon-red + dragon-black + tarnished-gold + bronze + dim-brown, Dragon-Knights",
      "Royal-blue + lion-gold + cream-white + bronze-trim + sky-banner, Lion-Kingdom",
      "Dark-red + obsidian-black + bronze + dragon-banner + scorched-brown, Dragon-Kingdom",
      "Skeleton-red + tar-black + bone-white + dim-grey + decay-green, Skeleton-King",
      "Chrome-silver + king's-blue + crown-gold + cream-ivory + heritage-steel, Castle-2013",
      "Sky-blue + sea-blue + peach-pink + fire-red + earth-green, LEGO-Elves",
      "Rohan-green + leather-tan + horse-banner-cream + bronze-trim + dim-iron, LotR-Rohan",
      "White-stone + silver + white-tree-emblem + cool-grey + ebony, LotR-Gondor",
      "Black + dark-red + ember-orange + ash-grey + tarred-black, LotR-Mordor",
      "Silver-pearl + leaf-cream + cool-blue + intricate-design + jade-trim, LotR-Rivendell",
      "Earth-green + tan + cream-white + sunset-orange + warm-brown, LotR-Shire",
      "Bronze + steel + dark-bley + mithril-blue + gold-trim, Hobbit-Erebor",
      "Plate-steel + leather + spell-purple + holy-yellow + cleric-cream, D&D-adventurer",
      "Saffron-sunset + crimson + deep-purple + ember-orange + amber-glow, Sunset-twilight",
      "Sickly-green + abyss-black + bone-white + verdigris + necromancer-purple, Cursed-dark",
      "Warm-amber + tobacco-brown + cream + aged-oak + brass, Tavern-fireside",
      "Cool-stone + trans-red + trans-blue + trans-yellow + trans-violet, Cathedral-stained-glass",
      "Snow-white + ice-cyan + dim-blue + bone-grey + dim-silver, Snowy-realm",
      "Ember-orange + ash-grey + soot-black + dying-coal-red + brimstone, Volcanic-wastes",
      "Spell-violet + trans-cyan + arcane-gold + parchment-cream + grimoire-black, Wizard-tower",
      "Hay-cream + cabbage-green + bread-brown + pewter-grey + barrel-tan, Peasant-village",
      "Battle-red + ash-grey + scorched-black + war-banner-gold + iron-dim, Battlefield-aftermath",
      "Cathedral-cool-stone + altar-gold + chalice-silver + crimson-velvet + ivory, Royal-chapel",
      "Dragon-egg-pearl + nest-tan + cave-grey + spark-red + amber-light, Dragon-lair-newborn",
      "Moss-green + mushroom-red + log-brown + forest-shadow + olive-glow, Forest-glade",
      "Northern-fur-brown + Viking-iron + war-banner-red + ash-snow + mead-amber, Northern-realm",
    ],
    instructions: `Each entry is ONE fantasy palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language; NO scene elements; NO magical phenomena. Material colors with anchors + register-tag. NEVER Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_magical_phenomenon: {
    format: 'simple',
    theme: `FANTASY MAGICAL PHENOMENON — atmospheric/supernatural event that AMPLIFIES the scene. Each entry is ONE specific magical event (50%-gated conditional). Each entry 20-40 words.

⚠️ DECOUPLED FROM scene_type AND lighting — bending axis. Lets us roll "castle siege + dragon-fire-rain + LotR Mordor register" or "tavern interior + faerie-mist + LEGO Elves register."

VARIETY MANDATE — distribute across:
  • DRAGON / FIRE (dragon-fire-rain on village / dragon-breath blast / lair-fire-pit erupting)
  • SPELL / VORTEX (mage-spell-vortex collision / portal-disc opening / lightning-bolt-cast / fireball-explosion)
  • UNDEAD / NECROMANTIC (skeleton-rising-from-ground / lich-aura unholy-pulse / curse-mist-drift / wight-emergence)
  • FAERIE / NATURE (fey-mist drifting through glade / forest-spirits illuminating trees / bioluminescent-flora bloom / aurora-blessing)
  • WEATHER / ELEMENTAL (blizzard-conjured ice-storm / unnatural-thunderstorm / earthquake-ground-crack / fire-rain from sky)
  • PORTAL / SUMMONING (magical-portal disc opening / summoning-pentagram glowing / arcane-circle activating / banishment-vortex)
  • SHADOW / CURSE (shadow-curse spreading / unholy-pulse-from-altar / dark-energy-tendrils / cursed-fog with faces)
  • DIVINE / HOLY (divine-light from above / healing-aura golden glow / paladin-blessing radiance / saint's-halo manifestation)
  • CREATURE EMERGENCE (giant-spider-from-hole / cave-troll-rising / hydra-emerging-from-swamp / golem-awakening)
  • CELESTIAL (falling-stars across sky / blood-moon eclipse / comet-trail / nebula-overhead-fantastical)

Each entry must:
• Name the event in first 4-8 words
• Specify WHICH BRICK PARTS render it (trans-pieces / flex-tubes / specific elements)
• Specify the VISUAL IMPACT (focal point shift, color cast, motion)
• NEVER override lighting axis directly`,
    touchpoints: [
      'DRAGON-FIRE RAIN ON VILLAGE — colossal brick-built dragon overhead with trans-orange + trans-red flame elements raining down on the village below, scattered fire-impact-craters as trans-yellow round-plates on rooftops, the iconic dragon-attack signature',
      "MAGE SPELL-VORTEX COLLISION — two trans-color spell-vortexes (one trans-purple + trans-magenta, one trans-cyan + trans-yellow) meeting at frame-center with sparks of trans-yellow at the collision-point, dueling-mages signature",
      'SKELETON-RISING FROM GROUND — multiple skeleton-minifigs mid-emergence from cracked-earth tiles in a moonlit graveyard, trans-purple unholy-glow seeping up from each emergence-point, the necromantic-uprising signature',
      "FEY-MIST IN FOREST GLADE — drifting trans-magenta + trans-cyan + trans-green mist-particles (1×1 round-plates) hovering at varying heights through a forest glade, glowing faintly, the otherworldly-fey-presence signature",
      'BLIZZARD-CONJURED ICE-STORM — vertical trans-white + trans-cyan icicle-element streamers cascading from the upper-frame at an angle across the scene, blanketing surfaces in white-foam-crests, the elemental-spell signature',
      'MAGICAL-PORTAL DISC OPENING — vertical trans-cyan + trans-magenta + trans-violet disc at frame-center with jagged-edge-cone, faint mist swirling at the rim, the dimensional-portal opening signature',
      'PENTAGRAM-FLOOR GLOWING — necromantic pentagram built from trans-purple + trans-magenta tiles glowing on a stone-floor in a wizard\'s tower or crypt, the trans-elements rising as smoke-streamers, the summoning signature',
      'SHADOW-CURSE TENDRILS — black + dark-bley trans-clear-shadow tendrils emerging from a cursed-altar and spreading along the floor toward foreground figures, the dark-magic-spreading signature',
      'DIVINE-LIGHT FROM ABOVE — vertical trans-yellow + trans-clear light-shaft descending from above onto a focal-figure (paladin / chosen-one), surrounding darkness on the unlit areas, the divine-intervention signature',
      'BLOOD-MOON ECLIPSE — large dark-bley round-tile lunar-disc eclipsing a bright trans-red moon, with thin trans-orange + trans-red diffraction-ring around the eclipse-edge, sickly-red color cast across the scene, the supernatural-event signature',
      "FALLING-STARS ACROSS SKY — multiple trans-yellow + trans-white bar-elements arcing diagonally across the brick-built sky-baseplate, each streak with a 1×1 round-plate impact-head trailing trans-amber sparks, the celestial-event signature",
      'AURORA-BLESSING OVERHEAD — horizontal trans-green + trans-cyan + trans-magenta plate strips arranged in undulating curtains overhead, casting unearthly-green glow on the scene, the elven-magic signature',
      'CAVE-TROLL EMERGING — massive brick-built cave-troll figure mid-emergence from a cavern-floor with rubble and debris (1×1 round-plates) erupting at its rise-point, the giant-creature reveal signature',
      'GIANT-SPIDER FROM HOLE — colossal black-and-dark-bley spider-figure with eight Technic-articulated legs emerging from a hole in the cave-wall, trans-red eye-cluster, the arachnid-ambush signature',
      'HYDRA EMERGING FROM SWAMP — multi-headed hydra-figure with brick-built necks rising from a swamp-baseplate (multiple heads at different elevations), trans-green poison-particles dripping from each maw, the iconic-hydra signature',
      'GOLEM AWAKENING — brick-built stone-golem mid-activation on an altar-platform, faint trans-cyan magical-light emerging from chest-cavity, the construct-coming-to-life signature',
      'UNHOLY-PULSE-FROM-ALTAR — bursts of trans-violet + trans-purple light pulsing outward from a black-altar in concentric expanding rings, the dark-power-activating signature',
      "FIRE-RAIN FROM SKY — multiple small trans-orange + trans-red flame elements falling from the upper-frame at various positions, impact-craters trans-yellow at the strike-points, the apocalyptic-fall signature",
      'CURSED-FOG WITH FACES — drifting white-grey cotton-batting fog elements with faint trans-clear face-shapes embedded in the curls, ghostly-presence signature',
      "PALADIN-BLESSING RADIANCE — paladin-minifig with C-hands held up generating trans-yellow + trans-clear divine-radiance plate-elements emanating outward, the holy-magic signature",
      'FOREST-SPIRITS BLOOM — multiple trans-green + trans-cyan + trans-white 1×1 round-plate spirit-orbs hovering at varying heights through a forest, glowing faintly, the woodland-magic signature',
      'EARTHQUAKE GROUND-CRACK — dark-tan cracked-earth tiles spreading across the foreground floor with deep-cracks (1×2 dark-bley tile-strips), trans-orange lava-glow at the crack-edges, the elemental-disturbance signature',
      "WIGHT EMERGENCE FROM CRYPT — multiple wight-minifig variants (skeleton-torso with tattered-cape) emerging from a torch-lit crypt corridor with cold trans-cyan undead-mist drifting around their feet, the undead-procession signature",
      "BANISHMENT-VORTEX SPIRAL — trans-purple + trans-magenta spell-spiral mid-formation drawing a captured-demon-figure into the vortex-center, the moment-of-exorcism signature",
      'COMET-TRAIL OVERHEAD — single bright comet-element with elongated trans-white + trans-yellow tail trailing across the upper-frame, the celestial-omen signature',
    ],
    instructions: `Each entry is ONE fantasy magical phenomenon, 20-40 words. Format: "EVENT NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify lighting color cast directly; NEVER lock minifig reaction language; magical EVENT only. NEVER Star Wars / Harry Potter references.`,
  },

  // ════════════════════════════════════════════════════════
  // SPACE PATH (2026-05-22 — second BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  // ─── scene_type — narrative stage ───
  brickbot_space_scene_type: {
    format: 'simple',
    theme: `LEGO MOC SPACE DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot space axis system. Each entry is ONE narrative stage (the WHAT — what category of space moment is this diorama?). Each entry 30-55 words.

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (those belong to a separate axis). NO build technique vocab. NO cosmic phenomena. Just: where are we, what kind of moment.

VARIETY MANDATE — distribute across these categories (~5-10% each):
  • SHIP-TO-SHIP COMBAT — dogfight in nebula / capital-ship broadside / fighter intercept / boarding action
  • DOCKING / LAUNCH — shuttle approach / hangar departure / orbital ring berth / Mars-lander touchdown
  • EVA / SPACEWALK — hull repair / rescue tether / debris-field nav / between-ships transfer
  • ASTEROID / RESOURCE MINING — ore extraction rig / claim dispute / cargo loading / hauler launch
  • FIRST CONTACT / ALIEN ENCOUNTER — diplomatic landing / monolith approach / artifact reveal / hostile drone encounter
  • CRASH / SURVIVAL — crashed-lander reef / hull-breach drama / lost-in-asteroid-belt / emergency-airlock
  • COMMAND BRIDGE / MISSION CONTROL — captain on the bridge / Apollo-era control room / war-room briefing / scope-readout moment
  • HABITAT / COLONY LIFE — Mars greenhouse / lunar dorm-cluster / station mess hall / hydroponics bay
  • EXPLORATION / DISCOVERY — derelict-ship investigation / cave-entry on alien world / ruined-station boarding / probe-recovery
  • REFIT / REPAIR — engine swap mid-deck / hull-plating retrofit / drydock overhaul / hardpoint upgrade
  • LANDING ON PLANET — first-foot ceremony / dust-cloud touchdown / atmospheric re-entry burn / crater settlement
  • CARGO / FREIGHT — hauler convoy / smuggler hold transfer / customs inspection / black-market exchange
  • SPACE CITY LIFE — Coruscant-coded planet-city streetscape / orbital megacolony concourse / Citadel-coded multi-species market / O'Neill cylinder daily life / asteroid mining city tram-station / lunar capital plaza / Mos-Eisley spaceport cantina / Babylon-5 diplomatic concourse
  • SPACE CITY SCALE — wide aerial vistas of layered ecumenopolis / orbital-ring metropolis / asteroid-hollowed city / glass-dome capital cluster — the city itself is the subject, scale-prover crowds + flying-vehicle traffic
  • INTERIOR DAILY LIFE — mess hall meal / observation deck quiet moment / corridor commute / cargo bay manifest-check / med bay routine exam / engineering shift change / laboratory routine analysis / briefing room everyday

⚠️ NEW MANDATE — at LEAST 20% of generated entries must center on SPACE CITY or NON-COMBAT INTERIOR DAILY LIFE (Kevin's R1 feedback — too ship-heavy in R0). Lead these entries with the city/interior as the dominant subject — NOT "ship at city" / "ship at interior."

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (bridge / hangar / surface / open vacuum / station-interior / cargo-hold / docking-ring)
• Suggest the TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action ("captain pulling lever" — that's the action axis)
• NEVER name a specific phenomenon ("supernova breaks the sky" — that's the cosmic_phenomenon axis)`,
    touchpoints: [
      'ASTEROID MINING RIG EXTRACTION SITE — massive brick-built drill-platform anchored to a heavy dark-bley asteroid surface, cargo-hauler shuttle nearby with bay doors open, scattered ore-chunks (1×1 round-plates in trans-purple and trans-amber) drifting around the rig, the open vacuum behind dotted with asteroid silhouettes, tense ownership-dispute pre-launch beat',
      'CAPITAL-SHIP BROADSIDE COMBAT — two fleet capital-ships positioned at close-range across an open-vacuum gap, hull-plating scarred from prior salvos, multiple gun-batteries glowing trans-orange mid-discharge, the larger ship in receding perspective, debris-field of hull-fragments hanging between them, the moment before the next volley lands',
      "EVA HULL-REPAIR EMERGENCY — exterior hull surface of a damaged frigate spanning the diorama base, breach-point exposed to vacuum with venting trans-cyan atmospheric-element streamers, a tethered EVA-suited crew member working at the breach, secondary minifig at a portable repair-pod with brick-built tool-rack, the moment of damage-control under time-pressure",
      "FIRST-CONTACT MONOLITH APPROACH — alien planet surface of dark-red and tan slope bricks, a colossal brick-built monolith of black tiles rising from the terrain, three EVA-suited explorers approaching cautiously, a parked lander nearby, scale-prover micro-figure in deep distance, the awe-and-tension reveal beat",
      "COMMAND BRIDGE BATTLE-STATIONS — interior cutaway of a frigate's command bridge with brick-built console banks in concentric arcs, captain's chair on a raised platform, brick-built viewscreen showing the open-vacuum threat, multiple bridge officers at stations, klaxon-red trans-red 1×1 round-plate alert-lights along the bulkheads, mid-engagement coordination beat",
      "MARS COLONY GREENHOUSE INTERIOR — pressurized dome built from trans-clear panels and white-frame Technic-beam supports, rows of brick-built hydroponic planters with trans-green plant-elements, colonist minifigs in light EVA-undersuits tending the rows, the rust-tan Mars surface visible through the dome panels, daily-life pre-crisis beat",
      "DERELICT-SHIP INVESTIGATION — exterior or interior of a long-abandoned frigate, hull plating warped and patinaed, drifting debris-field around the cargo bay entry, three EVA-suited investigators with brick-built flashlight-elements, traces of forgotten cargo (1×1 round-plate stacks) on the deck, the eerie cold-storage discovery beat",
      "HANGAR-BAY LAUNCH PREP — interior of a fleet hangar with multiple fighter-craft on cradles in two receding rows, deck crew swarming around the lead fighter with refuel-hoses and ordnance-trolleys, pilot minifig approaching the cockpit ladder, the imminent-sortie scramble beat",
      "ORBITAL RING DOCKING APPROACH — exterior view of a vast brick-built orbital station ring, a docking shuttle on final approach to a berth-port, the planet below visible as a curved blue-and-tan baseplate horizon, station running-lights in trans-blue and trans-yellow strips along the rim, the precision-maneuver beat",
      "CRASHED LANDER REEF — alien-planet surface with a half-buried lander wreckage canted at 30 degrees in the rocky terrain, hull-breach exposed, three survivor minifigs working salvage from the wreck-base, scattered emergency-supplies (trans-orange 1×1 round-plate signal-flares) marking a perimeter, the survival-improvise beat",
      "SMUGGLER CARGO TRANSFER — interior of a low-deck cargo hold with shipping containers stacked in a back-channel arrangement, two crews exchanging crates between an inner ship and an outer dock, lookout at the gantry door, a bribed customs officer at a desk with a datapad, the illicit-transaction tension beat",
      "MISSION CONTROL APOLLO-ERA ROOM — wall-sized brick-built mission-board with grid of lit trans-element status indicators, rows of brick-built console banks with minifig flight-controllers, viewing gallery above with executive observers, vintage-bley palette with USA-coded flag tile, the historic-launch coordination beat",
      "DEEP-SPACE PROBE RECOVERY — open vacuum diorama with a derelict-probe (brick-built 1970s-style probe with dish-antenna) drifting at scene-center, a recovery-cradle on a recovery-shuttle reaching toward it, EVA-tethered crew member guiding it home, scattered solar-panel fragments around the probe, the careful-grasp beat",
      'ALIEN ARTIFACT REVEAL ON CAVE FLOOR — interior of an underground cave on an alien world with bioluminescent trans-cyan growth on the cavern walls, the artifact (brick-built crystalline shape on a plinth) at the cavern center, three explorers with EVA helmets cautiously approaching, scale-prover micro-figure at the cavern mouth in deep distance',
      "PIRATE / SCAVENGER ENCOUNTER — frontier-station dock between a respectable trading vessel and an off-the-books raider-craft with hull-plating cobbled from scavenged parts, two crews facing off on a narrow dock-walkway, lookouts at each end, brick-built lantern-lights in trans-orange overhead, the tense-standoff beat",
      "FUEL-DEPOT REFUELING — exterior of a fleet ship at a fuel-depot platform, brick-built fuel-arm extended from depot to ship, deck-crew at the connection-point, depot supervisor at a control-station, distant stars in 1×1 white round-plates scattered across the dark-bley sky-baseplate, the routine-procedure-with-tension beat",
      "ESCAPE-POD JETTISON MOMENT — exterior of a damaged ship at the moment an escape-pod cluster jettisons from the side, pods (brick-built tear-drop shapes) trailing trans-orange flame elements, the parent-ship leaning at an angle implying severe damage, the abandonment-of-ship climax",
      "LUNAR-BASE CONSTRUCTION SITE — surface of the moon (light-bley slope bricks with crater-tile insets) with a half-assembled base structure, Technic-articulated brick-built crane lifting a habitat-module into position, EVA-suited construction crew at multiple work-points, the building-the-future beat",
      "MEDICAL BAY EMERGENCY — interior of a ship's medical bay with brick-built medical-bunk and instrument-arrays, a casualty minifig on the bunk under examination by a doctor minifig, secondary medical-tech at a diagnostic console, trans-red 1×1 alert-light overhead, the urgent-treatment beat",
      "DOOMED-MISSION FAREWELL — interior of a small interior space (cockpit / airlock / shuttle-cabin) with one minifig in EVA-suit at the airlock ready to depart, another minifig in undersuit at the bulkhead, brick-built personal-effects (datapad / photo-tile / wedding-ring on a plate) between them, the sacrifice-moment quiet beat",
    ],
    instructions: `Each entry is ONE space narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language ("WIDE / MEDIUM / CLOSE / aerial"), never include minifig action verbs ("astronaut leaping / crew firing"), never include phenomenon names ("supernova / aurora / black hole"), never include lighting descriptors ("golden hour / nebula-glow"). Those belong to other axes. Stage + tension only.`,
  },

  // ─── minifig_action — verb-led story beats ───
  brickbot_space_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot space path. Each entry is a freeze-frame of minifigs IN MID-ACTION (the story beat), NOT minifigs posing in a setting. Each entry 25-45 words.

⚠️ HARD MANDATE — STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Space-specific verbs: mid-tether-arrest, mid-airlock-cycle, mid-blast-deflect, mid-canopy-eject, mid-drill-bite, mid-spacewalk-tether-snap, mid-lever-pull, mid-pad-launch, mid-deflector-up, mid-airlock-pressurize, mid-vacuum-suction, mid-grasp-of-artifact.

⚠️ HARD BANS:
  • NEVER "minifigs standing around"
  • NEVER "astronaut posing on landing pad"
  • NEVER "crew watching / looking at / gazing at / wide-eyed at"
  • NEVER "characters arranged in semicircle"
  • NEVER passive states (sitting, resting, waiting, observing)

✓ Body-position variety:
  • Mid-spacewalk / mid-tether (~20%)
  • Mid-fire / mid-blast / mid-fire-blaster (~15%)
  • Mid-lever-pull / mid-console-stab / mid-system-emergency (~15%)
  • Mid-airlock-cycle / mid-hatch-vault (~10%)
  • Multi-figure interaction (rescue, hand-off, repair-team, defense-line) (~20%)
  • Mid-leap / mid-fall in low-gravity (~10%)
  • Mid-pilot in cockpit (~10%)

Each entry must:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs (commander, pilot, engineer, scientist, marine, alien, etc.) with brief identifier (EVA-helmet visor / blaster-rifle / engineer-overall)
• Describe the SHARED OBJECT or EVENT they're interacting with (alien artifact / tether-line / breach-panel / control-console / drifting debris / blast-impact)
• Imply the moment-before and moment-after
• PLASTIC SCALE — minifig anatomy (C-shaped hands / two-stud arms / printed visor)`,
    touchpoints: [
      'Mid-tether-arrest of a drifting EVA-suited engineer (orange-stripe visor) caught by a second EVA-tethered crew member at the airlock with C-grip clamped on the engineer\'s wrist, the tether line trailing back into open vacuum, hull-breach venting trans-cyan atmosphere visible',
      'Mid-blast of a heavy plasma cannon on a Blacktron fighter, trans-orange + trans-yellow cone of flame elements bursting from the muzzle, pilot minifig at the controls in helmeted-visor with one C-hand on a control-stick, target enemy fighter in the deep distance already breaking formation',
      'Mid-lever-pull of an emergency-jettison handle by a commander minifig (red-trim EVA-suit) on the bridge, a second officer mid-shout-warning behind them, the brick-built viewscreen showing escape-pods already separating from the parent-ship',
      'Mid-airlock-cycle with three EVA-suited explorers stacked in the airlock chamber, the first minifig\'s C-grip on the outer-hatch lever pulled forward, the chamber atmosphere visualized by trans-cyan plate elements receding, the alien-world surface visible through the open outer port',
      'Mid-canopy-eject of a Galaxy Squad pilot minifig (orange-cyan flightsuit) firing upward from a stricken fighter, ejection-seat trailing trans-yellow thrust elements, the doomed fighter mid-spiral below, a wingman fighter banking in the distance to circle the eject-site',
      "Mid-grasp of an alien artifact (trans-purple crystalline brick-element on a stand) by an EVA-suited science officer, the artifact starting to glow trans-magenta around the contact-point, second crew member behind the lead reaching to pull them back, the moment-before-the-power-surge",
      "Mid-drill-bite of an asteroid-mining rig by the engineer-operator at the drill-station, drill-head (gear + cone parts) sinking into the asteroid surface with debris-1×1-round-plates flying outward, second crew at the ore-collector mid-catch of the falling chunks",
      "Mid-leap in lunar-gravity by a Classic LEGO Space astronaut (yellow torso) over a low crater rim, both feet off the surface, lunar-rover in the deep distance, scale-prover micro-figure at the rover, the iconic-low-gravity-bound moment",
      'Mid-system-failure as a chief engineer minifig (greasy-overall print) yanks an exposed power-cell free from a panel while sparks (trans-yellow 1×1 round-plates) burst from the bay, second engineer behind mid-shout with C-grip on a fire-extinguisher accessory',
      "Mid-blaster-fire-exchange in a station corridor with three security minifigs (Space Police white-blue) in cover positions firing at two raider minifigs at the corridor's other end, trans-red bolt-elements crossing the gap mid-flight",
      "Mid-spacewalk-tether-snap as an EVA crew member's tether parts mid-frame (severed end whipping back toward camera), the spacewalker mid-recoil reaching for a hull-handhold, fellow crewmate at the airlock mid-throw of a second backup-tether",
      "Mid-deflector-up as the bridge officer minifig at the defensive-systems console slams a C-hand down on an activator-stud, the brick-built deflector-array on a viewscreen tile lighting trans-cyan, a second officer at navigation mid-evasive-spin of the helm",
      "Mid-hatch-vault of a marine minifig (Galaxy Squad orange-cyan) through a sliced-open bulkhead into the next compartment, smoke (cotton-batting 1×1 white plates) curling from the breach, second marine behind mid-charge to follow through the gap",
      "Mid-pad-launch as a Tintin-retro 1960s lander ignites engines (trans-orange + trans-yellow cone), bystander minifigs at the launch-pad fence mid-recoil from the heat, the lander beginning to lift off the brick-built launch-cradle",
      "Mid-rescue-pull of a casualty (limp minifig with damage-marks-print) from the rubble of a collapsed habitat-module, two rescue-crew with C-grips on the casualty's shoulders, third rescue minifig mid-stabilizing-pole at the ceiling-beam",
      "Mid-reactor-emergency-cycle by a Mass-Effect-coded engineer (gunmetal hardsuit) at a primary reactor console, trans-cyan coolant elements venting from a side-pipe, secondary engineer mid-call on a comm-piece warning the bridge",
      "Mid-cargo-transfer of a stolen contraband-crate between a Blacktron smuggler at a ship's cargo door and a shore-side fence at a dock-platform, the crate suspended mid-pass between them, lookout at a corner mid-warning-wave",
      "Mid-hostile-drone-defense as two scout minifigs in EVA-suits with mining tools-as-improvised-weapons swing at an incoming drone (brick-built 1×1 round-plate fuselage with antenna-wings) hovering over the dig-site",
      "Mid-zero-G-recoil of a marine after firing a heavy blaster braced against a corridor bulkhead, the recoil-force pushing them backwards-in-vacuum into a teammate behind, trans-red bolt-element trailing from the muzzle",
      "Mid-distress-flare launch as a stranded survivor minifig on an alien-world peak fires a flare-pistol skyward, trans-orange flame element arcing up, a second survivor at the camp mid-wave to draw the rescue-shuttle visible in deep distance",
    ],
    instructions: `Each entry is ONE space minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "minifigs standing", NO "astronaut posing", NO "watching" / "looking at" / "gazing", NO passive states. Story beat + verb + cause/effect always.`,
  },

  // ─── build_technique — space-MOC distinguisher ───
  brickbot_space_build_technique: {
    format: 'simple',
    theme: `LEGO SPACE MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot space path. Each entry is ONE specific MOC technique that makes a space diorama read as "Bricklink AFOL convention build" instead of "official LEGO Space set photo." Each entry 25-45 words.

VARIETY MANDATE — distribute across:
  • SNOT construction for rounded sci-fi hulls (Classic Space dome curves / Blacktron wedge curves / M-Tron magnet-coupling curves)
  • Trans-piece engine flares (trans-orange + trans-red flame elements stacked at thruster cones, trans-yellow ion-blast cores)
  • Trans-piece nebula construction (trans-magenta + trans-cyan + trans-purple layered plates as cosmic dust clouds)
  • Technic articulation (landing gear unfolding / robotic arms / cargo-loader cranes / blast-doors)
  • Hard-SF panel-line detail (greebles / hull-plating staggered tile-offset / texture from 1×1 cheese slopes)
  • Illegal techniques (bent flex-tubes / clip-and-bar non-canon joints / brick-bending / clutch-on-tile)
  • Microscale tricks (minifig-accessory repurposed: lightsaber as engine-glow rod, croissant as alien-tail, dragon-wing as solar-sail)
  • Studded-vs-tile texture contrast (studded deck-plating for interior decks / tiled smooth panels for exterior hull-plating)
  • Glow / accent lighting techniques (trans-pieces as backlit panels, illegal LED-brick alternatives, fiber-optic-style stacks)
  • Cross-section / cutaway construction (revealing interior detail through brick-by-brick framing)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH SPACE BUILD ELEMENT it applies to (hull / engine / nebula / landing-gear / station-interior / etc.)
• Specify the SPECIFIC BRICK PARTS used (named: 2×2 round-dish / Technic axle-pin / trans-orange flame element / 1×1 cheese slope)
• Imply the visual IMPACT`,
    touchpoints: [
      'SNOT-built Classic-Space dome curvature — vintage Classic Space cockpit dome built with SNOT bracket-plates turning curved-slope bricks sideways for a continuous hemispheric profile, using 4×4 inverted-dome elements with bley-frame border tiles for the iconic 6970-Beta-1 Command Base silhouette',
      'Trans-piece engine-flare stack — thruster cone built from trans-orange 1×1 round-plates clustered at the throat, transitioning to trans-yellow flame elements at mid-cone, with a trans-clear bar-element extending the heat-shimmer plume aft of the nozzle, suggesting active burn',
      'SNOT-curved Classic LEGO Space hull — Cosmic Fleet Voyager-style hull built with sideways-stud bracket plates turning curved-slope bricks parallel to the keel-axis, yellow + light-bley tile cladding offset half-stud for panel-line texture, trans-blue cockpit canopy at the bow',
      'Trans-magenta + trans-cyan nebula stack — distant nebula built as a layered cloud of trans-magenta plates underneath trans-cyan tiles offset half-stud, scattered trans-purple 1×1 round-plates as denser cores, with cotton-batting white 1×1 round-plates for nebular haze across the field',
      'Technic-articulated landing gear — three-strut landing gear built with Technic axle-pin joints at the hip and knee, allowing real deploy-retract motion, hydraulic-cylinder detail via stacked 1×1 round-bricks, foot-pad built from inverted slope-bricks for proper ground-contact',
      "Greebled hard-SF hull plating — exterior surface of a frigate built with 1×1 cheese slopes, 1×2 jumper plates, brackets, and exposed-rod technic-pin details staggered in pseudo-random pattern, creating maximum panel-line + venting + access-hatch visual density",
      "Illegal flex-tube cabling — Blacktron-style power-conduit cabling built from black flex-tube pieces (technically illegal in pure-LEGO purist build) routed across an exposed bulkhead between brick-built junction-boxes, suggesting realistic ship-engineering",
      "Microscale lightsaber engine-glow — repurposed minifig lightsaber-blade pieces in trans-blue + trans-green inserted into thruster-cones as the visible plasma-stream, the hilt portion hidden inside the nozzle structure, suggesting a coherent plasma-jet beam",
      "Microscale solar-sail dragon-wing — repurposed minifig dragon-wing pieces in trans-clear or trans-white attached via clip-and-bar connection to a solar-sail mast on a deep-space probe, fanned out to suggest light-pressure sails, creative non-canon part-usage",
      "Tile-vs-stud texture split on station-deck — interior corridor of a space station with tiled smooth-grey floor panels for the central walking-path and exposed-stud deck-grating panels along the bulkhead-edges, the visual contrast separating the spaces",
      "Trans-clear cockpit canopy with internal greeble — cockpit canopy built from trans-clear curved-slope pieces over an internal greebled instrument-panel of 1×1 round-tiles in alert-colors (red/amber/green), with pilot minifig visible inside, the canopy reflecting hangar lights",
      "Cross-section frigate cutaway — frigate hull built as a half-cutaway with the starboard hull-plating intact and the port-side completely exposed showing brick-built rib-frames + decks + corridors + engine-rooms layered across multiple levels, the AFOL-cutaway display piece",
      'Trans-piece ion-engine core — main engine nozzle built around a trans-cyan 4×4 round-dome at the core surrounded by exposed Technic-axle structure with brick-built coolant-piping, the trans-cyan visible through gaps suggesting cold-plasma drive',
      "Studded-stud Classic-Space launch-pad — launch pad built from solid studded yellow plates with surface-detail in light-bley tile insets, the studded surface celebrating the iconic Classic-Space yellow-grey identity rather than tile-smoothing it for realism",
      "Macrocanon Blacktron-II wedge silhouette — Blacktron II Aerial Intruder distinctive wedge built using SNOT bracket-plates running diagonally from the bow vertex, black + neon-yellow + trans-yellow wedge-plates layered with greeble-tile underbelly, instantly clocking as Blacktron canon",
      "M-Tron magnet-cruiser red-and-black palette discipline — vehicle built strictly with M-Tron heritage palette (M-Tron-red + black + lime-green + trans-fluorescent accents), magnet-elements deliberately exposed at coupling-points, the 1990-1991 M-Tron set 6989-Mega-Core lineage",
      "Blacktron stealth-fighter wedge — Blacktron-I or II palette discipline (black + neon-yellow + trans-yellow + Blacktron-orange), wedge-silhouette with hidden gun-port reveals at deploy, the iconic 1987-1993 Blacktron antagonist canon, every brick black except neon-trim",
      "Insectoids organic-hive curvature — alien-hive structure built using illegal flex-tube spines + bend-bricks for organic curvature, trans-purple + trans-green for translucent dome-sections, scattered 1×1 round-plates in trans-violet as bioluminescent residue, the 1998-1999 Insectoids canon",
      "Ice-Planet 2002 white-orange palette — ice-themed vehicle in pure-white + neon-orange trim with trans-clear ice-crystal accents, ice-saw-blade-elements as signature, the 1993 Ice Planet 2002 set 6973-Deep-Freeze-Defender lineage motif",
      "Galaxy Squad split-ship modular — fighter built as two detachable halves connected by a Technic-axle-pin trigger-coupling so the ship visibly splits-apart in-build, orange-cyan palette discipline with bug-alien-encounter motifs, the 2013 Galaxy Squad set 70705 lineage",
    ],
    instructions: `Each entry is ONE MOC space-build technique, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "3D-print / paint / glue"); LEGO bricks only. Name SPECIFIC part types (1×2 slope / trans-orange flame / Technic axle pin).`,
  },

  // ─── camera_framing — space-specific framings ───
  brickbot_space_camera_framing: {
    format: 'simple',
    theme: `SPACE-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the space path. Each entry is ONE camera position + framing rule specific to SPACE diorama subject matter. Each entry 15-30 words.

⚠️ Bespoke — leverage space-specific scenery (hangar-vault / cockpit-canopy / EVA-tether / nebula-vista / planet-horizon / airlock-corridor / docking-bay) rather than generic photography terms.

VARIETY MANDATE — distribute across:
  • Vertigo angles (worm's-eye up a thruster / under a docking ring / from EVA looking up at hull)
  • Cockpit POV (from-pilot-seat through canopy / over-shoulder of captain on bridge)
  • EVA POV (tether's-eye view back at hull / drifting-debris perspective)
  • Wide planet-horizon establishing (ship over curved planet / station on lunar horizon / Mars expanse)
  • Hangar-vault perspectives (camera at deck-end looking down vault of receding fighter-cradles)
  • Nebula / cosmic vista (ship silhouetted against vast nebula cloud)
  • Cross-section cutaway POV (camera at the cutaway face of a half-built ship)
  • Mission-control wide (camera at back of room looking past consoles toward wall-board)
  • Asteroid-belt POV (camera embedded in asteroid debris / under-asteroid up at ship)
  • Cargo-bay loading (camera at the gantry overhead looking down at loading)
  • Air-lock POV (camera inside the airlock as outer door opens)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element this angle DRAMATIZES
• Reference space-specific scenery elements`,
    touchpoints: [
      "HANGAR-BAY VAULT WIDE — camera at the deck-end of a fleet hangar looking down the receding rows of fighter-cradles, the hero-fighter in the foreground filling the lower-third, the vault arches receding toward a vanishing-point, hangar lighting in trans-amber strips along the bulkheads",
      "EVA-TETHER POV — camera looking BACK from the perspective of an EVA-suited crew member at the end of a tether, the parent-ship hull receding in the upper frame, the tether-line connecting back to the airlock, scale-prover hand visible in foreground",
      "COCKPIT-CANOPY OUT — camera from the pilot-seat looking out through the curved trans-clear canopy at the open-vacuum starfield, instrument-greeble visible in the lower-frame around the canopy-edge, pilot's helmeted reflection partially in the canopy glass",
      "NEBULA-VISTA-FROM-BRIDGE — camera positioned on the bridge looking out the brick-built viewscreen at a vast nebula filling the deep distance, the bridge consoles + officer minifigs framing the lower-third silhouetted against the bright nebula light",
      "PLANETSIDE WIDE-ESTABLISHING — camera at low-angle on an alien-planet surface looking toward the deep distance where a lander rests against a vast curved planet-horizon, scattered terrain features receding into perspective, the SKY-baseplate dominating the upper-half",
      "UNDER-THE-THRUSTER VERTIGO — camera flat on the launch-pad surface looking STRAIGHT UP at the underside of a launching ship's thruster array, four engine-bells receding in perspective overhead, trans-orange flame elements bursting from the nozzles toward the camera",
      "AIRLOCK-INTERIOR POV — camera positioned inside an airlock chamber looking at the outer-door as it cycles open, the door retracting upward into the bulkhead-frame, the alien-world or open-vacuum visible through the widening gap, atmospheric-element streamers venting",
      "DOCKING-RING ORBITAL APPROACH — camera positioned on the side of a vast orbital ring station looking back along the rim, a shuttle on final-approach to a docking berth in the foreground, the curved station-horizon disappearing into deep distance with running-lights",
      "CROSS-SECTION CUTAWAY WIDE — camera at the cutaway face of a half-built frigate looking INTO the cutaway revealing rib-frames + decks + corridors layered through the ship, AFOL display-cutaway angle showing the build's interior complexity",
      "BRIDGE-OVER-SHOULDER — camera positioned just behind the right shoulder of the bridge captain in their command-chair, looking past their shoulder toward the viewscreen mounted on the bridge-front wall, secondary officers at consoles in the mid-frame",
      "ASTEROID-DEBRIS POV — camera embedded in an asteroid debris-field looking out at a ship navigating through the field, asteroid-fragments framing the foreground as silhouetted obstacles, the ship visible through gaps in the debris-cloud",
      "MISSION-CONTROL VAULT — camera at the back of a Tintin-retro 1960s mission-control room looking past rows of console-banks toward a wall-sized mission-board in the deep-distance, executive observers in the viewing-gallery above, vintage palette throughout",
      "WORM'S-EYE UP DOCKING-PYLON — camera at deck-level looking up the side of a vertical docking-pylon mast, the docking-clamps and observation-deck visible higher up the mast, a docked ship's hull partially visible at the top edge, severe upward perspective",
      "OVER-THE-RIM CRATER — camera positioned on the rim of a lunar crater looking down into the crater interior where a lander rests against the crater-floor, scattered terrain features at the crater-floor, lunar-rover and scale-prover minifig visible mid-frame",
      "EVA-DRIFTING-DEBRIS POV — camera at the perspective of debris drifting past an EVA-repair scene, the crew member tethered to the hull-breach in the mid-frame, scattered hull-fragments framing the foreground as silhouettes, the parent-ship as background",
      "CARGO-BAY-GANTRY DOWNSHOT — camera at the top of a cargo-bay gantry looking straight down at the loading-floor below, crew swarming around stacked cargo-containers, brick-built cranes and lifting-arms framing the upper portion of the frame",
      "LANDING-SHUTTLE THROUGH-WINDOW — camera positioned at a passenger-cabin window of a descending landing-shuttle looking out at the planet-surface approaching, the cabin window-frame framing the view, brick-built shuttle-interior elements at the cabin edge",
      "ALIEN-CAVE BIOLUMINESCENT WIDE — camera positioned at the mouth of an alien cave looking deep into the cavern interior where bioluminescent trans-cyan growth illuminates the cave walls, explorers in the mid-distance approaching an artifact at the cavern center",
      "ESCAPE-POD JETTISON SIDE-VIEW — camera positioned alongside the parent-ship as a cluster of escape-pods jettisons from the side, pods trailing trans-orange flame, the parent-ship leaning at a damaged angle, the moment captured side-on",
      "REFIT DRYDOCK OVERHEAD — camera positioned at the overhead crane-rail looking down at a ship in drydock, drydock supports framing the ship below, refit-crew swarming on multiple decks of the ship, the AFOL-display dock with maximum visible detail",
    ],
    instructions: `Each entry is ONE space-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms ("medium shot / wide shot") without space-specific anchoring — every entry must reference space scenery (hangar / cockpit / EVA / nebula / planet / docking / airlock).`,
  },

  // ─── vehicle_class — silhouette anchor (REWEIGHTED R1 — 50% no-vehicle variants) ───
  brickbot_space_vehicle_class: {
    format: 'simple',
    theme: `SPACE SUBJECT-CLASS ANCHOR — for the space path. This pool controls whether the diorama centers on a SHIP, an INTERIOR scene, a LANDSCAPE-with-character, or a SPACE-CITY. Each entry 12-30 words.

⚠️ WEIGHTED DISTRIBUTION — critical for path variety. Generate the output as:
  • ~40-45% NO-VEHICLE variants (the diorama is an INTERIOR scene, a LANDSCAPE-with-character, or a SPACE-CITY — ZERO ship rendering in frame)
  • ~55-60% SHIP / VEHICLE variants (the diorama centers on a specific ship/vehicle silhouette)
  Ships should be the slight majority — the brand-center of the path is space-vehicles, but interior/city/landscape variety is the bending advantage.

⚠️ HARD RULE FOR NO-VEHICLE ENTRIES — when ANY entry begins with "no-vehicle (...)" the cross-axis template clause enforces ZERO ships in the rendered frame. The bracketed descriptor specifies what IS the subject.

⚠️ STORY-TENSION MANDATE FOR NO-VEHICLE ENTRIES — every no-vehicle entry MUST embed an action-tension descriptor in the bracketed phrase or the body. Examples:
  ❌ Weak: "no-vehicle (bridge interior) — console-banks, captain's chair, viewscreen"
  ✓ Strong: "no-vehicle (bridge mid-engagement) — alert-klaxon trans-red strobing overhead, multiple officers MID-ACTION at stations, captain leaning forward shouting orders, viewscreen showing the enemy fleet"
  ❌ Weak: "no-vehicle (mess hall) — crew dining, tables, port-window"
  ✓ Strong: "no-vehicle (mess hall mid-evacuation) — half-finished meals abandoned, crew mid-rush toward the corridor, klaxon overhead, the port-window showing the threat outside"
  ❌ Weak: "no-vehicle (Coruscant-coded planet-city) — sky-towers, mass-transit, urban density"
  ✓ Strong: "no-vehicle (Coruscant-coded planet-city mid-chase) — sky-towers receding in deep distance, transit-lanes streaking with traffic, two minifig pedestrians on a ledge mid-pursuit, scale-prover crowd below"

The TENSION DESCRIPTOR can be: mid-engagement / mid-emergency / mid-evacuation / mid-cycle / mid-launch / mid-arrival / mid-discovery / mid-rescue / mid-system-failure / mid-pursuit / mid-arrest / mid-investigation / mid-trade-dispute / mid-celebration / mid-rush / pre-launch tension / aftermath-of-fight / quiet-before-storm / discovery-moment.

VARIETY MANDATE — distribute across these subject categories:

═══ NO-VEHICLE INTERIORS (~25% of pool) ═══
  • no-vehicle (bridge interior, command stations, viewscreen) — generic-LEGO-Space command bridge
  • no-vehicle (hangar bay, fighters on cradles, deck crew, gantries) — busy fleet hangar
  • no-vehicle (airlock chamber, mid-cycle, EVA prep) — pressure-cycle moment
  • no-vehicle (cargo bay, stacked containers, loading-crane) — freight-hold scene
  • no-vehicle (mess hall, crew dining, port-window) — daily-life space
  • no-vehicle (med bay, casualty on bunk, medical-tech) — emergency-treatment
  • no-vehicle (engine room, reactor-core, engineer at console) — system-failure moment
  • no-vehicle (corridor, ship's spine, crew commuting) — between-stations transition
  • no-vehicle (observation deck, viewing window, planet beyond) — contemplative moment
  • no-vehicle (briefing room, holo-table, officers gathered) — pre-mission planning
  • no-vehicle (laboratory, alien-artifact under analysis, science crew) — discovery
  • no-vehicle (escape pod interior, crammed crew, ejection-sequence) — emergency
  • no-vehicle (mission control room, console operators, wall-board) — ground-side Apollo-era

═══ NO-VEHICLE LANDSCAPES + CHARACTERS (~12% of pool) ═══
  • no-vehicle (alien planet vista, character party exploring, deep-distance terrain features) — exploration
  • no-vehicle (lunar landscape, astronaut walking, planet-rise on horizon) — Apollo-coded moment
  • no-vehicle (Mars colony surface, colonist tending equipment, base in distance) — daily-frontier-life
  • no-vehicle (asteroid surface, mining crew at work, deep-vacuum overhead) — extraction-site
  • no-vehicle (alien jungle / cave / ice-shelf, EVA scientists, biome-coded terrain) — biome-exploration

═══ NO-VEHICLE SPACE CITIES (~13% of pool) ═══
  • no-vehicle (Coruscant-coded planet-city, layered urban density, sky-tower forest, mass-transit) — ecumenopolis
  • no-vehicle (orbital megacolony, vast ring structure interior, populated levels) — O'Neill-cylinder canon
  • no-vehicle (asteroid mining city, hollowed asteroid interior, layered habitat-decks) — LEGO mining-city iconic-LEGO heritage
  • no-vehicle (Citadel-coded station-city, multi-arm habitat, hub-and-spoke megastructure) — Mass-Effect Citadel
  • no-vehicle (lunar capital, glass-dome cluster, brick-built spires, lunar-surface visible beyond) — colony-city
  • no-vehicle (spaceport hub, multi-ship docking, customs, traders, multi-species crowds) — Mos-Eisley-coded
  • no-vehicle (Babylon-5-coded torus station, multi-level concourse, multi-species shoppers) — diplomatic-station

═══ SHIPS / VEHICLES (~50% of pool) ═══
  • Classic LEGO Space silhouettes (lunar-rover / Classic Space cruiser / Cosmic Fleet Voyager / Beta-1)
  • Blacktron wedge silhouettes (Blacktron-I Mission Commander / Blacktron-II Aerial Intruder)
  • M-Tron cruiser silhouettes (Mega Core Magnetizer)
  • Space Police cruiser / Ice Planet defender / Unitron / Mars Mission / Insectoids variants
  • Galaxy Squad split-ships (modular dual-half fighter)
  • Additional LEGO Space variants (Space Police III pursuit cruiser / Insectoids hive-ship / Mars Mission lander / Galaxy Squad bug-fighter)
  • Additional iconic LEGO Space ships (Galaxy Explorer 497 / Space Police peace-keeper 6886 / Insectoids Hive Crawler 6907 / Mars Mission MX-91 walker 5969 / M-Tron Stardefender 6932 / Classic Space modular rover)
  • Retro-future (Tintin Destination Moon lander / 2001 ASO Discovery One / Apollo CSM / Soyuz)
  • Asteroid-mining hauler / refueling tanker / smuggler-runner
  • EVA suit silhouettes (Classic Space yellow / Blacktron black / M-Tron red / Ice Planet white-orange / Mars Mission orange / Apollo NASA white / Tintin bubble-helmet)

⚠️ "FRIGATE / CRUISER / CORVETTE / DREADNOUGHT" DRIFT GUARD — when an entry names a class that has a naval-surface counterpart (frigate / cruiser / corvette / dreadnought), ALWAYS include the explicit qualifier "STARSHIP frigate" / "interstellar cruiser" / "STARSHIP corvette" — never just "frigate" alone. Lesson: R0b #1 rendered as a naval surface frigate when the word "frigate" wasn't sci-fi-anchored.

Each entry must:
• Begin with either "no-vehicle (...)" or the explicit ship-class name
• For SHIP entries: name the class + hull-profile + thruster arrangement + crew capacity
• For NO-VEHICLE entries: specify what IS the dominant subject (interior type / landscape / city) + key environmental detail
• ZERO mixing — a no-vehicle entry NEVER mentions any ship/vehicle silhouette`,
    touchpoints: [
      'no-vehicle (bridge mid-engagement) — Mass-Effect-coded command bridge with klaxon trans-red strobing overhead, console-banks in concentric arcs, captain leaning forward MID-SHOUT of orders, three officers MID-ACTION at stations, viewscreen showing the enemy fleet bearing down, alert-pattern chaos',
      'no-vehicle (hangar bay mid-launch-scramble) — fleet hangar with multiple fighters on cradles, lead fighter mid-engine-test with trans-orange flame elements bursting, pilot mid-sprint toward the cockpit ladder, deck-crew mid-evac of the launch-pad, ordnance-trolleys mid-roll',
      'no-vehicle (airlock mid-cycle) — pressure-cycle chamber mid-decompression with trans-cyan venting streamers receding, three EVA-suited crew tense at the outer hatch, lead crew member mid-grip on the cycle-lever, the alien-world or open-vacuum visible through the widening door-gap',
      'no-vehicle (cargo bay mid-loading-emergency) — interior cargo hold with stacked containers mid-shift, brick-built loading-crane gantry overhead with a crate mid-swing, deck-crew mid-dive away from the falling cargo, trans-yellow alert-strips strobing',
      'no-vehicle (mess hall mid-evacuation) — crew dining commons with half-finished meals abandoned, ration-trays mid-spill across tables, four crew mid-rush toward the corridor exit, klaxon trans-red overhead, the port-window showing the threat-event outside',
      'no-vehicle (med bay mid-trauma) — interior medical bay with casualty minifig on the bunk bloodied (red-print torso), doctor MID-ACTION over the patient with instrument, medical-tech mid-shout into a comm-piece, trans-red alert-light overhead pulsing',
      'no-vehicle (engine room mid-system-failure) — reactor-core chamber with the central reactor stack venting trans-cyan coolant streamers, engineer MID-LEVER-PULL on emergency-shutdown, second engineer mid-shield with arm raised, sparks (trans-yellow round-plates) bursting from a side-pipe',
      'no-vehicle (corridor mid-pursuit) — ship\'s spine-corridor with receding bulkhead frames, lead minifig MID-SPRINT toward the camera, pursuer minifig mid-charge behind with weapon drawn, trans-amber strip-lighting strobing alert-pattern, the chase compressed into the long perspective',
      'no-vehicle (observation deck mid-realization) — large brick-built viewing-window dominating one wall, two crew minifigs at the window MID-RECOIL as they realize what they\'re seeing outside, the threat (alien fleet / supernova / black hole) visible through the glass',
      'no-vehicle (briefing room mid-revelation) — brick-built holo-table at center projecting a trans-blue tactical layout, officers gathered around in tense planning posture, lead officer MID-POINT at a critical detail on the holo, the mood shifting from routine to alarm',
      'no-vehicle (laboratory mid-discovery) — science-bay interior with alien-artifact (trans-purple crystalline element) suddenly GLOWING under analysis, lead scientist MID-RECOIL with hands raised, secondary scientist mid-shout warning into a comm, instruments mid-overload (sparks)',
      'no-vehicle (escape pod interior mid-ejection) — cramped pod with three minifigs strapped into bench seats mid-launch-G with bodies pressed back into seats, trans-yellow alert overhead, the parent-ship debris visible through the porthole behind receding, the moment of separation',
      'no-vehicle (mission control room mid-crisis) — Apollo-era ground-control room with wall-board flashing red status, console-operators MID-ACTION at their stations, flight-director MID-SHOUT of orders, executive-gallery above watching in tense silence, mid-anomaly-response moment',
      'no-vehicle (alien planet vista mid-discovery) — wide alien-planet surface with three EVA explorers cresting a ridge to suddenly see what\'s in the valley below, lead explorer MID-FREEZE pointing toward the discovery, vast curved planet-horizon receding behind',
      'no-vehicle (lunar landscape mid-rescue) — light-bley lunar surface with one Classic Space astronaut MID-SPRINT toward a fallen second astronaut, lunar-rover damaged in mid-distance, Earth-rise on the horizon, mid-emergency moment',
      'no-vehicle (Mars colony surface mid-dust-storm) — rust-red Mars surface with colonists MID-RUSH for shelter, equipment-modules being abandoned mid-procedure, dust-particle trans-orange elements obscuring the deep-distance, mid-storm-arrival',
      'no-vehicle (asteroid surface mid-claim-dispute) — dark-bley asteroid surface with two mining-crews MID-CONFRONTATION at a shared extraction-site, drills mid-stop, lead figures from each crew mid-shout-distance with weapons holstered, deep-vacuum overhead',
      'no-vehicle (alien jungle mid-encounter) — biome-coded alien jungle with trans-green + trans-purple alien-flora, EVA scientists MID-FREEZE as they see something move in the foliage, bioluminescent trans-cyan accents pulsing in alarm-pattern, hidden-threat tension',
      'no-vehicle (Coruscant-coded planet-city mid-chase) — vast ecumenopolis with sky-towers receding, two minifig pedestrians MID-SPRINT across a sky-bridge with pursuer minifig mid-leap behind, transit-lanes streaking trans-yellow below, urban-chase scale',
      'no-vehicle (orbital megacolony O\'Neill cylinder mid-festival) — vast cylindrical habitat interior with curved-floor cities on the opposite-arc, plaza filled with celebrating minifigs MID-DANCE, trans-color confetti elements drifting, mid-celebration packed-crowd energy',
      'no-vehicle (asteroid mining city mid-shift-change) — hollowed-asteroid interior with multi-deck habitats, tram-station packed with miner-minifigs MID-COMMUTE between shifts, lead miner MID-WAVE to a coworker, working-class daily-life-with-energy moment',
      'no-vehicle (Citadel-coded station-city mid-diplomatic-tension) — multi-arm hub interior with multi-species crowds on the concourse, two opposing diplomats MID-CONFRONTATION at the atrium center, surrounding crowd MID-RECOIL, the political-incident-moment',
      'no-vehicle (lunar capital mid-arrival-parade) — glass-dome capital with welcome-celebration in the plaza, minifig crowds MID-WAVE up at an arrived-shuttle landing-trail still visible overhead, banners + confetti elements, Earth-rise behind',
      'no-vehicle (spaceport hub mid-arrest) — multi-species spaceport concourse with security-officers MID-PURSUIT of a fleeing smuggler-minifig, customs-agent at a desk mid-call for backup, multi-species crowds MID-SCATTER, Mos-Eisley criminal-incident',
      'no-vehicle (Babylon-5-coded torus mid-trade-dispute) — toroidal station-interior with multi-level concourse, two trader-minifigs MID-SHOUT at each other across a brick-built trade-table, surrounding multi-species shoppers MID-STARE, the public-dispute moment',
      "Classic LEGO Space lunar-rover (1978-1987 lineage, 6970 Beta-1) — open-cockpit yellow-and-grey rover, six fat trans-blue wheels, single rear-mounted antenna, 1-2 crew capacity, the iconic LEGO Space surface-vehicle profile",
      "Classic LEGO Space Cosmic Fleet Voyager (6985 lineage) — long cigar-shaped main hull with two engine-pods, trans-blue cockpit canopy at the bow, vintage Classic-Space yellow-grey palette, 4-6 crew capacity",
      "Blacktron I Mission Commander (6986 lineage) — angular wedge-shaped fighter in black with neon-yellow trim, twin trans-yellow cockpit canopies, deltawing-style profile, 2 crew capacity",
      "M-Tron Mega Core Magnetizer (6989 lineage) — red-and-black hauler with prominent dorsal magnet-coupling, exposed magnet-elements on the hull-sides, lime-green trim, 3-4 crew capacity",
      "Ice Planet 2002 Deep Freeze Defender (6973 lineage) — white-orange Ice-Planet vehicle with twin trans-orange cockpit canopies, ice-saw-blade-element on the bow, 2 crew capacity",
      "Galaxy Squad split-ship Vermin Vaporizer (70704 lineage) — modular fighter that physically splits into two halves at a Technic-pin coupling, orange-cyan palette, 2 crew capacity",
      "Insectoids hive-ship (1998 lineage) — organic curved hull-form in purple-and-lime-green with trans-purple wing-panels, alien-bug aesthetic, 4-6 crew capacity",
      "Mars Mission lander (2007 lineage) — white-orange Earth-astronaut craft with quad-thruster lander legs, trans-orange engine glow, 3 crew capacity",
      'Space Police III pursuit cruiser (5974 lineage) — sleek white-and-blue pursuit cruiser with twin pursuit-engines and trans-blue forward shield, 2 crew capacity',
      "Classic LEGO Space Galaxy Explorer (497 lineage) — long cigar-shaped trans-blue cockpit hull with twin rear-engine pods and folding solar-panel arms, the original 1979 LEGO Space flagship, 4 crew",
      "Space Police I Galactic Peace Keeper (6886 lineage) — blue-and-white pursuit cruiser with twin trans-blue cockpit canopies and bow-mounted comm-dish, 1989 LEGO law-enforcement heritage, 2-3 crew",
      "Tintin Destination Moon lander — red-and-white checkered classic 1950s tintin space-rocket silhouette, tail-fins stabilizing the base, retro-future fictional space-craft canon",
      "2001 ASO Discovery One — central pod-shaped command sphere + long spinal truss + spherical fuel-tanks at the tail, no-wings hard-SF spacecraft, 5 crew capacity",
      "Asteroid-mining hauler STARSHIP — boxy industrial interstellar cargo-vessel with prominent claw-arms + ore-bay aft, multiple fuel-tanks externally mounted, working-class space-craft profile",
      "Apollo CSM-style command module — bell-shaped capsule + cylindrical service-module + nozzle, 3 crew capacity, the iconic 1960s NASA Apollo Command-Service Module silhouette",
    ],
    instructions: `Each entry is ONE subject-class anchor, 12-30 words. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~50% no-vehicle variants (interiors + landscapes + space-cities) + ~50% ship/vehicle variants. STRICT BANS: never mention BOTH a ship AND an interior in the same entry; never use bare "frigate / cruiser / corvette" without "STARSHIP" or "interstellar" qualifier. NO-VEHICLE entries must specify what IS the dominant subject.`,
  },

  // ─── register — era+faction bender ───
  brickbot_space_register: {
    format: 'simple',
    theme: `SPACE REGISTER — era + faction lock for each render. Each entry is ONE specific LEGO-Space-canon or sci-fi-canon register that controls the crew attire + build motifs + props. Each entry 20-40 words.

⚠️ WEIGHTED DISTRIBUTION — Kevin's 10-heart calibration 2026-05-22 showed iconic LEGO Space heritage > hard-SF realism. Pool weights:
  • ~80% ICONIC LEGO SPACE HERITAGE — Classic Space 1978-87 / Blacktron I+II / M-Tron / Space Police I-III / Ice Planet 2002 / Galaxy Squad / Insectoids / Mars Mission / Unitron
  • ~15% RETRO-FANTASY NON-LICENSED — Tintin Destination Moon / Foundation Genetic Dynasty (Asimov-Apple) / Apollo-era NASA historical / 2001 ASO
  • ~5% SPECIALTY — Foundation imperial palace + Classic LEGO Space rare variants

NEVER LEGO Star Wars (X-wings / TIEs / Falcon / Star Destroyer / stormtroopers / Mandalorian / Beskar / Imperial / Rebels / Jedi) — that IP is OUT of scope for BrickBot.

NEVER hard-SF realism registers (Mass Effect / Normandy / N7 / Expanse / Rocinante / Martian Marine / cyberpunk-space / solarpunk-space) — they photoreal-drift away from the LEGO MOC signal.

REGISTER CATEGORIES — distribute as:
  • ~12% CLASSIC LEGO SPACE (1978-1987) — yellow-and-grey astronaut suits, trans-blue cockpit-canopies, fictional friendly-explorer Earth-fleet
  • ~7% SPACE POLICE (I-III) — white-and-blue sci-fi cop force, the 1989+ LEGO law-enforcement-in-space variant
  • ~7% ICE PLANET 2002 — white-and-orange ice-themed explorer faction with ice-saw equipment, the 1993 LEGO arctic-space theme
  • ~5% UNITRON (1994) — blue-and-white friendly explorer variant of Classic Space
  • ~5% MARS MISSION (2007) — astronauts vs aliens, white-orange-grey palette
  • ~5% INSECTOIDS (1998) — purple-and-green organic alien faction
  • ~10% BLACKTRON I + II — black-and-neon-yellow antagonist faction, the iconic 1987-1993 LEGO Space rivals
  • ~7% M-TRON (1990-1991) — red-and-black magnet-themed faction
  • ~5% GALAXY SQUAD (2013) — orange-and-cyan bug-fighters with split-ship motif
  • ~7% APOLLO-ERA NASA HISTORICAL — pure-white Apollo-era spacesuits, gold-foil heat-shielding, Saturn-V launch-team gear
  • ~5% FOUNDATION IMPERIAL GENETIC DYNASTY — Empire-purple imperial officer + ornate-galactic uniform / Cleon dynasty / Asimov-Foundation canon
  • ~5% STAR CITIZEN MERCENARY CREW — mercenary multi-faction-coded crew in earth-tones with hacked-tech accessories, multi-species crew composition
  • ~3% CLASSIC LEGO SPACE LUNAR BASE (1979-83) — yellow-and-grey moonbase variants with trans-blue dome cluster
  • ~3% CLASSIC LEGO SPACE SPACE-STATION — additional Classic Space space-station crew variant
  • ~3% TINTIN DESTINATION MOON RETRO — red-and-white checkered tintin-rocket aesthetic, 1950s comic canon
  • ~2% 2001 A SPACE ODYSSEY — minimalist all-white spacesuits, Discovery-One aesthetic, Kubrick canon
  • ~2% FOUNDATION (Apple/Asimov) — Empire-purple imperial aesthetic, Foundation-cream rebellious aesthetic
  • ~2% CLASSIC LEGO SPACE DEEP-PATROL — additional Classic Space variant with deep-space patrol motif
  • ~2% TINTIN DESTINATION MOON VARIANT — additional retro Tintin-coded variant
  • ~2% APOLLO 1960s NASA REAL-HISTORICAL — historically-accurate Apollo astronauts + Saturn-V launch teams

Each entry must:
• Name the register in first 4-8 words
• Specify CREW ATTIRE characteristics (suit color / helmet style / weapon-type)
• Specify BUILD MOTIFS (signature elements / faction marker)
• Specify any restrictions (when register fires, vehicle_class auto-aligns)`,
    touchpoints: [
      "CLASSIC LEGO SPACE (1978-1987) — yellow-torso astronaut suits with white air-tank backpacks, trans-blue cockpit canopies, fictional friendly-explorer Earth-fleet, the path's brand-center register",
      "SPACE POLICE I (1989-1991) — white-and-blue sci-fi cop force with trans-blue visors, anti-grav cruiser variants, prisoner-transport equipment, the LEGO law-enforcement-in-space heritage",
      "SPACE POLICE III (2009-2010) — refresh of Space Police with chrome-blue + neon highlights, more aggressive antagonist-pursuit hardware, the LEGO 2009 reboot canon",
      "ICE PLANET 2002 (1993) — white-and-neon-orange ice-themed explorer faction with ice-saw-blade equipment + ice-crystal trans-pieces, the iconic 1993 LEGO arctic-space theme",
      "UNITRON (1994) — blue-and-white friendly explorer faction with mecha-and-cruiser variants, the lesser-known but heritage-coded Classic-Space cousin",
      "MARS MISSION (2007) — Earth-astronaut white-orange-grey suits vs Martian-alien grey-with-glowing-trans-orange-orbs, dueling-faction motif, the 2007 LEGO theme",
      "INSECTOIDS (1998) — purple-and-green organic-alien faction with bug-themed vehicles, trans-purple wings, alien-flora props, the LEGO 1998 alien-faction canon",
      "BLACKTRON I (1987-1990) — black-with-neon-yellow antagonist faction, wedge-shape ship silhouettes, the iconic 1987 LEGO Space rival force; vehicle_class becomes Blacktron variant",
      "BLACKTRON II (1991-1993) — refresh of Blacktron with more aggressive wedge profile + extending wing motif, the 1991 LEGO Blacktron successor canon; vehicle_class becomes Blacktron II variant",
      "M-TRON (1990-1991) — red-and-black faction with magnet-coupling motif on every vehicle, lime-green accent trim, the iconic magnet-themed 1990 LEGO Space variant; vehicle_class becomes M-Tron magnet-cruiser variant",
      "GALAXY SQUAD (2013) — orange-and-cyan modular-fighter faction with bug-alien rivals, ship-split-in-half mechanic, the 2013 LEGO theme; vehicle_class becomes Galaxy Squad split-ship variant",
      "APOLLO-ERA NASA HISTORICAL — pure-white Apollo-era spacesuits with gold-foil reflective heat-shielding, Saturn-V launch-team in flight-overall white shirts + skinny ties, the 1960s NASA program heritage",
      "FOUNDATION IMPERIAL GENETIC DYNASTY — Empire-purple imperial-officer attire, ornate-galactic-imperial uniforms with gold trim, the Asimov-Foundation Cleon dynasty canon",
      "CLASSIC LEGO SPACE SPACE-STATION — yellow-and-grey crew at an iconic Classic LEGO Space space-station with trans-blue dome cluster and rotating habitat-arms, 1980s heritage motif",
      'CLASSIC LEGO SPACE LUNAR BASE COMMAND — yellow-torso astronaut crew at a Classic-Space-era moonbase command post, trans-blue dome cluster, light-bley lunar terrain, the 1979-1983 LEGO Space moonbase heritage',
      "CLASSIC LEGO SPACE DEEP PATROL — yellow-torso patrol crew variants with deep-space patrol motif, longer-mission gear, exploration-style equipment, the 1980s LEGO Space exploration heritage",
      "TINTIN DESTINATION MOON — red-and-white checkered classic 1950s tintin-rocket astronauts with retro-bubble-helmets, the 1953 Hergé comic canon; vehicle_class becomes Tintin retro-lander",
      "2001 A SPACE ODYSSEY — minimalist all-white spacesuits with mirror-visor helmets, Discovery-One aesthetic, sterile Kubrick-canon palette; vehicle_class aligns to Discovery One",
      "FOUNDATION (Apple/Asimov) GENETIC DYNASTY — Empire-purple imperial-officer attire, ornate-galactic-imperial uniforms; vehicle_class becomes Imperial Foundation-cruiser variant",
      "TINTIN DESTINATION MOON HERGÉ — red-and-white checkered retro-rocket astronauts in bubble-helmet bone-white spacesuits, 1953 Hergé comic-canon, vehicle_class aligns to Tintin retro-lander",
    ],
    instructions: `Each entry is ONE space register lock, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT (per Kevin's 10-heart calibration 2026-05-22): ~80% iconic LEGO Space heritage (Classic Space variants / Blacktron I+II / M-Tron / Space Police I-III / Ice Planet 2002 / Galaxy Squad / Insectoids / Mars Mission / Unitron) + ~15% retro-fantasy non-licensed (Tintin Destination Moon / Foundation Genetic Dynasty / Apollo NASA / 2001 ASO) + ~5% specialty. STRICT BANS: (1) NEVER include LEGO Star Wars references (no X-wings / TIEs / Falcon / Star Destroyers / stormtroopers / Mandalorian / Beskar / Jedi / Rebels / Imperial — that IP is OUT of scope for BrickBot); (2) NEVER hard-SF realism (no Mass Effect / Normandy / Expanse / Rocinante / Star Citizen / cyberpunk / solarpunk — they photoreal-drift); (3) no register-mixing within a single entry.`,
  },

  // ─── scene_props — diorama fill (pickN:2) ───
  brickbot_space_scene_props: {
    format: 'simple',
    theme: `SPACE DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a space scene and add narrative depth. Each entry is ONE specific prop with a story implied. Each entry 12-30 words.

⚠️ Picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another.

VARIETY MANDATE — distribute across:
  • EQUIPMENT (astronaut helmet on rack / EVA tool-belt / datapad / repair-drone / scanner / portable-airlock)
  • CARGO / SUPPLIES (ration packs / oxygen tank / fuel-cell / water-container / med-kit / crate-with-warning-label)
  • ALIEN ARTIFACTS (crystalline object in trans-piece / glowing orb / monolith fragment / alien-script tile)
  • DEBRIS / WRECKAGE (drifting hull-fragment / shattered solar-panel / spent fuel-rod / damaged escape-pod / floating glove)
  • PERSONAL / EMOTIONAL (photo-tile / wedding-ring on plate / mission-patch tile / dog-tag / pet-cat-in-canister)
  • TROPHIES / FLAGS (planted flag-element / mission-banner / first-foot plaque / mounted artifact)
  • LIVING COMPANIONS (alien-pet-creature / ship's-cat in zero-G / micro-robot / lab-rat-in-cage)
  • COMMUNICATION (comm-console / radio-receiver / hologram-emitter with trans-pieces / message-tile)
  • NAVIGATION (sextant / compass-tile / star-chart on table / orbital-map display)
  • WEAPONS-LITTER (dropped blaster / spent ammo-clip / charge-pack / disabled-drone fragment)
  • SCALE-PROVER MICRO-FIGS (lone explorer at edge of frame / scientist with notebook / engineer with cable-reel)
  • STATION / SHIP DETAIL (port-window with view / hand-rail / hatch / vent-grating / fire-extinguisher in red)

Each entry must:
• Name the prop in first 3-6 words
• Specify the SPECIFIC LEGO BRICK PARTS where applicable
• Imply a STORYTELLING CONTEXT`,
    touchpoints: [
      "Astronaut helmet on a brass-hook — minifig spacesuit-helmet accessory hanging on a clip-and-bar bracket-mounted to a bulkhead, the crew-member's-quarters detail, recently removed after shift",
      "Datapad on the console — printed 2×2 datapad-tile lying on a flat brick-built console surface, a minifig stylus accessory beside, mid-shift recordings paused",
      "Open ration-pack on a tray — 1×2 trans-clear tray with 1×1 round tile food-pieces scattered, a half-empty rations-pack-tile, the crew-mess-hall detail",
      "Spent fuel-cell on the deck — dark-bley cylinder-element with trans-orange spark-emission residue at the top, lying on its side on the deck-plating, post-emergency-jettison evidence",
      "Pet cat in zero-G canister — a brick-built micro-pet-cat suspended in mid-air inside a trans-clear cylinder-canister with a clip-on lid, the ship's mascot detail",
      "First-foot mission patch tile — printed mission-patch-tile mounted on a 1×2 plate as a bulkhead-wall trophy, the crew's-pride-of-mission marker",
      'Planted flag-element on lunar surface — minifig flag-accessory in a 1×1 round-plate base on a light-bley slope brick lunar-surface, the iconic Apollo-era first-foot moment',
      "Trans-purple alien crystal on a stand — 1×1 trans-purple round-stud jewel-piece on a gold round-plate cradle, glowing-faint-emission implied, the recently-discovered artifact",
      "Drifting EVA glove — single minifig spacesuit-glove accessory drifting in mid-air slightly off-vertical, evidence of a recent EVA accident or theft",
      "Hologram-emitter with trans-blue projection — brick-built emitter-pedestal with a trans-blue 1×2 plate angled upward representing a projected-message, a captain mid-recording-playback prop",
      "Repair-drone on standby — brick-built micro-drone (1×1 round body + 2 antenna-piece arms + light-up trans-element eye) hovering or perched on a service-rack, the ship's-maintenance helper",
      "Med-kit case open on the floor — 2×3 case-element open with 1×1 trans-red round-plate medical-marker visible inside, scattered medical-supplies, a recent-injury evidence detail",
      "Dog-tags on a chain — minifig chain-piece with 1×1 round-tile dog-tags hanging off a bunk-bedrail, the absent-crew-member memorial detail",
      "Spent blaster bolt-element on the deck — single trans-red 1×1 bar element lying on the deck where the bolt-strike landed, smoking-faint-emission detail, the post-combat aftermath",
      "Disabled drone fragment — broken brick-built drone-segment lying on the deck with sparking trans-yellow elements at the breakage-point, the recent-defense-engagement evidence",
      "Ration-pack stash in a wall-niche — 1×2 niche built into a bulkhead with stacked ration-pack-tiles, hidden-emergency-supplies the crew's-private-cache detail",
      "Hand-painted mission patch on a flightsuit — printed minifig-torso with custom mission-patch detail visible, the personalized-veteran-pilot detail visible up-close",
      "Trans-yellow warning-light strip overhead — 1×4 trans-yellow round-tile strip mounted on a ceiling-beam glowing alert-pattern, the system-emergency ambient detail",
      "Personal photo-tile on a bunk — printed family-photo-tile mounted on a 1×2 plate above a crew-bunk, the homesick-crew-member detail",
      "Cup-of-coffee-in-zero-G — 1×1 trans-clear cylinder with trans-brown 1×1 round-plate liquid floating in a globule above the cup-rim, zero-G physics joke detail",
    ],
    instructions: `Each entry is ONE space diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials without naming brick parts; NO centerpiece-sized props; small storytelling-detail props only.`,
  },

  // ─── lighting — axis-clean ───
  brickbot_space_lighting: {
    format: 'simple',
    theme: `LEGO MOC SPACE LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the space path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE. Lighting pool owns ONE conceptual lane: light source + direction + color quality.

⚠️ HARD BANS:
  • NO cosmic phenomena: nebula clouds / supernova flash / aurora-belt / black-hole-event (those belong to cosmic_phenomenon axis)
  • NO scene elements: hangar / bridge / hull / cockpit / cargo-bay (those belong to scene_type / camera_framing axes)
  • NO minifig action language ("light catching astronaut's face")
  • NO color-cast OVERRIDE language

✓ VARIETY MANDATE — distribute across (with COOL/VIOLET weighting to counter Flux's warm bias):
  • DEEP SPACE COOL (binary-star backlight blue-and-amber / distant-sun raking cool-white / starlight-only blueblack)
  • PRACTICAL SHIP LIGHTS (cockpit instrument trans-amber underlit / corridor cool-fluorescent overhead / bridge trans-cyan console-glow)
  • PLANETSIDE NATURAL (alien-sun cool-violet overhead / red-dwarf rust-orange raking / ice-planet diffuse cool-blue)
  • ENGINE / THRUSTER FLARE (trans-orange thruster glow up-back / trans-blue ion-engine pulse / trans-yellow burn-flash)
  • EMERGENCY / ALERT (klaxon trans-red strobe / amber-alert pulsing / dim-emergency-only cool-blue)
  • EVA / SUIT-LIGHT (helmet-mounted spotlight tight cone / suit-shoulder-light wide cool-white)
  • CHIAROSCURO DEEP-SHADOW (single-source dramatic chiaroscuro in interior / cool-source-against-deep-shadow)
  • CONSOLE / SCREEN LIGHT (trans-blue console-uplight on operator-face / trans-green radar-screen tint)
  • PLANET-REFLECTED (cool-blue Earth-glow lighting one side / warm Mars-rust reflected onto craft hull)
  • DRYDOCK / FLOOD-LIGHTS (harsh cool-white refit-pad floods / warm-yellow gantry-light pools)`,
    touchpoints: [
      "BINARY-STAR BACKLIGHT COOL-AMBER — two distant suns from opposite sides of the deep distance casting overlapping cool-blue + warm-amber shadows, the warm-cool split lighting creating dramatic dual-tone illumination, sharp-edged shadows",
      "DEEP-SPACE STARLIGHT-ONLY BLUEBLACK — no proximate light source, only faint blue-black starfield ambient, very dim cool-blue color quality, surfaces barely defined, the lonely-vacuum register",
      "COCKPIT TRANS-AMBER UNDERLIT — interior light from cockpit instrument panels glowing warm-amber upward onto the pilot's helmeted-face, dramatic underlit chiaroscuro, deep-shadow on the upper half of the canopy",
      "ENGINE THRUSTER GLOW UP-BACK — bright trans-orange + trans-yellow thruster-flare from behind the subject ship, warm hot color quality on the ship's stern, cool-deep-shadow on the bow, dramatic backlit silhouette",
      "ALIEN-SUN COOL-VIOLET OVERHEAD — distant cool-violet sun directly overhead casting cool-violet color quality on all upward surfaces, sharp short shadows, the iconic-alien-world signature lighting",
      "KLAXON TRANS-RED STROBE — red emergency-alert light from overhead trans-red elements pulsing across the scene, harsh saturated-red color cast on all lit surfaces, deep-black shadows, the system-emergency register",
      "EVA HELMET SPOTLIGHT CONE — tight cool-white spotlight cone from a helmet-mounted lamp directed forward, hard-edged light-shaft, surrounding darkness on the unlit portions, deep-vacuum register",
      "RED-DWARF SUN RAKING RUST — small red-dwarf sun low-angle from one side casting rust-orange + saturated-amber color quality on the lit side, long deep-purple shadows opposite, the alien-cool-star register",
      "ICE-PLANET DIFFUSE COOL-BLUE — overhead overcast bright-but-diffuse cool-blue color quality on all surfaces, soft shadows, the ice-planet bouncing-light register, slightly desaturated",
      "MARS-RUST REFLECTED HULL — close to Mars-surface with the planet's rust-orange-and-tan glow reflected upward onto a hovering craft's underside, warm-rust color quality on the underside, cool-deep-shadow on the upper",
      "EARTH-GLOW BLUE FROM-BELOW — close to Earth-orbit with the planet's cool-blue glow filling the underside of a craft from below, soft-blue color quality on undersides, the iconic-orbit register",
      "CHIAROSCURO INTERIOR SINGLE-SOURCE — interior scene with a single window or porthole as the only light source, warm color quality on the lit edge of the subject, deep-black void on the other 80% of frame",
      "DRYDOCK FLOOD-LIGHTS COOL-WHITE — harsh cool-white industrial flood-lighting from multiple gantry-mounted lamps, hard-edged shadows from each light direction, the refit-pad register",
      "MISSION-CONTROL FLUORESCENT FLAT — overhead fluorescent-strip lighting casting cool-fluorescent-blue flat illumination across the room, no directional shadows, the 1960s-NASA mission-control register",
      "BLUE-CONSOLE UPLIT OPERATOR — trans-blue console-glow lighting the operator's face from below, cool-cyan color quality, the bridge-screen-uplight register, dramatic underlit chiaroscuro",
      "AMBER-ALERT PULSE LOW — soft pulsing amber-alert lighting from waist-height alert-strips, warm color quality on the lower-half of objects, cool darker shadow on the upper-half, the secondary-alert register",
      "WARP-DRIVE TRANS-BLUE PULSE — trans-blue saturated pulse light from a warp-drive event near the subject ship, cool electric-blue color cast across the entire scene, the FTL-jump register",
      "LANDING-PAD FLOOD-LIGHTS WARM — yellow-amber landing-pad flood-lights from multiple bases at the pad corners, warm color quality on the descending craft underside, the pad-arrival register",
      "TWILIGHT-PLANET BLUE-PURPLE COOL — alien-planet twilight transitioning from cool-blue to cool-purple gradient, no direct light source, very low ambient, the world-ending-day register",
      "EVA-SUIT SHOULDER LIGHT WIDE — cool-white wide-beam light from a suit-shoulder-mounted lamp, less harsh than helmet-spotlight, wider falloff, the working-EVA register",
    ],
    instructions: `Each entry is ONE space-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO cosmic phenomena (nebula / supernova / aurora — those belong to cosmic_phenomenon); NO scene elements (hangar / bridge / hull / cockpit). SOURCE + DIRECTION + COLOR only.`,
  },

  // ─── palette — axis-clean color combos ───
  brickbot_space_palette: {
    format: 'simple',
    theme: `LEGO MOC SPACE PALETTE — axis-clean color-combination entries for the space path. Each entry is ONE specific multi-color palette for a space diorama. Each entry 12-25 words.

✓ VARIETY MANDATE — distribute across space-coded palettes:
  • CLASSIC LEGO SPACE (yellow + medium-grey + trans-blue + white)
  • SPACE POLICE (white + sky-blue + chrome + trans-blue)
  • BLACKTRON I+II (black + neon-yellow + trans-yellow)
  • M-TRON (black + red + lime-green + brushed-steel)
  • ICE PLANET 2002 (white + neon-orange + trans-clear-blue + black)
  • UNITRON (blue + white + chrome + trans-clear)
  • MARS MISSION (white + orange + grey + trans-orange + tan)
  • INSECTOIDS (purple + lime-green + trans-purple + black)
  • GALAXY SQUAD (orange + cyan + black + trans-orange)
  • HARD-SF GUNMETAL (gunmetal + Alliance-blue + chrome + warning-stripe + matte-black)
  • FOUNDATION IMPERIAL (royal-purple + ornate-gold + cream-marble + dark-violet)
  • APOLLO-ERA NASA (pure-white + American-red + American-blue + chrome + gold-foil)
  • CLASSIC LEGO SPACE DEEP-PATROL (deep-grey + Classic-yellow + trans-blue + chrome-silver)
  • TINTIN RED-AND-WHITE (red + white + checker + chrome + tan)
  • 2001 ASO STERILE (clean-white + chrome + black + trans-clear)
  • FOUNDATION IMPERIAL PURPLE (royal-purple + gold + cream + dark-violet)
  • CLASSIC LEGO SPACE LUNAR (yellow + light-bley + trans-blue + cream-white + grey)
  • TINTIN DESTINATION MOON (red + cream-white + checker-pattern + chrome + tan)
  • APOLLO ERA NASA (pure-white + American-red + American-blue + chrome + gold-foil)
  • NEBULA COSMIC (deep-magenta + cosmic-cyan + violet + indigo + starfield-black)
  • DEEP-SPACE BLACK (matte-black + chrome + occasional-trans-blue + cool-grey)
  • EMERGENCY ALERT (klaxon-red + warning-yellow + matte-black + chrome-steel)
  • BIOLUMINESCENT ALIEN-CAVE (trans-cyan + trans-green + black + dark-purple)

Each entry must:
• Name 3-5 specific colors with anchor-nouns
• Use specific color-modifier vocabulary (chrome / matte / weathered / saturated / cool / brushed)
• End with a brief register tag (Classic-Space / Blacktron / Mars-Mission / Mass-Effect)
• NEVER drift into lighting language (no "thruster-glow orange") — describe colors as MATERIAL colors`,
    touchpoints: [
      "Yellow + medium-grey + trans-blue + white, Classic-LEGO-Space",
      "White + sky-blue + chrome + trans-blue + LED-cyan, Space-Police-I",
      "Black + neon-yellow + trans-yellow + matte-grey, Blacktron-I",
      "Black + red + lime-green + brushed-steel + magnet-coupling-yellow, M-Tron",
      "White + neon-orange + trans-clear-blue + black + ice-crystal-cyan, Ice-Planet-2002",
      "Blue + white + chrome + trans-clear-blue + medium-grey, Unitron",
      "White + Mars-orange + grey + trans-orange + tan, Mars-Mission",
      "Purple + lime-green + trans-purple + black + alien-bone-white, Insectoids",
      "Orange + cyan + black + trans-orange + bug-alien-green, Galaxy-Squad",
      "Orange + cream-white + brown + tan + olive-drab + rebel-red-trim, LEGO-Star-Wars-Rebels",
      "Black + dark-grey + cream-white + chrome + Imperial-red-trim, LEGO-Star-Wars-Imperial",
      "Royal-purple + ornate-gold + cream-marble + dark-violet + Imperial-trim-gold, Foundation-Imperial-palace",
      "Gunmetal + Alliance-blue + chrome + warning-yellow-stripe + matte-black, Mass-Effect",
      "White + neon-orange + trans-clear-cyan + bone-cream + ice-crystal-blue, Ice-Planet-2002-additional",
      "Bright-red + cream-white + checker-pattern + chrome + tan, Tintin-Destination-Moon",
      "Clean-white + chrome + matte-black + trans-clear-blue, 2001-ASO-Discovery",
      "Royal-purple + ornate-gold + cream + dark-violet + Empire-trim-gold, Foundation-Imperial",
      "Neon-magenta + cyber-yellow + matte-black + chrome + acid-green, Cyberpunk-space",
      "Warm-amber + leaf-green + cream + sky-blue + terracotta-clay, Solarpunk-space",
      "Pure-white + American-red + American-blue + chrome-silver + gold-foil, Apollo-NASA",
      "Deep-magenta + cosmic-cyan + violet + indigo + starfield-black, Nebula-cosmic",
      "Matte-black + chrome + cool-grey + occasional-trans-blue, Deep-space-void",
      "Klaxon-red + warning-yellow + matte-black + chrome-steel, Emergency-alert",
      "Trans-cyan-glow + trans-green-fungus + matte-black + dark-purple + cave-stone-grey, Bioluminescent-alien-cave",
      "Worn-chrome + dirty-yellow + grease-black + rust-orange, Working-class-hauler",
      "Sterile-white + chrome + medical-blue + trans-clear, Med-bay-clinical",
      "Tan-canvas + brown-leather + brass-rivets + faded-blue, Mars-colony-rustic",
      "Hot-red + amber + heat-blackened-steel + smoke-grey, Reactor-overheating",
      "Lavender + pink + powder-blue + cream + chrome, Pastel-utopian-station",
      "Polished-marble + gold-trim + cream-white + obsidian-black, Foundation-imperial-palace",
    ],
    instructions: `Each entry is ONE space palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language ("thruster-glow"); NO scene elements; NO weather/phenomenon words. Material colors with anchors + register-tag.`,
  },

  // ─── cosmic_phenomenon — environmental drama (50%-gated) ───
  brickbot_space_cosmic_phenomenon: {
    format: 'simple',
    theme: `SPACE COSMIC PHENOMENON — atmospheric/cosmic event that AMPLIFIES the scene. Each entry is ONE specific cosmic event that can fire on a space diorama (50%-gated conditional). Each entry 20-40 words.

⚠️ DECOUPLED FROM scene_type AND lighting — bending axis. Lets us roll "asteroid mining + supernova flash" or "EVA + black-hole event-horizon-pull" — combinations unreachable in legacy.

VARIETY MANDATE — distribute across:
  • NEBULA EVENTS (towering nebula cloud / nebula-bloom expansion / nebula-eddy-current)
  • SUPERNOVA / STELLAR DEATH (supernova flash on horizon / dying-star coronal-event / pulsar-pulse-strobe)
  • BLACK HOLE / GRAVITY (event-horizon pull / gravity-wave distortion / accretion-disc visible / time-dilation lensing)
  • METEOR / DEBRIS (meteor shower streaks / asteroid-belt density-spike / hull-impact debris-cloud)
  • AURORA / ATMOSPHERIC (planetary aurora-belt / ionosphere-glow / magnetic-storm visualizer)
  • PLANET SHADOW (eclipse / planet-shadow falling across the scene / dual-eclipse on alien sun)
  • SOLAR EVENT (coronal mass ejection / solar-flare-glow / sunspot grouping)
  • ICE / CRYSTAL FIELDS (ice-crystal cloud / crystal-debris field / shattering-ice-shelf in low-G)
  • BIOLUMINESCENT (alien-bioluminescent surface bloom / phosphorescent-fog drift)
  • COSMIC DUST (interstellar dust cloud / scattered-dust haze / particle-stream nebula)
  • PLANETARY RING (Saturnine ring slice / ring-shadow crossing scene / ring-fragment cloud)
  • RIFT / PORTAL (visible space-time rift / dimensional-tear in vacuum / wormhole-entry distortion)
  • ALIEN FLEET APPROACH (silhouettes of incoming alien fleet on horizon / massive shape approaching from below)

Each entry must:
• Name the event in first 4-8 words
• Specify WHICH BRICK PARTS render it
• Specify the VISUAL IMPACT (focal point shift, color cast, motion)
• NEVER override lighting axis directly`,
    touchpoints: [
      "NEBULA TOWERING CLOUD — vast trans-magenta + trans-cyan + trans-purple layered plate-stack nebula cloud filling the entire upper-half of the frame as the deep-distance background, scattered 1×1 white round-plates as nebular haze, the cosmic-scale signature event",
      "SUPERNOVA FLASH ON HORIZON — blinding-white 4×4 round-tile flash with trans-yellow + trans-orange shockwave ring expanding outward across the deep-distance background, the moment-of-stellar-death captured mid-expansion",
      "BLACK HOLE EVENT-HORIZON PULL — circular trans-black + dark-bley disc at scene-center with trans-blue accretion-ring of plates wrapping outward, distorted starfield around the edges using lens-bending implied by tile-stretch, the gravitational-pull signature",
      "METEOR SHOWER STREAKS — multiple trans-orange + trans-yellow bar-elements + trans-red elements streaking diagonally across the brick-built sky-baseplate, each streak with a 1×1 round-plate impact-head, the cosmic-rain signature event",
      "PLANETARY AURORA-BELT — horizontal trans-green + trans-cyan + trans-magenta plate strips arranged in undulating curtains across the upper-frame above the planet horizon, the iconic-magnetic-pole signature",
      "PLANET-SHADOW ECLIPSE — large dark-bley 4×4 round-tile planet silhouette eclipsing a bright trans-yellow sun-disc in the deep-distance, with a thin trans-orange + trans-red diffraction-ring around the eclipse-edge, the iconic-orbital signature",
      "ASTEROID-BELT DENSITY-SPIKE — dense field of dark-bley round-bricks + crater-tile fragments + trans-grey 1×1 round-plates scattered across the foreground and mid-frame as a thick asteroid-belt, the navigation-hazard signature",
      "PULSAR-PULSE STROBE — cylindrical trans-yellow + trans-cyan beam-element emerging from a small distant pulsar-star at the rim of the frame, pulse-frequency visualized by repeating beam-segments, the navigation-beacon-of-doom signature",
      "RING-FRAGMENT CROSS — horizontal ring-of-fragments (1×2 + 1×4 dark-bley tile-fragments) crossing the frame at a steep angle, the planet-source visible in the deep-distance, the orbital-debris signature",
      "DIMENSIONAL RIFT TEAR — vertical trans-cyan + trans-magenta jagged-edge cone in the deep-distance representing a space-time rift with starfield bending toward the rift-mouth, the wormhole-tear signature",
      "ALIEN FLEET SILHOUETTE APPROACH — massive dark-bley silhouettes of multiple alien-ships looming on the deep-distance horizon, each silhouette built from black + dark-bley bricks against the bright cosmic background, the impending-doom signature",
      "ICE-CRYSTAL FIELD — field of trans-clear + trans-cyan 1×1 round + 1×2 tile pieces suspended at varying heights drifting through the vacuum around a ship, refracting the surrounding light, the cold-debris signature",
      "BIOLUMINESCENT ALIEN-SURFACE BLOOM — alien-planet surface glowing with scattered trans-cyan + trans-green 1×1 round-plates representing bioluminescent growth, the entire surface-bloom signature, the alien-world-life signature",
      "INTERSTELLAR DUST CLOUD — sparse field of 1×1 round-plates and 1×2 tile-fragments scattered across the entire scene as cosmic dust haze, trans-amber and trans-clear elements suggesting particles, navigation-hazard signature",
      "WARP-DRIVE ENTRY DISTORTION — trans-blue + trans-cyan light-cone exit from a hyperspace-jump in the mid-distance, stretched-light implied by elongated tile-strips, the FTL-arrival signature",
      "DUAL-SUN ECLIPSE — both suns of a binary-star system aligned with one eclipsing the other, the trans-yellow + trans-orange corona-ring visible around the eclipse-edge, dramatic dual-shadows on the foreground subjects, the binary-system signature",
      "SUNSPOT GROUPING — visible cluster of trans-black sunspots on the surface of a distant sun-disc in the deep-distance, the sun rendered as a 4×4 trans-yellow round-tile with dark-bley spot-clusters, the solar-activity signature",
      "ACCRETION DISC GLOW — wide trans-orange + trans-red glowing disc visible around a central black-hole or neutron-star, the disc rendered as flat plate-stack with bright trans-pieces toward the center, the cosmic-power-source signature",
      "METEOR IMPACT ON HULL — single large trans-orange flame-element + 1×1 white round-plate debris-cloud at the impact-site on a ship's hull, the moment-of-collision captured, the unexpected-strike signature",
      "PHOSPHORESCENT FOG DRIFT — drifting cloud of trans-green + trans-cyan 1×1 round-plates suspended at varying heights across the mid-frame, glowing-supernatural haze, the alien-atmosphere-anomaly signature",
    ],
    instructions: `Each entry is ONE space cosmic phenomenon, 20-40 words. Format: "EVENT NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify lighting color cast directly; NEVER lock crew/scene reaction language; environmental EVENT only.`,
  },

  // ════════════════════════════════════════════════════════
  // PIRATES PATH (2026-05-22 — first BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  // ─── scene_type — narrative stage (the WHAT) ───
  brickbot_pirates_scene_type: {
    format: 'simple',
    theme: `LEGO MOC PIRATE DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot pirates axis system. Each entry is ONE narrative stage (the WHAT — what category of pirate moment is this diorama?). Each entry 30-55 words.

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (those belong to a separate axis). NO build technique vocab. NO weather. Just: where are we, what kind of moment.

VARIETY MANDATE — distribute the entries across these narrative categories (target ~5-10% per category):
  • SHIP-ON-SHIP COMBAT — broadside cannonade / boarding-action / chase / fireship attack
  • TREASURE DISCOVERY — cave reveal / shipwreck salvage / x-marks-spot dig / hidden vault / cursed-chest opening
  • HARBOR / PORT LIFE — dockside loading / tavern stand-off / smuggler's cove / market chaos / black-market deal
  • CREW LIFE ABOARD — galley meal / belowdecks gambling / sail-mending / navigator working charts / capstan-hauling
  • CURSED / SUPERNATURAL — Davy Jones' Locker / ghost-ship encounter / cursed-crew transformation / Kraken summoning
  • SEA-MONSTER ATTACK — Kraken-arms wrapping hull / megalodon-leap / sea-serpent rising / phantom-fleet breach
  • NAVY / IMPERIAL CONFRONTATION — Royal Navy chase / flagship-vs-pirate stand-off / governor's-fleet blockade / court-martial deck
  • ISLAND HIDEOUT / EXPLORATION — jungle base reveal / lagoon-grotto entry / treasure-island landing / native encounter
  • MUTINY / CREW POLITICS — captain-overthrow mid-deck / pistol-duel-at-dawn / blackballed-into-rowboat-set-adrift / new-captain coronation
  • SHIPWRECK / SURVIVAL — beached-on-reef rescue / castaway raft / iceberg-impact / storm-survival lash-down
  • PARLEY / DIPLOMACY — pirate-council neutral-ground / flag-of-truce exchange / hostage-negotiation aboard / wedding-of-rival-captains
  • CHASE — predator-chase storm-pursuit / running-from-frigate-through-shoals / outsmart-via-reef / lure-into-trap

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (deck / cave / dock / island / open sea / belowdecks / harbor / shipwreck / locker)
• Suggest the TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action (no "captain swinging cutlass"; that's the minifig_action axis)
• NEVER name a specific weather event (no "storm-tossed waves"; that's the weather_drama axis)`,
    touchpoints: [
      'SHIP-ON-SHIP BROADSIDE COMBAT — two galleons locked in close-range cannonade, hulls less than a brick-length apart, gunports both decks alight with trans-orange flame elements, splintered hull-fragments mid-flight between vessels, the moment before the boarding lines launch',
      'TREASURE CAVE DISCOVERY — vast brick-built grotto interior with shafts of light from collapsed ceiling, mounded gold doubloons + jeweled chests + ceremonial weapons stacked waist-high, ancient skeletons in rotted finery propped against treasure-piles, a rope ladder descending from the ceiling-gap',
      'HARBOR DOCKSIDE TAVERN STAND-OFF — narrow brick-built dock between warehouse and a moored sloop, hanging tavern-sign creaking, lantern-lit windows, crates and barrels stacked tight, a pirate crew and a Royal Navy patrol facing off in the wedge between buildings',
      "DAVY JONES' LOCKER — ethereal underwater shipwreck graveyard, half-rotted galleon hulls leaning at impossible angles on the seafloor, drifting kelp + skeletal fish, trans-clear water-haze layered overhead, anchored hulls coral-encrusted, a faint phosphorescent glow",
      'KRAKEN ATTACK — colossal brick-built tentacles in trans-dark-green emerging from the brick-water around a three-masted galleon, suckers visible, tentacles wrapping the mainmast and the bowsprit, crew scattering across the deck, masthead-lanterns swinging wildly',
      "ROYAL NAVY FLAGSHIP STAND-OFF — a Royal Navy frigate in formal-white-with-red-trim hull-paint with all gun-ports open, broadside-on across two brick-length of open sea from a black-hulled pirate galleon flying the Jolly Roger, the moment of pre-engagement parley",
      'JUNGLE HIDEOUT REVEAL — pirate base hidden in dense brick-built jungle on a steep island slope, waterfall in trans-blue layered plates cascading past, ramshackle huts and a careened sloop being scraped of barnacles, jungle-canopy rigged with rope-walks',
      "MUTINY ON THE QUARTERDECK — pirate crew arrayed across the quarterdeck in a tense semicircle, captain alone at the rail flanked by two loyal officers, the moment-before-violence freeze with hands moving toward weapons, dawn-fog rolling across the deck",
      'SHIPWRECK SALVAGE — half-buried hull of an old wreck broken-back on a reef-island, sea-eroded ribs exposed, crew lowering barrels and chests from the canted deck to a longboat below, surf foaming around the wreck-base, gulls perched on the stern',
      'PIRATE-COUNCIL PARLEY — three pirate captains standing on a neutral-ground sandbar at low tide, each flanked by their crew, ships-at-anchor visible in the deeper water beyond, brick-built parley-flag pole between them with white pennant',
      'BURIED-TREASURE DIG — six crew members around a half-excavated pit on a beach with the chest just beginning to emerge from sand, palm trees fringing, parrot perched on a shovel-handle, dawn-light raking sideways across the dig-site',
      'SMUGGLER COVE NIGHT-RUN — small sloop pulling into a hidden cove between cliffs at deep-night, lanterns muffled, crates being passed dock-to-deck in chain-of-hands, the moment when a Royal Navy lantern appears at the cove-mouth',
      'CURSED CREW TRANSFORMATION — pirate crew mid-transition between human and skeleton forms in moonlit water beneath their ship, half-skeleton half-human variants visible, the cursed-chest open on the deck above',
      'CASTAWAY RAFT DRIFT — a single pirate on a brick-built raft of lashed-timbers in glassy open ocean, supplies tied down with rope, sail of tattered shirt, the vast empty horizon dominant',
      'BLACK-MARKET DEAL — narrow dockside alley between warehouse and harbor wall, two crews exchanging chests for crates, a lookout at each end of the alley, lantern-lit and tense, ledger-keeper at a barrel-side desk',
      'SEA-BATTLE BOARDING ACTION — two ships locked together with boarding planks deployed across the gap, crews mid-charge across the planks, smoke from both decks, the moment of impact between the wave of pirates and the defenders on the navy-ship deck',
      'GOVERNOR\'S FLEET BLOCKADE — three Royal Navy ships strung across a harbor mouth in blockade-line, a pirate vessel trapped inside the bay, the moment of decision before the run, harbor town visible behind on a hillside',
      'PIRATE WEDDING ABOARD SHIP — quarterdeck arrayed for a wedding between two pirate captains with their crews gathered, a brick-built arch of crossed-cutlasses and palm-leaves, the moment of vows, ship-flagged in celebratory pennants',
      'CHASE THROUGH SHOALS — pirate sloop running between barely-submerged reef-tops in a tight maze of brick-built shoal-water, a Royal Navy frigate in pursuit beyond the reef-line unable to follow due to draft, the cunning escape mid-frame',
      'CAPTAIN\'S CABIN PLOTTING — interior cutaway of a galleon\'s captain\'s cabin with brick-built oak-paneled walls, charts spread across the table, the captain and first mate poring over a treasure-map, lantern-glow, stern-window showing open ocean',
    ],
    instructions: `Each entry is ONE pirate narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language ("WIDE / MEDIUM / CLOSE / wide-shot / aerial"), never include minifig action verbs ("captain swinging cutlass / crew hauling"), never include weather events ("storm-tossed / lightning-flash / dense fog"), never include lighting descriptors ("golden hour / candlelit / moonlit"). Those belong to other axes. Stage + tension only.`,
  },

  // ─── minifig_action — verb-led story beats ───
  brickbot_pirates_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot pirates path. Each entry is a freeze-frame of minifigs IN MID-ACTION (the story beat), NOT minifigs posing in a setting. Each entry 25-45 words.

⚠️ HARD MANDATE — STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Verbs like: leaping, slashing, hauling, lunging, parrying, brandishing, heaving, mid-toss, hurling, swinging, climbing, dragging, lifting, smashing, firing, dodging, falling, catching, rescuing, pinning, escaping, signaling.

⚠️ HARD BANS:
  • NEVER "minifigs standing around"
  • NEVER "captain posing on deck"
  • NEVER "crew watching" / "looking at" / "gazing at" / "wide-eyed at"
  • NEVER "characters arranged in semicircle"
  • NEVER passive states (sitting, resting, waiting, observing)

✓ Body-position variety — distribute across:
  • Mid-leap / mid-fall / airborne (~15%)
  • Mid-swing / mid-strike / mid-parry (sword/axe/club) (~20%)
  • Hauling / lifting / pulling (capstan, rope, rigging, dragging body, raising flag) (~15%)
  • Mid-fire / mid-reload (musket, pistol, cannon, bomb-fuse) (~10%)
  • Climbing / vaulting / running (rigging, rope-ladder, ship-side, rooftop) (~15%)
  • Diving / rescuing / catching (overboard, mid-air, falling-object) (~10%)
  • Multi-figure interaction (duel, brawl, formation-charge, rescue, hand-off) (~15%)

Each entry must:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs involved (captain, first mate, gunner, lookout, navy officer, cabin boy, etc.) with brief identifier (eye-patch / red-coat / yellow-hat / etc.)
• Describe the SHARED OBJECT or EVENT they're interacting with (cutlass, treasure chest, falling rigging, exploding barrel, kraken tentacle, etc.)
• Imply the moment-before and moment-after (this is a freeze-frame, not a pose)
• PLASTIC SCALE — these are minifigs, so describe their action AS minifig poses (C-shaped hand gripping cutlass, two-stud arms bent at parry-angle, etc.) — never anatomical detail`,
    touchpoints: [
      'Captain mid-leap from rigging to enemy deck, cutlass extended forward in C-grip, hat caught mid-air behind, defender minifig already raising shield in reaction, rope-end whipping back behind the captain',
      'Two crew members hauling on the capstan-bars mid-stride, third crew at the chain feeding it through the hawse-hole, fourth at the rail watching the heavy iron anchor breaking the brick-water surface',
      'First mate parrying a Royal Navy cutlass-strike with their own cutlass, both blades crossed at the brick-built guard, the sailor behind them already swinging a marlin-spike at the second navy attacker',
      'Gunner ramming the cannon-charge home with the rammer, second crew hauling on the gun-tackle to position, third crew with the lit match-cord ready at the touch-hole, all three mid-motion in coordinated reload',
      'Cabin boy mid-toss of a powder-keg with lit fuse trans-orange spark element rising, target enemy crew at the rail in mid-recoil-recognition, falling-arc trajectory implied by their crouch and the boy\'s follow-through',
      'Cursed-skeleton crew member mid-rise from the deck planks, ribcage-torso emerging through fog elements, the human crew member nearby already mid-stumble-backwards with cutlass dropping from their grip',
      'Captain hurling a grappling-hook trans-clear-fishing-line trailing from a C-grip arm, target enemy rail visible across the brick-water gap, second crew member behind already mid-pull on the line ready to haul',
      'Two minifigs in a sword duel mid-parry at the top of the quarterdeck stairs, the loser already mid-backstep with cutlass guard buckling, the winner pressing forward, third character below the stairs frozen mid-watch with hand-on-pistol',
      'Lookout minifig falling from the crow\'s-nest mid-air, mouth-printed in alarm-shout, rope-end whipping past as they pass the mainsail, deck crew below mid-rush toward the impact-point',
      'Crew member at the wheel mid-spin of the helm, body braced against the wheel, captain beside them mid-shout-into-storm with pointing-hand gesturing toward a course-line, navigator behind mid-stride toward the helm with chart in hand',
      'Pirate at the bow mid-leap onto a longboat below, cutlass mid-stab toward a defender mid-fall from the longboat into the brick-water, second longboat-defender mid-draw of a pistol turning toward the leaper',
      'Captain mid-rescue of a falling crew member, leaning over the rail with one C-grip on the rail and the other clenched on the falling sailor\'s wrist, the saved sailor mid-swing of free arm reaching upward, the brick-water below visible',
      'Two minifigs hoisting the Jolly Roger up the main mast, one at the deck pulling the halyard hand-over-hand, the other at the top of the mast guiding the flag into position, the flag mid-unfurl catching the wind',
      'Royal Navy officer mid-fire of a flintlock pistol toward a pirate mid-dodge at the rail, the pistol-flash trans-yellow flame element, the pirate mid-tumble over the side already in motion to roll behind the rail-cover',
      'Crew member mid-vault of the ship\'s rail onto a boarding plank, second crew mid-charge behind them with cutlass overhead, third crew at the rear of the line mid-loose-of-an-arrow toward the defenders',
      'Cook mid-throw of a heavy cooking-pot from the galley-door at a pirate-on-pirate-mutineer at the foot of the stairs, the mutineer mid-duck with arm raised in defense, broth-elements (trans-brown 1×1 round bricks) arcing through the air',
      'Mid-haul on the topsail-halyard by a row of four crew at the mast-base, the sail mid-rise up the mast, sail-trim crew at the yard mid-pull on the sheet-line to set the sail-angle',
      'Captain mid-stab of a cutlass through a chart pinned to the table, mid-shout at the gathered officers around him with finger-pointing at a marked location, navigator mid-recoil with hands up',
      'Two crew members mid-drag of a chest across the sand from the surf-line toward the longboat, third crew at the longboat mid-arms-out to receive the chest, fourth crew at the surf-line mid-scan toward the tree-line for threats',
      "Pirate mid-swing on a rope from the foretop down across the deck, cutlass trailing behind, target navy-officer at the helm mid-turn with sword half-drawn, the rope's anchor-point visible at the foretop with a crew member who released it",
    ],
    instructions: `Each entry is ONE pirate minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB (Mid-leap / Hauling / Parrying / Hurling / Mid-toss / Climbing / Diving / etc.). Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "minifigs standing", NO "captain posing", NO "watching" / "looking at" / "gazing", NO passive states. Story beat + verb + cause/effect always.`,
  },

  // ─── build_technique — MOC distinguisher ───
  brickbot_pirates_build_technique: {
    format: 'simple',
    theme: `LEGO MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot pirates path. Each entry is ONE specific MOC technique that makes a pirate diorama read as "Bricklink AFOL convention build" instead of "official LEGO set photo." Each entry 25-45 words.

⚠️ THE BAR — these are the techniques AFOL builders use that win Brickworld + Brickfair Best-of-Show. The viewer who is a LEGO fan should INSTANTLY clock the cleverness.

VARIETY MANDATE — distribute across these technique categories:
  • SNOT (Studs Not On Top) construction — sideways-stud techniques for curves, hull-planking, organic shapes
  • Trans-piece use — trans-blue layered waves, trans-orange flame elements, trans-clear ice, trans-green poison, trans-yellow lantern-glow
  • Slope-brick + plate-curving — for rocky cliffs, hull-curves, sail-billowing, waves
  • Technic articulation — for cannon mounts, ship's wheel, hidden hinges, crane mechanisms, drawbridges
  • Illegal techniques — clutch-power-on-tile, brick-bending, unofficial connections AFOLs use anyway
  • Microscale tricks — minifig-accessory repurposed as macro detail (lightsaber-hilt as railing-post, croissant as decorative-scroll, banana as palm-leaf)
  • Printed-tile signature pieces — using specific rare printed tiles (treasure-map / compass-rose / skull-and-crossbones) as build-anchors
  • Studded-vs-tile texture contrast — deliberate studded areas for wood-plank texture, tiled areas for stone or polished surfaces
  • Brick-built rigging — antenna pieces as ratlines, string-and-bar as shrouds, flex-tube as cordage
  • Hidden cutaways — interior detail revealed by partial-wall builds (cross-section galleys, half-decks)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH PIRATE BUILD ELEMENT it applies to (hull / mast / waves / cliff / treasure-pile / cannon / etc.)
• Specify the SPECIFIC BRICK PARTS used (e.g. "1×2 cheese slope" / "2×2 round dish" / "Technic axle pin" / "trans-orange 1×1 flame")
• Imply the visual IMPACT (curvature / texture / glow / motion / scale)`,
    touchpoints: [
      'SNOT-built galleon hull curvature using sideways-stud bracket sections turning the hull-planks parallel to the keel — 1×2 plate-with-side-stud bricks create the inward hull-curve from aft to bow, with overlapping curved-slopes for the wave-cut bow',
      'Trans-blue ocean built in layered plate-and-tile stacking — 2×4 trans-light-blue plates on the lowest layer, 1×2 trans-dark-blue tiles offset above for wave-crest depth, sprinkled 1×1 white round-plates as foam crests',
      'Trans-orange + trans-red + trans-yellow flame elements as cannon-fire muzzle-flash, clustered at the gun-port mouth with motion-blur implied by staggered stud-heights, the flame-stack mounted on a hidden 1×1 round-plate connection',
      'Technic-axle articulation in the cannon mount allowing the gun-barrel to tilt up/down on a hidden pivot, with 1×1 plate trunnions disguised as wood-block gun-carriage detail, the carriage rolling on 1×1 round-plates as wheels',
      'Crow\'s-nest built using a stack of inverted round-bricks with macaroni-arc tiling for the rim, lookout minifig connected via a single stud at the center, the platform mounted on the mast via a Technic-pin clutch-connection',
      'Brick-built sail-billow using overlapping 2×4 white tile-on-plate panels at progressive angles, secured at the yard-arm via clip-and-bar connection, the billow-curve achieved by intentional half-stud-offset stagger',
      'Sloped-brick rocky cliff face using a mixed light-bley + dark-bley + tan slope-brick palette in random sequence, with cracks built as gap-techniques between brick edges, tufts of tan-1×1 round-plates as scrubby foliage',
      'Treasure-pile constructed from gold-plated minifig-coins, ingots (1×1 round tiles in gold), and gold-stud-on-plate as scattered loose doubloons, mixed with trans-clear jewel elements (1×1 round trans-purple / trans-red / trans-green) as gems',
      'Microscale rigging using minifig fishing-rod antenna pieces as ratlines, black string-with-end-studs as shrouds running yard-to-deck, flex-tube black rubber pieces as the standing rigging fore-and-aft',
      'Printed treasure-map tile (the iconic LEGO Pirates printed-tile from set 6285) used as the build-anchor on the captain\'s table, surrounded by 1×1 round-tile compass-rose detail and a minifig dagger as a chart-pinning prop',
      'Studs-up wood-plank deck contrasting with tiled smooth quarterdeck — main-deck shows visible studs as wood-plank texture, quarterdeck tiled smooth-grey as polished officer\'s walking-surface, the texture contrast separates the social zones',
      'SNOT-built ship\'s figurehead using 1×1 headlight bricks and curved slopes attached sideways to the bow, the figurehead represented in profile with hair flowing rearward built from layered curved-slope plates',
      'Trans-clear baseplate-mounted ice slab as the diorama-floor for an iceberg scene, with 2×2 trans-clear plates lifting the wreck-fragments above the brick-water surface to create the half-submerged effect',
      'Macro-scale cannonball built from a stack of brown 1×1 round-plates connecting to a 2×2 round-dome — the cannonball mid-air represents the moment after the cannon-fire, positioned via clear-stud connector',
      'Tavern-sign built as a hanging assembly using two 1×1 round-plate hinges as the swinging-mount, a printed 2×3 sign-tile as the face, the assembly suspended from a Technic-pin in the building-eave',
      'Kraken tentacle built using a chain of curved-slope and ball-joint sections in trans-dark-green, with suction-cup elements (1×1 round-plate inverted) along the underside, the tentacle articulated via internal flex-tube spine',
      'Skull-and-crossbones Jolly Roger built as a printed flag tile (Imperial Officer\'s tile from the Pirates line) mounted on a black antenna piece serving as the flagpole, the flag mid-unfurl angled by a hidden 1×1 plate brace',
      'Belowdecks cross-section revealed by partial-wall build technique — the hull is built with one side cut away to show the rib-frames + cargo + crew quarters, the structural-integrity preserved by hidden brick-bracing inside the build',
      'Brick-built parrot on the captain\'s shoulder using 1×1 round-plate in red-yellow-blue color blocks for the body, a 1×1 headlight as the head-and-beak, a tile-with-clip as the tail, mounted to the minifig shoulder via a connection-stud',
      'Custom mast-step built using a 2×2 round-dome inverted as the base for the mast, the mast itself a stack of 1×1 round-bricks in tan with brown crossbeams, the entire mast-assembly removable via a single Technic-pin for transport',
    ],
    instructions: `Each entry is ONE MOC build-technique note for a pirate diorama, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "plywood / glue / paint / 3D-print"); LEGO bricks only. No vague references ("uses some bricks") — name SPECIFIC part types (1×2 slope / trans-blue plate / Technic axle pin / minifig accessory).`,
  },

  // ─── camera_framing — pirate-specific framings ───
  brickbot_pirates_camera_framing: {
    format: 'simple',
    theme: `PIRATE-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the pirates path. Each entry is ONE camera position + framing rule specific to PIRATE diorama subject matter (NOT a generic camera angle list). Each entry 15-30 words.

⚠️ This is bespoke — entries should leverage pirate-specific scenery (rigging, hold-cutaway, deck-perspective, crow's-nest, longboat-low, kraken-POV) rather than generic photography terms.

VARIETY MANDATE — distribute across:
  • Vertigo angles up (worm's-eye up a mast / under a yardarm / from longboat looking up at galleon)
  • Vertigo angles down (crow's-nest down-shot / yardarm down-shot / aerial over the deck)
  • Lateral broadside (cannon-deck mid-firing / ship-vs-ship broadside-on between vessels)
  • Through-rigging shot (camera between yardarm + sail to deck below)
  • Below-the-deck cutaway (cross-section interior — gunroom, gally, captain's cabin)
  • Discovery POV (camera at chest-level approaching treasure / a corpse / a clue)
  • Over-shoulder duel (camera behind one combatant looking past their shoulder at the opponent)
  • Kraken's-POV up (camera in the water looking up at the ship-bottom + tentacles)
  • Shipwreck dutch-tilt (camera tilted to match the wreck's broken-back angle)
  • Cliff-edge / aerial over a cove or harbor
  • Lantern-glow close-shot (intimate light, single fig + glowing element)
  • Approach down-the-dock (camera at dock-end, action receding into ship perspective)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element does this angle DRAMATIZE
• Reference pirate-specific scenery elements`,
    touchpoints: [
      "CROW'S-NEST DOWN-SHOT — camera at the masthead looking straight down at the deck below, the mast itself receding into the foreground, crew on deck small and overhead-perspective, sail-tops and yardarms framing the corners",
      "LONGBOAT-LOW LOOKING UP AT GALLEON — camera at water-level from a longboat alongside a galleon, the hull dominating the frame as a wall of planking, gun-ports overhead, rigging visible at the top edge of frame, the dwarfing scale-shot",
      "CANNON-DECK BROADSIDE — camera inside the gun-deck mid-firing, three cannons in receding perspective down the deck, gun-crews mid-action, smoke + muzzle-flash trans-elements punching through the open gun-ports",
      "KRAKEN'S POV — camera submerged in the brick-water looking UP at the ship-keel with tentacles wrapping around the hull, crew silhouetted on the deck above, the water-surface refracted by trans-blue layered plates",
      "SHIPWRECK DUTCH-TILT — camera tilted 30 degrees to match the broken-backed wreck on a reef-island, the canted angle making the wreck dominate the diagonal, surf foaming around the wreck-base, gulls perched on the stern at the high side",
      'THROUGH-RIGGING TO DECK — camera positioned between the mainmast yardarm and the topsail looking down through the rigging to deck-action below, the rigging framing the action like a diagonal lattice across the frame',
      "OVER-SHOULDER DUEL — camera positioned just behind the right shoulder of one combatant in a sword-duel, looking past their cutlass-arm at the opponent in mid-parry, the opponent's face/expression visible, the duel-stage receding behind",
      "CHEST-LEVEL DISCOVERY — camera at minifig chest-height, three-quarter behind a pirate approaching an open treasure-chest, the chest contents (jewels + gold + map) dominating the foreground, the pirate's reaching C-grip visible",
      "CAPTAIN'S CABIN CUTAWAY — camera positioned at the cabin's missing fourth wall, looking into the interior — table + charts + lantern centered, stern-window showing brick-water beyond, captain + officers in mid-conference",
      "WORM'S-EYE UP THE MAST — camera at deck-level looking straight up the mainmast, mast receding into perspective, yard-arms crossing overhead, rigging-lines converging toward the masthead, sails billowing at the top edge of frame",
      "DOCK-END APPROACH — camera at the far end of a dock looking down its length toward a moored ship at the seaward end, crew + crates + lanterns in receding perspective along the dock, the ship dominating the frame's far end",
      'KRAKEN-TENTACLE TIGHT-CROP — camera close on a single tentacle wrapping a mast, the suckers + skin-texture filling the foreground, the crew on the mast above in the upper-frame mid-reaction, the rest of the scene cropped out',
      "BURIED-CHEST DIG WIDE — high-angle overhead from a palm-tree perch looking down at a beach dig-site, six crew members radiating around the half-excavated chest, palm-shadows raking across the sand from the angled light",
      'BROADSIDE BETWEEN TWO SHIPS — camera in the open-water gap BETWEEN two engaged galleons, both hulls visible left and right of frame, broadside fire arcing across the gap, the camera at wave-top height inside the engagement',
      "OVER-THE-RAIL BOARDING — camera at the rail of one ship looking across at the enemy ship's rail, boarders mid-leap across the gap, the rail's edge providing the foreground frame-bar",
      "QUARTERDECK MUTINY WIDE — high-angle from the mainmast looking down at the quarterdeck mutiny scene, captain isolated at the rail flanked by loyalists, the crew arrayed in a tense semicircle, the angle making the captain look cornered",
      'LANTERN-INTIMATE CLOSE — tight-crop on a single minifig holding a lit lantern in the dark, the lantern\'s trans-yellow glow lighting their face from below, the surroundings dropped into shadow, a moment of conspiratorial intimacy',
      "AERIAL OVER COVE — overhead aerial shot of a hidden cove between cliffs, a sloop pulling into the cove, the cliff-walls framing the cove like parentheses, the brick-water inside the cove a different color than the open ocean",
      "BELOW-DECKS POV — camera at a minifig walking down the belowdecks corridor of a ship, hammocks slung overhead, cargo + crew in receding perspective, the corridor framing the action like a tunnel",
      "STORM-SURVIVAL TIGHT — camera at deck-level mid-storm with rain-rods (trans-clear bar pieces) streaking diagonally across the frame, crew lashed-to-rigging in the background, the chaos cropped to the immediate deck",
    ],
    instructions: `Each entry is ONE pirate-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms ("medium shot / wide shot / close-up") without pirate-specific anchoring — every entry must reference pirate scenery (rigging / yardarm / mast / longboat / kraken / cannon / quarterdeck / etc.).`,
  },

  // ─── ship_class — silhouette bender ───
  brickbot_pirates_ship_class: {
    format: 'simple',
    theme: `PIRATE SHIP/VESSEL CLASS — silhouette anchor for the pirates path. Each entry is ONE specific ship/vessel class with rigging + hull-curvature + proportion characteristics. Each entry 12-25 words.

⚠️ These are silhouette anchors — they tell Flux what TYPE of ship is in the frame. Aerospace-accurate; if it says "galleon" expect three masts + square-rigged + high stern-castle; if "sloop" expect one mast + fore-and-aft rigged.

VARIETY MANDATE — distribute across:
  • CARIBBEAN/GOLDEN-AGE classics (galleon / brig / sloop / frigate / man-o-war / schooner / barque) — most of the pool
  • NORSE longships (single mast, square sail, dragon-prow, oar-banked)
  • ASIAN junks (multiple battened sails, square-stern, lugsail rigging)
  • MIDDLE-EASTERN dhows (lateen-rigged, single or two masts, raked sails)
  • SMALL CRAFT (longboat, jolly-boat, cutter, gig, periagua)
  • FANTASY/HYBRID (skyship-galleon, submarine-pirate / pirate-of-the-skies dirigible, ghost-ship)
  • SPACE-PIRATE — Treasure Planet style galleon-in-space, asteroid-mining sloop
  • STEAMPUNK — gear-driven hybrid sail-and-steam vessel
  • SPECIALTY (whaler / smuggler-runner / fireship / careened-careening-vessel)

Each entry must:
• Name the class in first 4-8 words
• Specify mast count + rig type
• Specify hull-curvature characteristic (high stern / low waist / sharp bow / wide beam / etc.)
• Specify the typical SCALE (size relative to crew — 50-crew / 20-crew / 5-crew)`,
    touchpoints: [
      'Three-masted Caribbean galleon — square-rigged on fore and main, lateen on mizzen, high stern-castle, raked bow, 50-80 crew capacity, the classic pirate flagship',
      "Single-masted Caribbean sloop — fore-and-aft rigged mainsail with jib, sharp bow for speed, low waist, 10-20 crew capacity, the smuggler's runner",
      "Two-masted brig — square-rigged on both masts, mid-size with balanced silhouette, broad beam, 20-30 crew, the workhorse of Atlantic piracy",
      "Royal Navy fourth-rate frigate — three-masted square-rigged, 40-50 guns, distinctive red-and-white pattern, the imperial enforcer",
      'Norse longship — single mast with square red-and-white sail, low slung clinker-built hull, dragon-headed prow, 30-oar bench, raid-vessel',
      "Chinese junk — three battened lugsail masts, square-stern, raked transom, distinctive crab-claw sail-shape, ocean-going trade",
      "Arabian dhow — lateen-rigged single mast on a swept-back rake, sharp prow, wooden-pegged hull, monsoon trader",
      "Pirate captain's longboat — single mast with lugsail, open-decked, 6-12 crew, the standard ship-to-shore craft",
      "Ghost-ship galleon — half-translucent trans-clear hull, tattered sails, ragged-rigging, phantom-fleet variant of the Caribbean galleon silhouette",
      "Treasure Planet space-galleon — three-masted classic galleon silhouette but with solar-sail rigging and propeller-engines amidships, nebula-faring",
      "Pirate dirigible / skyship — airship hull suspended below a lozenge-shaped envelope, propeller-engines port and starboard, swing-anchor at the bow",
      'Steampunk hybrid — three-masted galleon with paddlewheels amidships and visible steam-stack at the stern, gear-mechanism deck details',
      "Smuggler's schooner — two-masted fore-and-aft rigged, sharp-bowed for speed, narrow beam, 15-crew capacity, designed for run-the-blockade work",
      "Man-o-war first-rate — three-masted square-rigged, 100-guns across three decks, hulking high-sided silhouette, the imperial flagship",
      'Whaler barque — three-masted hybrid square-and-fore-aft rigging, wide beam for hold-capacity, davit-mounted whaleboats, sturdy hull',
      'Fireship-converted brig — two-masted brig stripped of cargo and packed with combustibles, deliberately rigged to burn — sent against enemy fleets',
      "Caribbean periagua — long shallow-draft single-sail boat with paddle-stations, indigenous-built design, 8-12 crew, coastal raid-vessel",
      "Asteroid-mining sloop (space-pirate) — single-masted Caribbean-sloop silhouette with vacuum-sealed cabin and ion-drive instead of sails, asteroid-belt operating",
      "Cursed Dutchman-style galleon — barnacle-encrusted three-masted galleon with tattered sails and skeletal-figurehead, the iconic supernatural pirate vessel",
      "Careened-careening vessel — any class undergoing maintenance, beached at low-tide on its side with crew scraping the hull, broadside view of the keel",
    ],
    instructions: `Each entry is ONE ship/vessel class anchor, 12-25 words. Format: "CLASS NAME CAPS — rigging + hull + scale". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no anachronisms (no "diesel-engine galleon"); no modern-military terms (no "battleship / aircraft carrier / destroyer"); no vague descriptors ("big pirate ship"). Specific rig + class name + scale always.`,
  },

  // ─── register — era+faction bender (weighted ~60/40) ───
  brickbot_pirates_register: {
    format: 'simple',
    theme: `PIRATE REGISTER — era + faction lock for each render. Each entry is ONE specific historical/genre register that controls the crew attire + build motifs + props for this render. Each entry 20-40 words.

⚠️ WEIGHTED DISTRIBUTION — the pool should weight ~55-65% toward GOLDEN-AGE CARIBBEAN (the path's brand center) and ~35-45% toward NON-DEFAULT REGISTERS (the bending advantage). Generate accordingly.

REGISTER CATEGORIES — distribute as:
  • ~30% GOLDEN-AGE CARIBBEAN (1650-1730) — tricorn hats / cutlasses / flintlock pistols / silk sashes / Pirates of the Caribbean / Treasure Island / Captain Kidd / Blackbeard / Henry Morgan
  • ~10% GOLDEN-AGE CARIBBEAN SUB-VARIANTS — privateer (legal commission), Buccaneer (Spanish Main raider), Quaker-coast pirate (gentleman pirate)
  • ~10% NORSE RAID (8th-11th century) — Viking longships / shield-walls / horned-or-helmet (NOT both — historians! :) / chain-mail / axes / runic banners / Hägar lineage
  • ~5% GREEK MYTH / ARGONAUTS — bronze helmets / hoplite armor / amphora-stacks / Jason and Argonauts / Cyclops + sea-monsters / classical-trireme
  • ~5% ASIAN JUNK PIRATES — Ching Shih + South China Sea / Wokou / Vietnamese-thuyền pirates / queue-braid + conical-hat + curved-saber + jade + lacquered-armor
  • ~5% MIDDLE-EASTERN / BARBARY COAST — turbans + scimitars + dhow-rigging + Salee / Algiers raiders / silk-and-leather attire
  • ~5% CURSED / GHOST CREW — skeleton-torso variants + tattered-cape + phosphorescent-eyes + green-glow + Davy Jones lineage
  • ~5% FANTASY (One Piece / Sea of Thieves / Sea Beast) — exaggerated-anime style / fantasy-creature crews / impossibly-shaped ships / treasure-hunt fantasy
  • ~5% SPACE-PIRATE (Treasure Planet / Outlaw Star / Cowboy Bebop) — Caribbean attire + retro-futurist mods / plasma-cutlasses / solar-sails / nebula-backdrops
  • ~5% ROYAL NAVY / IMPERIAL FORCE — red-coat marines + tricorn officers + Union-Jack / Spanish-galleon Imperial / French-corsair / Dutch East-India-Company
  • ~5% STEAMPUNK PIRATE — Victorian-era + brass-gear + dirigible-skyship + steam-mechanical-prosthesis / monocle / pith-helmet
  • ~5% MODERN-SOMALI / RIVER-RAIDER — small fast skiffs + AK-coded weapons (LEGO-stylized) + improvised crew kit (rare register — use sparingly)

Each entry must:
• Name the register category in first 4-8 words
• Specify CREW ATTIRE characteristics (hat style / coat / sash / weapon-type)
• Specify BUILD MOTIFS (figurehead style / flag / rigging-flavor)
• Specify any restrictions ("ship_class becomes [X] regardless")`,
    touchpoints: [
      "GOLDEN-AGE CARIBBEAN — tricorn hats, leather cross-belts, silk sashes, cutlasses + flintlock pistols, Jolly Roger flag, 1650-1730 era, the path's brand-center register",
      "GOLDEN-AGE CARIBBEAN PRIVATEER — same Caribbean attire but officer's-uniform-coat in burgundy or navy, letter-of-marque scroll prop, more disciplined crew posture, legal-commission flag instead of Jolly Roger",
      "BUCCANEER (Spanish Main raider) — leather-jerkin attire, broad-brim hat instead of tricorn, single boucan-knife + musket, Caribbean-isle base motifs, Tortuga / Hispaniola lineage",
      "BLACKBEARD CREW VARIANT — Caribbean Golden-Age base but heightened theatricality, slow-burning fuses tied into the captain's beard (trans-orange spark elements), pistol-bandoliers, terror-shock motif",
      'NORSE RAID — Viking longship attire, horned OR antlered helmets (not both — historians take note), chain-mail tunics, two-handed axes, round wood-and-iron shields, runic banners; ship_class becomes Norse-longship-variant regardless',
      'NORSE RAID JOMSVIKING — elite Norse raider variant — black leather-and-mail, bear-pelt cloak, single-handed axes + seax, austere unmarked banner, ship_class still longship',
      'GREEK MYTH / ARGONAUTS — bronze hoplite helmets, leather-and-bronze armor, xiphos sword + dory spear, classical-trireme rig, amphora-stacks as scene props; ship_class becomes Greek-trireme; sea-monsters become classical (Scylla / Charybdis / Cyclops)',
      'CHING SHIH SOUTH-CHINA-SEA PIRATE — conical bamboo hats, silk tunics with embroidered sashes, queue-braid hair, curved sabers + matchlocks, junk-rigged battened sails; ship_class becomes Chinese-junk',
      "WOKOU JAPANESE-COAST RAIDER — pirate variant blending samurai-derived gear with Asian-pirate elements — half-armor with sashimono banner, katana + wakizashi, longbow, captured-Chinese-junk-variant ship_class",
      'BARBARY CORSAIR — Salee / Algiers pirate, turban + sashed-tunic + leather-vest, scimitar + flintlock, dhow-rigging visible; ship_class becomes Arabian-dhow or Mediterranean-galley',
      "CURSED GHOST CREW — skeleton-torso minifig variants with tattered-cape elements, half-translucent armor, phosphorescent-eye prints, ship is half-translucent with trans-clear hull highlights, ghost-ship galleon",
      "DAVY JONES CURSED CREW — barnacle-and-coral-encrusted crew variants, kraken-tentacle-arm prosthetics on certain figures, octopus-headed captain, ship is the cursed Dutchman-style galleon",
      "ONE-PIECE FANTASY CREW — exaggerated anime-stylized attire (oversized hats, mismatched colors, signature accessories), each crew-member with a unique fantasy element (devil-fruit reference, exaggerated weapon, fantasy-creature companion), fantasy-shaped ship",
      "SEA OF THIEVES FANTASY — fantasy-pirate exaggerated-color attire, parrot-companions and cosmetic flair, treasure-vault-hunting register, megalodon and skeleton-fleet motifs",
      "SPACE-PIRATE (Treasure Planet) — Caribbean-pirate attire updated with solar-cell visors, plasma-cutlasses replacing iron blades, robotic prosthesis on at least one crew-member, ship is space-galleon with solar sails; weather becomes nebula / asteroid-drift / ion-storm",
      "STAR-WARS PIRATE — Hondo Ohnaka / Cad Bane lineage — mixed-species crew, jetpacks + blaster-rifles + holstered-pistols + helmet/visor accessories, ship_class becomes star-pirate-galleon (corvette / patrol-ship)",
      'ROYAL NAVY RED-COAT — Royal Navy marine attire, red coats with white cross-belts, tricorn officer hats, muskets-with-bayonets + officer-cutlasses, Union-Jack pennants; ship_class becomes British man-o-war or frigate',
      "SPANISH GALLEON IMPERIAL — Spanish-Empire era crew, conquistador-derived officer attire, gold-trim coats, ornate cross-bearing-banners, ship_class becomes Spanish-galleon (treasure-fleet variant)",
      "STEAMPUNK PIRATE — Victorian-era pirate, brass-gear-decorated coats, pith helmet OR top-hat, mechanical-prosthesis on at least one figure, gear-festooned weapons (steam-pistol / clockwork-cutlass), ship is steampunk hybrid",
      'MODERN SOMALI RAIDER (rare register) — present-day attire — keffiyeh + denim + military-surplus + tactical-vest, small fast skiffs as ship_class regardless, AK-coded long-arms (LEGO-stylized), modern-port backdrop',
    ],
    instructions: `Each entry is ONE pirate register lock, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~55-65% Golden-Age Caribbean variants, ~35-45% non-default registers. STRICT BANS: no register-mixing within a single entry (no "Norse raider with Caribbean tricorn hat" — that's the cross-axis compatibility clauses' job).`,
  },

  // ─── scene_props — diorama fill details (pickN:2) ───
  brickbot_pirates_scene_props: {
    format: 'simple',
    theme: `PIRATE DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a pirate scene and add narrative depth. Each entry is ONE specific prop or detail with a story implied. Each entry 12-30 words.

⚠️ These are picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another. Not centerpieces — diorama-fill.

VARIETY MANDATE — distribute across:
  • LIVING COMPANIONS (parrot on shoulder, monkey climbing rigging, ship's cat watching, parrot in a brass cage, rats fleeing)
  • TREASURE-ELEMENTS (overflowing chest, scattered doubloons, jewel-encrusted goblet, silver-candlestick, gilded skull)
  • WEAPONS-LITTER (dropped cutlass on deck, cocked-flintlock on barrel, powder-keg with lit fuse, cannonball stack)
  • RIGGING / SHIP-PARTS (coiled rope on deck, broken yardarm, torn sail, lashed-cargo netting)
  • NAVIGATION / CAPTAIN GEAR (spyglass on rail, sextant on chart-table, compass-rose, ship's-log open)
  • FOOD / CREW LIFE (rum-keg open with cup beside, salt-pork hanging in galley, hardtack-tin, fishing-line over rail)
  • TROPHIES / FLAGS (Jolly Roger flag in close-up, captured enemy-pennant, severed-figurehead, ship-bell)
  • CURSED / SUPERNATURAL ELEMENTS (skull on a pike, cursed-amulet, glowing-jewel in a stand, voodoo-doll, kraken-ink-cloud)
  • PERSONAL ITEMS (peg-leg leaning against barrel, eyepatch on a hook, captain's hat on a stand, locket-on-a-chain)
  • MAP / DOCUMENT ELEMENTS (rolled chart, treasure-map fragment, ship's-log open, wax-sealed letter, navigation-rules-tile)
  • TAVERN / DOCK DETAIL (lit lantern hanging, wanted-poster nailed to a post, ale-tankard on a barrel, dock-rope-coil)

Each entry must:
• Name the prop type in first 3-6 words
• Specify the SPECIFIC LEGO BRICK PARTS where applicable (e.g., "minifig parrot accessory", "1×1 round trans-purple jewel element")
• Imply a STORYTELLING CONTEXT (this prop suggests... a backstory)`,
    touchpoints: [
      'Parrot on the captain\'s shoulder — minifig parrot accessory in red-blue-yellow, beak-painted-tile, perched via the shoulder-stud connection, ruffled mid-render as if it just landed',
      "Monkey climbing in the rigging — minifig monkey accessory in brown, gripping a rope with one paw, hanging mid-swing from a ratline antenna-piece, mid-mischief",
      "Overflowing treasure chest open on deck — 2×3 chest element open with gold-1×1-round-plates spilling out, trans-red + trans-green + trans-purple jewel-bricks scattered across the spill, gold-stud-on-plate doubloons",
      "Dropped cutlass on the deck planks — minifig cutlass piece lying flat on the studded wood-plank deck, the blade pointed away from a fallen minifig partially visible at frame-edge, suggesting a recent fight",
      "Powder-keg with lit fuse trans-orange — 2×2 cylinder-brick keg with a 1×1 round-plate fuse-piece in trans-orange spark element rising above, the moment-before-the-explosion freeze",
      "Coiled rope on the deck — brown flex-tube piece coiled neatly beside the foot of the mainmast, ready-for-use, a sailor's prepared-line for the next maneuver",
      "Spyglass on the quarterdeck rail — minifig telescope/spyglass accessory propped on the rail-edge, lens-end pointing toward the horizon, abandoned by a watchman who was just called away",
      "Open rum-keg with brass cup beside — 2×2 cylinder-brick keg with the lid off, a 1×1 round-plate brass tile beside as the cup, faint trans-brown 1×1 round-plate as the rum-spill suggesting a recent draw",
      "Severed enemy-ship figurehead — a brick-built ship's-figurehead piece propped against the rail like a trophy, splintered at the base, the prize-of-the-day from yesterday's engagement",
      "Skull-on-a-pike — minifig skull piece mounted on top of a black antenna-piece staked into the deck, warning to the crew or the prisoner, the morbid trophy-marker",
      "Captain's hat on a brass-hook — minifig tricorn hat hanging on a hook-piece bracket-mounted to the wall of the captain's cabin, the captain's-quarters detail",
      "Spilled chart on the navigator's table — 2×3 printed map-tile lying askew across a table, a minifig dagger pinning one corner, dividers (technic-pin tool) abandoned beside it, mid-plotting",
      "Lit hanging lantern — minifig lantern accessory hanging from a chain-piece (2-link chain) attached to a deck-beam overhead, trans-orange glow element inside, illuminating a small zone of the scene",
      "Wanted poster nailed to a tavern post — a printed 2×3 wanted-poster tile attached to a post with a 1×1 round-plate as the nail-head, the captain's face on the poster, a reward in doubloons listed",
      "Ship's bell mounted on the quarterdeck — a 1×1 round-brass-bell piece mounted on a Technic-axle bracket, the bell-pull rope hanging beside, the watch-change signal-piece",
      "Cocked flintlock on a barrel — minifig flintlock-pistol accessory propped on a barrel with the cock pulled back, ready-to-fire, set down between shots in a duel-pause",
      "Broken yardarm on the deck — a brown round-brick segment with attached rigging-strings lying broken across the deck, a sail-fragment trailing, evidence of recent battle-damage",
      "Open ship's log on the captain's table — a printed 2×2 ship's-log tile open with quill (minifig quill-accessory) beside, ink-pot 1×1 round-tile in black, the captain's-record-of-yesterday",
      "Severed mooring-line on the dock — a frayed-rope-end (flex-tube cut at angle) hanging from a dock-bollard, the ship that should be there gone, the moment-of-discovery",
      "Voodoo-doll on a barrel — a small custom-built minifig-effigy with pins (1×1 round-plates in pin colors) stuck in it, lying on a barrel-top, the cursed-trinket left as a warning",
    ],
    instructions: `Each entry is ONE pirate diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials (no "wooden carved figurehead" without naming brick parts); NO centerpiece-sized props (entries must be SMALL — coexist with other props in the same render); NO oversized treasure piles (those belong to scene_type entries).`,
  },

  // ─── lighting — axis-clean light source + direction + color quality ───
  brickbot_pirates_lighting: {
    format: 'simple',
    theme: `LEGO MOC PIRATE LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the pirates path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE (per playbook lesson 4 — EarthBot epic-vista 2026-05-20). Lighting pool owns ONE conceptual lane: light source + direction + color. Strictly OFF other lanes.

⚠️ HARD BANS — strip these from EVERY entry:
  • NO weather words: fog / mist / haze / rain / storm / lightning / squall / wind / blizzard / hurricane / aurora (those belong to weather_drama axis)
  • NO scene elements: sails / rigging / deck / cabin / cave / beach / harbor / treasure / barrels / lanterns-as-PROPS (those belong to scene_type / scene_props axes)
  • NO minifig action: "lighting carving shadows on faces" / "crew silhouetted" (those belong to minifig_action axis)
  • NO color-cast OVERRIDE language: don't say "warm golden light overrides the scene" — describe the light SOURCE + DIRECTION + COLOR neutrally

✓ VARIETY MANDATE — distribute across:
  • NATURAL DAYLIGHT (high-noon overhead / golden-hour-raking / blue-hour-dusk / dawn-cool-pink / midday-tropical-glare)
  • NATURAL NIGHT (full-moon overhead / crescent-moon side / starlight-only / moonless / moonrise-low-on-horizon)
  • COLORED SKY (sunset-orange-red / blood-red-dawn / sickly-yellow-pre-light / cobalt-tropical-overhead / charcoal-overcast)
  • PRACTICAL LIGHT SOURCES (single-candle / oil-lantern / torch / multiple-torches / firelight / muzzle-flash / explosion-flash)
  • DIRECTIONAL CHARACTER (raking-sidelight / backlight-silhouette / overhead-vertical / underlit-from-below / three-quarter-frontlight / rim-light)
  • SCENE-NEUTRAL DIFFUSE (overcast-soft / cloud-bright-flat / shaded-cool / open-shade)
  • CHIAROSCURO / HIGH-CONTRAST (Caravaggio-deep-shadow / single-source-dark-surround / spotlight-pool-of-light)

Each entry must:
• Specify the LIGHT SOURCE (sun / moon / candle / lantern / torch / explosion / etc.) in first 4-8 words
• Specify the DIRECTION (raking / overhead / backlit / sidelit / underlit / etc.)
• Specify the COLOR QUALITY (amber / silver-blue / harsh-white / saturated-orange / cool-grey / etc.)
• OPTIONALLY note a single visual signature (e.g., "long shadows" / "sharp edge-glow" / "soft halo" / "color-cast on light side")`,
    touchpoints: [
      'GOLDEN-HOUR RAKING SIDELIGHT — late-afternoon sun low on the horizon raking horizontally from one side, warm amber color quality on lit surfaces, long deep-violet shadow opposite, sharp shadow-edges',
      "FULL-MOON OVERHEAD COOL — directly overhead full moon, cool silver-blue color quality on all upward surfaces, deep blue-black undersides, vertical shadows underfoot",
      'SINGLE-CANDLE WARM POOL — one small candle as the only light source, warm orange glow falling off rapidly to darkness within 2 brick-lengths, deep-amber color quality at the source fading to pitch-black',
      'HARSH-NOON TROPICAL OVERHEAD — sun directly overhead, harsh-white color quality, sharp short shadows directly below objects, no atmospheric softening, high-contrast everywhere',
      'BLOOD-RED DAWN HORIZON BACKLIGHT — sun just below the horizon-line, blood-red + crimson color cast on the underside of any objects in frame, everything silhouetted against the red sky, deep-purple foreground',
      'COBALT TROPICAL MIDDAY OVERHEAD — high tropical sun with cobalt-blue sky, bleached-white lit surfaces, sharp-edged shadows, the saturated-blue overhead bouncing soft secondary-blue into shadows',
      'OIL-LANTERN WARM POOL UNDERLIT — handheld oil lantern at minifig waist-height, warm amber color quality lighting faces from below, dramatic underlit chiaroscuro, falloff to deep shadow at the edges',
      "MUZZLE-FLASH WHITE STROBE — instant cannon or pistol discharge as the dominant light source, magnesium-white color quality bleaching the lit side, hard-edged shadows on the off-side, momentary freeze-frame",
      "MOONRISE LOW-HORIZON RAKING — full moon just above the horizon raking horizontally, cool silver-blue color quality on lit surfaces, long deep-indigo shadows opposite, more dramatic than overhead moon",
      "TORCHLIGHT CIRCLE FROM ABOVE — torch held overhead by a minifig as light source, warm orange falloff in concentric circle below, sharp warm-cool boundary at the edge, flickering-implied color shift",
      "STARLIGHT-ONLY MOONLESS NIGHT — no moon, only faint silver-blue starlight, all surfaces very dim cool-blue, barely-readable shadow definition, near-pitch-black darkness with only highlights catching",
      "SUNSET-DISK BURNING ORANGE BACKLIGHT — sun-disk visible on the horizon as a saturated orange-red glow, everything silhouetted dark against the burning sky, lit surfaces tinged warm-amber",
      "FIRE-PIT UPLIGHT WARM — large bonfire as light source from below, hot orange-red color quality on undersides of objects above, sparks-implied warm-yellow particulate, cool-blue darkness above",
      "EXPLOSION-FLASH FLAT WHITEOUT — instant powder-magazine or grenade detonation, flat magnesium-white color quality washing out all surfaces evenly, momentary blowout, dust-debris implied",
      "BLUE-HOUR DUSK COOL DIFFUSE — post-sunset twilight, no direct light source, cool-blue-violet color quality on all surfaces, very soft diffuse shadows, the romantic-darkening transitional light",
      "DAWN-PINK COOL HORIZON GLOW — pre-sunrise pink-and-cool-blue gradient lighting, soft-diffuse color quality, barely-defined shadows, the gentle wash-of-color awakening light",
      "CARAVAGGIO DEEP-SHADOW SINGLE-SOURCE — chiaroscuro lighting from one off-frame source (could be window / lantern), warm color quality on lit edge, deep-black void on the other 80% of frame, dramatic high-contrast",
      "OVERCAST FLAT DIFFUSE COOL — heavily overcast sky bouncing flat cool-grey light, no directional shadows, even illumination, slightly desaturated color quality across the frame, neutral mood",
      "SUNLIGHT THROUGH SHAFT FROM ABOVE — single shaft of warm sunlight piercing downward from a hole / window / opening overhead, sharp-edged light-shaft, surrounding darkness on the unlit areas",
      "MULTIPLE-TORCH RING WARM — several torches arrayed in a ring around the scene, warm orange color quality from all sides, soft-overlapping shadows, the central subject lit evenly warm",
      "CRESCENT-MOON SIDELIT COOL — crescent moon low-angle from one side, soft silver-blue color quality on the lit side, deep-blue shadows on the other side, half the scene definition",
      "FIREPLACE / GALLEY-STOVE UNDERLIT — interior light source from a low fireplace or stove, warm flickering orange uplighting faces and lower bodies, cool darkness on upper surfaces above",
      "SHIP-LANTERN HANGING WARM SPOT — single hanging lantern as fixed light, warm circular pool of orange light directly below, falloff to cool darkness beyond the pool's edge",
      "MIDDAY OPEN-SHADE COOL — subject in deep shade of a structure on a bright day, cool indirect-bounced light filling, the bright daylit area visible on one edge of frame creating a value contrast",
      "FIRELIGHT FLICKERING WARM SIDELIT — fire-pit or bonfire from one side, warm flickering orange-yellow on the lit side, deep purple-black on the off-side, dramatic warm-cool split lighting",
      "STORM-BREAK SUN-SHAFTS THROUGH GAP — sun-shafts piercing through a break in dark clouds, sharp-edged warm-yellow light-shafts cutting through cool-grey ambient, dramatic god-rays",
      "BLOOD-MOON RED OVERHEAD — full moon directly overhead in trans-red color quality, sickly-red color cast on all upward surfaces, deep-burgundy shadows, supernatural-event lighting",
      "WAXING-MOON HALF-LIT — half-moon at three-quarter angle, soft silver-blue color quality on the lit side, gentle gradient to deep-blue darkness on the off-side, balanced cool lighting",
      "BACKLIT-FROM-HORIZON SILHOUETTE — light source on the deep-distance horizon backlighting the foreground subject as a pure dark silhouette against the lit sky, edge-glow rim-light on subject's contour",
      "NOON SHADOWLESS DIFFUSE — bright cloudless midday with sun directly overhead AND high-altitude haze diffusing slightly, near-shadowless even illumination, slightly warm color quality",
      "SHIP'S-LANTERN ARC SWEEP — hanging lantern caught mid-swing in motion, warm orange light-arc swept across the lit surfaces in a curve, momentary directional implied by the swing-blur",
      "DAWN-COOL-PINK BACKLIT — early pre-sunrise with pink-and-cool-blue gradient sky backlighting the foreground, soft-warm light catching upper edges only, cool-blue shadows below",
      "TWILIGHT-PURPLE OVERHEAD DEEP — post-blue-hour deep-twilight, rich purple-and-indigo overhead, no direct light source, very low ambient, the world dropping into night",
      "ICE-WHITE LIGHTHOUSE BEAM SWEEP — distant lighthouse rotating beam as the light source, cool-white narrow shaft of light raking horizontally across the frame, momentary directional lighting, falloff to darkness",
      "SAFFRON SUNSET LOW-HORIZON RAKING — late-stage sunset with saffron-yellow + saturated-orange + deep-pink horizontal gradient, raking light from one side warming the lit edges, long shadows opposite",
      "CYAN-GREEN PHOSPHORESCENT UPLIGHT — supernatural / cursed light source from below (phosphorescent water / will-o-wisp), cool-cyan-green color quality on the underside of objects above, eerie soft uplight",
      "SHOOTING-STAR STREAK ABOVE — momentary white-hot streak across the sky, brief illumination on the upper surfaces from above, mostly atmospheric / sky-only signature",
      "MOON-PATH ON WATER ONLY — moonlight bright ENOUGH only to define a silver-white path along the water surface, the surrounding scene dark, the path the dominant light-feature in frame",
      "LATE-AFTERNOON WARM BACKLIT — sun low in the sky behind the subject, warm-amber rim-light on the contours of the subject, cool-blue shadowed front, the iconic-warm-backlight setup",
      "POWDER-MAGAZINE RED-LANTERN SHIELDED — interior magazine with a shielded red-glass lantern as the only light, dim crimson glow on all surfaces, deep-shadow dominant, ominous safety-lit register",
    ],
    instructions: `Each entry is ONE pirate-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO weather words (fog / storm / rain / lightning / aurora — those belong to weather_drama); NO scene elements (sails / rigging / deck / cabin / treasure / barrels); NO minifig action; NO mood/narrative. SOURCE + DIRECTION + COLOR only.`,
  },

  // ─── palette — axis-clean color combinations ───
  brickbot_pirates_palette: {
    format: 'simple',
    theme: `LEGO MOC PIRATE PALETTE — axis-clean color-combination entries for the pirates path. Each entry is ONE specific multi-color palette for a pirate diorama. Each entry 12-25 words.

⚠️ AXIS-CLEAN — palette pool owns ONE conceptual lane: color combinations. The entry can carry a brief register-tag at the end (e.g., "captain's-quarters") for flavor, but the bulk is colors.

✓ VARIETY MANDATE — distribute across pirate-coded palettes:
  • CARIBBEAN GOLDEN-AGE (weathered-oak + sail-white + brass + pirate-red)
  • STORM / NIGHT (storm-navy + ghost-cyan + tarnished-gold + bleached-bone)
  • TROPICAL (turquoise + coral-pink + sand + driftwood + palm-green)
  • TREASURE-COLOR (gold + emerald + ruby + bronze + amber)
  • SUNSET / WARM (saffron + crimson + amber + burnt-sienna + deep-purple)
  • COOL / MOONLIT (silver-blue + indigo + cool-charcoal + ivory + steel)
  • BATTLE / SMOKE (cannon-gray + powder-black + fire-orange + steel-blue + blood-red)
  • CURSED / GHOST (phosphorescent-green + abyss-black + bone-white + verdigris)
  • NORSE / VIKING (iron-grey + bone-white + leather-brown + raven-black + axe-steel)
  • ASIAN-JUNK (jade + lacquer-red + silk-gold + bamboo-tan + ink-black)
  • SPACE-PIRATE (nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey)
  • STEAMPUNK (brass-gold + leather-brown + glass-cyan + iron-black + copper-patina)
  • ROYAL NAVY (red-coat + white-cross-belt + navy-blue + brass + black-bicorn)
  • BLOOD / VIOLENCE (crimson + black-iron + spatter + ash)

Each entry must:
• Name 3-5 specific colors with a noun-anchor (e.g., "weathered-oak brown" not just "brown")
• Use specific color-modifier vocabulary (weathered / tarnished / bleached / saturated / cool / molten)
• End with a brief register tag (lagoon-hideout / cursed-treasure / battle-scarred / captain-quarters)
• NEVER drift into lighting language (no "golden-hour orange") — describe colors as MATERIAL colors`,
    touchpoints: [
      "Weathered-oak brown + sail-canvas white + brass-doubloon gold + pirate-red, sun-bleached-deck",
      "Storm-dark navy + ghost-ship cyan + tarnished gold + bleached-bone, phantom-vessel",
      "Tropical turquoise + coral-pink + bone-sand + driftwood-grey + palm-green, lagoon-hideout",
      "Treasure amber + emerald-jewel + ruby + antique-bronze + dark-mahogany, plundered-hoard",
      "Saffron sunset + crimson + burnt-sienna + deep-purple + ember-orange, fire-sky",
      "Silver-blue + indigo + cool-charcoal + ivory + steel-grey, moonlit-night",
      "Cannon-grey + powder-black + fire-orange + steel-blue + blood-red, broadside-battle",
      "Phosphorescent-green + abyss-black + bone-white + verdigris-copper, cursed-depths",
      "Iron-grey + raven-black + bone-white + leather-brown + birch-pale, Norse-raid",
      "Jade + lacquer-red + silk-gold + bamboo-tan + ink-black, Asian-junk",
      "Nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey, space-pirate",
      "Brass-gold + tan-leather + glass-cyan + iron-black + copper-patina, steampunk",
      "Red-coat + white-cross-belt + navy + brass + black-bicorn + ivory, Royal-Navy",
      "Crimson-blood + black-iron + ash-grey + bone-white + rust-orange, mutineer-violence",
      "Burgundy velvet + gold-braid + crimson-sash + ivory-lace + ebony, commodore-finery",
      "Spiced-rum amber + tobacco-brown + cream + aged-oak + brass, tavern-grog",
      "Map-parchment + ink-brown + wax-seal-red + aged-vellum + leather, treasure-chart",
      "Cobalt-ocean + foam-white + hemp-rope + anchor-iron + cloud-white, open-sea",
      "Powder-blue sky + gull-white + driftwood-tan + horizon-navy, endless-voyage",
      "Kraken-ink black + tentacle-purple + drowned-blue + pearl-shimmer + abyss-teal, deep-terror",
      "Galleon-gold + ocean-spray white + hull-tar black + sail-shadow grey, flagship-pride",
      "Sea-glass green + driftwood grey + copper-penny + bone-white, shipwreck-ruins",
      "Hurricane-grey + lightning-white + tempest-blue + blackened-mast + cold-rain-silver, storm-tossed",
      "Limestone-cave cream + torch-flame orange + moss-green + shadow-charcoal + wet-stone, smuggler-grotto",
      "Bandana-scarlet + sun-faded denim + leather-brown + brass-buckle + tan-trousers, pirate-garb",
      "Cutlass-steel + blood-spatter + gunmetal + leather-grip-brown + iron-black, blade-duel",
      "Spyglass-brass + horizon-teal + cloud-white + telescope-black + cool-grey, crow-nest",
      "Port-wine red + harbor-fog-grey + dock-timber + lantern-yellow + brick-red, shore-leave",
      "Outlaw-silver + wanted-poster-tan + bounty-red + gallows-black + parchment-cream, notorious",
      "Reef-coral + lagoon-shimmer + shell-pink + volcanic-rock + palm-green, cove-secret",
      "Sea-brine green + jellyfish-glow + reef-coral + undertow-blue + kelp-amber, submerged-wreck",
      "Cinder-black + ember-orange + ash-grey + soot + dying-coal-red, smoldering-aftermath",
      "Whaler-tan + scrimshaw-ivory + iron-pike + harpoon-steel + oil-amber, whaler-deck",
      "Cursed-pearl + bone-grey + green-corruption + verdigris + skull-white, Davy-Jones",
      "Spanish-galleon-gold + conquistador-red + obsidian + ivory-bone + ornate-bronze, Spanish-empire",
      "Argonaut-bronze + Aegean-blue + olive-green + amphora-clay + ivory-marble, Greek-myth",
      "Barbary-corsair turban-white + scimitar-steel + tan-silk + sun-bronze, Mediterranean-raid",
      "Wokou black-lacquer + samurai-red + steel-katana + silk-saffron + bamboo, Japan-coast",
      "Mango-orange + parrot-emerald + pineapple-yellow + macaw-blue + sand, tropical-plumage",
      "Iceberg-white + glacier-cyan + arctic-ivory + frozen-silver + polar-grey, polar-pirate",
    ],
    instructions: `Each entry is ONE pirate palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language ("golden-hour orange" — describe as material color); NO scene elements (no "captain's-coat-red sash" — just "captain-red"); NO weather words. Material colors with anchors + register-tag.`,
  },

  // ─── weather_drama — environmental drama (50%-gated conditional) ───
  brickbot_pirates_weather_drama: {
    format: 'simple',
    theme: `PIRATE WEATHER / ENVIRONMENTAL DRAMA — atmospheric/oceanic event that AMPLIFIES the scene. Each entry is ONE specific weather or environmental drama event that can fire on a pirate diorama (50%-gated conditional). Each entry 20-40 words.

⚠️ This axis is decoupled from scene_type and lighting — it's the BENDING AXIS that lets us roll "kraken-attack + glass-calm-sea" (eerie tranquil) or "harbor-port + thunderhead-break" (dramatic departure). The drama event AMPLIFIES the moment without prescribing the lighting time-of-day.

VARIETY MANDATE — distribute across:
  • STORM EVENTS (thunderhead-break / squall-mid-deck / lightning-strike-mast / driving-rain / wind-whipped-sails)
  • CALM EVENTS (glass-mirror-calm-sea / dead-calm-becalmed / mist-still-water / glass-water-reflection)
  • FOG / VISIBILITY (dense-fog rolling in / thick-haze obscuring / mid-fog-bank-emergence)
  • OCEAN CREATURES (kraken-tentacles emerging / megalodon-fin / whale-breaching / dolphin-pod / sea-serpent rising)
  • SKY / NIGHT EVENTS (full-moon / blood-moon / shooting-star / aurora over polar-pirate / lunar-eclipse mid-scene)
  • COASTAL HAZARDS (waterspout / hurricane-eye / iceberg-emerging-from-fog / reef-rocks-revealed-at-low-tide)
  • SUPERNATURAL ENVIRONMENTAL (phosphorescent-water / ghost-ship-emerging-from-mist / cursed-fog-with-faces / will-o'-the-wisp-lanterns)
  • BIRDS (storm-petrels-fleeing / albatross-overhead / gulls-mobbing-deck / parrot-flock-screaming)
  • DAY/NIGHT TRANSITION (dawn-line-on-horizon / sunset-fire-on-water / twilight-purple / pre-storm-yellow-light)
  • DEBRIS / WRECKAGE (floating-cargo-from-recent-wreck / drifting-corpse / shark-feeding-frenzy-on-flotsam / lifeless-message-bottle)

Each entry must:
• Name the drama event in first 4-8 words
• Specify WHICH BRICK PARTS render it (trans-pieces / flex-tubes / specific elements)
• Specify the VISUAL IMPACT (what changes in the frame — color cast / motion / focal point)
• NEVER override the lighting axis directly (don't say "golden hour" — say "sun-disk pierces the storm-clouds" instead)`,
    touchpoints: [
      "THUNDERHEAD BREAK — towering brick-built thundercloud-bank to one side built from layered white + light-bley plates with darker-bley underbellies, a brilliant trans-yellow lightning-bolt element striking a distant mast, rain-rods (trans-clear bar pieces) angling across the cloud-edge",
      'GLASS-MIRROR CALM SEA — completely still brick-water using flat trans-blue tiles edge-to-edge with zero foam-crests, the ship\'s reflection visible in the surface (built as inverted mirror-image below), eerie tranquil contrast to any combat-action above',
      'DENSE FOG ROLLING IN — cotton-batting white-and-light-bley plate-stack fog elements layered along the brick-water surface and creeping inward, the distant ship-silhouettes half-obscured by the fog-bank, only mast-tops visible',
      "KRAKEN-TENTACLES EMERGING — multiple trans-dark-green tentacle-builds rising from around the hull on both sides, suction-cups visible (1×1 round-plate inverted), the brick-water around the tentacles disturbed with foam-1×1-round-plates",
      "MEGALODON FIN BREACHING — colossal trans-dark-grey shark-fin element rising above the brick-water beside the ship, the silhouette of the body visible beneath the trans-blue surface, the scale-of-the-shark dwarfing the ship",
      "FULL MOON OVER OCEAN — a 4×4 round-tile in trans-white as the full moon hanging in the brick-sky background, casting a moonlit-path of pale-blue trans-light-blue tile-strip across the brick-water surface to the foreground",
      "BLOOD MOON CURSED-EVENT — same moon-disc but in trans-red, casting a sickly red moonlit-path across the water and tinting the entire scene with red-glow trans-red 1×1 round-plates scattered as atmospheric particulate",
      'WATERSPOUT FUNNEL — a brick-built funnel-cloud reaching from a thunderhead to the brick-water surface using stacked round-bricks tapering to a point, the funnel-base whipping up a debris-cloud of small white 1×1 round-plates',
      "SHARK FEEDING FRENZY — multiple grey dark-bley shark-elements circling beneath the brick-water surface, churning the water with white 1×1 round-plate foam-bursts, the silhouettes barely visible through the trans-blue plates",
      "HURRICANE EYE — circular calm zone of glass-still brick-water in the foreground, with a dramatic brick-built wall-of-storm encircling the edges of the frame, the moment-of-eye-passing before the back-half of the hurricane hits",
      "ICEBERG EMERGING FROM FOG — a massive trans-white + light-blue mountainous iceberg-build looming out of the brick-fog directly in the ship's path, the ship's bow pointing toward the bergy-base, the moment-of-recognition freeze",
      "PHOSPHORESCENT WATER — the brick-water glowing with trans-light-green + trans-cyan 1×1 round-plates scattered across the surface, every wake and disturbance lit up like neon, the cursed-water bioluminescent supernatural-event",
      "STORM-PETRELS FLEEING — a swarm of small dark-bley 1×1 round-plates and small-bird-accessory pieces clustered in the air just above the brick-water surface, all flying in the same direction, the omen-of-bad-weather-approaching",
      "DAWN-LINE ON HORIZON — a horizontal trans-orange + trans-yellow + trans-red brick-stripe along the seam between brick-water and brick-sky in the distance, the sun-disc not yet risen but the light-bleeding-up effect rendered in tile-strip",
      "DRIFTING WRECKAGE — splintered ship-fragments (broken brown brick-pieces + a torn sail-fragment + a floating barrel + a fragment of figurehead) drifting on the brick-water surface beside the ship, evidence of an earlier disaster",
      "AURORA OVER POLAR-PIRATE — vertical trans-green + trans-cyan brick-strip aurora-curtains in the brick-sky background, only fires when scene is set in arctic / polar register, casting an unearthly green glow on the scene",
      "GHOST-SHIP EMERGING FROM MIST — a half-translucent (trans-clear brick-highlighted) ship-silhouette materializing out of a fog-bank in the deep background, only barely-visible, the supernatural omen-of-the-Flying-Dutchman",
      "PRE-STORM YELLOW LIGHT — the brick-sky rendered in sickly trans-yellow + tan plate-stack as the pre-storm jaundice-light, the brick-water glassy and ominous, the calm-before-the-storm freeze-frame",
      "SUNSET FIRE ON WATER — the brick-water lit by a fiery trans-orange + trans-red glow-strip leading from the horizon to the foreground, the ship silhouetted against the burning-sea, dramatic-departure framing",
      "WILL-O'-THE-WISP LANTERNS — small floating trans-green 1×1 round-plate orbs hovering above the brick-water in the foreground, the swamp-cove-supernatural-event, lures-to-doom drifting between the ship and the shore",
    ],
    instructions: `Each entry is ONE pirate weather/environmental drama event, 20-40 words. Format: "DRAMA NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify time-of-day or lighting color cast (no "golden-hour storm" — that's the lighting axis); NEVER lock crew/scene reaction language (no "crew screaming in panic" — that's minifig_action); environmental EVENT only.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`);
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
  const outPath = path.resolve(`scripts/bots/brickbot/seeds/${POOL}.json`);
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
