#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/gi_joe_scenes.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} 1980s GI-JOE-era articulated-commando action-figure scene descriptions for ToyBot's gi-joe path — Saturday-morning-cartoon-serial military-toy storytelling. 3.75-inch hand-painted articulated figures with signature code-name commandos vs masked terror-organization troopers. Iconic plastic vehicles, battle playsets, Cobra-vs-Joe-style tableau cinema. Non-IP — archetype only.

Each entry: 18-28 words. ONE specific scene with articulated-commando figures mid-action in a handcrafted playset diorama.

━━━ THE CHARACTERS ━━━
3.75-inch articulated action-figure commandos with swivel-waist / ball-joint arms / rubber-band-waist. Hand-painted multicolor commando wardrobe (camo fatigues / berets / goggles / bandannas / chest-rig / dogtags / ammo-belts). Code-name archetypes: masked-operative (full-face covering), mohawk-soldier, ninja-operative (all-black or all-white armor + face-mask), gruff-sergeant (cigar-chomping, beret), demolitions-expert (helmet with explosive-pouches), pilot-ace (flight-suit, helmet tucked under arm), jungle-specialist (bandana, camo-facepaint), arctic-specialist (white parka, snow-goggles), tank-commander (headset, coveralls). Opponents: masked-terror-organization faceless-troopers in silver-visor helmets + armored jumpsuits, plus terror-organization-commanders (chrome-faceplate / hooded-cloak / snake-motif armor / serpent-eye mask).

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Commando-team parachute-drop diorama — five code-name commandos mid-descent under plastic-parachutes, jungle-playset below
- Iconic-tank assault — plastic commando-tank crashing through a barricade, gunner on mounted turret, terror-troopers diving for cover
- Motor-pool garage scene — commandos working on modular plastic-vehicle with hood open, toolbox and jack visible, code-name-sergeant directing
- Terror-organization volcano-fortress siege — commandos scaling plastic-rope-ladder up the base as masked-troopers fire down from ramparts
- Desert-assault chopper-drop — articulated commandos leaping from side-door of plastic attack-helicopter, rotors blurred, dust-plume below
- Stealth-submarine boarding — commandos rappelling from chopper onto deck of plastic enemy-sub, ninja-operative leading the charge
- Bazooka-showdown — shoulder-launcher-commando aims at speeding terror-organization hoverbike, lead trooper ducking low
- Ninja-blade clash — all-white-armor ninja-commando dueling chrome-faceplate terror-commander with twin katanas, sparks and backlit haze
- Jungle-playset ambush — commando-team frozen mid-charge as snake-motif terror-troopers burst from plastic-palm-foliage
- Hoverbike chase — commando on plastic flying-vehicle pursuing terror-troopers across painted-sky backdrop, contrails trailing
- Missile-silo infiltration — commandos lowering from ceiling-rig on plastic winch-ropes into terror-organization launch-bay
- Arctic-base assault — white-camo commandos on plastic-snowmobiles charging a domed terror-ice-station, snow-spray kicking up
- Weapons-locker scene — commandos arming up at playset weapons-rack, code-name-sergeant pointing at map on wall
- HQ-war-room tabletop — senior commandos around lit-up operations-board with vehicle-micro-minis laid out on tactical map
- Terror-commander unmask moment — chrome-faceplate antagonist pulling back hood to reveal serpent-eye mask, commandos frozen mid-lunge
- Tank-turret clash — two plastic-tanks side-by-side with commando-turret-gunners firing across sandbag wall
- Laser-turret nest — commandos pinned behind crates as masked-troopers fire from tripod-mounted plastic laser-cannon
- Demolition-timer scene — demolitions-expert-commando setting plastic-detonator at terror-base reactor-core, countdown-digits glowing
- Jungle-extraction rope-climb — commandos ascending plastic rope-ladder to hovering chopper, jungle-diorama smoke billowing below
- Motorcycle-pursuit diorama — commando on plastic-motorcycle chasing terror-trooper across sculpted-desert terrain, dust-plume trailing
- Aircraft-carrier deck — commando-pilot running toward plastic-fighter-jet with helmet under arm, deck-crew waving flags
- Space-station playset — helmeted commandos floating on wire-rigs through plastic terror-space-platform interior, alarm-lights flashing
- Swamp-ambush — alligator-mount plastic-vehicle rising from resin-swamp as commandos fire from palm-canopy perch
- Bridge-showdown — commando-team and terror-troopers mid-firefight on collapsing wooden-plank plastic-bridge, pyrotechnic-puff blooming
- Control-room hijack — ninja-operative standing over unconscious terror-troopers at console, code-name-sergeant covering with carbine
- Prisoner-freed moment — commandos cutting zipcuffs off captured allies inside terror-holding-cell diorama, alarm-light glowing red
- Sniper-perch overwatch — code-name-sniper prone on water-tower with spotter, plastic-scope and bipod visible
- Joe-vs-cobra face-off tableau — hero-commando-leader and chrome-faceplate-commander squared off on playset catwalk, troops below
- Amphibious APC landing — commandos pouring from back-ramp of plastic landing-craft onto resin-beach, terror-troopers dug in behind seawall
- Mountain-climb rescue — commandos roped-together pulling injured comrade up sculpted-rock face, helicopter-silhouette above
- Flying-vehicle dogfight — plastic jet-pack commando dodging laser-blast from terror-organization drone-fighter mid-air
- Commando HQ briefing room — code-name commandos seated in formation as hologram-style map-projector glows center-table
- Boot-camp obstacle course — commandos mid-crawl under barbed-wire rig, drill-sergeant-figure with swagger-stick
- Terror-base reactor-core showdown — ninja-operative leaping between catwalks over glowing plastic reactor, katana raised
- Cockpit-interior scene — pilot-ace commando in plastic-jet-cockpit pulling on stick with radio-headset, missile-lock glowing
- Swamp-gator chase — commando on airboat-plastic-vehicle chasing snake-motif terror-trooper through resin-swamp reeds
- Jeep-rollover action — commandos leaping clear of tumbling plastic-jeep mid-air, debris-pieces frozen mid-fling
- Mission-briefing holotable — commandos leaning over clear-plastic holotable with miniature-terrain-mockup and vehicle-micro-minis
- Hostage-extraction rooftop — helicopter-lift cable lifting commandos and civilians off a plastic rooftop diorama
- Ninja-commando rooftop-leap — all-black ninja-figure mid-flying-kick toward masked terror-trooper on neighboring rooftop
- Helicopter-rescue-sling scene — commando hoisted on plastic-sling-line toward hovering chopper, enemy troops firing below
- Motor-speed-chase diorama — commando-motorcycle and terror-sidecar-motorcycle neck-and-neck through plastic-desert

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference ARTICULATED / 3.75-inch / commando / action-figure / hand-painted-commando / plastic-playset LANGUAGE
- 80s military-toy era — colorful, Saturday-morning-cartoon-serial energy
- Specific code-name-archetype (masked-operative / ninja-operative / gruff-sergeant / demolitions-expert / pilot-ace — NOT "soldier")
- Iconic plastic military-vehicle OR signature enemy-organization detail (silver-visor mask, chrome-faceplate, snake-motif, hooded-cloak)
- Practical diorama lighting + cinematic verb (mid-charge / mid-leap / mid-sword-lock / mid-detonate)

━━━ BANNED ━━━
- NO real IP names (Duke / Cobra Commander / Snake Eyes / Stormshadow / Destro / Scarlett / Flint / Roadblock / Serpentor etc.) — archetype only
- NO single-pose monochromatic green-army-men — those live in army-men path
- NO graphic gore / blood / wounds — toy-battle cartoon-serial tone
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
