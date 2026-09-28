/**
 * When to ask for push permission (pure, tested in __tests__/lib/pushPrompt.test.ts).
 *
 * iOS shows the system prompt ONCE per install (Android 13+ allows about two asks), so asking cold at
 * launch, before the user has seen anything worth being notified about, wastes it. We ask right after
 * their first dream is revealed instead (hooks/usePushNotifications.ts promptForPushAfterDream, called
 * from the onboarding first-dream reveal and the Create reveal). Launch only ever REGISTERS a token that
 * was already granted, so everyone who said yes before keeps getting nightly pushes unchanged.
 */

export interface PushPermissionState {
  status: 'granted' | 'denied' | 'undetermined';
  /** false once the OS will no longer show the prompt. */
  canAskAgain: boolean;
}

export type PushMoment = 'launch' | 'after_dream';

/** register = fetch + save the token; prompt = show the system prompt first; skip = do nothing. */
export type PushAction = 'register' | 'prompt' | 'skip';

export function pushPermissionAction(p: PushPermissionState, moment: PushMoment): PushAction {
  if (p.status === 'granted') return 'register';
  if (p.status === 'undetermined' && p.canAskAgain && moment === 'after_dream') return 'prompt';
  return 'skip';
}
