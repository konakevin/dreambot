/**
 * The number on the Home "Following" pill: new posts from accounts the user follows since they last opened the
 * tab (get_following_new_count, migration 629). Hidden at zero; the server caps the count at 10, shown as "9+".
 */
export function followingBadgeLabel(count: number | null | undefined): string | null {
  if (!count || count < 1) return null;
  return count > 9 ? '9+' : String(Math.floor(count));
}
