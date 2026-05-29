import { useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { OverlayPill } from '@/components/OverlayPill';
import type { BotUser } from '@/hooks/useBotUsers';

interface Props {
  bots: BotUser[];
  selectedBotId: string | null;
  onSelect: (botId: string | null) => void;
}

// Breathing room (px) when scrolling a pill in from an edge.
const MARGIN = 20;

export function BotPillRow({ bots, selectedBotId, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  // Per-pill geometry in content coords, keyed by botId (or '__all__').
  const pillGeom = useRef<Record<string, { x: number; width: number }>>({});
  // Live scroll/layout state so we can tell what's currently visible without
  // re-rendering (all refs).
  const scrollXRef = useRef(0);
  const viewportWRef = useRef(0);
  const contentWRef = useRef(0);

  const handleLayout = useCallback(
    (key: string) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      pillGeom.current[key] = { x, width };
    },
    []
  );

  // Reveal the active pill ONLY if it isn't already comfortably visible.
  // Off the right edge → scroll just enough to bring it in with margin; off the
  // left edge → same in reverse. The target is clamped to the content bounds,
  // so near the end of the list the tail simply pins to the right (the active
  // pill stays visible — we just can't drag it further left). This replaces the
  // old always-snap-to-hard-left behavior, for both pill taps AND pager swipes.
  const scrollToActive = useCallback((botId: string | null) => {
    const key = botId ?? '__all__';
    const pill = pillGeom.current[key];
    const vw = viewportWRef.current;
    if (!pill || vw <= 0) return;

    const scrollX = scrollXRef.current;
    const left = pill.x;
    const right = pill.x + pill.width;
    const maxOffset = Math.max(0, contentWRef.current - vw);

    let target: number | null = null;
    if (right > scrollX + vw - MARGIN) {
      // off / near the right edge → reveal at the right with margin
      target = right + MARGIN - vw;
    } else if (left < scrollX + MARGIN) {
      // off / near the left edge → reveal at the left with margin
      target = left - MARGIN;
    }
    if (target == null) return; // already comfortably visible — don't move

    const clamped = Math.max(0, Math.min(target, maxOffset));
    if (Math.abs(clamped - scrollX) < 1) return; // nothing meaningful to scroll
    scrollRef.current?.scrollTo({ x: clamped, animated: true });
  }, []);

  // External sync: selectedBotId changes for any reason — a pill tap OR a
  // horizontal swipe in the pager — so this single effect drives the reveal for
  // both cases.
  useEffect(() => {
    scrollToActive(selectedBotId);
  }, [selectedBotId, scrollToActive]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollXRef.current = e.nativeEvent.contentOffset.x;
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      style={s.scroll}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onLayout={(e) => {
        viewportWRef.current = e.nativeEvent.layout.width;
      }}
      onContentSizeChange={(w) => {
        contentWRef.current = w;
      }}
    >
      <View onLayout={handleLayout('__all__')}>
        <OverlayPill label="All" active={selectedBotId === null} onPress={() => onSelect(null)} />
      </View>
      {bots.map((bot) => (
        <View key={bot.id} onLayout={handleLayout(bot.id)}>
          <OverlayPill
            label={formatBotName(bot.username)}
            active={selectedBotId === bot.id}
            onPress={() => onSelect(bot.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function formatBotName(username: string): string {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

const s = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingTop: 6 },
});
