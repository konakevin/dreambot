#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_props.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ADVENTURE PROPS for ChibiBot outdoor-adventure — small adventure gear that the chibi creature is holding or wearing as they explore the wild.

Each entry: 8-15 words. ONE specific prop. NO creatures, NO settings, NO activities.

━━━ FORMAT — SPECIFIC ADVENTURE PROP ━━━

Examples:
✓ "Leaf-knapsack stuffed with foraged berries on their back"
✓ "Tiny walking-stick gripped in one paw"
✓ "Acorn-cap helmet perched askew on their head"
✓ "Butterfly-net resting over one shoulder"
✓ "Glow-jar clutched in both paws lighting the way"
✓ "Wool scarf trailing behind in the wind"
✓ "Sun-hat with chin-strap and wildflower tucked in the brim"
✓ "Spy-glass held to one eye"
✓ "Tiny rolled-up parchment map tucked under one arm"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% BAG / KNAPSACK (leaf-knapsack / acorn-pack / mushroom-pouch / vine-rope-satchel / tiny adventure-pack)
- 15% HEADGEAR (sun-hat / safari-hat / wool-beanie / acorn-cap-helmet / leaf-bonnet / explorer's pith-helmet)
- 15% TOOL (walking-stick / staff / pocket-knife / climbing-rope / paddle-twig / butterfly-net)
- 10% LIGHT (lantern / glow-jar / firefly-jar / brass-lamp / candle in a jar)
- 10% MAP / NAVIGATION (rolled-parchment-map / brass-compass / spy-glass / binoculars / sketchbook)
- 10% CLOTHING-ACCENT (wool scarf / poncho / cape / acorn-cap-cloak / leaf-cloak)
- 5% CONTAINER (specimen-jar / berry-basket / leaf-cup / mushroom-bowl / pinecone-canister)
- 5% MUSICAL (tiny tin-whistle on a cord / reed-flute / acorn-bell / pinecone-rattle)
- 5% MISC (acorn-canteen / pinecone-flask / curled-paper-list / butterfly-bow on a stick)
- 5% NONE (creature wears no prop — bare adventurer, no accessory at all)

━━━ HARD MANDATES ━━━

- The prop is small, charming, fitting for a chibi-scale creature
- Pixar painterly storybook register
- Adventure-appropriate (not random everyday objects)

━━━ HARD BANS ━━━

- NO creatures / characters
- NO setting / wilderness language
- NO activity verbs
- NO modern tech (no phone, watch, etc.)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
