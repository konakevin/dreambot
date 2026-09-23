# New paths — review sheet

**For Kevin, to grade on return.** One line per path, best score first. Every path below is
**SHADOW-ONLY**: it renders on demand and posts hidden, and it is invisible to the hourly dispatcher.
Going live is moving one string from `shadowPaths[]` into `paths[]` and changing nothing else.

To look at any path's renders: they are shadow posts on that bot's own profile, reviewable in the app.
To render more of one: `node scripts/iter-bot.js --bot <bot> --mode <path> --count 6 --post --shadow`.

⏳ **STATUS: 32 of 35 built, 3 outstanding** (2 rendering now, 1 queued). This sheet is updated as each wave merges; the final
version will cover all 35. Full per-path detail, every measured round and every residual lives in
`NEW_PATHS_RUN_STATE.md`; the cross-bot laws all this produced are in `BOT_SCENE_QUALITY_PLAYBOOK.md`.

---

## A correction you should see before the tables

Mid-run I thought I had found the headline result: on PixelBot `observatory-tower`, sorting its 15
renders by prompt length put the 8 shortest at avg **4.51** and the 7 longest at **3.87**. I wrote that
up as a fleet law and had it at the top of this sheet.

**Then I tested it against all 25 graded paths and it did not hold.** Bot-centred correlation between a
path's median prompt length and its grade: **r = -0.05**, i.e. nothing. DinoBot's four paths trend the
*opposite* way (r = +0.92 — its longest path is the best of the entire run). Two of the shortest paths
in the fleet, `ice-cavern` (276w) and `bath-toy-flotilla` (284w), grade 3.8 and 3.0. FarmBot
`apiary-beekeeping` runs 578 words and grades 4.37.

So **do not read "shorter prompt" as "better path" anywhere in this sheet.** What survives is the
narrower claim this project already had evidence for, and it is about position rather than total length:
if a specific element you care about sits late in the prompt, it does not render, and you can prove that
by moving it and re-rendering. That is a per-element, testable claim. A path's overall quality is set by
what is in the attended region, not by how much text follows it.

I have left the mechanism in place as a diagnostic (`bot_run_log.prompt_words`, migration 546) because
it makes the question cheap to ask per path, including on failed renders where it was previously
impossible. But the "trim the pools" lever on `observatory-tower` below is stated as what it really is:
two named axes getting pushed off the end, not a word-count problem.

## Passing the plan's bar (avg ≥ 4.5, nothing below 4)

| score | bot | path | what it is | the best frame |
| --- | --- | --- | --- | --- |
| **4.8** | DinoBot | `undergrowth-scale` | the forest floor at ankle height, where a fern is a column | the giant rendered as ONLY a tail, ripples spreading from its tip across a puddle |
| **4.75** | SteamBot | `brass-glasshouse` | the bot's first green/wet/translucent interior | a colossal moss-clad tree filling a glazed rotunda, ring balcony curving past it |
| **4.7** | ToyBot | `puppet-theatre` | a proscenium as a whole framing language | painted flats carrying pictorial scenery, stage full |
| **4.7** | PixelBot | `volcano-forge` | the classic game-splash forge interior | — |
| **4.7** | FaeBot | `mushroom-apothecary` | the bot's first interior, a remedy shop inside a giant mushroom | — |
| **4.7** | DinoBot | `den-and-burrow` | the hero is the unseen underground | — |
| **4.67** | BloomBot | `alpine-wildflower-meadow` | altitude as a physical fact, not a backdrop | a crevassed BLUE GLACIER TONGUE above the flower line, magenta fireweed in the rock seams |
| **4.64** | PixelBot | `castle-town-gate` | arrival at a fortified threshold | a gatehouse three-quarters on, red-lit houses stepping up behind, a figure pointing at a chimney plume |
| **4.6** | DinoBot | `courtship-display` | dinosaur BEHAVIOUR, the wildlife-documentary money shot | backlit display anatomy with light passing through it |
| **4.6** | MangaBot | `onsen-evening` | a hot spring at dusk | dozens of lanterns each carrying a painted swallow over a floating-lantern pool |
| **4.52** | PixelBot | `floating-market-canal` | a canal town where the market IS boats | a cat peeking out of a drain hole cut low in the quay wall |
| **4.5** | FaeBot | `star-charting` | fae astronomers; the bot's first night sky and first "thinking" | a fae prone on a bracket fungus, thorns pushed in at depths, a snail on the candle cup, magenta lightning behind |

## Close — worth your eye, each has one named lever

| score | bot | path | the residual, and the lever |
| --- | --- | --- | --- |
| 4.47 | ToyBot | `snow-globe-world` | 9/9 on the shipped glass spec; best is an aurora over a single lit window |
| 4.42 | BloomBot | `orchid-cloud-forest` | orchids scatter like stickers instead of clumping, and a pale sky patch survives — both sit LATE in a 377-word prompt. Lever: delete template prose |
| 4.4 | DinoBot | `amber-forest` | ~1 in 4 renders the resin OPAQUE, losing the lens half of the premise. Lever: the clean-medium opt-out, already applied at merge |
| ~4.4 | FarmBot | `sheep-shearing-day` | shearing day in the shed. **18/18 rendered with zero content-filter failures**, where the two sibling close-range FarmBot paths trip it at 12-17%. Best frame 4.7: one just-shorn animal, greyhound-shaped in a woolly hat, dead centre of the woolly mob with a hen on the rail judging it. Residual: the bare body lands 5 of 6; lever is putting that clause in the framing block too |
| 4.37 | FarmBot | `apiary-beekeeping` | was 3.83; removing the per-bee detail exemption took giant bees 3/5 → 0/6. Residual: Replicate's filter trips on this path (measured 3 of 26, ~12%). **⚠️ I closed a half-applied fix here after this grade was measured** — the inflator had been stripped from the prose and pools but not from the required output order, the one layer that ships every time. The 4.37 is the honest record of the renders you are grading; the fix is unverified and wants one 6-render round |
| 4.27 | BrickBot | `balloon-festival` | ~1 in 6 goes wide-and-distant and loses the scale ruler, saturation and text control at once. Lever: purge the camera pool by frame-size |
| 4.26 | PixelBot | `observatory-tower` | an astronomer's tower, the dome slot open to the night. **Text 0/15** on the fleet's highest text-risk subject, won by moving every pinned thing onto curved plaster instead of a flat board. Best frame 5.0: a figure on the ladder handing a steaming mug down to a small one reaching up. Lever: its long rolls push `reading_tool` and `room_dressing` off the end, and those two axes are exactly what the bare-walled 3.0 renders were missing |
| ~4.2 | FaeBot | `honey-harvest` | beat the naked-cherub trap that sank `acorn-boat-regatta`, 6/6 first try, by opening with a fae *at work mid-movement* rather than a static description. Two 4.5s. Also settled a fleet question: the Replicate content-filter wall is the whole flux-2 family, not one model |
| 4.2 | SteamBot | `rooftop-telegraph` | the vantage reaches only 1 of 6 prompts — and that render is the 4.8. Lever: give the vantage its own output-order item |
| 4.02 | DinoBot | `tidal-flat-tracks` | the giant has already walked through: filling trackways, a drag mark, the flat as a mirror. ⚠️ **Look at round 2, not round 3** — round 3's fix was right but a separate 3-entry sky defect rolled twice and cost the round. Best frame ~4.9: a colony of amber-shelled periwinkles has moved into a single dinosaur footprint while a black squall with a saffron gap lies flat in the standing water. Lever: purge the 6 pool entries that describe a continuous furrow rather than discrete hollows (4.19 vs 2.83 mean) |
| 4.13 | BloomBot | `coastal-cliff-bloom` | the postcard vista, ~4 of 6, and NOT beatable by wording ("cliff" reached 0 of 24 prompts and the cliff rendered anyway). Lever: halve a 6.6 KB template |

## Under the bar — my read is these need a decision, not another round

| score | bot | path | honest assessment |
| --- | --- | --- | --- |
| 3.92 | FarmBot | `lambing-season` | best frame 4.6 (a hail shower with a gold sunbreak, eight lambs running a wall line). ~4 `light` entries described as "even" produce every sober frame; rewriting those is one edit |
| 3.8 | PixelBot | `ice-cavern` | the charm fix worked (0 carved-relief gibberish) and the ice-native charms are lovely. Blocker is a stone-masonry drift I deliberately did not chase, because naming the enclosure was itself the earlier fix for voxel looks rendering a void |
| 3.07 | FaeBot | `acorn-boat-regatta` | the bot's first action path. 5 of 6 rendered nude wingless cherub dolls — "tiny/palm-sized" on a humanoid IS a naked-putto prior. `star-charting` later beat that trap 0 of 26 with a fix this path never got |
| 3.5 | ToyBot | `sand-toy-beachworks` | sand engineering as an epic, where the toys are the tools that built it. Went 2.5 → 3.5 and the premise now lands 6 of 6 where it landed 1 of 6, plus zero lettering in 18 renders on a path made of branded plastic. Best frame: a cathedral-scale fortress crossing the frame with a big orange bucket low right, so the picture says *all of this came out of that*. Lever: the toys still render factory-fresh, and the fix is six words moved to the front of the prefix |
| 3.0 | ToyBot | `bath-toy-flotilla` | genuinely funny when it lands (a submarine breaching in front of a duck squadron; a rubber crocodile with two penguins as crew) but fails VIVID in half the frames. Toys render factory-fresh against "scuffed sun-faded well-chewed" in all 24 prompts |
| — | BrickBot | `airfield-biplanes` | best draws 4.5 (a biplane wheels-off over a brick garden); gibberish wing text at ~1-2 per 6, which is below the resolution of a 6-render round |

## Two DinoBot bonus paths, outside the original 33

You asked me to promote two buckets to their own paths. Both are clones of `paleo-landscape` with only
the hero pool swapped, and both revealed something.

- **`desert-dunes`** — a pure paleo desert vista, ~4.5.
- **`snowline-forest`** — ~4.6, and it had a real bug. Cloning inherited an archetype whose template
  MANDATES "WARM EARTH-TONES … NOT cold-monochrome" and HARD-BANS "Iceland-style snowy-grey-rocky
  alpine canyons" — so the path was ordered the opposite palette and forbidden from rendering its own
  subject. Warm vocabulary reached all 8 early renders. Fixed with a cold sibling archetype plus its
  own cold flora pool; the result is the first render that actually looks like a snowline forest.

---

## Three decisions that are yours, not mine

I deliberately did not action any of these, because each touches live content.

1. **FarmBot's shared `FARMBOT_COZY_NEUTRAL` fragment — the biggest measured lever in the run.**
   273 words, starting at **word 4** of every prompt, across **35 live paths**. Sonnet's actual scene
   does not begin until word ~277, and content past ~30% of a prompt renders at roughly zero. So the
   entire attended region of every FarmBot render is generic preamble, identical every time. This is
   one constant in one file. This rests on the INTERVENTION evidence, not on any
   length-vs-grade correlation: the same fix on two other bots took one path's frame-filling failure
   2/6 → 0/6 and another's clock faces 3/6 → 1/6, each by moving or deleting one fragment and
   re-rendering. Counter-evidence, stated fairly: FarmBot's `apiary-beekeeping` carries this very
   fragment, runs 578 words, and still grades 4.37 — so the fragment is not fatal, and the honest claim
   is that it wastes the attended region, not that it ruins the bot. The same mechanism, fixed on two other bots this run, took one path's
   frame-filling failure 2/6 → 0/6 and another's clock faces 3/6 → 1/6.
2. **The fleet-wide `no text, no watermarks` suffix.** A negation CLIP cannot process, on every bot.
   Measured at 8 renders per arm and **inconclusive** — 0/8 with it vs 1/8 without. Resolving it needs
   ~40 per arm, so I changed nothing.
3. **Two FarmBot workarounds that are now unnecessary.** The prompt-truncation bug they were built
   around is fixed, so `farmbot-halloween-costume-parade` can go back to 3 humans instead of 2, and
   `barn-animal-shelter-interior` no longer needs its section reorder.
