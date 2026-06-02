#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_phenomena.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot night-meadow scenes — magical or celestial nighttime events that crank atmospheric drama when they fire. This axis is 60%-gated — only fires on some renders — so each entry should be a STATEMENT MOMENT that transforms the nighttime frame.

Each entry: 15-25 words. ONE magical / celestial / atmospheric nighttime event woven into the scene.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- A whole-scene phenomenon (not a tiny detail — that's surprise_element)
- Wholesome / wondrous / awe-inducing — NEVER scary
- Concrete and picture-able (Flux must render it)
- Stacks with everything else (creature pair + setting still readable)

━━━ CATEGORY DISTRIBUTION ━━━

- 25% celestial / sky-event (meteor shower streaking across the sky in arcs / aurora borealis green-and-pink curtain dancing overhead / shooting star with bright tail leaving a glow-trail / comet visible low in the sky with a long tail / lunar eclipse with red moon / Milky Way visible as a glowing band / triple-moon-conjunction)
- 20% firefly / glow swarm (massive firefly swarm filling the meadow with hundreds of golden lights / will-o-wisp circle slowly orbiting the pair / glow-worm constellation on the ground / fireflies forming a heart-pattern / thousands of stars seeming to descend)
- 15% magical-bloom (moonflowers all opening at once across the meadow / glowing mushrooms suddenly all lighting in sequence / paper-lantern festival sky full of floating lanterns drifting up / fairy-lights all twinkling on at once / phosphorescent moss patch glowing brighter)
- 15% atmospheric event (gentle moonlit fog rolling through low in the meadow / mist rising and forming shapes / sparkling dewfall on every blade of grass / cottony-cloud-procession across moon / mountain-mist below the hilltop)
- 10% wishing / falling event (dandelion-seed snow falling across the meadow / falling sakura petals at night / drift of glowing leaves / falling stars made of paper / soft-snow first-of-winter)
- 10% magical-creature presence (deer-spirit standing reverent on a distant ridge / great owl silently flying overhead / spirit-fox watching from far edge of meadow / unicorn silhouette far in mist)
- 5% rare / dreamlike (time-bubble freeze-moment with everything still / aurora reflected in a still pond pulling the eye / supermoon impossibly bright / cosmic-spiral in the sky / once-a-century comet)

━━━ HARD BANS ━━━

- NO scary events (no thunder / lightning / blood-moon-with-menacing-vibes / haunted-trees / spirits-with-bad-intent)
- NO weather word-soup (no "storm" / "blizzard" — phenomena are EVENTS, weather is BASELINE)
- NO setting language
- NO creatures as the focal subject (creature_1/_2 are heroes)
- NO daytime
- NO predator-prey

━━━ DEDUP ━━━

Dedup by: phenomenon type + concrete signature. "meteor shower streaking" and "shooting stars in arcs" are duplicates.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
