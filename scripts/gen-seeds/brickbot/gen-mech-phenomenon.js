#!/usr/bin/env node
/**
 * BRICKBOT_MECH_PHENOMENON — built mech-combat drama (muzzle-flash, explosion).
 * Audit 2026-06-05: 45 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PHENOMENON entries for BrickBot's mech path — ONE big built mech-combat event in a brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC combat event (muzzle-flash, missile-launch, explosion-debris, energy-shield-dome, plasma-beam, ejecting-canopy, etc.) AND shows how it's BUILT (trans-orange flame-elements, trans-yellow round-plates, trans-cyan hex-plate dome, etc.). Reads BRICK + cinematic.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 WEAPON-FIRE: muzzle-flash, plasma-beam, laser-bolt, tracer-streak, EMP-burst
- ~5 EXPLOSION / IMPACT: explosion-debris, missile-impact, armor-shear, brick-fragmentation
- ~4 SHIELD / DEFENSE: trans-cyan energy-shield dome, trans-purple force-field, deflector spread
- ~4 MISSILE / ROCKET: rocket-launch, missile-spread, vapor-trail, contrail-arc
- ~3 ENGINE / THRUSTER: trans-orange jet-blast, vapor-vent, exhaust-trail
- ~3 SMOKE / FIRE: black-smoke column, fire-pillar, ash-cloud
- ~3 EJECTION / WRECKAGE: ejecting-canopy, downed-mech wreckage, broken-limb mid-fall
- ~3 CHARGE-UP / PRE-FIRE: weapon-charge trans-glow, capacitor-spool, plasma-prep
- ~2 BARRIER / WALL: smoke-screen, dust-cloud, debris-curtain
- ~2 EARTHQUAKE / GROUND: ground-rumble, dust-rise, baseplate-shatter
- ~1 EM-PULSE shockwave
- ~1 NANO-SWARM dispersal
- ~1 KAIJU breach-emergence

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE. Touchpoints:
"CANNON MUZZLE-FLASH — a built burst of trans-orange flame-elements + trans-yellow 1×1 round-plates + a trans-clear shockwave-ring at the cannon-muzzle, spent-shell tile-plates ejecting"
"EXPLOSION-DEBRIS — scattered dark-bley armor-tiles + trans-orange flame-elements + cotton-smoke burst from a struck hull-point, fragments mounted on clear rods mid-fling"
"ENERGY-SHIELD DOME — a trans-cyan + trans-clear hex-plate dome arcing up on the mech's forearm, deflected trans-bolt bar-elements scattering off its curved surface"

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs ("explodes thunderously")
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
