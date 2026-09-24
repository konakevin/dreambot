---
name: reseed
description: Resume the seed-pool reseed program — pick the next SUBJECT pool from RESEED_STATUS.md, repair it in place (unique entries of the SAME kind, never a new scheme), make the path let the entry through, prove it with forced shadow renders Kevin reviews in the app, and record the result. Use whenever Kevin says "reseed", "next path", "continue the seed pool work", "fix the pools", "pool repair", or asks where the reseed program stands.
---

# Reseed — repairing a bot's subject pool so its scenes actually vary

You are continuing a program that has been proven once (BloomBot `flower-friends`, 2026-09-23) and
is tracked pool by pool in **`RESEED_STATUS.md`**. Read that file first: it holds the goal in Kevin's
words, the definition of DONE, the status table, the queue and the log. Then read this skill. Then
`SEED_POOL_REPAIR_HANDOFF.md` §2 and §9 (the rule that was broken once, and the pilot's ledger) and
`SEED_DIVERSITY_CHARTER.md` §6c (decision log: things already tried and rejected, do not re-propose
them). Before touching any bot file, re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` in full (CLAUDE.md rule)
and specifically its section "flower-friends — a SUBJECT-POOL repair is invisible while the template
carries its own subject source".

## What we are trying to accomplish

Kevin: the bots feel repetitive after a few weeks. The cause is not shallow pools, it is pools whose
entries are one idea in several wordings, and paths whose templates render the same picture whatever
the entry says. The program fixes ONE subject pool at a time so that every entry is a genuinely
different idea of the same kind, and the path shows it. The pilot proved this works: the same 8
entries rendered as 8 visibly different scenes once the pool was repaired AND the path let the entry
through.

## Scope, non-negotiable

- **SUBJECT pools only**: the pool whose entries say what the render is OF (`SUBJECT_POOL_MAP.json`
  names it per path). Axis pools (lighting, palette, camera, weather, mood, look, medium) and
  appearance pools (eyes, hair, outfit) are out of scope.
- **Public bots only.** Skip alphabot, mechbot, outlawbot, retrobot.
- **A repair must not change what the pool IS.** Same format, register, setting words, prompt prefix,
  entry count. Never invent categories, axes or a scheme. Never delete originals. Kevin, verbatim:
  _"Don't change the fabric/essence of a pool while working to fix it … just keep the original intent
  of the pool and try to fill it with unique entries."_
- **Dry run first, show Kevin samples, then write.** Back the pool up outside the repo before writing.
- **One variable per round. Measure delivered, not intended.**
- **Path fixes are path-only.** A bot-wide prefix or hero mandate is never edited for one path; give
  the path its own branch (`promptPrefixReplaceByPath`, `promptSuffixByPath`, a `heroMandate` branch,
  its own template lines), the way `hanging-flowers` and `flower-friends` do in BloomBot.
- **Accepted Flux limits, do not chase:** a species renders in its own prior colour whatever the
  word says; a colour register only reads on strong-colour families. Kevin: _"you can't force Flux
  out of its trained data, the existing behaviours are fine."_
- Hard rules from CLAUDE.md apply: ≤3 concurrent renders, headroom-gated; explicit-path commits and
  read the staged diff; never `git add -A`; no em dashes in prose; short, plain messages to Kevin.

## The recipe (what the pilot proved; every step has a reason)

### 0. Pick the pool and write its intent down

`node scripts/reseed/queue.js` prints the candidates worst first (lexical floor, slot-suffix match:
verify). Prefer finishing a bot before starting another. Read: the path file header, the archetype
template, the pool itself (all of it), and the bot's `index.js` for that path. Write ONE paragraph:
what the pool is (its varying element, its fixed skeleton, its register), what the path does with it.
Put the pool in `RESEED_STATUS.md` as `analysing`. If the intent is unclear (as flower-friends' pastel
rule was), ask Kevin before generating anything.

### 1. Define "the same" for THIS pool, on its varying element

The generic lexical measure (`ideaSimilarity.js`, `scan-bot-seed-dupes.js`) is a floor and a
tripwire, not a judge (charter §4). Parse each entry into its varying element (flower species; a
place + its geology; a creature + its action; a setting type) and define when two entries are the same
idea in THOSE terms (pilot: share 4+ of 5-6 species). State the basis with every number you quote.

### 2. Plan: keep the first of each group, rewrite the rest in place

Group entries by the rule; the first of each group in pool order is kept verbatim; every later member
becomes a rewrite slot (same index, same format). Distribute what the pool is short of evenly across
the slots (colour families, sub-types, registers) so the rewrites fill gaps instead of adding more of
the dominant idea. Roll independent attributes independently (the pilot coupled register to colour
family by alternating one and rotating the other: avoid).

### 3. Pre-assign the varying element from a real roster; the LLM only words it

Never let Sonnet choose the varying element (it converges on the same dozen items batch after batch,
and it invents colours/cultivars). Build a roster of real items with their real attributes, assign per
slot least-used first under a per-item cap and a pairwise rule (share ≤2 items with every other entry),
then have Sonnet write the entry in the pool's exact format from the assignment. Check the assignment
came back (missing/extra = reject), check the format with a regex, check the pool's bans (no insects /
people / text-prone nouns / negation as the pool demands), and check reality with a second Sonnet call
phrased as a family-level question with "when in doubt, answer true" (Haiku rejected real answers).
A same-idea LLM judge is advisory: record its note, do not let it block (it reads "same colour
family" as "same idea").

Tool: clone `scripts/repair-flower-focal-cluster.js` (the pilot's, 900 lines, dry run by default,
`--execute --from <proposal>` writes after a backup, `--resume <report>` fills what a previous run left).
The parts to rewrite per pool are marked at the top: the parser (`flowerItems`/`keyOfItem`), the
roster + attribute letters, `FORMAT_RE`, `BANS`, the family/attribute plan, and the Sonnet brief. The
pipeline (plan → assign → write → check → report → execute) is reusable as is. When the second pool
is done, factor the shared part into `scripts/reseed/lib/` and leave a per-pool config module.

### 4. Dry run, review page, Kevin's OK, execute

The dry run writes `proposal.json` + `report.json`. Build a review page of every before/after pair
with a summary (entries, distinct before → after with basis, species/items, families, registers) and
publish it as an artifact; put ~6 pairs inline in the message. Wait for Kevin's OK. Then `--execute`
(it backs the pool up to `~/poolbackup-<bot>-<pool>-<ts>.json`, writes, re-parses, asserts the count).
Commit the pool + tool at once (Kevin: commit immediately on approval). Status → `pool written`.

### 5. Make the path let the entry through (this decided everything on the pilot)

Before a single render, list every layer that fixes the picture regardless of the entry, and neutralise
each for THIS path only:

- **A second subject source in the template**: a STRICT species roster / palette / setting list
  injected after the entry (Sonnet swapped the entry's flowers for the roster on 1 of 3). Remove it.
- **A fixed colour cast or register mandate** in the template, prefix, medium fragment or hero
  mandate ("soft pastel MANDATORY", "warm golden light", "jewel-saturated"). Tie the wording to the
  entry's own attribute with one example per value, or drop it.
- **Frame-packing / density mandates**: the bot-wide `PROMPT_PREFIX` (first tokens of the Flux
  prompt), a `LUSH_HERO`-style hero mandate, "FULL OF FLOWERS", "filling the lower 60%", "background
  of more blooms". Give the path its own hero branch (composition over density), its own
  `promptPrefixReplaceByPath` (short, positive, no negation: it is concatenated straight into Flux),
  its own `promptSuffixByPath`.
- **Pool-generation language living in a render template** ("across the pool of 25, ~4 BLUE"). Cut.
- **Output order**: the STRUCTURE block reaches Flux at ~100%, prose at ~0%. Put the entry's varying
  element (and any co-hero, e.g. the focal insect) in the FIRST bracket, and any attribute the entry
  carries (its register) as a fixed phrase in the prompt. The pilot's insect went from 52-59% of the
  prompt (invisible, 1 of 11) to 33-41% (visible, 8 of 8) with this change alone.
- Do NOT add a new medium key for the path unless a `dlt_clean_mediums` row comes with it (Dream Like
  This on that bot's posts would lose its clean medium).
- Avoid "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" wording in new brief text (Sonnet refuses ~1 in 4).

Verify with a brief dry run (see `scratchpad`-style `verify-force.js` in the handoff §9: wrap
`bot.buildBrief` with a picker proxy, print the brief, grep for the removed blocks and the new ones).

### 6. Prove it with forced renders, paired

`node scripts/reseed/render-forced-entries.js --bot <bot> --path <path> --slot <subject slot>
--indices <8 NEW entry indices, stratified across what you varied>` posts shadow renders one at a time
(headroom-gated). Do this BEFORE the path fix (so you can see the smothering) only if you need the
evidence; otherwise do the path fix first. After the path fix, render the SAME indices again and build a
paired page (the pilot's `build-pairs.js` pattern: data-URI images, before/after per entry, look and
first-insect position in the caption). Read every image yourself first: does each render show ITS
entry's subject, colour and composition, and do the renders differ from each other? Then tell Kevin the
renders are in the app (shadow posts) and give the pairs link. Never hand Kevin renders that a known
upstream defect makes unjudgeable. 3 renders per arm is a coin flip; 8 paired is the minimum.

### 7. Record and commit

Update `RESEED_STATUS.md` (row + log entry, numbers with basis, commits), the playbook (every new
lesson, the moment you learn it), `SEED_POOL_REPAIR_HANDOFF.md` §9 only if the method itself changed.
Commit path fix + docs with explicit paths, reading the staged diff. Push only when Kevin says.

## Track B: scaling a thin pool (grow, don't rewrite)

`NEW_PATH_POOL_SCALING.md` lists 18 approved shadow paths whose pools sit at MVP-25. Same recipe,
two differences: (1) nothing is rewritten, the pool only GROWS (`node scripts/reseed/reseed.js
<config> --grow N` appends N new entries; `--execute` refuses unless every original is byte-identical
at its old index); (2) with no roster of real items to hand, first build one: ask Sonnet for a list of
~150 candidate instances of the pool's OWN varying element (boat designs for a boat-fleet pool, not
new categories of boat), have it de-duplicated by an LLM read in small batches, and keep it in the
config as the roster. Pre-assign from that roster exactly as in step 3. Subject pool first; axis pools
only if Kevin asks. Never promote the path to `paths[]`, and never touch DinoBot's four shared paleo
pools. Track B has its own table in `RESEED_STATUS.md`.

## Operating mode: delegated QA (Kevin, 2026-09-23)

Kevin delegated both gates: _"do your own QA gating, maintain a report of which paths are done, and flag
any that give you problems … i won't interrupt you anymore."_ So per pool: read every rewrite on the
review page yourself, execute, read every render yourself, commit + push, update `RESEED_STATUS.md`
(row, log, links). Put anything uncertain under **Flags for Kevin** in that file and mark the row
`flagged`; never decide a pool's intent or a path's composition silently. What he did NOT delegate:
taste. A template change is only ever a fidelity fix (a second subject source, a hard-coded shape or
colour that overrides the entry); the day he delegated, he reverted a composition change I made from a
"I like this one more" remark. When he asks a question, answer it and stop.

Tool lessons since the pilot (already in the core/configs, listed so they are not re-learned):
object entries need `entryText` + `build` in the config; the three axes of an assignment must draw
independently (a shared attempt index locks them in step and retries the same dozen combinations);
geography must be checked in `assign` (a motu is an atoll islet; green and red Hawaiian sands are
pocket beaches); a colour word that is also a species name ("fuchsia") and a bare word that is also a
species ("vines") must not be aliases; bird clauses split on ";" first; the length band widens when the
roster's names are longer than the originals'; `--resume` on a report with the bad changes filtered
out regenerates only those slots.

## Reporting to Kevin

Short and plain. Numbers with their basis. Say what is proven and what is not. If the renders cannot
answer his question, say so instead of showing them. When a step needs his call (pool intent, a colour
he may not want, a path whose identity is unclear), ask one question with a recommendation.

## Files

- `RESEED_STATUS.md` — status of record (update in the same commit as the work)
- `scripts/reseed/queue.js` — candidate list (lexical floor, verify)
- `scripts/reseed/render-forced-entries.js` — forced shadow renders of chosen entries
- `scripts/repair-flower-focal-cluster.js` — the pilot's repair tool, the template to clone
- `SEED_POOL_REPAIR_HANDOFF.md` §9, `SEED_DIVERSITY_CHARTER.md` §6c/§6f — ledger + decision log
- `BOT_SCENE_QUALITY_PLAYBOOK.md` — lessons; the flower-friends section is this program's
- `SUBJECT_POOL_MAP.json` — which slot is the subject pool per path (LLM-derived; verify)
