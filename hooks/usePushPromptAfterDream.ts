import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { promptForPushAfterDream } from '@/hooks/usePushNotifications';

/** Let the reveal land before the system prompt covers it. */
const PROMPT_DELAY_MS = 2500;

/**
 * Ask for push permission once a dream is on screen (lib/pushPrompt.ts): the onboarding first-dream
 * reveal and the Create reveal. A no-op after the user has answered, so it is safe on every reveal.
 */
export function usePushPromptAfterDream(dreamVisible: boolean): void {
  const userId = useAuthStore((s) => s.user?.id);
  useEffect(() => {
    if (!dreamVisible || !userId) return;
    const t = setTimeout(() => void promptForPushAfterDream(userId), PROMPT_DELAY_MS);
    return () => clearTimeout(t);
  }, [dreamVisible, userId]);
}
