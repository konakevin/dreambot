#!/usr/bin/env node
/**
 * EarthBot lush-jungle — SUBJECT axis (biome-tagged tropical rainforest).
 *
 * Identity: tropical-jungle deep rainforest at maximum visual density —
 * Amazon / Borneo / Congo / Daintree / Costa Rica cloud forest / Bali
 * jungle / Hawaiian tropical lowland / Yasuni. Multi-tier waterfalls
 * cascading into emerald pools, dense buttress-root canopies, vine
 * curtains, orchid-laden branches, mist threading through layered green.
 * The "humid wet-warmth I-want-to-step-into-it" rainforest awe.
 *
 * Sister path to deep-forest (temperate). Different visual register —
 * denser canopy, more vines/buttress-roots/orchids/bromeliads, deeper
 * emerald saturation, tropical-coded humidity. No tourist names per
 * playbook LESSON 7 (no "Amazon Basin" / "Daintree NP" / "Bali rice-
 * terrace" / "Costa Rica cloud forest").
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/lush_jungle_subject.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot lush-jungle — each entry describes ONE dramatic tropical rainforest scene at maximum visual density, biome-tagged for cross-axis matching.

━━━ THE BAR ━━━

Drama-led prose, gallery-print tier (Marc Adamus / Iurie Belegurschi / Daniel Kordan caliber). The "humid wet-warmth jungle awe" — buttress-root cathedrals, multi-tier emerald canopy stacking, vine curtains, orchid-laden branches, cascading multi-tier waterfalls into clear emerald pools. The viewer should feel the wet humidity.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<dramatic jungle interior, 25-40 words, POV-led, no tourist names>" }

Biome tag vocabulary (use ONLY these — pick 1-2 per entry):
- "tropical-jungle" — true tropical rainforest (the PRIMARY tag for this path)
- "volcanic" — tropical jungle on volcanic island (Hawaii / Bali / Costa Rica volcanic-jungle)
- "coastal-tropical" — jungle meeting coast (mangrove edge, jungle-cliff at sea, tropical-coast forest fringe)

━━━ HARD BANS — NO TOURIST NAMES ━━━

Per playbook LESSON 7. NEVER include:
- Famous region names: "Amazon Basin" / "Amazon Rainforest" / "Borneo" / "Daintree" / "Costa Rica" / "Bali" / "Yasuni" / "Congo Basin" — strip
- Famous park/reserve names: "Daintree NP" / "Monteverde Cloud Forest" / "Manu NP" / "Iguazu"
- Famous individual landmarks: "Iguazu Falls" / "Mount Roraima" / "Mount Kinabalu"
- Tourist-coded scene labels: "Bali rice terraces" / "Costa Rica jungle lodge view" / etc.

ALLOWED — broad regional anchors used sparingly:
- "South American tropical lowland" / "Southeast Asian dipterocarp" / "Central American cloud forest" / "Polynesian volcanic-jungle" / "Sub-Saharan tropical" — broad enough not to trigger single-stock-photo prototype.

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 25-40 words. Structure:

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "Looking up the buttress-root cathedral of..." / "Wide-angle into the layered canopy of..." / "Aerial drone perspective over a tropical lowland of..." / "Forest-floor POV through vine-curtained..." / "Cliff-edge vantage looking down into a multi-tier waterfall basin of..." / "Looking deep into the orchid-laden depths of..."
2. LEAD drama vocabulary adapted to jungle: cathedral-canopy / vaulted / colossal-buttress / vine-cascading / multi-tier / emerald-saturated / drenched / vertiginous / monumentally-girthed
3. NAME the specific tree/plant or jungle-feature type: "kapok colossus" / "strangler-fig cathedral" / "ceiba buttress-root colonnade" / "dipterocarp emergent" / "fig-strangler vault" / "Bornean dipterocarp" / "Polynesian banyan tangle" / "Central American cloud forest layered understory"
4. ADD scale: "two-hundred-foot emergent canopy" / "thirty-foot buttress roots" / "ten-tier cascading waterfall" / "fifty-foot vine curtains" / "millennia-old strangler"
5. ADD jungle-specific detail: "vine-curtained" / "orchid-laden" / "bromeliad-clustered branch crooks" / "philodendron understory" / "epiphyte-coated trunk" / "mist threading the canopy gap" / "buttress root cathedral fan" / "moss-furred bark" / "humid"

WHAT TO EXCLUDE (other axes):
- NO weather, NO direct lighting time-of-day, NO optical phenomena, NO atmospheric particulate ("mist" can be implied in canopy-gap-light but actual atmospheric quality comes from atmosphere axis)
- NO sky description beyond canopy-gap framing
- NO wildlife (separate axis)
- BUT YES vegetation-character (epiphyte-coated / moss-furred / buttress-rooted — these are SURFACE not weather)

━━━ EXAMPLES (study format) ━━━

✓ { "tags": ["tropical-jungle"], "description": "Looking up the buttress-root cathedral of a kapok colossus, two-hundred-foot emergent crown braided overhead, thirty-foot buttress fanning at the base, orchid-laden side branches reaching outward into the canopy gap" }

✓ { "tags": ["tropical-jungle"], "description": "Wide-angle into the layered canopy of a South American tropical lowland, emergent kapok and ceiba breaking above continuous mid-canopy, philodendron and bromeliad-clustered understory below, vine curtains threading every layer" }

✓ { "tags": ["tropical-jungle"], "description": "Forest-floor POV through vine-curtained ceiba buttress-root colonnade, twenty-foot root fins fanning outward, ground-level rainforest litter carpeted in fallen orchids and leaf-cutter trails" }

✓ { "tags": ["tropical-jungle"], "description": "Cliff-edge vantage looking down into a multi-tier waterfall basin, ten cascading ribbons threading vine-curtained basalt cliffs into emerald-pool stepped layers, dipterocarp canopy fringing the rim" }

✓ { "tags": ["volcanic", "tropical-jungle"], "description": "Aerial drone perspective over a Polynesian volcanic-jungle ridge, basalt spires draped in vine-curtained ohia and tree-fern canopy, deep-cut waterfall valley cleaving the ridge, emerald gradient to the coast" }

✓ { "tags": ["coastal-tropical", "tropical-jungle"], "description": "Looking deep into a mangrove cathedral at low tide, fifty-foot stilt-root colonnade rising from black tidal mud, aerial-root tangles braided overhead, orchid-laden understory in the deep root shadows" }

✓ { "tags": ["tropical-jungle"], "description": "Wide-angle into a strangler-fig vault enveloping an ancient host trunk, hundreds of vine-roots cascading down forty feet from the canopy, hollow inner chamber of root-buttress dappled with filtered green-gold light" }

✓ { "tags": ["tropical-jungle"], "description": "Looking up the colossus of a Southeast Asian dipterocarp emergent, two-hundred-and-fifty feet of crown breaking above the continuous lower canopy, lianas spiraling the trunk, epiphyte-laden branches dripping with moss" }

✓ { "tags": ["tropical-jungle"], "description": "Forest-floor POV across a fern-and-philodendron clearing in deep Central American cloud forest, mist-laden canopy gap admitting filtered light, moss-furred fallen trunk colonized by tree-fern and orchid sapling" }

✓ { "tags": ["volcanic", "tropical-jungle"], "description": "Looking deep into a vine-curtained Hawaiian tropical lowland, lava-rock floor wrapped in moss, ohia and tree-fern colonizing every surface, cathedral-vault canopy braided with epiphyte-laden ohi'a" }

✗ BAD — tourist names: "Amazon Rainforest..." (BANNED — strip)
✗ BAD — landmark: "Iguazu Falls..." (BANNED)
✗ BAD — bioluminescence: "glowing fungi at the trunk base" (BANNED — sci-fi drift)
✗ BAD — adds weather/light: "Jungle at sunset with godrays through mist" (sunset/godrays/mist are other axes)
✗ BAD — temperate species: "Sequoia grove" (this is lush-jungle TROPICAL path; sequoia goes in deep-forest)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

- ~30% South American lowland (kapok / ceiba / fig-strangler / Brazil-nut / dipterocarp-equivalent)
- ~25% Southeast Asian dipterocarp (Bornean / Indonesian / Malay rainforest, with characteristic giant emergents)
- ~15% Central American cloud forest (mossy mid-elevation, mist-laden, epiphyte-dense)
- ~10% Pacific volcanic-jungle (Hawaiian ohi'a / tree-fern / lava-floor jungle)
- ~10% Multi-tier waterfall basin / jungle cenote (vine-curtained waterfall scenes)
- ~5% Mangrove / coastal-jungle edge (stilt-root colonnade, tidal-tropical)
- ~5% African Congo basin (giant emergents, dense understory, gorilla habitat geology — no wildlife)

NEVER repeat a sub-type in nearly identical terms — each entry distinct in species/POV/composition.

━━━ HARD BANS (final) ━━━

- NO tourist names, NO famous-landmark names, NO famous-region names
- NO weather / lighting / atmospheric / phenomenon language
- NO bioluminescent fungi or glowing-anything (sci-fi drift)
- NO temple ruins (legacy mentioned this — BANNED as structures-as-subject)
- NO sci-fi / fantasy / magical / mystical descriptors
- NO humans / hikers / climbers
- NO temperate-forest species (this is tropical only — sequoia, redwood, Doug fir, cedar all belong to deep-forest)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led tropical-jungle interiors, POV-cued, no tourist names. No preamble, no markdown code fences, no numbering. Just a clean JSON array starting with [ and ending with ].`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
