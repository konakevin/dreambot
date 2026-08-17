# Shadow-Path Approvals (review + go-live tracker)

Kevin reviews the 6 shadow test renders per path in the admin shadow feed and rules
APPROVE / REJECT. When ALL paths are decided, Claude: (1) seeds every APPROVED path to
production scale (MVP-25 → 200+, equal share per sub-theme, one Sonnet call each), then
(2) switches them live (move the string from the bot's `shadowPaths[]` into `paths[]`,
remove from any shadow-only skip nuance if needed), commit + deploy nothing extra needed
(bots are code-only; the dispatcher picks them up on next cycle).

**Legend:** ⬜ pending · ✅ APPROVED · ❌ REJECTED · ✏️ approved-with-notes

---

## BloomBot (5) — ✅ ALL APPROVED (2026-08-16)
- ✅ water-garden
- ✅ flower-fields
- ✅ moon-garden
- ✅ rain-garden
- ✅ great-blossom-tree

## BrickBot (3 approved; micro-skyline REMOVED) — ✅ (2026-08-16)
- ✅ lego-city
- ✅ lego-trains
- ✅ haunted-brick
- ❌ micro-skyline — REMOVED from code entirely (path file + archetype + template + 7 pools + 7 seeds deleted; de-wired from index.js)

## DinoBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ dino-nights
- ✅ storm-season
- ✅ polar-dinos

## EarthBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ winter-wonder
- ✅ north-wild
- ✅ storm-earth

## FaeBot (5) — 4 approved; spirit-beasts iterating (2026-08-16)
- ✅ goblin-market
- ✅ goblin-market-stall
- ✅ goblin-market-lane
- ✅ frost-court
- ✅✅ spirit-beasts — APPROVED, READY TO SCALE (Kevin 2026-08-16: "now good, ready to scale"). REWORKED (direction achieved). Recast the beast pool to ONLY cute/soft species (fawns/does/roe deer, red foxes + fox kits, bunnies/hares, squirrels, songbirds/owls, hedgehogs, dormice, pine martens; hard-banned bears/elk/moose/wolves/horses/koi) + rewrote template mandates from "MAJESTIC/large/iconic" to "adorable, soft, sacred SPIRIT-animal" with amplified magic (bold glowing tell + drifting enchanted motes + sacred aura). Anchored on the 8 hearted exemplars (fawn w/ flower crown, glowing-tail fox, star-coat deer). **R1 4.83 (four wallpaper 5s), R2 confirms** — sleeping glowing-tail fox kit, star-spined hedgehog, dormouse by a star-willow lotus pond, two nuzzling fawns, star-coat fawn under a toadstool, bunny w/ dandelion-lights. Exactly the "beautiful AND magic" spirit-animal look. Residual: intermittent faint painterly fake-signature/seal (~2/6) — a pre-existing artifact of the artist-lineage painterly medium (present on the hearted R0 exemplars too); a "no signature" negation BACKFIRED (negation-leak → MORE signatures), reverted. Shadow-posted (R1 + R2). Awaiting Kevin's re-review.

## GothBot (ALL 3 shadow paths DELETED — 2026-08-16)
- ❌ masquerade-ball — DELETED (removed from code entirely)
- ❌ dark-familiars — DELETED after re-review (Kevin still didn't like it even after the Van-Helsing rework); do NOT scale
- ❌ elegy — DELETED after re-review (Kevin still didn't like it even after the Van-Helsing rework); do NOT scale
- ~~(prior rework notes preserved below for history)~~
- ✅ dark-familiars — Van-Helsing rework DONE (R3, ~4.4). Added a "vampire-hunter-era WORLD" anchor (Dracula/Castlevania/Bram-Stoker: candlelit crypts, cathedral stone, wrought-iron, gaslit windows, Carpathian night). R1 (~4.5) settings generic → R2 (~4.3) settings landed beautifully but the vampire push caused ~2/6 fanged-monster/glowing-eye-in-void misses → R3 fix: "ONLY THE WORLD is vampiric; the animal is a calm ordinary beautiful REAL creature — mouth closed, no fangs, no snarl, no glowing eyes." R3 result: all creatures now clean/beautiful (fix worked), strongest renders richly Van-Helsing (raven on a frost iron-gate, white raven in a cathedral niche, black cat on a candlelit Victorian sill w/ moon+castle, cat in a mossy crypt-corridor, cat over a red-lit gothic vampire-city). Residual: tight-portrait / graphic-poster looks (owl, serpent) sometimes render a plain/void background instead of a gothic setting (a look-register interaction, not a defect — still handsome). Locked at R3 (3-round cap). Shadow-posted (R1/R2/R3). Awaiting Kevin's re-review. Optional future polish: pull the flat-background graphic-poster looks from this path if you want 100% gothic settings.
- ✅ elegy — Van-Helsing rework DONE (R2, ~4.7). Same WORLD anchor + a marble-STATUE lock (fixed R1's living-winged-woman drift). R2 landed textbook Van-Helsing cemeteries: wrought-iron gates w/ crucifix + gaslamp globes, moonlit mausoleum paths in fog, a marble praying-angel among lilies. Romantic-melancholy, no horror. Residual: occasional epitaph text-leak on a plinth. Shadow-posted. Awaiting Kevin's re-review.

## ChibiBot (4) — ✅ ALL APPROVED (2026-08-16)
- ✅ creature-autumn-day
- ✅ creature-lantern-festival
- ✅ creature-school
- ✅ sky-village

## MangaBot (4) — ✅ ALL APPROVED (2026-08-16)
- ✅ anime-rain
- ✅ anime-trains
- ✅ winter-anime
- ✅ night-touge

## OceanBot (3 approved; feeding-frenzy DELETED after further review, 2026-08-16)
- ✅ kelp-forest
- ❌ feeding-frenzy — REJECTED on further review; removing from code entirely
- ✅ lighthouse-storms
- ✅ sea-caves

## PixelBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ pixel-item-shop
- ✅ retro-racing ⭐ Kevin: "excellent" — the MODEL for a new direction
- ✅ pixel-overworld

> **⭐ FUTURE DIRECTION (Kevin, 2026-08-16): more pixel-SCENE paths like `retro-racing`.**
> retro-racing works because it renders a full, composed SCENE *in* pixel art (a car
> driving through a landscape) rather than looking like a screenshot/UI of a videogame.
> That's the win: pixel art as a MEDIUM for real scenes, not pixel art imitating game
> screens. Build more PixelBot paths on this "full pixel scene, not a game-screenshot"
> principle. Revisit later as its own mini-stage.

## StarBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ event-horizon
- ✅ gas-giant-skies
- ✅ first-contact

## SteamBot (4) — ✅ ALL APPROVED (2026-08-16)
- ✅ nautilus-depths
- ✅ celestial-observatory
- ✅ clocktower-heart
- ✅ skydock-harbor

## TinyBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ tiny-winter-village
- ✅ tiny-night-market
- ✅ tiny-carnival

## ToyBot (3) — ✅ ALL APPROVED (2026-08-16)
- ✅ board-game-world
- ✅ wooden-toy-land
- ✅ tin-toy-parade

## YumBot (holiday-sweets + food-village approved; kawaii-drinks reworking 2026-08-16)
- ✅✅ kawaii-drinks — APPROVED, READY TO SCALE (Kevin 2026-08-16: "also good to scale now"). REWORKED (direction achieved). Added a story-MOMENT axis (drinks toasting/jumping/sharing a straw/at a party) + a cute-DECOR axis (confetti, balloons, bunting, sprinkles — pickN 2-3) + a busier/more-decorated scene pool + a "MAXIMAL CUTENESS + fun story + pops of color, never minimal" template. Result: drinks now render as adorable heroes with personality (arms, blush, faced boba pearls) in rich, colorful, story-rich scenes (carnival cocoa, garden tea-party latte, cherry-blossom cafe, birthday boba w/ candle, two lemonades sharing a straw, candy-shop soda fountain). ~4.7-4.8, mostly wallpaper-grade. One R1 drift (a "birthday cake" scene entry made a cake the hero + a text banner) → patched entries 4+16 to drink-hero, no banners; R2 confirms clean. Shadow-posted. Awaiting Kevin's re-review.
- ✅ holiday-sweets
- ✅ food-village

---

## Not built — decisions pending (do NOT seed/launch until resolved)
- ⬜ DreamBot Stage C: pocket-planets · dream-express · cloud-harbor · dreamscape-nocturne — BLOCKED (stale premise; where should they live?)
- ⬜ DinoBot volcanic-apocalypse revival
- ⬜ GothBot the-haunting revival
