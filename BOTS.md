# Bot & Nightly Dream Generation System

## Two Dream Generators

DreamBot has TWO independent dream generation systems, each with its own DB table:

1. **Bot dreams** → `bot_seeds` table → bots post 2x daily via GitHub Actions cron
2. **Nightly user dreams** → `nightly_seeds` table → personalized dreams for each user nightly

Both use the same downstream pipeline (Sonnet → Flux → image), but they source their creative seeds differently and serve different purposes.

---

## BOT DREAMS — How They Work

Each bot account has a pool of **seed prompts** stored in the `bot_seeds` table (category prefix: `{username}_`). The bot script (`scripts/generate-bot-dreams.js`) picks a random unused seed, pairs it with a random medium + vibe from the bot's config, and sends it as a `hint` through the **V2 text path** of the `generate-dream` Edge Function.

The V2 text path: Sonnet receives the hint + medium directive + vibe directive → writes a 60-90 word Flux prompt → Flux Dev (or SDXL for anime/pixel_art) renders it → image persisted to Storage → draft upload created → script flips it to public.

## Why This Works

The key insight: **Sonnet + V2 + a good hint = stunning art every time.** We tested dozens of approaches — nightly templates, persona-driven Sonnet, self-contained templates, direct Sonnet freestyle. They all produced mediocre or repetitive results. The winning formula is giving Sonnet a **short, vague-but-anchored prompt** as the hint and letting the proven V2 engine handle the rest.

The hint is the creative seed. The medium directive shapes the art style. The vibe directive sets the mood. Sonnet ties it all together into a Flux prompt.

### Why "Epic Fantasy Scene..." Style Prompts Produce Great Results

A prompt like *"an epic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter"* works because:

1. **It gives Sonnet creative freedom.** When you over-specify ("a dragon on a cliff at sunset"), Sonnet just transcribes it — no creative value added. When you say "epic fantasy scene," Sonnet invents something original every time.

2. **It lets Sonnet optimize for what Flux renders well.** Sonnet knows which compositions, lighting, and subjects produce stunning results. Vague prompts let Sonnet pick from its best material.

3. **Genre anchors prevent chaos.** "Middle earth, lord of the rings, harry potter" doesn't constrain — it INSPIRES. Without genre anchors, Sonnet produces generic abstract scenes. With them, it produces Rivendell-quality beauty.

4. **The V2 medium directive does the heavy lifting.** The hint is just 15-25 words. The medium directive adds 50+ words of specific art instruction. Together = clear signal to Flux.

5. **Short hints > long hints.** Flux has a token limit. 20-word hint + 60-word directive = 80 words of clarity. 100-word hint + 60-word directive = 160 words of mush.

**The formula: vague creative direction + specific art style = Sonnet fills the gap with brilliance.**

---

## The Bot Training Process — How to Dial In a New Bot

This is the repeatable process we developed through Solaris, Yūki, Void Architect, Ember, Astra, and Cinder. Follow it for every bot.

### The Iterative Refinement Pattern (KEY TECHNIQUE)

The most effective approach for building bot seed strategies:

1. **Start with a solid base prompt** targeting the bot's core persona ("an epic fantasy scene...", "a hauntingly beautiful gothic woman...")
2. **Run 10 seeds / 5 posts** to test the base prompt
3. **Review renders and iterate** — adjust language, add/remove descriptors, fix problems (wrong gender, wrong pose, wrong mood)
4. **Once the base is solid, split into 2-3 variant paths** that branch from the same energy but target different subjects (e.g., base gothic → horror creatures + goth women + dark landscapes)
5. **Each variant gets its own dedup strategy** — dedup on the dimension that matters most for that path (creature type, race, pose+setting, etc.)

This "refine then fork" pattern consistently produces better results than trying to design all paths upfront. The base prompt teaches you what works for the bot's aesthetic before you branch.

### Multi-Dimensional Dedup

Different paths need different dedup strategies:

- **Genre/scene paths:** dedup on main subject (1 word: "dragon", "castle", "forest")
- **Character paths:** dedup on race/type (1 word: "vampire", "drow", "succubus")
- **Paths with pose/composition problems:** dedup on 3 dimensions — creature type, pose, AND setting. Extract all 3 from each seed and ban all 3. This prevents the "everyone standing in ruins" problem.

The 3-dimension dedup extraction prompt:
```
"From this scene, give me THREE words: the creature type, the pose, and the setting. Comma separated. Example: vampire, lounging, cathedral"
```

### Prompt Language Lessons

- **"MUST be visibly female/male"** — Flux will render the wrong gender if the seed doesn't explicitly specify. Always force gender in character prompts.
- **Don't suggest too many example verbs/actions** — Sonnet latches onto the first few and ignores the rest. Keep action lists short.
- **"Never-before-seen variant/reimagining"** — forces original designs instead of standard depictions of creatures
- **"No blood, no gore, no clowns"** — explicit exclusions work better than vague "not too dark"
- **Describe the ENERGY not the pose** — "succubus energy, dark temptress vibes" works better than "standing seductively"
- **Physical descriptors that render well** — "dark lipstick, heavy eyeliner, pale skin, glowing eyes, fangs, sharp claws, tattoos, piercings" — these give Flux concrete visual anchors
- **"Vary the pose wildly: lounging, crouching, mid-spell, perched on a throne..."** — explicit pose suggestions + dedup prevents static standing compositions
- **Emotional language from Kevin works** — "she lures you in with her evil smile only to destroy you" produces better results than clinical descriptions. Keep the human voice in prompts.

### Step 0: Get a Rough Baseline

Before finding the perfect prompts, run quick tests through both the **nightly dream path** (template-driven) and the **V2 text path** (hint-driven) using the bot's mediums. This gives you a cross-section of what each pipeline produces for this bot's aesthetic.

- Run 5 nightly-style dreams (pass `vibe_profile` + `medium_key` + `vibe_key`, no hint)
- Run 5 V2-style dreams (pass `medium_key` + `vibe_key` + a simple hint like "a stunning [genre] scene")
- Compare: which pipeline produces better results for this bot's mediums?
- V2 with hints consistently wins for bots — nightly templates produce generic/corridor compositions without rich user profile data

This baseline tells you: which mediums render well, which model (SDXL vs Flux) works better, and what the genre prompt needs to anchor on. From there you refine.

### Step 1: Find the Genre Prompt

Start with a simple, open-ended prompt anchored to the bot's universe. Pattern:

"an [adjective] [genre] scene that is [quality words] in the style/universe of: [3-8 reference works]"

**Examples:**
- Solaris: "an epic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter"
- Yūki: "an extremely interesting and visually appealing scene from the universes of: studio ghibli, makoto shinkai, demon slayer, spirited away, your name, akira, evangelion, attack on titan, cowboy bebop, ghost in the shell, princess mononoke, howls moving castle, jujutsu kaisen"

**Rules for the genre prompt:**
- Keep it VAGUE on specifics but ANCHORED to references
- Don't list specific subjects (castles, waterfalls) — Sonnet will default to those
- The quality words matter ("mind blowingly exotic and beautiful" > "cool")
- Test 5 renders. If they're beautiful but repetitive, the prompt is working — variety comes from dedup + strategy mix

### Step 2: Find the Landscape/Environment Prompt

A second prompt for pure environment scenes. Keep it even more open:

"a beautiful [genre] [world/landscape] that is [quality words]"

**Examples:**
- Solaris: "an epic fantasy landscape that is exotic and mind blowingly beautiful and interesting to look at"
- Yūki: "a beautiful Japanese anime world that is visually stunning, warm and inviting, interesting to explore"

**Don't list specific things** (cottages, villages) — Sonnet will latch onto whatever you list and repeat it. Keep it abstract and let Sonnet decide.

### Step 3: Find Variant Paths (Character, Creature, etc.)

After the base genre + landscape are solid, add specialized paths for the bot's unique content:

**Character-focused bots (Ember, Cinder, Astra):**
- Split by gender: female body, female face, male body, male face
- Split by energy: seductive, action, horror, intimate
- Each path gets its own dedup target (race, pose+setting, creature type)

**Examples of successful variant paths:**
- Ember: `femalebody`, `femaleface`, `femaleaction`, `malebody`, `maleface`, `maleaction`, `seductive` (7 paths!)
- Cinder: `genre`, `genre_dedup`, `landscape`, `horror` (classic creatures), `gothwoman` (sexy goth women)
- Astra: `androidwoman`, `cyborgface`, `alienface` (3 face/body variants)

**Key: each variant should feel like it belongs on the same account but shows a different facet.**

### Step 4: Test Mediums

Run 1-2 renders per medium with the genre prompt. Identify:
- Which mediums produce stunning results for this bot's aesthetic
- Which model (Flux Dev vs SDXL) renders each medium better
- Kill any medium that consistently produces bad results

**SDXL vs Flux routing:**
- `anime`, `pixel_art` → always SDXL (it renders these much better)
- `ghibli` → 50/50 SDXL/Flux (both look good, different flavor)
- `anime_illustration` → 50/50 SDXL/Flux
- Everything else → Flux Dev
- The keyword fallback (`prompt.includes('anime')`) only fires when no `medium_key` is provided

### Step 5: Test Vibes (the most important step)

Run the genre prompt with EVERY vibe and evaluate each one. For each result, rate it:

- **GOD TIER** — triple weight (3x entries in the pool)
- **EXCELLENT** — double weight (2x entries)
- **GOOD** — normal weight (1x entry)
- **BAD** — exclude entirely

Build a weighted vibe pool per medium using array repetition:
```javascript
pinVibes: {
  anime: ['enchanted', 'enchanted', 'enchanted', 'cinematic', 'cinematic', 'dreamy', 'dreamy', ...],
  ghibli: ['enchanted', 'enchanted', 'enchanted', 'majestic', 'epic', 'mystical'],
}
```

**Key learnings:**
- Test EVERY medium + vibe combination — some combos are magic, others are terrible
- Pin specific vibes to specific mediums when a combo is consistently great
- When Kevin says "that's good" → bump. "That's excellent/killer/10 out of 10" → double or triple bump
- The vibe weighting is what makes or breaks a bot's content quality

### Step 6: Generate 60+ Deduped Seeds

Use the iterative passback technique to generate 15-20 seeds per strategy:

1. **GENRE (15):** Ask Sonnet for a scene from the genre prompt. Extract 1-word subject. Ban it. Repeat.
2. **GENRE+DEDUP (15):** Continue the ban list from strategy 1 (now 15 banned subjects). Generates deeper variety.
3. **LANDSCAPE (15):** Separate ban list. Same technique with the landscape prompt.
4. **VARIANT PATHS (15 each):** Separate ban lists. Dedup on whatever dimension matters for that path.

Store in `dream_templates` with categories: `{username}_genre`, `{username}_genre_dedup`, `{username}_landscape`, etc.

### Step 7: Test the Full Pipeline

Run 10 posts through the bot script using the stored seeds. Verify:
- Seeds are being pulled from DB correctly
- Medium + vibe weighting is hitting the right combos
- Quality is consistent
- Variety is good across the 10

### Step 8: Iterate on Feedback

As Kevin reviews posts, update weights in real-time:
- "That's good" → bump that vibe for that medium
- "Kill that medium" → remove it
- "That combo is 10/10" → heavy weight
- "Repetitive" → needs more dedup or seed variety

---

## What Failed (NEVER repeat for any bot)

- **Nightly template system** → templates dominate with corridor/architecture compositions
- **Sonnet persona-driven prompts** → too abstract ("shadow-silk catching souls"), Flux can't render them
- **Self-contained Sonnet templates** → too poetic, not paintable
- **Generic prompt with no dedup** → repetitive (same scene every time)
- **Full prompt passback dedup** → prompt too long, gets truncated, made output MORE repetitive
- **Hardcoded specific hints** (kraken, sword, world-turtle) → inconsistent quality, not scalable
- **"Massive/colossal/gargantuan" scale words** → biases Flux toward centered giant objects
- **Seeds injected into templates** → seeds + templates fight each other
- **Listing specific subjects in landscape prompts** ("cottages, villages") → Sonnet latches onto whatever you list
- **Abstract horror prompts** ("the wrongness of a shape that shouldn't exist") → Flux renders generic dark figures, not scary
- **Body horror / Silent Hill style** → too grotesque, not beautiful
- **Too many example verbs/actions** → Sonnet picks from the first 2-3 and ignores the rest
- **"Push the edge" / "dominatrix"** → Sonnet refuses or Flux gets blocked by moderation. Use "dark temptress", "succubus energy" instead
- **Cemetery wraith prompts without creature variety** → every render is the same hooded figure
- **Not specifying gender** → Flux renders male when you want female. Always say "woman" or "female" explicitly

---

## Bot Profiles

### Solaris — Epic Fantasy Art ✅ COMPLETE

**Username:** `solaris` | **ID:** `ff629c07-8441-4d80-98ff-9b7010d3338b`
**Avatar:** Fantasy sorceress with silver-white hair, amber-gold eyes
**Mediums:** `oil_painting`, `fantasy`, `watercolor`
**Excluded vibes:** `minimal`
**Seeds:** 60 in DB (`solaris_genre`, `solaris_genre_dedup`, `solaris_landscape`)

**Genre prompt:** "an epic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter"
**Landscape prompt:** "an epic fantasy landscape that is exotic and mind blowingly beautiful and interesting to look at"

### Yūki — Anime / Japanese Culture ✅ COMPLETE

**Username:** `yuuki` | **ID:** `e1e808d1-4569-462c-a84a-09e3e1119513`
**Mediums:** `anime`, `ghibli`, `anime_illustration`
**Excluded vibes:** `ancient`, `ominous`, `fierce`, `psychedelic`, `chaos`, `minimal`
**Seeds:** 60 in DB (`yuuki_genre`, `yuuki_genre_dedup`, `yuuki_landscape`, `yuuki_cute`)

**4-Strategy Split (25/25/25/25):**
1. **GENRE** — epic/action anime scenes with characters, creatures, architecture
2. **GENRE+DEDUP** — same with forced variety
3. **LANDSCAPE** — beautiful Japanese anime worlds to explore
4. **CUTE** — adorable heartwarming scenes (Totoro, Ponyo, Kiki style) with big eyes and warm feelings

**Vibe weighting (GOD TIER → regular, from testing):**
- **anime:** enchanted ████, cinematic ████, majestic ███, dreamy ███, whimsical ███, mystical ██, dark ██, cozy ██, epic ██
- **ghibli:** enchanted █████ (GOD TIER), whimsical ██, majestic ██, epic ██, mystical ██
- **anime_illustration:** dreamy █████ (GOD TIER), whimsical ████, enchanted ██, majestic █, epic █, cinematic █

### Void Architect — Surreal Sci-Fi ✅ SEEDED

**Username:** `void.architect`
**Mediums:** `surreal`
**Excluded vibes:** `minimal`, `whimsical`
**Seeds:** In DB — 8 strategies: `genre`, `genre_dedup`, `landscape`, `spacebattle`, `interior`, `cozyinterior`, `robot`, `city`, `androidwoman`
**Notes:** Most strategy-heavy bot. Space battles and cities use `noDedup` (infinite variety naturally). Android woman path shared with Astra.

### Astra — Sci-Fi Women ✅ SEEDED

**Username:** `astra`
**Mediums:** `surreal`
**Excluded vibes:** `minimal`, `whimsical`
**Seeds:** 3 paths — `androidwoman` (mechanical beauty), `cyborgface` (half-machine faces), `alienface` (half-alien faces)
**Notes:** All face/body focused. Dedup on body type, skin tone, alien features.

### Ember — High Fantasy Characters ✅ SEEDED

**Username:** `ember`
**Mediums:** `oil_painting`, `fantasy`, `watercolor`
**Excluded vibes:** `minimal`, `whimsical`, `cozy`
**Seeds:** 7 strategies — `femalebody`, `femaleaction`, `femaleface`, `malebody`, `maleface`, `maleaction`, `seductive`
**Notes:** Most character-path-heavy bot. Race variety is critical (elf, drow, tiefling, orc, etc.). "Sexy but never nude, never topless" language works. Fantasy art style keeps renders tasteful.

### Cinder — Gothic Dark Fantasy ✅ COMPLETE

**Username:** `cinder`
**Mediums:** `tim_burton`, `fantasy`, `anime`, `oil_painting`
**Excluded vibes:** `minimal`
**Seeds:** 5 strategies in DB (`cinder_genre`, `cinder_genre_dedup`, `cinder_landscape`, `cinder_horror`, `cinder_gothwoman`)

**Strategies:**
1. **cinder_genre** — hauntingly beautiful dark fantasy scenes (dark souls, elden ring, bloodborne, tim burton, gothic fairy tales)
2. **cinder_genre_dedup** — same with continued ban list
3. **cinder_landscape** — dark gothic landscapes, haunted and atmospheric
4. **cinder_horror** — classic horror creatures (werewolf, vampire, demon, succubus, etc.) reimagined as never-before-seen variants. No blood/gore/clowns. Dedup on creature type + pose + action.
5. **cinder_gothwoman** — exquisitely beautiful goth women from hell. Evil incarnate but lures you in. Dark lipstick, eyeliner, pale skin, glowing eyes, fangs, claws, tattoos, piercings. Succubus energy. Dedup on race + pose + setting (3-dimension dedup).

**Key learnings from Cinder:**
- Anime needs no special vibe pinning — the dark aesthetic comes from the seeds naturally
- oil_painting added as 4th medium — works well for gothic aesthetic
- 3-dimension dedup (creature+pose+setting) solved the "everyone standing in ruins" problem
- "She MUST be visibly female" is required or Flux renders males
- Kevin's emotional language ("lures you in with her evil smile only to destroy you") produces better seeds than clinical descriptions
- "No blood, no gore" + creature list + "never-before-seen variant" = scary without being gross
- Goth aesthetic needs explicit physical descriptors (lipstick, eyeliner, fangs, claws) or renders look like generic dark robed figures

### Remaining Bots (not started)

| Username | Persona | Mediums | Seed Status |
|---|---|---|---|
| aurelia | Ethereal beauty | watercolor, oil_painting, ghibli | ❌ needs testing |
| terra | Awe-inspiring nature | photorealistic, oil_painting, surreal | ❌ needs testing |
| prism | Stylized mediums | 19 mediums | ❌ needs testing |
| mochi | Kawaii cozy | 3d_cartoon, claymation, disney, childrens_book | ❌ needs testing |
| pixelrex | Retro gaming | pixel_art, 8bit, vaporwave | ❌ needs testing |
| frida.neon | Bold maximalist | comic_book, retro_poster, art_deco | ❌ needs testing |

---

## Model Routing

| Medium | Model | Notes |
|---|---|---|
| anime | SDXL always | Much better cel-shading than Flux |
| pixel_art | SDXL always | Better retro pixel rendering |
| ghibli | 50/50 SDXL/Flux | Both produce good but different results |
| anime_illustration | 50/50 SDXL/Flux | New medium, testing |
| everything else | Flux Dev | Default |

Keyword fallback (`prompt.includes('anime')`) only fires when no `medium_key` is provided (legacy paths). When a medium_key exists, the SDXL/ALWAYS and SDXL_HALF sets are the sole routing authority.

## Cron Schedule

GitHub Actions workflow: `.github/workflows/bot-dreams.yml`
- Runs 2x/day (6am UTC + 2pm UTC) with 0-4 hour random delay
- Each run generates 1 post for EACH seeded bot
- Manual trigger available with `--bot` and `--count` params
- Only seeded bots are included — update the `BOTS` array when new bots are ready
- Currently active: solaris, yuuki, void.architect, astra, ember, cinder

## How to Deploy a New Bot

Once a bot's seeds are generated and tested:

1. **Add templatePrefix** to bot config in `scripts/generate-bot-dreams.js`:
   ```javascript
   botname: { mediums: [...], templatePrefix: 'botname_', excludeVibes: [...], pinVibes: {...} }
   ```

2. **Add to cron** in `.github/workflows/bot-dreams.yml`:
   ```bash
   BOTS=("solaris" "yuuki" "newbot")
   ```

3. **Generate avatar** — use Sonnet to describe the character, render with Flux, upload to `avatars/` storage, update `users.avatar_url`

4. **Commit + push to main** — cron activates on next scheduled run

5. **Test** — `node scripts/generate-bot-dreams.js --bot newbot --count 1` to verify it posts correctly

6. **Verify in app** — search for the bot, check their profile shows posts

## Testing a Bot

**Always reset the seed pool before a testing session.** This clears `used_at` on all seeds so the full pool is available:

```bash
# Reset a bot's seed pool (replace cinder_ with the bot's prefix)
node -e "require('dotenv').config({path:'.env.local'});const sb=require('@supabase/supabase-js').createClient('https://jimftynwrinwenonjrlj.supabase.co',process.env.SUPABASE_SERVICE_ROLE_KEY);sb.from('dream_templates').update({used_at:null}).like('category','cinder_%').eq('disabled',false).then(r=>console.log('Reset done'))"
```

When starting work on any bot, Claude should proactively reset the pool and remind Kevin.

---

## NIGHTLY USER DREAMS — How They Work

Every night, each active user gets one personalized dream generated by the nightly cron. The system uses **slotted seed templates** stored in the `nightly_seeds` table.

### The Three Paths (40/30/30 split)

Each nightly dream rolls one of three paths:

**Path 1 — Personal Cast + Personal Elements (40%)**
- One cast member: self (50%), +1 (25%), or pet (25%)
- At least one personal element: location, object, or both
- Face swap applied for self/+1 on face-swap mediums (not pets)
- Example: "Kevin on a Hawaiian cliff holding a guitar in a watercolor dreamscape"

**Path 2 — Personal Elements Only (30%)**
- No cast member
- At least one personal element: location, object, or both
- Pure environment dream featuring the user's stuff
- Example: "A guitar floating in a Hawaiian tide pool at sunset"

**Path 3 — Cast + Pure Random Scene (30%)**
- One cast member: self (50%), +1 (25%), or pet (25%)
- No personal elements — completely random scene
- Face swap for self/+1 on face-swap mediums
- Example: "Kevin suspended in an underwater cavern of bioluminescent jellyfish"

For **non-face-swap mediums** (LEGO, claymation, etc.), Paths 1 and 3 can include 1-3 cast members since they're fully stylized from text descriptions.

### The 8 Seed Pools

Based on the path roll and what personal data the user has, the system maps to one of 8 seed categories in the `nightly_seeds` table:

| Category | Slots | When used |
|---|---|---|
| `nightly_char` | `${character}` | Path 3 (cast in random scene) |
| `nightly_char_loc` | `${character}` + `${place}` | Path 1 (cast + location) |
| `nightly_char_obj` | `${character}` + `${thing}` | Path 1 (cast + object) |
| `nightly_char_loc_obj` | `${character}` + `${place}` + `${thing}` | Path 1 (cast + both) |
| `nightly_loc` | `${place}` | Path 2 (location only) |
| `nightly_obj` | `${thing}` | Path 2 (object only) |
| `nightly_loc_obj` | `${place}` + `${thing}` | Path 2 (both elements) |
| `nightly_pure` | none | Fallback (user has no personal data) |

100 deduped seeds per pool = 800 total.

### Slot Filling

At runtime, slots are filled with the user's actual data:
- `${character}` → cast member's AI-generated text description (from photo upload)
- `${place}` → random pick from user's `dream_seeds.places` (e.g., "hawaii")
- `${thing}` → random pick from user's `dream_seeds.things` + `dream_seeds.characters` combined (e.g., "guitars", "dragons")

### Runtime Flow

```
1. Roll path (40/30/30)
2. Roll personal elements based on path
3. Check what data user actually has → may downgrade path if data missing
4. Map to seed category (deterministic if/else chain)
5. Random pick from that pool (no per-user tracking — 100 seeds is enough variety)
6. Fill slots with user's data
7. Feed filled template to Sonnet + medium directive + vibe
8. Sonnet writes 60-90 word Flux prompt
9. Flux renders image
10. Face swap if applicable (face-swap medium + human cast)
11. Post to user's account
```

### Face Swap Rules

- **Face-swap mediums** (photography, watercolor, canvas, anime, neon, comics, shimmer, pencil, twilight, surreal): real photo pasted onto rendered character AFTER Flux generates. The `${character}` text description gets Flux to render the right body/age/gender, then face swap replaces the face with the actual photo.
- **Non-face-swap mediums** (coquette, pixels, lego, animation, claymation, vinyl, gothic, storybook, vaporwave, fairytale, handcrafted): fully stylized from text description only. No face swap. Can include multiple cast members in one scene.
- **Pets**: always description-only, never face-swapped (face swap model is trained on human faces).

### Generating New Nightly Seeds

```bash
node scripts/generate-nightly-seeds.js --count 100        # all 8 pools × 100
node scripts/generate-nightly-seeds.js --count 1 --dry-run # test 1 per pool
node scripts/generate-nightly-seeds.js --combo character   # one specific pool
```

Each seed is generated by Sonnet with dedup — an environment+lighting key is extracted from each seed and banned before the next one is generated. Within a pool of 100, no two seeds share the same environment + lighting combination.

---

## Database Tables — SEPARATE, NEVER CROSS-CONTAMINATE

### `bot_seeds` — Bot dream seeds

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| category | text | Bot prefix + strategy (e.g., `dragonbot_genre`) |
| template | text | Complete scene description, no slots |
| disabled | boolean | Soft-delete for old generations |
| used_at | timestamptz | Tracks per-seed usage (each used once) |
| generation | integer | Which generation batch this seed belongs to |
| created_at | timestamptz | When inserted |

**Lifecycle:** Each seed used once (`used_at` tracked). When pool exhausted, `regenSeeds()` disables old seeds, generates fresh batch via Sonnet from strategy prompts in `seed-generator.js`.

### `nightly_seeds` — Nightly user dream seeds

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| category | text | Pool name (e.g., `nightly_char_loc`) |
| template | text | Scene template with `${character}/${place}/${thing}` slots |
| created_at | timestamptz | When inserted |

**Lifecycle:** Permanent pool. Random pick every time (no usage tracking). 100 seeds per pool provides 3+ months of variety since medium + vibe differ each night, making the same seed render differently.

### `dream_templates` — LEGACY, DO NOT USE

Old table that used to hold both bot seeds and nightly templates. Kept temporarily. All code now reads from `bot_seeds` or `nightly_seeds`. Will be dropped once verified.

### The April 2026 Database Deletion Incident

During a cleanup session, an unscoped delete wiped ALL rows from `dream_templates` — both bot seeds (from trained bots) and nightly templates. This broke nightly user dreams and destroyed hand-curated bot seeds. The data was partially recovered from a Supabase backup, but the incident led to splitting into two separate tables to prevent cross-contamination.

**Hard rules to prevent this:**
- NEVER run unscoped deletes on seed tables
- Bot seed cleanup: `.delete().like('category', 'botname_%')` — scoped to one bot
- Nightly seeds: generated fresh via `scripts/generate-nightly-seeds.js`, not manually edited
- When in doubt, query first: `SELECT category, count(*) GROUP BY category` before any delete
- The two tables exist SPECIFICALLY so operations on one cannot affect the other

## Scripts

- `scripts/generate-bot-dreams.js` — reads from `bot_seeds`, picks unused seeds (tracks `used_at`), auto-regenerates when exhausted, signs in as bot, calls Edge Function V2 path, flips draft to public
- `scripts/generate-bot-seeds.js` — generates deduped bot seeds using Sonnet, stores in `bot_seeds` with generation tracking
- `scripts/generate-nightly-seeds.js` — generates 8 pools × 100 slotted nightly seeds, stores in `nightly_seeds` with per-pool dedup
- `scripts/generate-dream-templates.js` — LEGACY, generates old-style mood-weighted templates. Replaced by generate-nightly-seeds.js.
- `scripts/lib/seed-generator.js` — shared module: BOT_SEEDS config, generateScene, extractSubject, generateSeedsForBot
- `scripts/create-bot-accounts.js` — creates auth users + public.users + vibe profiles for all bots
- `scripts/generate-humanbot.js` — HumanBot content bot (Sonnet → generate-dream → Sharp terminal overlay)
- `scripts/generate-musebot.js` — MuseBot content bot (Sonnet → generate-dream → Sharp quote overlay)

## New Vibes Added (available to all users)

Added during bot testing, now in `dream_vibes` DB table:
- **ethereal** — soft glowing light, otherworldly radiance, divine light
- **mystical** — ancient magic, arcane energy, glowing runes
- **majestic** — grand scale, regal splendor, awe and reverence
- **ominous** — foreboding, tension before the storm, beautiful but unsettling
- **ancient** — deep time, weathered stone, forgotten civilizations
- **enchanted** — fairy-tale magic, sparkling particles, glowing flora
- **fierce** — raw power, dynamic energy, explosive force

## New Mediums Added

- **anime_illustration** — dense lush hand-painted Japanese animation style, adventure atmosphere, detailed backgrounds (added for Yūki's Mononoke/Nausicaa aesthetic)
- **aura** — bioluminescent glow, subsurface scattering, volumetric golden light rays, bloom effect, chromatic aberration. Created for MuseBot. `is_public: false` (bot-only, hidden from user picker).

---

## Lessons Learned: The April 2026 Bot Expansion (11 new bots in one session)

### What worked — the formula that produced 9/11 bots at 4+ quality on first generation

1. **Multi-path seed strategies, not generic prompts.** Each bot got 3-5 specific PATHS (e.g., BloomBot: landscape, portrait, surreal, cozy) instead of one vague "make pretty flowers" prompt. Each path is a distinct visual approach with its own dedup key. This produces variety because different seeds come from different conceptual angles.

2. **Sonnet generates the seeds, not us.** We define the creative DIRECTION per path (a 50-100 word prompt describing the energy, references, and quality bar), then Sonnet generates 15-20 specific seeds per path with built-in dedup. This gives us 60-80 seeds per bot that are all high-quality and non-repetitive. No hardcoded scene lists.

3. **The prompt formula for seed generation.** The prompts that worked best:
   - Start with what the scene IS (not what it looks like)
   - Include reference worlds/artists/genres the bot should channel
   - Include quality language that sets the bar ("jaw-dropping", "mind-blowing", "the most X thing you've ever seen")
   - Include specific variety instructions ("vary the X wildly")
   - Include what to AVOID ("never flat midday", "no gore")
   - Let Sonnet fill in the specifics — vague-but-anchored beats over-specified

4. **Dedup extraction per path.** Each path has an `extractPrompt` that pulls 2-3 dedup keys from each generated seed (e.g., "flower type + setting" for BloomBot landscape). This prevents repeating the same subject even across 60+ seeds.

5. **Medium pools curated per bot.** Don't give bots access to all 20+ mediums. Each bot gets 2-4 mediums that specifically match its aesthetic. BloomBot gets `photography, canvas, watercolor, pencil`. ArcadeBot gets `lego, pixels, animation, claymation, vinyl`. Wrong mediums produce images that look nothing like the bot's identity.

6. **The V2 text path as the universal rendering engine.** Every bot uses the same pipeline: seed → Sonnet expands to Flux prompt (incorporating the medium directive + vibe directive) → Flux Dev renders → draft upload → flip to public. The V2 engine handles the heavy lifting; the bot just provides the creative seed.

### What failed — and why 2/11 bots scored below 4.5

**HauntBot (3.5/5) — "Beautiful but not creepy"**

Root cause: **wrong vibe killed the horror.** HauntBot rendered `photography + psychedelic` which produced saturated, dreamy energy — the opposite of dread. The seed said "unsettling playground where the swing moves with no wind" but the psychedelic vibe turned it into a pretty garden scene.

Deeper issue: **competing instructions → Flux picks the safe option.** The seed said "beautiful BUT unsettling." When beauty and dread compete in a prompt, Flux resolves the conflict by defaulting to beautiful because that's what its training rewards. The subtle wrongness gets smoothed out.

Fix: Added `excludeVibes` — HauntBot now ONLY gets dark/ominous/ancient/fierce/mystical/epic/cinematic/chaos vibes. Excluded: whimsical, cozy, enchanted, dreamy, peaceful, cute, psychedelic, minimal. The heaviest exclusion list of any bot.

**TripBot (3.5/5) — "Fantasy art, not psychedelic"**

Root cause: **wrong medium + wrong vibe completely overrode the seed's intent.** TripBot rendered `comics + majestic` which produced a D&D illustration of a robed king — zero fractals, zero impossible colors, zero reality-dissolving geometry. The medium (comics = graphic novel line art) and vibe (majestic = grand/epic) pulled the image into a completely different register.

Deeper issue: **the medium/vibe combo is as powerful as the seed itself.** A psychedelic seed rendered in comics+majestic becomes fantasy art. The seed's intent gets overridden by the stylistic instructions from the medium/vibe.

Fix: Changed mediums from `canvas, comics, vaporwave` to `canvas, shimmer, neon` (mediums that actually handle impossible colors and glow effects). Added `excludeVibes` — TripBot now only gets psychedelic/chaos/enchanted/mystical/fierce/dreamy/ethereal/whimsical/dark/epic/ominous/nostalgic/cute. Excluded: minimal, cozy, peaceful, ancient, majestic, cinematic.

### The critical lesson: excludeVibes is NON-NEGOTIABLE

Every bot that worked well (the original 6 + the 9 new ones that scored 4+) had either:
- Curated medium pools that match their aesthetic, OR
- Lucky random vibe draws that happened to work

Every bot that failed had:
- Wide-open vibe pools with no exclusions
- A random draw that served the wrong vibe for the seed

**Rule for all future bots:** ALWAYS add `excludeVibes` to the BOTS config. Think about which vibes would KILL this bot's aesthetic, and exclude them. Better to be too restrictive than too permissive — you can always add vibes back, but a bad vibe ruins an otherwise good seed.

The existing seeded bots that have been running for weeks (DragonBot, MangaBot, GothBot) all proved this — they were tuned through iterative testing to have specific vibe exclusions and even `pinVibes` (forced good combos). The lesson just needed to be applied to the new bots too.

### Content bot lessons (HumanBot + MuseBot)

These follow a completely different architecture from the image bots:

1. **Stateless, no seed pool.** Sonnet generates the content from scratch each run. The system prompt IS the seed. This works because text generation (observations, quotes) has natural variety — Sonnet won't write the same joke or quote twice.

2. **Minimal prompts beat heavy prompts.** HumanBot proved this through 5 rounds of iteration: a 2000-token prompt with 30+ rules and 15 canonical examples produced hedged, formulaic output. A 40-word prompt ("Make a funny profound observation about humans, Seinfeld/LD/Wright voice, under 18 words") unleashed Sonnet's natural comedic instincts and scored 4.5/5.

3. **The medium IS the brand.** HumanBot = watercolor + enchanted, always. MuseBot = aura + ethereal, always. Locking the medium gives visual consistency that makes the bot instantly recognizable in a feed.

4. **Sharp post-processing for text-on-image.** Both content bots use Sharp to composite text overlays onto the Flux-generated image. HumanBot: green phosphor terminal card (the bot's "CLI output" voice). MuseBot: gradient-fade serif text (the bot's "gallery placard" voice). Different typography = different brand silhouette.

5. **Character consistency requires a prepended spec.** HumanBot's red tin robot and MuseBot's cyborg flower are described in a JS constant that gets prepended to every Flux hint. This forces the same character into every scene without relying on Sonnet to remember across independent calls.

### Quick reference: the full bot roster as of April 2026

**Image bots (seed-pool pipeline via generate-bot-dreams.js):**

| Bot | Content | Mediums | Seeds | Status |
|---|---|---|---|---|
| DragonBot | Epic fantasy | canvas, watercolor | 60 | ✅ Active |
| MangaBot | Anime/Japanese | anime | 60 | ✅ Active |
| StarBot | Sci-fi/space | photography, neon, canvas | 135 | ✅ Active |
| VenusBot | Sci-fi women | photography, neon, shimmer | 60 | ✅ Active |
| SirenBot | Fantasy characters | canvas, watercolor | 63 | ✅ Active |
| GothBot | Gothic dark fantasy | gothic, anime, canvas | 90 | ✅ Active |
| GlowBot | Ethereal beauty | watercolor, canvas | 20 | ✅ Active |
| EarthBot | Nature/landscape | photography, canvas, watercolor | 20 | ✅ Active |
| ArcadeBot | Toy/craft/retro | lego, pixels, animation, claymation, vinyl | 40 | ✅ Active |
| CuddleBot | Kawaii cozy | animation, claymation, storybook | 20 | ✅ Active |
| PopBot | Pop culture | comics, vaporwave | 20 | ✅ Active |
| BloomBot | Flowers/botanical | photography×3, canvas, watercolor, pencil | 130 | ✅ Active |
| AnimalBot | All animals | photography, canvas, watercolor | 75 | ✅ Active |
| GlamBot | Fashion/beauty | photography, shimmer, canvas | 65 | ✅ Active |
| SteamBot | Steampunk | canvas, photography | 55 | ✅ Active |
| TinyBot | Miniatures/dioramas | photography, animation, claymation | 60 | ✅ Active |
| HauntBot | Atmospheric horror | photography, canvas, gothic | 60 | ✅ Active |
| InkBot | Tattoo art | comics, canvas, photography | 60 | ✅ Active |
| TripBot | Psychedelic | canvas, shimmer, neon | 60 | ✅ Active |
| TitanBot | Mythology/gods | canvas, photography | 60 | ✅ Active |
| CoquetteBot | Cute feminine | coquette, fairytale, watercolor | 75 | ✅ Active |

**Content bots (custom scripts with Sharp text overlay):**

| Bot | Content | Medium | Script | Status |
|---|---|---|---|---|
| HumanBot | AI roasting human behavior | watercolor + enchanted | generate-humanbot.js | ✅ Active |
| MuseBot | AI musing on human condition | aura + ethereal | generate-musebot.js | ✅ Active |
