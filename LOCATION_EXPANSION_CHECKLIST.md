# Location Expansion — QA Checklist

> **Status 2026-08-24 (reconciled to the live DB).** The systemic engine-quality blocker that paused this
> project is **FIXED** (cardboard framing relaxed in `characterSlotPrompt`, wardrobe pools on all 61 cards +
> confirmed applied, imagined→painterly medium affinity, held-props natural-only, burgundy root-caused +
> fixed). Content build resumes from here. **Only High Fantasy + Sci-Fi + a starter Gothic/Whimsical slice
> is built — the breadth (Old West, Through Time, Heroes & Adventure, expanded Whimsical/kawaii, Landmarks &
> Wonders) is still unbuilt (see "Not built yet" below).**

Tracks each new/revived location through dark-launch QA. Nothing flips live to users until a section is
validated, then a scoped flip (e.g. `UPDATE location_cards SET admin_only = false WHERE picker_category =
'high_fantasy';`).

**Dark-launch mechanism (mig 444) — NOW WIRED (2026-08-24):** a card gets `picker_category` set (into its
section) AND `admin_only = true`. `LocationPickerStep.tsx` filters `admin_only=false` for non-admins, so
admins (Kevin, `users.is_admin=true`) see the card with an ADMIN badge; regular users do not. QA = an admin
selects the location in-app and creates a real dream in it, then grades the render. (Force-place QA via
`scripts/qa-location.js` still works for fast iteration without the app.)

**Columns:** Recipe (6/6 phrase-arrays) · Thumb (tile image) · Depth (iconic/location spots) ·
Render (test dream made) · Grade (visual QA) · Status: ⬜ dark / 🔎 in-QA / ✅ ready / 🟢 live.

### QA render recipe (validated 2026-08-24)
`node scripts/qa-location.js --location "<name>"` (defaults: cast-medium `canvas`, scene-medium `cinematic`)
- **Cast** (self / plus_one): painterly medium (`canvas`) — NOT photography (photography renders the
  "bad photoshop / AI slop" look and is banned in nightly). Imagined cards now auto-ban photo-adjacent
  mediums via the `biome_config.imagined` marker → painterly re-roll.
- **Scene-only**: `cinematic` → wallpaper-grade worlds.
- **Wardrobe**: each card carries a `biome_config.WARDROBE` pool; the plain-location cast path applies it
  (`pickAxis`). Pools are burgundy-free except intended gothic/vampire crimson. Held props natural-only.

---

## Live to users already (not dark)

| Section (`picker_category`) | Tier | Count | Notes |
|---|---|---|---|
| `iconic_cities` (Cities & Countries) | real | 26 | live pre-expansion |
| `tropical` (Tropical Escapes) | real | 6 | live pre-expansion |
| `epic_nature` (Epic Nature) | real | 16 | live pre-expansion |
| `fantasy_worlds` (Fantasy Worlds) | imagined | 7 | **surfaced this session** (was orphaned): Wizard Academy, Rose Palace, Cloud Kingdom, Fairy Tale Kingdom, Cherry Blossoms, Japanese Garden, Paris Café. Depth top-ups still pending on 6. |

---

## Dark-launch batch (admin-only — wired 2026-08-24)

21 cards, `admin_only = true`, visible only to admins in-app under an ADMIN badge.

### Sci-Fi & Space (`scifi_space`)
| Location | Recipe | Thumb | Render | Grade | Status |
|---|---|---|---|---|---|
| alien planet | 6/6 | ✅ | ✅ | 4.5 | ✅ ready |
| cyberpunk megacity | 6/6 | ✅ | ✅ | 4.75 | ✅ ready |
| mars colony | 6/6 | ✅ | ⬜ | — | ⬜ dark |
| space station | 6/6 | ✅ | ⬜ | — | ⬜ dark |
| sci-fi worlds (umbrella) | 0/6 | ✅ | ⬜ | — | ⬜ dark |

### High Fantasy (`high_fantasy`)
| Location | Recipe | Thumb | Render | Grade | Status |
|---|---|---|---|---|---|
| ancient elven city | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (wardrobe ✅ silver/green) |
| dwarven fortress | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (wardrobe ✅ dark leather) |
| dragons keep | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (thin scene DNA — forge, no dragon) |
| crystal caverns | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA |
| enchanted forest | 6/6 | ✅ | ⬜ | — | ⬜ dark |
| floating sky islands | 6/6 | ✅ | ⬜ | — | ⬜ dark |
| underwater city atlantis | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (medium ✅ watercolor) |
| mermaid lagoon | 6/6 | ✖ needs thumb | ✅ | ~4.5 | 🔎 in-QA (medium ✅ illustration) |
| high fantasy (umbrella) | 0/6 | ✅ | ✅ | ⚠️ | 🔎 in-QA (thin DNA — rolled a goofy towel-cape scene) |

### Gothic & Haunted (`gothic_haunted`)
| Location | Recipe | Thumb | Render | Grade | Status |
|---|---|---|---|---|---|
| transylvania | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (medium ✅ comics; crimson intended) |
| haunted cathedral | 6/6 | ✅ | ⬜ | — | ⬜ dark |
| haunted castle | 6/6 | ✖ needs thumb | ⬜ | — | ⬜ dark |
| gothic realm (umbrella) | 0/6 | ✅ | ⬜ | — | ⬜ dark |

### Whimsical & Fun (`whimsical_fun`)
| Location | Recipe | Thumb | Render | Grade | Status |
|---|---|---|---|---|---|
| princess garden castle | 6/6 | ✅ | ✅ | ~4.5 | 🔎 in-QA (wardrobe ✅ sage/gold) |
| rose garden palace | 6/6 | ✖ needs thumb | ✅ | ~4.5 | 🔎 in-QA (de-burgundy-ed → rose-pink) |
| fairy cottage | 6/6 | ✅ | ⬜ | — | ⬜ dark |

**Thumbs still needed (3):** haunted castle, mermaid lagoon, rose garden palace.

---

## NOT built yet (the rest of the vision — from OPERATION_DREAM_LOCATION_EXPANSION.md §3–4)

The initiative's full category set is **6 imagined + 4 real**. We've built ~2.5 imagined categories. Still
to build (zero or near-zero cards):

- **Old West** (`old_west`) — build-from-scratch: frontier town, saloon, canyon standoff, gold rush camp,
  cattle ranch, steam depot, monument valley, border cantina. **0 cards.**
- **Through Time / historical** (`through_time`) — ancient egypt, ancient rome/colosseum, feudal japan,
  viking longhouse, medieval market, renaissance venice, 1920s speakeasy, victorian london, pirate cove,
  aztec temple, ancient greece, silk road, 1970s disco, 1950s americana. Several sit in the graveyard
  (ancient egypt, ancient rome, victorian london, roman colosseum, greek isles) — **unrevived. 0 live.**
- **Heroes & Adventure** (`heroes_adventure`) — superhero rooftop, spy lair, epic battlefield, summit
  expedition, race garage, deep-sea sub, jungle temple, carrier deck, gladiator arena. **0 cards.**
- **Whimsical & Fun — expand** beyond the 3 built: kawaii candy land, unicorn meadow, cottagecore cottage,
  pastel dreamscape, fairy tea party, enchanted toy shop, pastel mermaid palace. **Only 3 of ~9 built.**
- **Landmarks & Wonders** (`landmarks_wonders`, new REAL section) — taj mahal, petra, machu picchu, great
  wall, angkor wat, christ the redeemer, sahara, northern lights. All in the graveyard, **unrevived. 0 live.**
- **Real-Earth fill-ins** — Kyoto, Cairo, Istanbul, Cape Town, Reykjavik, Edinburgh, Route 66, New Orleans,
  etc.; + depth top-ups on thin live cards (Swiss Alps 1 spot, Patagonia 1, Rome 2).

**Graveyard still hidden (`picker_category = null`):** ~29 cards remain, a mix of revivable themed places
and dups/IP to skip (see plan §Appendix).

---

## Open decisions (plan §8) — still Kevin's call
1. **Target size/ambition:** ~80 curated vs ~120 broad.
2. **Section labels** (High Fantasy vs Fantasy Realms; Heroes & Adventure vs a punchier name; whether Gothic
   is its own section or folds into High Fantasy).
3. **Gendered copy** explicitness (Princess / Heroes).
4. **Nightly scope:** imagined worlds in Create-only, or nightly auto-dreams too (much bigger QA).
5. **Build order** for the unbuilt categories (Through Time and Whimsical-expand look like the highest-demand
   next targets).

## Skipped
- **IP:** hogwarts (harvest its 100 spots into "Wizard Academy"), disneyland.
- **Duplicates of live cards:** zions, moab, arches, parisian cafe, underwater city (dup of atlantis).
