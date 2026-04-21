#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/body_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BODY TYPE descriptions for GlamBot — wide variety (reject runway-thin-default).

Each entry: 6-14 words. One specific body type.

━━━ CATEGORIES ━━━
- Tall curvy with hourglass proportions
- Short petite athletic
- Full-figured plus-size curvy
- Muscular athletic defined
- Slender tall androgynous
- Mature 40s with soft curves
- Mature 50s confident sophisticated
- Long lean tall willowy
- Soft full-chested and hip
- Sharp angular slim
- Athletic broad-shouldered
- Curvy pear-shaped
- Apple-shaped full-upper
- Rectangular tall straight
- Hourglass classic curves
- Plus-size tall with presence
- Tiny pixie-short slim
- Tall-muscular Amazonian
- Soft-round short curvy
- Broad-shouldered tall athletic
- Statuesque Amazonian broad
- Pregnant full-belly glowing
- Post-partum curves confident
- Athletic runner's build lean
- Dancer's-build limber long-limbed
- Wrestler's-build strong squat
- Gymnast compact athletic
- Swimmer's build shoulders-v
- Voluptuous full-throughout
- Sporty-toned athletic
- Willowy tall slender
- Cheeks-full face soft body
- Narrow-waist full-hip
- Full-shoulders strong arms
- Boyish androgynous slim
- Flat-chested tall slim
- Large-chested curvy
- Short-legged long-torso
- Long-legged short-torso
- Muscled-thighs athletic
- Tattooed full-sleeves arm
- Tattoo-covered body
- Scar-marked natural
- Disabled-wheelchair seated portrait
- Petite delicate fine-featured
- Muscular professional athlete
- Older-dancer elegant carriage
- Yogi-lean flexible
- Weightlifter defined-strong

━━━ RULES ━━━
- REJECT runway-thin default
- Wide age + body variety
- Respectful, specific descriptions

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
