#!/usr/bin/env node
/**
 * POWER_ARMOR_ALLIED_TECH — friendly combat-bots / drones / walkers /
 * vehicles supporting the MEAN KILL-TEAM squad. Helldivers 2 / Aliens
 * Colonial Marines / Helghast / ODST / WH40K register. Drone / walker /
 * mech / dog-bot / armored cart at squad-shoulder mid-combat. 50-75 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_allied_tech.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ALLIED-TECH entries for MechBot's power-armor-infantry path — friendly combat tech (drone / walker / mech / dog-bot / armored vehicle) supporting the MEAN KILL-TEAM squad mid-combat. Helldivers 2 / WH40K Space Marines / Aliens Colonial Marines / Killzone Helghast / ODST / Mandalorian / Doom Eternal register. Title-caps prefix THEN " — " separator THEN 50-75 word description.

━━━ THE BAR ━━━
Every entry is ONE friendly combat tech-platform mid-combat-action alongside or behind the marines. Names the SIZE-RELATIVE-TO-SQUAD (knee-high / chest-height / head-height / 2x-marine / 4-meter biped / dog-sized), the ACTION (mid-fire / mid-pounce / mid-launch / mid-stride / mid-defense), and includes detail tags (scratched paint, stenciled unit-number, kill-streak tally, hydraulic-hiss, sparks). Drone / walker / mech / dog-bot / armored vehicle.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"HOVER COMBAT-DRONE ARMED — chest-height armored hover-drone flanking the squad's right shoulder mid-fire, twin rotary-cannon underslung spitting overlapping brass streams at off-frame target, red sensor-eye pulsing with each burst, scorched hull-plating cratered from prior contact, kill-streak tally scratched in rows of five along the nose."
"BIPED COMBAT MECH 2X-MARINE — 4-meter biped combat mech pivoting mid-step alongside marines, left arm chain-cannon mid-fire in sustained burst, right arm missile-pod tube-cluster smoking from recent launch, scratched matte-charcoal plating with unit-skull stamped on chest-pectoral, hydraulic-actuator rods gleaming at hip-joint under kill-zone lighting."
"ARMORED COMBAT-DOG ATTACK — dog-sized quadruped armored attack-bot mid-pounce onto downed enemy combatant, harness-mounted twin auto-pistols firing mid-leap, all four legs extended at apex, scratched matte-black plating with kill-streak tally ladder etched above left shoulder-plate, snarl-LED display blazing red on face-plate."

━━━ VARIETY MANDATE (distribute across these tech-platform categories) ━━━

- ~5 HOVER-DRONE / FLYING (combat-drone fire / sentry-drone scan / recon-drone hover / micro-drone swarm / heavy-strike drone / VTOL drop-pod / hunter-killer drone / supply-drone descending / arc-projector drone)
- ~5 QUADRUPED / DOG-BOT (armored dog-bot mid-pounce / sentry-quadruped patrol / mule-quadruped carrying ammo / heavy-quadruped with mortar / scout-quadruped flank / spider-walker grappling / six-legged spider-bot)
- ~4 BIPED COMBAT MECH (biped chain-cannon-arm / biped missile-pod-arm / biped power-fist / biped sniper-rifle / biped flamer-arm / biped grenade-launcher / biped close-combat shield + pile-driver)
- ~3 WALKER QUADRUPED-LARGE (head-height walker MG / 4-legged walker auto-cannon / scout-walker recon / striker-walker missile-rack / heavy-walker plasma-cannon)
- ~3 TRACKED PLATFORM (tracked rocket-platform / tracked rotary-cannon / tracked siege-mortar / tracked shield-projector / mini-tank rolling / supply-tractor armored)
- ~3 VEHICLES — ARMORED TRANSPORT (APC drop-ramp open / IFV mid-fire from turret / dropship descending / fast-attack hover-bike / armored half-track / armored crawler chassis)
- ~3 EXOTIC / SPECIALIST (mortar-platform deployed / shield-generator drone projecting wall / sniper-spotter drone / cloaked recon-bot uncovering / artillery-spotter loitering / EMP-pulse drone discharging)
- ~3 STATIONARY / DEPLOYED (deployed auto-turret / mounted heavy-MG with operator / shield-pylon active / smoke-screen generator / mine-laying drone retreating)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS specify SIZE-RELATIVE-TO-SQUAD (knee-high / chest-height / head-height / 2x-marine / dog-sized / 4-meter / etc.).
- ALWAYS specify POSITION relative to squad (flanking right shoulder / at squad-rear / leading point / behind cover).
- ALWAYS mid-combat-action verb (mid-fire / mid-launch / mid-pounce / mid-stride / mid-pivot).
- ALWAYS include 1-2 weathered-tech detail tags (scratched paint / kill-tally / stenciled number / hull-pitting / hydraulic-hiss / brass-shell-streams).
- Body is 50-75 words.

━━━ BANS ━━━
- NO solo unit — always alongside the squad ("the squad", "the marines", "the kill-team").
- NO procedural / professional / scan / patrol-only register — these are MEAN KILL-TEAM combat support.
- NO friendly-civilian language — combat tech only.
- NO modern brand-names (no Honeywell / Boeing / etc.).
- NO photoreal language — render-friendly description register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
