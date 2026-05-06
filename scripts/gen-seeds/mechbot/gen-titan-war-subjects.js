#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/titan_war_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TITAN descriptions for MechBot's titan-war-machines path. Each describes a kilometer-scale combat machine in 14-22 words.

Each entry: scale anchor + body plan + signature weapons + aesthetic accent.

━━━ SCALE LOCK (NON-NEGOTIABLE) ━━━
Every titan is BIBLICAL — kilometer-tall, skyscraper-scale. NEVER smaller. The scale IS the subject. No character-scale or vehicle-scale machines.

━━━ BODY PLAN VARIETY ━━━
- Bipedal humanoid (Pacific Rim Jaeger / 40K Imperator / AT-ST-grand)
- Quadrupedal walker (AT-AT / Strider / Striderking)
- Hexapedal artillery base
- Centaur (humanoid torso on quad/hex base — heavy weapon platforms)
- Serpentine ground titan (Nausicaä Giant Warrior decay-revival)
- Flying titan (heavy gunship-titan hovering on plasma columns)
- Wheeled siege titan (rolling fortress with railgun spires)

━━━ WEAPONS / EQUIPMENT VARIETY ━━━
- Twin railgun shoulders / dorsal cannon / chest beam / mass driver / missile rack mountains / plasma-vented limbs / hardpoint-everything

━━━ AESTHETIC LANGUAGES ━━━
- Sleek modern military (cold gunmetal, geometric)
- Brutalist orthodox industrial (rivets, exposed pipes, riveted plate)
- Ornate ceremonial (gold leaf, banners, kingly heraldry — 40K-coded)
- Alien xenomilitary (chitinous, asymmetric, biomech edges)
- Imperial-era retrofuture (art-deco superstructures, classical statuary on the chassis)

━━━ EXAMPLES (write fresh) ━━━
- "Thirty-story humanoid Heavyframe carrying twin shoulder-mounted railguns, chest reactor glow, riveted gunmetal plates"
- "Quadrupedal artillery walker with rear missile-pylon spires, segmented insectoid leg-clusters, sand-yellow desert scheme"
- "Serpentine ground titan three city blocks long, chitin-plated dorsal ridge, six articulated forelimb cannons"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: body plan + signature weapon + aesthetic language.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
