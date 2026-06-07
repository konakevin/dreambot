/**
 * Pure resolver for the per-model "clean render" override (`bot.cleanMediumByModel`).
 *
 * Some image models (gpt-image-2, nano-banana / google/gemini-2-image) read a
 * bot's stylized medium + painterly prompt prefix as "go fully abstract /
 * ornamental plate" and drop the bot's actual subject. `cleanMediumByModel` maps
 * such a model → a clean bot-only medium so the model renders the seed's SUBJECT
 * cleanly. This module is the DECISION layer — kept pure + unit-tested so the
 * per-model routing can't silently drift; `botEngine` does the prompt assembly
 * from the returned value.
 *
 * Config shape (per bot): cleanMediumByModel[model] = { medium, pathPrefix?, skipPaths? }
 *   • medium     — the clean medium key to swap to (must declare bot.mediumStyles[medium]).
 *   • pathPrefix — { <path>: '<override>' }: on the swap only, REPLACE that path's
 *                  normal painterly prefix ('' drops it). Paths not listed keep
 *                  their normal prefix (content locks preserved).
 *   • skipPaths  — paths that opt OUT of the swap (they declare their own intended
 *                  medium for this model, e.g. via mediumByPath).
 *
 * @returns null when no swap applies, else { medium, pathPrefix } where pathPrefix
 *   is the RAW prefix string (no trailing comma) to use for this render.
 */
function resolveCleanMedium(bot, renderModel, resolvedPath) {
  const cfg = bot && bot.cleanMediumByModel && bot.cleanMediumByModel[renderModel];
  if (!cfg || !cfg.medium) return null;
  if (cfg.skipPaths && cfg.skipPaths.includes(resolvedPath)) return null;
  // Per-path override takes precedence (including an explicit '' to drop the
  // prefix); otherwise fall back to the bot's normal per-path prefix, else ''.
  const hasOverride =
    cfg.pathPrefix && Object.prototype.hasOwnProperty.call(cfg.pathPrefix, resolvedPath);
  const pathPrefix = hasOverride
    ? cfg.pathPrefix[resolvedPath]
    : (bot.promptPrefixByPath && bot.promptPrefixByPath[resolvedPath]) || '';
  return { medium: cfg.medium, pathPrefix };
}

module.exports = { resolveCleanMedium };
