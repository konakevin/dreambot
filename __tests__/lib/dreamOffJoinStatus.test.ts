/** Locks the join/accept status → outcome mapping (success → enter Room; every
 *  failure → a warm message, never a dead-end). Shared by the code sheet + push-accept. */

import { interpretJoin } from '@/lib/dreamOffJoinStatus';

describe('interpretJoin', () => {
  it('joined / already_member → enter the room', () => {
    expect(interpretJoin('joined', 'g1')).toMatchObject({ ok: true, gameId: 'g1' });
    expect(interpretJoin('already_member', 'g1').ok).toBe(true);
  });
  it('pending_approval → ok (waiting to be let in)', () => {
    expect(interpretJoin('pending_approval', 'g1').ok).toBe(true);
  });
  it('not_found → not ok, no game id, helpful message', () => {
    const o = interpretJoin('not_found', null);
    expect(o.ok).toBe(false);
    expect(o.gameId).toBeNull();
    expect(o.message).toMatch(/code/i);
  });
  it('full / spectator / revoked / removed / disabled → not ok with a message', () => {
    for (const s of ['full', 'spectator', 'revoked', 'removed', 'disabled']) {
      const o = interpretJoin(s, 'g1');
      expect(o.ok).toBe(false);
      expect(o.message.length).toBeGreaterThan(0);
    }
  });
  it('unknown status → graceful fallback', () => {
    expect(interpretJoin('weird', 'g1')).toMatchObject({ ok: false });
  });
});
