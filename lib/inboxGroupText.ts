/**
 * inboxGroupText.ts — the inbox's per-row copy + icon helpers, shared by the inbox list (app/inbox.tsx) and the
 * fullscreen inbox (app/inboxFeed.tsx + components/InboxCardPage.tsx). Extracted verbatim from app/inbox.tsx on
 * 2026-09-18; behaviour unchanged.
 */
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import type { InboxGroup } from '@/hooks/useInboxGrouped';

export function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

// Inline message preview length. Bumped from 28 → 90 so comment / reply /
// mention / dream bodies read like a real message snippet across up to two
// lines instead of a clipped fragment. (The server may cap the body shorter;
// this is just the client ceiling.)
const SUBTEXT_MAX = 90;
export function capSubtext(text: string | null | undefined): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  return trimmed.length > SUBTEXT_MAX ? trimmed.slice(0, SUBTEXT_MAX) : trimmed;
}

// Per-notification-type icon + color. Replaces the always-purple-moon row
// identity from the pre-mig-223 design — every type has its own glyph so
// the user can scan the inbox by category at a glance.
export type IconSpec = { name: keyof typeof Ionicons.glyphMap; color: string };
export function iconForGroup(g: InboxGroup): IconSpec {
  switch (g.type) {
    case 'post_like':
    case 'comment_like':
      return { name: 'heart', color: colors.like };
    case 'post_comment':
    case 'comment_reply':
      return { name: 'chatbubble', color: colors.accent };
    case 'comment_mention':
    case 'post_mention':
      return { name: 'at', color: colors.accent };
    case 'post_share':
      return { name: 'paper-plane', color: colors.accent };
    case 'post_repost':
      return { name: 'repeat', color: colors.success };
    case 'post_milestone':
      return { name: 'trophy', color: '#FFD700' };
    case 'follow_request':
      return { name: 'person-add', color: colors.accent };
    case 'follow_accepted':
      return { name: 'person', color: colors.accent };
    case 'friend_request':
      return { name: 'people-circle', color: colors.accent };
    case 'friend_accepted':
      return { name: 'people', color: colors.accent };
    case 'dream_generated':
      if (g.subtype === 'welcome') return { name: 'sparkles', color: colors.accent };
      return { name: 'moon', color: colors.accent };
    case 'dream_failed':
      return { name: 'warning', color: '#FFA94D' };
    case 'download_ready':
      return { name: 'arrow-down-circle', color: colors.accent };
    case 'trial_reminder':
    case 'pro_reminder':
    case 'basic_reminder':
      return { name: 'diamond', color: colors.accent };
    case 'welcome_gift':
      return { name: 'gift', color: colors.accent };
    case 'cast_photo':
      return { name: 'person-circle', color: colors.accent };
    case 'sparkle_gift':
      return g.subtype === 'thanks'
        ? { name: 'heart', color: colors.accent }
        : { name: 'gift', color: colors.accent };
    default:
      return { name: 'notifications', color: colors.accent };
  }
}

/**
 * Build the subject (always one line) + optional subtext (capped to 28
 * chars for guaranteed single-line render) for a group row. The "viewed
 * = read" UI doesn't truncate-with-ellipsis on the subject — it must fit
 * naturally; capped lengths in writers (migration 223 + reminder copy
 * rewrites + Haiku ≤28 prompt) keep that invariant honored.
 *
 * `isAggregable` flags the rows that open the actor sheet on tap when
 * count > 1 (likes / reposts / follow-accepted / friend-accepted).
 */
/**
 * Title line for a trial/pro expiry reminder, keyed by subtype. MUST stay in
 * sync with getNotificationContent() in supabase/functions/send-push/index.ts
 * (the push banner) — same title in the tray and the inbox. The friendly
 * reminder + CTA rides in the row's `body` (subtext).
 */
export function reminderTitle(type: string, subtype: string | null): string {
  switch (subtype) {
    case '3day':
    case 'paid_3day':
    case 'basic_3day':
      return '3 dream nights left 🌙';
    case 'last_night':
      return "Tonight's your last trial dream 🌙";
    case 'paid_last_night':
    case 'basic_last_night':
      return "Tonight's your last nightly dream 🌙";
    case 'ended':
    case 'paid_ended':
    case 'basic_ended':
      return 'Your nightly dreams have ended';
    default:
      // Paid tiers (Pro + Basic) share tier-agnostic copy — we never name the
      // tier, so the user renews whichever subscription they want.
      if (type === 'pro_reminder' || type === 'basic_reminder')
        return 'Your subscription is ending';
      return 'Your trial is ending';
  }
}

export function getGroupText(g: InboxGroup): {
  subject: string;
  subtext: string | null;
  isAggregable: boolean;
} {
  const first = g.previewUsernames[0] ?? '';
  const second = g.previewUsernames[1] ?? '';
  const count = g.actorCount;

  // "Alice and 12 others" / "Alice and Sarah" / "Alice" — used by every
  // aggregable type below. Keeps the subject short enough to one-line.
  const actors = () => {
    if (count >= 3) return `${first} +${count - 1}`;
    if (count === 2) return `${first} & ${second}`;
    return first;
  };

  switch (g.type) {
    case 'post_like':
      return { subject: `${actors()} liked your dream`, subtext: null, isAggregable: true };
    case 'comment_like':
      return { subject: `${actors()} liked your comment`, subtext: null, isAggregable: true };
    case 'post_repost':
      return { subject: `${actors()} reposted your dream`, subtext: null, isAggregable: true };
    case 'post_milestone':
      return { subject: g.body ?? 'Milestone reached', subtext: null, isAggregable: false };
    case 'follow_accepted':
      return { subject: `${actors()} accepted your follow`, subtext: null, isAggregable: true };
    case 'friend_accepted':
      return { subject: `${actors()} accepted your request`, subtext: null, isAggregable: true };
    case 'post_share':
      // One row per sender per day (mig 533); eventCount = the unseen posts in the batch.
      return {
        subject: `${first} sent you ${g.eventCount > 1 ? `${g.eventCount} posts` : 'a post'}`,
        subtext: null,
        isAggregable: false,
      };

    // Comments / mentions / replies — subtext IS the body (capped to 28).
    case 'post_comment':
      return {
        subject: `${first} commented on your dream`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'comment_reply':
      return {
        subject: `${first} replied to your comment`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'comment_mention':
      return {
        subject: `${first} mentioned you`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'post_mention':
      return {
        subject: `${first} mentioned you in a caption`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };

    case 'friend_request':
      return { subject: `${first} wants to dream with you`, subtext: null, isAggregable: false };
    case 'follow_request':
      return { subject: `${first} requested to follow you`, subtext: null, isAggregable: false };

    case 'dream_generated': {
      // Body carries the bot message (nightly, already ≤28) or a short
      // descriptor (manual) — surface as subtext. Welcome ping is
      // subject-only (the welcome-gift screen carries the full copy).
      if (g.subtype === 'welcome') {
        return { subject: "Welcome, here's a gift", subtext: null, isAggregable: false };
      }
      // Label form of the push announcement (send-push pairs: "Your dream is
      // ready" / "You dreamed something last night") so the inbox row reads
      // as the same event the banner announced. NOTE: this branch only works
      // once migration 329 lands — get_inbox never returned `subtype` before,
      // so every dream row (including Create-screen dreams) mislabeled as
      // "Last night's dream" (Kevin 2026-07-05).
      // Every dream is its OWN inbox row (migration 360 reverted the manual
      // day-bucket aggregation) — one row per dream, no "N dreams are ready".
      return {
        subject: g.subtype === 'manual' ? 'Your dream is ready' : "Last night's dream",
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    }

    case 'dream_failed':
      return {
        subject: "Your dream couldn't render",
        subtext: capSubtext(g.body),
        isAggregable: false,
      };
    case 'download_ready':
      return { subject: 'Your HD download is ready', subtext: null, isAggregable: false };

    // Reminders (2026-07-21): a DreamBot-voice title line by subtype + the
    // friendly reminder/CTA as the subtext (stored in `body`). Was a single
    // body-as-subject line; now reads title + message like a real ping.
    case 'trial_reminder':
    case 'pro_reminder':
    case 'basic_reminder':
      return {
        subject: reminderTitle(g.type, g.subtype),
        subtext: capSubtext(g.body),
        isAggregable: false,
      };

    case 'welcome_gift':
      return {
        subject: 'Welcome to DreamBot 🌙',
        subtext: 'Tap to see how it works and grab your welcome gift.',
        isAggregable: false,
      };

    case 'cast_photo':
      // A dream-cast face (self or partner/friend) couldn't be read, so they've
      // been sitting out the dreams. Fixed title by subtype; the full "who + how
      // to fix" copy (with the relationship word baked in) rides in `body`. Tap
      // routes to /settings/dream-cast (system type → no expand).
      return {
        subject:
          g.subtype === 'self'
            ? 'Your dream face needs a new photo'
            : 'A dream face needs a new photo',
        subtext: capSubtext(g.body),
        isAggregable: false,
      };

    case 'sparkle_gift':
      // 'received' body = the gifter's optional message (surface as subtext);
      // 'thanks' is the reply ping. Never aggregable — each gift is its own tap.
      if (g.subtype === 'thanks') {
        return { subject: `${first} loved your gift`, subtext: null, isAggregable: false };
      }
      return {
        subject: `${first} gifted you sparkles`,
        subtext: capSubtext(g.body),
        isAggregable: false,
      };

    default:
      return { subject: g.body ?? '', subtext: null, isAggregable: false };
  }
}
