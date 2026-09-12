# Nightly catalog QA archive — 2026-09-11

Kept on Kevin's request ("please keep these render sheets and commit them to the repo for review later") for the
day the nightly looks and vibes are consolidated into official Create mediums / vibes. Everything here was
rendered on Kevin's account with his cast; the images live in his private Dreams album (captions
`✨ LOOK <key> …` and `✨ VIBE <key> …`).

**Images.** The HTML pages embed the renders by their Supabase storage URL (the `uploads` bucket), so they keep
working as long as those album posts exist. The `sheet.jpg` contact sheets are self-contained downscaled copies of
every render, in a fixed tile order (see `vibes/ROUNDS.md`), so the pages can be lost and the evidence survives.
`report.json` per round holds the exact prompt, stamps, identity scores and upload ids of every render.

## looks/ — the looks catalog matrix (43 looks × 3 models × couple/solo)
- `compare-3-models.html` — flux-1.1-pro / grok-imagine-image / gemini-2-image side by side, with the approval matrix.
- `verdicts.html`, `matrix-*.html` — per-model pages with per-surface grades and rejection reasons.
- `matrix*/report.json`, `grades*.json` — the data behind them. Registry of record: `REAL_FACE_LOOKS_REGISTRY.md`.

## vibes/ — the vibe matrix (56 families × up to 4 accent routes, Kevin solo, flux-1.1-pro, digital painting)
- `compare-original20.html` — the original 20 (5 incumbents, 5 Create-only, 10 proposals), 4 columns
  (today's route · fragment after scene · fragment early · rewritten early).
- `compare-app12.html` — the 12 Create vibes first skipped; `compare-gapfill24.html` — 19 gap-fill proposals +
  5 revived inactive rows. 3 columns each.
- `round-*/` — per-round sheet + data. Rounds a-d = original 20; e/g/f = app 12; h/j/i = gap-fill 24.
- Outcome: Kevin kept EVERY version as its own nightly vibe (migs 506/509/510 → 175 rows / 56 families,
  `nightly_only`, family-first roll). Write-up: `NIGHTLY_VIBES_AUDIT.md` §8-§10.

Rebuild any page from the reports: `node scripts/qa-nightly-looks-compare.js`,
`node scripts/qa-nightly-vibes-matrix.js --round=<r> --compare=<rounds> [--keys=…] [--out=…]`.
