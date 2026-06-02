#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_surprise.json',
  total: 150,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot sleepy-naptime — tiny secondary details the eye finds AFTER the sleeping creature. Adds charm and life without waking the sleeper.

Each entry: 12-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny background creature (sleepy moth on a windowsill / mouse tucked into another nap-spot nearby / butterfly resting motionless on a pillow / sparrow asleep on a branch / a smaller creature curled at the sleeper's feet)
- 20% drift / dream-particle (single dandelion-seed drifting in slow motion / petal floating down toward the sleeper / dream-mote drifting upward / fluffy-feather drifting in slow arc)
- 15% steam / glow-wisp (steam from teapot curling up / candle-smoke ribbon drifting / glow-wisp hovering around the sleeper / dream-cloud forming above)
- 15% domestic-detail (open book face-down beside the sleeper / pair of slippers under the bed / empty teacup tipped on saucer / sketchbook with a half-drawn star)
- 10% nature-detail (curled fern frond as canopy / wet leaf with drop / pressed flower on a pillow / vine draping with single bloom)
- 10% magical-ambient (single firefly glowing soft / wisp of magical-dust hovering / sparkle-cluster around a hand / glow-orb dim-pulsing)
- 5% sound-implying (music-note drifting from a tiny gramophone / wind-chime visible / single open page of music)

━━━ HARD BANS ━━━

- NO active / awake / loud creatures
- NO setting / time / sleep-pose language
- NO scary / threatening

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
