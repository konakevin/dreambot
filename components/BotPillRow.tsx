import { useRef, useCallback } from 'react';
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

  const handleSelect = useCallback(
    (botId: string | null) => {
      onSelect(botId);
      const key = botId ?? '__all__';
      const x = pillPositions.current[key];
      if (x != null) {
        scrollRef.current?.scrollTo({ x: Math.max(0, x - 16), animated: true });
      }
    },
    [onSelect]
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
