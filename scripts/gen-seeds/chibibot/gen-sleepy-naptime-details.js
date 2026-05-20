#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_details.json',
  total: 150,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COZY-PERSONAL-ACCENT details for ChibiBot sleepy-naptime — the sleeper's PERSONAL FAVORITE THINGS arranged around them, the kind of cute accents a child would have at bedtime that make the scene feel full and lived-in. Each render picks 3 (pickN:3).

Each entry: 10-18 words. ONE specific cozy-personal-accent. Think the kind of stuff that makes a kid's bedside look cute and personal: their favorite stuffed animal, a colorful patterned blanket, an open storybook, a candle in a jar, slippers tucked underneath, a sleeping pet companion, etc.

━━━ THE BAR — PERSONAL CUTE ACCENTS THE SLEEPER LOVES ━━━

Each entry should evoke "this is THEIR thing" — a personal touch. Patterned/colorful textiles, named-soft-toys, favorite-books, treasured-objects, a small companion-pet. The room/spot feels INHABITED by this particular sleeper.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% STUFFED ANIMAL / TOY companion (small plush teddy clutched in one paw / floppy plush bunny tucked under the chin / tiny stuffed elephant under one arm / patchwork rag-doll beside the pillow / plush mushroom hugged close)
- 15% COLORFUL BLANKET / TEXTILE (rainbow-striped patchwork quilt half-pulled-up / yellow-polka-dot blanket bunched around shoulders / pink-and-cream knit blanket with pom-poms / hand-embroidered floral quilt / chunky mint-green throw)
- 15% SLEEPING COMPANION-PET (tiny kitten curled at the sleeper's feet / sleeping puppy snuggled into the sleeper's side / small bird tucked under wing on a nearby perch / pet mouse asleep in a matching tiny bed / hamster curled in a teacup nearby)
- 15% CANDLE / NIGHTLIGHT (warm beeswax candle in a glass jar glowing soft on a small table / paper-lantern nightlight casting warm glow / firefly-in-a-jar nightlight on a shelf / small lamp with a stained-glass shade)
- 10% BOOK / STORYTIME (open storybook face-down beside the sleeper with illustrations visible / leather-bound storybook on the pillow / picture book half-fallen with pages splayed / fairy-tale anthology open to a marked page)
- 10% BEVERAGE / SNACK (empty cocoa mug with a tiny spoon on a saucer / a half-eaten cookie on a plate / glass of warm milk with a saucer / tiny teapot with one tipped teacup)
- 5% SLIPPER / SHOE (pair of tiny pink fuzzy slippers tucked under the bed / yellow rubber boots paired neatly nearby / tiny knitted booties beside the pillow / one slipper kicked off mid-bed)
- 5% FRAMED-PHOTO / KEEPSAKE (tiny framed photo of a family on a bedside / pressed-flower in a tiny frame on a shelf / treasured locket on a pillow / tiny crown placed on a nearby cushion)
- 5% MAGICAL-PERSONAL (tiny wish-pebble glowing softly / dream-jar with captured fireflies / a single named-magical-acorn on a shelf / a tiny enchanted music-box)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- ONE concrete personal-cute item with cuteness and warmth
- SPECIFIC color / pattern / texture that feels personal
- Placed WHERE the sleeper can see/reach it (on pillow, beside them, at feet, on a small table nearby)

━━━ HARD BANS ━━━

- NO creatures or characters as the FOCAL sleeper (the sleeper is the separate axis; companion-pet is OK because it's a secondary cute detail)
- NO time / weather / sleep-pose language
- NO modern tech (no phones, TVs, tablets)
- NO scary / dark items

━━━ DEDUP ━━━

Dedup by accent-type + concrete color/pattern detail.

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
