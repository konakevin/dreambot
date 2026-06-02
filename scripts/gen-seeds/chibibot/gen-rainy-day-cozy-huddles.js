#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_huddles.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} GROUP-OF-FRIENDS COZY-HUDDLE activities for ChibiBot rainy-day-cozy — 2-4 chibi friends sheltering TOGETHER from the rain in COZY huddle moments. Sharing cocoa under a porch, huddled under one umbrella shoulder-to-shoulder, piled together under a mushroom cap, cuddled in a hollow log watching rain together, etc. NOT active wet-play (that's rainy-interior path). COZY-INTIMATE shelter scenes.

Each entry: 20-35 words. ONE specific group cozy-huddle activity. Describes what the friends are doing TOGETHER while sheltered from rain.

━━━ THE BAR — INTIMATE COZY SHELTER MOMENTS ━━━

Think Studio Ghibli "Totoro" bus-stop scene / Calvin-and-Hobbes-under-porch / Charlie-Brown-Snoopy-huddle. The friends are SHELTERED together, warm + cozy + intimate. Body language: pressed together, sharing a blanket, sipping tea, watching the rain TOGETHER, half-asleep on each other, telling stories, sharing snacks. The contrast: warm-cozy inside the shelter vs cool-blue-grey rain visibly falling outside.

━━━ FORMAT — every entry has 3 elements ━━━

1. GROUP STRUCTURE ("Three friends...", "A pair of...", "Four creatures together...")
2. COZY-SHELTER VERB (huddled / sharing / cuddled / sipping / pressed together / wrapped in / piled in / curled together / mid-laugh / mid-story / mid-sip)
3. SHELTER-MOMENT EVIDENCE (steam from cocoa visible / blanket draped over multiple shoulders / paws clasped / heads stacked / mouths open laughing at the rain / pointing at a single raindrop / sleepy half-eyes)

━━━ EXAMPLES (THIS IS THE BAR) ━━━

✓ "Three friends huddled shoulder-to-shoulder under one oversized red umbrella, all holding mugs of cocoa, steam rising in three curls, watching the rain together with content half-smiles."

✓ "Four chibi friends piled together under a giant mushroom cap, paws over each other's shoulders, all heads tipped up at the rain pattering on the cap, mouths open in shared awe."

✓ "A pair sharing a thick wool blanket on a covered porch swing, mid-laugh as a fat raindrop just hit the railing, both clutching steaming teacups."

✓ "Three friends curled together in a hollow log, the largest one's tail wrapped around the smaller two, all three peeking out at the wet meadow beyond."

✓ "A pair plus a smaller third huddled inside a curled fern frond shelter, all three mid-bite of the same enormous wet biscuit they're sharing."

✓ "Four creatures together pressed under a stone arch-bridge's dry alcove, sleeping pile with heads stacked, one paw extended into the rain to feel the drops."

━━━ WHAT FAILS ━━━

✗ "Standing under an umbrella" (no cozy-action)
✗ "Watching the rain" alone (passive — must be doing-together)
✗ "Two creatures sitting" (pose)
✗ "Splashing in puddles" (active wet — wrong path, that's rainy-interior)
✗ Single-creature focus (this is GROUP)

━━━ CATEGORY DISTRIBUTION ━━━

- 25% COCOA / TEA-SHARING (sipping mugs together / pouring rounds / mid-toast of cups / sharing a teapot)
- 20% BLANKET-CUDDLE (wrapped in shared blanket / huddled under a quilt / wrapped tails / piled together with arms over)
- 15% UMBRELLA-HUDDLE (shoulder-to-shoulder under one umbrella / sharing a giant parasol / squeezed under one polka-dot )
- 15% STORY-TELLING / READING (sharing one storybook between friends / one telling a story with paws raised / mid-laugh at a shared joke)
- 10% SNACK-SHARING (sharing one giant biscuit / passing acorn-cups / mid-pour of jam from a tiny pot / sharing a single muffin)
- 10% SLEEPY-PILE (heads stacked in sleeping pile / nap-pile on a porch / curled together half-asleep / mid-yawn pile)
- 5% RAIN-WATCHING (pointing at one specific raindrop together / counting raindrops / both watching one ripple in the puddle)

━━━ HARD BANS ━━━

- NO single-creature focus
- NO active wet-play (splashing / running / mud-fights) — that's rainy-interior path
- NO indoor scenes
- NO scary / sad / shivering — wholesome cozy-shelter
- NO time / setting / weather language
- NO species names

━━━ OUTPUT ━━━

JSON array of \${n} strings. Each starts with group-structure phrase, has shelter-cozy verb + evidence detail.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
