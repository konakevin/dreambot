#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_hairstyles_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME MALE HAIRSTYLE descriptions for MangaBot. Each entry is 12-22 words.

CONTEXT: Iconic anime male hairstyles spanning the full vocabulary. Each entry describes a SPECIFIC anime male hairstyle.

Categories — rotate widely:
- Spiky shonen (anime-spiky stand-up hair / wild messy spikes / structured spiky cut)
- Slicked back (sleek slicked-back / undercut slicked-back / slicked-back with one loose strand)
- Bangs over eyes (asymmetric bangs over one eye / heavy bangs across the brow / curtain bangs)
- Tousled / messy (anime-bedhead / casually-tousled / wind-blown messy)
- Short clean cut (short combed cut / preppy side-part / clean classic cut)
- Long hair (samurai-style long hair tied back in low ponytail / shoulder-length loose / long hair pulled half-up)
- Mid-length (mid-length tousled / mid-length swept aside / parted mid-length)
- Buzzed sides + longer top (high-and-tight with longer top / undercut + slicked top / shaved sides + curly top)
- Quiff / pompadour (anime-pompadour / soft quiff / volumized front)
- Wild anime (anime-wild swept-back / explosive shonen-spike / lightning-bolt streaked)

Optional facial-hair touches (vary widely — most clean-shaven, some with):
- Clean-shaven
- Light stubble along jaw
- Trimmed short beard
- Soft mustache

EVERY entry: hair length + cut + ONE styling/motion detail.

Examples (write fresh):
- "Anime-tousled mid-length black hair with side-swept fringe falling across one eye, glossy and casually styled, clean-shaven"
- "Slicked-back blonde hair with shaved undercut, sleek and crisp, light stubble along the jaw"
- "Long shoulder-length silver hair tied back in a low ponytail with a leather thong, samurai-coded"
- "Anime-spiky black hair standing up in jagged shonen-style spikes, wild and energetic, clean-shaven"
- "Soft tousled chestnut hair with curtain bangs falling on either side of the brow, gentle and bookish"

Output ONLY a valid JSON array of ${n} strings (12-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
