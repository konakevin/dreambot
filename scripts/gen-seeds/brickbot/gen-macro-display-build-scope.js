#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_BUILD_SCOPE — the scale + organizational signature
 * of the complete-diorama build. Audit 2026-06-05: existing 18 entries —
 * undersized. Target 200.
 *
 * Each entry describes HOW the build is organized (multi-zone modular /
 * vertical-tiered / cutaway / micro-scale / GBC-functional / island-on-a-
 * baseplate / etc.) — the ambition signature that reads "this is a serious
 * AFOL Best-of-Show MOC."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_build_scope.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} BUILD-SCOPE entries for BrickBot's macro-display path — the scale + organizational signature of an AFOL convention COMPLETE-DIORAMA brick build (HOW the build is organized: modular / vertical-tiered / cutaway / micro-scale / GBC-functional / panorama / interconnected modules / island-on-a-baseplate / split-level / radial). Each entry is ONE 22-35 word sentence describing the build's structural ambition.

━━━ THE BAR ━━━
Every entry must name a SPECIFIC organizational structure (multi-zone modular layout / vertical-tiered tower / wide-landscape panorama / cutaway cross-section / dense micro-scale / GBC-functional / interconnected modular-streetscape / island-on-a-baseplate / split-level upper-and-under / radial / circular / hub-and-spoke / linear / tier-stepped) PLUS the specific scope detail (number of baseplates, brick levels, zones, modules). Make the ambition LEGIBLE.

━━━ VARIETY MANDATE (distribute roughly across these organizational scopes) ━━━
- ~4 MULTI-ZONE MODULAR LAYOUT — multiple distinct districts (4-8 baseplates) each a coherent zone (harbor / market / fortress / etc.)
- ~3 VERTICAL-TIERED TOWER — climbing brick levels (8-15+) in a narrow footprint, each tier fully dressed
- ~3 WIDE-LANDSCAPE PANORAMA — low + broad across multiple baseplates, distant horizon line
- ~3 CUTAWAY CROSS-SECTION REVEAL — slicing a ship / building / submarine / station bow-to-stern, internal floors visible
- ~3 DENSE MICRO-SCALE CITY — thousands of micro-studs compressing a metropolis onto 1-2 baseplates
- ~2 GBC-FUNCTIONAL WORKING-BUILD — moving mechanism chain (waterwheel / lift / coaster / conveyor) as centerpiece
- ~2 INTERCONNECTED MODULAR-STREETSCAPE — town-buildings slotted into one continuous avenue, each floor furnished
- ~2 ISLAND-ON-A-BASEPLATE — self-contained world (interior peak + ringing shore) lifting free on one baseplate
- ~2 SPLIT-LEVEL UPPER-AND-UNDER — surface world above + sewer / vault / mine / cave below in one footprint
- ~2 RADIAL HUB-AND-SPOKE — central feature (cathedral / capitol / temple / well) + districts radiating outward
- ~2 PANEL-DIORAMA / SHADOWBOX — built as a deep narrative panel (1-2 baseplates deep) viewed head-on like a tableau
- ~1 LINEAR-RIVERWALK — long thin build following a river / canal / road across multiple baseplates
- ~1 SPHERICAL / DOMED — sealed micro-world (snow-globe / dome / vivarium) viewed from outside
- ~1 ROTATING TURNTABLE — built on a turntable so multiple faces reveal in sequence
- ~1 TIERED CASCADING — terraced descending tiers (rice-paddy / mountain-village / waterfall city)
- ~1 NESTED FOREGROUND-MID-BACK — strict triple-layer staging (foreground tableau / mid-build hero / back panoramic skyline)

━━━ FORMAT ━━━
Each entry: ONE 22-35 word sentence in present tense / participle phrasing. Lead with the scope name + structural detail (number of baseplates, levels, modules) + specific theme example so Flux has a concrete scene to render. Touchpoint examples:
"A sprawling multi-zone modular layout across six baseplates — harbour, bazaar, farmland, and fortress each a dense self-contained district, the whole reading as one coherent brick nation."
"A vertical-tiered tower-build climbing fifteen brick levels — dungeon base, merchant floors, guild hall, battlements — each tier fully dressed and visible in a narrow footprint."
"A cutaway-cross-section reveal slicing a galleon stem to stern — gun-decks, cargo hold, captain's cabin, and rigging all layered and legible in one dramatic display face."
"A GBC-functional working-build where a waterwheel drives a grain-lift drives a minecart loop, the mechanical chain the centrepiece across three interconnected functional modules."

━━━ BANS ━━━
- NO photoreal language
- NO single-figure builds — every scope is a COMPLETE-WORLD diorama
- NO bland descriptors ("a big build") — name the structural organization + count + theme
- NO motion blur language
- NO tilt-shift / shallow DOF
- NO "miniature" as a quality descriptor — describe scale via baseplate count / brick-level / module count

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
