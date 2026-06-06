#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/killer_droid_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CINEMATIC ACTION-CAMERA descriptions for MechBot's droid-assassin path. Each describes an angle for a genderless predatory mechanical KILL-UNIT mid-hunt or mid-kill — sleek lethal chassis, mirror-faceplate, optic-cluster, NOT cyborg-flesh. The camera angle must SELL THE PREDATION — Terminator / Westworld / Cyberpunk Adam-Smasher / Apex Revenant / Doom Eternal Cybermancubus lineage.

Each entry: 28-46 words. Format: "ANGLE-NAME-IN-CAPS — full multi-clause action-camera description, camera position, droid framing (FULL-BODY action — NOT closeup-portrait), weapon / target / environment, the resulting kill-energy mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a FREEZE-FRAME from a hunt-thriller — kill-unit caught MID-ACTION in dynamic composition. FULL-BODY action angles preferred (NOT closeup-portraits — closeup is cyborg-woman territory). The angle reinforces predator-locked-on-target energy.

━━━ VARIETY MANDATE (~18 action-camera families across the batch) ━━━

- LOW-FORWARD MID-CHARGE (ankle-level looking up as droid sprints at lens, muzzle-flash strobing)
- OVER-SHOULDER MID-FIRE (locked behind pauldron looking down weapon-barrel at distant target)
- HELMET-CAM SCOPE-EYE POV (through fractured HUD-faceplate, reticle locked, weapon-barrel bisecting frame)
- WORM'S-EYE FROM DOWNED-TARGET (flat on asphalt looking up at droid standing astride fallen body)
- SIDE-PROFILE MID-LEAP (90-degrees as droid launches across rooftop gap, dual pistols still firing)
- HIGH-ANGLE PERCH-DOWN (from droid's tower-crane perch, target plaza thirty floors below)
- THROUGH-SMOKE EMERGE (droid walking out of white-phosphorus smoke firing one-handed combat-shotgun)
- DUTCH-ANGLE FIREFIGHT (frame tilted 22-degrees, mid-pivot in collapsed server-farm, muzzle-flash strobing)
- WALL-CLIMB UPWARD-LOOK (camera at base looking up sheer skyscraper face, droid scaling toward roof)
- MID-STRIKE INTIMATE COMBAT (wide frame as droid drives forearm-blade up through guard's chin)
- THROUGH-WINDOW EXTERIOR LURK (camera inside office looking out at droid on ledge in rain)
- FROM-COVER REVEAL (rubble-wall edge as droid leans out firing burst-rifle in 3-round strings)
- LOW-WIDE PURSUIT (ground-level wide-angle, droid sprinting after target in alley)
- HIGH-ANGLE TROPHY-STANCE (bird's-eye looking down at droid standing over crumpled sentry)
- OVER-SHOULDER STAIRWELL DESCENT (behind droid descending fire-stair in deep crouch, suppressed SMG)
- SIDE-PROFILE WALL-BREACH (90-degrees as droid punches through drywall mid-stride, plaster cloud)
- LOW-FORWARD ROOM-ENTRY KICK (floor-level inside as droid boot-kicks door inward)
- FROM-ABOVE CRAWL-SHAFT EXIT (looking down into vent as droid drops silently from ceiling duct)
- DUTCH-ANGLE SPRINT-PAST (15-degrees tilted, droid sprints past lens at full speed, motion-blur)
- THROUGH-GRATE EXTERIOR LURK (inside drainage tunnel through rusted grate at droid in alley)
- WORM'S-EYE CEILING-DROP (flat on boardroom table as droid crashes through skylight)
- OVER-SHOULDER BRIDGE-CROSSING (behind droid crossing wind-hammered suspension bridge in crouch)
- SIDE-PROFILE COMBAT-SLIDE (90-degrees at knee height, droid sliding feet-first across hangar floor)
- HIGH-ANGLE ROOFTOP-SPRINT (mounted high looking down, droid sprinting across rain-soaked rooftop)
- FROM-COVER KNIFE-RETRIEVE (crate-edge as droid yanks blade from downed sentry, free hand pistol-covering)
- POV-FROM-TARGET-FALLING (POV from target mid-fall backward, droid lowering smoking pistol from frame above)
- THROUGH-FOREGROUND-FOLIAGE (camera behind jungle vegetation, droid stalking in mid-distance unaware)
- TRACKING-LATERAL CHASE-CAR (camera matching speed with droid sprinting along moving train roof)
- LOW-ANGLE BLOOD-POOL FOREGROUND (camera at floor with blood-pool foreground, droid standing past it)
- THROUGH-SHATTERED-GLASS (camera inside through shattered window-glass, droid entering through breach)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. CAMERA POSITION explicitly named (worm's-eye / over-shoulder / dutch-angle / high-angle / side-profile / through-X / POV-from-Y)
2. DROID MID-ACTION confirmed (mid-fire / mid-leap / mid-strike / mid-emerge / mid-sprint / mid-execute)
3. WEAPON or TARGET ANCHOR (rifle barrel / dual pistols / forearm-blade / silenced SMG / kneeling captive / target 300m away)
4. ENVIRONMENT TEXTURE (rain / muzzle-flash / debris-cloud / neon / smoke / wet asphalt / shattered glass / fluorescent strobe)

━━━ BANS ━━━

- NO closeup / portrait-bust framing (that's cyborg-woman territory) — droid is FULL-BODY action
- NO cyborg-flesh / human-face anatomy (droid is FULLY MECHANICAL)
- NO patrol / sentry / scan / overwatch / contemplative register — predator MID-ACTION only
- NO Terminator / T-800 / T-X / Adam Smasher / Geth / Promethean BY NAME
- NO Star Wars / Halo / Mandalorian IP
- NO mecha-pilot context (this is human-scale predator, not 30m mech)
- NO scrap-weld / rust-tech DNA
- NO power-armor squad context

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full action-camera description per string. Each starts with the angle-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
