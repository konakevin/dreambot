import { showAlert } from '@/components/CustomAlert';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getPostAuthRoute } from '@/lib/postAuthRoute';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithGoogle } from '@/lib/googleAuth';
import { signInWithApple } from '@/lib/appleAuth';
import { signInWithFacebook } from '@/lib/facebookAuth';

// Same brand gradient used by dreambotapp.com Hero, onboarding WelcomeStep,
// InfoStep headlines, and the Create tab title. Moon purple → cloud pink
// → star teal at the same 135°-equivalent diagonal.
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

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
          duotone in the legacy design). Same MaskedView + LinearGradient
          pattern as the onboarding WelcomeStep title. */}
      <MaskedView maskElement={<Text style={authStyles.wordmark}>DreamBot</Text>}>
        <LinearGradient colors={BRAND_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={[authStyles.wordmark, { opacity: 0 }]}>DreamBot</Text>
        </LinearGradient>
      </MaskedView>

      <Text style={authStyles.tagline}>Where bots dream and you’re invited.</Text>
    </View>
  );
}

const authStyles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  mascot: {
    width: 130,
    height: 130,
    borderRadius: 28,
    marginBottom: 18,
  },
  wordmark: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
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
      {/* Hazy brand-gradient backdrop — fullscreen bloom, no visible edges.
          Two FULL-SCREEN LinearGradient layers (no clipped circles) with
          `locations` controlling soft fade-to-transparent curves. Alpha
          bumped 2026-06-04 (Kevin: "lighten the purple behind it a bit so
          black would stand out more") so the lavender base reads more
          clearly behind the new pure-black social buttons. */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={['rgba(167,139,250,0.55)', 'rgba(167,139,250,0.10)']}
          locations={[0, 1]}
          start={{ x: 0.4, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['rgba(249,168,212,0.38)', 'rgba(249,168,212,0)']}
          locations={[0, 0.75]}
          start={{ x: 1, y: 0.4 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Logo />
      </View>

      <View className="px-6 pb-8 gap-3">
        {/* All three social buttons share PURE BLACK so they read as a
            single calm group anchored on the bottom of the lavender-haze
            backdrop. Brand identity is carried entirely by the LOGO color
            (Apple white, Google multicolor-G #4285F4, Facebook blue
            #1877F2). All three styles are brand-compliant: Apple HIG
            permits black buttons; Google has an official 'dark' variant;
            Meta allows custom backgrounds as long as the f-mark is
            rendered correctly. */}

        {/* Apple Sign-In (iOS only) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            className="rounded-full py-4 flex-row items-center justify-center gap-3"
            style={{ backgroundColor: '#000000' }}
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
          className="rounded-full py-4 flex-row items-center justify-center gap-3"
          style={{ backgroundColor: '#000000' }}
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
          className="rounded-full py-4 flex-row items-center justify-center gap-3"
          style={{ backgroundColor: '#000000' }}
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
