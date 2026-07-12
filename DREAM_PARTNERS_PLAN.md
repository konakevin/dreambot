# DREAM_PARTNERS_PLAN.md — expand the single +1 into a Dream Cast roster

Status: **plan for review** (2026-07-11). Grounded in a 3-layer code audit (data
model / UX / render pipeline). No code written yet.

Goal: let a user keep **up to 5 loved ones** ("Dream Cast"), each tagged
romantic vs platonic, with an **Active Dream Partner** and a **nightly cast
mode** (locked to one partner, or "mix it up" across the whole roster) — so their
people get sprinkled through their dreams in varied combinations.

---

## 0. The one hard constraint that shapes everything

The dual face-swap engine can reliably split **only TWO clean faces** per render
(the Fly detector needs two big, separated, frontal faces — pushing past it is
what causes the "wrong partner" bug; see the CLAUDE.md hard rules). So **"the
whole cast in one dream" is NOT feasible for 3+ swapped faces.**

Therefore "sprinkle the whole cast" = **variety ACROSS dreams**, not a crowd in
one image. Every dream still stars ≤2 real faces; the engine rolls *which* ones
(you + your sweetheart tonight, you + a friend tomorrow, two of your people, a
solo of one). Over time the whole roster appears, each framed correctly. This is
the delight, and it stays entirely within the safe 2-face ceiling.

---

## 1. Confirmed decisions

| # | Decision |
|---|----------|
| Data model | **Pure JSONB** — the roster + settings live in the existing `user_recipes.recipe`. No new table. |
| Current-partner scope | An **Active Dream Partner** (one pointer) is deterministic for **Create** and for **Locked** nightly. |
| Cast mode (nightly) | A setting: **Locked** (always the Active Partner) or **Rotate / "Mix it up"** (whole roster). |
| Friend vs partner | Render already frames `partner` romantic / `friend` platonic — **keep it AND enrich the platonic pools** (they're currently thinner than the romantic pool). |
| Onboarding scope | **Lean** — onboarding stays "you + a +1"; the +1 becomes Active Partner. Full roster management lives in Settings → Dream Cast. |
| Member + member | **In v1.** Two roster members (no self) is a valid combo, **always rendered platonic** (can't assume romance between two of your people). |
| Solo | **Kept.** Any roster member (or self) can roll a solo render. |
| Naming | Umbrella stays **"Dream Cast."** Screen header **"Who do you want to dream with?"** Rotate = **"Mix it up."** Tags: **❤️ Sweetheart** (romantic) / **💛 Sidekick** (platonic) — proposed, open to a different vibe. |

---

## 2. Data model (pure JSONB in `user_recipes.recipe`)

Today the cast is `recipe.dream_cast: DreamCastMember[]`, keyed by
`role: 'self' | 'plus_one' | 'pet'`, with `relationship?: 'partner'|'friend'`
already present. There's **no per-member id** and every engine read does
`.find(role === 'plus_one')`.

**Add three things to the recipe:**

```jsonc
recipe = {
  ...existing (moods, dream_seeds, avoid, version)...,
  dream_cast: [ /* self, pet, AND a plus_one that MIRRORS the active partner */ ],

  // NEW — the roster (up to 5 loved ones), each with a STABLE id:
  partner_library: [
    {
      id: "uuid",                 // stable, client-generated (fixes the no-id pain)
      storage_path: "<uid>/partner-<id>-<ts>.jpg",  // private cast-photos bucket
      description: "...",         // from describe-photo (unchanged pipeline)
      gender: "male" | "female",
      age: 34,
      physical_summary: "...",    // TRAITS
      relationship: "partner" | "friend"
    },
    ...up to 5
  ],

  // NEW — pointers/settings:
  active_partner_id: "uuid" | null,   // which library entry is the Active Partner
  cast_mode: "locked" | "rotate"      // default "locked"
}
```

**The mirror (the linchpin):** `dream_cast`'s `plus_one` member is kept in sync
as a **copy of the Active Partner**. So:
- **Locked nightly** + **Create** read `.find(role === 'plus_one')` exactly as
  today → **zero render change** for those paths.
- Switching Active Partner = one atomic `user_recipes` write: replace the
  `plus_one` element + set `active_partner_id`. One source of truth, no drift.

`self` and `pet` in `dream_cast` are unchanged. `relationship` union collapses to
`partner | friend` in the app (kill the dead `family`/`significant_other` branches
the audit found).

**Storage:** reuse the private `cast-photos` bucket (migration 292, RLS
folder=uid). New partners use an **id-based path** `partner-<id>-<ts>.jpg`
(instead of role-based `cast-plus_one-*.jpg`), so 5 partners don't collide.

---

## 3. Render integration

### Locked mode + Create → UNCHANGED
The mirror keeps `plus_one` = Active Partner, so `rollDream` Step 4
(`dreamAlgorithm.ts:108-153`), `resolveCastForPrompt`, the swap, and the
relationship framing all work untouched. Create's prompt detection ("my partner")
resolves to the Active Partner deterministically.

### Rotate mode (nightly) → ONE contained change
At the nightly cast-selection step only, when `cast_mode === 'rotate'`, replace
the fixed self+plus_one pick with a **roll over the roster**, producing a ≤2-member
cast for this dream:

| Combo | Weight (tunable via engine_config) | Framing |
|---|---|---|
| self + one roster member | most common | member's tag (romantic if Sweetheart, else platonic) |
| one roster member solo | occasional | n/a |
| two roster members (no self) | occasional | **always platonic** |
| self solo | occasional | n/a |

Everything downstream (the dual swap dispatch, L/R geometry, prompt assembly)
consumes the selected 1-2 members **unchanged** — it already swaps two source
photos onto two detected faces by gender; it doesn't care about self-vs-member.
The only new rule: compute a **`renderRelationship: 'romantic' | 'platonic'`** at
roll time and thread it to the framing (so member+member is forced platonic and
the existing dead-branch mismatch is cleaned up). Concretely: the roll builds the
cast array with each member's effective `relationship` set correctly, so the
existing `find(role==='plus_one')?.relationship` framing reads the right value.

**Risk:** contained to the *selection* step — the face-swap machinery (the
fragile part) is never touched.

---

## 4. Enrich the platonic seeds (decision B)

Today `pickDualAction` (`pools/dual_actions.ts`) has a rich **romantic** pool
(`DUAL_ACTIONS_PARTNER`, ~200 poses) but platonic pairings fall back to a thinner
**companion** pool. Since member+member (E) is *always* platonic and Sidekick
friends are platonic, the platonic pool now carries much more weight and needs to
be as good as the romantic one.

**Task:** generate an enriched platonic dual **pose + scene** pool — buddy
adventures, side-by-side, high-fives, shared-activity, family-warm (for
two-of-your-people) — matching the quality bar of the romantic pool. Two hard
gates from CLAUDE.md apply:
- Follow `BOT_SCENE_QUALITY_PLAYBOOK.md` (re-read in full before seeding).
- **MANDATORY:** run `node scripts/scan-dual-faceswap-proximity.js` and reword any
  flagged entry — platonic poses must still keep a clear gap between faces/heads
  or the dual split fails. Scan must exit 0 before shipping.

Seed at 25 first, review, then scale (the seed-25-then-scale mandate).

---

## 5. Settings → Dream Cast screen (the main UI build)

Upgrade the existing `DreamCastStep` (reused in onboarding + `/settings/dream-cast`
+ edit-profile) so the **settings context** shows the full roster; onboarding
stays the simple 2-slot version.

```
   Who do you want to dream with?

   YOU
   ┌───────────────┐
   │  (your photo) │ ★   the star of your dreams
   └───────────────┘

   YOUR CAST                                   up to 5
   ┌────┐ ┌────┐ ┌────┐ ┌ + ┐
   │ 📷 │ │ 📷 │ │ 📷 │ │Add│
   │❤️Sw│ │💛Si│ │❤️Sw│ └────┘
   │ ●  │ │    │ │    │        ● = Active Partner
   └────┘ └────┘ └────┘
   tap a card → replace photo · Sweetheart/Sidekick · Set as Active · Remove

   HOW YOUR CAST SHOWS UP AT NIGHT
   ┌────────────────────┬────────────────────┐
   │  🎲 Mix it up      │  📌 Just my        │
   │  your whole cast   │     Dream Partner  │
   │  takes turns       │     (Ava ❤️)       │
   └────────────────────┴────────────────────┘
```

- **Roster cards:** photo + tag pill (❤️ Sweetheart / 💛 Sidekick) + an "Active"
  ring on one. Tap → edit sheet (replace photo, toggle tag, Set as Active,
  Remove). Dashed "+ Add" up to 5. Reuse the existing pill-selector idiom
  (`DreamCastStep` relationship pills) + the upload/describe flow (unchanged).
- **Mode toggle (Phase 2 — NOT in Phase 1):** the segmented Locked / "Mix it up"
  control. **Phase 1 has no toggle** — dreams are always you + your current Dream
  Partner (implicitly "locked"); the toggle appears only when Rotate ships.
- **Self slot** unchanged.

For **Phase 1** the screen is just: YOU + the roster cards (add/tag/set-current/
remove up to 5). No mode toggle, no rotation copy.

Onboarding: the current single "+1" slot stays (writes `partner_library[0]` +
`active_partner_id` + `cast_mode='locked'`). Copy nudge → "add more in Settings."

---

## 6. Create (interactive) — unchanged

Create stays prompt-driven; "my partner" resolves to the Active Partner via the
mirror. No new chooser needed. (Optional future: a per-dream partner override —
deferred; not in v1.)

---

## 7. Migration (JSONB transform, no DDL)

For every `user_recipes.recipe` with a `plus_one` in `dream_cast`:
1. Mint `partner_library = [ { id: new-uuid, ...the existing plus_one fields, relationship } ]`.
2. `active_partner_id = that id`; `cast_mode = 'locked'`.
3. Keep the existing `plus_one` element in `dream_cast` (it's now the mirror).
4. Leave the existing `cast-plus_one-*.jpg` storage object as-is (referenced by
   library[0].storage_path for back-compat; new partners use id-based paths).

Runs as a one-time backfill (JSONB update; no schema change). Users with no
plus_one get `partner_library: []`, `cast_mode: 'locked'`, `active_partner_id: null`.

Types: update `types/vibeProfile.ts` + `_shared/vibeProfile.ts` (add
`partner_library`, `active_partner_id`, `cast_mode`; collapse `relationship` to
`partner|friend`). Client store (`store/onboarding.ts`) gains roster + active +
mode setters (move off role-as-unique-key for partners).

---

## 8. Phased implementation

### Phase 1 — the dynamic +1 (RENDER-NEUTRAL, ship first)  ← current scope

**Deliberately scoped to zero render change.** Dreams stay exactly "you + a +1"
as today; the ONLY difference is the +1's *identity* becomes dynamic (whoever is
the current Dream Partner). No rotation, no member+member, no roster-wide solos.

What ships:
- **Settings only:** upload **up to 5** Dream Cast photos (onboarding stays the
  single "+1" slot, untouched).
- **Per-photo relationship tag:** Partner / Friend, on each of the 5.
- **Set current Dream Partner:** pick which of the 5 is active.
- The recipe gains `partner_library[]` (the 5, each with a stable id) +
  `active_partner_id`. Setting the current partner **syncs that member into the
  `dream_cast` `plus_one` slot** (the mirror) in one atomic `user_recipes` write.

Why it's zero-risk: every render read is still `.find(role === 'plus_one')`, so
nightly + Create + the swap + the romantic/platonic framing are **byte-for-byte
unchanged** — see §8a. `cast_mode` is not needed yet (implicitly "locked").

Work: recipe shape + migration (single plus_one → `partner_library[0]`, set
active) + types; the Settings roster UI (add/tag/set-current/remove up to 5,
reusing the existing upload/describe/pill-select pieces). No engine changes.

### Phase 2+ — the roster comes alive (DESIGN LATER, when we build it)

Everything with real render complexity is deferred. When we take these on we'll
design the full selection tree rigorously (the single/dual × self/partner/member
breakdown, weights, and where they slot into `chaosTier.rollNightlyDreamType` +
`dreamAlgorithm` Step 4):
- **`cast_mode` = "Mix it up" (Rotate)** — nightly rolls across the roster.
- **member + member** combos (always platonic).
- **roster-wide solos** (any cast member can star solo).
- **enriched platonic pose/scene seeds** (proximity-scanned, seed-25-then-scale).
- **copy/naming polish** (Sweetheart/Sidekick, "Mix it up", etc.).

## 8a. How the render breaks down — Phase 1

**It doesn't change.** The current distribution is a product of
`chaosTier.rollNightlyDreamType` (nightly) and the prompt (Create); Phase 1 keeps
both and only swaps *which member* is the +1.

Current nightly distribution for a user with self + a partner (engine_config
defaults, `chaosTier.ts:169-247`), for reference — Phase 1 preserves ALL of it:
- **Face-swap share** `face_swap_share_with_plus_one` = 0.9 → within it
  `dual_rate` 0.6 / `self_rate` 0.2 / +1 0.2 ⇒ **~54% dual (you+partner) / ~18%
  self-solo / ~18% partner-solo** of the face-swap portion.
- Plus `dream_art_share` (0.3, same dual/self/+1 split) and the scene-territory
  branch (embodied / pure_scene / epic_tiny).
- **Create** is prompt-driven: "me" → self, "my partner" → the +1 (= current
  partner), both → dual. Deterministic.

In every one of those, "the +1" simply resolves to the **current Dream Partner**
instead of a fixed single one — nothing else moves. (The full multi-member tree
that changes these weights is the Phase-2 design, not Phase 1.)

---

## 9. Risk & open items

- **Render risk is confined to Phase 2** (the roll), and even there only the
  *selection* step — the swap/detector is untouched. Phase 1 is render-neutral.
- **member+member framing** — must force platonic; verify the L/R geometry +
  gender routing works with two non-self members (they carry photos + genders
  like any member, so it should "just work," but it's the one combo to test on a
  real render before scaling).
- **Face-swap-mode tagging** — `uploads.face_swap_mode` is `single|dual`; the new
  combos still fit (dual = any two faces). No new enum value needed.
- **Deferred:** per-dream partner override in Create; >5 partners; partner-level
  weighting in Rotate (e.g., Active Partner appears more often).
