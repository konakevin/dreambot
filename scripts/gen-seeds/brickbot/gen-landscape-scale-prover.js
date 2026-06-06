#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_SCALE_PROVER — tiny figures/elements proving monumental
 * vista scale. Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_scale_prover.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SCALE-PROVER entries for BrickBot's landscape path — each names a tiny brick figure / vehicle / element at a specific depth proving the monumental brick vista's scale. Each entry: ONE phrase, 22-35 words.

━━━ THE BAR ━━━
Every entry names ONE small foreground / mid-ground / far figure or feature (minifig hiker, roped climber pair, photographer, tent-camp, distant ranger truck, helicopter dot, fishing boat speck, etc.) AND specifies depth + posture + how it's DWARFED by the surrounding vista. The figure is ALWAYS tiny — the vista is hero.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~6 HUMAN HIKERS: lone minifig hiker, paired hikers, group party, photographer at vantage, summit-conqueror
- ~5 CLIMBERS: roped pair on cliff, soloist on overhang, ice-axed glacier party, mountaineer below summit
- ~4 SMALL CAMPS / TENTS: bivouac, tent-camp clearing, prayer-flag base-camp, fire-circle
- ~4 VEHICLES at distance: 4x4 truck on switchback, ranger jeep, sled-dog team, snowmobile
- ~4 BOATS / WATERCRAFT: lone canoe on lake, fishing boat speck, raft on river, kayaker
- ~3 AERIAL: helicopter dot, paraglider, hot-air balloon, bird flock
- ~3 ANIMALS at scale: deer herd, bear silhouette, eagle aloft, mountain goat
- ~3 STRUCTURES at distance: lone cabin smoke, observation tower, fire-lookout, monastery
- ~2 SIGNS / MARKERS: trail signpost, cairn stack, prayer-flag cluster
- ~2 ACTIVITIES: skier mid-descent, kayaker mid-rapids, rafter, surfer

━━━ FORMAT ━━━
Each entry: ONE phrase, 22-35 words. Touchpoints:
"A lone hiker minifig silhouetted on a foreground ridge-edge, backpack-element clipped on, just a few studs tall against the sweeping brick valley beyond."
"Two roped climber minifigs on the mid-ground cliff face, a thread-element linking them, tiny against the towering slope-brick wall above."
"A photographer minifig at a foreground overlook, tripod-build barely three studs high, utterly dwarfed by the canyon dropping away far below."

━━━ BANS ━━━
- NO large figures (must be DWARFED by vista)
- NO close-up character details
- NO photoreal vocab
- NO licensed franchise names

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
