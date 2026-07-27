/**
 * Dream Off hub — the home for the whole feature, opened from the single
 * "Dream Off" button on the profile. Everything that used to crowd the profile
 * header lives here now: Start a Dream Off, Join with a code, and Your Dream Offs
 * (your active games, "your turn" badged). One tidy screen.
 */

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/AppText';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useMyGames } from '@/hooks/useDreamOff';
import { PhaseCountdown } from '@/components/dreamOff';
import type { DreamOffPhase, MyGame } from '@/types/dreamOff';

const PHASE_LABEL: Record<DreamOffPhase, string> = {
  setup: 'Lobby',
  submission: 'Make your dream',
  voting: 'Voting',
  results: 'Results',
  no_contest: 'Results',
  cancelled: 'Cancelled',
};

function isYourTurn(g: MyGame): boolean {
  if (g.phase === 'submission') return !g.my_submitted;
  if (g.phase === 'voting') return !g.my_voted;
  return false;
}

export default function DreamOffHubScreen() {
  const insets = useSafeAreaInsets();
  const { data: games } = useMyGames();
  const active = (games ?? []).filter((g) => g.phase !== 'cancelled');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={fontScale(26)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dream Off</Text>
        <View style={{ width: fontScale(26) }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + verticalScale(28) }]}
      >
        <Text style={styles.tagline}>
          Same funny topic. Everyone makes a dream. You all vote. 🎭
        </Text>

        <GradientButton
          label="Start a Dream Off"
          icon="game-controller"
          onPress={() => router.push('/game/create')}
          style={styles.startBtn}
        />
        <TouchableOpacity
          onPress={() => router.push('/game/join')}
          activeOpacity={0.7}
          style={styles.joinBtn}
          hitSlop={8}
        >
          <Ionicons name="enter-outline" size={fontScale(17)} color={colors.accentLight} />
          <Text style={styles.joinText}>Join with a code</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>YOUR DREAM OFFS</Text>

        {active.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={styles.emptyText}>
              No games yet. Start one above, or join a friend&apos;s with their code.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {active.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function GameCard({ game }: { game: MyGame }) {
  const yourTurn = isYourTurn(game);
  const live = game.phase !== 'results' && game.phase !== 'no_contest';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/game/${game.id}`)}
      style={[styles.card, yourTurn && styles.cardTurn]}
    >
      <View style={styles.cardTop}>
        {yourTurn ? (
          <View style={styles.turnBadge}>
            <Text style={styles.turnBadgeText}>Your turn</Text>
          </View>
        ) : (
          <Text style={styles.phaseChip}>{PHASE_LABEL[game.phase]}</Text>
        )}
        {live && <PhaseCountdown expiresAt={game.phase_expires_at} />}
      </View>
      <Text numberOfLines={2} style={styles.cardTopic}>
        {game.topic}
      </Text>
      <View style={styles.cardMeta}>
        <Ionicons name="people-outline" size={fontScale(14)} color={colors.textSecondary} />
        <Text style={styles.cardMetaText}>
          {game.player_count} {game.player_count === 1 ? 'player' : 'players'}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={fontScale(16)}
          color={colors.textTertiary}
          style={styles.cardChevron}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(8),
  },
  headerTitle: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(18),
    color: colors.textPrimary,
  },
  body: { paddingHorizontal: horizontalScale(16), gap: verticalScale(12) },
  tagline: {
    color: colors.bodyOnDark,
    fontSize: fontScale(15),
    lineHeight: fontScale(21),
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  startBtn: { alignSelf: 'stretch', marginTop: verticalScale(6) },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(6),
    paddingVertical: verticalScale(6),
  },
  joinText: { color: colors.accentLight, fontSize: fontScale(15), fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: verticalScale(8) },
  sectionLabel: {
    color: colors.accentLight,
    fontSize: fontScale(11),
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  empty: { alignItems: 'center', gap: verticalScale(8), paddingVertical: verticalScale(28) },
  emptyEmoji: { fontSize: fontScale(40) },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    lineHeight: fontScale(20),
    paddingHorizontal: horizontalScale(24),
  },
  list: { gap: verticalScale(10) },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: horizontalScale(14),
    gap: verticalScale(8),
  },
  cardTurn: { borderColor: colors.accentBorder, backgroundColor: colors.accentBg },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phaseChip: {
    color: colors.textSecondary,
    fontSize: fontScale(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  turnBadge: {
    backgroundColor: colors.like,
    borderRadius: 999,
    paddingHorizontal: horizontalScale(9),
    paddingVertical: verticalScale(3),
  },
  turnBadgeText: { color: '#fff', fontSize: fontScale(10.5), fontWeight: '800' },
  cardTopic: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(16),
    color: colors.textPrimary,
    lineHeight: fontScale(21),
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) },
  cardMetaText: { color: colors.textSecondary, fontSize: fontScale(13), fontWeight: '600' },
  cardChevron: { marginLeft: 'auto' },
});
