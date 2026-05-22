#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/kawaii_night_augment.json',
  total: 50,
  batch: 15,
  append: false,
  metaPrompt: (n) => `Write ${n} aggressive KAWAII NIGHTTIME LOCK paragraphs for outdoor YumBot scenes. These paragraphs SLAM the entire render into nighttime — Flux ignores soft night-language when surrounded by bright kawaii-pastel tokens, so each entry must DOMINATE.

Each entry: 65-95 words. A single bold paragraph with three forced locks:
1. SKY + TIME LOCK — start with "FULLY DARK [night-sky-spec] NOT twilight NOT dusk." Use words like indigo, navy, midnight, inky, ink-black, deep-cobalt, jewel-violet sky. Always include a visible moon (crescent / full / gibbous) and stars.
2. LIGHT-SOURCE LOCK — explicitly call out: "scene illuminated ONLY by [moonlight + paper-lanterns / firefly drift / creature-bioluminescence / lotus-lantern halos / fairy-light strings] — NO daytime sun, NO bright pastel lighting." Make the moon + lanterns the dominant key-light.
3. PALETTE OVERRIDE — explicitly REPLACE the bright kawaii pastels with night-coded equivalents: "REPLACE bright pastels with deep indigo + cobalt + jewel-violet + pearl-cream + warm-lantern-amber + cool-moonlit-blue. NO blush-pink-sky, NO sunny mint, NO peach, NO bright-rainbow." The cast can still have soft kawaii skin (cream-pink-blush) but the WORLD is dark.

DO write (example structure — do not echo verbatim):
"FULLY DARK indigo-navy night sky with a crescent moon and pinprick stars NOT twilight NOT dusk. Scene illuminated ONLY by warm paper-lanterns strung overhead, lotus-lantern halos floating at scene-level, and gentle creature-bioluminescence — NO daytime sun, NO bright pastel lighting. REPLACE bright pastels with deep indigo + cobalt + warm-lantern-amber + pearl-cream + cool-moonlit-blue palette — NO blush-pink-sky, NO sunny mint, NO peach. Firefly drift, lantern-bokeh, and soft moon-haze fill the cool night air."

OR with different light-source mix:
"FULLY DARK midnight-violet sky transitioning to inky-navy NOT twilight NOT dusk. The kawaii cast itself bioluminesces with gentle aqua-pearl inner-glow as the dominant light source, paper-lanterns and lotus-lanterns add warm-amber accents, NO daytime sun, NO bright pastel sunny light. REPLACE bright kawaii pastels with deep jewel-tones + cobalt + violet + warm-lantern-amber + cool moonlit-pearl. Drifting glow-motes and sparkle-dust shimmer through the dark cool air."

VARIATIONS to mix across the 50:
- Crescent moon vs full moon vs gibbous
- Star-density: scattered stars / dense Milky-Way / constellation pinpricks
- Primary light source: moonlight / paper-lanterns / lotus-lanterns / fairy-light strings / firefly drift / creature-bioluminescence
- Color temperature mix: warm-lantern-amber heavy vs cool-moonlit-blue heavy vs balanced
- Atmosphere: fog / mist / firefly motes / sparkle-dust / lantern-bokeh / moon-haze

DO NOT write:
- "soft twilight" / "dusk" / "magic hour" / "blue hour" — those read as transitional, NOT night. The lock is FULL NIGHT.
- "sunny" / "warm afternoon" / "bright" — purge any daytime register.
- Photoreal / horror / spooky — kawaii cozy night, NOT halloween, NOT cinematic-noir.
- Snow / storm / rain weather.
- People / chibi-humans / faces — kawaii creatures only.
- Real city / streetlamp / electric-grid / neon — magical lantern / firefly / moon only.

REGISTER: cozy peaceful kawaii night. Studio-Ghibli warmth × bex.ai Pop-Mart kawaii. The night is safe and dreamy but UNAMBIGUOUSLY NIGHT — no twilight ambiguity. Each entry is a hammer that breaks through bright-pastel surrounding tokens.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
