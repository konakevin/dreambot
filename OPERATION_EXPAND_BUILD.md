# Operation Expand Dreams — MASTER IMPLEMENTATION PLAN

<!-- ============================================================================ -->
## ▶ RESUME HERE (read first on any new session / after compaction)

**ACTIVE: autonomous OVERNIGHT run** (Kevin went to bed 2026-08-24; see
[[project_expand_dreams_autonomous_run]]). Task: seed + QA **every new location category**, then it's ready
for Kevin's review tomorrow.

**THE RULES (do not violate):**
1. Per category: seed a QA-size batch → **up to 3 QA rounds, stop early if the test batch averages ≥4.5/5.**
2. **Post every test render to Kevin's PRIVATE Dreams album** (uid `eab700d8-f11a-4f47-a3a1-addda6fb67ec`)
   via `qa-location.js`. Grade each render myself (download + view) vs the integration+cinema bar.
3. **DO NOT GO LIVE. Everything stays `admin_only=true` dark. Never set `admin_only=false` in this run.**
4. Full quality per location (autonomous ≠ rushed). Can't reach 4.5 in 3 rounds → 🚩 Return-to, move on.
5. Keep this doc's progress board + per-location tables current as each item moves.

**HOW TO RESUME (post-compaction procedure):**
1. Read this block + the Progress board below to see which category is in flight.
2. Check in-flight background jobs / query DB for seed state:
   `node -e` on `location_cards` (biome_config present?) + `location_iconic_spots` per `location_key`.
3. Continue the per-category loop (bottom of doc): recipes → `seed-category.mjs` → `qa-location.js` →
   grade → tweak → next. Categories left = any row on the board not ✅/🟢/🚩.

**⏱ LIVE STATE (update this line as work moves):**
> 2026-08-24 night: **Through Time ✅ DONE R1** — all 9 new locs 4.5+ (victorian london, ancient rome,
> viking, medieval, renaissance venice, pirate cove, ancient greece, silk road, 1950s americana) + slice;
> only 1920s speakeasy borderline 4.0 (garbled signage). All cast swaps clean, zero fallback. Dark.
> **NOW: Old West** — recipes done, seed chained (job bc3ndyi3j) → then QA. QUEUE after: Heroes &
> Adventure → Whimsical & Fun expand → Landmarks & Wonders → finish dark High Fantasy/Sci-Fi/Gothic QA.
> Cleanup pass at end: 1920s speakeasy signage.
<!-- ============================================================================ -->

**THE single source of truth for all remaining Operation Expand Dreams work.** Following this doc top to
bottom = complete implementation. Update it as every item moves.

- **Why** (strategy, category rationale, ~90 ideas): `OPERATION_DREAM_LOCATION_EXPANSION.md`
- **How** (the 10/10 seed authoring pipeline + rules): `LOCATION_SEED_PLAYBOOK.md`
- **What + status** (this doc). *(`LOCATION_EXPANSION_CHECKLIST.md` is now SUPERSEDED by this doc.)*
- **Working mode:** autonomous, no per-category approval gates, FULL quality bar per location
  ([[project_expand_dreams_autonomous_run]]).

---

## ✅ Definition of DONE (per location, then per category)
A location is DONE when ALL are true:
1. **Recipe** authored (`generate-full-location-card.js`).
2. **Seeded** to the playbook bar (`seed-category.mjs`): valid `biome_config` + WARDROBE, ≥15 curated
   cast spots (medium/intimate), recognizable scene spots (wide/medium), imagined flag correct.
3. **QA ≥4.5** across cast (self+plus_one) + scene, over ≤3 rounds — OR flagged 🚩 Return-to.
4. **Thumbnail** set (`thumbnail_url`).
A category is DONE when all its locations are DONE, its **`SECTION_META` entry exists** in
`LocationPickerStep.tsx`, and it's **flipped live** (`admin_only=false`) — or its failures are on Return-to.

---

## 📊 Progress board (update every move)
Status: ⬜ not started · 🔨 seeding · 🔎 QA · ✅ passed (≥4.5, dark) · 🟢 live · 🚩 return-to

| Category | picker_category | SECTION_META | # | Status |
|---|---|---|---|---|
| Cities & Countries | iconic_cities | ✅ | 26 | 🟢 live |
| Epic Nature | epic_nature | ✅ | 16 | 🟢 live |
| Tropical Escapes | tropical | ✅ | 6 | 🟢 live |
| Fantasy Worlds | fantasy_worlds | ✅ | 7 | 🟢 live |
| High Fantasy | high_fantasy | ✅ | 9 | 🔎 QA (slice ~4.5) |
| Sci-Fi & Space | scifi_space | ✅ | 5 | 🔎 QA (2 ✅) |
| Gothic & Haunted | gothic_haunted | ✅ | 4 | 🔎 QA |
| Whimsical & Fun | whimsical_fun | ✅ | 3→9 | 🔎 QA + expand |
| **Through Time** | through_time | ❌ TODO | 12 | ✅ passed R1 (dark) — all 4.5+ except 1920s speakeasy 4.0 |
| Old West | old_west | ❌ TODO | 8 | 🔨 seeding |
| Heroes & Adventure | heroes_adventure | ❌ TODO | 9 | ⬜ |
| Landmarks & Wonders | landmarks_wonders | ❌ TODO (real tier) | 8 | ⬜ |

---

## Work breakdown (per-location status)
Cols: R=recipe · S=seeded · Q=QA grade · T=thumb · St=status(⬜/🔎/✅/🚩)

### High Fantasy (`high_fantasy`) — dark, finish QA + flip
| Location | R | S | Q | T | St |
|---|---|---|---|---|---|
| ancient elven city | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| dwarven fortress | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| dragons keep | ✅ | ✅ | ~4.5 (thin scene DNA) | ✅ | 🔎 |
| crystal caverns | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| enchanted forest | ✅ | ✅ | — | ✅ | ⬜ |
| floating sky islands | ✅ | ✅ | — | ✅ | ⬜ |
| underwater city atlantis | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| mermaid lagoon | ✅ | ✅ | ~4.5 | ❌ | 🔎 |
| high fantasy (umbrella) | ✅ | ✅ | ⚠️ goofy scene | ✅ | 🔎 |

### Sci-Fi & Space (`scifi_space`)
| alien planet | ✅ | ✅ | 4.5 | ✅ | ✅ |
| cyberpunk megacity | ✅ | ✅ | 4.75 | ✅ | ✅ |
| mars colony | ✅ | ✅ | — | ✅ | ⬜ |
| space station | ✅ | ✅ | — | ✅ | ⬜ |
| sci-fi worlds (umbrella) | ✅ | ✅ | — | ✅ | ⬜ |

### Gothic & Haunted (`gothic_haunted`)
| transylvania | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| haunted cathedral | ✅ | ✅ | — | ✅ | ⬜ |
| haunted castle | ✅ | ✅ | — | ❌ | ⬜ |
| gothic realm (umbrella) | ✅ | ✅ | — | ✅ | ⬜ |

### Whimsical & Fun (`whimsical_fun`) — 3 seeded + build 6
| princess garden castle | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| rose garden palace | ✅ | ✅ | ~4.5 | ❌ | 🔎 |
| fairy cottage | ✅ | ✅ | — | ✅ | ⬜ |
| kawaii candy land | ⬜ | ⬜ | — | ⬜ | ⬜ |
| unicorn meadow | ⬜ | ⬜ | — | ⬜ | ⬜ |
| cottagecore cottage | ⬜ | ⬜ | — | ⬜ | ⬜ |
| pastel dreamscape | ⬜ | ⬜ | — | ⬜ | ⬜ |
| fairy tea party | ⬜ | ⬜ | — | ⬜ | ⬜ |
| enchanted toy shop | ⬜ | ⬜ | — | ⬜ | ⬜ |

### Through Time (`through_time`) — imagined=false (photography OK)
| ancient egypt | ✅ | ✅ | 4.5 (R2) | ✅ | ✅ |
| feudal japan | ✅ | ✅ | 4.5 (R2) | ✅ | ✅ |
| 1920s speakeasy | ✅ | ✅ | 4.0 (garbled signage) | ✅ | 🔎 |
| victorian london | ✅ | 🔨 | — | ⬜ | 🔨 |
| ancient rome | ✅ | 🔨 | — | ⬜ | 🔨 |
| viking longhouse | ✅ | 🔨 | — | ⬜ | 🔨 |
| medieval village | ✅ | 🔨 | — | ⬜ | 🔨 |
| renaissance venice | 🔨 | 🔨 | — | ⬜ | 🔨 |
| pirate cove | ⬜ | 🔨 | — | ⬜ | 🔨 |
| ancient greece | ⬜ | 🔨 | — | ⬜ | 🔨 |
| silk road | ⬜ | 🔨 | — | ⬜ | 🔨 |
| 1950s americana | ⬜ | 🔨 | — | ⬜ | 🔨 |

### Old West (`old_west`) — build from scratch, imagined=false
frontier town · saloon interior · desert canyon standoff · gold rush camp · cattle ranch golden hour ·
steam train depot · monument valley trail · border cantina — all ⬜

### Heroes & Adventure (`heroes_adventure`) — build, imagined=false (real-ish, some imagined)
superhero city rooftop · spy lair secret hq · epic battlefield · mountain summit expedition ·
race track garage · deep-sea research sub · jungle temple expedition · carrier flight deck ·
gladiator arena — all ⬜

### Landmarks & Wonders (`landmarks_wonders`) — REAL tier, nightly-eligible, revive graveyard
taj mahal · petra · machu picchu · great wall of china · angkor wat · christ the redeemer ·
sahara dunes · northern lights glacier — all ⬜

---

## Cross-cutting tasks (don't forget these)
- [ ] **SECTION_META entries** in `components/onboarding/LocationPickerStep.tsx` for the new categories:
      `through_time`, `old_west`, `heroes_adventure`, `landmarks_wonders` (real tier). *(The 4 imagined
      ones — high_fantasy/scifi_space/gothic_haunted/whimsical_fun — are already added.)*
- [ ] **Thumbnails** for cards missing them: haunted castle, mermaid lagoon, rose garden palace + every
      new build (`generate-location-thumbnails.js`).
- [ ] **Flip live** per section (`UPDATE location_cards SET admin_only=false WHERE picker_category='…'`)
      once the section clears 4.5.
- [ ] **Landmarks nightly-eligibility** — real landmarks may enter nightly (unlike imagined); verify.
- [ ] Watch: profile-face on action beats (monitor at scale; nudge only if frequent).

## 🚩 Return-to (couldn't hit 4.5 after 3 rounds)
_(none yet)_

---

## ⚙️ Ops constraint (learned 2026-08-24)
Background jobs get **killed at ~30 min**. So: generate recipes in batches of **≤5 locations**, render QA
in batches of **≤4-5 locations** (~15-20 min each). Seeds (`seed-category.mjs`) for ~8-9 locations run
~15 min and complete fine as one job. **Do NOT use chained `until`-wait loops** — if the upstream job is
killed, the waiter hangs until it's killed too. Instead: kick a batch, wait for ITS completion
notification, then start the next stage as its own job.

## Per-category loop (the process I follow)
1. `generate-full-location-card.js "<loc>" ...` (recipes).
2. `seed-category.mjs <picker_category> <imagined> <sortStart> "loc=biome" ...` (full seed).
3. `generate-location-thumbnails.js` for the new locs.
4. 3-round QA: `qa-location.js --location "<loc>"` → post to Kevin's Dreams album → grade each render vs
   the integration+cinema 4.5 bar → fix the SPECIFIC cause → re-render. Cap 3 rounds → else 🚩 Return-to.
5. Add `SECTION_META` entry if new category. Flip `admin_only=false` when the section passes.
6. Update this doc + move to next category. No approval gate.

## Locked decisions (2026-08-24)
- Target ~120 (broad). Nightly scope = Create-first (imagined Create-only; real Landmarks may go nightly).
- Neutral section labels (tweakable), no gender in UI. Revive graveyard recipes where they exist.
- Autonomous, full quality bar per location, flag failures rather than stall.

## Build log
| 2026-08-24 | Slice (egypt/japan/speakeasy) | seed → R1 (5/6 cast @4.5, 1 misfire) → engine fix (dropped enviro_wide) + eligibility rules → R2 ✅ | Kevin: "looks good, keep going" |
| 2026-08-24 | Engine (prod) | dropped enviro_wide from solo-cast comp (was silently scene-only-ing ~10% of cast nightlies); wardrobe de-burgundy; imagined medium affinity | committed 615cd7b2 |
| 2026-08-24 | Through Time (9) | recipes + seed-category.mjs | 🔨 running |
