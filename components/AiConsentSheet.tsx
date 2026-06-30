/**
 * AI photo-consent disclosure (App Store 5.1.1(i)/5.1.2(i)) — shown in-app
 * BEFORE a user's photo is first sent to a third-party AI provider. Discloses
 * what is sent (the photo), who it goes to (named providers), and obtains
 * explicit permission. Account-bound + one-and-done via lib/aiConsent.
 *
 * Imperative + promise-based (mirrors CustomAlert's global pattern) so the photo
 * gates can `await showAiConsent()`: resolves true (agreed → consent recorded)
 * or false (declined / dismissed). Mount <AiConsentProvider> once at the root.
 */
import { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';
import { recordAiConsent } from '@/lib/aiConsent';

const PRIVACY_URL = 'https://dreambotapp.com/privacy';

let globalShow: (() => Promise<boolean>) | null = null;

/**
 * Show the AI photo-consent disclosure. Resolves true (agreed — consent is
 * recorded) or false (declined). Resolves false if the provider isn't mounted.
 */
export function showAiConsent(): Promise<boolean> {
  return globalShow ? globalShow() : Promise.resolve(false);
}

export function AiConsentProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const show = useCallback((): Promise<boolean> => {
    setVisible(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);
  globalShow = show;

  const finish = useCallback((agreed: boolean) => {
    setVisible(false);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    // Defer so the modal dismiss animation starts before the caller proceeds.
    setTimeout(() => resolve?.(agreed), 150);
  }, []);

  const handleAgree = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await recordAiConsent();
    finish(true);
  }, [finish]);

  return (
    <>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => finish(false)}
      >
        <View style={s.overlay}>
          <View style={s.card}>
            <View style={s.iconWrap}>
              <Ionicons name="sparkles" size={26} color={colors.accent} />
            </View>
            <Text style={s.title}>Putting your face in dreams</Text>
            <Text style={s.body}>
              To put you in your dreams, your photo is sent to our AI providers (Anthropic,
              Replicate, Google, and OpenAI) to describe your appearance and paint you into the
              scene. They process it under their API terms, never use it to train their models, and
              delete it shortly after.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)} activeOpacity={0.7}>
              <Text style={s.link}>View Privacy Policy</Text>
            </TouchableOpacity>
            <View style={s.buttons}>
              <GradientButton label="Agree & continue" onPress={handleAgree} />
              <TouchableOpacity onPress={() => finish(false)} activeOpacity={0.7} style={s.notNow}>
                <Text style={s.notNowText}>Not now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: isTabletDevice ? 460 : 400,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    gap: verticalScale(14),
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(167,139,250,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(19),
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    lineHeight: fontScale(21),
    textAlign: 'center',
  },
  link: { color: colors.accent, fontSize: fontScale(14), fontWeight: '700' },
  buttons: { width: '100%', gap: verticalScale(6), marginTop: verticalScale(4) },
  notNow: { alignItems: 'center', paddingVertical: verticalScale(10) },
  notNowText: { color: colors.textSecondary, fontSize: fontScale(15), fontWeight: '600' },
});
