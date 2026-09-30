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
| A1 | **Ship the FarmBot prompt trim.** Medium 276 → 45 words; every brief ends with `FARMBOT_LENGTH_RULE` (120-160 words, style → subject → setting); AlphaBot's FarmBot-destined candidates append the same rule. | ☑ | 24 shadow posts on FarmBot 2026-09-30 ~02:45-02:54 UTC: 8 baseline (median ~770 words), 8 first try (characters drew older; fixed), 8 final (~236 words, cute characters back). All 43 FarmBot briefs dry-built with the new ending. | e5eae801 (pushed) |
| A2 | **FarmBot window camera shots 11 → 3** of 98 camera entries (they render as literal window frames now that prompts are short). | ☑ | Removed 8 near-duplicate "looking through a farmhouse window" entries; kept the 3 distinct ones (wavy glass, looking inward, curtains + interior light). Pool 98 → 90, window share ~1 in 9 → ~1 in 30. Pool loads; seed-dupe scan OK. | 14edfab1 |
| A3 | **HTML matrix posts hidden (shadow).** `qa-bot-model-matrix.js` adds `--shadow`; old June/July public matrix posts stay as they are. Update CLAUDE.md, the playbook §2.7 and the matrix memory. | ☑ | 1-cell live matrix (OceanBot reef-paradise × flux-1.1-pro) posted `shadow=true, is_public=false`; HTML grid still fills. Noted: the grid groups by a `[path]` caption, so FarmBot (`FarmBot › path`) wouldn't fill. | f661e1c3 |
| A4 | **Keep `BOT_SCENE_QUALITY_PLAYBOOK_ARCHIVE.md`** (old 6,007-line playbook, verbatim, byte-checked). | ☑ | Body md5 = the pre-rewrite file's (0d9d7788…). | 3cd8ecff |
| A5 | **Commit the rewritten playbook + CLAUDE.md pointer.** | ☑ | 6,007 → ~1,120 lines; every rule re-checked against code by 6 slice reviews. | 3cd8ecff |

## B. Paused / unconfirmed work

| # | Item | Status | Test / evidence | Commit |
|---|---|---|---|---|
| B6 | **Nightly Fall fix: commit + confirm.** Loader no longer caches an empty pool after a failed read; `holiday_active` / `holiday_roll` reasons logged. Deployed 2026-09-29, uncommitted. Then check the next 08:00 UTC nightly: Fall should land ≈50% of rolled face-swap/scene nightlies. | ☑ | 57 dry runs 2026-09-29: 49% Fall, no losses after the roll. **Live 2026-09-30 08:00 UTC nightly: all 13 stamped `holiday_active:fall=50`, 6 of 13 got Fall (46%), and every `holiday:fall` matches a roll under the 0.50 cut.** `__tests__/lib/holidayLoaderNoEmptyCache.test.ts` + holiday season/parity tests (23 pass). | 4688921c |
| B7 | **Fall for the bots.** Add existing autumn/pumpkin paths to `seasonalPaths.fall`: ChibiBot creature-autumn-day (move out of `paths[]`) + chibi-pumpkin-patch (also Halloween); TinyBot tiny-pumpkin-patch (also Halloween); BloomBot overgrown-pumpkin-blooms (also Halloween); FarmBot autumn-village-market + harvest-festival (move out of `paths[]`). FaeBot autumn-seed-gathering is gone (deleted 2026-09-23). Raise `engine_config.bots_seasonal_pct` 30 → 50 (next free migration). | ☑ | Migration 581 applied (verified 50). Simulation on the real holiday calendar: Fall-only dates → 50% Fall for these bots; Oct 15/31 → ~36% Halloween + ~14% Fall; Nov 10 → 50% Fall; bots without seasonal paths unchanged. All 6 moved paths dry-built through `--mode`; each bot loads with no path in both `paths[]` and Fall. | 23034240 (+ mig 581 applied) |
| B8 | **New Fall paths for more bots.** | ⏸ | Deferred by Kevin 2026-09-29 until the rest is done. | |
| B9 | **Holiday roll for Dream Art (embodied) nightlies.** They never roll Fall/Halloween today. Production nightly engine change, approved by Kevin 2026-09-29. | ☑ deployed | Dream Art (character + embodied medium, 1-2 cast) now rolls the in-season holiday at the same odds as a solo/couple face swap; a hit swaps the location spot for the holiday row's place and dresses the character in its outfit (couple outfits only for a woman + man pair). 20 dry runs on Kevin's account (fairytale + LEGO): every character render rolled `holiday_roll:embodied:pct=50`, hits exactly when roll < 50, prompts carried the Fall place + outfit; scene-only runs keep their own scene roll. Deno typecheck clean. | 4b967f96 |

## C. Fleet quality work

| # | Item | Status | Test / evidence | Commit |
|---|---|---|---|---|
| C10a | **BrickBot prompt clean-up** (about 1 in 3 prompts past ~380 words, the FLUX.1 read limit). | ☑ | Fixed text before the scene 72 → ~40 words: bot prefix 45 → 28, and a BrickBot-only `mediumStyles.photography` (12 words) replaces the shared 27-word photo fragment (dropped "accurate skin tones / photographic realism / ultra high resolution", kept the miniature depth-of-field cue). Templates' "130-180 words" → "100-140" (13). Shadow A/B, 8 vs 8 on forest / pirates / fantasy / macro-display: prompts median ~310 → ~257 words (max 374 → 270); every render still all-brick, no photoreal drift, macro-display's hearted deep-focus look intact. | 882e90f3 |
| C10b | **MangaBot prompt clean-up** (22 of 66 prompts past ~380 words). | ☑ | `ANIME_NEUTRAL` 55 → 20 words (dropped 3 Flux-side negations + a sentence Flux can't act on; kept the all-anime, no-mixed-media lock). Every brief without its own count now ends with `MANGABOT_LENGTH_RULE` (110-150 words; game-center-arcade keeps its own; all 30 briefs dry-built). Shadow A/B, 8 vs 8 on isekai-fantasy / neo-tokyo / anime-character-female / ghibli-countryside: prompts median ~293 → ~230 words (max 982 → 290); all clearly anime, quality held. **Kevin 2026-09-30: drop the isekai status windows** → done: 3 template lines, 21 pure game-UI pool entries dropped (magic-effect 187 → 169, story-prop 200 → 197), 35 entries reworded to keep their scene (scene-type, action-moment, character-role, camera-framing), and the 5 isekai generators no longer ask for them (magic-effect now bans on-screen UI). 4 shadow renders on isekai-fantasy: no status windows or UI. | 3c55b6bd + 57c46169 |
| C10c | **TinyBot wrapper**: the always-on "tilt-shift macro lens" + macro block pushes single-object close-ups. | ✋ measured, not changed | The recorded defect barely reproduces: of the last 10 live posts at most 2 read as single-object close-ups (the tiny-vehicles miss was a feather-glider drawn as a bird, not the wrapper); the macro wording mostly adds heavy blur. One-path pilot on cottage-village ("the whole miniature world, tilt-shift only at the edges"), 3 before vs 6 after shadow renders: villages got wider (single-structure frames 1/3 → 1/6) but the "whole village" wording drew tiny townspeople (a street crowd in 1 of 6, a distant figure in 1) on a no-humans bot. Not a clear win, so reverted. If revisited: "whole miniature world" without "village", plus a people check. | (none) |
| C10d | **SteamBot wrapper**: "clockwork machinery / glass gauges" in the prefix + neutral style inject clock-face text. | ☑ | `steambot_neutral` (every live path) 55 → 25 words: "exposed gears / glass gauges / impossible clockwork engineering" → brass, copper, rivets, pipework, venting steam, wood, leather, gaslight (the rooftop-telegraph swap that took clock faces 3/6 → 1/6), and the closing instruction Flux can't act on is gone; its prefix "clockwork machinery" → "brass and steam machinery". Shadow A/B, 8 vs 8 on steampunk-scene / airship-skies / cozy-steampunk / steam-transport: clock/gauge/dial words in prompts 32 → 5 (5 of 8 now zero), prompts ~200 → ~169 words; visible clock faces ~3/8 → ~2/8, the remaining ones on cozy-steampunk whose own pools name clocks (on-theme, real numerals). | 6ce418d8 |
| C11 | **FarmBot costume parade back to 3 humans** (the 2-human cap was a workaround for the fixed truncation bug). | ☑ | Roll forced to 3 humans locally (never committed): 3 of 3 shadow renders showed three kids, each in their own costume. Final roll 1/2/3 kids ≈ 29/45/26% of human parades (2,000 dry briefs), cast still ≤3. | 80687b98 |
| C12 | **Log the prompt text when a render is safety-flagged** (today it's discarded, so flags can only be diagnosed by replay + bisect). | ☑ | Each flagged roll now writes a `bot_run_log` row (`skipped` / `safety_flag`, full prompt, model; no LLM stamps). Real engine run with only Replicate faked to E005: 3 `safety_flag` rows + the final `failed` row, previews ~1,500 chars. Locked by `__tests__/lib/safetyFlagRunLogGuard.test.ts`. | 99e5669e |
| C13a | **Deactivate PixelBot's shadow farm path** `cozy-farming-life-sim` (farms belong to FarmBot); keep files. | ☑ | Out of `shadowPaths` (builder + pools kept); Kevin's 2026-09-19 call was "scrap the farm pixels". `--mode cozy-farming-life-sim` now refused; bot loads. | f661e1c3 |
| C13b | **Delete FaeBot's leftover config** for the deleted `autumn-seed-gathering` path. | ☑ | Removed the `faebot_seedfall` medium + prefix, the dead mediumByPath/prefix/model comments (also honey-harvest's, cut the same day; its flux-2 finding kept as one line) and the orphaned `gen-seeds/faebot/gen-autumn-seed-pools.js`. star-charting brief dry-built OK. | f661e1c3 |
| C13c | **Drop the old "never say Nat Geo" rule** (EarthBot's current look is Kevin's pick); playbook §11 only, no code. | ☑ | Old rule lives only in the archive; open item removed. | f661e1c3 |
| C14 | **Camera-framing sweep** of every bot's camera pools for entries that zoom past the subject (OceanBot's 2026-06-30 problem). Read-only report; fix hits on the C10 bots. | ☑ report | 141 pools, 1,445 regex hits, read by class. Real: (1) ToyBot's shared `camera_angles.json` has 11/200 texture-only abstract macros (the OceanBot defect) → drop; (2) MangaBot scene-leaning pools are 13-18% face-fills-frame close-ups (rooftop_sunsets 36, occult_tokyo 35, post_apocalyptic 26, neo_tokyo 11 of 200) → Kevin's taste call, cap ~5-10%?; (3) corridor clusters: FarmBot 5 near-identical "village street to a vanishing point", MangaBot village 6, BrickBot 7 → collapse to 1-2; (4) BrickBot macro-display ~15 near-duplicate top-down plan views → keep 2-3; (5) YumBot candy_fantasy 3 "over the shoulder of a standing figure" on a no-humans bot → reword. Everything else is intentional variety or a false positive. **Kevin 2026-09-30: apply all** → ToyBot 11 dropped (200 → 189); MangaBot close-ups capped at 10 per pool (~5%: rooftop-sunsets 32 → 10, occult-tokyo 32 → 10, post-apocalyptic 24 → 10; neo-tokyo already 10) and their generators now ask 5%; duplicates collapsed (FarmBot street 5 → 1, MangaBot village 11 → 2, BrickBot forest path 8 → 2, girly recede 11 → 3, macro-display top-down 23 → 3); YumBot every "figure(s)" in candy-fantasy (41) and chef (10) camera pools → "food character(s)". All 150 briefs of the five bots dry-build; seed-dupe scan clean. | 57c46169 |

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
- 2026-09-30 ~04:00 UTC: A1-A5, B6 (committed; confirm after tonight's nightly), B7, B9, C11, C12, C13 done. C10/C14 analysis agents hit the session usage limit mid-run; redoing the analysis directly.
- 2026-09-30 ~04:50 UTC: C10a (BrickBot), C10b (MangaBot), C10d (SteamBot) shipped with shadow A/B; C10c (TinyBot) measured, pilot reverted; C14 report written. Remaining: B6 confirmation after the 08:00 UTC nightly, and Kevin's calls (isekai status windows, C14 pool fixes).
- 2026-09-30 ~20:00 UTC: B6 confirmed on the live nightly (6 of 13 Fall, 46%); C10b + C14 rows point at 57c46169.
