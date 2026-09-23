/**
 * THE CREATE ENGINE SWITCHES ARE ACTUALLY WIRED.
 *
 * Source guards over `generate-dream/index.ts`, modelled on `minimalEngineWiring.test.ts`, which
 * exists for exactly this reason: "the wiring that keeps that promise lives in an edge function the
 * unit lane cannot execute — the behaviour of the pure modules is covered [elsewhere], but nothing
 * else proves the render path is actually wired to them."
 *
 * That is not a hypothetical. `LOOKS_MINIMAL` is a documented fix graveyard: four shipped fixes
 * reached ZERO renders because the path they lived on was switched off, and nobody noticed for
 * weeks. Every one of them passed its own unit tests.
 *
 * The five switches from migration 541 and the one from 542 all shipped with pure-module tests and
 * no wiring test. These close that gap: if someone deletes a call site, renames a config field, or
 * guards a branch behind something that is never true, this fails in CI rather than in a batch
 * three days later.
 */
import fs from 'fs';
import path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'generate-dream', 'index.ts'),
  'utf8'
);

describe('generate-dream reads every create_* switch', () => {
  // The camelCase names engineConfig.ts exposes. A rename on either side breaks the render
  // silently — the field just reads undefined and the feature is off forever.
  it.each([
    ['createCoupleEngine', 'the narrative_fg couple composer'],
    ['createRetryChangesModel', 'moving model on a re-render'],
    ['createPromptSceneSplit', 'splitting the prompt into setting + action'],
    ['createActivityWardrobe', 'dressing for the activity'],
    ['createSceneAxes', 'rolling a time of day and weather'],
    ['createOutfitRolls', 'the per-person outfit plan (mig 547)'],
    ['createOutfitUserLock', "reading and locking the user's own outfit words"],
    ['createOutfitIndependentPct', 'the independent-colour roll'],
    ['createOutfitSeparateCutPct', 'the separate-silhouette roll'],
    ['createOutfitPatternPct', 'the pattern roll'],
    ['createOutfitPreviewUserIds', 'the preview accounts'],
  ])('reads %s (%s)', (field) => {
    expect(SRC).toContain(field);
  });
});

describe('generate-dream calls the modules those switches gate', () => {
  it('composes couples through coupleComposerX when the engine is experimental', () => {
    expect(SRC).toContain("from '../_shared/coupleComposerX.ts'");
    expect(SRC).toContain('composeExperimentalCouple(');
    // The variant is the one the lab measured at 92%, not whatever default the module ships.
    expect(SRC).toContain("variant: 'narrative_fg'");
    // Guarded on genuinely-dual slots, or a solo would be composed as a couple.
    expect(SRC).toContain("'left_wardrobe' in slotResult.slots");
  });

  it('moves model on a re-render instead of re-rolling the one that failed', () => {
    expect(SRC).toContain("from '../_shared/createModelChain.ts'");
    expect(SRC).toContain('nextCreateModel(');
    // The retry closures must call the mover, not the captured pickedModel. If this regresses,
    // every attempt lands on the model that just failed — the bug this fixed.
    expect(SRC).toContain('retryModel()');
  });

  it('splits the prompt instead of spending it whole as the place', () => {
    expect(SRC).toContain("from '../_shared/promptSceneSplit.ts'");
    expect(SRC).toContain('splitPromptScene(');
    // The split must reach BOTH ends: the place slot and the action slot. Feeding only one
    // re-creates half the bug.
    expect(SRC).toContain('setAtOverride: sceneSplit.setting');
    expect(SRC).toContain('sceneSplit?.action');
  });

  it('passes the activity-wardrobe flag into the slot input', () => {
    expect(SRC).toContain('activityWardrobe: true');
  });

  it('rolls scene axes instead of sending the empty strings it used to', () => {
    expect(SRC).toContain("from '../_shared/createSceneAxes.ts'");
    expect(SRC).toContain('rollCreateSceneAxes()');
  });
});

describe('the render record reports what actually rendered', () => {
  it('logs the moved model, not the picked one', () => {
    // uploads.model drives the DreamCard badge; model_used and cost_cents drive the spend
    // record. A retry that moved model while these still read pickedModel is precisely the
    // "uploads.model lies on retries" trap.
    expect(SRC).toContain('renderedModel()');
    expect(SRC).toContain('modelUsedOverride');
    expect(SRC).not.toMatch(/model_used:\s*pickedModel/);
    expect(SRC).not.toMatch(/cost_cents:\s*getCostCents\(pickedModel\)/);
  });
});

describe('the composer is not routed through the graveyard', () => {
  it('does not import the LOOKS_MINIMAL path', () => {
    // nightlyLooksPath.ts is inert in production (LOOKS_MINIMAL = true). Anything Create
    // routes through it reaches zero renders, which is how four earlier fixes died.
    // Matches an IMPORT, not any mention — the call site carries a comment naming the file
    // to explain why it is avoided, and that comment is documentation, not wiring.
    expect(SRC).not.toMatch(/from\s+'[^']*nightlyLooksPath/);
  });
});

describe('generate-dream wires the outfit plan (mig 547) into both cast paths', () => {
  it('reads the user outfit request alongside the split and rolls one plan', () => {
    expect(SRC).toContain("from '../_shared/outfitPlan.ts'");
    expect(SRC).toContain("from '../_shared/outfitSpec.ts'");
    expect(SRC).toContain('extractOutfitSpec(userSubject, outfitLegend, ANTHROPIC_KEY)');
    expect(SRC).toContain('planOutfits(');
  });

  it('couples: the plan reaches the slot pipeline input', () => {
    expect(SRC).toContain('...(coupleOutfitPlan ? { outfitPlan: coupleOutfitPlan } : {})');
  });

  it("solo: the plan reaches the compiler, and Sonnet's text is enforced before post-processing", () => {
    expect(SRC).toContain('...(soloOutfitPlan ? { outfitPlan: soloOutfitPlan } : {})');
    expect(SRC).toContain('enforceSoloOutfit(soloText, soloPerson)');
    expect(SRC).toContain('finalPrompt = postProcessPrompt(soloText, compiled.postProcess)');
  });
});
