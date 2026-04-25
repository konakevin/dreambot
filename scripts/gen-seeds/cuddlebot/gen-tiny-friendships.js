#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/tiny_friendships.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} TINY FRIENDSHIP descriptions for CuddleBot's tiny-animal-friends path — pair or small-group warmth moments between cute creatures. Pair/group type + warmth beat.

Each entry: 15-30 words. One specific pair/group warmth moment.

━━━ CATEGORIES ━━━
- Bunny hugging flower bigger than itself
- Dragons napping on cloud together curled
- Mouse-family dinner around tiny table
- Two hedgehog friends sharing acorn
- Fox pup + bunny leaf-umbrella duet
- Kitten-trio piled on one pillow
- Baby dragon + puppy touching noses
- Chipmunk + bird sharing berry
- Sloth + moss-sprite napping on branch
- Owl + mouse reading together
- Bear cub + fox pup sliding on snow
- Three bunnies in tea-party circle
- Penguin chicks in row
- Dragon-hatchlings piled sleeping
- Kitten + puppy first-meeting nose-bumps
- Hedgehog family in den
- Tiny dinosaurs + flowers friendship (wholesome baby dinos)
- Otter-family holding paws in water (above-water only)
- Lamb + duckling in meadow
- Cloud-kitten riding atop moss-sprite
- Bunny family picnic (parents + kits)
- Owl mother + owlets in cavity
- Dragons sharing single cookie
- Fox kits rolling in flower field
- Bear cub showing butterfly to fox friend
- Little dragons + rainbow-together

━━━ RULES ━━━
- 2-4 creatures max per moment (no crowds)
- Warmth / friendship / tenderness emotional beat
- Stylized + wholesome + cute
- No humans, no dark/edgy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
