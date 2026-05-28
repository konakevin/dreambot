// Supabase Edge Function: send-push
// Called via database webhook when a notification row is inserted.
// Looks up the recipient's Expo push token and sends a push notification.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    created_at: string;
  };
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

function getNotificationContent(type: string, actorName: string, body: string | null) {
  switch (type) {
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
      // Rotating push copy — short, mysterious, personal. The emotional hook
      // of DreamBot is "while you slept," so leaning into that. If the
      // notification body field is populated (e.g., wish text), prefer that;
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

    // Get actor's username
    const { data: actor } = await supabase
      .from('users')
      .select('username')
      .eq('id', record.actor_id)
      .single();

    const actorName = actor?.username ?? 'Someone';
    const content = getNotificationContent(record.type, actorName, record.body);

    // App-icon badge = recipient's true unread count. This trigger fires AFTER
    // INSERT, so the just-inserted row is already counted. The client mirrors
    // this onto the OS badge and clears it to 0 when the inbox is viewed
    // (useBadgeSync + useMarkAllSeen); sending the real count keeps a closed app
    // that accumulates several notifications from showing a stale "1".
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', record.recipient_id)
      .is('seen_at', null);
    const badge = unreadCount ?? 1;

    // Build push data for navigation on tap. `type` lets the client route by
    // notification kind — e.g. a download_ready tap auto-saves the cached HD
    // rather than just opening the post.
    const data: Record<string, string> = { type: record.type };
    if (record.upload_id) data.uploadId = record.upload_id;
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
