#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/herd_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HERO-DINOSAUR-WITH-HERD descriptions for DinoBot's herd-migration path. Each entry is 18-28 words.

━━━ NON-NEGOTIABLE — HERO + HERD FRAMING ━━━
Every entry must establish:
1. ONE TO THREE FOREGROUND HERO DINOSAURS — clearly described, anatomically detailed, the eye's first landing place
2. A LARGE HERD (50-200 animals) extending behind/around them as supporting backdrop, fading to horizon

The format is HERO SUBJECT + HERD CONTEXT. NEVER "thousands of dinosaurs in distance" — that renders as wildebeest. ALWAYS clearly visible foreground individuals + crowd extending behind.

━━━ ANATOMICAL DISAMBIGUATION (NON-NEGOTIABLE) ━━━
The herd must read as DINOSAURS not mammals. Bake silhouette-defining anatomy language into every entry:
- Sauropod herds: "long S-curve necks rising above the crowd like masts" / "necks craning skyward"
- Hadrosaur herds: "duck-billed crested heads bobbing" / "tubular crests catching light"
- Ceratopsian herds: "horned frills and brow-spikes catching light" / "frill-walls horizon-to-horizon"
- Stegosaur herds: "plate-rows undulating across backs" / "spike-tails visible"
- Iguanodon herds: "thumb-spikes and beaked profiles"
- Therizinosaur herds: "long-clawed forelimbs visible above bodies"
- Pachycephalosaur herds: "domed skulls bobbing"

━━━ HERD SIZE — KEEP IT REAL ━━━
Use "hundred-strong" / "two hundred" / "great herd of" / "vast herd" / "horizon-filling herd" — NOT "thousands" or "ten thousand" (those collapse to mammal-stampede in Flux's mind).

━━━ CATEGORIES ━━━

HERO + HERD CROSSING:
- Lone Brachiosaurus matriarch in foreground, S-neck arched, hundred-strong sauropod herd behind her crossing flooded plain, all S-necks visible
- Three Parasaurolophus bulls in foreground crested heads bobbing, vast herd of two hundred trailing behind on dust-trail
- Single Triceratops elder filling foreground, frill scarred from past battles, ceratopsian herd extending behind her, every frill catching sunlight

HERO + HERD AT WATER:
- Foreground sauropod drinking, neck craned down to water, hundred-strong herd lined up along distant shore, all necks reflected in the lake
- Lead hadrosaur in foreground emerging from river, fifty more swimming behind, only crested heads visible above water
- Foreground Stegosaur drinking at creek, plate-row catching dawn light, vast herd grazing fern-prairie behind

HERO + HERD MIGRATION TRAIL:
- Two foreground Iguanodon striding forward, thumb-spikes raised, vast hundred-strong herd trailing behind on a dust-cloud horizon
- Foreground Edmontosaurus mother and juvenile, herd behind extending into atmospheric haze toward distant peaks
- Lone bull Pachycephalosaurus in foreground, dome head silhouetted, herd of fifty behind grazing the hillside

HERO + HERD AT REST / GATHERING:
- Foreground Sauropod stretching neck high to feed from canopy, hundred-strong herd grazing midground, scale-staggered to vanishing horizon
- Lead Triceratops resting in foreground beside young, vast herd dotting the savanna in middle and far distance
- Three foreground Hadrosaurs in display-pose, hundred-strong gathering behind in mating-arena formation

HERO + HERD DEFENSIVE / DRAMATIC:
- Bull Triceratops in defensive front-stance foreground, frill flared, herd of fifty behind in protective ring, predator silhouette distant
- Foreground Sauropod tail-whipping in defense, herd of hundred sheltering young behind her flank, vast living wall
- Lead Iguanodon in alert pose foreground, herd behind them all turning heads toward off-frame threat

HERO + HERD GOLDEN-HOUR:
- Two foreground sauropods silhouetted against golden sunset, S-necks black against amber, vast herd behind reduced to elegant dinosaur silhouettes
- Foreground hadrosaur in golden raking light, every scale ridge visible, herd of hundred behind in soft midground glow
- Foreground stegosaur backlit by dawn, plate-row glowing translucent, herd extending into mist toward distant peaks

━━━ EVERY ENTRY MUST INCLUDE ━━━
- 1-3 foreground hero dinosaurs (clearly described with species + signature anatomy)
- A herd of 50-200 behind them, sized so individuals still read as dinosaurs
- Silhouette-disambiguating anatomy language (necks / crests / frills / plates / spikes)
- Atmospheric depth (horizon / vanishing-point / dust-trail / distant peaks)

━━━ NO GORE, NO HUMANS, NO ACTIVE KILLING ━━━

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: hero species + herd activity + setting + scale-anchor.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
