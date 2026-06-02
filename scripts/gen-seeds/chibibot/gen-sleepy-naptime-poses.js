#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sleepy_naptime_poses.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ADORABLE SLEEPING-POSE descriptions for ChibiBot sleepy-naptime — the sleeping body posture of a chibi creature mid-nap. The creature is asleep / dozing / half-asleep. Maximum cute = peak sleeping animal poses.

Each entry: 15-25 words. ONE specific sleeping pose. Describes BODY POSTURE + face expression + paw position + signature sleep-detail.

━━━ THE BAR — PEAK SLEEPING ANIMAL CUTE ━━━

Think the cutest sleeping animal photos: belly-up with paws curled, snout-tucked-under-tail, face-down in a pillow with bum in the air, sprawled like a starfish, hugging a stuffed thing while asleep, mouth slightly open snoring, dream-twitch with paws-running.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% CURLED-IN-BALL (curled tight with tail wrapped over nose / curled with paws tucked under chin / nose-to-tail-tip ring / curled like a comma)
- 20% BELLY-UP (sprawled on back with all four paws curled up in air / belly-up with one ear flopped sideways / belly-up arms thrown out, mouth slightly open)
- 15% FACE-DOWN (face-pressed into pillow with bum in air / snout buried in fluff with ears poking up / face-plant pose with one paw extended)
- 15% HUGGING-OBJECT (asleep clutching a tiny stuffed object / sleeping wrapped around a tiny bottle / hugging a leaf-blanket close / curled around a single flower)
- 10% MOUTH-OPEN / SNORING (mouth open little bubble snore / drooling slightly with mouth ajar / one fang showing in sleepy half-grin / lip-twitch mid-dream)
- 10% DREAM-TWITCH (paws running mid-dream / ear-twitching / nose-twitching as if smelling / tail-wagging slowly in sleep)
- 5% HALF-LIDDED (eyes barely open watching nothing / blinking slowly half-asleep / lids drooping mid-blink)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- ONE sleep-pose verb (curled / sprawled / face-down / hugging / belly-up)
- BODY POSTURE detail (tail position, paw position, ear position)
- ONE signature cute-detail (mouth open, tongue out, eye-flutter, dream-bubble, paw-twitch)

━━━ HARD BANS ━━━

- NO awake / alert / active poses
- NO creature-species names
- NO setting / time / weather / nap-spot language

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
