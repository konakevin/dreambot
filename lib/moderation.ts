/**
 * Content moderation — delegates to the moderate-content Edge Function.
 * No API keys on the client. The public API is unchanged — consumers
 * (useUpload, useAddComment) don't need any changes.
 */

import { supabase } from '@/lib/supabase';

export interface ModerationResult {
  passed: boolean;
  reason: string | null;
}

async function callModeration(body: Record<string, unknown>): Promise<ModerationResult> {
  const { data, error } = await supabase.functions.invoke('moderate-content', { body });

  if (error) {
    console.warn('[Moderation] Edge Function error:', error);
    return { passed: false, reason: 'Unable to verify content. Please try again.' };
  }

  return {
    passed: data?.passed ?? false,
    reason: data?.reason ?? null,
  };
}

export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  return callModeration({ type: 'image', image_url: imageUrl });
}

export async function moderateText(text: string): Promise<ModerationResult> {
  if (!text || text.trim().length === 0) return { passed: true, reason: null };
  return callModeration({ type: 'text', text });
}

export async function moderateUpload(
  mediaUrl: string,
  caption: string | null
): Promise<ModerationResult> {
  return callModeration({
    type: 'upload',
    media_url: mediaUrl,
    media_type: 'image',
    caption,
  });
}
