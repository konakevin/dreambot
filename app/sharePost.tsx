import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/auth';
import { useFriendsList, type FriendUser } from '@/hooks/useFriendsList';
import { useSendShare } from '@/hooks/useSendShare';
import { colors } from '@/constants/theme';

function ViberRow({ item, selected, onToggle }: { item: FriendUser; selected: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      style={styles.viberRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.viberName}>@{item.username}</Text>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color="#000000" />}
      </View>
    </TouchableOpacity>
  );
}

export default function SharePostScreen() {
  const { uploadId } = useLocalSearchParams<{ uploadId: string }>();
  const user = useAuthStore((s) => s.user);
  const { data: friends = [], isLoading } = useFriendsList(user?.id ?? '');
  const { mutate: sendShare, isPending } = useSendShare();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleViber(userId: string) {
    Haptics.selectionAsync();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function handleSend() {
    if (selected.size === 0) return;

    sendShare(
      { uploadId: uploadId!, receiverIds: Array.from(selected) },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to share. Please try again.');
        },
      }
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Post</Text>
        <TouchableOpacity
          style={[styles.sendButton, selected.size === 0 && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={selected.size === 0 || isPending}
          activeOpacity={0.7}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={[styles.sendButtonText, selected.size === 0 && styles.sendButtonTextDisabled]}>
              Send{selected.size > 0 ? ` (${selected.size})` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Viber list */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ViberRow
            item={item}
            selected={selected.has(item.id)}
            onToggle={() => toggleViber(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : (
              <>
                <Ionicons name="people-outline" size={36} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No vibers to share with yet</Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  sendButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  sendButtonTextDisabled: {
    color: colors.textSecondary,
  },
  viberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  viberName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
