/**
 * dimensions.js — WHAT MAKES AN IMAGE MODEL GOOD FOR DREAMBOT.
 *
 * This is the canonical definition. The runner (scripts/eval-model.js) executes these,
 * the report renders them, and .claude/skills/model-eval/SKILL.md tells an agent how to
 * judge the ones a machine cannot. One list, so a dimension can never be measured
 * against one bar here and a different bar in the write-up.
 *
 * Every bar below is either MEASURED from this engine's own history or derived from a
 * hard constraint in the pipeline. None of them are taste. Where a bar came from an
 * incident, the incident is named, because the bar is only defensible with its story
 * attached — and because the next person to argue "surely that's too strict" needs to
 * see what it cost.
 *
 * THE ONE-LINE VERSION: a model is good for DreamBot if it renders the medium we asked
 * for, puts people where we said, comes back in time, at the right shape, and leaves
 * faces the swap can find and replace without the result looking pasted on.
 */

/**
 * Some dimensions a machine can settle; some it cannot, and pretending otherwise is how
 * this evaluation went wrong before. Two automated style graders were built on
 * 2026-09-16 and BOTH failed their own control — v1 called all 53 renders "artwork",
 * v2 gave order-dependent verdicts on 8 of 17. So `judge: 'human'` is a hard property,
 * not a TODO: those dimensions render evidence and stop.
 */
const JUDGE = { AUTO: 'auto', HUMAN: 'human' };

const DIMENSIONS = [
  // ── Phase 0-1: cheap, automatic, and fatal. Kill a bad candidate for pennies. ──
  {
    key: 'plumbing',
    phase: 0,
    title: 'The engine can call it at all',
    judge: JUDGE.AUTO,
    why: `Provider dispatch in _shared/generateImage.ts is BY PREFIX: openai/ → the OpenAI
      provider, gemini/ → Gemini, xai/ → xAI, and ANYTHING ELSE falls through to Replicate
      with our default input body. So a new Replicate model usually works immediately via
      force_model with no DB row, while a new OpenAI/Gemini/xAI model needs a map entry
      first (gpt-image-2.5 needed OPENAI_MODEL_MAP + per-model render defaults). The
      common first failure for a Replicate model is a SCHEMA mismatch — our body sends
      aspect_ratio/num_outputs/output_format/output_quality and a model with a different
      input schema 422s. seedream-4 has a special case in generateImage.ts for exactly
      this; a new one may need the same.`,
    bar: 'one bare render returns an image',
    fatal: true,
  },
  {
    key: 'aspect',
    phase: 1,
    title: 'Renders true 9:16 portrait',
    judge: JUDGE.AUTO,
    why: `The app's cards are 9:16 (0.5625). gpt-image-1/2 accept size only from a fixed
      enum whose nearest portrait is 1024x1536 = 2:3 (0.667), which is WIDER — that is what
      "gpt-image-2 renders wide images" meant when it was pulled from the nightly rotation,
      and it is unfixable rather than a tuning problem. Display cannot rescue it: the feed
      crops and full-screen letterboxes, and a server-side centre-crop butchers off-centre
      subjects. gpt-image-2.5 by contrast takes arbitrary WIDTHxHEIGHT and does true 9:16.`,
    bar: 'returns 0.5625 ± 0.02, or accepts an explicit 9:16 pixel size',
    fatal: true,
  },
  {
    key: 'resolution',
    phase: 1,
    title: 'Small enough for the Edge runtime to survive',
    judge: JUDGE.AUTO,
    why: `Bigger is NOT better here, but MEASURE WHY before repeating the folklore. The
      received wisdom was that large output "defeats the face detector" — the reason given
      for the flux-1.1-pro-ultra ban at ~4MP. Tested directly 2026-09-16 on seedream-4.5,
      whose floor is 3.69MP: the dual swap held on 8 of 8 multi-person renders. At that
      size the detector is FINE.
      What actually breaks is the EDGE RUNTIME. Two of those ten renders died outright —
      one HTTP 546 WORKER_RESOURCE_LIMIT and one timeout — because decoding a 3.69MP image
      inside the function blows Supabase's per-invocation memory/CPU budget, the same
      failure that made the swap path ask for JPEG rather than PNG. Latency moves with it
      too: p50 79s at 3.69MP versus 52s at 1.86MP, against a 140s ceiling.
      That distinction matters because the failures are WORSE than the thing we feared. A
      degraded swap still ships a picture; a 546 ships nothing after taking a sparkle and a
      queue slot. So the bar stands, for reliability and latency rather than detection.
      Still unverified: whether the ultra ban's stated cause was ever right. Somewhere
      between 3.69MP and 4MP either the detector starts failing or it never did.`,
    bar: 'output ≤ ~2.5 megapixels (or a smaller size is selectable) — for Edge stability',
    fatal: false,
  },
  {
    key: 'latency',
    phase: 1,
    title: 'Finishes inside the render timeout',
    judge: JUDGE.AUTO,
    why: `The worker holds the render's HTTP connection synchronously. RENDER_TIMEOUT_MS is
      140s for create/DLT and 120s for first-dream, both deliberately under the 150s gateway
      idle ceiling. A model whose p95 crosses that does not render slowly, it FAILS — and it
      fails after consuming a queue slot and a sparkle charge. "150s timeouts" is half the
      reason gpt-image-2 is banned.`,
    bar: 'p95 < 140s, p50 comfortably under',
    fatal: true,
  },
  {
    key: 'cost',
    phase: 1,
    title: 'Costs about what we pay now',
    judge: JUDGE.AUTO,
    why: `MEASURE it, never quote a marketing page. Measured 2026-09-16 at $30/1M output
      tokens: gpt-image-2 at our production 1024x1536/medium = 1372 tokens = $0.041, while
      2.5 at 1152x2048/HIGH = 1413 tokens = $0.042 and at medium = 367 = $0.011. The
      intuition "the newer high-quality one must cost more" was wrong by 4x.`,
    bar: '≤ ~1.2x flux-1.1-pro per render at the quality we would actually ship',
    fatal: false,
  },

  // ── Phase 2: does it actually make the ART we asked for? ──
  {
    key: 'medium_fidelity',
    phase: 2,
    title: 'Renders the requested medium, not a photograph',
    judge: JUDGE.HUMAN,
    why: `The whole look catalogue depends on this. A model that collapses every prompt to
      photoreal has no use in a system whose value is "your dream as a chromolithograph".
      Two traps: (1) judge the BASE render, because a swapped one shows photographic faces
      by definition and that is the swap, not the model; (2) our own framing boilerplate can
      sabotage the test — a nightly prompt names the look once and then says "photograph"
      three more times, which measured a pinned classical_oil at 2/9. So test in a CLEAN
      ROOM first: bare prompt, one medium word varying, nothing else.`,
    bar: '≥7/9 renders unmistakably in the requested medium, per family',
    fatal: true,
  },
  {
    key: 'prompt_adherence',
    phase: 2,
    title: 'Renders the things the prompt names',
    judge: JUDGE.HUMAN,
    why: `Measured with a prompt carrying N discrete checkable facts (a count, a colour, a
      named object, an action) so the verdict is countable rather than impressionistic.
      Known model-specific behaviours to watch for, all measured on flux-1.1-pro: it COUNTS
      repetitions, it obeys prompt POSITION more than prompt length, and negation LEAKS —
      naming a banned token tends to render it.`,
    bar: '≥80% of the named facts present',
    fatal: false,
  },
  {
    key: 'hard_priors',
    phase: 2,
    title: 'What it renders regardless of what we ask',
    judge: JUDGE.HUMAN,
    why: `Every model has facts it will not be argued out of, and they silently override the
      prompt. flux-1.1-pro renders older men BEARDED in 12 of 12 probes whatever the prompt
      says, while gemini and grok obey clean-shaven. This is not a pass/fail — it is a map.
      Priors that are discovered get designed around; priors that are missed produce months
      of "why does it keep doing that".`,
    bar: 'no verdict — DISCOVER and record them, they are permanent',
    fatal: false,
  },

  {
    key: 'scene_range',
    phase: 2,
    title: 'Handles everything nightly actually throws at it',
    judge: JUDGE.HUMAN,
    why: `A model that nails a quiet street at midday can still go flat in a lamplit room,
      lose a couple at night, or render a technically-correct EMPTY frame where the product
      needs a lush one. Nightly does not give a model one kind of job: 174 places from reef
      to catacomb, interiors and exteriors, empty landscapes and couples, golden hour
      through pitch dark. So this samples the axes the engine actually varies — warm
      directional, flat diffuse, harsh contrast, artificial interior, night, dappled;
      interior vs exterior; people vs no people — and each is chosen to be hard in a
      different way rather than merely different. Two of these carry extra weight: NIGHT,
      because that is precisely where flux couples break (1/10 vs 16/28) while its solos
      are 7/7, and LUSHNESS, because "no plain renders" is a standing bar here and a model
      can obey every word of a prompt and still deliver a frame nobody wants to look at.`,
    bar: 'every cell renders, none go plain or muddy; report per-cell rather than averaged',
    fatal: false,
  },

  {
    key: 'vibe_fidelity',
    phase: 2,
    title: 'Responds to our vibe fragments',
    judge: JUDGE.HUMAN,
    why: `Vibes are the main source of variance between one night and the next — the same
      place and the same look should not feel the same in "cozy" and in "moonlit". Each
      active vibe carries an authored flux_fragment (40 of the 60 live vibes have one)
      describing light and atmosphere, injected at its configured fragment_position.
      A model that ignores these makes every night look alike no matter how good a single
      render is.
      TEST IT WITH A WITHIN-ARM CONTROL, never by rendering a vibe and deciding it looks
      vibey: the same scene WITH the fragment and WITHOUT it, everything else identical.
      That control is what proved the vibe fragment was reaching 0 of 50 nightlies — the
      renders looked perfectly plausible on their own, and only the paired comparison
      showed the fragment was doing nothing. A/B against a different vibe cannot show it,
      because two different scenes always differ somehow.`,
    bar: 'the fragment visibly moves the render in the direction it describes, ≥7/9 pairs',
    fatal: false,
  },

  // ── Phase 3-4: the swap. This is where most models actually fail. ──
  {
    key: 'geometry',
    phase: 3,
    title: 'Can be TOLD where to put heads',
    judge: JUDGE.AUTO,
    why: `THE HEADLINE TEST, and the single best reason to adopt a new model. The dual swap
      can only place the +1's face when the render shows TWO cleanly separated faces; when
      heads overlap the detector cannot split them (no_dual_split), the pipeline degrades to
      a solo swap, and the partner's likeness is silently DROPPED. That is 21% of production
      couples losing their +1. flux-1.1-pro CANNOT be told about head geometry — probed
      directly 2026-09-14, and a full day was lost rediscovering it, so any plan whose
      mechanism is "add or strengthen a geometry clause" is known-dead on flux. A model that
      passes this fixes a failure we currently cannot fix. Measured with /analyze, which
      runs the SAME YuNet detector that gates the real swap, so the result predicts
      production rather than approximating it.`,
    bar: '≥7/9 renders with exactly 2 significant, separable faces when asked for a gap',
    fatal: false,
  },
  {
    key: 'composition',
    phase: 3,
    title: 'How large it draws faces',
    judge: JUDGE.AUTO,
    why: `Not pass/fail, but it EXPLAINS the swap result, and mistaking it for a medium
      problem is precisely what produced four wrong verdicts about gpt-image-2.5. Measured
      2026-09-16 on one model, one look, one scene, varying only framing: at ~70px face
      height the swap is invisible and the painted look survives; at ~350px the identical
      swap reads photographic and the seam is obvious. The BASE was correctly painted in
      both. So a model that composes tight is not "bad at mediums" — it just puts more
      pasted pixels on screen. Report bboxFrac so the swap findings can be read correctly.`,
    bar: 'report median bboxFrac; flag a tight framer as a swap-visibility risk',
    fatal: false,
  },
  {
    key: 'swap_technical',
    phase: 4,
    title: 'Couples survive the dual swap',
    judge: JUDGE.AUTO,
    why: `Measured from fallback_reasons, never by eyeballing the image. AND THE TEST MUST
      INCLUDE A NIGHT VIBE: flux couples fail the dual swap on night vibes specifically,
      1/10 versus 16/28 elsewhere, while flux SOLOS are 7/7. A model tested only on bright
      scenes can pass here and still fail in production, because the guard is per
      (model x surface x vibe), not per model.`,
    bar: 'dual_degrade_single ≤10% across ≥9 couples including night vibes',
    fatal: false,
  },
  {
    key: 'identity',
    phase: 4,
    title: 'Faces still look like the person',
    judge: JUDGE.AUTO,
    why: `IDENTITY_MIN_SIM = 0.35 is the engine's floor and it was measured, not guessed:
      100 pairs, gap 0.221 -> 0.525, zero errors. Caveat worth carrying: ArcFace is
      hair-invariant, so a good score does NOT guarantee the render looks like the person to
      a human. Treat the number as a floor, not as proof.`,
    bar: 'mean identity_sim ≥0.5, zero renders below the 0.35 floor',
    fatal: false,
  },
  {
    key: 'swap_natural',
    phase: 4,
    title: 'The swapped face does not look pasted on',
    judge: JUDGE.HUMAN,
    why: `Judged on BASE-vs-SWAPPED PAIRS, at the model's own typical face scale, because
      the question is not "is there a seam" but "is there a seam at the size this model
      actually draws faces". Pull the base from the render's own log rather than
      re-rendering: rolled_axes.observability.replicateRawUrl holds the raw pre-swap output,
      so the comparison is the same seed and costs nothing. A re-render is a different
      sample and cannot prove what THIS image looked like before the swap.`,
    bar: 'seam not obvious at that model’s median bboxFrac',
    fatal: false,
  },

  // ── Phase 4b: the consolation prize, and the reason to keep going after a fail. ──
  {
    key: 'scene_only',
    phase: 4,
    title: 'Good for scene-only dreams even if cast fails',
    judge: JUDGE.HUMAN,
    why: `Scored separately on purpose. scene_eligible_models is its own config list, so a
      model that renders gorgeous places but cannot hold a swap still has a home in
      pure-scene nightlies and bots. Failing the cast dimensions is not the end of the
      evaluation.`,
    bar: 'medium fidelity holds on people-free scenes',
    fatal: false,
  },
  {
    key: 'refusals',
    phase: 4,
    title: 'Does not refuse ordinary dream prompts',
    judge: JUDGE.AUTO,
    why: `Every provider has its own safety system and they refuse different things. OpenAI
      surfaces content_policy_violation as a 400, which we re-throw with an NSFW_CONTENT:
      prefix so the retry logic can fail over. A model with a twitchy filter turns ordinary
      romantic-couple and swimwear prompts into failed paid renders. Related: Haiku 4.5
      refuses vision probes that carry a justification, so keep probe prompts
      justification-free.`,
    bar: '<5% refusal on the standard prompt set',
    fatal: false,
  },
];

/** Dimensions for one phase, in declaration order. */
function forPhase(phase) {
  return DIMENSIONS.filter((d) => d.phase === phase);
}

/** A failed FATAL dimension stops the evaluation — no point spending renders on medium
 *  fidelity for a model that cannot hit 9:16 or times out. */
function fatalKeys() {
  return DIMENSIONS.filter((d) => d.fatal).map((d) => d.key);
}

function byKey(key) {
  return DIMENSIONS.find((d) => d.key === key) || null;
}

/** Whitespace-collapse a `why` for terminal printing. */
function why(key) {
  const d = byKey(key);
  return d ? d.why.replace(/\s+/g, ' ').trim() : '';
}

module.exports = { DIMENSIONS, JUDGE, forPhase, fatalKeys, byKey, why };
