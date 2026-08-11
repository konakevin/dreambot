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
- [ ] Kevin QA of the 8 new buckets (renders posted to his account)
- [ ] **Before Phase 3**: wire `medium_ban`/`medium_key` into the PRODUCTION active-pool
      branches (lines ~1268-1277 / ~1323-1331) — currently only the QA force path applies
      them, so fantasy_hero/superhero/giant_critter would render photoreal until fixed.
- [ ] Phase 3: scale winners to ~150-200 + enable `*_scene_active_pct`, `location_action_pct`,
      and (optionally) `*_action_pose_pct` live
