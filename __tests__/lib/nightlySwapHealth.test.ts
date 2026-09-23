/**
 * NIGHTLY SWAP ALARMS + HEAVY-CAP CEILING (NIGHTLY_ROBUSTNESS_PLAN.md items 4 + 5).
 *
 * A couple that shipped as a solo used to count as a "completed" nightly job, so nothing alarmed on the 31% swap
 * failure rate of the 10:18 UTC burst. These tests lock: the capacity-solo alarm is ARMED BY THE CONFIG (gate on +
 * capacity retries > 0 → any one fails the monitor; protection off → logged only), measured on-spec nights never
 * alarm, the monitor classifies swap errors exactly like the edge does, and the heavy cap is bounded by the Fly
 * swap slots.
 */
import fs from 'fs';
import path from 'path';
import { isSwapCapacityError as edgeIsCapacity } from '@engine/swapCapacityGate';
import { DEFAULT_ENGINE_CONFIG } from '@engine/engineConfig';

const H = require('../../scripts/lib/nightlySwapHealth');

const LIVE = {
  swapGateEnabled: true,
  nightlySwapCapacityRetries: 2,
  flyDualSwapSlots: 2,
  swapGateMaxWaitMs: 45_000,
  heavyCap: 3,
};

type Row = { job_id: string; status: string; fallback_reasons: string[] };
const couple = (job: string, status: string, ...extra: string[]): Row => ({
  job_id: job,
  status,
  fallback_reasons: ['policy:couple:1:flux-1.1-pro', ...extra],
});
const solo = (job: string, status: string, ...extra: string[]): Row => ({
  job_id: job,
  status,
  fallback_reasons: ['policy:solo:1:flux-1.1-pro', ...extra],
});
const FLY_TIMEOUT =
  'dual_swap_error:face-swap-dual@fly returned 500 after 55142ms: {"error":"Face swap timed out (cdingram)"}';

describe('summarizeNightlyJobs', () => {
  it('counts couples, solos, capacity solos and capacity retries per JOB (all attempts)', () => {
    const s = H.summarizeNightlyJobs([
      couple('a', 'completed'), // held
      couple('b', 'completed', 'no_dual_split', 'dual_degrade_single'), // content solo
      couple('c', 'completed', FLY_TIMEOUT, 'dual_degrade_single'), // capacity solo (the 09-22 case)
      couple(
        'd',
        'failed',
        'dual_swap_error:swap_capacity_busy: no Fly swap slot after 44601ms',
        'swap_capacity_retry_later'
      ),
      couple('d', 'completed'), // the retry held
      solo('e', 'completed'),
    ]);
    expect(s).toEqual({ jobs: 5, coupleJobs: 4, soloed: 2, capacitySolos: 1, capacityRetries: 1 });
  });

  it('judges the DELIVERED attempt, not a failed one', () => {
    const s = H.summarizeNightlyJobs([
      couple('a', 'failed', FLY_TIMEOUT, 'dual_degrade_single'),
      couple('a', 'completed'),
    ]);
    expect(s.soloed).toBe(0);
  });
});

describe('nightlySwapAlarms: on-spec nights never alarm', () => {
  // Real nightly jobs 2026-09-13 → 09-23 (scripts/lib/nightlySwapHealth.js header): 1-4 couples a night, 0-1
  // content solos. And a future scale night at the measured ~9% all-cause rate.
  const onSpec = [
    { jobs: 9, coupleJobs: 3, soloed: 1, capacitySolos: 0, capacityRetries: 0 },
    { jobs: 11, coupleJobs: 4, soloed: 0, capacitySolos: 0, capacityRetries: 1 },
    { jobs: 10, coupleJobs: 0, soloed: 0, capacitySolos: 0, capacityRetries: 0 },
    { jobs: 300, coupleJobs: 100, soloed: 9, capacitySolos: 0, capacityRetries: 10 },
    { jobs: 20, coupleJobs: 8, soloed: 2, capacitySolos: 0, capacityRetries: 1 },
  ];
  it.each(onSpec)('%o → no error', (s) => {
    expect(H.nightlySwapAlarms(s, LIVE).errors).toEqual([]);
  });
});

describe('nightlySwapAlarms: the capacity-solo alarm is armed by the config', () => {
  const capSolo = { jobs: 9, coupleJobs: 4, soloed: 1, capacitySolos: 1, capacityRetries: 2 };

  it('gate on + retries > 0: ONE capacity solo fails the monitor', () => {
    const r = H.nightlySwapAlarms(capSolo, LIVE);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatch(/even after 2 retries/);
  });

  it.each([
    { swapGateEnabled: false, nightlySwapCapacityRetries: 2 },
    { swapGateEnabled: true, nightlySwapCapacityRetries: 0 },
    { swapGateEnabled: false, nightlySwapCapacityRetries: 0 },
  ])('protection off (%o): logged, never an error', (off) => {
    const r = H.nightlySwapAlarms(capSolo, { ...LIVE, ...off });
    expect(r.errors).toEqual([]);
    expect(r.notes.join(' ')).toMatch(/expected while the swap gate/);
  });
});

describe('nightlySwapAlarms: all-cause couple → solo rate', () => {
  it('3 of 4 couples solo fails; 1 of 4 does not', () => {
    const base = { jobs: 10, capacitySolos: 0, capacityRetries: 0, coupleJobs: 4 };
    expect(H.nightlySwapAlarms({ ...base, soloed: 3 }, LIVE).errors).toHaveLength(1);
    expect(H.nightlySwapAlarms({ ...base, soloed: 1 }, LIVE).errors).toEqual([]);
  });

  it('scales with volume: 25 of 100 fails, 24 of 100 does not', () => {
    const base = { jobs: 300, capacitySolos: 0, capacityRetries: 0, coupleJobs: 100 };
    expect(H.nightlySwapAlarms({ ...base, soloed: 25 }, LIVE).errors).toHaveLength(1);
    expect(H.nightlySwapAlarms({ ...base, soloed: 24 }, LIVE).errors).toEqual([]);
  });
});

describe('warnings (never fail the run)', () => {
  it('many capacity retries → scale-Fly warning', () => {
    const r = H.nightlySwapAlarms(
      { jobs: 12, coupleJobs: 4, soloed: 0, capacitySolos: 0, capacityRetries: 3 },
      LIVE
    );
    expect(r.errors).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/fly scale count/);
  });

  it('a heavy cap above the swap-slot ceiling warns; the live cap does not', () => {
    const quiet = { jobs: 0, coupleJobs: 0, soloed: 0, capacitySolos: 0, capacityRetries: 0 };
    expect(H.nightlySwapAlarms(quiet, LIVE).warnings).toEqual([]);
    expect(H.nightlySwapAlarms(quiet, { ...LIVE, heavyCap: 10 }).warnings.join(' ')).toMatch(
      /above what 2 swap slots can serve \(5\)/
    );
  });
});

describe('heavyCapCeiling (item 5)', () => {
  it('slots × (1 + max wait / ~25 s swap)', () => {
    expect(H.heavyCapCeiling(2, 45_000)).toBe(5);
    expect(H.heavyCapCeiling(4, 45_000)).toBe(11);
    expect(H.heavyCapCeiling(0, 45_000)).toBe(0);
  });

  it('the code fallback, the migration and the live value agree, and sit under the ceiling', () => {
    const read = (f: string) =>
      fs.readFileSync(path.join(__dirname, '..', '..', 'supabase/migrations', f), 'utf8');
    const mig552 = read('552_record_heavy_cap.sql');
    expect(mig552).toContain('SET dream_queue_max_concurrent_heavy = 3');
    expect(mig552).toContain('SET DEFAULT 3');
    expect(DEFAULT_ENGINE_CONFIG.dreamQueueMaxConcurrentHeavy).toBe(3);
    // fly_dual_swap_slots is read in SQL only (acquire_swap_slot); its default lives in migration 549.
    expect(read('549_swap_capacity_gate.sql')).toContain(
      'fly_dual_swap_slots integer NOT NULL DEFAULT 2'
    );
    expect(DEFAULT_ENGINE_CONFIG.dreamQueueMaxConcurrentHeavy).toBeLessThanOrEqual(
      H.heavyCapCeiling(2, DEFAULT_ENGINE_CONFIG.swapGateMaxWaitMs)
    );
  });
});

describe('the monitor classifies swap errors exactly like the edge', () => {
  // Every dual_swap_error shape seen in 30 days of ai_generation_log (2026-08-24 → 09-23), plus the content ones.
  const messages = [
    FLY_TIMEOUT,
    'dual_swap_error:face-swap-dual@fly returned 502 after 30001ms: ',
    'dual_swap_error:face-swap-dual@fly returned 503 after 36801ms: ',
    'dual_swap_error:face-swap-dual@fly returned 500 after 50515ms: {"error":"Face swap deadline exceeded (cdingram)"}',
    'dual_swap_error:face-swap-dual@fly returned 500 after 20000ms: {"error":"Face swap empty output (cdingram: no face found)"}',
    'dual_swap_error:face-swap-dual@fly returned 500 after 9000ms: {"error":"[faceSwap] source unreachable"}',
    'dual_swap_error:face-swap-dual@fly returned 500 after 9000ms: {"error":"Stitched upload failed: 413"}',
    'dual_swap_error:Signal timed out.',
    'dual_swap_error:swap_capacity_busy: no Fly swap slot after 44601ms',
    'dual_swap_error:The operation was aborted',
  ];
  it.each(messages)('%s', (m) => {
    expect(H.isSwapCapacityError(m)).toBe(edgeIsCapacity(m));
  });

  it('timeouts and busy are capacity; empty output and bad sources are not', () => {
    expect(H.isSwapCapacityError(FLY_TIMEOUT)).toBe(true);
    expect(H.isSwapCapacityError(messages[3])).toBe(true);
    expect(H.isSwapCapacityError(messages[4])).toBe(false);
    expect(H.isSwapCapacityError(messages[5])).toBe(false);
  });
});

describe('the monitor is wired', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'scripts/check-dream-queue.js'),
    'utf8'
  );
  it('reads real nightly jobs, summarises them, and fails the run on an error', () => {
    expect(src).toContain("require('./lib/nightlySwapHealth')");
    expect(src).toContain('nightlyJobs.filter(isRealNightlyJob)');
    expect(src).toMatch(
      /for \(const e of swapReport\.errors\) \{\s*console\.error\(`::error::\$\{e\}`\);\s*alarm = true;/
    );
  });

  it('real nightly = the cron key without the QA flag', () => {
    expect(
      H.isRealNightlyJob({ source: 'nightly', dedup_key: 'nightly:u:2026-09-23', payload: {} })
    ).toBe(true);
    expect(
      H.isRealNightlyJob({
        source: 'nightly',
        dedup_key: 'nightly:u:2026-09-23',
        payload: { qa_silent: true },
      })
    ).toBe(false);
    expect(
      H.isRealNightlyJob({ source: 'nightly', dedup_key: 'qa-retry-worker:x', payload: {} })
    ).toBe(false);
    expect(H.isRealNightlyJob({ source: 'create', dedup_key: 'nightly:u:d', payload: {} })).toBe(
      false
    );
  });
});
