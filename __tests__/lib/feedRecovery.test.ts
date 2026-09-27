import { shouldRecoverStuckFeed } from '@/lib/feedRecovery';

describe('shouldRecoverStuckFeed', () => {
  it('recovers a feed with nothing loaded and no fetch running (cancelled on background)', () => {
    expect(shouldRecoverStuckFeed({ hasUser: true, hasData: false, isFetching: false })).toBe(true);
  });

  it('NEVER reloads a feed that has data: returning to the app keeps your position', () => {
    expect(shouldRecoverStuckFeed({ hasUser: true, hasData: true, isFetching: false })).toBe(false);
  });

  it('leaves a feed alone while its fetch is still running', () => {
    expect(shouldRecoverStuckFeed({ hasUser: true, hasData: false, isFetching: true })).toBe(false);
  });

  it('does nothing when signed out', () => {
    expect(shouldRecoverStuckFeed({ hasUser: false, hasData: false, isFetching: false })).toBe(
      false
    );
  });
});
