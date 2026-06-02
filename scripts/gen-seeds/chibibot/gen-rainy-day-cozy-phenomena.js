#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot rainy-day-cozy — magical or atmospheric events that crank drama when they fire (60%-gated).

Each entry: 15-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% rain-amplification (sudden heavy downpour drumming the shelter roof in waves / hail playfully bouncing off the eaves / fat lazy raindrops the size of marbles falling slow / rain breaking through clouds in golden god-rays)
- 20% rainbow / light-event (perfect rainbow arching impossibly bright outside the shelter / double rainbow forming through the rain / single golden sunbeam piercing through clouds onto the shelter / sun-pillar descending into rain)
- 15% mist / fog (warm mist rising off heated stones / fog rolling in around the shelter / steam-curtains from a nearby pond / cottony fog wrapping the world beyond)
- 15% magical phenomenon (floating glowing dandelion seeds drifting around the shelter / fireflies daring out in the rain forming a halo / sparkle-rain mixed with regular rain / wishing-stars descending)
- 10% drift / seasonal (cherry-blossom petals carried by rain into the shelter / autumn leaves swirling past the shelter / falling rose petals catching drops / wet dandelion-floss in motion)
- 10% pond / water-feature (giant ripple spreading across nearby puddle / lily-pads opening in the rain / circular waves in concentric ripples)
- 5% animal-event (deer pair stepping out of the trees in the distance / massive butterfly migration through rain / rabbit-family running past the shelter)

━━━ HARD BANS ━━━

- NO scary storms / lightning-strikes / flooding / damage
- NO indoor scenes
- NO creatures as focal subject

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
