#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_REGISTER — western heritage / faction lock.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's western path — a register is a Wild-West heritage / faction / era. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC western heritage (Classic-LEGO-Cowboys, Fort-Legoredo Cavalry, Gold-City Prospectors, etc.) and locks PALETTE + MINIFIG KIT + SCENE-ANCHOR.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO LINES: Classic Cowboys, Fort Legoredo, Gold-City Prospectors, Indians (generic-coded), Frontiers
- ~4 OUTLAW / BANDIT: train-robber band, stagecoach-bandit, James-gang-coded, masked-bandit
- ~4 SHERIFF / LAWMAN: marshal posse, sheriff-deputy team, town-marshal
- ~4 CAVALRY / MILITARY: 7th-Cavalry-coded, Union-Army-coded, frontier-fort garrison
- ~4 RANCHER / COWBOY: cattle drovers, ranch hands, cattle-baron
- ~3 NATIVE-FRONTIER (generic-coded): plains-tribe, mountain-tribe, pueblo-coded
- ~3 RAILROAD / IRON-HORSE: rail crews, locomotive engineers, conductor + porter
- ~3 MEXICAN-BORDER: vaqueros, mariachi, rurales, hacienda
- ~3 OUTLAW: pirate-of-the-plains, train-robbery crew, stagecoach-bandit
- ~3 GHOST / SUPERNATURAL: ghost-town haunting, vampire-of-the-west, weird-western witch
- ~3 MOUNTAIN-MAN / TRAPPER: mountain man, trapper, fur-trader
- ~3 PROSPECTOR / MINER: gold-pan miner, sluice crew, claim-jumper
- ~2 SPANISH-MISSION: padres, mission guards, ranchero
- ~2 STAGECOACH-CREW: driver + shotgun, passengers
- ~2 TRAVELING SHOW: medicine-show wagon, snake-oil salesman, traveling rodeo
- ~2 NORTHERN / FRENCH-CANADIAN: voyageur, mountain-man
- ~1 STEAMPUNK-WESTERN: brass + cowboy hybrid

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + MINIFIG KIT + SCENE-ANCHOR. Touchpoints:
"CLASSIC-LEGO-COWBOYS SIGNATURE — rust + tan + barn-red palette, sheriff-star-torso + cowboy-hat + bandana + revolver minifigs, a false-front timber main-street with saloon + general-store + livery"
"FORT-LEGOREDO CAVALRY SIGNATURE — cavalry-blue + tan + timber palette, blue-kepi + blue-jacket soldier minifigs with sabers + rifles, a log-stockade fort with watchtowers + parade-ground"
"GOLD-CITY PROSPECTOR SIGNATURE — amber + brown + grey palette, suspenders + slouch-hat + pickaxe + gold-pan minifigs, a mine-headframe + sluice + assay-office + claim-stakes"

━━━ BANS ━━━
- NO licensed franchise names verbatim
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
