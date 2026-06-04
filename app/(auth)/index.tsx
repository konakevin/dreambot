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
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Same brand gradient used by dreambotapp.com Hero, onboarding WelcomeStep,
// InfoStep headlines, and the Create tab title. Moon purple → cloud pink
// → star teal at the same 135°-equivalent diagonal.
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

// Soft hazy halo colors — same brand stops at low alpha so the big background
// blob reads as a quiet purple/pink glow, not a competing element. Mirrors
// the dreambotapp.com Hero's `gradient-hero` radial-blob backdrop.
const HALO_GRADIENT: [string, string, string] = [
  'rgba(167,139,250,0.55)', // moon
  'rgba(249,168,212,0.35)', // cloud
  'rgba(94,234,212,0.18)', // star
];

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

const HALO_SIZE = SCREEN_WIDTH * 1.25;

const authStyles = StyleSheet.create({
  // Layered "hazy" backdrop — a big soft brand-gradient blob centered behind
  // the logo area, plus two smaller accent blobs offset to the corners.
  // No radial-gradient primitive in RN; this is the standard workaround
  // (LinearGradient on a rounded circular View). Total effect: a quiet
  // purple/pink wash that reads like the dreambot-web Hero backdrop.
  backdropMain: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    top: -HALO_SIZE * 0.15,
    left: (SCREEN_WIDTH - HALO_SIZE) / 2,
    overflow: 'hidden',
  },
  backdropMainGradient: { width: '100%', height: '100%' },
  backdropAccent: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: SCREEN_WIDTH * 0.425,
    overflow: 'hidden',
    opacity: 0.55,
  },
  backdropAccentGradient: { width: '100%', height: '100%' },

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
      {/* Hazy brand-gradient backdrop — sits behind everything. Two layered
          blobs (main centered + accent bottom-right) at low alpha approximate
          the soft purple/pink wash the dreambotapp.com Hero uses. */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <View style={authStyles.backdropMain}>
          <LinearGradient
            colors={HALO_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={authStyles.backdropMainGradient}
          />
        </View>
        <View
          style={[
            authStyles.backdropAccent,
            { bottom: -SCREEN_WIDTH * 0.25, right: -SCREEN_WIDTH * 0.2 },
          ]}
        >
          <LinearGradient
            colors={['rgba(249,168,212,0.45)', 'rgba(167,139,250,0.2)', 'rgba(15,15,26,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={authStyles.backdropAccentGradient}
          />
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Logo />
      </View>

      <View className="px-6 pb-8 gap-3">
        {/* Apple Sign-In (iOS only) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            className="bg-white rounded-full py-4 flex-row items-center justify-center gap-3"
            onPress={() => handleSocialSignIn('apple')}
            disabled={loading !== null}
            activeOpacity={0.8}
          >
            {loading === 'apple' ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#000000" />
                <Text className="text-black font-semibold text-base">Continue with Apple</Text>
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
              <Ionicons name="logo-google" size={20} color="#FFFFFF" />
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

        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity
            className="bg-[#8B7BEE] rounded-full py-4 items-center"
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Text className="text-white font-bold text-base">Create account</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity
            className="border border-border rounded-full py-4 items-center"
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text className="text-white font-semibold text-base">Sign in</Text>
          </TouchableOpacity>
        </Link>

        <Text className="text-text-tertiary text-xs text-center mt-2 px-4">
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
