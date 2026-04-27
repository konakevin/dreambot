#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_makeup.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK TROUBLED BEAUTY makeup descriptions for GothBot's vampire-vogue-realism path. Each entry is a 15-25 word description of a SPECIFIC dramatic makeup look on a hyperreal vampire woman. These are NOT clean beauty looks — they're HAUNTED, WEATHERED, LIVED-IN, TROUBLED. Think McQueen runway after the model cried backstage, Val Garland's smeared deconstructed looks, Hungry's distorted face illusions, Elizaveta Porodina's ghostly unsettling portraits, Paolo Roversi's decayed romantic beauty.

The energy is: she's been alive for centuries and it SHOWS. Her beauty is DANGEROUS and slightly WRONG. Something about her face makes you uneasy.

━━━ MAKEUP STYLE SPREAD (enforce variety across ${n}) ━━━
- SMEARED / DECONSTRUCTED (4-5) — Val-Garland-style deliberately smudged dark eye makeup bleeding down the cheek, lipstick kissed off-center, liner dragged past its intended line, mascara that's run and dried. NOT messy — WEATHERED. Like perfect makeup that's survived something.
- HOLLOW / GAUNT (4-5) — extreme deep-carved contour making cheekbones look skull-like, dark hollowed eye sockets, sunken temple shadow, bruise-purple under-eye. She looks HUNGRY and ANCIENT. Think heroin-chic meets immortal starvation.
- DARK ROMANTIC DECAY (4-5) — deep wine / oxblood / plum tones applied like a painting left in rain, blurred edges, stained lips like she's been wearing the same dark lipstick for days, smudged kohl that's slept-in and reapplied over itself.
- ALIEN / UNSETTLING (3-4) — Hungry/Isamaya-style looks that distort the face geometry, overdrawn or displaced features, monochrome washes that make the face look inhuman, deliberately asymmetric application that makes you look twice.
- SILENT-FILM GOTHIC (3-4) — Theda-Bara / Nosferatu-era extreme: massive dark-ringed eyes, stark white skin, heavy black-rimmed sockets, dark cupid's-bow lips — the earliest vampire aesthetic, grainy and iconic.
- BRUISED / LIVED-IN (3-4) — looks like she got in a fight and won: deep plum and green-black bruise-tones around the eyes that read as both damage AND beauty, split-dark lips, shadow under the cheekbone that could be contour or could be a mark.

━━━ RULES ━━━
- Every entry must mention LIPS (color + finish) and EYES (shadow + treatment)
- Lips are always DARK: obsidian-black, oxblood, deep-wine, violet-ink, blue-black, deep-plum, bruise-berry. NEVER nude, NEVER pink, NEVER natural, NEVER glossy-clean.
- The overall read should be TROUBLED and BEAUTIFUL — not polished, not pretty, not editorial-clean
- Think: Tilda Swinton in Only-Lovers-Left-Alive, Eva Green in Penny Dreadful, Noomi Rapace in Prometheus, Rooney Mara in Girl-with-the-Dragon-Tattoo — women who look like they've BEEN THROUGH SOMETHING
- NEVER face-paint, NEVER ritual-sigils, NEVER painted tear-streaks, NEVER cracked-mask, NEVER ghost-skull, NEVER clown/ICP
- Each entry should feel like a different dark chapter of the same immortal life

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
