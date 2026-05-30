#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_color_palette.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} COLOR PALETTE entries for a MangaBot ghibli-painterly keyframe. This is the signature COLOR TENSION — Ghibli-style harmonious pairings (warm-cool, complementary, monochromatic with accent).

Each entry: 10-18 words. Name the dominant palette + 2-3 specific hex-coded or descriptive color pairs + emotional read.

PALETTE VARIETY (25 bespoke entries):
- 20% EMERALD + AMBER (forest-cathedral signature — green moss + golden god-rays)
- 15% CYAN + ORANGE complementary (sky-island signature — pastel cyan sky + warm copper roof)
- 15% PASTEL SUNSET (rose-pink + lavender + peach + soft gold — Howl's signature)
- 10% LANTERN WARM (amber + persimmon + ivory + deep shadow — Spirited-Away night)
- 10% MOSS + PETAL (sage-green + sakura-pink + cream — Mononoke gentleness)
- 10% MONOCHROME BLUE-VIOLET (twilight register — deep indigo + violet + silver-moon)
- 10% RAINBOW-PETAL (multi-hue cherry-blossom + auroral sky)
- 5% MAGENTA + MINT (whimsical surreal — Spirited-Away bathhouse register)
- 5% SEPIA-AUTUMN (rust + amber + ochre + warm-gold — late season)

DO write:
- Emerald moss saturating the forest with golden god-rays for amber complement, deeply harmonious
- Pastel cyan sky against warm copper roofs and brass spires — Ghibli classic complementary tension
- Rose-pink and lavender sunset with peach and soft-gold accents, dreamy Howl's-castle register
- Lantern warm — amber and persimmon glow against deep blue shadows, ivory paper lanterns punctuating
- Sage-green moss carpets, sakura-pink petals drifting, cream stone — gentle Mononoke palette
- Deep indigo twilight with violet shadows and silver moonlight, monochrome with star punctuation
- Multi-hue cherry-blossom petals — pink, white, magenta, salmon — against auroral mint-rose sky
- Magenta-and-mint surreal whimsy — Spirited-Away bathhouse register with pearl accents
- Rust amber and ochre autumn, warm-gold late-light, deep umber shadows pooling

DO NOT write:
- Desaturated / muted / grey-dominant (Ghibli is SATURATED)
- Hex codes alone — pair with descriptors
- Western Pixar / Disney palettes
- Single color (always a pairing or trio)
- Photoreal color-science

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
