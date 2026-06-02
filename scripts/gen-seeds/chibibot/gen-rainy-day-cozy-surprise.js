#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_surprise.json',
  total: 150,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot rainy-day-cozy — tiny secondary details the eye finds AFTER the group of friends. Adds life and charm to the wider cozy-shelter scene during rain.

Each entry: 12-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny secondary creature (sleepy cat curled on a nearby cushion / shy mouse peeking from a knothole / songbird sheltering on a porch railing / hedgehog dozing under a leaf / butterfly resting on the umbrella underside)
- 20% reflection / puddle (puddle just outside the shelter reflecting warm shelter-glow / wet stone gleaming with reflection / drips falling from the umbrella forming tiny ripples)
- 15% drift / falling (single fall-leaf drifting onto a wet porch / petal floating on a puddle / dandelion-seed clinging to a wet stone / spider-web jeweled with raindrops)
- 15% steam / smoke (steam from a teapot curling up / smoke from a candle wisp / breath visible in cool air / wisp of incense)
- 10% domestic-detail (pair of rubber boots upside-down draining / forgotten slipper on a step / wet umbrella propped to dry / mug ring on a wooden table)
- 10% magical-ambient (firefly improbably out in the rain / floating glow-orb / sparkle-rain caught in a leaf / will-o-wisp peeking around a tree)
- 5% distant-world (silhouetted neighbor watching rain from a far porch / distant village light through rain / lighthouse beam crossing far / lone figure with umbrella crossing distant bridge)

━━━ HARD BANS ━━━

- NO main subject / hero creatures
- NO active wet-play
- NO time / setting language
- NO scary / threatening

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
