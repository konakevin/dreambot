#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/gi_joe_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} GI-JOE-ERA PLAYSET LANDSCAPE scene descriptions for ToyBot's gi-joe path. 3.75-inch articulated-commando action-figure playset dioramas — iconic plastic military vehicles (tank / jeep / assault-chopper / hoverbike / attack-cruiser), Saturday-morning-cartoon-serial military-toy DNA. Non-IP — archetype only.

Each entry: 15-25 words. ONE specific GI-Joe-era playset landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty GI-Joe-era playset diorama, NO commandos. Iconic plastic-vehicle-filled playset or terror-organization fortress environment IS the subject.
- ~70% Type B — ONE off-center 3.75-inch articulated-commando action-figure (swivel-waist / ball-joint arms / rubber-band-waist / hand-painted multicolor commando wardrobe) in a specific body-shaping pose within a GI-Joe-era playset. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / prone / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling / rappelling). Playset dominates frame.

━━━ CONTEXT DNA ━━━
- GI-Joe-era playsets: terror-organization-volcano-fortress / motor-pool-garage / arctic-ice-station / jungle-base / missile-silo-launch-bay / submarine-deck / aircraft-carrier-deck / desert-base-with-radar / commando-HQ-war-room / holotable-briefing-room / space-station-platform / swamp-ambush-dock / rope-bridge-collapse / control-room-console / terror-holding-cell / water-tower-overwatch / catwalk-gantry / cliff-rope-extraction / weapons-locker / demolitions-timer-reactor / motor-speed-chase-desert / cave-lair / satellite-dish-rotating / barbed-wire-obstacle-course
- Commando DNA: 3.75-inch articulated action-figure, swivel-waist / ball-joint arms / rubber-band-waist construction, hand-painted multicolor commando wardrobe (camo fatigues / berets / goggles / bandannas / chest-rig / dogtags / ammo-belts). Archetype: masked-operative / mohawk-soldier / ninja-operative (black or white armor + face-mask) / gruff-sergeant (beret) / demolitions-expert / pilot-ace / jungle-specialist / arctic-specialist / tank-commander — OR masked-terror-organization-trooper (silver-visor helmet + armored jumpsuit) / chrome-faceplate-commander / hooded-cloak-commander / snake-motif-commander

━━━ MUST-HAVE ━━━
- Reference ARTICULATED / 3.75-inch / commando / action-figure / hand-painted / plastic-playset LANGUAGE
- 80s military-toy Saturday-morning-cartoon-serial energy
- Type A = zero commandos. Type B = exactly ONE commando, OFF-CENTER, body-shaping pose-first
- Specific code-name archetype (masked-operative / ninja-operative / gruff-sergeant — never "soldier")
- Aggressive dedup: max 4 per pose-family, max 2 per playset-type

━━━ BANNED ━━━
- NO centered-hero commando
- NO multi-figure entries
- NO passive verbs
- NO real IP names (Duke / Cobra Commander / Snake Eyes / Stormshadow / Destro / Scarlett / Flint / Roadblock / Serpentor)
- NO single-pose plain green-army-men language — those belong to army-men path
- NO graphic gore

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
