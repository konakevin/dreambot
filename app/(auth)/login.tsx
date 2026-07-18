import { showAlert } from '@/components/CustomAlert';
import { useState } from 'react';
import { View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Text, TextInput } from '@/components/AppText';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { TermsAgreementFooter } from '@/components/TermsAgreementFooter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getPostAuthRoute } from '@/lib/postAuthRoute';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle } from '@/lib/googleAuth';
import { signInWithApple } from '@/lib/appleAuth';
import { signInWithFacebook } from '@/lib/facebookAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    if (!email.trim()) {
      showAlert('Enter your email', 'Type your email above, then tap Forgot password again.');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Sends a recovery email whose link points at the https universal link
    // https://dreambotapp.com/reset-password. On a device with the app installed
    // iOS opens the app directly (associatedDomains: applinks:dreambotapp.com);
    // otherwise the website's /reset-password page bounces into the app via the
    // dreambot:// scheme. Either way _layout.tsx handles path === 'reset-password',
    // exchanges the recovery code, and routes to the set-new-password screen.
    // NOTE: this https URL must be allow-listed in Supabase → Auth → URL
    // Configuration → Redirect URLs, or Supabase falls back to the Site URL.
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'https://dreambotapp.com/reset-password',
    });
    setLoading(false);
    // Always show the same confirmation — never reveal whether an email is
    // registered (account-enumeration guard).
    showAlert(
      'Check your email',
      `If an account exists for ${email.trim()}, we've sent a link to reset your password.`
    );
    if (error) console.warn('[login] resetPasswordForEmail error:', error.message);
  }

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      showAlert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      showAlert('Sign in failed', 'Invalid email or password.');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const dest = await getPostAuthRoute();
      router.replace(dest);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View className="px-4 pt-4 pb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ResponsiveContainer maxWidth={600} style={{ flex: 1 }}>
          <View className="flex-1 px-6">
            <Text className="text-white text-2xl font-bold mb-1">Welcome back</Text>
            <Text className="text-text-secondary mb-8">Sign in to your account.</Text>

            <Text className="text-text-secondary text-xs mb-2 ml-1">EMAIL</Text>
            <View className="bg-card border border-border rounded-2xl px-4 py-4 mb-5">
              <TextInput
                className="text-white text-base"
                placeholder="you@example.com"
                placeholderTextColor="#3E4144"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <Text className="text-text-secondary text-xs mb-2 ml-1">PASSWORD</Text>
            <View className="bg-card border border-border rounded-2xl px-4 py-4 flex-row items-center mb-2">
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Your password"
                placeholderTextColor="#3E4144"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2 w-8 h-8 items-center justify-center"
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#71767B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="self-end mb-8"
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text className="text-[#A78BFA] text-sm">Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-[#A78BFA] rounded-full py-4 items-center ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign in</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="text-text-secondary text-xs mx-4">OR</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Compact icon-only social row — three round buttons, brand
                logos only. Visually secondary to the primary Sign-in
                button above so the eye knows email/password is the main
                path here. (Welcome screen still surfaces the full-width
                social labeled versions for first-time sign-up.) */}
            <View className="flex-row items-center justify-center gap-4">
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  className="w-14 h-14 rounded-full bg-card border border-border items-center justify-center"
                  onPress={async () => {
                    try {
                      setLoading(true);
                      await signInWithApple();
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      // Resolve onboarding-vs-tabs BEFORE navigating (like the
                      // email path) so a fresh user goes straight to onboarding
                      // — replace('/') bounced through app/index's async gate and
                      // flashed the tabs/FeedIntroGate first.
                      router.replace(await getPostAuthRoute());
                    } catch (err: unknown) {
                      const msg = (err as Error).message;
                      if (
                        !msg.includes('canceled') &&
                        !msg.includes('cancelled') &&
                        !msg.includes('ERR_CANCELED')
                      ) {
                        showAlert('Apple Sign-In failed', msg);
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  activeOpacity={0.7}
                  accessibilityLabel="Sign in with Apple"
                >
                  <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-card border border-border items-center justify-center"
                onPress={async () => {
                  try {
                    setLoading(true);
                    await signInWithGoogle();
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.replace(await getPostAuthRoute());
                  } catch (err: unknown) {
                    const msg = (err as Error).message;
                    if (!msg.includes('canceled') && !msg.includes('cancelled')) {
                      showAlert('Google Sign-In failed', msg);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                activeOpacity={0.7}
                accessibilityLabel="Sign in with Google"
              >
                <Ionicons name="logo-google" size={24} color="#4285F4" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-card border border-border items-center justify-center"
                onPress={async () => {
                  try {
                    setLoading(true);
                    await signInWithFacebook();
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.replace(await getPostAuthRoute());
                  } catch (err: unknown) {
                    const msg = (err as Error).message;
                    if (!msg.includes('canceled') && !msg.includes('cancelled')) {
                      showAlert('Facebook Sign-In failed', msg);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                activeOpacity={0.7}
                accessibilityLabel="Sign in with Facebook"
              >
                <Ionicons name="logo-facebook" size={26} color="#1877F2" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className="text-text-secondary">Don{"'"}t have an account? </Text>
              <Link href="/(auth)/signup">
                <Text className="text-[#A78BFA] font-semibold">Sign up</Text>
              </Link>
            </View>

            <TermsAgreementFooter />
          </View>
        </ResponsiveContainer>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
