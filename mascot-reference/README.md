# DreamBot Mascot — Reference Renders

Generated 2026-06-18 (Flux 1.1 pro ultra) in the app's lavender bubble-bot aesthetic, for
reuse around the app (oops/empty/loading/success states, etc.). The exact prompts + model
settings that produced these live in [`../DREAMBOT_MASCOT_PROMPTS.md`](../DREAMBOT_MASCOT_PROMPTS.md).

- **`sad-bot/`** — sad bubble-bot with a crying digital visor face. `sadbot-3` ships as the
  OopsScreen mascot (`assets/images/oops-bot.jpg`).
- **`icon-antenna-free/`** — 6 takes on the app icon (bot reaching for a star in the clouds)
  with the antenna removed, smooth domed head.
- **`app-states/`** — a starter suite of mascot moods: `cheer` (success), `sleep` (nightly/
  loading), `wave` (welcome), `think` (searching/loading), `gift` (sparkle reward), `peek`
  (empty state).
- **`icon-replica-attempts/`** — 10 candidate app-icon replacements (antenna-free), generated
  with the original `icon.png` as a Flux `image_prompt` reference at varied strengths (lower
  number = lower strength = less antenna, looser composition). Picking a replacement here.

Reference only — not bundled into the app (except the one oops-bot copied into `assets/`).
To make more in the same style, follow the recipe doc.
