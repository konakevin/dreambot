import { showAlert } from '@/components/CustomAlert';
import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getPostAuthRoute } from '@/lib/postAuthRoute';
import { GradientTitle } from '@/components/GradientTitle';
import { signInWithGoogle } from '@/lib/googleAuth';
import { signInWithApple } from '@/lib/appleAuth';
import { signInWithFacebook } from '@/lib/facebookAuth';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';

const MASCOT_SIZE = verticalScaleClamped(130, 100, 150);

function Logo() {
  return (
    <View style={authStyles.logoContainer}>
      {/* Mascot */}
      <Image
        source={require('@/assets/images/icon.png')}
        style={authStyles.mascot}
        contentFit="cover"
      />

      {/* Gradient wordmark — single 'DreamBot' (was a two-line DREAM/BOT
          duotone in the legacy design). */}
      <GradientTitle size={48} weight={800} letterSpacing={-0.5}>
        DreamBot
      </GradientTitle>

      <Text style={authStyles.tagline}>Your own personal AI dream machine</Text>
    </View>
  );
}

const authStyles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: 28,
    marginBottom: verticalScale(18),
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(17),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: verticalScale(12),
  },
});

export default function WelcomeScreen() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSocialSignIn(provider: 'google' | 'apple' | 'facebook') {
    try {
      setLoading(provider);
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'apple') {
        await signInWithApple();
      } else {
        await signInWithFacebook();
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const dest = await getPostAuthRoute();
      router.replace(dest);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (
        !msg.includes('canceled') &&
        !msg.includes('cancelled') &&
        !msg.includes('ERR_CANCELED')
      ) {
        const label = provider === 'google' ? 'Google' : 'Apple';
        showAlert(`${label} Sign-In failed`, msg);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        <Logo />
      </View>

      <View className="px-6 pb-8 gap-3">
        {/* Social buttons use the theme's `bg-card` (#1A1A24) with a thin
            `border-border` so they read as discrete tappable cards against
            the solid black bg. Pure-black-on-black is invisible; this
            gives just enough elevation for the eye to lock on without
            adding bright color. Brand identity is carried by the LOGO
            color (Apple white, Google multi-color G, Facebook blue f). */}

        {/* Apple Sign-In (iOS only) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            className="bg-card border border-border rounded-full py-4 flex-row items-center justify-center gap-3"
            onPress={() => handleSocialSignIn('apple')}
            disabled={loading !== null}
            activeOpacity={0.8}
          >
            {loading === 'apple' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base">Continue with Apple</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Google Sign-In */}
        <TouchableOpacity
          className="bg-card border border-border rounded-full py-4 flex-row items-center justify-center gap-3"
          onPress={() => handleSocialSignIn('google')}
          disabled={loading !== null}
          activeOpacity={0.8}
        >
          {loading === 'google' ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="text-white font-semibold text-base">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Facebook Sign-In */}
        <TouchableOpacity
          className="bg-card border border-border rounded-full py-4 flex-row items-center justify-center gap-3"
          onPress={() => handleSocialSignIn('facebook')}
          disabled={loading !== null}
          activeOpacity={0.8}
        >
          {loading === 'facebook' ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text className="text-white font-semibold text-base">Continue with Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Email signup + login as inline text links — social trio above is
            now the primary path; email signup is the alternative, demoted
            from full-width buttons (was visually competing with the social
            buttons and muddling the "do this" hierarchy). */}
        <View className="flex-row items-center justify-center gap-1.5 mt-3">
          <Text className="text-white/60 text-sm">New here?</Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text className="text-white font-semibold text-sm">Create an account</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View className="flex-row items-center justify-center gap-1.5">
          <Text className="text-white/60 text-sm">Have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text className="text-white font-semibold text-sm">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Legal disclosure — bumped from text-tertiary (invisible on the
            purple haze) to white/55 so it's legible without shouting. */}
        <Text className="text-xs text-center mt-3 px-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
          By continuing you agree to our{' '}
          <Text
            className="underline"
            onPress={() => Linking.openURL('https://dreambotapp.com/terms')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            className="underline"
            onPress={() => Linking.openURL('https://dreambotapp.com/privacy')}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
}
