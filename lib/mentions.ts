/**
 * mentions — the shared @mention tap handler for captions + comments.
 *
 * Extracted 2026-07-06 after "@hannah" in a post caption dead-ended: the two
 * inline handlers (ExpandableDescription, CommentRow) did a case-SENSITIVE
 * eq('username') lookup and silently did nothing on a miss. Free-typed
 * captions have no autocomplete, so case mismatches ("@mechbot" vs "MechBot")
 * and stale/typo'd usernames are normal, not exceptional. This helper falls
 * back to a case-insensitive match and tells the user when the account
 * genuinely doesn't exist instead of eating the tap.
 */

import { supabase } from '@/lib/supabase';
import * as nav from '@/lib/navigate';
import { showAlert } from '@/components/CustomAlert';
import { PRIVATE_BOT_USERNAMES } from '@/hooks/useBotUsers';

/** Escape LIKE wildcards so "ha_nah" can't match "haXnah". */
function escapeLikePattern(raw: string): string {
  return raw.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/**
 * Resolve "@username" (with or without the @) to a profile and push it.
 * PUSH, not replace — same nav lesson as CommentRow (replace destroys the
 * screen underneath, so back lands on the home feed).
 */
export async function openMentionProfile(rawUsername: string): Promise<void> {
  const username = rawUsername.replace(/^@/, '');
  if (!username) return;

  // Private bots (AlphaBot proving ground) are undiscoverable by design —
  // treat a mention of one exactly like a nonexistent user.
  if (PRIVATE_BOT_USERNAMES.has(username.toLowerCase())) {
    showAlert(
      'User not found',
      `We couldn't find @${username}. They may have changed their username.`
    );
    return;
  }

  // Exact match first (autocompleted mentions), then case-insensitive
  // (free-typed captions).
  const exact = await supabase.from('users').select('id').eq('username', username).maybeSingle();
  let id = exact.data?.id ?? null;
  if (!id && !exact.error) {
    const loose = await supabase
      .from('users')
      .select('id')
      .ilike('username', escapeLikePattern(username))
      .limit(1)
      .maybeSingle();
    id = loose.data?.id ?? null;
  }

  if (id) {
    // ?drawer=1 so tapping a mention of YOURSELF opens a swipe-back drawer
    // over the caption/thread you're in instead of redirecting to the Profile
    // tab (which strands you with no back — Kevin 2026-07-07).
    nav.push(`/user/${id}?drawer=1`);
  } else {
    showAlert(
      'User not found',
      `We couldn't find @${username}. They may have changed their username.`
    );
  }
}
