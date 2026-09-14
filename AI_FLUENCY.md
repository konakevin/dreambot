# AI Fluency for Developers — Kevin's Curriculum

**Goal:** become the strongest technical AI operator in your circle. Not "uses AI" — *engineers with it*:
you control the agent, you build the guardrails, you design the workflows, and you know why each lever
works. Every lesson uses your real environment (the DreamBot repo, your CLAUDE.md, your MCP servers,
your skills) as the sandbox, so nothing here is abstract.

**How we run it.** Say "next lesson" (or name one). For each lesson I will: (1) explain the concept in
5 minutes, (2) demo it live in your repo, (3) hand you a hands-on exercise, (4) verify the "done when"
criteria, (5) check it off here. Claude Code features evolve, so for every Claude-Code-specific lesson I
verify the exact syntax against current docs before we run it (the `claude-code-guide` agent + the
`context7` MCP), rather than teaching from memory.

**Your starting point (surveyed 2026-09-11):** a mature `CLAUDE.md` with hard rules · 6 custom skills
(`audit`, `bot-paths`, `dream-shoot`, `mine-posts`, `rad`, `release`) + 2 commands · 5 MCP servers
(supabase, posthog, context7, vercel plugin, google drive) · a husky pre-commit gate · **467 memory
files**. Gaps we'll close: **zero Claude Code hooks** configured, **no custom agents**, memory needs
pruning, and no written workflow for the multi-agent shared-tree collisions you've been hitting.

---

## Progress

| # | Lesson | Tier | Status |
|---|---|---|---|
| 0 | How an AI coding agent actually works | Foundations | ☐ |
| 1 | CLAUDE.md — rules that stick | Foundations | ☐ |
| 2 | Memory — what to save, what to prune | Foundations | ☐ |
| 3 | Steering a session — plan mode, permissions, interrupts, context | Control | ☐ |
| 4 | Making Claude follow coding guidelines (prose vs. enforcement) | Control | ☐ |
| 5 | Prompting for code — specificity, verification, reviewing AI diffs | Control | ☐ |
| 6 | MCP servers — connect, auth, debug, when to use one | Tooling | ☐ |
| 7 | Skills & slash commands — packaging your workflows | Tooling | ☐ |
| 8 | Hooks — automation the harness enforces, not the model | Automation | ☐ |
| 9 | Subagents, custom agents & workflows — parallelism done right | Automation | ☐ |
| 10 | Multi-agent on one repo — the shared-tree survival guide | Automation | ☐ |
| 11 | Development patterns with AI — TDD, regression locks, config-driven, fail-forward | Architecture | ☐ |
| 12 | Observability for agents — making failures self-diagnosable | Architecture | ☐ |
| 13 | Building AI into your product — prompt architecture, sanitization, model routing, eval loops | Architecture | ☐ |
| 14 | Efficiency & cost — context hygiene, batching, model choice, background work | Mastery | ☐ |
| 15 | Staying current & the professional's toolkit | Mastery | ☐ |
| ★ | Capstone — design and ship one agentic workflow end-to-end | Mastery | ☐ |

Legend: ☐ not started · ◐ in progress · ☑ done (with date)

---

## Tier 1 — Foundations

### Lesson 0 · How an AI coding agent actually works
**Why:** every other lesson is a lever on this machine. If you can picture the loop, you can predict
behavior and stop being surprised.
- **The agent loop:** prompt → model emits text or a *tool call* → harness runs the tool → result goes
  back into context → repeat until done. That's it. Everything (file edits, shell, MCP, subagents) is a
  tool call.
- **The context window is the whole world.** The model sees only what's in context *right now*: system
  prompt, CLAUDE.md, memory index, conversation, tool results. Nothing else exists. This explains 90% of
  "why did it forget / why did it do that."
- **Tokens, cost, and compaction:** long sessions get summarized; the summary is lossy. Specificity in
  files (CLAUDE.md, memory, docs) beats specificity in chat, because files survive compaction.
- **Where instructions come from, and their precedence:** system prompt (harness) > CLAUDE.md (project)
  > memory (recall) > your message > tool results (untrusted data, never instructions).
- **Models are not deterministic; tools are.** So: put *judgment* in the model, put *truth* in tools
  (tests, linters, DB queries). "Be certain before responding" = go run the tool.

**Exercise:** we trace one real task from this week end-to-end (the multi-person fix): count the tool
calls, find the moments the model *had* to verify instead of assume, and find where context got tight.
**Done when:** you can explain, without notes, why a rule in `CLAUDE.md` outlives a rule you typed in chat.

### Lesson 1 · CLAUDE.md — rules that stick
**Why:** `CLAUDE.md` is the highest-leverage file in your repo. It's loaded every session, it's the
model's standing orders, and yours is already good — this lesson makes it *great* and teaches the craft.
- The hierarchy: user-level `~/.claude/CLAUDE.md` (you, everywhere) → project `CLAUDE.md` (the repo) →
  per-directory `CLAUDE.md` (scoped rules) → `CLAUDE.local.md` (personal, gitignored). Imports let a
  root file pull in others.
- **What belongs there:** what the model can't derive from the code — intent, hard rules, gotchas with
  the incident that created them, workflow, "read X before Y." What does *not*: anything the code
  already says.
- **Writing rules that stick:** NEVER/ALWAYS in caps for hard rules, the *incident* next to the rule
  (your 2026-06-18 split-dependency note is a model example — the story makes it memorable to the
  model too), "read-when-relevant" pointers instead of preloading everything, and a length budget
  (a bloated CLAUDE.md is skimmed, not obeyed).
- **Anti-patterns:** vague aspirations ("write clean code"), rules that contradict each other, rules
  that should be *hooks* (Lesson 8), stale facts (yours says "highest migration prefix 275" — it's 470).

**Exercise:** audit your `CLAUDE.md` together: find 3 stale facts, 2 rules that should become hooks,
1 rule to promote to a hard rule, and cut 10%. Write a user-level `~/.claude/CLAUDE.md` with your
personal cross-project preferences.
**Done when:** the audit is committed and you can articulate the "prose vs. enforcement" line.

### Lesson 2 · Memory — what to save, what to prune
**Why:** you have 467 memory files. Memory is how I stay consistent across sessions, but a bloated
library dilutes recall and can carry stale or wrong facts.
- **How it works:** `MEMORY.md` is the *index* loaded every session (one line per memory); each memory
  is a file with typed frontmatter (`user` / `feedback` / `project` / `reference`). Recall pulls
  relevant files in as background context. Memory is *my* notebook, not a spec.
- **What earns a memory:** things not derivable from the repo — your preferences, corrections you gave
  me (with the *why*), project state and decisions not in git, pointers to external resources. What
  doesn't: code structure, past fixes, anything CLAUDE.md or a doc already records.
- **Hygiene:** merge duplicates, delete wrong/superseded memories, convert relative dates to absolute,
  link related memories, keep the index line a *hook* not a summary. Memories that name a file or
  flag should be re-verified before acting on them.
- **The trap:** recalled memories are a snapshot of when they were written. Treat them as leads.

**Exercise:** we prune your 467 files to a lean, trusted library: dedupe, retire stale ones, tighten
the index. Then you write one memory by hand in the correct format.
**Done when:** the library is under ~250 files, the index scans in one screen, and you can say which
`type` a given fact should be.

---

## Tier 2 — Control

### Lesson 3 · Steering a session — plan mode, permissions, interrupts, context
**Why:** the difference between a great AI operator and an average one is mostly *when* they intervene.
- **Plan mode:** ask for a plan before code on anything non-trivial ("plan this, don't build yet"). I
  research read-only, present a plan, you approve. We used it this week for the multi-person fix; it
  caught a wrong assumption (there was no model picker) *before* code was written.
- **Permission modes:** default (ask) · accept-edits · plan · bypass. Know which you're in and why;
  bypass is speed, not a default.
- **Interrupting well:** stop me the moment the direction is off (you did this with "do not post these
  on michele's account" — that's the right reflex). A mid-task correction is cheap; a wrong finished
  task is expensive.
- **Context management:** `/clear` for a fresh start, `/compact` to summarize, when to start a new
  session vs. continue, the `!` prefix to run a shell command yourself and land the output in context.
- **Asking the right unit of work:** "investigate and report" vs. "propose" vs. "build" vs. "build and
  ship." Say which. Ambiguity here is the #1 source of over- or under-reach.

**Exercise:** run one small feature three ways — plan-first, accept-edits, and "just do it" — and
compare the outcomes and your effort.
**Done when:** you have a personal rule for which mode fits which task size.

### Lesson 4 · Making Claude follow coding guidelines — prose vs. enforcement
**Why:** "the model didn't follow my style" is almost always a *tooling* gap, not a prompting gap.
- **The principle:** a rule the model *reads* is a suggestion; a rule a *tool* enforces is a law. Put
  style, types, and tests in tools; put intent and judgment in CLAUDE.md.
- **Your enforcement stack today:** prettier → lint → tsc → deno check → jest, all in a husky
  pre-commit. That's why your codebase stays consistent across agents. Understand exactly what each
  gate catches and what it *doesn't* (the pre-commit validates the working tree, not the commit — the
  split-dependency hole).
- **Regression locks:** the single best pattern in your repo — when a bug is fixed, a test locks the
  behavior so no agent reintroduces it (your bot-cadence monitor test). We'll formalize it.
- **CLAUDE.md as the last mile:** the rules that can't be a tool (e.g., "no negation in Flux prompts")
  live in prose, with the incident attached.

**Exercise:** pick one guideline you keep restating in chat and convert it into an enforced check (a
lint rule, a test, or a hook). Then delete it from CLAUDE.md.
**Done when:** the check fails on a deliberate violation and the prose rule is gone.

### Lesson 5 · Prompting for code — specificity, verification, reviewing AI diffs
**Why:** the craft of the *ask* and the craft of the *review*.
- **Specificity that pays:** name files, name the behavior, name the constraint, name what must NOT
  change ("don't touch nightly"). State the definition of done. Give the *why* — it lets the model
  make good calls you didn't anticipate.
- **Verification-first asks:** "confirm X before doing Y," "show me the query result," "prove it with a
  test." Your own rule — be certain before responding — is a prompting pattern.
- **Small diffs, explicit scope:** one variable at a time; "smallest diff for the literal request."
  Big autonomous pushes are fine *when* scoped and gated (you've run several).
- **Reviewing AI diffs like a senior engineer:** read the staged diff, not the summary; check every
  new import's target is in the same commit; look for silently widened scope; run the tests yourself.
- **Options vs. decisions:** ask for options when you're deciding; ask for a recommendation when you
  want to move. Don't make the model narrate options it won't pursue.

**Exercise:** rewrite three of your recent real prompts to be sharper, then run one and compare.
**Done when:** you have a personal prompt checklist (5 lines) you actually use.

---

## Tier 3 — Tooling

### Lesson 6 · MCP servers — connect, auth, debug, when to use one
**Why:** MCP is how the agent reaches your real systems (DB, analytics, docs, deploys). You already run
five; this lesson makes you the person who can *fix* and *extend* them.
- **What MCP is:** a standard for exposing tools/resources to the model. Transports: `stdio` (a local
  process, e.g. your supabase server) vs. `http` (a hosted endpoint, e.g. posthog). Servers expose
  named tools the model calls like any other tool.
- **Where config lives:** user scope `~/.claude.json` (your supabase/context7) vs. project `.mcp.json`
  (shared, committed — your posthog) vs. `enabledMcpjsonServers` gating. Know which file to edit.
- **Auth patterns:** env tokens for stdio servers (your supabase PAT, pulled from the CLI keychain), OAuth
  for hosted servers (`/mcp` to authenticate). The `CONNECTION_CLOSED` you hit = "the process exited on
  boot," almost always a missing credential — and how we diagnosed it by running the server by hand.
- **Read-only vs. write:** why your supabase server is `--read-only` on purpose, and why writes go
  through an explicit script (`apply-migration.mjs`) that shows in the transcript.
- **MCP vs. a script vs. a skill:** MCP for *interactive, read-heavy* access; a script for *repeatable,
  auditable writes*; a skill to *package* a workflow (Lesson 7).
- **Debugging:** `claude mcp list`, run the server manually with a JSON-RPC `initialize`, read stderr.

**Exercise:** add one new MCP server (e.g., GitHub) end-to-end: config, auth, verify with `claude mcp
list`, use it in a task. Then break it on purpose and diagnose it.
**Done when:** you can add, remove, and debug an MCP server without me.

### Lesson 7 · Skills & slash commands — packaging your workflows
**Why:** you've already built six. This lesson teaches the design discipline so they compound.
- **What a skill is:** a packaged set of instructions (a `SKILL.md` with frontmatter) that loads into a
  turn on demand — a repo-specific runbook the model follows *instead of* improvising. `/release` and
  `/bot-paths` are exactly this.
- **Skill vs. CLAUDE.md vs. hook vs. agent:** CLAUDE.md = always-on standing orders; skill = an
  on-demand procedure; hook = an automatic enforced action; agent = a delegated worker with its own
  context. Picking the right container is the whole skill.
- **Writing a good skill:** a crisp trigger description (so it's invoked when it should be), the
  checklist, the gotchas with incidents, the "done when," and what it must *never* do.
- **Commands** (`.claude/commands/*.md`) as lightweight prompts; when to promote a command to a skill.

**Exercise:** write a new skill for a workflow you repeat (candidate: the offline model-comparison
harness we built — "compare models on this photo + prompt, offline, to local files"). Invoke it.
**Done when:** the skill runs a real task correctly on first try and you've refactored one existing
skill's trigger description.

---

## Tier 4 — Automation

### Lesson 8 · Hooks — automation the harness enforces, not the model
**Why:** you have **zero hooks**. This is your biggest untapped lever. "From now on, whenever X…" can
only be guaranteed by a hook — a prompt or memory can't.
- **What hooks are:** shell commands the harness runs on lifecycle events (before/after a tool call,
  on stop, on notification, etc.), configured in `settings.json`. They run deterministically; the
  model can't forget them.
- **High-value hooks for you:** block edits to files matching another agent's WIP; auto-run the
  relevant test after an edit; refuse `git add -A` (a hard rule that's currently prose only); a
  notification when a long task finishes; a guard against committing to `main` without the diff review.
- **Design rules:** fast (they run often), fail-loud, scoped (match the exact tool/path), and never a
  substitute for a real CI gate — they're a *pre*-gate.
- Also: `/loop` for recurring checks, scheduled/cloud routines for cron-style agent work.

**Exercise:** implement three hooks: (1) refuse `git add -A`/`git add .`, (2) run the matching
`*.test.ts` after a file edit, (3) a Stop notification. Verify each fires.
**Done when:** the `git add -A` hard rule is enforced by a hook and deleted from CLAUDE.md prose.

### Lesson 9 · Subagents, custom agents & workflows — parallelism done right
**Why:** delegation keeps your main context clean and lets independent work run in parallel — but
over-spawning wastes tokens and fragments understanding.
- **Built-in agents:** Explore (read-only search), Plan (design), general-purpose, the Claude Code
  guide. When each fits; when a plain search is better than an agent.
- **Custom agents** (`.claude/agents/*.md`): a persona + tools + model for a recurring role (you have
  none yet — candidates: a "render QA judge," a "migration reviewer," a "seed-pool linter").
- **Forks and worktrees:** a fork inherits your context; `isolation: worktree` gives an agent its own
  checkout so it can't collide with the shared tree (directly relevant to Lesson 10).
- **Workflows / ultracode:** deterministic multi-agent scripts (fan out reviews, verify findings) —
  when the task is big enough to justify the cost, and how to size it.
- **Cost discipline:** one agent for an isolated task, up to three for genuinely parallel independent
  work, never "because it seems thorough."

**Exercise:** write one custom agent (a render-QA judge that grades a batch to your rubric) and use it.
Run one task in a worktree-isolated agent.
**Done when:** you can state, for a given task, whether it needs 0, 1, or N agents and why.

### Lesson 10 · Multi-agent on one repo — the shared-tree survival guide
**Why:** you run concurrent agents on one working tree, and this week it bit us: two sessions share one
git *index*, so one agent's commit swept in the other's staged files. This lesson turns that into a
written protocol.
- **The mechanics:** shared working tree + shared index = any `git add` is visible to every session; a
  `commit -a` or `add .` sweeps everyone's work; the pre-commit hook validates the whole tree, so one
  agent's broken WIP blocks another's commit.
- **The protocol:** explicit-path staging only; read the staged diff before committing; commit
  promptly (unstaged work is a liability); one agent per area of the code; worktrees for anything
  risky; handoff docs when work crosses agents (we wrote one for the holiday work).
- **Coordination signals:** a `WIP` note, a lock file, or simply telling each session its lane.
- **Recovery:** how to un-sweep a commit safely (revert vs. amend, never rewrite shared history).

**Exercise:** write the protocol into CLAUDE.md (tightening what's there), add the Lesson 8 hook that
blocks unscoped adds, and run two agents on disjoint tasks without a collision.
**Done when:** a deliberate `git add .` is blocked and a two-agent session ends clean.

---

## Tier 5 — Architecture

### Lesson 11 · Development patterns with AI — TDD, regression locks, config-driven, fail-forward
**Why:** the patterns that make a codebase *safe* for agents to work in fast.
- **Test-first with an agent:** ask for the failing test, then the fix; the test is the spec the model
  can't misread.
- **Regression locks** (Lesson 4, deeper): every incident becomes a test with the incident in its
  comment. Your codebase does this well; we'll make it a reflex.
- **Config-driven behavior:** your `engine_config` philosophy — tune without a deploy, one variable at
  a time, rollback = flip a value. Why this is *especially* valuable with agents (reversibility).
- **Fail-forward, one variable:** ship behind a flag or a config, verify, then widen. Your beta posture.
- **Reproducible QA harnesses:** the offline model-comparison harness is a template — a script that
  turns a judgment call into a repeatable, comparable artifact.
- **Blast-radius thinking:** enumerate every caller before changing a shared function (we did this for
  `newSceneModel`); "non-goals" as an explicit section of every plan.

**Exercise:** take one upcoming change and do it fully in this style: plan with non-goals, failing test,
fix, regression lock, config knob, verify, ship.
**Done when:** the change lands with all six elements and you can defend each.

### Lesson 12 · Observability for agents — making failures self-diagnosable
**Why:** an agent can only fix what it can see. Your forensics stack is the reason I could diagnose
Michele's renders in minutes.
- **Breadcrumbs everywhere:** stage markers, `fallback_reasons`, `rolled_axes`, the render log joined
  to the upload — designing logs *for an agent to read*, not just a human.
- **Fail-loud monitors:** your cron monitors that email on failure; the rule that any threshold derived
  from a tunable must derive from the config (and be locked by a test).
- **Forensics tooling:** `check-forensics.js` — one command that stitches a failure to its cause. Build
  these *before* you need them.
- **What to log for AI features:** the prompt, the model, the route/kind, the cost, every fallback.

**Exercise:** pick one flow with weak observability and add breadcrumbs + a one-command forensic
query. Then diagnose a real failure with it.
**Done when:** you can go from "a user complained" to root cause with queries alone, no guessing.

### Lesson 13 · Building AI into your product — prompt architecture, sanitization, model routing, eval loops
**Why:** you're not just *using* AI — DreamBot *is* an AI product (Sonnet briefs, Haiku vision/captions,
multi-model image routing). This is the professional core.
- **Prompt architecture:** system vs. user roles, structured briefs, why your `callSonnet` posture makes
  sanitization mandatory (`sanitizeUserText` — user text read with engine authority is an injection
  surface).
- **Model routing:** the right model per job (Sonnet writes, Haiku classifies, Flux/Gemini/GPT render);
  cost tiers; cross-provider failover; the curated-model pattern we just shipped (only allow models
  proven to work for a scenario, and *guarantee-or-refund*).
- **Evaluation loops:** offline A/B harnesses, human-graded matrices, regression pools (your quarantine
  pool), and the discipline of *testing the actual output* before believing a model works.
- **Guardrails in the product:** caps, rate limits, refunds on failure, never commenting out a safety
  check "for now."
- **The Claude API itself:** the `claude-api` skill as your reference for models, pricing, tool use,
  caching — verify, never answer from memory.

**Exercise:** design the eval harness for one existing AI feature (a rubric + a script that produces a
graded matrix), run it, and act on one finding.
**Done when:** you have a repeatable eval for a production AI feature.

---

## Tier 6 — Mastery

### Lesson 14 · Efficiency & cost — context hygiene, batching, model choice, background work
**Why:** the pros get more done per token and per minute.
- **Context hygiene:** keep working files in the scratchpad, delegate big reads to an Explore agent
  (you keep the conclusion, not the dump), start fresh sessions for unrelated work.
- **Batching:** request every independent tool call at once; sequence only true dependencies.
- **Background work:** long renders/tests run in the background while you keep steering; wake-ups and
  notifications instead of polling.
- **Model choice:** Fable/Opus for judgment-heavy work, Sonnet/Haiku for volume — for your *own*
  sessions and for what you build.
- **Don't re-derive:** facts established once go in a file (CLAUDE.md, memory, a plan doc).

**Exercise:** take a task you'd normally do in one long session and restructure it: scratchpad,
one Explore agent, batched calls, one background job. Compare tokens and wall-clock.
**Done when:** you have a personal efficiency checklist.

### Lesson 15 · Staying current & the professional's toolkit
**Why:** this field moves monthly. The pro has a system for not falling behind.
- **Sources of truth:** the `claude-code-guide` agent for Claude Code questions; the `context7` MCP for
  any library's *current* docs; the `claude-api` skill for the API. Verify, don't recall.
- **Your toolkit inventory:** skills, agents, hooks, MCP servers, scripts, monitors — a one-page map so
  every new session (yours or an agent's) knows what exists.
- **Feedback loops:** `/feedback`, session review, keeping CLAUDE.md and memory *alive* (Lessons 1–2).
- **Teaching it forward:** the fastest way to be the top AI professional in your circle is to write
  the playbook others use.

**Exercise:** produce your toolkit inventory page and a monthly "what changed" routine.
**Done when:** the inventory exists and you've run the routine once.

### ★ Capstone — design and ship one agentic workflow end-to-end
Pick a real, recurring DreamBot job (candidates: nightly seed-pool QA; the multi-model offline
comparison as a reusable QA gate; a weekly quarantine-pool trend report). Design it with everything
above: a plan with non-goals, a skill or custom agent, hooks/guards, config knobs, observability, an
eval, a regression lock, and a handoff doc. Ship it. Then teach it to me in one paragraph.
**Done when:** it runs without you, you can explain every design choice, and another agent could
maintain it from the doc alone.

---

## Appendix — your environment cheat sheet (grows as we go)

- **Standing orders:** `dreambot/CLAUDE.md` (+ `ENGINEERING_NOTES.md` read-when-relevant).
- **Memory:** `~/.claude/projects/-Users-kevinmchenry-Development-apps-dreambot/memory/` (`MEMORY.md` index).
- **MCP:** user `~/.claude.json` (supabase `--read-only`, context7) · project `.mcp.json` (posthog) · `claude mcp list`.
- **Skills:** `dreambot/.claude/skills/` (audit, bot-paths, dream-shoot, mine-posts, rad, release) · commands `.claude/commands/`.
- **Enforcement:** `.husky/pre-commit` → `npm run check` (prettier → lint → tsc → deno → jest).
- **Hooks / agents:** none yet (Lessons 8–9).
- **Plans:** `~/.claude/plans/` (plan-mode output) · handoff docs at repo root (e.g., `NEW_SCENE_MULTIPERSON_FIX.md`).
- **DB writes:** `node scripts/apply-migration.mjs <NNN>` (ledger-guarded), never `supabase db push`.
