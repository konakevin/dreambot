#!/usr/bin/env node
/**
 * BRICKBOT_MECH_MECH_CLASS — mech archetype/silhouette (humanoid bipedal /
 * quadruped / transformer / etc.). Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_mech_class.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} MECH-CLASS entries for BrickBot's mech path — each names a specific brick mech archetype / silhouette / class with named identity + structural detail. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC class (HUMANOID BATTLE-MECH / QUADRUPED WALKER / TRANSFORMER / POWER-ARMOR / TITAN / etc.) PLUS a heroic/intimidating named identity (the IRONCLAD VANGUARD, the STONECRAWLER BASTION, etc.) PLUS detailed structural brick description (SNOT-plated, ball-jointed, Technic-beam, stud-cannon, etc.). Sonnet must produce visibly distinct silhouettes — not interchangeable "robot" beats.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 HUMANOID BATTLE-MECH: classic bipedal humanoid, varying body types
- ~5 TITAN / SUPER-HEAVY: gargantuan multi-story mechs with city-scale features
- ~4 QUADRUPED WALKER: four-legged tank-mech, spider-mech, scorpion-walker
- ~4 TRANSFORMER MID-SHIFT: brick mech mid-transformation between chassis + robot
- ~3 POWER-ARMOR / EXO-SUIT: piloted exo-frame with visible pilot inside
- ~3 BIONICLE / BIO-MECHANICAL: CCBS-style organic-curve shell-armor
- ~3 HERO-FACTORY HERO-BOT: sleek streamlined CCBS hero-bot
- ~3 SAMURAI / EASTERN MECH: katana-wielding samurai-coded mech
- ~3 DRONE / UNMANNED: smaller autonomous brick drone-mech
- ~3 INSECTOID / BIOMORPHIC: scarab-mech, mantis-mech, beetle-mech
- ~2 NAVAL / AQUATIC: sub-mech, walker-tank, amphibious
- ~2 FLIGHT-CAPABLE: jet-mech, jump-jet rocket-pack
- ~2 ANCIENT / TEMPLE: stone-titan, brass-clockwork guardian
- ~2 MEDIEVAL / FANTASY-MECH: knight-mech, dragon-mech

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix "<CLASS>: <NAMED IDENTITY>", em-dash, 28-40 word body. Body must describe SNOT/Technic build technique + signature weapon/feature. Touchpoints:
"HUMANOID BATTLE-MECH: IRONCLAD VANGUARD — a towering bipedal brick mech with broad SNOT-plated pauldrons, ball-jointed arms ending in a stud-cannon forearm and a three-fingered grappling-claw"
"QUADRUPED WALKER: STONECRAWLER BASTION — a four-legged brick walker on thick Technic-beam legs braced wide, a central armored hull-pod of layered SNOT panels, a dorsal twin-cannon turret"
"TRANSFORMER MID-SHIFT: AXIOM CONVERTER — a brick mech caught mid-transformation between jet-chassis and robot, SNOT-plated wing-panels folding outward, a single ball-jointed knee braced"

━━━ BANS ━━━
- NO licensed franchise names verbatim (no Gundam / Optimus Prime / EVA-01)
- NO duplicating classes or named-identities
- NO photoreal vocab
- NO mood-only ("epic mech")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with "<CLASS>: <NAME>" + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
