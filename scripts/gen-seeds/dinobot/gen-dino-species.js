#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dino_species.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DINOSAUR AND PREHISTORIC SPECIES descriptions for DinoBot — accurate species with signature features. Feature DIVERSE and OBSCURE species people have never heard of, not just the famous ones.

Each entry: 10-25 words. One real prehistoric species with distinguishing visual features.

━━━ FAMOUS (use sparingly, ~15%) ━━━
- Tyrannosaurus rex, Triceratops, Velociraptor, Brachiosaurus, Stegosaurus, Spinosaurus

━━━ DEEP CUTS — THEROPODS ━━━
- Therizinosaurus (scythe-clawed giant), Giganotosaurus, Carcharodontosaurus, Baryonyx
- Deinocheirus (hump-backed ornithomimid), Concavenator (sail-backed carcharodontosaur)
- Yi qi (bat-winged theropod), Nothronychus (pot-bellied therizinosaur), Majungasaurus
- Suchomimus (crocodile-mimic), Torvosaurus, Ceratosaurus, Sinornithosaurus
- Sinosauropteryx (first feathered dino confirmed), Citipati (crested oviraptor)

━━━ DEEP CUTS — HERBIVORES ━━━
- Amargasaurus (double-sail-necked sauropod), Nigersaurus (vacuum-mouth sauropod)
- Dracorex (dragon-king dome-head), Kosmoceratops (most-horned ceratopsian)
- Styracosaurus (spike-frilled), Pachyrhinosaurus (boss-nosed ceratopsian)
- Edmontosaurus (mummified skin specimens), Corythosaurus (helmet-crested hadrosaur)
- Saltasaurus (armored titanosaur), Magyarosaurus (dwarf island sauropod)
- Sinoceratops (Chinese horned face), Ouranosaurus (sail-backed iguanodontid)

━━━ DEEP CUTS — MARINE ━━━
- Tylosaurus, Shonisaurus (bus-sized ichthyosaur), Kronosaurus, Archelon (giant sea turtle)
- Dunkleosteus (armored placoderm fish), Helicoprion (buzzsaw-jaw shark)
- Thalassomedon (long-necked plesiosaur), Basilosaurus (ancient whale ancestor)

━━━ DEEP CUTS — FLYING ━━━
- Quetzalcoatlus (giraffe-sized azhdarchid), Hatzegopteryx (island giant pterosaur)
- Dimorphodon (puffin-faced pterosaur), Tupuxuara (crested tapejarid)
- Nyctosaurus (huge-crested pteranodontid), Jeholopterus (frog-mouthed anurognathid)

━━━ DEEP CUTS — PRE-DINOSAUR + EARLY ━━━
- Dimetrodon (sail-backed synapsid), Gorgonops (saber-toothed therapsid)
- Kaprosuchus (boar-croc), Sarcosuchus (super-croc), Postosuchus (rauisuchian)
- Sharovipteryx (gliding archosaur), Tanystropheus (absurdly long-necked reptile)
- Scutosaurus (armored pareiasaur), Estemmenosuchus (antlered therapsid)

━━━ RULES ━━━
- 85% should be species most people have NEVER heard of
- Include the visual feature that makes each species unique and recognizable
- Feathers where paleontologically confirmed
- Mix all eras: Triassic, Jurassic, Cretaceous, plus key Permian/Paleozoic species
- Include marine reptiles, pterosaurs, and non-dinosaur prehistoric animals

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
