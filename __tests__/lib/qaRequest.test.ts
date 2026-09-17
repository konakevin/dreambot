/**
 * The QA/production split has to be RIGHT, because a wrong answer here is worse than no
 * answer: the spend numbers keep looking authoritative while quietly lying.
 *
 * Context (2026-09-16): our own testing was 82% of the render bill over the log's 30-day
 * retention — $174.21 of $212.77 — and was indistinguishable from user traffic. The
 * workaround was "exclude Kevin's user_id", which drops his genuine dreams AND misses QA
 * run on any other account.
 *
 * The rule under test: a render is QA when its request carried any `force_*` / `qa_*`
 * flag, EXCEPT the ones production legitimately sets. The failure that matters most is
 * the permissive direction — mislabelling a real dream as a test understates what users
 * cost us, which is the number the pricing model depends on.
 */
import { isQaRequest, PRODUCTION_FORCE_FLAGS } from '@engine/qaRequest';

describe('real user dreams are never marked QA', () => {
  it('a plain nightly request', () => {
    expect(isQaRequest({ user_id: 'u1', persist: true })).toBe(false);
  });

  it('a Create dream from the queue', () => {
    expect(
      isQaRequest({ user_id: 'u1', prompt: 'a castle', queue_job_id: 'j1', persist: true })
    ).toBe(false);
  });

  it('THE FIRST-DREAM PATH — production sets force_place, and it must not count', () => {
    // Onboarding pins the location the user just picked. If this counted as QA, every
    // single first dream would be filed as testing.
    expect(isQaRequest({ user_id: 'u1', first_dream: true, force_place: 'hawaii' })).toBe(false);
  });

  it('the other flags production sends', () => {
    expect(
      isQaRequest({ user_id: 'u1', first_dream: true, strict_face_swap: true, queue_job_id: 'j' })
    ).toBe(false);
  });

  it('an empty or malformed body', () => {
    expect(isQaRequest({})).toBe(false);
    expect(isQaRequest(null)).toBe(false);
    expect(isQaRequest(undefined)).toBe(false);
    expect(isQaRequest('not an object')).toBe(false);
  });
});

describe('our own test renders ARE marked QA', () => {
  it('a forced model — the eval harness', () => {
    expect(isQaRequest({ user_id: 'u1', persist: true, force_model: 'bytedance/seedream-4' })).toBe(
      true
    );
  });

  it('a pinned look', () => {
    expect(isQaRequest({ user_id: 'u1', qa_pin_look: 'nightly_classical_oil' })).toBe(true);
  });

  it('forced cast role + swap eligibility', () => {
    expect(
      isQaRequest({ user_id: 'u1', force_cast_role: 'dual', force_face_swap_eligible: true })
    ).toBe(true);
  });

  it('force_cast_role: null means "scene only" — a deliberate instruction, not an absent flag', () => {
    // The one place an explicit null is meaningful rather than empty.
    expect(isQaRequest({ user_id: 'u1', force_cast_role: null })).toBe(true);
  });

  it('a FUTURE force_* flag nobody has written yet', () => {
    // The whole point of matching on the prefix: a new QA flag is counted automatically,
    // with no edit to qaRequest.ts and nothing for anyone to remember.
    expect(isQaRequest({ user_id: 'u1', force_something_invented_later: 'x' })).toBe(true);
    expect(isQaRequest({ user_id: 'u1', qa_new_experiment: true })).toBe(true);
  });
});

describe('flags that were sent but not actually asked for', () => {
  it('undefined / null / false do not mark a render as QA', () => {
    // A client spreading an options object can send `force_model: undefined`. That is not
    // someone running a test.
    expect(isQaRequest({ user_id: 'u1', force_model: undefined })).toBe(false);
    expect(isQaRequest({ user_id: 'u1', force_looks_path: false })).toBe(false);
    expect(isQaRequest({ user_id: 'u1', qa_blank_axes: false })).toBe(false);
  });

  it('but a real value alongside an empty one still counts', () => {
    expect(isQaRequest({ user_id: 'u1', force_model: undefined, qa_pin_look: 'x' })).toBe(true);
  });
});

describe('the production allowlist', () => {
  it('every allowlisted flag is itself force_/qa_ prefixed, or it would be dead weight', () => {
    for (const f of PRODUCTION_FORCE_FLAGS) expect(f).toMatch(/^(force_|qa_)/);
  });

  it('is deliberately minimal — only force_place', () => {
    // A growing allowlist is how this check rots into always-false. If something is added
    // here, it needs a reason in the source comment.
    expect([...PRODUCTION_FORCE_FLAGS]).toEqual(['force_place']);
  });
});
