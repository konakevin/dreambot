/**
 * Make your dream — the Dream Off entry compose. Shows the worded topic, lets the
 * player pick a model from the game's tier, then fires the render through
 * dream-off-submit (which charges the pot / self-pay, seeds the entry keyed by
 * the job_id, and enqueues). We hand back to the Room, whose submission view
 * shows the pending render; realtime/refetch swaps in the finished image.
 *
 * NOTE (render QA): the cast (face-swap) render body mirrors the create path
 * (worded "You as…" prompt + vibe_profile). The exact self-insert framing is
 * face-swap-sensitive (see CLAUDE.md hard rules) and wants a render pass before
 * launch; scene entries (no face) are the safe default.
 */

import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { IMAGE_MODELS, STANDARD_MODEL_IDS } from '@/constants/imageModels';
import { isVibeProfile } from '@/types/vibeProfile';
import { useGameRoom } from '@/hooks/useDreamOff';
import { submitDreamOffEntry } from '@/lib/dreamOffApi';
import { TopicBanner, wordTopic } from '@/components/dreamOff';

const STANDARD = STANDARD_MODEL_IDS.map((id) => IMAGE_MODELS.find((m) => m.id === id)).filter(
  (m): m is (typeof IMAGE_MODELS)[number] => !!m
);

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function EntryComposeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ?? '';
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { data: room } = useGameRoom(gameId);
  const [modelId, setModelId] = useState<string>(STANDARD[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isCast = room?.pack_category === 'cast';

  const dreamIt = async () => {
    if (!room || !user || busy) return;
    setBusy(true);
    setErr(null);
    try {
      // Cast entries need the player's Dream Cast to face-swap.
      let vibeProfile: unknown = null;
      if (isCast) {
        const { data } = await supabase
          .from('user_recipes')
          .select('recipe')
          .eq('user_id', user.id)
          .single();
        vibeProfile = isVibeProfile(data?.recipe) ? data.recipe : null;
        if (!vibeProfile) {
          setErr('Set up your Dream Cast in Settings first, then come back.');
          setBusy(false);
          return;
        }
      }

      const worded = wordTopic(room.topic, room.pack_category, room.cast_mode);
      const render: Record<string, unknown> = {
        mode: 'flux-dev',
        prompt: isCast ? worded : room.topic,
        ...(isCast && vibeProfile ? { vibe_profile: vibeProfile } : {}),
      };

      await submitDreamOffEntry({
        gameId,
        jobId: uuidv4(),
        forceModel: modelId || null,
        render,
      });
      router.replace(`/game/${gameId}`);
    } catch {
      setErr('Something went wrong starting your dream. Try again.');
      setBusy(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make your dream</Text>
        <View style={{ width: fontScale(26) }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + verticalScale(120) }]}
      >
        {room && (
          <TopicBanner
            topic={room.topic}
            packCategory={room.pack_category}
            castMode={room.cast_mode}
            eyebrow="Your topic"
          />
        )}

        {isCast && (
          <View style={styles.castNote}>
            <Ionicons name="person" size={fontScale(15)} color={colors.accentLight} />
            <Text style={styles.castNoteText}>
              {room?.cast_mode === 'couple'
                ? 'You and your +1 get cast into this.'
                : 'You get cast into this.'}
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Choose a model</Text>
        <View style={styles.modelGrid}>
          {STANDARD.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setModelId(m.id)}
              activeOpacity={0.85}
              style={[styles.modelChip, modelId === m.id && styles.modelChipSel]}
            >
              <Text style={[styles.modelChipText, modelId === m.id && styles.modelChipTextSel]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {err && <Text style={styles.err}>{err}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(12) }]}>
        <TouchableOpacity
          onPress={dreamIt}
          disabled={busy || !room}
          activeOpacity={0.9}
          style={[styles.cta, (busy || !room) && styles.ctaDim]}
        >
          {busy ? (
            <ActivityIndicator color="#08080F" />
          ) : (
            <Text style={styles.ctaLabel}>✨ Dream it</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(10),
  },
  headerTitle: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(18),
    color: colors.textPrimary,
  },
  body: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(8),
    gap: verticalScale(14),
  },
  castNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    backgroundColor: colors.accentBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    padding: horizontalScale(12),
  },
  castNoteText: { color: colors.bodyOnDark, fontSize: fontScale(13), flex: 1 },
  sectionLabel: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(15),
    color: colors.textPrimary,
    marginTop: verticalScale(4),
  },
  modelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: horizontalScale(8) },
  modelChip: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(9),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modelChipSel: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  modelChipText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '700' },
  modelChipTextSel: { color: colors.accentLight },
  err: { color: colors.error, fontSize: fontScale(13), marginTop: verticalScale(6) },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(12),
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cta: {
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
  },
  ctaDim: { opacity: 0.4 },
  ctaLabel: { fontFamily: displayFontFamily(700), fontSize: fontScale(16), color: '#08080F' },
});
