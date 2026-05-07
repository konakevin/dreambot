#!/usr/bin/env node
/**
 * One-shot append: balance arctic_creatures from 86% baby → 50/50 adult/juvenile.
 * Existing pool: ~173 baby + ~27 adult. This appends 173 ADULT-ONLY → total 346.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_creatures.json',
  total: 346,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUTE ADULT ARCTIC CREATURE descriptions for CuddleBot's snowy-arctic path. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Frozen / Polar-Express aesthetic. Adorable stylized ADULT arctic/polar/sub-arctic creatures. NEVER photoreal, NEVER documentary nature.

This batch BALANCES an existing pool of ~173 baby/juvenile entries. Your job is ADULTS ONLY so the final pool reaches 50/50.

Each entry: 10-20 words. ONE specific cute ADULT arctic creature with 2-3 identifying cute details.

━━━ STRICT AGE RULE — NON-NEGOTIABLE ━━━
Every entry features a FULL-GROWN ADULT animal. The vibe: mature, settled, dignified, weathered-but-still-cute.
ABSOLUTELY BANNED words/prefixes: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, calf, piglet, fledgling, nestling, hatchling, juvenile, young.
Use instead: adult, mature, grown, full-grown, old, elder, weathered, wise, settled, broad, long-whiskered, gnarled, dignified, stout, lone, wandering.

━━━ ABSOLUTE RULE — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique arctic/polar/sub-arctic species. Zero repeats. Use the FULL polar biome — pack ice + tundra + alpine + boreal forest + arctic stream + mammals + birds + sea-creatures (cute, no menace).

━━━ REAL ADULT ARCTIC CREATURES (use widely + variants) ━━━
adult polar bear (broad-shouldered), mature arctic fox in winter coat, adult arctic fox in summer coat, full-grown snowshoe hare, adult arctic hare, mature ermine, adult stoat, adult weasel, mature lemming, adult arctic vole, adult musk-ox with shaggy coat, adult reindeer with full antlers, mature caribou, adult moose, adult elk, adult Eurasian-elk, mature wolverine, adult lynx (Canada), adult Siberian-lynx, mature fisher-cat, adult marten, adult sable, mature mink, adult river-otter (cold-water), adult sea-otter (Pacific), adult walrus (round + tusked), adult seal (harbor), adult harp-seal, adult ringed-seal, adult bearded-seal, adult ribbon-seal, mature beluga-whale, adult narwhal (single tusk), adult orca (cute Sanrio-style), adult bowhead-whale, adult Greenland-shark (chibi smiling), adult adelie-penguin, adult emperor-penguin, adult gentoo-penguin, adult chinstrap-penguin, adult macaroni-penguin, adult king-penguin, adult rockhopper-penguin, adult snowy-owl, adult great-grey-owl, adult boreal-owl, adult ptarmigan (white winter), adult willow-grouse, adult arctic-tern, adult puffin, adult horned-puffin, adult Atlantic-puffin, adult auk, adult guillemot, adult eider-duck, adult king-eider, mature gyrfalcon, adult northern-goshawk, adult raven (snowy mountain), adult bald-eagle, adult golden-eagle, adult dipper-bird (boreal stream), adult crossbill, adult redpoll, adult snow-bunting, adult ivory-gull, adult arctic-skua.

━━━ FANTASY / MAGICAL ADULT ARCTIC (~25% of entries) ━━━
elder snow-pixie, mature frost-fairy, wise icicle-sprite, ancient aurora-spirit, gnarled tundra-elder, settled glacier-nymph, old snowflake-fairy, elder boreal-spirit, mature aurora-fox-spirit, wise snow-owl-spirit, mature ice-flower-fairy, elder pine-spirit, dignified snow-deer-spirit, mature crystal-spirit, elder polar-spirit, wise reindeer-elder.

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Pixar / Sanrio / Disney stylized — NEVER photoreal
- ADULT proportions allowed: broad chest, full coat, dignified posture
- Eyes still expressive but wiser/narrower than baby-huge
- Thick fluffy/velvet winter coats with optional silver-tipped tufts or weathered patches, optional scarred ear-notch
- Optional cute accessories: tiny knit scarf, jingle-bell collar, fur-trim cape, lantern-pouch, seed-pouch, woven snowshoes
- Pose: settled in snow, watching the horizon, walking purposefully through drifts, perched on a snow-cliff, gathering — never baby-cuddling, never blinking-up-helpless

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO predator-prey violence — NO blood-on-snow, NO hunt-scenes, NO menace
- NO grim arctic / NO blizzard-survival-horror / NO frozen-desperation
- NO climate-change-grim
- NO identifiable real humans
- NO baby/juvenile language (see STRICT AGE RULE)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE ADULT SPECIES NAME. Scan "ALREADY GENERATED" carefully — don't repeat the species even at a different age. With 60+ real arctic + 16 fantasy adults available, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Adult polar bear: broad shoulders, dewy obsidian eyes, thick cream coat with snow-dust, gentle half-smile, settled by a snow-drift"
- "Mature snowy-owl: enormous golden eyes wise with age, snow-white feathers tipped silver, perched proudly on a frosted pine bough"
- "Adult arctic fox in winter coat: full thick white fur with silver-tipped tail, sharp-but-soft eyes, walking dignified across moonlit snow"
- "Mature reindeer: full antler-rack with velvet-tips, dewy hazel eyes, long winter coat dusted with snowflakes, jingle-bell harness"
- "Adult walrus: broad round body, dewy eyes, long polished tusks, weathered whiskers, settled atop a sun-warm ice-floe with peaceful smile"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
