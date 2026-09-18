/**
 * THE LOCKED NIGHTLY ENGINE — "1.2.0 with looks" (Kevin, 2026-09-13).
 *
 * The promise: the 1.2.0 engine builds the dream, and the ONLY things the new system decides are which look and
 * which vibe. These are source guards over `nightly-dreams/index.ts`, because the wiring that keeps that promise
 * lives in an edge function the unit lane cannot execute — the behaviour of the pure modules is covered by
 * nightlyStyle.test.ts, but nothing else proves the render path is actually wired to them. Each assertion below
 * corresponds to one line of the summary Kevin asked me to stand behind.
 */
import fs from 'fs';
import path from 'path';
import { LOOKS_MINIMAL } from '@engine/nightlyLooksPath';
import { PRIMARY_DIRECT_SHARE, LOOKS_ALL_MODELS } from '@engine/nightlyStyle';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
/** nightlyStyle.ts holds the model roll itself; the wiring claims below read it directly so they lock the
 *  MECHANISM rather than a particular split (the split is data in nightly_model_policy now). */
const STYLE_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyStyle.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('the locked engine is wired the way the summary says', () => {
  it('CLAIM: the 1.2.0 engine builds the dream — the looks path is OFF whenever the minimal state is on', () => {
    expect(LOOKS_MINIMAL).toBe(true);
    // looksPath gates ~25 substitutions (scene mix, location-action share, pose pools, framing, prompt order,
    // identity floors). If it were ever true in the minimal state, those would silently replace 1.2.0's values.
    expect(strip(SRC)).toContain("const looksPath = looksMode === 'on' && !LOOKS_MINIMAL;");
    expect(strip(SRC)).toContain("const looksMinimal = looksMode === 'on' && LOOKS_MINIMAL;");
  });

  it('CLAIM: the new catalogue decides the look and the vibe, by PINNING both into the 1.2.0 flow', () => {
    // The look reaches the engine as its medium (the force_look mechanism 1.2.0 already has), and the vibe is
    // pinned beside it. Anything less and the catalogue would be advisory while the legacy roll still decided.
    expect(strip(SRC)).toContain('await resolveMediumFromDb(contract.look.key)');
    expect(strip(SRC)).toContain('await resolveVibeFromDb(contract.vibe.vibe.key)');
    expect(strip(SRC)).toContain('modelFromLook: true');
  });

  it('CLAIM: the model comes from the contract, not the medium row inherited flux pin', () => {
    expect(strip(SRC)).toContain('if (minimalModel) return minimalModel;');
    expect(strip(SRC)).toContain(
      'faceSwapPrePickedModel || minimalModel || sceneBaseModelResolved'
    );
  });

  // REVERSED 2026-09-16 (Kevin: "shift the fallback from a failed couples render directly to a single, not a
  // couple on a different model"), then REVISED 2026-09-17 late (Kevin: "yeah, try that") after a true 20-night
  // run: the 09-14..16 engine re-rendered every failed couple before degrading and delivered 96% of couples as
  // couples; the immediate solo rung was converting them at the first-try failure rate. The chain is now
  //   flux couple → flux couple AGAIN (same model) → flux single → gemini couple → gemini single → nobody
  // REVISED AGAIN 2026-09-18 (NIGHTLY_CHAIN_V2_DESIGN.md): the same-model rung burned the budget the later rungs
  // needed (chain6: 2 faceless dreams in 20). Now: flux couple → couple on the next model → single → pure scene.
  it('CLAIM: a failed couple is re-rendered ONCE, on the next model, with no reuse-single between attempts', () => {
    const call = SRC.match(/genderSafeDualSwap\([\s\S]*?\n {6}\);/);
    expect(call).toBeTruthy();
    expect(strip(call![0])).toContain('maxRerenders: 1,');
    expect(strip(call![0])).not.toContain('soloFromAttempt');
    expect(strip(SRC)).toContain('const chainAttempt = attempt + 1;');
  });

  // 2026-09-16: grok removed from nightly entirely ("consistently makes ugly renders"), so the pool is two
  // models. The split was a HARDCODED constant (PRIMARY_DIRECT_SHARE) until 2026-09-17: 50% of renders went
  // straight to the first primary and the rest rolled uniformly, landing flux at 75% on a two-model pool. Every
  // change to a share meant editing TypeScript and deploying — done three times in one evening — while
  // `nightly_model_policy.primary_weights` sat in the database, already set deliberately, and was IGNORED by
  // this path: couple read 51/49 in the dashboard and rendered 75/25.
  //
  // The roll now reads those weights, so the configured number IS the share. This locks the wiring rather than
  // any particular split, because the split is data now and belongs in the database, not in a test.
  it('CLAIM: the live roll is WEIGHTED on the policy row, not on a hardcoded share', () => {
    expect(LOOKS_ALL_MODELS).toBe(true);
    const src = strip(STYLE_SRC);
    // It must consult the row's weights...
    expect(src).toContain('weightedList(primaries, row?.primaryWeights, excluded)');
    expect(src).toContain('pickWeighted(weighted, rng)');
    // ...and must NOT resurrect the direct-to-primary jump.
    expect(src).not.toContain('rng() < PRIMARY_DIRECT_SHARE');
  });

  it('PRIMARY_DIRECT_SHARE survives only as a deprecated export, unused by the roll', () => {
    // Kept so nothing importing it breaks. If it ever regains a caller, the split has silently moved back
    // into code and out of the database.
    const src = strip(STYLE_SRC);
    const uses = src.split('PRIMARY_DIRECT_SHARE').length - 1;
    expect(uses).toBeLessThanOrEqual(2); // the export line + its own doc comment
  });

  it('the minimal roll never runs behind a QA force_medium, which would fight the pin', () => {
    expect(strip(SRC)).toContain('if (looksMinimal && modelPolicy && !force_medium) {');
  });
});

/**
 * THE ACTION CHAIN (mig 516 + the 2026-09-13 fallbacks). Three rungs, each covering what the one above cannot:
 *   1. the row's own split action        — 2,691 couple rows
 *   2. the solo scene sentence itself    — 5,483 single rows whose action is not detachable
 *   3. a generated place-fitting beat    — the 260 couple rows that never had an action written
 * Only if all three are absent does the generic anchor apply. Source guards, because this wiring lives in the edge
 * handler; the resolver's own precedence is covered by castActionResolver.test.ts.
 */
describe('every cast dream reaches the model with something to DO', () => {
  it('rung 1: the row action is trimmed off the place text and handed to the resolver', () => {
    expect(strip(SRC)).toContain('dualScenarioAction = rowAction ??');
    expect(strip(SRC)).toContain('scenarioAction: dualScenarioAction');
    // the cut is exact because `action` is a verbatim slice of `scene` — no pattern matching at render time
    expect(strip(SRC)).toContain('s.scene.includes(rowAction) ? s.scene.indexOf(rowAction) : -1');
  });

  it('rung 2: a SOLO active row with no split action passes its scene sentence through, unrewritten', () => {
    expect(strip(SRC)).toContain("kind === 'active' && !isDualFaceSwap ? s.scene : null");
  });

  it('rung 3: with no action at all, a place-fitting beat is generated rather than falling to the anchor', () => {
    expect(strip(SRC)).toContain(
      '(dualActiveScene || soloActiveScene) && !dualScenarioAction && dualSpecialScene'
    );
    expect(strip(SRC)).toContain("fallbackReasons.push('scenario_action:generated')");
  });

  it('rung 3 fails OPEN — a generator outage keeps the old anchor instead of breaking the dream', () => {
    expect(strip(SRC)).toContain("fallbackReasons.push('scenario_action:generate_failed')");
    expect(strip(SRC)).toContain(
      "const beatKey = Deno.env.get('ANTHROPIC_API_KEY'); if (beatKey) {"
    );
  });
});

/**
 * HOLIDAY WIRING (2026-09-13). Two defects the Fall/Halloween audit found, both invisible to the unit lane because
 * they live in the edge function's control flow rather than in a pure module.
 */
describe('holiday wiring: the day-of pin and the scenario medium bans', () => {
  it('a LOOK PIN re-fits the model to that look own allowed_models, first pick AND retry chain', () => {
    // Without this the day-of look renders on whatever model the ROLLED look chose — on Oct 31,
    // halloween_digital_painting (three models, flux-1.1-pro not among them) could ship on flux-1.1-pro.
    expect(strip(SRC)).toContain('const pinAllowed = nightlyMedium.allowedModels ?? [];');
    expect(strip(SRC)).toContain('pinAllowed.length > 0 && !pinAllowed.includes(minimalModel)');
    expect(strip(SRC)).toContain('restrictModels: pinAllowed');
    // the refit must replace the contract, or only the first attempt is clipped
    expect(strip(SRC)).toContain('styleContract = refit;');
    // and it must not quietly re-roll the vibe while fixing a model
    expect(strip(SRC)).toContain(
      'pinnedLook: dualSceneMediumKey, restrictModels: pinAllowed, withVibes: false,'
    );
  });

  it('the pin re-fit fails OPEN and says so — a day-of render must ship', () => {
    expect(strip(SRC)).toContain('pin_model_fit_miss:');
  });

  it('a pin that does not resolve is STAMPED, never a silent fall-back to the rolled look', () => {
    // resolveMediumFromDb returns `canvas` for a key it cannot see, so without this stamp a mistyped or
    // de-activated day-of look drops the holiday style with no trace. (Found 2026-09-13 when a QA flag
    // restricted the medium pool and three day-of renders silently shipped the rolled look.)
    expect(strip(SRC)).toContain('scene_medium_unresolved:');
    expect(strip(SRC)).toContain('scene_medium_threw:');
  });

  it('scenario medium bans are TRANSLATED into look keys instead of compared to them', () => {
    expect(strip(SRC)).toContain(
      "import { expandMediumBans } from '../_shared/legacyMediumBans.ts';"
    );
    expect(strip(SRC)).toContain(
      'const bannedLooks = expandMediumBans(bannedMediums, catalog.looks);'
    );
    expect(strip(SRC)).toContain('if (bannedLooks.has(nightlyMedium.key)) {');
  });

  it('a banned look RE-ROLLS THE LOOK, never the legacy random face-swap medium', () => {
    // The legacy branch calls resolveMediumFromDb('dream_eligible_face_swap', …), which would throw the whole
    // style contract away. The minimal branch must re-run the contract with the banned keys excluded.
    expect(strip(SRC)).toContain('excludeLookKeys: bannedLooks,');
    expect(strip(SRC)).toContain('look_medium_ban:');
    expect(strip(SRC)).toContain('look_medium_ban_nofit:');
  });

  it('the minimal branch is ordered BEFORE the legacy ban branch so it actually runs', () => {
    const minimalAt = SRC.indexOf('looksMinimal && minimalModel && bannedMediums.length > 0');
    const legacyAt = SRC.indexOf('bannedMediums.includes(nightlyMedium.key)');
    expect(minimalAt).toBeGreaterThan(-1);
    expect(legacyAt).toBeGreaterThan(-1);
    expect(minimalAt).toBeLessThan(legacyAt);
  });

  it('retries KEEP the look, because the minimal path never re-assembles the prompt', () => {
    expect(strip(SRC)).toContain('lockLook: true,');
  });

  it('both re-runs go through ONE contract builder, so the roll cannot drift between them', () => {
    expect(strip(SRC)).toContain('const buildMinimalContract = async (opts?: {');
    // exactly three call sites: the first roll, the pin re-fit, the ban re-roll
    expect(SRC.split('await buildMinimalContract(').length - 1).toBe(3);
  });
});

/**
 * QA FLAG TRAPS (2026-09-13). Two flags silently switch the engine into a DIFFERENT mode, so a QA batch that
 * passes them proves nothing about production. Both cost a wasted render batch during the holiday audit; these
 * guards make the coupling visible in the test output instead of in a confusing set of stamps.
 */
describe('QA flags that silently change which engine runs', () => {
  it('force_look IS force_medium — so it turns the minimal looks engine OFF entirely', () => {
    // `const force_medium = force_look ?? force_medium_raw` and the minimal block is gated on `!force_medium`.
    // A QA batch passing force_look therefore renders on the 1.2.0 legacy chain with no contract at all.
    expect(strip(SRC)).toContain(
      'const force_medium: string | undefined = force_look ?? force_medium_raw;'
    );
    expect(strip(SRC)).toContain('if (looksMinimal && modelPolicy && !force_medium) {');
  });

  it('force_face_swap_eligible makes the render a FIRST DREAM and curates the medium pool', () => {
    // firstDreamMediumMode returns 'cast' for it, which restricts every medium resolution to the 7 curated
    // first-dream styles — that silently defeats a day-of look pin (it resolves to canvas instead).
    expect(strip(SRC)).toContain(
      'const fdMode = firstDreamMediumMode({ forceFaceSwapEligible: force_face_swap_eligible,'
    );
    expect(strip(SRC)).toContain(
      'const firstDreamAllow = fdMode ? firstDreamAllowedMediums(fdMode, await fetchMediums()) : undefined;'
    );
  });
});

/**
 * THE LOOK'S FRAGMENT REACHES THE PROMPT (2026-09-14).
 *
 * The gap that let the override library repaint 45 of 100 production renders for a week: every test asserted the
 * look was PINNED AS THE MEDIUM (it was), and none asserted the look's own fragment survived into the prompt.
 * The 1.2.0 override library replaced it right before render, unstamped. These guards close that hole.
 */
describe('nothing may silently repaint the look', () => {
  it('the override library is reachable ONLY through the guard', () => {
    // A bare call site is how this regressed: four of them accumulated, each added for a good local reason,
    // none aware the looks catalogue had made the library an overwrite rather than a substitute.
    const calls = SRC.split('pickFaceSwapModelOverride(').length - 1;
    // 1 = inside lookFragmentOverrideFor, 1 = the dead looksPath branch (gated on LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY)
    expect(calls).toBe(2);
  });

  it('the guard turns the library OFF for every looks-engine render', () => {
    expect(strip(SRC)).toContain('if (looksMinimal && minimalModel) {');
    expect(strip(SRC)).toContain("fallbackReasons.push('look_override_library:off:looks_engine');");
  });

  it('every outcome is STAMPED — a silent substitution is the actual bug', () => {
    for (const stamp of [
      'look_override_library:off:looks_engine',
      'look_override_library:exempt:force_look',
      'look_override_library:applied:',
      'look_override_library:no_entry',
    ]) {
      expect(strip(SRC)).toContain(stamp);
    }
  });

  it('the guard is declared before every site that repaints baseMedium.fluxFragment', () => {
    const guardAt = SRC.indexOf('const lookFragmentOverrideFor =');
    expect(guardAt).toBeGreaterThan(-1);
    const repaints = [...SRC.matchAll(/fluxFragment: (\w+)/g)].filter(
      (m) => m[1] !== 'nightlyMedium' && m[1] !== 'medium'
    );
    expect(repaints.length).toBeGreaterThan(0);
    for (const m of repaints) expect(m.index).toBeGreaterThan(guardAt);
  });
});

/**
 * SCENE-ONLY NIGHTLIES USE THE LOOKS CATALOGUE (Kevin, 2026-09-14: "i want the nightly scene only dreams to use
 * the new looks").
 *
 * Every nightly look is `is_scene_eligible = false` BY CONSTRAINT — mig 495's dream_mediums_nightly_look_isolated
 * keeps looks out of the Create picker and the generic pools. The 1.2.0 scene re-roll tested exactly that flag, so
 * a pure_scene nightly discarded the rolled look and replaced it with a legacy medium. The DB cannot be the fix
 * (flipping the flag violates the constraint), so the render keeps a look the engine already chose.
 */
describe('scene-only nightlies keep their catalogue look', () => {
  const stripped = strip(SRC);

  it('a look the engine already pinned is NOT re-rolled away on a scene render', () => {
    expect(stripped).toContain('const looksPinnedMedium = looksMinimal && !!minimalModel;');
    expect(stripped).toContain(
      'if ( isSceneComposition && !force_medium && !looksPinnedMedium && !nightlyMedium.isSceneEligible ) {'
    );
  });

  it('keeping the look is STAMPED, so the log names the look a scene render actually used', () => {
    expect(stripped).toContain('fallbackReasons.push(`scene_look_kept:${nightlyMedium.key}`);');
  });

  it('the re-roll still runs for NON-looks renders — an addition, not a removal', () => {
    // force_medium and the legacy path must be untouched: a legacy medium that cannot render a scene still
    // re-rolls exactly as it did before.
    expect(stripped).toContain('!force_medium && !looksPinnedMedium');
    expect(stripped).toContain("composition === 'pure_scene' ? 'dream_eligible_scene'");
  });

  it('the guard is computed before the branch that reads it', () => {
    const declared = SRC.indexOf('const looksPinnedMedium =');
    const used = SRC.indexOf('!looksPinnedMedium &&');
    expect(declared).toBeGreaterThan(-1);
    expect(used).toBeGreaterThan(declared);
  });

  it('the DB route stays closed — looks must remain isolated from Create', () => {
    // mig 495: CHECK (NOT nightly_look OR (is_public=false AND is_dream_eligible=false AND is_scene_eligible=false))
    const mig = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'migrations', '495_nightly_look_surfaces.sql'),
      'utf8'
    );
    expect(strip(mig)).toContain(
      'CHECK (NOT nightly_look OR (is_public = false AND is_dream_eligible = false AND is_scene_eligible = false))'
    );
  });
});
