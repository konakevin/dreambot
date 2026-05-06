#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dino_species.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DINOSAUR species descriptions for DinoBot. Each entry is 10-22 words, naming a species and giving its UNMISTAKABLY DINOSAUR signature features.

━━━ NON-NEGOTIABLE ━━━
Every entry must read clearly as a DINOSAUR (or closely-grouped Mesozoic reptile). Flux must render an obvious dinosaur silhouette — NOT a bird, NOT a mammal, NOT a fish, NOT a generic creature.

━━━ ABSOLUTE BANS — these are NOT dinosaurs and break the bot ━━━
- NO Helicoprion (it's a SHARK)
- NO Dunkleosteus (placoderm FISH)
- NO Yi qi (bat-winged glider — Flux renders as a bat)
- NO Basilosaurus (early WHALE — mammal)
- NO Sharovipteryx (lizard glider)
- NO Estemmenosuchus / Gorgonops / Dimetrodon as primary subjects (pre-dinosaur synapsids)
- NO mammal-coded species, NO fish, NO sharks, NO insects
- NO species so obscure Flux has no training data (it will hallucinate weird hybrids)

━━━ DISTRIBUTION ━━━
- ~50% ICONIC dinosaurs (Flux renders these perfectly)
- ~35% MID-TIER recognizable dinosaurs (still well-known shape templates)
- ~10% Marine reptiles (Mosasaurus, Plesiosaurus, Liopleurodon, Ichthyosaurus, Tylosaurus — clearly reptile-shaped)
- ~5% Pterosaurs (Pteranodon, Quetzalcoatlus, Pterodactylus, Tupuxuara — clearly pterosaur-shaped, leathery wings)

━━━ ICONIC TIER (use heavily — repeat with different angles is fine) ━━━
Tyrannosaurus rex, Triceratops, Brachiosaurus, Velociraptor, Stegosaurus, Spinosaurus, Allosaurus, Apatosaurus, Diplodocus, Parasaurolophus, Edmontosaurus, Iguanodon, Ankylosaurus, Pachycephalosaurus, Carnotaurus, Compsognathus, Deinonychus, Mosasaurus, Pteranodon, Quetzalcoatlus

━━━ MID-TIER RECOGNIZABLE ━━━
Therizinosaurus (large bipedal pot-bellied dinosaur with long claws — emphasize GROUND-DWELLING, not a flier),
Giganotosaurus, Albertosaurus, Daspletosaurus, Tarbosaurus,
Styracosaurus, Pachyrhinosaurus, Centrosaurus, Chasmosaurus, Torosaurus,
Amargasaurus (double sail-neck), Saltasaurus (armored), Argentinosaurus (titanic), Camarasaurus,
Corythosaurus, Lambeosaurus, Maiasaura, Hypacrosaurus,
Baryonyx, Suchomimus, Ceratosaurus, Majungasaurus, Utahraptor,
Kentrosaurus (more spikes than Stegosaurus), Tuojiangosaurus,
Euoplocephalus, Borealopelta, Gastonia,
Plesiosaurus, Liopleurodon, Elasmosaurus, Kronosaurus, Tylosaurus, Ichthyosaurus,
Pterodactylus, Dimorphodon, Tupuxuara, Tropeognathus, Anhanguera, Nyctosaurus

━━━ ENTRY FORMAT ━━━
"[Species name]: [size + body plan + 1-2 signature features that lock the silhouette]"

EXAMPLES:
- "Tyrannosaurus rex: massive bipedal apex predator with huge skull, tiny two-fingered arms, muscular tail, scaled hide"
- "Triceratops: nine-meter quadrupedal herbivore with three forward-pointing horns and broad bony neck frill"
- "Spinosaurus: large semi-aquatic theropod with tall sail along back and crocodilian jaws"
- "Mosasaurus: fifteen-meter marine reptile with paddle limbs, scaled body, long tooth-filled jaws, dolphin-like profile"
- "Quetzalcoatlus: giraffe-sized pterosaur, ten-meter wingspan of leathery membrane, long stork-like beak"
- "Therizinosaurus: large bipedal ground-dwelling dinosaur with pot belly, feathered shaggy body, meter-long curved scythe claws on each hand"

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Species name
- Body-plan keyword (bipedal / quadrupedal / sauropod / theropod / hadrosaur / ceratopsian / sailed / armored / aquatic / pterosaur)
- 1-2 signature features that LOCK THE SILHOUETTE so Flux renders the right thing
- Size cue when relevant ("massive" / "small" / "giraffe-sized" / "ten-meter")

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: species + body plan + signature angle. Repeated iconic species with different angles ("T-Rex with mud-caked flanks" vs "T-Rex with battle-scarred face") is encouraged for the iconic tier.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
