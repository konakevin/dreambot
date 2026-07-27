/**
 * DreamOffProfileEntry — Dream Off's home on your profile (Kevin, 2026-07-26:
 * not the Create tab). Renders in the own-profile header, above the album tabs:
 * a one-tap "Start a Dream Off" button + a horizontal shelf of your active games
 * ("your turn" badged). Gated on useDreamOffEnabled — renders NOTHING when the
 * feature is dark, so the header keeps its normal size pre-launch.
 */

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { displayFontFamily } from '@/constants/fonts';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useMyGames } from '@/hooks/useDreamOff';
import { useDreamOffEnabled } from '@/hooks/useDreamOffEnabled';
import { PhaseCountdown } from './PhaseCountdown';
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

export function DreamOffProfileEntry() {
  const enabled = useDreamOffEnabled();
  const { data: games } = useMyGames();
  if (!enabled) return null;

  const active = (games ?? []).filter((g) => g.phase !== 'cancelled');

  return (
    <View style={styles.wrap}>
      <GradientButton
        label="Start a Dream Off"
        icon="game-controller"
        onPress={() => router.push('/game/create')}
        style={styles.cta}
      />

      {active.length > 0 && (
        <>
          <Text style={styles.shelfLabel}>YOUR DREAM OFFS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shelf}
          >
            {active.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function GameCard({ game }: { game: MyGame }) {
  const yourTurn = isYourTurn(game);
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
        {game.phase !== 'results' && game.phase !== 'no_contest' && (
          <PhaseCountdown expiresAt={game.phase_expires_at} />
        )}
      </View>
      <Text numberOfLines={2} style={styles.cardTopic}>
        {game.topic}
      </Text>
      <View style={styles.cardMeta}>
        <Ionicons name="people-outline" size={fontScale(13)} color={colors.textSecondary} />
        <Text style={styles.cardMetaText}>{game.player_count}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(8),
    gap: verticalScale(12),
  },
  cta: { alignSelf: 'stretch' },
  shelfLabel: {
    color: colors.accentLight,
    fontSize: fontScale(10),
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  shelf: { gap: horizontalScale(10), paddingRight: horizontalScale(16) },
  card: {
    width: horizontalScale(160),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: horizontalScale(12),
    gap: verticalScale(7),
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
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(3),
  },
  turnBadgeText: { color: '#fff', fontSize: fontScale(10), fontWeight: '800' },
  cardTopic: {
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(13),
    color: colors.textPrimary,
    lineHeight: fontScale(17),
    minHeight: fontScale(34),
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(4) },
  cardMetaText: { color: colors.textSecondary, fontSize: fontScale(12), fontWeight: '700' },
});
