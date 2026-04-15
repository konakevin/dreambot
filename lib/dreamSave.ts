/**
 * Dream Save — handles saving dreams to the user's dream album.
 *
 * All dreams save as PRIVATE (is_public=false, posted_at=null).
 * Publishing happens separately via the New Post screen.
 */

import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';
import { persistImage } from '@/lib/dreamApi';

interface SaveDreamOpts {
  userId: string;
  /** Temp Replicate URL or permanent Storage URL */
  tempImageUrl: string;
  prompt: string;
  aiConcept?: unknown | null;
  dreamMedium?: string | null;
  dreamVibe?: string | null;
  /** If set, this existing draft upload already exists (from queue) — no insert needed */
  existingUploadId?: string;
}

interface SaveDreamResult {
  uploadId: string;
  imageUrl: string;
}

/**
 * Persist image to Storage and insert into uploads table as a private dream.
 * The New Post screen handles making it public (is_public=true, posted_at=now()).
 */
export async function saveDream(opts: SaveDreamOpts): Promise<SaveDreamResult> {
  // Skip re-upload if the image is already in Supabase Storage
  const isStorageUrl = opts.tempImageUrl.includes('supabase.co/storage');
  const imageUrl = isStorageUrl
    ? opts.tempImageUrl
    : await persistImage(opts.tempImageUrl, opts.userId);

  const caption = opts.prompt.length > 200 ? opts.prompt.slice(0, 197) + '...' : opts.prompt;

  // If we have an existing draft upload (from queue), it's already saved — just return
  if (opts.existingUploadId) {
    return { uploadId: opts.existingUploadId, imageUrl };
  }

  const row = {
    user_id: opts.userId,
    image_url: imageUrl,
    caption,
    is_public: false,
    ai_prompt: opts.prompt,
    width: 768,
    height: 1664,
    ai_concept: (opts.aiConcept as Record<string, never>) ?? null,
    dream_medium: opts.dreamMedium ?? null,
    dream_vibe: opts.dreamVibe ?? null,
  };

  const { data, error } = await supabase
    .from('uploads')
    .insert(row as unknown as typeof row & Record<string, unknown>)
    .select('id')
    .single();

  if (error) throw error;
  return { uploadId: data.id, imageUrl };
}

/**
 * Pin a freshly posted dream to the feed so it appears as the first card.
 */
export function pinToFeed(opts: {
  id: string;
  userId: string;
  imageUrl: string;
  username: string;
  avatarUrl: string | null;
}) {
  useFeedStore.getState().setPinnedPost({
    id: opts.id,
    user_id: opts.userId,
    image_url: opts.imageUrl,
    caption: null,
    username: opts.username,
    avatar_url: opts.avatarUrl,
    created_at: new Date().toISOString(),
    comment_count: 0,
  });
}
