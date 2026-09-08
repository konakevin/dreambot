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

> **Delivery correction (2026-09-08 launch review):** the nightly is NOT one 08:00 UTC run any more.
> `nightly-dreams.yml` ticks HOURLY and `scripts/lib/nightlyTimezone.js` enqueues each user on the first tick
> at or after their LOCAL 4 am, keyed on their local day (no/invalid timezone → first tick at/after 08:00 UTC,
> UTC day). So the date rule below is evaluated at ~local 4 am, where local hour < cutoff (20) and the
> day-of date is simply the user's own date: every timezone gets the day-of dream on its own peak morning.
> The evening-cutoff shift only matters for the 08:00-UTC fallback users. `scripts/simulate-day-of.mjs`
> now models exactly this delivery (8 timezones + the fallback) and must print "fires exactly once … on
> the peak date".

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

| sub (16) | genre | the moment |
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
| monster_hotel_gala | monster | the monster hotel's Halloween gala (bandaged concierge, coffin luggage) |
| witches_cottage_party | witchy · purple/green/black | the crooked cottage garden, green-lit windows, violet sky, broomsticks, black cats |
| mad_scientist_lab_party | monster · purple/green/black | a lab thrown open for a party, tesla coils, violet lightning, green beakers, punch in flasks |
| vampire_lounge | gothic · purple/green/black | a velvet vampire lounge, absinthe glow, black wax candelabras, a blood-red moon |
| swamp_witch_bayou | witchy · purple/green/black | a bayou dock party, green fog on black water, lanterns in the cypress, will-o-wisps |

The last four (2026-09-08, Kevin: "we need a few purple/green/black options … witch's cottage party,
mad scientist lab party theme etc.") carry their OWN `palette` + `objects` on the sub (taxonomy
`SUBS.<sub>.palette/objects`; the generator prefers a sub's over its pool's), because the pool-level
palette is amber/orange and every seed inherited it.

Each sub: dual + single + scene rows, MVP 25 → QA → scale to share (`--to-share`, ceil(70/12) = 6 per sub
per table is the SHARE rule; the day-of pool gets a larger share knob because it must carry a whole day:
`SHARE_DAY_OF = 160` = 16 subs × 10). Registers: a `day_of` entry in `actionRegisters.ts` (celebration beats: toasting,
handing out candy, lighting a lantern, mid-laugh at a costume, sparkler arcs). Generator TAX entry with
the palette / objects / lanterns=true / subs + per-sub costume and setting hints. Lint: Halloween rules +
"no gargoyle / statue / mask on face" + "lit" anchors.

### 5b. The costume pool + the costume LOCK (2026-09-08)

Kevin: "people need to look more dressed up in costumes for halloween — even if we can't do face paint or
masks, we need to have them dressed up in fun, sexy, cool, scary, whatever … they have to find out what
they 'dressed up' as — perhaps we need a pool of costumes or character archetypes."

Why the seeds alone could not do it: the row's `attire` reaches Sonnet as *"one on-location inspiration
to draw from … adapt it … or invent something equally on-location"* (the COSTUME DESIGNER brief), and
Sonnet's 8-15-word paraphrase is what lands in the prompt — a "witch gown with the hat tipped back" hint
shipped as "a cozy sweater with a witch-hat headband".

- **Pool:** `_shared/holidayCostumes.ts` — `HOLIDAY_COSTUMES[holiday]`, 34 Halloween character
  CONCEPTS (v2, Kevin: "costumes are kinda bland … less cliche? the roman garb, etc"): Victorian vampire
  dandy/countess, art-nouveau moon witch, cursed ghost pirate, mad scientist, Art Deco devil, fallen angel,
  baroque skeleton, zombie prom, black cat, werewolf in a torn tux, gilded pharaoh mummy, elegant reaper,
  monster bride/groom, steampunk, speakeasy ghost, moth fairy, undead viking, carnivorous-garden witch,
  haunted doll/toy soldier, haunted ringmaster, undead gunslinger, swamp creature, Medusa/minotaur, ghost
  wedding, jester of the dead, dark royalty, pumpkin royalty, Red Riding Hood/wolf, cyber-witch, vampire
  hunter, raven queen/crow king, drowned siren/sailor, carnival mystic, black widow/spider king — each
  with a female and a male variant = `label` ("a Victorian vampire countess") + `attire` (the verbatim
  wardrobe text) + a `vibe` (fun / sexy / cool / scary / classic). Authoring rule (v2): every entry is a
  specific character concept WITH A TWIST, and every attire names a silhouette, two specific details and
  one prop in specific colours and materials; no "history class" dress-up (toga, pharaoh, viking-as-is,
  generic hero, foil robot were cut).
  Swap-safe by construction: clothing + headwear + props only, no mask / face paint / fangs / veil /
  prosthetic / hood up / goggles over the eyes, no hair colour or length change (identity), no pronoun or
  face word — every variant is locked against the slot validator + the §6.1 occlusion rule by
  `__tests__/lib/holidayCostumes.test.ts`.
- **Roll:** `rollHolidayCostumes(holiday, cast, rng, forceKeys)` — one pick per cast member in cast
  order (index 0 = LEFT), DISTINCT keys per render (the surprise is the point; a couple rarely matches),
  the member's gender variant (random when unknown). Nightly rolls it on a day-of cast render at
  `engine_config.day_of_costume_pct` (mig 476, default 100; 0 = the row's attire hint again). Stamp
  `costume:<left>/<right>`; QA `force_costume_keys` (pins keys, forces the roll) / `force_costume_pct`.
- **Lock:** `CharacterSlotPipelineInput.costumeLock: string[]` — the brief tells Sonnet the costumes are
  DECIDED ("LEFT wears EXACTLY …") so scene / mood / props play off them, and after Sonnet returns the
  wardrobe slot(s) are OVERWRITTEN with the text verbatim (`applyCostumeLock`, stamp `costume_lock`) —
  a paraphrase, the fallback slots or a forced slot set can no longer decide what they wear. The row's
  `attire` is bypassed while the lock is on. Solo rebuilds inherit the locked wardrobe (they reuse the
  dual slots).
- **Not yet:** telling the dreamer what they went as (the notification / caption) — the labels are in
  the log (`observability.slotInput.costumeLock` + the stamp) so it is a message change, not an engine one.

### 5c. Register-owned STANCES — the "boring poses" fix (2026-09-08)

Kevin, on the R34 set: "people just standing there, let's give them fun halloween activities and poses,
and make these look more natural … the poses in all of these are boring af."

Root cause: every couple render rolls ONE of the seven generic `DUAL_STANCES` (seated together,
leaning back, shoulder lean, perched on an edge, mid-laugh, hands free, one busy one easy) BEFORE Sonnet
writes the action, and the brief says "build the moment around it". Five of the seven are static body
frames ("standing easy with nothing held, hands in pockets, arms folded"), so the register's "ladling
punch" became "one busy, the other standing with arms folded" — the stance won.

Fix: an `ActionRegister` may OWN its stances (`stances?: DualStance[]`); `resolveCastAction` rolls the
couple stance from the register's list when it has one (`pickDualStance(rng, reg.stances)`), else the
generic set — nothing changes for any other register. The day-of register now carries 9 activity stances
(dance step, sparklers low, low toast, mock scare, broom gallop, seated laugh, both kneeling busy, costume
flourish, hands busy) and 23 activity beats (carving, apple tub, cauldron, sparklers, foam-sword duel,
zombie shuffle, candy scooping, marshmallows, tesla lever, potion pouring, broom sweeping, confetti,
tarot fan, black cat …). Swap discipline kept: both people on ONE plane at ONE height (one crouched +
one standing is the parked height-contrast geometry — 2 of R34's 3 degrades had exactly that), props at
waist height or lower, a clear gap; every stance + beat passes the couple validator verbatim (registers
test). Stamp `dual_stance:dayof_<key>` tells forensics which frame a render got.

### 5d. The day-of LOOKS + the photography ban (2026-09-08, mig 478)

Kevin: "did we also finalize the mediums we'll use for the day-of?" — no: the day-of rolled the ordinary
nightly medium (ten labels across R35/R36, photography once) and on flux-1.1-pro the override library
then painted with one of four generic art fragments under that label. Kevin: "may as well do both? I liked
the looks you showed me in the matrix sheet, would we be supporting those?" → both, and yes.

- **The looks = the six hero-look matrix fragments** (`HALLOWEEN_HERO_LOOK_PLAN.md` §7 round 1, F1-F6),
  each a `dream_mediums` row in the reserved `halloween_` namespace: `halloween_watercolor_ink`,
  `halloween_ornate_ink`, `halloween_digital_painting`, `halloween_dark_fantasy_oil`,
  `halloween_storybook_gouache`, `halloween_classical_oil`. Flags: `is_active=true` (Dream Again / DLT /
  the FK on `uploads.dream_medium` resolve it), `is_public=false` (never in the Create picker —
  `get_dream_mediums` is public-only), `is_dream_eligible=false`, `is_scene_eligible=false`,
  `nightly_skip=true` (the normal rolls never see it; the day-of PINS it by key). Per-look MODEL
  membership in `client_meta.smart_dream_models`: the matrix said F3 (polished digital painting) failed
  twice on flux-1.1-pro → excluded there (flex default); everything else approved on all five tested
  models (1.1-pro, flux-2-flex, gemini-2-image, seedream-4, grok-imagine). This is the NIGHTLY LOOKS
  CATALOG pilot (`NIGHTLY_LOOKS_FEASIBILITY.md` §3 "rows in a namespace") on the smallest surface.
- **Catalog:** `holidays.day_of_look_keys text[]` (the holiday's look set; empty = normal roll) +
  `holidays.day_of_medium_ban text` (comma list, default `photography`) — generic per holiday (R5).
  Read by `holidayWindow.ts` + the Node mirror (`ActiveHoliday.dayOfLookKeys / dayOfMediumBan`).
- **Engine:** on a day-of CAST render `pickDayOfLook(keys, force_day_of_look)` (`_shared/dayOfLook.ts`,
  uniform — one day-of per user per holiday) sets `dualSceneMediumKey` = the look, which rides the
  existing scenario medium-pin route: resolve by key → `uploads.dream_medium` = the look → model lists
  re-synced → the model RE-PICKED from the look's `smart_dream_models` (look-first, then model) → the
  1.1-pro override library is EXEMPTED (`day_of_look_fragment:<model>`; the look is the curated
  fragment) → the solo rebuild inherits the look's real fragment. Stamps: `day_of_look:<key>` then
  `scene_medium:<key>` (the pin resolved) — a `day_of_look:` without its `scene_medium:` = the pin
  failed (unknown / non-natural row). No look → `day_of_look:none` and the ban joins
  `dualSceneMediumBan`. SCENE-ONLY day-of renders keep the scene roll (the look fragments carry the face
  clause) and just never roll a banned medium (`day_of_medium_ban:<old>-><new>`).
- **Client label:** the card resolves a medium label via the public list with a prettified-key fallback,
  so a look shows as "Halloween Storybook Gouache" with no app change.
- **Preflight** (`check-holiday-day-of.js --preflight`) now fails on a missing / inactive / public look row.

### 5e. SCENE-ONLY program — the "fun" register + stylized worlds (Kevin 2026-09-08, PROPOSAL → MVP)

Kevin: "scale up some good scene-only pools for halloween … base them off the same char paths … seed them to
be more creative and 'fun' since they can be whatever we want and don't have to preserve good face swap
settings" + "a few looks and pools we should add that we couldn't support in face swap mode. genres like
nightmare before christmas (the same look, avoid rendering the IP), coraline, and other fun styles — coco
from disney, day of the dead scenes, all sorts of stuff".

Why scene-only is the place for it: a `holiday_scenes` row never face-swaps, so none of the swap
invariants (frontal faces, clear head gap, same plane, props at waist height, no masks / face paint) apply,
AND the row can pin its own medium (`holiday_scenes.medium_key`, already honoured by the render at the
pure-scene holiday branch). Users this reaches: anyone without a self photo, plus the pure-scene share of
every nightly roll, for the whole 30-day window (and the day-of scene-only branch).

**Part 1 — the "fun" register on the EXISTING pools (built):** the generator's Halloween scene brief is
now a MOMENT WITH A HOOK ("something mischievous, magical or spectacular is HAPPENING, told entirely
through the environment and its non-human cast: ghosts mid-prank, a skeleton band, black cats in a conga
line, animated jack-o-lanterns rolling into a pyramid, a witch's broom as a distant silhouette across the
moon, a candy avalanche, a cauldron overflowing into a river of purple fog") on every window pool's setting
+ palette, lint §6.2 still enforced (no people / face / camera words — "carved grins"). MVP: 3 rows per
sub across haunted_graveyard / halloween_party / gothic_manor (≈ 36 rows) → 6 renders to Kevin's album →
scale to 12-15 per sub across all 14 pools on his word (≈ 700 rows, ≈ $8). The 206 plain rows seeded
earlier today stay active until the fun set is in; then disable them (they dilute the draw).

**Part 2 — STYLIZED WORLDS: new scene-only pools with pinned looks (proposal):** genre looks we could
never run under a face swap, described by their craft, never their franchise. Each pool = a taxonomy
entry flagged `sceneOnly` (scene rows only, no cast rows, no register needed) + a `dream_mediums` look row
in the `halloween_` namespace (scene-only, non-public, nightly_skip) pinned by the pool's rows via
`medium_key`, so the look and the world travel together:

| pool (scene-only) | the world (IP-free) | pinned look |
|---|---|---|
| `stop_motion_halloween_town` | a hand-built miniature town of crooked spiral hills, striped stockings on the lampposts, a pumpkin-headed mayor in the square, everything stitched and puppet-jointed | `halloween_stop_motion` — stop-motion puppet film: felt, wire, visible stitching, tiny sets, tilt-shift depth |
| `button_eyed_other_world` | a too-perfect mirror-house whose garden blooms in the wrong colours, doors that open onto tunnels of violet light, a circus of trained mice, a moon that is a button | `halloween_stop_motion` (same craft, colder palette) |
| `land_of_the_dead_marigold` | a vertical city of stacked bridges lit by marigold petals and candles, calaca musicians (skeleton figures in embroidered charro suits), alebrije-style spirit creatures glowing neon, papel picado across every street | `halloween_marigold_folk` — painted Mexican folk-art animation: saturated marigold / magenta / teal, cut-paper edges, candle glow |
| `dia_de_muertos_ofrenda` | a real-world altar tradition: ofrendas with photos-turned-to-paintings, sugar skulls (calaveras), pan de muerto, cempasúchil paths to a cemetery of candlelit family picnics | `halloween_marigold_folk` (respectful, celebratory, never spooky) |
| `claymation_monster_lab` | a plasticine laboratory where the monsters are round, thumbprinted and delighted, beakers of glitter goo, a lightning rod made of a fork | `halloween_claymation` — clay stop-motion: thumbprints, matte plasticine sheen, chunky proportions |
| `paper_cutout_shadow_theater` | layered paper silhouettes lit from behind: a haunted forest in five planes, lantern-lit cut-paper bats, a ghost ship of folded card | `halloween_papercut` — layered paper-cut diorama with backlight and long shadows |
| `felted_pumpkin_patch` | a needle-felted pumpkin patch and scarecrow village in wool, yarn cobwebs, button moons | `halloween_felt` — needle-felt / yarn craft, macro lens softness |

Rules: describe the CRAFT (materials, joints, thumbprints, cut edges) and the WORLD, never the studio,
film, or character names (the lint gets a franchise-name block list: Jack Skellington, Sally, Oogie,
Coraline, Wybie, Miguel, Dante, Hector, Pixar, Disney, Burton, Laika, Selick — a row naming one is
dropped). Día de Muertos rows are celebratory and specific (ofrenda, cempasúchil, calaveras, pan de muerto,
papel picado), never "spooky". The engine needs ONE change: the taxonomy/mirror flag `sceneOnly` so the
registers test and the cast loaders skip these pools. Sequence: 2 pools as a taste test (stop-motion town +
land of the dead, 8 rows each, 2 looks) → renders → Kevin picks → the rest.

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

### 7b. The postcard on LARGE sources — the out-of-process backfill (2026-09-08, mig 479)

Kevin, on R37: "the 'happy halloween' stamp isn't stamping on some of them, is that just a blip in our test
script?" — no. 4 of 16 overlays failed with `postcard:halloween:fail:http_546`, all four on seedream-4
renders that persisted as 1440×2560 PNGs (~6 MB). **Why it is expensive:** the `holiday-postcard`
isolate decodes the whole source in pure JS (upng for PNG — 6 MB inflates to ~15 MB of RGBA), blends,
then re-encodes 3.7 MP of JPEG with a WASM encoder, inside an edge isolate with a small CPU / memory
budget; the 768×1344 JPEGs from flux-1.1-pro already take ~2 s, seedream's 2K PNGs are ~3.6× the pixels
with a slower decoder → the resource limit (546). Seedream is called at a hardcoded `size: '2K'`
(`_shared/generateImage.ts`), which is where the pixels come from.

**Mitigation (three layers, all live):**
1. **The isolate refuses oversize sources up front** — a header sniff (PNG IHDR / JPEG SOF, no decode);
   above `MAX_INLINE_PIXELS` (2.2 MP) it returns `deferred` immediately instead of dying mid-decode.
   Stamp `postcard:<key>:deferred:too_large:<w>x<h>`.
2. **The render marks the upload** — `uploads.postcard_pending = <holiday>` whenever the overlay was
   wanted but not applied (deferred, failed, or threw; a holiday with no artwork is not pending).
3. **The display-variant cron composites it with real compute** — `scripts/backfill-display-variants.js`
   (GitHub Actions, every 10 min, sharp) runs a postcard pass FIRST: same placement + scrim math as the
   edge function (`scripts/lib/postcardLayout.js`, parity-locked by
   `__tests__/lib/postcardLayoutParity.test.ts`), writes a NEW stamped HQ JPEG (q92) and a NEW display
   variant (new keys — the old ones may already be CDN-cached), updates `image_url` /
   `image_url_display`, appends `postcard:<key>:backfilled` to the generation log, clears the marker.
   Concurrency 3. The monitor counts `backfilled` as applied.

Proof: the 4 failed R37 uploads were marked pending and backfilled by one cron run (stamped HQ + display
verified by eye — overlay bottom-anchored with the scrim). A forced seedream-4 day-of render then took
the deferral path end to end (below). **Still open (Kevin's call):** seedream at `'1K'` for nightly
would cut every downstream step (swap, restore, persist, display, postcard) ~3.5×; flux-1.1-pro's
native output is 768×1344 anyway.

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
- 2026-09-07 22:40 UTC — **Step 0 DONE (deployed):** the couple cascade's solo rebuild now re-renders
  twice — attempt 1 on the configured rebuild model, attempt 2 on a DIFFERENT model
  (`_shared/soloRebuildModel.ts`, pure + tested: couple's model when it differs, else the policy's first
  fallback, else flux-1.1-pro) — before the pure scene; a cast dream that still ships with nobody in it
  stamps `SHIPPED_FACELESS` loud (`fallback_reasons`) for the day-of monitor. Each re-render remains gated
  by the guard's recover-budget floor. **Step 1 DONE (deployed):** migration 471 applied
  (`holidays.day_of_enabled`, `engine_config.day_of_evening_cutoff_hour` default 20); the reserved
  `halloween_day_of` pool (12 subs: costume_party_barn, masquerade_ball, trick_or_treat_street,
  haunted_hayride_party, pumpkin_carving_party, bonfire_night, witches_kitchen_party, haunted_house_queue,
  cemetery_lantern_picnic, halloween_parade, rooftop_skyline_party, monster_hotel_gala) in
  `scripts/lib/halloweenPools.js` (share 120 → 10 per sub per table) + the engine mirror with
  `dayOfPoolKey()` / `isDayOfSub()` / `filterDayOfRows()`; loaders `loadHolidayDual/Single/Scenes` take
  `dayOf: 'only' | 'exclude'` (default exclude — the window never draws day-of subs; a forced sub_theme
  bypasses); `holidays.day_of_enabled` rides through `mapHolidayCatalogRow` → `ActiveHoliday.dayOfEnabled`
  (Node mirror `scripts/lib/holidayWindow.js` kept in parity); a `halloween_day_of` action register
  (celebration beats, swap-safe); day-of lint rules (must name a light source; no gargoyle / statue /
  mask over the eyes / face paint; pumpkins never at head height); parity test now expects 15 pools.
  Tests: `holidayDayOf.test.ts`, `soloRebuildModel.test.ts`, register + parity + lint suites; full fast
  lane 2770 green; Deno typecheck green. NOT yet wired: the engine's day-of draw (step 2) — the window
  behaviour is unchanged tonight (the new pool has no rows yet, and even seeded it is excluded).
- 2026-09-07 23:05 UTC — **Step 2 DONE (deployed):** the hero is gone (`holidayHero.ts`, its loader,
  `force_hero_register/seed`, `qa-holiday-hero.js`, `simulate-holiday-hero.mjs`, `holidayHero.test.ts`
  deleted; `holiday_hero_prompts` table left for the final drop). One day-of branch for all three
  surfaces: `dayOfHoliday` = the active holiday whose peak is the date the render is FOR
  (`dayOfCalendarDate(now, users.timezone, engine_config.day_of_evening_cutoff_hour)` — Hawaii at 22:00
  Oct 30 → Oct 31; table-tested over 8 timezones × 3 runs, Node mirror in parity) AND
  `day_of_enabled`; cast paths draw `selectDayOfRows(day-of rows, window rows)` and apply the row through
  the same `applySceneRow(s, 'elegant', key)` call as a window holiday row; scene-only path the same at
  100 %; stamps `holiday_day_of:<key>:<day_of|fallback_window>:<sub>` / `holiday_day_of_empty` /
  `holiday_day_of_error`; the day-of still pre-rolls a CAST render when the user has a self photo
  (couple if +1) — the personal-dream rule kept from the hero era; postcard scope `day_of` composites on
  `dayOfApplied`; response field `day_of`. `force_day_of=<key>` now means "pretend today is the peak".
  Tests: date rule + selection in `holidayDayOf.test.ts`; full lane 2767 green; Deno green.
- 2026-09-07 23:00 UTC — **Step 3 IN PROGRESS:** `gen-holiday-archetypes.js --holiday halloween --pool
  halloween_day_of --to-share --kind all` seeding 12 subs × dual / single / scene to share 10 each
  (dry run: 3/3 clean; the lint's day-of rules run inside the generator). **Step 5 built early:**
  `scripts/check-holiday-day-of.js` (`--preflight` = pool rows per surface + catalog active /
  day_of_enabled / overlay asset; peak-night tally = day-of stamps vs postcards vs SHIPPED_FACELESS vs
  window fallbacks, exit 1 on any gap; `--if-peak` = quiet unless UTC today/yesterday is a peak) +
  `.github/workflows/holiday-day-of-monitor.yml` (daily 10:00 UTC). **Dress rehearsal passes:**
  `scripts/simulate-day-of.mjs --holiday halloween --year 2026` → all 8 timezones fire exactly once, on
  the Oct 31 08:00 UTC run (Honolulu via the 20:00 cutoff).
- 2026-09-07 23:30 UTC — **Step 3 DONE:** `halloween_day_of` seeded to share — 120 dual + 120 single +
  144 scene rows, all 12 subs covered (`check-holiday-day-of.js --preflight` ✓; dual-proximity scan 0
  violations). The generator's lint dropped ~110 candidates on the way in: scene over the 30-word cap
  (39), day-of "no light source" (17), face-bearing decor / mask over the eyes (9), person / pose / camera
  words in a scene (7) — the register held without a re-author. Sample rows: dressed barns with cider
  cauldrons, hats tipped back, capes, pumpkins along the floorboards. **Step 4 started:** QA round 1 =
  12 subs × couple + solo + 6 scene-only via `force_day_of` + `force_holiday_sub_theme` (album captions
  `🎃 DAY-OF R31 <sub>`), framing judge + sheet.
- 2026-09-07 23:50 UTC — **QA round 1 (30 renders, `r31-dayof-r1`):** 30/30 rendered, 30/30 drew from
  the reserved pool (every sub hit), 30/30 postcards, 0 faceless, 0 window fallbacks, 0 errors; couples
  11 first-try + 1 retry, 0 degrades; models 25 × flux-1.1-pro, 5 × flux-2-flex. Judge: setting
  "strong" on 29/30, 3 flags (a floating ghost with a pumpkin on trick_or_treat_street — on-theme, not a
  defect; the overlay on a garden solo — judge confusion; a barn scene whose open doors read as a portal).
  **The one real weakness: framing — 7 of 12 couples are BUST crops** with the party behind them. Not
  the closer roll (`dual_closer_pct` = 0) and not the pool (scenes are pure environment by lint): every
  day-of action beat lived at chest height (glass raised, pumpkin held, mask held), which anchors the
  crop to the torso on a night scene. **Round 2 variable:** the `halloween_day_of` register rewritten to
  FULL-BODY celebration beats (walking the street swinging candy buckets, stepping onto the wagon,
  crouching to light a pumpkin on the step, sitting on a hay bale with boots toward the fire). Target:
  ≤ 3 of 12 bust.
- 2026-09-08 00:05 UTC — **QA round 2 (18 renders, `r32-dayof-r2`, register variable):** couples bust
  crops **7 → 4 of 12**, three-quarter 1 → 6, full 2 → 1 (full-body beats did what they were meant to);
  solos tight 1 → 0 (3 of 6 full-figure). 18/18 from the pool with postcards, 0 faceless; 1 couple
  degraded to a solo (left face 0.0 twice = the residual model miss; the FIRST rebuild passed the
  probes, so the step-0 second attempt was not needed). Judge flags: "Chinese lanterns" on
  masquerade_ball (my sub hint said paper lanterns — taste call for Kevin), a stone angel on the
  cemetery solo (face-bearing figure the lint missed). **Fixes:** the day-of face-decor lint now also
  catches stone angels / angel monuments / cherubs / scarecrows / mannequins / effigies on CAST rows
  (scene-only rows are exempt — nothing to swap); 9 seeded cast rows disabled (5 dual, 4 single) and
  their subs topped back up to share under the widened rule; lint suite extended. **Round 3** = 12
  couples, no new variable (confirmation of the register change).
- 2026-09-08 00:20 UTC — **QA round 3 (12 couples, `r33-dayof-r3`, no new variable):** 11 rendered
  (1 transport failure), bust crops **2 of 11** (7 → 4 → 2 over the rounds — the target was ≤ 3),
  three-quarter 6, full 1, waist 2; 9 first-try + 1 retry, 0 degrades, 0 faceless, 11/11 from the pool
  with postcards; the judge's lone flag is again the overlay on a lit garden (not a defect). Pool after
  the lint widening + top-ups: 120 dual / 120 single / 144 scene, preflight clean.
  **Step 4 status: ready for Kevin's in-app review** — album captions `🎃 DAY-OF R31 <sub>` (round 1,
  chest-height beats), `R32` (full-body register), `R33` (confirmation). Hearts = the pull list.
  Remaining: Kevin's sign-off → (a) drop `holiday_hero_prompts` (migration), (b) the R5 proof:
  Thanksgiving catalog row + `thanksgiving_day_of` pool, (c) optional taste pass on sub hints (paper
  lanterns on masquerade_ball read "Chinese lantern" to the judge).
- 2026-09-08 — **Kevin's R34 review (12 couples, `🎃 DAY-OF R34`, gallery artifact dfe50486):** three
  asks — (1) "a few purple/green/black options … witch's cottage party, mad scientist lab party theme
  etc." → 4 subs with their OWN palette + objects (§5, 16 subs, `SHARE_DAY_OF` 120 → 160), seeded to
  share (26 + 32 + 32 + 32 rows; witches_cottage couple rows needed a SHORTER setting hint — Sonnet
  mirrors hint length and every couple row overshot the 30-word cap until the hint was cut), proximity
  scan 0 violations, preflight 160 / 160 / 192 across 16/16 subs; (2) "people just standing there …
  fun halloween activities and poses … natural … the poses in all of these are boring af" → register-
  owned STANCES (§5c: 9 activity stances + 23 activity beats; the generic "arms folded / leaning on a
  rail / perched" frames never reach a day-of couple; stamp `dual_stance:dayof_*`); (3) "people need to
  look more dressed up in costumes … fun, sexy, cool, scary … they have to find out what they dressed up
  as" → the COSTUME POOL + LOCK (§5b: 29 archetypes × 2 variants, `engine_config.day_of_costume_pct`
  mig 476, stamps `costume:<l>/<r>` + `costume_lock`).
  **QA round 4 (`🎃 DAY-OF R35`, 16 couples = 12 originals + 4 new subs, all three changes on):**
  16/16 shipped as COUPLES (R34: 9 of 12 — the 3 solo fallbacks all had one-low-one-high geometry, which
  the new stances forbid), 13 first-try + 3 second-attempt swaps, 0 faceless, 16/16 from the pool with
  postcards, judge BAD 0 / nonsense 0, framing three-quarter 6 · full 4 · waist 2 · bust 4 (bust 25 %,
  R33 was 2 of 11), every render a DISTINCT costume pair (werewolf/mummy, Red Riding Hood/pirate,
  Greek god/Egyptian queen, pumpkin queen/black cat …) with the verbatim attire in the prompt.
  **Defect found + fixed in-round:** 3 of the first 12 responses were cut off INSIDE the `action` field
  (the last JSON key) once the lock lengthened the wardrobe fields → parsed as `scene_action_fallback:
  missing` → a plain pool pose. Fix: Sonnet now writes the locked wardrobe fields as a 3-6-word
  reference (the code applies the exact text) and the slot call's output cap went 500 → 900 tokens;
  `mock_scare` reworded ("hands held out", Sonnet echoed "hands raised" → too_energetic). The 4 affected
  subs re-rendered after the deploy (R35 part C). **Open notes for Kevin:** `photography` rolled as the
  medium on one day-of couple (cemetery) — the 1.1-pro override library repaints it, but if the day-of
  should never roll photography that is a medium-ban on the day-of path (one line); the mad-scientist
  seed that rendered shows an ornate mirror frame (bust crop) — worth a scene-hint pass if it repeats.
- 2026-09-08 — **Costume pool v2 (`🎃 DAY-OF R36`, 16 couples, one per sub):** Kevin on R35: "costumes are
  kinda bland … less cliche? the roman garb, etc" → §5b rewritten (34 concepts; commit c7bede83).
  R36: 15/16 couples (1 solo fallback on witches_cottage_party under the mock-scare stance; 1 three-
  attempt swap on halloween_parade), 14 first-try, 0 faceless, every pair a distinct v2 concept (vampire
  hunter / reaper, ghost flapper / crow king, fallen angel / baroque skeleton, Art Deco she-devil / swamp
  creature, ghost groom / Medusa …). Gallery artifact dfe50486 rebuilt from R36. Awaiting Kevin's read.
- 2026-09-08 — **Day-of LOOKS live (`🎃 DAY-OF R37`, 16 couples, one per sub; commit 87ab9367, mig 478):**
  16/16 pinned a look (`day_of_look:` + matching `scene_medium:`), 16/16 uploads carry the look key as
  `dream_medium`, 16/16 override-exempt (`day_of_look_fragment:`), 0 photography. Shapes: 14 couples
  (13 first-try + 1 second attempt), 2 solo fallbacks (halloween_parade on classical oil, swamp_witch_bayou
  on watercolor ink — both rebuilt on flux-2-flex with the look's real fragment), 0 faceless; judge BAD 0,
  framing three-quarter 8 · full 3 · waist 1 · bust 4. Look spread (uniform pick): ornate ink 6, storybook
  gouache 3, classical oil 3, watercolor ink 2, digital painting 2. **Model note:** with the model policy
  still in SHADOW the legacy DreamSmart picker draws uniformly from the look's approved list — 9 renders
  on flux-1.1-pro, 5 on seedream-4 (all five first-try couples), 2 flex rebuilds. When the policy flips
  ON, flux-1.1-pro is primary and the look list acts as membership only; until then the day-of is not
  1.1-pro-first. Kevin's call: leave as-is until the flip (recommended; Halloween is 7 weeks out) or trim
  the look rows' `smart_dream_models` to 1.1-pro now (one data update, no code).
- 2026-09-08 — **Brand stamp LIVE (Kevin: "E · Painted-in brand (AI) i love this one"):** the Halloween
  overlay is now the AI-regenerated stamp briefed with the brand — "DreamBot" in a rounded bold face
  filled with the purple → pink → teal brand gradient, 2026 in the title's orange-gold, the lavender bot
  mascot peeking over the banner holding its star (`gen-holiday-postcard.mjs --styles` brief in the
  session log; concept page artifact 3f09a6b0 with 6 options). Set via `--set … --anchor bottom --width 70
  --margin 4` → `assets/holiday/halloween_postcard_1788839191039.png`; live edge-fn test on a clean render
  OK (2.7 s, 526×332 placed). **Consistency is by construction:** the stamp is ONE stored PNG pasted onto
  every day-of render at the same width/anchor — it is never regenerated per dream. Rollback = point
  `holidays.postcard_overlay_url` back at `assets/holiday/halloween_postcard_1788732509773.png`.
  New-holiday rule (§8): brief the lettering generator with the brand gradient + mascot line so every
  holiday's stamp carries the wordmark colours; the exact-wordmark composite (concept A/hybrid) remains
  the fallback if a regeneration will not hold the gradient.
- 2026-09-08 — **LAUNCH REVIEW (Kevin: "set this live and leave it … make sure all systems are go"):**
  config (`holidays_enabled` true, postcard scope `day_of`, cutoff 20, costume 100, `subject_first`,
  policy shadow), catalog (fall 9/15 → Thanksgiving flat 10 %, halloween 30-day window flat 10 %, peak
  10/31 with overlay + 6 looks + photography ban), date sweep Sept 8 → Dec 1 (fall from 9/15, halloween
  10/1-10/31, ★ day-of 10/31 only, nothing after 11/26), the delivery-correct simulation (every timezone
  fires once at its own local-4am enqueue on 10/31), full suite (142 suites / 2888 tests, tsc, deno,
  proximity 0, prettier), CI green on every push, preflight clean, monitor quiet on a non-peak day.
  **Three fixes made during the review:** (1) `holidays.fall.day_of_enabled` → false (its peak is
  Thanksgiving, which has no day-of pool / overlay yet — Thanksgiving gets its own row per §3.1; without
  this the 11/26 day-of would have fired empty); (2) the Halloween WINDOW had only 14 legacy scene-only
  rows (`holiday_scenes`, sub null) against Fall's 355 — seeded every window pool's scene rows to share
  (photo-less users and pure-scene rolls draw from these for 30 days); (3) seedream-4 removed from the six
  day-of looks' approved models (its 1440×2560 PNGs defer the postcard to the GitHub-throttled cron,
  ~hourly in practice) so the inline overlay applies on every day-of render; the cron backfill stays as
  the safety net. Live scenario renders (`🚀 LAUNCH CHECK`): fall window couple/solo → `holiday:fall`,
  no postcard (scope), no pumpkins; halloween window couple/solo → `holiday:halloween`, no postcard;
  day-of solo/couple → pool sub + look + costume + postcard; day-of scene-only → pool + postcard AND the
  photography ban fired live (`day_of_medium_ban:photography->illustration`); a natural nightly today →
  no holiday (nothing active until 9/15). Scene-only window renders re-verified with `force_pure_scene`.
- 2026-09-08 — **Day-of MODEL BAN (Kevin: "disable seedream-4 from the day-of models, we don't want to risk
  it"), mig 480:** `holidays.day_of_model_ban text[]` (default `{bytedance/seedream-4}` for every holiday)
  is merged into the nightly ban set for a day-of render (`mergeDayOfBans`, `_shared/dayOfLook.ts`) and fed
  to EVERY pick: the legacy face-swap pool, the dual steer, the scene pool, the scene gate, and the policy
  resolver (`resolveModel({ bans })` — a banned primary falls to the other primaries, then the fallbacks;
  a banned previous model on a retry falls to a primary; a fully-banned row still picks, never blank).
  Stamps: `day_of_model_ban:<models>` on every day-of render; `day_of_model_ban_hit:<a>-><b>` when the
  policy's pick was overridden. Live proof: a day-of scene render stamped `day_of_model_ban:seedream-4`,
  rendered on flux-1.1-pro, postcard ok. The six look rows also no longer list seedream (data, earlier today).
- 2026-09-08 — **SCENE-ONLY program (Kevin: "omg i love all those scene only halloween renders" / "all
  approved"):** (1) the fun register's 6 test renders passed Kevin (`🎃 FUN SCENES`); the scale-up (12 per
  sub × 51 subs across the 14 window pools) is seeding in the background; the plain rows from the morning
  get disabled once it lands. (2) The 240 accidental cast rows were audited (lint + near-duplicate check +
  proximity) and 239 re-enabled ("if we paid for those rows, we may as well use them"). (3) Stylized
  worlds taste test LIVE (commit 3299f5e7, mig 481): `stop_motion_halloween_town` and
  `land_of_the_dead_marigold`, 3 subs × 3 rows each, pinned looks `halloween_stop_motion` /
  `halloween_marigold_folk`; 6 renders (`🎃 STYLIZED WORLDS`) all took the pinned look
  (`holiday_scene_medium:<look>`) — marigold bridge city with candle-bearing cats, a petal spiral over a
  candlelit ofrenda cemetery, a pumpkin pyramid in a miniature town, a tilt-shift felt village with a
  skeleton guitarist. Fix shipped with it: a pinned scene look is now recorded as `uploads.dream_medium`
  (the card said "Photography" under a stop-motion scene). Next on Kevin's word: the remaining five
  stylized worlds (button-eyed other world, claymation lab, paper-cut shadow theater, felted patch, a
  separate Día de Muertos pool) and scaling these two to share.
- 2026-09-08 — **Stylized worlds batch 2 LIVE + fixes (Kevin: "these are all rad!"):** the remaining five
  pools seeded (commit 5c83ca98, mig 482: `halloween_claymation`, `halloween_papercut`, `halloween_felt`),
  10 renders (`🎃 STYLIZED WORLDS 2`) all on their pinned look. Kevin asked whether these were QA'd or
  one-shot — **one-shot**: every scene-only image is the first render of its seed; quality is structural
  (no swap constraints, lint-gated rows, the fun brief's focal event, pinned looks) plus a visual pass over
  ~26 renders. That pass found two defects, both fixed: (a) 7 rows invited rendered TEXT (the fun brief's
  own "bats carrying a banner") → rows disabled, the phrase removed from the brief, a NEVER-lettering line
  added, and lint §6.8 (`TEXT_INVITE`) drops such rows at seed time; (b) the claymation and felt looks read
  as ordinary renders → fragments rewritten to lead with the craft ("EVERYTHING sculpted from matte
  plasticine … thumbprints on every surface" / "EVERYTHING made of fuzzy felted wool") → re-renders read
  as clay and wool. The two taste-tested pools were scaled to share (45 rows each); the five new pools are
  scaling to share in the background; the fun-register scale-up (12/sub × 14 pools) is 8 of 14 pools in.
  **Open:** a proper judged QA round over the scene-only pools (framing rubric is cast-centric — needs a
  scene rubric: focal event present, no text, look fidelity), and retiring the plain rows once the
  scale-up lands.
