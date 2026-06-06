#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/killer_droid_actions.json',
  total: 200,
  batch: 20,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} KILL-UNIT ACTION descriptions for MechBot's droid-assassin path. Each describes a genderless predatory mechanical kill-unit (mirror-faceplate, optic-cluster, sleek lethal chassis — NOT cyborg-flesh / NOT humanoid-cute / NOT mecha-pilot territory) mid-action — hunt / stalk / fire / strike / execute / scale / ambush / pursue. Think Terminator T-800 / Sarah-Connor T-X / Westworld Hosts hunting / Cyberpunk Adam-Smasher / Apex Revenant / Doom Eternal Cybermancubus / Halo Promethean / Mass Effect Geth-Hunter predatory lineage.

Each entry: 45-65 words. Format: "Mid-[VERB] [position/setup], the [unit-noun] [main action] with [weapon/tool details], [secondary action / target reaction], [environmental texture / blood / debris / lighting accent]."

━━━ THE BAR ━━━
Every entry must read like a CINEMATIC HUNT-PROMO frame — assassin-droid mid-kill or mid-pursuit, target either mid-fall, mid-flee, or about-to-die. Predatory + lethal + cold + precise. NEVER patrol / sentry / overwatch / contemplative / paused. Every entry shows MID-ACTION VIOLENCE or MID-ACTION HUNT.

━━━ VARIETY MANDATE (~15 action-families across the batch) ━━━

- MID-FIRE BARRAGE (sustained-burst long-rifle / heavy MG / dual-pistol sweep, brass cascading)
- MID-SCALE / WALL-CLIMB (clamped to refinery pipe / cliff face / sheer skyscraper, weapon strapped)
- MID-THRUST WRIST-BLADE / VIBRO-BLADE (driving blade through throat / chest / collar from flanking angle)
- AMBUSH MID-EMERGE (from ceiling vent / submerged canal / beneath crashed APC / cathedral rafters)
- EXECUTE-STANCE (silenced pistol pressed to skull / temple, trigger-pull caught, blood-pool)
- MID-LEAP ROOFTOP-PURSUIT (full-extension airborne between rooftops, still firing downward)
- MID-FIRE DUAL-PISTOL SWEEP (spinning crouch, both pistols extended, multiple guards mid-fall)
- MID-STRIKE CHAIN-BLADE OVERHEAD (two-handed vibro-chain on collarbone, sparks exploding, opponent stagger)
- MID-FIRE SNIPER-SHOT (prone on crane-boom / rooftop / parapet, scope-eye locked, target 800m+)
- MID-SPRINT PURSUIT (through night market / freeway / refinery / corporate plaza, target ahead mid-stride)
- MID-EMERGE FROM WATER (rising from canal / harbor / flooded basement, silenced pistol leveled)
- MID-FIRE PLASMA-CANNON (waist-brace into vault door / armored sentry / vehicle, white-hot bloom)
- AMBUSH DROP FROM RAFTER (twelve-meter fall onto patrol, blade plunging into shoulder-joint)
- EXECUTE-STANCE INTIMATE (knife through ribcage twist, target mid-buckle, kill-tally pre-queued)
- MID-FIRE FROM-COVER (leaning out from rubble-wall, controlled 3-round bursts, suppressed rifle)
- MID-SLIDE COMBAT (sliding feet-first across polished floor under incoming fire, firing dual outward)
- MID-CHARGE ROOFTOP-SPRINT (rain-soaked rooftop, weapon-arm extended ahead at edge-target)
- MID-RETRIEVE BLADE (yanking blade from downed sentry's chest, body still twitching)
- MID-INFILTRATE STEALTH (silent corridor approach, suppressed SMG sweep-arc, target unaware ahead)
- MID-DETONATE BREACHING-CHARGE (charge placed mid-twist, droid mid-pivot away, defenders mid-recoil)
- MID-HACK TERMINAL (palm-spike into terminal mid-data-extract, free hand pistol-covering corridor)
- MID-OVERWATCH ASSASSINATE (long-rifle braced on parapet, distant kill-shot mid-recoil-cycle)
- MID-INTERROGATE LETHAL (blade pressed to throat of kneeling captive, demand caught mid-utter, blood-trickle)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. PREDATORY ACTION VERB at start ("Mid-fire / Mid-scale / Mid-thrust / Mid-leap / Mid-execute / Mid-sprint / Ambush mid-emerge / Execute-stance")
2. WEAPON / TOOL specificity (silenced pistol / combat-rifle / wrist-blade / chain-blade / sniper-rifle / plasma-cannon / vibro-knife)
3. TARGET REACTION OR LOCATION ANCHOR (target mid-fall / 800m distant / kneeling courier / rooftop edge / crashed APC / wet asphalt)
4. ENVIRONMENTAL TEXTURE (rain / muzzle-flash / brass-cascade / blood-mist / neon / sodium / wet pavement / crashing glass / sparks)

━━━ ALLOWED NICKNAMES (rotate) ━━━
- killer-droid / assassin-droid / kill-unit / murder-unit / hunter-droid / combat-unit / kill-team-droid / lethal-frame / hunter-frame / predator-class droid

━━━ BANS ━━━

- NO patrol / sentry / scan / overwatch / passive language as the dominant register
- NO cyborg-flesh / human-face / hair / skin language (this is FULLY MECHANICAL)
- NO power-armor squad context (that's power-armor territory)
- NO mecha-pilot scale (this is human-scale predator, not 30m mech)
- NO scrap-weld / rust-tech DNA — droid is POLISHED + DESIGNED + LETHAL
- NO Terminator / T-800 / T-X / Adam Smasher / Revenant / Geth BY NAME (lineage only)
- NO Star Wars / Halo / Mandalorian IP language
- NO contemplative / quiet / studio register — this is HUNT + KILL

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full action description per string. Each starts with a present-participle "Mid-" or "Ambush mid-" or "Execute-stance" construction. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
