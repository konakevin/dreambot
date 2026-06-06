#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_CAMERA_FRAMING — aquatic-specific framing for SURFACE +
 * SUBMERGED brick MOC photography. Audit 2026-06-05: existing 55 entries —
 * scale to 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's aquatic path — SURFACE (beach/coast/harbor/wreck) + SUBMERGED (reef/kelp/trench/wreck-deep) LEGO MOC photography. Each entry is one CAPS prefix + em-dash + 22-32 word body describing the precise camera angle of a tabletop aquatic brick diorama.

━━━ THE BAR ━━━
Every entry must tell Flux exactly where to put the camera — foreground build, mid-ground subject, background brick element — and why the angle drives the SURFACE↔SUBMERGED duality. Generic angles fail. Name specific aquatic staging: waterline split, kelp-tunnel, coral-wall, porthole, reef-shelf, gunwale, surf-line.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 WATERLINE-SPLIT / DUAL-MEDIUM — camera at the air↔water boundary, half above + half below in one frame
- ~3 SUBMERGED-LOOKING-UP — camera deep below looking up through trans-blue water-column at hull silhouette / sun-shafts piercing down
- ~3 REEF-WALL-PROFILE — camera parallel to a built coral wall, layered trans-and-coral tiers receding
- ~3 KELP-FOREST-TUNNEL — camera threading between built kelp-stalks, light-shafts breaking through gaps overhead
- ~3 PORTHOLE / VIEWPORT-PEER — camera inside a brick sub/diving-bell viewport peering OUT through a circular trans-clear opening
- ~2 SHIPWRECK-DECK-PROWL — camera prowling a built sunken-deck, broken masts overhead, hull-bays falling away
- ~2 BEACH-EYE-LEVEL SURF-LINE — camera low at the wave-break, brick surf-foam in foreground, beach beyond
- ~2 LIGHTHOUSE-BEAM-DOWN — camera mounted near a brick lighthouse-bulb projecting trans-yellow beam down onto wave-tile sea
- ~2 GUNWALE-OVER-RAIL — camera at boat-gunwale looking down past the rail into the brick water below
- ~1 OVERHEAD AERIAL SURF-PATTERN — high above the brick coast looking straight down at break-line wave-tile pattern
- ~1 BUBBLE-COLUMN-VERTICAL — camera tracking a vertical built bubble-stream from seafloor to surface

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (the framing name in 2-5 hyphenated words), em-dash, then 22-32 word body. Body MUST include: foreground brick element, mid-ground subject, aquatic detail. Touchpoints:
"WATERLINE-SPLIT-DIVE — camera locked at the air-water boundary, top half showing the brick longboat above and crashing tile-foam, bottom half revealing the submerged trans-blue reef beneath."
"KELP-TUNNEL-DRIFT — camera threading between two built kelp-bar stalks, light-shafts breaking through gaps overhead, a brick diver mid-glide centered, dark-blue depths beyond."
"PORTHOLE-PEER-INTO-WRECK — camera inside a brick submarine viewport peering out a circular trans-clear opening at a slumped galleon hull and brick-fish swarms in the murky deep."

━━━ BANS ━━━
- NO photoreal water language ("rippling", "flowing", "lapping")
- NO centered eye-level front-facing default angles
- NO motion-blur / tilt-shift language
- NO licensed franchise names (just "diver minifig" / "reef" / "wreck")
- NO bland descriptors ("nice angle of...") — name the foreground, mid-ground, aquatic detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
