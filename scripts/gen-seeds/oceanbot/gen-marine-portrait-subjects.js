#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/marine_portrait_subjects.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MARINE PORTRAIT SUBJECT descriptions for OceanBot's marine-portrait path — ONE real ocean creature as sole hero. Candid expert-aquatic-photographer portrait.

Each entry: 15-30 words. One real marine subject with pose + backdrop + lighting.

━━━ CATEGORIES ━━━
- Mandarinfish close-up with intricate pattern
- Angelfish portrait with fin-flare
- Clownfish in anemone close-up
- Parrotfish mid-chew on coral
- Hammerhead-shark side-profile
- Great-white-shark face-on with rows of teeth
- Tiger-shark eye close-up
- Whale-shark mouth-open filter-feeding
- Manta-ray belly-shot pattern visible
- Eagle-ray gliding overhead
- Octopus eye close-up with iris
- Cuttlefish color-changing mid-display
- Nautilus in abyssal water
- Lionfish fan-spread
- Seahorse delicate close-up
- Moray-eel head-out of crevice
- Wolffish ancient-face close-up
- Giant-grouper face with cleaner-wrasse
- Napoleon-wrasse humphead profile
- Blue-ringed octopus close-up
- Frogfish camouflaged on sponge
- Leafy-seadragon delicate silhouette
- Harlequin-shrimp macro
- Pygmy-seahorse on gorgonian
- Peacock-mantis-shrimp iridescent
- Ghost-pipefish camouflaged
- Anemone-crab on anemone
- Christmas-tree-worm spiral
- Flamingo-tongue-cowry on gorgonian
- Sea-nudibranch detail
- Sea-angel translucent
- Sailfish mid-hunt striking
- Tuna torpedo-speed
- Marlin leaping breaching
- Dolphin mid-leap airborne
- Sea-otter floating close-up
- Sea-lion portrait whiskered
- Harbor-seal face
- Walrus tusk-detail
- Polar-bear swimming underwater
- Penguin-underwater torpedoing
- Puffin underwater flight

━━━ RULES ━━━
- Real marine creatures only (no mythic)
- Single subject as hero
- Specific pose / detail / composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
