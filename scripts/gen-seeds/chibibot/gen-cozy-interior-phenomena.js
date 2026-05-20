#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot cozy-interior — magical or atmospheric events that crank drama when they fire (60%-gated).

Each entry: 15-25 words.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% interior-light event (fireplace crackling and throwing dancing shadows / every candle in the room flickering in unison / warm-lamp glow pooling perfectly across a rug / sunbeam pouring through a window at the perfect angle)
- 20% weather-visible-from-inside (rain drumming the window / soft snowfall visible past the panes / fog rolling past creating a velvet curtain / autumn-leaves swirling at the window)
- 15% steam / cooking event (steam billowing from a freshly-poured pot / kettle whistling / oven door opening with golden glow inside / pie cooling with steam curling up)
- 10% magical phenomenon (floating glowing dust drifting through warm beams / wishing-stars descending past the window / sparkle-rain forming around a lamp / will-o-wisp peeking around a doorframe)
- 10% sound / music (music-box gently winding down / record gently spinning / clock striking the hour with chime / soft piano notes drifting)
- 10% seasonal (cherry-blossom petals drifting against window / first snow visible past the panes / autumn-leaves piled at the door)
- 5% celestial (rainbow forming through the window / aurora visible through the glass / moon-pillar through a skylight)
- 5% sleepy-creature (resident pet wandering through / sleeping cat moving slightly in dream / songbird visiting the windowsill)

━━━ HARD BANS ━━━

- NO scary lightning / storm-damage / power-cut
- NO outdoor scenes as focal subject

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
