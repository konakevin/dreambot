#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dino_species.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DINOSAUR SPECIES descriptions for DinoBot — accurate species with signature features.

Each entry: 10-20 words. One real dinosaur species with distinguishing features.

━━━ CATEGORIES (real paleontology) ━━━
- T-Rex massive theropod with tiny arms and huge jaws
- Velociraptor feathered pack-hunter with curved sickle-claw
- Triceratops three-horned frilled ceratopsian
- Stegosaurus plated back with thagomizer tail
- Brachiosaurus long-necked gentle giant
- Spinosaurus sail-backed semi-aquatic
- Ankylosaurus armored tank with club-tail
- Pterodactyl fine-boned small flyer
- Pteranodon crested large flyer
- Archaeopteryx small feathered transitional
- Parasaurolophus crested duck-bill hadrosaur
- Allosaurus predatory theropod with brow-horns
- Deinonychus raptor with sickle-claw
- Microraptor four-winged small feathered
- Carnotaurus horned theropod with stubby arms
- Iguanodon thumb-spike herbivore
- Dreadnoughtus massive titanosaur
- Mosasaurus massive marine reptile
- Plesiosaurus long-necked marine
- Pachycephalosaurus dome-skulled rammer
- Diplodocus long-tailed sauropod
- Apatosaurus massive long-neck
- Therizinosaurus scythe-clawed plant-eater
- Gallimimus ostrich-like fast runner
- Ceratosaurus nasal-horn predator
- Oviraptor feathered nest-protector
- Compsognathus tiny theropod
- Troodon intelligent raptor-like
- Dilophosaurus double-crested predator
- Quetzalcoatlus giraffe-sized flying reptile
- Rhamphorhynchus long-tailed flyer
- Dimorphodon small crested flyer
- Sauropelta armored nodosaurid
- Euoplocephalus club-tailed armored
- Utahraptor massive raptor
- Herrerasaurus early predator
- Giganotosaurus massive carcharodontosaurid
- Mapusaurus pack-hunting giant
- Yutyrannus feathered tyrannosauroid
- Microraptor 4-winged gliding theropod
- Archelon massive sea-turtle (prehistoric)
- Dunkleosteus armored fish
- Hadrosaur generic duck-bill
- Ichthyosaurus marine reptile
- Elasmosaurus extremely long-necked plesiosaur

━━━ RULES ━━━
- Real paleontology species
- Include signature identifying feature
- Feathers where paleontologically-correct

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
