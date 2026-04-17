import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      {/* Index has no inner back — root stack handles swipe to profile */}
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
