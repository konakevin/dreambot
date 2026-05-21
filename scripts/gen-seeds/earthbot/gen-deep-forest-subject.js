#!/usr/bin/env node
/**
 * EarthBot deep-forest — SUBJECT axis (biome-tagged old-growth temperate
 * forest cathedrals).
 *
 * Identity: old-growth temperate forest at cathedral scale — Pacific NW
 * Douglas fir / Sitka spruce / Western red cedar / Western hemlock /
 * Sequoia / Sierra red fir / Bavarian beech / Black Forest spruce /
 * Japanese cedar / Patagonian Lenga / Tasmanian myrtle. Cathedral
 * canopies, mossy understory, fern-carpet floors, light filtering through
 * trunks. The "real-life Lord of the Rings forest" feeling.
 *
 * No tourist names per LESSON 7 (no "Hoh Rainforest" / "Avenue of Giants" /
 * "Cathedral Grove" / "Redwood NP"). Compositions favor INTERIOR forest
 * vantages (looking up through canopy, into the depths, along the floor)
 * that still play to the 6-axis template's sky/atmosphere/lighting slots
 * — every entry should leave room for canopy gaps where light/sky/atmosphere
 * can render.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/deep_forest_subject.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot deep-forest — each entry describes ONE dramatic old-growth temperate forest scene at cathedral scale, biome-tagged for cross-axis matching.

━━━ THE BAR ━━━

Drama-led prose, gallery-print register (Marc Adamus / Peter Lik / Daniel Kordan caliber). The "real-life Lord of the Rings cathedral forest" feeling — ancient trees rising as columns, vaulted canopies, dense moss/fern understory, depths receding into shadow. Each entry leaves room for canopy gaps where light/atmosphere/sky can render — interior compositions but not pitch-dark caves.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<dramatic forest interior, 25-40 words, POV-led, no tourist names>" }

Biome tag vocabulary (use ONLY these — pick 1-2 per entry):
- "temperate-forest" — old-growth temperate, redwood, cedar, deciduous, mixed conifer (the PRIMARY tag for this path)
- "alpine" — subalpine forest at high elevation, treeline, krummholz, alpine larch
- "coastal-temperate" — coastal old-growth (PNW shore-forest, NZ podocarp coast)
- (NOT tropical-jungle — that's lush-jungle's path; deep-forest is temperate-focused)

━━━ HARD BANS — NO TOURIST NAMES ━━━

Per playbook LESSON 7. NEVER include in any entry:
- Famous forest park names: "Hoh Rainforest" / "Olympic NP" / "Redwood NP" / "Sequoia NP" / "Avenue of the Giants" / "Cathedral Grove" / "Muir Woods" / "Tongass" — strip all
- Famous individual trees: "General Sherman" / "General Grant" / "Hyperion" / "Stratosphere Giant"
- Famous forest trails / waypoints: "Hall of Mosses" / "Trail of Giants" / "Lady Bird Johnson Grove"

ALLOWED — broad regional anchors used sparingly:
- "Pacific Northwest old-growth" / "Sierra mixed-conifer" / "Bavarian beech forest" / "Black Forest spruce" / "Japanese cedar grove" / "Patagonian Lenga" / "Tasmanian myrtle"

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 25-40 words. Structure (drama-led + POV-led):

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "Looking straight up the column of..." / "Wide-angle wrapping a cathedral grove of..." / "Looking deep into the receding depths of..." / "Forest-floor POV across a fern-carpeted clearing of..." / "From the trunk-base looking up through..." / "Cathedral-vault perspective beneath..."
2. LEAD geological-drama vocabulary adapted to forests: cathedral / vaulted / monumental / monolithic / colossal / ancient / primeval / fluted-bark / gnarled / sky-piercing / column-massed / trunk-buttressed
3. NAME the specific tree species + forest type: "Douglas fir cathedral" / "Sitka spruce colonnade" / "Western red cedar vault" / "Sequoia colossus grove" / "Bavarian beech hall" / "Sierra red fir cathedral" / "Western hemlock grove" / "Japanese cedar avenue"
4. ADD scale anchor: "two-hundred-foot trunks" / "three-hundred-foot crowns" / "twenty-foot girth" / "thirty-foot moss curtains" / "millennia-old ancients"
5. ADD understory + canopy-gap detail: fern-bed floor / sword-fern carpet / moss-curtained branches / fallen-log mound colonized by saplings / hemlock-needle litter / canopy-gap letting filtered light reach the floor / understory hardwood layer

WHAT TO EXCLUDE (other axes' content):
- NO weather, NO direct lighting / time-of-day ("dawn" / "sunset" / "golden hour" go in lighting axis), NO optical phenomena, NO atmospheric particulate ("fog" / "mist" go in atmosphere axis)
- NO sky description beyond "canopy gap" framing — actual sky comes from sky_layer axis
- NO wildlife (separate axis)
- BUT YES sensory tree-character (moss-furred / fluted-bark / lichen-streaked / glacier-polished bedrock floor — these describe the SURFACE not weather)

━━━ EXAMPLES (study format) ━━━

✓ { "tags": ["temperate-forest"], "description": "Looking straight up the column of a Douglas fir cathedral, three-hundred-foot ancients rising fluted-bark from a fern-bed floor, canopy vault braided overhead in dappled green, distant trunk-columns receding into deep shadow" }

✓ { "tags": ["temperate-forest"], "description": "Wide-angle wrapping a Western red cedar grove, twenty-foot girth trunks furrowed deep ochre, twelve-foot sword-fern carpet at the base, lichen-streaked side branches reaching outward into the gap-light" }

✓ { "tags": ["temperate-forest"], "description": "Forest-floor POV through a moss-carpeted Sitka spruce colonnade, every trunk wrapped in lime-green Oregon moss, fallen-log bridges over a brown-water creek, hemlock saplings sprouting from nurse-log mounds" }

✓ { "tags": ["temperate-forest"], "description": "Cathedral-vault perspective beneath a sequoia colossus grove, two-thousand-year ancients with thirty-foot diameter trunks, cinnamon-fluted bark reaching skyward, understory of sword fern and dogwood at the base" }

✓ { "tags": ["temperate-forest"], "description": "Looking deep into the receding depths of a primeval Bavarian beech hall, smooth grey trunks rising sixty-feet in dense column formation, autumn-fire copper leaf carpet, mist-thinned canopy gap admitting filtered light" }

✓ { "tags": ["temperate-forest"], "description": "From the trunk-base looking up through a Japanese cedar avenue, hinoki-needle litter floor, two-hundred-foot trunks rising arrow-straight, dense canopy gap braided overhead in shadowed green-gold" }

✓ { "tags": ["alpine", "temperate-forest"], "description": "Wide-angle through a subalpine red fir cathedral at treeline, weathered krummholz at the upper edge, deep needle-litter floor, scattered glacier-polished granite boulders between trunks" }

✓ { "tags": ["temperate-forest"], "description": "Looking up the buttressed trunk of an ancient Western hemlock, moss-furred limbs reaching laterally, sword-fern understory at base, mossy nurse-log to one side colonized by sapling spruce" }

✓ { "tags": ["coastal-temperate", "temperate-forest"], "description": "Wide-angle across a Pacific Northwest coastal grove of Sitka spruce, two-hundred-foot trunks running to a tidal salt-marsh edge, hanging usnea-lichen draperies from every limb, salal understory at the base" }

✓ { "tags": ["temperate-forest"], "description": "Forest-floor POV across a fern-carpeted clearing of Patagonian Lenga beech, smooth pale trunks ringing the clearing edge, lime-green moss veil draping every branch, distant trunk-column receding wall behind" }

✗ BAD — names tourist site: "Hoh Rainforest Hall of Mosses..." (BANNED — strip both)
✗ BAD — sci-fi: "Glowing fungi at the trunk base" (BANNED — playbook lesson 1 BANNED list)
✗ BAD — structures: "Abandoned cabin among ferns" (BANNED — structures-as-subject)
✗ BAD — adds weather/light: "Forest at sunset with godrays through fog" (sunset/godrays/fog are other axes)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

Spread across temperate-forest sub-types:

- ~30% Pacific Northwest old-growth conifer (Douglas fir / Sitka spruce / Western red cedar / Western hemlock / silver fir)
- ~25% Sequoia/Sierra cathedral (sequoia colossus / Sierra red fir / sugar pine / Ponderosa / Jeffrey pine)
- ~15% Coastal redwood (coast redwood / dawn redwood / Pacific coastal stands)
- ~10% European temperate (Bavarian beech / Black Forest spruce / Carpathian beech-fir)
- ~10% Asian temperate (Japanese cedar/hinoki / Korean pine / yakushima cedar / Sakhalin spruce)
- ~5% Southern Hemisphere temperate (Tasmanian myrtle / NZ kauri / Patagonian Lenga)
- ~5% Subalpine / treeline (subalpine red fir / krummholz spruce / alpine larch)

NEVER repeat a sub-type twice in nearly identical terms — each entry is a distinct forest scene with different species/POV/composition.

━━━ HARD BANS (final) ━━━

- NO tourist names, NO famous-tree names, NO famous-trail names
- NO weather / lighting / atmospheric / phenomenon language
- NO glowing/bioluminescent fungi or moss (sci-fi drift)
- NO sci-fi / fantasy / magical / mystical / enchanted descriptors
- NO humans / hikers / climbers / structures
- NO tropical-jungle content (that's lush-jungle's path — this is temperate-forest)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led forest-interior compositions, POV-cued, no tourist names. No preamble, no markdown code fences, no numbering. Just a clean JSON array starting with [ and ending with ].`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
