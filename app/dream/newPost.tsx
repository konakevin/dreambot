/**
 * New Post Screen — shows the dream image and lets the user add a description
 * before posting publicly. Reached from:
 *   1. Dream Reveal ("Post" button)
 *   2. DLT flow (after generation)
 *   3. Album viewer (tapping "+" on a never-posted dream)
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { pinToFeed } from '@/lib/dreamSave';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.3;

export default function NewPostScreen() {
  const { uploadId, imageUrl } = useLocalSearchParams<{
    uploadId: string;
    imageUrl: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!user || !uploadId || posting) return;
    setPosting(true);
    try {
      const { error } = await supabase
        .from('uploads')
        .update({
          is_public: true,
          posted_at: new Date().toISOString(),
          description: description.trim() || null,
        })
        .eq('id', uploadId)
        .eq('user_id', user.id);

      if (error) throw error;

      pinToFeed({
        id: uploadId,
        userId: user.id,
        imageUrl: decodeURIComponent(imageUrl!),
        username: user.user_metadata?.username ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      });

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      // Clear dream store in case we came from Reveal
      useDreamStore.getState().reset();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Posted', 'checkmark-circle');

      router.replace('/(tabs)');
    } catch {
      Toast.show('Failed to post', 'close-circle');
      setPosting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={posting}
            activeOpacity={0.7}
            style={[styles.postButton, posting && styles.postButtonDisabled]}
          >
            <Text style={[styles.postButtonText, posting && styles.postButtonTextDisabled]}>
              {posting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dream preview */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: decodeURIComponent(imageUrl!) }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>

        {/* Description input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a description..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  postButtonTextDisabled: {
    opacity: 0.7,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  image: {
    width: SCREEN_WIDTH - 64,
    height: IMAGE_HEIGHT,
    borderRadius: 12,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    padding: 0,
  },
});
