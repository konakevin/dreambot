#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} SURPRISE-ELEMENT descriptions for ChibiBot cottagecore-village — tiny second-tier details the eye finds after the village + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away surprise detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% TINY-CREATURE (a bunny mid-hop on a path / a hedgehog by a stone wall / a sparrow on a clothesline / a butterfly on a flower)
- 15% FLORAL-ACCENT (a perfectly-bloomed cottage-rose / a wisteria-cluster in full bloom / a hollyhock-spire / a daisy-chain on a fence)
- 15% LIVED-IN (open umbrella by a door / forgotten teapot on a step / sun-hat on a fence-post / abandoned basket of flowers)
- 10% CHIMNEY-SMOKE (smoke curling from a stone chimney / steam from an outdoor tea-kettle)
- 10% TRAIL (a pebble-path winding off / a moss-stone path / footprints in dewy grass)
- 10% WATER-FEATURE (a stone-fountain in a courtyard / a duck-pond / a wooden water-pump)
- 10% MAGICAL-MOMENT (a will-o-wisp / a fairy-light cluster / a glowing-mushroom)
- 5% TOOL (a wooden rake leaning / a straw-broom by a door / a watering-can on a step)
- 5% SIGNAGE (a hand-painted "Bakery" sign / a tea-shop wooden-board / a bee-keeper's hand-painted sign)

━━━ HARD BANS ━━━

- NO main creature / hero creature
- NO setting / village language
- NO time / weather / activity verbs
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
