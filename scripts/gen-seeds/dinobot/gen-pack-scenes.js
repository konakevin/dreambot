#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/pack_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PACK SCENE descriptions for DinoBot's dino-pack path — herd/flock compositions. Wildlife-documentary scale.

Each entry: 15-30 words. One specific pack/herd scene.

━━━ CATEGORIES ━━━
- Sauropod herd with babies crossing plain
- Triceratops at watering hole with calves
- Velociraptor pack mid-hunt coordinated
- Hadrosaur stampede across valley
- Pterodactyl flock over sea-stacks
- Parasaurolophus pod calling
- Brachiosaurus family migrating
- Diplodocus herd feeding high in conifers
- Stegosaurus group grazing low-ferns
- Ankylosaurus pair in forest clearing
- Pterosaur colony on cliff-ledges
- Gallimimus herd running at dawn
- Maiasaura nesting colony
- Deinonychus pack stalking
- Ceratosaurus scavenging group
- Protoceratops nest-area with juveniles
- Oviraptor cluster at nest-site
- Microraptor flock in canopy
- Iguanodon family at riverbank
- Edmontosaurus herd at mudflats
- Utahraptor pack in forest
- Troodon intelligent pack at dusk
- Archaeopteryx flock on branches
- Pachycephalosaurus battling pair (dome-clash)
- Styracosaurus herd on plains
- Dilophosaurus pair at water
- Therizinosaurus pair foraging
- Giganotosaurus pack cornering prey
- Mapusaurus hunting pack
- Yutyrannus family feathered in snow
- Mosasaur pod at surface
- Plesiosaur group hunting
- Ichthyosaur pod diving
- Ankylosaur pair with young
- Spinosaurus pair fishing
- Carnotaurus pair courtship display
- Pterodactyl-Pteranodon mixed flock
- Triceratops wandering solo with herd distant
- Compsognathus tiny-pack
- Allosaurus family sunning

━━━ RULES ━━━
- Multiple individuals visible
- Wildlife-documentary feel
- Scale communicated

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
