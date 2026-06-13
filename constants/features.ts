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

/**
 * Route user "Create" / "DLT" dreams through the async dream_queue worker
 * instead of awaiting the synchronous generate-dream render. The queue caps
 * global render concurrency + retries on failure, which is what escapes the
 * Supabase Edge 546 WORKER_RESOURCE_LIMIT bursts at scale (see
 * QUEUE_WORKERS_REFACTOR.md). When off, the client uses the legacy synchronous
 * invoke path (unchanged). Gated by the EXPO_PUBLIC_DREAM_QUEUE_ENABLED env so
 * we can ramp + roll back without a code change.
 */
export const DREAM_QUEUE_ENABLED = process.env.EXPO_PUBLIC_DREAM_QUEUE_ENABLED === 'true';
