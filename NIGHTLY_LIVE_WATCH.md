# Nightly live watch — the 1.2.0-with-looks engine

**Live since 2026-09-14.** Read this first thing after a nightly run. It exists so nobody has to reconstruct
last night's context from a chat log.

---

## What is running

The **1.2.0 engine builds the dream** — your saved places, the location-fit action beat at 75%, the 1.2.0 scene mix
(goofy 15 / elegant 15 / active 20), its pose pools, its prompt order, its identity floors. No framing axis, no
frame roll; neither exists in 1.2.0.

**The new catalogue decides two things only:** which LOOK (handed to the engine as a pinned medium, the mechanism
1.2.0 already had for a forced look) and which VIBE. 54 looks are enabled.

**Model.** The surface's three policy primaries — flux-1.1-pro, gemini-2-image, grok-imagine-image — minus any
combination Kevin graded NO for that look and surface. Half of all renders go straight to the primary, half roll
the pool. A failed couple round-robins the pool once each, keeping the look, and only when the chain is exhausted
does it become a single, restarting at the solo primary.

**Cast split.** 50% both of you · 25% you · 25% your plus-one. Random per dream, deliberately not a shuffled deck,
so streaks happen.

**Pose.** Three rungs: the scenario row's own action (mig 516), a solo's scene sentence passed through unrewritten,
or a generated beat that fits that scene. The generic "as the scene describes" anchor is the last resort and should
now be rare.

---

## The morning check

```
node scripts/nightly-morning-check.js              # the most recent run
node scripts/nightly-morning-check.js 2026-09-15   # a specific UTC date
```

It prints delivery, where each pose came from, and the model mix, with the reading guide attached. The line that
matters most is **came back as couples** — a couple that shipped as a single is the worst outcome this engine can
produce, and the whole model chain exists to prevent it.

What each signal means:

| you see                            | it means                                                      | what to do                                                                    |
| ---------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| couples delivered under ~85%       | the chain is not saving them                                  | open the images, then read the `chain_NofM` stamps on the misses              |
| the generic anchor above ~0        | a scenario reached a render with nothing for the people to do | find the row, add an action or let the generator cover it                     |
| `scenario_action:generate_failed`  | the Haiku beat call failed                                    | harmless, it fell back; if it persists check ANTHROPIC_API_KEY                |
| one model taking nearly everything | the pool or the rejections moved                              | check `nightly_model_policy` and the approvals                                |
| no renders at all                  | the cron, not the engine                                      | `.github/workflows/nightly-dreams.yml`; dream-queue-monitor would also be red |

Then look at the actual dreams. The numbers cannot tell you whether a dream is good.

---

## If a night reads badly

**Rollback is one row**, effective on the next render, no deploy:

```sql
update engine_config set nightly_looks_mode = 'off';
```

That returns every user to plain 1.2.0. For a specific earlier state instead, the snapshots are in
`nightly-states/`: `v1.2.0-looks.json` (what is live), `round20.json`, `postdrill.json`. Restore with
`node scripts/snapshot-nightly-state.js diff <name>` to see what drifted, then set those values back.

---

## Standing guards

Run any time; all are read-only except where noted.

- `node scripts/check-nightly-catalog.js` — every approval can fire, every enabled look can render, no look is
  disabled without a recorded reason, no code-banned place is a live picker card.
- `node scripts/scan-scenario-actions.js` — every stored scenario action is still a verbatim slice of its scene.
- `node scripts/apply-look-quarantine.js` — turns Kevin's purple quarantines into look retirements (dry by
  default, `--apply` to act).
- `npm run check` — 3154 tests, including guards over the render path wiring itself.

---

## Open threads, in the order they are worth doing

1. **The look ladder.** One render per look, same seed and prompt, only the look differing, into Kevin's Dreams
   album so he can quarantine the ones he dislikes. Details and gotchas are in `NIGHTLY_PARITY_QA_LOOP.md` under
   "NEXT UP".
2. **260 couple scenarios with no action.** `~/Desktop/couple-scenarios-needing-an-action.md` lists them, split
   into 51 worth rewriting and 209 pure scenery. All of them render today via the generated beat; the list is for
   tightening.
3. **Solo scenario actions.** 5,483 single rows pass their whole sentence as the action, which works but is
   untuned. Worth revisiting only if solo renders start reading flat.
4. **Intermittent baldness.** Flux occasionally ignores a hair instruction it was given four times; eight fixed
   seeds on the exact prompt all rendered hair, so this is model variance, not a prompt defect. Parked deliberately.
