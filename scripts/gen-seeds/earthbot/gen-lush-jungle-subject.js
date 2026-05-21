#!/usr/bin/env node
/**
 * EarthBot lush-jungle — SUBJECT axis (R1 full tropical-mandate rewrite,
 * 2026-05-20).
 *
 * R0 problem: too tree-architecture-focused (buttress roots / vine vaults).
 * Renders looked like North American forest, not tropical jungle. Kevin's
 * directive: blow it out — Amazon / Congo / Hawaii / Costa Rica jungles
 * with exotic flowers, water features, rock formations, and crazy foliage
 * stacking. Set decoration density.
 *
 * R1 mandates every entry stacks 2-3 of these tropical elements:
 *   1. EXOTIC TREE (buttress-root colossus / strangler-fig / kapok / banyan
 *      / dipterocarp / ohia / palm)
 *   2. TROPICAL FLOWERS (heliconia / bird-of-paradise / hibiscus / frangipani
 *      / orchids / bromeliads / ginger / passion flower / torch lily)
 *   3. WATER FEATURE (cascading waterfall / cenote / clear stream / spring-
 *      fed pool / rapids / mossy creek / jungle pond)
 *   4. ROCK FORMATION (mossy basalt boulder / overgrown limestone / volcanic
 *      cliff face / mossy outcrop / spring-rock terrace)
 *   5. CRAZY FOLIAGE DENSITY (philodendron / monstera / tree fern / palm
 *      fronds / vine curtains / bromeliad-clustered branches / moss carpets)
 *
 * Saturated tropical color vocabulary. Specific tropical regional anchors
 * (Amazon / Congo / Hawaii / Costa Rica / Bali / Borneo) — no famous park
 * names per LESSON 7.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/lush_jungle_subject.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot lush-jungle — each entry MUST scream TROPICAL JUNGLE (Amazon / Congo / Hawaii / Costa Rica / Bali / Borneo) with maximum exotic flora density, water features, rock formations, and tropical flowers. The viewer's reaction: "this can ONLY be a tropical jungle." Not a North American forest. Not a temperate woodland. EXOTIC TROPICAL.

━━━ THE TROPICAL ELEMENT MENU (use as scene-natural, NOT forced stacking) ━━━

Each entry should feel UNAMBIGUOUSLY TROPICAL. Pick the elements that fit the rolled composition naturally — don't force a waterfall into a pure tree-cathedral interior, don't force flowers into a deep-canopy-shadow shot. Variety comes from the COMPOSITION CATEGORY DISTRIBUTION (below) — not from stacking every element into every entry.

1. **EXOTIC TROPICAL TREE** — buttress-root colossus (kapok / ceiba / Brazil-nut) / strangler-fig vault / banyan tangle / dipterocarp emergent / ohia-lehua / mangrove stilt-root / coconut palm / breadfruit / cacao
2. **TROPICAL FLOWERS** — heliconia (red lobster-claw) / bird-of-paradise (orange-and-blue) / hibiscus (scarlet) / frangipani (white-and-yellow) / orchids (purple / white / yellow / pink) / bromeliads (rosette + magenta inflorescence) / torch ginger / passion flower / jade vine / monkey-cup pitcher plant / ghost orchid / vanilla-orchid vines
3. **WATER FEATURE** — cascading multi-tier waterfall into emerald pool / hidden cenote with crystal water / clear jungle stream over mossy stones / spring-fed travertine terrace pool / cascading rapids through buttress-roots / mossy creek with sun-shafts / jungle pond reflecting canopy / volcanic-rock-cradled lagoon
4. **ROCK FORMATION** — mossy basalt boulder cluster / overgrown limestone karst spire / lava-rock floor wrapped in vines / spring-rock travertine terrace / volcanic cliff face dripping ferns / massive moss-furred boulder / volcanic plug fingered by strangler-fig roots
5. **CRAZY FOLIAGE DENSITY** — philodendron-vine curtains / monstera split-leaf canopy / tree-fern frond curtains / palm-frond canopy / vine cascades / bromeliad-clustered branch crooks / moss-furred trunks at every angle / fern carpet floor / epiphyte-laden bark / climbing aroid wrapping every column

Saturated tropical COLOR vocabulary: electric emerald / lime-green / jade / chartreuse / saturated viridian / + ACCENT colors of flowers (magenta heliconia / scarlet hibiscus / white frangipani / golden ginger / electric-blue jade vine).

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<dramatic tropical jungle scene, 30-45 words, POV-led, stacks 2-3 tropical elements>" }

Biome tag vocabulary (use ONLY these — pick 1-2 per entry):
- "tropical-jungle" — PRIMARY tag (Amazon / Congo / Daintree / Borneo / cloud forest)
- "volcanic" — tropical jungle on volcanic island/floor (Hawaii / Bali / Costa Rica volcanic)
- "coastal-tropical" — jungle meeting coast (mangrove / palm-jungle shore / tropical sea cliff)

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 30-45 words. Structure:

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "Looking up the buttress-root cathedral of..." / "Wide-angle through layered canopy of..." / "Forest-floor POV across..." / "Cliff-edge looking down into a cascading waterfall basin of..." / "Aerial drone perspective over..." / "Low POV at the edge of a jungle stream..."
2. STACK 2-3 tropical elements (per the mandate above) — the entry must contain MULTIPLE exotic-tropical features, not just one tree or one waterfall
3. NAME specific tropical species + features (heliconia / kapok / orchid / cenote / etc.)
4. ADD scale anchor + tropical-density adjectives (dense / cathedral / cascading / multi-tier / colossal / vine-curtained / moss-furred / saturated-emerald / electric-green)
5. Include flower-accent colors visible in the scene (scarlet hibiscus / magenta heliconia / golden ginger / white frangipani / etc.)

WHAT TO EXCLUDE (other axes):
- NO weather, NO direct lighting time-of-day, NO optical phenomena, NO atmospheric particulate (mist OK as canopy-gap implication only)
- NO sky beyond canopy-gap framing
- NO wildlife (separate axis)

━━━ EXAMPLES — STUDY THE COMPOSITION CATEGORY EACH ONE HITS ━━━

— INTERIOR JUNGLE (deep-inside, layered depths, no water/flower mandate) —

✓ { "tags": ["tropical-jungle"], "description": "Deep inside the jungle looking through layered canopy depths of Amazonian lowland, trunk-columns receding into chartreuse-shadow, dense philodendron understory carpeting the floor, climbing aroids wrapping every column, vine-curtains threading overhead" }

✓ { "tags": ["tropical-jungle"], "description": "Forest-floor POV through receding trunk-columns of Bornean dipterocarp, two-hundred-foot emergent crowns braided overhead in dense canopy gap, lianas spiraling every column, fern carpet floor in saturated viridian, depth fading to deep emerald shadow" }

✓ { "tags": ["tropical-jungle"], "description": "Wide-angle into the dense interior of Costa Rican cloud forest, layered tree-fern and palm fronds at every level, moss-furred trunks at every angle, dripping epiphyte-laden branches, chartreuse depth receding into mist-laden shadow" }

— FUNKY-TREE CATHEDRAL (buttress-root / strangler-fig / banyan / kapok dominating, no water needed) —

✓ { "tags": ["tropical-jungle"], "description": "Looking up the buttress-root cathedral of a kapok colossus, forty-foot fins fanning at the base, orchid-laden epiphytes draping the side branches, vine cascades threading the canopy gap overhead, chartreuse moss carpet at the foot" }

✓ { "tags": ["tropical-jungle"], "description": "Forest-floor POV at the base of a colossal ceiba buttress, thirty-foot flanged fins radiating like a star, vine-cascades dripping from the upper limbs, fern carpet floor, distant trunk-columns receding into emerald depths" }

✓ { "tags": ["tropical-jungle"], "description": "Looking into the hollow chamber of a strangler-fig vault around an ancient host trunk, hundreds of aerial roots cascading forty feet from the canopy, orchid-laden inner walls, mossy floor, electric-green moss draping every angle" }

✓ { "tags": ["coastal-tropical", "tropical-jungle"], "description": "Wide-angle through a mangrove cathedral at low tide, fifty-foot stilt-root colonnade rising from black tidal mud, aerial-root tangles braided overhead, orchid-laden understory in the deep root shadows" }

✓ { "tags": ["tropical-jungle"], "description": "Looking up a Southeast Asian dipterocarp emergent two-hundred-and-fifty feet to the crown, lianas spiraling the trunk, ghost-orchid vines draping, monstera and philodendron carpeting the floor in chartreuse" }

— WATER FEATURE (waterfall / cenote / stream — with tropical context) —

✓ { "tags": ["tropical-jungle"], "description": "Cliff-edge looking down into a four-tier waterfall cascade through vine-curtained basalt cliffs, emerald-pool stepped layers below, white frangipani trees fringing the rim, monstera split-leaves draping the cliff walls" }

✓ { "tags": ["tropical-jungle"], "description": "Forest-floor POV across a clear jungle stream over mossy basalt stones, kapok and ceiba buttress-roots framing the banks, bromeliad-clustered branches above, magenta torch-ginger and bird-of-paradise heliconia in the foreground" }

✓ { "tags": ["tropical-jungle"], "description": "Low POV at the edge of a hidden cenote, crystal-clear water reflecting the canopy gap, vine-cascades dripping from limestone walls overhead, orchid-laden ledges, philodendron flanking the entrance" }

— FLOWER-DENSE (orchids / heliconia / blooming canopy as primary subject) —

✓ { "tags": ["tropical-jungle"], "description": "Wide-angle into a hanging orchid grove of South American tropical lowland, purple and yellow orchids in dense rosette clusters from every branch, vine-cascades draping every column, chartreuse moss carpet at the floor" }

✓ { "tags": ["tropical-jungle"], "description": "Looking up into a flowering tropical canopy of Hawaiian ohia, scarlet lehua blossoms blazing overhead in dense clusters, twenty-foot tree-fern trunks rising into the gap, orange-and-yellow heliconia at the foot" }

✗ BAD — too temperate: "Sequoia grove" (this is tropical jungle path only)
✗ BAD — adds weather: "Jungle at sunset with godrays" (sunset/godrays are other axes)
✗ BAD — tourist names: "Amazon Rainforest..." (BANNED per LESSON 7)
✗ BAD — generic: "A jungle scene with trees" (every entry must be SPECIFICALLY tropical with named species, named composition cue)
✗ BAD — wrong category proportions: ALL water-features (must hit ~30% INTERIOR + ~30% FUNKY-TREE per distribution)

━━━ COMPOSITION CATEGORY DISTRIBUTION (PRIMARY VARIANCE LEVER) ━━━

This is the most important distribution — it determines what KIND of jungle scene appears. Spread across:

**~30% INTERIOR JUNGLE — deep INSIDE looking through layered canopy depths.** No water needed. No flowers needed. Just dense trunk-columns receding into chartreuse-shadow depths, foliage density all around, layered green canopy braided overhead. The "you're standing in the middle of Amazon / Borneo / Costa Rica jungle" feel. POV cues: "Deep inside the jungle, looking through layered canopy depths of..." / "Forest-floor POV through receding trunk-columns of..." / "Wide-angle into the dense interior of..." / "Looking through dense vine-curtained depths of..."

**~30% FUNKY-TREE CATHEDRAL — buttress-root / strangler-fig / banyan / kapok / ceiba dominating the frame.** Pure tree-architecture interior, exotic flora accents allowed but not required. The "look at this MASSIVE weird-rooted tree" feel — like R0 #2 and #3. POV cues: "Looking up the buttress-root cathedral of..." / "Forest-floor POV at the base of a colossal..." / "Wide-angle wrapping the buttress fan of..." / "Looking into the hollow chamber of a strangler-fig vault around..."

**~25% WATER FEATURE — waterfall / cenote / stream / cascading rapids as scene anchor.** Tropical context still present (vine-curtained cliff walls, jungle canopy fringing, palm fronds, orchid-laden ledges). POV cues: "Cliff-edge looking down into a multi-tier waterfall basin..." / "Low POV at the edge of a hidden cenote..." / "Forest-floor POV across a clear jungle stream over mossy stones..."

**~15% FLOWER-DENSE — orchid grove / heliconia thicket / blooming canopy.** Tropical flowers as primary visual subject, foliage thick around them. POV cues: "Wide-angle into a hanging orchid grove of..." / "Looking up into a flowering tropical canopy of..." / "Forest-floor POV across a heliconia and ginger thicket of..."

REGIONAL ANCHOR (use sparingly, broad regions only): South American tropical lowland / Southeast Asian dipterocarp / Central American cloud forest / Hawaiian volcanic-jungle / Polynesian / Bornean / Costa Rican mixed-forest / Amazonian / Congo basin. Pick the region whose flora/geology fits the rolled composition naturally.

NEVER repeat a sub-type in nearly identical terms — each entry distinct in tree species / POV / stacked elements / flower accents / water feature / rock formation.

━━━ HARD BANS ━━━

- NO tourist names ("Amazon Rainforest" / "Daintree NP" / "Iguazu Falls" / "Monteverde" — banned per LESSON 7)
- NO weather / lighting / atmospheric / phenomenon language
- NO bioluminescent / glowing fungi / phosphorescent anything (sci-fi drift)
- NO temple ruins as subject (banned structures-as-subject — but a moss-overgrown ancient rock can read like geology)
- NO temperate species (sequoia / redwood / Doug fir / cedar — those go in deep-forest)
- NO ALL-WATER bias — must hit ~30% INTERIOR JUNGLE + ~30% FUNKY-TREE CATHEDRAL per the distribution above (water is only ~25% of entries)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led tropical-jungle interiors, POV-cued, 2-3 stacked tropical elements per entry, no tourist names. No preamble, no markdown code fences, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
