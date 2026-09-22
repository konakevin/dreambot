/**
 * The Create screen's cast pick, end to end as pure logic: what the chip SAYS
 * (castPreviewLabel) and what the request SENDS (castChoiceRequest).
 *
 * Both failures here are silent. A wrong label means the chip confidently names the
 * wrong person and the user ships the dream anyway; a wrong request means the chip is
 * right and the render is not. Neither throws, so only tests catch them.
 */

import { castPreviewLabel, castScenePlaceholder } from '@/lib/castPreviewLabel';
import { castChoiceRequest, castChoiceEquals, type CastChoice } from '@/lib/castChoiceRequest';
import { useDreamStore } from '@/store/dream';

describe('castPreviewLabel', () => {
  it('names the person when they have a name', () => {
    expect(castPreviewLabel(true, { name: 'Steph', relationship: 'partner' })).toBe(
      'You and Steph'
    );
  });

  it('falls back to the relationship when they do not', () => {
    // Still true and still useful. What it CANNOT do is be summoned by name, which is
    // what the Settings roster's "Add a name" prompt exists to fix.
    expect(castPreviewLabel(true, { relationship: 'partner' })).toBe('You and your partner');
    expect(castPreviewLabel(true, { relationship: 'friend' })).toBe('You and your friend');
  });

  it('keeps a real name exactly as the user capitalised it', () => {
    // Sentence-casing is for the FALLBACK only — "mcKenna" is how they typed it.
    expect(castPreviewLabel(false, { name: 'mcKenna' })).toBe('mcKenna');
    expect(castPreviewLabel(true, { name: 'mcKenna' })).toBe('You and mcKenna');
  });

  it('sentence-cases a leading fallback but not a trailing one', () => {
    expect(castPreviewLabel(false, { relationship: 'partner' })).toBe('Your partner');
    expect(castPreviewLabel(true, { relationship: 'partner' })).toBe('You and your partner');
  });

  it('handles the solo and empty states', () => {
    expect(castPreviewLabel(true, null)).toBe('You');
    expect(castPreviewLabel(false, null)).toBe('');
  });

  it('ignores a name that is only whitespace', () => {
    expect(castPreviewLabel(true, { name: '   ', relationship: 'friend' })).toBe(
      'You and your friend'
    );
  });
});

describe('castChoiceRequest', () => {
  it('auto sends NOTHING, so the untouched path is unchanged', () => {
    // This is the guarantee that adding a picker did not alter the default flow: with
    // no fields set, the engine detects cast roles from the prompt exactly as before.
    expect(castChoiceRequest({ kind: 'auto' })).toEqual({});
  });

  it('solo forces a self-only render', () => {
    expect(castChoiceRequest({ kind: 'solo' })).toEqual({ force_cast_role: 'self' });
  });

  it('a picked partner forces a dual render and names them', () => {
    expect(castChoiceRequest({ kind: 'partner', id: 'p1' })).toEqual({
      force_cast_role: 'dual',
      cast_partner_id: 'p1',
    });
  });

  it('never emits an undefined cast_partner_id alongside a forced role', () => {
    // An undefined id would reach the engine as "dual with nobody specified", which
    // silently falls back to the default partner — the wrong person, not an error.
    for (const choice of [{ kind: 'auto' }, { kind: 'solo' }] as CastChoice[]) {
      expect('cast_partner_id' in castChoiceRequest(choice)).toBe(false);
    }
  });

  it('only ever uses roles the engine already understands', () => {
    const roles = (['auto', 'solo'] as const)
      .map((kind) => castChoiceRequest({ kind }).force_cast_role)
      .concat(castChoiceRequest({ kind: 'partner', id: 'x' }).force_cast_role);
    for (const role of roles) {
      expect(role === undefined || role === 'self' || role === 'dual').toBe(true);
    }
  });
});

describe('castChoiceEquals', () => {
  it('matches the fixed kinds', () => {
    expect(castChoiceEquals({ kind: 'auto' }, { kind: 'auto' })).toBe(true);
    expect(castChoiceEquals({ kind: 'solo' }, { kind: 'solo' })).toBe(true);
    expect(castChoiceEquals({ kind: 'auto' }, { kind: 'solo' })).toBe(false);
  });

  it('compares partners by id, so two different people are never equal', () => {
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'partner', id: 'a' })).toBe(true);
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'partner', id: 'b' })).toBe(
      false
    );
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'auto' })).toBe(false);
  });
});

/**
 * STICKY CAST (Kevin, 2026-09-21: "i think sticky").
 *
 * Every other config value resets after a dream. This one does not, because the picker
 * became a labelled field above the prompt showing the person's face — a lingering pick
 * can no longer surprise anyone, and re-choosing your partner before every single dream
 * is a chore. While it was a caption above the Dream button the opposite was true, and
 * per-dream was the right call then.
 *
 * Guarded here because it is a one-line change in `reset()` that is easy to undo by
 * accident while tidying, and the symptom — having to re-pick every time — reads as a
 * papercut rather than a regression.
 */
describe('reset() keeps the cast pick', () => {
  it('survives a reset, unlike the rest of the config', () => {
    const st = useDreamStore.getState();
    st.reset();
    st.setCastChoice({ kind: 'partner', id: 'kevin' });
    st.setPrompt('a lighthouse in a storm');

    st.reset();

    const after = useDreamStore.getState().config;
    expect(after.castChoice).toEqual({ kind: 'partner', id: 'kevin' });
    // and everything else did reset
    expect(after.userPrompt).toBe('');
  });

  it('a deliberate switch back to auto also sticks', () => {
    const st = useDreamStore.getState();
    st.setCastChoice({ kind: 'partner', id: 'kevin' });
    st.setCastChoice({ kind: 'auto' });
    st.reset();
    expect(useDreamStore.getState().config.castChoice).toEqual({ kind: 'auto' });
  });
});

/**
 * THE PROMPT BOX ASKS A DIFFERENT QUESTION ONCE THE CAST IS PICKED.
 *
 * On Auto the prompt is what decides who appears, so the placeholder has to teach that
 * ("mention me or a cast member's name"). An explicit pick from the sheet has already
 * answered it, and repeating the instruction there would be teaching a control the user
 * just finished using. What is left to ask for is the scene (Kevin, 2026-09-22:
 * "depending on which dropdown selection i make, we should update the placeholder text").
 */
describe('castScenePlaceholder', () => {
  it('asks for the scene, in the same voice as the photo placeholder', () => {
    // The photo box already says "Set the scene and we'll dream you into it". Three
    // states of one box should read as one voice, not three authors.
    expect(castScenePlaceholder(null)).toBe("Describe the scene. We'll dream you into it.");
  });

  it('names the picked member', () => {
    expect(castScenePlaceholder({ name: 'Stephie', relationship: 'friend' })).toBe(
      "Describe the scene. We'll dream you and Stephie into it."
    );
  });

  it('reproduces a name exactly, never re-casing it', () => {
    // Same rule castPreviewLabel follows: a name is reproduced byte for byte however it
    // was typed, because "mcKenna" is somebody's actual spelling.
    expect(castScenePlaceholder({ name: 'mcKenna' })).toContain('you and mcKenna into it');
  });

  it('falls back to the relationship for a member who was never named', () => {
    // Legacy members only: naming is required for anyone added now.
    expect(castScenePlaceholder({ relationship: 'partner' })).toBe(
      "Describe the scene. We'll dream you and your partner into it."
    );
    expect(castScenePlaceholder({ relationship: 'friend' })).toBe(
      "Describe the scene. We'll dream you and your friend into it."
    );
  });

  it('treats a whitespace-only name as no name', () => {
    expect(castScenePlaceholder({ name: '   ', relationship: 'friend' })).toContain('your friend');
  });

  it('stays mid-sentence lowercase on the fallback', () => {
    // "We'll dream you and Your friend into it" would read as a proper noun.
    expect(castScenePlaceholder({ relationship: 'friend' })).not.toContain('Your friend');
  });
});
