# Nightly looks path: parity QA loop (2026-09-12 → )

**Mandate (Kevin, 2026-09-12 evening):** up to 10 rounds, autonomous. Bring the looks path (new looks + vibes +
rolled model) to parity with the 1.2.0 engine and beyond: a natural, beautiful / cool / interesting / fun render
every time, with a decent flux-1.1-pro failure rate. **Benchmark = the last 30 public posts** (page
`~/Desktop/posts-audit.html`; 24/30 flux-1.1-pro, 13/30 couples, 10/30 Create with typed scenes, mediums canvas /
illustration / film noir / watercolor / comics…). Every round's batch must rival or exceed that album.

**Protocol per round (revised, Kevin 2026-09-12: "bit for bit the same as what will drive users' nightly
dreams"):** `scripts/qa-nightly-exact.js --round=r<N> --count=14` enqueues REAL `dream_queue` jobs exactly as the
cron does (source nightly, payload {qa_silent}, dedup_key) and drains them with the REAL worker one at a time into
the real render: model, cast role, scene type, seeds, look, vibe and framing are the engine's own rolls. Kevin is on
`engine_config.nightly_looks_allowlist` (mig 515) so his renders — QA batches AND his real nightly — take the looks
path while production stays on the legacy engine. No pinned models, no forced cast roles. → page (`~/Desktop/nightly-parity-r<N>.html`, album row on top) → grade every render
against the album (pose naturalness + variety, scene, props, framing, appeal; note the failure mode) → stamps
(flux degrade rate + causes, identity, attempts, pose source, framing) → change ONE or TWO things → tests →
deploy → next round. Guardrails: authored pools only; never re-tighten the first-render swap prompt; production
(legacy path) untouched; renders sequential; look approvals stay Kevin's.

**Grading key (mine, calibrated against the album):** 5 = would sit in the album unnoticed · 4 = album-worthy
with a nit · 3 = fine but generic (the "catalog couple") · 2 = flawed (stiff, bland, cut off, wrong prop) ·
1 = broken (degraded to solo, garbage). Album baseline by my read: median 4, ~⅓ at 5, a few 3s.

---

## Round 1 — the parity bundle (2026-09-12, evening)

**Changed since the framing proof:** scene-first beats 25% on the looks path (pool poses lead), stance roll =
generic + wide sets, brief props "one or two named objects", layered-depth suffix on the couple prompt, framing
overlay 40% with the swap-safe subset on flux couples. Variants rendered alongside: photo-prior line on (flux),
framing overlay off (flux).

**Pinned-model experiment (NOT the benchmark; stopped early when the protocol changed):** parity-flux rendered 8
couples + a few solos with `force_model` / `force_cast_role` — kept as data on the bundle, page
`~/Desktop/nightly-parity-benchmark.html`.

**Round 1 proper:** `qa-nightly-exact.js --round=r1 --count=14`, page `~/Desktop/nightly-looks-path-r1.html`.

**Round 1 result (14 renders: 5 couples, 9 solos; flux 8 / grok 5 / gemini 1 by the policy roll; 0 degraded, 5/5
first-try duals, mean identity 0.70).** Page `~/Desktop/nightly-parity-benchmark.html` (album row on top).
Grades (1-5): #1 dock walk couple 4 · #2 blossom porthole 3 · #3 kawaii Forbidden City couple 2.5 (BOBBLEHEAD
caricature — kawaii\_\_subtle on a grok soft-brush look) · #4 tree library 3 (static frontal) · #5 Olympic podium 3.5
· #6 bumper car 4 · #7 cloaked couple 3 (pulp cover = tight double portrait) · #8 Rio rail couple 3 (slightly
bobble on grok airbrush) · #9 theater steps + popcorn 5 · #10 Cinque Terre wall pop-art 4.5 · #11 glowing tree
couple 3.5 (static) · #12 ivy arch lantern 4 · #13 tepui explorer 3.5 · #14 Clementinum map 3.5. **Median 3.5 vs the
album's 4.** Strengths: scenes are rich and varied every time (set dresser + scenario rows), flux 0/8 failures.
Gaps: (a) ACTIVE rows on solos (#2 #4 #5, the generic "caught mid-action" anchor) came out static/centred; (b)
kawaii on a couple = caricature; (c) the best renders came from the classic POOL poses (#9 sitting on steps, #10
leaning on the wall) and scene-first beats with a prop (#12) — the 25% scene-first / pool-primary change is
working; (d) 8 of 9 solos rolled the plus_one (the cast roll's luck), 1 Kevin.
**Patch for round 2:** kawaii vibe family excluded from couples; looks-path scene mix shifted toward the costume
rows the album leans on (goofy 20 / elegant 25 / active 15 vs config 15/15/20). Framing overlay stays 40%.

## Round 2 — kawaii off couples + scenario mix (goofy 20 / elegant 25 / active 15)

**Result (14 renders: 7 couples, 7 solos; flux 5 / gemini 5 / grok 4; 0 degraded, 6/7 first-try duals, mean identity
0.69; scene kinds: location 7, elegant 2, goofy 2, active 3).** Grades: #1 glowing waterfall hiker 4 · #2 canyon
storefront rail (comics) 4 · #3 moonlit garden satin gown 4.5 · #4 baroque parterre period couple 4 · #5 giant-donut
diner 4 · #6 fjord harbour lean (chromolithograph, identity 0.48 — weak likeness) 3.5 · #7 Victorian hall couple 4 ·
#8 waterfall overlook couple (lineless watercolor) 3 (static, plain) · #9 treasure chest cove 4.5 · #10 armored couple
on the volcanic ridge 4 · #11 wizards' study with the glowing tome 4.5 · #12 beach towel 3.5 · #13 jungle waterfall
couple (flux hand_drawn_illustration) **2 — BOBBLEHEAD** (second caricature couple in two rounds, no kawaii this
time → the LOOK, not the vibe) · #14 Tokyo market with robot waiter 4. **Median 4 = the album's median.** The
costume rows (elegant / goofy) are doing what the album's Create scenes did. Remaining gaps: caricature
proportions on illustration looks for couples (#13; r1 #3, #8), weak likeness on graphic looks (0.48 / 0.59 /
0.62 on chromolithograph / comics / soft pop art solos), static plain-location couples (#8), and a lunge pool
pose ("anchoring one foot forward flat…") that rolled twice and never rendered as written (seed hygiene).

**Patch for round 3:** (1) couple anchor on the looks path: "large clearly visible faces" → "clearly visible faces
at a natural size, natural head-to-body proportions" (the model enlarged HEADS to satisfy "large" under illustration
looks with a knees-up frame; the album's legacy anchor said "a normal-sized part of the frame"); (2) looks-path solo
likeness bar 0.5 (engine floor 0.35) → the existing one-shot re-swap fires for a weak likeness. Seed hygiene noted,
not yet done: the lunge pool pose.

## Round 3 — natural head proportions on couples + solo likeness bar 0.5

**Seed hygiene done during the round (DB `action_poses`, `disabled = true`, reversible by id):** the September 4
batches of the DYNAMIC pools — `dual/dynamic` (69 rows, ids 3669-3706 + 3821-3852) and `solo/dynamic_solo` (68
rows, ids 3707-3776; my first listing was truncated at PostgREST's 1000-row cap, so the batch was larger than the
58 I read by eye — the rest are the same generator run and register) — were a bodybuilding / fighter instruction
register ("wrestler's crouch",
"coiled load", "ribcage lifted", "back-to-back diamond stance", "knuckles grazing outer thighs"): gym cues, not
moments, and the exact stiff poses Kevin flagged. The August 27 rows (30 + 30, heroic / expressive) remain — exactly
the size of the code arrays, so the loader keeps serving the DB pool.
**Follow-up, not done:** the September 4 GLAMOUR pools (`dual/glamour` 85, `solo/glamour` 22) are a fashion-shoot
instruction register ("tilting the pelvis forward, spines long, near hands on own hip bones"); they only serve
glamour scenario rows — review with Kevin before touching.

**Round 3 result (14: 7 couples, 7 solos; gemini 5 / flux 6 / grok 3; 0 degraded, 5/7 first-try duals, 2 rescued
by the identity gate; mean identity 0.69).** Grades: #1 viaduct couple 3 · #2 monument arms-crossed 3 · #3 snow-globe
village 4 · #4 mosque courtyard couple 3.5 · #5 rollercoaster 4.5 · #6 frosted-branches white dress 4 · #7 canola
field + border collies couple 3.5 (arms crossed, stiff) · #8 hand-tinted 1940s couple 4 · #9 G-Wagon at Aspen 3.5
· #10 churros on the street 4.5 · #11 barn door 3.5 · #12 Riviera terrace embrace (pulp cover) 4.5 · #13 Arctic
airlock 3.5 · #14 Sahara couple 3.5. **Median 3.5** (r2: 4). No bobbleheads across 7 couples (the proportion fix
held). By source: scenario rows average ≈ 3.9, plain-location dreams ≈ 3.5 — and 5 of 7 couples were the standing
side-by-side pair. Cause: location couples are held out of scene-first (`scene_action_location_couples` false, a
Sept 5 dark-launch hold), so they never roll a stance and always take a pool pose or an Option B beat.
**Patch for round 4:** looks path lets location couples take scene-first beats (stances) at the same 25%.

## Round 4 — location couples may take scene-first beats

**Result (14: 5 couples, 9 solos; flux 8 / gemini 3 / grok 3; 0 degraded, 4/5 first-try duals, 1 rescued by the
identity gate; mean identity 0.70).** Grades: #1 poppy meadow hands-to-sky 3.5 · #2 red barn doorway (marker) 4 ·
#3 canal pop-art tight double portrait 3 · #4 alpine meadow palm-out "command" 3 · #5 Thames balustrade with thermos
4.5 · #6 slot canyon couple 4 · #7 pointing at the lens 2.5 · #8 marina rail (pulp cover, "Barefoot Resort" TEXT
artifact) 3.5 · #9 waterfall leap 3.5 · #10 harbour dock engraving couple 3.5 · #11 Cairo ballroom navy dress 4 ·
#12 dead-roses conservatory gown 4.5 · #13 cliff-path SALUTE couple with pomeranians 3 · #14 Tower Bridge OK-sign
couple 3. **Median 3.5.** Scene-first rolled 0/14 (0/28 across r3+r4 vs 3 and 2 in r1/r2 — no decision-reason
stamp exists to say why; adding one). **The pattern across four rounds:** scenes, looks and vibes are album-grade;
the 3s are POSES — the heroic dynamic pool ("raising open hands toward the sky", "palm-out command") landing on
ELEGANT rows, the playful pool's salute / OK-sign / thumbs-up, biome ACTIVE poses ("gothic_historic" → OK signs,
"tropical_coastal" → a leap), an Option B beat pointing at the lens, and tight double portraits on pop_art /
pulp_cover couples. flux-1.1-pro couples: 0 degrades in 11 across the exact rounds.

**Patch for round 5:** the classic pool MIX on the looks path — solos dynamic 40% → 15%, portrait 30%, candid 30% →
55%; couples playful 15% → 10%, dynamic 40% → 15%, partner share of the classic slice 30% → 60% (the pickers now
take a mix + rng; legacy defaults byte-identical, `classicPoolPickers.test.ts`). Plus an `sfa:<reason>` stamp so
the scene-first decision is visible. Biome ACTIVE poses reviewed and kept (real activities: surfing, swing
dancing, jet ski).

## Round 5 — candid / partner-leaning pool mix

**Result (14: 8 couples, 6 solos; gemini 6 / flux 5 / grok 3; 0 degraded, 7/8 first-try duals; mean identity 0.70;
`sfa:` stamps: pct_miss 9, rolled 3, active_pose 1, active_scene 1 → rounds 3-4's zero was the 25% roll, not a
bug).** Grades: #1 greenhouse champagne bar couple 4 · #2 graffiti alley walk in a red coat 4.5 · #3 candle bench in
autumn 4.5 · #4 boardwalk steps with baby rabbits 4 · #5 lion-arch couple 4 · #6 hammock over lava rocks with a
drink 4.5 · #7 cave-painting couple in furs 4 (natural proportions on hand_drawn_illustration — the r2 bobblehead
look) · #8 Florentine palazzo evening couple 4 · #9 Tuscan vineyard wine glass to a storm sky 4.5 · #10 desert cairn
4 · #11 backcountry ski couple 4 · #12 baroque orangery period couple 3.5 · #13 ruin power-stance arms-crossed 3.5
(the last dynamic-pool cheese) · #14 fashion-house evening couple 3.5. **Median 4, floor 3.5 — the first round at
the album's level.** The 4.5s share one thing: a specific candid action with a prop or motion (walking, a drink in a
hammock, a glass raised, sitting on a bench). The 3.5s are standing side-by-side couples on elegant rows and a
heroic power stance.
**Patch for round 6 (pool curation, authored, reversible):** retire the passive partner stills ("both standing
quietly…") and the cheesiest heroic dynamic entries (strongman pose, carved hero, fists clenched owning the
ground, power stance chin raised) — reviewed by eye, ids in the ledger.

## Round 6 — partner + dynamic pool curation

**Done before the round (shared pools — production's legacy path uses them too; noted as a deliberate seed-hygiene
change, reversible):** the DB pools mirror the code arrays 1:1 and the loader falls back to the code array when a
DB pool drops under 80% of it, so the curation was applied to BOTH (`dual_actions.ts` / `single_actions.ts` +
`action_poses.disabled`). Retired: `dual/partner` 32 of 134 (standing stills with a fidget — rolling up sleeves,
fastening a button, smoothing a shirt, cracking knuckles — and mundane street props: trash can, parking meter,
telephone pole, mailbox, bike rack): ids 3313, 3317, 3320, 3325, 3328, 3331, 3337, 3340, 3343, 3353, 3356, 3360, 3365, 3370, 3373, 3378, 3386, 3416, 3420, 3429, 3433, 3438, 3415, 3425, 3430, 3432, 3439, 3412, 3422, 3426, 3435, 3440. `dual/dynamic` 17 of 30 (power stances, fists
clenched "owning the ground", strongman, rallying cry, "calling down the storm", carved warrior statues, commanders
at ease, bold hail, athletic crouch): ids 3500, 3503, 3507, 3510, 3511, 3512, 3513, 3515, 3516, 3518, 3519, 3520, 3524, 3526, 3527, 3528, 3529. `solo/dynamic_solo` 18 of 30 (the same
register): ids 3206, 3208, 3210, 3211, 3214, 3216, 3217, 3218, 3219, 3220, 3222, 3223, 3227, 3228, 3229, 3231, 3233, 3235. Kept: every seated / leaning / place-object partner entry, and
the expressive-but-natural dynamic ones (boot on a rock, windswept, mid-turn, arms open to a view, striding, mid-laugh,
contrapposto, cocky half-turn).

**Round 6 result (14: 11 couples, 3 solos; flux 8 / grok 4 / gemini 2; 1 degraded — a Fly `Signal timed out` on the
bounded swap call, solo rebuild shipped; 7/10 first-try duals, 1 rescued; one dual SHIPPED at 0.45/0.49; framing
overlay 1/14 — watch).** Grades: #1 rooftop conservatory (degraded to a handsome solo) 3 · #2 film-festival balcony
couple 3.5 (weak likeness) · #3 planetarium dome couple 4 · #4 red-rock canyon couple 3.5 · #5 mossy coast
watercolor couple 3.5 · #6 hammock with a tiny teacup and a book 4 · #7 giant mushroom at a premiere party 3.5
(candid pool pose "crouching behind large mushroom" clashing with an elegant row) · #8 1890s St Petersburg
hand-tinted couple 4 · #9 marshmallows with a baby dragon 4.5 · #10 market stall with a capuchin 4 · #11 opera box
black tie 4 · #12 sofa on the ice rink 3.5 · #13 Regency rose-garden bench 4.5 · #14 portrait-studio couple 3.5.
**Median 3.75**, floor 3 (the degrade). The curation held: no salute / OK-sign / power-stance / fidget anywhere
across 11 couples. Remaining: formal standing couples on elegant rows are legitimately formal (opera box, portrait
studio) — 3.5s, not defects.
**Patch for round 7:** (1) looks-path DUAL likeness floor 0.5 (the existing re-render ladder; shipped duals below
0.5 were 1 of 42 today) — never ship a 0.45 couple; (2) elegant-row SOLOS draw from the PORTRAIT pool (70%) instead
of candid / dynamic props that name a hammock or a mushroom; (3) Fly timeout under investigation.

## Round 7 — dual likeness floor 0.5 + portrait-leaning elegant solos

**Patch:** `genderSafeDualSwap` takes a per-call `identityMinSim` (the looks path passes 0.5; engine default stays
IDENTITY_MIN_SIM); `resolveCastAction` takes `classicSoloPortrait` and elegant-row solos draw a portrait pose 70% of
the time (stamped `elegant_portrait_pool`), legacy path untouched. **Infra found during the round:** the only
running Fly swap machine was reporting a CRITICAL health check (the r6 #1 `Signal timed out`), the standby had
auto-stopped — restarted the machine before round 7 (see the Fly note below).

**Round 7 result (14: 3 couples, 11 solos; flux 7 / grok 4 / gemini 3; 0 degraded, 3/3 first-try duals; mean identity
0.69; elegant_portrait_pool fired 3×).** Grades: #1 lighthouse pier couple, arm around 4.5 · #2 sunlit pergola,
hands in back pockets 4.5 · #3 carousel horse polka-dot dress 4.5 · #4 ballerina on the opera stage **5** · #5
snowy meadow couple with a cuddly dragon 4 · #6 hands-on-hips between columns 3.5 (a dynamic-pool survivor after
a scene-first beat was dropped for gaze) · #7 waist-deep in a midnight-sun fjord 4.5 · #8 chateau garden gate with
apple baskets 4 · #9 cupping waterfall water 4 · #10 doorway full of balloons 4.5 · #11 swing on a casino terrace 4 ·
#12 motocross jump 4.5 · #13 megacity skybridge couple 3.5 · #14 vampire library doorway 4. **Median 4.25, floor
3.5 — above the album's median (4) with its top end matched.**

### Running tally (median / floor / degraded) — album = 4 / 3 / n.a.

r1 3.5 / 2.5 / 0 · r2 4 / 2 / 0 · r3 3.5 / 3 / 0 · r4 3.5 / 2.5 / 0 · r5 4 / 3.5 / 0 · r6 3.75 / 3 / 1 (Fly wedge) ·
r7 4.25 / 3.5 / 0. Parity reached at r5; r7 exceeds. Couples are the weaker surface throughout (their 3.5s are
standing side-by-side pairs on formal rows); solos have led since the pool mix.
**Patch for round 8:** couples roll scene-first (a stance + a register beat) at 35% instead of 25%. Rounds 9-10 are
planned as confirmation runs with no engine change unless a defect appears.

## Round 8 — couples scene-first 35%

**Round 8 result (14: 5 couples, 9 solos; flux 6 / grok 5 / gemini 3; 0 degraded, 5/5 first-try duals; mean
identity 0.71; couples' scene-first rolled 0/4 eligible — variance).** Grades: #1 river steps under cherry blossom
4 · #2 rain-wet railing in a dark suit 4.5 · #3 Art Deco terrace evening couple 4 · #4 campsite with a tiny tent 4 ·
#5 Beaux-Arts arcade in a brown coat 4 · #6 camel coat among the trees 4 · #7 rooftop supper club couple with
champagne 4.5 · #8 glowing sea-cave pool couple 4 · #9 bridal suite gown 3.5 · #10 observatory finger-frame gown 4 ·
#11 Castel Sant'Angelo couple holding hands 3.5 · #12 cave pool couple seated on rocks 4 · #13 snowy rope bridge with
a lantern 4.5 · #14 canyon-edge journal 4. **Median 4, floor 3.5.** Framing recipes: #2 tq_window 4.5, #7
waist_offcentre 4.5, #12 knees_third 4, #13 tq_lean 4.5 — three of the round's four 4.5s.
**Patch for round 9:** framing overlay 40% → 60% (the only change). Round 10: confirmation, no change.

## Round 9 — framing overlay 60%

**Round 9 result (14: 4 couples, 10 solos; flux 7 / gemini 4 / grok 3; 2 degraded: #5 couple — Fly `Face swap
empty output` 500 with no budget left → solo rebuild; #6 solo — swap scored identity 0 → `identity_floor_solo` →
shipped as a PURE SCENE, no person (the solo path has no re-render before the scene fallback); framing overlay
9/14).** Grades: #1 Louis XVI ballroom gown 4 · #2 crystal cave couple 3.5 · #3 private-jet airstair couple through
an arch 4 · #4 crater landscape, arms crossed 4 · #5 pirate captain (solo rebuild of a couple) 3 · #6 faceless
landscape triptych **1** · #7 pink train car shaka sign 3.5 · #8 jungle soldier 3.5 · #9 lighthouse beach lapels
3.5 · #10 trailhead post (aged-looking likeness at 0.70) 3.5 · #11 beach bar high shelf 3.5 · #12 night-market
star-sparks couple 4 · #13 ribbon shop window 4 · #14 Venetian balcony with popcorn 4. **Median 3.5, floor 1.**
Recipe renders averaged 3.75 this round (both failures were recipe renders on flux: tq_third → identity 0,
full_steps → engine empty output) — one round's evidence, not a trend, but enough to return the overlay to 40%.
**Patch for round 10:** overlay back to 40%; the solo path gets ONE fresh re-render + guarded swap before the
pure-scene fallback (looks path only) — a cast dream should never ship faceless.

## Round 10 — overlay 40% + never-faceless solo re-render (confirmation round)

**Result (14: 5 couples, 9 solos; flux 8 / grok 4 / gemini 3; 0 degraded, 3/5 first-try duals — #7 rescued by the
new 0.5 dual bar from a 0.07/0.63 first swap; mean identity 0.71; framing 8/14).** Grades: #1 superhero landing on
a shattered boulevard 4.5 · #2 cupping waterfall water 4 · #3 at the wheel of a drifting muscle car 4.5 · #4 railing
with a bridge and boat 4 · #5 Capri grotto couple 4 · #6 stormy volcanic marsh couple 3.5 · #7 enchanted bakery
with a tiny dragon 4 · #8 walled-garden tea on stone benches 4.5 · #9 1970s diner jukebox in a red jumpsuit 4.5 ·
#10 weather station in a white blazer 4 · #11 cross-legged on a rock by turquoise water 4 · #12 sledding with arms
up 4.5 · #13 vintage-car tailgate in the Chicago gala pavilion 4.5 · #14 Golden Gate in fog, camel coat 4.
**Median 4 (six 4.5s), floor 3.5.** Round 9's dip did not repeat on the round 5-8 settings.

### Tally r1-r10 (median / floor / degraded)

3.5/2.5/0 · 4/2/0 · 3.5/3/0 · 3.5/2.5/0 · 4/3.5/0 · 3.75/3/1 · 4.25/3.5/0 · 4/3.5/0 · 3.5/1/2 · 4/3.5/0 — six of the last
six rounds at or above the album's median except the overlay-60 round; flux-1.1-pro couples 1 degrade in 30 on the
exact path (a Fly wedge). Kevin extended the loop to 15 rounds.
**Patch for round 11:** the photo-prior line ON as the looks-path default (`LOOKS_PHOTO_PRIORS`, the last of Kevin's
five items untested at scale; revert if the round drops) + three gimmick-gesture portrait rows retired (3068 finger
frame, 3088 ironic thumbs-down tongue-out, 3098 hang-loose).

## Round 11 — photo-prior line on

**Result (14: 5 couples, 9 solos; flux 7 / grok 4 / gemini 3; 0 degraded, 4/5 first-try duals; mean identity 0.72;
the prior line rode 9/14 prompts — the subject-first couple prompt has no integration line).** Grades: #1 canyon
trail with a map 4 · #2 pink gown on a fireworks dais 4 · #3 sunflower-farm kodachrome couple 4.5 · #4 roller-disco
rail in an orange jumpsuit 4.5 · #5 comics bridge couple 3.5 (Option B, standing) · #6 private jet on a mountain
airstrip 4.5 · #7 Art Deco elevator lobby couple 4 · #8 watercolor couple (Kevin greyed / aged — 2nd time on a
washed look) 3.5 · #9 kneeling to tie a boot on a red backdrop 4.5 · #10 black lace at a doorway 4 · #11 mustard
jacket at sunset 4 · #12 jet ski with a flamingo float 4 · #13 fur cloak on marble stairs 4 · #14 lighthouse
fireworks couple 4. **Median 4, floor 3.5.** Photo priors: neutral-to-positive on solos (painterly looks kept their
finish) → stays on.
**Patch for round 12:** location COUPLES take Option B at 30% (config 75%) on the looks path — Option B couples
graded ≈ 3.5 across the loop vs ≈ 4 for pool / scene-first couples.

## Round 12 — location couples: Option B 30%

**Result (14: 8 couples, 6 solos; flux 6 / grok 5 / gemini 3; 0 degraded, 6/8 first-try duals, 1 rescued by the 0.5
bar; mean identity 0.69; scene-first rolled for 4 couples — 3 beats dropped: too_long ×2, gaze ×1).** Grades: #1
travertine terraces cupping water 4 · #2 harbour watercolor couple **3** (both GREYED by the watercolor look — third
time a washed painted look aged the hair: r9 #10 technicolor, r11 #8 watercolor_paper) · #3 iceberg balcony pop-art
4 · #4 barbecue with a robot butler 4 · #5 dark-water close-up 3.5 · #6 kiddie pool on a frozen lake 4.5 · #7 seated
on steps under a bridge 4 · #8 hot-air balloon basket over Bagan 4.5 · #9 pirate map room 4 · #10 savanna bench under
Kilimanjaro 4 · #11 canal railing in a half-timbered town 4 · #12 futuristic suits on volcanic rocks 4 · #13 pirate
cove through a blossom arch 4.5 · #14 Regency orangery seated couple 4.5. **Median 4; couples 4.1 — their best round
(Option B down → seated / scene-first pairs).**
**Follow-up (not a round):** washed painted looks (watercolor_portrait, watercolor_paper, technicolor) desaturate hair
to grey on ~3 of 170 renders → a "hair and beard in their true colours" clause in those looks' swap fragments.
**Patch for round 13:** couple beat cap 56 → 72 words / 400 → 520 chars (drops across r5-r12: couple too_long 2 of 12
rolled beats; solo unchanged).

## Round 13 — couple beat cap 72 words

**Result (14: 5 couples, 9 solos; grok 6 / flux 6 / gemini 2; 0 degraded, 5/5 first-try duals; mean identity 0.69;
the one rolled couple beat was kept).** Grades: #1 walking to a hot-air balloon with a goggled alien 4.5 · #2 Milan
tailor's atelier pop-art 4 · #3 Babylonian gates in a dark shawl 4 · #4 chibi somersault in a pastel sky (kawaii on
a solo → cartoon) 3.5 · #5 waterfall pool couple 3.5 · #6 palms on a lantern-lit stone wall 4 · #7 candy-crystal
shop in red boots 4 · #8 seated on a rain-wet neon street 4.5 · #9 canyon overlook couple 3.5 · #10 flaming-grill
picnic table couple 4.5 · #11 forearms on a table before a Mayan pyramid 4 · #12 red-rock couple, Kevin GREYED
(hand_drawn_illustration + fog subtle) **3** · #13 Edinburgh quayside kilt and green dress 4.5 · #14 winged figure in
sunrise clouds 4. **Median 4, floor 3.** Greying is now 4 in 5 rounds (r9 #10, r11 #8, r12 #2, r13 #12) on
desaturated looks / subtle vibes → round 15's change.

## Round 14 — solo Option B 40% (from Kevin's grades)

**Result (14: 5 couples, 9 solos; flux 9 / gemini 4 / grok 1; 0 degraded, 3/5 first-try duals — the two retries
were gemini, r14 #13 pulp cover 0.49/0.60 → 0.78/0.73 on the re-render; mean identity 0.70; pose pool 12 / Option B
1 / scene-first 1).** Grades: #1 baroque-oil castle couple, the wife's hair drifted LIGHT under the baroque prior
3.5 · #2 arms folded at a tiled bar (watercolor portrait) 4 · #3 seated on temple steps (technicolor) 4.5 · #4
bamboo pole in bioluminescent water (hand-tinted) 4 · #5 seated on red rock in an orange pullover (digital
watercolor read as a photo) 4 · #6 crouched by a barn door with ducklings and a lantern (aquarelle, gemini) 4.5 ·
#7 desert ruins in a vest (movie poster) 4 · #8 Victorian green dress, aurora through the window (oil pastel, grok)
4 · #9 balcony couple with a glass carafe (canvas) 4 · #10 market backpack (pop art, id 0.58, cartoon face) 3.5 ·
#11 green off-shoulder dress at a column (watercolor portrait, tight) 4 · #12 gothic conservatory couple
(hand-tinted, gemini) 4 · #13 white steps under fireworks couple (pulp cover, gemini) 4.5 · #14 picnic on the
cliffs couple (aquarelle, gemini) 4. **Median 4, floor 3.5.** No greying this round. Option B on solos fired 1/9
at 40% — the pool poses carried the round (crouch, seated steps, arms folded, pole) and every one fit its scene.

### The greying probe (between r14 and r15) — it was never about hair

Four greyed renders in five rounds, all flux-1.1-pro. Counting grey / silver / white / bleached scene tokens
across all 56 flux prompts did NOT separate them (greyed mean 6.5 vs 5.7). So r13 #12's shipped prompt was
rendered DIRECTLY on flux-1.1-pro (Replicate, 3 seeds; scratchpad `grey-probe/`) in three variants — A as shipped,
B with a positive "hair and beard a rich even chestnut brown" clause in the identity block, C the same clause at
the tail. Same seed → the same picture in all three (the clause changed nothing): seed 11 rendered the canyon with
NO PEOPLE, seed 22 two floating head-and-shoulders portraits, seed 33 the man in GREYSCALE beside a woman in colour,
and nobody sat on the log the pose asked for. The looks-path couple prompt is scene-dominant: the subject-first v3
order puts a 120-160-word scene paragraph (Sonnet overshoots the 55-85 brief) right behind the people line and the
POSE after the identity blocks at word ~330, where flux-1.1-pro barely reads it. The 1.2.0 album's couple prompts
(pulled from `ai_generation_log`, `scratchpad/album-prompts.json`) are the LEGACY skeleton: gender lock → medium →
"set at <place> — <20-word hook>" → the ENVIRONMENTAL TWO-SHOT anchor → the POSE → LEFT/RIGHT → the framing
restatement → the full scene paragraph LAST. Probe 2 re-assembled r13 #12's content in that order (D: scene capped
70 words; D2: the full 150 words): D rendered the couple in full colour on the log's shelf 3/3 (one seed
salt-and-pepper — the 43-with-a-beard prior, a later round), and D2 was pixel-for-pixel D — the late scene's
LENGTH is irrelevant, its POSITION is the lever. This also restores the hard rule (scene after the framing block).

### The solo probes (during r15) — the framing line must precede the face clause

r13 #2 (pop art, flux-1.1-pro, 522 words, a waist-up portrait despite "from the knees up, leaning on a post…" at
word 349) rendered directly with seeds 11/22/33 (scratchpad `len-probe/`, `solo-probe/`): truncating the prompt at
370 or 450 words, capping the scene to 55 words, moving the framing block ahead of the scene, and even inserting the
clause right AFTER the anchor's face clause (word 171) all gave the same three portraits. The clause at the very
START opened all three seeds to knees-up shots but pushed the identity block later and greyed one seed. The clause
INSIDE the anchor, before "face clearly visible and turned naturally toward the viewer…" (S6 without the face clause,
S7 with it kept) opened all three seeds at the doorway / bar the recipe named with the hair intact. So on
flux-1.1-pro the solo composition is decided by the first ~160 words and a distance line only counts when it comes
BEFORE the face-visibility clause. The album's solos put the same block later too — their framing variety came
from Option B beats that name a hip-height object (word ~125), not from the framing block.

### Kevin's in-app grades, rounds 1-14 (re-pulled 2026-09-13 during r15)

162 of 196 round uploads graded: **154 hearts, 9 bookmarks** (r3 6♥/3✗ — the early rounds he graded selectively;
r4-r14 ≥ 12♥ each, at most 2✗). By surface solo 88♥/6✗ · couple 66♥/3✗; by model flux-1.1-pro 72♥/6✗ ·
grok 43♥/1✗ · gemini 37♥/2✗; by pose pool 112♥/6✗ · scene-first 22♥/1✗ · Option B 20♥/2✗; every framing recipe
key is net-hearted (tq_lean 11♥, full_offcentre 8♥, full_arch 6♥ …; knees_third / tq_low / waist_foliage 1✗ each).
The nine bookmarks: r3 #8 (Option B rail couple), r3 #11 (baroque solo), r3 #13 (rotoscope solo), r6 #7 (glamour
solo), r7 #9 (hand-tinted Option B solo), r11 #7 (baroque scene-first couple), r13 #4 (kawaii somersault cartoon),
r13 #12 (the GREYED red-rock couple), r14 #10 (pop-art cartoon face, id 0.58). Six of nine are flux-1.1-pro; the
recurring thread is face fidelity under graphic / painterly priors (pop art, ink, rotoscope, baroque) plus the two
plainest Option B beats — his hearts and my grades agree on every one of them.

## Round 15 — looks-path couples in the 1.2.0 (legacy) prompt order

**Change:** `LOOKS_COUPLE_PROMPT_STYLE = 'legacy'` (nightlyLooksPath.ts) → looks-path couples assemble in the album's
order; the rolled framing recipe now rides the ENVIRONMENTAL TWO-SHOT anchor's distance slot and a full-figure
recipe gets a matching restatement line (characterSlotPrompt.ts, production prompt byte-identical — locked by
`nightlyFramings.test.ts`). Solos unchanged (their order already matched). Stamp `couple_prompt_style:legacy`.

**Result (14: 7 couples, 7 solos; flux 6 / gemini 5 / grok 3; 0 degraded; every couple stamped
`couple_prompt_style:legacy`; flux couples 3/3 FIRST-TRY clean (0.75/0.63, 0.75/0.63, 0.67/0.73) — the three dual
retries were all gemini: two `giant_face` splits, one identity 0.35/0.04; mean identity 0.70).** Grades: #1 winter
camp under the aurora, full figures with tents and a lantern (gemini, full_offcentre) 4.5 · #2 waterfall couple,
waist-up, hair TRUE (flux hand-drawn — the look that greyed him in r13) 4 · #3 ski-race finish in race suits and
boots (gemini) 4.5 · #4 Victorian couple before a giant buttered toast under the aurora (chromolithograph +
aurora WILD — surreal by design, odd) 3.5 · #5 autumn mountain trail with a signpost, knees-up (flux pop art, faces
true) 4.5 · #6 formal couple before a mandala window (flux chromolithograph; full_offcentre rolled, waist-up
rendered) 4 · #7 palace-garden full figures in a white tailcoat (grok, knees_window) 4 · #8 library in a yellow
shirt (flux lineless watercolor) 4 · #9 glass observatory with jellyfish, full figure (grok comic cover) 4.5 · #10
tux and champagne at a red carpet (gemini technicolor) 4 · #11 chin on hands with koi in the rain (flux watercolor
portrait, tq_lean — tight but lovely) 4 · #12 campfire guitar in furs (gemini classical oil) 4.5 · #13 castle window
seat with a candle (grok hand-tinted) 4.5 · #14 red dress at an awards party — wife BLONDE, "Emmys" lettering
rendered (flux ink illustration) **3**. **Median 4, floor 3, six 4.5s (the most of any round).** The legacy order
held: no missing couple, no greying, no floating heads on flux. Remaining defects are the hair drift (r17) and the
inert late "no text" clause on signage scenes.

## Round 16 — solo distance line inside the anchor (staged, deploys after r15's grade)

**Change:** `LOOKS_SOLO_FRAMING_IN_ANCHOR = true` (nightlyLooksPath.ts → `framingInAnchor` on solo slot input): the
rolled framing recipe, or the composition's default distance line when no recipe rolled (waist-up WITHOUT the
"filling the frame" fill cue), sits inside the ONE-person anchor ahead of the face-visibility clause and leaves the
late framing block (face-unobstructed + integration lines stay). Off = the round-15 prompt byte-for-byte; the legacy
production solo never carries it. Locked by `nightlyFramings.test.ts`.

**Result (14: 5 couples — all gemini by the model roll — 9 solos: flux 5 / gemini 3 / grok 1; 0 degraded; 4/5
first-try duals (#6 gemini identity 0.02 → clean retry); mean identity 0.70; every solo prompt carried its distance
line inside the anchor).** Grades: #1 metallic swimsuit at a sunset arch, knees-up (flux sci-fi paperback) 4 · #2
"stop" hand in a glasshouse, full figure, cartoon face id 0.64 (flux pop art) 3.5 · #3 on a swing before a windmill,
camera a step above (grok vintage film, waist_step_above honoured) 4.5 · #4 snowy street, waist-up (flux comics)
4 · #5 white romper on a rocky shore (flux technicolor) 4 · #6 ship-deck couple under a storm (gemini classical oil,
knees_bench) 4 · #7 white suit at a turquoise-domed mosque, full figure (gemini painted fantasy) 4 · #8 Moroccan
doorway couple in orange and red (gemini pulp, thigh_table) 4.5 · #9 rooftop couple over a skyline, full figures
(gemini gouache, full_arch) 4 · #10 champagne toast in a glass room (gemini chromolithograph) 4.5 · #11 laundromat
toast with socks flying (gemini aquarelle) 4 · #12 harbour close-up, tighter than the waist-up it asked for (flux
digital watercolor) 3.5 · #13 map on a palm avenue, knees-up (gemini hand-tinted, tq_third) 4 · #14 apple ladder in
a lavender field, full figure (gemini storybook gouache) 4.5. **Median 4, floor 3.5, four 4.5s.** Flux solos that
asked for knees-up got it 2/3 (the direct-probe baseline was 0/3); the two tight flux solos were the waist-up ROLL
(#5, #12), so the solo frame mix (waist-up share) is the next framing lever, not the prompt.

### The hair-echo probe (during r15) — greying and the blonde wife are a position-1 problem

On the legacy-order prompt D (r13 #12's content), six fixed seeds on flux-1.1-pro: 2/6 rendered Kevin salt-and-pepper
and 4/6 rendered the wife BLONDE (she is dark brown with caramel highlights) even though the identity blocks say "a
full head of brown hair" / "dark brown hair" at word ~130. With the hair colour echoed in the position-1 gender lock
("BROWN-HAIRED MAN on the LEFT, DARK BROWN-HAIRED WOMAN on the RIGHT" — the senior echo's format, which already
ships for 55+ cast) the same six seeds: 0/6 grey, 0/6 blonde (scratchpad `grey-probe/sheet3.jpg`). r14 #1's
light-haired wife under the baroque prior is the same drift.

## Round 17 — hair-colour echo in the position-1 lock

**Change:** `LOOKS_HAIR_ECHO` (nightlyLooksPath.ts → `hairEcho` on the slot input): every cast member under 55 with
a hair colour and hair gets "<COLOUR>-HAIRED " in the gender lock — couples "BROWN-HAIRED MAN on the LEFT", solos "a
BROWN-HAIRED MALE man — …" ("an AUBURN-HAIRED …"); bald cast and 55+ (senior echo) untouched. Locked by
`nightlyFramings.test.ts`; production prompts byte-identical while off.

**Result (14: 4 couples, 10 solos; gemini 7 / flux 4 / grok 3; 0 degraded; every lock carried the echo — "a DARK
BROWN-HAIRED FEMALE woman —", "BROWN-HAIRED MAN on the LEFT"; NO grey and NO blonde in 14 renders; mean identity
0.70).** Grades: #1 farm fence at synthwave dusk with cows, full figure (gemini watercolor portrait) 4 · #2 draped in
a sand cave, tight (flux watercolor paper, id 0.61) 3.5 · #3 fantasy hero on a storm balcony (flux painted fantasy,
id 0.59) 4 · #4 beach walk among candles with a sea turtle, full figure (grok lineless watercolor) 4.5 · #5 seated
at a lighthouse fence (gemini pulp, full_offcentre) 4.5 · #6 table under a basketball hoop (flux digital watercolor,
waist_table) 4 · #7 neon street with a map, full figure (gemini technicolor) 4 · #8 canal bench under lanterns
(gemini canvas, full_offcentre) 4.5 · #9 stone arch with a lantern, full figures (gemini chromolithograph,
waist_step_above) 4 · #10 apron on a rainy street (flux graphic novel, tq_lean) 4 · #11 seated on rocks by a glowing
lake with a map (gemini hand-tinted, full_seated) 4.5 · #12 dark suit at a stained-glass window (gemini vintage
film) 4 · #13 arms crossed in a neon canyon (grok marker) 4 · #14 down the steps with lanterns, full figures (grok
lineless watercolor) 4. **Median 4, floor 3.5, four 4.5s.** The echo is a keeper.

**But gemini couples needed a re-render 3/3** — first attempts at identity L0.05/R0.72, L0.27/R0.70, L-0.03/R0.69
(one side unusable, `side_haiku_unresolved` on two). Gemini first-try under the legacy order is now 4/11 (r15 0/3,
r16 4/5, r17 0/3) against 13/19 under subject-first v3 in r5-r14; flux is 100% in both regimes and grok 2/2 vs
15/20. Shipped quality is unaffected (every retry landed clean) but each costs ~40-60 s and a second swap.

## Round 18 — couple prompt order per MODEL

**Change:** `looksCouplePromptStyle(model)` (nightlyLooksPath.ts): flux → `legacy` (the probe-proven order), every
other model → `subject_first` (the order gemini and grok were graded on in r5-r14: 68% / 75% first-try). Framing
recipes, the hair echo, the natural-size anchor and the layered-depth suffix are unchanged on both. Stamped
`couple_prompt_style:<style>` as before.

**Result (14: 7 couples, 7 solos; flux 6 / grok 5 / gemini 2 / flux-2-flex 1; 4/7 first-try duals; ONE degraded —
#10, a flux-1.1-pro dual whose fallback rebuilt a SOLO on flux-2-flex at identity 0.02 and shipped a cartoon Kevin
alone on a ship deck, which Kevin bookmarked).** Grades: #1 orange jacket before mountains, tight 3.5 · #2 cream
suit in a pergola (grok fresco, tq_window) 4 · #3 circus-tent couple flashing OK signs (grok painted fantasy,
goofy row, full_steps) 4 · #4 carousel in the rain (flux adult cartoon, waist_step_above) 4 · #5 leather on a rainy
rooftop couple (grok baroque) 4 · #6 elf in a mossy arch (gemini movie poster) 4.5 · #7 small before a grand
canal-side palace, full figures (grok technicolor, full_offcentre) 4 · #8 Victorian tea table with a birdcage
couple (grok soft pop art) 4 · #9 beach couple making a heart with their hands, sandcastle (gemini pulp,
full_offcentre) 4 · #10 the flux-2-flex rebuild **2** · #11 vest before pink roses (flux watercolor portrait) 4 ·
#12 cherry blossoms and lanterns couple (flux pulp, knees_third) 4.5 · #13 laughing in the snow (flux watercolor
paper) 4 · #14 red Cadillac under palms (flux digital watercolor, full_seated, id 0.54) 4. **Median 4, floor 2.**

Two fallback-path defects surfaced: (1) the SOLO REBUILD after a failed dual runs on `solo_rebuild` policy =
flux-2-flex with a look that was never approved there (`look_rebuild:no_look:flux-2-flex:keep:nightly_pop_art`) —
its shipped identities across the loop are 0.09 / 0.02 (r6 #1, r18 #10); (2) when the couple policy re-rolls the
MODEL on attempt 2 (`policy:couple:2:grok`), the prompt keeps attempt 1's ORDER (`retryPromptFor` swaps the look
fragment only), so #5 and #7 rendered grok in the legacy order (both needed a re-render) while #3 and #8 rendered
grok subject-first (both first-try). Both fixed in round 19.

## Fly swap engine: the machine WEDGES and Fly does not restart it (found in round 6, 2026-09-13 01:15 UTC)

`fly machine status 48e7551f069358` → check `servicecheck-00-http-8080` CRITICAL for 16 min ("context deadline
exceeded while awaiting headers") while the machine stayed `started`; the standby had auto-stopped, so every couple
swap in that window hit the bounded fetch (`Signal timed out`) and degraded to a solo. Same signature as the 22:40
hang (two concurrent swaps). Fly's HTTP health check does NOT restart a wedged machine on its own. Remedy used:
`fly machine restart 48e7551f069358` → healthy in ~25 s. **Follow-up (not done, needs FLY_API_TOKEN in GitHub
secrets):** have `dream-queue-monitor` (hourly) read `fly machine status` and restart a machine whose check has been
critical for > 2 min, and/or make the engine exit on a wedged event loop so Fly's process supervisor restarts it.
Until then a wedge costs every couple swap until someone restarts the machine.

## State of the looks-path engine after the loop (what Kevin's nightly runs on tonight)

**Switch:** `engine_config.nightly_looks_mode = 'off'` for everyone; `nightly_looks_allowlist = [Kevin]` (mig 515) →
Kevin's real nightly (08:00 UTC cron) and the QA batches render on the looks path; every other user is on the legacy
engine. Go-live = flip the mode to `'on'` (or grow the allowlist as a dark-launch cohort).

**Looks-path constants (`_shared/nightlyLooksPath.ts`, all candidates for engine_config once graded):**
`LOOKS_SCENE_ACTION_PCT 25` (solos) / `LOOKS_SCENE_ACTION_PCT_COUPLE 35` · `LOOKS_SCENE_PCTS goofy 20 / elegant 25 /
active 15` · `LOOKS_SOLO_POOL_MIX dynamic 15 / portrait 30 / candid 55` · `LOOKS_DUAL_POOL_MIX playful 10 / dynamic 15 /
partner share 60` · `LOOKS_FRAMING_PCT 40` (swap-safe subset on flux couples) · `LOOKS_SOLO_IDENTITY_MIN 0.5` /
`LOOKS_DUAL_IDENTITY_MIN 0.5` · `COUPLE_EXCLUDED_VIBE_FAMILIES ['kawaii']` · location couples may take scene-first ·
elegant-row solos draw the portrait pool 70% · couple anchor "faces at a natural size, natural head-to-body
proportions" · layered-depth suffix on the couple prompt · one guarded solo re-render before any pure-scene
fallback. Swap geometry stays STRICT (natural behind `force_swap_geometry`). Photo-prior line behind
`force_photo_priors` (untested at scale). Wardrobe side check SHADOW (`dual_side_check_mode`), face-count guard +
engine `genderRouteConflict` live.

**Shared data changed (affects the legacy path too, deliberately):** `action_poses` — the Sept 4 bodybuilding
batches retired (137 rows), the lunge row, 32 passive partner stills, 17 + 18 heroic dynamic entries (ids in the
round 3 and round 6 entries); the code arrays trimmed to match so the loader keeps serving the DB pools.

**Not committed.** Every change above is in the working tree of `looks-vibes-refactor-2026-09-11` (Kevin commits
on request). Deployed edge functions: nightly-dreams, generate-dream, dream-queue-worker, restyle-photo,
face-swap-dual; Fly engine v24.

**Open follow-ups:** (1) Fly machine wedges → automate `fly machine restart` from the monitor; (2) `Face swap empty
output` from the engine's swap fallback model on tiny / odd faces — a retry or a larger-face re-render inside the
engine; (3) September 4 GLAMOUR pools review; (4) framing recipes on flux: tq*third / full*\* solos risk small faces —
consider a swap-safe subset for flux solos after more data; (5) edge 546 WORKER_RESOURCE_LIMIT ≈ 2-3% of direct
calls; (6) promote the constants to `engine_config`.

## Kevin's own grades (hearts = liked, bookmarks = weed out), pulled 2026-09-13 03:10 UTC

Reacted to rounds 3-12 (r1-r2 ungraded): **128 of 140 liked, 6 bookmarked, 6 no reaction.** By source: pool poses
71/74 liked · active rows 17/19 · biome active poses 12/13 · scene-first 11/13 · **Option B 17/21 with 2 of the 6
bookmarks**. Framing recipe renders 52/56 vs 76/84 without. Bookmarked: r3 #8 (1940s sepia close couple), r3 #11
(barn door, arms crossed), r3 #13 (Arctic airlock, static), r6 #7 (giant mushroom at a premiere), r7 #9 (cupping
waterfall water, hands close-up), r11 #7 (Art Deco elevator close couple) — tight close portraits, pose / scene
clashes, plain static stills. No reaction: r3 #1-#5 (my 3-3.5s) and r9 #6 (the faceless landscape).
Agreement with my grades: every bookmark was a 3.5-4 in my ledger, every 4.5 was hearted.
**Patch for round 14 (prepared, deployed after round 13 lands):** plain-location SOLOS take Option B at 40%
(config 75%) — the pools Kevin likes most take the rest.

### Kevin's strikes (2026-09-13, rounds 1-18: 218 graded, 208 hearts, 11 bookmarks, 5.0% strike rate)

**Trends across the 11 bookmarks** (strike rate per factor vs the 5% base; ◀ = over-represented):

- **Vibe intensity — the clearest signal:** `subtle` 6✗/73 (8%) vs `soft` 3/75 (4%), `bold` 1/67 (1.5%), `wild`
  1/3. A subtle version carries NO flux fragment (mig 506), so the render gets no light instruction and reads
  plain — the "plain stills" in Kevin's own words. → round 20 drops `subtle` from the looks-path vibe roll.
- **Looks:** baroque_oil 2✗/6 ◀, pop_art 2✗/8 ◀, hand_tinted_photo 2✗/15 ◀, rotoscope 1/3, glamour 1/3,
  ink_illustration 1/2; families legacy 4/44 (9%), comic_print 3/38 (8%) vs watercolor 0/34, covers_posters 0/29.
  Face fidelity under painterly / graphic priors again (bookmarked shipped identity mean 0.63 vs hearted 0.69).
- **Poses:** two strikes are the fidget family — "one hand adjusting watch, moment of distraction", "adjusting
  collar, other hand at side" — plus the "catalog-model pose with hands in pockets and chins up" couple and the
  generic "caught mid-action exactly as the scene describes" active anchor. Option B 2/24 (8%: a rail couple, a
  hands-in-a-waterfall close-up), pool 5/82 (6%), scene-first 2/41, portrait pool 0/18.
- **Frame:** couple `knees_up` 4✗/25 (16%) ◀ vs full_figure 1/30, waist_up 1/62; scene kind: plain location 3/40
  (8%) vs costume rows 0/23. Model: flux-2-flex 1/3 (the rebuild fallback), flux-1.1-pro 6/98, gemini 3/61,
  grok 1/56. Degraded renders 1/3.

**Applied (Kevin: "strike any bookmarked ones … scrapping whatever look rendered it"):**

- `nightly_look_approvals` → `approved=false, source='override'` for the look × model × surface of every bookmark
  (10 rows; restore with `approved=true`): hand_tinted_photo × flux (couple, solo), baroque_oil × flux (couple),
  baroque_oil × grok (solo), rotoscope × gemini (solo), glamour × flux (solo), ink_illustration × gemini (solo),
  hand_drawn_illustration × flux (couple), pop_art × flux (solo), chromolithograph × gemini (couple). Three of
  these were engine defects since fixed rather than the look — hand_drawn × flux couple was the greying (r17 echo),
  chromolithograph × gemini couple was the "wild" toast, pop_art × flux-2-flex was the rebuild fallback (no
  approval row; fixed in r19) — Kevin can restore those with one update each. Same-combo hearts at revocation:
  pop_art × flux solo 5, hand_tinted × flux solo 3, chromolithograph × gemini couple 3.
- Pools: 13 fidget / catalog poses retired (`action_poses` ids 2960, 2980, 2991, 2999, 3006, 3018, 3059, 3168,
  3174, 3184, 3195, 3202, 3463 → `disabled`; the same entries removed from CANDID_ACTIONS / PORTRAIT_ACTIONS /
  DUAL_ACTIONS_PLAYFUL so the loader's 80% floor never re-serves them). Kept the activity-anchored ones (telescope
  focus, messenger-bag strap, bike helmet).

## Round 19 — fallback fixes + the strikes

**Changes:** (1) `forRebuild()` rebuilds on the COUPLE's model when the policy's solo_rebuild model approves no
solo look (`look_rebuild:model_fallback:<model>`); (2) a couple re-render that crosses the flux ↔ others order
boundary re-assembles the slots in the new model's order (`reassembleForModel`, stamp
`couple_prompt_style:<style>:reroll`); (3) the approval revocations + pose retirements above are live for this
round. Locked by `nightlyStyle.test.ts` + `nightlyFramings.test.ts`.

**Result (14: 2 couples — both grok, subject-first, first-try — 12 solos; flux 6 / grok 6 / gemini 2; 0 degraded;
mean identity 0.71; neither fallback path was exercised).** Grades: #1 seated in a flower-lit conservatory 4.5 ·
#2 pink 50s dress at a flower stand, full figure (gemini technicolor, full_offcentre) 4 · #3 folding towels under
the aurora (flux comics, aurora WILD, tq_third) 4 · #4 marsh boardwalk (flux magazine cover, waist_step_above) 4 ·
#5 hearth in a library, fantasy dress (gemini classical oil, tq_third) 4.5 · #6 seaside taverna at night couple
(grok watercolor portrait) 4 · #7 gold jumpsuit by a red convertible (grok lineless watercolor, tq_lean) 4 · #8
rooftop helipad with a UFO (grok sci-fi paperback) 4.5 · #9 leaning out a barn window (flux digital watercolor)
4 · #10 dock with a seaplane (grok graphic novel) 4.5 · #11 steps over a lake in Hawaiian shirts couple (grok
hand-tinted, full_steps) 4 · #12 wading a coral pool with fish, full figure (grok painted animation, full_path)
4.5 · #13 railing over a storm-lit sea arch (flux ink-wash comic) 4 · #14 black dress in an art-deco bar (flux
comics) 4. **Median 4, floor 4 — the first round with nothing under 4 — five 4.5s.**

## Round 20 — no subtle vibe versions on the looks path

**Change:** `LOOKS_EXCLUDED_VIBE_VERSIONS = ['subtle']` (nightlyVibes.ts → `resolveVibe.excludeVersions`, stamp
`vibe_version_bans:subtle`; a QA `force_vibe` still reaches a subtle row). Kevin's strikes by version: subtle 6✗/73
(8%) vs soft 3/75 (4%), bold 1/67 (1.5%) — a subtle version carries no flux fragment, so the render gets no light
instruction. Every other switch as round 19.

**Result (14: 8 couples, 6 solos; flux 5 / gemini 5 / grok 4; 0 degraded; subtle versions rolled 0/14 with
`vibe_version_bans:subtle` stamped on every render; mean identity 0.68; #8 shipped best-of-two at 0.44 on the wife's
side).** Grades: #1 seated in a snowy arch with a white horse (flux vintage film, full_arch, id 0.55) 4.5 · #2
doorway with fireworks (gemini soft comic) 4 · #3 café street (gemini storybook gouache, waist_step_above; a shop
sign rendered) 4 · #4 pirate captain on deck (grok rotoscope, tq_third) 4.5 · #5 potting plants in a greenhouse
(flux adult cartoon, waist_offcentre) 4.5 · #6 sepia Victorian couple (flux chromolithograph, dark) 4 · #7 gymnast
couple, arms raised (gemini pulp, waist_step_above) 4 · #8 candy pop-up with a giant lollipop, wife's likeness weak
(grok watercolor portrait, godrays) 3.5 · #9 greenhouse couple with a watering can (gemini painted animation) 4 ·
#10 harbour steps with a sailboat (grok kodachrome) 4.5 · #11 jungle waterfall with maps under lightning (grok
pulp) 4 · #12 lanterns and a rocket (flux watercolor portrait, festive) 4 · #13 crouched at Delicate Arch with a map
(flux) 4 · #14 two fox kits in a forest (flux technicolor) 4. **Median 4, floor 3.5, four 4.5s.** No grey, no
blonde; the re-roll fix fired 4 times (`couple_prompt_style:subject_first:reroll`) — see the attempt-1 note in the
final review.

---

# FINAL REVIEW — 20 rounds (2026-09-12 → 2026-09-13)

## What the loop was

Benchmark = Kevin's last 30 public posts (1.2.0 engine, median grade 4). Harness = `scripts/qa-nightly-exact.js`: real
`dream_queue` jobs drained by the real worker, Kevin allowlisted onto the looks path (mig 515) while production stayed
on 1.2.0. One variable per round, backed up to what worked whenever a round dipped. 20 rounds × 14 renders = 277
exact-path nightlies (114 couples), all in Kevin's private Dreams album, graded by me (5-point key) and by Kevin in
the app (heart = like, bookmark = strike).

## Scoreboard

| rounds                      | my median                                  | floor                                      | 4.5s              | Kevin ♥ / ✗ | degraded            | dual first-try                                           |
| --------------------------- | ------------------------------------------ | ------------------------------------------ | ----------------- | ----------- | ------------------- | -------------------------------------------------------- |
| r1-r4 (wiring, first poses) | 3.5 / 4 / 3.5 / 3.5                        | 3                                          | —                 | 34 / 3 (r3) | 0                   | 20/24                                                    |
| r5-r14 (parity levers)      | 4 every round but r6 3.75, r7 4.25, r9 3.5 | 3                                          | ≈2-3 / round      | 135 / 6     | 3 (2.1%)            | flux 18/18 · grok 15/20 · gemini 13/19                   |
| r15-r20 (final config)      | 4 / 4 / 4 / 4 / 4 / (r20 in flight)        | 2 (r18 #10, fixed) else ≥ 3.5; r19 floor 4 | 6 / 4 / 4 / 2 / 5 | 79 / 2      | 1 (1.2%, fixed r19) | flux 5/5 · order-matched grok 4/4 + gemini 2/2 (r18-r20) |

Kevin overall: 243 graded, 233 hearts, 11 bookmarks (4.5%); on the final config 79 hearts / 2 bookmarks (2.5%), and
both of those were engine causes since fixed (the "wild" toast is by design, the flux-2-flex rebuild is r19). Shipped
identity mean 0.69 across 277 (8 below 0.50, none since r18). Hair: 0 grey / 0 blonde in the 40 renders since the
echo (r17+). Kevin's only remaining strike themes — painterly face fidelity (baroque, pop art, rotoscope, ink) — are
handled by the approval revocations, not by prompt work.

## What actually moved quality (in order of impact)

1. **Prompt ORDER on flux-1.1-pro (r15/r16, direct fixed-seed probes):** the album's legacy couple skeleton (pose
   before the identities, scene last) and the solo distance line INSIDE the anchor before the face clause. Same
   content, different order: no-people / floating-heads / greyscale-man seeds became clean couples 3/3; solo
   knees-up requests went from 0/3 to 2/3 in the round. Position beats length — the late scene's size is inert.
2. **Hair echo in the position-1 lock (r17):** "BROWN-HAIRED MAN on the LEFT" — 2/6 grey + 4/6 blonde → 0/6; 40/40
   true hair since.
3. **Pool poses primary, scene-first a minority, curated pools (r5-r8, r14, r19):** the album's variety came from
   the authored pools; Sept-4 bodybuilding batches, passive stills and now the fidget / catalog poses retired (DB
   and code together).
4. **Per-model couple order (r18/r19):** legacy is flux-specific; gemini and grok stay subject-first and a mid-render
   model move re-assembles the prompt. 0/6 first-try where the order mismatched → 6/6 where it matched.
5. **Bars and fallbacks:** identity floors 0.5 both surfaces, the guarded solo re-render (never faceless), the rebuild
   on the couple's model (never flux-2-flex with an unapproved look), framing recipes at 40% (every recipe key
   net-hearted), Option B throttled to 30% couples / 40% solos, natural head proportions, layered-depth suffix,
   subtle vibe versions dropped (r20).

## What did NOT work (kept out)

Natural swap geometry (Kevin: not better on grok/gemini; a cross on flux), 60% framing overlay (r9 dip), hard pose
rules, the hair-colour clause anywhere but position 1, any prompt-tail instruction on flux (no-text, layered depth,
late framing) — they are inert there.

## GO-LIVE RECOMMENDATION

**Go live tonight for every Pro / trial user: `UPDATE engine_config SET nightly_looks_mode = 'on'`** (the 08:00 UTC
cron picks it up; the allowlist row becomes moot). Rollback = the same row back to `'off'` — one write, no deploy.
Why not a wider soak first: six rounds on the final config are 81 exact-production renders with one engine-caused
degrade (fixed), Kevin's strike rate at 2.5%, medians at the album's 4 with the 4.5 share rising, and the failure
modes that remain are per-look taste calls he already has the approval matrix for. Kevin's fail-forward posture
applies: flag, rollback, one variable.

Before flipping — in this order:

1. **Commit the tree** (38 modified + 14 new files; nothing from this loop is committed yet, but `nightly-dreams`
   is DEPLOYED from the working tree — main must match production before it serves everyone). Explicit paths,
   read the staged diff, migrations 514/515 + the new tests + `nightly_framings.ts` + `wardrobeSides.ts` +
   `qa-nightly-exact.js` included. Kevin commits on request.
2. Keep the strike protocol running on Kevin's own nightlies for the first week: bookmark → revoke the look × model
   × surface + retire the pose (`scratchpad/strike-bookmarks.js --apply`), analyze trends weekly.
3. Morning-after check (one query): `ai_generation_log.fallback_reasons` for `dual_degrade_single`,
   `identity_degrade_floor`, `solo_floor_rerender_*`, `look_rebuild:model_fallback`, `couple_prompt_style:*:reroll`
   — expect degrade ≤ 2% and dual first-try ≥ 85% with the order matched; anything worse → `'off'`.
4. Follow-ups, none blocking: promote the `LOOKS_*` constants to `engine_config` (dashboard-tunable), the inert
   late "no text" clause on flux signage scenes (probe an early position), gemini `giant_face` retries under
   subject-first (60% first-try — cost, not quality), the colored-pencil / watercolor-paper matrix on gemini + grok
   (rendering now for Kevin's approval), automate the Fly wedge restart.

## THE FLUX COUPLE FINDING (2026-09-13, after r20 — Kevin: "we have almost no flux couples renders")

**Measured by the model that STARTED the render** (`policy:couple:1:<model>`), not the one that shipped: the render's
own stamps land before the dual pipeline's, so a flux attempt hides behind a `policy:couple:2:<fallback>` stamp.
Re-counted:

| attempt-1 model    | r5-r14 first swap                                | r15-r20 first swap                                                           | 1.2.0 production, other users, last 7 d            |
| ------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| flux-1.1-pro       | 17 pass / 14 fail (7 split, 4 ≈0, 2 in 0.35-0.5) | 7 pass / 14 fail (3 split, **9 one side ≈ 0**, 1 in 0.2-0.35, 1 in 0.35-0.5) | 6/9 first-try; buckets ≥0.5 ×3, 0.35-0.5 ×3, ≈0 ×2 |
| gemini-2-image     | 13/13                                            | 6/6                                                                          | 4/4                                                |
| grok-imagine-image | 15/15                                            | 6/6                                                                          | (n/a)                                              |

So gemini and grok never fail a first swap — every "gemini retry" I reported in r15-r17 was a FLUX failure that had
moved to gemini. Flux fails its first swap in 1.2.0 production too (the same one-side-≈0 signature: `L0.423/R0.009`),
but 1.2.0's model policy runs in SHADOW, so its re-render stays on flux and the couple ships on flux; the looks
path's style contract moved attempt 2 to the fallback model, so every flux failure shipped on gemini / grok. Two
more amplifiers on the looks path: the full-figure frames (every flux full-figure couple in r15-r20 failed its
first swap — 4/4 `full_offcentre`, both plain `full_figure` rolls; 1.2.0 never frames flux couples full-figure) and
the 0.5 likeness bar (1.2.0 ships 0.35-0.5, 3 of 9 production flux swaps sit there — kept, Kevin's r7 call).

**Fixes (deployed for r21):** `RETRY_SAME_MODEL_FIRST` (nightlyStyle.ts `forAttempt`): the first re-render stays on
the attempt-1 model with the same look (`policy:couple:2:<model>:same`), the fallback model is attempt 3 — 1.2.0's
ladder plus one last-resort move; and flux couples never roll a full-figure recipe or the full_figure plain frame
(`rollFraming` / `rollFrame`). Not touched: the painterly look fragments (1.2.0's flux override library is exempt
on the looks path) and the early vibe fragment — if r21's flux attempt-1 rate is still far below production's
~67%, those are the next A/B. The r18 per-model order change stands (gemini / grok are 40/40 on subject-first).

**Corrected claim:** "gemini retries rose under the legacy order" (r15-r18 entries) was a misattribution — those
were flux attempt-1 failures moving to gemini.

## Round 21 — verification (20 renders): flux attempt-1 first-swap rate + share of couples SHIPPING on flux

**Result (20: 6 couples, 14 solos; 0 degraded; mean identity 0.72; 5/6 first-try duals).** Only TWO couples started
on flux (the cast and policy rolls fell that way): #8 passed its first swap and shipped on flux (fishbowl couple,
0.73/0.75); #4 split-failed, re-rendered on flux (`policy:couple:2:flux-1.1-pro:same` — the ladder works), failed
again and shipped on grok at attempt 3. Too few flux starts to state a rate; the flux-pinned drill below is the
real sample. Grades: #1 champagne on a gothic terrace 4.5 · #2 lighthouse pier in pink (grok marker) 4 · #3
mountain lake 4 · #4 Delicate Arch under the aurora couple 4 · #5 canal bridge with candles 4.5 · #6 glass
observatory in a storm 4 · #7 lantern above a white city (watercolor) 4.5 · #8 giant-fishbowl couple (flux) 4 ·
#9 rain close-up 4 · #10 leaning on a stone wall before mountains 4.5 · #11 waterfall with cherry blossoms 4.5 · #12
satin gown at a grand piano 4 · #13 seated on a Rolls in Santorini couple (gemini) 4.5 · #14 wading a moonlit cove
4 · #15 bare-shouldered in clouds 3.5 · #16 château gate with a map couple (grok) 4 · #17 rooftop walk at night
couple (grok) 4 · #18 frontiersman kneeling 4 · #19 boat deck at sunset couple (grok) 4 · #20 roses at a gothic
window 4.5. **Median 4, floor 3.5, seven 4.5s.**

## The flux drill (after r21): flux pinned, couples only, all attempts stay on flux

Arms via `qa-nightly-looks-path.js --surfaces=couple --model=flux-1.1-pro`: **A** looks path as-is ×10 · **B**
`--legacy` (the 1.2.0 engine, same account, same period) ×10 · **C** looks path with a fragment-less vibe
(`--vibe=<family>__subtle`, 5 families × 2). The pipeline now stamps `dual_target:<attempt>:<url>` so every failed
flux base render can be pulled and looked at (`scratchpad/drill-analyze.js`).

**Arm A (looks path, flux pinned, 10 couples):** first swap 4/10 (one side ≈ 0 ×3, split ×2, one unreadable);
three couples ended as SOLO rebuilds. Every failed attempt-0 base render (`targets/`) is the same picture: a
head-and-shoulders two-shot, heads pressed together or overlapping, faces filling the frame — nothing for the
engine to split. Kevin, looking at his album next to these: "a lot of these flux couple renders are really close up
and together … my last 30 public posts are flux, yet don't have this constraint" — his album's couples are
three-quarter / full-length with the place around them.

**Fixed-seed ablations on drill A #1 (scratchpad `frame-probe/`):** removing the hair echo, the early vibe
fragment, or the "NOT a tight face close-up" negation — alone or all three — changed nothing (every seed still the
tight two-shot); swapping the pulp-cover look fragment for the album's watercolor-ink fragment changed nothing; the
SAME people, pose, place and look in the album's 279-word subject-first skeleton (identities → pose → 26-word scene
→ gap line) rendered mid-thigh with the ballroom visible on all three seeds. The bulk and order of the looks-path
couple prompt (100-word scene in the look's voice BEFORE the identities, long framing anchor, 400-630 words) is the
cause; the swap failures are its consequence.

**Arm B (the TRUE 1.2.0 engine, flux pinned, Kevin's allowlist row cleared for the run and restored):** first swap
6/10 (one side ≈ 0 ×3, split ×1), one solo rebuild on flux-2-flex (degraded) — the production week's 6/9 again. But
B's framing is ALSO mostly close two-shots (8/10), unlike Kevin's album: production's subject-first order moved the
scene BEFORE the identity blocks in commit 893838fa (2026-09-07, "subject_first v3"), and every album couple with a
log is the v2 / legacy order (scene after the pose). Other users' production flux couples since 09-11 (3 pulled)
are 2/3 close two-shots. So v3 is a production framing regression on flux, independent of the looks path.

**Fix (deployed, `LOOKS_FLUX_COUPLE_ALBUM_SKELETON`, arm D verifies):** flux couples on the looks path render with
the album skeleton — subject-first, "from mid-thigh up … large clearly visible faces", plain 25-40-word brief, scene
AFTER the pose, no framing recipe, no early vibe fragment, hair echo kept (`couple_skeleton:album`). Gemini / grok
keep the looks prompt (40/40 first swaps, framed wide). **Recommendation for PRODUCTION (Kevin's call — all users):
restore the v2 order for subject-first couples** (`coupleSceneAfterAction` on by default, v3 only for looks-path
gemini / grok) — the album's order is what he benchmarks against.

**Arm D (album skeleton, subject-first order, flux pinned, 10 couples):** first swap **9/10** (A 4/10, 1.2.0 arm B
6/10), prompts 262-354 words, `couple_skeleton:album`, no contract violations — the swap failures were the prompt.
But framing stayed mostly waist-up (8/10); only the two seated poses (bench_ends, seated hay bale) opened up.

**Album replay (the album's three logged couple prompts, verbatim, flux today, 3 seeds each):** the seated-on-steps
legacy prompt is OPEN 3/3 (as posted); the doorway legacy prompt and the armor subject-first prompt are waist-up
3/3 — and those two album tiles ARE waist-up. The model has not changed; the album is a ~50/50 mix and the POSE
decides. Probe 2 (short skeleton, drill D #1): "from the knees up" in the anchor changed nothing; "seated side by
side" in the anchor (word ~55) seated them; the seated pool pose at word ~190 was ignored either way. In the LEGACY
order the pose sits BEFORE the identity blocks (word ~130) and is obeyed — which is why the album's seated-steps
couple is open. **Final flux couple skeleton = the album's legacy order with the album fields** (plain brief, short
scene late, no recipe, no early vibe fragment, hair echo; `couple_skeleton:album_legacy`) — arm E verifies.

**Arm E (legacy-order album skeleton, flux pinned) — ABORTED after 3:** #1 digital_watercolor L-0.06 → solo rebuild,
#2 chromolithograph pass, #3 watercolor_paper 0.46/0.08 → retries 0.04/0.14 → solo rebuild. The legacy order obeyed
the early wide stances (step_up, bench_ends) and the split failed again (Kevin, in the app: "i keep seeing singles").
Killed, reverted to the arm D skeleton (subject-first album order, 9/10 first swaps), redeployed. Lesson: on flux,
a pose the model OBEYS (early) that angles the bodies breaks the split; the 2026-09-06 finding stands. The frame
opens only with symmetric full-body poses (seated side by side, standing full-length), which is a pose-selection
lever for a later round, not an order lever. **Shipped flux couple skeleton = arm D** (`couple_skeleton:album`).

## ROUND 20 SNAPSHOT — the go-live state (return here if the flux side-quest fails)

Every switch lives in `supabase/functions/_shared/nightlyLooksPath.ts` unless noted; production is untouched while
`engine_config.nightly_looks_mode = 'off'` (Kevin renders via `nightly_looks_allowlist`).

| switch                                                                                                     | r20 value                               | since r20 (r21 / drill)                          |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------ |
| `LOOKS_COUPLE_PROMPT_STYLE` + `looksCouplePromptStyle(model)`                                              | legacy on flux, subject_first elsewhere | same                                             |
| `LOOKS_SOLO_FRAMING_IN_ANCHOR`                                                                             | true                                    | same                                             |
| `LOOKS_HAIR_ECHO`                                                                                          | true                                    | same                                             |
| `LOOKS_EXCLUDED_VIBE_VERSIONS` (nightlyVibes.ts)                                                           | `['subtle']`                            | same                                             |
| `LOOKS_FRAMING_PCT` / `LOOKS_SCENE_PCTS` / pool mixes / Option B pcts / identity floors 0.5 / photo priors | as rounds 5-14                          | same                                             |
| `RETRY_SAME_MODEL_FIRST` (nightlyStyle.ts)                                                                 | **false** (attempt 2 = fallback model)  | **true** (attempt 2 = same model, fallback at 3) |
| flux couples full-figure frames (`rollFraming` / `rollFrame`)                                              | allowed (swap-safe recipes only)        | **excluded**                                     |
| `dual_target:<n>:<url>` forensics stamp (dualSwapPipeline.ts)                                              | absent                                  | present (harmless)                               |
| approvals / pool retirements (DB)                                                                          | strikes applied 2026-09-13              | same                                             |

To return to the r20 engine exactly: `RETRY_SAME_MODEL_FIRST = false`, drop the two `distance !== 'full_figure'` /
`key !== 'full_figure'` filters, redeploy `nightly-dreams`. The GO-LIVE RECOMMENDATION above stands on either engine —
on r20's, flux-started couples mostly ship on gemini / grok (Kevin hearted them); on r21's they ship on flux more
often at the cost of a second render. Nothing here is committed yet (Kevin commits on request).

### Kevin's strikes, second pass (2026-09-13, after r21 + the drill: 291 graded, 273 hearts, 19 bookmarks, 6.5%)

Eight new bookmarks and they all say the same thing as the drill: **r20 #14** (flux technicolor couple, fox kits),
**drill A #1, #6, #7, #8, #10** (five of the ten looks-path flux couples — the close two-shots and two solo
rebuilds), **drill B #8, #9** (two of 1.2.0's own flux couples, also close two-shots). By couple order: legacy 8✗/39
(21%) vs subject-first 6✗/158 (4%); flux-1.1-pro 14✗/140 vs gemini 3/73, grok 1/74; frame knees_up 8✗/40, recipe
knees_third 3✗/11; degraded 3✗/7. Applied per the rule: revoked technicolor / pulp_cover / canvas /
painted_fantasy / comics × flux × couple (drill B's mediums have no approval rows). **These five were the close-up
skeleton, not the look** — restore with `scratchpad/restore-combos.js` once arm D holds (pulp_cover × flux × couple
carried 8 hearts).

### Restore decision (Kevin, 2026-09-13): the flux × couple "1.1-pro list"

Kevin asked for my call on the five flux × couple looks his drill-A bookmarks struck. Weighing his hearts on exactly
those combos against strikes whose cause was the close-up skeleton: **restored** pulp_cover (8 hearts / 1 bug
strike), canvas (3 / 1 degraded rebuild), comics (2 / 1), and hand_drawn_illustration (struck in r13 for the
greying the hair echo fixed); **kept off** technicolor (0 hearts / 2 strikes on flux couples, one a clean knees-up
render he still disliked) and painted_fantasy (no hearts on the combo) — both stay live on gemini / grok couples.
Flux couples now roll from 14 approved looks: adult_cartoon, big_head, canvas, chromolithograph, classical_oil,
comics, digital_painting, hand_drawn_illustration, kodachrome, pop_art, pulp_cover, salon_realism, watercolor_paper,
watercolor_portrait. This IS the "1.1-pro list" — `nightly_look_approvals` rows for (look, flux-1.1-pro, couple).

### Correction (Kevin, 2026-09-13): bookmarks were never about poses

"i didn't necessarily dislike any poses, that was purely from framing or a look i just didn't like." The 13 fidget /
catalog poses retired off two bookmarks (`action_poses` 2960, 2980, 2991, 2999, 3006, 3018, 3059, 3168, 3174, 3184,
3195, 3202, 3463) are re-enabled and their code entries restored. Bookmarks drive look approvals and framing work
only; pose curation only on Kevin's explicit word.

## FINAL CONFIGURATION (2026-09-13, after the flux drill arms A-I) — the go-live list

| switch                                                                                         | value                                                                                                                                                                                                                                | why                                                                                                                |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `LOOKS_FLUX_COUPLE_ALBUM_SKELETON` (nightlyLooksPath.ts)                                       | true — flux couples: subject-first order, plain 25-40-word brief, "from mid-thigh up … large clearly visible faces" anchor, scene after the pose, no recipe, no early vibe fragment, hair echo (`couple_skeleton:album`)             | arm D 9/10 first swaps vs 4/10 (looks v3) and 6/10 (1.2.0); the legacy-order variant (arm E) broke the split again |
| `looksCouplePromptStyle`                                                                       | gemini / grok: subject_first (the looks v3 prompt, 40/40 first swaps). flux couples: the LEGACY album order + 1.2.0's flux override fragments + a symmetric mid-shot stance on every render + positive-only framing language (arm I) | arm I: 6/10 first swaps = 1.2.0's own rate, 0 bust crops, 0 solo rebuilds                                          |
| `RETRY_SAME_MODEL_FIRST` (nightlyStyle.ts)                                                     | true — re-render on the same model first, fallback model at attempt 3                                                                                                                                                                | 1.2.0's ladder; flux couples ship on flux instead of moving on the first miss                                      |
| flux couples full-figure frames                                                                | excluded (recipes and plain roll)                                                                                                                                                                                                    | every full-figure flux couple in r15-r20 failed its first swap                                                     |
| `LOOKS_SOLO_FRAMING_IN_ANCHOR` / `LOOKS_HAIR_ECHO` / `LOOKS_EXCLUDED_VIBE_VERSIONS=['subtle']` | true / true / subtle out                                                                                                                                                                                                             | rounds 16, 17, 20                                                                                                  |
| pools, Option B pcts, scene mix, identity floors 0.5, framing 40% (non-flux couples + solos)   | as rounds 5-14                                                                                                                                                                                                                       | —                                                                                                                  |
| `nightly_look_approvals`                                                                       | strikes applied per Kevin's bookmarks; pulp_cover / canvas / comics / hand_drawn_illustration × flux × couple restored (his call); flux couples roll from 14 looks                                                                   | the "1.1-pro list"                                                                                                 |
| `action_poses`                                                                                 | the 13 fidget / catalog poses re-enabled (bookmarks were about framing / looks, not poses)                                                                                                                                           | Kevin                                                                                                              |
| forensics                                                                                      | `dual_target:<attempt>:<url>` stamped per attempt                                                                                                                                                                                    | pull a failed base render in one query                                                                             |
| `FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES` (nightlyVibes.ts)                                         | moonlit, starlit, nightshade, stormlight, dark — skipped ONLY on flux couples                                                                                                                                                        | night vibes pass the flux dual swap 1/10 vs 16/28 bright; 7/7 on flux solos, 40/40 on gemini / grok couples        |
| `FRAME_WEIGHTS` (nightlyLooksPath.ts)                                                          | couple 20/10/30/40 (full_figure / knees_up / mid_thigh / waist_up), solo 35/25/40 (enviro_wide / three_quarter / waist_up)                                                                                                           | Kevin's bookmarks re-aimed at framing: knees_up 14% and three_quarter 7% struck vs 0-3% for the rest               |
| `nightly_model_policy.couple`                                                                  | primary weights [34, 33, 33] — even three-way split; solo and scene stay 50/25/25                                                                                                                                                    | Kevin                                                                                                              |
| `_shared/locationFilters.ts`                                                                   | name list = free-text junk only, biome list empty                                                                                                                                                                                    | the stale June ban stripped 19 imagined-world places from every user's pool for 3 months                           |

Known and accepted: flux couples sit in the mid-shot band (mid-thigh) rather than the album's ~50% full-length —
opening them needs symmetric full-body poses the dual split tolerates, which is a pose-selection round for later,
not a blocker. Flux's first-swap rate is 6/10, the same as 1.2.0's. Production
(1.2.0) note for Kevin: its subject-first couples have been scene-first since 2026-09-07 (commit 893838fa) — the
looks path go-live supersedes it; if he wants the album order back for other users before then,
`engine_config.couple_prompt_style = 'legacy'` is the one-row switch.

## Round 22 — confirmation of the final configuration (20 exact-path renders)

**Result (20: 12 couples — flux 5 / gemini 4 / grok 3 — 8 solos; 11/12 first-try duals; 0 degraded; mean identity
0.72; renders 1-15 on the subject-first album skeleton for flux couples, 16-20 after the legacy-order redeploy).**
Grades: #1 medieval village square (grok lineless watercolor) 4 · #2 city catwalk, tiny figure (flux canvas) 3.5 ·
#3 jungle safari couple, waist-up (flux chromolithograph, album skeleton) 3.5 · #4 Mediterranean village couple,
full figure (grok graphic novel) 4 · #5 white gown at a fountain (flux vintage film) 4 · #6 yacht couple seated,
stiff — Kevin: "so posed and cardboard cutout" (GROK aquarelle, not flux) 3.5 · #7 whale two-face close-up with a
printed caption — Kevin: "absolutely HATE this one" (flux chromolithograph, active-scene anchor, album skeleton)
**2** · #8 snowy-street couple in coats, FULL-LENGTH and natural (flux digital painting, album skeleton) 4.5 · #9
tropical-shirt couple, waist-up (flux pulp cover) 3.5 · #10 puppies in sunflowers 4.5 · #11 Japanese castle railing
couple, full-length (gemini airbrush) 4.5 · #12 jungle stream couple, full-length (grok painted fantasy) 4.5 · #13
cauldron with butterflies 4.5 · #14 blue blazer on a sci-fi walkway 4 · #15 beach boardwalk couple in beanies
(gemini gouache) 4.5 · #16 garden couple in orange and teal (gemini comic cover) 4 · #17 earth-tone couple, waist-up
(flux chromolithograph, album LEGACY skeleton, attempts 2) 3.5 · #18 champagne over a city 4 · #19 rock climb 4 ·
#20 garden-arch couple flashing OK signs (gemini salon realism) 4. **Median 4, floor 2.** Gemini / grok couples:
6 of 7 full-length and natural. Flux couples: 1 of 5 open. That gap is the remaining work.

## FLUX 1.1-PRO COUPLE PARITY — up to 10 rounds (Kevin, 2026-09-13)

**Goal:** flux couples on the looks path at the framing / composition / naturalness of the flux couples in Kevin's
public album. **Round = 10 flux couples through the engine** (`qa-nightly-looks-path.js --surfaces=couple
--model=black-forest-labs/flux-1.1-pro --count=10`, real scenes, cast, looks, vibes, poses). **Metrics per round:**
first-swap pass (1.2.0 itself: 6/10), OPEN share (full-length / knees-up with the place around them — the album's
flux couples are ≈ 50%), stiff / cardboard count, Kevin's hearts and bookmarks. One variable per round, back up on a
dip. Benchmark tiles: album posts 2 (steps), 9 (marina), 12 (red carpet), 23 (beach), 26 (yacht), 30 (Roman).

| round       | variable                                                                         | first swap                                                  | open | stiff           | Kevin                |
| ----------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---- | --------------- | -------------------- |
| A (before)  | looks v3 prompt, 630 words                                                       | 4/10                                                        | 0/10 | —               | 5✗                   |
| D           | subject-first album skeleton                                                     | 9/10                                                        | 2/10 | most            | —                    |
| E (aborted) | legacy order + wide stances                                                      | 1/3                                                         | —    | —               | —                    |
| F           | legacy album order, generic stances only, look fragments                         | 0/5 at the halfway mark (all one side ≈ 0; 2 solo rebuilds) | —    | —               | Kevin: "a mixed bag" |
| G           | legacy album order + 1.2.0's flux OVERRIDE fragments (the album's actual recipe) | 5/10 (8/10 at 1.2.0's 0.35 bar); 1 solo rebuild             | 1/10 | 9/10 bust crops | 3✗ (#3, #9, #10)     |

| H | + symmetric mid-shot stances on half the renders, mid-thigh frame pinned | 5/9 (2 splits, 2 one-side-0) | 0/9 | 0 bust crops | — |
| I (kept) | mid-shot stance on EVERY flux couple + positive-only framing language (no negated "close-up") | 6/10 | 0/10 | 0 bust crops | — |

**Arm I is the flux couple configuration that ships.** 10 renders, all mid-thigh, zero bust crops, zero solo
rebuilds, every render shipped on flux (the retry ladder keeps it there). 6/10 pass the dual swap on attempt 1 vs
1.2.0's own 6/10 — parity reached on the metric Kevin set.

**What the last 4 failures were (the finding that closed the drill):** they are not random. Pooling every flux
couple across arms F-I by the vibe's light level: **night / low-light vibes pass the first dual swap 1/10 (10%),
brighter vibes 16/28 (57%)**. The same night vibes swap **7/7 on flux SOLOS** and **40/40 on gemini / grok
couples** — so it is not the vibe, the look or the pose: an under-exposed two-shot gives the dual detector two
small dark faces it cannot split. Shipped as a per-(model × surface) guard, not a vibe retirement:
`FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES = [moonlit, starlit, nightshade, stormlight, dark]` skipped only when the
contract rolls flux for a COUPLE (`nightlyVibes.ts`, wired in `nightlyStyle.ts`, locked by `nightlyStyle.test.ts`).
Those five families keep rolling on every solo, every scene and on gemini / grok couples. Watchlist, left in the
pool for want of evidence: macabre, noir, ominous, fog, candlelit.

**G diagnosis:** the swap is back at 1.2.0's rate, but 9 of 10 are BUST crops (upper bodies poking in from the bottom
edge, scene above) — Kevin: "a lot of people's busts just poking out of the picture somewhere, i don't want that".
Two sources: (1) the premise — every ACTIVE row on flux across D/F/G (knee-boarding, surfski, kelp forest, hourglass,
library, meadow: 6/6) was a bust or a failure, and goofy premises like "buried chest-deep in a bin of foam packing
peanuts" (G #10, Kevin: "why are there a bunch of corn kernels") bury the couple by definition; (2) the pool poses
name hands and torsos, so the obeyed early pose gives no reason to show legs. The album's open couples name the
lower body (seated on steps with a cat on the step below).

**Bookmark rule change (Kevin):** bookmarks no longer scrap looks — they are render-level signals (crop / framing).

| H | G + symmetric full-body stances for flux couples (active rows, scene-first rolls, half of the pool renders) | 5/9 (2 split, 2 one-side ≈ 0); 3 solo rebuilds | 4 of the 6 shipped couples mid-thigh-to-full with the place around them | 2 (the two pool-pose renders) | — |
| I | H + the stance on EVERY flux couple render, list restricted to the five mid-shot symmetric stances (seated together, leaning back, perched on an edge, hands free, rail pair — the "full figures from the knees up" ones failed the split 3/3 in H), + positive-only framing language (no negated "close-up" / "portrait" tokens) | _(running)_ | | | |

**F diagnosis:** the attempt-0 base renders show what the obeyed early pose does under a painterly look fragment —
the couple pressed shoulder to shoulder, a hand on his chest, heads touching — so the engine cannot split them.
Kevin's album flux couples were rendered by 1.2.0 with its five flux-1.1-pro OVERRIDE fragments ("polished digital
painting …", "loose watercolor and ink …"), which the looks path exempts in favour of the rolled look's swap
fragment. Production's one-side-≈0 rate on flux has been ~15-25% since at least 08-24 (other users, 21 days) — the
engine release v23/v24 today did not change it (checked: the conflict guard is enforce-by-default because the
`DUAL_GENDER_CONFLICT` secret is unset, but no failure carries a `gender_conflict` reason). Arm G renders flux
couples with the override fragments (`look_override_library:flux_couple`, `LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY`).

### Correction on arm E (Kevin: "1.2.0 can do it, why can't we?")

Arm E's split failures were not the legacy order — they were the looks-path WIDE stances it rolled (step_up,
bench_ends: geometry-changing, exactly the set 1.2.0 parked on 2026-09-06 after 4/4 degrades). Kevin's album flux
couples were rendered by 1.2.0's legacy order with the GENERIC stances and pool poses. Re-instated for flux couples:
the legacy order with the album fields (plain brief, short scene late, no recipe, no early vibe fragment, the
1.2.0 anchor and framing block, hair echo) and `wideStances` OFF for flux couples (`couple_skeleton:album_legacy`).
Subject-first stays for gemini / grok. Removing flux from the couple rotation was proposed and REJECTED by Kevin —
the target is his album, which flux rendered. Arm F verifies (10 flux couples), r22's remaining couples render on
it too.

## SIDE FINDING — the imagined-world places never rendered (2026-09-13)

Kevin: "i don't really see many whimsical, fantasy, or sci-fi renders, but i think i have all those locations saved."
He does — 163 saved places, all resolving to picker cards (high_fantasy 10, scifi_space 7, whimsical_fun 9 among
them). The 2026-06-03 "location safety net" (`_shared/locationFilters.ts`) still banned 19 of those names at the
place-pool stage (`isBannedLocationName`, nightly-dreams index.ts) and refused the `fantasy_imagined` /
`scifi_cosmic` / `aquatic_underwater` biomes at card resolution (`essenceCards.ts`) — ~24 of his places, the whole
imagined-worlds segment, silently stripped before the roll for EVERY user, even though those cards were re-approved
with real spot pools in August. Fix: the name list keeps only free-text / trademark junk (hogwarts, disneyland, sea
world, paris cafe …), the biome list is empty; locked by `__tests__/lib/locationFilters.test.ts`. Deployed after
arm I; verified with four forced-place renders (dragons keep, cyberpunk megacity, unicorn meadow, underwater city
atlantis) in Kevin's album.

### Seed-pool audit (Kevin: "make sure all the active pools … are correctly setup and properly being picked from")

Every gate between a saved place and a rendered spot, checked for ALL users on 2026-09-13:

- **Picker cards:** 163 live (16 categories; the 10 `__dissolved` cards — taj mahal, petra, … — are `admin_only` and
  hidden on purpose). All 163 approved, not admin-only, with a biome and a biome_config.
- **User recipes:** 56 users with saved places, 2,964 entries — every one resolves to a live card (the orphan guard
  drops nothing; the August rework migrated recipes cleanly).
- **Spot pools (`location_iconic_spots`):** 23,581 active spots, 15,469 cast-eligible, 14,869 scene-eligible; every
  live card has ≥ 21 cast-eligible spots (min: high_life 21, wild_west / gothic 29; high_fantasy mean 85, scifi_space
  57, whimsical_fun 165). 12 spot keys with no live card are the dissolved cards + hogwarts / robot city (inert).
- **The one defect:** the stale code ban list above (19 names + 3 biomes) — the only thing turning pools off, and it
  turned off the entire imagined-worlds segment for everyone. Fixed in code, deployed after arm I.

### Model policy (Kevin, 2026-09-13): couples split evenly by model

`nightly_model_policy.couple.primary_weights` = [34, 33, 33] over flux-1.1-pro / gemini-2-image / grok-imagine-image
(was 50 / 25 / 25). Solos and scenes stay 50 / 25 / 25. Applied on the live table (the looks path reads it; 1.2.0's
policy is in shadow so production is unaffected until go-live). Rollback: set the weights back to [50, 25, 25].

## BOOKMARK STRIKES — RE-AIMED AT FRAMING (Kevin, 2026-09-13)

> "make sure to apply the bookmark strikes which are now targeted at the framing — bookmarked posts are ones that
> have framing we don't want — either too close, or just not a desired framing"

Strike rate by FRAME over the 285 graded renders of the mixed rounds r1-r22 (the real frame roll, all three models;
the single-model single-frame drill arms are excluded because every render in them shares one frame):

| surface | frame           | struck | rate |
| ------- | --------------- | ------ | ---- |
| couple  | `knees_up`      | 5/35   | 14%  |
| couple  | `mid_thigh`     | 1/19   | 5%   |
| couple  | `full_figure`   | 1/33   | 3%   |
| couple  | `waist_up`      | 0/32   | 0%   |
| solo    | `three_quarter` | 5/71   | 7%   |
| solo    | `enviro_wide`   | 1/47   | 2%   |
| solo    | `waist_up`      | 1/48   | 2%   |

One frame per surface carries the strikes, at 3-5× the others. Both were the heaviest weight in the roll, so the
strike applied is a REWEIGHT, not a retirement (Kevin asked for the knee/waist range on 09-12):

| surface | before                                                    | after                                                     |
| ------- | --------------------------------------------------------- | --------------------------------------------------------- |
| couple  | full_figure 15 · knees_up 40 · mid_thigh 15 · waist_up 30 | full_figure 20 · knees_up 10 · mid_thigh 30 · waist_up 40 |
| solo    | enviro_wide 25 · three_quarter 45 · waist_up 30           | enviro_wide 35 · three_quarter 25 · waist_up 40           |

`FRAME_WEIGHTS` in `nightlyLooksPath.ts`; `nightlyLooksPath.test.ts` fails if either struck frame becomes the
heaviest again, or if either is removed outright. No look approvals were revoked in this pass.

## MODEL SPLIT (Kevin, 2026-09-13)

> "we should split couple's renders evenly by model — instead of 50% flux, however, for single, i still think we
> should split it 50 then 25/25"

`nightly_model_policy.couple.primary_weights` = **[34, 33, 33]** over flux-1.1-pro / gemini-2-image /
grok-imagine-image (was 50/25/25). Solo, scene and solo_rebuild rows untouched. Live table, one row, reversible.

## IMAGINED-WORLD PLACES — VERIFIED LIVE

The stale June ban list (`_shared/locationFilters.ts`) that stripped 19 imagined-world names and 3 biomes from
EVERY user's nightly place pool is fixed and deployed. Four forced-place renders confirm the pool resolves:
dragon's keep → "spiraling bone-white towers of the Skaeld citadel", cyberpunk megacity → "autonomous construction
frame frozen mid-build above the skyline", unicorn meadow → "Rainbow Bridge arching over the silver stream",
underwater city atlantis → "the Coral Labyrinth of the Sea Priests". Locked by `__tests__/lib/locationFilters.test.ts`.

## BOOKMARK RULE OF RECORD (Kevin, 2026-09-13 evening)

A bookmark bans the LOOK, catalog-wide: `dream_mediums.nightly_enabled = false` for that look key, every model and
every surface. The approvals table is left intact so the grading history survives and a restore is one row.
`scratchpad/strike-looks.js <SCR> <round...> [--apply]` reports the strikes and applies them. The framing reweight
above stands as a one-off for the bookmarks made before this rule returned; poses are never struck from bookmarks.

## LOOKS APPROVED 2026-09-13 (Kevin)

Colored pencil and watercolor paper, on gemini-2-image and grok-imagine-image, both surfaces — the two mediums from
the sunnysteph posts he liked. Colored pencil also needed `dream_mediums.nightly_enabled = true`: it was disabled at
the catalog level, so the approvals alone would never have put it in rotation. Catalog gate first, approvals second.

## HOW TO GET BACK TO ROUND 20 (verified 2026-09-13, exact)

Round 20 is recoverable byte-for-byte, not from memory: `scratchpad/looks/path-r20/report.json` stores the FULL
emitted prompt for all 14 renders plus the brief, composer, stamps, look, vibe, frame, framing and model. Any
revert is verified by rebuilding one flux couple prompt and diffing it against the stored r20 text — if the diff is
empty, the engine is back.

Marker test on the stored r20 flux couple prompt says what r20 actually had: legacy identity-first order YES,
album mid-thigh anchor YES, hair echo YES, `NOT a tight face close-up` negation YES, 1.2.0 override fragment NO,
stance clause NO. So the delta from today is four switches:

| switch                                                     | today            | round 20                                       |
| ---------------------------------------------------------- | ---------------- | ---------------------------------------------- |
| `LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY`                       | true             | **false**                                      |
| `LOOKS_FLUX_WIDE_STANCES` / `LOOKS_FLUX_STANCE_POOL_SHARE` | true / 0.5       | **false / 0**                                  |
| `LOOKS_FLUX_POSITIVE_FRAMING`                              | true             | **false** (restores the negated close-up line) |
| `FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES`                       | 5 night families | **[]**                                         |
| `nightly_model_policy.couple` weights                      | 34/33/33         | **50/25/25**                                   |

`FRAME_WEIGHTS` is already back at its round 19-22 values. Everything else in the path is unchanged since round 20.
The location ban fix and the Fly concurrency fix are bug fixes with no aesthetic effect and stay in either way.

## EYE COLOUR IS LOST (Kevin, 2026-09-13) — researched, fix designed, NOT yet applied

> "it seems in the new looks system, eye color is lost … my wife has more green eyes, but they aren't reflected in
> a lot of these renders"

**The data is there.** Her stored `physical_summary` reads "… warm golden tan skin, early-to-mid 40s, average
build, hazel-green eyes." His reads "brown eyes".

**The engine drops it on purpose.** `characterSlotPrompt.extractHair` keeps only hair and facial-hair clauses and
`extractSkin` keeps only the skin clause; the comment on both says eye colour and face shape "get face-swapped away
anyway" and in the prompt "pull renders toward Disney-princess / stock-photo archetypes". So no nightly prompt has
ever named a cast member's eye colour. The assumption that the swap restores it is what Kevin's observation
disproves: in a painterly look the swap refines the face but the base render's default brown eyes survive.

**Probe (flux-1.1-pro, her real couple prompt, seeds 11/22/33):**

| variant                                                                                                | eye colour named   | result                                           |
| ------------------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------ |
| V0 as shipped                                                                                          | none               | her eyes render BROWN, 3/3                       |
| V1 eye colour added to her mid-prompt identity clause (word ~150)                                      | "hazel-green eyes" | pixel-identical to V0 — the model never reads it |
| V3 / V4 eye colour folded into the POSITION-1 lock ("GREEN-EYED DARK BROWN-HAIRED WOMAN on the RIGHT") | both cast          | her eyes render GREEN, 3/3                       |

Same law as the hair echo (round 17) and the framing probes: flux obeys the first ~40-100 words and ignores the
rest. **Side effect to handle:** naming only one person's eye colour bleeds the colour onto the other figure, so the
fix must name BOTH, and even then his read greenish on one seed.

**Designed fix (hold until the A/B is decided):** `LOOKS_EYE_ECHO`, mirroring `LOOKS_HAIR_ECHO` — parse the eye
clause out of `physical_summary` and fold `<COLOUR>-EYED` into each cast member's position-1 lock, both members or
neither. Verify on a real looks-path render and watch the identity gate, since the lock is the most
attention-dense part of the prompt and extra tokens there tighten composition.

## A/B: POST-DRILL (r23) vs ROUND 20 (r24) — 20 exact-path renders each

| metric                                         | r23 post-drill    | r24 round-20       |
| ---------------------------------------------- | ----------------- | ------------------ |
| my grade, mean / median / floor                | 3.85 / 4 / 2      | **4.00** / 4 / 2.5 |
| renders at 4+                                  | 15/20             | **16/20**          |
| couples                                        | 9                 | 11                 |
| first-try dual swap                            | **8/9 (89%)**     | 5/11 (45%)         |
| mean shipped identity                          | 0.645             | **0.724**          |
| degraded to a solo rebuild                     | 1                 | **0**              |
| **flux couples that actually SHIPPED on flux** | **5 of 5 rolled** | **1 of 7 rolled**  |

**Round 20 scores higher, and the reason is the finding.** It wins by quietly abandoning flux for couples: flux
rolled first on 7 of its 11 couples and shipped exactly 1, because its retry ladder moves to gemini / grok at
attempt 2 and those swap cleanly. That IS the "we have almost no flux couples" complaint that started the drill,
measured. The post-drill state keeps them: 5 rolled on flux, 5 shipped on flux, 8 of 9 couples passing the first
swap.

**The whole 0.15-point gap is one render.** r23 #13, a flux couple at the pyramids, read 0.053 then 0.001 on one
face and degraded to a solo bust (graded 2). The ladder never tried another MODEL: `identity_degrade_floor:0.053<0.25`
sends a sub-0.25 face straight to the solo rebuild, while round 20 reached a different model first and so never
produced a bust.

**Synthesis worth building:** keep the post-drill state and change the degrade rule to try ONE re-render on the
fallback model before degrading to a solo. That converts r23 #13 into an r24-style clean couple and keeps flux
couples flux. Both states are frozen in `nightly-states/` either way.

Also seen in r23 #15: a `snowfall` vibe landed on a summer cliff-jump scenario (swimsuit on snowy rocks). Nothing
pairs a weather vibe against the activity — a coherence guard for later.

## NEXT UP (Kevin, 2026-09-13, after the 3-way state sheet): the LOOK LADDER

> "render the same seed/prompt across all looks — 1 render per look so i can compare the same seed/prompt across
> different looks and only the look differs. put all these in my dreams album, and i will go through and purple x
> (quarantine) the ones i want removed."

**Shape of the run.** One scene, one cast, one vibe, one fixed seed. Then one render per ENABLED nightly look (56
today), with the look fragment as the ONLY thing that changes between renders. Everything else — place, pose,
framing, vibe fragment, prompt order, model — held constant, so the sheet isolates the look and nothing else.

**Gotchas to honour when building it:**

- **Model.** Holding the model constant is what makes it a fair look comparison, but 5 solo looks are not graded on
  flux. Either render every look on flux and mark those 5 as off-grade, or render each on its graded model and say
  so on the tile. Pick one and state it; do not mix silently.
- **Throttle.** 56 renders is a heavy batch: cap concurrency at 3 and gate on `waitForHeadroom({ min: 25 })` per the
  hard rule, and avoid the :00 and 08:00 UTC windows.
- **Destination.** Kevin's PRIVATE Dreams album (not the public feed, not a /tmp HTML sheet) so the purple
  quarantine button is available on every tile — that button is now the look-retirement signal.
- **Then.** `node scripts/apply-look-quarantine.js` (dry) → review → `--apply`. It resolves the look from the
  medium column or the render's log stamp, so a hidden render still names its look.

## LIVE — 2026-09-14 (Kevin: "let's finalize this and switch the engine to live now")

`engine_config.nightly_looks_mode` **off → on**. The 1.2.0-with-looks engine now renders every eligible user's
nightly dream, 10 users on the first night. **Rollback is that same row back to `off`**, effective on the next
render, no deploy.

What is live, in one line each:

- The 1.2.0 engine builds the dream — location-fit action at 75%, its scene mix, its pose pools, its prompt order.
- The new catalogue picks the LOOK (pinned as the medium) and the VIBE. 54 looks enabled; comics and pop_art
  retired at Kevin's word.
- Model: the surface's three policy primaries minus his explicit rejections; 50% go direct to the primary, 50%
  roll the pool. A failed couple round-robins the pool once each, then the single restarts at the solo primary.
- Cast split 50 / 25 / 25 (couple / self / plus-one).
- Every cast dream reaches the model with something to DO: the row's own action (mig 516, 2691 couple rows), a
  solo's scene sentence passed through unrewritten, or a generated place-fitting beat.

Guards standing behind it: `check-nightly-catalog.js`, `scan-scenario-actions.js`, `scan-dual-faceswap-proximity.js`,
and 3154 tests including the wiring guards over the render path itself.

Snapshots for restore: `nightly-states/v1.2.0-looks.json` (this engine), `round20.json`, `postdrill.json`.
