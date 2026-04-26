#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cute_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE CREATURE descriptions for CuddleBot — adorable stylized creatures rendered in Pixar / Sanrio / Totoro energy. BIG eyes, soft round shapes, infinite cuteness.

Each entry: 10-20 words. One adorable creature with 2-3 identifying cute details (eye type, fur/texture, accessories, pose).

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT CREATURE ━━━
Each of the ${n} entries MUST be a completely different animal or creature species. ZERO repeats. Not two bunnies. Not two foxes. Not two dragons. Not two kittens. 200 entries = 200 unique species. The animal kingdom + mythology + fantasy gives you HUNDREDS to choose from.

━━━ REAL ANIMALS TO DRAW FROM (use all of these + more) ━━━
hedgehog, bunny, kitten, fox, mouse, owl, otter, panda, sloth, hamster, squirrel, duckling, frog, turtle, penguin, koala, deer, fawn, lamb, seal, puppy, raccoon, chickadee, hummingbird, robin, bluebird, cardinal, sparrow, finch, wren, dove, quail, chipmunk, beaver, badger, mole, shrew, vole, bat, moth, butterfly, bee, ladybug, caterpillar, firefly, dragonfly, snail, gecko, chameleon, axolotl, salamander, tadpole, goldfish, clownfish, seahorse, jellyfish, starfish, octopus, crab, lobster, whale, dolphin, manatee, narwhal, walrus, pig, piglet, goat, calf, chick, gosling, swan, flamingo, pelican, puffin, toucan, parrot, cockatoo, lovebird, canary, guinea pig, chinchilla, ferret, hedgehog, armadillo, possum, capybara, alpaca, llama, red panda, fennec fox, arctic fox, wolf pup, bear cub, polar bear cub, tiger cub, lion cub, leopard cub, snow leopard cub, lynx kitten, bobcat kitten, elephant calf, hippo calf, rhino calf, giraffe calf, zebra foal, monkey, lemur, sugar glider, flying squirrel, prairie dog, meerkat, wombat, platypus, kiwi bird, pangolin, tapir

━━━ FANTASY / MYTHICAL / MADE-UP CREATURES (~40% of entries) ━━━
baby dragon, baby unicorn, baby phoenix, fairy, pixie, nymph, sprite, dryad, sylph, will-o-wisp, moss-sprite, cloud-kitten, star-bunny, flower-fairy, mushroom-sprite, crystal fox, moon-rabbit, sun-bear, frost-moth, ember-bird, dewdrop-spirit, petal-dragon, rainbow-fish, thunder-chick, wind-sprite, coral-spirit, aurora-deer, forest nymph, water nymph, flower pixie, leaf fairy, moonbeam sprite, acorn gnome, toadstool elf, honey-bee fairy, firefly spirit, snowflake sprite, cherry-blossom nymph, dandelion wisp, starlight fairy, raindrop spirit, clover pixie, twilight moth-fairy, dawn sprite, meadow nymph, crystal butterfly-fairy, woodland brownie, river sprite

━━━ STYLE RULES ━━━
- ALWAYS stylized/illustrative — NEVER photoreal
- BIG eyes, soft round shapes, exaggerated cute proportions (chibi / Sanrio)
- No dark/edgy/creepy — pure wholesome delight
- Include 2-3 specific cute details per entry (eye color, fur texture, accessories like scarves/hats, pose, expression)

━━━ DEDUP DIMENSIONS — THIS IS THE MOST IMPORTANT RULE ━━━
EVERY ENTRY MUST START WITH A UNIQUE CREATURE NAME. Scan the "ALREADY GENERATED" list above — if ANY entry starts with "Hedgehog" you CANNOT write another hedgehog entry. If ANY entry contains "cat" or "kitten" you CANNOT write another cat or kitten. Same species = DUPLICATE even with different adjectives/accessories. "Tabby kitten" and "Calico kitten" are DUPLICATES. "Snow leopard cub" and "Clouded leopard kit" are DUPLICATES. Pick a COMPLETELY DIFFERENT species each time. With 150+ real animals + 50+ fantasy creatures available, there is NO excuse for repeats.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
