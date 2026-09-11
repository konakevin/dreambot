import type { User } from '@supabase/supabase-js';
import { resolveStableUser } from '@/lib/authUserIdentity';

const user = (id: string, email = `${id}@x.test`): User =>
  ({
    id,
    email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '',
  }) as User;

describe('resolveStableUser — the user object stays referentially stable across token refreshes', () => {
  it('TOKEN_REFRESHED with the same id keeps the PREVIOUS reference (no effect re-fires)', () => {
    const prev = user('u1');
    const next = user('u1');
    expect(resolveStableUser(prev, next, 'TOKEN_REFRESHED')).toBe(prev);
  });

  it('SIGNED_IN as a different user publishes the new user', () => {
    const prev = user('u1');
    const next = user('u2');
    expect(resolveStableUser(prev, next, 'SIGNED_IN')).toBe(next);
  });

  it('USER_UPDATED with the same id publishes the new payload', () => {
    const prev = user('u1', 'old@x.test');
    const next = user('u1', 'new@x.test');
    expect(resolveStableUser(prev, next, 'USER_UPDATED')).toBe(next);
  });

  it('first session (no previous user) and sign-out (no next user) pass through', () => {
    const next = user('u1');
    expect(resolveStableUser(null, next, 'INITIAL_SESSION')).toBe(next);
    expect(resolveStableUser(next, null, 'SIGNED_OUT')).toBeNull();
  });
});
