#!/usr/bin/env node
/**
 * EarthBot national-parks — SUBJECT axis (R1 drama-led rewrite, 2026-05-20).
 *
 * R0 lesson: tourist-vantage names + famous park names triggered Flux's
 * stock-tourist-photo pigeonholing. Sonnet output prompts were gorgeous
 * but Flux ignored the drama and rendered classic tourist-snapshot
 * prototypes. Playbook LESSON 7: strip tourist-coded vocabulary entirely;
 * lead with dramatic geological description; let the curated POOL CONTENT
 * (US-Park-style geology) make the path identity rather than the prose
 * naming the parks.
 *
 * Path identity is preserved by WHICH geology types appear in the pool
 * (sandstone arches, sequoia cathedrals, geothermal cobalt pools, granite
 * spires, slot canyons, alkali flats, glaciated peaks of the American
 * Cordillera — content typical of US National Parks). The PROSE describes
 * them in pure drama-vocabulary without naming the tourist vantage.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/national_parks_subject.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot national-parks — each entry describes ONE dramatic geological scene typical of the American National Park system. The seed pool's content (which geology appears) IS the path identity. The prose must NOT name the parks or tourist viewpoints — let beautiful descriptive geology do the work.

━━━ THE BAR ━━━

Drama-led dramatic geological description. Each entry reads like the opening sentence of a Marc Adamus / Peter Lik fine-art landscape book caption — lush sensory language, scale-impact vocabulary, palette-specific. Anti-tourist-photo register: the viewer should think "I want to be there" without recognizing it as a stock-photo location.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<dramatic geological description, 20-35 words, NO tourist names>" }

Biome tag vocabulary (use ONLY these 8 values — pick 1-3 per entry):
- "alpine" — high mountain peaks, granite, snow/ice fringe, treeline
- "arctic-polar" — true polar ice, polar ocean, tundra
- "desert" — sand dunes, sandstone canyons, badlands, dry plateau
- "coastal-temperate" — cool sea cliffs, fjord, basalt coast
- "coastal-tropical" — palm beach, reef coast, mangrove
- "temperate-forest" — old-growth conifer, redwood, deciduous
- "tropical-jungle" — true tropical rainforest
- "volcanic" — fresh lava, ash, geothermal, caldera

━━━ HARD BANS — NO TOURIST-CODED VOCABULARY ━━━

These trigger Flux's stock-tourist-photo pigeonholing. NEVER include in any entry:

**Tourist viewpoint/vantage names:** Tunnel View / Mather Point / Inspiration Point / Glacier Point / Artist Point / Watchman Overlook / Mt Carmel / Cadillac Mountain summit / Tipsoo Lake / Schwabacher Landing / Painted Wall Overlook / Sliding Sands / Avenue of the Giants / any "X Overlook" / "X Vista" / "X Point" / "X View" / "X Landing" / "X Drive" / "X Trail" — these are stock-photo labels in Flux's training data.

**Famous landmark names with iconic single-shot training data:** Half Dome / El Capitan / Delicate Arch / Mesa Arch / Landscape Arch / The Watchman / Wizard Island / Old Faithful / Grand Prismatic / Bridalveil Fall / Yosemite Falls / Cathedral Rock / Devil's Tower / Cathedral Spires / Towers of the Virgin / Court of the Patriarchs / Three Brothers / Hidden Lake — Flux defaults to its prototype tourist shot of each.

**Famous PARK names:** Yosemite / Bryce / Grand Canyon / Yellowstone / Glacier / Zion / Arches / Canyonlands / Capitol Reef / Crater Lake / Acadia / Olympic / Denali / Mt Rainier / Mt St Helens / Hawaii Volcanoes / Mammoth / Carlsbad / White Sands / Joshua Tree / Big Bend / Sequoia / Kings Canyon / North Cascades / Redwood / Great Smoky / Shenandoah — DO NOT NAME THE PARK.

**Specific feature names with iconic photos:** Grand Teton / Mount Rainier (as a name) / St. Elias / Denali (as a name) — describe the peak's character, not its name.

━━━ ALLOWED — broad regional anchors (use sparingly, only when needed for context) ━━━

When a broad regional anchor adds geological precision without triggering stock-photo bias:
- "American Southwest" / "Colorado Plateau" / "Sierra Nevada" / "Cascade Range" / "Northern Rockies" / "Pacific Northwest old-growth" / "Sonoran Desert" / "Mojave" / "Appalachian" / "Hawaiian volcanic shield" / "Alaskan boreal" / "Yellowstone Plateau" (acceptable since geothermal-specific)

These are broad enough that Flux's training data doesn't have a single iconic prototype. Use AT MOST one per entry.

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 25-40 words. ONE specific dramatic geological scene. Structure (push drama density HARD):

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "low POV looking up at..." / "aerial drone perspective over..." / "wide-angle wrapping the basin of..." / "cliff-edge vantage looking down into..." / "side-on across the abyss at..." / "looking straight down the throat of..." / "from the floor of..."
   Pick the most dramatic possible POV for the geology. The COMPOSITION lands the wow.
2. LEAD geological-drama vocabulary: vertigo-inducing / vertiginous / abyssal / razor-edge / knife-edge / cathedral-vertical / monumental / cascading / plunging / razor-cut / impossibly-cobalt / continent-scale / sky-piercing / catastrophic / scoured / fractured / sculpted
3. NAME the SPECIFIC formation + material: vermilion sandstone hoodoo amphitheater / cathedral-tall sequoia grove / cobalt thermal pool with rust-orange mineral apron / glaciated stratovolcano cone / banded sandstone slot / hexagonal basalt column wall
4. ADD scale anchor with concrete physical specificity: thousand-foot sheer vertical / mile-deep / two-thousand-meter granite face / continent-scale / six-thousand-foot strata depth
5. ADD sensory/directional/action specificity: wind-scoured north faces / sun-baked south flank / cold-air-bitten east aspect / east-flowing cascade / west-tilted ridge-line / iron-stained / glacier-polished / lava-blackened / spray-soaked

WHAT TO EXCLUDE (these belong to OTHER axes):
- NO weather, NO lighting / time-of-day, NO optical phenomena, NO atmospheric particulate (these come from atmosphere/sky/phenomenon axes)
- NO sky description, NO wildlife (those are other axes)
- BUT YES sensory geological-character (wind-scoured, glacier-polished, sun-baked — these describe the SURFACE not weather)

━━━ EXAMPLES (study format + POV-led + drama-dense prose) ━━━

✓ { "tags": ["desert"], "description": "Aerial drone perspective wrapping a vertigo-inducing vermilion sandstone hoodoo amphitheater, thousand-foot cathedral spires packed in razor-edge tiered ranks, sun-baked rust-orange and cream banded strata spiraling abyssal into the labyrinth floor below" }

✓ { "tags": ["alpine", "temperate-forest"], "description": "Low POV looking up at a glacier-polished monolithic three-thousand-foot granite face dominating the south wall of a glacier-carved valley, knife-edge ribbon waterfall cascading from a hanging valley, ancient sequoia colonizing the talus floor" }

✓ { "tags": ["volcanic", "alpine"], "description": "Cliff-edge vantage looking down into an impossibly cobalt hundred-meter thermal pool, mineral-mat apron radiating full-spectrum rust-orange and cream-white silica terraces outward in razor-cut rings, lodgepole forest fringe at distance" }

✓ { "tags": ["desert"], "description": "Wide-angle wrapping a freestanding sixty-five-foot rust-orange Entrada sandstone arch from low POV, slickrock amphitheater sun-baked sienna pulling the eye through the frame, abyssal-blue mountain range silhouetted continent-scale at horizon" }

✓ { "tags": ["alpine", "volcanic"], "description": "Side-on across a mirror-clear alpine tarn at the foot of a fourteen-thousand-foot glaciated stratovolcano cone, sky-piercing summit razor-cut against the horizon, lupine and paintbrush colonizing the wind-scoured foreground basin" }

✓ { "tags": ["temperate-forest"], "description": "Looking straight up through a cathedral big-leaf maple grove with twelve-foot moss curtains hanging vertical from every branch, glacier-polished bedrock fern understory carpeting in emerald, deep filtered jade light wrapping the trunks" }

✓ { "tags": ["volcanic"], "description": "Aerial vantage over a two-thousand-foot-deep cobalt caldera lake of impossibly-saturated clarity, dark cinder-cone island emerging defiant from the center, twenty-six-hundred-foot pumice cliffs cathedral-vertical ringing the basin in razor-cut symmetry" }

✓ { "tags": ["desert"], "description": "Knee-level POV across continent-scale gypsum dune field of pure cream-white selenite ridges undulating in cathedral wave-forms toward a vanishing horizon, wind-scoured interdune hollows exposing bare crystalline crust" }

✓ { "tags": ["coastal-temperate"], "description": "Low POV from the surf-line looking up at a fifteen-hundred-foot pink granite dome rising sheer from cold Atlantic coast, glacier-polished exfoliation sheets sweeping the dome face, krummholz spruce gripping the wind-scoured rim" }

✓ { "tags": ["volcanic", "coastal-tropical"], "description": "Side-on at sea-level where fresh basalt lava flow meets open ocean, white steam plume erupting catastrophic where pahoehoe pours into the surf, hardened glassy crust of recent flows fractured in razor-cut chunks at the foreground edge" }

✗ BAD — names park: "Bryce Canyon Amphitheater..." (BANNED — strip "Bryce Canyon")
✗ BAD — names vantage: "Yosemite Tunnel View..." (BANNED — strip "Tunnel View")
✗ BAD — names landmark: "Half Dome at sunset..." (BANNED — strip "Half Dome")
✗ BAD — pure factual: "8,000-foot peak at 47°N 121°W" (boring — needs drama vocabulary)
✗ BAD — adds weather/light: "Sandstone canyon at sunset with godrays" (sunset/godrays are other axes)
✗ BAD — adds wildlife: "Valley with elk herd grazing" (wildlife is hero_feature axis)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

Spread across the geological-content categories typical of the US National Park system:

- ~25% Desert Southwest geology (sandstone arches / hoodoo amphitheaters / slot canyons / red-rock mesas / cracked clay flats / petrified forests / cinder cones)
- ~20% Sierra/Cascade alpine (granite-carved glacial valleys / dome faces / cascading falls / alpine tarns)
- ~15% Rocky Mountain (knife-edge ridges / glaciated valleys / moraine fields / alpine lakes / aspen-fringed basins)
- ~10% Volcanic / geothermal (thermal pools / lava flows / cinder cones / caldera lakes / geyser basins / fumarole fields)
- ~10% Pacific Northwest temperate forest (old-growth cathedrals / moss-curtained branches / fern carpets / sequoia groves)
- ~8% Eastern temperate (Appalachian ridge vistas / hardwood autumn fire / limestone caves / waterfall-step gorges)
- ~5% Coastal (pink granite headlands / Pacific old-growth shore / tropical reef edges)
- ~5% Far north (glaciated peaks / boreal valleys / muskeg flats / coastal fjords / ice-shelf edges)
- ~2% Tropical (lava-and-jungle / volcanic-island shorelines)

NEVER repeat a geological-type twice in nearly-identical terms — each entry is a distinct geological scene/formation.

━━━ HARD BANS (one more time) ━━━

- NO tourist-vantage names (zero — see ban list above)
- NO famous landmark names (zero)
- NO famous park names (zero — broad regional anchor only if needed)
- NO weather / lighting / atmospheric / phenomenon language
- NO non-US geology (this path is US-Park-style only; no Patagonia, Iceland, Sahara, etc.)
- NO sci-fi / fantasy / magical / mystical descriptors
- NO bioluminescent / phosphorescent anything

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led geological descriptions. No tourist names. No preamble, no markdown code fences, no numbering. Just a clean JSON array starting with [ and ending with ].`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
