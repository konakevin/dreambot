/**
 * Client feature flags — UI-level toggles for features that are built but not
 * currently shipped. Flip a flag to bring the entry points back; the underlying
 * routes, screens, hooks and engine support stay intact either way.
 */

/**
 * "Dream Like This" — the color-wand button on cards + the long-press menu's
 * "Dream like this" item, which launch the /dreamLikeThis flow.
 *
 * Hidden from the UI for now (2026-06-13). Nothing about the feature is removed:
 * the /dreamLikeThis screen, useDreamCreate DLT path, dreamApi dlt_recipe support
 * and the gated button JSX all remain. Set to true to re-expose the entry points.
 */
export const DLT_ENABLED = false;
