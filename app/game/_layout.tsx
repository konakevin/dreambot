/**
 * Dream Off navigation stack. Dark, headerless (each screen draws its own header
 * so the Room can float a countdown + owner tools). Presented over the tabs.
 */

import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function DreamOffLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="create" options={{ presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/entry" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
