# GothBot — New Paths Plan (return-to)

Backlog of new GothBot paths to build, agreed 2026-06-10. **Excludes `the-rite`** (Kevin
passed on it). Build order is Kevin's call; each is a fresh `{ archetype, pools }` following the
playbook "Inventing NEW PATHS" method (audit → axes → MVP-25 → post for review → scale → commit).

Already shipped this session (for context): the-sanctum, the-frost-garden, twilight-gothic,
the-dark-prince. These 5 are what's left from the audit menu.

Each path below: **identity** · **signature money-shot axis** · **hard mandate (template FIRST rule)** ·
**bespoke axes** · **risk**. All scene/character paths use `universal:[]` self-lit axes (the bot's
LIGHTING/ATMOSPHERES pools are castle-night-coded). Always `--post` test renders (Kevin reviews in-feed).

---

## 1. `the-haunting` — the GHOST / spectre  ★ recommended first (low risk, totally absent)
- **Identity:** a SOLO ethereal, translucent ghost — a lady in white, a weeping spectre, a drowned bride, a spectral monk — drifting through a gothic hall / stair / garden / graveyard. Classic gothic haunting; the bot has zero ghosts (monster-prowl's "wraith" is a solid monster, not a ghost).
- **Signature axis:** `translucency` — the see-through spectral effect (you see the architecture THROUGH her, a faint inner glow, a dissolving lower edge / no feet, a cold mist trailing). This is the whole point and the hard part.
- **Hard mandate:** the figure is TRANSLUCENT and SPECTRAL — semi-transparent, faintly self-glowing, edges dissolving to mist, NOT a solid opaque person. Sorrowful, beautiful, eerie.
- **Axes (6):** spectre (archetype) / translucency (money-shot) / haunt_setting / pale_glow_light / atmosphere / composition. 50%-gated `manifestation` (a flicker of how she died / a reaching hand / a second faint shape).
- **Medium:** anime or a soft painterly register (test both). **Risk:** LOW — solo figure; only risk is Flux rendering her solid instead of translucent (fixable with a strong translucency mandate + a pale-glow medium).

## 2. `the-coven` — the WITCH / sorceress mid-spell
- **Identity:** a FEMALE witch / sorceress ACTIVELY casting — conjuring, brewing, drawing glowing runes, hands wreathed in magic. Every existing female path is a vampire/goth-beauty; none is a witch DOING magic. cozy-goth has the lair but nobody working it.
- **Signature axis:** `spell_effect` — the magic visibly happening (glowing sigils, conjured witchfire, a swirling vortex, a levitating ritual, a summoned familiar of light).
- **Hard mandate:** she is MID-CASTING — magic is visibly erupting from her hands / circle / cauldron RIGHT NOW. An action moment, not a posed portrait.
- **Axes (7):** witch (archetype) / spell_effect (money-shot) / casting_action / lair_setting / magic_light / wardrobe / composition. (character path, anchorScale LARGE-ish but full-ish body to show the casting gesture.)
- **Medium:** anime (matches the female character paths). **Risk:** LOW-MED — keeping it a WITCH (not a vampire) + the spell visibly active.

## 3. `the-blood-moon` — celestial horror (SKY as hero)
- **Identity:** the SKY dominates 60-70% of frame — a blood moon, an eclipse-omen, an aurora-of-the-damned, a comet of ill portent, a ring of crows across the moon — over a small silhouetted gothic landmark (a castle, a steeple, a gibbet, bare trees). The bot has no sky-dominant set-piece. (StarBot's `impossible-sky` move, gothic-coded.)
- **Signature axis:** `celestial_event` — the omen in the sky.
- **Hard mandate:** the SKY + celestial event fill 60-70% of the frame and ARE the hero; the gothic landmark is a SMALL silhouette across the bottom (never the subject).
- **Axes (5):** celestial_event (money-shot) / sky_canvas / landmark_silhouette / phenomenon / atmosphere. scene path, universal:[].
- **Medium:** anime / gothbot_gothic_print. **Risk:** LOW.

## 4. `the-congregation` — the vampire court / masquerade ball  ⚠️ multi-figure
- **Identity:** an ASSEMBLY of gothic figures — a vampire court around a throne, a masked ball, a coven gathered, a funeral congregation. Breaks the bot's all-solo limit. The "wow, a whole scene of them" energy.
- **Signature axis:** `assembly` — the gathering as a tableau (figures ranged across a hall, a throng of masks, a circle of robed cultists).
- **Hard mandate:** MULTIPLE (4-8) distinct gothic figures sharing the frame in a grand setting, a social/ceremonial moment.
- **Axes (6):** gathering (assembly type) / cast (the figures' dress/look) / hall_setting / event_moment / light / composition.
- **Medium:** gothbot_gothic_print (painterly handles crowds) — test. **Risk:** HIGH — multi-figure is hard for Flux (faces/anatomy degrade in crowds). MVP carefully; **cut it like swarm-mind if it doesn't hold.**

## 5. `the-embrace` — gothic ROMANCE / the couple  ⚠️ two-figure
- **Identity:** TWO figures in a tender / doomed romantic moment — a vampire and a willing victim, two lovers in a moonlit hall, a dance, an embrace, a hand kissed. GothBot's references (Crimson Peak, Interview with the Vampire) are ROMANCES, yet the roster has zero tenderness/intimacy. The single most glaring thematic hole.
- **Signature axis:** `embrace_moment` — the intimate gesture (a bared throat + lowered lips, a waltz mid-turn, a hand drawn to a mouth, foreheads touching).
- **Hard mandate:** TWO figures in tender physical contact / intimate proximity — romantic and gothic and a little dangerous. NSFW-clean.
- **Axes (6):** couple (the pairing — vampire+mortal / two vampires / lovers) / embrace_moment (money-shot) / setting / mood_light / wardrobe / composition.
- **Medium:** anime / painterly. **Risk:** MED-HIGH — two-figure (but vampire-assassin-combat proves GothBot CAN do two figures with hard frame-share + contact mandates; clone that rigor).

---

### Build order suggestion
`the-haunting` → `the-coven` → `the-blood-moon` (the three low-risk bangers), then the two
risky multi-figure ones (`the-embrace`, `the-congregation`) last, since either may need cutting.

### Debt to clear FIRST (Kevin, 2026-06-10 — before any new path)
1. **2 frozen snapshots** (vampire-from-a-distance, monster-prowl-victorian) — decision pending.
2. **goth-full-body** — migrate legacy inline-brief → declarative axis system (like goth-closeup).
3. **the-dark-prince ~1/3 monstrous/tight-face drift** — tighten menace pool (less snarl) + enforce composed elegant bust composition.
