import { useRef, useCallback, useEffect } from 'react';
import { ScrollView, View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { OverlayPill } from '@/components/OverlayPill';
import type { BotUser } from '@/hooks/useBotUsers';

interface Props {
  bots: BotUser[];
  selectedBotId: string | null;
  onSelect: (botId: string | null) => void;
}

export function BotPillRow({ bots, selectedBotId, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const pillPositions = useRef<Record<string, number>>({});

  const handleLayout = useCallback(
    (key: string) => (e: LayoutChangeEvent) => {
      pillPositions.current[key] = e.nativeEvent.layout.x;
    },
    []
  );

  // Scroll the active pill into view. Used by both the tap path and the
  // external-driven path (when the BotsHorizontalPager swipes to a new bot,
  // selectedBotId changes from outside and this effect fires the scroll).
  const scrollToActive = useCallback((botId: string | null) => {
    const key = botId ?? '__all__';
    const x = pillPositions.current[key];
    if (x != null) {
      scrollRef.current?.scrollTo({ x: Math.max(0, x - 16), animated: true });
    }
  }, []);

  // External sync: when selectedBotId changes for any reason (including
  // horizontal swipe in the pager), scroll the matching pill into view so
  // the user can actually see the highlight update — not just the data.
  useEffect(() => {
    scrollToActive(selectedBotId);
  }, [selectedBotId, scrollToActive]);

  const handleSelect = useCallback(
    (botId: string | null) => {
      onSelect(botId);
      scrollToActive(botId);
    },
    [onSelect, scrollToActive]
  );

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      style={s.scroll}
    >
      <View onLayout={handleLayout('__all__')}>
        <OverlayPill
          label="All"
          active={selectedBotId === null}
          onPress={() => handleSelect(null)}
        />
      </View>
      {bots.map((bot) => (
        <View key={bot.id} onLayout={handleLayout(bot.id)}>
          <OverlayPill
            label={formatBotName(bot.username)}
            active={selectedBotId === bot.id}
            onPress={() => handleSelect(bot.id)}
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
