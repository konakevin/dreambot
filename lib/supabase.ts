import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
