/**
 * MoodSlidersStep — "Tune its personality"
 * Each slider gets its own card with a description of what it controls.
 */

import { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle,
  UIManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import type { MoodAxes } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';

const SLIDER_WIDTH = 260;
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
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={(e) => {
            e.currentTarget.setNativeProps?.({});
            handleGrant(e.nativeEvent.pageX);
          }}
          onResponderMove={(e) => handleMove(e.nativeEvent.pageX)}
          onResponderRelease={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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

const SLIDERS: {
  axis: keyof MoodAxes;
  title: string;
  description: string;
  left: string;
  right: string;
  leftHint: string;
  rightHint: string;
}[] = [
  {
    axis: 'peaceful_chaotic',
    title: 'Energy',
    description: 'Controls the intensity of your dreams. Quiet sunsets or raging storms?',
    left: 'Calm',
    right: 'Wild',
    leftHint: 'Still water, soft light',
    rightHint: 'Thunder, motion, fire',
  },
  {
    axis: 'cute_terrifying',
    title: 'Tone',
    description: 'Sets the emotional temperature. Cozy vibes or creepy shadows?',
    left: 'Cozy',
    right: 'Eerie',
    leftHint: 'Cozy, friendly, safe',
    rightHint: 'Moody, haunting, uneasy',
  },
  {
    axis: 'minimal_maximal',
    title: 'Detail',
    description: 'How much visual information gets packed into each dream.',
    left: 'Spare',
    right: 'Lush',
    leftHint: 'One subject, one mood',
    rightHint: 'Every inch packed',
  },
  {
    axis: 'realistic_surreal',
    title: 'Reality',
    description: 'How grounded in the real world — or how far from it.',
    left: 'Grounded',
    right: 'Surreal',
    leftHint: 'Could be a photo',
    rightHint: 'Impossible physics',
  },
];

export function MoodSlidersStep({ onNext, onBack }: Props) {
  const moods = useOnboardingStore((s) => s.profile.moods);
  const setMoodAxis = useOnboardingStore((s) => s.setMoodAxis);
  const isEditing = useOnboardingStore((s) => s.isEditing);

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Text style={s.title}>Tune its personality</Text>
        <Text style={s.subtitle}>
          {`These dials shape how your DreamBot dreams. Scroll down to set them all.`}
        </Text>

        {SLIDERS.map((slider) => (
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
          />
        ))}
      </ScrollView>

      {!isEditing && (
        <View style={s.footer}>
          <View style={s.footerRow}>
            <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.nextBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onNext();
              }}
              activeOpacity={0.7}
            >
              <Text style={s.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginBottom: 20, lineHeight: 22 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },

  sliderWrap: { alignItems: 'center' },
  poleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginBottom: 2,
  },
  poleCol: { gap: 1 },
  poleLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  poleLabelActive: { color: colors.accent },
  poleHint: { color: colors.textMuted, fontSize: 11 },
  hitArea: { paddingVertical: 12 },
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

  vibeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  vibeInput: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    padding: 0,
    marginTop: 4,
  },

  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  backBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
