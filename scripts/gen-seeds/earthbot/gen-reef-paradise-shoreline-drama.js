#!/usr/bin/env node
/**
 * EarthBot reef-paradise — SHORELINE DRAMA axis (R2 PIVOT).
 *
 * What rises ABOVE the water — the dramatic landscape. Volcanic ridges,
 * palm-fringed cliffs, lush jungle slopes, lava-rock outcrops. Generic
 * morphological descriptions only.
 *
 * MVP at 50.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_shoreline_drama.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SHORELINE DRAMA entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic). Each entry describes ONE dramatic ABOVE-WATER tropical shoreline — the landscape rising out of the bay. Generic morphological descriptions ONLY. NO named places.

━━━ THE BAR — DRAMATIC TROPICAL SHORELINE (described generically) ━━━

The shoreline is the VISUAL HERO above the water. Towering volcanic ridges, palm-fringed cliffs, lush jungle slopes cascading to waterline, lava-rock arms, dramatic island silhouettes. Each entry names ONE shoreline configuration that makes someone want to book a flight.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one shoreline description, 18-32 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **A DRAMATIC LANDFORM** (the shoreline shape — vary across entries):
   - towering volcanic ridges silhouetted against the sky
   - jagged basalt cliffs rising vertically from the water
   - palm-fringed sloping headland
   - lush jungle-covered slope cascading down to the waterline
   - black-lava arms extending into the bay
   - twin towering volcanic peaks framing the distance
   - jagged silhouetted island ridge in deep distance
   - sloping green island rising to a single dramatic peak
   - layered ridge upon ridge of distant tropical mountains
   - lush forested mountain wall behind the bay

2. **PALM PRESENCE** (most entries should mention palms in some form):
   - palm silhouettes along the ridgeline
   - palm-fringed crest of the headland
   - coconut palms silhouetted at the inland edge
   - palm fronds visible along the slope
   - scattered palms silhouetted on the distant ridge

3. **POSITION IN FRAME** (where this shoreline sits):
   - "rising in the upper half of the frame"
   - "filling the background"
   - "silhouetted against the sky in the upper frame"
   - "rising behind the bay"
   - "framing the lateral edge"
   - "extending across the deep distance"

━━━ HARD BANS ━━━

NEVER include:
- **Named real-world places** (NO "Bora Bora" / "Hanauma" / "Tahiti" / "Maui" / "Hawaii" / "Polynesia" / "Caribbean" / "Indonesia" / "Bali" / "Maldives" / "Seychelles" — generic only)
- Bay / water content (no "lagoon water" / "turquoise" — that's bay_setting axis)
- Coral / fish / underwater elements
- Sky / cloud / sun-ray detail (no "sun-rays" / "clouds" — that's sky_drama axis)
- Camera / composition words
- Humans
- Boats / docks / huts / overwater-bungalows / piers / lighthouses / villages
- Snow / alpine / desert
- City / urban / roads / cars

━━━ EXAMPLES ━━━

✓ "Towering volcanic ridges silhouetted against the sky, palm-fringed crest along the upper ridgeline, rising in the upper half of the frame"

✓ "Jagged basalt cliffs rising vertically from the waterline, scattered palms silhouetted along the cliff edge, filling the background of the frame"

✓ "Twin towering volcanic peaks framing the distance, lush jungle-covered slopes cascading down to the waterline, palm silhouettes along the lower slopes"

✓ "Lush jungle-covered mountain wall rising behind the bay, palm crowns visible along the inland fringe, filling the upper portion of the frame"

✓ "Sloping green island rising to a single dramatic peak, palm-fringed lower slopes, silhouetted against the sky in the upper frame"

✓ "Jagged silhouetted island ridge in the deep distance, palm silhouettes scattered along the crest, filling the deep background of the frame"

✓ "Black-lava arms extending into the bay from both lateral edges, palm silhouettes along the upper edge of the lava outcrops, framing the bay laterally"

✓ "Layered ridge upon ridge of distant tropical mountains, palm-fringed lower slopes nearest, silhouetted against the upper frame"

✓ "Palm-fringed sloping headland rising in the upper half of the frame, scattered coconut palms silhouetted along the crest, the slope cascading toward the waterline"

✓ "Forested mountain wall rising sharp behind the bay, jagged tropical ridges silhouetted above, palm crowns visible along the inland fringe at the bay-edge"

✗ BAD — named place: "Maui-style volcanic ridge" (BANNED — generic only)
✗ BAD — water: "Lush slope cascading into turquoise water" (BANNED — water_quality / bay_setting own that)
✗ BAD — sky: "Mountain silhouette under sun-rays" (BANNED — sky_drama axis)
✗ BAD — structures: "Palm-fringed slope with thatched huts" (BANNED — zero human-built features)

━━━ LANDFORM DISTRIBUTION ━━━

Spread across entries:
- ~25% volcanic ridges silhouetted
- ~20% jagged basalt cliffs
- ~15% lush jungle slope cascading
- ~10% twin peaks framing distance
- ~10% sloping green island rising to peak
- ~10% layered ridge upon ridge in distance
- ~10% black-lava arms extending

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Dramatic shoreline above the water, generic only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
