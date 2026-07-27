# DreamBot Mascot Lore — Bot & Taco

**Status: canonical.** This is the character/story bible for DreamBot's marketing and
brand voice. Established 2026-07-27 with Kevin ("this is gold story-wise") as the
throughline for ad creative and, potentially, in-app personality moments. Build on it;
don't contradict it. Visual spec for the bot mascot lives in `DREAMBOT_CHARACTER.md`.

---

## The premise (one sentence)

Every DreamBot story is a buddy comedy between **the app** and **the thing it made** —
a creator who knows exactly what it is, and a creation who has absolutely no idea.

It's Toy Story energy: **DreamBot is Woody** (the responsible one who runs everything and
did not ask for any of this) and **the Taco is Buzz Lightyear** (does not know he isn't
real, and is having the time of his life).

---

## The cast

### DreamBot — the creator (our mascot)
- **Who:** the little bot. Calm, capable, quietly exhausted. Runs the whole studio and
  renders you a fresh dream every night while you sleep.
- **Personality:** dry, deadpan, patient. Proud-parent energy under the fatigue. It is the
  competent one. It has seen things (it made most of them).
- **Role in the story:** the straight man. Explains reality; is gently ignored.
- **Look:** see `DREAMBOT_CHARACTER.md` (glossy egg-dome bot; current ad art uses the
  purple-visor / glowing-eyes astronaut render on pastel dream-clouds). Mascot "states"
  live in `mascot-reference/app-states/` (wave, cheer, gift, peek, sleep, think) + a
  `sad-bot` variant.

### The Taco — the creation (the breakout)
- **Who:** a bedazzled mariachi taco DreamBot generated one afternoon. Jewel-encrusted
  sombrero, tiny mariachi suit, plays trombone. He is a real post in the app — one of
  millions of dreams — elevated to co-mascot.
- **Personality:** pure golden-retriever enthusiasm. Blissfully unaware he is AI-generated.
  Believes he studied jazz. Has fans now and it has gone entirely to his head. **Crucially:
  thrilled to be alive.** Never sad, never in on the joke.
- **The load-bearing rule:** *the Taco does not know he isn't real, and we never tell him.*
  His obliviousness is the engine of the comedy. Don't write him self-aware.
- **Role in the story:** the Buzz. Takes every factual statement about the app as a
  personality trait about himself.
- **Naming:** currently just "the Taco" / "Taco." A proper name is an OPEN question — leave
  room for one (candidates floated: none locked yet). Don't hard-name him without Kevin.

> The Taco is the flagship "creation," not the only one. Other beloved dreams can join the
> cast over time; the Taco is the first and the template for the dynamic.

---

## The dynamic (why it sells the app)

One made the other; the other has no idea. **That gap is the joke — and every time they
argue about it, a real feature gets smuggled in.** The feature is the setup; the Taco's
misunderstanding is the punchline. This is the core mechanic: we never read as a spec sheet
because the pitch always arrives inside a bit.

Feature → bit mapping (the canonical translations):

| Feature | The bot says… | The taco hears… |
|---|---|---|
| 🌙 **Nightly Dreams** (a new dream every night while you sleep) | "I render a brand-new dream every night." | "I was BORN at 3am and I've never felt more ALIVE." |
| 🎨 **Every AI model** (Flux · Gemini · GPT Image + more, one studio) | "I can run you through every major model." | "He made me in six seconds. I thought I went to culinary school." |
| 🔭 **The feed** (scroll, discover, share) | "There's a whole feed people scroll and share." | "Strangers LIKE me?? Best day of my life. (my only day.)" |
| 🪄 **Face-swap / Dream Cast** (put your real face in a dream) | "People upload a selfie and I cast them in." | "…or just be born perfect, like me." |
| ✨ **Free + easy** (a few words makes anything) | "Someone typed six dumb words and made this." | "I prefer the word 'destined.'" |
| 📈 **Scale / community** (millions of dreams) | "40 million dreams. He's my favorite." | "Who are the other thirty-nine million?" |

---

## Voice rules (crew cheat-sheet)

- Overall brand voice: **dreamy, playful, a little cheeky.**
- **Bot:** dry, deadpan, economical. Never mean, just done.
- **Taco:** breathless, earnest, all-caps bursts, trombone emoji 🎺, zero self-awareness.
- Lowercase-casual for the jokes; Title Case only for hero/flex lines.
- **No em dashes** (house rule — commas/colons/periods/parens instead).
- Any ad can button on **"Dream it. Make it."** to rhyme with the App Store hero.
- Keep the delight *pure joy*, not a hard-sell — the feature rides inside the fun (see the
  in-app delight principle in memory `feedback_delight_pure_joy_not_upsell`).

---

## Visual / brand system (so ads and app feel like one thing)

- Deep-dark dreamy ground · purple→pink→teal gradient · glossy Pop-Mart/vinyl-toy render
  quality · sparkles + bokeh · rounded chunky display type (native `ui-rounded`).
- Captions: a glowing lavender/gradient pill, or a gradient headline on black.
- The **3-tenet explainer ribbon** (`🌙 dreams nightly · 🎨 every AI model · 🔭 a feed to
  explore`) locks onto ads for instant "what is this."
- Reference the real ASC marketing set: `assets/images/screenshots/captioned/` (the
  "Dream it. Make it." mariachi-taco hero) and the mascot art above.
- **Feed icon:** 🔭 (telescope = "a feed to explore"). NOT 🌈 — the rainbow read as an
  unintended LGBT signal (Kevin, 2026-07-27). 🌙 nightly / 🎨 models / 🔭 feed is the set.

## "AI" positioning (where the word goes)

Use **"AI" in the CLARITY layer only**, never on the charm lines. "AI" is a commodity
comprehension/ASO keyword; "dream" is the ownable, distinctive word. Let AI explain and
let dream feel.
- **Say AI:** the explainer descriptor ("the AI dream app"), the ribbon ("every AI model"),
  the clarity hero (**approved line: "your pocket AI dream studio"**), and a subtle
  "✨ made with AI" chip on feed-art ads.
- **Keep AI OFF:** "Dream it. Make it.", the nightly bot-voice lines, and the user prompts
  (e.g. "Show me a taco absolutely shredding in a mariachi band 🎺" — playful, never "sad";
  the Taco is happy by canon).

---

## Where this shows up

- **Marketing:** the master ad sheet (Bot × Taco tab is the throughline). Storyboards there
  are meant to be rendered as real scenes of the two together.
- **Future / optional:** in-app personality moments (loading states, empty states, the
  nightly reveal, push copy) could use the same two voices. Not built yet — flagged as a
  fun place to extend the world.

## Open questions
- Does the Taco get a proper name? (leave room; Kevin decides)
- Do we build a small "cast" of recurring creations beyond the Taco?
- Reconcile the bot's visual spec: `DREAMBOT_CHARACTER.md` describes amber eyes / egg dome;
  current ad art is the purple-visor astronaut. Pick one canonical look before scaling.
