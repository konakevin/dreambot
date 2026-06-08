// Supabase Edge Function: send-push
// Called via database webhook when a notification row is inserted.
// Looks up the recipient's Expo push token and sends a push notification.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hasSeenSibling, shouldSkipForActivity } from '../_shared/notify.ts';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: {
    id: string;
    recipient_id: string;
    actor_id: string;
    type: string;
    upload_id: string | null;
    comment_id: string | null;
    body: string | null;
    // Migration 206: subtype is the typed discriminator for variants like
    // wish/welcome/3day/last_night within a parent type. Read here to route
    // trial_reminder / pro_reminder push titles by subtype.
    subtype: string | null;
    created_at: string;
    group_key?: string | null;
  };
  // Phase 2 (migration 204): the drain_pending_push_groups() pg_cron worker
  // sets these when collapsing a debounced group into a single aggregated
  // push. When present, we look up the group's CURRENT state (actor count +
  // most-recent actor usernames) and build "Alice and N others …" copy
  // instead of the single-actor copy below.
  aggregated?: boolean;
  group_key?: string;
}

// Rotating push copy for the nightly-dream notification. Short, mysterious,
// personal — leans on the "while you slept" emotional hook. Picked at random
// per-send so users don't see the same line every morning.
const DREAM_PUSH_TITLES = [
  'New dream waiting',
  'Your DreamBot made something',
  'It dreamed while you slept',
  'A new dream just landed',
];
const DREAM_PUSH_BODIES = [
  'Tap to see what it made.',
  'You were sleeping. It wasn’t.',
  'Painted just for you.',
  'Open to see tonight’s dream.',
];
function pickDreamPushTitle(): string {
  return DREAM_PUSH_TITLES[Math.floor(Math.random() * DREAM_PUSH_TITLES.length)];
}
function pickDreamPushBody(): string {
  return DREAM_PUSH_BODIES[Math.floor(Math.random() * DREAM_PUSH_BODIES.length)];
}
// Copy for a dream the user ACTIVELY created and then left the app before it
// finished (subtype='manual'). The nightly "while you slept" framing is wrong
// here — they made this on purpose, so the copy is direct.
const MANUAL_DREAM_PUSH_BODY = 'Tap to see what you created.';

function getNotificationContent(
  type: string,
  actorName: string,
  body: string | null,
  subtype: string | null = null
) {
  // Trial-expiry reminders inserted by scripts/nightly-dreams.js.
  // Subtype routes the push title; body is the in-app copy as inserted.
  if (type === 'trial_reminder') {
    if (subtype === '3day') {
      return {
        title: 'Your Pro trial ends in 3 days',
        body: body ?? 'Subscribe to keep nightly dreams coming.',
      };
    }
    if (subtype === 'last_night') {
      return {
        title: 'Tonight is your last Pro nightly dream',
        body: body ?? 'Your trial ends tomorrow — subscribe to keep nightly dreams coming.',
      };
    }
    return { title: 'Your Pro trial is ending', body: body ?? 'Tap to learn more.' };
  }
  // Paid Pro expiry reminders (sub cancelled but still in paid period).
  // Same windows as trial_reminder; different copy ("resubscribe" not
  // "subscribe").
  if (type === 'pro_reminder') {
    if (subtype === 'paid_3day') {
      return {
        title: 'Your Pro subscription ends in 3 days',
        body: body ?? 'Resubscribe to keep nightly dreams coming.',
      };
    }
    if (subtype === 'paid_last_night') {
      return {
        title: 'Tonight is your last Pro nightly dream',
        body:
          body ?? 'Your subscription ends tomorrow — resubscribe to keep nightly dreams coming.',
      };
    }
    return { title: 'Your Pro subscription is ending', body: body ?? 'Tap to learn more.' };
  }
  switch (type) {
    case 'post_like':
      return { title: `${actorName} liked your dream`, body: '' };
    case 'post_repost':
      return { title: `${actorName} reposted your dream`, body: '' };
    case 'post_favorite':
      return { title: `${actorName} favorited your dream`, body: '' };
    case 'comment_like':
      return { title: `${actorName} liked your comment`, body: '' };
    case 'post_comment':
      return { title: `${actorName} commented on your post`, body: body ?? '' };
    case 'comment_reply':
      return { title: `${actorName} replied to your comment`, body: body ?? '' };
    case 'comment_mention':
      return { title: `${actorName} mentioned you`, body: body ?? '' };
    case 'post_share':
      return { title: `${actorName} sent you a post`, body: 'Tap to check it out' };
    case 'friend_request':
      return { title: `${actorName} wants to dream with you`, body: 'Tap to respond' };
    case 'friend_accepted':
      return { title: `${actorName} accepted your friend request`, body: "You're now friends!" };
    case 'follow_request':
      return { title: `${actorName} requested to follow you`, body: 'Tap to approve or deny' };
    case 'follow_accepted':
      return { title: `${actorName} accepted your follow request`, body: '' };
    case 'dream_generated':
      // A dream the user actively created + left the app before it finished —
      // "while you slept" copy is wrong, so use create-flow copy (and ignore
      // the stored body, which is the inbox subtext, not push copy).
      if (subtype === 'manual') {
        return { title: 'Your dream is ready ✨', body: MANUAL_DREAM_PUSH_BODY };
      }
      // Nightly auto-dream — short, mysterious, personal ("while you slept").
      // If the notification body is populated (the bot message), prefer it;
      // otherwise rotate one of the curated lines.
      return {
        title: pickDreamPushTitle(),
        body: body ?? pickDreamPushBody(),
      };
    case 'download_ready':
      return { title: 'Your HD download is ready ✨', body: 'Tap to save it to your photos.' };
    default:
      return { title: 'New notification', body: '' };
  }
}

// Per-type aggregated push copy. Same call sites as getNotificationContent,
// but parameterized by total actor count + the two most-recent actors so the
// title reads like Instagram/TikTok ("Alice and 12 others liked your dream").
// Self-events (dream_generated, download_ready) ignore the count — they're
// always individual per recipient and shouldn't be aggregated even if the
// debounce queue collapsed them by accident.
function getAggregatedNotificationContent(
  type: string,
  latestActorName: string,
  secondActorName: string | null,
  actorCount: number,
  body: string | null
) {
  if (actorCount <= 1) {
    // Singleton group — fall back to the single-actor copy.
    return getNotificationContent(type, latestActorName, body);
  }

  const others = actorCount - 1;

  // "Alice and Bob" (2 actors) vs "Alice and N others" (3+).
  // 2-actor copy is warmer than "Alice and 1 other"; only switch to the
  // numeric "N others" line at 3+.
  const actors2 =
    actorCount === 2 && secondActorName
      ? `${latestActorName} and ${secondActorName}`
      : `${latestActorName} and ${others} other${others === 1 ? '' : 's'}`;

  switch (type) {
    case 'post_like':
      return { title: `${actors2} liked your dream`, body: '' };
    case 'post_repost':
      return { title: `${actors2} reposted your dream`, body: '' };
    case 'post_favorite':
      return { title: `${actors2} favorited your dream`, body: '' };
    case 'comment_like':
      return { title: `${actors2} liked your comment`, body: '' };
    case 'post_comment':
      // Per-comment groups are single-actor by group_key design (comment:<id>),
      // so this branch usually doesn't fire — but if a future grouping change
      // bundles comments per post, this reads correctly.
      return { title: `${actors2} commented on your post`, body: '' };
    case 'comment_reply':
      return { title: `${actors2} replied to your comment`, body: '' };
    case 'comment_mention':
      return { title: `${actors2} mentioned you`, body: '' };
    case 'post_share':
      return { title: `${actors2} sent you posts`, body: 'Tap to check them out' };
    case 'friend_request':
      return { title: `${actors2} want to dream with you`, body: 'Tap to respond' };
    case 'friend_accepted':
      return { title: `${actors2} accepted your friend request`, body: "You're now friends!" };
    case 'follow_request':
      return { title: `${actors2} requested to follow you`, body: 'Tap to approve or deny' };
    case 'follow_accepted':
      return { title: `${actors2} accepted your follow request`, body: '' };
    case 'dream_generated':
    case 'download_ready':
    case 'trial_reminder':
    case 'pro_reminder':
      // Self-events — fall through to single-actor copy regardless of count.
      return getNotificationContent(type, latestActorName, body);
    default:
      return { title: 'New notifications', body: '' };
  }
}

Deno.serve(async (req) => {
  try {
    // Caller auth: this function is invoked by the notifications-INSERT trigger
    // (migration 196) via pg_net, which passes the shared worker token. Reject
    // anything else so a leaked URL can't be used to spam pushes to any user.
    // Reuses DREAM_QUEUE_WORKER_TOKEN (same secret the queue worker validates).
    const expectedToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
    if (!expectedToken || req.headers.get('Authorization') !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const payload: WebhookPayload = await req.json();
    const { record } = payload;

    // Create admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get recipient's push tokens
    const { data: tokens } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', record.recipient_id);

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No push tokens' }), { status: 200 });
    }

    // Activity gate (migration 224): skip the Expo POST when the recipient is
    // currently active in the app. The notification row is already inserted
    // and the in-app indicators (profile-tab dot, inbox bubble, badge cache)
    // will light up — sending an OS banner on top is the redundant noise
    // Kevin called out ("getting push notifications while in DreamBot app").
    // Decision lives in _shared/notify.ts:shouldSkipForActivity so the rule
    // is unit-tested in jest.
    const { data: activityRow } = await supabase
      .from('users')
      .select('last_active_at, last_inbox_view_at')
      .eq('id', record.recipient_id)
      .maybeSingle();
    if (shouldSkipForActivity({ lastActiveAt: activityRow?.last_active_at, now: Date.now() })) {
      return new Response(
        JSON.stringify({ message: 'Recipient active in-app; skipping push', skipped: 'active' }),
        { status: 200 }
      );
    }

    // Sibling-acknowledged gate (migration 225): if the user has already
    // tapped or viewed ANY sibling notification (same group_key), skip the
    // OS banner. Catches the case Kevin hit — first download_ready push
    // tapped, in-app save still in progress, then a duplicate notification
    // would have fired a second push. Decision lives in
    // _shared/notify.ts:hasSeenSibling so it's unit-tested.
    if (record.group_key) {
      const { data: siblings } = await supabase
        .from('notifications')
        .select('seen_at, created_at')
        .eq('recipient_id', record.recipient_id)
        .eq('group_key', record.group_key)
        .neq('id', record.id)
        .order('created_at', { ascending: true });
      const oldest = siblings && siblings.length > 0 ? siblings[0].created_at : null;
      const anySeen = !!siblings && siblings.some((s) => s.seen_at !== null);
      if (
        hasSeenSibling({
          oldestSiblingCreatedAt: oldest,
          anySiblingSeen: anySeen,
          lastInboxViewedAt: activityRow?.last_inbox_view_at,
        })
      ) {
        return new Response(
          JSON.stringify({
            message: 'User already acknowledged a sibling notification; skipping push',
            skipped: 'sibling-acknowledged',
          }),
          { status: 200 }
        );
      }
    }

    // Get actor's username (the LATEST actor in the group when aggregated;
    // the only actor otherwise).
    const { data: actor } = await supabase
      .from('users')
      .select('username')
      .eq('id', record.actor_id)
      .single();

    const actorName = actor?.username ?? 'Someone';

    // Phase 2 (migration 204): aggregated push path. The drain worker sets
    // aggregated=true + group_key when collapsing a debounced group into one
    // push. Look up the group's CURRENT state from notifications (the row count
    // = number of events in this group; distinct actor_ids = number of unique
    // actors) and the second-most-recent actor's username for the 2-actor copy
    // line. Falls back to single-actor copy if any of that lookup fails.
    let content = getNotificationContent(
      record.type,
      actorName,
      record.body,
      record.subtype ?? null
    );
    if (payload.aggregated && payload.group_key) {
      // Distinct unread actors in this group, recipient-scoped. (Counting only
      // unseen so an already-read group doesn't double-count an older actor on
      // a follow-up push — the user already saw the earlier event.)
      const { data: groupActors } = await supabase
        .from('notifications')
        .select('actor_id, created_at')
        .eq('recipient_id', record.recipient_id)
        .eq('group_key', payload.group_key)
        .is('seen_at', null)
        .order('created_at', { ascending: false })
        .limit(50);
      const seenActorIds = new Set<string>();
      const orderedActorIds: string[] = [];
      for (const row of groupActors ?? []) {
        if (!row.actor_id || row.actor_id === record.recipient_id) continue;
        if (seenActorIds.has(row.actor_id)) continue;
        seenActorIds.add(row.actor_id);
        orderedActorIds.push(row.actor_id);
      }
      const actorCount = orderedActorIds.length || 1;
      let secondActorName: string | null = null;
      if (actorCount >= 2 && orderedActorIds[1] && orderedActorIds[1] !== record.actor_id) {
        const { data: second } = await supabase
          .from('users')
          .select('username')
          .eq('id', orderedActorIds[1])
          .single();
        secondActorName = second?.username ?? null;
      }
      content = getAggregatedNotificationContent(
        record.type,
        actorName,
        secondActorName,
        actorCount,
        record.body
      );
    }

    // App-icon badge = recipient's "new since last inbox view" count
    // (migration 223 "viewed = read" model — count of notifications with
    // created_at > users.last_inbox_view_at). Same RPC the client uses for
    // the profile-tab dot + useBadgeSync, so the OS badge always matches the
    // in-app dot. This trigger fires AFTER INSERT, so the just-inserted row
    // is already counted. Falls back to 1 if the RPC errors so a closed app
    // accumulating several notifications doesn't get stuck on a stale value.
    const { data: newCount } = await supabase.rpc('get_new_notification_count', {
      p_user_id: record.recipient_id,
    });
    const badge = (newCount as number | null) ?? 1;

    // Build push data for navigation on tap. `type` lets the client route by
    // notification kind — e.g. a download_ready tap auto-saves the cached HD
    // rather than just opening the post. `notificationId` + `groupKey` let
    // the client mark the row as seen on tap so the inbox badge clears
    // without requiring the user to open the inbox separately. group_key is
    // preferred (handles aggregated likes/comments — one tap clears the
    // whole debounced group, matching the inbox UX); notification_id is the
    // single-row fallback.
    const data: Record<string, string> = { type: record.type };
    if (record.upload_id) data.uploadId = record.upload_id;
    if (record.id) data.notificationId = record.id;
    // group_key: prefer payload.group_key (worker-supplied for debounced
    // aggregated pushes) over record.group_key (column on the underlying
    // notification row) — they're usually the same but the worker payload
    // is the authoritative source for aggregated cases.
    const groupKey = payload.group_key ?? record.group_key;
    if (groupKey) data.groupKey = groupKey;
    if (record.type === 'friend_request' || record.type === 'friend_accepted') {
      data.userId = record.actor_id;
    }

    // Send to all device tokens
    const messages = tokens.map((t) => ({
      to: t.token,
      sound: 'notification.wav',
      title: content.title,
      body: content.body,
      data,
      badge,
    }));

    const pushResponse = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });

    const pushResult = await pushResponse.json();

    // Expo returns one ticket per message, in the same order we sent them — so
    // tickets[i] ↔ messages[i] ↔ tokens[i]. Split error tickets into:
    //   • stale tokens (DeviceNotRegistered) → PRUNE the dead push_tokens row
    //     (a user accumulates these as the app is reinstalled / tokens rotate).
    //   • everything else → SYSTEMIC failure (Expo rate limit, bad payload, etc).
    const tickets: Array<{ status?: string; message?: string; details?: { error?: string } }> =
      Array.isArray(pushResult?.data) ? pushResult.data : [];
    const deadTokens: string[] = [];
    const systemicErrors: Array<{ error?: string; message?: string }> = [];
    tickets.forEach((ticket, i) => {
      if (!ticket || ticket.status !== 'error') return;
      const kind = ticket.details && ticket.details.error;
      if (kind === 'DeviceNotRegistered') {
        const tok = tokens[i] && tokens[i].token;
        if (tok) deadTokens.push(tok);
      } else {
        systemicErrors.push({ error: kind, message: ticket.message });
      }
    });

    // Prune stale tokens (best-effort, scoped to this recipient).
    if (deadTokens.length > 0) {
      const { error: pruneErr } = await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', record.recipient_id)
        .in('token', deadTokens);
      if (pruneErr) console.error('[Push] token prune FAILED:', pruneErr.message);
      else
        console.log(`[Push] pruned ${deadTokens.length} stale token(s) for ${record.recipient_id}`);
    }

    // Record SYSTEMIC failures (non-ok HTTP / non-stale ticket errors) so the
    // push-failure monitor can fail loud on real problems. Routine stale tokens
    // were pruned above and are deliberately NOT logged, keeping the signal clean.
    // The in-app inbox row delivered regardless — this is operability, not user delivery.
    const httpFailed = !pushResponse.ok;
    if (httpFailed || systemicErrors.length > 0) {
      const detail = JSON.stringify(systemicErrors.length ? systemicErrors : pushResult).slice(
        0,
        1000
      );
      console.error(
        `[Push] SYSTEMIC FAILURE for ${record.recipient_id} (type=${record.type}): httpOk=${pushResponse.ok}, ${systemicErrors.length} non-stale ticket error(s):`,
        detail
      );
      const { error: logErr } = await supabase.from('push_send_failures').insert({
        recipient_id: record.recipient_id,
        notification_type: record.type,
        error_kind: httpFailed ? `http_${pushResponse.status}` : 'ticket_error',
        detail,
      });
      if (logErr) console.error('[Push] failure-log insert FAILED:', logErr.message);
    } else {
      console.log('[Push] Sent:', JSON.stringify(pushResult));
    }

    return new Response(JSON.stringify({ sent: messages.length }), { status: 200 });
  } catch (err) {
    console.error('[Push] Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
