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
  focusManager.setFocused(status === 'active');
}
AppState.addEventListener('change', onAppStateChange);
