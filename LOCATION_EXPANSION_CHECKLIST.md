# Location Expansion — QA Checklist

> ⏸️ **PAUSED 2026-08-24** to fix a systemic engine issue first: nightly CAST renders have a
> "cardboard cutout" look (rigid frontal-portrait framing + modern default wardrobe + no cinematic
> scene-integration) vs. Kevin's hearted Create renders (candid/editorial, on-setting wardrobe, lit by
> the scene). Root cause + plan captured in this session; fix the `characterSlotPrompt.ts` composition
> (relax the over-rigid frontal framing now that swap safety guards exist; add cinematic lighting;
> populate `biome_config.WARDROBE` per location). RESUME location expansion after the engine upgrade.
> Sci-Fi cluster already validated (alien planet/cyberpunk/mars ✅, space station scene ✅/wardrobe⚠️).


Tracks each new/revived location through dark-launch QA. Nothing flips live until the whole set is
validated, then one batch flip: `UPDATE location_cards SET admin_only = false WHERE admin_only = true;`

**Dark-launch mechanism (mig 444):** a revived card gets `picker_category` set (into its section) AND
`admin_only = true`. Admins see it in the picker (with an ADMIN badge); regular users do not. QA = an admin
selects the location in-app and creates a real dream in it, then grades the render.

**Columns:** Recipe (6/6 phrase-arrays) · Thumb (tile image) · Depth (iconic/location spots) ·
Render (test dream made) · Grade (visual QA) · Status: ⬜ dark / 🔎 in-QA / ✅ ready / 🟢 live.

### QA render recipe (validated 2026-08-24)
`node scripts/qa-location.js --location "<name>" [--cast-medium photography --scene-medium cinematic]`
- **Cast** (self / plus_one): pin a vivid FACE-SWAP + dream-eligible medium. `photography` validated for
  sci-fi (clean face, vivid, on-theme). Avoid `heirloom`/`vintage_film` (sepia = cheese) and scene-only
  mediums (`cinematic`/`real_astro` drop the character).
- **Scene-only**: `cinematic` (or `real_astro`) → stunning wallpaper-grade worlds.
- **Held props are natural-only now** (mig-free code fix to `actions_faceswap.ts`, deployed 2026-08-24):
  dropped 8 arbitrary "holding a glowing orb/artifact/energy core/map/guitar/helmet" poses. Props now only
  appear when the scene motivates them (e.g. netting a sample from an alien pool, a holo-device in a
  cyberpunk street) — natural + enhancing, per Kevin's rule.
- **TODO (pin at launch):** the QA forces the medium; production users still pick freely. Before flip-live,
  give imagined locations a medium affinity so users can't pair "dragon's lair" with sepia (engine feature).

---

## Live already (not dark — surfaced in Phase 0)
Fantasy Worlds section (7 cards) went live with the two-tier picker. Depth top-up pending for the 6
recipe-only ones.

| Location | Section | Depth | Notes |
|---|---|---|---|
| Wizard Academy | Fantasy Worlds | 100 | deep, good |
| Rose Palace | Fantasy Worlds | recipe-only | depth top-up pending |
| Cloud Kingdom | Fantasy Worlds | recipe-only | depth top-up pending |
| Fairy Tale Kingdom | Fantasy Worlds | recipe-only | depth top-up pending |
| Cherry Blossoms | Fantasy Worlds | recipe-only | depth top-up pending |
| Japanese Garden | Fantasy Worlds | recipe-only | depth top-up pending (also a real-Earth candidate) |
| Paris Café | Fantasy Worlds | recipe-only | miscategorized? consider moving to real |

---

## Dark-launch batch (admin-only until the final flip)

### Sci-Fi & Space (new section)
| # | Location | Recipe | Thumb | Depth | Render | Grade | Status |
|---|---|---|---|---|---|---|---|
| 1 | alien planet | 6/6 | ✅ | 100 | ✅ | 4.5 | ✅ ready | cast: netting an alien pool (natural); scene: multi-moon bioluminescent world |
| 2 | cyberpunk megacity | 6/6 | ✅ | 100 | ✅ | 4.75 | ✅ ready | cast: holo-device in neon rain; scene 5/5 Blade-Runner cityscape |
| 3 | mars colony | 6/6 | ✅ | 87 | ⬜ | — | ⬜ dark |
| 4 | space station | 6/6 | ✅ | 59 | ⬜ | — | ⬜ dark |
| 5 | sci-fi worlds (umbrella) | 0/6 | ✅ | 259 | ⬜ | — | ⬜ dark |

### High Fantasy (new section)
| # | Location | Recipe | Thumb | Depth | Render | Grade | Status |
|---|---|---|---|---|---|---|---|
| 6 | ancient elven city | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 7 | dwarven fortress | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 8 | dragons keep | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 9 | floating sky islands | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 10 | crystal caverns | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 11 | enchanted forest | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 12 | underwater city atlantis | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 13 | mermaid lagoon | 6/6 | ✖ needs thumb | — | ⬜ | — | ⬜ dark |
| 14 | high fantasy (umbrella) | 0/6 | ✅ | 243 | ⬜ | — | ⬜ dark |
| 15 | transylvania (gothic) | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 16 | haunted cathedral (gothic) | 6/6 | ✅ | — | ⬜ | — | ⬜ dark |
| 17 | haunted castle (gothic) | 6/6 | ✖ needs thumb | — | ⬜ | — | ⬜ dark |
| 18 | gothic realm (umbrella) | 0/6 | ✅ | 91 | ⬜ | — | ⬜ dark |

### Whimsical & Fun (new section)
| # | Location | Recipe | Thumb | Depth | Render | Grade | Status |
|---|---|---|---|---|---|---|---|
| 19 | princess garden castle | 6/6 | ✅ | 20 | ⬜ | — | ⬜ dark |
| 20 | fairy cottage | 6/6 | ✅ | 9 | ⬜ | — | ⬜ dark |
| 21 | rose garden palace | 6/6 | ✖ needs thumb | — | ⬜ | — | ⬜ dark |

---

## Later phases (not in the dark batch yet)
- **Landmarks & Wonders (Real tier):** taj mahal, petra, machu picchu, angkor wat, great wall of china
  (real places from the graveyard, complete recipes).
- **Through Time (historical):** ancient egypt, ancient rome, victorian london, sahara desert.
- **Old West:** build-from-scratch (almost nothing to revive).
- **New builds:** the ~90 fresh ideas in `OPERATION_DREAM_LOCATION_EXPANSION.md` §4.

## Skipped
- **IP:** hogwarts (harvest its 100 spots into "Wizard Academy" instead), disneyland.
- **Duplicates of live cards:** zions national park, moab utah, arches national park, parisian cafe,
  underwater city (dup of atlantis).
