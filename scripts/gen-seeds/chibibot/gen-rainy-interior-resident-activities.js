#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_resident_activities.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} GROUP-OF-FRIENDS rainy-day activities for ChibiBot rainy-day-outdoor — multi-creature group scenes of chibi friends playing together IN the rain. NOT solo. NOT one creature. A GROUP of 2-4 friends interacting with each other and the rain.

Each entry: 20-35 words. ONE specific group activity. Describes WHAT THE FRIENDS ARE DOING TOGETHER.

━━━ THE BAR — FRIENDS PLAYING IN THE RAIN ━━━

Think Calvin-and-Hobbes-with-friends / Studio-Ghibli-kids-in-the-rain / Charlie-Brown-Snoopy-group-romp. The friends are TOGETHER, INTERACTING, doing a shared activity. Mid-action group dynamics:
- One friend splashing another with a puddle-jump
- Three friends sharing one giant umbrella
- A pair running mid-stride holding hands across cobblestones
- Two friends mud-wrestling while a third tries to break it up
- A trio building a stick-dam in a puddle
- Group sheltering under a leaf with paws over each other
- Pair pushing a paper boat into a puddle while a third cheers
- Three running races down a wet path with rain streaking past

━━━ FORMAT — every entry has 3 elements ━━━

1. GROUP STRUCTURE ("Three friends...", "A pair of...", "Four creatures together...", "Two friends and a third...")
2. SHARED ACTIVITY VERB (chasing each other / splashing each other / sharing umbrella / racing / building / huddling / mud-fight / dance / mid-pile-on)
3. ACTION-EVIDENCE (water flying / mud splattered / arms tangled / faces side-by-side / hood streaming / paws gripping / mouths open in shared laughter)

━━━ EXAMPLES (THIS IS THE BAR) ━━━

✓ "Three friends mid-puddle-jump in unison, all paws raised, water exploding upward in three crowns at once, eyes squeezed shut in shared glee, mouths open in matching cheers."

✓ "A pair sharing a single giant red polka-dot umbrella shoulder-to-shoulder, one tilting the umbrella to keep both dry, the other holding a tray of cocoa cups."

✓ "Three friends running side-by-side mid-stride down a wet cobblestone lane, hoods streaming back, holding hands in a chain, mouths open laughing."

✓ "Two friends mid-mud-fight with handfuls of mud flying between them, both creatures spattered head-to-paw, a third nearby trying to keep their boots clean."

✓ "Four chibi friends piled together under a single huge leaf-umbrella, paws over each other's heads, faces pressed close, all laughing at the rain pattering above."

✓ "A pair pushing a paper boat into a deep puddle, both crouched at the water's edge with paws extended, a third friend cheering from behind."

━━━ WHAT FAILS ━━━

✗ "A creature splashing in a puddle" (SOLO — must be group)
✗ "Friends standing together" (no shared action verb)
✗ "Group of creatures in the rain" (too vague)
✗ "Two creatures looking at each other" (pose, not group-action)

━━━ CATEGORY DISTRIBUTION ━━━

- 25% GROUP-SPLASH-CHAOS (multiple-friends mid-jump in unison / pair splash-fighting / trio sliding through one big puddle / mid-cannonball with friends watching)
- 20% UMBRELLA-SHARING (two huddled under one / three squeezed under one / pair handing umbrella between them / mid-tip umbrella over a smaller friend)
- 15% RACING / CHASING (friends running side-by-side / mid-tag-game / chasing each other through wet flowers / pursuit through cobblestones)
- 15% COZY-COLLECTIVE (huddled together under a leaf / sharing a tray of cocoa among friends / pile-on hug under a porch / trio under a blanket on a porch)
- 10% MUD-FIGHT / WET-CHAOS (mid-mud-fight / mid-sliding-together in mud / pile-on in a puddle / mud-wrestling pair with referee)
- 10% COLLECTIVE-WORK (group building a stick-dam in a puddle / friends planting wet seedlings together / trio rescuing paper boats / pair sharing umbrella over flowers)
- 5% MID-DISCOVERY (group leaning over a puddle to see reflection together / friends pointing at a rainbow with arms linked / trio mid-find of a rain-treasure)

━━━ HARD BANS ━━━

- NO single-creature focus (this is GROUP path)
- NO static poses
- NO sad / scared / fighting-with-malice / shivering
- NO time / setting language
- NO species names

━━━ OUTPUT ━━━

JSON array of ${n} strings. Each starts with a group-structure phrase ("Three friends...", "A pair of...", "Four creatures together..."). Each has a SHARED activity verb + action evidence.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
