# Create → nightly looks & vibes: the family migration

**Status: design, not started.** Nothing in here has shipped. The nightly engine that went live 2026-09-14 is
untouched by this plan until Phase 3, and even then only by addition.

**The ask (Kevin, 2026-09-14):** replace Create's mediums and vibes with the nightly catalogue, grouped by FAMILY.
A user picks a family; the engine rolls a sub-look with RNG. Pools are shared, so removing a look removes it from
both engines. The post surface shows and stores the family; re-rolls pick the family and never the original
sub-look. The exact look key is still logged so a dream can be reproduced exactly, and that key must be patchable
through on the reproduce path.

---

## 1. The design in one paragraph

**A family is a TOKEN, not a row.** The picker sends `medium_key: "family:painted_realism"`. That token is resolved
inside `resolveMediumFromDb` the same way `surprise_me` and `dream_eligible_embodied:<csv>` already are, and it
rolls a sub-look from that family. `uploads.dream_medium` keeps holding the **exact look key**, which is what
nightly already writes there today. The family is a **display projection** computed in code from
`dream_mediums.nightly_family`. Family names, descriptions and order live in a small `dream_look_families` table
Kevin edits from the dashboard.

Six independent design passes were run and then attacked by six independent skeptics reading the live code and
database. Four of the six attackers converged on this token design from different directions. The first-pass
alternatives — family rows in `dream_mediums`, a family column on uploads, per-family DreamSmart sets — were all
found unsound for reasons in §3.

**What the token design buys, for free:**

| requirement                                       | how it is satisfied                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| shared pool, one removal hits both engines        | Create rolls the same rows nightly rolls; `nightly_enabled=false` removes it from both |
| store + show the family                           | derived from the stored exact key by one helper; no new column, no backfill            |
| re-roll picks the family, never the original look | Dream Again presets the family token and passes the original as an exclusion           |
| reproduce a dream exactly                         | the exact look key is already in `uploads.dream_medium`; the reproduce path pins it    |
| no FK, no collision, no constraint rewrite        | `family:` cannot be a `dream_mediums.key`, so nothing collides                         |

---

## 2. Corrections to what I believed before the pass

Each of these was verified against the live database or the running code, and each one changed the design.

- **There is no foreign key on `uploads.dream_medium`.** I said there was. There is not: 3,064 of 39,709 rows
  already hold values that are not `dream_mediums` keys, mostly bot mediums. So storage was never constrained —
  but that also means nothing protects it, which is why the design keeps writing a real key there.
- **`uploads.dream_vibe` already holds version keys.** 704 of the last 3,168 uploads carry `cozy__bold`-shaped
  values, written by the nightly engine this week. It is not a clean family column and never was. Dream Again on
  any recent nightly post would therefore reproduce the exact sub-vibe, which is the thing the brief forbids.
- **Create's vibe versions are inert.** All 69 versions of the 22 Create-visible vibes have a directive and a
  restyle fragment byte-identical to their base row. The only field that differs is the render fragment, and Create
  reads the render fragment **nowhere**. So rolling a version on Create changes literally nothing until Create
  starts using fragments. That, not the family roll, is the vibe prize.
- **Nightly is look-first as of last night.** The looks path sets `LOOKS_ALL_MODELS` and passes `modelFromLook`, so
  approvals gate the **surface** and the model pool is the policy's three models minus explicit rejections. A
  design written against the older model-first behaviour produced an empty model set on today's data.
- **Two more duplicate pairs than I reported**: `film_noir` and `vintage_film` also exist twice. And
  `nightly_adult_cartoon`'s recorded legacy medium is not a `dream_mediums` row at all, so it is not a duplicate.
  Nine real duplicates, not eight.
- **Glamour and Noir cannot be retired in favour of their look twins.** Both twins carry explicit `approved=false`
  rows, which is a judgment, not an absence. Retiring the Create mediums would remove both styles from the app
  entirely, and would also make every Kontext restyle style non-public, silently deleting real-face restyle.

---

## 3. What the attacks killed

| idea                                                      | why it died                                                                                                                                                                                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| family rows inside `dream_mediums`                        | two proposed family keys collide with live medium keys (`watercolor`, `photography`); needs a composite self-FK, a CHECK rewrite, a mirror trigger and a later cleanup migration, all to model a grouping that already exists as a text column |
| a `family` column on uploads                              | requires a backfill of 39,709 rows and a second source of truth that can drift from the key beside it                                                                                                                                          |
| retiring the 9 duplicate Create mediums                   | deletes real-face restyle and removes Glamour and Noir from the app; converts a reversible additive change into an irreversible content migration                                                                                              |
| deriving Create's model list from nightly approvals       | ungraded is not the same as disallowed on a **paid** path; the derivation cuts the 2, 3 and 5 sparkle tiers out of Create entirely                                                                                                             |
| per-family DreamSmart sets with safety and variety floors | yields an empty set on today's data, which breaks its own guardrail and turns DreamSmart off for every family                                                                                                                                  |
| rolling the look at enqueue                               | the look is not needed to price a dream; freezing it early forces a payload change and a surface guess the server can make correctly later                                                                                                     |

---

## 4. The mechanics that matter

**Money.** Resolve the **model** at enqueue, the **look** at render. The sparkle charge is a function of the model
alone, so the pricing invariant only needs the model frozen before the charge. The family's model set is authored
on the family row, DreamSmart coerces against it exactly as it does today, the charge happens, and the look is
rolled at render once cast resolution knows whether this is a solo or a couple. Charge equals render, unchanged.

**Model availability.** A family offers the three graded models. Rejections stay binding, approvals keep gating the
surface, and Create's existing premium models are not removed. Grade-gate look _quality_; leave model _availability_
to the model catalogue.

**Vibes.** Keep the version key in `uploads.dream_vibe` where nightly already writes it, add it to `recipe.vibe_key`,
and derive the family in code with the `versionTag` helper that already exists. No format change on either engine,
no backfill. Then the real work: make Create pass `vibeFragment` and `vibeFragmentPosition` into the dual slot
pipeline with the subject-first order nightly proved, behind a flag, judged on identity scores and fallback reasons.

**Restyle.** None of the 231 nightly vibe rows has a restyle fragment, and the directive is scene text that reads as
a no-op to Kontext. Restyle keeps the current 22 vibes until families have restyle fragments of their own. This is
a decision, not an oversight.

---

## 5. Rollout

Each phase is independently valuable and independently reversible.

1. **Families as data.** Create `dream_look_families` (key, label, description, sort_order, enabled). No engine
   change, no user-visible change. Reversible by dropping the table.
2. **The token.** Teach `resolveMediumFromDb` the `family:` branch and the exclusion argument. Old clients never
   send the token, so nothing changes for them. Reversible by removing the branch.
3. **Display projection.** One helper that maps a stored look key to its family label, used by the reveal badge,
   the Recipe line, Dream Again and the Explore filter. Historical posts keep resolving to their own labels.
4. **The picker.** Real Face shows six families; Dream Art keeps the eight embodied mediums unchanged. Gated by an
   allowlist and deterministic bucketing, copying the mechanism migration 515 already uses for nightly.
5. **Vibe fragments on Create.** The prize. Flagged, measured on identity and fallback reasons before it widens.
6. **Vibe families in the picker.** Only after 5 proves fragments help.

**The rules that make this safe**, all from the rollout review: freeze `get_dream_mediums` and `get_dream_vibes`
forever so old app versions keep working; never set `is_active=false` and never delete a style that has history;
gate the **offer**, never the acceptance, so a queued dream always renders even if the flag flips mid-flight.

---

## 6. What has to be graded before Phase 4

Create has surfaces nightly never graded: text with no cast, reimagine, new scene from a photo, restyle, DLT replay
and multi-person photos. The approvals grid covers solo and couple only.

The minimum before families reach a paid surface is a matrix over **look × model × the Create surfaces that differ
from nightly**, using the existing harness with the look as the axis instead of the medium. Until that exists, a
family ships with the three graded models and the ungraded surfaces keep today's mediums.

---

## 7. Open decisions for Kevin

1. **The nine duplicates.** Keep both names, or rename the Create originals so users do not see the same style
   twice? Retiring them is off the table for the reasons in §2.
2. **Family names.** Painted, Photographic, Comic & Print, Covers & Posters, Watercolor, Classic are the working
   set. Names are the whole UX of this change.
3. **Six families or seven?** Painted Realism holds 16 of the 54 looks. Splitting it would change nightly's
   family roll weighting, which was tuned this week.
4. **Restyle vibes.** Accept the frozen 22 for restyle, or author restyle fragments for the families?
