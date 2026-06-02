#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — SUBJECT axis (R4 — autumn + spring ONLY).
 *
 * Kevin's call: tighten path identity to fall foliage (including
 * autumn-to-winter transition / first snow on foliage) + spring blossoms
 * & life returning. DROP pure winter + summer entirely (they trended
 * mono-color or generic).
 *
 * 50/50 split:
 *   - autumn (incl. "first snow on autumn foliage" transition)
 *   - spring (blossoms + wildflowers + emerging green + life returning)
 *
 * Both seasons are multi-color winners for Flux rendering.
 *
 * R0 = 50 (clean replace).
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_subject.json';
// Append mode — scale R8 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUBJECT entries for EarthBot seasonal-shift. Each entry describes ONE landscape composition / setting where AUTUMN FOLIAGE or SPRING BLOSSOMS unfold. NO colors (color_palette axis owns multi-color). NO depth layers (depth_layers axis owns tiers). NO motion (seasonal_motion axis owns motion). Just the LANDSCAPE TYPE + framing + season tag.

PATH IDENTITY (tight): this path is 100% about (1) AUTUMN FALL FOLIAGE — including the "first snow on autumn leaves" transition look — and (2) SPRING — blossoms, wildflowers, emerging green, life returning. NO pure winter scenes, NO summer scenes.

━━━ THE BAR — LANDSCAPE COMPOSITION (no color / depth / motion details) ━━━

Each entry names ONE landscape composition type + season. Like "wide alpine valley with deciduous forest cascading down" — describes WHERE without naming colors or depth-tier specifics.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<landscape composition, 18-30 words>" }

The "tags" array MUST include ONE of "autumn" / "winter" / "spring" / "summer" as FIRST tag.

━━━ FRAMING DISTRIBUTION (5 modes across both seasons) — STRICT TARGETS ━━━

Generate to hit these proportions (50 total = ~25 autumn + ~25 spring split across 5 framings):
- 60% WIDE FORESTED LANDSCAPE VISTA (panoramic valley / hillside / plateau / ridgeline / rolling forested hills view — DOMINATED BY MATURE TREES, every-tree-at-peak-color packed wall-to-wall to horizon)
- 10% FOREST INTERIOR (looking through TALL TRUNKS with seasonal color enveloping the frame from all sides)
- 10% RIVER VIEW (river / stream winding through seasonal MATURE forest — water visible cutting through, FOREST is the dominant frame element NOT cliff walls)
- 10% WATERFALL (waterfall cascading down with MATURE forest framing both sides — forest is dominant NOT rocky walls)
- 10% INTIMATE CLOSE-UP (close-camera forest floor / wildflower carpet)

⚠️ FORESTS — NOT SHRUBS, NOT CLIFFS, NOT ROCKY SLOPES.

The autumn vista must depict ACTUAL DECIDUOUS FOREST — mature trees with visible trunks, towering canopy, named species visible (sugar maple / scarlet oak / yellow birch / quaking aspen / red maple / sweetgum / hickory / paperbark birch / sitka spruce). Words to use: "TOWERING deciduous canopy", "MATURE mixed forest", "tall mixed-species trunks rising", "the canopy stretching ridge after ridge". Words to BAN: "rocky cliffs" / "canyon walls" / "shrubs" / "scrub" / "low autumn vegetation" — those make Flux render orange bushes on rocks.

⚠️ NAMED SPECIES MANDATE — every wide-vista entry must reference at LEAST 2 specific deciduous species (autumn) or 2 specific flowering species (spring). Example autumn: "mixed sugar-maple + scarlet-oak + yellow-birch + quaking-aspen". Example spring: "mixed cherry-blossom + flowering-dogwood + redbud + magnolia".

⚠️ DENSITY MANDATE — TURN IT TO 11. Every wide-vista entry MUST imply MAXIMUM density of trees / leaves / blooms / flowers / greenery — wall-to-wall canopy, no gaps, every branch carrying peak color, carpet-thick wildflower coverage, packed-shoulder-to-shoulder bloom. NO sparse / open / scattered / minimal / patchy language.

⚠️ BANNED WORDS — "fire" as a noun ("on fire" / "fire color" / "fall fire" / "fire-mosaic" — these render as literal flames). Use "peak color" / "saturated color" / "drenched in color" / "blazing color" (adj OK) / "color explosion" instead.

━━━ AUTUMN (~50%) — TOWERING DECIDUOUS FORESTS AT PEAK COLOR ━━━

WIDE FORESTED VISTA (CORE — 60% of pool, every entry names SPECIFIC tree species):
- A vast deciduous plateau with TOWERING mixed sugar-maple + scarlet-oak + yellow-birch + quaking-aspen canopy packed wall-to-wall to the deep horizon, named species visible as distinct dense groves
- A wide forested mountain ridge with MATURE sugar maple + paperbark birch + red oak + American beech canopy cascading dense across ridge after ridge, distant peaks rising above
- An expansive forested valley floor with TALL mixed scarlet oak + yellow birch + quaking aspen + sitka spruce trunks rising from a leaf-carpet floor, canopy stretching unbroken to a distant ridge
- A panoramic forested basin with TOWERING red maple + sweetgum + hickory + yellow birch packed across rolling hills, the canopy continuous to the deep horizon
- A vast deciduous plateau with MATURE sugar maple + paperbark birch + scarlet oak + Virginia creeper understory packed dense across the entire frame, distant peaks
- A wide forested hillside with TALL mixed quaking-aspen + sugar-maple + crimson oak + American beech trunks, dense saturated canopy edge-to-edge, distant horizon
- A panoramic alpine forested valley with TOWERING sitka spruce columns anchoring + mixed maple + birch + aspen between, snow-dusted peaks rising above the canopy
- An expansive rolling forested plateau with MATURE deciduous canopy at peak color — mixed sugar-maple + scarlet-oak + amber-aspen + paperbark-birch packed shoulder-to-shoulder, distant ridge
- A wide forested ridge view with MATURE mixed sugar-maple + paperbark-birch + red-oak + sweetgum canopy stretching dense across the frame, atmospheric haze cooling the distant valley
- A panoramic deciduous basin with TOWERING crimson oak + yellow birch + scarlet maple + lingering hemlock packed wall-to-wall, distant snow-dusted peaks
- A vast forested valley with TALL mixed deciduous trunks rising dense across the floor — sugar maple, scarlet oak, paperbark birch, quaking aspen, lingering green spruce columns anchoring
- A panoramic FIRST SNOW scene — wide forested valley with TOWERING mixed deciduous still at peak color below + fresh powder dusting the high peaks, distant
- A wide forested hillside DRENCHED in saturated peak color — TOWERING sugar-maple + scarlet-oak + yellow-birch + amber-aspen + Virginia-creeper understory packed dense, distant peaks
- A vast deciduous plateau panorama with MATURE mixed-species canopy filling the entire frame in distinct dense groves of yellow + orange + red + crimson + lingering green
- A panoramic alpine forested basin with TOWERING mixed deciduous + lingering green conifer columns packed dense, distant snow-dusted peaks rising above

FOREST INTERIOR:
- A forest interior enveloped by TOWERING mixed sugar-maple + scarlet-oak + yellow-birch trunks at peak color — saturated canopy filling above + leaf-carpeted ground below
- Looking up through MATURE deciduous canopy at mixed sugar-maple + paperbark-birch + red-oak peak color framed against the sky above

RIVER VIEW:
- A wide forested river-valley with MATURE mixed sugar-maple + scarlet-oak + yellow-birch canopy packed dense on both banks (FOREST is the dominant frame element, NOT rocky walls), water reflecting the saturated canopy
- A panoramic river bend viewed from above — TOWERING mixed deciduous forest on both banks at peak color, water cutting through the multi-color scene

WATERFALL:
- A wide waterfall cascading down with MATURE deciduous forest framing both sides — TOWERING mixed sugar-maple + paperbark-birch + scarlet-oak canopy at peak color (forest dominant, NOT rocky walls)
- A multi-tier waterfall with TOWERING mixed sugar-maple + scarlet-oak + amber-aspen canopy framing the cascade dense on both sides, pool reflecting the saturated trees

INTIMATE CLOSE-UP (rare — only 1-2 entries):
- An intimate autumn forest floor with dense mixed fallen sugar-maple + scarlet-oak leaves + violet New England asters + low understory + saturated canopy behind

━━━ SPRING (~50%) — SUPERBLOOM EXPLOSION + LIFE RETURNING ━━━

WIDE FORESTED VISTA (CORE — 60% of pool, every entry names SPECIFIC species):
- A vast spring valley with dense mixed cherry-blossom + flowering-dogwood + redbud + magnolia + saucer-magnolia canopy packed wall-to-wall + understory of bluebell + Virginia bluebell + trillium carpet, distant peaks
- A panoramic spring hillside with MATURE mixed cherry-blossom + flowering-dogwood + redbud + serviceberry canopy EXPLODING in dense bloom + wildflower carpet of lupine + paintbrush + poppy stretching to horizon
- An expansive alpine meadow at peak SUPERBLOOM — mixed lupine + Indian-paintbrush + California-poppy + cornflower + queen-Anne's-lace packed shoulder-to-shoulder, mixed flowering tree-line behind
- A wide-frame spring valley with TOWERING cherry-blossom + flowering-dogwood + redbud canopy + emerald new-growth carpet stretching unbroken to a distant ridge
- A vast spring desert SUPERBLOOM with mixed California-poppy + lupine + paintbrush + chuparosa + desert-marigold packed across the plain + flowering cactus + rocky outcrops, distant mountains
- A panoramic spring valley with dense wildflower SUPERBLOOM of bluebonnet + paintbrush + poppy + queen-Anne's-lace filling the foreground + mixed flowering tree-line + distant peaks
- A wide-vista spring hillside with TOWERING cherry-blossom + redbud + flowering-dogwood canopy filling the slope + wildflower carpet of lupine + paintbrush + poppy packed at the base, distant horizon
- A panoramic spring thaw scene — lingering snow patches + dense wildflower carpet of glacier-lily + spring-beauty + bluebells + emerging green + distant snow-dusted peaks
- An expansive spring alpine basin with mixed flowering trees + dense lupine + paintbrush + poppy SUPERBLOOM filling the frame
- A vast spring deciduous valley with MATURE mixed cherry-blossom + flowering-dogwood + redbud + serviceberry canopy EXPLODING wall-to-wall across both slopes, distant ridge
- A wide-frame cherry-blossom valley with dense mixed cherry + flowering-dogwood + redbud + magnolia trees + understory wildflowers + distant peaks
- A panoramic spring meadow-valley with dense multi-color SUPERBLOOM of lupine + paintbrush + poppy + bluebell + dame's-rocket + mixed flowering tree-line + distant ridge
- A vast spring forested valley with TOWERING mixed cherry-blossom + flowering-dogwood + redbud canopy packed dense + wildflower carpet, distant horizon
- A panoramic forested hillside DRENCHED in saturated bloom — TOWERING cherry-blossom + flowering-dogwood + redbud + magnolia + understory dame's-rocket + bluebell packed dense
- A wide alpine SUPERBLOOM panorama with dense lupine + paintbrush + poppy + cornflower + queen-Anne's-lace + emerald new grass + mixed flowering tree-line + distant snow-capped peaks

FOREST INTERIOR:
- A forest interior enveloped by MATURE mixed cherry-blossom + flowering-dogwood + redbud + magnolia at peak bloom — saturated canopy above + wildflower carpet of trillium + bluebell + Virginia-bluebell below
- Looking up through TOWERING flowering canopy at mixed cherry-blossom + magnolia + redbud + flowering-dogwood branches against the sky above

RIVER VIEW:
- A wide spring river-valley with MATURE mixed cherry-blossom + flowering-dogwood + redbud canopy packed dense on both banks (FOREST is dominant, NOT rocky walls), water reflecting the bloom
- A panoramic spring river bend viewed from above — TOWERING mixed flowering tree-line on both banks + wildflower carpet + water cutting through the multi-color scene

WATERFALL:
- A wide spring waterfall with TOWERING mixed cherry-blossom + flowering-dogwood + redbud canopy framing both sides + wildflower-carpeted base + reflective pool
- A multi-tier spring waterfall with TOWERING mixed flowering trees framing the cascade + understory of bluebell + trillium + dame's-rocket

INTIMATE CLOSE-UP (rare — only 1-2 entries):
- An intimate spring forest glade with dense low wildflower carpet of trillium + bluebell + dame's-rocket + butterflies + soft flowering canopy of dogwood + redbud backdrop

━━━ ABSOLUTELY BANNED ━━━

- Mono-color-tendency subjects (NEVER "pure cherry-blossom grove", NEVER "all-maple slope", NEVER "pure snow conifer forest" — these lock Flux into mono-color)
- Single-species deciduous (NEVER "aspen slope" / "maple hillside" alone — use "MIXED deciduous")
- Color details (color_palette axis — never name a specific color here)
- Depth tier details (depth_layers axis)
- Motion details (seasonal_motion axis)
- Named places
- Lighting words (lighting axis)
- Sky details
- Architecture / stone-steps / cabins / fences
- Humans
- Bioluminescent / sci-fi

━━━ EXAMPLES ━━━

✓ { "tags": ["autumn"], "description": "A MIXED deciduous mountain hillside with multiple species at peak fall fire cascading across the slope" }

✓ { "tags": ["autumn"], "description": "A river-valley deciduous forest at peak fall with mixed-species canopy and understory color" }

✓ { "tags": ["autumn"], "description": "A FIRST SNOW dusting on MIXED autumn forest — fresh white powder coating leaves still at peak color" }

✓ { "tags": ["spring"], "description": "A vast WILDFLOWER SUPERBLOOM carpeting a valley floor with mountains rising behind" }

✓ { "tags": ["spring"], "description": "A spring valley with WILDFLOWER SUPERBLOOM + mixed flowering trees + new emerging deciduous green" }

✓ { "tags": ["spring"], "description": "A spring thaw scene — patches of lingering snow + emerging wildflower carpet + new green leaves bursting" }

✗ BAD — mono-tendency: "A pure cherry-blossom grove" (BANNED — locks Flux into pink)
✗ BAD — mono-tendency: "A snow-blanketed coniferous slope" (BANNED — winter dropped entirely)
✗ BAD — single-species: "An aspen-blanketed alpine slope" (BANNED — use "MIXED deciduous slope")
✗ BAD — colors: "A scarlet maple forest hillside" (BANNED — that's color_palette axis)
✗ BAD — architecture: "Wisteria over stone steps" (BANNED — no architecture)
✗ BAD — wrong season: "A wide summer wildflower meadow" (BANNED — only autumn + spring; summer dropped entirely)
✗ BAD — wrong season: "A high alpine valley with first snow" (BANNED if tagged "winter" — tag as "autumn" if it's first-snow-on-foliage)

━━━ ABSOLUTELY BANNED ━━━

- Color details (color_palette axis — never name a specific color here)
- Depth tier details (depth_layers axis)
- Motion details (seasonal_motion axis)
- Named places
- Lighting words (lighting axis)
- Sky details
- Architecture / stone-steps / cabins / fences
- Humans
- Bioluminescent / sci-fi

━━━ EXAMPLES ━━━

✓ { "tags": ["autumn"], "description": "A wide alpine valley with deciduous forest cascading down toward a distant river" }

✓ { "tags": ["autumn"], "description": "A panoramic forest hillside with dense mixed canopy filling the frame" }

✓ { "tags": ["winter"], "description": "A high alpine valley with snow-blanketed ridges rising on both sides" }

✓ { "tags": ["spring"], "description": "A cherry-blossom grove cascading down a hillside toward a calm pond" }

✓ { "tags": ["summer"], "description": "A wide summer meadow at peak bloom with distant mountains visible" }

✗ BAD — colors: "A scarlet maple forest hillside" (BANNED — that's color_palette axis)
✗ BAD — depth: "Wildflower foreground with maples midground and snow peaks distant" (BANNED — depth_layers axis)
✗ BAD — motion: "Cherry blossom storm with petals drifting" (BANNED — seasonal_motion axis)
✗ BAD — named place: "Aspen Colorado valley" (BANNED — generic only)
✗ BAD — architecture: "Wisteria over stone steps" (BANNED — no architecture)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Landscape composition + season-tag only. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
