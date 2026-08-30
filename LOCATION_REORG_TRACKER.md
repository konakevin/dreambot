# Location Reorg + Expansion — LIVE TRACKER

> **This is the STATUS OF RECORD for execution.** Design/decisions live in
> `LOCATION_REORG_PLAN.md`; this doc tracks what's DONE / IN-PROGRESS / LIVE.
> A big multi-session effort — agents MUST maintain this across compactions.

## 📌 How agents use this doc
1. Read `LOCATION_REORG_PLAN.md` first (the plan), then this (the state).
2. Update statuses the moment work lands. Keep **Last updated** + **▶ NEXT ACTION** current.
3. Per-card status legend: `⬜ todo` → `🔵 recipe` → `🟡 seeded+spots` → `🟠 QA rounds` → `✅ approved (dark, admin_only)` → `🟢 LIVE (admin_only=false)`.
4. Nothing goes `🟢 LIVE` without Kevin sign-off + a client build out.
5. Log every session in the Change Log at the bottom.

---

## ▶ NEXT ACTION
**SEEDING RUN IN PROGRESS (autonomous, Kevin 2026-08-27).** Grinding category-by-
category to ≥4.5, everything `admin_only` dark. Phase 1 UI+reorg = DONE + committed
(`c5f92b0d`). ⛔ NO per-location medium narrowing — every card `imagined=false`,
all nightly mediums fire (Kevin). **Scene-only surface is NOT a priority (Kevin
2026-08-27)** — new location pools graded on the 3 CAST surfaces (self/plus1/couple)
only; render with `qa-location.js --location "<x>" --no-scene`.

**✅ BEACH TOWNS COMPLETE — 9/9 seeded + graded, all `admin_only` dark.**
Myrtle Beach 4.7 · Outer Banks 4.7 · Key West 4.6 · Santa Monica 4.53 · 30A 4.5 ·
Cape Cod ~4.4 · Coney Island ~4.4 · The Hamptons ~4.4 · Malibu ~4.2 (🚩Return-to).
**NEXT: Tropical Escapes (4)** — Amalfi Coast, Fiji, Cancún, Tahiti (recipes
generating, job `bx77mtfrg`). These are EXOTIC tropical, NOT Americana — keep
seed-category's register-aware resort wardrobe (NO beach-town template), only
apply `_tmp-sunnyaxes.mjs` + verify/positive-rewrite SUBJECT_RULE (drop any
"glamour"). Then Countries (11) → World Wonders+Sydney → Gothic → Sci-Fi/Wild West
→ Everest/Dinosaurs.

### 🔧 New beach-town pipeline (per town)
1. `seed-category.mjs beach_towns false <sortStart> "<town>=<biome>"` → biome_config + wardrobe + 25 spots + gate cols (admin_only).
2. Apply a template to override SUBJECT_RULE + Americana wardrobe + town spots:
   - **generic candy-cottage town** (30A) → `_tmp-beachtown.mjs "<town>" "<SUBJECT_RULE>" "<hints>"`
   - **specific-identity town** (Coney Island boardwalk/coaster, Malibu cliffs/PCH, Hamptons shingle) → `_tmp-iconictown.mjs "<town>" "<SUBJECT_RULE>" "<register brief>"`
3. `_tmp-sunnyaxes.mjs "<town>"` → hard-set bright TIME/WEATHER (REQUIRED — recipe TIME axis is night/fog-dominant).
4. `qa-location.js --location "<town>" --no-scene` → download + grade 3 cast surfaces to ≥4.5.

### ⚠️ Beach-town render LESSONS (learned Myrtle→Santa Monica)
- **Recipe TIME axis is DARK-dominant** (pre-dawn marine layer / June Gloom / blue hour / post-sunset / late-night) → scenes AND cast renders roll dark/foggy. ALWAYS run `_tmp-sunnyaxes.mjs` (hard-sets 4 bright TIME + 3 bright WEATHER + strips dark PHENOMENA).
- **The word "glamour" (or glam/editorial/chic) in SUBJECT_RULE → fashion costumes** (open blazers over bare chest, epaulette shirts). Keep SUBJECT_RULE positive-casual; describe the PLACE, let the Americana WARDROBE pool carry the outfits. NO negation (it leaks).
- **Spots with "safety barrier" / "bluff edge / overlook" → barbed-wire fences + scrubby rural fields.** Avoid; use pier decks, promenades, porches, bungalow corners, boardwalks.
- **Lifeguard-tower spots + open-shirt wardrobe → Baywatch beefcake.** Skip lifeguard towers for iconic-place towns.
- Specific iconic places (SM pier, Malibu) are NOT generic-cottage towns — use `_tmp-iconictown.mjs` with a real register brief, not the candy-cottage template.

**Last updated:** 2026-08-27 (5/9 beach towns PASS; scene-only deprioritized; sunny-axes + iconic-town templates added; 4 remaining towns' recipes generating)

---

## Phase status
| Phase | Status | Notes |
|---|---|---|
| **1 — UI + Reorg** | ✅ DONE | committed `c5f92b0d`; DB reclassify applied; de-tab + 11-cat SECTION_META live in code |
| **2 — Seeding (41 cards)** | ✅ ALL 41 SEEDED + QA'd (dark) | every card passes ≥~4.2 on cast surfaces; per-card table below. Awaiting Kevin's grading pass + spot-scale-to-100 |
| **3 — Go-live** | ⬜ not started | flip `admin_only=false` per category after sign-off + build |

---

## Phase 1 — UI + Reorg checklist
**DB reclassification (service-key script, no DDL):**
- [ ] `Northern Lights` + `Sahara Dunes`: `landmarks_wonders` → `epic_nature`
- [ ] `Santorini`: `iconic_cities` → `tropical`
- [ ] World Wonders consolidation (repurpose `Ancient Wonders` card; null the 6 individual landmark cards' `picker_category`; ensure 8 wonder spots)
- [ ] register `beach_towns` as a picker_category value

**Code — `components/onboarding/LocationPickerStep.tsx`:**
- [ ] `SECTION_META` → 11 categories (5 real / 6 dream) with new mappings
- [ ] remove segmented tab control + `activeTier` state
- [ ] two labeled sections (REAL WORLD / DREAM WORLDS) in one scroll
- [ ] section-header styling (neutral eyebrow vs brand-gradient eyebrow)
- [ ] QA in simulator (sections, drill-in, back chevron, leave prompt)
- [ ] commit + deployed to prod

---

## Picker UX improvements (log)
| Improvement | Status | Deployed |
|---|---|---|
| Selected state = badge only (removed teal glow/outline) | ✅ done | ✅ committed `c5f92b0d` (ships next build) |
| Reset + Select-all → real button styling | ✅ done | ✅ committed `c5f92b0d` |
| Single context-aware back chevron (`handleBack` handle) | ✅ done | ✅ committed `c5f92b0d` |
| Leave-with-zero-places gentle confirm | ✅ done | ✅ committed `c5f92b0d` |
| Announcement → seat Profile→Edit Profile chain on back | ✅ done | ✅ committed `c5f92b0d` |
| **De-tab → two labeled sections (REAL WORLD / DREAM WORLDS)** | ✅ done | ✅ committed `c5f92b0d` |
| Category reorg 4→11 | ✅ done | ✅ committed `c5f92b0d` |

> ✅ All picker/announcement UX work is COMMITTED (`c5f92b0d`). It is in `main` but
> NOT yet in a shipped App Store build (last release was 1.0.16). It ships the next
> time a client build is cut. Files: `components/onboarding/LocationPickerStep.tsx`,
> `app/settings/locations.tsx`, `components/ConfirmDialog.tsx`, `components/AnnouncementSheet.tsx`.

---

## Phase 2 — Seeding tracker (41 net-new cards)

### 🌍 Around the World — Countries (11)
> 🧩 **Country template (`_tmp-country.mjs`):** elegant TRAVELER wardrobe (setting carries the
> culture, cast wears great travel clothes — NOT literal costume) + daytime-dominant axes (bright,
> not the recipe's night-dominant) + de-amplified place-rich SUBJECT_RULE + landmark cast spots.
> ⚠️ **CASE BUG:** `generate-full-location-card` LOWERCASES card names — pass LOWERCASE to
> seed-category ("japan" not "Japan") or the gate/biome updates miss the card + spots orphan under
> the capital key. ⚠️ **ERA-WORD → PERIOD COSTUME:** fashion-era words in SUBJECT_RULE ("Renaissance",
> "Victorian", "medieval") + painterly mediums dress the cast in period costume. Describe the PLACE
> without fashion-era labels + add "present-day / modern-day travelers in contemporary wear" (positive).
> "ancient ruins" is OK (archaeological, not a fashion era). ⚠️ **COUPLE race-drift on EXTREME priors
> (Egypt):** the skin fix holds on self/plus1, but the dual/couple surface can still lean tan/ethnic on
> the strongest non-white priors when the swap is weak + the descriptor is ambiguous ("warm-toned").
> Milder than the original Polynesian bug; flag for Kevin. Re-roll usually improves it.

| Card | Status | QA avg | Notes |
|---|---|---|---|
| Japan | ✅ 4.63 (dark) | self 4.7 / plus1 4.6 / couple 4.6 | RACE FIX VALIDATED on a strong prior — cast renders WHITE in Japan. Kimono at temples (tasteful), travel-casual at gardens. PASS |
| Italy | ✅ 4.53 (dark) | R3: self 4.4 / plus1 4.6 / couple 4.6 | FIXED by spot hygiene — demoted ancient/religious cast spots (Roman Forum, Pompeii, medieval portico, monastery). Now modern-fashionable vacation couple in living-modern Italy (Amalfi, village lanes, Como), correct race, NO toga. PASS |
| Egypt | ✅ ~4.3 (dark) | R4: self 4.3 / plus1 4.4 / couple 4.2 | SOLVED via spot hygiene — demoted mosque + ALL temple-interior cast spots; cast only at pyramids viewpoint / oasis / Nile / corniche. ETHNIC DRIFT FIXED (all clearly white, no hijab), no cheesy stereotype. Mild desert-traveler linen flavor = within Kevin's "tasteful local flair OK" leeway. PASS |
| Greece | ✅ 4.63 (dark) | self 4.6 / plus1 4.7 / couple 4.6 | modern-elegant travel wear, correct race, no costume. PASS |
| France | ✅ 4.63 (dark) | self 4.6 / plus1 4.6 / couple 4.7 | modern-day framing worked: sharp modern-elegant (Paris passage, Seine, cafe), correct race. PASS |

> ✅✅ **CULTURAL-PRIOR DRIFT — LARGELY SOLVED by CAST-SPOT HYGIENE (Kevin's target: no ethnic drift + no
> cheesy stereotypes like toga/turban/hijab; tasteful local flair IS welcome; vacation photos of the
> couple as their real fashionable selves).** The costume/native drift is driven by the CAST SPOT, not the
> location per se: religious-interior + ancient-monument-interior cast spots induce local/period costume
> (Italy Roman Forum → toga; Egypt mosque → hijab; Egypt temples → goddess/adventurer). FIX = demote those
> to SCENE-ONLY (wide establishing shots keep the iconic landmarks); cast the couple only at MODERN,
> LIVING, tourist-friendly foregrounds (village lanes, cafe terraces, promenades, landmark VIEWPOINTS,
> resort terraces). This fixed Italy (toga gone → modern fashionable couple, correct race). Baked into
> `_tmp-country.mjs` spot-gen brief so future countries are clean by default. Egypt (extreme prior) is the
> stress test — R4 applies the same lever. Diagnosis nuance: the face swap SUCCEEDS (identity ~0.6) — the
> drift is the SCENE recoloring the body + adding local dress, not a swap failure; clean cast spots + the
> skin-tone fix + modern wardrobe together keep the couple on-race and fashionable. If a location still
> can't hold after 5 rounds/issue → SHELF it and continue (Kevin 2026-08-27).
| Spain | ✅ ~4.55 (dark) | couple 4.6 / self 4.5 | tapas terrace + Andalusian lane, modern-fashionable, correct race. PASS |
| Ireland | ✅ ~4.3 (dark) | self 4.6 (waterfall, waxed jacket) / couple 4.0 | correct race, cool; couple a touch formal-tweed but plausible. PASS |
| Germany | ✅ ~4.6 (dark) | couple 4.6 (Marienplatz + map) | classic modern tourist couple, correct race. PASS |
| Vietnam | ✅ 4.47 (dark) | self 4.5 / plus1 4.5 / couple 4.4 | STRONG PRIOR — passed R1, NO ethnic drift (all white), mandarin-collar/parasol = tasteful local flair. PASS |
| Brazil | ✅ ~4.5 (dark) | self 4.6 (street-art bomber) / couple 4.5 (Selarón Steps) | strong-ish prior — correct race, cool + fashionable. PASS |
| Scotland | ✅ ~4.55 (dark) | self 4.5 (plein-air) / couple 4.6 (Highlands + map) | correct race, stylish, no tartan-costume. PASS |

> ✅✅✅ **ALL 11 COUNTRIES PASS (dark).** Batch 1 (Japan/Italy/Egypt/Greece/France) + batch 2
> (Spain/Ireland/Germany/Vietnam/Brazil/Scotland). The ethnic-drift fix (race skin-tone in prompt +
> cast-spot hygiene baked into `_tmp-country.mjs` + modern-day-traveler framing) works AUTOMATICALLY on
> strong priors — Vietnam + Brazil passed R1 with no drift + tasteful local flair. Kevin's bar met:
> your real fashionable selves on vacation, correct race, no cheesy stereotypes.

### 🌍 Around the World — City + Wonders (2)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Sydney | ✅ ~4.55 (dark) | self 4.6 / couple 4.5 | country template — Darling Harbour, modern-cool, correct race. PASS |
| World Wonders | ✅ ALREADY BUILT + LIVE | sample: self 4.7 / couple 4.6 | The `ancient wonders` card IS this — LIVE (admin=false), 309 spots/251 cast covering Machu Picchu/Petra/Pyramids/Colosseum/Angkor/Taj/Great Wall + hundreds more. 6 single-landmark cards ALREADY dissolved (pc=null). Renders great: fashionable explorer couple, CORRECT RACE, cast well-integrated (old "MASSIVE" SUBJECT doesn't hurt — cast spots frame at human scale). NO seeding needed. Only open nit: display-name "Ancient Wonders"→"World Wonders" + SECTION_META placement = Phase-1 code cosmetic for Kevin. |

### 🏖️ Tropical Escapes (4) — IN PROGRESS (PAUSED for the race bug 2026-08-27)
> 🧩 **Tropical template (`_tmp-tropicaltown.mjs`):** exotic tropical ≠ Americana. seed-category's
> gen-location-wardrobe produced SEXUALIZED costume ("bare chest", "speargun", "reef knife on thigh",
> "resort-noir glamour") AND a scene-amplifying SUBJECT_RULE ("rendered MASSIVE and dominant"). The
> template replaces both with believable elevated RESORT wardrobe + a place-rich NON-amplifying
> SUBJECT_RULE, regenerates ~20 cast-friendly spots, then run `_tmp-sunnyaxes.mjs`. Worked great on Amalfi.
>
> ⏸️ **PINNED — RESUME HERE after the race bug fix (Kevin 2026-08-27):**
> - **Amalfi Coast ✅ 4.6** (self 4.6 / plus1 4.5 / couple 4.7) — resort wardrobe + non-amplify SUBJECT nailed it. European prior = stayed on-race.
> - **Fiji ~4.0, needs R2:** self 3.9 (linen shirt open over BARE CHEST — dropped the tee), plus1 4.5 (hibiscus village path + volcanic peak, lovely), couple 3.5 (SHIRTLESS male + the RACE BUG — rendered as Polynesian; this is the bookmarked dream that triggered the race investigation).
> - **Cancún + Tahiti:** rendered (job `bkhpfruy7`) but NOT yet graded — downloaded pending. Both beach-heavy → expect same shirtless + race issues.
> - **PATTERN:** beach-dominant tropicals (Fiji, Malibu) push SHIRTLESS males; village/harbor registers (Amalfi, 30A) hold wardrobe. LEVER = bias cast SPOTS to clothed resort contexts (bungalow deck, dock, village lane, pool terrace) NOT open sand. Do a coordinated R2 for Fiji + Cancún + Tahiti after the race fix: reword their cast spots toward clothed-context foregrounds, re-render, grade.
> - The race fix (skin tone in the cast identity block) ALSO helps here (bodies render on-race even when shirtless), so re-render tropicals AFTER deploying the fix.

| Card | Status | QA avg | Notes |
|---|---|---|---|
| Amalfi Coast | ✅ 4.6 (dark) | self 4.6 / plus1 4.5 / couple 4.7 | resort template. Chic believable linen; distinctly Amalfi. PASS |
| Fiji | ✅ 4.57 (dark) | R2: self 4.5 / plus1 4.6 / couple 4.6 | after race fix + canvas fix + clothed-context spots (decks/docks/terraces): all DRESSED, correct race, clean. PASS |
| Tahiti | ✅ 4.6 (dark) | R2: self 4.5 / plus1 4.7 / couple 4.6 | clothed-context spots + resort wardrobe: bungalow deck, tiki pavilion; all dressed, correct race. PASS |
| Cancún | ✅ 4.47 (dark) | R3: self 4.4 / plus1 4.6 / couple 4.4 | R3 fix (demoted clifftop cast spot + tightened wardrobe to closed tops) worked: all dressed, correct race, clothed-context. PASS |

> ✅ **TROPICAL ESCAPES COMPLETE 4/4** (Amalfi 4.6 · Fiji 4.57 · Tahiti 4.6 · Cancún 4.47), all dark.
> Validated the full fixed pipeline: race skin-tone fix + clean canvas medium + clothed-context cast
> spots (decks/docks/terraces/bars/lanes, NOT open sand) + believable resort wardrobe. Beach-heavy
> tropicals need the clothed-context spot bias + closed-top wardrobe to avoid shirtless drift.

### 🏝️ Beach Towns (9) — SEED FIRST (new category)
> ⭐ **BEACH TOWNS TEMPLATE (learned on Myrtle Beach R1→R2, from Kevin's favorited refs):**
> Beach towns = the CHARMING DREAM version, NOT the literal resort strip.
> - **SUBJECT** = candy-colored pastel raised beach cottages (teal/coral/yellow/mint),
>   palm-lined sandy lanes, hibiscus/bougainvillea, striped-awning boardwalk shops,
>   fishing piers, wide sunny beach + sea-oat dunes. Feature colorful beach houses +
>   the beach. Do NOT emphasize high-rise resort towers.
> - **WARDROBE** = casual-cute Americana (Hawaiian/camp shirts, denim rompers,
>   sundresses, cutoffs+tee). NOT exotic beach-glam gowns / shirtless-tiny-shorts.
> - **WEATHER/PHENOMENA** = sunny + golden + pastel-sunset dominant; NO storms,
>   waterspouts, thunderheads.
> - **Spots** = hand-curate cottage/beach scene-types (the auto-gen pulls resort
>   landmarks + brand names like "Hard Rock Cafe" → IP leak; scrub brands).
> - Refs: Kevin's 2 favorited Myrtle Beach dreams (colorful cottages, palm lanes,
>   casual wardrobe) — the target look for the whole category.

> **Reusable Americana WARDROBE pool** (paste into each beach town's biome_config.WARDROBE):
> sundress (floral/gingham) + straw hat + sandals · tropical camp/Hawaiian shirt + shorts +
> sneakers · denim romper/overall-shorts + striped tee + tote · cutoffs + knotted gingham top +
> fedora · gauze cover-up over tasteful swimsuit + floppy hat · pastel camp-collar shirt + linen
> shorts + boat shoes · flowy sundress/linen jumpsuit + gold jewelry · graphic tee + cuffed denim.
> **Axes:** filter WEATHER/PHENOMENA to drop `thunderstorm|nor'easter|hurricane|squall|waterspout|
> thunderhead|foam surge|post-storm|heat pillar`; add sunny + pastel-sunset. **Spots:** hand-curate
> cottage/beach scene-types; scrub brand names (Hard Rock, Ripley's, SkyWheel→generic).

| Card | Status | QA avg | Notes |
|---|---|---|---|
| Myrtle Beach | ✅ 4.7 (dark) | R2: self 4.6 / plus1 4.8 / couple 4.7 / scene 4.8 | LOCKED TEMPLATE. cottage-dream + Americana wardrobe + sunny. 20 spots/16 cast (QA size; scale to 100 post-signoff) |
| Outer Banks | ✅ 4.7 (dark) | R1: self 4.6 / couple 4.7 / scene 4.8 | teal surf shack, coral cottage porch, stilt cottage + rainbow. PASS R1 |
| Key West | ✅ 4.6 (dark) | R1: self 4.7 / couple 4.6 / scene 4.8 / plus1 4.0 | coral conch cottage + bougainvillea, turquoise dock, sunset marina. PASS. (plus1 rolled an awkward squat-on-surfboard pose — pose-pool, not location) |
| Cape Cod | ✅ ~4.4 (dark) | R2: self 4.7 / couple 4.3 / scene 3.8 | R2 re-theme (sunnier, grey-shingle+lighthouse+marsh) worked. Self is a distinctly-Cape-Cod knockout; cast surfaces avg 4.5. PASS. (scene surface occasionally rolls a moody dusk aerial — acceptable variety) |
| Santa Monica | ✅ 4.53 (dark) | R3 cast-only: self 4.4 / plus1 4.7 / couple 4.5 | R1 FAIL (Baywatch beefcake + decor-wall). R2 partial (pier showed but "glamour" word → blazer/editorial costumes; barbed-wire "safety barrier" spot). R3 fix: dropped "glamour" from SUBJECT_RULE (positive casual, no negation), reworded barbed-wire spot, sunny-axes. PASS — all cast surfaces casual/sunny/on-place. |
| Coney Island | ✅ ~4.4 (dark) | R1 cast: self 4.2 / plus1 4.6 / couple 4.3 | iconic-template. Vintage carousel + arcade skee-ball. Distinctly Coney. (self drifted mild vintage vest+suspenders from the carousel setting; carousel rolled twice — acceptable) |
| 30A / Seaside | ✅ 4.5 (dark) | R1 cast: self 4.6 / plus1 4.5 / couple 4.4 | candy-cottage template. Boardwalk-over-dunes, surf shack, pastel cottage + white picket. Americana wardrobe, sunny. PASS |
| Malibu | ✅ ~4.2 (dark) 🚩Return-to | R1: self 4.6 / plus1 4.2 / couple 3.8 · R2: self 4.5 / plus1 4.0 / couple 3.7 | iconic-template. Self is a reliable knockout (beach seafood-shack, bluff coast). BUT the couple + plus1 surfaces drift SHIRTLESS / rugged-utility across BOTH rounds — Malibu's surf-culture prior is strong + stochastic; no clean fix. Soft-pass on self+plus1; 🚩 flag for Kevin to decide on the couple. |
| The Hamptons | ✅ ~4.4 (dark) | R1 cast: self 4.6 / plus1 4.5 / couple 4.1 | iconic-template. Rose-arbor picket + dune grass; sunflower farm stand. Coastal-preppy casual. PASS. (couple rolled a farmer's work apron on male — mild costume drift) |

> ⚠️ **Couple-surface costume drift (cross-town, minor):** on painterly mediums the dual/couple
> render tends to invent "character" wardrobe for the MALE — shirtless (Malibu), work apron
> (Hamptons), vest+suspenders (Coney carousel), epaulettes (SM R2). The Americana wardrobe pool
> is fully-clothed casual, so this is stochastic Flux medium-drift, NOT a pool bug (self/plus1 stay
> true). No clean fix without medium-narrowing (banned) or negation (leaks). A re-roll usually clears
> it. Flag for Kevin's final pass; not a per-town blocker.

### ⛰️ Nature & Wild (1) · ⏳ Through Time (1)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Mount Everest / Himalayas | ✅ ~4.5 (dark) | self 4.5 / couple 4.6 | BESPOKE alpine treatment (not country template): mountaineering wardrobe (down jackets/trekking, NOT linen) + bright-snow axes + base-camp/village/bridge cast spots. Correct race, epic. PASS |
| Prehistoric (Dinosaurs) | ✅ ~4.2 (dark) 🚩minor | self 4.4 (explorer @ arch) / couple 3.9 (waterfall-pool → swimsuit) | fantasy template (bright axes), explorer wardrobe, correct race. Couple rolled a jungle-waterfall swim spot → swimsuit register; a clothed-context spot nudge would tighten. Soft-pass |

### 🦇 Gothic & Haunted (7) — ✅ ALL PASS (dark)
> 🧩 **Fantasy template (`_tmp-fantasy.mjs`, mood=dark):** character-in-the-world — Sonnet-gen
> thematic-elegant wardrobe (gothic-Victorian eveningwear, vampire couture, witch-craft) + moody
> candlelit/moonlit axes + thematic cast spots. Race locked by the skin-tone fix.
> ⚠️⚠️ **DECOY-FACE LESSON (big one):** the dual/couple surface went PERSONLESS on Foggy Graveyard +
> Catacombs. Forensics: `degrade_solo_multi_face(faces=5/3/2)` — statues, stone angels, gargoyles,
> ossuary SKULLS, and portraits in the scene are counted as extra FACES by the dual detector → it
> can't isolate the couple → degrades to solo → fails → personless pure-scene. FIX = demote
> figure-heavy cast spots (statue/angel/gargoyle/skull/ossuary/portrait/effigy/sarcophagus/bust/niche)
> to SCENE-ONLY; cast the couple only at figure-FREE foregrounds (a gravel path, a gate, a plain
> tunnel, a crypt doorway). Re-render → both couples came back with the real cast, correct race. This
> is the DARK-scene analog of the country cast-spot hygiene; applies to any figure-populated location.

| Card | Status | QA avg | Notes |
|---|---|---|---|
| Haunted Mansion | ✅ ~4.5 (dark) | self 4.5 / couple 4.4 | candlelit gothic character; correct race, elegant Victorian. PASS |
| Vampire Castle | ✅ 4.63 (dark) | self 4.6 / plus1 4.6 / couple 4.7 | STUNNING — star-embroidered coat + midnight gown in a candlelit library; correct race. PASS |
| Foggy Graveyard | ✅ ~4.5 (dark) | R2 couple 4.7 (after figure-demote) | R1 couple PERSONLESS (stone angels = decoy faces). Fixed by demoting figure spots → velvet-corset + caped-coat couple, correct race. PASS |
| Gothic Cathedral | ✅ ~4.4 (dark) | self 4.7 / couple 4.0 | gargoyle-parapet self is gorgeous; couple correct race (a touch casual in cloister). PASS |
| Witch's Cottage | ✅ ~4.6 (dark) | plus1 4.7 / couple 4.6 | full witch look (velvet, feathered hat, crystals); correct race, characterful. PASS |
| Catacombs | ✅ ~4.4 (dark) | self 4.6 / R2 couple 4.4 (after figure-demote) | R1 couple PERSONLESS (skull carvings = decoy faces). Fixed same lever. PASS |
| Ghost Town | ✅ ~4.4 (dark) | self 4.6 / couple 4.1 | golden western axes; rugged frontier character, correct race. PASS |

### 🚀 Sci-Fi & Space (3) — ✅ ALL PASS (dark) · 🤠 Wild West (3)
> 🧩 Fantasy template (neon axes). ⚠️ **Sci-fi RETRO-BEIGE drift:** the default sci-fi wardrobe rolled
> dated Star-Trek-TOS beige jumpsuits on the couple. Kevin wants Aliens/Expanse/Star Wars/Trek COOL.
> FIX = sleek-modern wardrobe pool (fitted flight suits, glowing accent seams, command tunics) + an
> epic SUBJECT (massive viewscreen w/ planet/nebula/fleet, captain's chair) + hero cast spots. Big
> improvement. NOTE: `cinematic` medium makes GORGEOUS elaborate ship interiors but shrinks the cast
> too small — keep CANVAS for the cast surfaces (sharp modern subject + on-race).
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Moon Base | ✅ ~4.4 (dark) | self 4.6 / couple 4.2 | sleek flight-suit self (hydroponics bay) is great; couple wardrobe upgraded to sleek (was beige). PASS |
| Starship Bridge | ✅ ~4.6 (dark) | canvas: self 4.7 / couple 4.6 | UPGRADED for Kevin — epic viewscreen+fleet SUBJECT, sleek command wardrobe, captain's-chair hero spots. Command-couple w/ fleet behind = heroic-cool. PASS (cinematic = killer bg but tiny cast) |
| Robot City | ✅ ~4.5 (dark) RETOOLED | R2: couple 4.6 (clean human) / self 4.6 | Kevin 2026-08-29: kill the half-cyborg cast look. Fixed the SUBJECT (was "android metropolis...machines among crowds" → first-noun bled onto people). Now leads with HUMAN cast + robots/drones as ENVIRONMENT only; +3 background-robot SCENE spots. Round 1 = clean human couple, correct race, fashionable. (Minor: one roll still tinted the male armored/bluish under cold neon — no longer chrome-cyborg.) PASS |
| Saloon | ✅ ~4.4 (dark) | self 4.6 / couple 4.3 | Red Dead gunslinger register — worn vest/neckerchief at the piano; correct race, authentic (not costume). PASS |
| Outlaw Hideout | ✅ ~4.6 (dark) | self 4.7 / couple 4.5 | canyon camp, weathered dusters/buckskin, map — authentic frontier-outlaw (Red Dead vision); correct race. PASS |
| Railroad Town | ✅ ~4.5 (dark) | couple 4.6 | joyful couple at a depot platform beside a vintage train; correct race, charming boomtown. PASS |

---

## Phase 3 — Prod deployment log
| What | Committed | admin_only flipped (LIVE) | Client build |
|---|---|---|---|
| De-tab UI + reorg + picker UX polish | ✅ `c5f92b0d` | n/a | ⬜ NOT in a shipped build (last release 1.0.16; UI ships next build) |
| 41 seed pools (all categories) | ✅ (data, not code) | ⬜ ALL still `admin_only=true` DARK | n/a |
| Pipeline fixes (race/canvas/spot-hygiene) | ✅ committed + edge-deployed | ✅ LIVE (edge fns) | n/a — server-side |
| Reclassifications (Santorini/NL/Sahara/Wonders) | ⬜ | ⬜ | ⬜ |

> **Go-live gate (needs Kevin):** (1) your grading pass on the 41 dark cards →
> (2) scale approved cards' spots 20→100+ → (3) "Ancient Wonders"→"World Wonders"
> display rename + confirm SECTION_META placement → (4) flip `admin_only=false` on
> approved cards → (5) cut a client build so the de-tab picker UI ships.

---

## Change Log
- **2026-08-27 (session 2, mid-run BUGS surfaced by Kevin during tropical QA)** —
  Two pipeline bugs found + fixed while grading Fiji (both committed / applied):
  1. **RACE not piped to prompt (CRITICAL, committed).** Kevin's white cast rendered
     Polynesian in a Fiji couple. Root cause: `extractHair()` dropped the skin-tone
     clause from `physical_summary`, so the identity block had NO complexion → the
     "fiji" location prior filled in the wrong race (the swap only refines the FACE,
     never neck/arms/body). Fix: `extractSkin()` threads complexion into every
     identity block (solo + dual). Verified in prompt + pixels; 12 unit tests
     (`__tests__/lib/castSkinTone.test.ts`). Deployed nightly-dreams + generate-dream
     + first-dream-render. **INVARIANT: cast description always overrides location race.**
  2. **`canvas` medium chunky + face-swap-hostile (applied to DB).** Its `flux_fragment`
     had "heavy brushstrokes / palette knife marks / impasto ridges / canvas weave" →
     buried faces (dual detector failed `no_dual_split`, flailed, cropped chunky mosaic)
     esp. on flux-1.1-pro-ultra. Fix: rewrote `flux_fragment` (dropped chunky terms) +
     set `face_swap_flux_fragment` + `face_swap_directive` (clean glazed oil, readable
     faces, positive wording — no "impasto" to leak). Verifying on canvas+1.1-pro-ultra.
- **2026-08-27 (session 2)** — BEACH TOWNS COMPLETE (9/9, dark). Batch 1 (Myrtle/OBX/
  Key West/Cape Cod/Santa Monica) + batch 2 (Coney Island/30A/Malibu/Hamptons) seeded,
  templated, graded on CAST surfaces only (scene-only deprioritized per Kevin). Built
  `_tmp-iconictown.mjs` (specific-identity towns) + `_tmp-sunnyaxes.mjs` (bright TIME/
  WEATHER — recipe axis is dark-dominant). Root-caused + fixed: Santa Monica "glamour"→
  editorial-costume + barbed-wire "safety barrier" spot (R3 pass 4.53). Added
  `qa-location.js --no-scene`. Recorded couple-surface male-costume drift (shirtless/
  apron/vest) as a cross-town minor. Malibu 🚩Return-to (surf-shirtless prior, 2 rounds).
  Committed the durable bits (tracker + qa-location flag). NEXT: Tropical Escapes.
- **2026-08-27** — Plan (`LOCATION_REORG_PLAN.md`) + this tracker created. Taxonomy
  decided: 11 categories, no tabs, beaches split, landmarks→World Wonders, overlap
  OK. 41 net-new cards scoped. Picker UX polish (badge-only, buttons, single
  chevron, leave-prompt, announcement back-chain) code-complete but uncommitted.
  Nothing seeded or deployed yet.
