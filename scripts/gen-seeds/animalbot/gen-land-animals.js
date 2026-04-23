#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/land_animals.json',
  total: 300,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LAND ANIMAL descriptions for AnimalBot — specific terrestrial species with distinguishing visual features. Used as the hero subject for every render. This pool powers a high-volume bot — the bigger and more diverse, the better. There are thousands of stunning real species; stretch WIDE.

Each entry: 10-20 words. One species + 2-3 identifying visual details.

━━━ HARD DIVERSITY RULE — NON-NEGOTIABLE ━━━
ONE entry per distinct species. Do not repeat any species anywhere in the pool, not even in variation. If you've already named "red fox", do not also write "fennec fox" in another entry if it's a fox-cluster risk — actually fennec fox IS distinct from red fox, so BOTH are fine. The rule is: each entry is a DISTINCT species-level (or clear subspecies-level) animal. Never two entries for the same species. Cast the WIDEST POSSIBLE NET.

━━━ CATEGORY MENU (draw from ALL, heavy on underrepresented) ━━━

**Big cats (all 7 species + variants):** tiger (Bengal/Siberian/Sumatran), lion, leopard (spotted/black-jaguar/snow-leopard/clouded), cheetah, jaguar, cougar/puma/mountain lion

**Wild cats (small):** lynx (Canadian/Eurasian/Iberian/bobcat), caracal, serval, ocelot, margay, sand cat, Pallas's cat, fishing cat, flat-headed cat, jaguarundi, oncilla

**Canids — wolves + foxes:** gray wolf, timber wolf, arctic wolf, Mexican wolf, Ethiopian wolf, red wolf, maned wolf, dhole, African wild dog, coyote, golden jackal, black-backed jackal, side-striped jackal, red fox, arctic fox, fennec fox, Tibetan sand fox, gray fox, kit fox, swift fox, bat-eared fox, crab-eating fox, raccoon dog, dingo

**Bears:** Kodiak brown, grizzly, black bear, polar bear, giant panda, spectacled/Andean, sloth bear, sun bear, Asiatic black

**Primates:** mountain gorilla, western lowland gorilla, orangutan (Sumatran/Bornean), chimpanzee, bonobo, mandrill, snow monkey/Japanese macaque, Barbary macaque, proboscis monkey, colobus monkey, langur, silvered langur, tamarin (golden-lion/emperor), marmoset (pygmy/common), capuchin, spider monkey, howler monkey, night monkey, lemur (ring-tailed/sifaka/aye-aye/indri/red-ruffed), tarsier, slow loris, galago

**Deer + antelope + ungulates:** elk/wapiti, red deer, white-tailed deer, mule deer, moose, reindeer/caribou, fallow deer, sika deer, roe deer, muntjac, chital, muntjac, sambar, water deer (fanged), pronghorn, gazelle (Thomson's/Grant's/Dorcas), impala, gerenuk, kudu (greater/lesser), eland, bongo, nyala, sitatunga, bushbuck, oryx (Arabian/gemsbok/scimitar), addax, sable antelope, roan antelope, saiga antelope, chamois, markhor, ibex (Alpine/Siberian/Nubian), mountain goat, dall sheep, bighorn sheep, takin, muskox, yak, banteng, gaur, African buffalo, water buffalo, American bison, European bison/wisent, okapi, giraffe (reticulated/Masai/Rothschild), Japanese serow

**Owls + raptors:** great gray owl, snowy owl, Eurasian eagle-owl, barn owl, great horned owl, barred owl, long-eared owl, burrowing owl, elf owl, Blakiston's fish owl, spectacled owl, golden eagle, bald eagle, harpy eagle, martial eagle, crowned eagle, Philippine eagle, steller's sea eagle, Verreaux's eagle, peregrine falcon, gyrfalcon, saker falcon, kestrel, red-tailed hawk, Cooper's hawk, goshawk, harris hawk, osprey, secretary bird, lammergeier/bearded vulture, Andean condor, California condor, king vulture

**Other birds:** red-crowned crane, demoiselle crane, whooping crane, sarus crane, cardinal (northern), blue jay, Steller's jay, kingfisher (common/belted/pied), hummingbird (ruby-throated/Anna's/bee/sword-billed), hornbill (great/rhinoceros/Abyssinian), bird of paradise (Wilson's/greater/riflebird/king-of-Saxony), quetzal (resplendent), toucan (keel-billed/toco), flamingo (greater/lesser/Chilean/Andean/James's), pelican, stork (white/painted/marabou/saddle-billed), heron (great blue/purple/goliath), egret, spoonbill (roseate/black-faced), ibis (scarlet/glossy/sacred), shoebill, hoatzin, puffin (Atlantic/tufted/horned), kiwi, cassowary, emu, ostrich, kori bustard, hoopoe, swallow (barn), roller (lilac-breasted/European), bee-eater (European/carmine), kookaburra, lyrebird, bowerbird (satin/regent), cockatoo (sulphur-crested/palm/galah), parrot (macaw/African-grey/hyacinth), pheasant (golden/Lady-Amherst's/Reeves's), peacock (Indian/green), turkey (wild/ocellated), rooster (heritage-breed)

**Small mammals:** red squirrel, Eurasian red squirrel, flying squirrel, chipmunk, marmot (Alpine/yellow-bellied/hoary), prairie dog, groundhog, pika, stoat, ermine, weasel, pine marten, stone marten, sable, fisher, wolverine, otter (river/giant/sea — sea excluded per NO_MARINE), mink, honey badger, ratel, meerkat, mongoose (banded/dwarf/Egyptian), aardwolf, genet, civet (African/palm), binturong, red panda, hedgehog (European/African-pygmy/long-eared), tenrec, solenodon, mole, star-nosed mole, shrew, bat (fruit bat / flying fox / Kitti's hog-nosed / tube-lipped)

**Rodents (exotic):** capybara, paca, agouti, beaver, porcupine (North American/African crested), mara, pacarana, degu, chinchilla, viscacha

**Marsupials:** kangaroo (red/gray/antilopine), wallaby, wallaroo, tree kangaroo, koala, wombat, Tasmanian devil, quoll, bilby, bandicoot, sugar glider, numbat, possum (brushtail/ringtail), opossum

**Reptiles + amphibians:** Komodo dragon, monitor lizard, gila monster, frilled lizard, Jackson's chameleon, panther chameleon, veiled chameleon, leaf-tailed gecko, satanic leaf-tailed gecko, flying gecko, basilisk, thorny devil, horned lizard, iguana (green/marine-excluded/rhinoceros), anole, skink, tegu, green tree python, emerald tree boa, king cobra, bushmaster, Gaboon viper, rattlesnake (timber/diamondback), sidewinder, mamba (black/green), boomslang, milk snake, corn snake, rainbow boa, anaconda (shores OK — frame above water), glass frog, poison dart frog (blue/golden/strawberry), red-eyed tree frog, fire salamander, axolotl, newt (crested/red-spotted), caecilian, mud puppy, hellbender

**Insectivores + anteaters:** giant anteater, silky anteater, pangolin (all 8 species), aardvark, echidna (short-beaked/long-beaked), platypus

**Xenarthra:** three-toed sloth, two-toed sloth, maned sloth, armadillo (nine-banded/pink-fairy/giant/three-banded)

**Endemic island species:** lemur family (see primates), tuatara, kakapo (flightless parrot), kea, kakariki, Komodo dragon, Galápagos tortoise, Aldabra tortoise, giant panda (endemic), Tasmanian devil

**Megafauna:** African elephant, Asian elephant, forest elephant, white rhino, black rhino, Javan rhino, Sumatran rhino, Indian rhino, hippo, pygmy hippo, giraffe (see above), okapi, walrus

**Domesticated heritage (rare/striking):** Highland cattle, yak, Rex cat, Scottish Fold, Norwegian Forest cat, Maine Coon, Savannah cat, Abyssinian donkey, Przewalski's horse, Icelandic horse, Akhal-Teke horse

━━━ RULES ━━━
- LAND ANIMALS ONLY — NO marine (fish, whales, dolphins, sharks, rays, octopuses, sea turtles, seals, sea lions, orcas, dugongs, sea-otters)
- Wetland amphibians (frogs/salamanders) + shorebirds (heron/egret/stork) OK as long as frame is ABOVE water
- Real biology + real species only — NO fantasy creatures
- Include identifying visual features (color / patterning / distinctive feature / pose)
- **ONE ENTRY PER SPECIES** — never duplicate, even variants of same species
- Cast the WIDEST possible net across all categories — don't cluster

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
