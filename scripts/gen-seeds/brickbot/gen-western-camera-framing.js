#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_CAMERA_FRAMING — wild-west frontier LEGO MOC camera angles.
 * Audit 2026-06-05: existing 12 entries — undersized. Target 200. This path
 * is the dusty wild-west frontier (cowboys / sheriffs / outlaws / prospectors
 * / railroad-crews; saloons / forts / mesas / mines). The framing must drive
 * the western drama (standoffs / ambushes / chases / dust) and override Flux's
 * centered-front-facing minifig default.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's western path — wild-west frontier LEGO MOC dioramas (sheriffs / outlaws / cowboys / prospectors / cavalry; saloons / forts / ghost-towns; stagecoaches / locomotives; mesas / canyons / mines). The framing OVERRIDES Flux's centered-front-facing minifig default and DRIVES the frontier drama beat. Each entry is one CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry must tell Flux exactly where to put the camera, what's in foreground / mid-ground / background, AND why this angle is the western drama beat (the standoff, the ambush, the chase, the campfire moment). Generic angles FAIL — name the specific staging.

━━━ VARIETY MANDATE (distribute roughly across these frontier-angle categories) ━━━
- ~4 MAIN-STREET STANDOFF — flat-low down the receding brick main street, gunfighters at opposite ends, false-front facades flanking
- ~3 SALOON-INTERIOR — over-the-bar / batwing-door-through / staircase-balcony peering down into the saloon room
- ~3 STAGECOACH / TRAIN-CHASE TRACKING — locked alongside or atop a moving brick stagecoach / locomotive / boxcar
- ~3 MESA / CANYON HIGH-VISTA — perched on a stacked-plate canyon-rim / mesa-top looking down at riders/wagons below
- ~3 WIDE BADLANDS — ground-flat on tan-plate desert floor, enormous stacked-plate mesas / buttes towering against brick sky
- ~3 SHERIFF-PORCH / BOARDWALK — at boardwalk-plank level angled up at a porch / WANTED-board / sheriff star or down a receding boardwalk
- ~2 MINE-SHAFT DOWN — at timbered shaft-mouth angling steeply down ore-cart rail descent, lantern-glow warming the dark
- ~2 CAMPFIRE LOW — at trans-orange campfire-brick level, over a cowboy's shoulder, picketed horse blurred in dark beyond
- ~2 WATER-TOWER / ROOFTOP PERCH — high behind a sniper minifig on a brick water-tower / depot roof, standoff figures spread below
- ~2 STOCKADE / FORT WALL — atop a log-stockade fort wall looking down at cavalry maneuvering inside or attackers outside
- ~1 ASSAY-OFFICE / TRADING-POST INTERIOR — over a counter into a lantern-lit interior, scales / ledgers / shelves
- ~1 RIVER-FORD / TRAIN-TRESTLE — low at a trans-blue river-ford or under a wood-trestle bridge, locomotive crossing high above

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 words hyphenated), em-dash, 22-32 word body. Body MUST mention: foreground element, mid-ground subject, frontier specific brick detail (false-front / boardwalk / stagecoach-wheel / mesa-strata / lantern-brick / bandana / six-shooter / sheriff-star). Touchpoint examples:
"MAIN-STREET HIGH-NOON STANDOFF — camera flat at minifig-boot level down the tan-plate street centerline, two gunfighters at opposite ends, false-front brick facades receding into the dusty gap between them."
"CANYON-RIM AMBUSH-DOWN — camera perched on stacked-plate canyon-rim sandstone looking nearly straight down at a lone rider on the trail below, ambush-figures crouching in silhouette at the foreground rim edge."
"CAMPFIRE OVER-SHOULDER — camera just behind a cowboy minifig looking past their hat-brim at trans-orange campfire bricks, two trail-hands opposite, a picketed horse blurred in the far dark behind them."

━━━ BANS ━━━
- NO centered eye-level front-facing default angles
- NO photoreal / real-photo language — every entry is for a brick diorama
- NO Native-stereotype framing — respectful frontier only (cowboys / outlaws / sheriffs / prospectors / cavalry / railroad)
- NO motion blur language on terrain/dust ("billowing dust") — render as static brick
- NO bland descriptors ("nice angle of...") — name foreground / mid-ground / frontier detail
- NO modern vehicles / anachronisms

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
