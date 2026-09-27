/**
 * The ONE automatic Home-feed reload: recovering a feed that is stuck empty.
 *
 * Kevin's rule (memory feedback_home_feed_never_auto_refreshes): the Home feed never
 * refreshes on its own. Coming back to the app keeps the exact post; only the Home
 * re-tap, pull-to-refresh or an app restart change it.
 *
 * The exception is a feed with NOTHING loaded: when the app is backgrounded,
 * lib/queryClient.ts cancels in-flight queries, and a cancelled first fetch leaves
 * the query with no data and no fetch running, so Home sits on "Your feed is
 * warming up" until a restart (Kevin 2026-07-12). Reloading then can't disturb
 * anything, because there is nothing on screen.
 *
 * A feed that loaded successfully but is genuinely empty (a Following tab for
 * someone who follows nobody) has data, so it is left alone.
 */
export function shouldRecoverStuckFeed(state: {
  hasUser: boolean;
  hasData: boolean;
  isFetching: boolean;
}): boolean {
  return state.hasUser && !state.hasData && !state.isFetching;
}
