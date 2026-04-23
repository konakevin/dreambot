#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/army_men_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} GREEN-ARMY-MEN BATTLE-DIORAMA LANDSCAPE scene descriptions for ToyBot's army-men path. Classic Bucket-O-Soldiers / Toy-Story-2nd-battalion single-pose molded-plastic toy-soldier aesthetic on handcrafted WWII-diorama or backyard-epic practical sets. Cotton-ball smoke, flash-bulb explosion-bursts, dramatic spotlight lighting.

Each entry: 15-25 words. ONE specific army-men battle-diorama landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty battle-diorama, NO soldiers. Handcrafted WWII-terrain / backyard-epic environment (trenches / bunkers / blown-out farmhouses / beach-landing-craft-wreckage / foxholes / battlefields) IS the subject.
- ~70% Type B — ONE off-center molded-plastic single-pose toy-soldier (army-green / olive-drab / tan-desert / grey / sand variants, ~2-inch scale, visible vertical mold-seam, oval connector-base, fixed cast-in-plastic pose) in a specific body-shaping pose within a battle-diorama. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / prone / lying / leaning / mid-stride / mid-charge / reaching / climbing / leaping / bent / tilted / dangling). Diorama terrain dominates frame.

━━━ CONTEXT DNA ━━━
- Battle environments: WWII beach-landing diorama / bunker-defense / sandbagged trench / jungle-patrol / tank-assault-field / bombed-out-city street / rooftop-sniper / desert-ambush dune / carpet-battlefield / plastic-parachute-drop / sandbox-beachhead / prone-sniper-rooftop / demolition-blast / flamethrower-farmhouse / command-tent / medic-rescue / bayonet-no-man's-land / amphibious-boat-resin / foxhole-dirt / tank-commander / hillside-machine-gun-nest / rope-bridge / battlefield-aftermath-grave / flag-raising-crater / arctic-station / subway-tunnel / desert-jeep-scouting
- Soldier DNA: classic single-pose molded-plastic with solid monochromatic color (army-green / olive-drab / tan-desert / grey-Wehrmacht / sand-Marine), visible vertical mold-seam, oval connector-base attached underfoot, helmet/rifle/backpack/canteen molded as one piece, fixed cast-in-plastic pose (crouch-and-fire / bayonet-charge / binocular-spot / bazooka-shoulder / radio-operator / grenade-throw / flamethrower / flag-bearer / prone-rifleman / mine-sweeper)

━━━ MUST-HAVE ━━━
- Reference MOLDED-PLASTIC / single-pose / oval-base / mold-seam / toy-soldier / backyard-diorama LANGUAGE
- Classic Toy-Story / Saving-Private-Ryan-with-toys cinematic framing
- Type A = zero soldiers. Type B = exactly ONE toy-soldier, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type

━━━ BANNED ━━━
- NO centered-hero soldier
- NO multi-soldier entries
- NO passive verbs
- NO articulated / action-figure language — SINGLE-POSE molded-plastic only
- NO real military-IP unit-names (82nd Airborne / Navy SEAL / Green Beret)
- NO graphic gore / spraying-blood

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
