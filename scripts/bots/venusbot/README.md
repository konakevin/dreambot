# VenusBot

Cyborg-assassin woman — half human, half machine. Honeytrap predator.
Exotic, exquisite, cold. Dangerous in a way that makes you uneasy.

## Render paths (6)

| Path | What it is |
|---|---|
| `closeup` | Waist-up bust portrait, face fills upper third. Closeup expression + pose carry the image. |
| `full-body` | Full-body scene mid-charged-moment. Film-noir assassin plotting/conspiring/seducing/killing. |
| `seduction` | Cyberpunk lure moment — bar, nightclub, alley, vending machine corner. She's drawing you in. |
| `cyborg-fashion` | Avant-garde editorial fashion spread — McQueen / Galliano / Schiaparelli / Nick Knight energy. Extreme makeup + couture. |
| `stare` | Direct eye contact. Viewer feels LOOKED AT. Intent of her stare varies wildly (seductive / menacing / hungry / vacant / assessing). |
| `robot` | 90% machine, 10% human sliver. Terminator-style hunter. Rolls a sub-flavor (closeup / full-body / seduction / cyborg-fashion / stare) and renders it as almost-fully-robotic. |

## Axes rolled per render

Shared (all paths):
- skin — 22 tones across human ethnicities + alien species (recency window 7)
- body — 12 silhouettes (recency window 6)
- glow — 10 dominant-glow colors (recency window 3)
- character — 20 Sonnet-authored character base paragraphs (recency window 5)
- hair / eyes / internal-exposure / wildcard / scene-palette / color-palette

Path-specific (rolled inside buildBrief):
- closeup: pose / expression / cyborg-feature / energy-effects / accent / environment
- full-body: action-pose / moment / cyborg-feature / energy-effects
- seduction: seduction-moment / cyborg-feature / energy-effects
- cyborg-fashion: fashion-moment / makeup (Sonnet-authored)
- stare: stare-moment (Sonnet-authored)
- robot: human-touch-variant + any of the above sub-flavors

## Seeds (Sonnet-authored)

| File | What | Generator |
|---|---|---|
| `seeds/characters.json` | 20 character base paragraphs — identity anchors per render | `scripts/gen-seeds/venusbot/gen-characters.js` |
| `seeds/makeups.json` | 25 extreme editorial makeups (cyborg-fashion + robot paths) | `scripts/gen-seeds/venusbot/gen-makeups.js` |
| `seeds/cyborg_fashion_moments.json` | 30 avant-garde editorial scenes | `scripts/gen-seeds/venusbot/gen-cyborg-fashion-moments.js` |
| `seeds/stare_moments.json` | 30 direct-eye-contact scenes | `scripts/gen-seeds/venusbot/gen-stare-moments.js` |

Regenerate a seed pool:
```bash
node scripts/gen-seeds/venusbot/gen-<name>.js
```

## Medium

Hardcoded to `surreal` — a bot-only medium that never appears in `dream_mediums`,
so users can't select it. The style + directive live entirely in this bot module
(via `promptPrefix` + `promptSuffix` + path briefs), not in any DB table.

## Running

Dev batch (no posting):
```bash
node scripts/iter-bot.js --bot venusbot --count 10 --mode random --label phase1-smoke
```

Dev batch with posting to DB:
```bash
node scripts/iter-bot.js --bot venusbot --count 5 --mode mixed --post --label ship1
```

Single production post (what cron calls):
```bash
node scripts/run-bot.js --bot venusbot
```

## Cron

`.github/workflows/venusbot.yml` — 2x daily, 10:30 + 22:30 UTC. Random 0-4hr jitter.
