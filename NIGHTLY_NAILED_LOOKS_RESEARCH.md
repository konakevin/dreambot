# Nightly "Nailed Looks" — research charter (Kevin, 2026-09-04 — TOP PRIORITY follow-up)

**Kevin's words:** "a deeper research project about the relentless pursuit to drill down and find
the ideal looks we can create for a fun, varied set of styles for nightly dreams — based on
parameters: model, medium, vibe … a system similar to the bots where they have 'looks' … deliver
consistently really high quality 'nailed' styles/looks in nightly. It's a top priority."

**Goal.** Replace nightly's independent medium × vibe × model lottery with a curated catalog of
FROZEN, PROVEN looks — each one a (medium fragment + vibe directive + pinned model) triple that
Kevin has graded as nailed — rolled with recency so every user's week is varied AND every render is
a look we already know lands. `HALLOWEEN_SIGNATURE_LOOK_PLAN.md` is instance #1 (the day-of hero).

## 1. What the bots do that nightly doesn't (read `BOT_SCENE_QUALITY_PLAYBOOK.md` in full before building)

| Bots ("Medium Looks", 4 proven bots) | Nightly today | Nightly after |
|---|---|---|
| Bot-wide `look_register` pool: ~12-25 PURE rendering-style entries (palette / shading / linework / finish / lighting — never subject anatomy), hand-curated for universal composability; proportion- and color-breaking looks excluded | `dream_mediums` (10 face-swap mediums) rolled independently of `dream_vibes` (5 dream-eligible) and of the model | `nightly_looks` catalog: each row = medium fragment + vibe directive + model, frozen, versioned, graded |
| Neutral medium locks the CAST/composition, defers the treatment to the look; look tokens LEAD the prompt (CLIP anchor) | face-swap prompt = medium fragment → set-at → framing → CHARACTER … (the medium leads, vibe is an accent) | unchanged order; the look supplies the medium+vibe tokens as one frozen block |
| `modelByPath` locks pin a hearted look to one model; per-bot `allowedModels` lineup from Kevin's matrix review (`BOT_MODEL_TALLY.md`) | DreamSmart set ∩ allowed − bans per medium, plus Ultra/flex clamps; model is random within that | each look pins ONE model (`allowed_models=[m]`); a `NIGHTLY_LOOK_TALLY.md` is the source of truth |
| `picker.pickWithRecency` → no same-look-twice clustering | anti-repeat exists per medium (L6 last-7 logs) | recency over LOOKS, per user |
| HTML matrix protocol: path × model grid, posted, Kevin hearts the bad → bans | `qa-nightly-fun.js` / `model-matrix-swap.js` (DreamSmart runbook) | a nightly look matrix: look × surface × seed-kind, captioned, heart = ban |
| Clean mediums for gpt-image-2 / gemini (they choke on painterly prefixes) | same models are in nightly pools | a look that pins gpt/gemini gets a clean-register fragment |
| No face-swap constraint | **the face swap is the whole product** | every look must pass the couple identity gate (§3) — the constraint the bots never had |

## 2. Candidate space (nightly-enabled only)

- Mediums: canvas, comics, film_noir, glamour, illustration, pencil, photography, pop_art,
  vintage_film, watercolor (active, face-swap, dream-eligible). Plus new PURE-STYLE registers
  authored for nightly (gouache poster, risograph, ink-and-wash, painted-cel, editorial
  illustration, linocut…) — the bots' proven trick — each needing its own face-swap variant.
- Vibes: cozy, nostalgic, cinematic, epic, peaceful (dream-eligible today); dark, macabre,
  nightshade, arcane, whimsical, psychedelic, voltage, ethereal, shimmer, surreal exist
  (`dream_vibes.is_dream_eligible=false`) — candidates on a flag flip.
- Models: flux-1.1-pro, gemini-2-image, gpt-image-2, flux-2-max (+ flux-2-flex if the dual clamp
  is exempted for pinned looks; grok-imagine if still allowed). See the 30-day reliability table in
  `HALLOWEEN_SIGNATURE_LOOK_PLAN.md` §2: the MODEL is the first-order reliability lever.

## 3. The gate (non-negotiable, before taste): couple identity

A look is eligible only if, on 4 fixed couple seeds, it degrades 0/4 and both identity sims are
≥ 0.50 median (stamps in `ai_generation_log.fallback_reasons`). Solo/plus_one are checked too but
couples decide. This is where flux-1.1-pro painterly looks will fall and where model pinning pays.

## 4. Research plan (phases, each handoff-ready)

1. **Inventory + baseline (1 session).** Pull 60 days of nightly cast renders: likes/hearts,
   downloads, DLT-reuse, quarantines, identity pass, by medium × vibe × model. Output: a ranked
   table of what ALREADY nails (hearts per 100 renders) and what never does. Seeds the candidates.
2. **Candidate looks (1 session).** Author ~30 pure-style looks (existing mediums × best vibe +
   new registers), each with a face-swap fragment; pin a model per look from the reliability data.
3. **Reliability round (renders).** 30 looks × 4 couple seeds = 120 couple renders, headroom-
   gated, ≤3 concurrent. Cut to survivors (expect ~15).
4. **Look round (renders + Kevin).** Survivors × 3 surfaces × 3 seed-kinds (location / goofy or
   elegant / holiday) × 1 = ~135 renders → HTML matrix + album captions `✨ LOOK <key> <surface>`.
   Kevin grades: face · scene-hero · artsy/fun/cool · consistency. Heart = ban.
5. **Freeze v1 (code + data).** `nightly_looks` table (or `dream_mediums` rows, `is_public=false`,
   `is_dream_eligible=false`, `nightly_look=true`) with the exact fragment + vibe text + pinned
   model; `engine_config.nightly_looks_pct` (0 = off) → when it fires, the look REPLACES the
   medium+vibe+model rolls for that render; recency per user; telemetry stamp `look:<key>`.
6. **Measure + iterate.** Two weeks of `nightly_looks_pct=30`: hearts per 100 by look vs the
   random-roll control; identity pass; quarantine rate. Promote to 60-100%, retire losers, author v2.

## 5. Guardrails

- Looks are PURE rendering style (bots lesson 1b) — no anatomy, no composition claims, never
  "dominant/fills the frame" (CLAUDE.md face-swap rule).
- A look never edits a frozen row; new version = new row + tally entry.
- The set-dresser/costume-designer bar and the Halloween-hero bar still govern the SCENE; the
  look governs only the treatment.
- Nothing rolls to users until Kevin has graded the matrix (MVP → sign-off → scale).

## 6. Links

`HALLOWEEN_SIGNATURE_LOOK_PLAN.md` (instance #1), `NIGHTLY_IMPRESS_PLAN.md` (#0 bookmark),
`BOT_SCENE_QUALITY_PLAYBOOK.md` ("Medium Looks" sections, per-bot model lineups, HTML matrix
protocol), `SMART_DREAM_PLAN.md` + `DREAMSMART_MODEL_VALIDATION.md` (the model↔style runbook this
extends), `BOT_MODEL_TALLY.md` (the tally pattern to mirror as `NIGHTLY_LOOK_TALLY.md`).
