import { followingBadgeLabel } from '@/lib/followingBadge';

describe('followingBadgeLabel', () => {
  it('hides at zero or when unknown', () => {
    expect(followingBadgeLabel(0)).toBeNull();
    expect(followingBadgeLabel(undefined)).toBeNull();
    expect(followingBadgeLabel(null)).toBeNull();
  });
  it('shows 1-9 as the number', () => {
    expect(followingBadgeLabel(1)).toBe('1');
    expect(followingBadgeLabel(9)).toBe('9');
  });
  it('shows 9+ past nine (the server caps the count at 10)', () => {
    expect(followingBadgeLabel(10)).toBe('9+');
    expect(followingBadgeLabel(250)).toBe('9+');
  });
});
