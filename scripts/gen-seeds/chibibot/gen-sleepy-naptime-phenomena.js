#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_phenomena.json',
  total: 100,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} GENTLE ENVIRONMENTAL PHENOMENA for ChibiBot sleepy-naptime — soft magical or atmospheric events that drift around the sleeper without waking them. 60%-gated, fires sometimes.

Each entry: 15-25 words. ONE soft event.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% drift / falling (cherry-blossom petals drifting down around the sleeper / soft snowflakes falling slowly past / dandelion-seed snow / golden leaves falling one-by-one)
- 20% sky / light event (golden god-rays pouring through the window onto the sleeper / soft sun-pillar / single moonbeam finding the sleeping pose / pre-dawn light just creeping in)
- 20% magical (floating glowing dandelion seeds / soft sparkle-drift around the sleeper / fireflies forming halo / dream-particles in the air / wishing-stars descending slowly)
- 15% steam / mist (warm mist rising softly / breath visible in cool air / curl of fog drifting past the window)
- 10% animal-ambient (sleepy bird settling on a branch outside / cat curled at the doorway / butterfly resting on the sleeper's shoulder)
- 5% rainbow / color event (faint rainbow forming through soft rain / sunset-pink wash spilling across the scene / aurora-soft glow through window)
- 5% sound-implying (music-box gently winding down / soft chime / lullaby visualized as drifting notes)

━━━ HARD BANS ━━━

- NO loud / startling events
- NO storms / lightning / scary
- NO awake creatures
- NO setting / time language

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
