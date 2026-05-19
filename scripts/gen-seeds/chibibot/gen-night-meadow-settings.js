#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_settings.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} NIGHT-MEADOW SETTING descriptions for ChibiBot — the spectacular NIGHTTIME OUTDOOR STAGE where adorable cuddly critters share twilight/night-time moments together under the stars. The SETTING is the meadow/glade/forest-clearing/hilltop/etc. — the where, the ground, the framing landscape. Each entry must feel like a frame from a different page of a "tiny creatures gazing at the stars" picture book.

Each entry: 15-25 words. ONE specific nighttime outdoor setting. NO creatures (separate axis). NO interaction / activity (separate axis). NO time-of-night language ("under a full moon" / "at dusk" — separate axis). NO props ("with a lantern" — separate axis). NO weather / phenomenon. Just the SETTING — the geography, ground, surrounding flora, and ambient nighttime mood.

━━━ THE BAR: WILD NIGHTTIME DESTINATIONS, NOT GENERIC "MEADOW" ━━━

Every setting should answer "WHERE outdoors at night is this?" with specific landscape + ground + signature flora/feature. The cuddle moment can happen anywhere outdoors at night — open meadow / forest clearing / hilltop / mushroom grove / cliff edge / lake shore / mountain pass / fairy ring / starlit garden / bluebell hollow.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% open-meadow / wildflower-field (rolling wildflower meadow scattered with white daisies and tall grass / silver-grass meadow dotted with dandelion clocks / poppy field at the edge of a hill / clover meadow with stone wall nearby / lavender field stretching to a distant horizon)
- 15% forest-clearing / glade (mossy forest clearing ringed by ancient oaks with hanging vines / silver-birch glade with dappled forest floor / pine-clearing with fallen needles carpeting the ground / fern-circle clearing in deep woods / heart-shaped clearing in birch grove)
- 15% hilltop / overlook / cliff-edge (grassy hilltop overlooking a sleeping valley / rocky cliff-edge with sweeping panoramic view / wildflower-strewn knoll above misty forest / cliff overlooking distant village lights / mountain-pass meadow with peaks in distance)
- 15% mushroom-grove / fairy-realm (mossy mushroom grove with red-capped fungi clusters / fairy-ring clearing among twisted oaks / glow-mushroom hollow in deep woods / mushroom-pillar grove with bell-shaped caps / faerie circle of toadstools in moonlit glade)
- 10% water-adjacent outdoor (reedy pond bank with cattails / mossy creek-side meadow with stepping stones / lakeside dock with reeds rustling / waterfall basin in a forest clearing / lily-pad pond on the meadow's edge)
- 10% garden / cottagecore-outdoor (overgrown cottage garden with climbing roses / kitchen-garden patch with herb borders / wildflower border of a stone walkway / vegetable-patch under a trellis / abandoned chateau garden with statues)
- 5% sky-island / floating-meadow (floating-island meadow drifting in starry sky / cloud-meadow at sunset-blue-hour / sky-garden suspended in twilight / treehouse-veranda meadow with vines)
- 5% magical-realm (crystal cave with moss floor opening to night sky / glowing mushroom canopy / phosphorescent moss patch / lightning-bug hollow with floating glow / aurora-reflecting pool meadow)
- 5% biome-extreme nighttime (arctic snow meadow with northern lights / desert oasis under starlit sky / tropical jungle clearing under moon / autumn-leaf-carpeted forest patch)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete landscape anchor + specific ground texture (mossy / dewy-grass / fallen-pine-needles / fern-floor / wildflower-strewn / stone-bordered / fungi-dotted)
- Material truth: moss, lichen, dew, wildflower clusters, tall grasses, mushroom caps, stone, birch bark
- Specific signature feature (heart-shaped clearing / cliff overlook / fairy-ring / waterfall plunge / floating-meadow / mushroom-cluster)
- Picture-able as one mental still frame — you can SEE the geography from the entry alone

━━━ DEDUP DIMENSIONS ━━━

Dedup by: landscape type + ground texture + signature feature. "wildflower meadow with white daisies" and "daisy-strewn meadow at edge of woods" are duplicates. "wildflower meadow" and "forest clearing in ancient oaks" are distinct.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO interactions / activity verbs
- NO TIME-OF-NIGHT language (no "moonlit" / "under stars" / "twilight" / "at dusk" / "full moon overhead" — those belong to time_of_night axis)
- NO weather (no "rainy" / "snowy")
- NO props (no "with a lantern" / "telescope set up")
- NO dark / spooky / scary / haunted undertones (no "abandoned" / "creepy" / "decrepit")
- NO daytime imagery (this path is strictly nighttime — but DON'T mention "night" / "twilight" in the entry; let it be implicit, the setting just describes geography)
- NO modern features (parking lots / power lines / city skyline) unless explicitly listed under cottagecore

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
