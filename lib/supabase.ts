import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import type { Database } from '@/types/database';

// Supabase's RN-recommended storage: AsyncStorage. Was on SecureStore but
// the session blob exceeds SecureStore's 2 KB safe limit; expo-secure-store
// chunks the value across multiple keychain items, and inconsistent
// accessibility attributes across chunks caused
// "Auto refresh tick failed — User interaction is not allowed." on every
// auto-refresh tick. AsyncStorage is app-sandboxed and has no size limit.

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// REQUIRED for React Native (Supabase docs): the auto-refresh timer is a JS
// interval that iOS/Android throttle or pause in the background, so without
// this the access token silently ages out while the app is backgrounded. On
// return to foreground getSession() then hands back an EXPIRED token — which
// the supabase client refreshes on-demand for its OWN calls (storage/postgrest)
// but a hand-rolled `fetch` using that token gets a 401. Pause/resume the timer
// with app focus so the token stays fresh app-wide.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
