#!/usr/bin/env node
/**
 * BRICKBOT_MECH_REGISTER — mech faction / heritage lock (Bionicle / Hero-Factory etc.).
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's mech path — a register is a mech FACTION / LINE / GENRE heritage that defines look. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a mech heritage (Bionicle Bio-Mechanical, Hero-Factory Hero-Bot, Exo-Force Anime-Mech, Power-Loader, Spider-Tank, etc.) and locks PALETTE + ARMOR-STYLE + WEAPON-KIT + SCENE-ANCHOR. Sonnet must produce visibly distinct registers.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO MECH LINES: Bionicle, Hero-Factory, Exo-Force, BrickArms, NeXO Knights
- ~4 SCI-FI CANON-CODED: Gundam-like UC-mecha, Real-Robot-coded, Patlabor-coded, Macross-coded
- ~4 KAIJU / PACIFIC RIM-CODED: Jaeger-coded titan-class, Kaiju-hunter, MUTO-coded
- ~3 POWER-LOADER / EXO-WORK: industrial loader, salvage-mech, demolition exo
- ~3 EVA / NGE-CODED: organic plug-suit pilot mech, restraint-system
- ~3 BATTLETECH / MECHWARRIOR-CODED: clan-mech, Inner Sphere
- ~3 WARHAMMER-CODED: titan-class, dreadnought, Imperial-Guard-sentinel
- ~3 SAMURAI / EASTERN: katana-mech, oni-armored, ronin
- ~3 ROBOT-COP / DREAD-CLASS: enforcement-droid, peacekeeper-mech
- ~3 ANCIENT / BRASS-AUTOMATON: steampunk brass mech
- ~2 ASTRO-MECH / SPACE-OPS: vacuum-rated mech
- ~2 DRONE-SWARM: small autonomous mechs
- ~2 ECO-WARRIOR: bio-mech with plant integration

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + ARMOR-STYLE + WEAPON-KIT + SCENE-ANCHOR. Touchpoints:
"BIONICLE BIO-MECHANICAL SIGNATURE — silver + gold + flame-orange palette, CCBS organic-curve shell-armor over a Technic-pin frame, a Kanohi-style horned mask, dual bladed elemental tools"
"HERO-FACTORY HERO-BOT SIGNATURE — bright cobalt-blue + white + trans-yellow palette, sleek smooth CCBS chest-and-limb armor, a glowing trans hero-core chest, a tri-barrel concussion-blaster"
"EXO-FORCE ANIME-MECH SIGNATURE — blue + gold + white palette against rival black + red plating, angular faceted anime panels, a sharp-crested cockpit-head, a spiky-hair-piece pilot inside"

━━━ BANS ━━━
- NO licensed franchise names verbatim (use heritage-coded language)
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
