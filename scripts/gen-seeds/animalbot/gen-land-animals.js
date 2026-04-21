#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/land_animals.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LAND ANIMAL descriptions for AnimalBot — specific terrestrial species with distinguishing visual features. Used as the hero subject for every render.

Each entry: 10-20 words. One species + 2-3 identifying visual details.

━━━ CATEGORIES TO DRAW FROM ━━━
- Big cats (Amur tiger with blue eyes + ice-white fur, Arabian leopard spots on pale desert fur, black jaguar rosette-glinted, snow leopard with cloud-grey rosettes, Eurasian lynx with ear-tufts)
- Wolves + wild canids (arctic wolf pure white, timber wolf grey-gold, red fox winter-fluffed, fennec fox oversized ears, maned wolf stilt-legs)
- Bears (Kodiak brown bear shaggy, polar bear with black nose-snow contrast, spectacled bear white eye-ring, sloth bear shaggy-chest, panda bamboo-in-paw)
- Primates (mountain gorilla silverback, orangutan amber-fur, mandrill blue-red-face, snow monkey in hot spring, proboscis monkey long-nose)
- Deer + antelope + ungulates (elk bugling with velvet antlers, pronghorn leaping, ibex on cliff face, red deer stag in mist, Japanese serow)
- Owls + raptors (great gray owl with facial-disc, snowy owl yellow-eyes, Eurasian eagle-owl orange-eyes, golden eagle with prey, peregrine falcon in stoop, harpy eagle massive crest)
- Smaller birds (red-crowned crane dance, cardinal on snow branch, Steller's jay electric-blue, kingfisher plunging, hummingbird mid-hover, hornbill casque, bird of paradise courtship)
- Small mammals (red squirrel tufted, pika on alpine rock, mountain marten sinuous, arctic fox winter white, honey badger, pine marten, ringtail cat)
- Reptiles + amphibians (glass frog transparent belly, poison dart frog electric blue, panther chameleon spiraling, green tree python coiled, Komodo dragon massive)
- Hooved exotic (giraffe close-detail of pattern, okapi striped-legs, bongo antelope, chamois cliff-edge, markhor with spiral horns)
- Rodents + insectivores (capybara in shallows, porcupine back-spine, hedgehog curl, aardwolf nocturnal)

━━━ RULES ━━━
- LAND ANIMALS ONLY — absolutely NO marine life (OceanBot's territory)
- No fish, whales, dolphins, sharks, rays, octopuses, sea turtles, seals, sea lions, orcas, dugongs
- Wetland amphibians (frogs/salamanders) + shorebirds (heron/egret/stork) OK as long as frame is ABOVE water
- Real biology + real species only — NO fantasy creatures
- Include identifying visual features (color / patterning / distinctive feature)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
