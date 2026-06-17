/**
 * Image-generation model catalog for the bot system.
 *
 * `ALL_ENABLED_AI_MODELS` is the canonical "models a bot is allowed to
 * pick from" list. Bots OPT IN by setting:
 *
 *   const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');
 *   ...
 *   allowedModels: ALL_ENABLED_AI_MODELS,
 *
 * Then runtime model selection works as normal:
 *   - botEngine.js → scripts/lib/modelPicker.js intersects
 *     dream_mediums.allowed_models with bot.allowedModels and picks
 *     one (random or per-path).
 *   - bot.modelByPath can hard-pin a specific path to one model and
 *     override the picker — useful when a path's medium directive only
 *     works under one provider's prompt-fidelity behavior.
 *
 * The price floor / ceiling here is intentional. Every entry is in the
 * 3¢–7¢ band (Nano Banana 4¢ → Flux 2 Max 7¢), within ~75% of the
 * Flux 1.1 Pro anchor (4¢) so bots can mix providers without blowing up
 * the per-render cost basis. Models intentionally OMITTED:
 *
 *   - Flux Schnell / Flux Krea Dev (1¢) — too cheap to be worth the
 *     visual hit at fleet scale
 *   - SDXL — inactive in DB
 *   - Kontext Pro / Max — text-based EDIT models, need an input image,
 *     so they're not candidates for a fresh-scene bot post
 *   - GPT Image 1 — deprecating Oct 2026, prefer GPT Image 2
 *   - Nano Banana Pro / Gemini 3 (13¢) — 3.35× the anchor, only
 *     justifies its cost on resolution-priced user-paid renders
 *
 * Costs (verified 2026-05-30 against `image_models` DB table):
 *   Nano Banana          (google/gemini-2-image)               4¢
 *   GPT Image 2          (openai/gpt-image-2)                  6¢
 *   Flux 2 Flex          (black-forest-labs/flux-2-flex)       6¢
 *   Flux 1.1 Pro Ultra   (black-forest-labs/flux-1.1-pro-ultra) 6¢
 *   Flux 1.1 Pro         (black-forest-labs/flux-1.1-pro)      4¢
 *   Flux 2 Pro           (black-forest-labs/flux-2-pro)        3¢
 *   Flux 2 Max           (black-forest-labs/flux-2-max)        7¢
 *
 * Adding a new model:
 *   1. Add the identifier to ALL_ENABLED_AI_MODELS below
 *   2. Confirm it's wired in `supabase/functions/_shared/modelPricing.ts`
 *      (sparkle cost + cost cents)
 *   3. Confirm `image_models` DB row exists with cost + is_active=true
 *   4. Confirm a provider implementation exists in
 *      `supabase/functions/_shared/providers/*.ts` (Replicate is default;
 *      OpenAI + Gemini are separate providers)
 */

// 7-model lineup spanning ~3¢-7¢ per render (~5¢ avg). Mix of providers:
//   Flux family   — Replicate (5 models)
//   GPT Image 2   — native OpenAI API (providers/openai.js)
//   Nano Banana   — native Gemini API (providers/gemini.js)
// All wired through `flux()` in botEngine.js which dispatches by model
// prefix. Earlier (2026-05-30 morning) we dropped Banana + GPT2 when their
// Replicate-wrapped paths were too slow / mis-configured — we then ported
// the native API providers + fixed the data-URL downloader + Nano Banana's
// aspect-ratio default, so both are now production-grade and back in.
const ALL_ENABLED_AI_MODELS = [
  'google/gemini-2-image', // Nano Banana — 4¢, ~22s (native Gemini)
  // GPT Image 2 (openai/gpt-image-2) BANNED fleet-wide for bots 2026-06-17 (Kevin)
  // — removed here AND from every bot's allowedModels / modelByPath / pathWeights
  // / cleanMediumByModel. Not used by bots going forward.
  'black-forest-labs/flux-dev', // 3¢ — open-weight Flux 1, artistic register
  'black-forest-labs/flux-2-flex', // 6¢
  'black-forest-labs/flux-1.1-pro-ultra', // 6¢
  'black-forest-labs/flux-1.1-pro', // 4¢ (current default anchor)
  'black-forest-labs/flux-2-pro', // 3¢
  'black-forest-labs/flux-2-max', // 7¢
];

module.exports = {
  ALL_ENABLED_AI_MODELS,
};
