import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { supabase } from '@/lib/supabase';

/**
 * Sign in with Apple using native SDK.
 * Returns the Supabase session or throws on error.
 */
export async function signInWithApple() {
  // Generate a nonce for security
  const rawNonce = Crypto.getRandomBytes(16)
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');

  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  // Trigger the native Apple Sign-In UI
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) {
    throw new Error('No identity token returned from Apple Sign-In');
  }

  // Exchange the Apple identity token for a Supabase session
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    nonce: rawNonce,
  });

  if (error) throw error;
  return data;
}
