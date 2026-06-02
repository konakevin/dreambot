#!/usr/bin/env node
/**
 * EarthBot coastal-vista — SUBJECT axis (biome-tagged dramatic coastlines).
 *
 * Identity: DRAMATIC craggy coast — Iceland-style basalt / Big Sur cliffs /
 * 12 Apostles sea-stacks / Faroe Islands / Cliffs of Moher / Etretat chalk
 * arches / Reynisfjara hexagonal columns / Norwegian fjord walls / Pacific
 * Northwest stack coast / Hawaiian volcanic sea cliffs. The "I can't
 * believe this is Earth" coastal-geology vantages.
 *
 * Sister to tropical-paradise (which is paradise PALM coast). This one
 * is COLD-DRAMATIC + WATER-EROSION + GEOLOGICAL-IMPACT coast. No tourist
 * vantage names per LESSON 7. No human-built features per LESSON 8.
 *
 * First beach-side path migrated. Same clone pattern: reuses
 * EARTHBOT_EPIC_VISTA archetype + 5 shared axes. Only this subject pool
 * is bespoke.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/coastal_vista_subject.json',
  total: 200,
  batch: 15, // 25 hits Sonnet's 2500-token output cap mid-entry once dedup-prior list grows past ~5KB
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUBJECT entries for EarthBot coastal-vista — each entry describes ONE dramatic craggy coastline scene at gallery-print fine-art tier (Marc Adamus / Iurie Belegurschi / Daniel Kordan caliber). Cold-dramatic, water-eroded, geologically monumental coast — NOT tropical paradise (that's a different path).

━━━ THE BAR ━━━

Dramatic craggy coast that makes the viewer go "I can't believe this is Earth." Basalt sea-cliffs / fjord walls / sea stacks / arches / hexagonal columns / volcanic shoreline / wave-cut platforms / blowholes / sea caves. POV-led, drama-led, geologically specific.

━━━ OUTPUT FORMAT (NON-NEGOTIABLE — JSON OBJECTS NOT STRINGS) ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["<biome>", "<biome>"], "description": "<dramatic coast description, 25-40 words, POV-led, no tourist names>" }

Biome tag vocabulary (use ONLY these — pick 1-2 per entry):
- "coastal-temperate" — PRIMARY tag (cool / cold coast — Iceland / Norway / Faroe / PNW / Big Sur / Cliffs of Moher / Etretat)
- "volcanic" — volcanic-island coast (Hawaiian sea cliffs / Iceland volcanic shore / Galápagos)
- "arctic-polar" — polar coast (Svalbard / Antarctic ice-shelf cliff / Greenland fjord)
- "alpine" — coast meeting alpine (NZ Milford Sound fjord with peak above)
- "coastal-tropical" — sparingly (only for truly dramatic-craggy tropical coast — Napali Coast / Faraglioni sea stacks)

━━━ HARD BANS — NO TOURIST NAMES (LESSON 7) ━━━

NEVER include these in any entry:
- Famous landmark names: "Reynisfjara" / "Cliffs of Moher" / "12 Apostles" / "Etretat" / "Cape Kiwanda" / "Bandon" / "Big Sur" / "Trolltunga" / "Preikestolen" / "Napali Coast" / "Faraglioni" / "Cape Wickham" — strip all
- Famous viewpoints / overlooks: any "X Point" / "X Overlook" / "X Drive" / "X Trail"
- Famous park / preserve names

ALLOWED — broad regional anchors (sparingly): "Icelandic black-sand coast" / "Norwegian fjord coast" / "Faroese sea-cliff coast" / "Pacific Northwest stack coast" / "Big Sur California coast" / "Irish Atlantic chalk coast" / "Hawaiian volcanic sea cliff" / "Australian Southern Ocean cliff" / "Scottish Hebridean coast"

━━━ HARD BANS — NO HUMAN-BUILT FEATURES (LESSON 8) ━━━

NEVER include these structure-trigger words (Flux inserts them unprompted):
- "lighthouse" / "stone steps" / "stone path" / "cobblestone" / "footbridge" / "stone wall" / "ruins" / "ancient tower" / "abandoned cabin" / "dock" / "pier" / "boathouse"
- "viewing platform" / "deck" / "porch" / "railing" / "trail" / "path" / "stepping stones"
- Any masonry / wooden structure / human-built thing

Render water-edge stones as NATURAL boulders, sea-cave entrances as natural rock features, NEVER as constructed steps or platforms. Raw nature only.

━━━ THE BAR — DESCRIPTION FIELD ━━━

Each "description": 25-40 words. Structure (drama-led + POV-led):

1. POV/COMPOSITION cue — open with explicit photographic vantage:
   - "Aerial drone perspective over..." / "Low POV from the surf-line looking up at..." / "Cliff-edge looking down into..." / "Wide-angle wrapping a basalt headland of..." / "Side-on across a fjord channel at..." / "Looking along the curve of..."
2. LEAD drama vocabulary: vertigo-inducing / cathedral-vertical / monumental / razor-cut / wave-carved / sea-eroded / plunging / hexagonal-fractured / sheer-walled / cliff-bound
3. NAME specific geological coast feature: basalt sea-cliff / hexagonal basalt column wall / fjord granite wall / chalk sea cliff / volcanic sea-stack / wave-cut platform / blowhole / sea arch / quartzite headland / pink granite dome
4. ADD scale anchor: thousand-foot vertical drop / mile-long crescent / six-hundred-foot drop / hexagonal columns rising sixty meters / cathedral-vertical fjord wall
5. ADD sensory/directional/material specificity: wind-scoured / wave-pummeled / salt-bleached / sun-baked / fog-touched / glacier-polished / north-facing / east-flowing / iron-stained

WHAT TO EXCLUDE (other axes):
- NO weather, NO lighting / time-of-day, NO optical phenomena, NO atmospheric particulate
- NO sky description, NO wildlife
- BUT YES surface-material character (wind-scoured / wave-pummeled / glacier-polished — describes surface, not weather)

━━━ EXAMPLES (study format + drama-led prose) ━━━

✓ { "tags": ["coastal-temperate", "volcanic"], "description": "Low POV from black volcanic-sand surf-line looking up at hexagonal basalt column cliffs rising sixty meters vertical, sea stacks standing offshore in North Atlantic surf, charcoal sand stretching wide, wave-pummeled iron-grey basalt textures" }

✓ { "tags": ["coastal-temperate"], "description": "Aerial drone perspective over an Irish Atlantic chalk-and-flagstone coast, six-hundred-foot vertical limestone ramparts stretching fourteen kilometers, slate-grey banded strata dropping sheer to cobalt swells below, freestanding needle stack offshore" }

✓ { "tags": ["coastal-temperate"], "description": "Cliff-edge looking down a Norwegian fjord wall, two-thousand-meter granite faces plunging cathedral-vertical into sapphire saltwater, hanging-valley ribbon waterfalls threading the moss-draped cliffs, glacier-polished rock surfaces banded grey" }

✓ { "tags": ["coastal-temperate"], "description": "Wide-angle wrapping a Big Sur California cliff coast at south-facing aspect, eight-hundred-foot vertical sandstone-and-shale plunging into Pacific surf, kelp-strewn rocky shoreline, redwood-fringed bluff edge above" }

✓ { "tags": ["coastal-temperate"], "description": "Side-on across a Faroese sea-cliff channel at low tide, sheer black basalt walls rising five-hundred meters from the strait, hexagonal column fracture patterns running vertical, sea-eroded caves at the waterline" }

✓ { "tags": ["coastal-temperate", "volcanic"], "description": "Looking along the curve of a Pacific Northwest stack coast, dozens of basalt sea-stacks standing offshore in mist-touched Pacific surf, wave-cut platforms exposed at low tide, sun-baked driftwood bleached pearl-grey on the beach" }

✓ { "tags": ["volcanic", "coastal-tropical"], "description": "Aerial drone over Napali-style Hawaiian sea cliffs, cathedral-tall emerald cliffs plunging two-thousand feet vertical into open Pacific, ancient lava ridges thick with vine-curtained jungle, hidden valleys cleaving the wall" }

✓ { "tags": ["arctic-polar", "coastal-temperate"], "description": "Side-on at a Greenland fjord channel, twin glacier-polished granite walls compressing a two-kilometer-wide strait, electric-blue pack ice grinding the passage, calving glacier front feeding the channel from inland" }

✓ { "tags": ["alpine", "coastal-temperate"], "description": "Wide-angle through a NZ Milford-style fjord, two-thousand-meter granite cliffs descending sheer into deepwater inlet, dozens of plunging cascade waterfalls threading the walls, ancient podocarp forest crown above" }

✓ { "tags": ["coastal-temperate"], "description": "Aerial perspective wrapping a chalk-and-flint Étretat-style cliff coast, three-hundred-foot pure-white chalk cliffs with freestanding needle stack offshore, pierced rock arches carved by Channel surf, slate-grey sea below" }

✗ BAD — tourist landmark: "Reynisfjara at sunset" (BANNED — strip "Reynisfjara")
✗ BAD — human-built: "Lighthouse on cliff edge" (BANNED LESSON 8)
✗ BAD — adds weather/light: "Coast at sunset with godrays" (sunset/godrays are other axes)
✗ BAD — too tropical-paradise: "Palm trees on white-sand beach" (this is DRAMATIC craggy coast — tropical paradise is a different path)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

- ~25% Icelandic / Faroese black-basalt-hexagonal-column coast
- ~20% Pacific Northwest stack coast / Big Sur cliffs
- ~15% Norwegian / NZ Milford Sound fjord wall
- ~10% Irish / English chalk-and-limestone Atlantic coast
- ~10% Hawaiian / Polynesian dramatic volcanic sea cliff
- ~10% Australian Southern Ocean cliff / 12 Apostles-style stack coast
- ~5% Arctic / Antarctic fjord (Greenland / Svalbard / Lemaire-style)
- ~5% Scottish Hebridean / Cornish craggy coast

Each entry distinct in geology + region + POV + scale anchor.

━━━ HARD BANS (final) ━━━

- NO tourist landmark names (Reynisfjara / 12 Apostles / Cliffs of Moher / etc.)
- NO human-built features (LESSON 8 ban list)
- NO weather / lighting / atmospheric / phenomenon language
- NO sci-fi / fantasy / magical / mystical
- NO humans / hikers / climbers
- NO palm-tree paradise (this is dramatic-craggy coast — tropical-paradise is different path)
- NO bioluminescent / glowing anything

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Pure drama-led dramatic-coast scenes, POV-cued, no tourist names, no structures. No preamble, no markdown code fences, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
