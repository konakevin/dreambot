/**
 * A BLOCKED SWIPE MUST STILL SAY WHY.
 *
 * The Dream Cast screen refuses to be left while a cast photo is analyzing or any member is
 * unnamed. Getting that refusal right took three passes in two days, and each pass fixed the
 * previous one's hole:
 *
 *   1. `beforeRemove` + preventDefault — preventDefault only fires once the gesture has
 *      COMMITTED, so the screen visibly slid away and the alert landed over whatever was
 *      underneath ("i can swipe away from the cast screen, and after it's swiped, i then get
 *      the dialog").
 *   2. `gestureEnabled: false` on the SCREEN — the settings group is a root MODAL_SWIPEABLE
 *      card, so turning off the inner gesture handed the swipe to the PARENT, which dismissed
 *      the whole settings stack. The block made the exit BIGGER ("it is still letting me swipe
 *      away ... without naming an uploaded cast member photo").
 *   3. Both gestures off, on screen AND parent — which finally blocked it, and was SILENT. The
 *      swipe did nothing at all and never said why ("when the swipe doesn't trigger, we should
 *      show the ... dialog that shows if we tap the < button").
 *
 * So the invariant is not "disable the gesture", it is: WHATEVER blocks the exit must also
 * answer it. The stand-in pan is enabled on exactly the condition that disables the real one,
 * and it calls the same handleBack() the chevron calls, which is what puts the reason on screen.
 *
 * The unnamed-cast half of the block is GONE (Kevin, 2026-09-21: "we could eliminate the back
 * swipe and exit logic ... move it further left in the chain to when they first upload the
 * photo"). A name is now required at the moment an unnamed member's field is left empty, so the
 * exit has nothing left to ask and ANALYZING is the only thing that holds this screen — which is
 * why `blocked` is asserted to be exactly that, and no more.
 *
 * A source guard, because the wiring is a React screen the pure-logic lane cannot mount — the
 * same reason createEngineWiring.test.ts and soloFallbackSelfRef.test.ts read source.
 */
import fs from 'fs';
import path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'app', 'settings', 'dream-cast.tsx'),
  'utf8'
);

describe('Dream Cast screen: a blocked swipe is answered, not swallowed', () => {
  it('holds the screen for analyzing or an open name field — nothing wider', () => {
    // One flag, one condition. Two independently-computed conditions are how the stand-in and
    // the real gesture drift apart: disable on one set, explain on the other, and some swipes go
    // quiet again. And re-adding an exit-time naming block here would put the demand back at the
    // furthest point from the decision, which is what this screen just stopped doing.
    expect(SRC).toMatch(/const blocked = analyzing \|\| naming;/);
    // `naming` is a name mid-TYPING, not "the roster has an unnamed member" — the exit-time
    // scan is what moved upstream, and re-deriving it here would undo that.
    expect(SRC).not.toContain('unnamedPartners');
    expect(SRC).toContain('onEditingChange={setNaming}');
  });

  it('turns off the screen AND the parent gesture from that flag (pass 2)', () => {
    // The parent is the root MODAL_SWIPEABLE card. Miss it and the swipe dismisses all of
    // settings instead of popping this screen.
    expect(SRC).toMatch(/const enabled = !blocked;/);
    expect(SRC).toMatch(
      /navigation\.setOptions\(\{ gestureEnabled: enabled, fullScreenGestureEnabled: enabled \}\)/
    );
    expect(SRC).toMatch(
      /getParent\(\)\s*\?\.setOptions\(\{ gestureEnabled: enabled, fullScreenGestureEnabled: enabled \}\)/s
    );
  });

  it('restores the parent gesture on unmount', () => {
    // The rest of settings must keep its swipe; this screen only borrows the block.
    expect(SRC).toMatch(
      /return \(\) => \{\s*navigation\.getParent\(\)\?\.setOptions\(\{\s*gestureEnabled: true,\s*fullScreenGestureEnabled: true,?\s*\}\);/s
    );
  });

  it('mounts a stand-in pan enabled on exactly that flag (pass 3)', () => {
    expect(SRC).toContain('<GestureDetector gesture={blockedSwipe}>');
    expect(SRC).toMatch(/Gesture\.Pan\(\)\s*\.enabled\(blocked\)/s);
  });

  it('routes the stand-in through handleBack, not its own copy of the dialog', () => {
    // handleBack is what the chevron calls, and a programmatic back is what fires the roster's
    // beforeRemove listener. A second showAlert here would be a second copy of the copy AND a
    // second removal path that never dispatches the pending nav action.
    const pan = SRC.slice(SRC.indexOf('const blockedSwipe'));
    expect(pan).toMatch(/\.onStart\(\(e\) => \{[\s\S]*?handleBack\(\);\s*\}\)/);
    expect(SRC).not.toContain('showAlert');
  });

  it('does not move the screen — a blocked exit must not look like a granted one', () => {
    // useStandardSwipeBack translates the view and then dismisses. Borrowing it here would
    // slide the screen off and pop the alert over the gap, which is bug #1 again.
    expect(SRC).not.toContain('useStandardSwipeBack');
    expect(SRC).not.toContain('animatedStyle');
  });

  it('only answers a swipe that STARTED at the left edge', () => {
    // `blocked` includes a name being typed, so a focused TextInput is on screen whenever this
    // gesture is live. A full-screen pan beats that field's own caret drag, which would have
    // navigated the user off the screen mid-edit on a valid name.
    expect(SRC).toContain('const EDGE_SWIPE_WIDTH = 50;');
    expect(SRC).toMatch(/if \(e\.absoluteX - e\.translationX > EDGE_SWIPE_WIDTH\) return;/);
  });

  it('uses the shared thresholds, so it feels like every other swipe-back', () => {
    expect(SRC).toMatch(/\.activeOffsetX\(\[ACTIVE_OFFSET, Infinity\]\)/);
    expect(SRC).toMatch(/\.failOffsetY\(\[-FAIL_OFFSET, FAIL_OFFSET\]\)/);
    expect(SRC).toMatch(/from '@\/constants\/gestures'/);
  });

  it('keeps the handler on the JS thread (the release-build crash)', () => {
    // KeyboardSwipeDismiss documents this: the worklet form crashed FATALLY in release builds
    // with "Property 'WorkletsError' doesn't exist" (reanimated 4.1 / worklets 0.5).
    expect(SRC).toContain('.runOnJS(true)');
    expect(SRC).not.toContain("'worklet'");
  });
});
