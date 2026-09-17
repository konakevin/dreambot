/**
 * LOOKS_MINIMAL is a FIX GRAVEYARD — this guards the three fixes that fell into it.
 *
 * `looksPath = looksMode === 'on' && !LOOKS_MINIMAL` (nightly-dreams/index.ts). LOOKS_MINIMAL is `true`, so
 * looksPath is ALWAYS false in production, and the style contract is built and then thrown away:
 *
 *     } else if (!looksPath) {
 *       fallbackReasons.push(shadowStamp(contract));   // built, stamped, discarded
 *     }
 *
 * So LOOKS_MINIMAL does not mean "a lighter looks engine". It means "take the model pick, discard the looks
 * engine". Anything written inside `looksSlotInputFields` reaches ZERO renders while it is true, and it fails
 * SILENTLY: the render succeeds, the stamps look healthy, only the pixels are wrong.
 *
 * Three fixes have now been found dead in there, each after Kevin reported the symptom the fix was written for:
 *
 *   1. the vibe fragment          reached 0 of 50 nightlies          (found 2026-09-16)
 *   2. lookNeutralFraming         look ignored 78% of the time       (found 2026-09-16)
 *   3. the flux couple order      22/22 duals on the wrong order     (found 2026-09-17)
 *
 * #3 is the one this file was written for. `looksCouplePromptStyle` gives FLUX couples the album's LEGACY
 * order — it was shipped 2026-09-13 in answer to "a lot of these flux couple renders are really close up and
 * together … my last 30 public posts are flux, yet don't have this constraint", and then reached nothing,
 * because it was gated on looksPath. Kevin filed the SAME report four days later.
 *
 * These are source guards, not behaviour tests: the failure mode is a line that never executes, which a unit
 * test of the function itself cannot see (each of these functions passed its own tests while inert).
 */
import fs from 'fs';
import path from 'path';

const NIGHTLY_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const LOOKS_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyLooksPath.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('flux couples are NOT routed to the album (legacy) order under minimal', () => {
  // THIS BLOCK USED TO ASSERT THE OPPOSITE. On 2026-09-17 the per-model rule was patched forward so flux
  // couples got the legacy order for the album's environmental composition, and this test locked it in.
  // It was reverted the same night on measurement — flux-1.1-pro first-swap success:
  //
  //     subject_first, previous 7 days   174 couples   56% first try    0 moved to gemini
  //     legacy, that night                24 couples    4% first try   19 moved to gemini
  //
  // The wider framing shrinks the faces below what the dual split can separate. Nearly every couple
  // degraded — to a gemini couple at first, then (once the solo rung was fixed) to a single of self alone.
  // The composition ask stands; the lever is the POSE pools, not the prompt order. A test that locked the
  // wrong behaviour is worse than none, so this one now locks the revert and carries the number.
  it('the minimal path reads engine_config.couple_prompt_style, not the per-model rule', () => {
    const block = NIGHTLY_SRC.match(/promptStyle:\s*\n\s*force_prompt_style \?\?[\s\S]{0,300}?,\n/);
    expect(block).toBeTruthy();
    const b = strip(block![0]);
    expect(b).toContain(
      'looksPath ? looksCouplePromptStyle(looksModel) : sfaCfgCloser.couplePromptStyle'
    );
    expect(b).not.toContain('looksCouplePromptStyle(minimalModel)');
  });

  it('and the reason is written next to the line, so nobody re-applies it from the album screenshots', () => {
    expect(NIGHTLY_SRC).toContain('DO NOT route flux couples to the LEGACY order here');
    expect(NIGHTLY_SRC).toMatch(/4% first try/);
  });
});

describe('the flux couple rule itself', () => {
  it('flux couples get the album LEGACY order, everyone else subject_first', () => {
    expect(strip(LOOKS_SRC)).toContain(
      "return model && /flux/i.test(model) ? 'legacy' : 'subject_first'"
    );
  });

  it('gemini and grok are NOT swept into legacy — they measured 40/40 first swaps on subject_first', () => {
    // A blanket `couple_prompt_style = legacy` config flip would have done exactly that. It is the reason
    // this is a per-model function and not a config value.
    const fn = LOOKS_SRC.match(/export function looksCouplePromptStyle[\s\S]*?\n}/);
    expect(fn).toBeTruthy();
    expect(fn![0]).not.toMatch(/gemini|grok/i);
  });
});

describe('the two earlier casualties stay patched forward', () => {
  it('the vibe fragment is carried on the minimal branch', () => {
    // Found 2026-09-16 after reaching 0 of 50 nightlies. Lives in the `looksFields ? {} : {...}` escape hatch.
    expect(strip(NIGHTLY_SRC)).toContain('vibeFragment: looksVibeFragment');
    expect(strip(NIGHTLY_SRC)).toContain('vibeFragmentPosition: looksVibePosition');
  });

  it('lookNeutralFraming is carried on the minimal branch', () => {
    // Found 2026-09-16: the framing boilerplate says "photograph" 3x after naming the look, so a painted look
    // is outvoted in its own prompt. 2/9 -> 7/9 when on.
    expect(strip(NIGHTLY_SRC)).toContain('lookNeutralFraming: true');
  });

  it('all three live in the SAME escape hatch, so the pattern is greppable', () => {
    // Whoever adds the fourth one should find the other three sitting together.
    const hatch = NIGHTLY_SRC.match(/\.\.\.\(looksFields\s*\n?\s*\?\s*\{\}[\s\S]*?\}\),/);
    expect(hatch).toBeTruthy();
    expect(hatch![0]).toContain('vibeFragment');
    expect(hatch![0]).toContain('lookNeutralFraming');
  });
});

describe('the SOLO distance line rides the anchor on the live path', () => {
  // The sixth casualty (2026-09-17). Every solo prompt carries "shown from the knees up…" — in the tail
  // framing block ~1,400 characters in, where flux-1.1-pro ignores it (round-16 fixed-seed probe: the same
  // clause after the identity block left every seed a waist-up portrait; in the anchor before the face
  // clause, all three seeds opened up). `framingInAnchor` is that move and was set only in
  // looksSlotInputFields. Kevin, on three headshots in a row: "another huge face from this batch,
  // completely boring, can't see any background".
  it('minimal sends framingInAnchor for solos, keyed to the same flag the looks path uses', () => {
    expect(strip(NIGHTLY_SRC)).toContain(
      '...(selectedCast.length === 1 && LOOKS_SOLO_FRAMING_IN_ANCHOR ? { framingInAnchor: true } : {}),'
    );
  });

  it('and NOT for couples — every widening lever on flux-1.1-pro breaks the dual split', () => {
    // 56% -> 4% (album order), 23% -> 40% degrade (positive framing), 2 of 3 rebuilt (wide stances).
    // The condition is the lock: the flag is only ever sent when the cast is ONE person.
    const line = NIGHTLY_SRC.match(/\.\.\.\(([^)]*?)\? \{ framingInAnchor: true \}/);
    expect(line).toBeTruthy();
    expect(strip(line![1])).toContain('selectedCast.length === 1');
  });
});
