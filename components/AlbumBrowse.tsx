/**
 * Album browsing controls (ALBUM_DISCOVERY_PLAN.md; concept renders "DreamBot Browsing
 * Concepts"): the Newest/Oldest toggle, the Grid/Months toggle, the full-width rows the
 * grid draws between posts (the "You're caught up" line), and the bot profile's
 * All · Haven't seen · 🎲 pill.
 *
 * The segmented pill matches the profile's Dreams album filter (All · Public · Private).
 */
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { monthLabel, type AlbumMonth, type AlbumSort } from '@/lib/albumNav';

/** Every control in the album row is exactly this tall, so the row never shifts between
 *  tabs (Kevin 2026-09-26: Newest / Months must sit in the same spot everywhere). */
export const ALBUM_CONTROL_H = verticalScale(32);
const SEGMENT_INSET = horizontalScale(3);

const ACTIVE_BG = 'rgba(167,139,250,0.18)';
const ACTIVE_BORDER = 'rgba(167,139,250,0.55)';
const ACTIVE_TEXT = '#A78BFA';

/** ↓ Newest / ↑ Oldest — one tap flips it. */
export function SortToggle({
  sort,
  onChange,
}: {
  sort: AlbumSort;
  onChange: (s: AlbumSort) => void;
}) {
  const newest = sort === 'newest';
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={() => {
        Haptics.selectionAsync();
        onChange(newest ? 'oldest' : 'newest');
      }}
      activeOpacity={0.8}
      accessibilityLabel={
        newest
          ? 'Sorted newest first. Tap for oldest first'
          : 'Sorted oldest first. Tap for newest first'
      }
    >
      <Ionicons
        name={newest ? 'arrow-down' : 'arrow-up'}
        size={horizontalScale(13)}
        color={colors.accentLight}
      />
      <Text style={styles.chipText}>{newest ? 'Newest' : 'Oldest'}</Text>
    </TouchableOpacity>
  );
}

/** Grid ↔ Months, as a square icon button (calendar / grid) so the row fits beside any
 *  filter pill at phone width. The months view is also reachable by pinching the grid. */
export function MonthsToggle({
  view,
  onChange,
}: {
  view: 'grid' | 'months';
  onChange: (v: 'grid' | 'months') => void;
}) {
  const months = view === 'months';
  return (
    <TouchableOpacity
      style={[styles.chip, styles.iconChip, months && styles.chipOn]}
      onPress={() => {
        Haptics.selectionAsync();
        onChange(months ? 'grid' : 'months');
      }}
      activeOpacity={0.8}
      accessibilityLabel={months ? 'Back to the grid' : 'Show months'}
    >
      <Ionicons
        name={months ? 'grid-outline' : 'calendar-outline'}
        size={horizontalScale(16)}
        color={months ? ACTIVE_TEXT : colors.accentLight}
      />
    </TouchableOpacity>
  );
}

/**
 * Inside a month album: one breadcrumb pill, "‹ August 2026 · 77 posts", styled exactly
 * like the Newest/Oldest chip beside it (same height, size, border). Tapping it goes back
 * to the month tiles.
 */
export function MonthAlbumBar({
  month,
  count,
  noun,
  onBack,
}: {
  month: string;
  count: number | null;
  noun: string;
  onBack: () => void;
}) {
  const label = monthLabel(month);
  return (
    <TouchableOpacity
      style={[styles.chip, styles.crumb]}
      onPress={() => {
        Haptics.selectionAsync();
        onBack();
      }}
      activeOpacity={0.8}
      accessibilityLabel={`Back to months. ${label}${count !== null ? `, ${count} ${noun}` : ''}`}
    >
      <Ionicons name="chevron-back" size={horizontalScale(13)} color={colors.accentLight} />
      <Text style={styles.crumbMonth} numberOfLines={1}>
        {label}
      </Text>
      {count !== null ? (
        <Text style={styles.crumbCount} numberOfLines={1}>
          · {count.toLocaleString('en-US')} {noun}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

/** The line under the posts that are new since your last visit. */
export function CaughtUpRow() {
  return (
    <View style={styles.caughtRow}>
      <View style={styles.caughtLine} />
      <Text style={styles.caughtText}>You’re caught up</Text>
      <View style={styles.caughtLine} />
    </View>
  );
}

/** One month in the months view: its newest image, the month, the year and the count. */
export function MonthTile({
  month,
  noun,
  size,
  onPress,
}: {
  month: AlbumMonth;
  noun: string;
  size: number;
  onPress: () => void;
}) {
  const [name, year] = monthLabel(month.month).split(' ');
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.monthTile, { width: size, height: size * 1.1 }]}
      accessibilityLabel={`${name} ${year}, ${month.count} ${noun}`}
    >
      {month.cover ? (
        <Image source={{ uri: month.cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : null}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        start={{ x: 0, y: 0.45 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.monthTileText}>
        <Text style={styles.monthTileName}>{name}</Text>
        <Text style={styles.monthTileSub}>
          {year} · {month.count.toLocaleString('en-US')} {noun}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

type IoniconName = keyof typeof Ionicons.glyphMap;

/** A compact segmented filter (the Dreams album's All · Public · Private, Saved's
 *  Bookmarked · Hearted), the same size and look as the bot pill, so it sits in the album
 *  row at the same height as the chips. An option with an `icon` shows the icon (filled
 *  `activeIcon` when on) and uses its label for accessibility. */
export function SegmentedPill<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { key: T; label: string; icon?: IoniconName; activeIcon?: IoniconName }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            style={[styles.segment, o.icon && styles.iconSegment, on && styles.segmentOn]}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(o.key);
            }}
            activeOpacity={0.8}
            accessibilityLabel={o.label}
          >
            {o.icon ? (
              <Ionicons
                name={on ? (o.activeIcon ?? o.icon) : o.icon}
                size={horizontalScale(16)}
                color={on ? ACTIVE_TEXT : colors.textSecondary}
              />
            ) : (
              <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{o.label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type BotBrowseMode = 'all' | 'unseen' | 'shuffle';

/** All · Haven't seen · 🎲. Tapping the dice again draws a new set. */
export function BotBrowsePill({
  mode,
  onMode,
  onShuffle,
}: {
  mode: BotBrowseMode;
  onMode: (m: BotBrowseMode) => void;
  /** Called on every dice tap (first tap switches to shuffle, later taps redraw). */
  onShuffle: () => void;
}) {
  const spin = useSharedValue(0);
  const diceStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const seg = (m: 'all' | 'unseen', label: string) => {
    const on = mode === m;
    return (
      <TouchableOpacity
        key={m}
        style={[styles.segment, on && styles.segmentOn]}
        onPress={() => {
          Haptics.selectionAsync();
          onMode(m);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{label}</Text>
      </TouchableOpacity>
    );
  };
  const shuffling = mode === 'shuffle';
  return (
    <View style={styles.segmented}>
      {seg('all', 'All')}
      {seg('unseen', 'Haven’t seen')}
      <TouchableOpacity
        style={[styles.segment, shuffling && styles.segmentOn]}
        onPress={() => {
          Haptics.selectionAsync();
          spin.value = withTiming(spin.value + 360, {
            duration: 450,
            easing: Easing.out(Easing.cubic),
          });
          onShuffle();
        }}
        activeOpacity={0.8}
        accessibilityLabel={shuffling ? 'Shuffle again' : 'Shuffle'}
      >
        <Animated.View style={diceStyle}>
          <MaterialCommunityIcons
            name="dice-multiple"
            size={horizontalScale(16)}
            color={shuffling ? ACTIVE_TEXT : colors.accentLight}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: ALBUM_CONTROL_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
    paddingHorizontal: horizontalScale(10),
    borderRadius: horizontalScale(10),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: ACTIVE_BG, borderColor: ACTIVE_BORDER },
  iconChip: { width: ALBUM_CONTROL_H, paddingHorizontal: 0, justifyContent: 'center' },
  chipText: { color: colors.accentLight, fontSize: fontScale(12), fontWeight: '600' },
  chipTextOn: { color: ACTIVE_TEXT },
  crumb: { flexShrink: 1 },
  crumbMonth: { color: colors.textPrimary, fontSize: fontScale(12), fontWeight: '600' },
  crumbCount: { color: colors.textSecondary, fontSize: fontScale(12), fontWeight: '600' },
  caughtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
  },
  caughtLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(196,181,253,0.35)',
  },
  caughtText: { color: colors.accentLight, fontSize: fontScale(12), fontWeight: '600' },
  monthTile: {
    borderRadius: horizontalScale(12),
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthTileText: {
    position: 'absolute',
    left: horizontalScale(10),
    right: horizontalScale(10),
    bottom: verticalScale(8),
  },
  monthTileName: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  monthTileSub: { color: colors.subtleOnDark, fontSize: fontScale(11) },
  segmented: {
    height: ALBUM_CONTROL_H,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: horizontalScale(10),
    paddingHorizontal: SEGMENT_INSET,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    // Inner height: the pill's height minus its border (1+1) and inset (top+bottom).
    height: ALBUM_CONTROL_H - 2 - SEGMENT_INSET * 2,
    paddingHorizontal: horizontalScale(10),
    borderRadius: horizontalScale(7),
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSegment: { paddingHorizontal: horizontalScale(14) },
  segmentOn: { backgroundColor: ACTIVE_BG, borderColor: ACTIVE_BORDER },
  segmentText: { color: colors.textSecondary, fontSize: fontScale(12), fontWeight: '600' },
  segmentTextOn: { color: ACTIVE_TEXT },
});
