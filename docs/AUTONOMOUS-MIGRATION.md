# Autonomous Bot Migration Plan

How Claude migrates a bot end-to-end without human input beyond "go migrate X".
Produces a hand-off report with scored renders. Kevin reviews + commits the
cutover. Target: 90% of former rendering quality within reasonable cost/time.

---

## Trigger

Kevin says **"migrate <botname>"**. Claude does everything below autonomously
until blocked or complete. Stops before the atomic cutover commit — Kevin
always reviews first.

## Phase A — Audit (~15 min)

1. Read `BOTS.<botname>` in `scripts/generate-bot-dreams.js`
2. Read `BOT_SEEDS.<botname>.strategies` in `scripts/lib/seed-generator.js`
3. Query DB for recent posts: `SELECT image_url, ai_prompt, dream_medium FROM uploads WHERE user_id = (SELECT id FROM users WHERE username = '<botname>') ORDER BY posted_at DESC LIMIT 20`
4. Eyeball a sample of the images to understand what makes the bot feel itself
5. Produce a mapping doc: old strategies → new paths, extract-axes → roll-axes, medium strategy, vibe set

## Phase B — Scaffold (~5 min)

Create directory tree:
```
scripts/bots/<name>/{index.js, shared-blocks.js, pools.js, paths/, seeds/, README.md}
scripts/gen-seeds/<name>/
```
Stamp per-path files, blank JSON seeds, placeholder generators.

## Phase C — Configure (~10 min)

Fill `index.js`:
- `username`, `displayName`
- Medium strategy (`defaultMedium` OR `mediums` OR `mediumByPath`)
- `vibes` (invert `excludeVibes`) + `vibesByMedium` (if old `pinVibes`)
- `paths`, `pathWeights`
- `bannedPhrases` (if old `banPhrases`)
- `rollSharedDNA` — shared axes for this bot type (character-centric vs scene-centric)

Fill `shared-blocks.js` with identity-anchor blocks:
- `REQUIRED_ELEMENTS_BLOCK` — what makes this bot THIS bot
- `HOT_AS_HELL_BLOCK` or tone-lock (if character-centric)
- `SOLO_COMPOSITION_BLOCK` (if character-centric)
- `SURREAL_EFFECTS_BLOCK` or atmosphere block

Fill `pools.js` with small hand-curated axes (skin/body/hair/eyes/glow/scene-palette etc.).

## Phase D — Sonnet-seed pools (~10 min, all parallel)

For each axis that needs ≥25 entries, write a generator in `gen-seeds/<name>/`
using `scripts/lib/seedGenHelper.js`. Launch all generators in parallel.

Target pool sizes:
- Path "moment" pools: **50 entries** (Sonnet-seeded, batched dedup)
- Closeup axes (poses, expressions, accents, environments): **50 each**
- Sub-flavor variants (human-touch, fashion-makeup): **25-30**

## Phase E — Per-path iteration loop (CORE WORK — ~15-25 min per path)

```
for each path in bot.paths:
    for round in 1..3:
        node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --label round<N>
        view each of 5 images via Read tool
        score each 1-5 against rubric below
        compute batch avg
        if batch avg >= 4.5/5 → mark path OK, break out of round loop
        else → diagnose dominant failure mode → apply fix → next round
    if still < 4.5 after round 3 → mark path PROBLEMATIC, log diagnosis, continue
```

### Rubric (score each render 1-5 on each dimension)

| Dimension | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|
| **Identity** | Unmistakably this bot | Mostly this bot | Generic-looking | Off-brand | Wrong character |
| **Path intent** | Perfectly matches path | Mostly right | Ambiguous | Wrong framing | Wrong path |
| **Composition** | Interesting, varied angle | Good framing | Standard | Cliché / same | Broken (crop, limbs, etc.) |
| **Diversity** | Obviously different from siblings | Clearly different | Slight variance | Similar | Dupe |
| **Technical** | Sharp, clean | Minor issues | Visible artifacts | Flawed (anatomy, second figure) | Unusable |

Score = sum of 5 dimensions (max 25). **Batch avg ≥ 22.5 (= 4.5/5) = pass.**

### Iteration decision tree

| Symptom observed | Fix to apply |
|---|---|
| Renders feel same-y within batch | Expand pool size OR add new axis OR increase recency window |
| Sonnet keeps using same noun (cigarette, galaxy, etc.) | Scan brief for that word, remove the example |
| Wrong character (not this bot) | Strengthen `REQUIRED_ELEMENTS_BLOCK`, tighten character pool |
| Too posed / catwalk / model-y | Reinforce `NO_POSING` language, scan pools for "pose"/"portrait" words |
| Second figures appear | Reinforce `SOLO_COMPOSITION_BLOCK`, grep pools for "man"/"crowd"/"target" |
| Wrong framing (closeup looks full-body) | Tighten the path's FRAMING section |
| Anatomy broken | Add "natural proportions" to brief; avoid over-specifying joints |
| Colors cluster across batch | Bump `scene_palette` recency window; expand pool if <20 |
| Flat / uninteresting | Add atmosphere block, expand environment pool |
| Path-specific moments feel stale | Regenerate that seed file with larger pool |

### Safeguards

- **3-round cap per path.** After 3 rounds, mark PROBLEMATIC + continue.
- **Spend cap.** ~$3-5 per bot. If >50% of paths hit PROBLEMATIC, HALT and report.
- **Never post to DB during iteration.** `iter-bot.js` without `--post`. No `bot_dedup` writes.
- **Never auto-commit cutover.** Stage everything, let Kevin review.

## Phase F — Cross-path diversity check (~5 min)

After all paths pass individually:
```
node scripts/iter-bot.js --bot <name> --count 5 --mode random --label diversity-check
```
Check the 5 renders for: path diversity, color diversity, composition diversity,
character/subject diversity. If any axis clusters, expand that pool and retry
once (max).

## Phase G — Stage cutover (~2 min, NOT committed)

Create but DO NOT commit:
- `.github/workflows/<name>.yml` (staggered cron, not overlapping other bots)
- Proposed edits to `scripts/generate-bot-dreams.js` + `.github/workflows/bot-dreams.yml` written but uncommitted

Write `scripts/bots/<name>/MIGRATION.md` with:
- Full config summary
- Per-path score history (round 1 / 2 / 3 for each)
- Problematic paths + diagnosis
- Diversity-check result
- Files staged, not committed
- "Ready for review — run `git status` to see everything staged"

## Phase H — Hand-off

Tell Kevin:
```
MIGRATION READY — <botname>
4 of 5 paths pass at 4.5+/5. 1 path (creature) PROBLEMATIC — see MIGRATION.md
Cost: $3.80
Files staged for atomic cutover, not committed.
Review renders in /tmp/<botname>-final/, then commit cutover.
```

---

## Calibration (first autonomous run only)

Before full autonomous execution, Claude proposes a **low-complexity bot first**
(e.g., BloomBot, EarthBot) and runs ONE round with scores + images shown to
Kevin before proceeding. This calibrates Claude's rubric against Kevin's taste.

After calibration: Claude runs all subsequent migrations fully autonomous.

---

## Rules that apply during autonomous migration

- **Never plant example verbs in briefs** (cigarette, galaxy, phone, etc.) — causes clustering
- **Solo compositions for character-centric bots** (no second figures)
- **Test batch size is always 5** unless explicitly asked for more
- **Never auto-post to DB** during iteration — `iter-bot.js` without `--post`
- **Never commit cutover** until Kevin reviews
- **Budget-halt** if >50% paths hit PROBLEMATIC cap
