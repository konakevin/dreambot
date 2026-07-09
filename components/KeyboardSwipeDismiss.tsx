/**
 * KeyboardSwipeDismiss — makes the keyboard swipe-away-able ANYWHERE on a form.
 *
 * `keyboardDismissMode="interactive"` only engages when the drag lands on
 * scrollable content, so screens whose forms fit the viewport (Create, Edit
 * Profile) had no way to swipe the keyboard away — the drag hit a TextInput or
 * dead space and nothing happened (Kevin 2026-07-09).
 *
 * This wraps a screen in a downward-only pan that is ENABLED ONLY WHILE THE
 * KEYBOARD IS OPEN: a deliberate downward swipe (16px+) dismisses it. With the
 * keyboard closed the gesture is disabled and adds zero interference; upward
 * drags never activate it (activeOffsetY starts at +16), so scrolling a form
 * up to reach lower controls while typing still works.
 */

import { useEffect, useState, type ReactNode } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export function KeyboardSwipeDismiss({ children }: { children: ReactNode }) {
  const [kbOpen, setKbOpen] = useState(false);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s1 = Keyboard.addListener(showEvt, () => setKbOpen(true));
    const s2 = Keyboard.addListener(hideEvt, () => setKbOpen(false));
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  const pan = Gesture.Pan()
    .enabled(kbOpen)
    // Downward-only activation (same convention as CommentOverlay's sheet pan):
    // never fires on upward drags, so keyboard-open form scrolling is untouched.
    .activeOffsetY([16, 300])
    .failOffsetX([-24, 24])
    .onStart(() => {
      'worklet';
      runOnJS(Keyboard.dismiss)();
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}
