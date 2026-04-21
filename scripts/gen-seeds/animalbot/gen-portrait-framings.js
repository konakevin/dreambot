#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/portrait_framings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PORTRAIT FRAMING descriptions for AnimalBot's portrait path — extreme macro/close-up composition strategies for a single animal subject. These are framing instructions, not species descriptions.

Each entry: 10-20 words. One specific macro/close composition strategy.

━━━ CATEGORIES ━━━
- Eye-to-eye macro (pupil fills frame, iris textures visible, reflected landscape in eye)
- Extreme-close fur detail (individual guard hairs, tuft backlit, mane windswept)
- Full-face tight-frame (nose to ears visible, no body, lit from specific angle)
- Three-quarter face portrait (classic photographer angle, eyes catching light)
- Profile silhouette (backlit rim-light on head outline, deep shadow body)
- Backlit-ear hair-glow (sun behind head making ears and whiskers translucent)
- Muzzle-and-whiskers macro (nose in focus, whiskers in starburst around)
- Paw-and-claw detail (single paw filling frame, claws lit sharply)
- Open-mouth intensity (roar or yawn, teeth in detail)
- Crown-and-antler close (horns or antlers filling upper frame, face below)
- Feather-macro detail (single feather iridescent, barbs separated)
- Scale-and-skin macro (reptile scales, individual scale patterns)
- Low-angle-up (ground-eye perspective looking up at animal)
- Half-face-shadowed (dramatic chiaroscuro across face)
- Neck-and-shoulder detail (mane, ruff, shoulder musculature)
- Tongue-curled macro (drinking, grooming, catching)
- Wet-fur macro (rain droplets on coat, shaking water off)
- Frost-breath macro (visible exhalation in cold air, ice crystals)

━━━ RULES ━━━
- Framing strategy only — not a species
- Include lighting direction where relevant
- Emphasize macro / close / tight — NOT wide

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
