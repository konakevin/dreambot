import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import type { Database } from '@/types/database';

// AFTER_FIRST_UNLOCK lets the keychain item be read while the app is
// backgrounded (Supabase's autoRefreshToken timer fires off-foreground).
// Default WHEN_UNLOCKED blocks reads any time the device is locked,
// which produced: "Auto refresh tick failed — User interaction is not allowed."
const SECURE_OPTS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key, SECURE_OPTS),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value, SECURE_OPTS),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key, SECURE_OPTS),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
