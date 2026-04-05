/**
 * QuickSettingsSheet — bottom sheet for tweaking DreamBot settings
 * without leaving the Dream tab. Auto-saves on dismiss.
 *
 * Shows: mood sliders, aesthetics pills, art style pills.
 * Changes save to user_recipes on close.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { isVibeProfile } from '@/lib/migrateRecipe';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { AESTHETIC_TILES, ART_STYLE_TILES } from '@/constants/onboarding';
import type { VibeProfile, MoodAxes, Aesthetic, ArtStyle } from '@/types/vibeProfile';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;
const SLIDER_WIDTH = 260;
const THUMB_SIZE = 24;

interface Props {
  visible: boolean;
  onClose: () => void;
}

// ── Compact bipolar slider ──────────────────────────────────────────

function MiniSlider({
  label,
  left,
  right,
  value,
  onChange,
}: {
  label: string;
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<View>(null);
  const trackLeft = useRef(0);

  function handleGrant(pageX: number) {
    const node = findNodeHandle(trackRef.current);
    if (node) {
      UIManager.measureInWindow(node, (x: number) => {
        trackLeft.current = x;
        onChange(Math.max(0, Math.min(1, (pageX - x) / SLIDER_WIDTH)));
      });
    }
  }

  function handleMove(pageX: number) {
    onChange(Math.max(0, Math.min(1, (pageX - trackLeft.current) / SLIDER_WIDTH)));
  }

  return (
    <View style={s.sliderBlock}>
      <Text style={s.sliderLabel}>{label}</Text>
      <View style={s.poleRow}>
        <Text style={s.poleText}>{left}</Text>
        <Text style={s.poleText}>{right}</Text>
      </View>
      <View
        style={s.hitArea}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handleGrant(e.nativeEvent.pageX)}
        onResponderMove={(e) => handleMove(e.nativeEvent.pageX)}
        onResponderRelease={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View ref={trackRef} style={s.track}>
          <View style={[s.fill, { width: value * SLIDER_WIDTH }]} />
          <View
            style={[s.thumb, { transform: [{ translateX: value * (SLIDER_WIDTH - THUMB_SIZE) }] }]}
          />
        </View>
      </View>
    </View>
  );
}

// ── Pill row ────────────────────────────────────────────────────────

function PillRow<T extends string>({
  tiles,
  selected,
  onToggle,
}: {
  tiles: { key: T; label: string }[];
  selected: T[];
  onToggle: (key: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.pillScroll}
    >
      {tiles.map((tile) => {
        const active = selected.includes(tile.key);
        return (
          <TouchableOpacity
            key={tile.key}
            style={[s.pill, active && s.pillActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggle(tile.key);
            }}
            activeOpacity={0.7}
          >
            <Text style={[s.pillText, active && s.pillTextActive]}>{tile.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ── Main sheet ──────────────────────────────────────────────────────

const SLIDERS: { axis: keyof MoodAxes; label: string; left: string; right: string }[] = [
  { axis: 'peaceful_chaotic', label: 'Energy', left: 'Peaceful', right: 'Chaotic' },
  { axis: 'cute_terrifying', label: 'Tone', left: 'Cute', right: 'Terrifying' },
  { axis: 'minimal_maximal', label: 'Detail', left: 'Minimal', right: 'Maximal' },
  { axis: 'realistic_surreal', label: 'Reality', left: 'Realistic', right: 'Surreal' },
];

export function QuickSettingsSheet({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<VibeProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);

  // Load profile when sheet opens
  useEffect(() => {
    if (!visible || !user || loaded) return;
    (async () => {
      const { data } = await supabase
        .from('user_recipes')
        .select('recipe')
        .eq('user_id', user.id)
        .single();
      const raw = data?.recipe as unknown;
      if (isVibeProfile(raw)) {
        setProfile(raw);
      }
      setLoaded(true);
    })();
  }, [visible, user, loaded]);

  // Animate in
  useEffect(() => {
    if (visible) {
      closing.current = false;
      setLoaded(false);
      progress.value = withTiming(1, { duration: 300 });
    }
  }, [visible]);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    // Auto-save on dismiss
    if (profile && user) {
      supabase
        .from('user_recipes')
        .upsert(
          {
            user_id: user.id,
            recipe: JSON.parse(JSON.stringify(profile)),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .then(({ error }) => {
          if (!error) {
            Toast.show('Settings saved', 'checkmark-circle');
          }
        });
    }

    progress.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, profile, user]);

  // Mutations
  function setMood(axis: keyof MoodAxes, value: number) {
    setProfile((p) => (p ? { ...p, moods: { ...p.moods, [axis]: value } } : p));
  }

  function toggleAesthetic(key: Aesthetic) {
    setProfile((p) => {
      if (!p) return p;
      const has = p.aesthetics.includes(key);
      return {
        ...p,
        aesthetics: has ? p.aesthetics.filter((a) => a !== key) : [...p.aesthetics, key],
      };
    });
  }

  function toggleArtStyle(key: ArtStyle) {
    setProfile((p) => {
      if (!p) return p;
      const has = p.art_styles.includes(key);
      return {
        ...p,
        art_styles: has ? p.art_styles.filter((a) => a !== key) : [...p.art_styles, key],
      };
    });
  }

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .activeOffsetY([10, 300])
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationY > 0) dragY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, { duration: 200 });
      }
    });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.6]),
    transform: [{ translateY: dragY.value }],
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [SHEET_HEIGHT, 0]) + dragY.value,
      },
    ],
  }));

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[s.overlay, overlayStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[s.sheet, { height: SHEET_HEIGHT }, sheetStyle]}>
          <View style={s.handleRow}>
            <View style={s.handle} />
          </View>

          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Your DreamBot</Text>
            <TouchableOpacity onPress={dismiss} hitSlop={12}>
              <Ionicons name="checkmark" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
          <Text style={s.sheetHint}>Tweak these settings to change how your dreams look</Text>

          <ScrollView
            style={s.scrollArea}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            {profile ? (
              <>
                {/* Mood sliders */}
                <Text style={s.sectionTitle}>Mood</Text>
                <View style={s.slidersWrap}>
                  {SLIDERS.map((sl) => (
                    <MiniSlider
                      key={sl.axis}
                      label={sl.label}
                      left={sl.left}
                      right={sl.right}
                      value={profile.moods[sl.axis]}
                      onChange={(v) => setMood(sl.axis, v)}
                    />
                  ))}
                </View>

                {/* Aesthetics */}
                <Text style={s.sectionTitle}>Aesthetics</Text>
                <PillRow
                  tiles={AESTHETIC_TILES}
                  selected={profile.aesthetics}
                  onToggle={toggleAesthetic}
                />

                {/* Art styles */}
                <Text style={s.sectionTitle}>Art Styles</Text>
                <PillRow
                  tiles={ART_STYLE_TILES}
                  selected={profile.art_styles}
                  onToggle={toggleArtStyle}
                />
              </>
            ) : (
              <Text style={s.loadingText}>Loading your settings...</Text>
            )}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleRow: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sheetTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  sheetHint: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollArea: { flex: 1 },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  slidersWrap: { alignItems: 'center', gap: 20 },
  sliderBlock: { width: SLIDER_WIDTH, gap: 4 },
  sliderLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  poleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  poleText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  hitArea: { paddingVertical: 8 },
  track: {
    width: SLIDER_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
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
  pillScroll: { paddingHorizontal: 20, gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: 'transparent',
    borderColor: colors.accent,
  },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.accent },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
