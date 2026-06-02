#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_wildflower_garden.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} WILDFLOWER / GARDEN entries for a MangaBot ghibli-countryside keyframe. SIGNATURE NATURE-DENSITY LAYER — the flora that fills foreground/midground giving Ghibli its lush pastoral ABUNDANCE.

CRITICAL: each entry must read as ABUNDANT / OVERFLOWING / BURSTING / PACKED — not sparse. Combine 4-6 specific flora elements per entry, not 2-3. This is what makes Ghibli backgrounds feel maximalist.

Each entry: 18-30 words. ONE specific flora-cluster description combining MULTIPLE specific plants for maximum abundance.

FLORA TYPES (combine multiple per entry):
- WILDFLOWER MEADOW (poppies / cornflowers / daisies / yarrow / cosmos / chamomile / clover / buttercup)
- COTTAGE GARDEN (roses / hollyhocks / morning-glory / sunflowers / dahlias / foxgloves / delphiniums)
- VEGETABLE GARDEN (tomatoes / cabbages / pumpkins / squash / cucumbers on vines / corn / leeks / radish)
- HERB GARDEN (lavender / rosemary / sage / chives / mint / thyme / basil)
- FRUIT-TREES (persimmon-tree fruit / cherry-blossoms / apple-orchard / plum-blossom / orange grove / fig)
- POND FLORA (iris / lotus / water-lilies / cattails / lily-pads)
- VINE / PERGOLA (wisteria-curtain / morning-glory vine / honeysuckle / ivy)
- AUTUMN / SEASONAL (maple-leaf carpet / persimmon-laden branches / dried-herb hanging)
- BACKDROP TREES (bamboo / pines / cedars / weeping willows)
- BERRIES / SMALL FRUIT (strawberry patch / blueberry / blackberry vines / wild raspberry)

DO write (each entry combines 4-6 elements for maximum density):
- Knee-high wildflower meadow OVERFLOWING with red poppies + blue cornflowers + yellow yarrow + white daisies + scattered buttercups + clover patches, all swaying together
- Cottage garden BURSTING — climbing crimson roses on the fence + tall hollyhocks against the wall + morning-glory vines spilling overhead + sunflowers nodding behind + dahlias in pots at the doorstep
- Raised vegetable beds PACKED with ripe red tomatoes + cabbage heads + pumpkins on the ground + cucumbers climbing trellises + corn stalks behind + a tangle of squash vines
- Persimmon-tree branches LADEN with orange fruit + cherry-blossom branches overhead + a carpet of fallen petals + persimmons in a wooden basket below + tomato vines climbing a nearby trellis
- Iris-pond edge ABUNDANT with purple irises + lotus blossoms on the water + water-lilies + cattails + dragonflies hovering + a tangle of wild morning-glory on the bank
- Wisteria-curtain pergola DRAPED with lavender blossoms + hanging jasmine + climbing roses + mossy stones below + small pink hollyhocks at the base
- Aromatic herb garden LUSH — purple lavender + silver sage + chive-blossoms + creeping mint between stepping-stones + rosemary spilling over the edge + thyme cushions
- Cherry-blossom rain DENSE — pink petals coating the ground + branches heavy with blooms + a carpet of fallen petals + clover sprouting through + wild violets in the gaps
- Sunflower patch TALL — sunflowers above head-height + cosmos at knee-level + zinnias scattered + wild morning-glory climbing fence + ladybug-decorated leaves
- Strawberry patch HEAVY — ripe red strawberries + wild blackberry brambles + white-flowered raspberry canes + clover + chamomile + a wooden basket half-full of berries

DO NOT write:
- Sparse / minimal flora — must be ABUNDANT
- Single isolated species — combine 4-6 specific plants
- Modern / non-Japan exotic flora
- Foliage without specifics
- Empty composition

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
