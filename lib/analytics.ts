/**
 * Analytics event taxonomy — every product event in ONE typed place so call
 * sites stay consistent + greppable (no magic strings, no typos). Thin typed
 * wrappers over lib/posthog's capture(); all no-op when analytics is disabled
 * (no key / __DEV__).
 *
 * NOT here (auto-captured, no per-call code): screen views + time-on-screen
 * (app/_layout.tsx ScreenTracker) and tap autocapture (PostHogProvider). This
 * module is only the EXPLICIT product events.
 *
 * See ANALYTICS_PLAN.md for the event → call-site map.
 */
import { capture } from '@/lib/posthog';

// ── Dream creation (core loop) ───────────────────────────────────────────────
export function trackDreamCreateStarted(p: { mode: string }): void {
  capture('dream_create_started', p);
}
export function trackDreamCreated(p: {
  mode: string;
  medium: string;
  vibe: string;
  has_photo: boolean;
  has_cast: boolean;
}): void {
  capture('dream_created', p);
}
export function trackDreamFailed(p: { mode: string; reason: string }): void {
  capture('dream_failed', p);
}
export function trackDltStarted(p: { source_post_id: string }): void {
  capture('dlt_started', p);
}

// ── Hotspots / content ───────────────────────────────────────────────────────
export function trackFeedTabSelected(p: { tab: 'following' | 'explore' }): void {
  capture('feed_tab_selected', p);
}
export function trackBotViewed(p: { bot_id: string; bot_name?: string }): void {
  capture('bot_viewed', p);
}
export function trackProfileViewed(p: { is_self: boolean }): void {
  capture('profile_viewed', p);
}
export function trackPostViewed(p: { source: string; is_own: boolean }): void {
  // source ∈ own | dreams | saved | user | feed — directly answers "how often
  // are people viewing their own posts/dreams vs others'".
  capture('post_viewed', p);
}

// ── Onboarding funnel ────────────────────────────────────────────────────────
export function trackOnboardingStep(p: { step: string }): void {
  capture('onboarding_step_completed', p);
}
export function trackOnboardingCompleted(): void {
  capture('onboarding_completed');
}
export function trackFirstDreamGenerated(p: { medium?: string; vibe?: string }): void {
  capture('first_dream_generated', p);
}

// ── Social / engagement ──────────────────────────────────────────────────────
export function trackPostLiked(): void {
  capture('post_liked');
}
export function trackCommentAdded(p: { is_reply: boolean }): void {
  capture('comment_added', p);
}
export function trackPostShared(p: { recipient_count: number }): void {
  capture('post_shared', p);
}
export function trackPostReposted(): void {
  capture('post_reposted');
}
export function trackFollowAdded(p: { target_is_bot: boolean }): void {
  capture('follow_added', p);
}

// ── Monetization intent (RevenueCat owns actual purchases) ───────────────────
export function trackSparkleStoreOpened(): void {
  capture('sparkle_store_opened');
}
export function trackSparklePurchaseTapped(p: { pack: string }): void {
  capture('sparkle_purchase_tapped', p);
}
export function trackProStoreOpened(): void {
  capture('pro_store_opened');
}
export function trackProSubscribeTapped(p: { period?: string }): void {
  capture('pro_subscribe_tapped', p);
}
export function trackHdDownloadTapped(p: { cached: boolean }): void {
  capture('hd_download_tapped', p);
}

// ─────────────────────────────────────────────────────────────────────────────
// P2 client-immediate events (2026-07-18) — the interaction gaps from the
// instrumentation audit. All fire synchronously on the user's tap (the user is
// present), so client-side is reliable here; async COMPLETIONS live server-side
// (supabase/functions/_shared/posthogCapture.ts). See ANALYTICS_INSTRUMENTATION_PLAN.md.
// ─────────────────────────────────────────────────────────────────────────────

type AuthMethod = 'email' | 'google' | 'apple' | 'facebook';

// ── Auth (funnel top — was entirely untracked) ───────────────────────────────
export function trackSignupCompleted(p: { method: AuthMethod }): void {
  capture('signup_completed', p);
}
export function trackLoginCompleted(p: { method: AuthMethod }): void {
  capture('login_completed', p);
}

// ── Social — the missing halves (undo actions + comment-likes + safety) ──────
export function trackPostUnliked(): void {
  capture('post_unliked');
}
export function trackCommentLiked(): void {
  capture('comment_liked');
}
export function trackCommentUnliked(): void {
  capture('comment_unliked');
}
export function trackPostSaved(): void {
  capture('post_saved');
}
export function trackPostUnsaved(): void {
  capture('post_unsaved');
}
export function trackFollowRemoved(p: { target_is_bot: boolean }): void {
  capture('follow_removed', p);
}
export function trackCommentDeleted(p: { is_admin: boolean }): void {
  capture('comment_deleted', p);
}
export function trackUserBlocked(): void {
  capture('user_blocked');
}
export function trackContentReported(p: {
  reason: string;
  target_type: 'post' | 'user' | 'comment';
}): void {
  capture('content_reported', p);
}

// ── Notifications / discovery ────────────────────────────────────────────────
export function trackPushOpened(p: { type: string }): void {
  capture('push_opened', p);
}
export function trackInboxOpened(): void {
  capture('inbox_opened');
}
export function trackSearchInitiated(p: { type: 'users' | 'posts' | 'hashtags' }): void {
  capture('search_initiated', p);
}
export function trackSearchResultTapped(p: { type: 'user' | 'post' | 'hashtag' }): void {
  capture('search_result_tapped', p);
}

// ── Own-dream management ─────────────────────────────────────────────────────
export function trackDreamDeleted(p: { is_album: boolean }): void {
  capture('dream_deleted', p);
}
export function trackDreamPinned(p: { pinned: boolean }): void {
  capture('dream_pinned', p);
}
