#!/usr/bin/env node
/**
 * BRICKBOT_FANTASY_CAMERA_FRAMING — castle / dungeon / wizard-tower / siege
 * framing. Audit 2026-06-05: 46 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_fantasy_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's fantasy path — castle / dungeon / siege / wizard-tower / throne-room / battle-field LEGO MOC dioramas. Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera — foreground build, mid-ground subject, background fantasy detail — in a heroic / cinematic medieval/fantasy register. Generic angles fail. Name castle-specific staging: battlement-down, throne-room aisle, drawbridge-up, dungeon-stairwell, siege-tower-approach, banner-archway, etc.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 BATTLEMENT / WALL-TOP — looking down from castle parapet at attackers, archers, drawbridge, etc.
- ~4 THRONE-ROOM / GREAT-HALL ESTABLISHING — down the aisle to throne-dais, banners flanking, light-shaft from clerestory
- ~3 SIEGE-TOWER-APPROACH — camera with siege-tower / battering-ram rolling toward castle gate, defenders firing down
- ~3 DRAWBRIDGE / GATE-LOW — at gate level, raised portcullis above, knights silhouetted in archway
- ~3 DUNGEON-STAIRWELL DESCENT — winding stone spiral going down into trans-glow chamber below
- ~3 WIZARD-TOWER-UP — looking up the spiraling tower's exterior, spell-glow at the summit-window
- ~3 BANNER-ARCHWAY FOREGROUND — framed by hung banners, knights and processional beyond
- ~2 BATTLE-FIELD WIDE — sweeping low across a brick battlefield, two armies clashing mid-frame
- ~2 DRAGON-PERCH OVERHEAD — high angle from a dragon's perch, looking down at castle below
- ~2 INN / TAVERN INTERIOR — low at hearth-fire, mug-clinking patrons gathered around the round-table
- ~1 LIBRARY / SCRIPTORIUM — quiet candlelit study, scrolls and tomes piled
- ~1 CRYPT / MAUSOLEUM — sarcophagi flanking a low-vaulted brick chamber

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body MUST mention foreground brick element, mid-ground subject, fantasy detail. Touchpoints:
"BATTLEMENT-DOWN OVERLOOK — camera at parapet-rim height looking straight down at siege-ladder attackers swarming the castle-wall base, defenders mid-action foreground, the courtyard far below."
"THRONE-ROOM ESTABLISHING DOWN-AISLE — camera at nave-entrance looking down the central aisle toward the throne-dais, heraldic-banner columns flanking, kingly-minifig rising to receive an envoy."
"DRAGON-PERCH OVERHEAD — camera at the dragon's vantage on a high cliff-build, looking down at the brick castle below dwarfed by perspective, the dragon's wing-frame in foreground silhouette."

━━━ BANS ━━━
- NO photoreal language
- NO centered eye-level front-facing default
- NO motion-blur / tilt-shift
- NO licensed franchise names (no Game of Thrones / LOTR / Hogwarts verbatim)
- NO bland descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
