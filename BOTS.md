# Bot Content Generation System

## How It Works

Each bot account has a pool of **seed prompts** stored in the `dream_templates` table (category prefix: `{username}_`). The bot script (`scripts/generate-bot-dreams.js`) picks a random seed, pairs it with a random medium + vibe from the bot's config, and sends it as a `hint` through the **V2 text path** of the `generate-dream` Edge Function — the same pipeline a real user uses when they type a prompt on the Create screen.

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

This is the repeatable process we developed through Solaris and Yūki. Follow it for every bot.

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

### Step 3: Test Mediums

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

### Step 4: Test Vibes (the most important step)

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

### Step 5: Generate 60 Deduped Seeds

Use the iterative passback technique to generate 20 seeds per strategy:

1. **GENRE (20):** Ask Sonnet for a scene from the genre prompt. Extract 1-word subject. Ban it. Repeat.
2. **GENRE+DEDUP (20):** Continue the ban list from strategy 1 (now 20 banned subjects). Generates deeper variety.
3. **LANDSCAPE (20):** Separate ban list. Same technique with the landscape prompt.

Store in `dream_templates` with categories: `{username}_genre`, `{username}_genre_dedup`, `{username}_landscape`.

### Step 6: Test the Full Pipeline

Run 10 posts through the bot script using the stored seeds. Verify:
- Seeds are being pulled from DB correctly
- Medium + vibe weighting is hitting the right combos
- Quality is consistent
- Variety is good across the 10

### Step 7: Iterate on Feedback

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

**Genre prompt:** "an extremely interesting and visually appealing scene from the universes of: studio ghibli, makoto shinkai, demon slayer, spirited away, your name, akira, evangelion, princess mononoke, howls moving castle, jujutsu kaisen — include characters, creatures, or architecture as the scene calls for"
**Landscape prompt:** "a beautiful Japanese anime world that is visually stunning, warm and inviting, interesting to explore"
**Cute prompt:** "an adorable and heartwarming anime scene from the universes of: my neighbor totoro, ponyo, kiki delivery service, sailor moon, cardcaptor sakura, fruits basket — cute characters, big expressive eyes, warm and cozy"

**Vibe weighting (GOD TIER → regular, from testing):**
- **anime:** enchanted ████, cinematic ████, majestic ███, dreamy ███, whimsical ███, mystical ██, dark ██, cozy ██, epic ██
- **ghibli:** enchanted █████ (GOD TIER), whimsical ██, majestic ██, epic ██, mystical ██
- **anime_illustration:** dreamy █████ (GOD TIER), whimsical ████, enchanted ██, majestic █, epic █, cinematic █
- **cute strategy vibes:** cozy ███, dreamy ███, whimsical ██, enchanted █, peaceful █

**Key findings from Yūki testing:**
- **SDXL renders anime/ghibli WAY better than Flux Dev** — true cel-shaded look vs semi-realistic
- **Ghibli + enchanted is the #1 combo** — Spirited Away quality every time
- **Anime illustration + dreamy is GOD TIER** — produces the Princess Mononoke lush adventure look
- **Cyberpunk medium killed** — consistently ugly for anime aesthetic, don't bring back
- **anime_illustration medium created** for dense Ghibli-adventure-film look (50/50 SDXL/Flux, both good)
- **"Include characters, creatures, or architecture as the scene calls for"** in genre prompt prevents all-landscape monotony
- **Don't list specific things in landscape prompt** ("cottages, villages") — Sonnet latches onto whatever you list
- **Cute strategy needs its own vibe pool** — cozy/whimsical/dreamy, NOT the action vibes
- **Per-medium vibe pinning is critical** — same vibe produces wildly different quality across mediums
- **4 strategies instead of 3** — some bots need a character-driven path alongside genre/dedup/landscape

### Remaining Bots (not started)

| Username | Persona | Mediums | Seed Status |
|---|---|---|---|
| void.architect | Surreal sci-fi | surreal, 3d_render | ❌ needs testing |
| aurelia | Ethereal beauty | watercolor, oil_painting, ghibli | ❌ needs testing |
| terra | Awe-inspiring nature | photorealistic, oil_painting, surreal | ❌ needs testing |
| prism | Stylized mediums | 19 mediums | ❌ needs testing |
| cinder | Gothic dark fantasy | tim_burton, fantasy, steampunk, anime | ❌ needs testing |
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

## Scripts

- `scripts/generate-bot-dreams.js` — reads seed prompts from DB, signs in as bot, calls Edge Function V2 path, flips draft to public
- `scripts/create-bot-accounts.js` — creates auth users + public.users + vibe profiles for all 10 bots

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
