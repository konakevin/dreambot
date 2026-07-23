# DreamSmart Model Validation — the model × style face-swap matrix

**This is the runbook.** When Kevin says **"go set up the DreamSmart config for `<model>`"** (a
new image model, or a regrade of an existing one), this doc is the exact end-to-end workflow: render
a self face-swap of that model across **every** style, grade the results in an HTML page, and turn the
grades into that model's per-style DreamSmart membership.

Strategy + history live in **`SMART_DREAM_PLAN.md`**. This doc is the *how*. The rule itself is
implemented in `supabase/functions/_shared/smartDream.ts` (edge) + `constants/imageModels.ts` +
`lib/dreamSmartModel.ts` (client), and locked by `__tests__/lib/{smartDream,dreamSmartModel,imageModels}.test.ts`.

---

## 1. What DreamSmart is (the thing this validates)

DreamSmart is a **per-style allow-list of models** that render that style well. A user who picks
"Watercolor" must get a watercolor, never a glossy photo — style fidelity is a function of **the
model**, not the prompt. Each style stores its approved set on its `dream_mediums` row:

```jsonc
// dream_mediums.client_meta
{
  "smart_dream_models": ["black-forest-labs/flux-2-pro", "google/gemini-2-image", ...],
  "smart_dream_default": "google/gemini-2-image"   // legacy; see note below
}
```

- **`smart_dream_models`** is a **set** — membership is all that matters. A model in the set is
  offered (and, in DreamSmart mode, allowed to render) for that style.
- **`smart_dream_default`** is legacy. The auto-select is no longer the default — it's the model
  shown **first in the picker** (Standard before Premium; see `MODEL_DISPLAY_ORDER`). Order inside
  `smart_dream_models` does **not** affect the auto-select. Leave `default` as any in-set model.

This one config drives **three runtimes** (keep them honest — they all read the same `client_meta`):

1. **Create screen** — the model picker filters to the set; if the user's pick isn't in it, we
   render with the first-in-picker model and show the swap sheet (`lib/dreamSmartModel.ts`).
2. **Server coercion** — `enqueue-dream` / `generate-dream` coerce an out-of-set forced model to the
   same first-in-picker model, so **price shown == price charged** (`coerceSmartDream`).
3. **Nightly** — picks from each rolled style's set, **capped at ≤2 sparkles** (`nightlyModelPool.ts`).
   ⇒ Adding a model costing >2✦ to a style helps Create but is ignored by nightly. That's fine.

---

## 2. When to run the matrix

- **A new image model was added** to `constants/imageModels.ts` — validate it before adding it to
  any style's set. New models start **out** of every set until the matrix proves them per-style.
- **A regrade** — we suspect a model was mis-graded (e.g. "flux-1.1-pro is durable and renders most
  styles fine, but it's excluded from a lot of them"). Re-render + re-judge.

---

## 3. Run the matrix

The harness is **`scripts/model-matrix-swap.js`**. It renders through the REAL pipeline by seeding
`dream_jobs` + `dream_queue` rows and letting the worker drain them into `generate-dream` on the
`x-dream-queue` service path. That path assumes enqueue already charged, so it **does NOT bill
Kevin**. Renders land in Kevin's **private "My Dreams"** album (`is_posted=false`) AND download to
`~/dreambot-model-matrix/renders/`.

For a model regrade, force a **single self face-swap** (`--only-role self`) across **every active
style**, for the model(s) under test:

```bash
node scripts/model-matrix-swap.js \
  --models "black-forest-labs/flux-1.1-pro,black-forest-labs/flux-1.1-pro-ultra" \
  --mediums "photography,pixels,watercolor,film_noir,vintage_film,canvas,anime,double_exposure,heirloom,lego,animation,comics,claymation,vinyl,pop_art,fairytale,handcrafted,pencil,glamour,illustration" \
  --only-role self
```

- Get the **current style list** (and each style's existing membership for the model) with the query
  in §6 — don't hardcode a stale list; styles change.
- Each style has a fixed neutral **scene** (`SCENE_BY_MEDIUM`) with settings only, no style words, so
  the style's own medium fragment owns the look — an apples-to-apples fidelity test. Add a scene for
  any new style so it isn't tested against the generic cafe fallback.
- `--only-role self` is the model-validation role. (`plus_one` / `dual` exist for face-swap-pipeline
  QA — a different question; see `scripts/qa-dual-faceswap-matrix.js`.)
- Runs at concurrency 3 through the queue; ~10–20 min for 40 renders. Results JSON →
  `~/dreambot-model-matrix/results-<N>.json`.

---

## 4. Grade it

Two things are being judged per cell, and **both** must pass for the model to earn that style:

1. **Style fidelity** — did the model render the *style*? Watercolor looks painted, comics looks
   inked, pop-art looks pop-art. The classic failure for the flux-1 family is **photoreal drift**:
   painterly styles come back as glossy photos, graphic styles as semi-real. That drift is the whole
   reason DreamSmart exists.
2. **Face integration** — is the self face-swap clean and recognizable? Grade the **face only**
   (integration + resemblance); ignore hair/clothing/background — hair variance is fine. (See the
   standing rule: "the face is the only thing that matters in the face swap.")

Grade **from the renders** — this is Kevin's call, not something to assert mechanically. The agent's
job is to *present* the renders side-by-side, note the obvious mechanical facts (rendered ok, actual
model used, any `fallback_reasons`), and let Kevin judge the look. Verdicts: **PASS** (style +
face both good) / **WEAK** (borderline) / **FAIL** (style flattened or face broke).

---

## 5. Build the HTML grading page

Renders are local, so the page is a local `index.html` referencing `renders/*.png` — open it from
disk (NOT an Artifact: the Artifact CSP blocks the images). For a **model regrade**, the useful view
is **styles as rows × the model(s) under test as columns**, each cell showing the render plus the
style's **current IN/OUT membership** for that model so the delta is obvious:

```bash
# focused regrade page (styles × models-under-test + current membership badge)
node scripts/model-matrix-regrade-page.js
# → ~/dreambot-model-matrix/regrade.html   (then Kevin opens + grades)
```

The generic full-matrix page (all models as columns, self/+1/dual rows) is
`scripts/model-matrix-page.js` — use that when validating one new model against the whole roster.
Show Kevin the page; he marks each cell PASS/WEAK/FAIL.

---

## 6. Turn grades into DreamSmart config

For each style, the model is **IN** the set iff Kevin graded it **PASS** (WEAK/FAIL → out).

Read the current membership + edit the sets:

```js
// current membership for a model across all active styles:
node -e '
require("dotenv").config({ path: ".env.local" });
const sb = require("@supabase/supabase-js").createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const M = "black-forest-labs/flux-1.1-pro"; // model under test
  const { data } = await sb.from("dream_mediums")
    .select("key,label,is_active,client_meta").order("sort_order");
  for (const m of data.filter(x => x.is_active)) {
    const set = m.client_meta?.smart_dream_models || [];
    console.log(`${set.includes(M) ? "IN " : "-  "} ${m.key}\t(${set.length})`);
  }
})();'
```

Apply the deltas. Two acceptable ways (match how the last DreamSmart change was shipped):

- **Migration file** (source of record) — add `supabase/migrations/<next>_dreamsmart_<model>.sql`
  that `UPDATE dream_mediums SET client_meta = jsonb_set(...)` per style, run by hand in the SQL
  editor. Preferred for auditability.
- **Live service-role script** — a one-off node script that patches `client_meta.smart_dream_models`
  for the changed styles (how Grok's `392`/`393` were applied live). Faster; still write the
  migration for the record.

Guardrails when editing a set:
- **Never let a set go empty** and never drop a style's last ≤2✦ model — nightly needs one (§1).
- Adding a model is client-visible immediately (config is DB-driven, no app build).
- After the config change, redeploy the two coercion functions so server == client:
  `supabase functions deploy enqueue-dream --no-verify-jwt` and `... generate-dream ...`.
- The picker auto-select is `MODEL_DISPLAY_ORDER`-first, so you don't need to order the set.

---

## 7. The shorthand

> **"Go set up the DreamSmart config for `<model>`."**

Means, end to end: (1) run the self matrix across every active style for `<model>` (§3); (2) build
the regrade HTML page and **show Kevin** (§5); (3) after Kevin grades, add `<model>` to the
`smart_dream_models` of every **PASS** style and remove it from WEAK/FAIL ones (§6); (4) redeploy the
coercion functions; (5) confirm the deltas back to Kevin. Don't self-grade the look — Kevin judges
from the page.

---

## Files

- `scripts/model-matrix-swap.js` — the render harness (no-charge, real pipeline).
- `scripts/model-matrix-regrade-page.js` — focused styles × model(s) regrade page (+ membership badge).
- `scripts/model-matrix-page.js` — generic full-roster matrix page.
- `supabase/functions/_shared/smartDream.ts` — `lowestPricedModel` / `coerceSmartDream` (the rule).
- `constants/imageModels.ts` (`MODEL_DISPLAY_ORDER`, `lowestPricedModel`) + `lib/dreamSmartModel.ts`
  (`resolveDreamSmartModel`) — the client mirror.
- `supabase/functions/_shared/nightlyModelPool.ts` — nightly's ≤2✦ pick from the same sets.
- `SMART_DREAM_PLAN.md` — strategy + original grading history.
