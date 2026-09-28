/**
 * Push permission timing (lib/pushPrompt.ts): launch never shows the system prompt, it only registers a
 * token the user already granted; the prompt comes after their first dream reveal.
 */
import { pushPermissionAction } from '@/lib/pushPrompt';

describe('pushPermissionAction', () => {
  it('already granted: registers the token at launch and after a dream (nightly pushes unaffected)', () => {
    expect(pushPermissionAction({ status: 'granted', canAskAgain: true }, 'launch')).toBe(
      'register'
    );
    expect(pushPermissionAction({ status: 'granted', canAskAgain: false }, 'after_dream')).toBe(
      'register'
    );
  });

  it('never asked: launch does NOT prompt; the first dream reveal does', () => {
    expect(pushPermissionAction({ status: 'undetermined', canAskAgain: true }, 'launch')).toBe(
      'skip'
    );
    expect(pushPermissionAction({ status: 'undetermined', canAskAgain: true }, 'after_dream')).toBe(
      'prompt'
    );
  });

  it('denied, or the OS will not show the prompt again: never prompts', () => {
    expect(pushPermissionAction({ status: 'denied', canAskAgain: true }, 'after_dream')).toBe(
      'skip'
    );
    expect(
      pushPermissionAction({ status: 'undetermined', canAskAgain: false }, 'after_dream')
    ).toBe('skip');
    expect(pushPermissionAction({ status: 'denied', canAskAgain: false }, 'launch')).toBe('skip');
  });
});
