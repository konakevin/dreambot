import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';

export const queryClient = new QueryClient();

// React Native: tell TanStack Query to refetch all stale queries when the
// app returns from background. Without this hook, the unread-notification
// badge (and other auto-refreshing surfaces) can sit stale after a
// realtime channel reconnect or app resume. AppState fires 'active' when
// the app foregrounds; focusManager.setFocused(true) tells RQ to treat
// it as a window-focus event so stale queries (staleTime expired) refetch.
function onAppStateChange(status: AppStateStatus) {
  // When backgrounding, cancel any in-flight queries. iOS suspends a running
  // fetch the instant the app backgrounds, and that promise often NEVER
  // settles — so on resume the query is still `fetchStatus: 'fetching'` and
  // TanStack dedups against it, refusing to start a fresh fetch. The result is
  // a spinner that spins forever (seen returning to Profile after a while
  // away). Cancelling resets those queries to `idle`; the resume focus event
  // below then triggers a clean refetch. Cancel does NOT touch cached data or
  // settled queries — only the dangling in-flight ones.
  if (status === 'background') {
    void queryClient.cancelQueries();
  }
  focusManager.setFocused(status === 'active');
}
AppState.addEventListener('change', onAppStateChange);
