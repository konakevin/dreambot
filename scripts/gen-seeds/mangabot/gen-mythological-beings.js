#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_beings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MYTHOLOGICAL BEING descriptions for MangaBot's mythological-creature path — specific Japanese mythological creatures as hero subject. Draw authentically from Japanese mythology, not vague fantasy.

Each entry: 15-30 words. One specific mythological being with characteristic visual detail.

━━━ CATEGORIES ━━━
- Kitsune (nine-tail fox-spirit in half-human form, with glowing fox-eyes and fluffy tails fanned, or full-fox form with multiple tails)
- Yokai variants (kappa with shell-back and water-dish crown, tanuki shapeshifter with distinctive belly, nurikabe invisible wall-spirit suggestion)
- Oni (horned demon with red skin and iron club, tiger-skin loincloth, tusked menacing)
- Tengu (long-nosed mountain-spirit with crow-wings and martial monk robes)
- Ryujin / dragons (serpentine Japanese dragon in storm, water-dragon coiling through clouds)
- Yuki-onna (pale snow-spirit woman with white kimono and black hair in snowstorm)
- Nekomata (two-tailed cat-yokai, supernatural cat with glowing eyes)
- Bakeneko (transforming cat-spirit)
- Kamaitachi (weasel-spirit with blade-like claws)
- Kappa (water-spirit with shell and plate of water on head)
- Karasu-tengu (crow-tengu with bird-beak and black wings)
- Yamauba (mountain-crone yokai with wild hair)
- Shikigami (paper-origami spirits controlled by onmyoji)
- Rokurokubi (long-neck yokai woman)
- Komainu (stone-lion shrine-guardians animated)
- Tsukumogami (object-spirits — animated umbrella, tea kettle, sword)
- Ama-no-uzume (dawn-goddess with mirror)
- Inari (fox-god in regal attire)
- Raijin / Fujin (thunder-god with drums, wind-god with bag)
- Baku (dream-eating chimera with elephant trunk)
- Kirin (chimera-unicorn with dragon-head and deer-body)

━━━ RULES ━━━
- Authentic Japanese mythology — drawn with respect
- Include specific iconic details (tails, horns, mask, clothing)
- Anime-illustration rendering
- Single being per entry (as hero subject)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
