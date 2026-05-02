#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/aliens_landscapes.json',
  total: 50,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ALIENS-CODED LANDSCAPE entries for StarBot's aliens-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ALIEN PLANET VISTA in the Alien / Aliens / Prometheus aesthetic tradition — wind-blasted alien moon surfaces, derelict-spaceship-graveyard landscapes, atmospheric processor silhouettes in distance, primordial bioluminescent terrain, hellish-but-beautiful otherworldly vistas, ash-storm-swept colony exteriors.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO XENOMORPHS. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "LV-426", "Nostromo", "Sulaco", "Hadley's Hope", "Weyland-Yutani", "xenomorph", "facehugger", "Ripley", "Engineer", "Prometheus" — describe the AESTHETIC generically. Use phrases like "wind-blasted alien moon", "atmospheric processor on the distant horizon", "derelict-ship graveyard half-buried in sand", "primordial alien wilderness".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of H.R.-Giger / Ridley-Scott / James-Cameron / Syd-Mead / Ron-Cobb concept-art. The world is HOSTILE-but-beautiful, INDUSTRIAL-meets-organic, terrifying. Sky is heavy with atmospheric storms. Light is COLD and pale, often diffuse through perpetual cloud-cover. Rain is acid. Ground is rocky/gritty/volcanic OR primordial-organic. Distant atmospheric processors / crashed ships / abandoned colonies serve as eerie scale-markers. The land FEELS WRONG — too quiet, too still, too vast.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

WIND-BLASTED VOLCANIC MOONS (~10):
- wind-scoured volcanic plain under perpetual storm-cloud cover, rocky outcrops fractured and steaming
- ash-storm sweeping across a barren rocky expanse, distant cliff silhouettes barely visible
- volcanic moon surface with scattered sulfur vents, pale yellow sky, basalt boulders sharp as razors

DERELICT SPACESHIP GRAVEYARDS (~8):
- crashed alien ship half-buried in red dust, hull breached, atmospheric haze drifting through
- decades-old spacecraft wreckage scattered across an alien plateau, cargo containers spilled and rusted
- ancient derelict ship cresting a dune-line, scale revealing its kilometer-long body, mist rolling around it

PRIMORDIAL BIOLUMINESCENT TERRAIN (~6):
- alien fungal forest at night, towering bioluminescent stalks, pale spore-clouds drifting between
- primordial swamp-plain with phosphorescent vines and vapor-pools, no animal life visible
- bioluminescent moss carpeting an entire valley, soft cyan-green glow under a starless sky

ATMOSPHERIC PROCESSOR SILHOUETTES (~6):
- massive atmospheric processor on the horizon, kilometer-tall industrial spire venting steam
- distant processor-silhouette dwarfing the surrounding plain, clouds backlit by its glow
- abandoned terraforming station overlooking a wasteland, processor towers belching gas

ABANDONED COLONY EXTERIORS (~6):
- deserted industrial colony exterior at dusk, rain streaming, prefab modules half-collapsed
- abandoned colony power-substation, transformers humming dead, mist rising
- deserted landing pad with overturned vehicles, ash drifting, pale sky overhead

ACID-RAIN STORM-LANDSCAPES (~5):
- acid-rain storm sheeting over rocky outcrops, surfaces eroded into soft shapes
- corroded landscape under perpetual drizzle, every surface pitted and slick
- electrical storm racing across a barren plain, lightning bleaching rock formations

ICE / FROZEN MOON SURFACES (~5):
- frozen alien moon with cracked-ice plains, distant gas giant in the sky, pale aurora overhead
- methane-glacier landscape under three pale moons, ice fractured by tidal forces
- subterranean ice-cave entrance at the base of a frozen cliff

HELLISH BUT BEAUTIFUL OTHERWORLDLY (~4):
- alien planet with red sky and black sand under twin moons, lava-glow visible at horizon
- hellish primordial vista with sulfur lakes and crimson skies, geyser fields steaming
- otherworldly basalt-pillar landscape under shifting nebula light, pale ash falling like snow

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO people / NO xenomorphs / NO creatures (silhouettes of distant flying alien fauna OK if very distant and abstract)
- NO proper nouns from the franchise
- Strong atmospheric / sky component (storm-cloud cover, acid-rain, perpetual mist, pale sun)
- Strong sensory detail (rocky/gritty texture, mist, rain, ash, glow, scale)
- Variety across the 8 categories above mandatory
- Mood is HOSTILE-but-beautiful, eerily quiet, industrial-meets-organic
- Cinematic / biblical scale where appropriate

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
