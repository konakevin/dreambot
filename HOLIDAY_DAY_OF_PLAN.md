# Holiday DAY-OF dreams — the overhaul plan (2026-09-07)

**Kevin's direction (verbatim):** "we should just make a 'halloween celebration' pool that has scenes from
all genres that show people celebrating halloween — and then on the day of halloween, we just draw a seed
from that pool and render it like any other dream using our approved model/medium configuration. I don't
like that we now have two different prompting methods … we should instead use a specific 'day of' pool for
all holidays with good, festive seeds that will make a splash on the actual holiday, then on the day of the
holiday we just draw 100% from that seed pool, render it with our approved config, and throw the 'happy
halloween' logo over it, done." Plus: "include the logo overlay as a requirement — and make this a flexible
system so that we can use it for other holidays — christmas, 4th of july, etc."

This supersedes the day-of HERO (HOLIDAY_DREAMS_PLAN.md §13, migrations 457/458, `holidayHero.ts`) and
HALLOWEEN_HERO_LOOK_PLAN.md. The hero's look-matrix data (per-look model membership) is kept for the looks
catalog (NIGHTLY_LOOKS_FEASIBILITY.md); the hero mechanism itself is deleted.

## 1. Requirements (the acceptance list)

| # | requirement | how it is verified |
|---|---|---|
| R1 | **One pipeline.** A day-of render is an ordinary nightly render: same scene → brief → prompt assembly, same model chain, same medium/look config. No day-of-only prompt text. | grep test: nightly-dreams contains no `holiday_hero` / `fillHeroTemplate`; the day-of row is applied by the same code path as every other holiday row |
| R2 | **100 % on the day.** On the user's holiday day-of, every eligible nightly (couple, solo, scene-only) draws from that holiday's `day_of` pool. Never a broken render: empty day-of pool → the holiday's window pool at 100 % → normal roll. | pure fn test `resolveDayOfDraw(activeHolidays, pools)`; dbspec: every active holiday with `day_of_enabled` has ≥ N day-of rows per surface |
| R3 | **Reserved seeds.** Day-of subs never roll during the window (they must land fresh on the day). | loader test: window draws exclude `day_of` subs; day-of draws include only them |
| R4 | **The logo overlay on every day-of render** (existing `holiday-postcard` compositor, per-holiday asset/anchor/width/margin/scrim from the catalog). A day-of render without `postcard:<key>:ok` is a failure. | stamp assertion in QA + the day-of monitor (§7) |
| R5 | **Per-holiday, generic.** Adding a holiday = catalog row (dates, ramp, overlay asset) + taxonomy module (pools/subs incl. `day_of`) + seeds + engine-mirror entry. No holiday name in engine code. | new-holiday checklist (§8) exercised by adding a second holiday's day-of pool (Thanksgiving) in the same build |
| R6 | **Date correctness per user.** The day-of fires on the run whose result the user sees on the holiday, in their timezone (§4). | table-driven unit test over 8 timezones × 3 run instants |
| R7 | **Observable + fail-loud.** Stamp `holiday_day_of:<key>:<sub>`; a monitor on the peak day compares stamps to eligible users and alarms on 0 / on missing postcards. | `scripts/check-holiday-day-of.js` + a GH Actions job on the peak date |
| R8 | **QA through the same path.** `force_day_of=<key>` (+ `force_holiday_sub_theme`) renders the day-of pool draw + overlay for any date. | QA rounds (§6) |

## 2. What exists today (facts, from the code)

- **Scene-only path already does it:** `index.ts` ~1663-1690 — on `dayOfHoliday` the holiday pct is 100,
  the draw is forced to that holiday, `heroApplied = true` triggers the postcard. Rows come from
  `loadHolidayScenes(sb, key, sub)`.
- **Cast paths detour:** `index.ts` ~1732-1760 — `holiday_hero_prompts` (6 curated rows, axes filled by a
  per-user hash) are injected as `dualSpecialScene / Wardrobe / posePool / mediumKey` ahead of the roll.
  This is the second prompting method Kevin wants gone.
- **Everyday holiday cast rows:** `dual_scenarios` / `single_scenarios` with `pool='holiday'`, `sub_theme`,
  `holiday` — loaded by `loadHolidayDual/Single(sb, key, sub)` (`holidayScenarioLoader.ts`), drawn with
  equal airtime per sub, main pool via `holidayPoolOf(sub)` (engine mirror `_shared/holidayPools.ts` of
  `scripts/lib/<holiday>Pools.js`, parity-tested).
- **Window + date:** `holidayWindow.ts` — `resolveActiveHolidays(localDate, rows)` with the user's
  `users.timezone` (`localDateInTz`), `daysUntilPeak === 0` = day-of; ramp → `finalPct` for the last
  `finalDays`. Halloween row: window 30, ramp 6 → 10, final 35.
- **Postcard:** `holidays.postcard_*` per holiday; `engine_config.holiday_postcard_scope` = `day_of` |
  `window`; composited in-render when `heroApplied` (rename → `dayOfApplied`).
- **Seeds tooling:** `scripts/gen-holiday-archetypes.js --holiday <key> --pool <pool> --to-share`
  (per-sub costume/setting hints from the taxonomy, register from `actionRegisters.ts`, lint
  `holidayPoolLint.js`, dual-proximity scan), QA driver `scratchpad/fall-build/qa-round.mjs`.

## 3. Design

### 3.1 Data — a `day_of` pool per holiday, no schema change
- Each holiday taxonomy (`scripts/lib/halloweenPools.js`, `fallPools.js`, future `christmasPools.js`…)
  gets a pool `day_of` with its subs (§5). `POOL_OF_SUB` maps each sub → `day_of`; the engine mirror
  `holidayPools.ts` gets the same entries (parity test extended).
- Rows live where holiday rows already live (`dual_scenarios` / `single_scenarios` / scene rows), with
  `sub_theme` ∈ the day-of subs. Selection is by taxonomy (`holidayPoolOf(sub) === 'day_of'`), so no
  migration and the dashboard sees ordinary holiday rows.
- Catalog flag `holidays.day_of_enabled boolean default true` (one small migration) so a holiday can have
  a window without a day-of takeover (e.g. the Fall season, whose peak is Thanksgiving — Thanksgiving gets
  its own catalog row + day-of pool).

### 3.2 Loader — `{ dayOf: 'only' | 'exclude' }`
`loadHolidayDual/Single/Scenes(sb, key, sub, opts)`: default `exclude` (window draws never see day-of
subs — R3); the day-of branch passes `only`. Cache keys include the mode. A forced `sub_theme` bypasses the
mode (QA can target any sub).

### 3.3 Engine — one branch, three surfaces
```
dayOfHoliday = activeHolidays.find(h => h.daysUntilPeak === 0 && h.dayOfEnabled)   // §4 date rule
if (dayOfHoliday):
  rows = load<surface>(dayOfHoliday.key, force_sub, { dayOf: 'only' })
  if rows.length: row = pickHoliday(rows)            // equal airtime per sub, same as the window draw
  else:           rows = load<surface>(key, sub, { dayOf: 'exclude' }); row = pickHoliday(rows)   // fallback A
  if row: applySceneRow(row)  ← the SAME function the window path uses (scene/wardrobe/pose/medium pins)
          dayOfApplied = true; stamp `holiday_day_of:<key>:<sub>` (or `:fallback_window:<sub>`)
  else:   normal roll (fallback B, stamped `holiday_day_of_empty:<key>`)
```
- Cast: replaces the hero block at ~1732 (`dualSpecialScene` etc. are set by `applySceneRow` exactly as
  for a window holiday row — no hero-only fields). Scene-only: the existing 100 % branch, now filtered to
  the day-of pool with the same fallbacks.
- Postcard: `pcScope === 'day_of' && dayOfApplied` (R4). `window` scope unchanged.
- **Deleted in the same commit:** `holidayHero.ts`, `pools/holidayHeroLoader.ts`, the hero block, QA
  flags `force_hero_register` / `force_hero_seed`, `scripts/qa-holiday-hero.js`,
  `scripts/simulate-holiday-hero.mjs`, their tests; migration `47x_drop_holiday_hero_prompts.sql` (table
  dropped after the day-of pool is live — keep the rows exported to `HOLIDAY_DREAMS_PLAN.md` for the
  record). `force_day_of` stays and now means "pretend today is <key>'s peak".
- Model / medium / look: nothing day-of-specific. Today = the policy chain + the nightly medium roll (+
  a row's `medium_key` pin if a seed wants one); later = the looks catalog. The hero-matrix lesson
  (1.1-pro crops on dark ornate interiors) is handled at the SEED level: day-of subs are authored as
  lit celebrations (lanterns, bonfires, string lights, moonlit streets), not candlelit ballroom portraits.

### 3.4 The never-faceless prerequisite (blocking for the peak day)
`pure_scene_fallback` shipped 2 of 6 in the hero QA. Before Oct 31: when the couple cascade exhausts, retry
the solo rebuild ONCE on the couple surface's primary model with the v3 single line, and only then fall to
a pure scene; stamp `SHIPPED_FACELESS` loud and count it in the day-of monitor. (COUPLE_PROMPT_PARITY_PLAN.md
§9 item 2 — promoted to a blocker.)

## 4. The date rule (R6) — "the dream they see on the holiday"

Nightly runs at 08:00 UTC. `daysUntilPeak` is computed on the user's LOCAL date at that instant. That is
right for most of the world and wrong for the far west:

| user tz | local time at the 08:00 UTC run on Oct 31 | local date | today's rule | wanted |
|---|---|---|---|---|
| Europe (CET) | 09:00 Oct 31 | Oct 31 | day-of ✓ | Oct 31 morning ✓ |
| US East (EDT) | 04:00 Oct 31 | Oct 31 | day-of ✓ | ✓ |
| US West (PDT) | 01:00 Oct 31 | Oct 31 | day-of ✓ | ✓ |
| Alaska (AKDT) | 00:00 Oct 31 | Oct 31 | day-of ✓ | ✓ |
| **Hawaii (HST)** | **22:00 Oct 30** | Oct 30 | not day-of → fires on the Nov 1 UTC run = 22:00 Oct 31 | should fire on THIS run (they wake up Oct 31 to it) |
| Japan (JST) | 17:00 Oct 31 | Oct 31 | day-of ✓ (arrives Oct 31 evening) | acceptable; the Oct 30 17:00 run would be "wake up to it" |
| India (IST) | 13:30 Oct 31 | Oct 31 | day-of ✓ (arrives Oct 31 afternoon) | ✓ |
| Sydney (AEDT) | 19:00 Oct 31 | Oct 31 | day-of ✓ (arrives Oct 31 evening) | acceptable |

**Rule:** compute the local date at the run instant; if the local HOUR ≥ `engine_config.day_of_evening_cutoff_hour`
(default 20), evaluate the day-of against the NEXT local date (the render is consumed the next morning).
Hawaii then fires on the Oct 31 08:00 UTC run (22:00 Oct 30 local → treated as Oct 31). Everyone else is
unchanged. Pure function `dayOfCalendarDate(now, tz, cutoffHour)` in `holidayWindow.ts`, table-driven
tests over the 8 rows above × the run on Oct 30 / 31 / Nov 1. The window's end stays the peak day, so no
user gets two day-of renders (Hawaii's Nov 1 UTC run is local Oct 31 22:00 → treated as Nov 1 → outside).

## 5. The Halloween `day_of` pool — seeds (the splash)

Bar: **people CELEBRATING Halloween**, one memorable painted moment per seed, lit (string lights,
lanterns, bonfire, moon), costumes on everyone with faces clear (hats tipped back, masks in hand, no face
paint), carved pumpkins LOW and away from heads, no gargoyles / face-bearing statues, couple seeds
swap-safe (side by side, clear head gap — the proximity scan gate), solo seeds one person only, scene-only
seeds the same places with the crowd as distant texture. Genres spanned = the existing pool families:

| sub (12) | genre | the moment |
|---|---|---|
| costume_party_barn | neighborhood | a barn costume party, string lights, cider cauldron, bobbing tub |
| masquerade_ball | gothic | a moonlit masquerade in a lantern-lit courtyard (open air, not a candlelit ballroom) |
| trick_or_treat_street | neighborhood | a glowing porch-lit street, candy buckets, kids' costumes as distant texture |
| haunted_hayride_party | pumpkin patch | a torch-lit hayride, blankets, pumpkins piled |
| pumpkin_carving_party | neighborhood | a porch or picnic-table carving party, lanterns lit |
| bonfire_night | witchy | a bonfire circle with sparklers, cauldron punch, a full moon |
| witches_kitchen_party | witchy | a witch's kitchen party, bubbling brew, floating candles |
| haunted_house_queue | carnival | the line at a haunted attraction, neon signage, fog |
| cemetery_lantern_picnic | ghost glam | an elegant lantern picnic among old stones (no gargoyles) |
| halloween_parade | town | a small-town parade float / street party in costume |
| rooftop_skyline_party | glam | a rooftop party, city skyline, jack-o-lanterns on the parapet |
| monster_hotel_lobby | monster | the monster hotel's Halloween gala (bandaged concierge, coffin luggage) |

Each sub: dual + single + scene rows, MVP 25 → QA → scale to share (`--to-share`, ceil(70/12) = 6 per sub
per table is the SHARE rule; the day-of pool gets a larger share knob because it must carry a whole day:
`SHARE_DAY_OF = 120`). Registers: a `day_of` entry in `actionRegisters.ts` (celebration beats: toasting,
handing out candy, lighting a lantern, mid-laugh at a costume, sparkler arcs). Generator TAX entry with
the palette / objects / lanterns=true / subs + per-sub costume and setting hints. Lint: Halloween rules +
"no gargoyle / statue / mask on face" + "lit" anchors.

## 6. QA (the same loop as Fall)
1. Engine unit + dbspec tests green; `force_day_of=halloween` on Kevin's account renders the day-of draw
   with the overlay (couple, solo, scene-only) — 6 renders smoke.
2. 5 rounds × (12 subs × couple + solo) with the framing judge + sheets + Kevin in the app (captions
   `🎃 DAY-OF <sub>`), fixes at the SEED level; proximity scan exit 0 before each round.
3. Dress rehearsal: `scripts/simulate-day-of.mjs` — 20 synthetic users across the 8 timezones at the three
   run instants → every one fires exactly once, on the right run, with a postcard stamp.
4. Scale to share; final parity of the taxonomy mirror; commit.

## 7. Monitoring on the day (R7)
`scripts/check-holiday-day-of.js --holiday halloween`: on the peak date (per user timezone, so it runs
on both the Oct 31 and Nov 1 08:00 UTC runs), tally eligible Pro users vs `holiday_day_of:` stamps vs
`postcard:halloween:ok` stamps vs `SHIPPED_FACELESS`; exit 1 (GitHub failure email) if stamps = 0, if
postcards < stamps, or if any faceless shipped. Wired as `holiday-day-of-monitor.yml` triggered at 10:00
UTC on the catalog's peak dates (a tiny script resolves them from `holidays`).

## 8. New-holiday checklist (R5) — Christmas, July 4th, Thanksgiving, Easter…
1. `holidays` row: key, display name, emoji, peak rule (fixed Dec 25 / fixed Jul 4 / nth_weekday 4th Thu
   Nov / easter), window or explicit start, ramp pcts, `day_of_enabled`, postcard asset URL + anchor +
   width + margin + scrim. (Migration or dashboard; the window math needs nothing else.)
2. Taxonomy module `scripts/lib/<key>Pools.js` (+ mirror entry in `holidayPools.ts`, parity test) with
   the window pools AND the `day_of` pool + subs; `actionRegisters.ts` entries; lint rules if the holiday
   has a demarcation (Fall's no-pumpkins rule is the model).
3. Seeds: `gen-holiday-archetypes.js --holiday <key> --pool day_of --to-share` (MVP 25 → QA → share).
4. Overlay PNG: upload to `uploads/assets/holiday/<key>_postcard_<ts>.png`, set the catalog row; verify
   with `force_day_of=<key>` on Kevin's account.
5. `check-holiday-day-of.js` needs nothing new (reads the catalog); add the peak date to the monitor's
   schedule.
A holiday with only a day-of (July 4th: no 30-day window wanted) = window 0-3 days + `day_of_enabled`.

## 9. Sequence and effort
| step | what | size |
|---|---|---|
| 0 | never-faceless prerequisite (§3.4) + its test | S |
| 1 | taxonomy `day_of` pool + mirror + parity test; loader `dayOf` mode + dbspec; `day_of_enabled` + cutoff-hour migration | S |
| 2 | engine: unified day-of branch via `applySceneRow`, `dayOfApplied` → postcard, stamps; delete the hero (code, flags, scripts, tests); date rule + table test | M |
| 3 | seeds: TAX entry + registers + lint → 12 subs × 3 tables MVP 25; proximity scan | M (generator time) |
| 4 | QA rounds 1-5 + dress rehearsal + Kevin sign-off; scale to share | M (renders ≈ 150, ≈ $12) |
| 5 | monitor script + workflow; docs (HOLIDAY_DREAMS_PLAN.md §13 rewritten to point here); memory | S |
| 6 | Thanksgiving row + `day_of` pool as the R5 proof (Fall's peak) — can trail Halloween | M |
Total ≈ 2-3 sessions before Oct 31 with margin.

## 10. Status log
- 2026-09-07 — plan written; awaiting Kevin's go. Hero mechanism (mig 457/458) still live until step 2.
