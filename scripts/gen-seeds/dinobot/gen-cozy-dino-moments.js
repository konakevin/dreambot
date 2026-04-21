#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/cozy_dino_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY DINO MOMENT descriptions for DinoBot's dino-cozy path — tender prehistoric vignettes.

Each entry: 15-30 words. One specific cozy dinosaur moment.

━━━ CATEGORIES ━━━
- Mother with eggs in nest at golden-hour
- Sauropod drinking from misty pond
- Small theropod sheltering from rain under giant-ferns
- Baby dinosaurs playing in clearing
- Pterodactyl cliff-ledge roost at sunset
- Mother Triceratops with calf resting
- Brachiosaurus grazing peacefully at dawn
- Velociraptor pair preening feathers
- Stegosaurus napping in sun-clearing
- Oviraptor brooding eggs on nest
- Hadrosaur family drinking at stream
- Sauropod herd settled at dusk
- Allosaurus sunning on rock
- Parasaurolophus calling softly to mate
- Pterodactyl parent feeding chicks
- Compsognathus curl-up sleeping under fern
- Ankylosaurus pair resting in clearing
- Iguanodon mother with toddlers
- Deinonychus at watering-hole peaceful
- Protoceratops family in burrow
- Gallimimus-couple at dawn
- Feathered-raptor in tree branch
- Dilophosaurus pair courtship dance
- Diplodocus calf following mother
- Maiasaura tending nest
- Pterosaur-pair on cliff-edge
- Juvenile T-Rex playful in grass
- Baby-sauropod nuzzling mother's neck
- Mother-dino grooming young
- Troodon intelligent gathering near campfire-style volcanic-vent
- Edmontosaurus migration slow-walk
- Microraptor pair on branch
- Ceratosaurus pair at stream
- Archaeopteryx on branch preening
- Pterosaur chick testing wings
- Sauropod-herd at dawn peaceful drinking
- Mother-dino sleeping with young curled

━━━ RULES ━━━
- Tender + warm + peaceful
- Species-accurate behavior
- Cozy lighting preferred

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
