#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII SETTING entries — cute cozy contexts where she's engaged. Anti-back-to-camera.

Each entry: 14-22 words. Setting + tactile cute-foreground + midground depth + engagement context.

VARIETY:
- 18% CHARACTER-CAFE (themed-cafe with character-mugs / dessert-shop with parfait-display / boba-tea-shop with cute charms / Sanrio-cafe interior)
- 14% PLUSHIE-ROOM (cozy bedroom piled with plushies / plushie-display shelf / Sanrio-themed pink room / fairy-light bedroom)
- 12% FESTIVAL-STALL (yatai food-stall / goldfish-scoop game-booth / hanabi-night street / matsuri lantern-lit alley)
- 10% SCHOOL-CUTE (classroom with charm-stickers / club-room with snacks / library-nook with cute-pillows / cafeteria with bento)
- 10% DESSERT-CAFE (patisserie with macaron-tower / boba-shop with toppings / parfait-counter with sparkly-fruit)
- 8% PARK/GARDEN-CUTE (cherry-blossom park with picnic-blanket / flower-garden with floral-arch / picnic-pavilion with cupcakes)
- 8% KAWAII-ROOM-INTERIOR (pastel bedroom with fairy-lights / vanity-room with hello-kitty / craft-corner with charms)
- 6% FAIRYTALE-COTTAGE (cottage-interior with knit-blanket / window-nook with tea-set / hearth-room with cat)
- 6% TOY-STORE (kawaii toy-shop interior / mascot-store with displays / gachapon-machine alcove)
- 4% AMUSEMENT-PARK (mascot-meet-greet station / ferris-wheel cabin interior / carousel platform)
- 4% RAINY-DAY-CUTE (umbrella-stand alcove / window-seat with rain / bus-stop-shelter with mascot-bag)

DO write:
- Character-cafe with character-mugs in close foreground, pastel banners receding, dessert-display behind — she sits AT counter mid-laugh
- Plushie-room with giant teddy-plushie in close foreground, fairy-lights strung overhead, pastel-pink shelves — she sits AMONG plushies mid-hug
- Festival yatai food-stall with takoyaki sizzling in close foreground, lantern-light overhead, festival-crowd-blur behind — she stands AT stall mid-bite
- Patisserie with macaron-tower in close foreground, glass-display midground, pastel walls — she stands BEHIND counter offering forward

DO NOT: "standing at window looking out over cherry-blossom park" — back-to-camera trap. Photoreal cinematography.

Every setting affords ENGAGED-WITH-CUTE-AT-HAND.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
