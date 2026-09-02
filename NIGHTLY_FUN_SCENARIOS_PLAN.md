# Nightly "Fun / Fantasy / Cool" Scenarios — Plan

**Goal (Kevin, 2026-08-10):** nightly dreams read too "straight" (couple/person standing
or sitting in a scene). Add A LOT more playful, fantastical, cool, funny, dynamic
scenarios — pirates, explorers, sword-and-sorcery heroes, space, superheroes, riding a
giant corgi, etc. Nothing is too crazy.

**The one hard constraint that shapes everything:** these are FACE-SWAP dreams, so the
person's real face must render BIG, frontal, waist-up. The fantasy is carried by
**costume + setting + a face-forward dynamic pose**, never by a wide action shot that
shrinks the face. The scenario authoring prompt already enforces this, so new content is
swap-safe by construction.

Research backing: the nightly pipeline (empty enqueue → render-time roll), the
`dual_scenarios`/`single_scenarios` tables, and the swap-safe framing envelope are mapped
in this session's research. Related: [[project_scenario_pose_medium_control]],
[[project_nightly_dreams_audit]], [[project_embodied_dream_art_character_dominant_brief]].

**Location-independent by design (KEY).** These scenarios do NOT use the user's saved
places. When a scenario fires, its own `scene` text REPLACES the user's location, iconic
anchor, and biome time/weather axes (`dualSpecialScene ?? iconicAnchor` / `?? userPlace`
in `nightly-dreams/index.ts`). So a "pirate galleon" scenario puts the person on a galleon
whether their saved places are Hawaii or nothing at all — same way the existing "neon
arcade / Gatsby ballroom" scenarios already ignore location. The ~60% location path
("you at your saved place") is separate and untouched; we add content to the ~40% scenario
path and dial that percentage up. NOTE: the biome-tagged action POSES (surfing→coastal)
are location-dependent, so dynamism inside these new scenes comes from the scenario's own
`pose_pool`/scene-matched pose, not the biome poses — keeping the whole thing place-free.

---

## The three levers

1. **Turn on the dormant dynamic action poses** (config only, no content, no deploy).
   27 dual + 26 single action poses are already built + QA'd (surfing, jetski, skiing,
   kayaking, mid-leap, swing-dance spin), all authored "face toward camera" with the
   head-gap enforced. They're dark: `engine_config.dual_action_pose_pct` /
   `single_action_pose_pct` = 0. Bumping to ~15-20% makes dreams less static instantly.
2. **Add the missing "cool/epic/adventure + funny" scenario buckets** (the main work).
   New scene+attire rows in `dual_scenarios` / `single_scenarios`, authored via the
   existing generation scripts. Live-loaded (no deploy), cullable with `disabled=true`.
3. **Dial up "fun vs. straight location"** — raise the scenario-pool percentages
   (`dual_scene_active_pct` etc.) so more dreams pull from scenarios vs. the ~60% plain
   location default.

---

## The 9 new buckets (MVP)

All seeded into the **`active` scenario pool** (empty today → isolated QA + zero live
impact until we enable its %). Each is authored for BOTH `dual_scenarios` and
`single_scenarios`. `medium_ban='photography'` on the fantastical ones (photoreal
dragons/aliens/giant animals read as creepy CGI, not whimsical).

| # | key | vibe | medium_ban | note |
|---|-----|------|-----------|------|
| 1 | `swashbuckler` | cool | — | pirates: galleon, treasure cove, dockside tavern |
| 2 | `artifact_hunter` | cool | — | Indiana-Jones: jungle temple, tomb, desert dig, rope bridge |
| 3 | `fantasy_hero` | epic | photography | sword & sorcery: castle gate, mage on a cliff, dragon's lair (dragon in BG) |
| 4 | `space_scifi` | cool | — | astronaut on a station, alien vista, starship bridge, rocket |
| 5 | `cyberpunk` | cool | — | neon rain-slick megacity, rooftop skyline, night market |
| 6 | `superhero` | fun | photography | caped heroes on a rooftop, comic-panel action (NO full cowls) |
| 7 | `expedition` | cool | — | mountaineer, arctic, safari jeep, reef diver |
| 8 | `champion` | fun | — | podium + medals, F1 driver, climbing wall, boxing corner |
| 9 | `giant_critter` | funny | photography | oversized friendly corgi/unicorn/baby dragon as backdrop |

**Swap-safe authoring rules baked into every bucket `desc`:**
- Costume + setting carry the fantasy; person stays waist-up, big face, toward camera.
- Creatures / villains / props stay in the BACKGROUND or to the side, never over faces.
- No full masks / helmets / hoods (superhero = cape + emblem, domino mask only if eyes
  fully visible). No face-bearing props (statues, other faces) that compete with the swap.
- Dual: no center-contact (kissing/hugging is auto-rewritten anyway) — side-by-side in costume.
- `giant_critter` is the one risky "mount" idea: author the creature as a huge BACKDROP
  behind a foreground waist-up couple, or "seated on it, waist-up, face forward." The wide
  "tiny hero riding across a valley" version would need the separate `epic_tiny` path (no
  face swap) — out of scope for these buckets.

---

## QA render harness (renders land under Kevin's account for QA)

The `active` pool being empty means `force_active` renders ONLY the new content.

```
POST https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams
Authorization: Bearer $DREAM_QUEUE_WORKER_TOKEN
Body (dual):   { "user_id": "<kevin>", "force_cast_role": "dual", "force_active": true }
Body (single): { "user_id": "<kevin>", "force_cast_role": "self", "force_single_active": true }
```

The render persists as an `uploads` row (is_public=false) under the account → shows in the
app feed / album for QA. A reusable script `scripts/qa-nightly-fun.js` fires N of these.
Each render costs ~$0.03 and ~20-30s.

---

## Rollout (MVP-25 loop, test as we go)

**Phase 0 — dynamic poses (config, then QA):** render a few `force_active_pose` samples
under Kevin's account; if good, enable `*_action_pose_pct` to ~15% globally.

**Phase 1 — per bucket, one at a time:**
1. Add the bucket `desc` to `scripts/generate-dual-scenarios.js` + `generate-single-scenarios.js`
   under a new `ACTIVE_BUCKETS` array (pool='active').
2. `--dry-run` to preview the 25 Sonnet-authored scene/attire pairs; sanity-check.
3. Insert **25** each (dual + single) into the `active` pool. (HARD RULE: 25 first, never
   scale to 200+ before Kevin's sign-off.)
4. Render a sample (~6-8 dual + ~3-4 single) under Kevin's account.
5. Kevin QAs in the app; flag winners/duds.

**Phase 2 — iterate:** tune the bucket `desc` from QA feedback, `disabled=true` the misses,
re-render. Repeat until the bucket lands.

**Phase 3 — scale + enable:** once a bucket passes sign-off, append to ~100-200, then
enable the `active` pool percentages + the action-pose pct so real users start seeing it.

**Hard rules honored:** seed 25 then scale after sign-off; post test renders to the account
(never /tmp); never unscoped-delete the pools (use `disabled=true`); the authoring prompt
keeps couples side-by-side (no proximity breakage).

---

## Option B — generative LOCATION-fit actions (2026-08-10, the retrofit)

Kevin's follow-up: retrofit the dynamic-pose energy across ALL nightly dreams, not
just scenarios. Finding from a `force_active_pose` sample: the biome ACTIVE pose pool
IS biome-gated (coastal→dive fired) but its coverage is THIN — most biomes (urban,
volcanic, plantation, rooftop, desert) have no matching pose → fall back to standing.

**The fix (shipped, dark):** `_shared/locationActionBeat.ts` generates a swap-safe
action that fits the EXACT place, on the fly (Sonnet, ~90 tokens). The nightly slot
pipeline already writes the scene to fit the `action` string, so location → fitting
action → matching scene is coherent by construction. Covers EVERY place, no library to
maintain. Authored inside the swap-safe envelope (waist-up, props at chest level or
lower, no face words/occlusion, dual = clear head gap, no center-contact); a word-filter
drops any unsafe beat → classic-pose fallback (fail-safe).

- Wired into `nightly-dreams` plain-location path ONLY (dual + solo). Precedence:
  biome active pose ?? **location action** ?? classic pose. Never touches the shared
  slot pipeline that create/first-dream use.
- Behind `engine_config.location_action_pct` (migration 433, **default 0**) + a
  `force_location_action` QA flag. QA'd 3/3 on Kevin's account (snorkel lagoon, blowhole,
  swamp) — all location-perfect, swap-safe, faces clear. Enable pct (~20-30%) after
  Kevin's eyeball.

## Progress

- [~] **`rich_famous` — "Lifestyles of the Rich and Famous"** (2026-08-26, Kevin): NEW bucket in the
      **ELEGANT** pool. Cool/MODERN aspirational luxury (real-badge supercars — Ferrari/Lambo/McLaren/
      Porsche/Rolls/Bentley/Aston/G-Wagon; superyacht decks; Amalfi/Mykonos infinity villas; private-jet
      airstairs; glass penthouses; modern beach houses). NOT gaudy/old-money. Seeded **25 dual + 25 single**
      (`--pool elegant --per 25 --buckets rich_famous`), proximity scan 0 violations. QA R1: Amalfi
      infinity-pool couple 4.7 (nails it), watercolor jet 4.0; **film_noir FAILED** (B&W 1940s town, no cast
      — vintage prior overrode modern luxury) → set **`medium_ban`** on all 50 rows for the era-clash
      mediums (film_noir/vintage_film/heirloom/old_west/ukiyo_e/ancient_epic/maritime_oil*/gothic*/steampunk/
      8bit/star_oil). R2 verifying. Then: Kevin sign-off → scale to 100/100 (elegant pool is already
      live-pct'd, so it rotates in on scale). LESSON: modern-luxury bucket needs the vintage/period mediums
      banned even though the global medium×theme restriction was scrapped.
- [x] Phase 0: dynamic-pose samples (found biome-pool coverage gap → built Option B)
- [x] **Option B**: generative location-fit actions (built, QA'd 3/3, dark at pct 0)
- [x] `swashbuckler` (seed 25 dual+single, QA'd — action authoring fix landed)
- [x] `artifact_hunter` (seed 25 dual+single, action beats verified)
- [x] `fantasy_hero` (seed 25; medium_ban=photography)
- [x] `space_scifi` (seed 25)
- [x] `cyberpunk` (seed 25)
- [x] `superhero` (seed 25; medium_ban=photography)
- [x] `expedition` (seed 25)
- [x] `champion` (seed 25)
- [x] `giant_critter` (seed 25; medium_ban=photography)
- [x] Kevin QA of all 9 buckets (renders posted to his account — signed off "all look good")
- [x] **medium_ban fix**: wired `medium_ban`/`medium_key` into the PRODUCTION dual-active +
      solo-active branches (commit ff4b50e6) so fantasy_hero/superhero/giant_critter render
      painterly, not photoreal, once live.
- [x] **Phase 3 — LIVE (2026-08-10):** scaled all 9 buckets to **100 dual + 100 single** each
      (per-bucket sequential seeding; the big `--per 150` concurrent runs hung on Sonnet
      rate-limits — lesson: seed per-bucket, one process at a time). Proximity scan 0
      violations. Set `engine_config`: **dual_scene_active_pct 20, single_scene_active_pct 20,
      location_action_pct 75**.

## LIVE state of the active pool (2026-08-10)

The active pool was NOT empty (the old plan note was stale): it already held **526
legacy `category=null` rows from 2026-07-09** — recreational dynamic-action scenes
(go-karts, bumper cars, bowling, batting cages, climbing gym, trampoline, arcade dance),
swap-safe and on-theme. So the live active pool = **900 new themed-adventure rows (9
buckets × 100) + 526 legacy recreational = 1426 dual + 1426 single**, all proximity-clean.

Final nightly mix (both single + dual face-swap dreams): goofy 15 / elegant 15 / **active
30** / location 40, and 75% of location dreams get an Option B action (Kevin nudged active
20→30 on 2026-08-10 after seeing the live mix — "nudge funner"). All live-tunable via
`engine_config` (no build). To pull a bucket: `disabled=true` scoped by category. The legacy
recreational rows can be culled the same way (`category is null`) if we ever want
themed-only.

---


## Dreamy-action buckets (2026-09-02, Kevin: "fun, dynamic, cool, dreamy, lush")

Four new active-pool buckets, LIVE at ~100 dual + ~100 single each (Kevin QA'd 3/3
solo renders per pool; static-seed problem root-caused + fixed):
- `sky_romance` — balloons over valleys, ferris crest, seaplane docks, paraglide landings
- `wild_rides` — horseback surf gallop, husky sleds, camel dunes, vespas, retro convertibles
- `water_bliss` — waterfall plunge pools, turtle snorkels, lantern canoes, snowy hot springs
- `glow_nights` — floating-lantern skies, rooftop fireworks, bioluminescent shores, night carnivals

**NEW MANDATORY STEP — the ACTION SCRUB (post-seed AND post-scale).** Sonnet's
authoring leans static: at scale, 106/300 fresh solo seeds led with standing/
leaning/perched and 30 more buried passivity mid-sentence ("watching fireworks"),
which renders as the exact standing-around Kevin flagged. After EVERY seeding run:
1. Leading-verb scan+reword (solo): scenes must LEAD with a physical mid-action verb.
2. Anywhere-passivity scan+reword (solo + dual): no sit/seated/watching/gazing/admiring
   anywhere. (Watch false positives: "sit-on-top kayak" is action.)
3. Rewrites must keep the face-forward + dual head-gap language; proximity scan after.
4. Wide-action trap: reword any "leap off / mid-air across a valley" beat to a
   held-at-the-edge launch pose (mid-air wide shots shrink faces below swap floor).
Culture-specific festival seeds (Diwali, Obon) drift into ethnic costume + rendered
text — disable on sight; keep festivals generic ("floating-lantern night").

Also fixed engine-side: `force_scene_category` now implies a face-swap CAST
composition (commit c00d82b7) — before, ~1/3 of forced-bucket QA renders rolled
pure_scene and emitted unpopulated landscapes.

Scale-run gotchas re-confirmed: background seeding jobs die ~30min (chunk per
bucket); a "dead-looking" chunk can still insert (verify by COUNT, not by log) —
we over-scaled water_bliss to 175 that way; trimmed by disabling newest-75 (never
delete). Near-dupe pass after scale: ~9 dupes disabled via 60-char scene key.

## Playbook — adding or tuning fun scenarios (for future agents)

**Where things live**
- Bucket definitions: `ACTIVE_BUCKETS` in BOTH `scripts/generate-dual-scenarios.js` and
  `scripts/generate-single-scenarios.js` (keep them in sync — dual + single are separate
  pools/tables `dual_scenarios` / `single_scenarios`, `pool='active'`, keyed by `category`).
- Option B location actions: `supabase/functions/_shared/locationActionBeat.ts` (the
  swap-safe action generator) + the wiring in `nightly-dreams/index.ts` (the `locationAction`
  block on the plain-location path; precedence `activePose ?? locationAction ?? classic`).
- The roll that decides scenario vs location: `nightly-dreams/index.ts` ~line 1249+ (dual)
  / ~1291+ (solo). Composition roll (dual vs solo vs scene): `_shared/chaosTier.ts:rollNightlyDreamType`.
- Tuning knobs: `engine_config` (`dual_scene_active_pct`, `single_scene_active_pct`,
  `dual/single_scene_goofy_pct`, `..._elegant_pct`, `location_action_pct`), read live w/ 60s TTL.

**To add a NEW bucket** (do dual + single together):
1. Add `{ key, label, desc, mediumBan? }` to `ACTIVE_BUCKETS` in BOTH scripts. The `desc` is
   the whole spec — describe setting + costume; the generator bakes in the swap-safe MID-ACTION
   + handheld-prop authoring (chest level, faces clear). Set `mediumBan: 'photography'` for
   anything that reads creepy in photoreal (fantasy/creatures/superheroes → painterly instead).
2. MVP-25 first (HARD RULE): `node scripts/generate-dual-scenarios.js --pool active --buckets
   <key> --per 25` and the single twin. Then QA:
   `node scripts/qa-nightly-fun.js --bucket <key> --cast dual` (and `--cast self`) → renders
   land under Kevin's account (worker-token path). Kevin signs off on the LOOK (his call).
3. **POST-SEED HOOK (HARD RULE):** `node scripts/scan-dual-faceswap-proximity.js` must exit 0
   before shipping any dual pool — reword flagged couple poses (see the CLAUDE.md rule).
4. Scale after sign-off (see below), then it's live at the current `active_pct`.

## Lifestyles of the Rich & Famous (`rich_famous`) — LIVE-READY, admin-gated (2026-08-26)

A modern-luxury general-purpose bucket ("lifestyles of the rich and famous"): exotic supercars
(real badges — Ferrari / Lamborghini / McLaren / Porsche 911 / Rolls / Bentley / Aston / G-Wagon),
superyachts, Amalfi / Mykonos / Malibu infinity-pool villas, private-jet airstairs, glass
penthouses. Cool, never gaudy or "cheesy luxury." 25 dual + 25 single seeded (QA size).

Two lessons baked in — both are reusable patterns for any REAL-WORLD-MODERN bucket:

1. **Per-pool MEDIUM ban.** The nightly cast medium pool skews painterly/vintage; those drift a
   supercar into a whimsical mountain scene or a 1940s town. `medium_ban` right-sized to leave
   only the clean-modern renderers: **comics, photography, illustration**
   (`glamour,double_exposure,canvas,watercolor,pencil,film_noir,vintage_film,heirloom` banned).
   Verified: 12/12 QA renders rolled only the 3 allowed mediums; luxury reads clean (Porsche on
   wet neon cobblestone 4.7, Lambo Urus + rosé in Joshua Tree 4.6). This is the "medium
   restriction per pool" optimization — apply it to any bucket whose subject is medium-sensitive.

2. **SINGLE bucket → `pool='active'`, DUAL → `pool='elegant'`.** The dual pool draws a clean
   partner pose; the SINGLE elegant path layers the default CANDID pool, which has domestic beats
   (feeding ducks / pigeons / carp) that render absurd on a superyacht. Fix: the luxury scenes
   already bake in the stance ("leaning on the hood", "on the bow", "standing at the rail"), so
   the SINGLE rows live in the **active** pool — `soloActiveScene=true` makes the scene text drive
   the pose ("caught mid-action... face toward the camera"), no candid layered. Re-render: 6/6
   solo now show confident scene-locked luxury stances (penthouse sofa + whiskey 4.7, Dubai rail
   4.6, jet airstair 4.5), zero domestic poses. **Rule of thumb:** a bucket whose scenes carry
   their own stance belongs in `active`; a bucket that wants a separate posed look stays `elegant`.

Gen-script wiring: `rich_famous` is in **ACTIVE_BUCKETS** in `generate-single-scenarios.js` and in
the dual script's normal bucket list (`generate-dual-scenarios.js`), both with the `mediumBan`
above. Scale (post sign-off): `--pool active --buckets rich_famous` (single) + `--buckets
rich_famous` (dual), `--per 75`.

**GO-LIVE requires `engine_config.single_scene_active_pct > 0`** (the active SOLO branch is
currently dark; dual active is already live). Set it alongside enabling the bucket, or single
rich_famous never surfaces in solo rotation. Whole bucket is `admin_only`/dark until Kevin signs
off + it's scaled 25→~100.

**To SCALE a bucket to production size** — seed **per-bucket, ONE process at a time**:
```
for b in bucketA bucketB; do
  node scripts/generate-dual-scenarios.js  --pool active --buckets "$b" --per 75 2>&1 | grep inserted
  node scripts/generate-single-scenarios.js --pool active --buckets "$b" --per 50 2>&1 | grep inserted
done
```
`--per N` = N NEW rows (append-safe, dedups vs existing). We run ~100/bucket. **Do NOT** run a
big `--per 150` across all buckets concurrently — that HANGS on Sonnet rate-limits (0% CPU,
insert-is-at-end so a hang loses the whole run). Gotchas that bit us: `for b in $VAR` does NOT
word-split in zsh (use a literal list); and `.select('category')` hits the PostgREST 1000-row
cap — count per-category with `count:'exact',head:true`.

**To TUNE the mix** (no build, ~60s to propagate): patch `engine_config` (service key).
`active_pct` up → more fun, location shrinks. `location_action_pct` → how often location dreams
get an Option B action. `disabled=true where pool='active' and category='<key>'` pulls a bucket;
`... and category is null` pulls the legacy recreational scenes.

**To VERIFY it's working** — the render stamps `ai_generation_log.fallback_reasons` (join by
`upload_id` or `user_id`): look for `location_action` (Option B fired), `active_scenario` /
`active_scenario_solo` (a fun bucket fired), `forced_scene_category:<k>:<pool>` (a QA force).
`qa-nightly-fun.js --natural --count N` fires REAL nightly rolls (no forcing) to eyeball the
live variety; `--bucket <k>` forces one bucket; `--locfit` forces Option B; `--pose` forces the
biome pose pool.

**Swap-safety is non-negotiable** — every couple pose needs a clear gap between heads (dual swap
can't split touching faces), props at chest level or lower, faces never occluded. The generation
prompt + `locationActionBeat.ts` word-filter enforce this; the proximity scan is the backstop.
See CLAUDE.md's POST-SEED HOOK + face-swap rules.
