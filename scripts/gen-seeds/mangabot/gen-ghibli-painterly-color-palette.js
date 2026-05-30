#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_color_palette.json',
  total: 25,
  batch: 25,
  append: false, // R1 rewrite — broaden the saturation range
  metaPrompt: (n) => `Write ${n} COLOR PALETTE entries for a MangaBot ghibli-painterly keyframe. EXPLICITLY SPAN TWO REGISTERS so the path delivers RANGE across batches. Per Kevin's 37-heart spread, his hearts include both soft-pastel Whisper-of-the-Heart frames AND bold-saturated Castle-in-the-Sky / Demon-Slayer frames. EACH entry MUST open with the register name in CAPS so downstream Sonnet honors it.

Each entry: 12-22 words. Open with `MUTED:` or `SATURATED:` or `PASTEL:` so the register is unmistakable.

REGISTER SPLIT (25 bespoke entries — equal weight to all three):
- 40% SATURATED VIBRANT (bold high-chroma — Castle-in-the-Sky / Spirited-Away exteriors / Mononoke firelight / Demon-Slayer-bright)
- 30% MUTED STORYBOOK (sage / copper / cream / dust-rose — Whisper of the Heart / Mononoke quiet / Wind-Rises softness)
- 30% PASTEL DREAMY (rose-pink / lavender / peach / soft-gold — Howl's-castle pastel / Spirited-Away interior softness)

DO write (each entry MUST open with register tag in CAPS):
- SATURATED: emerald moss saturated and golden god-rays blazing complementary, deep contrast Castle-in-the-Sky exterior register
- SATURATED: scarlet-red pagoda + emerald cedar canopy + sky-cyan backdrop, bold tri-tone Demon-Slayer / Mononoke firelight
- SATURATED: vivid magenta-pink sakura + emerald moss + cyan reflection, high-chroma Spirited-Away exterior burst
- SATURATED: cyan sky + warm copper roof + golden sun-shaft, complementary tension Castle-in-the-Sky classic
- SATURATED: bioluminescent magenta-cyan firefly glow + deep indigo shadows + ember-orange lanterns, vibrant night-magic
- SATURATED: deep emerald jungle + amber temple-gold + scarlet torii, jewel-tone temple-grove burst
- SATURATED: orange-amber autumn maple + emerald moss + scarlet pagoda, fire-burst seasonal saturation
- SATURATED: vivid teal water + golden god-rays + emerald islands, tropical-ghibli high-saturation
- SATURATED: rainbow petal-cascade + amber sun + emerald canopy, kaleidoscopic vivid
- SATURATED: cobalt-blue sky + crimson pagoda + gold roof finials, complementary jewel-tone

- MUTED: sage-green moss carpets, cream stone walls, soft copper sunset glow, hand-painted Whisper-of-the-Heart register
- MUTED: dust-rose sky with copper-amber accents, sage shadows, gentle Wind-Rises softness
- MUTED: pale cream stone, weathered sage moss, copper-leaf accents, faded-postcard Mononoke quietness
- MUTED: soft sage forest, dusty copper roof tones, muted ivory lanterns, hand-touched storybook softness
- MUTED: storm-grey sky with sage-cedar canopy, muted copper-trim eaves, melancholy painterly register
- MUTED: weathered-cream architecture, dust-grey haze, faded sage moss, washed-out painterly stillness
- MUTED: sepia autumn-amber, dust-copper roofs, soft ochre haze, vintage Wind-Rises late-light
- MUTED: cool sage-blue dawn, washed cream stone, muted lavender shadows, soft-touch storybook morning

- PASTEL: rose-pink and lavender sunset with peach and soft-gold accents, dreamy Howl's-castle register
- PASTEL: powder-blue sky with cream-petal accents, soft mint-green canopy, weightless pastel-shoujo softness
- PASTEL: lavender mist with blush-pink sakura petals, cream stone, soft-amber accents, ethereal dreamlike
- PASTEL: pearl-cyan with rose-gold sun, mint-pink architecture trim, otherworldly soft pastel
- PASTEL: powder-pink dawn sky, soft-gold light, mint-blue shadows, baby-pastel sweetness Howl's-coded
- PASTEL: lavender-and-peach twilight, cream-and-rose architectural trim, soft pearl shimmer, fairy-tale pastel
- PASTEL: mint-green canopy with rose-petal accents, cream architecture, soft-gold light, gentle Howl's pastel

DO NOT write:
- Photoreal hex codes alone (always pair register tag + descriptive language)
- Western Pixar palettes / Disney palettes
- Single color (always a pairing or trio)
- Grey-dominant only (boring)
- Forget the REGISTER TAG opening

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
