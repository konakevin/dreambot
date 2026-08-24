# Location Expansion — QA Checklist

Tracks each new/revived location through dark-launch QA. Nothing flips live until the whole set is
validated, then one batch flip: `UPDATE location_cards SET admin_only = false WHERE admin_only = true;`

**Dark-launch mechanism (mig 444):** a revived card gets `picker_category` set (into its section) AND
`admin_only = true`. Admins see it in the picker (with an ADMIN badge); regular users do not. QA = an admin
selects the location in-app and creates a real dream in it, then grades the render.

**Columns:** Recipe (6/6 phrase-arrays) · Thumb (tile image) · Depth (iconic/location spots) ·
Render (test dream made) · Grade (visual QA) · Status: ⬜ dark / 🔎 in-QA / ✅ ready / 🟢 live.

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
| 1 | alien planet | 6/6 | ✅ | 100 | ⬜ | — | ⬜ dark |
| 2 | cyberpunk megacity | 6/6 | ✅ | 100 | ⬜ | — | ⬜ dark |
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
