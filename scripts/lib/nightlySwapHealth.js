/**
 * nightlySwapHealth.js — the nightly couple-swap alarms (NIGHTLY_ROBUSTNESS_PLAN.md item 4) and the heavy-cap
 * ceiling (item 5). Pure functions; scripts/check-dream-queue.js feeds them the last 24 h of REAL nightly jobs and
 * the live engine_config, and __tests__/lib/nightlySwapHealth.test.ts locks that on-spec nights never alarm.
 *
 * What it watches:
 *   - CAPACITY SOLOS: a couple that shipped as a solo because the Fly swap service was out of capacity. With the
 *     swap gate on and nightly capacity retries > 0 that needs retries + 1 capacity failures in a row, so the alarm
 *     is ARMED BY THE CONFIG: any one of them fails the monitor; with the protection switched off (the rollback
 *     state) they are the expected behaviour and are only logged.
 *   - COUPLE → SOLO RATE, all causes (one face found, identity, gender, capacity). Measured 2026-09-14 → 09-23 on
 *     real nightly jobs: ~5-9% of couples. Alarms at max(3, 25% of couples) so a single miss on a 4-couple night
 *     can never page.
 *   - CAPACITY RETRIES: the gate working as designed, but many of them mean Fly is short of machines → warning.
 *   - HEAVY CAP vs SWAP SLOTS: a heavy cap above what the swap slots can serve inside the gate's wait → warning.
 */

// Same classification as supabase/functions/_shared/swapCapacityGate.ts isSwapCapacityError (parity locked by the
// test): a busy gate, a Fly 502/503/504, a swap that ran out of time, or an aborted call. NOT capacity: one face
// found, identity / gender misses, empty model output.
const CAPACITY_RE =
  /swap_capacity_busy|returned 50[234]\b|face swap timed out|face swap deadline exceeded|signal timed out|timeouterror|\baborted\b|operation was aborted/i;

function isSwapCapacityError(msg) {
  return CAPACITY_RE.test(String(msg || ''));
}

/** A typical dual swap once it has a slot (median ~20 s alone, ~25 s with detection + identity). */
const TYPICAL_SWAP_MS = 25_000;

/**
 * The most heavy renders worth running at once: every one may need a swap slot, and a render that cannot get one
 * within the gate's max wait re-queues (nightly) or degrades (Create). slots × (1 + maxWait / typical swap).
 */
function heavyCapCeiling(slots, maxWaitMs, typicalSwapMs = TYPICAL_SWAP_MS) {
  const s = Math.max(0, Number(slots) || 0);
  const w = Math.max(0, Number(maxWaitMs) || 0);
  if (s === 0) return 0;
  return Math.floor(s * (1 + w / typicalSwapMs));
}

/** A real, cron-enqueued nightly job (QA batches reuse the `nightly:` key but carry payload.qa_silent). */
function isRealNightlyJob(job) {
  return (
    job.source === 'nightly' &&
    typeof job.dedup_key === 'string' &&
    job.dedup_key.startsWith('nightly:') &&
    !(job.payload && job.payload.qa_silent)
  );
}

/**
 * Summarise ai_generation_log rows ({ job_id, status, fallback_reasons }) for a set of nightly jobs. A job is a
 * couple when any attempt rolled `policy:couple:1:`; it SOLOED when its delivered (completed) attempt carries
 * `dual_degrade_single`; that solo is a CAPACITY solo when the delivered attempt also logged a capacity-class
 * `dual_swap_error:`.
 */
function summarizeNightlyJobs(rows) {
  const byJob = new Map();
  for (const r of rows || []) {
    if (!r || !r.job_id) continue;
    if (!byJob.has(r.job_id)) byJob.set(r.job_id, []);
    byJob.get(r.job_id).push(r);
  }
  const out = { jobs: byJob.size, coupleJobs: 0, soloed: 0, capacitySolos: 0, capacityRetries: 0 };
  for (const attempts of byJob.values()) {
    const stamps = (r) => (Array.isArray(r.fallback_reasons) ? r.fallback_reasons : []);
    const couple = attempts.some((r) => stamps(r).some((s) => s.startsWith('policy:couple:1:')));
    out.capacityRetries += attempts.filter((r) =>
      stamps(r).includes('swap_capacity_retry_later')
    ).length;
    if (!couple) continue;
    out.coupleJobs++;
    const delivered = attempts.filter((r) => r.status === 'completed').pop();
    if (!delivered || !stamps(delivered).includes('dual_degrade_single')) continue;
    out.soloed++;
    const capacity = stamps(delivered).some(
      (s) => s.startsWith('dual_swap_error:') && isSwapCapacityError(s)
    );
    if (capacity) out.capacitySolos++;
  }
  return out;
}

const DEFAULT_THRESHOLDS = { soloMinCount: 3, soloMaxRate: 0.25, retryWarnRate: 0.25 };

/**
 * Turn a summary + the live config into monitor output. cfg: { swapGateEnabled, nightlySwapCapacityRetries,
 * flyDualSwapSlots, swapGateMaxWaitMs, heavyCap }. Returns { errors: string[], warnings: string[], notes: string[] }.
 */
function nightlySwapAlarms(summary, cfg, thresholds = DEFAULT_THRESHOLDS) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  const errors = [];
  const warnings = [];
  const notes = [];
  const s = summary;
  notes.push(
    `nightly couples (last 24h, real jobs): ${s.coupleJobs} of ${s.jobs} jobs; shipped solo: ${s.soloed} ` +
      `(capacity: ${s.capacitySolos}); capacity retries: ${s.capacityRetries}`
  );

  const protectionOn = !!cfg.swapGateEnabled && Number(cfg.nightlySwapCapacityRetries) > 0;
  if (s.capacitySolos > 0) {
    if (protectionOn) {
      errors.push(
        `${s.capacitySolos} nightly couple(s) shipped as a solo because the swap service was out of capacity, ` +
          `even after ${cfg.nightlySwapCapacityRetries} retries. Fly is short of machines or Replicate is slow: ` +
          `check the Fly machines, then ai_generation_log.fallback_reasons (dual_swap_error:*).`
      );
    } else {
      notes.push(
        `capacity solos are expected while the swap gate / capacity retry is off (swap_gate_enabled=` +
          `${!!cfg.swapGateEnabled}, nightly_swap_capacity_retries=${cfg.nightlySwapCapacityRetries}).`
      );
    }
  }

  const soloLimit = Math.max(t.soloMinCount, Math.ceil(t.soloMaxRate * s.coupleJobs));
  if (s.soloed >= soloLimit) {
    errors.push(
      `${s.soloed} of ${s.coupleJobs} nightly couples shipped as a solo in 24h (limit ${soloLimit}; normal is ` +
        `~5-9%). See ai_generation_log.fallback_reasons for the cause.`
    );
  }

  if (s.capacityRetries >= 2 && s.capacityRetries >= Math.ceil(t.retryWarnRate * s.coupleJobs)) {
    warnings.push(
      `${s.capacityRetries} nightly swap capacity retries in 24h for ${s.coupleJobs} couples: the gate is ` +
        `holding, but Fly is busy. Consider \`fly scale count\` + raising fly_dual_swap_slots.`
    );
  }

  const ceiling = heavyCapCeiling(cfg.flyDualSwapSlots, cfg.swapGateMaxWaitMs);
  if (Number(cfg.heavyCap) > ceiling) {
    warnings.push(
      `dream_queue_max_concurrent_heavy=${cfg.heavyCap} is above what ${cfg.flyDualSwapSlots} swap slots can ` +
        `serve (${ceiling}); the extra renders will only wait and retry. Scale Fly + fly_dual_swap_slots first.`
    );
  }
  return { errors, warnings, notes };
}

module.exports = {
  isSwapCapacityError,
  heavyCapCeiling,
  isRealNightlyJob,
  summarizeNightlyJobs,
  nightlySwapAlarms,
  DEFAULT_THRESHOLDS,
  TYPICAL_SWAP_MS,
};
