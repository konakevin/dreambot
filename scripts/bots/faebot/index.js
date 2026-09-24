/**
 * FaeBot — the bot-engine contract.
 *
 * Candid magical-forest-creature illustrations — dryads, nymphs, leshy,
 * kodama, fox-spirits, glow-moths. Each render is a hidden-camera glimpse
 * of an exotic mythic creature with stacked plant-merged features (vine-
 * hair, moss-tinted skin, leaf-garments, magical glow). Painterly fantasy
 * concept art. POC currently runs a single path (forest-fairy-scene).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'forest-fairy-scene': require('./paths/forest-fairy-scene'),
  'dryad-portrait': require('./paths/dryad-portrait'),
  'forest-elder': require('./paths/forest-elder'),
  'female-druid': require('./paths/female-druid'),
  'female-druid-adventure': require('./paths/female-druid-adventure'),
  'male-druid': require('./paths/male-druid'),
  'male-druid-adventure': require('./paths/male-druid-adventure'),
  'tiny-fae': require('./paths/tiny-fae'),
  'fairy-swarm': require('./paths/fairy-swarm'),
  'queen-of-the-forest': require('./paths/queen-of-the-forest'),
  'enchanted-vista': require('./paths/enchanted-vista'),
  'fae-cottage': require('./paths/fae-cottage'),
  'fae-village': require('./paths/fae-village'),
  'fae-village-axis': require('./paths/fae-village-axis'),
  'flower-fairy': require('./paths/flower-fairy'),
  'fae-court': require('./paths/fae-court'),
  'elven-city': require('./paths/elven-city'),
  'fae-castle-village': require('./paths/fae-castle-village'),
  'fae-wilds-village': require('./paths/fae-wilds-village'),
  'fae-natural-village': require('./paths/fae-natural-village'),
  'goblin-market': require('./paths/goblin-market'),
  'goblin-market-stall': require('./paths/goblin-market-stall'),
  'goblin-market-lane': require('./paths/goblin-market-lane'),
  'frost-court': require('./paths/frost-court'),
  'spirit-beasts': require('./paths/spirit-beasts'),
  'mushroom-apothecary': require('./paths/mushroom-apothecary'), // 2026-09-22 SHADOW — FaeBot's first interior
  'acorn-boat-regatta': require('./paths/acorn-boat-regatta'), // 2026-09-22 SHADOW — FaeBot's first ACTION path
  'star-charting': require('./paths/star-charting'), // 2026-09-23 SHADOW — FaeBot's first NIGHT-SKY / knowledge path
};

module.exports = {
  username: 'faebot',
  displayName: 'FaeBot',

  // HARDCODED MEDIUM — every render uses bande_dessinee_fantasy. Bot-
  // internal medium key (not in dream_mediums DB). The bot's mediumStyles
  // override provides the full directive to Flux. DLT replay reproduces
  // the look via Phase 2.2c synthesis from recipe.medium_style_override.
  defaultMedium: 'painted_fantasy_novel',

  // flower-fairy uses painted_fantasy_novel (FaeBot's default) so it
  // matches the soft painterly look of the other FaeBot paths
  // (Manchess + Giancola + Bonner painted-fantasy lineage).
  // mediumByPath — ADDED 2026-09-23 for autumn-seed-gathering; flower-fairy and every
  // other path still fall through to defaultMedium, which is what the old comment here
  // described. This path needs its own medium because the bot-wide register is what was
  // beating it: see promptPrefixByMedium below. Worth +1.06 on the round average.
  mediumByPath: {
  },

  // Override the DB flux_fragment for this medium key with the locked
  // painted-fantasy-novel directive (Manchess + Giancola + Bonner + Wyeth
  // + Frazetta painted-fantasy lineage). Visible brush strokes + painted
  // edges + romantic painted atmosphere. NOT ink-outlined, NOT animation.
  mediumStyles: {
    painted_fantasy_novel: blocks.PAINTED_FANTASY_NOVEL_MEDIUM,
    faebot_gpt_clean: blocks.GPT_CLEAN,
    faebot_seedfall: 'autumn seedfall fantasy concept art, painterly',
  },

  // nano-banana clean-render override (2026-06-07; no gpt-image-2 in FaeBot's
  // lineup). Banana reads the painted graphic-novel anchors as "go abstract";
  // the clean medium (+ empty promptPrefixByMedium) lets the seed's fae scene lead.
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},

  // Per-medium prompt prefix overrides for flower-fairy: lead with painterly
  // + fae register so Flux lands on the soft ethereal style FaeBot wants.
  promptPrefixByMedium: {
    // 2026-06-02 cruft-audit micro-strip — dropped trailing `NOT photoreal
    // NOT polished CGI`. The "painted fantasy / oil-brushwork / painted-
    // fantasy lineage" positive anchors hold the register.
    painted_fantasy_novel:
      'soft ethereal painterly fantasy illustration, visible oil-brushwork, painted fantasy concept art, Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage, dreamy atmospheric painted glow',
    faebot_gpt_clean: '',
    // faebot_seedfall — the single highest-value change on this path (avg 2.27 -> 3.33).
    // The bot-wide `painted_fantasy_novel` prefix above is a 35-word REGISTER MANDATE
    // ("soft ethereal painterly ... dreamy atmospheric painted glow") and the engine lands
    // it at 18-25% of the emitted prompt, BETWEEN the path prefix and Sonnet's scene, on
    // 6 of 6 renders. On a path whose premise is a wind rodeo it is the literal opposite
    // instruction, and it won: costume 0/6, pale monochrome 6/6, the beat ~1/6, even though
    // every one of the path's own laws was present AND correctly placed at 1-11%.
    // Swapping it for a path-own register of the SAME LENGTH (35 -> 33 words, lineage
    // anchors kept verbatim) took costume 0/6 -> 4/6, saturated palette 0/6 -> 6/6 and
    // near-nudity 2/6 -> 0/6. Rollback = delete this entry plus the mediumByPath and
    // mediumStyles entries, which returns the path to its round-1 state.
    faebot_seedfall:
      'painted fantasy concept art, visible oil-brushwork, Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage, saturated autumn colour, hard directional light, everything in the frame moving on a strong wind',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  // Per-path prefix (engine prepends before other layers). fairy-swarm needs a
  // PLURAL subject anchor as the FIRST tokens CLIP reads — the ToyBot
  // multi-figure lesson: a singular opener collapses the crowd to one hero.
  // Structural anchor only, no style/content language.
  promptPrefixByPath: {
    // star-charting: front-loads the ADULT clothed winged fae. This is what beat the
    // putto trap that cost acorn-boat-regatta 5 of 6 renders ("tiny/palm-sized" on a
    // humanoid is a naked-cherub prior). Do not demote it to buy room for anything
    // else — a measured round that did exactly that lost wings in 4 of 6 and the
    // costume in 3 of 6.
    // honey-harvest: the first EIGHT WORDS are the path. With a static portrait
    // opener the beat rendered 0 of 12 across two rounds while sitting in 12 of 12
    // prompts; putting "hard at work, caught mid-movement" IN FRONT of the figure
    // clause — additively, nothing removed — took it to 6 of 6. Do not demote the
    // fae clause (lesson 34) and do not tidy out the action.
    // autumn-seed-gathering: inherits honey-harvest's measured opener verbatim (the action
    // clause IN FRONT of the figure clause). The stalk-fills-one-side clause is the
    // anti-vista law, and "two hundred white seed tufts" carries the count from the prefix
    // on 6 of 6 renders, which is why the output order's own air item is the named lever.
    'star-charting':
      'one slender grown fae close in the foreground, painted large, in a layered fae-craft coat and hood with open wings, on a high woodland perch whose broad surface fills the near frame, beneath a blazing saturated night sky of indigo, violet and green',
    // acorn-boat-regatta: a path staged on a LINEAR feature (a stream) renders as a receding
    // corridor with the boats tiled to the vanishing point, and rewriting all 8 vantages to look
    // ACROSS the water did not fix it (6 of 6 still corridors). What breaks it is naming the
    // SURFACE as filling the frame with its far edge as a BAND along one border — the ToyBot
    // concrete-but-cropped form applied to the setting rather than to an object. Playbook 17.
    // acorn-boat-regatta REDESIGNED 2026-09-23 on Kevin's direction: the old prefix
    // caused all three of his complaints at once. It opened on a SURFACE rather than a
    // subject, said "a crowd of tiny fae" (the naked-putto token, which cost this path
    // 5 of 6 renders), and named no clothing or wings — while both of this bot's
    // successful paths lead with "one slender GROWN fae … coat and hood with OPEN WINGS".
    // The cast is now MIXED SPECIES, which is the variety engine and kills the putto
    // prior as a side effect: a dormouse in a walnut shell cannot render as a cherub, and
    // Flux cannot stamp one centroid across five hulls when every hull is a different
    // animal. One hero boat large in the foreground replaces "five abreast".
    'acorn-boat-regatta':
      // R2: the species are NAMED here, in position 1. R1 proved the generic form fails:
      // the brief itself named a hedgehog at the bow, a harnessed dragonfly, a mouse, a frog,
      // a beetle and a wren, plus a cobalt hazelnut shell and an acorn cap — and Flux rendered
      // five identical painted canoes crewed by identical winged humanoids, because every one
      // of those nouns landed at 40-65% of the emitted prompt. Generic "small forest creatures"
      // at position 1 is not an anchor; "a mouse, a frog, a hedgehog" is. Paid for by trimming
      // the tail rather than growing the prefix (lesson 34).
      // R3 (Kevin): the crews must be fae AND critters SHARING a boat. R2 rendered
      // all-animal crews at 4.50 avg but no fae, because R2's prefix listed the animals
      // first and put "winged grown fae" next to them — so Flux fused the attribute onto
      // the animals (winged mice, a winged frog) instead of adding a second body. Position 1
      // sets ATTRIBUTES, not RELATIONSHIPS. So the fae is now its own body with its own
      // clothing and its own job, the creatures have theirs, and "wings" is bound to "her
      // own … at her back" rather than sitting adjacent to an animal noun.
      // R2 RESTORE POINT (4.50 avg, min 4.3, critters 6/6 but zero fae):
      //   'a woodland boat race where a mouse, a frog, a hedgehog, a wren and a beetle each
      //    crew their own little boat alongside fully-dressed winged grown fae, every hull a
      //    found natural thing — an acorn cap, a walnut shell, a curl of birch bark — the
      //    nearest boat large and close in the foreground caught mid-race with spray off its
      //    bow, the others smaller behind it, on a beautiful open stretch of woodland water'
      'a woodland boat race where one slender grown fae in a leaf-cloth tunic rows the nearest boat, a mouse and a frog riding in the hull beside her, her own wings folded at her back, more boats further behind each with its own fae and creatures aboard, every hull a found natural thing like an acorn cap or a walnut shell, on a beautiful open stretch of woodland water',
    'mushroom-apothecary':
      'inside a tiny crowded fae apothecary, warm lamplight against jewel-coloured glowing glass',
    'fairy-swarm':
      'a lively gathering of many tiny palm-sized fairies together in one scene, a fairy crowd mid-story',
    'goblin-market':
      'a bustling fae night-market crowded with many tiny palm-sized fae merchants and shoppers, a market crowd mid-moment',
    'goblin-market-stall':
      'a close intimate view of one fae night-market stall, a small knot of tiny palm-sized winged fae gathered at the counter mid-exchange',
    'goblin-market-lane':
      'a crisp foreground of tiny palm-sized winged fae at a night-market stall with the grand fae bazaar glowing soft and hazy behind them',
  },
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Vibes that fit the peaceful-fairy mood. These translate to vibeDirective
  // (from dream_vibes DB) which Sonnet uses for mood context.
  vibes: ['peaceful', 'enchanted', 'ethereal', 'nostalgic', 'whimsical'],

  paths: [
    'forest-fairy-scene',
    'dryad-portrait',
    'forest-elder',
    'female-druid',
    'female-druid-adventure',
    'male-druid',
    'male-druid-adventure',
    'tiny-fae',
    // fairy-swarm — large fairy gatherings (2026-07-04).
    'fairy-swarm',
    'queen-of-the-forest',
    'enchanted-vista',
    // fae-cottage deactivated 2026-07-01 (Kevin) — built + converged over 5 test rounds but held
    // back from rotation for now; pools still MVP-25. Uncomment + scale pools to activate.
    // 'fae-cottage',
    'fae-village',
    'fae-village-axis',
    'flower-fairy',
    'fae-court',
    'elven-city',
    'fae-castle-village',
    'fae-wilds-village',
    'fae-natural-village',
    // Stage F — promoted to live rotation 2026-08-16 (scaled to production;
    // faithful xerox — chaos disabled bot-wide, polish already off for these,
    // goblin-market prompt-prefixes preserved).
    'goblin-market',
    'goblin-market-stall',
    'goblin-market-lane',
    'frost-court',
    'spirit-beasts',
    // Promoted to live rotation 2026-09-24 on Kevin's word after the reseed program grew each
    // path's subject pool 25 → 100+ (RESEED_STATUS.md Track B rows 10-12). Last two days of
    // shadow renders: mushroom-apothecary 45/45, acorn-boat-regatta 38/38, star-charting 47/47
    // on the flux-1.1 family. Faithful xerox except star-charting's model pin (see modelByPath).
    'mushroom-apothecary',
    'acorn-boat-regatta',
    'star-charting',
  ],
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // DARK-LAUNCH (BOT_DARK_LAUNCH_PLAN.md, migration 376). Paths here are NOT
  // in the live `paths[]` rotation — the dispatcher never auto-posts them. They
  // render ONLY via explicit `iter-bot --mode <path> --post`, and postAsBot
  // flips is_public=false/is_posted=false/shadow=true so they stay hidden from
  // every public surface. QA in isolation, grade the shadow renders, then
  // promote them into history via scripts/promote-shadow-path.js and move the
  // string into `paths[]`.
  // mushroom-apothecary, acorn-boat-regatta and star-charting left here for paths[] on 2026-09-24.
  shadowPaths: [], // Stage F paths promoted to live rotation 2026-08-16

  // Picker on with the BOT_MODEL_TALLY 6-model lineup (2026-05-30):
  // Banana + GPT-2 + Flux 2 Pro + Flux 1.1 Pro + Flux 1.1 Pro Ultra + Flux 2 Max.
  // Dropped per Kevin's review: Flux Dev, Flux 2 Flex.
  useModelPicker: true,
  // Trimmed to 3 (Kevin 2026-06-02): Banana + F1.1 Pro + F1.1 Pro Ultra.
  // History: flux-2-pro removed 2026-06-01; gpt-image-2 + flux-2-max removed today.
  // Nano Banana banned fleet-wide 2026-06-21 (Kevin) — bots are FLUX-ONLY.
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
  // modelByPath: stripped 2026-05-30 to let allowedModels picker drive selection — with ONE
  // exception below, added 2026-09-22.
  // promptSuffixByPath — NEW KEY on this bot. Replaces the bot-wide suffix for one
  // path only, to carry a committed night palette instead of the default register.
  promptSuffixByPath: {
    'star-charting':
      'painted fantasy concept art, soft brushwork, atmospheric night illustration, luminous saturated night colour, deep indigo and violet sky with one warm lamplight against it, Brian Froud + Mononoke painted-fantasy lineage',
  },

  modelByPath: {
    // mushroom-apothecary: the picker rolled flux-1.1-pro-ultra on 15 of 15 renders and ultra
    // signed 3 of them with a painted signature artifact in the corner. A signature is readable
    // text, which is a hard fail on the QA rubric. flux-1.1-pro does not sign, so this splits the
    // roll rather than excluding ultra (its painted register is otherwise the best of the two here).
    'mushroom-apothecary': {
      'black-forest-labs/flux-1.1-pro': 1,
      'black-forest-labs/flux-1.1-pro-ultra': 1,
    },
    // acorn-boat-regatta: pro ONLY. Ultra was measured out in round 0 for signing 1 of its 3
    // renders — a signature is readable text, a hard fail on the rubric.
    'acorn-boat-regatta': {
      'black-forest-labs/flux-1.1-pro': 1,
    },
    // star-charting: flux-1.1-pro ONLY (rolled back from flux-2-pro 2026-09-24, Kevin's call).
    // The flux-2-pro pin (2026-09-23) rendered the reading instrument 3 of 3 where flux-1.1-pro
    // rendered it 0 of 22, but it is unshippable: flux-2's checker returned E005 on 23 of 29
    // pipeline attempts, and a clause-bisection on 2026-09-24 found the trigger is the
    // MEDIUM's named-artist clause ("Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud
    // painted-fantasy lineage") — that clause alone flags 3/3 on flux-2-pro and the full prompt
    // without it flags 0/3; the same prompts pass flux-1.1-pro 13/13 and ultra 13/13 (replay of
    // the exact flagged text). The flux-1.1-pro renders are the batch Kevin graded as very good
    // (23/23 + 47/47 since, zero flags). The instrument is a nice-to-have he did not miss.
    // Do NOT re-pin to a flux-2 model while the medium names artists.
    'star-charting': ['black-forest-labs/flux-1.1-pro'],
    // honey-harvest: flux-1.1-pro ONLY — 12 of 12 delivered, zero signatures.
    // MEASURED so nobody re-runs it: flux-2-pro renders the premise BETTER (beat
    // 2/4, cups 4/4) and is unshippable — it signed 4 of 4 and took 20 safety
    // retries for 4 deliveries. flux-2-FLEX hits the SAME E005 wall on the same
    // content, so this is a flux-2 FAMILY fact, not a flux-2-pro one: there is no
    // shippable flux-2 option for a FaeBot path with a close adult-fae body.
    // autumn-seed-gathering: flux-1.1-pro ONLY — 18 of 18 delivered, zero E005, zero
    // signatures. Load-bearing for TWO reasons. (1) FaeBot's picker rolled ultra on 15 of
    // 15 mushroom-apothecary renders and ultra signs its work, so an unpinned pick puts
    // readable text on the path. (2) This path uses a code-only medium key with no
    // `dream_mediums` row, and modelByPath is checked BEFORE pickModel (botEngine ~1723),
    // so the pin keeps the picker out of it entirely. NOTE, corrected from the build
    // report: an absent row does NOT break the picker — `mediumModelsCache.get()` returns
    // undefined and it falls THROUGH to a default pool. The risk is an unpinned roll
    // (i.e. ultra), not an exception.
  },
  // modelByPath: stripped 2026-05-30 to let allowedModels picker drive selection.
  // Original locks (restore individual lines if a path needs pinning again):
  // modelByPath: {
  // 'forest-fairy-scene': 'black-forest-labs/flux-1.1-pro',
  // 'dryad-portrait': 'black-forest-labs/flux-1.1-pro',
  // 'tiny-fae': 'black-forest-labs/flux-1.1-pro',
  // 'queen-of-the-forest': 'black-forest-labs/flux-1.1-pro',
  // 'enchanted-vista': 'black-forest-labs/flux-1.1-pro',
  // 'fae-village': 'black-forest-labs/flux-1.1-pro',
  // 'fae-village-axis': 'black-forest-labs/flux-1.1-pro',
  // 'flower-fairy': 'black-forest-labs/flux-1.1-pro',
  // },

  // Disable chaos + sensory anchors for POC — keep the prompt clean and
  // the look consistent. We can layer those in later if we want texture.
  chaos: { enabled: false, allowSubjectChaosPaths: [] },
  sensoryAnchors: { enabled: false },

  // 2026-06-06 — post-render Haiku-vision nudity check for character paths.
  // Flux occasionally renders fae / dryad / nymph character paths with bare
  // chests despite covered-outfit prompts. On flag, the whole render re-rolls
  // (fresh picker + fresh brief). enchanted-vista skipped — pure landscape.
  // See scripts/lib/nudityCheck.js for the classifier.
  nudityCheck: {
    enabled: true,
    maxRetries: 2,
    paths: [
      'mushroom-apothecary',
      'acorn-boat-regatta',
      'star-charting',
      'dryad-portrait',
      'forest-elder',
      'female-druid',
      'female-druid-adventure',
      'male-druid',
      'male-druid-adventure',
      'flower-fairy',
      'forest-fairy-scene',
      'queen-of-the-forest',
      'tiny-fae',
      'fairy-swarm',
      'fae-court',
      'goblin-market',
      'goblin-market-stall',
      'goblin-market-lane',
      'frost-court',
      'spirit-beasts',
    ],
  },

  // Two-pass Sonnet → Haiku polish. Sonnet writes a vivid concept,
  // Haiku polishes to ~70 words for clean Flux input.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // Axis-system paths skip polish — Haiku compression strips
    // load-bearing axis language. tiny-fae: dwarfing-companion mandate.
    // queen-of-the-forest: posed-setting + critters-paying-respects mandates.
    // enchanted-vista: multi-layer richness (canopy + hero + floor + water + magic + depth).
    // fae-village + fae-village-axis: both skip polish — Kevin's legacy comparison
    // batches were polish-skipped, that's the look he approved for both paths.
    // forest-elder: skip polish — the male GENDER-LOCK (he/his/bearded) is the
    // load-bearing element; Haiku compression strips it and androgyny returns.
    skipPaths: [
      'mushroom-apothecary',
      'acorn-boat-regatta',
      'star-charting',
      'forest-elder',
      'female-druid',
      'female-druid-adventure',
      'male-druid',
      'male-druid-adventure',
      'tiny-fae',
      // fairy-swarm: the crowd-composition mandate is load-bearing; polish strips it.
      'fairy-swarm',
      'queen-of-the-forest',
      'enchanted-vista',
      'fae-cottage',
      'fae-village',
      'fae-village-axis',
      'fae-court',
      'elven-city',
      'fae-castle-village',
      'fae-wilds-village',
      'fae-natural-village',
      // goblin-market: the crowd-composition mandate is load-bearing; polish strips it.
      'goblin-market',
      // goblin-market-stall: the intimate close-crowd composition is load-bearing.
      'goblin-market-stall',
      // goblin-market-lane: the hybrid foreground+hazy-depth composition is load-bearing.
      'goblin-market-lane',
      // frost-court: the alive/warm + covered + anti-Elsa mandates are load-bearing.
      'frost-court',
      // spirit-beasts: the kodama law (real animal anatomy, one magic element) is load-bearing.
      'spirit-beasts',
    ],
  },

  // Bot-level pool defaults for declarative composer (flower-fairy path)
  defaultPools: {},
  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`FaeBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey }) {
    return {
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.peaceful,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`FaeBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy function-form paths export a function. Dispatch on shape.
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`FaeBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] FaeBot`;
  },
};
