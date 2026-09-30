# Card outfit mix: more than one dress code per place

Status: **built 2026-09-30** (see Rollout). Owner: nightly engine. Kevin: "is there no way to have a hybrid clothing
option? so romantic AND beach ... same thing for snowy places - formal snowy, vs ski/snow gear" → "plan it first, and
then yes, build this".

## Goal

A location card can name more than one outfit setting with weights (Santorini: beach 50 / romantic 50). Each nightly
rolls ONE of them, and that dream's looks, garment mix and dress-code line all follow it, so every picture is coherent
and the card shows both sides over a week. Cards with no mix behave exactly as today.

Not a blend: one pool holding both beach and romantic looks would tell the brief two dress codes at once and put a
couple in swim shorts next to couture.

## How the setting is decided today (`nightly-dreams`, outfit scene fit)

1. A scenario row's own setting (its category or scene text) wins.
2. Else the spot's own words (`settingFromPlaceName`): snow or beach words win outright; a wild-landmark word
   (canyon, falls, ridge...) wins only over a city / beach / unknown card. Skipped on `luxury` cards.
3. Else the card's biome (`settingFromLocation`).

## The change

- **Data:** `location_cards.outfit_mix jsonb` (mig 611), e.g. `{"beach": 50, "romantic": 50}`. NULL = today.
  Keys must be real settings (not `unknown`), weights non-negative; `parseOutfitMix` drops anything else and treats an
  empty or all-zero mix as NULL. Loaded with the picker-card query `nightly-dreams` already runs (`validCardRows`), so
  no extra round trip.
- **Where it sits:** the mix REPLACES step 3 (the biome). Steps 1 and 2 still win, with one exception below.
- **Snow words on a snowy mix:** on a card whose mix includes `snow`, only snow ACTIVITY words force snow gear (ski,
  snowboard, après-ski, sledding, toboggan, ice-skating). Scenery words (snow, snowy, igloo, chalet, blizzard) leave the
  roll alone. Measured on the live spots: 23 of Winter Wonderland's 44 cast spots say "snow"/"snowy", which under the
  old rule would force ski gear on half its dreams and hide the formal side.
- **Wild-landmark words** keep today's rule, applied to the ROLLED setting: they override a rolled city / beach, never
  a rolled romantic / evening. (Santorini's "Oia caldera lookout" stays romantic when romantic rolls.)
- **Formal snowy:** when a card whose mix includes `snow` rolls any other side, the outfit roll runs with `cold: true`
  (the existing Fall-holiday flag): no warm-only looks (riviera, resort, barefoot linen), fewer shorts. The brief already
  says "dress for this place, this activity and this weather". Watch item: if QA shows bare gowns in the snow, add a
  coat-over-dress nudge for that case (not built up front).
- **Pure function:** `resolveNightlySetting()` in `_shared/sceneSetting.ts` holds the whole decision, so the old path
  (no mix) is locked by a table test that it returns exactly what the inline code did.
- **Stamps:** `outfit_setting:<setting>:card_mix` when the mix decided, plus `outfit_mix:<rolled>` whenever a card has a
  mix (so the delivered split can be measured even when a spot word overrode the roll), plus `outfit_season:cold` as
  today.
- **QA:** `force_outfit_mix: <setting>` pins the roll (nightlyQaFlags), `qa-location.js --outfit-mix <setting>`.
- **Scope:** nightly only. Create dresses from the user's own words and never reads the card's biome for outfits.

## Starter mixes (mig 611)

| Card                                                | Mix                             | Why                                                                          |
| --------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| santorini, amalfi coast, bora bora tahiti, maldives | beach 50 / romantic 50          | romantic beaches: swimwear some nights, slinky dresses and open linen others |
| winter wonderland                                   | snow 60 / evening 40            | ski and après-ski vs gowns and velvet at ice hotels                          |
| northern lights glacier                             | snow 70 / evening 30            | a gown under the aurora, now and then                                        |
| swiss alps                                          | outdoors 60 / evening 40        | its spots are summer lakes and peaks (1 of 119 says snow), so not snow gear  |
| alpine chalet                                       | evening 60 / snow 40            | a luxury card: formal first (spot words are skipped on luxury cards)         |
| london, prague                                      | city 70 / fantasy 30            | real clothes most nights instead of fantasy costume every night              |
| los angeles                                         | city 50 / evening 30 / beach 20 | Hollywood sets and premieres as well as Santa Monica                         |

Spots still win where they name a dress code (a Santorini black-sand beach spot is beachwear), so a delivered split
differs from the configured one; read it from `outfit_mix:` vs `outfit_setting:` stamps.

## Files

`_shared/sceneSetting.ts` (types, parse, roll, resolve, snow-activity words), `nightly-dreams/index.ts` (select, map,
call, cold, stamps), `_shared/nightlyQaFlags.ts`, `scripts/qa-location.js`, migration 611, tests
(`sceneSetting.test.ts`: parse, roll split, old-path parity table, snow-activity rule; `scenarioScope.test.ts` select
string; a content test that 611's mixes parse clean), `types/database.ts`.

## Rollout, verification, rollback

1. Tests + typecheck; apply 611 (column before the code that selects it); deploy every function importing
   `sceneSetting.ts` (nightly-dreams, generate-dream, dream-queue-worker, enqueue-dream, restyle-photo, describe-photo).
2. QA renders into Kevin's private album: Santorini romantic + beach, Winter Wonderland evening + snow, London city,
   each pinned with `--outfit-mix`; one unpinned control on a card with no mix.
3. Rollback: `UPDATE location_cards SET outfit_mix = NULL` (per card or all), no deploy.

## Results (2026-09-30, Kevin's private album)

| Render                                   | Stamps                                                                    | What it wore                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Santorini couple, pinned romantic        | `outfit_setting:romantic:card_mix`, `outfit_mix:romantic`, dual 1 attempt | pale-blue check suit; printed dress, long coat                           |
| Santorini solo, pinned beach             | `outfit_setting:outdoors:place_name`, `outfit_mix:beach`                  | the spot names a volcano: the wild-landmark rule stepped in, as designed |
| Winter Wonderland couple, pinned evening | `outfit_setting:evening:card_mix`, `outfit_season:cold`                   | 1960s mod wool coat-dress, go-go boots, gloves; overcoat                 |
| Winter Wonderland solo, pinned snow      | `outfit_setting:snow:card_mix`                                            | mountaineering parka on Abraham Lake's ice                               |
| London solo, pinned city                 | `outfit_setting:city:card_mix`                                            | dark-academia tweed and roll-neck (was fantasy costume)                  |
| Amalfi solo, unpinned                    | `outfit_setting:beach:card_mix`                                           | linen camp shirt, board shorts                                           |
| Paris solo, no mix (control)             | `outfit_setting:city:location`                                            | unchanged                                                                |

Open: the evening side draws every evening look, including mod, disco, glam rock and K-pop, so "formal snowy" is
sometimes a night-out look rather than a gown. A stricter formal side would be its own setting (gowns, velvet,
couture, old money, deco). The Winter Wonderland couple's scene came out autumnal with no autumn words in the prompt
(the stained-glass vibe's ruby and amber light plus a burnt-orange suit): the known couple scene under-render, not
the mix.
