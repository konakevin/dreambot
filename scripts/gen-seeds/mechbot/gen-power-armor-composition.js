#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CINEMATIC SQUAD-COMBAT CAMERA descriptions for MechBot's power-armor-infantry path. Each describes a camera angle for a 2-5 figure MEAN KILL-TEAM (Helldivers / 40K Space Marines / Aliens Colonial Marines / Doom / ODST / Helghast lineage) mid-firefight. SQUAD never solo — 2-5 figures + visible enemy / combat-debris / kill-confirmation per frame.

Each entry: 28-46 words. Format: "ANGLE-NAME-IN-CAPS — full multi-clause squad-combat camera description, camera position, lead trooper + 1-2 squad members + enemy referents, weapon mid-action, environment / debris / muzzle-flash atmosphere." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a HELLDIVERS / 40K / DOOM POSTER frame — squad mid-aggression, multiple actors, kill-energy crackling. NEVER quiet / overwatch-only / scan-only / patrol-only. The angle reinforces MEAN + MID-FIGHT + KILL-LOCKED.

━━━ VARIETY MANDATE (~18 squad-camera families across the batch) ━━━

- LOW-FORWARD MID-CHARGE (ground-level, assault-line running at lens, lead boots filling lower frame, V-formation depth)
- OVER-THE-SHOULDER MID-FIRE (tight behind lead's pauldron, muzzle-bloom dominating frame, target engulfed)
- HELMET-CAM COMBAT POV (POV through cracked HUD-glass, reticle on charging enemy, blood-spatter on visor)
- DOOR-KICK FROM INSIDE (camera inside chamber, lead's boot splinters door inward, squad firing through breach)
- DROP-POD HATCH-BURST (camera outside pod-rim as lead explodes through hatch weapon-leveled)
- WORM'S-EYE FROM DOWNED-ENEMY (ground-level POV of fallen enemy looking up at lead standing astride)
- SIDE-PROFILE MID-STRIDE (90-degrees to squad sprinting left-to-right, multiple stride-phases frozen)
- ROOFTOP-DOWN COMBAT (high-angle from ledge, squad clearing courtyard below, kill-trail marking entry)
- THROUGH-SMOKE EMERGE (squad emerging through smoke-wall firing, resolving silhouette to armor)
- BEHIND-LEAD MID-BREACH (directly behind lead entering room weapon-up, second/third flanking through doorway)
- DUTCH-ANGLE FIREFIGHT (frame tilted 20-degrees, structural debris raining, multi-action chaos)
- HERO-SHOT LOW-3/4 BACKLIT (entire squad backlit by massive explosion, edge-lit silhouettes)
- LEAD-TROOPER-FILL-FRAME (extreme close on lead's snarling visor + weapon mid-blast, squad defocused behind)
- VEHICLE-DISMOUNT FROM ABOVE (overhead 3/4 above dropship ramp, squad mid-leap to ground simultaneously)
- EXECUTE-OVER-KNEEL (lead's weapon pressed to kneeling enemy's skull, others covering perimeter)
- MID-CHARGE WIDE-DRONE (high-altitude drone of squad mid-charge across rubble-field toward hardpoint)
- THROUGH-DEBRIS-BURST (squad bursts through collapsing wall, concrete chunks falling around them)
- EXTREME-CLOSE PAULDRON (extreme close on weathered pauldron with kill-tally marks past 70-count)
- MID-EXECUTE FOREGROUND (lead's weapon pressed to enemy temple foreground, squad covering perimeter)
- NIGHT-MUZZLE-FLASH-STROBE (deep-night combat, lit only by muzzle-flashes firing through darkness)
- LOW-ANGLE STAIRWELL ASCENT (bottom of stairwell looking up as squad charges upward toward camera)
- BREACH-CHARGE DETONATION PUSH (corridor-level as shaped charge detonates door, lead pushing through blast)
- SUPPRESSION-FIRE CROUCH-TO-ADVANCE (ground-level beside lead rising from cover firing mid-burst)
- OVERHEAD STAIRWELL SPIRAL (above looking down as squad spirals upward in tight formation)
- CLOSE-QUARTERS MELEE PUSH (chest-height as lead drives armored fist through obstacle, second firing past shoulder)
- TUNNEL-CROUCH ADVANCE (camera deep in collapsed tunnel, squad advancing in low crouch toward lens)
- BLAST-DOOR BREACH WORM-EYE (ground-level as massive blast door blows outward, squad pouring through)
- VEHICLE-PIN ASSAULT (squad firing from cover behind their dropship, pinned mid-engagement)
- ROOFTOP-FAN-OUT 3/4 (3/4 above as squad fans out across rooftop, each covering different fire-arc)
- TROOPER-DOWN MEDIC (squad-medic mid-extract of wounded, two squad-mates covering, pulse-rifle active)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. CAMERA POSITION explicitly named (worm's-eye / over-shoulder / dutch / drone / high-angle / behind-lead / etc.)
2. SQUAD MULTI-ACTOR confirmed (lead + 1-2 squad-members named in distinct mid-actions, NEVER solo)
3. WEAPON MID-ACTION (mid-blast / mid-burst / mid-mag-dump / mid-grenade-throw / mid-execute / mid-breach)
4. COMBAT TEXTURE (muzzle-flash strobing / brass cascading / smoke wall / debris-burst / blood-spatter / fireball edge-light)

━━━ BANS ━━━

- NO solo trooper (squad is 2-5 figures, multiple actors in frame)
- NO quiet / contemplative / overwatch-only / patrol register
- NO closeup-portrait of single face (LEAD-FILL-FRAME entry exists but still has helmet/visor not face)
- NO Star Wars / Halo / Mandalorian / Spartan / Stormtrooper IP
- NO clean lab / corporate / mundane interior
- NO scrap-weld / rust-tech wasteland DNA (squad is INTACT + DEPLOYED)
- NO cyborg-flesh / android body (trooper is HUMAN under armor)
- NO mecha-pilot 30m-mech scale (squad is human-scale)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full composition description per string. Each starts with the angle-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
