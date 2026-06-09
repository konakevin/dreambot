# Bot × Model Review Tally

Kevin's per-bot model review after the 17 × 8 × 3 matrix run (2026-05-30, commit `72499bb3`). Updated live as Kevin goes bot-by-bot.

**Lineup:** Nano Banana, GPT Image 2, Flux Dev, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max

**Status legend:** ✅ keep · ❌ drop · ⭐ favorite · 🟡 conditional / minor issues · ⏳ awaiting review

---

## bloombot

| Model              | Status | Notes              |
| ------------------ | ------ | ------------------ |
| Nano Banana        | ✅     | —                  |
| GPT Image 2        | ✅     | —                  |
| Flux Dev           | ❌     | dropped 2026-06-01            |
| Flux 2 Pro         | ✅     | re-added 2026-06-09           |
| Flux 1.1 Pro       | ✅     | —                             |
| Flux 1.1 Pro Ultra | ✅     | —                             |
| Flux 2 Flex        | ❌     | dropped 2026-06-01            |
| Flux 2 Max         | ✅     | re-added 2026-06-09           |

**Final allowedModels:** 6 — Banana, GPT2, F1.1 Pro Ultra, F1.1 Pro, F2 Pro, F2 Max

---

## brickbot

| Model              | Status | Notes   |
| ------------------ | ------ | ------- |
| Nano Banana        | ✅     | —       |
| GPT Image 2        | ✅     | —       |
| Flux Dev           | ❌     | dropped |
| Flux 2 Pro         | ❌     | dropped |
| Flux 1.1 Pro       | ✅     | —       |
| Flux 1.1 Pro Ultra | ✅     | —       |
| Flux 2 Flex        | ✅     | —       |
| Flux 2 Max         | ✅     | —       |

**Final allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max

---

## chibibot

| Model              | Status | Notes |
| ------------------ | ------ | ----- |
| Nano Banana        | ✅     | —     |
| GPT Image 2        | ✅     | —     |
| Flux Dev           | ✅     | —     |
| Flux 2 Pro         | ✅     | —     |
| Flux 1.1 Pro       | ✅     | —     |
| Flux 1.1 Pro Ultra | ✅     | —     |
| Flux 2 Flex        | ✅     | —     |
| Flux 2 Max         | ✅     | —     |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## dinobot

| Model              | Status | Notes              |
| ------------------ | ------ | ------------------ |
| Nano Banana        | ✅     | —                  |
| GPT Image 2        | ✅     | —                  |
| Flux Dev           | ✅     | —                  |
| Flux 2 Pro         | ✅     | —                  |
| Flux 1.1 Pro       | ✅     | —                  |
| Flux 1.1 Pro Ultra | ✅     | —                  |
| Flux 2 Flex        | ❌     | dropped 2026-06-01 |
| Flux 2 Max         | ❌     | dropped 2026-06-01 |

**Final allowedModels:** 6 — Banana, GPT2, Flux Dev, F2 Pro, F1.1 Pro, F1.1 Pro Ultra

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## dragonbot

| Model              | Status | Notes                              |
| ------------------ | ------ | ---------------------------------- |
| Nano Banana        | ❌     | dropped 2026-06-05 (Kevin)         |
| GPT Image 2        | ✅     | matrix had 2 fails (safety) — keep |
| Flux Dev           | ❌     | dropped 2026-05-31 bot-wide; per-path re-enables (artsy-girl / female-adventurer / male-adventurer) removed 2026-06-07 |
| Flux 2 Pro         | ❌     | dropped 2026-06-02 (fleet-wide)    |
| Flux 1.1 Pro       | ✅     | —                                  |
| Flux 1.1 Pro Ultra | ✅     | —                                  |
| Flux 2 Flex        | ❌     | dropped 2026-06-05 (Kevin)         |
| Flux 2 Max         | ❌     | dropped 2026-05-31 (Kevin)         |

**Final bot-wide allowedModels:** 3 — GPT Image 2, Flux 1.1 Pro, Flux 1.1 Pro Ultra. Per-path bans then apply on top.

**Per-path overrides (non-character, Kevin 2026-05-31 uniform lineup):** all 7 non-character paths (`landscape`, `iconic-landscape`, `castle`, `epic-moment`, `dark-realm`, `dragon-lore`, `dragon-scene`) — Banana stripped from each 2026-06-05 alongside the bot-wide ban; surviving picks roll from the bot-wide 3.

---

## earthbot

| Model              | Status | Notes   |
| ------------------ | ------ | ------- |
| Nano Banana        | ❌     | dropped 2026-06-01 (Kevin)                                                                |
| GPT Image 2        | ❌     | dropped 2026-06-01 (Kevin)                                                                |
| Flux Dev           | ❌     | dropped 2026-05-31 (Kevin)                                                                |
| Flux 2 Pro         | ❌     | dropped 2026-06-01 (Kevin)                                                                |
| Flux 1.1 Pro       | ❌     | dropped 2026-06-01 (Kevin)                                                                |
| Flux 1.1 Pro Ultra | ✅     | locked sole model 2026-06-01 — premium fidelity for the new National-Geographic medium    |
| Flux 2 Flex        | ❌     | dropped                                                                                   |
| Flux 2 Max         | ❌     | dropped                                                                                   |

**Final allowedModels:** **1 — Flux 1.1 Pro Ultra only** (bot-wide single-model lock after the National-Geographic medium overhaul + 20-render test).

---

## faebot

| Model              | Status | Notes                                                   |
| ------------------ | ------ | ------------------------------------------------------- |
| Nano Banana        | ✅     | —                                                       |
| GPT Image 2        | ❌     | dropped 2026-06-02 (Kevin)                              |
| Flux Dev           | ❌     | dropped                                                 |
| Flux 2 Pro         | ❌     | dropped 2026-06-01 (Kevin)                              |
| Flux 1.1 Pro       | ✅     | —                                                       |
| Flux 1.1 Pro Ultra | ✅     | —                                                       |
| Flux 2 Flex        | ❌     | dropped                                                 |
| Flux 2 Max         | ❌     | dropped 2026-06-02 (Kevin)                              |

**Final allowedModels:** 3 — Nano Banana, Flux 1.1 Pro, Flux 1.1 Pro Ultra.

---

## gothbot

| Model              | Status | Notes   |
| ------------------ | ------ | ------- |
| Nano Banana        | ❌     | dropped 2026-06-02 (Kevin) |
| GPT Image 2        | ✅     | —       |
| Flux Dev           | ❌     | dropped |
| Flux 2 Pro         | ❌     | dropped 2026-06-05 (Kevin) |
| Flux 1.1 Pro       | ✅     | —       |
| Flux 1.1 Pro Ultra | ✅     | —       |
| Flux 2 Flex        | ❌     | dropped 2026-06-02 (Kevin) |
| Flux 2 Max         | ❌     | dropped 2026-06-05 (Kevin) |

**Final bot-wide allowedModels:** 3 — GPT Image 2, Flux 1.1 Pro, Flux 1.1 Pro Ultra.

**Per-path overrides (non-character, Kevin 2026-05-31 uniform lineup):** all 7 non-character paths (`dark-landscape`, `gothic-architecture`, `castlevania-scene`, `gothic-vista`, `vampire-from-a-distance`, `monster-prowl`, `monster-prowl-victorian`) locked to **5 models**: Banana, GPT-2, F2 Pro, F1.1 Pro, F1.1 Ultra (F2 Flex + F2 Max banned). Character paths (goth-closeup / goth-full-body / vampire-girls-2 / vampire-assassin-female / vampire-hunter-in-action / vampire-assassin-combat / goth-male-full-body-axis) keep their own per-path bans from the prior audit.

---

## mangabot

| Model              | Status | Notes |
| ------------------ | ------ | ----- |
| Nano Banana        | ✅     | —     |
| GPT Image 2        | ✅     | —     |
| Flux Dev           | ✅     | —     |
| Flux 2 Pro         | ✅     | —     |
| Flux 1.1 Pro       | ✅     | —     |
| Flux 1.1 Pro Ultra | ✅     | —     |
| Flux 2 Flex        | ✅     | —     |
| Flux 2 Max         | ✅     | —     |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## mechbot

| Model              | Status | Notes            |
| ------------------ | ------ | ---------------- |
| Nano Banana        | ✅     | —                |
| GPT Image 2        | ✅     | —                |
| Flux Dev           | ✅     | —                |
| Flux 2 Pro         | ❌     | dropped 2026-06-05 (Kevin) |
| Flux 1.1 Pro       | ✅     | —                |
| Flux 1.1 Pro Ultra | ✅     | —                |
| Flux 2 Flex        | ❌     | dropped 2026-06-05 (Kevin) |
| Flux 2 Max         | ❌     | dropped 2026-06-05 (Kevin) |

**Final allowedModels:** 5 — Nano Banana, GPT Image 2, Flux Dev, Flux 1.1 Pro Ultra, Flux 1.1 Pro.

---

## pixelbot

| Model              | Status | Notes |
| ------------------ | ------ | ----- |
| Nano Banana        | ✅     | —     |
| GPT Image 2        | ✅     | —     |
| Flux Dev           | ✅     | —     |
| Flux 2 Pro         | ✅     | —     |
| Flux 1.1 Pro       | ✅     | —     |
| Flux 1.1 Pro Ultra | ✅     | —     |
| Flux 2 Flex        | ✅     | —     |
| Flux 2 Max         | ✅     | —     |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`).
⚠ NOTE: has no `useModelPicker` line (defaults false), so today's `allowedModels` is dead config — wiring needs to add `useModelPicker: true` for the constant to take effect.

---

## retrobot

| Model              | Status | Notes |
| ------------------ | ------ | ----- |
| Nano Banana        | ✅     | —     |
| GPT Image 2        | ✅     | —     |
| Flux Dev           | ✅     | —     |
| Flux 2 Pro         | ✅     | —     |
| Flux 1.1 Pro       | ✅     | —     |
| Flux 1.1 Pro Ultra | ✅     | —     |
| Flux 2 Flex        | ✅     | —     |
| Flux 2 Max         | ✅     | —     |

**Final allowedModels:** all 8 (= `ALL_ENABLED_AI_MODELS`)

---

## starbot

| Model              | Status | Notes                                                        |
| ------------------ | ------ | ------------------------------------------------------------ |
| Nano Banana        | ✅     | 1 fail in matrix                                             |
| GPT Image 2        | ✅     | —                                                            |
| Flux Dev           | ❌     | dropped bot-wide                                             |
| Flux 2 Pro         | 🟡     | bot-wide ✅, but DROP on `cosmic-vista` + `real-space` paths |
| Flux 1.1 Pro       | ✅     | —                                                            |
| Flux 1.1 Pro Ultra | ✅     | —                                                            |
| Flux 2 Flex        | ✅     | —                                                            |
| Flux 2 Max         | ❌     | dropped bot-wide                                             |

**Final bot-wide allowedModels:** 6 — Nano Banana, GPT Image 2, Flux 2 Pro, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex

**Per-path overrides:**

- `cosmic-vista` → **2 models**: GPT-2, F1.1 Ultra (bot-wide MINUS Flux 2 Pro, F2 Flex, Banana, F1.1 Pro — 2026-05-31 comparison test heart-bans + Pro redundant w/ Ultra)
- `alien-landscape` → **3 models**: GPT-2, F2 Pro, F1.1 Ultra (MINUS F2 Flex, Banana, F1.1 Pro)
- `alien-city` → **4 models**: Banana, GPT-2, F2 Pro, F1.1 Ultra (MINUS F2 Flex, F1.1 Pro)
- `megastructure` → **4 models**: Banana, GPT-2, F2 Pro, F1.1 Ultra (MINUS F2 Flex, F1.1 Pro)
- `real-space` → **3 models**: GPT-2, F1.1 Pro, F1.1 Ultra (Kevin 2026-05-31 after premium-tier axis enrichment + 9-render gating-off test — Banana / F2 Pro / F2 Flex banned; F1.1 Pro intentionally kept per Kevin's "keep Pro on non-character paths" override of the redundant-with-Ultra rule)
- `cozy-sci-fi-interior` → **4 models**: Banana, GPT-2, F1.1 Pro, F1.1 Ultra (Kevin 2026-05-31 — F2 Pro + F2 Flex banned after 3 hearts each in comparison test; F1.1 Pro intentionally kept per Kevin's call — "Pro redundant w/ Ultra" rule NOT applied here)
- `space-opera` → **2 models**: GPT-2, F1.1 Ultra (Kevin 2026-05-31 — REVIVED at premium-tier axis enrichment after dormant since 2026-05-12; locked to these 2 after 3 model-test rounds — Banana / F2 Pro / F2 Flex produced "too messy" renders even with probabilistic axis gating)

⚠ NOTE: currently has no `useModelPicker` line + per-path `modelByPath` — wiring needs `useModelPicker: true` AND `modelByPath` reworked into per-path allow-arrays for the two flagged paths.

---

## steambot

| Model              | Status | Notes                                       |
| ------------------ | ------ | ------------------------------------------- |
| Nano Banana        | ✅     | —                                           |
| GPT Image 2        | ✅     | matrix had 2 fails (safety); kept per Kevin |
| Flux Dev           | ❌     | dropped                                     |
| Flux 2 Pro         | ❌     | dropped 2026-06-07 (Kevin)                  |
| Flux 1.1 Pro       | ✅     | —                                           |
| Flux 1.1 Pro Ultra | ✅     | —                                           |
| Flux 2 Flex        | ✅     | —                                           |
| Flux 2 Max         | ❌     | dropped                                     |

**Final bot-wide allowedModels:** 5 — Nano Banana, GPT Image 2, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex.

**Per-path overrides (non-character, Kevin 2026-05-31 uniform lineup):** all 7 non-character paths (`steampunk-scene`, `airship-skies`, `steampunk-curio`, `steampunk-spectacle`, `steam-transport`, `steampunk-labs`, `cozy-steampunk`) locked to **4 models**: Banana, GPT-2, F1.1 Pro, F1.1 Ultra (F2 Pro + F2 Flex banned). Character paths (airship-female / airship-male / sexy-steampunk-woman / steampunk-man) fall through to the bot-wide 5-model picker.

---

## tinybot

| Model              | Status | Notes   |
| ------------------ | ------ | ------- |
| Nano Banana        | ❌     | dropped |
| GPT Image 2        | ❌     | dropped |
| Flux Dev           | ❌     | dropped |
| Flux 2 Pro         | ❌     | dropped |
| Flux 1.1 Pro       | ✅     | —       |
| Flux 1.1 Pro Ultra | ✅     | —       |
| Flux 2 Flex        | ✅     | —       |
| Flux 2 Max         | ❌     | dropped |

**Final allowedModels:** 3 — Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex

---

## toybot

| Model              | Status | Notes                            |
| ------------------ | ------ | -------------------------------- |
| Nano Banana        | ❌     | heart-banned 2026-06-06          |
| GPT Image 2        | ❌     | heart-banned 2026-06-06          |
| Flux Dev           | ❌     | heart-banned 2026-06-06          |
| Flux 2 Dev         | ❌     | heart-banned 2026-06-06          |
| Flux 2 Pro         | ❌     | heart-banned 2026-06-02          |
| Flux 1.1 Pro       | ✅     | —                                |
| Flux 1.1 Pro Ultra | ✅     | —                                |
| Flux 2 Flex        | ❌     | heart-banned 2026-06-06 — softened toy register |
| Flux 2 Max         | ❌     | heart-banned 2026-06-06 — softened toy register |

**Final allowedModels:** 2 — Flux 1.1 Pro, Flux 1.1 Pro Ultra (Kevin lockdown 2026-06-06)

---

## yumbot

| Model              | Status | Notes   |
| ------------------ | ------ | ------- |
| Nano Banana        | ✅     | —       |
| GPT Image 2        | ✅     | —       |
| Flux Dev           | ✅     | —       |
| Flux 2 Pro         | ❌     | dropped |
| Flux 1.1 Pro       | ✅     | —       |
| Flux 1.1 Pro Ultra | ✅     | —       |
| Flux 2 Flex        | ✅     | —       |
| Flux 2 Max         | ✅     | —       |

**Final allowedModels:** 7 — Nano Banana, GPT Image 2, Flux Dev, Flux 1.1 Pro, Flux 1.1 Pro Ultra, Flux 2 Flex, Flux 2 Max
