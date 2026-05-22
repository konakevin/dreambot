#!/usr/bin/env node
/**
 * EarthBot sacred-light — SUBJECT axis (R1 trigger-purge).
 *
 * R0 had explorer-photography-coded compositions ("forest interior with
 * trunks rising" / "narrow spine cirque basin") that triggered humans
 * even with explicit "no humans" suffix. Same root-cause pattern as
 * geological-wonder R0 — Flux's training data for these specific
 * geometries is dominated by Marc-Adamus / Galen-Rowell shots WITH
 * human figures for scale.
 *
 * R1 rewrites subject pool to observational framings — forest crowns
 * viewed from outside / elevated vantage (NOT inside walking through),
 * alpine ridgelines silhouetted at deep distance (NOT cirque-basin POV).
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/sacred_light_subject.json';
// R1 production scale — append to existing 50 entries to reach 200.
generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SACRED-LIGHT SUBJECT entries for EarthBot sacred-light. Each entry describes ONE natural setting PRIMED for sacred-light drama. The setting holds the stage — the lighting axis brings the actual light event. Generic morphological descriptions only — NO named places (LESSON 7).

━━━ THE BAR — NATURAL SETTING PRIMED FOR TRANSCENDENT LIGHT ━━━

Each entry is a natural setting where DRAMATIC LIGHT can happen — a single alpine peak rising from the surrounding valley, an old-growth forest CROWN viewed from above/outside, a desert mesa at the horizon, a misty lake reflecting cypress, a windswept ridge above forest. The setting should HOLD THE STAGE for light to land. Mid to tight framing — NOT wide panorama. Marc Adamus / Galen Rowell caliber gallery-print sacred-light photography.

Each entry MUST establish:
- A natural setting WHERE light can land dramatically
- Mid/tight framing (close-up to medium, NEVER ultra-wide panorama)
- OBSERVATIONAL POV — viewer is OUTSIDE the scene looking at it, NEVER inside walking through
- Visible sky / horizon / depth for light to come from
- Natural setting only — NEVER architecture or man-made

━━━ CRITICAL POV RULE — OBSERVATIONAL, NEVER EXPLORER-PHOTOGRAPHER ━━━

Flux's training data for sacred-light landscape photography is HEAVILY contaminated with shots that include HUMAN FIGURES FOR SCALE — Galen Rowell, Marc Adamus, Peter Lik routinely insert hikers/climbers as scale-provers. Even with "no humans" suffix, certain SUBJECT GEOMETRIES still trigger human bleed.

✗ FORBIDDEN explorer-photographer geometries (trigger human bleed):
- "forest interior with trunks rising"
- "wide-spaced trunks rising from shadow"
- "old-growth interior" / "forest interior"
- "corridor of sky" through trees / canopy
- "narrow trail" / "winding trail" through forest
- "cirque basin / narrow spine catching light" (Marc-Adamus signature shot — almost always has a figure)
- "ridgecrest with valley dropping below" + tight framing (climber shot)
- "alpine traverse" / "moraine corridor"
- "interior cathedral grove"
- ANY framing that puts the viewer INSIDE the natural feature looking through it

✓ REQUIRED observational framings (safe — viewer OUTSIDE the scene):
- "old-growth forest crown viewed from an elevated vantage, tall conifer crowns extending into deep distance"
- "tall forest treetops silhouetted at the foreground edge with mountains visible beyond"
- "alpine peak silhouetted at the deep distance horizon, foreground in cool shadow"
- "a ridgeline of jagged peaks at the deep distance with a misty valley between"
- "a snow-capped peak rising at the deep distance horizon"
- "a glaciated alpine valley with peaks at the horizon"
- "a misty lake with cypress trees on the far shore reflected in still water"
- "a coastal cliff edge with the sea horizon extending into deep distance"
- "a sea-stack rising vertically from the surf with the horizon extending behind"
- "a meadow OPENING in a forest, surrounding trees silhouetted along the foreground edges"

The key shift: from "viewer is INSIDE the forest / canyon / cirque" to "viewer is OUTSIDE observing the feature in the distance".

━━━ ABSOLUTELY BANNED ━━━

NEVER include:
- Architecture (no cathedrals / chapels / monasteries / ruins / altars / stained-glass / lighthouses)
- Explorer-photographer geometry (see FORBIDDEN list above)
- "Single beam / single shaft / single column of light"
- "Bioluminescent / phosphorescent / glowing fungi / firefly pillar"
- "Magical / mystical / ethereal / otherworldly" framing
- Place names (no "Sequoia" / "Yosemite" / "Iceland" — generic morphology only)
- Lighting words (no godrays / dappled / amber — that's the lighting axis)
- Atmospheric words (no mist / steam — atmosphere axis)
- Sky-content (no specific cloud / sun — sky_layer axis)
- Specific mineral colors
- Focal-anchor elements (no tree / waterfall as primary — that's reused EPIC_VISTA_HERO_FEATURE)
- Humans / scale figures
- Animals as primary subject
- Sci-fi / fantasy / glow-magic

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one setting description, 18-32 words.

━━━ SUBJECT CATEGORIES (rotate aggressively — all observational) ━━━

ALPINE / MOUNTAIN (~30%):
- A single snow-capped alpine peak rising at the deep distance horizon
- A ridgeline of jagged peaks at the deep distance with intervening valleys in shadow
- A snow-capped peak silhouetted against the sky, foreground in cool shadow
- A glaciated alpine valley with the peak crown at the deep horizon
- A windswept alpine ridge crown silhouetted in the upper frame
- A jagged silhouetted alpine massif at the deep distance horizon

FOREST FROM ABOVE / EXTERIOR (~25%):
- An old-growth forest CROWN viewed from an elevated foreground vantage, tall conifer crowns extending into the distance
- Tall forest treetops silhouetted along the foreground edge with mountains visible beyond
- A misty forest valley extending into deep distance, conifer crowns layered with morning fog between
- A pine forest edge with tall crowns silhouetted along the upper frame, sky visible above
- A redwood / sequoia grove CANOPY viewed from elevated vantage, mature crowns extending into deep distance
- A meadow OPENING within a forest, surrounding trees silhouetted along the foreground edges
- A forest crown horizon line with mountains rising beyond

DESERT / ARID (~15%):
- A single sandstone mesa at the deep distance horizon
- A weathered sandstone ridge silhouetted against the sky, foreground in cool shadow
- A desert plain with a layered mesa at the horizon
- A juniper-dotted sandstone bench at the deep distance with the wider valley extending behind
- A high-desert plain with weathered buttes silhouetted at the horizon

COASTAL (~10%):
- A coastal cliff edge with the sea horizon extending into deep distance
- A rocky headland silhouetted against a vast sea horizon
- A sea-stack rising vertically from the surf with the horizon extending behind
- A coastal cliff face silhouetted in profile with the sea horizon beyond

LAKESIDE / VALLEY (~10%):
- A misty lake with cypress trees on the far shore reflected in still water
- A mountain valley with a single peak rising at the deep distance horizon
- A glacial tarn at the base of a cirque with peaks at the horizon (viewed from across the tarn, not inside the cirque)
- A still alpine lake with reflective surface and the surrounding peaks at the deep distance

WINTER / SNOW (~10%):
- A snow-covered alpine peak crown at the deep distance horizon
- A winter forest crown horizon viewed from above, snow-laden conifers layered into distance
- A frozen alpine tarn with the surrounding ridges silhouetted at the horizon
- A snow-covered ridge crown silhouetted in the upper frame

━━━ EXAMPLES ━━━

✓ "A single snow-capped alpine peak rising at the deep distance horizon, the foreground in cool shadow, mid-tight framing"

✓ "An old-growth forest crown viewed from an elevated foreground vantage, tall conifer crowns extending into deep distance"

✓ "A ridgeline of jagged peaks at the deep distance with intervening valleys in cool shadow, the highest crown silhouetted at the horizon"

✓ "A misty lake with cypress trees on the far shore reflected in still water, the cypress crowns silhouetted in the upper frame"

✓ "A weathered sandstone mesa silhouetted against the sky at the deep distance horizon"

✓ "A redwood grove canopy viewed from elevated vantage, mature crowns extending into deep distance, distant mountain silhouettes beyond"

✓ "A windswept alpine ridge crown silhouetted against the open sky in the upper frame"

✓ "A misty forest valley extending into deep distance, conifer crowns layered with morning fog between"

✓ "A coastal cliff edge with the sea horizon extending into deep distance, the cliff silhouetted against the open sky"

✓ "A meadow opening within a forest, surrounding trees silhouetted along the foreground edges, sky visible above"

✓ "A high-desert plain with weathered buttes silhouetted at the horizon, foreground in cool shadow"

✓ "A snow-capped peak silhouetted against the sky, foreground in cool shadow"

✗ BAD — explorer-photographer: "Forest interior with wide-spaced trunks rising from cool shadow, corridor of sky above" (BANNED — say "forest crown viewed from elevated vantage")
✗ BAD — climber-photographer: "Tight on a narrow alpine spine with cirque basin dropping below" (BANNED — say "snow-capped peak silhouetted at deep distance horizon")
✗ BAD — architecture: "An abandoned cathedral with shafts of light through broken roof" (BANNED — natural only)
✗ BAD — beam-language: "A single sunbeam piercing the forest canopy" (BANNED — that's lighting axis register)
✗ BAD — bioluminescent: "A forest carpeted with bioluminescent fungi" (BANNED — sci-fi)
✗ BAD — named place: "Yosemite Valley with Half Dome" (BANNED — generic only)

━━━ FRAMING DISTRIBUTION ━━━

ALL entries mid to tight framing. NEVER wide panorama. ALL observational POV (viewer outside the scene). NEVER explorer-photographer geometry.

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Specific natural setting primed for light drama. Mid/tight framing. Observational POV only. No architecture. No named places. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
