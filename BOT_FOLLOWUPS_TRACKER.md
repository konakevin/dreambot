# Bot + holiday follow-ups tracker (opened 2026-09-29)

Status of record for the follow-ups that came out of the 2026-09-29 playbook rewrite, the FarmBot prompt-length
trim and the Fall-roll audit. Kevin approved everything below on 2026-09-29 except item 8 (deferred). Update the row
in the same commit as the work.

**Rules for whoever works this list**
- Shared working tree: other agents have WIP (the Sonnet 5.5 tuning work owns `scripts/lib/anthropic.js`,
  `scripts/lib/models.js`, `supabase/functions/_shared/anthropic.ts` / `models.ts`, `scripts/qa-llm-*`, migration 579).
  Edit only this list's files; commit with `git commit -m … -- <paths>` after reading `git diff -- <paths>`; never
  `git add -A`.
- Test along the way: bot changes get before/after SHADOW renders on the bot (`iter-bot --post --shadow`), ≤3 concurrent,
  gated on `node scripts/check-pool-headroom.js`. Nightly changes get `dry_run` renders on Kevin's account only.
- Bot work follows `BOT_SCENE_QUALITY_PLAYBOOK.md`; add each new lesson there as one bullet.

Status key: ☐ todo · ◐ in progress · ☑ done · ⏸ deferred · ✋ decided: leave alone

---

## A. Quick decisions (approved 2026-09-29)

| # | Item | Status | Test / evidence | Commit |
|---|---|---|---|---|
| A1 | **Ship the FarmBot prompt trim.** Medium 276 → 45 words; every brief ends with `FARMBOT_LENGTH_RULE` (120-160 words, style → subject → setting); AlphaBot's FarmBot-destined candidates append the same rule. | ☑ | 24 shadow posts on FarmBot 2026-09-30 ~02:45-02:54 UTC: 8 baseline (median ~770 words), 8 first try (characters drew older; fixed), 8 final (~236 words, cute characters back). All 43 FarmBot briefs dry-built with the new ending. | (next) |
| A2 | **FarmBot window camera shots 11 → 3** of 98 camera entries (they render as literal window frames now that prompts are short). | ☐ | | |
| A3 | **HTML matrix posts hidden (shadow).** `qa-bot-model-matrix.js` adds `--shadow`; old June/July public matrix posts stay as they are. Update CLAUDE.md, the playbook §2.7 and the matrix memory. | ☐ | | |
| A4 | **Keep `BOT_SCENE_QUALITY_PLAYBOOK_ARCHIVE.md`** (old 6,007-line playbook, verbatim, byte-checked). | ☑ | Body md5 = the pre-rewrite file's (0d9d7788…). | 3cd8ecff |
| A5 | **Commit the rewritten playbook + CLAUDE.md pointer.** | ☑ | 6,007 → ~1,120 lines; every rule re-checked against code by 6 slice reviews. | 3cd8ecff |

## B. Paused / unconfirmed work

| # | Item | Status | Test / evidence | Commit |
|---|---|---|---|---|
| B6 | **Nightly Fall fix: commit + confirm.** Loader no longer caches an empty pool after a failed read; `holiday_active` / `holiday_roll` reasons logged. Deployed 2026-09-29, uncommitted. Then check the next 08:00 UTC nightly: Fall should land ≈50% of rolled face-swap/scene nightlies. | ☐ | 57 dry runs 2026-09-29: 49% Fall, no losses after the roll. `__tests__/lib/holidayLoaderNoEmptyCache.test.ts`. | |
| B7 | **Fall for the bots.** Add existing autumn/pumpkin paths to `seasonalPaths.fall`: ChibiBot creature-autumn-day (move out of `paths[]`) + chibi-pumpkin-patch (also Halloween); TinyBot tiny-pumpkin-patch (also Halloween); BloomBot overgrown-pumpkin-blooms (also Halloween); FarmBot autumn-village-market + harvest-festival (move out of `paths[]`). FaeBot autumn-seed-gathering is gone (deleted 2026-09-23). Raise `engine_config.bots_seasonal_pct` 30 → 50 (next free migration). | ☐ | | |
| B8 | **New Fall paths for more bots.** | ⏸ | Deferred by Kevin 2026-09-29 until the rest is done. | |
| B9 | **Holiday roll for Dream Art (embodied) nightlies.** They never roll Fall/Halloween today. Production nightly engine change, approved by Kevin 2026-09-29. | ☐ | | |

## C. Fleet quality work

| # | Item | Status | Test / evidence | Commit |
|---|---|---|---|---|
| C10a | **BrickBot prompt clean-up** (about 1 in 3 prompts past ~380 words, the FLUX.1 read limit). | ☐ | | |
| C10b | **MangaBot prompt clean-up** (22 of 66 prompts past ~380 words). | ☐ | | |
| C10c | **TinyBot wrapper**: the always-on "tilt-shift macro lens" + macro block pushes single-object close-ups. | ☐ | | |
| C10d | **SteamBot wrapper**: "clockwork machinery / glass gauges" in the prefix + neutral style inject clock-face text. | ☐ | | |
| C11 | **FarmBot costume parade back to 3 humans** (the 2-human cap was a workaround for the fixed truncation bug). | ☐ | | |
| C12 | **Log the prompt text when a render is safety-flagged** (today it's discarded, so flags can only be diagnosed by replay + bisect). | ☐ | | |
| C13a | **Deactivate PixelBot's shadow farm path** `cozy-farming-life-sim` (farms belong to FarmBot); keep files. | ☐ | | |
| C13b | **Delete FaeBot's leftover config** for the deleted `autumn-seed-gathering` path. | ☐ | | |
| C13c | **Drop the old "never say Nat Geo" rule** (EarthBot's current look is Kevin's pick); playbook §11 only, no code. | ☐ | | |
| C14 | **Camera-framing sweep** of every bot's camera pools for entries that zoom past the subject (OceanBot's 2026-06-30 problem). Read-only report; fix hits on the C10 bots. | ☐ | | |

## D. Decided: leave alone (2026-09-29)

| Item | Why |
|---|---|
| "AUTHORITY / NON-NEGOTIABLE" wording in MangaBot, BloomBot, GothBot, OutlawBot, SteamBot look blocks | 0 refusal-style prompts in ~3,000 bot renders over the last 30 days. Revisit only if one appears. |
| Fleet "no text, no watermarks" suffix | A/B was inconclusive, and on long prompts it isn't even read. Revisit after C10. |
| DragonBot two-pass polish still on for 4 declarative paths | dragon-scene is the hearted reference; don't touch what works. |
| DinoBot flux-2-pro on night/storm paths | Low value; check only if a bad night render shows up. |

---

## Log
- 2026-09-29: tracker opened; A-D approved by Kevin, B8 deferred.
