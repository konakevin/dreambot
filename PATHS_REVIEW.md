# New paths — the review sheet

**For Kevin, to grade on return. All 35 are built, merged and finished.**

Every path below is **SHADOW-ONLY**: it renders on demand, posts hidden (`is_public=false`), and is
invisible to the hourly dispatcher. **Nothing reached live rotation.** Going live is moving one string
from `shadowPaths[]` into `paths[]` and changing nothing else.

- **To see a path's renders:** they are shadow posts on that bot's own profile, reviewable in the app.
- **To render more of one:** `node scripts/iter-bot.js --bot <bot> --mode <path> --count 6 --post --shadow`
- Full per-path detail, every round and every residual: `NEW_PATHS_RUN_STATE.md`
- The 97 cross-bot laws this produced (up from 37): `BOT_SCENE_QUALITY_PLAYBOOK.md`

Scores are **my** grades on a 5-lens rubric, and my grading runs harsh by your own note, so read a 3.5
as "worth a look" rather than "bad". The bar I worked to was avg >= 4.5 with nothing below 4.

---

## Read this first: a correction

Mid-run I thought I had the headline result. On PixelBot `observatory-tower`, sorting its 15 renders by
prompt length split them 4.51 (8 shortest) against 3.87 (7 longest). I wrote that up as a starred fleet
law and put it at the top of this sheet.

**Then I tested it against all 25 graded paths and it did not hold.** Bot-centred correlation between a
path's median prompt length and its grade: **r = -0.05**, i.e. nothing. DinoBot's paths trend the
*opposite* way (r = +0.92, and its longest path is the best of the run). The two shortest-prompt paths in
the fleet, `ice-cavern` and `bath-toy-flotilla`, grade 3.8 and 3.0. FarmBot `apiary-beekeeping` runs 578
words and grades 4.37.

So **do not read "shorter prompt" as "better path" anywhere in this sheet.** What survives is the
narrower, causal claim, and it is about POSITION of a named element, proven by moving it:

> ToyBot `sand-toy-beachworks`, one additive edit, nothing removed: the tool noun at 39-81% of the
> prompt rendered **1 of 6**; the same noun at 5% rendered **6 of 6**.

That is the form to trust. A path's quality is set by what sits in the attended region, not by how much
text follows it. I added `bot_run_log.prompt_words` (migration 546) so the question is now one query per
path, including on failed renders where it was previously impossible to ask.

---

## Passing the bar (avg >= 4.5, nothing below 4)

| score | bot | path | what it is | the best frame |
| --- | --- | --- | --- | --- |
| **4.8** | DinoBot | `undergrowth-scale` | the forest floor at ankle height, where a fern is a column | the giant rendered as ONLY a tail, ripples spreading from its tip across a puddle |
| **4.75** | SteamBot | `brass-glasshouse` | the bot's first green/wet/translucent interior | a colossal moss-clad tree filling a glazed rotunda, ring balcony curving past it |
| **4.7** | ToyBot | `puppet-theatre` | a proscenium as a whole framing language | painted flats carrying pictorial scenery, stage full |
| **4.7** | PixelBot | `volcano-forge` | the classic game-splash forge interior | — |
| **4.7** | FaeBot | `mushroom-apothecary` | a remedy shop inside a giant mushroom, the bot's first interior | — |
| **4.7** | DinoBot | `den-and-burrow` | the hero is the unseen underground | — |
| **4.67** | BloomBot | `alpine-wildflower-meadow` | altitude as a physical fact, not a backdrop | a crevassed BLUE GLACIER TONGUE above the flower line, magenta fireweed in the rock seams |
| **4.64** | PixelBot | `castle-town-gate` | arrival at a fortified threshold | a gatehouse three-quarters on, red-lit houses stepping up behind, a figure pointing at a chimney plume |
| **4.6** | DinoBot | `courtship-display` | dinosaur BEHAVIOUR, the wildlife-documentary money shot | backlit display anatomy with light passing through it |
| **4.6** | MangaBot | `onsen-evening` | a hot spring at dusk | dozens of lanterns each carrying a painted swallow over a floating-lantern pool |
| **4.52** | PixelBot | `floating-market-canal` | a canal town where the market IS boats | a cat peeking out of a drain hole cut low in the quay wall |
| **4.5** | FaeBot | `star-charting` | fae astronomers; the bot's first night sky and first "thinking" | a fae prone on a bracket fungus, thorns pushed in at depths, a snail on the candle cup, magenta lightning behind |

## Close — each has one named, measured lever

| score | bot | path | the residual, and the lever |
| --- | --- | --- | --- |
| 4.47 | ToyBot | `snow-globe-world` | 9/9 on the shipped glass spec; best is an aurora over a single lit window |
| 4.42 | BloomBot | `orchid-cloud-forest` | orchids scatter like stickers instead of clumping, and a pale sky patch survives. Lever: delete template prose so both clauses move into the attended half |
| ~4.4 | FarmBot | `sheep-shearing-day` | **18/18 rendered with zero content-filter failures**, where two sibling close-range paths on this bot trip it at 12-17%. Best 4.7: one just-shorn animal, greyhound-shaped in a woolly hat, dead centre of the mob with a hen on the rail judging it. Lever: the bare body lands 5 of 6; put that clause in the framing block too |
| 4.4 | DinoBot | `amber-forest` | ~1 in 4 renders the resin OPAQUE, losing the lens half of the premise. Lever: the clean-medium opt-out, already applied at merge |
| 4.37 | FarmBot | `apiary-beekeeping` | was 3.83; removing the per-bee detail exemption took giant bees 3/5 -> 0/6. Replicate's filter trips on ~12% (3 of 26). **I closed a half-applied fix here AFTER this grade was measured** — the inflator had been stripped from the prose and pools but not from the output order, the layer that ships every time. The 4.37 is the honest record of the renders you are looking at; the fix is unverified and wants one 6-render round |
| 4.27 | BrickBot | `balloon-festival` | ~1 in 6 goes wide-and-distant and loses the scale ruler, saturation and text control at once. Lever: purge the camera pool by frame-size |
| 4.26 | PixelBot | `observatory-tower` | an astronomer's tower, dome slot open to the night. **Text 0/15** on the fleet's highest text-risk subject, won by moving every pinned object off a flat board onto curving plaster. Best frame 5.0: a figure on the ladder handing a steaming mug down to a small one reaching up. Lever: its long rolls push `reading_tool` and `room_dressing` off the end, and those two axes are exactly what the bare-walled 3.0 renders were missing |
| 4.2 | SteamBot | `rooftop-telegraph` | the vantage reaches only 1 of 6 prompts, and that render is the 4.8. Lever: give the vantage its own output-order item |
| ~4.2 | FaeBot | `honey-harvest` | beat the naked-cherub trap that sank `acorn-boat-regatta`, 6/6 first try, by opening with a fae *at work mid-movement* rather than a static description. Also settled a fleet question: the content-filter wall is the whole flux-2 family, not one model |
| 4.15 | FaeBot | `autumn-seed-gathering` | fae working the autumn seed harvest, hanging off pods in a gale. **Went 2.27 -> 4.15, the biggest arc of the run.** Best 4.6: a fae in a green leaf-cloth work dress hanging off a colossal split pod at full stretch, hair streaming, the air solid white with tufts. Grade round 3 only; the twelve earlier renders on the profile are the pale batches. Lever: delete one output-order item so the pod and the backlit halo move into the attended half |
| 4.13 | BloomBot | `coastal-cliff-bloom` | the postcard vista, ~4 of 6, and NOT beatable by wording ("cliff" reached 0 of 24 prompts and the cliff rendered anyway). Lever: halve a 6.6 KB template |
| 4.02 | DinoBot | `tidal-flat-tracks` | the giant has already walked through: filling trackways, a drag mark, the flat as a mirror. **Look at round 2, not round 3** — R3's fix was right but a separate 3-entry sky defect rolled twice and cost the round. Best frame ~4.9: a colony of amber-shelled periwinkles has moved into a single dinosaur footprint while a black squall with a saffron gap lies flat in the standing water. Lever: purge the 6 pool entries describing a continuous furrow rather than discrete hollows (4.19 vs 2.83 mean) |
| 4.00 | MangaBot | `game-center-arcade` | the bot's first true interior-night path. Corridor 3/6 -> **0/12**, every machine in shot full 1/6 -> **12/12**. Best 4.6: a young woman feeding her last coin in with three more stacked on the ledge and one already rolling, amber against a cold teal shaft. Lever: lettering survives in the compressed background band; fill it with a named physical mass (ducts, a prize-shelf wall of plush) |
| 3.97 | FarmBot | `hay-baling-summer` | high-summer haymaking, the field half-cut. Text 0/18, one corridor in 18. Best 4.8: an enormous cropped bale, hot rim against a deep indigo flank, its shadow a hard bar across the frame, the air packed with individually lit motes, one pheasant feather laid on a twine-bound ridge. Lever: one light family of six averages 2.5 against 3.0-4.3 for the rest, because its own wording says "lies flat" and "bleached" — five entries to reword |

## Under the bar — my read is these need a decision, not another round

| score | bot | path | honest assessment |
| --- | --- | --- | --- |
| 3.92 | FarmBot | `lambing-season` | best frame 4.6 (a hail shower with a gold sunbreak, eight lambs running a wall line). ~4 `light` entries described as "even" produce every sober frame; rewriting those is one edit |
| 3.8 | PixelBot | `ice-cavern` | the charm fix worked (0 carved-relief gibberish) and the ice-native charms are lovely. Blocker is a stone-masonry drift I deliberately did not chase, because naming the enclosure was itself the earlier fix for voxel looks rendering a void |
| 3.5 | ToyBot | `sand-toy-beachworks` | sand engineering as an epic, where the toys are the tools that built it. **The premise now lands 6 of 6 where it landed 1 of 6**, and zero lettering in 18 renders on a path made of branded plastic. Best frame: a cathedral-scale fortress crossing the frame with a big orange bucket low right, so the picture says *all of this came out of that*. Lever: the toys still render factory-fresh, and the fix is six words moved to the front of the prefix |
| 3.45 | BrickBot | `archaeology-dig` | a LEGO excavation, the trench cut open. **Zero text in 18 renders** on the bot's most label-prone subject. Best 4.4: a colossal white brick hand rising out of the floor with four crew standing on the open palm. Lever: one pool entry of 25 is eating the hero — a giant ladder, while the trench already contains an ordinary one, so the model renders the ordinary one and drops the find |
| 3.07 | FaeBot | `acorn-boat-regatta` | the bot's first action path. 5 of 6 rendered nude wingless cherub dolls — "tiny/palm-sized" on a humanoid IS a naked-putto prior. `honey-harvest` later beat that trap with a fix this path never got, and it is a transplant rather than research |
| 3.0 | ToyBot | `bath-toy-flotilla` | genuinely funny when it lands (a submarine breaching in front of a duck squadron; a rubber crocodile with two penguins as crew) but fails VIVID in half the frames. Toys render factory-fresh against "scuffed sun-faded well-chewed" in all 24 prompts |
| — | BrickBot | `airfield-biplanes` | best draws 4.5 (a biplane wheels-off over a brick garden); gibberish wing text at ~1-2 per 6, below the resolution of a 6-render round |

## Two DinoBot bonus paths, outside the original 33

Both are clones of `paleo-landscape` with only the hero pool swapped, and both revealed something.

- **`desert-dunes`** — a pure paleo desert vista, ~4.5.
- **`snowline-forest`** — ~4.6, and it had a real bug. Cloning inherited an archetype that MANDATES
  "WARM EARTH-TONES ... NOT cold-monochrome" and HARD-BANS "Iceland-style snowy-grey-rocky alpine
  canyons" — so the path was ordered the opposite palette and forbidden from rendering its own subject.
  Warm vocabulary reached all 8 early renders. Fixed with a cold sibling archetype plus its own cold
  flora pool, locked by a test so it cannot silently drift back.

> **Note on a 36th shadow path:** PixelBot `cozy-farming-life-sim` is also in `shadowPaths[]` but is NOT
> part of this run — you pulled it for rework on 2026-09-18. It is untouched.

---

## Four decisions that are yours, not mine

I deliberately did not action any of these, because each touches live content or needs your taste.

1. **FarmBot's shared `FARMBOT_COZY_NEUTRAL` fragment.** 273 words starting at **word 4** of every
   prompt, across **35 live paths**, so the actual scene does not begin until word ~267 of ~460 (58% in).
   This rests on INTERVENTION evidence, not on any length correlation: the same class of fix on two other
   bots this run took one path's frame-filling failure 2/6 -> 0/6 and another's clock faces 3/6 -> 1/6,
   each by moving or deleting one fragment and re-rendering. **Counter-evidence, stated fairly:**
   `apiary-beekeeping` carries this very fragment, runs 578 words, and still grades 4.37 — so it is not
   fatal, and the honest claim is that it wastes the attended region rather than ruins the bot.
2. **The fleet-wide `no text, no watermarks` suffix.** A negation CLIP cannot process, on every bot.
   Measured at 8 renders per arm and **inconclusive** (0/8 with it vs 1/8 without). Resolving it needs
   ~40 per arm, so I changed nothing.
3. **Two FarmBot workarounds that are now unnecessary.** The prompt-truncation bug they were built around
   is fixed and verified closed, so `farmbot-halloween-costume-parade` can go back to 3 humans instead of
   2, and `barn-animal-shelter-interior` no longer needs its section reorder.
4. **Which of these 35 go live, and in what order.** My own read: the 12 in the passing table are ready
   as-is; the 13 "close" ones each have one named lever I can spend in a single round if you want them
   lifted first; `acorn-boat-regatta` is the best value of all, because the fix already exists on a
   sibling path.

---

## What else came out of the run, beyond the paths

Four silent engine bugs, found by building on top of the engine rather than by looking for them:

| bug | blast radius | status |
| --- | --- | --- |
| Prompt truncation at `maxTokens: 400` | 6.7% of all bot renders cut mid-word; **21.4% on FarmBot** | Fixed, and **verified closed from the DB: 423 stamped runs across 12 bots, 0 truncated** |
| `bannedPhrases` matched substrings | killed 19% of one path's renders on correct content ("harvestman" contains "man ") | Fixed with word-boundary + inflection matching; took one pool's render-killing entries 31 -> 0 |
| `bot_dedup` read was unpaginated | **17 of 19 bots** over the 1000-row cap; GothBot had 14 of its 128 axes visible, so the shuffle-bag was silently plain random | Fixed with a paginated loader on a stable order |
| Per-path model pins were dropped | a path could pass QA on a pinned model and then silently render on another | Both halves fixed (the QA patch and the production deriver) |

Each is locked by a CI test I verified goes red against the old code. Tests went 4,273 -> **4,288**, all
green. The playbook went **37 -> 97** numbered laws.

The three I would most want you to know, because they change how the next path gets built:

- **The wrapper can beat the path, in two different ways.** On FaeBot, 35 words of the bot-wide register
  at 18-25% of the prompt said "soft ethereal ... dreamy atmospheric glow" on a path about a wind rodeo,
  and won: every one of the path's own laws was present AND correctly placed, and none of them rendered.
  On BrickBot, 83 words of fixed preamble in three stacked layers pushed the scene start to 19-34% and
  cost colour bands 1/6 vs 6/6. **So the diagnostic is not "is my clause in the prompt" — it is "what
  sits between my prefix and the scene, and what fraction of the prompt is spent before my content
  starts".** Both were fixed by a path-own medium, which needs no migration.
- **The model adds but does not subtract.** The best-controlled measurement in the file: one clause, same
  sentence, same position, same prompts — "woolly cuffs still at the ankles" (additive) rendered **6/6
  every round**, "no fluff on the body anywhere" (subtractive) rendered **1/6**. You cannot remove an
  expected feature by describing its absence. Name a positive object that happens to lack it.
- **The output order is the only layer that ships, and it broke in both directions on the same day.** One
  path had an inflator surviving *in* the order after being removed everywhere else (the apiary bug);
  another had a law deleted *from* the order while it stayed in the prose and 24 of 25 pool entries, and
  it reached **0 of 6** prompts. Prose and pool text reach roughly 0%; the order reaches 100%.
