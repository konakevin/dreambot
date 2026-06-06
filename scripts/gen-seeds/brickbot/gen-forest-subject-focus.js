#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_SUBJECT_FOCUS — dominant subject of forest diorama.
 * Audit 2026-06-05: 80 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's forest path — each names the dominant brick subject of a forest diorama. Each entry: (CATEGORY) prefix + body, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags and describes a brick-built dominant forest subject.
CATEGORIES:
- (STRUCTURE) — treehouse, cabin, cottage, ranger-hut, wishing-well, water-mill, fae-pavilion, woodcutter shed, watchtower, totem-pole, bridge
- (NO-VEHICLE LANDSCAPE) — sun-shaft glade, mossy hollow, mushroom ring, fern dell, fallen-log clearing, brook bend, ancient-oak grove, fire-ring camp
- (NO-VEHICLE INTERIOR) — treehouse-loft, witch's-hut interior, ranger-cabin interior, faerie-bower, woodsman shed
- (MOUNT) — deer-mount, direwolf, giant-stag, owl-rider, fox-companion, bear-mount, raven-rider, unicorn

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — treehouse, log-cabin, witch's-hut, watchtower, bridge, water-mill, woodland-shrine, ranger-camp, hunting-lodge, woodcutter's cottage, totem-pole, fae-pavilion, sawmill
- ~6 NO-VEHICLE LANDSCAPE — sun-shaft glade, mossy hollow, mushroom-ring, ancient-oak grove, river bend, waterfall-pool, fallen-log clearing, fern-thicket, autumn-grove
- ~6 NO-VEHICLE INTERIOR — treehouse-loft, witch's hut, alchemist's cottage, hunter's cabin, fae-bower, druid's chamber, woodcutter shed, herbalist hut
- ~5 MOUNT — direwolf ride, stag-mount, giant-owl rider, bear-mount, fox-companion, unicorn, raven-rider

━━━ FORMAT ━━━
Each entry: (CATEGORY) prefix + 28-45 word brick description. Touchpoints:
"(STRUCTURE) A brick-built wishing-well of dark-tan round bricks, a tile-roof canopy on clip-rod posts, trans-blue plate water inside, a bucket-element dangling on a chain, central diorama anchor."
"(NO-VEHICLE LANDSCAPE) A shadowed hollow ringed by stacked dark-green plate ground tiers, brick-fern elements and white-tile toadstool caps on round-brick stems, a glowing trans-cyan center, the immersive hero scene."
"(MOUNT) a brick-built direwolf with shaggy slope-brick coat in light-bley, gaping printed-tile teeth, a ranger minifig astride with bow drawn, the dominant centerpiece."

━━━ BANS ━━━
- NO photoreal language
- NO living-creature verbs ("the wolf runs swiftly")
- NO licensed franchise names
- NO duplicating subjects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
