# BloomBot Flower Engine — Refactor Plan of Record

**Status:** APPROVED 2026-05-27 (shape + 4 decisions signed off by Kevin). Phase 1 in progress.
**Goal:** Replace the geography-locked species rosters with a **tagged flower pool + a theme/color orchestrator** so every path can render lush, full-spectrum, _deliberately color-themed_ scenes — single-color, hybrid, sunset, pastel, rainbow, or the current "mixed lush" — and even multi-clump color-blocked compositions. More visually striking, sometimes themed, never "random flowers thrown in."

---

## Why (the problem this fixes)

Today flower selection = `species-roster.js`: **10 geographic regions**, each a fixed species list; a render rolls one region + one of 75 palettes; Sonnet picks 3-5 species matching the palette. Two structural flaws:

1. **Color is welded to geography.** `desert` is warm-only, `europeanAlpine` is cool-only, `aquatic` is thin. You can't reliably make a "purple/blue" scene in a warm region, and "full spectrum for every region" fights botanical realism.
2. **No intentional color theming or color-blocking.** The whole scene is one palette; there's no way to say "a sunset-shade clump beside a purple/blue clump."

The palettes are already excellent (curated, harmonious) — they stay. The **species-selection layer** is what we replace.

---

## The architecture

Three pieces: a **tagged flower pool**, a **theme library**, and an **orchestrator** that plucks a curated flower cast per render. Code picks the species (deterministic, like every other axis); Sonnet renders what it's handed.

### 1. Tagged flower pool — `flowers.js` (~150–200 species)

One pool, each flower an object with tags. Merge the current ~130 roster species + tropical, then **expand for spectrum coverage** (the thin colors are blue / purple / true-white / cool — add real species: meconopsis, gentian, delphinium, agapanthus, iris, salvia, lupine, hydrangea, clematis, morning-glory, statice, etc.).

```jsonc
{
  "name": "king protea",
  "colors": ["pink", "red", "cream"], // natural color options
  "biomes": ["african", "exotic", "cottage", "tropical"], // contexts it fits
  "form": "statement", // statement | spire | filler | cascading | groundcover | floating
  "scale": "large", // large | medium | small
  "register": ["exotic"], // naturalistic | cottage | alpine | tropical | aquatic | exotic
}
```

- `colors[]` decouples color from geography (THE fix).
- `biomes[]` keeps scenes plausible/coherent (a flower can belong to several).
- `form` + `scale` are what make a pluck read as a _florist's arrangement_ (hero + support + filler), not a salad.
- `register` keeps aesthetic coherence (don't mix alpine edelweiss with neon tropical).

### 2. Theme library — `flowerThemes.js`

A **theme = a color scheme** the orchestrator rolls (weighted). Covers everything you listed:

| Group                     | Themes                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Mono**                  | pink · purple · blue · yellow · orange · red · white _(no green — foliage is always supporting, never the flower theme)_ |
| **Hybrid**                | pink+white · purple+white+blue · sunset (red+orange+yellow) · blue+purple · coral+cream+peach · magenta+gold             |
| **Spectrum**              | rainbow (all, vivid) · **mixed-lush (balanced multi — today's look)**                                                    |
| **Register (orthogonal)** | vivid (default) · soft-pastel · dark-jewel — applies on top of any theme                                                 |

Each theme = `{ name, colors[], weight, registerBias }`. The **75 existing palettes get mined to seed/flavor these themes** (e.g., "all-blue study" → blue theme; "Porcelain Garden" → pastel register; "Sunset Cliff" → sunset theme). Weights keep your "keep mixed" ask honest — e.g. mixed-lush ~25%, monos ~30%, hybrids ~25%, rainbow/pastel-multi ~20%.

### 3. Orchestrator — `flowerEngine.js`

Per render:

1. **Roll a scheme-mode** (keeps variety + honors "keep mixed"):
   - `single` (~40%) — one theme across the scene (today's behavior, but now any theme)
   - `two-clump` (~35%) — two sub-themes color-blocked into clumps (your new striking ones)
   - `spectrum` (~25%) — rainbow / mixed-lush balanced
2. **Roll theme(s)** for the mode, honoring the path's theme-bias.
3. **Filter** the pool to flowers where `biomes` ∩ path-biome **and** `colors` ∩ theme-colors **and** register-coherent.
4. **Pluck a curated recipe**, not N-of-a-color: `1 hero statement bloom + 2–3 supporting (medium) + 1–2 filler/spire/groundcover`, varied form/scale, all in-theme. _(This is the anti-random cohesion.)_
5. For `two-clump`: pluck a mini-recipe per clump, tag placement.
6. **Emit a structured flower cast** → injected into the brief as named species + colors (+ clump placement).

Cohesion guaranteed by: shared theme (color) + form-mix recipe + biome/register match.

---

## Per-path adoption (all 16 paths, uniform engine)

Every path consumes the orchestrator instead of the region roster. Each path file adds a small config:

```js
flowerContext: {
  biome: 'aquatic',          // which pool flowers are eligible
  register: ['aquatic'],     // aesthetic coherence
  themeBias: { /* optional weight overrides */ },
}
```

- **`aquatic`** → biome aquatic (lotus/lily/iris/pickerelweed…), themes lean pink/white/blue.
- **`desert-bloom`** → biome desert, theme-bias warm/sunset (keeps identity) — but can now also do a striking cool-clump contrast.
- **`tropical-paradise`** → biome tropical, vivid register.
- **`conservatory` / `garden-walk` / `cottage-village`-style / `closeup` / `city-flowers`** → biome cottage/meadow/exotic, **all themes open** (these get the full color range).
- **`flower-fantasy` / `dreamscape`** → biome any + surreal register, all themes (the monumental-hero path stays the bar).
- The **per-path SCENE pool stays** (the setting/composition); only the flower cast comes from the engine.

The lush-hero / crisp-colored-background mandates (just shipped) stay and now sit on top of a far better species layer.

---

## What changes vs. stays

| Replaced                             | Kept                                                       |
| ------------------------------------ | ---------------------------------------------------------- |
| `species-roster.js` (10 geo rosters) | The 75 palettes (mined into themes; still the color taste) |
| `sharedDNA.roster` brief block       | Per-path scene/setting pools                               |
| Sonnet free-picks species            | Axis composer, lush-hero + crisp mandates, de-haze         |

`rollSharedDNA` stops emitting `roster` and instead calls `flowerEngine.roll(path.flowerContext)` → `{ theme, cast, mode }`; the brief's "FLOWER SPECIES" block renders the cast.

---

## Phased build

- **Phase 0 — spec sign-off** (this doc).
- **Phase 1 — tagged flower pool.** Build `flowers.js`: merge + REUSE current species, expand to a large full-spectrum pool — **target ~300, range 200–400** (revisit if diminishing returns on variety). Tag colors/biomes/form/scale/register. (Sonnet-assisted tagging, human eyeball pass.)
- **Phase 2 — theme library + orchestrator (single-scheme only).** `flowerThemes.js` + `flowerEngine.js`; wire into `rollSharedDNA` + brief (replace roster). Validate on 4–5 paths. Confirm cohesion + full-spectrum + lushness.
- **Phase 3 — scheme-modes.** Add two-clump contrast + spectrum + theme weights + per-path `flowerContext`. Roll across all 16 paths.
- **Phase 4 — QA.** Render a batch per theme + per mode; verify cohesion, color accuracy, lushness, no washout; tune weights/recipes. Update `BOT_SCENE_QUALITY_PLAYBOOK.md`.

---

## Decisions (locked 2026-05-27, Kevin)

1. **Palettes:** MINE their color-defs into themes; **reuse the flower species we already have** as the pool seed.
2. **Clumps:** "areas of color" are fine — color zones with tagged flowers thrown in (not surgical placement).
3. **Greens / foliage:** foliage is **always supporting** — green is never a flower theme.
4. **Pool size:** go **bigger — target ~300, range 200–400** — revisit if variety hits diminishing returns.

```

```
