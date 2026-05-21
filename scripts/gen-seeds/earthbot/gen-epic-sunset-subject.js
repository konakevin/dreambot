#!/usr/bin/env node
/**
 * EarthBot epic-sunset — SUBJECT axis (R4 strict-beach-only rewrite,
 * 2026-05-21).
 *
 * R3 still produced cliff/cove/rocky-shore renders despite ref-based
 * recipe — Sonnet kept gravitating to "volcanic-rock buttress" / "cove" /
 * "rocky tide-pool" / etc. permitted in the previous recipe. R4 closes
 * those loopholes: ZERO cliffs as primary, ZERO rocky-shore foreground,
 * ZERO coves. ALL entries are FLAT TROPICAL BEACH with palms ON SAND.
 * Volcanic rock only as small accent, never as primary subject.
 *
 * If R4 STILL has coastal drift, the next pass will need bespoke sky /
 * hero_feature pools (the shared epic-vista pools have mammatus /
 * lenticular / wildlife scale-provers that fight the "calm Hawaiian
 * beach" identity).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_sunset_subject.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT entries for EarthBot epic-sunset — each entry describes ONE TROPICAL BEACH SUNSET. NOT a cliff. NOT a cove. NOT a rocky shore. NOT coastal-cliff. A wide FLAT TROPICAL BEACH with palms on sand.

━━━ THE ABSOLUTE RULE — TROPICAL BEACH ONLY ━━━

Every entry is a FLAT WIDE TROPICAL BEACH SUNSET. The foreground is SAND (white, black, or coral). Palms grow on/at the beach. The sky burns sunset. The sea is calm or has gentle shorebreak waves.

THIS IS NOT:
- ❌ A cliff or cliff-fringed bay
- ❌ A rocky shore with boulders as foreground
- ❌ A "cove" or "secret cove" (these render as cliff-walled)
- ❌ A volcanic-rock-buttress foreground subject
- ❌ A canyon or fjord or sea-stack
- ❌ A dramatic-geology coast

THIS IS:
- ✅ A wide flat tropical beach with sand foreground
- ✅ Palms ON the sand or palms fringing the beach
- ✅ Gentle surf or calm lagoon water
- ✅ Tropical sunset sky burning above
- ✅ Hawaii / Costa Rica / Maldives / Bali / Tahiti / Polynesia / Caribbean (broad regions only, no tourist names)

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["coastal-tropical"], "description": "<flat tropical beach sunset, 28-42 words>" }

Every entry has the single tag "coastal-tropical". A second tag of "volcanic" is allowed ONLY for black-sand beaches; "tropical-jungle" allowed ONLY if the inland fringe is jungle (but the foreground is still sand-beach).

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **EXPLICIT FLAT SAND FOREGROUND** — name the sand-beach character (white sand crescent / black volcanic sand crescent / coral-sand atoll beach / palm-fringed white sand). The foreground is SAND, not rock.

2. **PALMS ON OR AT THE BEACH** — palms must be present as silhouettes:
   - "tall coconut palms silhouetted on the inland fringe of the beach"
   - "twin coconut palms silhouetted at frame edges arching over the beach"
   - "Maui multi-palm grove silhouetted along the inland edge"
   - "lone bent coconut palm silhouetted leaning over the white sand"
   - "cluster of palm silhouettes arching from the upper-corner over the beach"

3. **TROPICAL SUNSET SKY** — name a specific multi-band palette per entry (see distribution below).

4. **CALM / GENTLE WATER** — gentle shorebreak surf at the foreground sand OR mirror-calm lagoon. No dramatic surf, no crashing waves, no rocky-shore foam.

━━━ STRONGLY ENCOURAGED (60%+ of entries) ━━━

5. **SUN VISIBLE ON HORIZON** with sun-flare/sun-rays (NOT "sun-disc" alone — that renders as UFO):
   - "the sun glowing low on the horizon, sun-rays flaring across the lagoon"
   - "the sun half-set behind the horizon line, golden sun-glare across the wet sand"
   - "the warm sun blazing through the palm silhouettes from horizon"

6. **WET-SAND MIRROR REFLECTION** — long reflective sand bands back to camera, doubling the inverted sky.

━━━ OPTIONAL (~30% of entries) ━━━

7. **SMALL DISTANT SILHOUETTES** in the background (NOT foreground subject):
   - "distant Mokulua-style islet silhouettes in the lagoon middle distance"
   - "tiny volcanic-island silhouette anchoring the deep distance"
   - "small palm-fringed headland silhouette across the bay"

━━━ HARD BANS ━━━

ABSOLUTELY ZERO:
- "cliff" / "sea cliff" / "cliff-fringed" / "vertical cliffs" anywhere — banned
- "cove" / "secret cove" / "hidden cove" — Flux renders these as cliff-walled coves
- "rocky shore" / "rocky foreground" / "boulder foreground" / "rocky tide-pool" — banned (foreground is SAND)
- "volcanic-rock buttress" / "lava-rock formations" / "basalt sea-stack" as primary foreground — banned
- "cathedral granite" / "fjord wall" / "sea-stack" / "monolith" — banned (no dramatic geology)
- "alpine" / "desert" / "mountain peak" — banned
- Active volcanic eruption / lava / plume
- Tourist names (Lanikai / Bora Bora / Maldives by name / Maya Bay / etc.)
- Human-built features (overwater bungalow / hut / pier / dock / boardwalk / umbrella / chair / lighthouse / boat / village lights)
- Humans / silhouetted figures / swimmers / surfers
- "sun-disc" alone (use "sun" / "low sun" / "sun arc")
- sci-fi / magical / glowing orbs / bioluminescence
- Additional optical phenomena (no rainbows / godrays / aurora — sunset IS the phenomenon)

━━━ EXAMPLES (study format — EVERY entry has FLAT SAND + PALMS + TROPICAL SUNSET SKY) ━━━

✓ { "tags": ["coastal-tropical"], "description": "Wide flat white-sand crescent beach with tall coconut palms silhouetted on the inland fringe, saturated yellow-orange-red blazing sunset sky with bands of magenta-pink, the sun glowing low on the horizon with sun-rays flaring across the wet sand, gentle shorebreak surf at the foreground" }

✓ { "tags": ["coastal-tropical"], "description": "Twin coconut palms silhouetted at frame edges arching over a Hawaiian white-sand beach, cotton-candy pink-magenta cloud cover painting the entire sky, gentle surf curling at the foreground sand, distant Mokulua-style islet silhouettes in the lagoon middle distance" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Maui black volcanic-sand crescent beach with Maui multi-palm grove silhouetted along the inland edge, crimson-orange dramatic cloud bands torn across the western horizon, the molten-orange sun half-set behind the horizon line, wet-sand mirror reflecting the sky inverted" }

✓ { "tags": ["coastal-tropical"], "description": "Lone bent coconut palm silhouetted leaning over a Caribbean white-sand crescent, multi-band rainbow gradient sky burning yellow through pink and purple to deep cobalt zenith, the sun touching the horizon with sun-flare burst across the wet-sand mirror" }

✓ { "tags": ["coastal-tropical"], "description": "Warm honey-gold amber pre-sunset sky scattered with peach-tinted clouds, tall coconut palm cluster silhouetted on a flat tropical beach, gentle surf at the foreground white sand, calm lagoon stretching to a distant palm-fringed headland silhouette" }

✓ { "tags": ["coastal-tropical"], "description": "Cluster of palm silhouettes arching from the upper-corner over a Polynesian motu beach, the sun arc kissing the water horizon with golden sun-glare flare across the mirror-glass lagoon, white-sand crescent below catching the warm reflection in long bands" }

✓ { "tags": ["coastal-tropical"], "description": "Palm fronds arching dark from the upper-corner over a Maldivian atoll beach, post-sunset lavender-pink afterglow blazing in dense bands with first stars at deep cobalt zenith, mirror-glass turquoise lagoon doubling the inverted afterglow sky, calm shorebreak at the coral-sand" }

✓ { "tags": ["coastal-tropical"], "description": "Pastel blue-cream-peach pre-sunset sky over a Hawaiian white-sand beach, tall palms silhouetted across the inland edge, gentle morning surf at the foreground sand, wet sand at low tide with mirror-reflection of the soft pastel bands back toward camera" }

✓ { "tags": ["coastal-tropical", "volcanic"], "description": "Hawaiian black-sand beach with palm cluster silhouetted at the inland fringe, saturated yellow-orange-pink sky at sunset crescendo, the warm sun blazing through the palm silhouettes from horizon, calm gentle surf at the foreground catching the sun-glare flare" }

✓ { "tags": ["coastal-tropical"], "description": "Bali tropical beach at peak sunset with Maui-style multi-palm grove silhouetted along the inland edge, blue-purple zenith bleeding through indigo and violet to molten-orange at horizon, the sun's last molten arc shearing the water line, wet white sand reflecting the inverted blazing sky" }

✓ { "tags": ["coastal-tropical"], "description": "Costa Rican white-sand beach at peak sunset with palm cluster silhouetted at frame left, saturated fire-storm yellow-orange-red sky, the sun glowing low on the horizon, gentle shorebreak surf at the foreground sand catching the burning sky in mirror reflection" }

✓ { "tags": ["coastal-tropical"], "description": "Pastel pink and yellow pre-sunset sky over a Tahitian palm-fringed beach, tall coconut palms silhouetted in cluster on a low headland inland, gentle surf at the foreground white sand, distant volcanic-island silhouette anchoring the deep distance" }

✗ BAD — cliff: "Tropical bay with cliff-fringed walls" (BANNED — no cliffs)
✗ BAD — cove: "Secret tropical cove with sunset" (BANNED — Flux renders cliff-walled coves)
✗ BAD — rocky shore: "Rocky shore with boulders catching sunset" (BANNED — foreground is sand)
✗ BAD — volcanic rock primary: "Volcanic-rock buttress at the shore at sunset" (BANNED — no rock foreground)
✗ BAD — sea-stack: "Sea-stack silhouette at sunset" (BANNED — no dramatic geology)
✗ BAD — no palms: "Sunset over open beach" (BANNED — must have palms)
✗ BAD — humans/structures/tourist names — see ban list above

━━━ COLOR-STAGE DISTRIBUTION (across ${n} entries) ━━━

- ~20% Saturated yellow-orange-red dramatic peak (sun on horizon blazing)
- ~20% Multi-band rainbow gradient (yellow→pink→purple→blue)
- ~15% Cotton-candy pink-magenta cloud cover
- ~15% Warm honey-gold golden-hour pre-sunset (amber/peach)
- ~10% Crimson-orange dramatic torn cloud bands
- ~10% Pastel blue-cream-peach pre-sunset
- ~5% Post-sunset lavender-pink afterglow (twilight with first stars)
- ~5% Clark Little translucent shorebreak wave (palm + wave + sunset through wave-face)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. EVERY entry is FLAT TROPICAL BEACH + PALMS ON SAND + TROPICAL SUNSET SKY. No cliffs. No coves. No rocky shores. No banned features. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
