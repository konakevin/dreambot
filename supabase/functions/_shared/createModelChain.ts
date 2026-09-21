// createModelChain.ts — pick a DIFFERENT model for a Create re-render.
//
// THE BUG (Kevin, 2026-09-21). generate-dream captures `pickedModel` once and hands the
// same value to all three retry closures, so a failing couple burns three renders on the
// model that just failed. His "Show me and Steph snowboarding" went
// flux-1.1-pro → flux-1.1-pro → flux-1.1-pro and degraded to a solo of him.
//
// FLUX_COUPLE_LAB.md lesson 6, measured: **"A repeated model is not a fallback."**
// Flux couple → flux couple again "burned the budget the later rungs needed and shipped
// faceless dreams"; the same composer on flux-2-flex held 20/20.
//
// WHY CREATE CANNOT JUST CALL nightly's resolveModel. Nightly rolls the medium, so it may
// move anywhere its policy row allows. Create's model is the USER'S pick, shown and
// charged before the render, which binds three things nightly never has to honour:
//
//  1. PRICE SHOWN == PRICE CHARGED. The user paid getSparkleCost(picked). A retry may hold
//     or LOWER that cost, never raise it — the same monotonic rule smartDream.ts:127-135
//     already states for style coercion. A pricier retry spends cents the charge did not
//     cover, silently.
//  2. THE DREAMSMART PROMISE. With DreamSmart on, the render is guaranteed to be a model
//     the chosen style renders well (`client_meta.smart_dream_models`). A retry outside
//     that set breaks the promise the checkbox makes.
//  3. THE RECORD MUST STAY HONEST. uploads.model drives the DreamCard badge. A move that
//     is not reported back leaves the badge naming a model that never ran — the exact
//     "uploads.model lies on retries" trap that cost a night of misdiagnosis
//     (feedback_measure_delivered_not_picked_one_variable).
//
// Pure and dependency-free so it is unit-testable: no DB, no Deno, no network. The caller
// supplies the candidate set, the cost function and the models already tried.

export interface CreateModelChainInput {
  /** The model that just failed, and every earlier attempt. Never re-picked. */
  tried: readonly string[];
  /** The style's DreamSmart set when DreamSmart is on, else the medium's allowed_models. */
  candidates: readonly string[];
  /** Sparkle cost lookup — the cap is derived from the FIRST model, the one charged. */
  costOf: (modelId: string) => number;
  /** A DLT replay freezes the model to reproduce an exact look; never move it. */
  frozen?: boolean;
  /** Injected for deterministic tests. */
  rng?: () => number;
}

export interface CreateModelChainResult {
  /** The model to render on, or null to stay on the current one. */
  model: string | null;
  /** Forensic stamp. Always present, so a no-move is as visible as a move. */
  stamp: string;
}

/**
 * The next model for a Create re-render, or null to stay put.
 *
 * Returns null (stay) rather than throwing on every degenerate input: no candidates, a
 * frozen replay, nothing affordable, nothing untried. Staying is exactly today's
 * behaviour, so this can only improve a retry or step aside.
 */
export function nextCreateModel(input: CreateModelChainInput): CreateModelChainResult {
  const { tried, candidates, costOf, frozen = false, rng = Math.random } = input;

  if (frozen) return { model: null, stamp: 'create_model_move:skip:frozen' };

  const current = tried.length > 0 ? tried[0] : null;
  if (!current) return { model: null, stamp: 'create_model_move:skip:no_current' };

  // The cap comes from the FIRST model tried, which is the one the user was charged for.
  // Deriving it from the most recent attempt would let a chain ratchet upward one cheap
  // step at a time.
  const cap = costOf(current);

  const seen = new Set(tried);
  const pool = candidates.filter((m) => !seen.has(m) && costOf(m) <= cap);

  if (pool.length === 0) {
    // Distinguish "nothing cheap enough" from "nothing left" — they call for different
    // fixes (a wider approved set vs a pricier tier) and both are invisible otherwise.
    const untried = candidates.filter((m) => !seen.has(m));
    return {
      model: null,
      stamp:
        untried.length > 0
          ? `create_model_move:skip:over_cap:${cap}`
          : 'create_model_move:skip:exhausted',
    };
  }

  // Cheapest first, so a retry actively reduces spend rather than merely capping it. Ties
  // break at random to avoid always hammering one provider on a bad day.
  const cheapest = Math.min(...pool.map(costOf));
  const affordable = pool.filter((m) => costOf(m) === cheapest);
  const model = affordable[Math.min(affordable.length - 1, Math.floor(rng() * affordable.length))];

  return { model, stamp: `create_model_move:${tried.length}:${model}` };
}
