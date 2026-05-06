#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/aerial_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUBJECT descriptions for DinoBot's aerial-perspectives path. Each entry describes a flying prehistoric creature OR a ground dinosaur seen from an aerial perspective, in 14-22 words.

━━━ TWO SUBJECT MODES (mix freely across the 200) ━━━

MODE A — FLYING CREATURES (~70% of entries):
The subject IS in the air, in its element.

PTEROSAURS (heavy emphasis — variety across many species):
- Quetzalcoatlus (10m+ wingspan, giant azhdarchid)
- Hatzegopteryx (massive, robust, top predator)
- Pteranodon (iconic, tall crest, fish-eater)
- Pterodactylus (small, classic)
- Tupuxuara (ornate semi-circular crest)
- Anhanguera (long jaws, fish-snatching)
- Tropeognathus (large, marine)
- Dimorphodon (puffin-like, deep beak)
- Rhamphorhynchus (long-tailed, fish-hunter)
- Tapejara (showy crest)
- Nyctosaurus (massive forked head-crest)
- Caelestiventus (early Triassic glider)
- Eudimorphodon
- Anurognathus (tiny, bat-like, frog-mouthed)

EARLY AVIAN DINOSAURS:
- Microraptor (four-winged glider)
- Archaeopteryx (proto-bird)
- Yi qi (membrane-winged feathered)

DESCRIPTION FORMAT for flying:
- Species + signature feature + flight pose + wing/body language
- Example: "Quetzalcoatlus mid-soar at sunset, ten-meter wingspan extended, leathery membrane translucent in backlight, neck folded back"
- Example: "Tropeognathus mid-dive, jaws open, snatching fish from glassy ocean surface, wing-tips inches from water"

MODE B — AERIAL VIEW OF GROUND DINOSAUR (~30% of entries):
The camera is HIGH ABOVE looking down. The subject is a land/water dinosaur seen from the sky.

GROUND DINOSAUR SEEN FROM ABOVE:
- Brachiosaurus seen from above wading through swamp, neck visible as long S-curve
- T-Rex seen top-down stalking through rainforest canopy gap, only spine and tail visible
- Triceratops herd from helicopter-cam altitude, fanned across plain like beetles
- Stegosaurus from above showing plate-row and spike-tail in stark silhouette
- Mosasaurus from above-water looking down through clear shallows
- Sauropod neck arching above canopy from balloon-eye view
- Hadrosaur herd crossing river from drone-altitude perspective

DESCRIPTION FORMAT for aerial-view:
- "Aerial perspective of [species] [doing what] [terrain context]"
- Example: "Aerial perspective of Brachiosaurus herd wading shallow lake, long S-necks above water, ripples spreading from each step"

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Specific species name
- Wing/flight pose OR aerial-camera angle
- One signature anatomical detail (membrane, crest, feathers, plates, neck-curve)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: species + flight-or-aerial mode + signature pose/feature.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
