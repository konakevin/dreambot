/**
 * Maps a raw notification row (from the realtime `notifications` INSERT
 * payload) to an in-app toast — the FOREGROUND equivalent of the push the
 * user would otherwise get. Only the high-signal "your-content-ready" events
 * toast (v1 scope); everything else returns null and stays purple-dot-only.
 *
 * PURE on purpose: returns a serializable `action` descriptor instead of a
 * navigation callback, so it imports nothing from React Native / nav / Toast
 * and is trivially unit-testable. The side-effecting glue
 * (`maybeShowNotificationToast`) lives in app/_layout.tsx where the realtime
 * subscription already has Toast + routing in scope.
 */

/** Loose shape of a notifications row — only the fields we read. */
export interface NotificationRowLike {
  id?: string;
  type?: string | null;
  subtype?: string | null;
  upload_id?: string | null;
  /** Phase 2: the failed job id, for retry. Null on pre-migration rows. */
  reference_id?: string | null;
  body?: string | null;
}

/** What a toast tap should do — resolved to real navigation by the host. */
export type ToastAction =
  | { kind: 'route'; data: { type?: string; uploadId?: string } }
  | { kind: 'inbox' }
  | { kind: 'retry'; jobId: string }
  | { kind: 'create' };

export interface ToastSpec {
  message: string;
  /** Ionicons glyph name. */
  icon: string;
  action: ToastAction;
}

/**
 * Returns the toast to show for a notification row, or null if this type
 * shouldn't toast (likes / follows / comments / shares → purple dot only).
 */
export function toastForNotification(row: NotificationRowLike): ToastSpec | null {
  const type = row.type ?? undefined;
  const uploadId = row.upload_id ?? undefined;

  switch (type) {
    case 'dream_generated':
      return {
        // No emoji in the message — the app font (DM Sans) has no emoji glyph so
        // it renders as a tofu box; the sparkle is already shown via `icon`.
        message: 'Your dream is ready',
        icon: 'sparkles',
        action: { kind: 'route', data: { type, uploadId } },
      };

    case 'download_ready':
      return {
        message: 'Your HQ download is ready',
        icon: 'cloud-download',
        action: { kind: 'route', data: { type, uploadId } },
      };

    case 'dream_failed': {
      const message = row.body || "Your dream couldn't be finished";
      const subtype = row.subtype ?? undefined;
      // Content/NSFW rejection — re-running the same prompt just re-fails, so
      // send them to Create to tweak it (never a futile retry, never a scold).
      if (subtype === 'rejected') {
        return { message, icon: 'color-wand', action: { kind: 'create' } };
      }
      // Nightly auto-dream failure — system dream, not retryable; just inform.
      if (subtype === 'nightly_failed') {
        return { message, icon: 'moon', action: { kind: 'inbox' } };
      }
      // Render/infra failure → retry the EXACT job (reference_id) if we have it;
      // older rows (pre-reference_id) fall back to opening the inbox.
      if (row.reference_id) {
        return { message, icon: 'refresh', action: { kind: 'retry', jobId: row.reference_id } };
      }
      return { message, icon: 'alert-circle', action: { kind: 'inbox' } };
    }

    default:
      return null;
  }
}
