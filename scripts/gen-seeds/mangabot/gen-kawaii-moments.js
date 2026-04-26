#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} KAWAII MOMENT descriptions for MangaBot's kawaii path — explicitly CUTE anime moments. Chibi / big-eye / magical-girl / sparkle-heavy / shoujo-cover-art energy.

Each entry: 15-30 words. One specific kawaii scene.

━━━ CATEGORIES ━━━
- Magical-girl transformation sparkle (girl in pastel sparkle-burst, ribbons unfurling)
- Chibi-proportion characters (big-head cute versions of anime archetypes)
- Shoujo-manga close-ups (big-eye close-up with hearts around, sparkle-backgrounds)
- Magical girl with wand in pastel sky
- School-idol in concert outfit with sparkle-effect
- Anime cat-girl with cat-ears and tail in sparkly setting
- Cafe-maid in frilly apron serving latte-art heart
- Magical-girl summoning pastel-effects
- Kawaii mascot-creature (not-named, like a sparkly pet)
- Pastel-hair anime girl with heart-pupils
- Chibi trio in sparkle-flower field
- Sparkly confession scene in classroom
- Girl with star-shaped pupils and glowing face
- Lolita-fashion anime girl with frills + bows
- Sparkle-burst cherry-blossom twirl
- Kawaii-monster pet on shoulder with speech-bubble hearts
- Magical-girl finale pose with rainbow ribbons
- Idol group in matching costumes sparkle-stage
- Maid-cafe scene with multiple maids + hearts
- Kawaii mascot bakery-shop interior
- Bright-eyed anime girl hugging cute plush
- Chibi warrior with huge sparkle-eyes and tiny sword
- Magical-transformation background of pastel sparkles
- Kawaii anime wedding scene in sparkles

━━━ RULES ━━━
- Explicitly CUTE / KAWAII / sparkly / chibi / big-eye aesthetic
- Shoujo-style drawing, not adult seinen
- Pastel palette dominant
- Characters by role only (magical-girl, cat-maid, school-idol)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
