/**
 * THE COUPLE FALLBACK LADDER — what happens when a dual face swap cannot split two faces.
 *
 * Kevin, 2026-09-16 and again 2026-09-17: "i want couples to fail over to a single, so a flux couple
 * failure falls back to a flux single, then to gemini." The +1 is dropped DELIBERATELY rather than chased
 * across models.
 *
 * WHY THIS FILE EXISTS. That decision was made on 2026-09-16 and written up in a code comment — attached
 * to the WRONG options object. `maxRerenders: 0` landed on the degrade guard's options while the dual
 * pipeline kept its default of 2, so the intent was never actually applied and nobody noticed for a day.
 * Measured on 2026-09-17 over 7 organic couples: flux was picked first on 6, its first split failed on 5,
 * and every one of those shipped on GEMINI after a model-move re-render. An 80/20 flux/gemini config was
 * delivering roughly 0% flux couples, and the renders came back stiff and repetitive.
 *
 * A comment is not a lock. These are.
 */
import fs from 'fs';
import path from 'path';

const NIGHTLY_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const PIPELINE_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'dualSwapPipeline.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('a failed couple re-renders ONCE on the same model, then the single, then ONE model move', () => {
  // Kevin 2026-09-17 (late), after a true 20-night run: "we used to render couples pretty well". The 09-14..16
  // engine re-rendered every failed couple before degrading (17 of 17) and delivered 96% of couples as couples;
  // the immediate solo rung converted 25 of 45 failed couples to solos in a day. The chain is now:
  //   flux couple → flux couple AGAIN → flux single → gemini couple → gemini single → nobody
  it('the dual pipeline gets TWO re-renders and the solo rung starts at attempt 1', () => {
    const call = NIGHTLY_SRC.match(/genderSafeDualSwap\([\s\S]*?\n {6}\);/);
    expect(call).toBeTruthy();
    expect(strip(call![0])).toContain('maxRerenders: 2');
    expect(strip(call![0])).toContain('soloFromAttempt: 1');
  });

  it('attempt 1 stays on the model that just failed; attempt 2 walks the contract chain', () => {
    const N = strip(NIGHTLY_SRC);
    expect(N).toContain('if (attempt === 1) {');
    expect(N).toContain('fallbackReasons.push(`couple_retry:1:same_model:${pickedModel.replace(');
    expect(N).toContain('const pick = styleContract.forAttempt(attempt);');
    expect(N).not.toContain('styleContract.forAttempt(attempt + 1)');
  });

  it('the pipeline gates BOTH solo arms (split + identity) on soloFromAttempt', () => {
    const P = strip(PIPELINE_SRC);
    expect(P).toContain('const soloFromAttempt = opts.soloFromAttempt ?? 0;');
    expect(P).toContain(
      'if (opts.soloBetweenAttempts === true && attempt >= soloFromAttempt && attempt < maxRerenders) {'
    );
    expect(P).toContain(
      'if ( opts.soloBetweenAttempts === true && attempt >= soloFromAttempt && attempt < maxRerenders && min < identityDegradeFloor ) {'
    );
  });

  it('and the option sits in the DUAL pipeline call, not only on the degrade guard', () => {
    // The original bug in one assertion: `maxRerenders: 0` existed in the file, on the WRONG object — the
    // degrade guard's — so the dual pipeline kept its default of 2 and the documented intent never ran
    // for a day. Finding the option somewhere is not enough; it has to be in this call.
    const call = NIGHTLY_SRC.match(/genderSafeDualSwap\([\s\S]*?\n {6}\);/);
    expect(strip(call![0])).toMatch(/maxRerenders: \d/);
  });

  it('the pipeline honours maxRerenders — 0 means the original render only', () => {
    expect(strip(PIPELINE_SRC)).toContain('const maxRerenders = opts.maxRerenders ?? 2;');
    expect(strip(PIPELINE_SRC)).toContain(
      'for (let attempt = 0; attempt <= maxRerenders; attempt++)'
    );
    // rerender_for_dual is only pushed on attempt > 0, so with 0 it can never appear. That stamp is the
    // fingerprint of the old behaviour: if it shows up on a nightly couple again, the ladder regressed.
    expect(strip(PIPELINE_SRC)).toContain('if (attempt > 0)');
  });
});

describe('the order the pipeline degrades in', () => {
  it('dual → single → cascade, and never straight to cascade', () => {
    // A wrong-gender or wrong-person single is worse than no swap, so the cascade exists — but it must be
    // the LAST resort, after the single has been tried on the final render.
    const single = PIPELINE_SRC.indexOf("tryDegradeSingle(target, 'dual_degrade_single')");
    const cascade = PIPELINE_SRC.indexOf("reasons.push('dual_degrade_cascade')");
    expect(single).toBeGreaterThan(-1);
    expect(cascade).toBeGreaterThan(-1);
    expect(single).toBeLessThan(cascade);
  });

  it('the solo is attempted BETWEEN model moves, not only at the end', () => {
    // The rung Kevin asked for: couple on the rolled model → SOLO on that same model → next model.
    // Without this the ladder is "couple flux → couple gemini → solo", which is the order he rejected.
    expect(strip(PIPELINE_SRC)).toContain(
      'if (opts.soloBetweenAttempts === true && attempt >= soloFromAttempt && attempt < maxRerenders)'
    );
  });

  it('that rung is OPT-IN, so Create and onboarding keep chasing the couple', () => {
    // It changes what ships — a solo on the current model beats a couple the next model might deliver.
    // Right for nightly, wrong as a default.
    expect(strip(PIPELINE_SRC)).toContain('soloBetweenAttempts?: boolean;');
    const call = NIGHTLY_SRC.match(/genderSafeDualSwap\([\s\S]*?\n {6}\);/);
    expect(strip(call![0])).toContain('soloBetweenAttempts: true');
  });

  it('the single degrade is GENDER-SAFE — a refusal cascades rather than pasting on the wrong body', () => {
    // Closes the 2026-08-05 "sunnysteph's face on the man" hole. A null from singleSwap means the guard
    // refused; the pipeline must fall through, never ship.
    expect(strip(PIPELINE_SRC)).toContain(
      'const single = await deps.singleSwap(deps.selfSource, from)'
    );
    expect(strip(PIPELINE_SRC)).toContain("outcome: 'cascade'");
  });
});

describe('the solo rebuild stays on the SAME model where it can', () => {
  const STYLE_SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyStyle.ts'),
    'utf8'
  );

  it('forRebuild prefers the surface primary, falling to another model only if it is rejected there', () => {
    // This is what makes the ladder "flux couple → flux SINGLE" rather than "flux couple → gemini single".
    // Flux is approved on 43 of 57 solo looks against only 20 on couple, so in practice the rebuild
    // usually stays on flux — which is the point of the whole change.
    expect(strip(STYLE_SRC)).toContain("const pin = primaryFor(input.policy, 'solo');");
    expect(strip(STYLE_SRC)).toContain(
      'const restart = soloModels.includes(pin) ? pin : soloModels[0];'
    );
  });

  it('the rebuild pool still honours the SOLO rejections — a degrade is still a render of that look', () => {
    expect(strip(STYLE_SRC)).toContain(
      "const soloRejected = rejectedModelsFor(input.approvals, base.look.key, 'solo');"
    );
  });
});

describe('the SOLO ladder gets the same gemini rung', () => {
  const GUARD_SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'singleSwapGuard.ts'),
    'utf8'
  );

  it('the guard passes the attempt number, so the caller can switch models', () => {
    // Without this the callback cannot tell a retry from a model move and every attempt re-rolls the SAME
    // model — which is why a solo the guard could not make safe went straight to a faceless scene.
    expect(strip(GUARD_SRC)).toContain(
      'rerender: (attempt: number) => Promise<{ url: string; predictionId: string | null }>;'
    );
    expect(strip(GUARD_SRC)).toContain('const rr = await deps.rerender(attempt);');
  });

  it('nightly moves to the other model on the final solo attempt', () => {
    expect(strip(NIGHTLY_SRC)).toContain('const SOLO_MODEL_MOVE_ATTEMPT = 2;');
    expect(strip(NIGHTLY_SRC)).toContain(
      'if (attempt >= SOLO_MODEL_MOVE_ATTEMPT && styleContract)'
    );
    // Stamped, so a forensics read can tell a model move from an ordinary retry.
    expect(strip(NIGHTLY_SRC)).toContain('solo_model_move:');
  });

  it('and only when it is genuinely a DIFFERENT model', () => {
    // A one-model pool must not stamp a move it did not make.
    expect(strip(NIGHTLY_SRC)).toContain('if (pick.model && pick.model !== pickedModel)');
  });
});

describe('the SOLO rung must be able to fire at all', () => {
  it('the degrade guard gets at least ONE re-render, or the rebuild is dead code', () => {
    // THE BUG THIS LOCKS (2026-09-17). ensureSoloSwapTarget's loop probes attempt 0 BEFORE any re-render,
    // and on the degrade path attempt 0 is the failed COUPLE image — two people in frame. So with
    // maxRerenders: 0 the probe reads solo_multi_face(faces=2), the guard returns unsafe, and the
    // `rerender` callback that builds a genuine single from the cast is never called once.
    //
    // The ladder then read: couple on flux -> a solo attempt that ALWAYS refuses -> couple on gemini.
    // Measured on 5 consecutive organic couples, every one identical. A comment claimed the opposite.
    const call = NIGHTLY_SRC.match(/ensureSoloSwapTarget\([\s\S]*?\n {12}\);/);
    expect(call).toBeTruthy();
    const m = strip(call![0]).match(/maxRerenders: (\d+)/);
    expect(m).toBeTruthy();
    expect(Number(m![1])).toBeGreaterThanOrEqual(1);
  });

  it('and the rebuild it reaches is a REAL single built from the cast, not a prefix on the couple prompt', () => {
    // assembleSoloFallbackFromDual rebuilds from the dual's own slots with the partner dropped. The legacy
    // path glued "exactly one person" onto the couple prompt and kept rendering two people.
    expect(strip(NIGHTLY_SRC)).toContain('assembleSoloFallbackFromDual(');
    expect(strip(NIGHTLY_SRC)).toContain('solo_fallback:rebuilt_solo:');
  });
});
