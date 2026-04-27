#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_male_makeup.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK MASCULINE MAKEUP descriptions for GothBot's vampire-boys path. Each entry is a 15-25 word description of a SPECIFIC dramatic makeup look on a hyperreal male vampire. These are NOT clean grooming looks — they're HAUNTED, WEATHERED, LIVED-IN, TROUBLED. Think masculine dark-beauty: kohl-rimmed warrior eyes, sunken contour that reads as centuries of sleeplessness, bruise-shadow that could be damage or glamour.

The energy is: he's been alive for centuries and it SHOWS. His beauty is DANGEROUS and slightly WRONG. Something about his face makes you uneasy. Think Tom Hiddleston in Only-Lovers-Left-Alive, Gary Oldman in Bram-Stoker's-Dracula, Bill Skarsgard's unsettling stillness, Timothee Chalamet's gaunt angularity, Robert-Smith's smeared-kohl-eyes.

━━━ MAKEUP STYLE SPREAD (enforce variety across ${n}) ━━━
- KOHL / WAR-PAINT (5-6) — heavy black kohl smeared around eyes like ancient warrior tradition, charcoal smudged in deliberate lines across cheekbone, thick rimmed eyes that read as both beauty and menace, dark liner dragged past outer corners and left to weather. NOT eyeliner — WAR-PAINT.
- HOLLOW / GAUNT (4-5) — extreme sunken contour making cheekbones blade-sharp, dark hollowed eye sockets carved by shadow, temples concave and skull-visible, bruise-purple under-eye shadows. He looks STARVED and ANCIENT. Immortal starvation written on his face.
- BRUISED / WEATHERED (4-5) — plum and green-black bruise-tones around orbital bones reading as damage AND beauty, shadow under cheekbone that reads as old injury, dark circles that are centuries deep, skin that looks like it survived something terrible.
- DARK LIPS (3-4) — deep wine-stained lips bitten raw, blue-black lip pigment that reads as natural but wrong, oxblood stain worn into lip cracks like it's been there for decades, dark-plum lips chapped and weathered.
- SILENT-ERA / NOSFERATU (3-4) — Max-Schreck-meets-haute-couture: stark bone-white skin with heavy-rimmed dark sockets, deep shadow pooled in eye hollows, severe and theatrical, grainy silent-film vampire iconography made hyperreal and masculine.
- MINIMAL-BUT-WRONG (3-4) — barely-there darkness that sits just below the surface: faint bruise-shadow at temples, slightly too-dark circles, lip pigment one shade too deep to be natural. Something subtly off about his face that you can't name.

━━━ RULES ━━━
- Every entry must mention EYES (shadow/kohl treatment) — lips are optional but encouraged
- When lips are mentioned: deep-wine, oxblood, blue-black, charcoal-stained, bruise-dark. NEVER nude-glossy, NEVER pink, NEVER bare-natural.
- The overall read should be MASCULINE and TROUBLED — not pretty-boy, not androgynous-editorial, not drag
- Think warriors, kings, monks, predators — not runway models or K-pop idols
- NEVER face-paint patterns, NEVER ritual-sigils, NEVER skull-face, NEVER clown/ICP, NEVER corpse-paint (black metal)
- Each entry should feel like a different dark chapter of the same immortal life

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
