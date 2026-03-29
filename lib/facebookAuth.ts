import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { supabase } from '@/lib/supabase';

/**
 * Sign in with Facebook using native SDK.
 * Returns the Supabase session or throws on error.
 */
export async function signInWithFacebook() {
  // Trigger the native Facebook Login UI
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw new Error('cancelled');
  }

  // Get the access token
  const tokenData = await AccessToken.getCurrentAccessToken();
  if (!tokenData?.accessToken) {
    throw new Error('No access token returned from Facebook');
  }

  // Exchange the Facebook access token for a Supabase session
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'facebook',
    token: tokenData.accessToken,
  });

  if (error) throw error;
  return data;
}
