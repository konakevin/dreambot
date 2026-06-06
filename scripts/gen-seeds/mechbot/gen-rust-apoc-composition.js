#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/rust_apoc_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MAD-MAX CHASE-CAMERA descriptions for MechBot's post-apoc-rust-tech path. Each describes a specific camera angle for a SCAVENGER BUSH-FIX RIG (jury-rigged scrap-welded chimera with crew 1-5 visible) RUNNING or BEING-BUSH-FIXED across wasteland. Mad Max Fury Road / Borderlands / Tank Girl / Death Stranding wasteland / Twisted Metal / Carmageddon / Fallout-raider lineage.

Each entry: 30-50 words. Format: "ANGLE-NAME-IN-CAPS — full multi-clause chase-camera description, camera position relative to rig, what fills frame, crew visibility, dust / smoke / scrap-armor texture, wasteland horizon, motion-blur / freeze-frame energy." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a MAD MAX FURY ROAD frame — rig in motion (or being-bush-fixed mid-action), crew visible, dust-cloud trailing, wasteland horizon receding. The angle reinforces RUNNING / CHASING / SCAVENGING energy.

━━━ VARIETY MANDATE (~16 chase-camera families across the batch) ━━━

- LOW-CHASE FROM ROAD (camera flush against hardpan as rig thunders past, rear axle dominating)
- OVER-THE-BONNET POV (bolted to spike-ram prow looking forward, hood-ornament foreground)
- AERIAL DRONE FOLLOW (overhead tracking from above-right, scrap-roof reading below, dust-trail extending)
- PARALLEL-RUN-WITH-RIG (camera car matching speed alongside driver's side, crew leaning from hatches)
- DRIVER-OUT-WINDOW (driver half-hanging from cab, goggles, rag-wrapped face, wasteland streaking past)
- GUNNER-ON-ROOF POV (eye-level from roof-gunner position, welded-pipe heavy-gun barrel foreground)
- REAR-OF-RIG ASCENDING (mounted at rear-corner looking back, pursuit-buggies closing through dust)
- CRASHED-VS-RUNNING WIDE (burning wreck silhouetted foreground, hero rig running midground)
- TOTEM-ANTENNA FOREGROUND (war-banner pole foreground with bone-trophies, rig extending rightward)
- GANG OF RIGS CONVOY (wide low-angle, five mismatched rigs running in loose arrow, hero leading)
- CHASING-LEAD POV (handheld POV from pursuing cab, hero rig ahead obscured by exhaust)
- PIT-CREW MID-REPAIR (rig stopped in gulch, four crew swarming repair, dust-storm wall behind)
- JUMP-MID-AIR (rig fully airborne off shale-ridge ramp, undercarriage visible, crew gripping cage-bars)
- DUSK-SILHOUETTE WIDE (hero rig edge-lit amber-orange against burning sunset, antenna-spines silhouette)
- NIGHT-FIRE-LIT (total darkness, crew lit only by rear-deck fire-barrel, silhouettes clinging to sides)
- WHIRLWIND CIRCLE (camera spinning around rig as dust-devil tears through, crew bent shielding)
- GUN-MOUNT REVERSE POV (camera at rear looking forward across deck, gun-mount + driver's cab visible)
- WIDE-VALLEY APPROACH (high-vantage from canyon lip looking down at rig descending switchback)
- CHASE-RAM IMPACT (frozen-motion of two rigs colliding, spike-plates locking, debris exploding)
- SUNSET-OVER-THE-FLATS (extreme wide at ground level, rig tiny crawling shape in deep distance)
- HOOD-SCOOP CLOSE PURSUIT (bolted just above hood-scoop, pursuit rig reflected in cracked wing-mirror)
- BELLY-PASS UNDERCARRIAGE (ground-level looking straight up as rig passes overhead, undercarriage exposed)
- CREW-CLING SIDE-SWIPE (alongside rig at shoulder height, crewmember hanging off welded handhold)
- SMOKE-STACK ASCENDING (camera starts low at exhaust, tilts up as smoke columns climb)
- FUEL-DRUM ROLL-LOSS (mid-chase rear-angle as lashed fuel-drum breaks free, pursuer swerving)
- WHEEL-WELL-DROP (camera dropped low to wheel-well, tire kicking spray, suspension articulating)
- WINDSCREEN-INTERIOR (POV from driver's seat through cracked windscreen, wasteland streaking, crew shouting)
- NIGHT-HEADLIGHT-CHASE (low rear-angle, dual pursuit headlight cones cutting through ground-dust toward rig)
- CONVOY-OVERHEAD-FORMATION (drone POV directly above five-rig wedge, dust-trails braiding into one)
- SIDE-MIRROR-PURSUIT-REFLECTION (camera POV from rig's cracked side mirror, pursuer visible in reflection)
- AERIAL-WIDE-SUNDOWN (high aerial of rig threading dry-lake bed, sunset color saturated, scale prover)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. CAMERA POSITION explicitly named (low-chase / over-bonnet / aerial-drone / parallel-run / driver-out-window / etc.)
2. RIG MOTION OR REPAIR confirmed (thundering / chasing / mid-jump / pit-stop welding / mid-collision / mid-bush-fix)
3. CREW or RIG-DETAIL ANCHOR (crew leaning / gunner mid-fire / driver goggles / spike-ram prow / war-banner totem / welded armor)
4. WASTELAND TEXTURE (dust-cloud / sand-storm wall / burning sunset / cracked hardpan / salvage-yard / scrap-yard horizon)

━━━ BANS ━━━

- NO clean polished chassis (rig is SCRAP-WELD + RUST + sun-bleached)
- NO interior / lab / hangar / corporate
- NO Mad Max / Furiosa / Immortan / Doof Wagon BY NAME (lineage DNA only)
- NO Star Wars / Halo / Mandalorian IP
- NO quiet / contemplative / studio register — wasteland is HARSH + RUNNING
- NO modern military combat (power-armor territory)
- NO predator-class / blade-silhouette / fang-prow (that's skyships)
- NO polished chrome dominant — chrome appears DULLED + scratched only

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full composition description per string. Each starts with the angle-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
