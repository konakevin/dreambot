#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/rust_apoc_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's post-apoc-rust-tech path. Each describes what the rig + crew are DOING, 12-18 words.

━━━ ABSOLUTE RULE — RIG IS ALIVE & MOVING ━━━
Crew is engaged, rig is running (or actively being worked on). Never abandoned, never decay-pathos. Mad Max road-warrior energy.

━━━ ACTION CATEGORIES ━━━
- Convoying at speed (kicking up dust, driver leaning out, gunner braced)
- Raiding a wreck (crew dismounting, salvage tools out, rig idling)
- Inter-rig combat (two scavenger rigs trading fire / ramming)
- Refueling at a captured pump (one scavenger pumping, two on overwatch)
- Climbing/cresting a ridge (rig crawling, crew bracing)
- Boarding action (one rig pulling alongside another, crew leaping the gap)
- Engine-trouble field repair (driver out, hood up, crew firing in defense)
- Towing a captured prize (chains taut, dragging a salvaged hull)
- Camping at night (firepit by the rig, crew lounging, sentries on roof)
- Dust-storm driving (crew goggled, rig at full throttle, sand-walls behind)

━━━ EXAMPLES (write fresh) ━━━
- "Punching through dust at speed, driver leaning out side hatch, roof gunner firing tracers across the open"
- "Stopped at a wrecked transport, crew dismounting with cutting torches, lookout on roof scanning ridges"
- "Two scavenger rigs trading point-blank cannon fire, hulls sparking, crew clinging to rooftop rails"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary verb + crew action + interaction-with-environment-or-other-rig.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
