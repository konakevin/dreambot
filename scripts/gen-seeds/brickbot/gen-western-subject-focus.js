#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_SUBJECT_FOCUS — dominant subject for western diorama.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's western path — each names dominant brick subject of a Wild-West diorama. Each entry: (CATEGORY) prefix + body, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags.
CATEGORIES:
- (STRUCTURE) — saloon, church, jail, sheriff's office, bank, livery, mine-headframe, water-tower, train-depot, ranch-house
- (NO-VEHICLE LANDSCAPE) — mesa-plateau, canyon, desert flats, prairie, riverbed, badlands, mining-canyon, ghost-town ruin
- (NO-VEHICLE INTERIOR) — saloon interior, jail-cell, sheriff's office, mine-tunnel, bank vault, ranch parlor
- (MOUNT/VEHICLE) — stagecoach, locomotive, wagon-train, horse + rider, ranch-cart, dynamite-cart, prairie-schooner

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — saloon, church, jail, sheriff's office, bank, general store, livery, mine-headframe, water-tower, train-depot, schoolhouse, hotel, undertaker, blacksmith
- ~6 NO-VEHICLE LANDSCAPE — mesa-plateau, canyon, desert flat, prairie, mining-canyon, ghost-town ruin, river-ford, dust-bowl, badlands, hot-spring
- ~6 NO-VEHICLE INTERIOR — saloon interior, jail-cell, mine-tunnel, bank vault, parlor, hotel-room, train-car, stagecoach-coach
- ~5 MOUNT/VEHICLE — stagecoach, locomotive, prairie-schooner, wagon-train, horseback rider, dynamite-cart, hand-car, gold-cart

━━━ FORMAT ━━━
Each entry: (CATEGORY) prefix + 28-45 word brick description. Touchpoints:
"(STRUCTURE) a brick frontier church with a board-and-batten steeple, arched plate windows, a plank-door with iron-hinge details, a hitching-rail out front, bell-tower central anchor"
"(NO-VEHICLE LANDSCAPE) a brick high-desert plateau of stacked tan-plate mesas, printed-tile cactus arms, a dry-wash gulch of brown plates, a lone minifig prospector for scale"
"(MOUNT/VEHICLE) a brick-built stagecoach: a body-box on Technic spoked-wheels, a leather-detail flap-door, luggage-rack roof, a six-horse brick team in layered-plate harness"

━━━ BANS ━━━
- NO photoreal vocab
- NO licensed franchise names
- NO duplicating subjects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
