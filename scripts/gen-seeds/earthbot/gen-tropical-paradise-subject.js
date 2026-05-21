#!/usr/bin/env node
/**
 * EarthBot tropical-paradise — SUBJECT axis (biome-tagged paradise coast).
 *
 * Identity: PARADISE COAST — palm-fringed white-sand crescent beaches /
 * turquoise lagoons / coral atolls / reef edges / Polynesian motu /
 * Indian Ocean island coves / Caribbean cays / Whitsundays-style silica
 * sand / Hawaiian green-sand and pink-sand beaches. The "Maldives /
 * Bora Bora / Bali / Whitsundays / Seychelles" tropical-dream-vacation
 * coast register. Sister to coastal-vista (DRAMATIC craggy cliff coast).
 *
 * Same clone pattern as coastal-vista. Reuses EARTHBOT_EPIC_VISTA
 * archetype + 5 shared pools. Bespoke subject pool only. batch=15 from
 * the start (avoid the token-cap issue at batch=25).
 *
 * No tourist names per LESSON 7. No human-built features per LESSON 8
 * (NO overwater bungalows / NO thatched huts / NO piers / NO docks /
 * NO boardwalks / NO beach umbrellas / NO chairs).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/tropical_paradise_subject.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot tropical-paradise — each entry describes ONE tropical-paradise coast scene at fine-art gallery-print tier. PARADISE coast (palms, turquoise water, white sand, lagoon, coral atoll). NOT dramatic craggy cliff coast (that's a different path). The "I want to BE there" tropical-dream-vacation feel.

━━━ THE BAR — TROPICAL PARADISE WALLPAPER TIER ━━━

The wallpaper-worthy tropical coast that makes the viewer want to book a flight. Wide horizon-stretching turquoise lagoon / palm-fringed white-sand crescent / coral atoll ring / reef-edge shallows / volcanic-jungle-meets-paradise-beach. Saturated tropical color (turquoise / aquamarine / cobalt / white sand / lime palm / scarlet hibiscus accent). Marc-Adamus / Iurie-Belegurschi / Daniel-Kordan / Albert-Dros gallery-print register.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<paradise-coast scene, 25-40 words, POV-led, no tourist names, no structures>" }

Biome tag vocabulary (use ONLY these — pick 1-2 per entry):
- "coastal-tropical" — PRIMARY tag (palm-fringed warm-water beach / lagoon / coral atoll / reef edge)
- "tropical-jungle" — paradise-coast meeting tropical jungle (Hawaiian palm-jungle shore / Bali jungle-beach)
- "volcanic" — paradise coast on volcanic island (Hawaii / Tahiti / Galápagos / Bali volcanic-jungle-beach)

━━━ HARD BANS — NO TOURIST NAMES (LESSON 7) ━━━

NEVER include in any entry:
- Famous tropical landmark / island names: "Bora Bora" / "Maldives" / "Bali" / "Tahiti" / "Whitsunday Islands" / "Seychelles" / "Mauritius" / "Phi Phi" / "Maya Bay" / "Pipa" / "Lanikai" / "Hanauma Bay" / "Lord Howe" — strip all
- Famous reef / atoll / beach names: "Great Barrier Reef" / "Tuamotu" / "Whitehaven Beach" / "Pink Sands Beach" / "Anse Source d'Argent"
- Specific resort / region brand names

ALLOWED — broad regional anchors (sparingly): "Polynesian volcanic-island coast" / "Indian Ocean atoll" / "Caribbean cay" / "Hawaiian volcanic-shore" / "Indonesian volcanic-jungle beach" / "Australian Coral Sea reef edge" / "Pacific tropical island coast" / "Philippine archipelago"

━━━ HARD BANS — NO HUMAN-BUILT FEATURES (LESSON 8) ━━━

NEVER include these structure-trigger words (Flux inserts them unprompted on tropical beach prompts — overwater-bungalow-with-thatched-roof is the dominant Flux training prototype for "Maldives" / "Bora Bora"):
- "overwater bungalow" / "thatched hut" / "thatch-roofed" / "tiki bar" / "resort"
- "boardwalk" / "wooden pier" / "dock" / "jetty" / "rope bridge"
- "beach umbrella" / "lounge chair" / "deck chair" / "sun-lounger" / "cabana" / "pavilion"
- "lighthouse" / "fishing pier" / "boathouse"
- "trail" / "path" / "boardwalk-path"
- "fence post" / "kayak rack" / "any chairs / tables / human-built fixtures"

The render is RAW UNINHABITED paradise coast — no civilization, no resort, no person, no human-built feature anywhere.

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 25-40 words. Structure (drama-led + POV-led):

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "Aerial drone perspective over..." / "Low POV from the surf-line looking across..." / "Wide-angle wrapping a crescent lagoon of..." / "Looking along the curve of..." / "Side-on at sea level across..." / "Cliff-edge looking down into a turquoise lagoon of..."
2. LEAD paradise-coast vocabulary: turquoise / aquamarine / cobalt-deep-water / mirror-still-lagoon / palm-fringed / coral-cay / atoll-ring / reef-edge / silica-white / pink-sand / lime-coconut-canopy / crescent-bay
3. NAME specific paradise-coast features: silica white-sand crescent / coral atoll ring / palm-fringed coconut-grove headland / volcanic-jungle-meets-paradise-beach / mangrove channel into open lagoon / reef-edge shallows
4. ADD scale + color anchor: seven-kilometer crescent / hundred-meter-wide reef shelf / mile-long atoll arc / turquoise gradient through cobalt to ultramarine / saturated-aquamarine clarity
5. ADD natural-only tropical accents: bent palm leaning over the surf / coconut-cluster crowns / wave-polished volcanic-black-sand beach / hibiscus and frangipani trees fringing the inland margin / coral debris and conch shells at the water's edge / driftwood pearl-grey bleached / mangrove stilt-roots

WHAT TO EXCLUDE (other axes):
- NO weather, NO lighting / time-of-day, NO optical phenomena, NO atmospheric particulate
- NO sky description, NO wildlife
- BUT YES water-surface character (mirror-still / lapping / reef-rippled / wave-pummeled) and sand/coral material

━━━ EXAMPLES (study format — paradise tier, no tourist names, no structures) ━━━

✓ { "tags": ["coastal-tropical"], "description": "Aerial drone perspective over a Polynesian volcanic-island lagoon, turquoise gradient through cobalt to ultramarine, reef shelf encircling the basin in coral-cream halo, palm-fringed white-sand crescent at the inner shore, volcanic ridge rising behind" }

✓ { "tags": ["coastal-tropical"], "description": "Wide-angle wrapping a seven-kilometer silica white-sand crescent beach of Indian Ocean atoll, mirror-still aquamarine lagoon stretching to the reef-edge horizon, bent coconut palms leaning over the inland margin" }

✓ { "tags": ["coastal-tropical", "tropical-jungle"], "description": "Low POV from the surf-line across a Hawaiian palm-jungle beach, lime-coconut canopy hanging over white sand, scarlet hibiscus trees at the inland fringe, turquoise lagoon stretching to a distant volcanic headland" }

✓ { "tags": ["coastal-tropical"], "description": "Aerial wrapping a Caribbean coral-cay arc, hundred-meter-wide reef shelf in saturated aquamarine clarity, white-sand cay rising in a crescent above the shallows, scattered coral patches and turtle-grass beds visible through the water" }

✓ { "tags": ["volcanic", "coastal-tropical"], "description": "Wide-angle at a Hawaiian green-sand beach pocket, olivine-rich olive-green sand crescent cradled in a volcanic cinder-cone amphitheater, cobalt Pacific surf pounding the shore, lava-rock buttresses fringing the inland margin" }

✓ { "tags": ["coastal-tropical"], "description": "Looking along the curve of a Polynesian motu, palm-fringed coral-rubble islet stretching half a kilometer through a lagoon, turquoise gradient through ultramarine to cobalt, distant volcanic peak rising beyond the reef" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Cliff-edge looking down into a turquoise volcanic-lagoon pocket, hundred-meter cliffs of basalt and red-rock fringing the basin, hidden white-sand cove at the inner shore, coral-rubble shallows fading to cobalt" }

✓ { "tags": ["coastal-tropical"], "description": "Side-on at sea-level across a Pacific atoll lagoon at low tide, mirror-aquamarine water with exposed coral-rubble shoals, palm-fringed inner island in the distance, scattered conch and triton shells at the foreground sand line" }

✓ { "tags": ["tropical-jungle", "coastal-tropical"], "description": "Wide-angle at a Bornean tropical-coast estuary, mangrove stilt-root colonnade rising from black tidal mud at the river mouth, turquoise lagoon beyond, palm-fringed shore on the far bank" }

✓ { "tags": ["coastal-tropical"], "description": "Aerial perspective wrapping a Philippine archipelago double-bay, two crescent white-sand beaches separated by a palm-fringed headland, turquoise lagoon on each side fading to cobalt, distant limestone karst pinnacles in the haze" }

✗ BAD — tourist landmark: "Maldives overwater bungalow..." (BANNED LESSON 7 + LESSON 8)
✗ BAD — structures: "Thatched-roof resort hut at the beach edge" (BANNED LESSON 8)
✗ BAD — boardwalk: "Wooden boardwalk over the lagoon" (BANNED LESSON 8)
✗ BAD — beach chair: "Lounge chair under a palm" (BANNED LESSON 8)
✗ BAD — adds weather: "Beach at sunset with godrays" (sunset/godrays are other axes)
✗ BAD — too craggy: "Sheer basalt sea cliffs plunging into Atlantic" (that's coastal-vista — this is PARADISE coast)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

- ~25% Polynesian / Pacific atoll (motu / lagoon / coral atoll / palm-fringed cay)
- ~20% Hawaiian / Caribbean palm-coast beach (white-sand crescent + palm + lagoon)
- ~15% Indonesian / Indian Ocean volcanic-jungle-beach (jungle + paradise-beach edge)
- ~10% Philippine / Thai karst-paradise (limestone karst pinnacles rising from turquoise water)
- ~10% Australian / Coral-Sea reef-edge (continental reef shelf + turquoise + sand-island)
- ~10% Hawaiian green-sand / pink-sand / black-sand specialty beach
- ~5% Mangrove estuary / tropical river-mouth (mangrove + lagoon edge)
- ~5% Volcanic-jungle island ridge view (aerial over volcanic island + reef + beach)

Each entry distinct in geology + region + POV + scale anchor. Tropical-paradise is the PARADISE register — NOT dramatic craggy cliff (that's coastal-vista).

━━━ HARD BANS (final) ━━━

- NO tourist landmark names (Bora Bora / Maldives / Bali / etc.)
- NO human-built features (LESSON 8 ban list — especially overwater bungalow / thatched hut)
- NO weather / lighting / atmospheric / phenomenon language
- NO sci-fi / fantasy / magical / mystical
- NO humans
- NO craggy-cliff-coast subjects (those go in coastal-vista — this is paradise)
- NO bioluminescent / glowing anything

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led tropical-paradise coast scenes, POV-cued, no tourist names, no structures. No preamble, no markdown code fences, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
