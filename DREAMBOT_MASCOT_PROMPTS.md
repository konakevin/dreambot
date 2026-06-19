# DreamBot Mascot — Render Recipe (preserve this aesthetic)

The lavender "bubble-bot" look used for the app icon + in-app mascots (oops page, etc.).
Nailed 2026-06-18. Copies the live **DreamBot bot account's** own render style
(`chibibot_render` medium, `whimsical` vibe).

## Model + settings

- **Model:** `black-forest-labs/flux-1.1-pro-ultra` (Replicate) — NOT gpt-image-2.
- **Input:** `aspect_ratio: '1:1'`, `output_format: 'jpg'`, `output_quality: 95`, `num_outputs: 1`.
- POST `https://api.replicate.com/v1/models/<model>/predictions`, poll the prediction id.
- Flux 1.1 pro ultra **ignores negatives** — describe what you WANT (e.g. "smooth seamless
  dome top") rather than relying on "no antenna". Generate a few; it's stochastic.

## Shared STYLE prefix (the aesthetic)

```
polished glossy 3D CGI render, ultra-clean subsurface-scattering vinyl materials, glossy luminous pastel finish, crisp dewy highlights, deep focus, richly detailed, adorable Pixar-style chibi designer-toy,
```

## Sad bubble-bot (used for the OopsScreen — "this dream floated off")

The prompt that nailed it (STYLE prefix + this SUBJECT + the END tail):

```
A small round chibi bubble-bot designer-toy sitting alone, slumped and dejected with stubby arms drooping at its sides, its cloud-white seamless glossy body edged with delicate brass-trimmed gold joints and a soft pearlescent sheen, a smooth translucent iridescent soap-bubble domed visor for a face; on the dark glossy visor a glowing DIGITAL LIT-UP FACE is displayed — a sad downturned frowning mouth and two big glowing rounded eyes welling with bright luminous digital tears, glowing teardrops streaming down the visor; warm amber light glowing softly from its seams, gentle drifting light particles around it, perched on a soft dreamy pastel cloud under a calm twilight starry sky,
```

## App-icon bot, antenna-less (the bot reaching up for a star in clouds)

Recreates the app icon minus the antenna — describe the SMOOTH DOME positively:

```
A tiny round chibi bubble-bot designer-toy standing in soft fluffy pastel clouds, reaching one stubby arm UP toward a single glowing golden five-point star in the twilight sky above; cloud-white glossy seamless rounded body with delicate dark-charcoal segmented joints; its head is a perfectly SMOOTH SEAMLESS ROUNDED DOME with a completely smooth bare top, a large dark glossy iridescent soap-bubble visor face with one warm glowing amber eye; gentle hopeful wonder in its upward-reaching pose; surrounded by soft fluffy pink-and-lavender clouds, a dreamy purple twilight sky full of tiny sparkling stars and soft golden bokeh,
```

## Shared END tail

```
single centered character, soft volumetric dream lighting, no text, no words, no watermarks, masterpiece quality
```

(Swap the mood word — "magical and hopeful" for the icon, "adorable and pitiable" for the sad bot.)

## How to regenerate

Drop the prompt into a tiny Replicate caller (see the throwaway `/tmp/gen-*.js` scripts from
the 2026-06-18 session, or `fluxOnce` in `scripts/lib/botEngine.js`). Key in `.env.local`
(`REPLICATE_API_TOKEN`). ~6¢ + ~20s per render.
