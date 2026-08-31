---
name: mine-posts
description: Mine the QUARANTINED bad-render pool for trends. Scans every admin-flagged render (uploads.quarantined_at IS NOT NULL) for commonalities — scene pool, specific scenario seed, location, biome, pose pool, medium, AI model, medium×model combo, nightly-vs-bot, bot seed path, face-swap mode, swap-failure reasons — NORMALIZED by base rate so high-volume pools don't false-positive. Produces a ranked-trends HTML report + concrete "fix/remove/retune this pool/seed/combo" recommendations, and pulls the offending images to eyeball. The ongoing feedback loop that turns flagged junk into algorithm fixes.
---

# mine-posts — Bad-Render Pool Trend Mining

Kevin flags bad renders with the admin one-tap red X (quarantine, migration 449). Those
renders are hidden from everyone but PRESERVED with durable provenance (`uploads.seed_source`,
migration 450). **Your job: find the patterns in what gets flagged, so we can weed out and
retrain the render pools that keep producing junk.** This is a recurring analysis tool — run it
whenever Kevin wants a fresh read on the pool.

You are a **data analyst with taste**. Two failure modes to avoid:
1. **Raw-count fallacy** — a pool/medium that's flagged a lot might just be RENDERED a lot. The
   signal is the **flag RATE** (flags ÷ total renders of that pool), not the count. Always
   normalize by base rate, with a min-sample floor so a 1/1 doesn't top the chart.
2. **Over-reading small samples** — early on the pool is tiny. Say "N=3, suggestive not
   conclusive" rather than declaring a trend from two flags. Report confidence honestly.

---

## The data model (what you're mining)

**`uploads` (durable, the canonical source)** — service-role read, PostgREST. Flagged rows:
`quarantined_at IS NOT NULL`. Relevant columns:
- `quarantined_at`, `quarantine_reason` (default `'bad_render'`)
- `dream_medium`, `model`, `face_swap_mode`, `ai_prompt`, `image_url_display`, `created_at`
- **`seed_source` jsonb** — the durable provenance stamped at render time:
  ```json
  { "source":"nightly"|"bot",
    "kind":"active|goofy|elegant|holiday:<season>|location|scenario",  // the scene POOL
    "scene":"<scenario seed text, the per-seed identifier>" | null,
    "posePool":"<pose pool>" | null,
    "location":"<place>" | null,
    "biome":"<biome>" | null,
    "bot":"<bot name>" | null,     // bots only
    "path":"<bot render path = its seed pool>" | null }  // bots only
  ```

**`ai_generation_log` (RICHER but EPHEMERAL)** — join `l.job_id = u.job_id` (nightly) . Adds
`rolled_axes` (chaosTier, composition, nightlyPath, faceSwapResult, dualFaceCount…) and
`fallback_reasons` (swap failures: `no_dual_split`, `identity_below_threshold`,
`pure_scene_fallback`, `dual_ultra_clamped_to_pro`, `active_pose:<x>`, `bespoke_pose_solo:<pool>`
…). **CAVEAT: this table auto-prunes at 30 days (migration 274).** So the log join only enriches
renders flagged within ~30 days of rendering. For anything older, `seed_source` on the upload is
all you have — that's exactly why it exists. Bots do NOT write ai_generation_log at all; their
only provenance is `seed_source`.

**How to query** (mirror the existing scripts): a node script reading `.env.local`
`SUPABASE_SERVICE_ROLE_KEY` + `EXPO_PUBLIC_SUPABASE_URL`, hitting `/rest/v1/…` with the service
key (bypasses RLS + column grants). **PostgREST caps reads at 1000 rows — paginate.** The
`rolled_axes` JSONB scans time out on wide windows — narrow the time range or select only the
columns you need. Write the script to the scratchpad, not the repo.

---

## Dimensions to analyze (group flagged renders by each)

Compute, for EACH value in each dimension: **flag_count**, **total_renders** (the denominator),
and **flag_rate = flag_count / total_renders**. Rank by flag_rate (min-sample floor, e.g. ≥5
total renders), and ALSO show raw flag_count so you see both volume and rate.

1. **Scene pool** — `seed_source->>'kind'` (active / goofy / elegant / holiday:X / location).
2. **Specific scenario seed** — `seed_source->>'scene'` (the exact seed; a repeat-offender
   scenario is the highest-value find — that one seed row can be pulled/reworded).
3. **Location** — `seed_source->>'location'`.
4. **Biome** — `seed_source->>'biome'`.
5. **Pose pool** — `seed_source->>'posePool'`.
6. **Medium** — `dream_medium`.
7. **AI model** — `model`.
8. **Medium × model combo** — the classic "this combo is ugly" (e.g. watercolor × grok).
9. **Source** — `seed_source->>'source'` (nightly vs bot split).
10. **Bot + path** — `seed_source->>'bot'` + `seed_source->>'path'` (a junk bot seed path).
11. **Face-swap mode** — `face_swap_mode` (single / dual / null).
12. **Swap-failure signatures** (recent, via ai_generation_log) — `fallback_reasons` tallies
    (`no_dual_split`, `pure_scene_fallback`, low `identity_sim`…). Ties a flag to a swap defect.

**Getting the denominators:** `total_renders` per value = the same GROUP BY over ALL uploads
(not just quarantined) that carry `seed_source` (i.e. rendered after migration 450 shipped
2026-08-30). For dimensions present on every upload (`dream_medium`, `model`, `face_swap_mode`)
you can denominate over all uploads. Be explicit in the report about the denominator window so a
rate is interpretable.

---

## Process

1. **Scope it.** Count total quarantined (`quarantined_at IS NOT NULL`). If tiny (<~15), say so
   and keep conclusions modest. Split by `source` (nightly vs bot).
2. **Pull the flagged pool** — paginate all quarantined uploads with `seed_source`,
   `dream_medium`, `model`, `face_swap_mode`, `image_url_display`, `job_id`, `created_at`.
3. **Pull denominators** — grouped totals over all seed_source-bearing uploads for each dimension.
4. **Compute + rank** each dimension by flag_rate (with the min-sample floor) and by raw count.
5. **Cross-tabulate the hot spots** — e.g. within the worst medium, which model? within the
   worst pool, which scenario seed? Find the specific intersection, not just marginals.
6. **Enrich recent flags** with `ai_generation_log` (job_id join, <30d) for swap-failure
   signatures — is the junk a SWAP failure (faceless / wrong face) vs an aesthetic failure?
7. **Eyeball the offenders** — download `image_url_display` for the top ~4 flagged renders in each
   hot category into a scratchpad dir and Read a few, so the recommendation is grounded in what
   the junk actually looks like (not just numbers).
8. **Report** (below).

---

## Output — an HTML report + a spoken summary

Write an HTML report to `~/Desktop/mine-posts-<date>.html` (follow the artifact-design skill's
utilitarian bar — real hierarchy, a considered palette, thumbnail galleries, tabular-nums for the
counts). Include:
- **Header stats**: total quarantined, date range, nightly-vs-bot split.
- **Ranked trends per dimension**: a table per dimension — value · flag_count · total · flag_rate
  · a bar. Sorted by rate, min-sample floor applied, small-N flagged as low-confidence.
- **Hot intersections**: the specific combos (medium×model, pool×scenario, bot×path) that
  dominate.
- **Thumbnail galleries**: the actual offending images for the top 2-3 hot categories.
- **Recommendations** — the payoff. For each real trend, a concrete action: *pull/reword this
  scenario seed*, *drop this medium×model combo from rotation* (like the flux-1.1-pro-ultra ban),
  *retune this location/biome*, *pull this bot path*, *this is a swap defect not an aesthetic one
  (fix the pipeline, not the pool)*. Rank by confidence × impact.

Then give Kevin a tight spoken summary: the 3-5 strongest patterns, each with count/rate + the
recommended action, and an honest confidence note. Open the HTML with `open`.

---

## Cautions

- **Flag RATE, not raw count.** Re-state this to yourself before ranking. A high-volume pool with
  a normal flag rate is NOT a problem.
- **Min-sample floor.** Don't let a 1/1 or 2/2 top the chart. Require a reasonable denominator
  (≥5 renders) before trusting a rate; surface low-N finds separately as "watch".
- **seed_source is durable; the log is not.** Never build a trend that depends on
  ai_generation_log for OLD flags — it's pruned at 30 days. Lead with `seed_source`.
- **Swap defect vs aesthetic defect.** A faceless/wrong-face flag (see `fallback_reasons`) points
  at the SWAP PIPELINE, not the seed pool — don't recommend pulling a good scenario for a swap
  bug. Separate these in the report.
- **Read-only + throttled.** Only SELECTs. Paginate (1000-row cap). Narrow windows on the JSONB
  columns to avoid statement timeouts. Nothing written to prod; scripts go to the scratchpad.
- **Don't auto-act.** This skill FINDS trends and RECOMMENDS. Pulling seeds / banning combos /
  retuning pools is a separate, Kevin-approved step (and bot/pool work must re-read
  `BOT_SCENE_QUALITY_PLAYBOOK.md` first).
