#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_action_moment.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ACTION-MOMENT entries for a MangaBot ghibli-countryside keyframe. CANDID mid-task — the rural verb-phase the figure is caught in. Studio Ghibli quiet pastoral mid-moments — Kiki's deliveries, Mei's discoveries, Chihiro's pauses, Sheeta's quiet observations.

Each entry: 8-18 words. ONE specific rural verb-phase with body-language detail.

VARIETY across these task-types:
- LAUNDRY (hanging sheets, pinning clothes, lifting basket)
- GARDEN (picking flowers, weeding, harvesting vegetables, planting)
- KITCHEN (kneading bread dough, stirring pot, slicing vegetables, pouring tea)
- WATER (drawing from well, washing rice in stream, refilling kettle)
- ANIMAL CARE (feeding chickens, milking cow, tending bee-hive)
- WALKING / CYCLING (mid-stride down dirt path, bicycle mid-pedal, mid-step over stones)
- OBSERVATION (peering at flower, watching bird, kneeling to inspect pebble)
- ARTISTIC (sketching scene, painting in field, writing in journal)
- WORK (carrying basket, sweeping engawa, mending fishing-net, weaving)
- LEISURE (drinking tea on porch, eating onigiri, napping under tree)
- INTERACTION (handing tomato to grandma, helping child up, sharing umbrella)
- ARRIVING / DEPARTING (closing gate, lifting bag, stepping off bridge)

DO write:
- Hanging laundry on a line, mid-reach with a wooden clothespin between teeth, basket at the feet
- Picking wildflowers from a meadow, basket already half-full, kneeling in the grass
- Kneading bread dough on a wooden countertop, flour-dusted forearms, mid-press
- Drawing water from a stone well, bucket halfway up, rope braided around the hands
- Feeding chickens from a wooden bowl, mid-scatter, hens clustered at the feet
- Mid-stride down a dirt path, sun-hat held in one hand against a breeze
- Bicycle mid-pedal down a rural road, satchel-strap fluttering, weight-shifted forward
- Kneeling to peer at a wildflower up close, fingertip lightly touching a petal
- Sketching in a field with a small notebook open across the knees, pencil-poised
- Carrying a woven basket of tomatoes on the hip, walking back toward the cottage
- Drinking tea on the engawa porch, both hands wrapped around the warm cup
- Handing a freshly-picked persimmon to grandma, both figures' hands meeting mid-air
- Closing the wooden cottage gate behind, latch just fastened, hand still on the post

DO NOT write:
- Posed model-stance (looking at camera, heroic)
- Specific named techniques
- Eye-contact with viewer
- Urban / modern / tech actions
- Multiple actions per entry — ONE clear verb-phase
- Combat / weapons / violence

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
