#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot outdoor-adventure — tiny second-tier details the eye finds after the wilderness + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away wilderness surprise.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% TINY-SECONDARY-CREATURE (a butterfly resting on a fern / a chipmunk peeking from a log / a bird mid-flight in deep midground / a frog on a lily-pad / a deer-trail visible at the edge)
- 15% MAGIC-NATURE (a glowing-mushroom-cluster in shadow / a luminous-flower mid-bloom / a will-o-wisp drifting / glowing-spores rising / a fairy-light-trail through trees)
- 15% TRAIL / TRACK (a paw-print trail leading into trees / a tiny boot-print path / a leaf-rustle trail / a mossy-stone-path winding off)
- 10% WATER-FEATURE (a hidden waterfall in deep midground / a still-pond reflecting sky / a stream-bend disappearing into mist / a dripping icicle)
- 10% LIGHT-MOMENT (a single sun-shaft piercing the canopy onto a flower / a rainbow-prism on a dewdrop / a light-pillar between trees)
- 10% FLORA-WONDER (a giant flower in bloom / a cluster of unusual mushrooms / a tree with rainbow-bark / a glowing-blossom)
- 5% ANIMAL-FAR-AWAY (a stag silhouetted in misty distance / an owl on a high branch / a heron in mid-flight overhead / a flock of birds rising)
- 5% MAP / CLUE (a tied-twig-arrow trail-marker / a stacked-stone cairn / a tied ribbon on a branch / a hand-carved trail-sign on a tree)
- 5% MAGICAL-ARTIFACT (a glowing-stone half-buried / a crystal-shard on a rock / an enchanted-feather floating / a small golden key)
- 5% MUSHROOM-RING / SEASON (a fairy-ring of mushrooms / autumn-leaf-spiral / spring-blossom-carpet / snow-shaped-bunny tracks)

━━━ HARD BANS ━━━

- NO main creature / hero creature
- NO setting / wilderness language
- NO time / weather / activity verbs

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
