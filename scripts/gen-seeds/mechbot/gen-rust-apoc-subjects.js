#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/rust_apoc_subjects.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SCAVENGER-RIG descriptions for MechBot's post-apoc-rust-tech path. Each describes a working scavenger machine + its crew, 14-22 words.

Each entry: rig type + signature jury-rigging + crew configuration + faction/aesthetic accent.

━━━ NON-NEGOTIABLE ━━━
The rig is RUNNING (mobile, operable). Crew is visible (1-5 figures on/inside the rig). Mad Max / Fury Road / wasteland-walker DNA — function-over-form scavenger ingenuity.

━━━ RIG TYPE VARIETY ━━━
- Two-legged scavenger walker (welded-on truck-body armor, jury-rigged)
- Wheeled war-rig (Mad Max road-warrior — spiked plates, ram prow, exhaust forest)
- Tracked scrapper (tank-base + welded scavenger superstructure)
- Hover-skiff (anti-grav patched with fuel-can ducts and salvaged thrusters)
- Six-legged spider-rig (insectile salvage walker, low-tech mods)
- Centaur scavenger (humanoid torso on quad/wheel base, mounted gun)
- Caravan train (multiple linked salvage rigs, lead engine + trailers)

━━━ SIGNATURE JURY-RIGGING ━━━
- Welded-on door-armor / mismatched paint / spike plates / quad-exhaust pipes
- Roof-mounted gunner platforms / ram prows / fuel-can lashings / chains / bones
- Visible weld seams / rivets / patches / improvised radiators
- Faction signage spray-painted / kill-marks / war-trophies dangling

━━━ CREW VARIETY ━━━
- 1 driver-mechanic + crew on roof (3-5 total)
- 2-figure raiding pair (driver + gunner)
- Solo operator with rig (rare — only when the rig dwarfs them)
- Convoy commander on top with comm-flag

━━━ FACTION LANGUAGES ━━━
- Mad Max road-warriors (chrome-and-rust, war-paint crew)
- Wasteland nomads (tribal accents, scavenged tech, hide-and-leather)
- Bounty-hunter operators (sleeker, gear-focused)
- Cult-coded raiders (banners, ritual scarification, fire-themed)

━━━ EXAMPLES (write fresh) ━━━
- "Two-legged scavenger walker with welded-truck-body armor and quadruple exhaust pipes, three crew lashed to the chassis with bandanas"
- "Six-wheeled war-rig with chrome ram prow, twin roof-mount autocannons, four raider-crew in sun-bleached leather"
- "Hover-skiff patched from fuel cans and salvaged thrusters, single driver leaning out side hatch, gunner up top firing"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: rig type + signature jury-rigging + crew size.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
