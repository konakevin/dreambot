/**
 * Maps the status string returned by join_game_by_code / accept_invite into a
 * friendly outcome (success → enter the Room; failure → a warm, specific message
 * with no dead-end). Pure + unit-tested so the code sheet and the push-accept flow
 * share ONE mapping and stay in sync with the DB's status strings.
 */

export interface JoinOutcome {
  /** true → navigate into the Room; false → show `message`, stay put. */
  ok: boolean;
  gameId: string | null;
  /** User-facing line (DreamBot voice). Present on both ok and not-ok. */
  message: string;
}

export function interpretJoin(status: string, gameId: string | null): JoinOutcome {
  switch (status) {
    case 'joined':
    case 'already_member':
      return { ok: true, gameId, message: "You're in! 🎭" };
    case 'pending_approval':
      return { ok: true, gameId, message: 'Sent — waiting for the host to let you in.' };
    case 'not_found':
      return {
        ok: false,
        gameId: null,
        message: 'Hmm — no game with that code. Double-check it with your friend?',
      };
    case 'full':
      return { ok: false, gameId, message: "This one's full! Ask them to start another." };
    case 'spectator':
      return {
        ok: false,
        gameId,
        message: 'This Dream Off already kicked off — you juuust missed it 😅',
      };
    case 'revoked':
      return { ok: false, gameId, message: "That invite link isn't active anymore." };
    case 'removed':
      return { ok: false, gameId, message: 'The host removed you from this game.' };
    case 'disabled':
      return { ok: false, gameId: null, message: "Dream Off isn't live yet." };
    default:
      return { ok: false, gameId, message: "Couldn't join — give it another shot?" };
  }
}
