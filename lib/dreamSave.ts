/**
 * Dream Save — handles saving dreams with visibility control.
 *
 * Three outcomes from the Reveal screen:
 *   Post to Profile → public, is_active=true
 *   Save to Dreams  → private, is_active=false
 *   Discard         → no insert (caller handles)
 */

import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';
import { persistImage } from '@/lib/dreamApi';

export type DreamVisibility = 'public' | 'private';

interface SaveDreamOpts {
  userId: string;
  /** Temp Replicate URL — will be persisted to Storage */
  tempImageUrl: string;
  prompt: string;
  aiConcept?: unknown | null;
  visibility: DreamVisibility;
  dreamMedium?: string | null;
  dreamVibe?: string | null;
}

interface SaveDreamResult {
  uploadId: string;
  imageUrl: string;
}

/**
 * Persist image to Storage and insert into uploads table.
 *
 * - `public` → is_active=true, visibility='public' (appears in feed)
 * - `private` → is_active=false, visibility='private' (My Dreams only)
 */
export async function saveDream(opts: SaveDreamOpts): Promise<SaveDreamResult> {
  const imageUrl = await persistImage(opts.tempImageUrl, opts.userId);

  const isPublic = opts.visibility === 'public';
  const caption = opts.prompt.length > 200 ? opts.prompt.slice(0, 197) + '...' : opts.prompt;

  // visibility column added by migration 075 — remove cast after regenerating types
  const row = {
    user_id: opts.userId,
    image_url: imageUrl,
    caption,
    is_active: isPublic,
    is_posted: isPublic,
    ai_prompt: opts.prompt,
    width: 768,
    height: 1664,
    ai_concept: (opts.aiConcept as Record<string, never>) ?? null,
    visibility: opts.visibility,
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
