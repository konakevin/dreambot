# Scene-Only Nightly Dream Revamp — Plan

**Status:** PLAN (2026-08-23). **Owner:** Kevin + Claude.
**The goal (Kevin):** make **scene-only nightly dreams** — the dreams that no-cast users (who never upload a
photo) get — genuinely *amazing*: a reason to open the app every day, not generic AI slop. A no-cast user's
nightly is their **travel/dream fantasy** of the beautiful places they saved; it should feel personal,
cinematic, varied, and dreamlike.

This plan has two parts:
- **PART I — Anchor recalibration (the foundation).** Fix the polluted anchor pool so scene-only always renders
  a *recognizable, beautiful* view of the user's saved place (the sunnysteph trigger). Fully specced below;
  ready to execute.
- **PART II — The revamp (the prize).** The levers that turn "a clean postcard of your city" into "an amazing,
  personal, varied dream you come back for." Vision + phased roadmap + open questions to steer.

**In scope:** the nightly **pure-scene** path (`composition = pure_scene`, and its cousin `epic_tiny`).
**Out of scope (follow-ups):** character/cast paths, the `location_cards` essence system (except where the
revamp touches them), Create, bots.

---

# PART I — Anchor Recalibration (foundation)

**Scope:** `location_iconic_spots.pure_scene_eligible` recalibration. Character/cast paths
(`character_eligible`) are OUT of scope here (§11).

---

## 0. Trigger

sunnysteph's 2026-08-23 nightly came back as a pure scene of **Amsterdam's "Oudemanhuispoort covered
book-market arcade"** — technically one of her saved locations (Amsterdam), but an obscure micro-landmark
that reads as a random old stone arcade, not a recognizable, beautiful Amsterdam postcard. Kevin: *"it seemed
completely arbitrary… if we do a fallback it should be a beautiful/cool/amazing render from one of their
saved locations."* Investigation showed this is **systemic**, not one location.

(Separate, already-shipped from the same investigation: the render only became a pure-scene at all because a
heavy dual face-swap **hard-failed 3×** and the L4 safe-scene floor forced a cast-free scene. Durable
hard-kill logging was added + deployed — see §6.1. This plan is about the *anchor quality* half.)

---

## 1. Problem statement (data-grounded)

The nightly pure-scene path picks an "iconic anchor" for the user's saved location from
`location_iconic_spots WHERE pure_scene_eligible = true`, **uniformly at random**. Measured over the full
live pool (5,091 eligible spots across 48 live locations):

- **~18% (893) are GENERIC, unnamed "essence-card" scenes** — placeless nature/atmosphere descriptors that
  could be anywhere and don't evoke the location: *"frozen puddle ice pattern"* (Tokyo), *"storm-lit sea
  panorama with white foam lines"* (Santorini), *"close-up of a single red hibiscus blossom"* (Hawaii),
  *"wide spring dawn over a broad river with mist columns"* (NYC).
- The remaining **82% are named landmarks — but that bucket still hides OBSCURE duds** a tourist wouldn't
  recognize as the location (Amsterdam *"Oudemanhuispoort book-market arcade"*, *"Scheepvaarthuis shipping
  building"*).

Net: **roughly 1 in 4–5 pure-scene nightlies can roll an anchor that doesn't read as the user's saved
place.** This is a paid feature; the anchor should always be a recognizable, beautiful postcard of *their*
location.

---

## 2. Root cause (precise)

1. **The classifier auto-passed tier-S without judgment.** `scripts/classify-pure-scene-eligible.js`
   (2026-06-04) set `pure_scene_eligible=true` for **every** S-tier spot *without* a Sonnet check
   (`S-tier → true, auto-marked`). ~2,658 tier-S rows — including the 893 generic essence cards and the
   obscure S-named spots — were marked eligible unjudged. Only A-tier got the quality rubric.
2. **The rubric judged text with no location context.** Even where Sonnet ran, it judged the spot string in
   isolation, so it could not distinguish *"generic seascape"* from *"recognizably Santorini."*
3. **The picker ignores `quality_tier` and samples uniformly** (`nightly-dreams/index.ts:1179`,
   `spots[floor(random*len)]`) — a *"frozen puddle"* has identical odds to the *Rijksmuseum*.
4. **No floor / anchorless degradation.** If a location has zero eligible spots, `iconicAnchor` stays null
   and the scene renders as a generic *biome* scene with no anchor at all (`index.ts:1178` — the
   `spots.length > 0` guard). So both over-inclusion *and* over-exclusion hurt.

---

## 3. How the system works today (the pipeline)

```
location_iconic_spots (5,091 eligible)
  columns: location_key, spot_text, spot_kind (wide|medium|intimate),
           quality_tier (S|A|B), pure_scene_eligible, character_eligible, is_active
        │
        ▼  nightly-dreams/index.ts (pure_scene composition)
  SELECT spot_text, spot_kind WHERE location_key=<userPlace>
         AND is_active AND pure_scene_eligible=true
        │
        ▼  UNIFORM random pick  → iconicAnchor  → Sonnet postcard brief → Flux
  (empty pool → iconicAnchor=null → anchorless biome scene)
```

- **Anchor source is durable seed data**, not lazy-generated at render time. `getLocationCard()` lazy-inserts
  `location_cards` (biome/palette), **not** `location_iconic_spots` — so demotions to the spot pool **stick**
  (no runtime re-pollution). The only writers of `location_iconic_spots` are the manual seed scripts
  (`gen-postcard-spots.js`, `gen-iconic-spots-*.js`) — relevant to recurrence-prevention (§5, §7 Phase 5),
  not to whether the audit holds.
- **48 live locations**, per-location eligible counts: 0 below 20, **2 in 20–49** (Big Sur 46, Amsterdam 47),
  25 in 50–99, 21 at 100+. Thinnest are the starvation-risk locations for an aggressive cull.

---

## 4. The fix — design

### 4.1 The strict, location-aware rubric
Re-judge **every** currently-eligible spot with Sonnet, **passing the location name** so it judges recognizability.
A spot stays eligible only if a traveler sees it (no person in frame) and thinks *"that's {location}!"* and
it's postcard-beautiful. Demote (`pure_scene_eligible=false`) if:
- **Generic / anywhere** — pretty but placeless; doesn't evoke *this* location. Beauty alone is not enough.
- **Obscure** — real but niche; a tourist wouldn't recognize it as the location.
- **Mundane / gritty** — reads as a random building/street/utilitarian structure.

**Nature-destination nuance (load-bearing):** for natural-wonder destinations (Hawaii, Swiss Alps, Yosemite,
Maldives, Bora Bora, Big Sur, New Zealand, Grand Canyon, Zion), a beautiful *unnamed* landscape genuinely IS
the postcard (a turquoise overwater lagoon = Maldives; a jagged alpine peak = the Alps). The rubric's *"iconic
OF this location specifically"* clause KEEPS those, while still demoting truly-placeless scenes (a "frozen
puddle" is not Hawaii). Because the location name is in-prompt, Sonnet makes this call per location. **This is
the #1 thing the sample validation must confirm** (Hawaii/Alps must NOT get over-stripped).

### 4.2 The re-audit script — `scripts/reaudit-pure-scene-spots.js` (written)
- Pulls every `pure_scene_eligible=true` active spot from the 48 live locations, **groups by location**,
  batches (50/batch), 5 parallel Sonnet calls, strict location-aware rubric.
- **Dry-run by default**; writes ONLY with explicit `--write`. `--sample` limits to 8 marquee locations.
- Output: fleet KEEP/DEMOTE split, per-location demote counts, and example demotions to eyeball.

### 4.3 The starvation floor (must-add before `--write`)
After judging, enforce a **per-location minimum of N=20 eligible spots** (tunable). If a location's KEEP count
would fall below N, **restore its best demotions** to hit the floor — mechanism: a small second Sonnet pass on
that location's demotions asking it to RANK the least-bad ones, restore the top few to reach N. (Most
locations won't trip this — the demotions are overwhelmingly tier-S generic, and each location keeps its
tier-A named landmarks. The floor is a safety net against an over-eager cull leaving anchorless renders.)

### 4.4 Reversibility & idempotency
- **Reversible:** a boolean flip (`true→false`), never a delete on the seed table. Restore = flip back. Before
  `--write`, snapshot the current eligible IDs to a file so the exact prior state can be restored 1:1.
- **Idempotent:** re-running re-judges the current eligible set; converges.
- **Scoped writes:** `.in('id', …)` on the specific demoted IDs — no bulk unscoped update (honors the
  never-bulk-delete-seed-tables discipline; this is a scoped flag flip, not a delete).

---

## 5. Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Over-demotion starves a location → anchorless generic renders** | HIGH | Per-location floor N=20 (§4.3) + full dry-run reviewed before write; thinnest locations (Big Sur, Amsterdam) watched explicitly |
| **Rubric over-strips nature destinations** (Hawaii/Alps beautiful-but-unnamed) | HIGH | Location-in-prompt + "iconic OF this location" clause; sample validation includes Hawaii + Swiss Alps and I inspect their demotions before scaling |
| **Rubric miscalibrated (too soft → duds survive; too hard → bangers demoted)** | MED | Two-stage validation: sample dry-run → your eyeball → tune → full dry-run → your eyeball → write. Litmus per location: Oudemanhuispoort demoted, Rijksmuseum/canal-houses/Keukenhof kept |
| **Recurrence — seeding re-adds generic/obscure spots** | MED | Fix the source: patch `classify-pure-scene-eligible.js` to STOP auto-passing S (route S through the strict rubric too); new seed spots default `pure_scene_eligible = NULL` and require classification (§7 Phase 5) |
| **Sonnet inconsistency across batches** | LOW | Batched per location with full context; borderline calls err to `no` (strict) but the floor prevents that from starving; spot-check the dry-run |
| **Cost / rate limits** | LOW | ~110 batches × ~$0.01 ≈ **$1–2** total, ~10 min at pool=5 |
| **Concurrent DB writes (other agents)** | LOW | Scoped `.in(id)` updates on a table no other current effort touches; reversible snapshot taken first |
| **DLT / other consumers of the pool** | LOW | `dlt_clean_mediums` and character paths read DIFFERENT columns (`character_eligible`) — unaffected by `pure_scene_eligible` flips |

---

## 6. Related fixes from this investigation

### 6.1 Durable hard-kill logging — DONE (deployed 2026-08-23)
The worker's stale-recovery now writes one durable `ai_generation_log` row per hard-killed attempt
(`status=failed`, `fallback_reasons=[hard_kill:stage=…, attempt:N/8, …]`), so future silent nightly failures
(the thing that triggered sunnysteph's forced safe-scene) are queryable in the DB with their death stage —
not just Sentry. (Commit `d… worker: durably log hard-killed nightly attempts`.)

### 6.2 L4 fallback → hero-anchor subset (DECISION NEEDED, §9)
Independent of the pool audit: when the L4 safe-scene floor fires (a dream that ALREADY failed), it should
draw from only the **top-tier** anchors so a recovered dream is guaranteed a banger. Options: (a) a small code
change to filter the forced-safe-scene anchor query to tier-S/A-named-landmark only; (b) rely on the audited
pool being uniformly good so no special-casing is needed. Recommend (b) if the audit lands well, with (a) as a
belt-and-suspenders later.

### 6.3 Watch sunnysteph tonight
Her renders hard-fail more than baseline (recent attempt_counts 3/2/1/1 vs 0). With durable logging live,
tonight's render (her local night → completes ~10:5x UTC) will now record any hard-kill's death stage. Watch
`ai_generation_log` for her user post-render to confirm whether it's the dual-swap timing out (the strong
hypothesis) and root-cause the *failure* (separate from this anchor-quality plan).

---

## 7. Execution phases (stop-gate between each — no writes without sign-off)

**Phase 1 — sample dry-run.** `node scripts/reaudit-pure-scene-spots.js --dry-run --sample` (8 marquee
locations, ~650 spots, ~$0.20, ~2 min). Review the per-location demote lists. **Gate:** confirms duds demoted
+ bangers kept + nature-destinations not over-stripped. Tune rubric + re-run if off.

**Phase 2 — full dry-run.** `--dry-run` across all 48 live locations (~5,091 spots, ~$1.50, ~10 min). Review
the fleet demote rate + per-location counts + thinnest-location impact. **Gate:** no location projected below
the floor without restore; overall rate sane (expect ~20–35%).

**Phase 3 — apply.** Snapshot current eligible IDs → run `--write` → run the floor-restore pass. **Gate:**
post-write verification.

**Phase 4 — verify.** Re-count the pool; confirm Oudemanhuispoort is `false`; confirm every location ≥ floor;
spot-check 5 locations' surviving anchors read as postcards; leave for a few nights and watch renders.

**Phase 5 — prevent recurrence.** Patch `classify-pure-scene-eligible.js` to route S-tier through the strict
rubric (kill the auto-pass) and default new-seed spots to `NULL` (require classification). Commit the audit
script + the source-classifier fix + this plan.

---

## 8. Rollback

- Pre-write snapshot of eligible IDs → one command restores the exact prior state.
- Because it's a boolean flip on a seed table (no deletes), worst case is a full revert to the snapshot; no
  data is lost. The picker tolerates either state (it just changes which anchors are eligible).

---

## 9. Open decisions for Kevin

1. **Rubric strictness for nature destinations** — default (KEEP beautiful-unnamed scenes that are iconic OF a
   natural-wonder location; DEMOTE placeless ones) vs stricter (named landmarks only, even for Hawaii/Alps) vs
   looser (any beautiful nature for nature-destinations). *Recommend the default; validate on the sample.*
2. **Per-location floor N** — default 20. Higher = safer against starvation but keeps more borderline anchors;
   lower = cleaner pool but starvation risk. *Recommend 20.*
3. **L4 fallback hero-subset (§6.2)** — special-case the fallback anchor now, or trust the audited pool?
   *Recommend trust-the-pool first.*
4. **Character paths (§11)** — audit `character_eligible` for the same auto-S-pass pollution in a follow-up, or
   leave for now? *Recommend follow-up.*

---

## 10. Cost & time

Full audit ≈ **$1–2** in Sonnet + ~10 min wall. Sample ≈ $0.20 + 2 min. Trivial relative to the paid-feature
quality it protects.

---

## 11. Out of scope (Part I follow-ups)

- **`character_eligible`** (cast paths) likely has the SAME auto-S-pass pollution — a person in frame tolerates
  a weaker backdrop, so it's lower-priority, but worth the same re-audit later with a cast-appropriate rubric.
- **The generic essence cards themselves** — 893 placeless nature scenes. Part I DEMOTES them from pure-scene;
  Part II (L4) may repurpose them.

---

# PART II — The Revamp (making scene-only *amazing*)

## 12. The vision

A no-cast user never sees their own face in a dream — so their nightly is a **dream of the places they long
for**: the Amalfi coast, Kyoto in autumn, the Maldives at dawn. Done right, that's aspirational and magical —
a nightly postcard from a life they want. Done as-is, it's *"a stock photo of a city, again."* The revamp's
job: make every scene-only nightly feel like a **frame from a beautiful film of their dream trip** — varied,
artful, personal, and a little dreamlike — hitting the app's own quality bar (*expansive · beautiful ·
unexpected · jaw-dropping · pleasant · awe-inspiring*).

## 13. Where the "slop" comes from today (beyond anchors)

Even with Part I's clean anchors, the current pure-scene render is a **literal postcard**:
- **The brief is "JAW-DROPPING postcard, LOCKED SUBJECT"** — it asks for a faithful pretty view, with no
  dreamlike register, no emotional moment, no personal voice. A postcard is *nice*; it's not *unforgettable*.
- **Personalization stops at the location.** The user's **mood sliders** (Calm↔Wild, Cozy↔Eerie, Spare↔Lush,
  Grounded↔Surreal) and **aesthetic picks** (their saved vibes/art-styles) shape cast dreams but barely touch
  the scene-only brief. Two very different users get near-identical postcards of the same city.
- **Medium variety is thin.** Scene-only re-rolls a "scene-eligible" medium, but there's no deliberate rotation
  of *gorgeous art treatments* — so the same place tends to render in the same register night after night.
- **No "moment."** It's a static vista, not a scene *happening* (light breaking after a storm, a festival, a
  rare sky) — the difference between a screensaver and a still you'd frame.
- **No time-awareness.** Their place looks the same in July and December; no season, no holiday, no now-ness.

## 14. The levers (grounded; each is a proven or existing mechanism)

| # | Lever | What it does | Grounding / mechanism | Effort |
|---|---|---|---|---|
| **L1** | **Anchor quality** | Every scene is a *recognizable, beautiful* view of their place | Part I recalibration | DONE (this plan) |
| **L2** | **Beautiful art-treatment rotation** | The same place renders as oil / watercolor / cinematic-film / dreamy-painterly / golden-hour-photo — a *different gorgeous look each night* | The **"Medium Looks" system**, proven on 5 bots (YumBot/MangaBot/ChibiBot/BloomBot/SteamBot) — a per-render `look_register` roll that leads the CLIP anchor. Adapt a **scene-only look pool** of fine-art registers. Biggest single "not-slop" lever. | MED |
| **L3** | **Mood-driven dreamlike register** | The user's sliders bend the scene: Cozy→warm intimate moments, Eerie→moody atmospheric, Surreal→their place *reimagined dreamily* (floating, impossible light, oversized moon), Lush→rich & abundant | Mood sliders already in the VibeProfile + read for chaos tier. Thread them into the pure-scene brief (a mood block) + gate a **"dream-surreal" register** on Grounded↔Surreal. Makes it *personal* and *dream*-like. | MED |
| **L4** | **The "moment" / awe beat** | Scene is *happening*: light breaking after rain, a meteor shower, festival lanterns, bioluminescent tide, an enormous moonrise — the jaw-drop | Biome axes already roll PHENOMENA; lean into an **awe/spectacle beat** (like nightly's Option B action beat, but for scenes). Repurpose the demoted "essence-card" atmospheres (L4 of §11) as *phenomena accents*, not standalone anchors. | MED |
| **L5** | **Seasonal & holiday awareness** | Their place *now*: cherry blossoms in spring, snow at Christmas, autumn gold — tie into seasons + the Holiday Dreams system | Holiday Dreams infra exists; add a season signal (hemisphere-aware from the user's tz/location) to the brief. | LOW-MED |
| **L6** | **Variety engine** | No two nights feel same: rotate location × anchor × medium × look × mood so the feed stays fresh | Recency filters already exist for location/medium; extend to the look + anchor axes (a shuffle-bag like the scenario pools). | LOW |
| **L7** | **Aspirational framing** | Lean into bucket-list cinematic scope — wallpaper-worthy, "a life you want," not a documentary | Brief-craft: reframe "postcard" → "a breathtaking cinematic moment from your dream trip." | LOW |

## 15. Phased roadmap (each phase ships + is QA'd before the next)

- **Phase 1 — Anchor recalibration (Part I).** Foundation. Clean, recognizable anchors. *Ships first; the rest
  build on it.*
- **Phase 2 — Art-treatment rotation (L2).** The highest-impact visible change. Build a scene-only fine-art
  look pool + wire it into the pure-scene brief (lead the CLIP anchor). QA a shadow batch across several
  locations × looks; grade to the bar; tune. *This alone transforms the feel from "stock photo" to "art."*
- **Phase 3 — Mood/dreamlike personalization (L3 + L7).** Thread the mood sliders + aspirational framing into
  the brief; gate the dream-surreal register on the Surreal slider. QA that two different-mood users get
  visibly different dreams of the same place.
- **Phase 4 — The moment + seasonal (L4 + L5).** Awe/phenomenon beats + season/holiday awareness.
- **Phase 5 — Variety engine + prevent-recurrence (L6 + Part I Phase 5).** Recency across all axes; lock the
  quality bar so it can't rot (a QA harness + the source-classifier fix).

## 16. How we judge "amazing" (QA method)

Same discipline as bot work: **shadow-render batches reviewed in the app**, graded against the dream-quality
bar, one variable per round, ≤3 rounds per phase. For the revamp specifically:
- A **scene-only QA harness** (like `force_holiday_scene` / `force_scene_category`) that renders a no-cast
  scene for a given (location × look × mood) so we can sweep the matrix on demand.
- A **"same place, five ways" test** each phase: render one location five times and confirm five *distinctly
  beautiful, varied* results (not five near-dupes) — the anti-slop litmus.
- Watch it on real no-cast users' feeds for a few nights before calling a phase done.

## 17. Open questions for Kevin (steer the revamp)

1. **How dreamlike?** Should scene-only stay mostly *photoreal-cinematic* (a gorgeous real place) with a light
   artful touch, or lean fully into **dreamlike/surreal reimaginings** (their place with impossible light /
   floating elements / oversized moons) for high-Surreal users? *Recommend: photoreal-cinematic default,
   dream-surreal gated on the Surreal slider — so it's personal, not uniformly weird.*
2. **Art-treatment palette (L2)** — how wide? A tight set of ~8 gorgeous registers (cinematic film / oil /
   watercolor / golden-hour photo / dreamy-painterly / ink-and-wash / gouache / storybook), or broader?
   *Recommend: start ~8 curated, expand after QA (the MangaBot lesson: curated-for-composability beats
   gen-scripted near-dupes).*
3. **Photoreal vs painterly balance** — some users will love a cinematic photo of Santorini; others a painterly
   dream. Roll both, or bias by their aesthetic picks? *Recommend: roll both, lightly biased by the user's
   saved art-styles.*
4. **Priority order** — I've put art-treatment rotation (L2) first as the biggest visible win after the anchor
   fix. Agree, or lead with mood-personalization (L3)?
5. **Scope of ambition for v1** — ship L1+L2 as a strong v1 (clean anchors + beautiful varied looks) and layer
   L3–L6 after, or design the whole thing before shipping? *Recommend: ship L1 then L2 fast (visible wins),
   then layer.*

## 18. Sequencing note

Part I (anchor recalibration) is **independent and ready** — it improves scene-only *today* regardless of the
revamp, and everything in Part II renders *through* those anchors, so it should land first. Part II is a
design-forward effort I'll spec in detail per phase once you've steered §17. Nothing in Part II is a blocker
for shipping Part I.
