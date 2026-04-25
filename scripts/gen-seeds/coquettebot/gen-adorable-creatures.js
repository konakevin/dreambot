#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/adorable_creatures.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ADORABLE CREATURE descriptions for CoquetteBot's adorable-creatures path — tiny cute creatures in soft pink pastel settings. Fantasy + exaggerated-real. Big dewy eyes. No clothing focus (couture path handles clothing).

Each entry: 15-30 words. One adorable creature + immediate setting context.

━━━ CATEGORIES ━━━
- Fantasy-cute (baby unicorn with rose-gold mane on cherry-blossom path, pink baby phoenix in cotton-candy cloud, star-bunny with constellation-freckles)
- Exaggerated-real with dewy eyes (big-eyed baby sloth with flower crown, fluff-ball bunny with dewy eyes nose-to-rose, soft-fur kitten with sparkle-whiskers)
- Mouse / bunny / hedgehog (all hyper-cute versions — tiny mouse with pearl bow, bunny with strawberry, hedgehog in rose field)
- Tiny dragons (pastel-pink baby dragon with ribbon, rose-scaled hatchling, cherry-blossom dragonling)
- Puffballs (cloud-kitten, blush-moss-sprite, cotton-candy-bubble creature)
- Seasonal cute (autumn-leaf fox kit, winter-frost bunny, spring-peony lamb)
- Whimsical invented (rose-petal fairy-cat, bow-tailed puff-bunny, pearl-nosed baby deer)
- Tea-garden creatures (teacup-mouse, saucer-spider-sprite cute, sugar-rabbit)
- Ballet-creatures (dancing baby swan, tutu-wearing cat small reference — but no clothing focus, just atmosphere)
- Fairy-tiny dragons / unicorns / fauns

━━━ RULES ━━━
- Stylized only — never photoreal
- BIG dewy eyes, soft round shapes
- Pink / pastel / dreamy settings as backdrop
- No clothing focus (save that for couture path)
- NO humans, NO edgy, NO dark

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
