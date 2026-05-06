#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cozybot/seeds/arctic_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE ARCTIC CREATURE descriptions for CuddleBot's snowy-arctic path. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Happy-Feet / baby-animal-Christmas-special aesthetic. NEVER photoreal, NEVER documentary nature. Adorable stylized baby arctic / sub-arctic / alpine creatures.

Each entry: 10-20 words. ONE specific cute arctic creature with 2-3 identifying cute details (eye type, body texture, accessories, pose).

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique arctic/sub-arctic/alpine species. Zero repeats. Use the FULL cold-biome — polar / tundra / taiga / alpine / sub-arctic + sea-ice + snowy-mountain + winter-forest + cute-fantasy-arctic.

━━━ REAL ARCTIC / COLD-BIOME CREATURES (use widely + variants) ━━━
polar bear cub, baby brown-bear cub (snowy), baby grizzly cub (snowy), baby panda cub (snow), baby red-panda (snow), arctic fox kit, arctic fox kit (winter-white), arctic fox kit (summer-brown), red fox kit (snowy), snow-leopard cub, lynx kitten, bobcat kitten (snowy), Iberian-lynx kitten (snowy chibi), wolf pup (snowy), arctic-wolf pup, husky puppy, malamute puppy, samoyed puppy (smiling), reindeer/caribou calf, baby moose, baby elk, baby caribou, baby muskox, baby yak, baby alpaca, baby llama (snowy mountain), baby vicuna, baby pika (rock-rabbit), baby mountain-hare, baby snowshoe-hare, baby arctic-hare, baby ermine (winter-white), baby stoat (winter-white), baby weasel (winter-white), baby ferret, baby marten, baby wolverine cub (chibi-cute), baby beaver (snowy), baby river-otter (winter), baby sea-otter (cold-water), baby seal pup, baby harp-seal pup, baby weddell-seal pup, baby ringed-seal pup, baby ribbon-seal, baby walrus pup, baby narwhal calf (icy), baby beluga calf, baby orca calf (no menace), emperor-penguin chick, king-penguin chick, gentoo-penguin chick, adelie-penguin chick, rockhopper-penguin chick, chinstrap-penguin chick, snowy-owl chick, great-grey-owl chick (snowy), saw-whet-owl chick, boreal-owl chick, baby ptarmigan (winter-white), baby snow-goose chick, baby gyrfalcon chick (chibi), baby kestrel (snowy), baby snowy-egret chick (snowy), baby snow-bunting, baby chickadee (winter), baby crossbill, baby pine-grosbeak, baby bullfinch (snowy), baby waxwing (snowy), baby kiwi (snowy chibi), baby kakapo, baby polar-cod cub (chibi-cute fish), baby snowflake-eel (chibi), arctic-jellyfish baby, snow-flea cute-chibi, baby reindeer-mouse, baby snow-vole, baby alpine-marmot, baby snow-leopard pup with snow-on-nose

━━━ FANTASY / MAGICAL ARCTIC (~25% of entries) ━━━
baby snow-fairy, baby frost-pixie, baby ice-sprite, baby aurora-spirit, baby snowflake-fairy, baby crystal-fox, baby frost-moth, baby snow-bunting-spirit, baby ice-dragon (round + smiling), baby snow-yeti (chibi), baby winter-nymph, baby starlight-deer (snowy), baby snow-rabbit-spirit, baby comet-bunny, baby aurora-deer, baby snow-cherub, baby polar-pixie, baby ice-mermouse, baby crystal-bunny

━━━ SUPER OVERLAY CUTE STYLE RULES (MANDATORY EVERY ENTRY) ━━━
- NEVER photoreal — Pixar / Sanrio / Disney-baby-animal stylized
- OVERSIZED dewy eyes
- ROUND chubby snow-puff body, soft fluffy / down-feather / cottonball texture
- BLUSHING cold-cheeks (pink-flushed)
- TINY stubby paws / flippers / hooves
- Optional cute accessories — tiny knitted MITTENS, scarves, earmuffs, fluffy collars, snowflake-bows, pom-pom hats, tiny-bell-bell collars
- Pose: cuddled-for-warmth, peeking-from-snow-burrow, pressed-cheek, sharing-scarf, watching-aurora, sleepy-yawning

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO predator-prey violence — NO polar-bear-hunting-seal, NO orca-attack, NO blood
- NO grim survival / NO realistic-cold-suffering / NO desperation
- NO sexualized / NO adult themes
- NO identifiable real humans

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Scan "ALREADY GENERATED". "Arctic fox kit" and "Snow fox kit" are duplicates. Vary the species enough to read as different. With 100+ real arctic + 20 fantasy creatures available, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Polar bear cub: huge dewy black eyes, fluffy snow-white halo, blushing pink-cheeks, tiny black-paw-pads, cuddled in a snow-pile"
- "Emperor-penguin chick: round downy-grey body, oversized button eyes, soft white belly, fluffy head-puff, blushing cheeks, tiny webbed feet"
- "Arctic fox kit: huge sky-blue eyes, snowy-white fluffy fur, pink-button nose, knitted red scarf, soft pink ear-tips"
- "Baby reindeer: huge brown dewy eyes, snowy-white speckled coat, tiny velvet antler-buds, blushing cheeks, jingle-bell collar"
- "Baby ermine: pearl-white winter coat, big black-button eyes, blushing pink-cheeks, dark-tipped tail, tiny knitted mittens"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
