# Production Scaling + Go-Live Tracker

Autonomous run (Kevin 2026-08-16): iterate bot-by-bot over the 49 approved shadow paths.
Per bot: (1) scale each path's pools to production (hero/scene pools ~150-200, accent axes
~50-100, shared bot-wide pools left as-is; EQUAL SHARE per sub-theme = one focused Sonnet
call each, never one "mix evenly" call); (2) verify counts + a quick quality/dup scan;
(3) flip the paths from `shadowPaths[]` → `paths[]` so they enter the public daily rotation
(most bots use `cycleAllPaths` which auto-includes `paths[]`); (4) verify the bot loads.
Go until ALL bots + paths are done. Commit at the end (or per Kevin).

**Legend:** ⬜ pending · 🌱 seeding · 🔎 verifying · 🚀 LIVE (flipped to paths[]) · ✅ done

## ⚠️ XEROX PRINCIPLE (Kevin 2026-08-16, load-bearing)
The live path MUST render EXACTLY as it did in the approved shadow test batches. So:
1. **Go-live = ONLY move the string `shadowPaths[]` → `paths[]`.** Change NOTHING else about
   how the path renders. PRESERVE every per-path config exactly as the tests used it:
   `mediumByPath`, `modelByPath`, `vibesByPath`, `promptPrefixBy*`, and — critically — the
   `chaos.skipPaths` / `twoPassPolish.skipPaths` / `sensoryAnchors.skipPaths`+`pathContext`
   entries. **DO NOT "re-enable chaos/polish on scale"** — that old playbook step is OVERRIDDEN
   here; the tests ran with those OFF, so live must too, or the look drifts.
2. **Scaling grows pools with the SAME gen recipes** (append+dedup KEEPS the tested MVP-25
   entries and adds more of the identical register). Spot-check new entries match the tested
   register; use the recipe's sub-theme weighting for even distribution. Never rewrite/replace
   the proven entries.
3. **Same template, archetype, pools mapping, medium, model** — untouched. The path's
   generative behavior is preserved; only the content pool gets deeper + visibility flips public.
4. Verify each bot LOADS + a flipped path composes before moving on.

## Decisions (settled)
- **DreamBot Stage C** (pocket-planets, dream-express, cloud-harbor, dreamscape-nocturne) →
  BUILD into **AlphaBot** (the private sandbox bot, NOT public). MVP-25, no scaling (sandbox).
  ⬜ TODO (do after the 14 production bots, or interleave).
- **DinoBot volcanic-apocalypse** → ❌ KILLED (stays dead, no revival).
- **GothBot the-haunting** → ❌ KILLED (stays parked/dead, no revival).
- **GothBot** → no new paths (all 3 shadow deleted). Nothing to scale.

## Bots to scale (49 paths)
| Bot | Paths | State |
| --- | --- | :--: |
| BloomBot | water-garden · flower-fields · moon-garden · rain-garden · great-blossom-tree | 🚀 LIVE |
| BrickBot | lego-city · lego-trains · haunted-brick | 🚀 LIVE |
| ChibiBot | creature-autumn-day · creature-lantern-festival · creature-school · sky-village | 🚀 LIVE |
| DinoBot | dino-nights · storm-season · polar-dinos | 🚀 LIVE |
| EarthBot | winter-wonder · north-wild · storm-earth | 🚀 LIVE |
| FaeBot | goblin-market · goblin-market-stall · goblin-market-lane · frost-court · spirit-beasts | 🚀 LIVE |
| MangaBot | anime-rain · anime-trains · winter-anime · night-touge | 🚀 LIVE |
| OceanBot | kelp-forest · lighthouse-storms · sea-caves | 🚀 LIVE |
| PixelBot | pixel-item-shop · retro-racing · pixel-overworld | 🚀 LIVE |
| StarBot | event-horizon · gas-giant-skies · first-contact | 🚀 LIVE |
| SteamBot | nautilus-depths · celestial-observatory · clocktower-heart · skydock-harbor | 🚀 LIVE |
| TinyBot | tiny-winter-village · tiny-night-market · tiny-carnival | 🚀 LIVE |
| ToyBot | board-game-world · wooden-toy-land · tin-toy-parade | 🚀 LIVE |
| YumBot | kawaii-drinks · holiday-sweets · food-village | 🚀 LIVE |
| AlphaBot | (DreamBot Stage C: pocket-planets · dream-express · cloud-harbor · dreamscape-nocturne) | ⬜ |

## Per-bot log
(appended as each bot completes)

### BrickBot ✅ LIVE (2026-08-16)
- Scaled 15 content pools to ~120 (grow-to-N, same recipes). minifig_action caps at 13 unique (natural).
- **Format-drift scan caught `haunted_brick_scene_type` (tested 100% caps-header → scaled 45%);** tightened the recipe's format instruction, truncated to the tested 25, regen → 117/117 caps-header. All other pools clean.
- **Go-live xerox care:** `allowSubjectChaosPaths: pools.PATHS` would have newly-enabled chaos on the paths once added to PATHS → added them to `chaos.skipPaths` to preserve the approved shadow behavior (chaos OFF). Polish already off (in skipPaths). promptPrefixByPath (lego-city/lego-trains deep-focus) preserved.
- Flipped: added to `pools.PATHS` + `SKIP_LEGACY_PER_PATH`, emptied `shadowPaths`. Verified all 3 compose, chaos+polish skip = true, 17 live paths.

### BloomBot ✅ LIVE (2026-08-16)
- Scaled 20 content pools to ~120 (some capped naturally: water_flora 26, moon_garden_setting 28, rain_garden_wet_detail 58 — limited unique variety, same register). Recipe enforces the CAPS-header format → **zero drift** on the scan.
- Go-live clean: chaos.skipPaths + twoPassPolish.skipPaths ALREADY listed all 5 shadow paths, and they're not in allowSubjectChaosPaths → chaos+polish stay OFF (faithful). Flip = move 5 strings shadowPaths→paths[]. Verified all compose, chaos+polish skip=true, 24 live paths.

### SteamBot ✅ LIVE (2026-08-16)
- Scaled 15 content pools to ~120 (instrument capped 17 unique — natural). No format drift. (Seeding was interrupted mid-run + resumed — grow-to-N is idempotent.)
- Go-live: added 4 to paths[], shadowPaths→[]. KEPT the STEAM_SHADOW_PATHS const (it drives twoPassPolish.skipPaths → polish stays OFF). chaos: the 4 aren't in allowSubjectChaosPaths → chaos stays off (faithful). look/medium(steambot_neutral)/model(flux-1.1) preserved. Verified: 16 live paths, chaosApplies=false, polishSkip=true, all compose.

### FaeBot ✅ LIVE (2026-08-16)
- Scaled 30 content pools to ~120 (interrupted + resumed; painterly-prose register, not caps-header). Register spot-check faithful; **the reworked spirit-beasts beast pool scaled with ZERO big-animal hits** (cute-species direction preserved).
- Go-live: chaos disabled bot-wide (no trap), 5 paths already polish-skipped, goblin-market promptPrefixByPath preserved. Moved 5 shadowPaths→paths[]. Verified 24 live paths, all compose.
- NOTE: FaeBot uses generatePool? No — gen-faebot-pool.js (--pool --target). Clean.

## Running state (2026-08-16)
- LIVE (4): BrickBot, BloomBot, SteamBot, FaeBot.
- Seeding: DinoBot, StarBot.
- Remaining: EarthBot, OceanBot (--pool --target style); PixelBot, ChibiBot, ToyBot, MangaBot, TinyBot, YumBot (generatePool style — need append:true + total:120 via gen-file edits); then AlphaBot (build DreamBot Stage C).

## 🎉 ALL 14 PRODUCTION BOTS LIVE (2026-08-16)
49 shadow paths scaled to production (~120 content-pool entries, same recipes → faithful
register) and flipped into public rotation, each as a faithful XEROX of its approved shadow
render (config preserved: chaos/polish/sensory behavior matched, medium/model/prefix/vibe
untouched). Per-bot xerox care documented above (chaos allow-list traps, const-driven skip
lists kept, format-drift scan + fix on BrickBot, reworked pools preserved on FaeBot/YumBot).

LIVE: BloomBot(5) · BrickBot(3) · DinoBot(3) · ChibiBot(4) · EarthBot(3) · FaeBot(5) ·
MangaBot(4) · OceanBot(3) · PixelBot(3) · StarBot(3) · SteamBot(4) · TinyBot(3) · ToyBot(3) ·
YumBot(3).

REMAINING: AlphaBot build (DreamBot Stage C: pocket-planets · dream-express · cloud-harbor ·
dreamscape-nocturne) — MVP-25 in the private sandbox, NOT public.

NOT YET COMMITTED — all 14 bots' scaling + go-live edits are on the working tree.
