#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ROBOT TYPE descriptions for StarBot's robot-moment path — varied specific robot forms. Massive-mech / rusted / sleek-drone / tiny-companion / bio-mechanical / humanoid-android / industrial. NO cyborg-women (VenusBot territory).

Each entry: 10-20 words. One specific robot type with visual details.

━━━ CATEGORIES ━━━
- Massive mech (colossal humanoid walker with heavy-plated armor)
- Rusted industrial worker-bot (battered utility robot with one arm)
- Sleek drone (small hovering quadrotor with scanner)
- Tiny companion-bot (desktop-sized assistant with glowing eyes)
- Bio-mechanical creature (organic-looking machine with fiber muscles)
- Humanoid android (gender-neutral android with smooth plating)
- Heavy loader-bot (forklift-style industrial heavy-lifter)
- Medical nurse-bot (sleek white medical attendant)
- Exploration rover (wheeled scientific rover with multiple arms)
- Combat-drone (aggressive sleek military drone)
- Terraforming worker-bot (bulldozer-style earth-moving robot)
- Deep-sea-probe (pressurized submersible robot)
- Miner-bot (drill-headed industrial digger)
- Security-sentinel (patrolling four-legged walker)
- Farmer-bot (field-tending agricultural robot)
- Janitor-bot (cleaning-service humanoid)
- Archivist-bot (library-tending robot with scroll-reader)
- Astrobiologist-bot (sampling-arm science robot)
- Pilot-exoskeleton (powered-armor suit)
- Monk-bot (robed humanoid with contemplative pose)
- Kitchen-chef robot (multi-armed food-preparer)
- Child-sized companion (toy-like friendly robot)
- Gardener-bot (plant-tending robot with watering arm)
- Rescue-bot (heavy-duty emergency responder)
- Archaeological-excavator (precise digging specialist)
- Junkyard-rover (scavenger robot covered in patches)
- Transport-pilot robot (autonomous ship-pilot)
- Meditation-instructor-bot (zen humanoid)
- Historian-bot (scholar android with holographic interface)
- Nature-observer-bot (wildlife-watching quiet drone)

━━━ RULES ━━━
- NO cyborg-women (VenusBot owns that)
- Gender-neutral or non-gendered forms
- Include distinguishing visual detail
- Variety: mech / drone / android / creature / industrial / companion

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
