# Fall + Halloween 2026 — readiness audit

**Audited 2026-09-13/14.** Engine under test: the live "1.2.0 with looks" nightly engine
(`LOOKS_MINIMAL = true`, `engine_config.nightly_looks_mode = 'on'` for every user).
Every claim below is backed by a live render on Kevin's account or by a test in the fast jest lane.

---

## 1. The calendar — nothing needs a human to flip

Both seasons are `is_active = true` and entirely date-driven. Locked by
`__tests__/lib/holidaySeason2026.test.ts`, which holds verbatim copies of the two production rows.

| | opens | peaks | closes | level |
| --- | --- | --- | --- | --- |
| Fall | Sept 15 | Nov 26 (Thanksgiving) | Nov 26 | flat 10% |
| Halloween | Oct 1 | Oct 31 | Oct 31 | flat 10% |

They **stack** rather than compete: through October the chance of getting *a* holiday dream is 20%,
while each season stays at 10%. Outside both windows the holiday roll is 0.

**Day-of.** Halloween has `day_of_enabled = true` and takes over Oct 31 completely (100%, not a roll).
Fall has `day_of_enabled = false` and never takes over a night — correct, a season has no single date.

**Known dead knob.** Halloween's row configures `final_pct = 35` for the last day, but `ramp_style = 'flat'`
returns `peak_pct` before the ramp maths runs, so the surge never executes. The 31st still works, through the
day-of takeover rather than the surge. Changing `ramp_style` to `'ramp'` would activate it and also replace the
flat 10% with a curve across the whole month — a content decision, not a bug fix.

## 2. Seed pools — depth and wiring

Counts are paginated (PostgREST silently caps at 1000 rows; an unpaginated count here is wrong).

| pool | enabled rows | reserved day-of | window |
| --- | --- | --- | --- |
| `dual_scenarios` halloween | 1,269 | 160 | 1,109 |
| `single_scenarios` halloween | 1,270 | 160 | 1,110 |
| `dual_scenarios` fall | 922 | 0 | 922 |
| `single_scenarios` fall | 922 | 0 | 922 |
| `holiday_scenes` halloween | 1,514 | — | 560 carry a curated `medium_key` |
| `holiday_scenes` fall | 1,817 | — | none pinned |

The reserved day-of pool is identified by `sub_theme`, not a boolean — the 16 sub-themes mapped to
`halloween_day_of` in `_shared/holidayPools.ts`. It is populated, so Oct 31 draws its own scenes rather than
falling back to window rows.

**No halloween or fall row carries a `medium_ban`.** The photo-real guard discussed in §3 is therefore not
something these seasons currently use; it applies to the fantastical categories elsewhere in the pools.

## 3. Two defects found and fixed

### Day-of look could render on a model its own row forbids

`halloween_digital_painting` allows three models and **flux-1.1-pro is not one of them**; the other five
day-of looks do allow it. Under the minimal engine the model is chosen for the look the contract *rolled*,
then the day-of look is pinned over it — and the re-pick at the pin site was a no-op, because
`pickFaceSwapModelFor` short-circuits on `minimalModel`. Roughly one day-of cast render in nine would have
shipped that look on a model it was never graded on, on the one night of the year that is guaranteed holiday.

**Fix.** The pin now re-builds the style contract around itself with the model pool clipped to that row's own
`allowed_models` (`restrictModels` in `_shared/nightlyStyle.ts`), which corrects the first pick *and* every
rung of the retry chain and the solo rebuild. Fails open with a stamp if the row allows nothing runnable.

**Proven live:** `policy:solo:1:flux-1.1-pro · model_roll:direct:flux-1.1-pro · day_of_look:halloween_digital_painting ·
pin_model_fit:flux-1.1-pro->gemini-2-image · model_restrict:2of3 · scene_medium:halloween_digital_painting`.

### Scenario medium bans were inert

6,175 enabled scenario rows carry a `medium_ban` written in the 1.2.0 **medium** vocabulary
(`photography`, `film_noir`, `vintage_film`, `double_exposure`, `heirloom`, `glamour`, plus `pencil`,
`comics`, `canvas`, `watercolor`). Under the looks engine the rolled style is always a `nightly_*` **look**, so
the guard's test — is the rolled key in the ban list? — could never be true. The guard keeping a photo-real
person out of a fantastical scene had been off since the engine went live.

**Fix.** `_shared/legacyMediumBans.ts` translates the old tokens into look keys, and a banned look now
re-rolls **the look** from the same contract minus the banned set, rather than the legacy path's random
face-swap medium (which would discard the style contract entirely). The mapping is direct-successor only,
verified fragment-by-fragment against the live catalog.

**One deliberate omission.** `comics` maps to the two retired 1.2.0 comic looks, **not** to the new
`comic_print` family. Banning ten of Kevin's new looks off a legacy token would be far wider than the row ever
expressed. Consequence: the 1,398 rows that ban `comics` (feminine glamour scenarios: `mermaid_f`,
`ballroom_f`, `angel_f`, `girly_cute_f`, `magical_girl_f`, `ballerina_f`) can now roll a `comic_print` look.
**Kevin's call** whether that family should be banned there.

### Also fixed alongside

- **Silent pin failure.** `resolveMediumFromDb` falls back to `canvas` for a key it cannot see, so a mistyped,
  de-activated or pool-restricted day-of look dropped the holiday style with *no stamp at all*. Now stamped
  `scene_medium_unresolved:<wanted>:<got>` / `scene_medium_threw:<key>`. This is what hid the first failed QA batch.
- **Retry stamps that lied.** The minimal path re-renders without re-assembling the prompt, so the look cannot
  change between attempts — but the chain was free to "re-roll" it, stamping and logging a look that never
  reached the pixels. `lockLook` keeps the look; the model still moves.

## 4. QA flag traps — both cost a wasted render batch

Locked by source guards in `__tests__/lib/minimalEngineWiring.test.ts`.

- **`force_look` IS `force_medium`** (`const force_medium = force_look ?? force_medium_raw`), and the minimal
  block is gated on `!force_medium`. A batch passing `force_look` renders on the 1.2.0 legacy chain with no
  style contract at all. Use `force_day_of_look` to pin a day-of look without leaving the engine.
- **`force_face_swap_eligible` makes the render a FIRST DREAM.** `firstDreamMediumMode` reads it as the cast
  tier and restricts every medium resolution to the seven curated first-dream styles, which silently defeats a
  day-of look pin. Use `force_cast_role` alone to choose the surface.

## 5. Verified by live render

`node scripts/qa-holiday-renders.js --mode day-of|window --season halloween|fall|both [--per N]
[--surfaces dual-cast,solo-cast,scene-only] [--day-of-look <key>]`
— serial, headroom-gated, writes an HTML contact sheet to the Desktop.

| batch | result |
| --- | --- |
| Halloween day-of, dual + solo cast | look pinned, `pin_model_fit:ok`, postcard overlay composited |
| Halloween day-of forcing `halloween_digital_painting` | model re-fitted off flux on 2 of 3, pin held |
| Halloween in-window, 3 surfaces | holiday scenes + catalogue look + catalogue vibe |
| Fall in-window, 3 surfaces | same |

The **postcard overlay** composites on every day-of render (`postcard:halloween:ok:~2s`) and correctly does
**not** run in-window — `engine_config.holiday_postcard_scope = 'day_of'`. Halloween has an overlay asset;
Fall's `postcard_overlay_url` is null, which is consistent with Fall having no day-of.

## 6. Open items — Kevin's call, not blockers for Fall or Halloween

1. **Scene-only nightlies bypass the looks catalogue.** Every `nightly_*` look has `is_scene_eligible = false`,
   so a `pure_scene` render re-rolls the pinned look away to a legacy scene medium (`illustration`, `canvas`).
   The **vibe** still comes from the new catalogue. Pre-existing and not holiday-specific. One-line DB change
   if wanted: `UPDATE dream_mediums SET is_scene_eligible = true WHERE nightly_look = true;` — it would change
   every scene-only nightly, so it is a taste decision.
2. **`macabre` vibe on a Fall dream.** Observed in the in-window Fall batch. Reads as Halloween, not Fall.
   A per-season vibe-family exclusion would fix it if it bothers you.
3. **Thanksgiving and Christmas are inactive with empty `day_of_look_keys`.** Activate before **Nov 14** and
   **Dec 1** respectively. Without curated looks their day-of falls back to the `day_of_medium_ban`
   (`photography`), which the §3 translation now makes effective rather than inert.
4. **The `comics` ban decision** in §3.
5. **546 render failures.** Two of roughly 20 QA renders returned a 546 (isolate resource limit). Unrelated to
   these fixes; the queue retries. Worth watching if the rate climbs.
