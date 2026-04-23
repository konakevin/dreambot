#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/army_men_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} GREEN-ARMY-MEN scene descriptions for ToyBot's army-men path — classic single-pose molded-plastic toy soldiers (the iconic bag-of-a-hundred Bucket-O-Soldiers / Toy Story 2nd Battalion DNA). Bright-green (or tan / grey) monochromatic rigid-plastic figures on attached oval bases, fixed in a single cast-in-plastic action pose — crouch-and-fire, bayonet-charge, binocular-spotting, radio-operator, bazooka-shoulder, grenade-throw, flamethrower, flag-bearer, prone-rifleman, mine-sweeper. Every scene is cinematic WWII-toy-soldier storytelling in a handcrafted practical-set diorama or real-world backyard-epic setting.

Each entry: 18-28 words. ONE specific green-army-men scene with multiple posed plastic soldiers mid-action on a built-up miniature set or oversized real-world environment.

━━━ THE CHARACTERS ━━━
Monochromatic solid-color molded-plastic toy soldiers (classic army-green, or olive-drab / tan-desert / grey-Wehrmacht / sand-Marine variants). ~2-inch scale. Fixed cast-in-plastic poses — NOT articulated. Visible mold-seam running down each figure. Plastic-shine where light catches. Oval connector-base attached underfoot. Helmets, rifles, backpacks, canteens molded as one piece with the body. Multiple soldiers per scene — this is a platoon-scale world.

━━━ SCENE CATEGORIES (rotate aggressively across ALL of these — WWII-canon + blackops + urban + airborne + naval + mountain + arctic + desert + jungle + quiet-moment + historic) ━━━

WWII-CANON BATTLEFIELDS:
- Beach-landing diorama — soldiers mid-charge from plastic landing-craft onto sand-covered set, water-resin surf frozen mid-spray
- Bunker-defense scene — crouched-and-firing soldiers behind sandbag wall, explosion-puff cotton-ball fireball mid-burst overhead
- Backyard-epic trench — soldiers arrayed in a sculpted dirt-trench cut into real soil, overhead flash-bulb artillery-burst
- Tank-assault scene — soldiers running beside a die-cast plastic tank, one waving platoon forward
- Bayonet-charge scene — front-line of bayonet-soldiers frozen mid-sprint across no-man's-land diorama
- Hillside-assault diorama — soldiers scrambling up a sculpted-foam hill toward a machine-gun nest
- Flamethrower-assault scene — flamethrower-soldier mid-burst through broken window of plaster-ruined farmhouse
- Foxhole-waiting scene — two soldiers crouched in dug-out foxhole of real-dirt, one peering over the lip

BLACKOPS / MODERN-COVERT:
- Night blackops insertion — NVG-helmeted soldiers stacked at compound door, glowsticks dropped, silenced-rifle pointman
- Stealth-recon diorama — face-painted soldiers moving low through elephant-grass, one signaling hand-command
- HALO jump tableau — free-fall soldiers frozen mid-skydive against paper-storm-cloud backdrop, chutes trailing
- Rooftop-sniper scene — two-man spotter-shooter team prone on a miniature urban rooftop, city skyline behind
- Fast-rope helicopter descent — soldiers sliding down rope from plastic-Blackhawk-hovering-overhead diorama
- Door-breach moment — shotgun-breacher mid-kick as stack waits with carbines raised, smoke-grenade rolling
- Desert-dune lookout — ghillie-suited sniper glassing horizon, spotter mid-call with rangefinder

URBAN / STREET-COMBAT:
- Bombed-out-city crossing — soldiers sprinting across rubble-pile street under overhead tracer-fire diorama
- Rooftop-to-rooftop leap — soldier frozen mid-jump between two plaster-ruined building tops
- Stack-the-wall diorama — five-man team pressed against exterior of miniature shop-front, mid-plan
- Subway-tunnel advance — flashlight-beam soldiers moving down miniature subway-tunnel diorama, trash-track-litter underfoot

AIRBORNE / AIR-MOBILE:
- Plastic-parachute drop — army-men hanging from toy-parachutes against sky-blue backdrop, landed troops firing
- Glider-crash aftermath — soldiers pouring out of tail-broken plastic glider into a hedge-row
- Paratrooper-lands-in-tree moment — soldier suspended in plastic-tree canopy, buddies cutting him down below
- Helicopter-hot-extract — running soldiers toward hover-rotor-downwash diorama, wounded carried between two

NAVAL / AMPHIBIOUS:
- Amphibious-boat moment — soldiers in plastic-raft crossing resin-water, lead man at bow pointing ahead
- Ship-boarding scene — navy-rifleman soldiers rappelling from deck-to-deck, fast-rope-from-zodiac onto ship side
- Submarine-deck surfacing — soldiers climbing from conning-tower hatch of miniature plastic-sub in choppy-resin-water
- Swamp-patrol diorama — soldiers wading waist-deep through resin-green-swamp with rifles held overhead

MOUNTAIN / ARCTIC:
- Alpine-ridge advance — white-camo soldiers roped-together traversing snow-covered foam-ridgeline
- Ski-patrol diorama — soldiers in plastic-ski-molded pose gliding across white-frosted battlefield
- Avalanche-zone rescue — mountain-soldier extending hand to buddy half-buried in cotton-snow drift
- Cave-assault scene — soldiers entering a miniature rock-cave mouth, flashlight-beam cutting through dust

JUNGLE / GUERRILLA:
- Jungle-patrol diorama — soldiers wading through plastic-palm-frond terrain, lead scout crouched with binoculars
- Rice-paddy crossing — soldiers wading waist-deep through flat resin-water diorama, rifles held high
- Booby-trap moment — pointman frozen mid-step as squad-leader shouts halt, tripwire-glint under foliage
- Vietnam-era riverboat scene — soldiers on plastic-patrol-boat scanning banks, M60-gunner hunched at rail

DESERT / SANDSTORM:
- Desert-ambush diorama — tan soldiers crouched behind sand-dune, binocular-spotter on ridge
- Sandstorm-advance — soldiers leaning into swirling-baby-powder haze, goggles dust-clouded
- Jeep-scouting scene — open-plastic-jeep with mounted machine-gun bouncing across sand, driver + gunner inside
- Oil-field firefight — silhouetted soldiers against miniature burning-pipeline, orange-flame cellophane flicker

QUIET-MOMENT (soldiers-caught-in-a-moment):
- Soldier writing a letter home by lantern-light inside canvas-tent, pen to paper, photo tucked in helmet-band
- Cigarette break on tank-hull — soldiers sitting with legs dangling, helmets at their side, shared canteen
- Rifle-cleaning scene by campfire — soldier disassembled-weapon on blanket, oil-rag and ramrod at hand
- Chaplain-blessing moment — soldiers kneeling with helmets removed as chaplain-soldier stands with bible raised
- Mail-call diorama — platoon crowded around radio-soldier distributing letters from a canvas bag
- Sleeping-soldiers diorama — soldiers in sleeping-bags beside still-smoking campfire, one standing-watch with rifle
- Dog-tag-recovery moment — soldier kneeling beside fallen comrade, removing dog-tags with bowed head

HISTORIC / ICONIC:
- Flag-raising moment — soldiers planting toy-flag on crater-top, triumphant backlit silhouette against setting-sun
- Tunnel-rat descending — soldier with flashlight-and-pistol lowering himself headfirst into miniature tunnel-hole
- POW-rescue scene — soldiers cutting barbed-wire of miniature prison camp, rescued captives stumbling out
- War-room tabletop — cluster of officer-soldiers around giant map-table with miniature-on-miniature ships-and-arrows
- Medic-rescue diorama — medic-soldier dragging wounded comrade behind sandbag barricade, red-cross helmet
- Radio-operator scene — kneeling soldier with radio on knee, antenna extended, squad leader over map
- Prisoner-escort scene — riflemen flanking captured-enemy-soldier walking hands-on-head down muddy-road diorama
- Battlefield-aftermath scene — standing soldiers gathered around a makeshift grave-marker, helmets off, officer saluting

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference MOLDED-PLASTIC / single-pose / oval-base / mold-seam / toy-soldier LANGUAGE explicitly
- Cinematic Toy-Story / Saving-Private-Ryan toy-recreation framing
- Multiple soldiers in the scene — this is a platoon world, not a solo figure
- Practical diorama lighting (dramatic spotlight / cotton-ball smoke / flash-bulb explosion-burst)
- Specific prop (sandbag / trench / tank / flag / radio / foxhole / bayonet)

━━━ BANNED ━━━
- NO "real soldier" / "real war" — these are TOY-SOLDIERS on a diorama
- NO articulated / posable / action-figure language — classic army-men are SINGLE-POSE molded plastic
- NO graphic gore / blood / spraying-wounds — toy-battle tone only
- NO real military IP (Navy SEAL / Green Beret / 82nd Airborne specific unit names) — generic WWII-toy-soldier archetype only
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
