/**
 * Unit tests for decideDreamResume — the cold-start recovery decision.
 * Pairs with dreamJobRecovery.test.ts (the warm-foreground decision it reuses).
 */

import { decideDreamResume, RESUME_MAX_AGE_MS, type PersistedDreamJob } from '@/lib/dreamResume';
import type { DreamJobSnapshot } from '@/lib/dreamJobRecovery';

const USER = 'user-1';
const NOW = 1_000_000_000_000;
const fresh: PersistedDreamJob = { jobId: 'job-1', ts: NOW };

const job = (over: Partial<DreamJobSnapshot & { user_id: string | null }> = {}) => ({
  status: 'done',
  upload_id: 'up-1',
  result_image_url: 'https://img/1.jpg',
  result_prompt: 'a dream',
  result_medium: 'photography',
  result_vibe: 'cinematic',
  user_id: USER,
  ...over,
});

const decide = (over: Partial<Parameters<typeof decideDreamResume>[0]> = {}) =>
  decideDreamResume({
    persisted: fresh,
    job: job(),
    nowMs: NOW,
    maxAgeMs: RESUME_MAX_AGE_MS,
    currentUserId: USER,
    ...over,
  });

describe('decideDreamResume — guards', () => {
  it('ignores when nothing is persisted', () => {
    expect(decide({ persisted: null }).action).toBe('ignore');
  });
  it('ignores when not authed yet (does NOT clear — session may be hydrating)', () => {
    expect(decide({ currentUserId: null }).action).toBe('ignore');
  });
  it('clears a stale marker (older than the resume window)', () => {
    expect(decide({ persisted: { jobId: 'j', ts: NOW - RESUME_MAX_AGE_MS - 1 } }).action).toBe(
      'clear'
    );
  });
  it('keeps a marker exactly at the window edge', () => {
    expect(decide({ persisted: { jobId: 'j', ts: NOW - RESUME_MAX_AGE_MS } }).action).not.toBe(
      'clear'
    );
  });
  it('clears when there is no dream_jobs row (never started / RLS-filtered)', () => {
    expect(decide({ job: null }).action).toBe('clear');
  });
  it('clears on a cross-user job (belt-and-suspenders over RLS)', () => {
    expect(decide({ job: job({ user_id: 'someone-else' }) }).action).toBe('clear');
  });
});

describe('decideDreamResume — outcomes', () => {
  it('reveals a finished render with the full result', () => {
    const d = decide();
    expect(d.action).toBe('reveal');
    if (d.action === 'reveal') {
      expect(d.result.uploadId).toBe('up-1');
      expect(d.result.imageUrl).toBe('https://img/1.jpg');
      expect(d.result.prompt).toBe('a dream');
    }
  });
  it('resumes the loading screen while still processing', () => {
    const d = decide({
      job: job({ status: 'processing', upload_id: null, result_image_url: null }),
    });
    expect(d.action).toBe('resumeLoading');
    if (d.action === 'resumeLoading') expect(d.jobId).toBe('job-1');
  });
  it('resumes the loading screen when done-but-finalizing (upload_id not written yet)', () => {
    expect(decide({ job: job({ upload_id: null }) }).action).toBe('resumeLoading');
  });
  it('clears (does NOT pop a failure card) when the render failed', () => {
    expect(decide({ job: job({ status: 'failed' }) }).action).toBe('clear');
  });
  it('clears when the render was NSFW-blocked', () => {
    expect(decide({ job: job({ status: 'nsfw' }) }).action).toBe('clear');
  });
});

describe('decideDreamResume — safety invariant', () => {
  it('NEVER reveals without a non-empty uploadId AND imageUrl', () => {
    for (const upload_id of [null, '', 'up-1']) {
      for (const result_image_url of [null, '', 'https://img']) {
        const d = decide({ job: job({ upload_id, result_image_url }) });
        if (d.action === 'reveal') {
          expect(d.result.uploadId).toBeTruthy();
          expect(d.result.imageUrl).toBeTruthy();
        }
      }
    }
  });
});
