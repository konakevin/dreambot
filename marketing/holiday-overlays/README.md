# Holiday postcard overlays (transparent PNG lettering)

Composited onto the day-of hero render by the `holiday-postcard` edge fn (migration 459); the live file per
holiday is `holidays.postcard_overlay_url` (+ layout columns). Set/preview with
`node scripts/gen-holiday-postcard.mjs --holiday <key> --set <file.png> --anchor bottom --width 70 --margin 4`.

Kevin 2026-09-06: overlays are YEAR-STAMPED so a post keeps its year forever — one file per holiday per year.

- `halloween_2026_happy_halloween_dreambot.png` — LIVE 2026. The undated gothic "Happy Halloween" artwork with a
  large "DreamBot 2026" badge inpainted beneath it (masked GPT Image edit of the original; nothing else touched).
  Kevin: "this happy halloween logo is great, please keep it".
- `halloween_2026_alt2.png`, `halloween_2026_alt3.png` — the two sibling variants from the same pass.
- `halloween_happy_halloween_undated.png` — the original undated artwork (2026-09-05), source for future years:
  re-run the masked badge edit with the new year.
