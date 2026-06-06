#!/usr/bin/env node
/**
 * BRICKBOT_PIRATES_SHIP_CLASS — specific ship hull/rig identity.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_pirates_ship_class.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SHIP-CLASS entries for BrickBot's pirates path — each names a specific historical/era pirate ship class with rig + hull + crew detail. Each entry: ONE CAPS prefix + em-dash + 15-25 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC ship class (Caribbean Galleon Flagship, Bermuda Sloop, Atlantic Brig, Schooner, Snow, Pinnace, Cutter, etc.) AND specifies rigging (square-rigged on main + fore-and-aft on mizzen, etc.), hull silhouette (raked-bow, high stern-castle, low waist), and crew count.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 GALLEON / GRAND-SHIP: Caribbean galleon flagship, Spanish galleon, Dutch flute, English man-of-war
- ~4 SLOOP / FAST-RAIDER: Bermuda sloop, Jamaica sloop, schooner, cutter
- ~3 BRIG / BRIGANTINE: Atlantic brig, snow, hermaphrodite brig
- ~3 FRIGATE: light frigate, fast cruiser, sloop-of-war
- ~3 LONGBOAT / TENDER: gig, jolly-boat, longboat, cutter (auxiliary)
- ~3 NORSE LONGSHIP: knarr, drekar, snekkja, karve
- ~3 GALLEY: Mediterranean galley, Roman bireme, Greek trireme, Phoenician hippoi
- ~3 CHINESE / EASTERN: junk, sampan, dhow, Korean turtle-ship
- ~3 POLYNESIAN: outrigger canoe, double-hulled wa'a, war canoe
- ~3 GHOST / CURSED: ghost-galleon, skeleton-rigged ship, cursed wreck
- ~3 STEAM-ERA HYBRID: paddle-wheel raider, steam-frigate, ironclad pirate
- ~2 SUBMARINE / EARLY-SUB: Nautilus-coded sub, Turtle-class diving-bell
- ~2 PINNACE / SMALL-FAST: pinnace tender, packet-boat
- ~2 RAFT / IMPROVISED: log-raft, stolen-fishing-boat
- ~1 NO-VEHICLE INTERIOR: captain's quarters

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (class name in 2-6 words hyphenated/spaced), em-dash, 15-25 word body with rigging + hull + crew count. Touchpoints:
"CARIBBEAN GALLEON FLAGSHIP — three-masted square-rigged fore and main, lateen mizzen, high stern-castle, raked bow, 50-80 crew"
"SINGLE-MASTED BERMUDA SLOOP — fore-and-aft gaff-rigged mainsail with jib, razor-sharp bow, low waist, shallow draft, 10-20 crew"
"TWO-MASTED ATLANTIC BRIG — square-rigged on both masts, broad beam, balanced mid-hull profile, bluff bow, 20-30 crew workhorse"

━━━ BANS ━━━
- NO photoreal vocab
- NO fictional licensed ships (no Black Pearl, no Flying Dutchman verbatim)
- NO duplicating ship classes
- NO blank "pirate ship" — name the class

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
