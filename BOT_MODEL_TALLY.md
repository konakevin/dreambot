# Bot × Model Review Tally

Kevin's per-bot model review after the 17 × 8 × 3 matrix run (2026-05-30, commit `72499bb3`). Updated live as Kevin goes bot-by-bot.

**Lineup:** Nano Banana, GPT Image 2, Flux Dev, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max

**Status legend:** ✅ keep · ❌ drop · ⭐ favorite · 🟡 conditional / minor issues · ⏳ awaiting review

---

## bloombot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## brickbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ❌ | dropped |
| Flux 2 Pro | ❌ | dropped |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max

---

## chibibot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## dinobot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## dragonbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | matrix had 2 fails (safety) — keep |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`).
⚠ NOTE: currently `useModelPicker: false` + full per-path modelByPath lock to flux-1.1-pro — wiring needs to flip picker on AND strip/clear modelByPath, otherwise the constant has no effect.

---

## earthbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ❌ | dropped |
| Flux 2 Max | ❌ | dropped |

**Final allowedModels:** 6 — Nano Banana, GPT Image 2, Flux Dev, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra

---

## faebot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | matrix 0/3 — all failed (safety filter); kept per Kevin |
| Flux Dev | ❌ | dropped |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ❌ | dropped |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Max.
⚠ NOTE: currently `useModelPicker: false` + full per-path modelByPath lock to flux-1.1-pro — wiring needs to flip picker on AND strip/clear modelByPath, otherwise the constant has no effect.

---

## gothbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ❌ | dropped |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** 7 — Nano Banana, GPT Image 2, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max

---

## mangabot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## mechbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | 1 fail in matrix |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`).
⚠ NOTE: currently has no `useModelPicker` line (defaults false) + per-path `modelByPath` — wiring needs to add `useModelPicker: true` AND strip/clear `modelByPath`, otherwise the constant has no effect. Also flagged as WIP per CLAUDE.md.

---

## pixelbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`).
⚠ NOTE: has no `useModelPicker` line (defaults false), so today's `allowedModels` is dead config — wiring needs to add `useModelPicker: true` for the constant to take effect.

---

## retrobot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## starbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | 1 fail in matrix |
| GPT Image 2 | ✅ | — |
| Flux Dev | ❌ | dropped bot-wide |
| Flux 2 Pro | 🟡 | bot-wide ✅, but DROP on `cosmic-vista` + `real-space` paths |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ❌ | dropped bot-wide |

**Final bot-wide allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex

**Per-path overrides:**
- `cosmic-vista` → 5 models (bot-wide MINUS Flux 2 Pro)
- `real-space` → 5 models (bot-wide MINUS Flux 2 Pro)

⚠ NOTE: currently has no `useModelPicker` line + per-path `modelByPath` — wiring needs `useModelPicker: true` AND `modelByPath` reworked into per-path allow-arrays for the two flagged paths.

---

## steambot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | matrix had 2 fails (safety); kept per Kevin |
| Flux Dev | ❌ | dropped |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ❌ | dropped |

**Final allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex

---

## tinybot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ❌ | dropped |
| GPT Image 2 | ❌ | dropped |
| Flux Dev | ❌ | dropped |
| Flux 2 Pro | ❌ | dropped |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ❌ | dropped |

**Final allowedModels:** 3 — Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex

---

## toybot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ✅ | — |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | 1 fail in matrix; kept |
| Flux 2 Max | ✅ | 1 fail in matrix; kept |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## yumbot

| Model | Status | Notes |
|---|---|---|
| Nano Banana | ✅ | — |
| GPT Image 2 | ✅ | — |
| Flux Dev | ✅ | — |
| Flux 2 Pro | ❌ | dropped |
| Flux 1.1 Pro | ✅ | — |
| Flux 1.1 Pro Ultra | ✅ | — |
| Flux 2 Flex | ✅ | — |
| Flux 2 Max | ✅ | — |

**Final allowedModels:** 7 — Nano Banana, GPT Image 2, Flux Dev, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max
