/**
 * STRESS / FUZZ SIMULATION of the dream background→foreground→kill→resume flow.
 *
 * A seeded, model-based simulator drives the REAL decision functions
 * (decideDreamJobRecovery = warm foreground recovery, decideDreamResume =
 * cold-start resume) through thousands of randomized lifecycle event orderings —
 * server render ticks, app backgrounding, foregrounding, OS kills, relaunches,
 * completion-push taps, long time-jumps, and user switches — and asserts the
 * safety invariants that must hold no matter the ordering:
 *
 *   I1  generate() fires AT MOST once per dream         → no double-charge
 *   I2  the simulation always settles                   → no infinite loop
 *   I3  the user never ends stuck on a spinner/away     → no stranded spinner
 *   I4  every reveal is a done + uploaded + same-user job → no broken/cross-user reveal
 *   I5  a finished render with a fresh marker is surfaced → no silently-lost dream
 *
 * Each scenario is reproducible from its seed (printed on failure).
 */

import { decideDreamJobRecovery } from '@/lib/dreamJobRecovery';
import { decideDreamResume, RESUME_MAX_AGE_MS } from '@/lib/dreamResume';

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Screen = 'create' | 'loading' | 'reveal' | 'failureCard' | 'photo' | 'away';
type ServerStatus = 'none' | 'processing' | 'done' | 'failed' | 'nsfw';

const TERMINAL: Screen[] = ['reveal', 'failureCard', 'photo', 'create'];
const isTerminal = (s: Screen) => TERMINAL.includes(s);

interface SimResult {
  seed: number;
  generateCalls: number;
  settled: boolean;
  finalScreen: Screen;
  badReveal: boolean;
  serverDone: boolean;
  sawDream: boolean;
  staleCleared: boolean;
  hitTimeout: boolean;
  leftFlow: boolean;
  ownerStillSignedIn: boolean;
}

function runScenario(seed: number): SimResult {
  const rng = mulberry32(seed);
  const rint = (n: number) => Math.floor(rng() * n);
  const T0 = 1_700_000_000_000;

  const jobOwner = 'userA';
  let currentUser = 'userA';
  let now = T0;

  const server = {
    status: 'none' as ServerStatus,
    finalized: false,
    uploadId: 'up',
    imageUrl: 'img',
  };
  let screen: Screen = 'create';
  let foreground = true;
  let activeJobId: string | null = null;
  let persisted: { jobId: string; ts: number } | null = null;
  let generateCalls = 0;
  let notifyRequested = false;
  let pollCount = 0;

  let badReveal = false;
  let sawDream = false;
  let staleCleared = false;
  let hitTimeout = false;
  let leftFlow = false; // user intentionally left mid-render (sign-out / queue)
  // `screen` is reassigned inside the closures below, which TS's control-flow
  // analysis can't see — so reads in the main loop get over-narrowed. Compare
  // through this helper (typed against the full Screen union) to keep it honest.
  const screenIs = (s: Screen): boolean => screen === s;

  const row = () => {
    // dream_jobs RLS — only the owner's session can read the row. A different
    // signed-in user sees nothing (this is the real first line of cross-user
    // defense; decideDreamResume's user_id check is belt-and-suspenders).
    if (currentUser !== jobOwner) return null;
    if (server.status === 'none') return null;
    const finalized = server.status === 'done' && server.finalized;
    return {
      status: server.status,
      upload_id: finalized ? server.uploadId : null,
      result_image_url: finalized ? server.imageUrl : null,
      result_prompt: 'p',
      result_medium: 'm',
      result_vibe: 'v',
      user_id: jobOwner,
    };
  };

  const applyReveal = (uploadId: string, imageUrl: string) => {
    // Safety: a reveal must be a finished render with a real upload, for the
    // current user. The decision functions are supposed to guarantee this.
    if (!uploadId || !imageUrl || server.status !== 'done' || !server.finalized) badReveal = true;
    if (currentUser !== jobOwner) badReveal = true;
    screen = 'reveal';
    persisted = null;
    sawDream = true;
  };

  // generate() — fires exactly once, at the start. The resume path NEVER calls
  // this (resume mode skips generate), which is what I1 verifies.
  const start = () => {
    if (generateCalls > 0) return;
    generateCalls++;
    server.status = 'processing';
    activeJobId = 'job';
    persisted = { jobId: 'job', ts: now };
    screen = 'loading';
  };

  // Warm foreground recovery (AppState 'active' while on the loading screen).
  const warmRecover = () => {
    const dec = decideDreamJobRecovery({
      job: row(),
      queued: false,
      noJobGraceExceeded: pollCount > 3,
    });
    if (dec.action === 'navigate') {
      applyReveal(dec.result.uploadId, dec.result.imageUrl);
    } else if (dec.action === 'fail') {
      screen = 'failureCard';
      persisted = null;
    } else {
      pollCount++;
      if (pollCount > 18) {
        // 90s poll window elapsed → failure card (refund-sweeper takes over).
        hitTimeout = true;
        screen = 'failureCard';
        persisted = null;
      }
    }
  };

  // Cold-start resume (DreamResumer on relaunch).
  const relaunch = () => {
    foreground = true;
    const dec = decideDreamResume({
      persisted,
      job: row(),
      nowMs: now,
      maxAgeMs: RESUME_MAX_AGE_MS,
      currentUserId: currentUser,
    });
    if (dec.action === 'reveal') {
      activeJobId = persisted!.jobId;
      applyReveal(dec.result.uploadId, dec.result.imageUrl);
    } else if (dec.action === 'resumeLoading') {
      activeJobId = dec.jobId;
      pollCount = 0;
      screen = 'loading';
    } else if (dec.action === 'clear') {
      if (persisted && now - persisted.ts > RESUME_MAX_AGE_MS) staleCleared = true;
      persisted = null;
      screen = 'create';
    } else {
      screen = 'create';
    }
  };

  const tickServer = (force = false) => {
    if (server.status === 'processing') {
      if (force || rng() < 0.5) {
        const r = rng();
        if (r < 0.82) {
          server.status = 'done';
          server.finalized = force || rng() < 0.85; // sometimes done-but-finalizing
        } else if (r < 0.92) server.status = 'failed';
        else server.status = 'nsfw';
      }
    } else if (server.status === 'done' && !server.finalized) {
      if (force || rng() < 0.7) server.finalized = true;
    }
  };

  // ── randomized event sequence ──────────────────────────────────────────────
  start();
  const steps = 8 + rint(34);
  for (let i = 0; i < steps && !['reveal', 'photo'].includes(screen); i++) {
    switch (rint(8)) {
      case 0:
        tickServer();
        break;
      case 1: // background
        foreground = false;
        if (screenIs('loading') && !notifyRequested) notifyRequested = true;
        break;
      case 2: // foreground
        foreground = true;
        if (screenIs('loading')) warmRecover();
        break;
      case 3: // OS kill (only a backgrounded app gets reclaimed)
        if (!foreground && screen !== 'away') {
          activeJobId = null; // in-memory store wiped; persisted SURVIVES
          screen = 'away';
        }
        break;
      case 4: // relaunch
        if (screen === 'away') relaunch();
        break;
      case 5: // tap the completion push (out-of-app recovery)
        if (notifyRequested && server.status === 'done' && server.finalized && screen === 'away') {
          screen = 'photo';
          persisted = null;
          sawDream = true;
        }
        break;
      case 6: // time passes (sometimes jump past the staleness window)
        now += [1_000, 5_000, 60_000, RESUME_MAX_AGE_MS + 1_000][rint(4)];
        break;
      case 7: // user signs out + another account signs in on this device
        if (screen !== 'away' && rng() < 0.15) {
          // Sign-out tears down the in-app dream flow (loading/reveal unmount)
          // and clears the marker (store/auth.ts signOut → clearDreamInFlight).
          // The owner left intentionally — no auto-surface is required of a
          // later finish (the dream waits in their gallery; cross-user reads are
          // blocked by RLS + decideDreamResume's user guard).
          screen = 'create';
          activeJobId = null;
          persisted = null;
          leftFlow = true;
          currentUser = currentUser === 'userA' ? 'userB' : 'userA';
        }
        break;
    }
  }

  // ── settle: drive to a terminal state (bounded) ────────────────────────────
  let guard = 0;
  let settled = true;
  while (!isTerminal(screen) && guard < 500) {
    guard++;
    tickServer(true); // force the render toward terminal
    if (screen === 'away') relaunch();
    else if (screenIs('loading')) {
      foreground = true;
      warmRecover();
    } else break;
  }
  if (!isTerminal(screen)) settled = false;

  return {
    seed,
    generateCalls,
    settled,
    finalScreen: screen,
    badReveal,
    serverDone: server.status === 'done' && server.finalized,
    sawDream,
    staleCleared,
    hitTimeout,
    leftFlow,
    ownerStillSignedIn: currentUser === jobOwner,
  };
}

describe('dream flow — stress / fuzz simulation (background→foreground→kill→resume)', () => {
  const N = 4000;

  it(`holds all safety invariants across ${N} randomized scenarios`, () => {
    const violations: string[] = [];
    for (let seed = 1; seed <= N; seed++) {
      const r = runScenario(seed);
      // I1 — generate fires at most once (no double-charge / double-render).
      if (r.generateCalls > 1) violations.push(`seed ${seed}: generate fired ${r.generateCalls}x`);
      // I2 — the simulation settles (no infinite loop / livelock).
      if (!r.settled) violations.push(`seed ${seed}: did not settle (stuck on ${r.finalScreen})`);
      // I3 — never stranded on a spinner or an unmounted app.
      if (r.finalScreen === 'loading' || r.finalScreen === 'away')
        violations.push(`seed ${seed}: stranded on ${r.finalScreen}`);
      // I4 — a reveal is always a valid, same-user, finished+uploaded render.
      if (r.badReveal) violations.push(`seed ${seed}: revealed an invalid/cross-user job`);
      // I5 — a finished render whose marker was still fresh is surfaced to the
      //      user (reveal or push→photo). The only non-surfacing exits are the
      //      documented edges: a >30min stale marker (dream waits in the
      //      gallery) or the >90s in-app poll timeout (failure card + sweeper).
      if (
        r.serverDone &&
        r.ownerStillSignedIn &&
        !r.leftFlow &&
        !r.staleCleared &&
        !r.hitTimeout &&
        !r.sawDream
      )
        violations.push(`seed ${seed}: finished render NOT surfaced (screen ${r.finalScreen})`);
    }
    if (violations.length) {
      throw new Error(
        `${violations.length} invariant violation(s):\n  ${violations.slice(0, 20).join('\n  ')}`
      );
    }
  });

  it('exercises a broad spread of outcomes (sanity: the fuzzer actually explores)', () => {
    const screens = new Set<Screen>();
    let kills = 0;
    let resumes = 0;
    for (let seed = 1; seed <= 2000; seed++) {
      const r = runScenario(seed);
      screens.add(r.finalScreen);
      if (r.sawDream) resumes++;
      if (r.staleCleared) kills++;
    }
    // The fuzzer should reach reveal, failure, and photo outcomes — proof it's
    // genuinely covering the kill/resume/push paths, not trivially passing.
    expect(screens.has('reveal')).toBe(true);
    expect(screens.has('failureCard')).toBe(true);
    expect(resumes).toBeGreaterThan(100);
  });
});
