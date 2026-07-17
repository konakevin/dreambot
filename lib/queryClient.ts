import { QueryClient, focusManager, type Query } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { AppState, type AppStateStatus } from 'react-native';

// Cold-start feed paint: a curated slice of the query cache is persisted to disk
// so a fresh launch renders the LAST feed INSTANTLY (from AsyncStorage) and
// revalidates in the background, instead of showing a spinner until a live
// get_feed round-trip returns. Wired via PersistQueryClientProvider in
// app/_layout.tsx; purged on sign-out (store/auth.ts). gcTime MUST be >= the
// persister maxAge, or a cached query is garbage-collected before it's written to
// disk and nothing survives the cold start.
const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24; // 24h

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep cached queries alive long enough to be persisted (see above).
      gcTime: PERSIST_MAX_AGE,
    },
  },
});

// Only these query-key roots are written to disk — the ones that make the first
// paint instant. Everything else stays memory-only (keeps the blob small and
// avoids persisting volatile per-scroll or large one-off data).
const PERSISTED_ROOTS = new Set<string>([
  'dreamFeed',
  'inboxGrouped',
  'newNotificationCount',
  'dreamMediums',
  'dreamVibes',
]);

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'dreambot-rq-cache-v1',
  throttleTime: 1000,
});

export const persistOptions = {
  persister: asyncStoragePersister,
  maxAge: PERSIST_MAX_AGE,
  // Bust the persisted cache when the app version changes, so a new build never
  // hydrates data shaped for an older query/RPC.
  buster: Constants.expoConfig?.version ?? '0',
  dehydrateOptions: {
    shouldDehydrateQuery: (query: Query) =>
      query.state.status === 'success' && PERSISTED_ROOTS.has(String(query.queryKey[0])),
  },
};

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
