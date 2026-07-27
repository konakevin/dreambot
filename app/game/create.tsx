/**
 * Create a Dream Off. A short scrollable form (not a pager — fewer taps to the
 * fun): pick who's in the dream (a scene, or you / you + your +1), then a pack
 * from the DB-driven catalog (or Surprise, or a Custom topic). Creating mints the
 * game + invite code and drops you into the Room lobby to invite friends & start.
 *
 * Topic flow mirrors the SQL: create_game needs a topic up front, so pack/surprise
 * create with a placeholder then deal_topic overwrites it; custom passes through
 * (the DB trigger sanitizes + slur-blocks).
 */

import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, TextInput } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useCreateGame, useDreamOffPacks } from '@/hooks/useDreamOff';
import * as api from '@/lib/dreamOffApi';
import type { CastMode, DreamOffPack, PackCategory } from '@/types/dreamOff';

type TopicMode = 'pack' | 'surprise' | 'custom';
const TOPIC_MAX = 80;

export default function CreateGameScreen() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<PackCategory | null>(null);
  const [castMode, setCastMode] = useState<CastMode>('single');
  const [topicMode, setTopicMode] = useState<TopicMode>('pack');
  const [packKey, setPackKey] = useState<string | null>(null);
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);

  const createGame = useCreateGame();
  const { data: packs, isLoading: packsLoading } = useDreamOffPacks(category ?? undefined);

  const ready =
    !!category &&
    ((topicMode === 'pack' && !!packKey) ||
      topicMode === 'surprise' ||
      (topicMode === 'custom' && custom.trim().length >= 3));

  const submit = async () => {
    if (!category || !ready || busy) return;
    setBusy(true);
    try {
      const { gameId } = await createGame.mutateAsync({
        topic: topicMode === 'custom' ? custom.trim() : 'Getting your topic…',
        topicSource: topicMode,
        packCategory: category,
        castMode: category === 'cast' ? castMode : null,
      });
      if (topicMode === 'pack') await api.dealTopic(gameId, packKey ?? undefined);
      else if (topicMode === 'surprise') await api.dealTopic(gameId);
      router.replace(`/game/${gameId}`);
    } catch {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Dream Off</Text>
        <View style={{ width: fontScale(26) }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + verticalScale(120) }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── who's in the dream ── */}
        <Text style={styles.q}>Who&apos;s in the dream?</Text>
        <View style={styles.choiceRow}>
          <ChoiceCard
            icon="image-outline"
            title="A scene"
            sub="A funny subject — you're not in it"
            selected={category === 'scene'}
            onPress={() => setCategory('scene')}
          />
          <ChoiceCard
            icon="person-outline"
            title="You're in it"
            sub="Get cast into the topic"
            selected={category === 'cast'}
            onPress={() => setCategory('cast')}
          />
        </View>

        {category === 'cast' && (
          <View style={styles.subToggle}>
            <Pill
              label="Just you"
              active={castMode === 'single'}
              onPress={() => setCastMode('single')}
            />
            <Pill
              label="You + your +1"
              active={castMode === 'couple'}
              onPress={() => setCastMode('couple')}
            />
          </View>
        )}

        {/* ── pick a topic ── */}
        {category && (
          <>
            <Text style={[styles.q, styles.qSpaced]}>Pick a pack</Text>
            <View style={styles.topicModeRow}>
              <Pill
                label="Packs"
                active={topicMode === 'pack'}
                onPress={() => setTopicMode('pack')}
              />
              <Pill
                label="🎲 Surprise"
                active={topicMode === 'surprise'}
                onPress={() => setTopicMode('surprise')}
              />
              <Pill
                label="✏️ Custom"
                active={topicMode === 'custom'}
                onPress={() => setTopicMode('custom')}
              />
            </View>

            {topicMode === 'pack' &&
              (packsLoading ? (
                <ActivityIndicator color={colors.accent} style={{ marginTop: verticalScale(20) }} />
              ) : (
                <View style={styles.packGrid}>
                  {(packs ?? []).map((p) => (
                    <PackTile
                      key={p.key}
                      pack={p}
                      selected={packKey === p.key}
                      onPress={() => setPackKey(p.key)}
                    />
                  ))}
                </View>
              ))}

            {topicMode === 'surprise' && (
              <Text style={styles.surpriseNote}>
                We&apos;ll deal a random topic from every in-season pack. Chaos mode. 🎲
              </Text>
            )}

            {topicMode === 'custom' && (
              <View style={styles.customWrap}>
                <TextInput
                  value={custom}
                  onChangeText={(t) => setCustom(t.slice(0, TOPIC_MAX))}
                  placeholder={
                    category === 'cast' ? 'a battle-worn knight…' : 'the most cursed sandwich…'
                  }
                  placeholderTextColor={colors.textTertiary}
                  style={styles.customInput}
                  multiline
                />
                <Text style={styles.customCount}>
                  {custom.length}/{TOPIC_MAX}
                  {category === 'cast' ? ' · we add “You as…” automatically' : ''}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(12) }]}>
        <TouchableOpacity
          onPress={submit}
          disabled={!ready || busy}
          activeOpacity={0.9}
          style={[styles.cta, (!ready || busy) && styles.ctaDim]}
        >
          {busy ? (
            <ActivityIndicator color="#08080F" />
          ) : (
            <Text style={styles.ctaLabel}>🎭 Create dream off</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── pieces ────────────────────────────────────────────────────────────────────
function ChoiceCard({
  icon,
  title,
  sub,
  selected,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.choiceCard, selected && styles.choiceCardSel]}
    >
      <Ionicons
        name={icon}
        size={fontScale(24)}
        color={selected ? colors.accentLight : colors.textSecondary}
      />
      <Text style={[styles.choiceTitle, selected && styles.choiceTitleSel]}>{title}</Text>
      <Text style={styles.choiceSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function PackTile({
  pack,
  selected,
  onPress,
}: {
  pack: DreamOffPack;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.packTile, selected && { borderColor: pack.accent ?? colors.accent }]}
    >
      <Text style={styles.packEmoji}>{pack.emoji ?? '🎴'}</Text>
      <Text style={styles.packName} numberOfLines={1}>
        {pack.display_name}
      </Text>
      {pack.tagline ? (
        <Text style={styles.packTagline} numberOfLines={2}>
          {pack.tagline}
        </Text>
      ) : null}
    </TouchableOpacity>
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
  body: { paddingHorizontal: horizontalScale(16), gap: verticalScale(12) },
  q: { fontFamily: displayFontFamily(700), fontSize: fontScale(18), color: colors.textPrimary },
  qSpaced: { marginTop: verticalScale(14) },
  choiceRow: { flexDirection: 'row', gap: horizontalScale(10) },
  choiceCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: horizontalScale(14),
    gap: verticalScale(6),
  },
  choiceCardSel: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  choiceTitle: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(15),
    color: colors.textPrimary,
  },
  choiceTitleSel: { color: colors.accentLight },
  choiceSub: { color: colors.textSecondary, fontSize: fontScale(12), lineHeight: fontScale(16) },
  subToggle: { flexDirection: 'row', gap: horizontalScale(8), marginTop: verticalScale(2) },
  topicModeRow: { flexDirection: 'row', gap: horizontalScale(8), flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: { borderColor: colors.accentBorder, backgroundColor: colors.accentBg },
  pillText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '700' },
  pillTextActive: { color: colors.accentLight },
  packGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(10),
    marginTop: verticalScale(4),
  },
  packTile: {
    width: '47%',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: horizontalScale(12),
    gap: verticalScale(4),
  },
  packEmoji: { fontSize: fontScale(24) },
  packName: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(14),
    color: colors.textPrimary,
  },
  packTagline: {
    color: colors.textSecondary,
    fontSize: fontScale(11.5),
    lineHeight: fontScale(15),
  },
  surpriseNote: {
    color: colors.bodyOnDark,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    marginTop: verticalScale(6),
  },
  customWrap: { marginTop: verticalScale(6), gap: verticalScale(6) },
  customInput: {
    minHeight: verticalScale(64),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: horizontalScale(14),
    color: colors.textPrimary,
    fontSize: fontScale(15),
    textAlignVertical: 'top',
  },
  customCount: { color: colors.textSecondary, fontSize: fontScale(11.5), textAlign: 'right' },
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
    borderRadius: 999,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
  },
  ctaDim: { opacity: 0.4 },
  ctaLabel: { fontFamily: displayFontFamily(700), fontSize: fontScale(16), color: '#08080F' },
});
