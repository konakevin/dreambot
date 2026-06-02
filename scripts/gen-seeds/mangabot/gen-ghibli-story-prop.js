#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_story_prop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} STORY-PROP entries for a MangaBot ghibli-countryside keyframe. Each entry is a FOREGROUND PROP CLUSTER — Ghibli's signature is LIVED-IN ABUNDANCE so each entry combines 2-3 specific props to tell the story richly.

Each entry: 14-26 words. ONE cluster combining 2-3 specific props with material-truth detail.

PROP CATEGORY COMBINATIONS:
- DOMESTIC TASK CLUSTERS (laundry-basket + clothesline + wooden-clothespins / broom + dustpan + bucket)
- KITCHEN / FOOD CLUSTERS (tea-set + onigiri-plate + cooling-pie / kettle + cups + small-table)
- TRANSPORT (bicycle + satchel + watering-can / oxcart + straw-bales + yoke / wagon + vegetables)
- GARDEN (woven-basket-of-vegetables + trowel + watering-can / herb-bundle + scissors + apron)
- WORK / ART (sketchbook + pencils + scattered-leaves / fishing-rod + tackle-box + bucket)
- PERSONAL (parasol + straw-hat + journal / sandals + walking-stick + lunch-cloth)
- ANIMAL CARE (chicken-feed-bowl + scattered-grain + watering-can / cat-bowl + small-saucer-of-milk)
- ABANDONED-MID-USE (knitting-basket + half-finished-scarf + tea-cup / open-book + bookmark + spectacles)
- SEASONAL (basket-of-persimmons + drying-rack + woven-mat / hanging-chili-peppers + drying-fish)
- ARRIVAL / DEPARTURE (suitcase + parasol + traveling-cloak / satchel + folded-map + walking-stick)

DO write (combine 2-3 props per entry):
- A woven straw basket of fresh-picked vegetables + a gardening trowel half-buried in the soil + a small watering-can leaning against the basket
- A bicycle leaning against the wooden fence + a leather satchel hanging from the handlebars + a wicker basket strapped to the rear
- A picnic tea-set on a flat stone — clay teapot + two cups + a small plate of mochi + a cloth napkin folded beside
- A wooden bucket of well-water beside the stone well + a wet rope coiled neatly + a small ladle floating in the bucket
- A sketchbook open in the grass + charcoal pencils scattered + a small watercolor palette with brushes drying
- A paper parasol leaning against the cottage doorpost + a worn straw hat hanging on a peg + a small folded fan on the bench
- A pair of muddied straw sandals at the engawa step + a walking-stick leaning against the wall + a damp cloth on the rail
- A wooden tray of cooling persimmons on a flat stone + a small knife beside + a half-peeled persimmon catching the light
- A knitting-basket with half-finished wool scarf + needles still in mid-stitch + a small tea-cup beside on the porch
- An overflowing harvest-basket with corn + tomatoes + cucumbers + a gardening apron tossed over the rim
- A wooden tray of onigiri rice-balls + a kettle still steaming + a small plate of pickled vegetables + chopsticks crossed
- Hanging dried chili-peppers strung in clusters + braided garlic + drying herb-bundles + a wicker basket of harvested grain below

DO NOT write:
- Modern objects (phones / electronics / cars)
- Single isolated prop — combine 2-3
- Cyberpunk / combat / weapons
- Architectural elements
- Living animals (background_detail handles those)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
