/**
 * EditDescriptionModal — the owner "Edit description" sheet.
 *
 * Imperative API like UpscaleModal / Toast: mount <EditDescriptionModalHost/>
 * ONCE in _layout, then call EditDescriptionModal.show(postId, currentText)
 * from any long-press action row. A root-level overlay (not an RN Modal) so it
 * layers cleanly after the PostActionSheet closes — the same pattern the "Save
 * in HD" → UpscaleModal flow already uses. The actual write + optimistic cache
 * patch live in useUpdateDescription (silent: no reposition, no re-notify).
 */
import { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useUpdateDescription, MAX_DESCRIPTION_LENGTH } from '@/hooks/useUpdateDescription';
import { MentionSuggestions } from '@/components/MentionSuggestions';
import { useMentionCandidates } from '@/hooks/useMentionCandidates';
import { detectMention, applyMention, type Selection } from '@/lib/mentionAutocomplete';

type State = { visible: boolean; postId: string | null; initial: string | null };
type Listener = (s: State) => void;

let listener: Listener | null = null;

export const EditDescriptionModal = {
  /** Open the editor for a post, prefilled with its current caption. */
  show(postId: string, currentDescription: string | null) {
    listener?.({ visible: true, postId, initial: currentDescription });
  },
  hide() {
    listener?.({ visible: false, postId: null, initial: null });
  },
};

export function EditDescriptionModalHost() {
  const [state, setState] = useState<State>({ visible: false, postId: null, initial: null });
  const [text, setText] = useState('');
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const [forcedSelection, setForcedSelection] = useState<Selection | null>(null);
  const inputRef = useRef<TextInput>(null);
  const { mutate } = useUpdateDescription();
  const opacity = useSharedValue(0);

  const mention = detectMention(text, selection);
  const mentionCandidates = useMentionCandidates(mention.query, mention.active);
  const pickMention = (username: string) => {
    const { text: next, cursor } = applyMention(text, selection, username);
    setText(next);
    const sel = { start: cursor, end: cursor };
    setSelection(sel);
    setForcedSelection(sel);
  };

  useEffect(() => {
    listener = (next) => {
      setState(next);
      if (next.visible) {
        const initial = next.initial ?? '';
        setText(initial);
        // Park the caret at the end so a stale caret can't falsely reopen the
        // mention dropdown before the field is focused.
        setSelection({ start: initial.length, end: initial.length });
      }
    };
    return () => {
      listener = null;
    };
  }, []);

  useEffect(() => {
    opacity.value = withTiming(state.visible ? 1 : 0, { duration: 180 });
    if (state.visible) {
      // Focus after the fade + keyboard settle so the caret lands reliably.
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [state.visible, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!state.visible) return null;

  const dirty = text.trim() !== (state.initial ?? '').trim();

  const save = () => {
    if (state.postId && dirty) {
      // Optimistic + fire-and-forget: the cache patch updates the card instantly,
      // so close immediately rather than blocking on the round-trip.
      mutate({ postId: state.postId, description: text, previous: state.initial });
    }
    EditDescriptionModal.hide();
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      {/* Tap-off to dismiss without saving. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => EditDescriptionModal.hide()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Edit caption</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            selection={forcedSelection ?? undefined}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
              if (forcedSelection) setForcedSelection(null);
            }}
            placeholder="Write a caption..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={MAX_DESCRIPTION_LENGTH}
            textAlignVertical="top"
          />
          <MentionSuggestions
            candidates={mentionCandidates}
            onPick={pickMention}
            style={styles.mentions}
          />
          <View style={styles.footer}>
            <Text style={styles.counter}>
              {text.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
            <View style={styles.actions}>
              <Pressable style={styles.btn} onPress={() => EditDescriptionModal.hide()} hitSlop={8}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.saveBtn, !dirty && styles.saveBtnDisabled]}
                onPress={save}
                disabled={!dirty}
                hitSlop={8}
              >
                <Text style={[styles.btnText, styles.saveText]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.78)', zIndex: 9999 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: verticalScale(20),
    paddingHorizontal: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
    marginBottom: verticalScale(14),
  },
  input: {
    minHeight: verticalScale(96),
    maxHeight: verticalScale(200),
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(12),
    color: colors.textPrimary,
    fontSize: fontScale(15),
    lineHeight: fontScale(21),
  },
  mentions: {
    marginTop: verticalScale(8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(14),
  },
  counter: { color: colors.textSecondary, fontSize: fontScale(12) },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: verticalScale(9),
    borderRadius: 999,
  },
  btnText: { color: colors.textSecondary, fontSize: fontScale(15), fontWeight: '600' },
  saveBtn: { backgroundColor: colors.accent },
  saveBtnDisabled: { opacity: 0.45 },
  saveText: { color: '#FFFFFF' },
});
