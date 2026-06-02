#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_amenities.json',
  total: 100,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BATH AMENITY descriptions for ChibiBot — the tiny accessory props that stack to amplify bath-cuteness. The amenity is a SPECIFIC PROP placed in/around the bath. Each render picks 2 of these (pickN:2) so each entry must be distinct enough to layer with another.

Each entry: 8-15 words. ONE specific bath prop with concrete visual detail. NO setting / creature / activity language.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Concrete prop with a specific detail (yellow rubber duck with painted-on smile / tiny glass shampoo bottle with cork stopper / pink candle in brass holder / striped washcloth folded on a shelf)
- Picture-able at tiny scale
- Adds CHARM without adding subject focus (these are second-tier — the creature is always the hero)

━━━ CATEGORY DISTRIBUTION ━━━
- 25% rubber duck variants (classic yellow / red bowtie / sailor hat / glitter / pirate / dragon / rainbow / sparkly / floating in formation)
- 20% candles + light (taper candles in brass holders / floating candles / pink votives / scented candles in glass jars / paper lanterns above / fairy-lights strung)
- 15% bath products (glass shampoo bottles with cork stoppers / pastel soap bars with petals embedded / wooden brush / loofah on hook / bath salts in mason jar / herb sachets / face-cloth folded on rim)
- 15% bath toys (tiny floating boats / wind-up turtle / soap-bubble pipe / sponge animals / leaf-boat fleet / origami swan / rubber sea-creatures)
- 10% steam-and-water effects-as-prop (steamy mirror with finger-drawn heart / dripping faucet shaped like swan / showerhead like a flower / bath plug on a chain)
- 10% textiles (fluffy folded towels in a stack / waffle-knit robe on hook / striped pajamas hanging / monogrammed bath mat / round shaggy rug)
- 5% magical-realm (glowing potion bottle / firefly-jar nightlight / sparkling salt crystals / floating wish-petal)

━━━ DEDUP DIMENSIONS ━━━
Dedup by: prop type + concrete detail. "yellow rubber duck with painted smile" and "classic rubber duck yellow with smile painted on" are duplicates. "yellow rubber duck" and "sailor-hat rubber duck" are distinct.

━━━ HARD BANS ━━━
- NO creatures or characters (separate axis)
- NO activity verbs (separate axis)
- NO setting (separate axis)
- NO time/weather

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
