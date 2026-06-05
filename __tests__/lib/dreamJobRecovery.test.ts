/**
 * Unit tests for decideDreamJobRecovery (lib/dreamJobRecovery.ts).
 *
 * Guards the loading-screen recovery flow Kevin reported broken: a render that
 * succeeded server-side (via EdgeRuntime.waitUntil) but whose client-side
 * await rejected on a transport drop must NOT leave the user staring at
 * "Lost touch with the dream engine" forever. The screen polls dream_jobs;
 * THIS function decides what to do with each snapshot.
 *
 * Outcomes covered:
 *   - status='done' + full result → navigate to /dream/reveal
 *   - status='done' missing upload_id → no-op (server still finalizing)
 *   - status='done' missing image_url → no-op
 *   - status='processing' → enter recovery (show spinner, keep polling)
 *   - status='failed' or 'nsfw' → exit recovery, show failure card
 *   - status=unknown → no-op (defensive)
 *   - job=null (no row) → no-op
 *   - queued=true → no-op (user opted into background-push flow)
 */

import { decideDreamJobRecovery, type DreamJobSnapshot } from '../../lib/dreamJobRecovery';

function snap(overrides: Partial<DreamJobSnapshot> = {}): DreamJobSnapshot {
  return {
    status: 'processing',
    upload_id: null,
    result_image_url: null,
    result_prompt: null,
    result_medium: null,
    result_vibe: null,
    error: null,
    ...overrides,
  };
}

describe('decideDreamJobRecovery — happy path (done + full result)', () => {
  it("navigates to reveal with the upload's data", () => {
    const job = snap({
      status: 'done',
      upload_id: 'up-1',
      result_image_url: 'https://cdn/img.jpg',
      result_prompt: 'a dreamlike landscape',
      result_medium: 'cinematic',
      result_vibe: 'peaceful',
    });
    const decision = decideDreamJobRecovery({ job, queued: false });
    expect(decision.action).toBe('navigate');
    if (decision.action !== 'navigate') return; // type guard
    expect(decision.result.imageUrl).toBe('https://cdn/img.jpg');
    expect(decision.result.prompt).toBe('a dreamlike landscape');
    expect(decision.result.uploadId).toBe('up-1');
    expect(decision.result.resolvedMedium).toBe('cinematic');
    expect(decision.result.resolvedVibe).toBe('peaceful');
    // These four are always null on the recovery path (server doesn't write
    // ai_concept / dream_mode / archetype to dream_jobs).
    expect(decision.result.aiConcept).toBeNull();
    expect(decision.result.dreamMode).toBeNull();
    expect(decision.result.archetype).toBeNull();
  });

  it('navigates even when result_prompt is null (empty-string fallback)', () => {
    const job = snap({
      status: 'done',
      upload_id: 'up-2',
      result_image_url: 'https://cdn/img.jpg',
      result_prompt: null,
    });
    const decision = decideDreamJobRecovery({ job, queued: false });
    expect(decision.action).toBe('navigate');
    if (decision.action !== 'navigate') return;
    expect(decision.result.prompt).toBe('');
  });
});

describe('decideDreamJobRecovery — done but incomplete (server still finalizing)', () => {
  it('no-ops when upload_id is null but result_image_url is set', () => {
    // Server could be mid-write between the upload row insert and the
    // dream_jobs update — next poll catches it.
    const job = snap({
      status: 'done',
      upload_id: null,
      result_image_url: 'https://cdn/img.jpg',
    });
    expect(decideDreamJobRecovery({ job, queued: false })).toEqual({ action: 'noop' });
  });

  it('no-ops when result_image_url is null but upload_id is set', () => {
    const job = snap({
      status: 'done',
      upload_id: 'up-3',
      result_image_url: null,
    });
    expect(decideDreamJobRecovery({ job, queued: false })).toEqual({ action: 'noop' });
  });

  it('no-ops when both upload_id and result_image_url are empty strings', () => {
    // Falsy guard catches both null AND empty-string — server bug shouldn't
    // route the user to a blank reveal screen.
    const job = snap({
      status: 'done',
      upload_id: '',
      result_image_url: '',
    });
    expect(decideDreamJobRecovery({ job, queued: false })).toEqual({ action: 'noop' });
  });
});

describe('decideDreamJobRecovery — in-flight + failure paths', () => {
  it("returns 'poll' for status='processing'", () => {
    expect(decideDreamJobRecovery({ job: snap({ status: 'processing' }), queued: false })).toEqual({
      action: 'poll',
    });
  });

  it("returns 'fail' for status='failed'", () => {
    expect(decideDreamJobRecovery({ job: snap({ status: 'failed' }), queued: false })).toEqual({
      action: 'fail',
    });
  });

  it("returns 'fail' for status='nsfw'", () => {
    expect(decideDreamJobRecovery({ job: snap({ status: 'nsfw' }), queued: false })).toEqual({
      action: 'fail',
    });
  });

  it("returns 'noop' for an unknown status (defensive)", () => {
    // A future migration could add a new status. Don't assume — leave the
    // screen alone until the polling effect / sweeper catches up.
    expect(decideDreamJobRecovery({ job: snap({ status: 'queued' }), queued: false })).toEqual({
      action: 'noop',
    });
    expect(decideDreamJobRecovery({ job: snap({ status: null }), queued: false })).toEqual({
      action: 'noop',
    });
  });
});

describe('decideDreamJobRecovery — queued/no-row guards', () => {
  it("returns 'noop' when the user already tapped Queue This (even if done)", () => {
    // Queued users have already been routed back to create/DLT — yanking them
    // into reveal would be jarring.
    const job = snap({
      status: 'done',
      upload_id: 'up-4',
      result_image_url: 'https://cdn/img.jpg',
    });
    expect(decideDreamJobRecovery({ job, queued: true })).toEqual({ action: 'noop' });
  });

  it("returns 'noop' when there's no dream_jobs row (e.g. activeJobId stale)", () => {
    expect(decideDreamJobRecovery({ job: null, queued: false })).toEqual({ action: 'noop' });
  });

  it('queued overrides every other branch', () => {
    // Belt-and-suspenders: queued=true short-circuits before status check.
    expect(decideDreamJobRecovery({ job: snap({ status: 'failed' }), queued: true })).toEqual({
      action: 'noop',
    });
    expect(decideDreamJobRecovery({ job: snap({ status: 'processing' }), queued: true })).toEqual({
      action: 'noop',
    });
  });
});
