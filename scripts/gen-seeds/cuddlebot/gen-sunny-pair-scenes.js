#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/sunny_pair_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUNNY-PAIR SCENE descriptions for CuddleBot's sunny-pair path. BRIGHT, GOLDEN-HOUR, SUN-DRENCHED outdoor settings where cute creature pairs cuddle/picnic/play. The SUNSHINE is the differentiator — warm-gold light is the dominant atmospheric element. Pixar / Sanrio / Studio Ghibli / My-Neighbor-Totoro-summer / Heidi / Anne-of-Green-Gables aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 18-28 words. ONE specific sunny outdoor scene with HABITAT details + cute interaction hint.

━━━ HABITAT TYPES (mix broadly across all entries) ━━━
- Sunflower field at noon (towering sunflowers, drifting bumblebees, sun-glittering yellow petals)
- Summer wildflower meadow (poppies, daisies, cornflowers, butterflies fluttering, golden grass)
- Hilltop picnic blanket (gingham blanket on a sunny hillside, picnic basket, lemonade jug, parasol)
- Butterfly garden (lavender bushes, swallowtails, blue-morphos, monarchs in golden light)
- Daisy meadow with chain-flower headbands (chain-of-daisies the creatures wear, long sunny grass)
- Hilltop oak tree (creature pair under spreading oak tree, dappled sun, blanket on the grass)
- Sunlit cherry blossom tree (creature pair under blooming cherry tree, drifting petals)
- Golden wheat field at golden hour (creature pair in waving wheat, lens-flare, scarecrow in distance)
- Bright clover hill (creature pair in clover field, drifting butterflies, soft mint grass)
- Sun-dappled forest clearing (sunbeams through leaves onto a moss-floor with creature pair)
- Strawberry patch (creature pair sharing a strawberry bigger than them, sunny meadow behind)
- Lavender field (rows of lavender, sun-warmed purple, creature pair on a path)
- Garden archway under climbing roses (creature pair in archway, roses overhead, bumblebees)
- Beach picnic at noon (sandy shore, parasol, picnic blanket, gentle wave-edges, sun-glittering water)
- Sunlit poppy field (red poppies in golden light, creature pair amidst, breeze-swayed)
- Backyard kid-pool sunny day (creature pair lounging beside a kid-pool with rubber duck, parasol)
- Apple orchard noon (creature pair under apple tree, golden sun through leaves, fruit baskets)
- Sunny meadow swing (creature pair on a wooden swing slung from a sunny tree, daisy meadow behind)
- Hammock sunny garden (creature pair cuddled in a hammock between two trees, dappled sun)
- Garden vegetable patch (creature pair amid bright-green lettuce + tomato vines, sunflower behind)
- Daisy-chain crown afternoon (creature pair making daisy-chain crowns, meadow stretching)
- Lemonade-stand picnic (creature pair at a tiny lemonade stand on a sunny lane)
- Sunset beach pair (creature pair on warm sand at golden hour, parasol leaning, sand pail)
- Sunny pond with lily-pads (creature pair on a sunny pond bank, lily pads, dragonflies, willows)
- Bicycle-and-basket field (tiny bicycle parked, basket of flowers, creature pair on the grass)

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- STRONG WARM-GOLD sunlight is non-negotiable — bright daytime / golden-hour, sun-glittering surfaces, lens-flare optional, soft sky-blue overhead
- Sunny palette: golden honey-warm sunlight + sky-blue + soft mint-green grass + buttercup-yellow + cream-cloud + petal-pink + lavender-violet
- Lens-flare sparkles, drifting butterflies, dandelion-fluff seeds floating, breeze-tousled grass, sunbeam-pillars through leaves
- The scene ANTICIPATES creatures — leave room for cute pair to do something cute (picnic-nap, share food, peek at butterflies, daisy-chain)
- Wonder + safety + warmth — pure summer-afternoon joy, never melancholy

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO overcast / NO gray / NO rain / NO storm — this path is ALWAYS bright sun
- NO scary / NO menace
- NO identifiable humans (only optional small distant cottage in background)
- NO modern infrastructure (no cars, no power-lines, no concrete)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat-type + key-feature + time-of-day-within-sunny. "Sunflower field at noon" and "wildflower meadow with sunflowers" are TOO SIMILAR. Vary HABITAT + LIGHT-CONDITION (golden-hour vs noon vs late-afternoon) + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Sunflower field at golden hour, towering sunflowers backlit gold, drifting bumblebees, lens-flare sparkles, soft mint grass at the base"
- "Hilltop oak tree at noon, dappled-sun on a gingham blanket, picnic basket open, lemonade jug, daisy-meadow stretching beyond"
- "Butterfly garden afternoon, lavender bushes in bloom, swallowtail and blue-morpho butterflies, sun-warmed paths, creature-room left in foreground"
- "Sunlit poppy field at noon, red poppies under golden light, breeze-swayed, sky-blue overhead with a single fluffy cloud"
- "Strawberry patch at golden hour, oversized strawberries glistening, sun through leaves, creature-pair-room left at the front"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
