#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_REGISTER — LEGO Space era + faction lock (Classic-Space etc).
 * Audit 2026-06-05: 40 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's space path — a register is a LEGO Space era + faction OR hard-SF canon-coded heritage. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC era + faction (Classic LEGO Space 1978-87, Blacktron-I 1987-90, M-Tron 1990-93, Ice Planet 1993, etc.) and locks: SUIT/HELMET style + PALETTE + SCENE-HINT (ship class / vehicle / setting hint). Sonnet must produce visibly distinct era-locked registers.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~6 CLASSIC LEGO SPACE-ERA: Classic Space (1978-87), Futuron (1987-90), Space Police-I (1989-92), Space Police-II (1992-93)
- ~4 ANTAGONIST-ERA: Blacktron-I (1987-90), Blacktron-II (1991-93), Spyrius (1994-95), UFO (1997-98)
- ~3 PLANETARY-EXPLORATION: Ice Planet 2002 (1993), Mars Mission (2007-08), Mars Tribe-coded
- ~3 GALAXY-SQUAD (2013): bug-blaster era
- ~3 INSECT-OFFSET: Insectoids (1998-99), Life-on-Mars (2001)
- ~3 HARD-SF CANON-CODED: Expanse-coded Earther/Belter, Mass-Effect-coded N7, 2001 A-Space-Odyssey-coded
- ~3 STAR-WARS-CODED: Rebel-coded, Imperial-coded, Mandalorian-coded (call them "vintage SF rebel," "Imperial militia," etc.)
- ~3 EARTH-FUTURE: M-Tron (1990-93) magnet-haul mining
- ~3 LUNAR / MOON-BASE: Apollo-coded retro-NASA, near-future Moon-Base, Lunar-Mining
- ~3 EXOPLANET / COLONY: Mars Colony, exoplanet survey, frontier-colony
- ~2 ASTEROID-MINER: M-Tron-coded mining
- ~2 ROBOTS / DROIDS: classic LEGO Space droids, hard-SF robot
- ~2 MERC / PRIVATEER: smuggler/pirate-coded space-crew

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix "<NAME> (era)", em-dash, 25-40 word body. Body must mention SUIT/HELMET + PALETTE + SHIP/VEHICLE hint. Touchpoints:
"CLASSIC LEGO SPACE (1978-1987) — yellow-torso astronaut suits, white air-tank backpacks, trans-blue cockpit canopies, friendly Earth-fleet explorer motif; vehicle_class anchors a cosmic-fleet cigar-hull"
"BLACKTRON I (1987-1990) — black-with-neon-yellow antagonist suits, wedge-hull ship silhouettes, cockpit-eject modules, aggressive rival-faction aesthetic; vehicle_class biases toward black-wedge raiders"
"ICE PLANET 2002 (1993) — white-and-neon-orange explorer suits, ice-saw-blade equipment, trans-neon-orange crystal accent pieces, arctic-station motif; vehicle_class becomes ice-rovers + landing-craft"

━━━ BANS ━━━
- NO licensed franchise names verbatim (use heritage-coded)
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
