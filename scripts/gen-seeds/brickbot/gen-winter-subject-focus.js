#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_SUBJECT_FOCUS — dominant subject for winter diorama.
 * Audit 2026-06-05: 80 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's winter path — each names dominant brick subject of a winter diorama. Each entry: (CATEGORY) prefix + body, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags.
CATEGORIES:
- (STRUCTURE) — alpine chapel, ski-lodge, log-cabin, town-square clock-tower, ice-hotel, igloo, observatory, ski-jump
- (NO-VEHICLE LANDSCAPE) — open tundra, snow-laden pine forest, frozen-lake expanse, alpine-peak vista, ice-cave grotto, glacier
- (NO-VEHICLE INTERIOR) — cabin-interior hearth, lodge great-room, ice-hotel suite, kitchen feast, sleigh-interior, train-car
- (MOUNT/VEHICLE) — sleigh + horses, snowmobile, dog-sled, ice-skates, ski-pair, train, snowcat, bobsled

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — alpine chapel, ski-lodge, log-cabin, ice-hotel, igloo, observatory, ski-jump tower, gondola hut, watchtower, hot-spring bath-house, ranger-station, lighthouse
- ~6 NO-VEHICLE LANDSCAPE — open tundra, snow-pine forest, frozen-lake expanse, alpine-peak vista, ice-cave grotto, glacier-ridge, ski-slope panorama
- ~6 NO-VEHICLE INTERIOR — cabin hearth, lodge great-room, ice-hotel suite, kitchen feast, sleigh interior, train-car, igloo interior, ski-lodge bar
- ~5 MOUNT/VEHICLE — sleigh + horses, dog-sled, snowmobile, ski-pair, bobsled, snowcat, ice-yacht, reindeer-mount

━━━ FORMAT ━━━
Each entry: (CATEGORY) prefix + 28-45 word brick description. Touchpoints:
"(STRUCTURE) a brick-timber alpine chapel with white slope-brick snow-roof, a trans-yellow lantern-build steeple, arched-plate windows glowing trans-orange, white-plate snowdrifts piling at the base"
"(NO-VEHICLE LANDSCAPE) an open tundra of white plates and slope-bricks studded with snow-load pine builds of dark-green cones and white-plate caps, rolling whitewash"
"(MOUNT/VEHICLE) a brick-built santa-sleigh with red plate body + curl-runner brick skis + harness-bar harness, eight brick reindeer in stride, antler-elements raised, mid-launch"

━━━ BANS ━━━
- NO photoreal vocab
- NO licensed franchise names (no Santa-Inc / Frosty verbatim)
- NO duplicating subjects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
