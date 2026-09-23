# New paths — review sheet

**For Kevin, to grade on return.** One line per path, best score first. Every path below is
**SHADOW-ONLY**: it renders on demand and posts hidden, and it is invisible to the hourly dispatcher.
Going live is moving one string from `shadowPaths[]` into `paths[]` and changing nothing else.

To look at any path's renders: they are shadow posts on that bot's own profile, reviewable in the app.
To render more of one: `node scripts/iter-bot.js --bot <bot> --mode <path> --count 6 --post --shadow`.

⏳ **STATUS: 26 of 35 built, 9 outstanding.** This sheet is updated as each wave merges; the final
version will cover all 35. Full per-path detail, every measured round and every residual lives in
`NEW_PATHS_RUN_STATE.md`; the cross-bot laws all this produced are in `BOT_SCENE_QUALITY_PLAYBOOK.md`.

---

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
| 4.37 | FarmBot | `apiary-beekeeping` | was 3.83; removing the per-bee detail exemption took giant bees 3/5 → 0/6. Residual: Replicate's filter trips on this path |
| 4.27 | BrickBot | `balloon-festival` | ~1 in 6 goes wide-and-distant and loses the scale ruler, saturation and text control at once. Lever: purge the camera pool by frame-size |
| 4.2 | SteamBot | `rooftop-telegraph` | the vantage reaches only 1 of 6 prompts — and that render is the 4.8. Lever: give the vantage its own output-order item |
| 4.13 | BloomBot | `coastal-cliff-bloom` | the postcard vista, ~4 of 6, and NOT beatable by wording ("cliff" reached 0 of 24 prompts and the cliff rendered anyway). Lever: halve a 6.6 KB template |

## Under the bar — my read is these need a decision, not another round

| score | bot | path | honest assessment |
| --- | --- | --- | --- |
| 3.92 | FarmBot | `lambing-season` | best frame 4.6 (a hail shower with a gold sunbreak, eight lambs running a wall line). ~4 `light` entries described as "even" produce every sober frame; rewriting those is one edit |
| 3.8 | PixelBot | `ice-cavern` | the charm fix worked (0 carved-relief gibberish) and the ice-native charms are lovely. Blocker is a stone-masonry drift I deliberately did not chase, because naming the enclosure was itself the earlier fix for voxel looks rendering a void |
| 3.07 | FaeBot | `acorn-boat-regatta` | the bot's first action path. 5 of 6 rendered nude wingless cherub dolls — "tiny/palm-sized" on a humanoid IS a naked-putto prior. `star-charting` later beat that trap 0 of 26 with a fix this path never got |
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
   one constant in one file. The same mechanism, fixed on two other bots this run, took one path's
   frame-filling failure 2/6 → 0/6 and another's clock faces 3/6 → 1/6.
2. **The fleet-wide `no text, no watermarks` suffix.** A negation CLIP cannot process, on every bot.
   Measured at 8 renders per arm and **inconclusive** — 0/8 with it vs 1/8 without. Resolving it needs
   ~40 per arm, so I changed nothing.
3. **Two FarmBot workarounds that are now unnecessary.** The prompt-truncation bug they were built
   around is fixed, so `farmbot-halloween-costume-parade` can go back to 3 humans instead of 2, and
   `barn-animal-shelter-interior` no longer needs its section reorder.
