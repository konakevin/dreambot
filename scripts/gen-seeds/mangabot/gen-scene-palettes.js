#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for MangaBot — anime-characteristic color moods.

Each entry: 10-20 words. One specific anime palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Shinkai-sunset (amber + rose + cerulean + honey-gold)
- Ghibli-pastoral (emerald + cream + warm-amber + sky-blue)
- Akira-neon (magenta + cyan + electric-violet + oil-black)
- Mononoke-spirit (moss-emerald + ink + pearl-white + deep-violet)
- Demon-Slayer (indigo + crimson + gold + snow-white)
- Blade-Runner-Tokyo (neon-magenta + cyan + amber + rain-black)
- Kiki-warmth (terracotta + cream + red-roof + warm-blue)
- Your-Name (sunset-rose + gold + royal-blue + silver)
- Samurai-Champloo (black + red + gold + earth-brown)
- Ghost-in-Shell (icy-blue + chrome + neon-pink + dark-teal)
- Cowboy-Bebop (amber + teal + beige + black)
- 5cm-per-second (sakura-pink + gold + pastel-blue + cream)
- Studio-Ghibli-forest (emerald + moss + sun-gold + shadow-brown)
- Kawaii-pastel (pastel-pink + mint + butter + lavender)
- Dark-seinen-noir (charcoal + blood-red + amber-highlight + bone-white)
- Taisho-era (deep-indigo + gold-kanji + rose + cream)
- Shoujo-sparkle (soft-pink + sparkle-white + pastel-blue + gold)
- Festival-matsuri (red-lantern + gold + deep-blue + white-paper)
- Rainy-cyberpunk (indigo + neon-pink + rain-silver + black-puddle)
- Zen-minimal (white + black-ink + stone-grey + accent-red)
- Cherry-blossom-spring (sakura-pink + pale-green + cream + sky-blue)
- Autumn-momiji (crimson + gold + deep-brown + pale-blue-sky)

━━━ RULES ━━━
- Anime-characteristic palettes
- 3-5 specific colors per entry
- Reference specific studios/eras where relevant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
