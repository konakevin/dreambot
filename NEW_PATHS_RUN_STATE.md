# NEW_PATHS_RUN_STATE.md — the 33 homeless buckets, built as paths

**Kevin, 2026-09-22:** *"you just iterate through all paths and do up to 3 qa rounds to get them as
good as possible, then i'll grade each based on their final round. obviously if you get to a good
state 4-4.5 before 3 rounds you can move on."*

So this run is autonomous. Everything lands in `shadowPaths[]` and waits for his grade.

## Hard constraints on this run

- **Nothing goes public.** Every path is wired into `shadowPaths[]`, never `paths[]`. A
  `shadowPaths[]` path is invisible to the hourly dispatcher and renders only via
  `iter-bot --mode <path> --post`. Going live is Kevin's call and is a one-string move later.
- **MVP-25 only.** Every pool stops at 25 entries. Scaling to 200 waits for sign-off
  (`feedback_always_seed_25_to_test_then_scale`).
- **Up to 3 QA rounds**, stop early at 4-4.5. ONE variable per round.
- **Renders throttled** — concurrency <= 2-3 and gate on `check-pool-headroom.js` first, because
  each render holds a Postgres connection for 20-150s and the pool is the shared ceiling.
- **Self-grading is the weak link and I know it.** My grades skew harsh
  (`feedback_render_grading_too_harsh`), so iteration decisions lean on things I can VERIFY from
  the stored `ai_prompt` and the pool text, not on my read of an image:
  - did the render error / which model
  - did the template's non-negotiable mandate survive into the prompt
  - did a known failure mode recur (list below)
  - did Sonnet REFUSE and send its refusal text to Flux as the prompt
  Where the remaining question is pure taste, PARK the path at its best round and flag it here
  rather than thrash for three rounds.

## The failure modes I am actively checking each round

Drawn from `BOT_SCENE_QUALITY_PLAYBOOK.md`; each has bitten a real path before.

| Mode | Symptom | Check |
| --- | --- | --- |
| Subject front-load | rich world in the brief, hero-on-bokeh in the render | read the `ai_prompt` opener; is it 60 tokens of subject/medium before the scene? |
| Modern-prior noun | a fairy "wedding" renders a full-size modern bride | every event/object noun: what is the most famous image of this word? |
| Human leak | a person appears on a humans-banned bot | name the exact bias ("the vanishing point is EMPTY"), never a bare "no people" |
| Silhouette collapse | every render is the same massing | each entry NAMES its massing; cap any one shape family |
| No-prior creature | an obscure species renders as a human graft | does Flux have a prior for this name? if not, describe concretely |
| Sonnet refusal | generic/empty render unrelated to the brief | grep `ai_prompt` for "I notice" / "structural issue" / "I want to be transparent" |
| Authority wording | ~28% Sonnet refusal rate | never "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" in a brief block |
| Negation leak | "no lanterns" puts lanterns in | describe only what IS present |
| Template adjective lock | pool varies, renders identical | is the template injecting a fixed adjective on every render? |
| Density mandate fight | a "designed" path renders spammy | is a bot-wide pack-the-frame mandate overriding it? |

## Build order

The four strongest first, so a flaw in my pipeline shows up on work worth having:

1. DinoBot `courtship-display` — the only one putting dinosaur BEHAVIOUR on screen; DinoBot is landscape-heavy
2. ToyBot `puppet-theatre` — a proscenium is a whole new framing language, not a new subject
3. PixelBot `volcano-forge` — PixelBot has almost no interiors, and a forge is the classic game splash screen
4. FaeBot `mushroom-apothecary` — same interior gap on an all-outdoor-vista bot

Then the rest, grouped by bot to reuse each bot's audit.

## Status

| # | Bot | Path | Rounds | State | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | DinoBot | courtship-display | - | not started | |
| 2 | ToyBot | puppet-theatre | - | not started | |
| 3 | PixelBot | volcano-forge | - | not started | |
| 4 | FaeBot | mushroom-apothecary | - | not started | |
| 5 | BloomBot | alpine-wildflower-meadow | - | not started | |
| 6 | BloomBot | coastal-cliff-bloom | - | not started | |
| 7 | BloomBot | orchid-cloud-forest | - | not started | |
| 8 | BrickBot | airfield-biplanes | - | not started | |
| 9 | BrickBot | balloon-festival | - | not started | |
| 10 | BrickBot | archaeology-dig | - | not started | |
| 11 | DinoBot | den-and-burrow | - | not started | |
| 12 | DinoBot | undergrowth-scale | - | not started | |
| 13 | DinoBot | tidal-flat-tracks | - | not started | |
| 14 | DinoBot | amber-forest | - | not started | |
| 15 | FaeBot | autumn-seed-gathering | - | not started | |
| 16 | FaeBot | acorn-boat-regatta | - | not started | |
| 17 | FaeBot | star-charting | - | not started | |
| 18 | FaeBot | honey-harvest | - | not started | |
| 19 | FarmBot | apiary-beekeeping | - | not started | |
| 20 | FarmBot | lambing-season | - | not started | |
| 21 | FarmBot | sheep-shearing-day | - | not started | |
| 22 | FarmBot | hay-baling-summer | - | not started | |
| 23 | MangaBot | onsen-evening | - | not started | |
| 24 | MangaBot | game-center-arcade | - | not started | |
| 25 | PixelBot | castle-town-gate | - | not started | |
| 26 | PixelBot | ice-cavern | - | not started | |
| 27 | PixelBot | observatory-tower | - | not started | |
| 28 | PixelBot | floating-market-canal | - | not started | |
| 29 | SteamBot | rooftop-telegraph | - | not started | |
| 30 | SteamBot | brass-glasshouse | - | not started | |
| 31 | ToyBot | bath-toy-flotilla | - | not started | |
| 32 | ToyBot | sand-toy-beachworks | - | not started | |
| 33 | ToyBot | snow-globe-world | - | not started | |

## Per-path log

### 1. DinoBot `courtship-display`

**The gap.** DinoBot had 16 live paths and every one was a landscape, a herd, a fight, a family, a
portrait or a weather event. Nothing showed an animal DISPLAYING — the most photogenic behaviour in
the whole wildlife-documentary genre.

**Axes** (3 bespoke + the reused stage, mirroring nesting-ground/herd-migration):
- `display_act` — the hero behaviour, mid-motion, body plan named so Flux renders a dinosaur
- `display_feature` — the MONEY-SHOT axis: the anatomy actually doing the displaying, with the light
  passing through it written into the entry
- `audience` — who it is FOR
- reuses `DINOBOT_PALEO_LANDSCAPE_BIOME` + the 80%-gated phenomenon + universal lighting/atmosphere

**Round 1 — 6/6 rendered, 0 errors.** Mechanical diagnostics on the stored `ai_prompt`:
- display structure present 6/6, backlit/translucent language 6/6, audience named 5/6
- zero real failures: no human leak, no mating, no fighting, no Sonnet refusal
- three "leaks" my checker flagged were ALL false positives: "blood-orange horizon" and
  "blood-vessel branching" (display anatomy, not violence), and `mount` matching "mountain ranges".
  Read the matched text before acting on a regex.
- front-load: the animal is first named at char 335-408. DinoBot's LIVE paths name it at 337 / 371 /
  343 / 1528, so this is the bot's shared prefix, at parity — not a defect this path introduced.

**Round 1 verdict from the renders: high variance, and the cause is isolated.**
- a portrait of a crested dinosaur on a peak, no audience, no act → weak
- a crested duckbill mid-call with its throat sac inflated, crest lit translucent orange, a LEK of
  five onlookers in the midground, a scraped arena of arranged fronds, lightning overhead → excellent
- a bounding feathered display with real motion but heavy bokeh and no audience → middling

The differentiator in all three is the AUDIENCE. When it renders, the frame becomes a scene; when it
drops, the path collapses into the animal portrait DinoBot already has six paths for.

**Round 2 change (ONE variable): the audience became mandatory and plural.** Borrowed
nesting-ground's proven MINIMUM-2 mandate, since that path's whole identity rests on it and it is
known to work on this exact bot. Also stopped the audience section describing itself as small
(3-10% of frame), which was telling Flux it was droppable. Nothing else touched.

### 2. ToyBot `puppet-theatre`

**The gap.** ToyBot has 23 live paths and every one photographs toys ON a surface — a shelf, a
table, a diorama, a floor. A PROSCENIUM is a framing language the bot has never used: camera in the
house, the arch cropping the image, footlights raking UP from the front edge, painted flats receding
in layers. A new KIND of picture rather than a new subject, which is why it earned a path.

**Axes:** `production` (the play + its painted set) + `cast` (1-2 puppets mid-gesture with the
mechanism visible, second at 60% because a two-hander is what a stage is for) + `stagecraft` (the
one piece of machinery that sells the illusion). New bespoke medium `puppet_theatre_diorama`.

**Gen gotcha logged:** `seedGenHelper.generatePool` parses a JSON array, so a prompt ending "Output:
ONE per line" costs a retry. `gen-dinobot-pool.js` has its own line parser and does accept that
form — the two mechanisms differ, so match the one you are calling.


