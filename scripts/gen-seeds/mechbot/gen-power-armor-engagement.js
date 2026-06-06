#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_engagement.json',
  total: 200,
  batch: 15,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ALWAYS-ON ENGAGEMENT-NARRATIVE descriptions for MechBot's power-armor-infantry path. Each describes a full multi-actor combat scene where the kill-team is mid-engagement — Helldivers 2 / WH40K Space Marines / Aliens Colonial Marines / Doom Eternal / Starship Troopers / ODST / Helghast lineage. The squad and the ENEMY (humanoid combatants, alien creatures, mechanical drones, armored vehicles) are BOTH visible in mid-action. Every entry is a self-contained MOVIE-POSTER COMBAT FRAME.

Each entry: 90-130 words. Format: "ENGAGEMENT-NAME-IN-CAPS — comma-separated multi-clause description naming squad actors mid-action AND enemy actors mid-action AND environmental destruction AND collateral combat-debris. Each clause moves a different combat element."

━━━ THE BAR ━━━
Every entry is a SAVED FREEZE-FRAME from a kill-team firefight movie poster — multiple actors, multiple actions, multiple kill-confirmations, environmental destruction, atmospheric chaos. Squad reads MEAN + AGGRESSIVE + KILL-LOCKED. NEVER quiet / contemplative / overwatch-only / scan-only / patrol-only. Every entry must have at LEAST 3 squad members mid-action AND at LEAST 3 enemy actors mid-action AND environmental destruction/ammunition/blood.

━━━ VARIETY MANDATE (~16 engagement scenarios across the batch) ━━━

- WAVE-DEFENSE HORDE (40+ enemy infantry mid-charge, squad holding shattered barricade)
- HOT-LZ ASSAULT (drop-pod arrival, enemy defenders in fortified emplacements, AA-turret mid-rotate)
- URBAN-CLEARANCE FIREFIGHT (block-clearance, sniper above mid-fire, defenders in flooded alley)
- TRENCH-CHARGE MASSACRE (leap into enemy trench, defenders mid-rise mid-fire below)
- VEHICLE-AMBUSH EXECUTION (armored convoy on mountain road, APC fireball, turret mid-rotate)
- BREACH-AND-CLEAR HARDPOINT (demo-blown door, defenders mid-fall from frag-burst, smoke pouring out)
- CREATURE-SWARM REPEL (alien predator-horde mid-charge across scorched flatland, flame-thrower arc)
- CIVILIAN-EXTRACTION UNDER FIRE (panicked civilians fleeing through burning market, enemy mid-pursuit)
- AERIAL-SUPPORT INBOUND (friendly gunship overhead unleashing rotary + rockets, ground enemies mid-fall)
- BUILDING-COLLAPSE COMBAT (artillery detonates adjacent structure, defenders mid-fall through floors)
- PURSUIT-EXECUTION RUN (chasing fleeing enemy infantry through collapsed district, kills mid-flight)
- DROP-POD ASSAULT MULTIPLE (5+ friendly pods slamming down, squad emerging under fire)
- DEFENSIVE OVERWATCH WITH VEHICLES (friendly walkers on street below, enemy infantry mid-charge)
- NIGHT-RAID MASSACRE (enemy encampment, defenders mid-wake mid-resist, incendiaries igniting tents)
- FOG-WAR FLANK-AMBUSH (motorized patrol caught in smoke between squad and allied element)
- ROOFTOP-SNIPER COUNTER (squad vs enemy sniper-team across plaza, counter-fire and roof-collapse)
- TUNNEL-CLEARANCE PUSH (subway tunnel firefight, defenders behind overturned rail-car, ricochets)
- HIVE-ASSAULT EXTERIOR (alien hive structure, chitin creatures mid-emerge from spawn-pits)
- BUNKER-BLOWN-OUT-FACADE (shattered concrete fortification, defenders mid-collapse with falling masonry)
- ARMORED-CHARGE INTERCEPT (enemy heavy walker mid-charge intercepted by squad krak-grenades)
- BREACHING-CHARGE BLOWN (door demo just detonated, squad pouring through, defenders mid-recoil)
- LANDING-ZONE WAVE-2 (second wave dropships landing, mass enemy charge across hot LZ)
- EVAC-UNDER-FIRE (squad covering wounded extract to Valkyrie, enemy mid-pursuit on heels)
- COMMS-RELAY DEFENSE (squad defending commsrelay against enemy demolitions team, charges mid-throw)

━━━ MUST INCLUDE per entry (CHECKLIST — all 5) ━━━
1. 3+ SQUAD MEMBERS mid-distinct-actions (lead mid-fire X / second mid-grenade-throw / third mid-execute / fourth mid-reload)
2. 3+ ENEMY ACTORS mid-distinct-actions (mid-charge / mid-fall / mid-fire / mid-flee / mid-recoil)
3. ENVIRONMENTAL DESTRUCTION (concrete dust, building collapse, fireball, blast-crater, smoke columns)
4. COMBAT DEBRIS (spent brass cascading, blood-spatter zones, body-piles, weapon-fragments, ammo-belt links)
5. ATMOSPHERIC TEXTURE (smoke columns / muzzle-flash strobing / tracer-walls / blast-haze / phosphorus)

━━━ ACTION VERBS (lean heavily on these) ━━━
- mid-fire / mid-fire-rotary / mid-mag-dump / mid-burst / mid-blast
- mid-charge / mid-sprint / mid-leap / mid-vault / mid-roll
- mid-execute / mid-strike / mid-thrust / mid-vault-over / mid-trample
- mid-fall / mid-collapse / mid-recoil / mid-jerk / mid-spasm
- mid-grenade-throw / mid-RPG-fire / mid-thermite-drop / mid-flame-thrower-arc / mid-frag-burst
- mid-reload / mid-cover / mid-suppress / mid-flank / mid-pivot
- mid-bail / mid-jackknife / mid-detonate / mid-fireball / mid-collapse-tier

━━━ BANS ━━━

- NO procedural / overwatch / scan / patrol / advance language as the DOMINANT register (Kevin's diagnosis killed this on legacy)
- NO solo trooper — squad is 2-5 actors minimum, 3+ actively engaged
- NO contemplative / quiet / studio / static
- NO Star Wars / Halo / Mandalorian / Spartan / Stormtrooper IP
- NO closeup / portrait framing language
- NO clean-corporate / lab / library / mundane interior
- NO scrap-weld bush-fix DNA — squad is INTACT + DEPLOYED
- NO single-action entry — every entry is MULTI-ACTOR MULTI-ACTION

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full engagement narrative per string. Each starts with the scenario-name in CAPS, em-dash, then the body. Comma-separated phrases inside the body. 90-130 words per entry.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
