#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII SURPRISE-ELEMENT entries — small cute secondary subjects at midground/background.

Each entry: 10-18 words. Element + placement + implies kawaii world.

VARIETY:
- 18% CUTE-PET (cat-pet at her feet / bunny-companion sitting beside / Pomeranian-puppy on shoulder / capybara mid-snooze nearby)
- 14% PLUSHIE-COMPANION (small plushie on table edge / mini-plushie peeking from bag / mascot-plushie on chair beside)
- 12% FLOATING-SPARKLES (heart-bubbles drifting at midground / star-sparkles cascading / pastel-glitter drift)
- 10% DESSERT-PROP (tiered cupcake-stand behind / parfait-cup at counter edge / macaron-tower at midground)
- 8% MASCOT-CAFE (mascot-character cardboard cutout / character-cushion on bench / mascot-sign at background)
- 8% FLORAL (cherry-blossom branch with petals drifting / single rose in vase at midground / floral-wreath on wall)
- 6% LIGHTING-MAGIC (fairy-light strings at midground / paper-lantern glow / heart-shaped lampshade)
- 6% TOY-SHELF (gachapon-machine in deep background / plushie-shelf at midground / charm-display nearby)
- 6% MUSIC/CHIME (chime-string at edge tinkling / music-box on table / mini-harp resting nearby)
- 6% NATURE-CUTE (butterfly-cute at midground / bird-cute on branch / squirrel peeking from bush)
- 6% TEACUP/MEAL (teacup-set on table edge / bento-box at midground / boba-tea cup beside her)

DO write:
- Pink cat-pet at her feet looking up with curious eyes, tail tip catching pastel light
- Mini Pompompurin-coded plushie peeking from her tote-bag, ribbon tied around neck
- Heart-bubbles drifting at midground around her shoulders, three large bubbles catching sparkle
- Tiered cupcake-stand on table beside her at midground, frosting catching pastel light
- Cherry-blossom branch with petals drifting through midground, three petals catching golden hour

DO NOT: foreground competing with hero / "distant vista" / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
