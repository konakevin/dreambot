# Halloween day-of HERO — the LOCKED LOOK (2026-09-07 →)

**Kevin's direction (2026-09-07):** "lock in on a single model/medium/vibe look, and then rely on the scene
composer/axis system to give variation — establish a configuration that works really well so that
everyone's halloween render looks good. I don't want photography — a painterly medium is more free to
embellish the scene and make it look truly spooky halloween. No boring outfits or scenes — memorable
images of the couple or person celebrating halloween. I'm not sure we've given this the attention it needs."

Approved alongside (same day): the hero solo fallback gets self's half of the attire + a never-faceless
rule; face-bearing decor stays low and out of the head zone (no gargoyle); a hero-specific push/inbox line
and a day-of bot-message register; verify the day-of gate uses the user's LOCAL date.

## 0. Where it stands (HOLIDAY_DREAMS_PLAN.md §13-14)
Six rows in `holiday_hero_prompts` (couple / male / female × cozy / eerie), template
`{setting} {time}, {palette}, {flourish}` + `{attire}, faces fully lit`, axes hashed per (user, holiday,
year), postcard overlay composited in-render, mediums pinned photography (female/eerie
`painted_gothic_fantasy`). Two problems this plan replaces: (a) on flux-1.1-pro the photography pin is
silently swapped for one of five random art fragments (the render's look is a coin toss); (b) the axes
describe "wearing nice clothes at a decorated place", not celebrating — cozy attire is turtlenecks and
beanies, settings are porches and living rooms. The couple surface renders on the v3 subject_first order
since 2026-09-07 21:38 UTC (COUPLE_PROMPT_PARITY_PLAN.md).

## 1. The target
ONE (model, medium fragment, vibe directive) for every hero surface and register. Variation comes from
the axes only: `{setting}` × `{attire}` × `{palette}` × `{flourish}` × `{time}` (≥ 1728 combos per row)
plus Sonnet's slot writing on top. Every combo must read as **a memorable painted image of the couple /
person CELEBRATING Halloween** — costume party, masquerade, trick-or-treat street, haunted hayride,
pumpkin carving, bonfire, witches' kitchen — never "standing near decorations".

Bar (the set-dresser + costume-designer mantra): a costume on every person (face clear: hats tilted
back, masks held in the hand, no face paint — the swap needs the face), a dressed set with ≥ 3 Halloween
props, a light source in frame (lanterns, candles, string lights, bonfire), the register in the palette
(cozy = amber / orange / violet fairy-light warmth; eerie = crimson / emerald / violet on black, moon and
fog), both faces large and frontal with a clear gap (swap-safe), no faces on the decor near the people.

## 2. Method — the look MATRIX (same slots, only the look varies)
Mechanism = the parity flags: `force_slot_input` (one authored input) + `force_dual_slots` (one authored
slot set) + `force_model` + `force_day_of: halloween` (so the postcard lands as it will on the day).
Because the input is forced, the 1.1-pro override library is bypassed and each tile renders the exact
fragment it is labelled with.

**Round 1 — eerie COUPLE, 5 models × 6 fragments = 30 renders** (Kevin's cast, hair variation off):
| | fragment | source |
|---|---|---|
| F1 | loose watercolor + ink, lifelike faces | curated 1.1-pro override |
| F2 | crisp ornate ink illustration, lifelike faces | curated 1.1-pro override |
| F3 | polished digital painting / concept art | curated 1.1-pro override |
| F4 | painted dark-fantasy oil, chiaroscuro, jewel tones (face-safe rewrite of `painted_gothic_fantasy`, no artist names) | new |
| F5 | Halloween storybook gouache + ink, jack-o-lantern glow on inky violet-black | new, authored for this |
| F6 | classical oil on canvas, warm chiaroscuro | `canvas` swap fragment |
Models: flux-1.1-pro, flux-2-flex, gemini-2-image, seedream-4, grok-imagine-image.
Scene (authored, pure environment, pumpkins LOW): a midnight masquerade in a candlelit gothic ballroom.
Attire (authored): she — crimson corseted gown, sheer black cape, jeweled choker, a lace masquerade
mask held at her hip; he — midnight velvet tailcoat, brocade waistcoat, silver-topped cane.
Output: `scratchpad/hero-look/round1/` + an artifact grid (fragment rows × model columns, swap stamps
under each tile) for Kevin to pick 2-3 finalists.

**Round 2 — finalists × cozy couple + male + female** (≈ 3 looks × 3 surfaces × 2 registers = 18).
Kevin picks THE look.

## 2b. The LOOKS system — MangaBot's pattern applied to the hero (Kevin, 2026-09-07)

Kevin: "examine a bot like mangabot and learn about its looks system — one model rendering a bunch of
different mediums or looks; get a few really polished looks using 1.1pro that render well and use those as
our halloween mediums — if they're good enough we could isolate each look as its own fun holiday medium."

**What MangaBot does** (`BOT_SCENE_QUALITY_PLAYBOOK.md` "Medium Looks" 2nd proven bot; files
`scripts/bots/mangabot/{seeds/mangabot_look_register.json, shared-blocks.js ANIME_NEUTRAL,
archetype-templates.js lookOverride(), index.js rollSharedDNA}`): ONE neutral medium locks the identity
("it is 2D hand-drawn anime") and drops every fixed style word; a 12-entry hand-authored LOOK register of
pure rendering sub-styles (Ghibli gouache / 90s OVA cel / Shinkai / KyoAni / shonen ink / Trigger neon /
ufotable / loose watercolor-ink / flat gouache poster / pastel / glossy cover) is rolled per render with a
recency picker and PREPENDED to the brief with style-authority wording so it leads CLIP. Rules that made it
work and that transfer verbatim: (1) every look is RENDER-STYLE ONLY (palette / brushwork / linework /
finish / light), zero subject anatomy, zero artist names; (2) looks are curated to compose with any scene
in the family — proportion-changers and monochrome are out; (3) bold looks dominate, subtle ones get
smothered by any baked style phrase downstream, so the surrounding text must be style-neutral; (4) the
look leads the prompt (the first ~60 words rule we proved on 1.1-pro couples is the same mechanism).

**Applied to the day-of hero:**
- **Identity anchor (neutral):** "a painted Halloween celebration" — carried by the hero rows' scene + attire
  axes, never by a style word. The couple line stays the v3 people-first line (no style words in it).
- **The look register = 3-5 curated 1.1-pro Halloween fragments**, each authored as pure technique + the
  swap clause ("lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural
  size and spacing"). Round 1 (§2) is the audition: 6 candidates × 5 models, Kevin keeps the ones that
  render polished on flux-1.1-pro (his stated model) and hold both faces.
- **Rolled per USER, not per render:** a `{look}` axis on the hero row, picked by the same
  `fnv1a(userId:holiday:year:look)` hash as setting / attire / palette / flourish / time — stable for the
  user, evenly spread across users, different next year. No two heroes are clones AND every hero is one of
  the approved looks. (MangaBot uses a recency picker because it renders 2×/day for one account; the hero
  renders once per user, so the seed hash is the right picker.)
- **Each look is its own holiday medium** (`dream_mediums` rows `halloween_<look>`: the fragment as
  `face_swap_flux_fragment` AND `flux_fragment`, `face_swaps=true`, `character_render_mode='natural'`,
  `smart_dream_models=[flux-1.1-pro]`, `allowed_models=[flux-1.1-pro]`, plus the DLT clean row so
  "Dream Like This" on a hero post reproduces the look). The hero row's `medium_key` becomes the
  `{look}` placeholder resolved from the axis → the render pins that medium → the existing per-medium
  pin path (`scene_medium:`) applies it. The 1.1-pro override library must NOT fire on a hero medium (the
  medium IS the curated look) — one exemption keyed on the `halloween_` prefix or a `no_override` flag
  on the medium row.
- **Model:** flux-1.1-pro pinned for the hero (Kevin). Couple retry / solo rebuild on the hero stay on the
  hero's model with the same fragment so a retry never changes the look.
- **Off-season:** the `halloween_*` mediums are `is_active=false` / `nightly_skip` outside the day-of
  path (the hero pins them explicitly, so the roll never needs them); flip `is_public` on for the window
  if Kevin wants them user-selectable in Create as seasonal mediums.

## 3. Then — rewrite the axes for "celebrating" (all 6 rows)
Settings (6 per row) become celebrations that lead with their Halloween noun; attire (4 per row) becomes
costumes (face-clear); flourishes become celebration props (sparklers, candy buckets, cider cauldron,
carved pumpkins low at the feet, lanterns); palette = decor colour; time = the night. Gargoyle out.
Generated with the archetype generator's costume-designer / set-dresser prompt, then 5 QA rounds per
surface × register on the locked look (judge + sheets + Kevin), like the Fall build.

## 4. Lock it in
- A dedicated `dream_mediums` row `halloween_hero` (the winning fragment as `face_swap_flux_fragment`,
  `smart_dream_models` = the winning model only) pinned on all six rows; the hero exempt from the 1.1-pro
  override library (or moot if the model is not 1.1-pro).
- Model: the winning model pinned for the hero surface (a `holiday_hero` surface row in
  `nightly_model_policy`, or a `model` column on the hero rows — decide when the winner is known).
- Vibe directive: one authored line per register on the row (the `{vibe}` the hero passes into the brief).
- The approved fixes: attire split for the solo rebuild; never-faceless (retry the rebuild once on the
  hero's model before a pure scene); hero push + inbox copy; local-date gate check.
- Tests: hero rows lint (face-clear attire, pumpkins-low rule, no gargoyle), medium pin honoured (no
  override), simulate-holiday-hero diversity gate still ≥ 90 %.

## 5. Status log
- 2026-09-07 21:50 UTC — plan written; Round 1 matrix launched (30 renders, eerie couple).

## 6. Verified while the matrix rendered (2026-09-07)
- **Day-of gate = the user's LOCAL date.** `holidayWindow.ts` `localDateInTz(now, users.timezone)` feeds
  `daysUntilPeak`; the hero fires on the nightly run that falls on Oct 31 in the user's own timezone (H2 in
  the module header). Approved item 4's timezone check passes; nothing to change.
- **The `{look}` axis is a 3-line extension of `fillHeroTemplate`.** Every axis is already picked by
  `fnv1a(seed:axis) % n` and substituted into `attire` / `scene`; adding `mediumKey: fill(row.mediumKey)`
  (or a dedicated `look` axis whose value is the medium key) gives each user one of the approved looks,
  stable per year. `picks.look` lands in the `holiday_hero:` forensics stamp for free. Test: the diversity
  gate (`scripts/simulate-holiday-hero.mjs`) must show the looks evenly spread across 500 users.

## 7. Round 1 result (2026-09-07 22:15 UTC) — 30/30 tiles, grid https://claude.ai/code/artifact/c2985172-a0c1-4a9f-9cca-328c299e6cd7
Swap outcomes: 27/30 first-try, 2 second attempt (F5 on flex + seedream), 1 degrade (F3 polished digital
on flux-1.1-pro). Identity 0.56-0.77 both sides everywhere else.
**Look read (my eye, Kevin decides):** flux-2-flex, gemini-2-image and seedream-4 rendered the CELEBRATION
on every look — couple mid-thigh or full-figure raising goblets, chandeliers, blood moon, pumpkins low,
costumes exactly as authored. grok rendered it smaller with the overlay dominant. **flux-1.1-pro rendered
4 of 6 looks as tight two-head crops with the ballroom barely visible** (F1 watercolor, F4 oil, F5 gouache,
F6 canvas), F2 ink as a wide staircase with the couple tiny, and F3 degraded. F5 (Halloween storybook
gouache) carried the strongest Halloween palette (violet + jack-o-lantern orange) on every model.
**Suspect under test:** the v3 people line inlines the WHOLE place text; this scene's place is 40 words,
so "two people … faces" is buried in scene words on the model that reads only its first ~60 words.
Re-running the 1.1-pro column with a short inline place ("a midnight masquerade ball in a candlelit gothic
ballroom") and the full scene in the scene slot. If the crops open up → v3.1 = first clause only inline
(a one-line change in `characterSlotPrompt.ts`, re-verified on 10 parity pairs). If not → the hero's
model is the flex / gemini / seedream evidence, not 1.1-pro, and the looks catalog records that per look.
