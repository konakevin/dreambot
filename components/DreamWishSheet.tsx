/**
 * DreamWishSheet — fullscreen form for making a dream wish.
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';
import { useSetDreamWish } from '@/hooks/useDreamWish';
import { useShareableVibers } from '@/hooks/useShareableVibers';
import {
  MOOD_OPTIONS, WEATHER_OPTIONS, ENERGY_OPTIONS, VIBE_OPTIONS,
  EMPTY_MODIFIERS, type WishModifier, type WishModifiers,
} from '@/constants/wishModifiers';

function ModifierPill({ item, selected, onPress }: { item: WishModifier; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      activeOpacity={0.7}
      style={[s.pill, selected && s.pillActive]}
    >
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={14} color={selected ? '#FFFFFF' : colors.textSecondary} />
      <Text style={[s.pillText, selected && s.pillTextActive]}>{item.label}</Text>
    </TouchableOpacity>
  );
}

function ModifierRow({ label, options, selected, onSelect }: {
  label: string;
  options: WishModifier[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <View style={s.modRow}>
      <Text style={s.modLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.modScroll}>
        {options.map((opt) => (
          <ModifierPill
            key={opt.key}
            item={opt}
            selected={selected === opt.key}
            onPress={() => onSelect(selected === opt.key ? null : opt.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface Props {
  visible: boolean;
  onClose: () => void;
  currentWish?: string | null;
  currentModifiers?: WishModifiers | null;
  currentRecipientIds?: string[];
}

export function DreamWishSheet({ visible, onClose, currentWish, currentModifiers, currentRecipientIds }: Props) {
  const [text, setText] = useState(currentWish ?? '');
  const [modifiers, setModifiers] = useState<WishModifiers>(currentModifiers ?? EMPTY_MODIFIERS);
  const [recipientIds, setRecipientIds] = useState<Set<string>>(new Set(currentRecipientIds ?? []));
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const { mutate: setWish, isPending } = useSetDreamWish();
  const { data: friends = [] } = useShareableVibers();

  function updateModifier(key: keyof WishModifiers, value: string | null) {
    setModifiers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const hasModifiers = Object.values(modifiers).some(Boolean);
    setWish(
      { wish: trimmed, modifiers: hasModifiers ? modifiers : null, recipientIds: recipientIds.size > 0 ? Array.from(recipientIds) : null },
      {
        onSuccess: () => {
          const msg = recipientIds.size > 0
            ? `Wish set! Sending to ${recipientIds.size} friend${recipientIds.size > 1 ? 's' : ''} tonight`
            : 'Wish set! Your Dream Bot will dream it next';
          Toast.show(msg, 'sparkles');
          onClose();
        },
      },
    );
  }

  function handleClear() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWish(
      { wish: null, modifiers: null, recipientIds: null },
      {
        onSuccess: () => {
          setText('');
          setModifiers(EMPTY_MODIFIERS);
          setRecipientIds(new Set());
          Toast.show('Wish cleared', 'checkmark-circle');
          onClose();
        },
      },
    );
  }

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{currentWish ? 'Your wish is set' : 'Make a wish'}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={s.subtitle}>Set the mood for tonight's dream</Text>

        <ScrollView style={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Modifier pills */}
          <ModifierRow label="Mood" options={MOOD_OPTIONS} selected={modifiers.mood} onSelect={(v) => updateModifier('mood', v)} />
          <ModifierRow label="Weather" options={WEATHER_OPTIONS} selected={modifiers.weather} onSelect={(v) => updateModifier('weather', v)} />
          <ModifierRow label="Energy" options={ENERGY_OPTIONS} selected={modifiers.energy} onSelect={(v) => updateModifier('energy', v)} />
          <ModifierRow label="Vibe" options={VIBE_OPTIONS} selected={modifiers.vibe} onSelect={(v) => updateModifier('vibe', v)} />

          {/* Text input */}
          <Text style={s.modLabel}>Describe your dream</Text>
          <TextInput
            style={s.input}
            placeholder="My dog at the beach, flying through space, a cozy rainy day..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            maxLength={200}
            multiline
            textAlignVertical="top"
          />
          <Text style={s.charCount}>{text.length}/200</Text>

          {/* Send to friends */}
          <TouchableOpacity
            style={s.sendButton}
            onPress={() => setShowFriendPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={18} color={recipientIds.size > 0 ? colors.accent : colors.textSecondary} />
            <Text style={[s.sendButtonText, recipientIds.size > 0 && { color: colors.accent }]}>
              {recipientIds.size > 0
                ? `Sending to ${recipientIds.size} friend${recipientIds.size > 1 ? 's' : ''}`
                : 'Send to friends'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom actions */}
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.saveButton, (!text.trim() || isPending) && s.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!text.trim() || isPending}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={18} color={!text.trim() ? colors.textSecondary : '#FFFFFF'} />
            <Text style={[s.saveButtonText, !text.trim() && s.saveButtonTextDisabled]}>
              {currentWish ? 'Update wish' : 'Make this wish'}
            </Text>
          </TouchableOpacity>

          {currentWish && (
            <TouchableOpacity style={s.clearButton} onPress={handleClear} activeOpacity={0.7}>
              <Text style={s.clearButtonText}>Clear wish</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Friend picker modal */}
      <Modal visible={showFriendPicker} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={s.root}>
          <View style={s.header}>
            <Text style={s.title}>Send to friends</Text>
            <TouchableOpacity onPress={() => { setShowFriendPicker(false); setFriendSearch(''); }} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={s.pickerSearch}
            placeholder="Search friends..."
            placeholderTextColor={colors.textMuted}
            value={friendSearch}
            onChangeText={setFriendSearch}
            autoFocus
          />
          <ScrollView style={s.pickerList}>
            {friends
              .filter((f) => !friendSearch || f.username.toLowerCase().includes(friendSearch.toLowerCase()))
              .map((friend) => {
                const selected = recipientIds.has(friend.userId);
                return (
                  <TouchableOpacity
                    key={friend.userId}
                    style={s.pickerRow}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setRecipientIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(friend.userId)) next.delete(friend.userId);
                        else next.add(friend.userId);
                        return next;
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    {friend.avatarUrl ? (
                      <Image source={{ uri: friend.avatarUrl }} style={s.pickerAvatar} />
                    ) : (
                      <View style={s.pickerAvatarFallback}>
                        <Text style={s.pickerAvatarText}>{friend.username[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={s.pickerUsername}>{friend.username}</Text>
                    <View style={[s.checkbox, selected && s.checkboxActive]}>
                      {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
          <View style={s.footer}>
            <TouchableOpacity
              style={s.saveButton}
              onPress={() => { setShowFriendPicker(false); setFriendSearch(''); }}
              activeOpacity={0.7}
            >
              <Text style={s.saveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  subtitle: {
    color: colors.textSecondary, fontSize: 14,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  content: { flex: 1, paddingHorizontal: 20 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },

  // Modifier pills
  modRow: { marginBottom: 14 },
  modLabel: {
    color: colors.textSecondary, fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 8, marginLeft: 2,
  },
  modScroll: { gap: 8, paddingRight: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#FFFFFF' },

  // Text input
  input: {
    width: '100%', minHeight: 80, backgroundColor: colors.surface,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
    color: colors.textPrimary, fontSize: 15, lineHeight: 21,
  },
  charCount: { color: colors.textMuted, fontSize: 12, alignSelf: 'flex-end', marginTop: 4, marginBottom: 14 },

  // Send to friends
  sendButton: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 20,
  },
  sendButtonText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },

  // Save button
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: 16, width: '100%',
  },
  saveButtonDisabled: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  saveButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  saveButtonTextDisabled: { color: colors.textSecondary },
  clearButton: { paddingVertical: 8, alignItems: 'center' },
  clearButtonText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },

  // Checkbox
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },

  // Friend picker
  pickerSearch: {
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
    color: colors.textPrimary, fontSize: 15,
    marginHorizontal: 20, marginTop: 12, marginBottom: 8,
  },
  pickerList: { flex: 1, paddingHorizontal: 20 },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  pickerAvatar: { width: 40, height: 40, borderRadius: 20 },
  pickerAvatarFallback: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  pickerAvatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  pickerUsername: { flex: 1, color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
