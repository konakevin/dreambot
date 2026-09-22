import { useEffect, useState } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DreamCastRoster } from '@/components/DreamCastRoster';
import { GradientTitle } from '@/components/GradientTitle';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { useOnboardingStore } from '@/store/onboarding';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { ACTIVE_OFFSET, FAIL_OFFSET } from '@/constants/gestures';

/** How far in from the left edge a back swipe may START. Matches react-navigation's own
 *  gestureResponseDistance default, so the stand-in answers the same swipes the real gesture
 *  would have from the edge. */
const EDGE_SWIPE_WIDTH = 50;

export default function DreamCastStepSettings() {
  const navigation = useNavigation();
  // A cast photo runs through describe-photo AFTER the upload. Leaving mid-
  // analysis fires useAutoSaveProfile's unmount-save with the half-baked record
  // (storage_path set, description/gender/age empty) → that broken record gets
  // persisted to the recipe and silently degrades the next face-swap render (and
  // describe-photo finishing in the background fixes only the in-memory store,
  // not the DB). So block leaving while any cast upload is analyzing — it's a
  // few seconds. (The onboarding pager already locks swiping for the same reason.)
  const castUploadsInFlight = useOnboardingStore((s) => s.castUploadsInFlight);
  const analyzing = castUploadsInFlight > 0;
  // TWO REASONS THIS SCREEN HOLDS YOU, AND NEITHER IS "the roster has an unnamed member".
  // That one used to block the exit, which demanded the name at the latest possible moment and
  // the furthest from the decision; the roster now asks the instant an unnamed member's field
  // is left empty (Kevin, 2026-09-21: "we could eliminate the back swipe and exit logic to show
  // the 'please name your cast' dialog ... move it further left in the chain").
  //
  // What remains is narrower: a photo mid-analysis, and a name mid-TYPING. Navigating away is
  // one of the ways to tap away from an open field, and the roster's beforeRemove listener is
  // what asks — but only once the navigation is attempted, so the swipe has to be off for the
  // question to land on a screen that is still here rather than one sliding away.
  const [naming, setNaming] = useState(false);
  const blocked = analyzing || naming;

  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
  }, []);
  useAutoSaveProfile();

  // Disable the iOS swipe-back gesture while analyzing (beforeRemove can't reliably cancel a
  // native swipe mid-gesture). ONE owner for gestureEnabled on this screen — a second
  // setOptions elsewhere would race this one.
  //
  // BOTH gestures, exactly as settings/locations.tsx does for its own required-selection
  // guard: the settings group is a root MODAL_SWIPEABLE card, so turning off only the INNER
  // gesture hands the swipe to the PARENT, which dismisses the whole settings stack instead
  // of popping one screen. That is not a block, it is a bigger exit (Kevin, 2026-09-21: "it
  // is still letting me swipe away from the cast screen without naming an uploaded cast
  // member photo"). Restore the parent's swipe on leave so the rest of settings keeps it.
  useEffect(() => {
    const enabled = !blocked;
    navigation.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    navigation
      .getParent()
      ?.setOptions({ gestureEnabled: enabled, fullScreenGestureEnabled: enabled });
    return () => {
      navigation.getParent()?.setOptions({ gestureEnabled: true, fullScreenGestureEnabled: true });
    };
  }, [navigation, blocked]);

  // Backstop for the header chevron / Android hardware back / any programmatic
  // removal — block + nudge while analyzing. Reads the store fresh so the
  // listener isn't stale.
  useEffect(() => {
    const sub = navigation.addListener('beforeRemove', (e) => {
      if (useOnboardingStore.getState().castUploadsInFlight === 0) return;
      e.preventDefault();
      Toast.show('Hang tight — still analyzing your photo', 'hourglass-outline');
    });
    return sub;
  }, [navigation]);

  const handleBack = () => {
    if (analyzing) {
      Toast.show('Hang tight — still analyzing your photo', 'hourglass-outline');
      return;
    }
    router.back();
  };

  // A DISABLED GESTURE IS SILENT. Turning the swipe off stops the exit, but the screen then
  // just sits there under a dragging finger with no explanation — the guard is invisible
  // (Kevin, 2026-09-21: "when the swipe doesn't trigger, we should show the ... dialog that
  // shows if we tap the < button"). So while the native gesture is off, this stands in for it:
  // it MOVES NOTHING, and on a clear rightward drag it runs the same handleBack() the chevron
  // runs, which is what puts the "still analyzing your photo" toast on screen.
  //
  // .runOnJS(true) with a plain (non-worklet) handler, exactly as KeyboardSwipeDismiss
  // does and for the reason documented there: the worklet form crashed FATALLY in release
  // builds ("Property 'WorkletsError' doesn't exist"). This handler is JS-thread work only.
  const blockedSwipe = Gesture.Pan()
    .enabled(blocked)
    .activeOffsetX([ACTIVE_OFFSET, Infinity])
    .failOffsetY([-FAIL_OFFSET, FAIL_OFFSET])
    .runOnJS(true)
    .onStart((e) => {
      // FROM THE LEFT EDGE ONLY, even though the gesture it stands in for is full-screen.
      // `blocked` now includes a name being typed, which means a focused TextInput is on
      // screen whenever this is live — and a full-screen pan beats the field's own caret drag,
      // so dragging the cursor inside a name would have run handleBack and, if the name was
      // valid, navigated the user off the screen mid-edit. The field starts far right of this
      // band, so an edge origin cannot be anything but a back swipe. Cost: a mid-screen swipe
      // while blocked stays silent, which is the rarer half of a gesture iOS trains from the
      // edge.
      if (e.absoluteX - e.translationX > EDGE_SWIPE_WIDTH) return;
      handleBack();
    });

  return (
    <GestureDetector gesture={blockedSwipe}>
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={handleBack} hitSlop={12} style={s.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <GradientTitle>Dream Cast</GradientTitle>
          <View style={s.headerIcon} />
        </View>
        <DreamCastRoster onEditingChange={setNaming} />
      </SafeAreaView>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: verticalScale(8),
  },
  headerIcon: { minWidth: 56, alignItems: 'center' },
});
