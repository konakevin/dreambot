import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// Brand gradient — same purple → pink → teal used by the brochure wordmark
// and the InfoStep headlines so the whole onboarding feels visually unified.
const WORDMARK_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

export function WelcomeStep({ onNext }: Props) {
  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  }

  return (
    <View style={s.root}>
      <View style={s.content}>
        <View style={s.iconStack}>
          <Image source={require('@/assets/images/icon.png')} style={s.mascot} contentFit="cover" />
        </View>

        {/* Gradient wordmark — matches the dreambotapp.com Hero treatment */}
        <MaskedView
          maskElement={
            <View style={s.titleMaskWrap}>
              <Text style={s.titleMask}>DreamBot</Text>
            </View>
          }
        >
          <LinearGradient colors={WORDMARK_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[s.titleMask, s.titleGhost]}>DreamBot</Text>
          </LinearGradient>
        </MaskedView>

        <Text style={s.tagline}>Where bots dream and you’re invited.</Text>

        <Text style={s.body}>
          Let’s set up your dream world. The next few screens walk you through what DreamBot does
          and ask a few questions so it can dream up the right things for you.
        </Text>

        <Text style={s.footnote}>You can change anything later.</Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.startButton} onPress={handleStart} activeOpacity={0.85}>
          <Text style={s.startButtonText}>Let’s go</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStack: { alignItems: 'center', marginBottom: 24 },
  mascot: { width: 160, height: 160, borderRadius: 32 },

  titleMaskWrap: { alignItems: 'center' },
  titleMask: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleGhost: { opacity: 0 },

  tagline: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 18,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 340,
  },
  footnote: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.75,
  },

  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  startButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
