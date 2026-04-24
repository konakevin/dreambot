#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/hawaii_coastal_spaces.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HAWAIIAN COASTAL setting descriptions for BeachBot's hawaii-flowers path. Each entry describes a jaw-dropping beach or coastal scene on a SPECIFIC Hawaiian island. NO specific flower species or colors (a separate pool handles flowers).

Each entry: 15-25 words. One specific Hawaiian coastal setting with island name, atmosphere, and camera angle.

━━━ THE CONCEPT ━━━
Stunning Hawaiian coastal scenes — beaches, cliffs, shorelines, coves — where tropical flowers are blooming everywhere. The BEACH/COAST is the setting, flowers are the co-star. Every scene is a specific real Hawaiian location vibe.

━━━ ISLANDS (distribute evenly across all four) ━━━

KAUAI (~25%):
- Na Pali Coast cliffs with flowers cascading down green ridges to turquoise water
- Tunnels Beach / Makua with reef visible, volcanic mountains behind
- Waimea Canyon rim overlooking red canyon with coastal flowers
- Secret beach coves, fern-covered sea caves, Hanalei Bay

MAUI (~25%):
- Road to Hana black sand beach with jungle meeting shoreline
- Wailea golden sand with Molokini crater visible on horizon
- Iao Valley stream meeting the coast, needle rock backdrop
- Ho'okipa surf break, wind-swept cliffs, wild north shore

OAHU (~25%):
- Lanikai beach with Mokulua Islands, powder-white sand, calm aqua water
- North Shore big wave beach, volcanic rock formations
- Kailua beach sunrise, coconut palms, kayak-calm water
- Diamond Head crater rim overlooking Waikiki coastline

BIG ISLAND (~25%):
- Punalu'u black sand beach, volcanic rock, palm groves
- Mauna Kea snow-capped peak visible from Kohala coast
- Pololu Valley lookout, steep green cliffs meeting black sand
- Papakōlea green sand beach, olivine-colored shore, turquoise water

━━━ CAMERA ANGLES (vary across entries) ━━━
- Wide establishing showing dramatic coastline + flowers
- Ground-level through flowers toward ocean
- Cliff-edge looking down at flower-lined shore
- Through palm/plumeria tree framing the beach beyond
- Aerial perspective showing flower-covered headland
- Intimate cove detail with volcanic rock and blooms

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species or colors. Use only generic terms: "blooms", "flowers", "tropical flora", "floral cascade". A separate pool provides the specific arrangement. But DO emphasize flowers are ABUNDANT and STUNNING in this coastal setting.

━━━ ATMOSPHERE (include one per entry) ━━━
Trade winds, salt spray, golden Pacific sunset, morning mist off the water, rainbow after rain, volcanic haze (vog), moonlit surf, dawn light on wet sand, afternoon shower passing, turquoise water glow

━━━ NO PEOPLE ━━━
Absolutely NO people, surfers, swimmers, tourists. Empty beaches — only flowers and the Hawaiian coast.

━━━ DEDUP ━━━
Each entry must be a DIFFERENT island + location + angle combo. No two entries on the same beach.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
