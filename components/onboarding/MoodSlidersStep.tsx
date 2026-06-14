/**
 * MoodSlidersStep — "Tune its personality"
 * Each slider gets its own card with a description of what it controls.
 */

import { useRef } from 'react';
import {
  View,
  StyleSheet,
  findNodeHandle,
  UIManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/AppText';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useMoodAxes } from '@/hooks/useMoodAxes';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';

const SLIDER_WIDTH = verticalScaleClamped(260, 220, 280);
const THUMB_SIZE = 28;

interface SliderCardProps {
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  leftHint: string;
  rightHint: string;
  value: number;
  onChange: (v: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

function SliderCard({
  title,
  description,
  leftLabel,
  rightLabel,
  leftHint,
  rightHint,
  value,
  onChange,
  onDragStart,
  onDragEnd,
}: SliderCardProps) {
  const trackRef = useRef<View>(null);
  const trackLeft = useRef(0);

  function handleGrant(pageX: number) {
    const node = findNodeHandle(trackRef.current);
    if (node) {
      UIManager.measureInWindow(node, (x: number) => {
        trackLeft.current = x;
        const clamped = Math.max(0, Math.min(1, (pageX - x) / SLIDER_WIDTH));
        onChange(clamped);
      });
    }
  }

  function handleMove(pageX: number) {
    const clamped = Math.max(0, Math.min(1, (pageX - trackLeft.current) / SLIDER_WIDTH));
    onChange(clamped);
  }

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.cardDesc}>{description}</Text>

      <View style={s.sliderWrap}>
        <View style={s.poleRow}>
          <View style={s.poleCol}>
            <Text style={[s.poleLabel, value < 0.4 && s.poleLabelActive]}>{leftLabel}</Text>
            <Text style={s.poleHint}>{leftHint}</Text>
          </View>
          <View style={[s.poleCol, { alignItems: 'flex-end' }]}>
            <Text style={[s.poleLabel, value > 0.6 && s.poleLabelActive]}>{rightLabel}</Text>
            <Text style={[s.poleHint, { textAlign: 'right' }]}>{rightHint}</Text>
          </View>
        </View>
        <View
          style={s.hitArea}
          onStartShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponder={() => true}
          onMoveShouldSetResponderCapture={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={(e) => {
            onDragStart?.();
            e.currentTarget.setNativeProps?.({});
            handleGrant(e.nativeEvent.pageX);
          }}
          onResponderMove={(e) => handleMove(e.nativeEvent.pageX)}
          onResponderRelease={() => {
            onDragEnd?.();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View ref={trackRef} style={s.track}>
            <View style={[s.fill, { width: value * SLIDER_WIDTH }]} />
            <View
              style={[
                s.thumb,
                { transform: [{ translateX: value * (SLIDER_WIDTH - THUMB_SIZE) }] },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function MoodSlidersStep({ onNext, onBack }: Props) {
  const sliders = useMoodAxes(); // DB-driven copy/order, built-in fallback
  const moods = useOnboardingStore((s) => s.profile.moods);
  const setMoodAxis = useOnboardingStore((s) => s.setMoodAxis);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const setScrollLocked = useOnboardingStore((s) => s.setScrollLocked);

  return (
    <KeyboardAvoidingView
      style={shared.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {/* Sticky header — sits outside the ScrollView so the slider cards
          scroll underneath it (matches BotSelectorStep / Locations).
          Title kept to one line so all 4 sliders fit above the fold. */}
      <View style={s.stickyHeader}>
        <Text style={shared.heroTitle}>What kind of dreams?</Text>
        <Text style={shared.heroSubtitle}>Slide them however feels right.</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {sliders.map((slider) => (
          <SliderCard
            key={slider.axis}
            title={slider.title}
            description={slider.description}
            leftLabel={slider.left}
            rightLabel={slider.right}
            leftHint={slider.leftHint}
            rightHint={slider.rightHint}
            value={moods[slider.axis]}
            onChange={(v) => setMoodAxis(slider.axis, v)}
            onDragStart={() => setScrollLocked(true)}
            onDragEnd={() => setScrollLocked(false)}
          />
        ))}
      </ScrollView>

      {!isEditing && <OnboardingFooter onNext={onNext} onBack={onBack} />}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  // paddingBottom was 100 (reservation for the old absolute footer); the
  // footer is now in-flow so a tight 16 is enough.
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(16),
  },
  // Sticky header that sits above the ScrollView (matches Locations +
  // BotSelectorStep). Bg-painted so scrolling content doesn't bleed through.
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(10),
    backgroundColor: colors.background,
  },

  // Tightened so all 4 cards fit above the fold without scrolling.
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: verticalScale(14),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    marginBottom: verticalScale(10),
  },

  sliderWrap: { alignItems: 'center' },
  poleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginBottom: verticalScale(2),
  },
  poleCol: { gap: 1 },
  poleLabel: { color: colors.textMuted, fontSize: fontScale(13), fontWeight: '700' },
  poleLabelActive: { color: colors.accent },
  poleHint: { color: colors.textMuted, fontSize: fontScale(11) },
  hitArea: { paddingVertical: verticalScale(12) },
  track: {
    width: SLIDER_WIDTH,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
