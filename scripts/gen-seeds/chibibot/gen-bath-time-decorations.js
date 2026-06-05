#!/usr/bin/env node
/**
 * ChibiBot bath-time DECORATIONS — cozy bath props that frame the scene.
 * Pick 2 per render. New pool for the lean 6-axis rebuild (2026-06-05).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_decorations.json',
  total: 100,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BATH DECORATIONS for ChibiBot — single cozy props that frame an adorable bath scene. Each render picks 2 from this pool to layer in.

Each entry: 8-15 words. ONE specific prop with material + placement detail.

━━━ FORMAT — one prop, materialed + placed ━━━

"Fluffy white folded towel resting on a small wooden stool beside the tub."
"Amber bar of soap on a brass dish on the bath rim."
"Wooden rubber duck floating in the foam mounds."
"Trailing pothos in a small clay pot on the floor."
"Ceramic mug of steaming tea perched on the bath rim."
"Amber glass jar of bath salts on a wooden shelf."
"Paper lantern hanging from a wooden beam above the tub."
"Tiny embroidered bath mat rolled at the bath's edge."
"Small terracotta pot of mint on the windowsill."
"Honey-glass apothecary jar of dried lavender on a low shelf."

━━━ VARIETY ACROSS PROP TYPES (roughly 3 entries each) ━━━

- Towels — folded / rolled / draped / embroidered / fluffy / cotton
- Soap + bath products — soap bar, soap dish, shampoo bottle, salt jar, oil bottle
- Lighting props — candles, paper lanterns, glass-jar candles, brass lamps, taper candles
- Bath toys — rubber duck, wooden boat, tiny floating animal
- Plants — pothos / fern / mint / lavender / aloe / single eucalyptus stem
- Drinks + small treats — mug of tea, glass of water, tiny saucer of cookies
- Stools + furniture — wooden stool, low bath bench, small side-table, rolled bath mat
- Glass + jars — apothecary jars, dried-flower jars, sea-glass bottles
- Books / cozy reads — small leather-bound book left open on a stool, journal beside the tub

━━━ THE BAR — every entry meets all 3 ━━━

- ONE specific prop (not a stack of three)
- Material named (wooden, ceramic, glass, terracotta, brass, cotton, etc.)
- Placement named (on the rim / on the floor / on a stool / on the windowsill / hanging / floating)

━━━ OUTPUT ━━━

JSON array of ${n} strings. One per line. No preamble, no numbering, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
