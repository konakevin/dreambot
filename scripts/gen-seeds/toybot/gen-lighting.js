#!/usr/bin/env node
const fs = require('fs');
try { fs.unlinkSync('scripts/bots/toybot/seeds/lighting.json'); } catch (_) {}
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING treatment descriptions for ToyBot — toy-photography lighting. This pool MUST NOT default to warm-key-cool-fill cinematic "teal-and-orange." Force palette variety.

Each entry: 10-20 words. ONE specific lighting treatment naming an exact palette + direction + quality.

━━━ THE CORE RULE ━━━
The existing toybot pool was 16/50 warm-biased, 11/50 cool-biased — mostly warm-amber-with-cool-shadow variants. This regenerate must break that. At least 35 of 50 entries MUST use a palette that is NOT standard warm-key-cool-fill. Rotate aggressively across these forbidden-default categories:

━━━ MANDATED PALETTE CATEGORIES (spread entries evenly — max 4 per category) ━━━
1. **Monochromatic single-hue** — all-red emergency / all-green radioactive / all-blue underwater / all-purple ultraviolet / all-amber sodium-vapor / all-pink neon / all-cyan aquarium / all-magenta discotheque
2. **High-contrast noir** — single hard white key, black shadows, zero color cast, no fill light
3. **Overcast flat daylight** — grey-sky soft-box, zero shadow contrast, muted desaturation, catalog-style
4. **Hard high-noon** — short sharp vertical shadows, washed-out saturation, clinical flatness
5. **Colored-gel studio** — single-color gelled key (red gel / green gel / blue gel / purple gel) with minimal fill
6. **Silhouette backlit-only** — subject entirely black, bright halo around edges, color comes only from background sky
7. **Flashbulb-burst** — harsh frontal burst, blown-out highlights, deep short shadows, carnival-flash quality
8. **Flat even catalog** — soft-box from multiple directions, zero shadow, toy-catalog product-shot
9. **Infrared-heat-vision** — red-through-black false-color palette, heat-bloom around warm surfaces
10. **Fluorescent-tube buzz** — sickly green-cyan tube light, flicker, institutional hallway quality
11. **Blacklight UV** — white objects glow violet-blue, all else dark, neon-splatter highlights
12. **Dusk / twilight** — everything in shades of deep-blue and violet, NO warm orange at all
13. **Dawn / pre-sunrise** — pale-pink and lavender, NO yellow yet, soft and clean
14. **Golden hour** — warm amber low-angle (ONE of only a few warm-allowed entries)
15. **Blue hour** — deep cyan-navy sky, NO warm counter-light
16. **Candlelight ONLY** — flickering amber pool, black surrounds (ONE of only a few warm-allowed)
17. **Moonlight ONLY** — silver-blue high-angle, no warm ambient
18. **Volumetric god-rays** — dust-motes through single shaft, rim of light, neutral-white beam
19. **Stage footlight** — underlit harsh low-angle, exaggerated shadows rising behind subject
20. **Sodium-vapor streetlight** — pure-orange monochrome, black elsewhere, 1970s-urban-alley
21. **Aurora / bioluminescent glow** — soft-shifting green-cyan-magenta drift across a cool-dark scene
22. **Nighttime cityscape neon reflection** — pink + electric-blue + magenta signs reflected off wet surfaces

━━━ BANNED — DO NOT WRITE THESE ━━━
- "Teal-and-orange cinematic" — NEVER
- "Warm-key-cool-fill" — NEVER
- "Warm amber + cool rim" — NEVER (that's the exact default we're trying to avoid)
- Standard three-point lighting with warm+cool combo — NEVER
- Generic "cinematic lighting" without a specific palette — NEVER

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Name the EXACT palette (color + quality), not "cinematic" or "warm" as a fallback
- Name the direction (key source position: above / below / side / backlit / frontal / raking)
- Name the quality (hard / soft / diffuse / volumetric / flickering / strobe / ambient-only)
- 10-20 words, one clear treatment per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
